import { useState } from "react";
import Prototype3D from "../Prototype3D";

export default function Structure({ onNavigate }) {
  const [structureStep, setStructureStep] = useState(null);
  const structureCopy = [
    "LIGHT · 상부 조명으로 식물에 빛을 전해요.",
    "MODE · 식물이 자라는 재배 공간을 살펴보세요.",
    "TIMER · 생활 리듬에 맞춰 시간을 설정해요.",
    "DRAIN · 하부 물통에서 물을 공급하고 관리해요.",
    "HARVEST · 직접 키운 신선함을 식탁으로.",
  ];
  const selectStructure = (index) => {
    setStructureStep(index);
    if (index === 4) onNavigate("/seed");
  };
  const steps = [
    ["LIGHT", "빛 조정하기", "LED 점등과 함께 간편하게 시작해요.", "light"],
    ["MODE", "모드 설정하기", "원하는 재배 모드를 손쉽게 선택해요.", "mode"],
    ["TIMER", "시간 맞추기", "생활 리듬에 맞춰 시간을 설정해요.", "timer"],
    ["DRAIN", "물 채우기", "배수 기능으로 관리까지 간편하게.", "water"],
    ["HARVEST", "바로 먹기!", "수확이 실제 식탁 경험으로 연결", "vegetables"],
  ];
  return (
    <>
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
          <Prototype3D />
        </section>
        <section
          className="steps section-pad"
          data-preview="steps"
          aria-label="미니팜 사용 단계"
        >
          {structureStep !== null && (
            <p className="structure-step-caption" aria-live="polite">
              {structureCopy[structureStep]}
            </p>
          )}
          {steps.map(([name, title, text], i) => (
            <button
              className="step-card"
              key={name}
              aria-pressed={structureStep === i}
              onClick={() => selectStructure(i)}
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
    </>
  );
}
