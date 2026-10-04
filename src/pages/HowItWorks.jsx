import { Sprout, Droplets, Eye, Scissors } from 'lucide-react'
import { Link } from 'react-router-dom'
import PageShell from '../components/PageShell'

export default function HowItWorks(){
  const list=[
    ['LIGHT','빛을 조절하고',Sprout],
    ['WATER','물을 채우고',Droplets],
    ['WATCH','자라는 변화를 보고',Eye],
    ['HARVEST','바로 수확해요',Scissors]
  ]
  return <PageShell
    eyebrow="03 / HOW IT WORKS"
    title={<>기능을 설명하지 말고,<br/>사용 순서로 보여주기.</>}
    desc="복잡한 기능명보다 사용자가 실제로 하는 행동을 기준으로 흐름을 정리했습니다."
  >
    <section className="content-section">
      <div className="step-list">
        {list.map(([a,b,Icon],i)=><article className="step-card" key={a}>
          <span className="step-num">0{i+1}</span>
          <div className="step-icon"><Icon size={20}/></div>
          <div><b>{a}</b><p>{b}</p></div>
        </article>)}
      </div>
      <Link className="primary-btn" to="/seed">씨앗 고르기</Link>
    </section>
  </PageShell>
}
