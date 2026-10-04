import { useState } from 'react'
import { Leaf, ArrowUpRight } from 'lucide-react'
import { Link } from 'react-router-dom'
import PageShell from '../components/PageShell'

export default function Seed(){
  const [selected,setSelected]=useState(0)
  const seeds=[['상추','7 DAYS'],['루꼴라','9 DAYS'],['청경채','11 DAYS']]
  return <PageShell
    eyebrow="04 / SEED CHOICE"
    title={<>씨앗 하나를 고르는 순간부터<br/>제품 사용을 배우기.</>}
    desc="원하는 채소를 고르면 추천 빛과 급수 설정이 함께 안내되는 방식입니다."
  >
    <section className="content-section">
      <div className="seed-grid">
        {seeds.map((x,i)=><button key={x[0]} className={`seed-card ${selected===i?'selected':''}`} onClick={()=>setSelected(i)}>
          <div className="seed-icon"><Leaf size={31}/></div>
          <strong>{x[0]}</strong><small>{x[1]}</small>
        </button>)}
      </div>
      <button className="primary-btn full">이 식물 고르기 <ArrowUpRight size={17}/></button>
      <Link className="text-link" to="/time">성장 과정 보기 →</Link>
    </section>
  </PageShell>
}
