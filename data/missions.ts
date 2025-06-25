import { Mission } from '@/types/plant-game.type';

export const MISSIONS: Mission[] = [
  {
    id: 1,
    title: "1일 1회 출석하기",
    description: "매일 밤 12시에 다시 시작됩니다.",
    icon: "✏️",
    reward: "출석하기",
    activityType: "attendance",
  },
  {
    id: 2,
    title: "가족에게 메세지 남기기",
    description: "사랑하는 가족에게 작은 한마디",
    icon: "💌",
    reward: "메세지 작성",
    activityType: "emotion",
  },
  {
    id: 3,
    title: "요금제 퀴즈 풀기",
    description: "더 많은 할인이 기다릴지도?",
    icon: "🎯",
    reward: "퀴즈 풀기",
    activityType: "quiz",
  },
  {
    id: 4,
    title: "골라 골라 오늘의 요금제",
    description: "카들르 맞히고 요금제를 알아봐!!",
    icon: "🎲",
    reward: "카드 맞히기",
    activityType: "lastleaf",
  },
  {
    id: 5,
    title: "가족 등록",
    description: "가족 등록하고 더 많은 보상을 받아보세요!",
    icon: "👨‍👩‍👧‍👦",
    reward: "초대하기",
    activityType: "register",
  },
  {
    id: 6,
    title: "통신 성향 검사",
    description: "나에게 맞는 통신 캐릭터는?",
    icon: "💬",
    reward: "검사하기",
    activityType: "survey",
  },
]; 