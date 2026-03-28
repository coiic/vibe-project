# 나만의 일기장 — API 스펙

프론트엔드와 백엔드(Supabase) 사이에 오가는 데이터를 정리한 문서.
이 프로젝트는 Supabase 클라이언트 SDK를 직접 호출하므로, 별도 REST API 서버 없이 **Supabase Auth**와 **Supabase Database(PostgREST)** 를 사용한다.

---

## 공통 사항

### 인증 헤더

Supabase 클라이언트가 로그인 후 자동으로 `Authorization: Bearer <access_token>`을 붙여 준다.
RLS가 이 토큰의 `auth.uid()`를 기준으로 데이터를 필터링한다.

### 기분(mood) 허용 값

```
"happy" | "sad" | "angry" | "neutral" | "excited"
```

---

## 1. 인증 (Supabase Auth)

### 1-1. 회원가입

```
supabase.auth.signUp({ email, password })
```

**요청 데이터**

```json
{
  "email": "user@example.com",
  "password": "mypassword123"
}
```

**성공 응답 (간략)**

```json
{
  "user": {
    "id": "a1b2c3d4-...",
    "email": "user@example.com"
  },
  "session": {
    "access_token": "eyJhbGciOi...",
    "refresh_token": "v1.abc..."
  }
}
```

**실패 예시**

```json
{
  "error": {
    "message": "User already registered"
  }
}
```

---

### 1-2. 로그인

```
supabase.auth.signInWithPassword({ email, password })
```

**요청 데이터**

```json
{
  "email": "user@example.com",
  "password": "mypassword123"
}
```

**성공 응답**

```json
{
  "user": {
    "id": "a1b2c3d4-...",
    "email": "user@example.com"
  },
  "session": {
    "access_token": "eyJhbGciOi...",
    "refresh_token": "v1.abc..."
  }
}
```

**실패 예시**

```json
{
  "error": {
    "message": "Invalid login credentials"
  }
}
```

---

### 1-3. 로그아웃

```
supabase.auth.signOut()
```

**요청 데이터** — 없음 (세션 토큰으로 자동 처리)

**성공 응답** — 에러 없이 완료, 세션이 삭제됨

---

### 1-4. 현재 사용자 조회

```
supabase.auth.getUser()
```

**성공 응답**

```json
{
  "user": {
    "id": "a1b2c3d4-...",
    "email": "user@example.com"
  }
}
```

**비로그인 시** — `user`가 `null`

---

## 2. 일기 CRUD (entries 테이블)

모든 요청은 로그인 상태에서만 가능하다. RLS가 `auth.uid() = user_id` 조건으로 본인 데이터만 접근을 허용한다.

### 2-1. 일기 작성 (INSERT)

```
supabase.from("entries").insert({ ... }).select().single()
```

**요청 데이터**

```json
{
  "title": "봄 나들이",
  "content": "오늘은 날씨가 좋아서 한강에 다녀왔다. 벚꽃이 예뻤다.",
  "mood": "happy"
}
```

> `user_id`는 RLS 또는 DB default로 자동 설정되므로 프론트엔드에서 보내지 않아도 된다.
> 단, DB default를 설정하지 않은 경우 `user_id: (await supabase.auth.getUser()).data.user.id` 를 함께 보낸다.

**성공 응답**

```json
{
  "id": "f47ac10b-58cc-4372-a567-0e02b2c3d479",
  "user_id": "a1b2c3d4-...",
  "title": "봄 나들이",
  "content": "오늘은 날씨가 좋아서 한강에 다녀왔다. 벚꽃이 예뻤다.",
  "mood": "happy",
  "created_at": "2026-03-27T09:30:00.000Z",
  "updated_at": "2026-03-27T09:30:00.000Z"
}
```

**실패 예시**

```json
{
  "error": {
    "message": "new row violates row-level security policy",
    "code": "42501"
  }
}
```

---

### 2-2. 일기 목록 조회 (SELECT — 여러 건)

```
supabase
  .from("entries")
  .select("id, title, mood, created_at")
  .order("created_at", { ascending: false })
```

**요청 데이터** — 없음 (쿼리 파라미터로 정렬·컬럼 지정)

**성공 응답**

```json
[
  {
    "id": "f47ac10b-...",
    "title": "봄 나들이",
    "mood": "happy",
    "created_at": "2026-03-27T09:30:00.000Z"
  },
  {
    "id": "9c4d8e2a-...",
    "title": "비 오는 월요일",
    "mood": "sad",
    "created_at": "2026-03-26T08:15:00.000Z"
  }
]
```

> RLS에 의해 로그인한 사용자의 일기만 반환된다.

---

### 2-3. 일기 상세 조회 (SELECT — 단건)

```
supabase
  .from("entries")
  .select("*")
  .eq("id", entryId)
  .single()
```

**요청 데이터** — `entryId` (URL 파라미터 `/diary/[id]`에서 추출)

**성공 응답**

```json
{
  "id": "f47ac10b-...",
  "user_id": "a1b2c3d4-...",
  "title": "봄 나들이",
  "content": "오늘은 날씨가 좋아서 한강에 다녀왔다. 벚꽃이 예뻤다.",
  "mood": "happy",
  "created_at": "2026-03-27T09:30:00.000Z",
  "updated_at": "2026-03-27T09:30:00.000Z"
}
```

**존재하지 않는 id 또는 타인의 일기 요청 시**

```json
{
  "error": {
    "message": "JSON object requested, multiple (or no) rows returned",
    "code": "PGRST116"
  }
}
```

---

### 2-4. 일기 수정 (UPDATE)

```
supabase
  .from("entries")
  .update({ title, content, mood, updated_at: new Date().toISOString() })
  .eq("id", entryId)
  .select()
  .single()
```

**요청 데이터**

```json
{
  "title": "봄 나들이 (수정)",
  "content": "오늘은 날씨가 좋아서 한강에 다녀왔다. 벚꽃이 정말 예뻤다!",
  "mood": "excited"
}
```

> 변경된 필드만 보내도 된다. `updated_at`은 프론트에서 현재 시각을 넣거나 DB 트리거로 자동 갱신한다.

**성공 응답**

```json
{
  "id": "f47ac10b-...",
  "user_id": "a1b2c3d4-...",
  "title": "봄 나들이 (수정)",
  "content": "오늘은 날씨가 좋아서 한강에 다녀왔다. 벚꽃이 정말 예뻤다!",
  "mood": "excited",
  "created_at": "2026-03-27T09:30:00.000Z",
  "updated_at": "2026-03-27T10:05:00.000Z"
}
```

---

### 2-5. 일기 삭제 (DELETE)

```
supabase
  .from("entries")
  .delete()
  .eq("id", entryId)
```

**요청 데이터** — `entryId` (URL 파라미터에서 추출)

**성공 응답** — 에러 없이 완료 (반환 데이터 없음)

**타인의 일기 삭제 시도 시** — RLS에 의해 삭제되는 행이 0건이므로, 에러 없이 아무 일도 일어나지 않음

---

## 3. 데이터 타입 요약

### Entry (일기)

```typescript
interface Entry {
  id: string;          // uuid
  user_id: string;     // uuid
  title: string;
  content: string;
  mood: "happy" | "sad" | "angry" | "neutral" | "excited";
  created_at: string;  // ISO 8601
  updated_at: string;  // ISO 8601
}
```

### EntryInsert (일기 작성 시 프론트에서 보내는 데이터)

```typescript
interface EntryInsert {
  title: string;
  content: string;
  mood: "happy" | "sad" | "angry" | "neutral" | "excited";
  user_id?: string;  // RLS/default로 처리 가능하면 생략
}
```

### EntryUpdate (일기 수정 시 프론트에서 보내는 데이터)

```typescript
interface EntryUpdate {
  title?: string;
  content?: string;
  mood?: "happy" | "sad" | "angry" | "neutral" | "excited";
}
```

---

## 4. 페이지별 데이터 흐름 요약

| 페이지 | 경로 | 호출하는 API | 보내는 데이터 | 받는 데이터 |
|--------|------|-------------|-------------|------------|
| 회원가입 | `/signup` | `auth.signUp()` | email, password | user, session |
| 로그인 | `/login` | `auth.signInWithPassword()` | email, password | user, session |
| 일기 목록 | `/diary` | `entries` SELECT | — | Entry[] (id, title, mood, created_at) |
| 일기 작성 | `/diary/new` | `entries` INSERT | title, content, mood | Entry (생성된 일기) |
| 일기 상세 | `/diary/[id]` | `entries` SELECT (단건) | id (URL) | Entry (전체 필드) |
| 일기 수정 | `/diary/[id]/edit` | `entries` SELECT → UPDATE | id (URL) + 수정 필드 | Entry (수정된 일기) |
| 일기 삭제 | `/diary/[id]` | `entries` DELETE | id (URL) | — |
