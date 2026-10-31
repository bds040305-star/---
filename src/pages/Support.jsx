import { Icon } from "../components/FarmUI";

export default function Support({ info }) {
  return (
    <>
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
    </>
  );
}
