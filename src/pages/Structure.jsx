import { Link } from 'react-router-dom'
import PageShell from '../components/PageShell'

export default function Structure(){
  return <PageShell
    eyebrow="02 / STRUCTURE"
    title={<>제품이 분해될수록<br/>구조는 더 명확하게.</>}
    desc="제품의 작동 방식을 한 번에 이해할 수 있도록 핵심 부품을 순서대로 분리해 보여줍니다."
  >
    <section className="content-section">
      <div className="glass-card exploded-card">
        {[
          ['LIGHT PANEL','조명 패널'],
          ['SEED PODS','씨앗 포드'],
          ['WATER TANK','급수 탱크'],
          ['BASE UNIT','베이스 유닛']
        ].map((x,i)=><div className="explode-item" key={x[0]}>
          <div className={`explode-shape shape-${i+1}`}></div>
          <div><span>{x[0]}</span><b>{x[1]}</b></div>
        </div>)}
      </div>
      <Link className="primary-btn" to="/how-it-works">사용 흐름 보기</Link>
    </section>
  </PageShell>
}
