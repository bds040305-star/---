# 팜이의 실제 AI 대화 연결

현재 GitHub Pages는 정적 웹사이트라서 AI 모델을 직접 실행할 수 없습니다.
이 저장소의 `server/fami-worker.js`를 Cloudflare Workers로 배포하면, 질문과 최근 대화를 Workers AI 모델에 전달합니다.
기본 방식은 **Cloudflare Workers AI 바인딩**이므로 OpenAI 계정이나 API 키가 필요하지 않습니다.
무료 제공량과 한도는 Cloudflare의 현재 요금 정책 및 계정에서 확인하세요. 무제한 무료 서비스는 아닙니다.

## 1. Cloudflare 계정과 Worker 만들기

1. https://dash.cloudflare.com/ 에서 본인 계정으로 로그인합니다.
2. Workers & Pages에서 Git 저장소로 Worker를 만드는 흐름을 선택합니다.
3. GitHub 계정을 연결하고 `bds040305-star/wells` 저장소, `main` 브랜치를 선택합니다.
4. 루트 디렉터리는 저장소 루트입니다. 별도 빌드 명령은 필요하지 않습니다.
5. 배포 명령은 `npx wrangler@4.156.0 deploy`로 설정합니다.
6. 배포하면 `wrangler.toml`의 AI 바인딩과 호출 제한이 적용됩니다.
7. 생성된 공개 Worker 주소를 확인합니다. 예: `https://fami-chat-api.<계정주소>.workers.dev`.

Cloudflare에 GitHub 저장소 접근을 허용하는 작업은 본인 계정에서 해야 합니다.
이 작업은 GitHub Pages 배포 설정을 바꾸지 않습니다. 프런트엔드는 기존 GitHub Pages에 남습니다.
대시보드 명칭이 바뀐 경우 GitHub 저장소를 가져오는 **Worker** 배포 흐름을 사용하세요.

CLI를 사용하는 경우 저장소에서 다음 명령으로 같은 Worker를 배포할 수 있습니다.

```sh
npx wrangler@4.156.0 login
npx wrangler@4.156.0 deploy
```

기본 AI 모델은 `@cf/meta/llama-3.3-70b-instruct-fp8-fast`입니다.
현재 계정에서 모델 이용이 제한되거나 모델이 변경되면, `wrangler.toml`의 `FAMI_AI_MODEL`을 계정에서 지원하는 대화 모델로 변경한 뒤 재배포해야 합니다.
모델 호출은 Cloudflare 계정이 연결된 실제 배포에서 확인해야 하며, dry-run은 모델 응답을 검증하지 않습니다.

## 2. GitHub Pages에 서버 주소 연결

GitHub 저장소의 Settings → Secrets and variables → Actions → Variables에서 Repository variable을 추가합니다.

- 이름: `VITE_FAMI_API_URL`
- 값: 생성된 Worker 주소 뒤에 `/chat`을 붙인 HTTPS URL

예시 주소를 그대로 쓰지 말고 본인의 실제 Worker 주소를 입력합니다.
이 값은 공개 서버 주소이고 비밀번호나 API 키가 아닙니다.
GitHub Actions의 Deploy GitHub Pages를 main에서 다시 실행하면 사이트가 AI 연결 모드로 빌드됩니다.
Worker 주소를 작업자에게 알려주어 연결을 마무리해도 됩니다. 계정 비밀번호나 인증 토큰은 채팅에 보내지 마세요.

## 3. 실제 연결 확인

`/wells/#/chat`에서 다음을 차례대로 질문합니다.

1. `팜아 루꼴라를 키우고 싶어!`
2. `씨앗부터 시작할 거야. 햇빛은 얼마나 필요해?`

첫 질문에 맞는 답변이 나오고, 두 번째 답변이 루꼴라와 씨앗 재배라는 앞선 대화를 이어가는지 확인합니다.
API 장애 시 정해진 체험 답변으로 대체하지 않고 오류와 재시도 버튼을 표시합니다.
AI 모드에서는 질문과 최근 대화, 체험 기기 상태가 모델 서비스로 전송됩니다.
이메일·로그인 비밀번호는 전달하지 않습니다. 로그인은 여전히 별도의 로컬 체험입니다.
기기 상태는 체험 데이터이며 실제 센서를 조회하거나 기기를 작동시키지 않습니다.

## 호출 제한과 설정

- 기본 허용 웹사이트 Origin: `https://bds040305-star.github.io`
- IP별 60초당 10회 호출 제한
- 질문 1,000자, 최근 대화 최대 20개 및 전송 크기 제한
- 모델 출력 최대 700토큰
- 모델 응답 대기 25초, 브라우저 대기 35초
- 서버에 별도 대화 저장 로직 없음. 모델 제공자의 데이터 정책은 해당 계정에서 확인합니다.

CORS는 사용자 인증을 대신하지 않습니다. 공개 서비스로 규모를 키울 때에는 실제 로그인 검증과 계정별 사용량 제한을 추가하세요.
기본 설정은 소규모 공개 체험을 위한 제한이며 공격자의 분산 요청까지 차단하는 과금 보장은 아닙니다.

## 개발 검증

```sh
node tests/fami-worker.test.mjs
npx wrangler@4.156.0 deploy --dry-run --outdir /tmp/fami-worker-build
```

테스트는 모델 제공자를 대체한 요청/응답으로 서버 동작을 검증합니다. 실제 모델의 답변 품질 검증과는 구분합니다.
로컬에서 Worker를 호출할 때에는 `ALLOWED_ORIGINS`에 로컬 프런트엔드 Origin을 명시적으로 추가해야 합니다.
`.dev.vars`, `.env.local` 등의 비밀 설정은 커밋하지 않습니다.

## 선택 사항: OpenAI 사용

Workers AI 대신 OpenAI를 쓰려면 Worker의 Variables에서 `FAMI_AI_PROVIDER=openai`를 설정하고,
`FAMI_AI_API_KEY`를 **암호화된 Secret**으로 등록합니다. 기본 모델은 `gpt-4.1-mini`이며,
`FAMI_OPENAI_MODEL`로 바꿀 수 있습니다. 이 방식은 별도의 OpenAI API 계정·사용료가 필요합니다.
API 키를 `VITE_` 변수, GitHub Pages 소스 또는 브라우저 코드에 넣지 마세요.
