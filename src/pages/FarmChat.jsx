import { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowUp, Plus, Copy, Volume2, X } from 'lucide-react';
import { asset } from '../components/FarmUI';
import { ExperienceHeader, ExperienceSignature } from '../components/ExperienceLayout';
import { aiEnabled, askFami } from '../lib/fami-api';

export const initialConversation = [
  { role: 'assistant', text: '안녕하세요!' },
  { role: 'assistant', text: '저는 정원 친구 팜이에요.' },
  { role: 'assistant', text: '미니팜에 대해 궁금한게 있으신가요?' },
];

function replyText(messages, index) {
  let start = index;
  while (start > 0 && messages[start - 1].role === 'assistant') start -= 1;
  return messages.slice(start, index + 1).map((message) => message.text).join('\n');
}

export default function FarmChat({ messages, setMessages, farm, device, setDevice, openControl }) {
  const [input, setInput] = useState('');
  const [toolsOpen, setToolsOpen] = useState(false);
  const [feedback, setFeedback] = useState('');
  const [speaking, setSpeaking] = useState(false);
  const [viewportHeight, setViewportHeight] = useState(null);
  const [pending, setPending] = useState(false);
  const [requestError, setRequestError] = useState('');
  const [failedQuestion, setFailedQuestion] = useState('');
  const activeRequest = useRef(null);
  const end = useRef(null);
  const composer = useRef(null);
  useEffect(() => {
    const transcript = end.current?.parentElement;
    if (transcript) transcript.scrollTop = transcript.scrollHeight;
  }, [messages, viewportHeight, pending]);
  useEffect(() => {
    const viewport = window.visualViewport;
    if (!viewport) return;
    const resize = () => {
      const style = getComputedStyle(document.querySelector('.site-shell'));
      const insets = parseFloat(style.paddingTop) + parseFloat(style.paddingBottom);
      setViewportHeight(Math.max(200, viewport.height - insets));
    };
    resize();
    viewport.addEventListener('resize', resize);
    return () => viewport.removeEventListener('resize', resize);
  }, []);
  useEffect(() => () => window.speechSynthesis?.cancel(), []);
  useEffect(() => () => {
    const controller = activeRequest.current;
    activeRequest.current = null;
    controller?.abort();
  }, []);
  const append = (...items) => setMessages((current) => [...current, ...items]);
  const bot = (text) => ({ role: 'assistant', text });
  const statusCard = (water = device.waterLevel, updated = false) => ({
    role: 'card', kind: 'status', water, updated,
  });
  const showStatus = () => append(
    bot(`${farm.plant}가 건강하게 잘 자라고 있어요!`),
    bot(device.waterLevel === 'enough' ? '물 잔량이 충분해요.' : '지금은 물 보충이 필요해 보여요.'),
    statusCard(),
  );
  const requestAI = async (text, retry = false, override = {}) => {
    if (activeRequest.current) return;
    const controller = new AbortController();
    activeRequest.current = controller;
    setPending(true);
    setRequestError('');
    setFailedQuestion('');
    setInput('');
    setToolsOpen(false);
    setFeedback('');
    const history = retry ? messages : [...messages, { role: 'user', text }];
    if (!retry) append({ role: 'user', text });
    const context = { ...farm, ...device, ...override };
    const timeout = setTimeout(() => controller.abort('timeout'), 35000);
    try {
      const result = await askFami(history, context, controller.signal);
      if (activeRequest.current !== controller) return;
      const items = [bot(result.reply)];
      if (result.card === 'show_status') items.push(statusCard(context.waterLevel));
      if (result.card === 'show_water_guide') items.push({ role: 'card', kind: 'water' });
      append(...items);
    } catch (error) {
      if (activeRequest.current !== controller) return;
      setRequestError(controller.signal.aborted ? '답변이 지연되고 있어요. 다시 시도해주세요.' : error.message || '연결을 확인하고 다시 시도해주세요.');
      setFailedQuestion(text);
    } finally {
      clearTimeout(timeout);
      if (activeRequest.current === controller) {
        activeRequest.current = null;
        setPending(false);
      }
    }
  };
  const chooseTopic = (topic) => {
    if (aiEnabled) { requestAI(topic); return; }
    append({ role: 'user', text: topic });
    if (topic === '미니팜 상태 확인') showStatus();
    else if (topic === '식물 키우기 고민') append(bot('어떤 채소를 키우고 계신가요? 빛과 물, 자라는 모습 중 궁금한 점을 알려주세요.'));
    else append(bot('오늘은 어떤 하루를 보내셨나요? 작은 정원을 돌보며 느낀 이야기도 들려주세요.'));
  };
  const refill = (text = '물 채웠어! 다시 확인해줘') => {
    if (activeRequest.current) return;
    setDevice((d) => ({ ...d, waterLevel: 'enough' }));
    if (aiEnabled) { requestAI(text, false, { waterLevel: 'enough' }); return; }
    append({ role: 'user', text }, bot(`${farm.name} 상태를 다시 확인했어요.`),
      bot('물 잔량이 충분해요. 잘해주셨어요!'), statusCard('enough', true), bot('또 다른 궁금한 점을 물어보세요!'));
  };
  const send = (value) => {
    const text = value.trim();
    if (!text) return;
    if (aiEnabled) { requestAI(text); return; }
    setInput('');
    setToolsOpen(false);
    setFeedback('');
    if (/채웠|보충했|채웠어|채운|물.*완료/.test(text)) {
      refill(text);
      return;
    }
    append({ role: 'user', text });
    const greeting = text.normalize('NFKC').toLowerCase()
      .replace(/^(?:팜아|팜이야|팜이)[,\s]*/, '')
      .replace(/[\s,.!?~…。，！？👋😊🙂]/gu, '');
    if (/^(?:안녕|안녕하세요|안뇽|하이|반가워|반가워요|hello|hi)(?:팜아|팜이야|팜이)?$/.test(greeting)) {
      append(bot('안녕! 만나서 반가워요 🌱 저는 정원 친구 팜이에요. 편하게 이야기해 주세요!'));
    } else if (/^(?:고마워|고마워요|고맙습니다|감사해|감사해요|감사합니다|땡큐|thanks|thankyou)$/.test(greeting)) {
      append(bot('도움이 됐다니 기뻐요! 또 궁금한 게 생기면 언제든 불러주세요 🌱'));
    } else if (/^(?:잘가|잘있어|잘있어요|다음에봐|다음에봐요|또만나|안녕히계세요|바이|bye)$/.test(greeting)) {
      append(bot('다음에 또 만나요! 오늘도 싱그러운 하루 보내세요 🌿'));
    } else if (/^(?:너는누구야|넌누구야|누구세요|이름이뭐야|네이름이뭐야)$/.test(greeting)) {
      append(bot('저는 작은 정원 친구 팜이에요! 미니팜을 돌보는 이야기도, 오늘의 일상 이야기도 함께 나눠요 🌱'));
    } else if (/물|급수|보충/.test(text)) {
      append(bot('물통의 수위를 먼저 확인해주세요.'), bot('아래 순서대로 천천히 따라 해보세요.'), { role: 'card', kind: 'water' });
    } else if (/상태|다시 확인/.test(text)) showStatus();
    else if (/일상|오늘|마음/.test(text)) append(bot('오늘의 이야기를 들려주세요. 작은 정원을 가꾸듯, 잠시 쉬어가는 시간이 되어도 좋아요.'));
    else append(bot('함께 이야기할 주제를 골라주세요.'), { role: 'card', kind: 'topics' });
  };
  const copy = async (text) => {
    try {
      await navigator.clipboard.writeText(text);
      setFeedback('답변을 복사했어요.');
    } catch { setFeedback('이 브라우저에서는 복사를 사용할 수 없어요. 답변을 길게 눌러 선택해 주세요.'); }
  };
  const read = (text) => {
    if (!window.speechSynthesis || !window.SpeechSynthesisUtterance) {
      setFeedback('이 브라우저에서는 음성 읽기를 지원하지 않아요.');
      return;
    }
    window.speechSynthesis.cancel();
    if (speaking) { setSpeaking(false); return; }
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = 'ko-KR';
    utterance.onend = () => setSpeaking(false);
    utterance.onerror = () => setSpeaking(false);
    setSpeaking(true);
    window.speechSynthesis.speak(utterance);
  };
  return <section className="experience-page farm-chat" style={viewportHeight ? { height: `${viewportHeight}px` } : undefined}>
    <ExperienceHeader title="AI 팜이에게 상담하기" />
    <span className="chat-demo-label">{aiEnabled ? '팜이 AI 상담' : '팜이 상담 체험 · AI 연결 전'}</span>
    <div className="chat-transcript" role="log" aria-label="팜이와의 대화" aria-live="polite" aria-relevant="additions text">
      {messages.map((message, index) => {
        if (message.role === 'card') {
          if (message.kind === 'topics') return <fieldset className="conversation-card topic-card" key={index}>
            <legend>함께 이야기할 주제</legend>
            {['미니팜 상태 확인','식물 키우기 고민','오늘의 일상 이야기'].map((topic) => <button key={topic} disabled={pending} onClick={() => chooseTopic(topic)}><span className="topic-dot" aria-hidden="true" />{topic}</button>)}
          </fieldset>;
          if (message.kind === 'water') return <section className="conversation-card" aria-label="물을 채우는 순서" key={index}>
            <div className="conversation-card-heading"><h2>물을 채우는 순서</h2><span>관리 가이드</span></div>
            <p className="card-plant">{farm.plant} · 물 보충 안내</p>
            <ol className="water-instructions"><li>제품 안내에 따라 물통을 열어요</li><li>최대 수위선을 넘지 않게 채워요</li><li>물통을 제자리에 장착해요</li></ol>
            <button className="experience-primary" disabled={pending} onClick={() => refill()}>물 보충했어요</button>
          </section>;
          return <section className="conversation-card" aria-label="미니팜 체험 상태" key={index}>
            <div className="conversation-card-heading"><h2>{farm.name}{!message.updated && '♫'}</h2><span>{message.updated ? '방금 업데이트' : farm.registered ? '기기등록 완료' : '체험 미니팜'}</span></div>
            <p className="card-plant">{farm.plant} · 키우는 중</p>
            <dl className="farm-readings"><div><dt>온도</dt><dd>{device.temperature}°C</dd></div><div><dt>조명</dt><dd>{device.light > 0 ? '켜짐' : '꺼짐'}</dd></div><div><dt>물 잔량</dt><dd className="water-level">{message.water === 'enough' ? '충분' : '부족'}</dd></div></dl>
            {!message.updated && <button className="experience-outline" onClick={() => openControl('temperature')}>스마트 제어 열기</button>}
          </section>;
        }
        const groupEnds = message.role === 'assistant' && messages[index + 1]?.role !== 'assistant';
        const assistantText = groupEnds ? replyText(messages, index) : '';
        return <div className={`conversation-message ${message.role}`} key={index}>
          <p>{message.text}</p>
          {groupEnds && <div className="message-tools">
            <img src={asset + 'fami.png'} alt="팜이" />
            <button aria-label="답변 복사" onClick={() => copy(assistantText)}><Copy size={15} /></button>
            <button aria-label={speaking ? '읽어주기 중지' : '답변 읽어주기'} onClick={() => read(assistantText)}><Volume2 size={15} /></button>
          </div>}
        </div>;
      })}
      {pending && <p className="chat-thinking" role="status">팜이가 질문을 생각하고 있어요…</p>}
      <div ref={end} />
    </div>
    <div className="chat-composer-area">
      {requestError && <div className="chat-request-error" role="alert">
        <p>{requestError}</p>
        <button type="button" disabled={pending} onClick={() => requestAI(failedQuestion, true)}>다시 시도</button>
      </div>}
      {feedback && <p role="status" className="chat-feedback">{feedback}</p>}
      {!farm.registered && <p className="experience-account-link">미니팜이 등록되어있으신가요? <Link to="/register">등록하기</Link></p>}
      {toolsOpen && <div className="chat-quick-actions" aria-label="대화 바로가기">
        <button onClick={() => send('미니팜 상태 확인')}>미니팜 상태 확인</button>
        <button onClick={() => send('물은 어떻게 채워?')}>물 보충 방법</button>
        <button onClick={() => {
          window.speechSynthesis?.cancel();
          setSpeaking(false);
          const controller = activeRequest.current;
          activeRequest.current = null;
          controller?.abort();
          setPending(false);
          setRequestError('');
          setFailedQuestion('');
          setInput('');
          setFeedback('');
          setMessages([...initialConversation]);
          setToolsOpen(false);
          composer.current?.focus();
        }}>새로운 대화</button>
      </div>}
      <form className="farm-composer" onSubmit={(e) => { e.preventDefault(); send(input); }}>
        <button type="button" className="chat-plus" aria-label="대화 메뉴" aria-expanded={toolsOpen} onClick={() => setToolsOpen(!toolsOpen)}>{toolsOpen ? <X size={20} /> : <Plus size={20} />}</button>
        <input ref={composer} type="text" aria-label="팜이에게 묻기" placeholder="팜이에게 묻기" value={input} onChange={(e) => setInput(e.target.value)} enterKeyHint="send" autoComplete="off" maxLength={1000} />
        <button type="submit" className="chat-send" aria-label="메시지 보내기" disabled={!input.trim() || pending}><ArrowUp size={23} /></button>
      </form>
      <ExperienceSignature aiConnected={aiEnabled} />
    </div>
  </section>;
}
