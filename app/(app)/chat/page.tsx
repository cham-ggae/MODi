'use client';

import { useState, Fragment, useEffect } from 'react';
import FamilyModeToggle from '@/components/chat/FamilyModeToggle';
import ChatMessages from '@/components/chat/ChatMessages';
import ChatInput from '@/components/chat/ChatInput';
import { ClientMessage } from '@/types/chat.type';
import { useFamily } from '@/hooks/family';

export default function ChatPage() {
  const [sessionId] = useState(
    () => window.crypto?.randomUUID?.() ?? `${Date.now()}-${Math.random().toString(36).slice(2)}`
  );
  const [messages, setMessages] = useState<ClientMessage[]>([
    {
      id: 'welcome',
      content:
        '"안녕하세요! 개인 맞춤형 요금제 추천을 위한 MODi 챗봇입니다. 당신의 통신 상황에 맞는 최적의 요금제를 찾아드릴게요!"',
      role: 'bot',
      timestamp: new Date(),
      sessionId: sessionId,
    },
  ]);

  const { memberCount, isLoading, hasFamily } = useFamily();
  const [familyMode, setFamilyMode] = useState(false);

  // 가족 모드 토글 표시 조건 - 항상 표시
  const shouldShowFamilyToggle = !isLoading; // 로딩이 완료되면 항상 표시

  return (
    <Fragment>
      {/* 로딩 중이거나 로딩 완료 후 토글 표시 */}
      {(isLoading || shouldShowFamilyToggle) && (
        <FamilyModeToggle
          familyMode={familyMode}
          setFamilyMode={setFamilyMode}
          isLoading={isLoading}
          hasFamily={hasFamily}
          memberCount={memberCount}
        />
      )}
      <ChatMessages messages={messages} />
      <ChatInput
        setMessages={setMessages}
        sessionId={sessionId}
        familyMode={familyMode}
        familySize={memberCount || 1}
      />
    </Fragment>
  );
}
