import { useEffect, useRef, useState } from "react";
import { useLocation, useNavigate, NavLink, Routes, Route, Navigate } from "react-router-dom";
import { asset, vegetables, Icon, Brand } from "./components/FarmUI";
import Home from "./pages/Home";
import Inside from "./pages/Inside";
import Structure from "./pages/Structure";
import GrowingSystem from "./pages/GrowingSystem";
import Seed from "./pages/Seed";
import Support from "./pages/Support";
import Login, { LoginComplete, AccountHelp } from "./pages/Login";
import AIWelcome from "./pages/AIWelcome";
import FarmChat, { initialConversation } from "./pages/FarmChat";
import Register from "./pages/Register";

const pages = [
  ["/", "홈"],
  ["/products", "제품 소개"],
  ["/structure", "3D 구조"],
  ["/how-it-works", "사용 방법"],
  ["/seed", "채소 고르기"],
  ["/support", "고객센터"],
];

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
export default function App() {
  const location = useLocation(),
    navigate = useNavigate();
  const [sheet, setSheet] = useState(null),
    [tab, setTab] = useState("power"),
    [notice, setNotice] = useState(null);
  const [loggedIn, setLoggedIn] = useState(() => {
    try { return sessionStorage.getItem("wells_demo_session") === "active"; }
    catch { return false; }
  });
  const [farm, setFarm] = useState({ name: "쑥쑥이", plant: "청경채", registered: false });
  const [messages, setMessages] = useState([...initialConversation]);
  const immersive = ["/ai", "/chat", "/login", "/login/complete", "/register", "/signup", "/reset-password"].includes(location.pathname);
  const [device, setDevice] = useState({
    waterLevel: "low",
    power: false,
    temperature: 22,
    light: 70,
    water: false,
    mode: "청경채",
    timer: "08:00",
    lock: false,
  });
  useEffect(() => {
    try {
      if (loggedIn) sessionStorage.setItem("wells_demo_session", "active");
      else sessionStorage.removeItem("wells_demo_session");
    } catch { /* The demo still works when browser storage is disabled. */ }
  }, [loggedIn]);
  useEffect(() => {
    if (location.pathname === "/control") {
      setTab(new URLSearchParams(location.search).get("tab") || "power");
      setSheet("control");
    } else if (location.pathname === "/menu")
      setSheet(location.pathname.slice(1));
    else setSheet(null);
    window.scrollTo({ top: 0, behavior: "instant" });
    const label = ({ "/ai": "팜이", "/chat": "팜이 상담", "/login": "로그인", "/login/complete": "로그인 완료", "/register": "미니팜 등록", "/signup": "회원가입 안내", "/reset-password": "비밀번호 안내" })[location.pathname] || pages.find(([path]) => path === location.pathname)?.[1] || "홈";
    document.title = `${label} · Mini Farm — 비공식 디자인 데모`;
  }, [location.pathname, location.search, location.hash]);
  const openControl = (name = "power") => {
    setTab(name);
    setSheet("control");
  };
  const close = () => {
    setSheet(null);
    setNotice(null);
    if (["/control", "/menu"].includes(location.pathname)) navigate("/", { replace: true });
  };
  const info = (title, text, phone = false) => {
    setNotice({ title, text, phone });
    setSheet("notice");
  };
  const account = () => navigatePage("/login");
  const navigatePage = (path) => {
    setSheet(null);
    setNotice(null);
    navigate(path);
  };
  return (
    <div className="site-shell">
      {!immersive && <>
      <header className="site-header" data-preview="header">
        <button
          className="brand-link"
          aria-label="웰스 홈"
          onClick={() => navigatePage("/")}
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
      <nav className="page-navigation" aria-label="페이지 메뉴">
        {pages.map(([to, label]) => (
          <NavLink key={to} to={to} end>{label}</NavLink>
        ))}
      </nav>
      </>}
      <main id="page-content" className={immersive ? "experience-main" : undefined} tabIndex={-1}>
        <Routes>
          <Route path="/" element={<Home onNavigate={navigatePage} />} />
          <Route path="/products" element={<Inside onChat={() => navigatePage("/ai")} />} />
          <Route path="/inside" element={<Navigate to="/products" replace />} />
          <Route path="/structure" element={<Structure onNavigate={navigatePage} />} />
          <Route path="/how-it-works" element={<GrowingSystem openControl={openControl} info={info} />} />
          <Route path="/seed" element={<Seed onSelect={(mode) => setDevice((d) => ({ ...d, mode }))} openControl={openControl} />} />
          <Route path="/support" element={<Support info={info} />} />
          <Route path="/control" element={<Home onNavigate={navigatePage} />} />
          <Route path="/menu" element={<Home onNavigate={navigatePage} />} />
          <Route path="/ai" element={<AIWelcome loggedIn={loggedIn} />} />
          <Route path="/chat" element={<FarmChat messages={messages} setMessages={setMessages} farm={{ ...farm, plant: device.mode }} device={device} setDevice={setDevice} openControl={openControl} />} />
          <Route path="/login" element={<Login onLogin={() => setLoggedIn(true)} />} />
          <Route path="/login/complete" element={loggedIn ? <LoginComplete /> : <Navigate to="/login" replace />} />
          <Route path="/register" element={<Register farm={{ ...farm, plant: device.mode }} onRegister={(next) => {
            setFarm({ ...next, registered: true });
            setDevice((d) => ({ ...d, mode: next.plant }));
          }} />} />
          <Route path="/signup" element={<AccountHelp />} />
          <Route path="/reset-password" element={<AccountHelp reset />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </main>
      {!immersive && <footer className="footer section-pad" data-preview="footer">
        <p className="demo-notice" role="note" aria-label="비공식 데모 안내">
          비공식 디자인 데모 · 교원·Wells 공식 사이트가 아닙니다.
        </p>
        <h2>
          MINI FARM <span>비공식 데모</span>
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
                  "이 항목은 화면 구성 체험용입니다. 이 데모는 실제 약관 동의, 판매인 조회 또는 본인인증을 제공하지 않습니다.",
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
          <p>제품 소개 화면과 인터랙션을 재현한 비공식 디자인 데모입니다.</p>
          <p>교원·Wells와의 제휴 또는 공식 운영을 의미하지 않습니다.</p>
          <p>기기 제어·계정·AI 상담은 실제 서비스에 연결되지 않습니다.</p>
          <p className="copyright">
            제품명과 상표의 권리는 각 권리자에게 있습니다.
          </p>
        </div>
      </footer>}
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
                onClick={() => navigatePage("/products")}
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
              {pages.map(([path, label]) => (
                <button key={path} className="menu-row" onClick={() => navigatePage(path)}>
                  {label} <Icon name="arrow" />
                </button>
              ))}
              <button className="menu-ai" onClick={() => navigatePage("/ai")}>
                <strong>AI 팜이에게 상담하기</strong>
                <span>무엇이든 편하게 물어보세요</span>
                <img src={asset + "fami.png"} alt="팜이" />
              </button>
              <div className="account-links">
                <button onClick={loggedIn ? () => { setLoggedIn(false); setSheet(null); } : account}>{loggedIn ? "로그아웃" : "로그인"}</button>
                <button onClick={() => navigatePage("/signup")}>회원가입</button>
                <button onClick={() => navigatePage(loggedIn ? "/register" : "/login")}>
                  <Icon name="user" size={20} />
                  마이페이지
                </button>
              </div>
              <p className="green-signature">YOUR LITTLE GREEN WORLD</p>
            </div>
          )}
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
