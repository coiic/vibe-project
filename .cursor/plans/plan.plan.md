---
name: 나만의 일기장 개발 계획
overview: Next.js App Router + TypeScript + Tailwind + Supabase 기반 개인 일기장 앱. 0단계(셋업) → 1단계(목업) → 2단계(Supabase 연동) 순서로 진행. 1단계 완료 전 2단계 진입 금지. 각 섹션 완료 후 반드시 멈추고 사용자 확인.
todos:
  - id: phase0
    content: "[0단계] 프로젝트 셋업 — Next.js 생성, 폴더 구조, 타입, mockData, 레이아웃/헤더"
    status: completed
  - id: phase1-auth
    content: "[1-A] 인증 목업 — /login, /signup, / 랜딩 페이지"
    status: completed
  - id: phase1-list
    content: "[1-B] 일기 목록 목업 — /diary 페이지 (mockData 기반)"
    status: completed
  - id: phase1-detail
    content: "[1-C] 일기 상세 목업 — /diary/[id] 페이지"
    status: completed
  - id: phase1-new
    content: "[1-D] 일기 작성 목업 — /diary/new 페이지"
    status: completed
  - id: phase1-edit
    content: "[1-E] 일기 수정 목업 — /diary/[id]/edit 페이지"
    status: completed
  - id: phase1-flow
    content: "[1-F] 전체 플로우 점검 — 모든 페이지 네비게이션 확인 (승인 후 2단계 진행)"
    status: completed
  - id: phase2-connect
    content: "[2-G] Supabase 연결 — 패키지, 클라이언트, .env.local, 미들웨어"
    status: completed
  - id: phase2-db
    content: "[2-H] DB 설정 — entries 테이블 + RLS 정책 + updated_at 트리거 (MCP)"
    status: completed
  - id: phase2-auth
    content: "[2-I] 인증 연동 — signUp/signIn/signOut 실제 호출로 교체"
    status: pending
  - id: phase2-crud
    content: "[2-J] CRUD 연동 — mockData를 Supabase entries 쿼리로 교체"
    status: pending
  - id: phase2-cleanup
    content: "[2-K] 정리 — mockData 삭제, import 정리, 빌드 확인"
    status: pending
isProject: true
---

# 나만의 일기장 — 개발 계획

> **규칙**: 1단계(목업)가 완전히 완료되고 플로우 검증이 끝나기 전에는 절대 2단계(실제 구현)로 넘어가지 않는다.
> 각 섹션 완성 후 반드시 멈추고 다음 진행 여부를 사용자에게 확인받는다.

---

## 0단계 — 프로젝트 초기 셋업

### 0-1. Next.js 프로젝트 생성

- `frontend/` 폴더에 Next.js 프로젝트 생성 (App Router, TypeScript, Tailwind CSS, ESLint)
- 불필요한 보일러플레이트 정리 (기본 페이지 내용 제거)

### 0-2. 디렉터리 구조 생성

- `frontend/src/app/` 아래 라우트 폴더 생성
  - `(auth)/login/`
  - `(auth)/signup/`
  - `diary/`
  - `diary/new/`
  - `diary/[id]/`
  - `diary/[id]/edit/`
- `frontend/src/components/` 폴더 생성
- `frontend/src/lib/` 폴더 생성
- `frontend/src/types/` 폴더 생성

### 0-3. 공통 타입 정의

- `frontend/src/types/entry.ts` — `Entry`, `EntryInsert`, `EntryUpdate`, `Mood` 타입 정의 (api-spec.md 기준)

### 0-4. 목업 데이터 파일 생성

- `frontend/src/lib/mockData.ts` — 하드코딩된 일기 배열 (3~5건, 다양한 mood 포함)
- 목업 사용자 정보 (이메일, 로그인 상태) 포함

### 0-5. 공통 레이아웃 구성

- `frontend/src/app/layout.tsx` — 전역 레이아웃 (폰트, Tailwind 기본 설정)
- `frontend/src/components/Header.tsx` — 상단 헤더 (로고, 로그아웃 버튼)

> **완료 후 멈추고 확인**: 프로젝트가 `npm run dev`로 정상 실행되는지 확인

---

## 1단계 — 목업 (Mock Data로 전체 플로우 구현)

> Supabase 연동 없이 `mockData.ts`의 하드코딩 데이터만 사용한다.
> 모든 화면을 클릭해서 전체 플로우를 확인할 수 있는 수준으로 구현한다.

### 섹션 A — 인증 화면

- `/login` 페이지 구현
  - 이메일 입력 필드
  - 비밀번호 입력 필드
  - 로그인 버튼 (클릭 시 `/diary`로 이동)
  - 회원가입 링크 (`/signup`으로 이동)
- `/signup` 페이지 구현
  - 이메일 입력 필드
  - 비밀번호 입력 필드
  - 비밀번호 확인 입력 필드
  - 회원가입 버튼 (클릭 시 `/login`으로 이동)
  - 로그인 링크 (`/login`으로 이동)
- `/` 랜딩 페이지 구현
  - 비로그인 시 서비스 소개 + 로그인/회원가입 버튼
  - 로그인 시 `/diary`로 리다이렉트 (목업에서는 버튼 클릭으로 대체)

> **완료 후 멈추고 확인**: 로그인 → 회원가입 → 랜딩 페이지 간 이동 확인

### 섹션 B — 일기 목록 화면

- `/diary` 페이지 구현
  - 헤더에 "새 일기 쓰기" 버튼 (`/diary/new`로 이동)
  - `mockData.ts`에서 일기 목록 불러오기
  - 각 항목에 제목, 기분 아이콘/라벨, 작성일 표시
  - 날짜 내림차순 정렬
  - 항목 클릭 시 `/diary/[id]`로 이동
  - 일기가 없을 때 빈 상태 메시지 표시

> **완료 후 멈추고 확인**: 목록이 정상 렌더링되고 상세 페이지로 이동 확인

### 섹션 C — 일기 상세 화면

- `/diary/[id]` 페이지 구현
  - URL 파라미터 `id`로 `mockData.ts`에서 해당 일기 조회
  - 제목 표시
  - 기분 아이콘/라벨 표시
  - 본문 표시
  - 작성일, 수정일 표시
  - "수정" 버튼 (`/diary/[id]/edit`로 이동)
  - "삭제" 버튼 (confirm 다이얼로그 → 확인 시 `/diary`로 이동)
  - "목록으로" 버튼 (`/diary`로 이동)
  - 존재하지 않는 id 접근 시 에러 처리

> **완료 후 멈추고 확인**: 상세 조회, 수정/삭제 버튼 동작, 목록 복귀 확인

### 섹션 D — 일기 작성 화면

- `/diary/new` 페이지 구현
  - 제목 입력 필드
  - 본문 입력 필드 (textarea)
  - 기분 선택 UI (happy, sad, angry, neutral, excited 중 택 1)
  - "저장" 버튼 (클릭 시 `/diary`로 이동, 목업에서는 실제 저장 없이 이동만)
  - "취소" 버튼 (`/diary`로 이동)
  - 필수 입력값 빈칸 시 유효성 검사 메시지

> **완료 후 멈추고 확인**: 폼 입력, 유효성 검사, 저장/취소 플로우 확인

### 섹션 E — 일기 수정 화면

- `/diary/[id]/edit` 페이지 구현
  - URL 파라미터 `id`로 기존 일기 데이터를 폼에 미리 채움
  - 제목 수정 필드
  - 본문 수정 필드 (textarea)
  - 기분 변경 UI (기존 값 선택 상태로 표시)
  - "저장" 버튼 (클릭 시 `/diary/[id]`로 이동, 목업에서는 실제 수정 없이 이동만)
  - "취소" 버튼 (`/diary/[id]`로 이동)
  - 필수 입력값 빈칸 시 유효성 검사 메시지

> **완료 후 멈추고 확인**: 기존 데이터 로드, 수정 폼, 저장/취소 플로우 확인

### 섹션 F — 전체 플로우 점검

- 랜딩 → 로그인 → 일기 목록 → 새 일기 쓰기 → 저장 → 목록 복귀
- 목록 → 상세 → 수정 → 저장 → 상세 복귀
- 상세 → 삭제 → 목록 복귀
- 헤더의 로그아웃 → 랜딩/로그인 이동
- 모든 페이지 간 네비게이션이 끊기지 않는지 최종 확인

> **1단계 완료 확인**: 사용자가 전체 플로우를 승인해야 2단계로 진행

---

## 2단계 — 실제 구현 (Supabase 연동)

> 1단계 플로우 검증이 완료된 후에만 시작한다.
> `mockData.ts`를 Supabase API 호출로 교체한다.
> Supabase 작업은 Supabase MCP를 사용한다. (프로젝트 이름: `vibe-tutorial`)

### 섹션 G — Supabase 프로젝트 연결

- Supabase 프로젝트(`vibe-tutorial`) 정보 확인 (MCP로 프로젝트 목록 조회)
- `frontend/.env.local` 파일 생성
  - `NEXT_PUBLIC_SUPABASE_URL`
  - `NEXT_PUBLIC_SUPABASE_ANON_KEY`
- `@supabase/supabase-js` 패키지 설치
- `@supabase/ssr` 패키지 설치
- `frontend/src/lib/supabase/client.ts` — 브라우저용 Supabase 클라이언트 생성
- `frontend/src/lib/supabase/server.ts` — 서버 컴포넌트용 Supabase 클라이언트 생성
- `frontend/src/lib/supabase/middleware.ts` — 미들웨어용 Supabase 클라이언트 생성
- `frontend/src/middleware.ts` — 인증 미들웨어 (비로그인 시 `/login` 리다이렉트)

> **완료 후 멈추고 확인**: Supabase 클라이언트 초기화 및 미들웨어 정상 동작 확인

### 섹션 H — DB 테이블 및 RLS 설정

- Supabase MCP로 `entries` 테이블 생성
  - `id` uuid PK default `gen_random_uuid()`
  - `user_id` uuid FK → `auth.users.id` NOT NULL
  - `title` text NOT NULL
  - `content` text NOT NULL
  - `mood` text NOT NULL
  - `created_at` timestamptz default `now()`
  - `updated_at` timestamptz default `now()`
- `user_id`에 default `auth.uid()` 설정
- RLS 활성화
- SELECT 정책 추가: `auth.uid() = user_id`
- INSERT 정책 추가: `auth.uid() = user_id`
- UPDATE 정책 추가: `auth.uid() = user_id`
- DELETE 정책 추가: `auth.uid() = user_id`
- `updated_at` 자동 갱신 트리거 생성 (UPDATE 시 `now()`로 변경)

> **완료 후 멈추고 확인**: Supabase 대시보드에서 테이블·RLS 정책 확인

### 섹션 I — 인증 연동

- `/signup` 페이지 — `supabase.auth.signUp()` 호출로 교체
  - 성공 시 `/login`으로 이동
  - 실패 시 에러 메시지 표시
- `/login` 페이지 — `supabase.auth.signInWithPassword()` 호출로 교체
  - 성공 시 `/diary`로 이동
  - 실패 시 에러 메시지 표시
- 헤더 로그아웃 — `supabase.auth.signOut()` 호출로 교체
  - 성공 시 `/login`으로 이동
- 랜딩 페이지 — `supabase.auth.getUser()` 결과에 따라 분기
  - 로그인 상태면 `/diary` 리다이렉트
  - 비로그인이면 랜딩 화면 표시

> **완료 후 멈추고 확인**: 실제 회원가입 → 로그인 → 로그아웃 플로우 확인

### 섹션 J — 일기 CRUD 연동

- 일기 목록 (`/diary`) — `entries` SELECT로 교체
  - `mockData.ts` import 제거
  - `supabase.from("entries").select("id, title, mood, created_at").order("created_at", { ascending: false })`
  - 로딩 상태 표시
  - 에러 시 에러 메시지 표시
- 일기 상세 (`/diary/[id]`) — `entries` SELECT 단건으로 교체
  - `supabase.from("entries").select("*").eq("id", id).single()`
  - 존재하지 않는 id 시 404 처리
- 일기 작성 (`/diary/new`) — `entries` INSERT로 교체
  - `supabase.from("entries").insert({ title, content, mood }).select().single()`
  - 성공 시 `/diary/[id]` (생성된 일기 상세)로 이동
  - 실패 시 에러 메시지 표시
- 일기 수정 (`/diary/[id]/edit`) — `entries` UPDATE로 교체
  - 페이지 진입 시 기존 데이터 SELECT
  - `supabase.from("entries").update({ title, content, mood }).eq("id", id).select().single()`
  - 성공 시 `/diary/[id]`로 이동
  - 실패 시 에러 메시지 표시
- 일기 삭제 (`/diary/[id]`) — `entries` DELETE로 교체
  - `supabase.from("entries").delete().eq("id", id)`
  - 성공 시 `/diary`로 이동
  - 실패 시 에러 메시지 표시

> **완료 후 멈추고 확인**: 실제 데이터로 작성 → 목록 확인 → 상세 → 수정 → 삭제 전체 플로우 확인

### 섹션 K — 정리

- `mockData.ts` 파일 삭제 (더 이상 사용하지 않음)
- 불필요한 import 정리
- 전체 빌드 (`npm run build`) 성공 확인
- 최종 플로우 테스트

