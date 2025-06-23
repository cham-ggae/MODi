'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Send, Volume2, VolumeX, Mic, MicOff } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { useSpeechRecognition, useTextToSpeech } from '@/hooks/use-speech';
import { useToast } from '@/hooks/use-toast';
import { useFamilySpaceStatus } from '@/hooks/use-family-space';

interface Message {
  id: string;
  text: string;
  isUser: boolean;
  timestamp: string;
}

export default function ChatPage() {
  const [message, setMessage] = useState('');
  const [messages, setMessages] = useState<Message[]>([]);
  const [showInitialButtons, setShowInitialButtons] = useState(true);
  const { toast } = useToast();
  const router = useRouter();
  const { hasFamilySpace } = useFamilySpaceStatus();

  const { isSpeaking, speak, stopSpeaking, isSupported: ttsSupported } = useTextToSpeech();
  const {
    isListening,
    startListening,
    stopListening,
    isSupported: sttSupported,
  } = useSpeechRecognition({
    onResult: (transcript) => {
      setMessage(transcript);
    },
    onError: () => {
      toast({ title: '음성인식 오류', variant: 'destructive' });
    },
  });

  useEffect(() => {
    setMessages([
      {
        id: 'bot-initial',
        text: '어떤 요금제를 찾고 계신가요?',
        isUser: false,
        timestamp: new Date().toLocaleTimeString('ko-KR', {
          hour: 'numeric',
          minute: '2-digit',
          hour12: true,
        }),
      },
    ]);
  }, []);

  const handleQuickButton = (text: string, action: string) => {
    // ... (기존 핸들러 로직)
  };

  const sendMessage = () => {
    if (message.trim()) {
      const newMessage: Message = {
        id: Date.now().toString(),
        text: message,
        isUser: true,
        timestamp: new Date().toLocaleTimeString('ko-KR', {
          hour: 'numeric',
          minute: '2-digit',
          hour12: true,
        }),
      };
      setMessages((prev) => [...prev, newMessage]);
      setMessage('');
      setShowInitialButtons(false);

      setTimeout(() => {
        const botMessage: Message = {
          id: (Date.now() + 1).toString(),
          text: '답변 생성 중...',
          isUser: false,
          timestamp: new Date().toLocaleTimeString('ko-KR', {
            hour: 'numeric',
            minute: '2-digit',
            hour12: true,
          }),
        };
        setMessages((prev) => [...prev, botMessage]);
      }, 1000);
    }
  };

  const handleSpeakMessage = (text: string) => {
    if (isSpeaking) {
      stopSpeaking();
    } else {
      speak(text);
    }
  };

  return (
    <>
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.map((msg) => (
          <motion.div
            key={msg.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className={`flex items-end gap-2 ${msg.isUser ? 'justify-end' : 'justify-start'}`}
          >
            {!msg.isUser && (
              <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center flex-shrink-0">
                <span className="text-lg">🤖</span>
              </div>
            )}
            <div
              className={`max-w-xs px-4 py-3 rounded-2xl ${
                msg.isUser
                  ? 'bg-green-500 text-white rounded-br-none'
                  : 'bg-gray-100 dark:bg-gray-700 rounded-bl-none'
              }`}
            >
              <p className="text-sm">{msg.text}</p>
            </div>
            <span className="text-xs text-gray-400">{msg.timestamp}</span>
            {!msg.isUser && ttsSupported && (
              <Button
                onClick={() => handleSpeakMessage(msg.text)}
                variant="ghost"
                size="icon"
                className="w-8 h-8"
              >
                {isSpeaking ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
              </Button>
            )}
          </motion.div>
        ))}
        {/* ... 빠른 답변 버튼 로직 ... */}
      </div>

      <div className="p-4 bg-white dark:bg-gray-900 border-t">
        {/* ... 빠른 추천 검색어 로직 ... */}
        <div className="flex items-center space-x-2">
          <Button onClick={() => {}} variant="ghost" size="icon" disabled={!sttSupported}>
            {isListening ? <MicOff className="w-5 h-5" /> : <Mic className="w-5 h-5" />}
          </Button>
          <Input
            placeholder="메시지를 입력하세요..."
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && sendMessage()}
          />
          <Button
            onClick={sendMessage}
            className="bg-green-500 hover:bg-green-600 rounded-full w-10 h-10 p-2"
          >
            <Send className="w-5 h-5 text-white" />
          </Button>
        </div>
      </div>
    </>
  );
}
