import { Link } from 'react-router-dom'
import PageShell from '../components/PageShell'

export default function Time(){
  return <PageShell
    eyebrow="05 / TIME"
    title={<>직접 기른 초록이<br/>식탁까지 이어지는 경험.</>}
    desc="하루하루 자라는 변화를 짧은 문장과 진행률로 보여줍니다."
  >
    <section className="content-section">
      <div className="glass-card timeline-card">
        <div className="mint-glow top-right"></div>
        <span className="micro">WEEK 01</span>
        <h3>오늘 저녁 샐러드는<br/>지금 이 자리에서 자라고 있어요.</h3>
        <div className="progress"><i></i></div>
        <div className="progress-meta"><span>GROWING</span><b>68%</b></div>
      </div>
      <Link className="primary-btn" to="/harvest">수확 단계 보기</Link>
    </section>
  </PageShell>
}
