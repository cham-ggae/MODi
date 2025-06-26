"use client";

import { useState, Fragment, useEffect } from "react";
import FamilyModeToggle from "@/components/chat/FamilyModeToggle";
import ChatMessages from "@/components/chat/ChatMessages";
import ChatInput from "@/components/chat/ChatInput";
import { ClientMessage } from "@/types/chat.type";
import { useFamily } from "@/hooks/family";
import { useMyUserInfo } from "@/hooks/useUserInfoQuery";
import { useRouter } from "next/navigation";
import AgePlanRecommendationBubble from "@/components/chat/AgePlanRecommendationBubble";
import SeniorPlanModal from "@/components/SeniorPlanModal";

function createSessionId() {
  return window.crypto?.randomUUID?.() ?? `${Date.now()}-${Math.random().toString(36).slice(2)}`;
}

export default function ChatPage() {
  const [sessionId] = useState(createSessionId);
  const [familySessionId] = useState(createSessionId);
  const [messages, setMessages] = useState<ClientMessage[]>([
    {
      id: "welcome-individual",
      content:
        '"안녕하세요! 개인 맞춤형 요금제 추천을 위한 MODi 챗봇입니다. 당신의 통신 상황에 맞는 최적의 요금제를 찾아드릴게요!"',
      role: "bot",
      timestamp: new Date(),
      sessionId: sessionId,
    },
    {
      id: "welcome-family",
      content: `안녕하세요! 가족 맞춤형 요금제 추천 챗봇 MODi입니다. 현재 가족 정보를 바탕으로 도와드릴게요! 💕`,
      role: "bot",
      timestamp: new Date(),
      sessionId: familySessionId,
    },
  ]);

  const { memberCount, isLoading, hasFamily } = useFamily();
  const [familyMode, setFamilyMode] = useState(false);
  const { data: user } = useMyUserInfo();
  const router = useRouter();

  useEffect(() => {
    console.log("messages", messages);
  }, [messages]);

  return (
    <Fragment>
      {memberCount > 1 && (
        <FamilyModeToggle
          familyMode={familyMode}
          setFamilyMode={setFamilyMode}
          isLoading={isLoading}
          hasFamily={hasFamily}
          memberCount={memberCount}
        />
      )}
      <ChatMessages
        messages={messages.filter(
          (msg) => msg.sessionId === (familyMode ? familySessionId : sessionId)
        )}
        afterMessageComponent={(msg) => (
          <AgePlanRecommendationBubble
            userAge={user?.age}
            onSurvey={() => router.push("/survey")}
          />
        )}
      />
      <ChatInput
        setMessages={setMessages}
        sessionId={sessionId}
        familyMode={familyMode}
        familySize={memberCount || 1}
        familySessionId={familySessionId}
        messages={messages}
      />
      <SeniorPlanModal userInfo={user} />
    </Fragment>
  );
}
