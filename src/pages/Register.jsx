import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ExperienceHeader, ExperienceSignature } from '../components/ExperienceLayout';

export default function Register({ farm, onRegister }) {
  const navigate = useNavigate();
  const [name, setName] = useState(farm.name);
  const [plant, setPlant] = useState(farm.plant);
  return <section className="experience-page">
    <ExperienceHeader title="내 미니팜 등록하기" backTo="/chat" />
    <form className="register-form" onSubmit={(e) => {
      e.preventDefault();
      onRegister({ name: name.trim(), plant });
      navigate('/chat');
    }}>
      <h2>작은 정원에 이름을 지어주세요</h2>
      <p className="experience-muted">실제 기기 연결 없이 샘플 미니팜을 등록하는 체험입니다.</p>
      <label htmlFor="farm-name">미니팜 이름</label>
      <input id="farm-name" value={name} onChange={(e) => setName(e.target.value)} maxLength={20} required />
      <label htmlFor="farm-plant">키우는 채소</label>
      <select id="farm-plant" value={plant} onChange={(e) => setPlant(e.target.value)}>
        {['청경채','상추','루꼴라'].map((p) => <option key={p}>{p}</option>)}
      </select>
      <button className="experience-primary" disabled={!name.trim()}>체험 기기 등록하기</button>
    </form>
    <ExperienceSignature />
  </section>;
}
