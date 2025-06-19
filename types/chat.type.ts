export interface message {
  role: "system" | "user" | "assistant" | "function";
  content?: string;
  name?: string;
  function_call?: {
    name: string;
    arguments: string;
  };
}

export interface familyMember {
  name: string;
  profile_image: string;
  plan_name: string;
}

// Δ(델타) 객체
export interface ChatCompletionDelta {
  content?: string;
}

// choices 요소
export interface ChatCompletionChunkChoice {
  index: number;
  delta: ChatCompletionDelta;
  logprobs: null;            // streaming 청크에선 항상 null
  finish_reason: string | null;
}

// 실제 청크 페이로드
export interface ChatCompletionChunk {
  id: string;                // "chatcmpl-…"
  object: "chat.completion.chunk";
  created: number;           // Unix timestamp
  model: string;             // 호출한 모델
  service_tier: string;
  system_fingerprint: string;
  choices: ChatCompletionChunkChoice[];
}

export interface Chatting {
  cid: number;
  uid: number;
  role: string;
  content: string;
  created_at: string;
  session_id: string;
}

export interface ClientMessage {
  id: string;
  content: string;
  role: string;
  timestamp: Date;
  sessionId: string;
}