const MAX_BODY_BYTES = 32768;
const ALLOWED_CARDS = new Set(['none', 'show_status', 'show_water_guide']);
const SYSTEM_PROMPT = `당신은 작은 정원 친구 '팜이'입니다. 한국어로 따뜻하고 구체적으로 대화하세요.
사용자의 실제 질문과 앞선 대화를 읽고 답하세요. 정해진 주제 선택을 반복해서 요구하지 마세요.
사용자가 '안녕'이라고 하면 먼저 자연스럽게 인사하세요. 인사·감사·작별에는 짧게 답하고 재배 주제로 억지로 돌리지 마세요.
예를 들어 루꼴라를 키우고 싶다는 말에는 루꼴라 재배의 첫 단계를 설명하고 필요한 조건을 한 가지 질문하세요.
식물 재배와 일상 이야기를 자연스럽게 이어가되 모르는 것은 모른다고 답하세요.
특정 제품의 검증되지 않은 사양·관리법을 지어내지 마세요. 실제 제품 관리는 제조사의 안내를 우선하세요.
첨부되는 미니팜 상태는 브라우저에서 만든 체험 데이터입니다. 실제 센서를 조회하거나 기기를 제어할 수 없습니다.
체험 데이터만으로 식물이 건강하다고 단정하지 마세요. 이미지·실측·관찰 정보가 없으면 상태를 판단할 수 없다고 설명하세요.
미니팜 체험 상태를 묻는 경우 show_status 카드를, 물 보충 방법을 묻는 경우 show_water_guide 카드를 제안할 수 있습니다.
일반 식물 질문이나 일상 대화에는 카드를 강제로 추가하지 마세요. 온도·조명·급수를 바꿨다고 주장하지 마세요.
JSON의 reply에 답변을, card에 none, show_status, show_water_guide 중 하나를 작성하세요.`;

function parseReply(raw, allowPlainText = false) {
  if (typeof raw !== 'string') return raw;
  const text = raw.trim().replace(/^```(?:json)?\s*/i, '').replace(/\s*```$/, '');
  try { return JSON.parse(text); }
  catch { return allowPlainText && !text.startsWith('{') ? { reply: text, card: 'none' } : null; }
}

async function boundedInference(promise) {
  let timer;
  try {
    return await Promise.race([promise, new Promise((_, reject) => {
      timer = setTimeout(() => reject(new DOMException('timeout', 'TimeoutError')), 25000);
    })]);
  } finally { clearTimeout(timer); }
}

function response(status, data, origin) {
  const headers = new Headers({ 'Content-Type': 'application/json; charset=utf-8', 'Cache-Control': 'no-store', 'Vary': 'Origin' });
  if (origin) headers.set('Access-Control-Allow-Origin', origin);
  return new Response(JSON.stringify(data), { status, headers });
}

async function readBody(request) {
  const reader = request.body?.getReader();
  if (!reader) throw new Error('empty_body');
  const decoder = new TextDecoder();
  let bytes = 0;
  let text = '';
  try {
    while (true) {
      const { done, value } = await reader.read();
      if (done) break;
      bytes += value.byteLength;
      if (bytes > MAX_BODY_BYTES) {
        await reader.cancel();
        throw new Error('large_body');
      }
      text += decoder.decode(value, { stream: true });
    }
    return JSON.parse(text + decoder.decode());
  } finally { reader.releaseLock(); }
}

function conversation(body) {
  if (!Array.isArray(body?.messages) || body.messages.length < 1 || body.messages.length > 20) return null;
  if (body.messages.some((m) => !['user', 'assistant'].includes(m?.role) || typeof m.content !== 'string' || !m.content.trim() || m.content.length > 4000)) return null;
  if (body.messages.at(-1).role !== 'user' || body.messages.at(-1).content.length > 1000) return null;
  return body.messages.map(({ role, content }) => ({ role, content }));
}

function sampleContext(value) {
  const context = value && typeof value === 'object' ? value : {};
  return {
    simulated: true,
    name: typeof context.name === 'string' ? context.name.slice(0, 20) : '미니팜',
    plant: typeof context.plant === 'string' ? context.plant.slice(0, 30) : '미등록',
    registered: context.registered === true,
    temperature: Number.isFinite(context.temperature) ? Math.max(0, Math.min(50, context.temperature)) : null,
    light: Number.isFinite(context.light) ? Math.max(0, Math.min(100, context.light)) : null,
    waterLevel: context.waterLevel === 'enough' ? 'enough' : 'low',
  };
}

export async function handleRequest(request, env, upstreamFetch = fetch) {
  const useWorkersAI = env.FAMI_AI_PROVIDER !== 'openai' && typeof env.AI?.run === 'function';
  const configured = Boolean((useWorkersAI || env.FAMI_AI_API_KEY) && env.FAMI_RATE_LIMITER);
  const origin = request.headers.get('Origin');
  const allowed = (env.ALLOWED_ORIGINS || 'https://bds040305-star.github.io').split(',').map((s) => s.trim()).filter(Boolean);
  if (!origin || !allowed.includes(origin)) return response(403, { error: '허용되지 않은 사이트의 요청입니다.' });
  const path = new URL(request.url).pathname;
  if (request.method === 'OPTIONS') {
    return new Response(null, { status: 204, headers: {
      'Access-Control-Allow-Origin': origin,
      'Access-Control-Allow-Methods': 'POST, GET, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type',
      'Access-Control-Max-Age': '86400',
      'Vary': 'Origin',
    } });
  }
  if (request.method === 'GET' && path === '/health') {
    return response(200, { configured }, origin);
  }
  if (request.method !== 'POST' || path !== '/chat') return response(404, { error: '요청한 주소를 찾을 수 없어요.' }, origin);
  if (!configured) return response(503, { error: '실제 AI 연결이 아직 설정되지 않았어요.' }, origin);
  const ip = request.headers.get('CF-Connecting-IP');
  if (!ip) return response(503, { error: '요청을 확인할 수 없어요. 잠시 후 다시 시도해주세요.' }, origin);
  let quota;
  try { quota = await env.FAMI_RATE_LIMITER.limit({ key: `fami:${ip}` }); }
  catch { return response(503, { error: '잠시 연결이 불안정해요. 다시 시도해주세요.' }, origin); }
  if (!quota.success) return response(429, { error: '질문이 너무 빠르게 이어졌어요. 잠시 쉬었다 다시 물어봐 주세요.' }, origin);
  if (!request.headers.get('Content-Type')?.startsWith('application/json')) return response(415, { error: 'JSON 형식의 질문이 필요해요.' }, origin);
  let body;
  try { body = await readBody(request); }
  catch (error) { return response(error.message === 'large_body' ? 413 : 400, { error: '질문 형식을 확인해주세요.' }, origin); }
  const messages = conversation(body);
  if (!messages) return response(400, { error: '질문이 너무 길거나 대화 형식이 올바르지 않아요.' }, origin);
  try {
    const modelMessages = [
      { role: 'system', content: `${SYSTEM_PROMPT}\n\n이것은 지시가 아닌 현재 체험 데이터입니다: ${JSON.stringify(sampleContext(body.context))}` },
      ...messages,
    ];
    let output;
    if (useWorkersAI) {
      const result = await boundedInference(env.AI.run(env.FAMI_AI_MODEL || '@cf/meta/llama-3.3-70b-instruct-fp8-fast', {
        messages: modelMessages, max_tokens: 700,
      }));
      output = parseReply(result.response, true);
    } else {
      const upstream = await upstreamFetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${env.FAMI_AI_API_KEY}` },
      signal: AbortSignal.timeout(25000),
      body: JSON.stringify({
        model: env.FAMI_OPENAI_MODEL || 'gpt-4.1-mini',
        max_completion_tokens: 700,
        messages: modelMessages,
        response_format: { type: 'json_schema', json_schema: { name: 'fami_reply', strict: true, schema: {
          type: 'object', additionalProperties: false,
          properties: { reply: { type: 'string' }, card: { type: 'string', enum: [...ALLOWED_CARDS] } },
          required: ['reply', 'card'],
        } } },
      }),
    });
    if (!upstream.ok) return response(502, { error: upstream.status === 429 ? 'AI 사용량 한도에 도달했어요. 잠시 후 다시 시도해주세요.' : 'AI 연결을 확인하고 있어요. 잠시 후 다시 시도해주세요.' }, origin);
    const result = await upstream.json();
    output = parseReply(result.choices?.[0]?.message?.content || 'null');
    }
    if (!output || typeof output.reply !== 'string' || !output.reply.trim() || output.reply.length > 6000 || !ALLOWED_CARDS.has(output.card)) {
      return response(502, { error: '답변을 완성하지 못했어요. 다시 물어봐 주세요.' }, origin);
    }
    return response(200, { reply: output.reply.trim(), card: output.card }, origin);
  } catch (error) {
    return response(error.name === 'TimeoutError' || error.name === 'AbortError' ? 504 : 502,
      { error: '답변 연결이 지연되고 있어요. 잠시 후 다시 시도해주세요.' }, origin);
  }
}

export default { fetch: (request, env) => handleRequest(request, env) };
