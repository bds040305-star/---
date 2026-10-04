import { Leaf, Droplets } from 'lucide-react'
import { Link } from 'react-router-dom'
import PageShell from '../components/PageShell'

export default function Inside(){
  return <PageShell
    eyebrow="01 / PRODUCT"
    title={<>친환경 느낌은 남기고,<br/>생활용품 느낌은 줄이고.</>}
    desc="화이트와 실버 소재를 중심으로 제품을 생활가전보다 하나의 작은 인테리어 오브제로 보여줍니다."
  >
    <section className="content-section">
      <div className="glass-card inner-card">
        <div className="mint-glow top-right"></div>
        <div className="pod-row">
          <div className="pod"><Leaf size={26}/><span>SEED</span></div>
          <div className="pod"><Droplets size={26}/><span>WATER</span></div>
        </div>
        <div className="device">
          <div className="device-top"></div>
          <div className="device-body"><i/><i/><i/></div>
          <div className="device-base"></div>
        </div>
        <div className="caption-line"><span>INNER STRUCTURE</span><b>보이는 구조, 쉬운 이해</b></div>
      </div>
      <Link className="secondary-btn" to="/structure">분해 구조 보기</Link>
    </section>
  </PageShell>
}
