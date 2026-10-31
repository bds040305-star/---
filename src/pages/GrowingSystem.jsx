import { useState } from "react";
import { asset, Icon } from "../components/FarmUI";

export default function GrowingSystem({ openControl, info }) {
  const [instruction, setInstruction] = useState(0);
  const instructionNames = [
    "전원버튼(LED점등)",
    "재배 모드 선택",
    "LED 밝기 조절",
    "버튼 잠금",
    "작동 시간 설정",
  ];
  return (
    <>
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
    </>
  );
}
