import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { MessageCircle } from 'lucide-react';
import { ExperienceHeader, ExperienceSignature } from '../components/ExperienceLayout';
import { asset } from '../components/FarmUI';

const DEMO_EMAIL = 'minifarm@example.com';
const DEMO_PASSWORD = 'minifarm123!';

export default function Login({ onLogin }) {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [socialNotice, setSocialNotice] = useState('');
  const fillDemo = () => {
    setEmail(DEMO_EMAIL);
    setPassword(DEMO_PASSWORD);
    setError('');
    setSocialNotice('체험 계정을 입력했어요. 로그인하기를 눌러주세요.');
  };
  const submit = (event) => {
    event.preventDefault();
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())) {
      setError('email');
      return;
    }
    if (email.trim().toLowerCase() !== DEMO_EMAIL || password !== DEMO_PASSWORD) {
      setError('password');
      return;
    }
    setPassword('');
    onLogin();
    navigate('/login/complete', { replace: true });
  };
  return <section className="experience-page login-page">
    <ExperienceHeader title="로그인" />
    <div className="login-content">
      <h2>다시 만나서 반가워요!</h2>
      <p className="experience-muted">우리 집 미니팜을 이어서 돌봐요.</p>
      <form className="login-form" onSubmit={submit} noValidate autoComplete="off">
        <label htmlFor="demo-email">이메일</label>
        <input id="demo-email" type="email" inputMode="email" autoComplete="off" placeholder="이메일 주소를 입력해주세요"
          value={email} onChange={(e) => { setEmail(e.target.value); setError(''); }}
          aria-invalid={error === 'email'} aria-describedby={error === 'email' ? 'email-error' : undefined} />
        {error === 'email' && <p className="login-error" id="email-error" role="alert">이메일 형식을 확인해주세요. 예: name@email.com</p>}
        <label htmlFor="demo-password">비밀번호</label>
        <input id="demo-password" type="password" autoComplete="new-password" placeholder="비밀번호를 입력해주세요"
          value={password} onChange={(e) => { setPassword(e.target.value); setError(''); }}
          aria-invalid={error === 'password'} aria-describedby={error === 'password' ? 'password-error' : undefined} />
        {error === 'password' && <p className="login-error" id="password-error" role="alert">비밀번호가 일치하지 않아요. 다시 입력해주세요.</p>}
        <Link className="forgot-link" to="/reset-password">비밀번호를 잊으셨나요?</Link>
        <button className="experience-primary" type="submit" disabled={!email.trim() || !password}>{error ? '다시 로그인하기' : '로그인하기'}</button>
      </form>
      <div className="login-demo-helper">
        <span>개인정보 없이 체험해요.</span>
        <button type="button" onClick={fillDemo}>체험 계정 채우기</button>
      </div>
      <p className="social-caption">또는 간편하게 로그인</p>
      <div className="social-login-buttons">
        <button className="social-login kakao" onClick={() => setSocialNotice('카카오 로그인은 데모 화면입니다. 체험 계정 채우기로 이용해 주세요.')}><MessageCircle size={16} fill="currentColor" />카카오로 계속하기</button>
        <button className="social-login naver" onClick={() => setSocialNotice('네이버 로그인은 데모 화면입니다. 체험 계정 채우기로 이용해 주세요.')}><b aria-hidden="true">N</b>네이버로 계속하기</button>
        <button className="social-login google" onClick={() => setSocialNotice('Google 로그인은 데모 화면입니다. 체험 계정 채우기로 이용해 주세요.')}><b aria-hidden="true">G</b>Google로 계속하기</button>
      </div>
      {socialNotice && <p className="login-status" role="status">{socialNotice}</p>}
      <p className="experience-account-link">아직 계정이 없나요? <Link to="/signup">회원가입하기</Link></p>
    </div>
    <ExperienceSignature />
  </section>;
}

export function LoginComplete() {
  return <section className="experience-page login-complete">
    <ExperienceHeader title="로그인 완료" backTo="/" />
    <div className="login-complete-content">
      <div className="success-mascot"><img src={asset + 'fami.png'} alt="다시 만나 반갑다고 인사하는 팜이" /><span aria-hidden="true">✦</span></div>
      <h2>로그인 완료</h2>
      <p className="experience-muted">궁금했던 식물 이야기부터 오늘의 일상까지<br />언제든 편하게 물어보세요.</p>
      <small className="experience-muted">체험 계정으로 로그인했어요.</small>
      <Link className="experience-primary" to="/">홈 화면으로</Link>
      <Link className="experience-outline" to="/register">내 미니팜 등록하기</Link>
    </div>
    <ExperienceSignature />
  </section>;
}

export function AccountHelp({ reset = false }) {
  return <section className="experience-page">
    <ExperienceHeader title={reset ? '비밀번호 안내' : '회원가입 안내'} backTo="/login" />
    <div className="account-help">
      <h2>{reset ? '체험 계정으로 다시 만나요' : '팜이와 먼저 이야기해 보세요'}</h2>
      <p>현재는 비공식 디자인 데모여서 실제 회원가입이나 비밀번호 변경은 제공하지 않아요. 개인정보를 입력하지 않고 체험 계정으로 이용할 수 있어요.</p>
      <Link className="experience-primary" to="/login">로그인 체험으로 돌아가기</Link>
      <Link className="experience-outline" to="/ai">계정 없이 팜이 만나기</Link>
    </div>
    <ExperienceSignature />
  </section>;
}
