import { Link } from 'react-router-dom';
import { ChevronLeft } from 'lucide-react';
import { asset } from '../components/FarmUI';
import { ExperienceSignature } from '../components/ExperienceLayout';

export default function AIWelcome({ loggedIn }) {
  return <section className="experience-page ai-welcome">
    <Link to="/" className="experience-back welcome-back" aria-label="홈으로 돌아가기"><ChevronLeft size={20} /></Link>
    <div className="welcome-content">
      <h1>오늘은 어떤 이야기를<br />나눌까요?</h1>
      <img className="welcome-mascot" src={asset + 'fami.png'} alt="당신의 작은 정원 친구, 팜이" />
      <h2>당신의 작은 정원 친구, 팜이</h2>
      <p className="experience-muted">식물 이야기부터 오늘의 마음까지</p>
      <Link className="experience-outline" to="/chat">팜이와 대화 시작하기</Link>
    </div>
    <p className="experience-account-link">{loggedIn ? '팜이와 함께할 준비가 됐어요.' : <>이미 함께하고 있나요? <Link to="/login">로그인하기</Link></>}</p>
    <ExperienceSignature />
  </section>;
}
