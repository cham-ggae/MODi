import React, { useEffect, useRef, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Mic, MicOff, Send } from 'lucide-react';
import { useSpeechRecognition, useTextToSpeech } from '@/hooks/use-speech';
import { useToast } from '../ui/use-toast';
import SttButton from './SttButton';
import { ClientMessage } from '@/types/chat.type';
import { useChatStream } from '@/hooks/useChatStream';
import { v4 as uuidv4 } from 'uuid'

interface ChatInputProps {
  sessionId: string;
  setMessages: React.Dispatch<React.SetStateAction<ClientMessage[]>>;
  familyMode: boolean;
  familySize: number;
  familySessionId: string;
}
const ChatInput = ({ sessionId, setMessages, familyMode, familySize, familySessionId }: ChatInputProps) => {
  const [message, setMessage] = useState('');
  const {
    isListening,
    startListening,
    stopListening,
    isSupported: sttSupported,
  } = useSpeechRecognition();

  const { message: aiChunk, cid, isStreaming, error, start, stop } =
    useChatStream()

  // 이 ref 에 새로 추가한 AI placeholder 메시지의 id 를 저장
  const aiMessageIdRef = useRef<string | null>(null)

  // 사용자가 전송 버튼 클릭했을 때
  const handleSend = () => {
    if (!message.trim()) return;
    // 1) 사용자 메시지 추가
    const userMsg: ClientMessage = {
      id: uuidv4(),
      content: message,
      role: "user",
      timestamp: new Date(),
      sessionId: familyMode ? familySessionId : sessionId
    }

    // 2) AI placeholder 메시지 추가 (content는 빈 문자열로 시작)
    const aiId = uuidv4()
    aiMessageIdRef.current = aiId
    const aiMsg: ClientMessage = {
      id: aiId,
      content: '',
      role: "bot",
      timestamp: new Date(),
      sessionId: familyMode ? familySessionId : sessionId
    }

    setMessages((prev) => [...prev, userMsg, aiMsg])

    // 3) 스트리밍 시작
    start(message, familyMode ? familySessionId : sessionId, familyMode ? familySize : 1)
    setMessage('')
  }

  // aiChunk가 갱신될 때마다 placeholder 메시지의 content만 업데이트
  useEffect(() => {
    if (!aiMessageIdRef.current) return
    setMessages((prev) =>
      prev.map((msg) =>
        msg.id === aiMessageIdRef.current
          ? { ...msg, content: aiChunk, timestamp: msg.timestamp }
          : msg
      )
    )
  }, [aiChunk, setMessages])

  // 스트리밍이 끝나면 cid를 메시지에 업데이트
  useEffect(() => {
    if (!isStreaming && cid && aiMessageIdRef.current) {
      setMessages((prev) =>
        prev.map((msg) =>
          msg.id === aiMessageIdRef.current ? { ...msg, cid: cid } : msg
        )
      );
      console.log('CID assigned to message:', cid);
    }
  }, [isStreaming, cid, setMessages]);

  // 중단 버튼 처리: stop() 부르고 placeholder 메시지 유지
  const handleStop = () => {
    stop()
  }
  return (
    <div className="w-full max-w-md mx-auto bg-white dark:bg-gray-800 border-t border-gray-100 dark:border-gray-700 flex-shrink-0">
      <div className="p-4">
        <div className="flex items-center space-x-3">
          {sttSupported && (
            <SttButton setMessage={setMessage} sessionId={sessionId} />
          )}
          <Input
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            placeholder={isListening ? '음성을 인식하고 있습니다...' : '메시지를 입력하세요...'}
            onKeyPress={(e) => (e.key === 'Enter' && !isStreaming) && handleSend()}
            className="flex-1 rounded-full border-gray-300 dark:border-gray-600 px-4 py-3 focus:border-green-500 focus:ring-green-500 dark:bg-gray-700 dark:text-white"
            disabled={isListening}
          />
          {isStreaming ? (
            <Button onClick={handleStop} size="icon" className="bg-red-500 hover:bg-gray-600 dark:hover:bg-gray-400 rounded-full w-12 h-12">
              중단
            </Button>
          ) :
            <Button
              onClick={handleSend} // 메시지 전송은 page에서 props로 내려받아 처리할 수 있음
              size="icon"
              className="bg-green-500 hover:bg-gray-600 dark:hover:bg-gray-400 rounded-full w-12 h-12"
            >
              <Send className="w-5 h-5" />
            </Button>
          }
        </div>
      </div>
    </div>
  );
};

export default ChatInput;