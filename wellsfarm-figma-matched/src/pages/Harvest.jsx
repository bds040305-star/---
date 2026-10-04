import { Leaf } from 'lucide-react'
import { Link } from 'react-router-dom'
import PageShell from '../components/PageShell'

export default function Harvest(){
  return <PageShell
    eyebrow="06 / HARVEST"
    title={<>키운 채소가<br/>생활 속 루틴이 되는 순간.</>}
    desc="수확 시점에는 제품보다 사용자의 성취감을 더 크게 보여줍니다."
  >
    <section className="content-section">
      <div className="glass-card harvest-card">
        <div className="harvest-visual"><Leaf size={72}/></div>
        <div className="harvest-copy"><span>READY TO HARVEST</span><h3>다솜의 작은 텃밭</h3><p>상추 · 루꼴라 · 청경채</p></div>
      </div>
      <Link className="primary-btn" to="/rental">렌탈 서비스 보기</Link>
    </section>
  </PageShell>
}
