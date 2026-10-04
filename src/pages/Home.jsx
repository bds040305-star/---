import { ArrowUpRight, Leaf } from 'lucide-react'
import { Link } from 'react-router-dom'
import PageShell from '../components/PageShell'

export default function Home(){
  return <PageShell
    eyebrow="SMART GARDEN · 01"
    title={<>집 안에 들이는<br/>작은 우리 정원.</>}
    desc="씨앗을 고르고, 물과 빛을 맞추고, 매일 자라는 변화를 지켜보는 작은 스마트팜."
  >
    <section className="content-section first">
      <div className="hero-product-card glass-card">
        <div className="mint-glow"></div>
        <div className="plant-orbs">
          <div className="plant-orb"><Leaf size={38}/></div>
          <div className="plant-orb"><Leaf size={32}/></div>
        </div>
        <div className="micro-caption">HOME GARDEN / MINI UNIT</div>
        <div className="chip-row">
          <span>WHITE</span><span>SILVER</span><span>GLASS</span>
        </div>
      </div>
      <Link className="primary-btn" to="/inside">제품 구조 보기 <ArrowUpRight size={17}/></Link>
    </section>
  </PageShell>
}
