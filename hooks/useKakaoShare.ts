import { useEffect } from 'react'

declare global {
  interface Window {
    Kakao: any;
  }
}

export function useKakaoInit() {
  useEffect(() => {
    if (typeof window !== 'undefined' && window.Kakao && !window.Kakao.isInitialized()) {
      window.Kakao.init(process.env.NEXT_PUBLIC_KAKAO_JS_KEY)
    }
  }, [])
}

export function shareKakao(inviteCode: string, familyName: string) {
  if (!window.Kakao || !window.Kakao.isInitialized()) {
    window.Kakao.init(process.env.NEXT_PUBLIC_KAKAO_JS_KEY)
  }
  
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || (typeof window !== 'undefined' ? window.location.origin : 'https://modi.app');
  const imageUrl = `${baseUrl}/images/modi-logo-small.png`;

  window.Kakao.Link.sendDefault({
    objectType: 'feed',
    content: {
      title: `🌱 ${familyName} 가족 스페이스에 초대합니다!`,
      description: `함께 식물을 키우고 요금제도 절약해요!\n초대 코드: ${inviteCode}`,
      imageUrl: imageUrl,
      link: {
        mobileWebUrl: 'https://modi.app',
        webUrl: 'https://modi.app',
      },
    },
    buttons: [
      {
        title: 'MODi에서 확인',
        link: {
          mobileWebUrl: 'https://modi.app',
          webUrl: 'https://modi.app',
        },
      },
    ],
  })
} 