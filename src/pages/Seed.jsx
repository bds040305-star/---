import { useState } from "react";
import { asset, vegetables, Action } from "../components/FarmUI";

export default function Seed({ onSelect, openControl }) {
  const [selected, setSelected] = useState("상추");
  return (
    <>
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
              onSelect(selected);
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
    </>
  );
}
