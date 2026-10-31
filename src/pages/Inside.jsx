import { useState } from "react";
import { asset, Icon } from "../components/FarmUI";

export default function Inside({ onChat }) {
  const [product, setProduct] = useState("wide");
  return (
    <>
        <section className="assistant-strip" data-preview="assistant">
          <button className="assistant-message" onClick={() => onChat()}>
            안녕하세요 팜이예요!
            <br />
            궁금한 게 있으시면 말씀해 주세요!
          </button>
          <button
            className="fami-button"
            aria-label="AI 팜이에게 상담하기"
            onClick={() => onChat()}
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
    </>
  );
}
