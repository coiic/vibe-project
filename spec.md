# 나만의 일기장 — 서비스 스펙

개인용 일기 작성 및 관리 웹 앱. 하루의 기록을 간편하게 남기고, 그날의 기분까지 함께 저장한다.

---

## 기술 스택

| 영역 | 선택 |
|------|------|
| 프레임워크 | Next.js (App Router) |
| 언어 | TypeScript |
| 스타일 | Tailwind CSS |
| DB / Auth | Supabase |

---

## 핵심 기능 (Phase 1)

### 1. 회원가입 / 로그인 / 로그아웃

- Supabase Auth를 이용한 이메일 + 비밀번호 인증
- 비로그인 사용자는 로그인 페이지로 리다이렉트
- 회원가입 시 이메일·비밀번호 입력 → `supabase.auth.signUp()`
- 로그인 시 `supabase.auth.signInWithPassword()`
- 로그아웃 시 `supabase.auth.signOut()` 후 로그인 페이지로 이동

| 항목 | 값 |
|------|----|
| 페이지 경로 | `/signup`, `/login` |
| Supabase 기능 | Supabase Auth (`signUp`, `signInWithPassword`, `signOut`) |

### 2. 일기 작성

- 제목(필수), 본문(필수), 기분(필수) 입력 후 저장
- 기분은 미리 정의된 목록에서 선택: happy, sad, angry, neutral, excited
- 저장 성공 시 상세 페이지로 이동

| 항목 | 값 |
|------|----|
| 페이지 경로 | `/diary/new` |
| Supabase 기능 | `entries` 테이블 INSERT |

### 3. 일기 목록 조회

- 로그인한 사용자 본인의 일기만 표시 (RLS 적용)
- 날짜 내림차순(최신순) 정렬
- 각 항목에 제목, 기분, 작성일 표시
- 항목 클릭 시 상세 페이지로 이동

| 항목 | 값 |
|------|----|
| 페이지 경로 | `/diary` |
| Supabase 기능 | `entries` 테이블 SELECT (`order by created_at desc`) + RLS |

### 4. 일기 상세 조회

- 선택한 일기의 제목, 본문, 기분, 작성일, 수정일 표시
- 수정·삭제 버튼 제공

| 항목 | 값 |
|------|----|
| 페이지 경로 | `/diary/[id]` |
| Supabase 기능 | `entries` 테이블 SELECT (단건, id 기준) |

### 5. 일기 수정

- 기존 일기의 제목, 본문, 기분을 수정
- 저장 시 `updated_at` 자동 갱신
- 저장 성공 시 상세 페이지로 이동

| 항목 | 값 |
|------|----|
| 페이지 경로 | `/diary/[id]/edit` |
| Supabase 기능 | `entries` 테이블 UPDATE |

### 6. 일기 삭제

- 상세 페이지에서 삭제 버튼 클릭 → 확인 다이얼로그 → 삭제 실행
- 삭제 성공 시 목록 페이지로 이동

| 항목 | 값 |
|------|----|
| 페이지 경로 | `/diary/[id]` (삭제 버튼) |
| Supabase 기능 | `entries` 테이블 DELETE |

---

## DB 스키마 (Supabase)

### users (Supabase Auth 기본 제공)

별도 테이블 없이 `auth.users`를 사용한다.

### entries

| 컬럼 | 타입 | 제약조건 | 설명 |
|------|------|----------|------|
| id | uuid | PK, default `gen_random_uuid()` | 일기 ID |
| user_id | uuid | FK → `auth.users.id`, NOT NULL | 작성자 |
| title | text | NOT NULL | 제목 |
| content | text | NOT NULL | 본문 |
| mood | text | NOT NULL | 기분 (happy, sad, angry, neutral, excited) |
| created_at | timestamptz | default `now()` | 작성일 |
| updated_at | timestamptz | default `now()` | 수정일 |

### RLS 정책

| 작업 | 정책 |
|------|------|
| SELECT | `auth.uid() = user_id` — 본인 일기만 조회 |
| INSERT | `auth.uid() = user_id` — 본인 명의로만 생성 |
| UPDATE | `auth.uid() = user_id` — 본인 일기만 수정 |
| DELETE | `auth.uid() = user_id` — 본인 일기만 삭제 |

---

## 페이지 구조 (`app/` 기준)

```
/                → 랜딩(비로그인) 또는 일기 목록 리다이렉트(로그인)
/login           → 로그인
/signup          → 회원가입
/diary           → 일기 목록
/diary/new       → 일기 작성
/diary/[id]      → 일기 상세
/diary/[id]/edit → 일기 수정
```

---

## 향후 확장 (Phase 2)

- 카카오/구글 소셜 로그인
- 일기 검색 (제목·본문 키워드)
- 캘린더 뷰 (날짜별 일기 조회)
- 기분 통계 (주간/월간 기분 변화 그래프)
- 이미지 첨부
- 일기 태그 기능
