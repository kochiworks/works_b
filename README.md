# 수학 탐구 놀이터

수업과 자기주도학습에서 쓰는 수학 시뮬레이션 모음입니다. 공식을 외우기 전에
직접 조작해보며 원리를 확인하는 것이 목표입니다.

🔗 배포: https://kochiworks.github.io/works_b/

## 사이트 구조

학교급 → 학년·과목 → 활동의 3단계로 정리되어 있고, 주소도 그대로 3단계입니다.

```
#/                                          학교급 (홈)
#/high                                       고등학교의 과목 목록
#/high/probability-statistics                확률과 통계의 활동 목록
#/high/probability-statistics/probability    활동(시뮬레이션)
```

```
🧒 초등학교 ── 1~2학년 · 3~4학년 · 5~6학년
🎒 중학교  ── 1학년 · 2학년 · 3학년
🎓 고등학교 ── [공통]     공통수학1 · 공통수학2
              [일반 선택] 대수 · 미적분Ⅰ · 확률과 통계
              [진로 선택] 기하 · 미적분Ⅱ · 경제 수학 · 인공지능 수학 · 직무 수학
              [융합 선택] 수학과 문화 · 실용 통계 · 수학과제 탐구
```

고등학교 과목은 2022 개정 교육과정을 그대로 따르며, 과목 페이지 안에서
공통 / 일반 선택 / 진로 선택 / 융합 선택 소제목으로 묶어 보여줍니다. 이건
화면 안의 구획일 뿐 라우팅 단계는 아닙니다.

교육과정의 네 영역(수와 연산 · 변화와 관계 · 도형과 측정 · 자료와 가능성)은
내비게이션 축에서는 빠졌지만, 활동마다 하나씩 달려 활동 카드에 태그로
표시됩니다.

### 한 활동을 여러 학년·과목에 놓기

활동은 `ACTIVITIES`에 **한 번만** 정의하고, 그것을 가르치는 모든 학년·과목의
`entries`에서 id로 참조합니다. 구현은 하나뿐이고 배치만 여러 개입니다.
배치마다 `note`를 달면 그 과목의 표현으로 소개됩니다.

```ts
// 중학교 3학년
{ activityId: 'functions', note: '이차함수의 그래프' }
// 대수
{ activityId: 'functions', note: '지수 · 로그함수와 삼각함수' }
```

### 예전 링크

한 칸짜리 `#/probability`, 그리고 잠깐 쓰였던 `#/math/<영역>/<활동>` 형태도
그대로 열립니다. 활동이 처음 배치된 학년·과목으로 보내고, 주소창만 3단계
정규 주소로 정리합니다.

## 활동 · 학년/과목 · 학교급 추가하기

세 가지 모두 `src/modules/registry.tsx` 한 곳만 고치면 홈 화면 · 라우팅 ·
breadcrumb이 전부 따라옵니다.

- **활동 추가** — `src/modules/<이름>/` 폴더를 만들어 페이지를 구현하고,
  `ACTIVITIES`에 항목을 넣은 뒤, 그 활동을 다루는 학년·과목의 `entries`에
  id를 추가합니다.
- **학년/과목 추가** — 학교급의 `courses` 배열에 `CourseMeta`를 추가합니다.
  고등학교라면 `band`에 과목 구분을 적습니다.
- **학교급 추가** — `SCHOOL_LEVELS`에 `SchoolLevelMeta`를 추가합니다.

활동이 하나도 없는 학년·과목은 "준비 중" 카드로 흐리게 표시되고 링크되지
않습니다. 채워야 할 곳이 한눈에 보이도록 일부러 남겨 둔 것입니다.

## 모듈은 서로 코드를 공유하지 않습니다

각 활동은 `src/modules/<이름>/` 안에 독립적으로 존재합니다(`lib/`, `hooks/`,
`components/`, `<Name>Page.tsx` / `.css`). **모듈 사이의 import는 하지 않습니다.**
아주 작은 조각(예: KaTeX 래퍼 `Katex.tsx`)도 모듈마다 그대로 복제해 둡니다.
활동 하나를 고치다가 다른 활동이 깨지는 일을 원천적으로 막기 위한 의도된
설계이며, 실수가 아닙니다.

다만 Vite는 모든 모듈의 CSS를 **하나의 전역 스타일시트로** 합칩니다. 그래서
모듈끼리 같은 클래스 이름을 써도 서로 영향을 줍니다(현재 여러 모듈이
`.page-intro`를 각자 정의하고 있습니다). 사이트 내비게이션 레이어는 이를 피하려고
모든 클래스에 `browse-` 접두사를 쓰거나 `.site-header` 아래로 한정합니다.
새 모듈을 만들 때도 그 모듈 고유의 접두사를 쓰는 편이 안전합니다.

## 코드 구조

```
src/
  App.tsx                 라우트 해석 → 페이지 렌더 + breadcrumb 구성
  App.css                 사이트 셸과 browse 계층 스타일 (browse- 접두사)
  index.css               파스텔 디자인 토큰(--accent, --mint, ... )
  lib/
    routes.ts             해시 경로 ↔ Route 변환, 예전 주소 정규화, 문서 제목
  hooks/
    useHashRoute.ts       location.hash 추적
  pages/
    HomePage.tsx          학교급 목록
    LevelPage.tsx         학년·과목 목록 (고등학교는 과목 구분별로 묶음)
    CoursePage.tsx        활동 목록
    NotFoundPage.tsx      없는 주소
  components/
    SiteHeader.tsx        상단 바 + breadcrumb
    PageIntro.tsx         학교급/과목 페이지 머리말
    LevelCard.tsx / CourseCard.tsx / ActivityCard.tsx
  modules/
    registry.tsx          ACTIVITIES(활동 정의) + SCHOOL_LEVELS(배치 트리)
    numberSense/          수 감각 익히기
    placeValue/           가로셈 · 세로셈 탐구기
    functions/            함수의 그래프
    transformations/      도형의 이동
    combinatorics/        경우의 수 탐색기
    probability/          확률
```

## 실행

```bash
npm install
npm run dev      # 개발 서버
npm run build    # 타입체크 + 프로덕션 빌드
npm run lint     # oxlint
npm run preview  # 빌드 결과 미리보기
```

## 배포

`main` 브랜치에 push되면 GitHub Actions(`.github/workflows/deploy-pages.yml`)가
자동으로 빌드하여 GitHub Pages에 배포합니다.
