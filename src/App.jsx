import { useEffect, useRef, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";

const asset = "/design/assets/";
const vegetables = [
  { name: "상추", english: "LETTUCE", image: "lettuce.png" },
  { name: "루꼴라", english: "ARUGULA", image: "arugula.png" },
  { name: "청경채", english: "BOK CHOY", image: "bok-choy.png" },
];
const paths = {
  arrow: "M5 19 19 5M5 5h14v14",
  menu: "M5 8h14M5 16h9",
  close: "m6 6 12 12M18 6 6 18",
  back: "m14 6-6 6 6 6",
  power: "M12 3v9M6.5 5.5a9 9 0 1 0 11 0",
  leaf: "M5 20C2 10 9 3 20 4c1 11-6 17-15 16Zm0 0L15 9",
  sun: "M12 8a4 4 0 1 0 0 8 4 4 0 0 0 0-8M12 2v2M12 20v2M2 12h2M20 12h2M5 5l1.5 1.5M17.5 17.5 19 19M5 19l1.5-1.5M17.5 6.5 19 5",
  bulb: "M8 15c-6-7 1-15 7-10 4 3 1 8-1 10v3H8v-3ZM9 21h4M11 1v2M2 7l2 1M19 7l2-1",
  touch:
    "M10 13V5a2 2 0 0 1 4 0v7l2-2 5 3-4 8H9l-5-7a2 2 0 0 1 3-2l3 3M3 3l2 2M20 3l-2 2",
  temperature: "M9 14V5a3 3 0 0 1 6 0v9a5 5 0 1 1-6 0ZM12 8v10M18 5h3M18 9h2",
  air: "M2 6q3-3 6 0t6 0 8 0M2 12q3-3 6 0t6 0 8 0M2 18q3-3 6 0t6 0 8 0",
  pot: "M6 14h12l-2 8H8l-2-8ZM12 14V6M12 10C3 11 3 3 3 3s9-1 9 7ZM12 8C12 1 21 2 21 2s1 7-9 6Z",
  door: "M3 2h18v20H3V2ZM6 5h12v14H6V5ZM16 11v3",
  lock: "M7 10V7a5 5 0 0 1 10 0v3M5 10h14v12H5V10ZM12 14v4",
  timer: "M12 5a8 8 0 1 0 0 16 8 8 0 0 0 0-16ZM9 2h6M12 8v5l3 2",
  headset:
    "M3 14v-3a9 9 0 0 1 18 0v5M3 12H1v7h4v-7H3ZM21 12h2v7h-4v-7h2ZM21 19c0 3-5 3-7 3",
  message: "M3 3h18v15h-7l-5 4v-4H3V3ZM8 8v5M12 8v5M16 8v5",
  tools:
    "m4 3 5 5-3 3-5-5m19 15-8-8M15 3a5 5 0 0 0-6 6L2 18l4 4 9-9a5 5 0 0 0 6-6l-4 3-3-3 3-4Z",
  user: "M12 2a4 4 0 1 0 0 8 4 4 0 0 0 0-8ZM4 22v-3a8 8 0 0 1 16 0v3",
  water: "M12 2c-2 5-7 9-7 13a7 7 0 0 0 14 0c0-4-5-8-7-13Z",
};
function Icon({ name, size = 24, ...props }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.6"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      {...props}
    >
      <path d={paths[name] || paths.leaf} />
    </svg>
  );
}
function Brand() {
  return <span className="brand">wells</span>;
}
function Action({ children, onClick, light = false, ...props }) {
  return (
    <button
      className={`action ${light ? "action-light" : ""}`}
      onClick={onClick}
      {...props}
    >
      <span>{children}</span>
      <Icon name="arrow" size={20} />
    </button>
  );
}
function BottomSheet({ title, children, onClose, kind = "" }) {
  const ref = useRef(null);
  const startY = useRef(null);
  useEffect(() => {
    const d = ref.current;
    d.showModal();
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = prev;
      if (d.open) d.close();
    };
  }, []);
  return (
    <dialog
      ref={ref}
      className={`bottom-sheet ${kind}`}
      onCancel={onClose}
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
      aria-label={title}
    >
      <div className="sheet-surface">
        <div
          className="sheet-handle"
          onTouchStart={(e) => (startY.current = e.touches[0].clientY)}
          onTouchEnd={(e) => {
            if (
              startY.current !== null &&
              e.changedTouches[0].clientY - startY.current > 65
            )
              onClose();
            startY.current = null;
          }}
        >
          <i />
        </div>
        <header className="sheet-heading">
          <h2>{title}</h2>
          <button
            className="icon-button"
            aria-label="팝업 닫기"
            onClick={onClose}
          >
            <Icon name="close" />
          </button>
        </header>
        <div className="sheet-content">{children}</div>
      </div>
    </dialog>
  );
}
function DeviceControls({ tab, setTab, device, setDevice }) {
  const [saved, setSaved] = useState(false);
  const change = (key, value) => setDevice((d) => ({ ...d, [key]: value }));
  return (
    <div className="device-controls">
      <div className="device-intro">
        <h3>우리 집 미니팜</h3>
        <p>작은 텃밭을 손끝으로 돌보세요.</p>
        <small className="demo-status">기기 연결 없이 체험 중</small>
      </div>
      <div className="device-tabs" role="tablist" aria-label="스마트 제어 항목">
        {[
          ["power", "전원"],
          ["temperature", "온도"],
          ["light", "조명"],
          ["water", "급수"],
          ["mode", "모드"],
          ["timer", "예약"],
          ["lock", "잠금"],
        ].map(([key, label]) => (
          <button
            key={key}
            role="tab"
            aria-selected={tab === key}
            onClick={() => {
              setTab(key);
              setSaved(false);
            }}
          >
            {label}
          </button>
        ))}
      </div>
      <div
        className="control-content"
        role="tabpanel"
        aria-label="선택한 기기 설정"
      >
        {tab === "power" && (
          <>
            <button
              className={`power-circle ${device.power ? "is-on" : ""}`}
              aria-label={
                device.power ? "미니팜 전원 끄기" : "미니팜 전원 켜기"
              }
              disabled={device.lock}
              onClick={() => change("power", !device.power)}
            >
              <Icon name="power" size={38} />
              <strong>{device.power ? "ON" : "OFF"}</strong>
              <span>미니팜이 {device.power ? "켜져" : "꺼져"} 있어요</span>
            </button>
            <p className="control-helper">
              터치하여 전원 {device.power ? "끄기" : "켜기"}
            </p>
          </>
        )}
        {tab === "temperature" && (
          <div className="temperature-control">
            <div className="temperature-circle">
              <span>설정 온도</span>
              <output aria-live="polite">
                {device.temperature}
                <small>°C</small>
              </output>
              <span>현재 온도 23°C</span>
            </div>
            <div className="stepper">
              <button
                aria-label="온도 1도 내리기"
                disabled={device.lock || device.temperature <= 16}
                onClick={() => change("temperature", device.temperature - 1)}
              >
                −
              </button>
              <input
                aria-label="설정 온도"
                type="range"
                min="16"
                max="30"
                value={device.temperature}
                disabled={device.lock}
                onChange={(e) => change("temperature", Number(e.target.value))}
              />
              <button
                aria-label="온도 1도 올리기"
                disabled={device.lock || device.temperature >= 30}
                onClick={() => change("temperature", device.temperature + 1)}
              >
                +
              </button>
            </div>
            <p className="control-helper">+ / − 버튼으로 온도를 조절하세요.</p>
          </div>
        )}
        {tab === "light" && (
          <div className="setting-card">
            <Icon name="sun" size={42} />
            <h3>조명 밝기</h3>
            <output>{device.light}%</output>
            <input
              aria-label="조명 밝기"
              type="range"
              min="0"
              max="100"
              step="10"
              disabled={device.lock}
              value={device.light}
              onChange={(e) => change("light", Number(e.target.value))}
            />
            <p>식물 성장 LED로 최적의 환경을 조성해요.</p>
          </div>
        )}
        {tab === "water" && (
          <div className="setting-card">
            <Icon name="water" size={42} />
            <h3>급수 제어</h3>
            <p>
              {device.water
                ? "급수 체험이 작동 중이에요."
                : "필요한 순간, 물을 공급해요."}
            </p>
            <button
              className="solid-button"
              role="switch"
              aria-label="급수"
              aria-checked={device.water}
              disabled={device.lock}
              onClick={() => change("water", !device.water)}
            >
              {device.water ? "급수 끄기" : "급수 시작"}
            </button>
          </div>
        )}
        {tab === "mode" && (
          <div className="setting-card">
            <Icon name="leaf" size={42} />
            <h3>재배 모드</h3>
            <p>키울 채소에 맞는 모드를 선택하세요.</p>
            <div className="mode-options">
              {vegetables.map((v) => (
                <button
                  key={v.name}
                  aria-pressed={device.mode === v.name}
                  disabled={device.lock}
                  onClick={() => change("mode", v.name)}
                >
                  {v.name}
                </button>
              ))}
            </div>
          </div>
        )}
        {tab === "timer" && (
          <div className="setting-card">
            <Icon name="timer" size={42} />
            <h3>시간 맞추기</h3>
            <label htmlFor="start-time">작동 시작 시간</label>
            <input
              id="start-time"
              type="time"
              disabled={device.lock}
              value={device.timer}
              onChange={(e) => {
                change("timer", e.target.value);
                setSaved(false);
              }}
            />
            <button
              className="solid-button"
              disabled={device.lock || !device.timer}
              onClick={() => setSaved(true)}
            >
              예약 저장
            </button>
            {saved && <p role="status">{device.timer} 예약을 저장했어요.</p>}
          </div>
        )}
        {tab === "lock" && (
          <div className="setting-card">
            <Icon name="lock" size={42} />
            <h3>버튼 잠금</h3>
            <p>버튼을 잠가 오작동을 방지해요.</p>
            <button
              className="solid-button"
              role="switch"
              aria-label="버튼 잠금"
              aria-checked={device.lock}
              onClick={() => change("lock", !device.lock)}
            >
              {device.lock ? "잠금 해제" : "버튼 잠그기"}
            </button>
          </div>
        )}
      </div>
      {device.lock && tab !== "lock" && (
        <p className="lock-notice" role="status">
          버튼이 잠겨 있어요.{" "}
          <button onClick={() => setTab("lock")}>잠금 해제하기</button>
        </p>
      )}
      <div className="device-power-row">
        <div>
          <strong>기기 전원</strong>
          <p>{device.power ? "켜짐 · 작동 중" : "꺼짐 · 작동 정지"}</p>
        </div>
        <button
          className={`toggle ${device.power ? "checked" : ""}`}
          role="switch"
          aria-label="기기 전원"
          aria-checked={device.power}
          disabled={device.lock}
          onClick={() => change("power", !device.power)}
        >
          <i />
        </button>
      </div>
      <p className="device-footnote">
        원하는 순간, 간편하게 ON / OFF
        <br />
        <small>실제 기기에 명령을 보내지 않는 체험 화면입니다.</small>
      </p>
      <p className="green-signature">YOUR LITTLE GREEN WORLD</p>
    </div>
  );
}
function AIChat({ showLogin }) {
  const [started, setStarted] = useState(false),
    [input, setInput] = useState(""),
    [messages, setMessages] = useState([]);
  return (
    <div className="ai-content">
      <h3>
        {started
          ? "당신의 작은 정원 친구, 팜이"
          : "오늘은 어떤 이야기를\n나눌까요?"}
      </h3>
      <img
        className="fami-large"
        src={asset + "fami.png"}
        alt="밀짚모자와 멜빵옷을 입은 정원 친구 팜이"
      />
      {!started ? (
        <>
          <h4>당신의 작은 정원 친구, 팜이</h4>
          <p>식물 이야기부터 오늘의 마음까지</p>
          <button className="outline-button" onClick={() => setStarted(true)}>
            팜이와 대화 시작하기
          </button>
          <p className="ai-login">
            이미 함께하고 있나요?{" "}
            <button onClick={showLogin}>로그인하기</button>
          </p>
        </>
      ) : (
        <>
          <p className="muted">AI 서버가 연결되지 않은 상담 체험입니다.</p>
          <div className="messages" aria-live="polite">
            {messages.map((m, i) => (
              <p key={i} className={m.me ? "mine" : ""}>
                {m.text}
              </p>
            ))}
          </div>
          <form
            className="chat-form"
            onSubmit={(e) => {
              e.preventDefault();
              if (!input.trim()) return;
              setMessages((m) => [
                ...m,
                { me: true, text: input.trim() },
                {
                  text: "안녕하세요! 현재는 대화 체험 화면이에요. 실제 상담은 AI 서비스 연결 후 이용할 수 있어요.",
                },
              ]);
              setInput("");
            }}
          >
            <input
              aria-label="팜이에게 보낼 메시지"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="팜이에게 이야기해 주세요"
            />
            <button disabled={!input.trim()}>보내기</button>
          </form>
        </>
      )}
      <p className="green-signature">YOUR LITTLE GREEN WORLD</p>
    </div>
  );
}
export default function App() {
  const location = useLocation(),
    navigate = useNavigate();
  const [sheet, setSheet] = useState(null),
    [tab, setTab] = useState("power"),
    [notice, setNotice] = useState(null);
  const [product, setProduct] = useState("wide"),
    [selected, setSelected] = useState("상추"),
    [instruction, setInstruction] = useState(0);
  const [device, setDevice] = useState({
    power: false,
    temperature: 22,
    light: 70,
    water: false,
    mode: "상추",
    timer: "08:00",
    lock: false,
  });
  useEffect(() => {
    if (location.pathname === "/control") {
      setTab(new URLSearchParams(location.search).get("tab") || "power");
      setSheet("control");
    } else if (location.pathname === "/menu" || location.pathname === "/ai")
      setSheet(location.pathname.slice(1));
    if (location.hash)
      requestAnimationFrame(() =>
        document.getElementById(location.hash.slice(1))?.scrollIntoView(),
      );
  }, [location.pathname, location.search, location.hash]);
  const openControl = (name = "power") => {
    setTab(name);
    setSheet("control");
  };
  const close = () => {
    setSheet(null);
    setNotice(null);
    if (location.pathname !== "/") navigate("/", { replace: true });
  };
  const info = (title, text, phone = false) => {
    setNotice({ title, text, phone });
    setSheet("notice");
  };
  const account = () =>
    info(
      "계정 서비스 안내",
      "로그인·회원가입·마이페이지는 계정 서버 연결 후 사용할 수 있어요. 현재는 회원 정보를 저장하거나 전송하지 않습니다.",
    );
  const scroll = (id) => {
    close();
    setTimeout(
      () => document.getElementById(id)?.scrollIntoView({ behavior: "smooth" }),
      0,
    );
  };
  const steps = [
    ["LIGHT", "빛 조정하기", "LED 점등과 함께 간편하게 시작해요.", "light"],
    ["MODE", "모드 설정하기", "원하는 재배 모드를 손쉽게 선택해요.", "mode"],
    ["TIMER", "시간 맞추기", "생활 리듬에 맞춰 시간을 설정해요.", "timer"],
    ["DRAIN", "물 채우기", "배수 기능으로 관리까지 간편하게.", "water"],
    ["HARVEST", "바로 먹기!", "수확이 실제 식탁 경험으로 연결", "vegetables"],
  ];
  const instructionNames = [
    "전원버튼(LED점등)",
    "재배 모드 선택",
    "LED 밝기 조절",
    "버튼 잠금",
    "작동 시간 설정",
  ];
  return (
    <div className="site-shell">
      <header className="site-header" data-preview="header">
        <button
          className="brand-link"
          aria-label="웰스 홈"
          onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
        >
          <Brand />
        </button>
        <button
          className="menu-button"
          aria-label="메뉴 열기"
          onClick={() => setSheet("menu")}
        >
          <Icon name="menu" />
        </button>
      </header>
      <main>
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
          <Action light onClick={() => scroll("structure")}>
            제품 구조 보기
          </Action>
        </section>
        <section className="assistant-strip" data-preview="assistant">
          <button className="assistant-message" onClick={() => setSheet("ai")}>
            안녕하세요 팜이예요!
            <br />
            궁금한 게 있으시면 말씀해 주세요!
          </button>
          <button
            className="fami-button"
            aria-label="AI 팜이에게 상담하기"
            onClick={() => setSheet("ai")}
          >
            <img src={asset + "fami.png"} alt="팜이" />
          </button>
        </section>
        <section
          className="products section-pad"
          id="products"
          data-preview="products"
          aria-labelledby="products-title"
        >
          <h2 id="products-title">
            집 안에 들이는
            <br />
            작은 우리 정원
          </h2>
          <p className="section-description">
            누구나 쉽고 편리하게 채소를 키우고,
            <br />
            직접 길러 더욱 믿을 수 있는 신선함을 경험해보세요.
          </p>
          <div className="product-card">
            <div
              className="product-tabs"
              role="tablist"
              aria-label="미니팜 제품"
            >
              {[
                ["wide", "Wide · 12구"],
                ["slim", "Slim · 6구"],
              ].map(([key, label]) => (
                <button
                  key={key}
                  role="tab"
                  aria-selected={product === key}
                  onClick={() => setProduct(key)}
                >
                  {label}
                </button>
              ))}
            </div>
            <div className="product-picture">
              {product === "wide" ? (
                <img
                  src={asset + "wide-product.png"}
                  alt="채소가 자라는 와이드 12구 미니팜"
                />
              ) : (
                <div className="missing-product">
                  <Icon name="pot" size={60} />
                  <strong>Slim · 6구</strong>
                  <span>슬림 제품 사진 준비 중</span>
                </div>
              )}
            </div>
            <h3>
              {product === "wide"
                ? "채소를 넉넉하게, Wide"
                : "작은 공간에도, Slim"}
            </h3>
            <p>
              {product === "wide" ? (
                <>
                  채소 소비가 많을 땐 12구 와이드형.
                  <br />
                  우리 집 공간과 식습관에 맞춰 골라보세요.
                </>
              ) : (
                <>
                  6구 슬림형을 선택했어요.
                  <br />
                  별도 제품 사진과 상세 사양은 제공되지 않았습니다.
                </>
              )}
            </p>
          </div>
        </section>
        <section
          className="structure section-pad"
          id="structure"
          data-preview="structure"
          aria-labelledby="structure-title"
        >
          <h2 id="structure-title">
            겉보다 더 궁금한,
            <br />
            안쪽의 이야기.
          </h2>
          <img
            className="inside-product"
            src={asset + "inside-product.png"}
            alt="전면 도어와 측면이 열린 미니팜 내부 구조"
          />
        </section>
        <section
          className="steps section-pad"
          data-preview="steps"
          aria-label="미니팜 사용 단계"
        >
          {steps.map(([name, title, text, target], i) => (
            <button
              className="step-card"
              key={name}
              onClick={() =>
                target === "vegetables"
                  ? scroll("vegetables")
                  : openControl(target)
              }
            >
              <span className="step-number">
                {String(i + 1).padStart(2, "0")}
              </span>
              <div>
                <div className="step-heading">
                  <strong>{name}</strong>
                  <span>{title}</span>
                </div>
                <p>{text}</p>
              </div>
            </button>
          ))}
        </section>
        <section
          className="growing-system"
          id="system"
          aria-labelledby="system-title"
        >
          <div className="system-top" data-preview="system">
            <h2 id="system-title">
              MiniFam
              <br />
              Growing System
            </h2>
            <div className="system-grid">
              <button
                className="feature-card"
                onClick={() => openControl("light")}
              >
                <Icon name="bulb" size={34} />
                <h3>식물 전용 햇살 LED</h3>
                <p>
                  식물 성장 LED로 최적의
                  <br />
                  환경을 조성해요.
                </p>
              </button>
              <button
                className="feature-card"
                onClick={() => openControl("mode")}
              >
                <Icon name="touch" size={34} />
                <h3>손쉬운 터치 버튼</h3>
                <p>
                  편리한 터치 버튼으로 손<br />
                  쉽게 조작하고 관리해요.
                </p>
              </button>
              <button
                className="feature-card glass full"
                onClick={() => openControl("temperature")}
              >
                <Icon name="temperature" size={34} />
                <h3>스마트 온도 조절</h3>
                <p>자동 쿨링 시스템으로 사계절 최적의 물온도를 조성해요.</p>
              </button>
            </div>
          </div>
          <div className="system-bottom" data-preview="system-details">
            <div className="system-grid">
              <button
                className="feature-card glass air-card"
                onClick={() =>
                  info(
                    "신선한 공기 공급",
                    "에어필터를 통해 신선한 공기를 공급해요.",
                  )
                }
              >
                <Icon name="air" size={34} />
                <h3>신선한 공기 공급</h3>
                <p>
                  에어필터를 통해 신선한
                  <br />
                  공기를 공급해요.
                </p>
              </button>
              <div className="feature-stack">
                <button
                  className="feature-card"
                  onClick={() =>
                    info(
                      "안심 무공해 배지",
                      "안심 무공해 배지로 작은 정원을 시작해 보세요.",
                    )
                  }
                >
                  <Icon name="pot" size={34} />
                  <h3>안심 무공해 배지</h3>
                </button>
                <button
                  className="feature-card"
                  onClick={() =>
                    info(
                      "투명 전면 도어",
                      "투명 전면 도어로 채소가 자라는 모습을 살펴보세요.",
                    )
                  }
                >
                  <Icon name="door" size={34} />
                  <h3>투명 전면 도어</h3>
                </button>
              </div>
            </div>
            <img
              className="moss-foreground"
              src={asset + "moss-bottom.png"}
              alt="이끼와 작은 식물이 자라는 정원"
            />
          </div>
        </section>
        <section
          className="operation section-pad"
          data-preview="operation"
          aria-labelledby="operation-title"
        >
          <h2 id="operation-title">웰스팜의 쉬운 조작방법</h2>
          <div className="operation-tabs" role="tablist" aria-label="조작방법">
            {["power", "leaf", "sun", "lock", "timer"].map((name, i) => (
              <button
                key={name}
                role="tab"
                aria-label={instructionNames[i]}
                aria-selected={instruction === i}
                onClick={() => setInstruction(i)}
              >
                <Icon name={name} size={30} />
              </button>
            ))}
          </div>
          <div className="operation-caption">
            <p aria-live="polite">{instructionNames[instruction]}</p>
            <button
              onClick={() =>
                openControl(
                  ["power", "mode", "light", "lock", "timer"][instruction],
                )
              }
            >
              직접 조작해 보기 <Icon name="arrow" size={14} />
            </button>
          </div>
        </section>
        <section
          className="vegetables section-pad"
          id="vegetables"
          data-preview="vegetables"
          aria-labelledby="vegetables-title"
        >
          <h2 id="vegetables-title">
            어떤 채소부터
            <br />
            키워볼까요?
          </h2>
          <p className="section-description">
            씨앗을 고르고, 빛과 물을 조절하며 재배 과정을
            <br />
            경험해 보세요.
          </p>
          <div className="vegetable-list">
            {vegetables.map((v) => (
              <button
                key={v.name}
                className={`vegetable-card ${selected === v.name ? "selected" : ""}`}
                aria-pressed={selected === v.name}
                onClick={() => setSelected(v.name)}
              >
                <img src={asset + v.image} alt="" />
                <span>
                  <strong>{v.name}</strong>
                  <small>{v.english}</small>
                </span>
                {selected === v.name && (
                  <span className="selection-check" aria-label="선택됨">
                    ✓
                  </span>
                )}
              </button>
            ))}
          </div>
          <Action
            onClick={() => {
              setDevice((d) => ({ ...d, mode: selected }));
              openControl("mode");
            }}
          >
            이 채소 키워보기
          </Action>
        </section>
        <section className="everyday section-pad" data-preview="everyday">
          <p className="eyebrow">GROW YOUR EVERYDAY</p>
          <h2>
            키우는 즐거움이
            <br />
            식탁 위의 신선함으로.
          </h2>
          <p>
            작은 채소를 돌보고 수확하는 일상,
            <br />
            웰스 미니팜과 함께 시작해 보세요.
          </p>
        </section>
        <section
          className="customer section-pad"
          id="customer"
          data-preview="customer"
        >
          <div className="notices">
            <h2>공지사항</h2>
            {[
              "e-웰스레터 10월호",
              "e-카탈로그 10월호",
              "[공지] 매트리스 케어 서비스 제공 품목 변경 안내",
            ].map((title) => (
              <button
                key={title}
                onClick={() =>
                  info(
                    title,
                    "제공된 디자인에는 제목만 포함되어 있습니다. 자세한 내용은 고객센터(1588-4113)로 문의해 주세요.",
                  )
                }
              >
                {title}
              </button>
            ))}
          </div>
          <div className="customer-contact">
            <h2>고객센터</h2>
            <a className="phone-number" href="tel:15884113">
              1588-4113
            </a>
            <p>
              평일 09:00~18:00
              <br />
              토요일 09:00~13:00
              <br />
              토요일은 긴급상담만 가능합니다.
            </p>
            <small>※ 고객센터(콜센터) 이용 시 통신요금이 부과됩니다.</small>
            <div className="customer-actions">
              {[
                ["headset", "구매문의"],
                ["message", "1:1문의"],
                ["tools", "AS접수"],
              ].map(([icon, title]) => (
                <button
                  key={title}
                  onClick={() =>
                    info(
                      title,
                      "평일 09:00~18:00, 토요일 09:00~13:00에 고객센터로 문의해 주세요.",
                      true,
                    )
                  }
                >
                  <span>
                    <Icon name={icon} size={30} />
                  </span>
                  {title}
                </button>
              ))}
            </div>
          </div>
        </section>
      </main>
      <footer className="footer section-pad" data-preview="footer">
        <h2>
          KYO WON <span>교원</span>
        </h2>
        <nav aria-label="회사 정보">
          {[
            "이용약관",
            "개인정보처리방침",
            "이메일주소무단수집거부",
            "판매인조회",
            "고객본인인증(Safe-key발급)",
          ].map((title) => (
            <button
              key={title}
              onClick={() =>
                info(
                  title,
                  "원문과 서비스 주소는 디자인 자료에 포함되어 있지 않습니다. 고객센터에 문의해 주세요.",
                )
              }
            >
              {title}
            </button>
          ))}
        </nav>
        <div className="social-links">
          {["YouTube", "Instagram", "Facebook"].map((name, i) => (
            <button
              key={name}
              aria-label={name}
              onClick={() =>
                info(
                  name,
                  "공식 채널 주소가 제공되지 않아 외부 계정에 연결하지 않았습니다.",
                )
              }
            >
              {["▶", "◎", "f"][i]}
            </button>
          ))}
        </div>
        <div className="company-details">
          <p>대표자 장평순 | 서울특별시 중구 을지로51(을지로2가6번지)</p>
          <p>
            사업자등록번호 101-81-39767 | 통신판매업 신고 제
            2016-서울중구-0988호
          </p>
          <p>개인정보보호책임자 Wells사업기획부문 허남석 부문장</p>
          <p>고객센터 1588-4113 / FAX 02-3408-5250</p>
          <p className="copyright">
            COPYRIGHT(C) KYOWON PROPERTY. ALL RIGHTS RESERVED.
          </p>
        </div>
      </footer>
      {sheet && (
        <BottomSheet
          title={
            sheet === "control"
              ? "스마트 제어"
              : sheet === "menu"
                ? "메뉴"
                : sheet === "ai"
                  ? "AI 팜이 상담"
                  : notice?.title || "안내"
          }
          onClose={close}
          kind={sheet}
        >
          {sheet === "control" && (
            <DeviceControls
              tab={tab}
              setTab={setTab}
              device={device}
              setDevice={setDevice}
            />
          )}
          {sheet === "menu" && (
            <div className="menu-content">
              <Brand />
              <button
                className="rental-card"
                onClick={() => scroll("products")}
              >
                <small>
                  ABOUT US <Icon name="arrow" />
                </small>
                <strong>미니팜 렌탈 서비스</strong>
                <span>작은 공간에서 자라는 일상의 싱그러움</span>
              </button>
              <button className="menu-row" onClick={() => openControl()}>
                스마트 제어 <Icon name="arrow" />
              </button>
              <button className="menu-row" onClick={() => scroll("customer")}>
                고객센터 <Icon name="arrow" />
              </button>
              <button className="menu-ai" onClick={() => setSheet("ai")}>
                <strong>AI 팜이에게 상담하기</strong>
                <span>무엇이든 편하게 물어보세요</span>
                <img src={asset + "fami.png"} alt="팜이" />
              </button>
              <div className="account-links">
                <button onClick={account}>로그인</button>
                <button onClick={account}>회원가입</button>
                <button onClick={account}>
                  <Icon name="user" size={20} />
                  마이페이지
                </button>
              </div>
              <p className="green-signature">YOUR LITTLE GREEN WORLD</p>
            </div>
          )}
          {sheet === "ai" && <AIChat showLogin={account} />}
          {sheet === "notice" && notice && (
            <div className="notice-content">
              <p>{notice.text}</p>
              {notice.phone && (
                <a className="solid-button" href="tel:15884113">
                  1588-4113 전화하기
                </a>
              )}
              <button className="solid-button" onClick={close}>
                확인
              </button>
            </div>
          )}
        </BottomSheet>
      )}
    </div>
  );
}
