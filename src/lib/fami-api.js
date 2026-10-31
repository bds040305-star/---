const configuredUrl = import.meta.env.VITE_FAMI_API_URL?.trim();

export const aiEnabled = Boolean(configuredUrl);

function recentConversation(messages) {
  const recent = [];
  let bytes = 0;
  const encoder = new TextEncoder();
  for (const message of messages.filter((m) => ['user','assistant'].includes(m.role)).slice(-20).reverse()) {
    const entry = { role: message.role, content: message.text.slice(0, 4000) };
    bytes += encoder.encode(JSON.stringify(entry)).byteLength;
    if (bytes > 20000) break;
    recent.unshift(entry);
  }
  return recent;
}

export async function askFami(messages, context, signal) {
  if (!configuredUrl) throw new Error('실제 AI 연결이 아직 설정되지 않았어요.');
  const endpoint = new URL(configuredUrl);
  if (endpoint.protocol !== 'https:' && !['localhost','127.0.0.1'].includes(endpoint.hostname)) {
    throw new Error('AI 연결 주소는 HTTPS여야 해요.');
  }
  const response = await fetch(endpoint.href, {
    method: 'POST', headers: { 'Content-Type': 'application/json' }, signal,
    body: JSON.stringify({
      messages: recentConversation(messages),
      context: { name: context.name, plant: context.plant, registered: context.registered,
        temperature: context.temperature, light: context.light, waterLevel: context.waterLevel },
    }),
  });
  let data;
  try { data = await response.json(); }
  catch { throw new Error('AI 연결 주소의 응답을 확인할 수 없어요.'); }
  if (!response.ok) throw new Error(data.error || 'AI 답변을 받지 못했어요. 다시 시도해주세요.');
  if (typeof data.reply !== 'string' || !data.reply.trim() || data.reply.length > 6000) throw new Error('답변을 완성하지 못했어요. 다시 시도해주세요.');
  return data;
}
