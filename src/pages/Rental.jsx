import { ArrowUpRight } from 'lucide-react'
import PageShell from '../components/PageShell'

export default function Rental(){
  return <PageShell
    eyebrow="07 / RENTAL"
    title={<>밝고 깨끗한 유리감으로<br/>마무리.</>}
    desc="제품 정보에서 렌탈 서비스로 자연스럽게 이어지는 마지막 화면입니다."
    footer
  >
    <section className="content-section">
      <div className="glass-card rental-card">
        <span className="micro">WELLS FARM MINI</span>
        <h3>내 생활에 맞는<br/>웰스팜을 시작해보세요.</h3>
        <button className="primary-btn full">렌탈 서비스 확인하기 <ArrowUpRight size={17}/></button>
        <button className="secondary-btn full">교원웰스 바로가기</button>
      </div>
    </section>
  </PageShell>
}
