import { useEffect, useRef, useState } from "react";

export default function Prototype3D() {
  const canvas = useRef(null),
    stage = useRef(null),
    journey = useRef(null),
    viewer = useRef(null);
  const [progress, setProgress] = useState(0),
    [error, setError] = useState(""),
    [ready, setReady] = useState(false);
  useEffect(() => {
    let cancelled = false;
    import("./lib/prototype3d/viewer.js")
      .then((module) => {
        if (cancelled) return;
        try {
          viewer.current = module.mountViewer({
            canvas: canvas.current,
            stage: stage.current,
            journey: journey.current,
            onProgress: setProgress,
          });
          setReady(true);
        } catch (e) {
          setError(e.message);
        }
      })
      .catch(() => {
        if (!cancelled)
          setError(
            "3D 파일을 불러오지 못했습니다. 새로고침 후 다시 시도해 주세요.",
          );
      });
    return () => {
      cancelled = true;
      viewer.current?.dispose();
      viewer.current = null;
    };
  }, []);
  return (
    <div
      ref={journey}
      className="model-journey"
      aria-label="스크롤 3D 분해 체험"
    >
      <div className="model-viewer">
        <div className="model-stage" ref={stage}>
          <canvas
            ref={canvas}
            tabIndex="0"
            aria-label="제품 3D 모델. 드래그로 회전, 방향키로 회전, 더하기와 빼기로 확대 축소할 수 있습니다."
            aria-describedby="model-help"
          />
          {!ready && !error && (
            <p className="model-loading" role="status">
              3D 모델을 불러오는 중이에요.
            </p>
          )}
          {error && (
            <p className="model-error" role="alert">
              {error}
            </p>
          )}
        </div>
        <div className="model-toolbar">
          <p id="model-help">
            스크롤하면 분해되고, 좌우로 드래그하면 회전해요.
          </p>
          <label className="model-progress">
            분해 진행 <output>{Math.round(progress * 100)}%</output>
            <input
              aria-label="분해 진행"
              type="range"
              min="0"
              max="100"
              step="1"
              disabled={!ready || !!error}
              value={Math.round(progress * 100)}
              onChange={(e) =>
                viewer.current?.setProgress(Number(e.target.value) / 100)
              }
            />
          </label>
          <div className="model-views">
            {[
              ["front", "앞면"],
              ["back", "뒷면"],
              ["side", "옆면"],
              ["all", "전체"],
            ].map(([key, label]) => (
              <button
                key={key}
                disabled={!ready || !!error}
                onClick={() => viewer.current?.setView(key)}
              >
                {label}
              </button>
            ))}
            <button
              disabled={!ready || !!error}
              onClick={() => viewer.current?.reset()}
            >
              조립 상태로
            </button>
          </div>
          <small>
            사진을 참고한 시연용 모델이며 실제 CAD 구조와 다를 수 있습니다.
          </small>
        </div>
      </div>
    </div>
  );
}
