import { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowUp, Plus, Copy, Volume2, X } from 'lucide-react';
import { asset } from '../components/FarmUI';
import { ExperienceHeader, ExperienceSignature } from '../components/ExperienceLayout';

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
  const end = useRef(null);
  const composer = useRef(null);
  useEffect(() => {
    const transcript = end.current?.parentElement;
    if (transcript) transcript.scrollTop = transcript.scrollHeight;
  }, [messages, viewportHeight]);
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
  const chooseTopic = (topic) => {
    append({ role: 'user', text: topic });
    if (topic === '미니팜 상태 확인') showStatus();
    else if (topic === '식물 키우기 고민') append(bot('어떤 채소를 키우고 계신가요? 빛과 물, 자라는 모습 중 궁금한 점을 알려주세요.'));
    else append(bot('오늘은 어떤 하루를 보내셨나요? 작은 정원을 돌보며 느낀 이야기도 들려주세요.'));
  };
  const refill = (text = '물 채웠어! 다시 확인해줘') => {
    setDevice((d) => ({ ...d, waterLevel: 'enough' }));
    append({ role: 'user', text }, bot(`${farm.name} 상태를 다시 확인했어요.`),
      bot('물 잔량이 충분해요. 잘해주셨어요!'), statusCard('enough', true), bot('또 다른 궁금한 점을 물어보세요!'));
  };
  const send = (value) => {
    const text = value.trim();
    if (!text) return;
    setInput('');
    setToolsOpen(false);
    setFeedback('');
    if (/채웠|보충했|채웠어|채운|물.*완료/.test(text)) {
      refill(text);
      return;
    }
    append({ role: 'user', text });
    if (/물|급수|보충/.test(text)) {
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
    <span className="chat-demo-label">팜이 상담 체험</span>
    <div className="chat-transcript" role="log" aria-label="팜이와의 대화" aria-live="polite" aria-relevant="additions text">
      {messages.map((message, index) => {
        if (message.role === 'card') {
          if (message.kind === 'topics') return <fieldset className="conversation-card topic-card" key={index}>
            <legend>함께 이야기할 주제</legend>
            {['미니팜 상태 확인','식물 키우기 고민','오늘의 일상 이야기'].map((topic) => <button key={topic} onClick={() => chooseTopic(topic)}><span className="topic-dot" aria-hidden="true" />{topic}</button>)}
          </fieldset>;
          if (message.kind === 'water') return <section className="conversation-card" aria-label="물을 채우는 순서" key={index}>
            <div className="conversation-card-heading"><h2>물을 채우는 순서</h2><span>관리 가이드</span></div>
            <p className="card-plant">{farm.plant} · 물 보충 안내</p>
            <ol className="water-instructions"><li>제품 안내에 따라 물통을 열어요</li><li>최대 수위선을 넘지 않게 채워요</li><li>물통을 제자리에 장착해요</li></ol>
            <button className="experience-primary" onClick={() => refill()}>물 보충했어요</button>
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
      <div ref={end} />
    </div>
    <div className="chat-composer-area">
      {feedback && <p role="status" className="chat-feedback">{feedback}</p>}
      {!farm.registered && <p className="experience-account-link">미니팜이 등록되어있으신가요? <Link to="/register">등록하기</Link></p>}
      {toolsOpen && <div className="chat-quick-actions" aria-label="대화 바로가기">
        <button onClick={() => send('미니팜 상태 확인')}>미니팜 상태 확인</button>
        <button onClick={() => send('물은 어떻게 채워?')}>물 보충 방법</button>
        <button onClick={() => {
          window.speechSynthesis?.cancel();
          setSpeaking(false);
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
        <button type="submit" className="chat-send" aria-label="메시지 보내기" disabled={!input.trim()}><ArrowUp size={23} /></button>
      </form>
      <ExperienceSignature />
    </div>
  </section>;
}
