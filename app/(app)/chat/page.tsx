'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Switch } from '@/components/ui/switch';
import {
  ArrowLeft,
  Send,
  User,
  MessageSquare,
  Mic,
  Volume2,
  VolumeX,
  MicOff,
  Users,
} from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { useSpeechRecognition, useTextToSpeech } from '@/hooks/use-speech';
import { useToast } from '@/hooks/use-toast';
import { useFamilySpaceStatus } from '@/hooks/use-family-space';
import { ThemeToggle } from '@/components/theme-toggle';

interface Message {
  id: string;
  text: string;
  isUser: boolean;
  timestamp: string;
  isButton?: boolean;
  action?: string;
}

export default function ChatPage() {
  const [message, setMessage] = useState('');
  const [messages, setMessages] = useState<Message[]>([]);
  const [showInitialButtons, setShowInitialButtons] = useState(true);
  const [familyMode, setFamilyMode] = useState(false);
  const { toast } = useToast();
  const router = useRouter();
  const { hasFamilySpace, isLoading } = useFamilySpaceStatus();

  const { isSpeaking, speak, stopSpeaking, isSupported: ttsSupported } = useTextToSpeech();
  const {
    isListening,
    startListening,
    stopListening,
    isSupported: sttSupported,
  } = useSpeechRecognition({
    onResult: (transcript) => {
      setMessage(transcript);
      toast({
        title: '음성인식 완료',
        description: `"${transcript}"`,
      });
    },
    onError: (error) => {
      toast({
        title: '음성인식 오류',
        description: '다시 시도해주세요.',
        variant: 'destructive',
      });
    },
  });

  const initialBotMessage: Message = {
    id: 'bot-1',
    text: familyMode
      ? '가족 결합 요금제에 대해 무엇이든 물어보세요!'
      : '어떤 요금제를 찾고 계신가요?',
    isUser: false,
    timestamp: new Date().toLocaleTimeString('ko-KR', {
      hour: 'numeric',
      minute: '2-digit',
      hour12: true,
    }),
  };

  const quickButtons = [
    { text: '📊 요금제 성향 파악하기', action: 'survey' },
    { text: '💰 요금제 추천받기', action: 'recommend' },
    { text: '🏠 가족 스페이스 보기', action: 'family' },
  ];

  const quickSuggestions = ['추천 요금제', '가족 결합', '데이터 무제한', '5G 요금제', '할인 혜택'];

  useEffect(() => {
    setMessages([initialBotMessage]);
  }, [familyMode]);

  const handleQuickButton = (buttonText: string, action: string) => {
    const userMessage: Message = {
      id: Date.now().toString(),
      text: buttonText,
      isUser: true,
      timestamp: new Date().toLocaleTimeString('ko-KR', {
        hour: 'numeric',
        minute: '2-digit',
        hour12: true,
      }),
    };

    setMessages((prev) => [...prev, userMessage]);
    setShowInitialButtons(false);

    if (action === 'survey') {
      setTimeout(() => {
        router.push('/survey');
      }, 500);
      return;
    }

    if (action === 'family') {
      setTimeout(() => {
        if (hasFamilySpace) {
          router.push('/family-space');
        } else {
          router.push('/family-space-tutorial');
        }
      }, 500);
      return;
    }

    setTimeout(() => {
      let botResponse = '';
      switch (action) {
        case 'recommend':
          botResponse = familyMode
            ? '가족 결합 요금제를 분석해서 최적의 할인 혜택을 찾아드릴게요!'
            : '현재 사용 패턴을 분석해서 가장 적합한 요금제를 추천해드릴게요!';
          break;
        default:
          botResponse = familyMode
            ? '가족 결합에 대해 더 자세히 알려드릴게요!'
            : '도움이 필요하시면 언제든 말씀해주세요!';
      }

      const botMessage: Message = {
        id: (Date.now() + 1).toString(),
        text: botResponse,
        isUser: false,
        timestamp: new Date().toLocaleTimeString('ko-KR', {
          hour: 'numeric',
          minute: '2-digit',
          hour12: true,
        }),
      };
      setMessages((prev) => [...prev, botMessage]);
    }, 1000);
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
          text: familyMode
            ? '가족 결합 요금제 관련해서 더 자세한 정보를 원하시면 성향 분석을 해보시는 것은 어떨까요?'
            : '네, 알겠습니다! 더 자세한 정보를 위해 성향 분석을 해보시는 것은 어떨까요?',
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
    if (!ttsSupported) {
      toast({
        title: 'TTS 미지원',
        description: '이 브라우저에서는 음성 재생이 지원되지 않습니다.',
        variant: 'destructive',
      });
      return;
    }

    if (isSpeaking) {
      stopSpeaking();
    } else {
      speak(text);
    }
  };

  const handleVoiceInput = () => {
    if (!sttSupported) {
      toast({
        title: '음성인식 미지원',
        description: '이 브라우저에서는 음성인식이 지원되지 않습니다.',
        variant: 'destructive',
      });
      return;
    }

    if (isListening) {
      stopListening();
    } else {
      startListening();
    }
  };

  return (
    <div className="flex flex-col flex-1 overflow-hidden w-full max-w-md mx-auto bg-white dark:bg-gray-900">
      {/* Header */}
      <div className="flex items-center justify-between p-4 bg-white dark:bg-gray-800 border-b border-gray-100 dark:border-gray-700 flex-shrink-0">
        <Link href="/">
          <ArrowLeft className="w-6 h-6 text-gray-600 dark:text-gray-300" />
        </Link>
        <h1 className="text-2xl font-bold text-green-500">MODI</h1>
        <div className="flex items-center space-x-2">
          <ThemeToggle />
        </div>
      </div>

      {/* Family Mode Toggle */}
      <div className="p-4 bg-white dark:bg-gray-800 border-b border-gray-100 dark:border-gray-700 flex-shrink-0">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <Users className="w-5 h-5 text-green-500" />
            <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
              가족 결합 집중 모드
            </span>
          </div>
          <Switch
            checked={familyMode}
            onCheckedChange={setFamilyMode}
            className="data-[state=checked]:bg-green-500"
          />
        </div>
        {familyMode && (
          <p className="text-xs text-green-600 dark:text-green-400 mt-2">
            가족 요금제 결합에 특화된 상담을 제공합니다
          </p>
        )}
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto pb-28">
        <div className="p-4 space-y-4">
          {messages.map((msg) => (
            <motion.div
              key={msg.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className={`flex ${msg.isUser ? 'justify-end' : 'justify-start'}`}
            >
              {!msg.isUser && (
                <div className="w-10 h-10 bg-green-100 dark:bg-green-800 rounded-full flex items-center justify-center mr-3 flex-shrink-0">
                  <span className="text-green-600 dark:text-green-300 text-lg">🤖</span>
                </div>
              )}
              <div
                className={`max-w-xs px-4 py-3 rounded-2xl ${
                  msg.isUser
                    ? 'bg-green-500 text-white rounded-br-md'
                    : 'bg-white dark:bg-gray-700 text-gray-900 dark:text-white border border-gray-200 dark:border-gray-600 rounded-bl-md'
                }`}
              >
                <p className="text-sm">{msg.text}</p>
                <div className="flex items-center justify-between mt-2">
                  <p
                    className={`text-xs ${
                      msg.isUser ? 'text-green-100' : 'text-gray-500 dark:text-gray-400'
                    }`}
                  >
                    {msg.timestamp}
                  </p>
                  {!msg.isUser && ttsSupported && (
                    <Button
                      onClick={() => handleSpeakMessage(msg.text)}
                      variant="ghost"
                      size="sm"
                      className="p-1 h-auto ml-2 hover:bg-gray-100 dark:hover:bg-gray-600"
                    >
                      {isSpeaking ? (
                        <VolumeX className="w-4 h-4 text-gray-500 dark:text-gray-400" />
                      ) : (
                        <Volume2 className="w-4 h-4 text-gray-500 dark:text-gray-400" />
                      )}
                    </Button>
                  )}
                </div>
              </div>
            </motion.div>
          ))}

          {/* Quick Action Buttons - 컨테이너 안에 */}
          {showInitialButtons && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
              className="bg-white dark:bg-gray-800 rounded-2xl p-4 border border-gray-200 dark:border-gray-700 space-y-3"
            >
              <h3 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
                추천 메뉴
              </h3>
              {quickButtons.map((button, index) => (
                <motion.div
                  key={button.action}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.7 + index * 0.1 }}
                >
                  <Button
                    onClick={() => handleQuickButton(button.text, button.action)}
                    variant="outline"
                    className="w-full justify-start text-left h-auto py-3 px-4 bg-gray-50 dark:bg-gray-700 hover:bg-gray-100 dark:hover:bg-gray-600 border-gray-200 dark:border-gray-600 rounded-xl"
                  >
                    <span className="text-sm text-gray-700 dark:text-gray-300">{button.text}</span>
                  </Button>
                </motion.div>
              ))}
            </motion.div>
          )}

          {/* Bottom Quick Buttons */}
          {!showInitialButtons && (
            <div className="flex flex-wrap gap-2 mt-4">
              <Button
                onClick={() => handleQuickButton('추천 요금제', 'recommend')}
                size="sm"
                className="bg-green-100 dark:bg-green-800 text-green-700 dark:text-green-300 hover:bg-gray-200 dark:hover:bg-gray-600 rounded-full"
              >
                추천 요금제
              </Button>
              <Button
                onClick={() => handleQuickButton('가족 결합', 'family')}
                size="sm"
                className="bg-green-100 dark:bg-green-800 text-green-700 dark:text-green-300 hover:bg-gray-200 dark:hover:bg-gray-600 rounded-full"
              >
                가족 결합
              </Button>
              <Button
                onClick={() => handleQuickButton('데이터 무제한', 'data')}
                size="sm"
                className="bg-green-100 dark:bg-green-800 text-green-700 dark:text-green-300 hover:bg-gray-200 dark:hover:bg-gray-600 rounded-full"
              >
                데이터 무제한
              </Button>
            </div>
          )}
        </div>
      </div>

      {/* 입력창 */}
      <div className="w-full max-w-md mx-auto bg-white dark:bg-gray-800 border-t border-gray-100 dark:border-gray-700 z-20">
        {/* Quick Suggestions - 메시지 입력창 바로 위에 고정 */}
        {!showInitialButtons && (
          <div className="px-4 py-2">
            <div className="flex gap-2 overflow-x-auto pb-2">
              {quickSuggestions.map((suggestion) => (
                <Button
                  key={suggestion}
                  onClick={() => setMessage(suggestion)}
                  size="sm"
                  variant="outline"
                  className="flex-shrink-0 bg-gray-50 dark:bg-gray-700 text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-600 rounded-full text-xs px-3 py-1"
                >
                  {suggestion}
                </Button>
              ))}
            </div>
          </div>
        )}

        {/* Message Input */}
        <div className="p-4">
          <div className="flex items-center space-x-3">
            {sttSupported && (
              <Button
                onClick={handleVoiceInput}
                variant="outline"
                size="icon"
                className={`rounded-full w-12 h-12 transition-all duration-200 ${
                  isListening
                    ? 'bg-red-100 dark:bg-red-900 border-red-300 dark:border-red-700 text-red-600 dark:text-red-400 animate-pulse'
                    : 'border-gray-300 dark:border-gray-600 text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'
                }`}
              >
                {isListening ? <MicOff className="w-5 h-5" /> : <Mic className="w-5 h-5" />}
              </Button>
            )}
            <Input
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && sendMessage()}
              placeholder={isListening ? '음성을 인식하고 있습니다...' : '메시지를 입력하세요...'}
              className="flex-1 rounded-full border-gray-300 dark:border-gray-600 px-4 py-3 focus:border-green-500 focus:ring-green-500 dark:bg-gray-700 dark:text-white"
              disabled={isListening}
            />
            <Button
              onClick={sendMessage}
              size="icon"
              className="bg-green-500 hover:bg-gray-600 dark:hover:bg-gray-400 rounded-full w-12 h-12"
            >
              <Send className="w-5 h-5" />
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
