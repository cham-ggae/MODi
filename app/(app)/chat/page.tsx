'use client';

import { useState, Fragment } from 'react';
import FamilyModeToggle from '@/components/chat/FamilyModeToggle';
import ChatMessages from '@/components/chat/ChatMessages';
import ChatInput from '@/components/chat/ChatInput';
import { ClientMessage } from '@/types/chat.type';

export default function ChatPage() {
  const [sessionId] = useState(() =>
    window.crypto?.randomUUID?.() ??
    `${Date.now()}-${Math.random().toString(36).slice(2)}`
  )
  const [messages, setMessages] = useState<ClientMessage[]>([
    {
      id: "welcome",
      content:
        /*isFamilyMode && familyMembers.length > 0
          ? `안녕하세요! 가족 맞춤형 요금제 추천 챗봇 MODi입니다. 현재 ${familyMembers.length}명 가족 정보를 바탕으로 도와드릴게요! 💕`
          : */'"안녕하세요! 개인 맞춤형 요금제 추천을 위한 MODi 챗봇입니다. 당신의 통신 상황에 맞는 최적의 요금제를 찾아드릴게요!"',
      role: "bot",
      timestamp: new Date(),
      sessionId: sessionId
    },
  ]);
  // const [message, setMessage] = useState('');
  // const [showInitialButtons, setShowInitialButtons] = useState(true);
  // const [familyMode, setFamilyMode] = useState(false);
  // const router = useRouter();
  // const { hasFamilySpace, isLoading } = useFamilySpaceStatus();

  // const { isSpeaking, speak, stopSpeaking, isSupported: ttsSupported } = useTextToSpeech();
  // const {
  //   isListening,
  //   startListening,
  //   stopListening,
  //   isSupported: sttSupported,
  // } = useSpeechRecognition({
  //   onResult: (transcript) => {
  //     setMessage(transcript);
  //     toast({
  //       title: '음성인식 완료',
  //       description: `"${transcript}"`,
  //     });
  //   },
  //   onError: (error) => {
  //     toast({
  //       title: '음성인식 오류',
  //       description: '다시 시도해주세요.',
  //       variant: 'destructive',
  //     });
  //   },
  // });

  // const quickButtons = [
  //   { text: '📊 요금제 성향 파악하기', action: 'survey' },
  //   { text: '💰 요금제 추천받기', action: 'recommend' },
  //   { text: '🏠 가족 스페이스 보기', action: 'family' },
  // ];

  // const quickSuggestions = ['추천 요금제', '가족 결합', '데이터 무제한', '5G 요금제', '할인 혜택'];

  // const handleQuickButton = (buttonText: string, action: string) => {
  //   const userMessage: Message = {
  //     id: Date.now().toString(),
  //     text: buttonText,
  //     isUser: true,
  //     timestamp: new Date().toLocaleTimeString('ko-KR', {
  //       hour: 'numeric',
  //       minute: '2-digit',
  //       hour12: true,
  //     }),
  //   };

  //   setMessages((prev) => [...prev, userMessage]);
  //   setShowInitialButtons(false);

  //   if (action === 'survey') {
  //     setTimeout(() => {
  //       router.push('/survey');
  //     }, 500);
  //     return;
  //   }

  //   if (action === 'family') {
  //     setTimeout(() => {
  //       if (hasFamilySpace) {
  //         router.push('/family-space');
  //       } else {
  //         router.push('/family-space-tutorial');
  //       }
  //     }, 500);
  //     return;
  //   }

  //   setTimeout(() => {
  //     let botResponse = '';
  //     switch (action) {
  //       case 'recommend':
  //         botResponse = familyMode
  //           ? '가족 결합 요금제를 분석해서 최적의 할인 혜택을 찾아드릴게요!'
  //           : '현재 사용 패턴을 분석해서 가장 적합한 요금제를 추천해드릴게요!';
  //         break;
  //       default:
  //         botResponse = familyMode
  //           ? '가족 결합에 대해 더 자세히 알려드릴게요!'
  //           : '도움이 필요하시면 언제든 말씀해주세요!';
  //     }

  //     const botMessage: Message = {
  //       id: (Date.now() + 1).toString(),
  //       text: botResponse,
  //       isUser: false,
  //       timestamp: new Date().toLocaleTimeString('ko-KR', {
  //         hour: 'numeric',
  //         minute: '2-digit',
  //         hour12: true,
  //       }),
  //     };
  //     setMessages((prev) => [...prev, botMessage]);
  //   }, 1000);
  // };

  // const sendMessage = () => {
  //   if (message.trim()) {
  //     const newMessage: Message = {
  //       id: Date.now().toString(),
  //       text: message,
  //       isUser: true,
  //       timestamp: new Date().toLocaleTimeString('ko-KR', {
  //         hour: 'numeric',
  //         minute: '2-digit',
  //         hour12: true,
  //       }),
  //     };
  //     setMessages((prev) => [...prev, newMessage]);
  //     setMessage('');
  //     setShowInitialButtons(false);

  //     setTimeout(() => {
  //       const botMessage: Message = {
  //         id: (Date.now() + 1).toString(),
  //         text: familyMode
  //           ? '가족 결합 요금제 관련해서 더 자세한 정보를 원하시면 성향 분석을 해보시는 것은 어떨까요?'
  //           : '네, 알겠습니다! 더 자세한 정보를 위해 성향 분석을 해보시는 것은 어떨까요?',
  //         isUser: false,
  //         timestamp: new Date().toLocaleTimeString('ko-KR', {
  //           hour: 'numeric',
  //           minute: '2-digit',
  //           hour12: true,
  //         }),
  //       };
  //       setMessages((prev) => [...prev, botMessage]);
  //     }, 1000);
  //   }
  // };



  // const handleVoiceInput = () => {
  //   if (!sttSupported) {
  //     toast({
  //       title: '음성인식 미지원',
  //       description: '이 브라우저에서는 음성인식이 지원되지 않습니다.',
  //       variant: 'destructive',
  //     });
  //     return;
  //   }

  //   if (isListening) {
  //     stopListening();
  //   } else {
  //     startListening();
  //   }
  // };

  return (
    <Fragment>
      <FamilyModeToggle />
      <ChatMessages messages={messages} />
      <ChatInput setMessages={setMessages} sessionId={sessionId} />
    </Fragment>
  );
}
