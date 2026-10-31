import { asset, Action } from "../components/FarmUI";

export default function Home({ onNavigate }) {
  return (
    <>
        <section
          className="hero"
          id="hero"
          data-preview="hero"
          aria-labelledby="hero-title"
        >
          <div className="hero-copy">
            <p className="eyebrow">NATURE, IN YOUR ORBIT.</p>
            <h1 id="hero-title">
              Your space.
              <br />
              Your planet.
            </h1>
          </div>
          <div className="hero-visual">
            <img
              src={asset + "hero-garden.png"}
              alt="초록 정원에 놓인 웰스 미니팜"
            />
            <div className="hero-label">
              <small>WATER &amp; LIFE</small>
              <p>집 안에 들이는 작은 우리 정원</p>
            </div>
            <div className="light-label">
              <small>GROWING LIGHT</small>
              <p>빛을 담다</p>
            </div>
          </div>
          <Action light onClick={() => onNavigate("/structure")}>
            제품 구조 보기
          </Action>
        </section>
    </>
  );
}
