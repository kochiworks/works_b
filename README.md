# 경우의 수 탐색기 (Combinatorics Explorer)

서로 다른 n개의 대상에서 r개를 택하는 **순열 · 조합 · 중복순열 · 중복조합**을
직접 조작하며 모든 경우를 눈으로 확인할 수 있는 학습용 웹앱입니다.

🔗 배포: https://kochiworks.github.io/works_b/

## 기능

- 4가지 상황(순열/조합/중복순열/중복조합) 선택
- 대상 이름 직접 편집, 개수(n) 조절 (2~10개)
- 선택 개수(r) 조절 (1~6개, 반복 없는 모드는 n 이하로 자동 제한)
- 전체 경우의 수를 표 / 수형도(SVG)로 시각화
- 시뮬레이션 옵션
  - 특정 대상 반드시 포함
  - 특정 대상 반드시 제외
  - 특정 대상들 "동시 포함 금지" 그룹 (그룹 내 최대 1개만 등장)
- 결과가 지나치게 많아지는 조합(2,000가지 초과)은 자동으로 나열을 생략하고
  전체 경우의 수만 표시합니다.

## 실행

```bash
npm install
npm run dev      # 개발 서버
npm run build    # 타입체크 + 프로덕션 빌드
npm run lint      # oxlint
```

## 코드 구조

```
src/
  lib/
    types.ts        모드/옵션/아이템 타입 정의
    formulas.ts      nPr, nCr, n^r, 중복조합 공식
    generators.ts    실제 경우 나열(백트래킹) + 옵션 필터링 + 성능 가드
    tree.ts          나열 결과 → 수형도 트리 구조/레이아웃 변환
  hooks/
    useExplorerState.ts   n/r/모드/옵션 상태 관리
  components/
    ItemNameEditor.tsx  대상 이름·개수 편집
    ModeSelector.tsx    상황(모드) 선택 탭
    RPicker.tsx          r 값 슬라이더
    OptionPanel.tsx      포함/제외/동시포함금지 옵션 UI
    ResultSummary.tsx    전체/조건적용 후 경우의 수 표시
    ResultTable.tsx       표 뷰
    TreeDiagram.tsx        수형도(SVG) 뷰
```

## 배포

`main` 브랜치에 push되면 GitHub Actions(`.github/workflows/deploy-pages.yml`)가
자동으로 빌드하여 GitHub Pages에 배포합니다.
