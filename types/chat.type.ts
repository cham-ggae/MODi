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