import { useEffect, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";

const design = "/design/";
function Hit({ label, x, y, w, h, height = 780, to, onClick }) {
  const props = {
    className: "design-hit",
    "aria-label": label,
    title: label,
    style: {
      left: `${(x / 390) * 100}%`,
      top: `${(y / height) * 100}%`,
      width: `${(w / 390) * 100}%`,
      height: `${(h / height) * 100}%`,
    },
  };
  return to ? (
    <Link {...props} to={to} />
  ) : (
    <button {...props} type="button" onClick={onClick} />
  );
}
function Screen({ image, alt, children, long = false }) {
  return (
    <main className={`design-screen ${long ? "long-screen" : ""}`}>
      <img
        className="design-image"
        src={design + image}
        alt={alt}
        width="390"
        height={long ? "5485" : "780"}
        draggable="false"
      />
      {children}
    </main>
  );
}
function Home() {
  const go = useNavigate();
  const [notice, setNotice] = useState("");
  const scroll = (y) =>
    window.scrollTo({
      top:
        document.querySelector(".design-screen").getBoundingClientRect().top +
        window.scrollY +
        (y * document.querySelector(".design-screen").clientWidth) / 390,
      behavior: "smooth",
    });
  return (
    <>
      <Screen
        long
        image="home.png"
        alt="웰스 미니팜. Your space, Your planet. 집 안에 들이는 작은 우리 정원. 와이드 12구, 미니팜 구조, 재배 시스템, 채소 선택과 고객센터 안내."
      >
        <Hit
          height={5485}
          label="메뉴 열기"
          x={310}
          y={18}
          w={57}
          h={67}
          to="/menu"
        />
        <Hit
          height={5485}
          label="제품 구조 보기"
          x={32}
          y={736}
          w={326}
          h={56}
          onClick={() => scroll(1600)}
        />
        <Hit
          height={5485}
          label="AI 팜이에게 상담하기"
          x={109}
          y={820}
          w={263}
          h={116}
          to="/ai"
        />
        <Hit
          height={5485}
          label="Wide · 12구"
          x={40}
          y={1154}
          w={153}
          h={47}
          onClick={() =>
            setNotice("현재 제공된 디자인은 Wide · 12구 화면입니다.")
          }
        />
        <Hit
          height={5485}
          label="Slim · 6구"
          x={200}
          y={1154}
          w={152}
          h={47}
          onClick={() =>
            setNotice(
              "Slim · 6구의 원본 화면은 제공된 디자인에 포함되어 있지 않습니다.",
            )
          }
        />
        <Hit
          height={5485}
          label="빛 조정하기 — 스마트 제어"
          x={24}
          y={2220}
          w={341}
          h={83}
          to="/control?tab=light"
        />
        <Hit
          height={5485}
          label="모드 설정하기 — 스마트 제어"
          x={24}
          y={2318}
          w={341}
          h={83}
          to="/control"
        />
        <Hit
          height={5485}
          label="시간 맞추기"
          x={24}
          y={2416}
          w={341}
          h={83}
          onClick={() =>
            setNotice("예약 시간 설정은 실제 기기 연결 후 사용할 수 있습니다.")
          }
        />
        <Hit
          height={5485}
          label="물 채우기 — 스마트 제어"
          x={24}
          y={2514}
          w={341}
          h={83}
          to="/control?tab=water"
        />
        <Hit
          height={5485}
          label="바로 먹기 — 채소 선택"
          x={24}
          y={2612}
          w={341}
          h={83}
          onClick={() => scroll(3880)}
        />
        <Hit
          height={5485}
          label="전원 버튼 사용해 보기"
          x={24}
          y={3710}
          w={70}
          h={65}
          to="/control"
        />
        <Hit
          height={5485}
          label="상추 선택"
          x={24}
          y={4032}
          w={342}
          h={90}
          onClick={() => setNotice("상추 · LETTUCE를 선택했습니다.")}
        />
        <Hit
          height={5485}
          label="루꼴라 선택"
          x={24}
          y={4134}
          w={342}
          h={90}
          onClick={() => setNotice("루꼴라 · ARUGULA를 선택했습니다.")}
        />
        <Hit
          height={5485}
          label="청경채 선택"
          x={24}
          y={4236}
          w={342}
          h={90}
          onClick={() => setNotice("청경채 · BOK CHOY를 선택했습니다.")}
        />
        <Hit
          height={5485}
          label="이 채소 키워보기"
          x={24}
          y={4356}
          w={342}
          h={56}
          onClick={() => go("/control")}
        />
        <a
          className="design-hit"
          style={{
            left: "6%",
            top: `${(4925 / 5485) * 100}%`,
            width: "55%",
            height: "0.85%",
          }}
          href="tel:15884113"
          aria-label="고객센터 1588-4113 전화하기"
        />
      </Screen>
      {notice && (
        <div className="modal-backdrop" onClick={() => setNotice("")}>
          <section
            className="notice"
            role="dialog"
            aria-modal="true"
            aria-label="안내"
            onClick={(e) => e.stopPropagation()}
          >
            <p>{notice}</p>
            <button autoFocus onClick={() => setNotice("")}>
              확인
            </button>
          </section>
        </div>
      )}
    </>
  );
}
function Menu() {
  return (
    <Screen
      image="menu.png"
      alt="웰스 메뉴. 미니팜 렌탈 서비스, 스마트 제어, 고객센터, AI 팜이에게 상담하기."
    >
      <Hit label="홈으로" x={24} y={25} w={110} h={55} to="/" />
      <Hit label="메뉴 닫기" x={312} y={24} w={56} h={57} to="/" />
      <Hit
        label="미니팜 렌탈 서비스"
        x={24}
        y={108}
        w={344}
        h={192}
        to="/#products"
      />
      <Hit label="스마트 제어" x={24} y={315} w={343} h={73} to="/control" />
      <Hit label="고객센터" x={24} y={394} w={343} h={73} to="/#customer" />
      <Hit
        label="AI 팜이에게 상담하기"
        x={24}
        y={498}
        w={344}
        h={105}
        to="/ai"
      />
      <Hit label="로그인 안내" x={24} y={666} w={61} h={40} to="/ai?login=1" />
      <Hit
        label="회원가입 안내"
        x={99}
        y={666}
        w={85}
        h={40}
        to="/ai?login=1"
      />
      <Hit
        label="마이페이지 안내"
        x={260}
        y={666}
        w={108}
        h={40}
        to="/ai?login=1"
      />
    </Screen>
  );
}
function Control({ power, setPower, temperature, setTemperature }) {
  const location = useLocation();
  const go = useNavigate();
  const tab = new URLSearchParams(location.search).get("tab");
  const [message, setMessage] = useState("");
  const image =
    tab === "temperature"
      ? "temperature.png"
      : power
        ? "control-on.png"
        : "control-off.png";
  return (
    <Screen
      image={image}
      alt={`스마트 제어. 우리 집 미니팜. Wi-Fi 연결됨. ${tab === "temperature" ? "설정 온도 " + temperature + "도" : power ? "ON, 미니팜이 켜져 있어요" : "OFF, 미니팜이 꺼져 있어요"}. 기기 연결 없는 시연 화면입니다.`}
    >
      <Hit label="홈으로 돌아가기" x={16} y={24} w={42} h={48} to="/" />
      <Hit
        label="온도 조절"
        x={344}
        y={110}
        w={46}
        h={40}
        to="/control?tab=temperature"
      />
      <Hit
        label="조명 제어"
        x={344}
        y={150}
        w={46}
        h={40}
        onClick={() =>
          setMessage("조명 제어는 실제 기기 연결 후 사용할 수 있습니다.")
        }
      />
      <Hit
        label="급수 제어"
        x={344}
        y={190}
        w={46}
        h={40}
        onClick={() =>
          setMessage("급수 제어는 실제 기기 연결 후 사용할 수 있습니다.")
        }
      />
      {tab === "temperature" ? (
        <>
          <output
            className={`temperature-reading ${temperature === 22 ? "original-reading" : ""}`}
            aria-live="polite"
          >
            {temperature}
            <span>°C</span>
          </output>
          <Hit
            label="온도 1도 올리기"
            x={340}
            y={304}
            w={32}
            h={38}
            onClick={() => setTemperature((t) => Math.min(30, t + 1))}
          />
          <Hit
            label="온도 1도 내리기"
            x={340}
            y={490}
            w={32}
            h={38}
            onClick={() => setTemperature((t) => Math.max(16, t - 1))}
          />
          <input
            className="temperature-slider"
            aria-label="설정 온도"
            type="range"
            min="16"
            max="30"
            value={temperature}
            onChange={(e) => setTemperature(Number(e.target.value))}
          />
        </>
      ) : (
        <>
          <Hit
            label={power ? "미니팜 전원 끄기" : "미니팜 전원 켜기"}
            x={68}
            y={226}
            w={254}
            h={254}
            onClick={() => setPower(!power)}
          />
          <button
            className="design-hit"
            style={{ left: "72%", top: "73%", width: "18%", height: "7%" }}
            role="switch"
            aria-label="기기 전원"
            aria-checked={power}
            onClick={() => setPower(!power)}
          />
        </>
      )}
      {message && (
        <div className="control-message" role="status">
          {message}
          <button onClick={() => setMessage("")}>닫기</button>
        </div>
      )}
      {tab === "temperature" && (
        <Hit
          label="전원 제어로 돌아가기"
          x={24}
          y={550}
          w={250}
          h={90}
          onClick={() => go("/control")}
        />
      )}
    </Screen>
  );
}
function AI() {
  const [chat, setChat] = useState(false);
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState([]);
  if (chat)
    return (
      <main className="chat-screen">
        <header>
          <button
            onClick={() => setChat(false)}
            aria-label="상담 소개로 돌아가기"
          >
            ‹
          </button>
          <strong>팜이와 대화하기</strong>
          <Link to="/" aria-label="홈으로">
            ×
          </Link>
        </header>
        <img
          src={design + "ai.png"}
          className="chat-character"
          alt="작은 정원 친구 팜이"
        />
        <p className="chat-intro">안녕하세요! 작은 정원 친구, 팜이예요.</p>
        <p className="demo-note">
          디자인 시연 화면입니다. AI 상담 서버는 연결되어 있지 않습니다.
        </p>
        <div className="messages" aria-live="polite">
          {messages.map((m, i) => (
            <p className={m.me ? "message mine" : "message"} key={i}>
              {m.text}
            </p>
          ))}
        </div>
        <form
          onSubmit={(e) => {
            e.preventDefault();
            if (!input.trim()) return;
            setMessages((m) => [
              ...m,
              { me: true, text: input.trim() },
              {
                me: false,
                text: "현재는 상담 시연 화면이에요. 실제 식물 상담은 AI 서비스 연결 후 이용할 수 있어요.",
              },
            ]);
            setInput("");
          }}
        >
          <input
            aria-label="팜이에게 보낼 메시지"
            placeholder="팜이에게 이야기해 주세요"
            value={input}
            onChange={(e) => setInput(e.target.value)}
          />
          <button disabled={!input.trim()}>보내기</button>
        </form>
      </main>
    );
  return (
    <Screen
      image="ai.png"
      alt="오늘은 어떤 이야기를 나눌까요? 당신의 작은 정원 친구, 팜이. 식물 이야기부터 오늘의 마음까지."
    >
      <Hit
        label="팜이와 대화 시작하기"
        x={24}
        y={554}
        w={342}
        h={55}
        onClick={() => setChat(true)}
      />
      <Hit
        label="로그인 — 서비스 연결 안내"
        x={102}
        y={678}
        w={186}
        h={30}
        onClick={() => setChat(true)}
      />
      <Link className="ai-back" to="/menu" aria-label="메뉴로 돌아가기">
        ‹
      </Link>
    </Screen>
  );
}
export default function App() {
  const location = useLocation();
  const [power, setPower] = useState(false);
  const [temperature, setTemperature] = useState(22);
  useEffect(() => {
    const y =
      location.hash === "#customer"
        ? 4690
        : location.hash === "#products"
          ? 970
          : 0;
    window.scrollTo(0, (y * Math.min(window.innerWidth, 390)) / 390);
  }, [location.pathname, location.hash]);
  if (location.pathname === "/menu") return <Menu />;
  if (location.pathname === "/control")
    return (
      <Control
        power={power}
        setPower={setPower}
        temperature={temperature}
        setTemperature={setTemperature}
      />
    );
  if (location.pathname === "/ai") return <AI />;
  return <Home />;
}
