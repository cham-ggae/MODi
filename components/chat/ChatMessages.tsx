import React, { useCallback, useEffect, useRef, useState } from "react";
import { ClientMessage } from "@/types/chat.type";
import { useTextToSpeech } from "@/hooks/use-speech";
import { useToast } from "../ui/use-toast";
import MessageItem from "./MessageItem";

interface ChatMessagesProps {
  messages: ClientMessage[];
  afterMessageComponent?: (msg: ClientMessage) => React.ReactNode;
}
const ChatMessages = ({ messages, afterMessageComponent }: ChatMessagesProps) => {
  const { isSpeaking, speak, stopSpeaking, isSupported: ttsSupported } = useTextToSpeech();
  const { toast } = useToast();

  const handleSpeakMessage = useCallback(
    (text: string, cid?: number) => {
      if (!ttsSupported) {
        toast({
          title: "TTS 미지원",
          description: "이 브라우저에서는 음성 재생이 지원되지 않습니다.",
          variant: "destructive",
        });
        return;
      }
      if (isSpeaking) {
        stopSpeaking();
      } else {
        speak(text, cid);
      }
    },
    [ttsSupported, isSpeaking, speak, stopSpeaking, toast]
  );

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const scrollToBottom = () => messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });

  useEffect(scrollToBottom, [messages]);
  return (
    // <div className="flex-1 overflow-y-auto">
    <div className="flex-1 overflow-y-auto">
      <div className="p-4 space-y-4">
        {messages.map((msg) => [
          <MessageItem
            key={msg.id}
            role={msg.role}
            content={msg.content}
            timestamp={msg.timestamp}
            cid={msg.cid}
            isSpeaking={isSpeaking}
            ttsSupported={ttsSupported}
            handleSpeakMessage={handleSpeakMessage}
            id={msg.id}
          />,
          afterMessageComponent && msg.id === "welcome-individual" ? (
            <React.Fragment key={msg.id + "-after"}>{afterMessageComponent(msg)}</React.Fragment>
          ) : null,
        ])}
        <div ref={messagesEndRef} />
      </div>
    </div>
    // </div>
  );
};

export default ChatMessages;
