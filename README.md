# 수학 탐구 놀이터

수업과 자기주도학습에서 쓰는 교과 시뮬레이션 모음입니다. 공식을 외우기 전에
직접 조작해보며 원리를 확인하는 것이 목표입니다.

🔗 배포: https://kochiworks.github.io/works_b/

## 사이트 구조

교과 → 영역 → 활동의 3단계로 정리되어 있고, 주소도 그대로 3단계입니다.

```
#/                                         교과 목록 (홈)
#/math                                      수학의 영역 목록
#/math/data-and-possibility                 그 영역의 활동 목록
#/math/data-and-possibility/probability     활동(시뮬레이션)
```

영역은 2022 개정 교육과정의 네 영역(수와 연산 · 변화와 관계 · 도형과 측정 ·
자료와 가능성)을 따릅니다.

주소가 한 칸(`#/probability`)뿐인 예전 링크도 그대로 열리며, 열린 뒤에
3단계 주소로 자동 정리됩니다.

## 활동 · 영역 · 교과 추가하기

세 단계 모두 `src/modules/registry.tsx`의 `SUBJECTS` 트리 한 곳만 고치면
홈 화면 · 라우팅 · breadcrumb이 전부 따라옵니다.

- **활동 추가** — `src/modules/<이름>/` 폴더를 만들어 페이지를 구현한 뒤,
  해당 영역의 `activities` 배열에 항목을 추가합니다.
- **영역 추가** — 교과의 `domains` 배열에 `DomainMeta`를 추가합니다.
- **교과 추가** — `SUBJECTS`에 `SubjectMeta`를 추가합니다. 홈 화면 그리드는
  `auto-fit`이라 교과가 둘 이상이 되면 자동으로 여러 칸으로 나뉩니다.

아직 만들지 않은 활동/교과는 `status: 'soon'`으로 두면 "준비 중" 카드로
표시되고 링크되지 않습니다.

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
    routes.ts             해시 경로 ↔ Route 변환, 주소 정규화, 문서 제목
  hooks/
    useHashRoute.ts       location.hash 추적
  pages/
    HomePage.tsx          교과 목록
    SubjectPage.tsx       영역 목록
    DomainPage.tsx        활동 목록
    NotFoundPage.tsx      없는 주소
  components/
    SiteHeader.tsx        상단 바 + breadcrumb
    PageIntro.tsx         교과/영역 페이지 머리말
    SubjectCard.tsx / DomainCard.tsx / ActivityCard.tsx
  modules/
    registry.tsx          교과 → 영역 → 활동 트리 (사이트의 단일 출처)
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
