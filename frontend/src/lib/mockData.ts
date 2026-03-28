import { Entry } from "@/types/entry";

export const mockUser = {
  id: "a1b2c3d4-e5f6-7890-abcd-ef1234567890",
  email: "user@example.com",
  isLoggedIn: true,
};

export const mockEntries: Entry[] = [
  {
    id: "entry-001",
    user_id: mockUser.id,
    title: "봄 나들이",
    content:
      "오늘은 날씨가 좋아서 한강에 다녀왔다. 벚꽃이 활짝 피어 있어서 기분이 너무 좋았다. 다음 주에도 또 가야지!",
    mood: "happy",
    created_at: "2026-03-27T09:30:00.000Z",
    updated_at: "2026-03-27T09:30:00.000Z",
  },
  {
    id: "entry-002",
    user_id: mockUser.id,
    title: "비 오는 월요일",
    content:
      "아침부터 비가 쏟아져서 출근길이 힘들었다. 우산도 없어서 옷이 다 젖었다. 월요일부터 기분이 꿀꿀하다.",
    mood: "sad",
    created_at: "2026-03-26T08:15:00.000Z",
    updated_at: "2026-03-26T08:15:00.000Z",
  },
  {
    id: "entry-003",
    user_id: mockUser.id,
    title: "프로젝트 마감일",
    content:
      "오늘 프로젝트 마감인데 아직 할 일이 산더미다. 왜 항상 마감 전날에야 정신이 드는 걸까. 야근 확정이다.",
    mood: "angry",
    created_at: "2026-03-25T18:00:00.000Z",
    updated_at: "2026-03-25T22:30:00.000Z",
  },
  {
    id: "entry-004",
    user_id: mockUser.id,
    title: "평범한 하루",
    content:
      "특별한 일 없이 평범하게 하루가 지나갔다. 아침에 일어나서 밥 먹고 일하고 퇴근하고 넷플릭스 봤다. 그래도 평범한 게 좋은 거지.",
    mood: "neutral",
    created_at: "2026-03-24T20:00:00.000Z",
    updated_at: "2026-03-24T20:00:00.000Z",
  },
  {
    id: "entry-005",
    user_id: mockUser.id,
    title: "승진 소식!",
    content:
      "드디어 승진 통보를 받았다! 3년 동안 열심히 한 보람이 있다. 오늘은 치킨에 맥주로 자축해야겠다. 정말 신난다!",
    mood: "excited",
    created_at: "2026-03-23T14:00:00.000Z",
    updated_at: "2026-03-23T14:00:00.000Z",
  },
];
