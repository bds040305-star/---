import { Link } from 'react-router-dom';
import { ChevronLeft } from 'lucide-react';

export function ExperienceHeader({ title, backTo = '/ai' }) {
  return <header className="experience-header">
    <Link className="experience-back" to={backTo} aria-label="뒤로가기"><ChevronLeft size={20} /></Link>
    <h1>{title}</h1>
  </header>;
}

export function ExperienceSignature({ aiConnected = false }) {
  return <footer className="experience-signature">
    <span>YOUR LITTLE GREEN WORLD</span>
    <small>{aiConnected
      ? '질문과 최근 대화가 AI 서비스로 전송됩니다. 기기 정보는 체험 데이터입니다.'
      : '비공식 데모 · 실제 계정·기기·AI 서비스와 연결되지 않습니다.'}</small>
  </footer>;
}
