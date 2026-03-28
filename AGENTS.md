# AGENTS.md — AI 코딩 어시스턴트용 프로젝트 규칙

이 문서는 이 저장소에서 코드를 작성·수정할 때 **반드시 따를 규칙**과 **피해야 할 사항**을 정리합니다. 사용자가 매번 같은 설명을 반복하지 않아도 되도록 유지합니다.

---

## 기술 스택 (고정)

| 영역 | 선택 |
|------|------|
| 프레임워크 | **Next.js** — **App Router** (`app/` 디렉터리) |
| 언어 | **TypeScript** (`.ts`, `.tsx`) |
| 스타일 | **Tailwind CSS** |
| 데이터베이스·백엔드 | **Supabase** (클라이언트·서버 연동, RLS 등) |

---

## 반드시 지킬 것 (DO)

### Next.js (App Router)

- 라우팅·레이아웃·페이지는 `app/` 아래에 둔다. **Pages Router** (`pages/`)는 사용하지 않는다.
- 서버/클라이언트 경계를 명확히 한다. 클라이언트 전용 훅·이벤트·브라우저 API가 필요하면 파일 상단에 `'use client'`를 붙인다.
- 데이터 페칭은 가능하면 **서버 컴포넌트**에서 하거나, **Route Handler** (`app/api/.../route.ts`)·**Server Actions**로 처리한다.
- 메타데이터·SEO는 App Router 방식(`metadata` export, `generateMetadata` 등)을 따른다.

### TypeScript

- 새 파일은 **`.ts` 또는 `.tsx`**로 작성한다. 순수 JavaScript(`.js`/`.jsx`)로 새 기능을 추가하지 않는다.
- `any` 남용을 피하고, Supabase·Next.js에서 제공하는 타입을 활용한다.
- props·함수 인자·반환값에 적절한 타입을 붙인다.

### Tailwind CSS

- 스타일은 **유틸리티 클래스**로 작성한다. 인라인 `style`은 꼭 필요한 경우에만 제한적으로 사용한다.
- 기존에 `tailwind.config`·디자인 토큰이 있으면 그에 맞춘다. 없으면 일관된 간격·타이포그래피를 유지한다.
- 다크 모드 등 테마가 프로젝트에 있으면 동일한 패턴을 따른다.

### Supabase

- DB 접근은 **Supabase 클라이언트**와 프로젝트에 맞는 패턴(서버 전용 클라이언트 vs 브라우저 클라이언트)을 사용한다.
- 민감한 키(`service_role` 등)는 **서버 측**에만 두고, 클라이언트 번들에 노출하지 않는다.
- **Row Level Security(RLS)**와 정책을 전제로 쿼리를 작성한다. RLS를 우회하는 방식은 사용자가 명시적으로 요청하지 않는 한 사용하지 않는다.

### 공통

- 사용자가 요청한 범위 안에서만 수정한다. 불필요한 대규모 리팩터링·무관한 파일 변경을 하지 않는다.
- 프로젝트에 이미 있는 import·폴더 구조·네이밍 관례를 우선 따른다.

---

## 하지 말 것 (DON'T)

- **Pages Router** 전용 패턴으로 새 코드를 작성하지 않는다. (`pages/`, `getServerSideProps`, `getStaticProps` 등으로 새 기능을 만들지 않음)
- **JavaScript만으로** 새 모듈·페이지·API를 추가하지 않는다.
- **CSS Modules·styled-components·emotion** 등으로 스타일을 새로 도입하지 않는다. (사용자가 명시적으로 전환을 요청하기 전까지 **Tailwind만** 사용)
- **Supabase 대신** Prisma 직접 연결, Firebase, MongoDB 전용 클라이언트 등 **다른 DB 스택으로 기본값을 바꾸지** 않는다.
- **환경 변수·시크릿**을 하드코딩하거나 클라이언트에 서버 전용 키를 넣지 않는다.
- **타입을 `any`로만** 덮어써서 에러를 숨기지 않는다. (불가피하면 그 이유를 짧게 주석으로 남기는 것은 허용)
- 사용자가 요청하지 않은 **불필요한 의존성 추가**를 하지 않는다.

---

## 참고

- Next.js·Supabase·Tailwind 공식 문서가 바뀔 수 있으므로, 충돌이 있으면 **이 문서의 스택 선택**을 우선하고 최신 공식 권장 패턴을 따른다.
- 이 문서를 바꾸면(예: DB를 바꾸거나 Pages Router로 이전) 아래 **변경 이력**에 날짜와 요약을 남기는 것을 권장한다.

### 변경 이력

- (최초 작성) App Router, TypeScript, Tailwind CSS, Supabase 고정.
