import { createContext, useContext, useEffect, useRef, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";

const design = "/design/";
function Hit({ label, x, y, w, h, height = 780, to, href, onClick }) {
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
  return href ? (
    <a {...props} href={href} />
  ) : to ? (
    <Link {...props} to={to} />
  ) : (
    <button {...props} type="button" onClick={onClick} />
  );
}
const NoticeContext = createContext(() => {});
function Notice({ value, close }) {
  const ref = useRef(null);
  useEffect(() => {
    if (value) ref.current?.showModal();
  }, [value]);
  if (!value) return null;
  return (
    <dialog
      ref={ref}
      className="notice"
      onCancel={close}
      onClick={(e) => {
        if (e.target === e.currentTarget) close();
      }}
      aria-labelledby="notice-title"
    >
      <h2 id="notice-title">{value.title}</h2>
      <p>{value.text}</p>
      {value.to && (
        <Link className="notice-action" to={value.to} onClick={close}>
          {value.action}
        </Link>
      )}
      {value.href && (
        <a className="notice-action" href={value.href}>
          {value.action}
        </a>
      )}
      <button onClick={close}>확인</button>
    </dialog>
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
const sections = [
  ["header", 0, 110, "웰스 헤더"],
  ["hero", 110, 830, "Your space. Your planet."],
  ["assistant", 830, 970, "AI 팜이 상담"],
  ["products", 970, 1600, "집 안에 들이는 작은 우리 정원"],
  ["structure", 1600, 2200, "겉보다 더 궁금한, 안쪽의 이야기"],
  ["steps", 2200, 2782, "미니팜 조작 단계"],
  ["system", 2782, 3260, "MiniFam Growing System"],
  ["system-details", 3260, 3595, "공기 공급 · 배지 · 전면 도어"],
  ["operation", 3595, 3870, "웰스팜의 쉬운 조작방법"],
  ["vegetables", 3870, 4470, "어떤 채소부터 키워볼까요?"],
  ["everyday", 4470, 4695, "키우는 즐거움이 식탁 위의 신선함으로"],
  ["customer", 4695, 5185, "공지사항 및 고객센터"],
  ["footer", 5185, 5485, "교원 회사 정보"],
];
function Home() {
  const show = useContext(NoticeContext);
  const navigate = useNavigate();
  const [product, setProduct] = useState("wide");
  const [vegetable, setVegetable] = useState("상추");
  const [instruction, setInstruction] = useState(0);
  const scroll = (id) =>
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
  const actions = [
    {
      label: "웰스 홈",
      x: 40,
      y: 28,
      w: 110,
      h: 47,
      onClick: () => window.scrollTo({ top: 0, behavior: "smooth" }),
    },
    { label: "메뉴 열기", x: 310, y: 18, w: 57, h: 67, to: "/menu" },
    {
      label: "제품 구조 보기",
      x: 32,
      y: 736,
      w: 326,
      h: 56,
      onClick: () => scroll("structure"),
    },
    {
      label: "AI 팜이에게 상담하기",
      x: 109,
      y: 830,
      w: 263,
      h: 106,
      to: "/ai",
    },
    {
      label: "Wide · 12구",
      x: 40,
      y: 1154,
      w: 153,
      h: 47,
      onClick: () => setProduct("wide"),
    },
    {
      label: "Slim · 6구",
      x: 200,
      y: 1154,
      w: 152,
      h: 47,
      onClick: () => setProduct("slim"),
    },
    ...["light", "mode", "timer", "water"].map((tab, i) => ({
      label: ["빛 조정하기", "모드 설정하기", "시간 맞추기", "물 채우기"][i],
      x: 24,
      y: 2220 + i * 98,
      w: 341,
      h: 83,
      to: "/control?tab=" + tab,
    })),
    {
      label: "바로 먹기 — 채소 선택",
      x: 24,
      y: 2612,
      w: 341,
      h: 83,
      onClick: () => scroll("vegetables"),
    },
    ...[
      ["식물 전용 햇살 LED", 24, 2938, 165, 164, "light"],
      ["손쉬운 터치 버튼", 201, 2938, 165, 164, "mode"],
      ["스마트 온도 조절", 24, 3114, 342, 140, "temperature"],
      ["신선한 공기 공급", 24, 3266, 165, 240, "air"],
      ["안심 무공해 배지", 201, 3266, 165, 114, "medium"],
      ["투명 전면 도어", 201, 3393, 165, 114, "door"],
    ].map(([label, x, y, w, h, tab]) => ({
      label,
      x,
      y,
      w,
      h,
      onClick: () =>
        ["light", "mode", "temperature"].includes(tab)
          ? navigate("/control?tab=" + tab)
          : show({
              title: label,
              text: {
                air: "에어필터를 통해 신선한 공기를 공급해요.",
                medium: "안심 무공해 배지로 작은 정원을 시작해 보세요.",
                door: "투명 전면 도어로 채소가 자라는 모습을 살펴보세요.",
              }[tab],
            }),
    })),
    ...["전원", "재배 모드", "LED 조명", "잠금", "타이머"].map((name, i) => ({
      label: name + " 조작방법",
      x: 26 + i * 65,
      y: 3710,
      w: 63,
      h: 65,
      onClick: () => setInstruction(i),
    })),
    ...["상추", "루꼴라", "청경채"].map((name, i) => ({
      label: name + " 선택",
      x: 24,
      y: 4032 + i * 102,
      w: 342,
      h: 90,
      onClick: () => setVegetable(name),
    })),
    {
      label: "이 채소 키워보기",
      x: 24,
      y: 4356,
      w: 342,
      h: 56,
      onClick: () =>
        show({
          title: vegetable + " 키우기",
          text:
            vegetable +
            "를 선택했어요. 재배 모드를 선택하고 조명과 온도를 설정해 보세요.",
          to: "/control?tab=mode",
          action: "재배 모드 설정하기",
        }),
    },
    ...[
      "e-웰스레터 10월호",
      "e-카탈로그 10월호",
      "[공지] 매트리스 케어 서비스 제공 품목 변경 안내",
    ].map((title, i) => ({
      label: title,
      x: 24,
      y: 4754 + i * 28,
      w: 342,
      h: 28,
      onClick: () =>
        show({
          title,
          text: "제공된 디자인에는 제목만 포함되어 있습니다. 자세한 내용은 고객센터(1588-4113)로 문의해 주세요.",
        }),
    })),
    {
      label: "고객센터 1588-4113 전화하기",
      x: 24,
      y: 4924,
      w: 225,
      h: 43,
      href: "tel:15884113",
    },
    ...["구매문의", "1:1문의", "AS접수"].map((title, i) => ({
      label: title,
      x: 30 + i * 120,
      y: 5053,
      w: 90,
      h: 111,
      onClick: () =>
        show({
          title,
          text: "평일 09:00~18:00, 토요일 09:00~13:00에 고객센터로 문의해 주세요. 일요일은 긴급상담만 가능합니다.",
          href: "tel:15884113",
          action: "1588-4113 전화하기",
        }),
    })),
    ...[
      ["이용약관", 24, 5240, 52],
      ["개인정보처리방침", 76, 5240, 112],
      ["이메일주소무단수집거부", 24, 5265, 146],
      ["판매인조회", 173, 5265, 83],
      ["고객본인인증(Safe-key발급)", 24, 5290, 220],
    ].map(([title, x, y, w]) => ({
      label: title,
      x,
      y,
      w,
      h: 24,
      onClick: () =>
        show({
          title,
          text: "이 항목의 원문과 서비스 주소는 디자인 자료에 포함되어 있지 않습니다. 고객센터에 문의해 주세요.",
        }),
    })),
    ...["YouTube", "Instagram", "Facebook"].map((name, i) => ({
      label: name,
      x: 272 + i * 32,
      y: 5282,
      w: 28,
      h: 31,
      onClick: () =>
        show({
          title: name,
          text: "공식 채널 주소가 제공되지 않았습니다. 임의의 외부 계정으로 연결하지 않습니다.",
        }),
    })),
  ];
  return (
    <main className="home-sections" aria-label="웰스 미니팜">
      {sections.map(([id, start, end, title]) => (
        <section className="design-section" id={id} key={id} aria-label={title}>
          <img
            className="design-image"
            src={`${design}sections/${id}.png`}
            width="390"
            height={end - start}
            alt={title}
            draggable="false"
            loading={start > 1600 ? "lazy" : "eager"}
          />
          {actions
            .filter((a) => a.y >= start && a.y < end)
            .map((a) => (
              <Hit key={a.label} {...a} y={a.y - start} height={end - start} />
            ))}
          {id === "products" && product === "slim" && (
            <div className="slim-product">
              <div className="product-tab-row">
                <button onClick={() => setProduct("wide")}>Wide · 12구</button>
                <button
                  className="selected"
                  aria-pressed="true"
                  onClick={() => setProduct("slim")}
                >
                  Slim · 6구
                </button>
              </div>
              <div
                className="slim-placeholder"
                aria-label="슬림 제품 사진 미제공"
              >
                <span>🌱</span>
                <strong>Slim · 6구</strong>
                <small>슬림 제품 이미지는 준비 중입니다.</small>
              </div>
              <h3>작은 공간에도, Slim</h3>
              <p>6구 슬림형을 선택했어요.</p>
              <p className="muted">
                별도 제품 사진과 상세 사양은 제공되지 않았습니다.
              </p>
            </div>
          )}
          {id === "operation" && instruction !== 0 && (
            <div className="instruction-caption">
              <p>
                {
                  [
                    "",
                    "재배 모드를 선택해 주세요.",
                    "조명의 밝기를 조절해 주세요.",
                    "버튼을 잠가 오작동을 방지해요.",
                    "원하는 작동 시간을 설정해요.",
                  ][instruction]
                }
              </p>
              <Link
                to={
                  "/control?tab=" +
                  ["power", "mode", "light", "lock", "timer"][instruction]
                }
              >
                직접 조작해 보기 →
              </Link>
            </div>
          )}
          {id === "vegetables" && vegetable !== "상추" && (
            <div className="original-selection-mask" aria-hidden="true" />
          )}
          {id === "vegetables" && vegetable !== "상추" && (
            <div
              className="vegetable-selection"
              style={{
                top: `${((4032 + ["상추", "루꼴라", "청경채"].indexOf(vegetable) * 102 - start) / (end - start)) * 100}%`,
              }}
              aria-live="polite"
            >
              <span>{vegetable} 선택됨 ✓</span>
            </div>
          )}
        </section>
      ))}
    </main>
  );
}

function Menu() {
  const show = useContext(NoticeContext);
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
      <Hit
        label="로그인 안내"
        x={24}
        y={666}
        w={61}
        h={40}
        onClick={() =>
          show({
            title: "계정 서비스 안내",
            text: "로그인·회원가입·마이페이지는 계정 서버 연결 후 사용할 수 있습니다. 현재는 회원 정보를 저장하거나 전송하지 않습니다.",
          })
        }
      />
      <Hit
        label="회원가입 안내"
        x={99}
        y={666}
        w={85}
        h={40}
        onClick={() =>
          show({
            title: "계정 서비스 안내",
            text: "로그인·회원가입·마이페이지는 계정 서버 연결 후 사용할 수 있습니다. 현재는 회원 정보를 저장하거나 전송하지 않습니다.",
          })
        }
      />
      <Hit
        label="마이페이지 안내"
        x={260}
        y={666}
        w={108}
        h={40}
        onClick={() =>
          show({
            title: "계정 서비스 안내",
            text: "로그인·회원가입·마이페이지는 계정 서버 연결 후 사용할 수 있습니다. 현재는 회원 정보를 저장하거나 전송하지 않습니다.",
          })
        }
      />
    </Screen>
  );
}
function Control({
  power,
  setPower,
  temperature,
  setTemperature,
  settings,
  setSettings,
}) {
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
        to="/control?tab=light"
      />
      <Hit
        label="급수 제어"
        x={344}
        y={190}
        w={46}
        h={40}
        to="/control?tab=water"
      />
      {tab && tab !== "temperature" && (
        <section className="settings-panel" aria-label="기기 설정">
          <h2>
            {{
              light: "조명 제어",
              water: "급수 제어",
              mode: "재배 모드",
              timer: "시간 맞추기",
              lock: "버튼 잠금",
            }[tab] || "기기 설정"}
          </h2>
          {tab === "light" && (
            <>
              <output aria-live="polite">{settings.light}%</output>
              <label>
                조명 밝기
                <input
                  aria-label="조명 밝기"
                  type="range"
                  min="0"
                  max="100"
                  step="10"
                  value={settings.light}
                  onChange={(e) =>
                    setSettings((v) => ({
                      ...v,
                      light: Number(e.target.value),
                    }))
                  }
                />
              </label>
            </>
          )}
          {tab === "water" && (
            <>
              <p>
                {settings.water
                  ? "급수 시연이 켜져 있어요."
                  : "급수 시연이 꺼져 있어요."}
              </p>
              <button
                role="switch"
                aria-label="급수"
                aria-checked={settings.water}
                onClick={() => setSettings((v) => ({ ...v, water: !v.water }))}
              >
                {settings.water ? "급수 끄기" : "급수 시작"}
              </button>
            </>
          )}
          {tab === "mode" && (
            <div className="mode-options">
              {["상추", "루꼴라", "청경채"].map((name) => (
                <button
                  key={name}
                  aria-pressed={settings.mode === name}
                  onClick={() => setSettings((v) => ({ ...v, mode: name }))}
                >
                  {name} {settings.mode === name ? "✓" : ""}
                </button>
              ))}
            </div>
          )}
          {tab === "timer" && (
            <>
              <label>
                작동 시작 시간
                <input
                  aria-label="작동 시작 시간"
                  type="time"
                  value={settings.timer}
                  onChange={(e) =>
                    setSettings((v) => ({ ...v, timer: e.target.value }))
                  }
                />
              </label>
              <button
                onClick={() =>
                  setMessage(settings.timer + " 예약을 시연 화면에 저장했어요.")
                }
              >
                예약 저장
              </button>
            </>
          )}
          {tab === "lock" && (
            <button
              role="switch"
              aria-label="버튼 잠금"
              aria-checked={settings.lock}
              onClick={() => setSettings((v) => ({ ...v, lock: !v.lock }))}
            >
              {settings.lock ? "잠금 해제" : "버튼 잠그기"}
            </button>
          )}
          <small>실제 기기 연결 없이 동작하는 시연입니다.</small>
          <Link to="/control">전원 화면으로 돌아가기</Link>
        </section>
      )}
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
      ) : !tab ? (
        <>
          <Hit
            label={power ? "미니팜 전원 끄기" : "미니팜 전원 켜기"}
            x={68}
            y={226}
            w={254}
            h={254}
            onClick={() => setPower(!power)}
          />
        </>
      ) : null}
      <button
        className="design-hit"
        style={{ left: "72%", top: "73%", width: "18%", height: "7%" }}
        role="switch"
        aria-label="기기 전원"
        aria-checked={power}
        onClick={() => setPower(!power)}
      />
      {tab && (
        <div className="device-status">
          <strong>기기 전원</strong>
          <span>{power ? "켜짐 · 작동 중" : "꺼짐 · 작동 정지"}</span>
          <i className={power ? "switch-on" : ""} />
        </div>
      )}
      {message && (
        <div className="control-message" role="status">
          {message}
          <button onClick={() => setMessage("")}>닫기</button>
        </div>
      )}
      {tab === "temperature" && (
        <button className="temperature-back" onClick={() => go("/control")}>
          전원 제어로 돌아가기
        </button>
      )}
    </Screen>
  );
}
function AI() {
  const show = useContext(NoticeContext);
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
        onClick={() =>
          show({
            title: "로그인 안내",
            text: "계정 서비스가 아직 연결되어 있지 않습니다. 로그인 없이 상담 시연을 이용할 수 있습니다.",
          })
        }
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
  const [notice, setNotice] = useState(null);
  const [settings, setSettings] = useState({
    light: 70,
    water: false,
    mode: "상추",
    timer: "08:00",
    lock: false,
  });
  useEffect(() => {
    if (location.hash)
      requestAnimationFrame(() =>
        document.getElementById(location.hash.slice(1))?.scrollIntoView(),
      );
    else window.scrollTo(0, 0);
    setNotice(null);
  }, [location.pathname, location.hash]);
  let view = <Home />;
  if (location.pathname === "/menu") view = <Menu />;
  if (location.pathname === "/control")
    view = (
      <Control
        power={power}
        setPower={setPower}
        temperature={temperature}
        setTemperature={setTemperature}
        settings={settings}
        setSettings={setSettings}
      />
    );
  if (location.pathname === "/ai") view = <AI />;
  return (
    <NoticeContext.Provider value={setNotice}>
      {view}
      <Notice value={notice} close={() => setNotice(null)} />
    </NoticeContext.Provider>
  );
}
