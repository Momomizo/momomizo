# Momomizo — 姓名判断 彩 再現版

namaeuranai.biz의 화면과 주요 사용자 흐름을 조사해 재구현한 일본어 정적 웹 앱입니다. 원본 서버에 의존하지 않으며 API 키, DB, 로그인 없이 Vercel에서 실행됩니다.

## Vercel 배포

1. Vercel에서 **Momomizo/momomizo** 저장소를 Import합니다.
2. Root Directory: 저장소 루트 (`./`)
3. Framework Preset: **Other**
4. Build Command: **npm run build**
5. Output Directory: **dist**
6. 환경 변수: 없음. Deploy를 누릅니다.

`vercel.json`에 빌드·출력 폴더와 SPA URL 재작성 규칙이 포함되어 있습니다. `/result/山田_太郎/男性/` 같은 URL로 직접 접속하거나 새로고침해도 앱이 열립니다. 이전 Vercel 프로젝트 설정에 다른 Build/Output override가 있으면 위 값으로 변경하세요.

## 로컬 실행

Node.js 22 이상:

```sh
npm test
npm run build
npm run dev
```

<http://127.0.0.1:4173>에서 확인할 수 있습니다. 런타임 및 빌드 외부 패키지가 없어 `npm install`은 필수가 아닙니다. 소스 수정 후 `npm run build`를 다시 실행하세요.

## 구현한 기능

- 원본 로고·문양·이미지 버튼을 로컬 파일로 제공하는 PC 레이아웃과 모바일 레이아웃
- 이름/성별 입력, 미지원 문자·입력 길이 검증
- 총격·천격·지격·인격·외격·직업운·가정운 7항목 및 SVG 연결 도표
- 결과 공유, SVG 저장, 인쇄
- 한자 포함 이름 / 히라가나 읽기 이름 검색, 정렬, 페이지 이동, 빈 결과 처리
- 13,108자 한자 사전: 획수·음훈·이름 읽기 검색 및 상세 정보
- 159개 이름 후보 목록, 남녀 필터, 읽기 필터, 이름 상세, 성씨별 추천
- 회사명 / 상호 / 상품·서비스 / 닉네임 진단
- 브라우저 로컬 진단 이력(최근 20건) 및 비공개 메모
- FAQ, 데이터 출처·개인정보 안내, 잘못된 경로 처리

## 원본과의 차이

**원본의 비공개 데이터베이스 및 계산 코드를 복제한 서비스가 아닙니다.**

- 획수는 KANJIDIC2의 첫 번째 `stroke_count`를 사용합니다. 한글/영문/숫자/미수록 글자는 추정하지 않고 오류를 표시합니다.
- 히라가나·가타카나는 코드에 명시한 획수표를 사용하며, 탁점 +2 / 반탁점 +2 및 작은 글자의 기본 글자 획수를 적용합니다.
- 길흉은 원본 사이트에서 실측한 81수리 표입니다. 해설은 이 프로젝트용으로 작성한 5종 안내입니다. 81 초과는 `(n-1)%81+1`로 환산합니다.
- 천격·지격은 성·이름의 실획 합계이며, 한 글자 성/이름마다 외격에만 가수 1을 더합니다. 熊崎式의 구자체·부수 환산 및 천격·지격 영수는 채택하지 않습니다. 성별은 보존하지만 판정표는 남녀 공통입니다.
- 상호·상품·닉네임·회사명도 같은 참고 판정표를 사용합니다. 원본 모드별 고유 판정과는 다를 수 있습니다.
- 이름 후보는 직접 준비한 159건입니다. 원본의 수천·수만 건 후보 및 실제 인기 순위는 포함하지 않습니다. 이를 앱에서도 안내합니다.
- 원본의 유료 상담, 로그인, 공개 댓글, 광고/분석 스크립트는 포함하지 않았습니다. 메모는 이 브라우저에만 저장됩니다. 일반 진단은 이름·성별을 history state에 유지하며 공유 버튼만 이름이 포함된 URL을 만듭니다. 검색 조건은 검색 URL에 포함됩니다.
- 모바일은 원본처럼 별도 서버 템플릿을 내려주는 대신 반응형 CSS로 유사한 사용자 흐름을 제공합니다.

## 파일 구성

- `src/app.js`: 페이지 라우팅, 폼 처리, 화면 렌더링, 저장/공유
- `src/engine.js`: 입력 검증, 획수 합산, 참고 판정, 이름 검색
- `src/styles.css`: PC / 태블릿 / 모바일 / 인쇄 스타일
- `public/data/kanji.json`: KANJIDIC2에서 추출한 획수·읽기·학년 데이터
- `public/data/names.json`: 이 프로젝트용 이름 후보 데이터
- `public/assets/sources.json`: 원본 이미지의 출처 URL
- `scripts/build.mjs`: `dist/` 생성
- `scripts/serve.mjs`: 로컬 프리뷰 서버 (Vercel 운영에는 사용하지 않음)
- `scripts/update-data.mjs`: 공개 한자 데이터 갱신
- `tests/engine.test.mjs`: 원본 관찰 표본, 미지원 입력, 단일 글자, 이름 검색 등 검증

## 한자 데이터와 갱신

KANJIDIC2: Copyright James William BREEN and the Electronic Dictionary Research and Development Group (EDRDG), **CC BY-SA 4.0**. `public/data/kanji.json`도 같은 라이선스를 따릅니다. 원본에서 문자, 첫 획수, 일본어 음훈, 명승 읽기, 학년만 추출했습니다.

- 프로젝트/문서: <https://www.edrdg.org/wiki/index.php/KANJIDIC_Project>
- 라이선스/갱신 지침: <https://www.edrdg.org/edrdg/licence.html>
- CC BY-SA 4.0: <https://creativecommons.org/licenses/by-sa/4.0/>

최소 매월 다음 명령으로 최신 데이터를 반영하고 커밋/재배포하세요. 자동 스케줄은 설정하지 않았습니다.

```sh
node scripts/update-data.mjs
npm test
npm run build
```

## 이미지

원본에서 관찰한 이미지 24개를 저장했습니다. 각 출처는 `public/assets/sources.json`에 있습니다. 로고·캐릭터·배너 등의 권리는 원래 권리자에게 있으며 코드나 한자 데이터 라이선스에 포함되지 않습니다. 교체할 때는 같은 파일명을 사용하거나 `src/app.js`와 CSS의 경로를 수정하세요. 외부 배너는 원래 공식 서비스로 연결됩니다.

## 검증 범위

Node 자동 테스트와 정적 빌드, 로컬 HTTP 응답을 검증했습니다. Aside 브라우저에서 이름 입력→결과 화면과 390px 모바일 결과 레이아웃을 확인했습니다. 검색 로직·정렬·후보 데이터는 자동 테스트로 검증했습니다. 이후 Mac 잠금으로 추가 브라우저 상호작용 검증은 제한되었습니다. Vercel 프로덕션 배포는 사용자가 진행하는 단계입니다.
