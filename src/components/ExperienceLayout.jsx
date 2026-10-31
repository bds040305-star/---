import { Link } from 'react-router-dom';
import { ChevronLeft } from 'lucide-react';

export function ExperienceHeader({ title, backTo = '/ai' }) {
  return <header className="experience-header">
    <Link className="experience-back" to={backTo} aria-label="뒤로가기"><ChevronLeft size={20} /></Link>
    <h1>{title}</h1>
  </header>;
}

export function ExperienceSignature() {
  return <footer className="experience-signature">
    <span>YOUR LITTLE GREEN WORLD</span>
    <small>비공식 데모 · 실제 계정·기기·AI 서비스와 연결되지 않습니다.</small>
  </footer>;
}
