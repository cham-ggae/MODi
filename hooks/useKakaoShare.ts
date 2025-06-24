import { useEffect, useState } from "react";
import { typeImageMap, bugIdToNameMap } from "@/lib/survey-result-data";

declare global {
  interface Window {
    Kakao: any;
  }
}

// SDK 로드 상태를 추적하는 전역 변수
let isSDKLoaded = false;

// SDK 로드 및 초기화를 처리하는 함수
const initializeKakao = () => {
  return new Promise<void>((resolve, reject) => {
    if (typeof window === "undefined") {
      reject(new Error("Window is not defined"));
      return;
    }

    if (window.Kakao && isSDKLoaded) {
      resolve();
      return;
    }

    // SDK가 이미 로드되어 있는 경우
    if (window.Kakao && !isSDKLoaded) {
      window.Kakao.init(process.env.NEXT_PUBLIC_KAKAO_JS_KEY);
      isSDKLoaded = true;
      resolve();
      return;
    }

    // SDK 로드 시도
    const script = document.createElement("script");
    script.src = "https://developers.kakao.com/sdk/js/kakao.js";
    script.onload = () => {
      window.Kakao.init(process.env.NEXT_PUBLIC_KAKAO_JS_KEY);
      isSDKLoaded = true;
      resolve();
    };
    script.onerror = () => reject(new Error("Failed to load Kakao SDK"));
    document.head.appendChild(script);
  });
};

export function useKakaoInit() {
  const [isLoaded, setIsLoaded] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    initializeKakao()
      .then(() => setIsLoaded(true))
      .catch((err) => setError(err));
  }, []);

  return { isLoaded, error };
}

export function shareKakao(inviteCode: string, familyName: string) {
  if (!window.Kakao || !window.Kakao.isInitialized()) {
    throw new Error("카카오톡 SDK가 초기화되지 않았습니다.");
  }

  const baseUrl =
    process.env.NEXT_PUBLIC_BASE_URL ||
    (typeof window !== "undefined" ? window.location.origin : "https://modi.app");
  const imageUrl = `${baseUrl}/images/modi-logo-small.png`;

  window.Kakao.Link.sendDefault({
    objectType: "feed",
    content: {
      title: `🌱 ${familyName} 가족 스페이스에 초대합니다!`,
      description: `함께 식물을 키우고 요금제도 절약해요!\n초대 코드: ${inviteCode}`,
      imageUrl: imageUrl,
      link: {
        mobileWebUrl: "https://modi.app",
        webUrl: "https://modi.app",
      },
    },
    buttons: [
      {
        title: "MODi에서 확인",
        link: {
          mobileWebUrl: "https://modi.app",
          webUrl: "https://modi.app",
        },
      },
    ],
  });
}

export function shareSurveyResult(bugId: number, userType: string) {
  if (!window.Kakao || !window.Kakao.isInitialized()) {
    window.Kakao.init(process.env.NEXT_PUBLIC_KAKAO_JS_KEY);
  }

  const baseUrl =
    process.env.NEXT_PUBLIC_BASE_URL ||
    (typeof window !== "undefined" ? window.location.origin : "https://modi.app");
  // bugId에 해당하는 이미지 가져오기
  const bugName = bugIdToNameMap[bugId] || "호박벌형";
  const imageUrl = `${baseUrl}${typeImageMap[bugName]}`;
  const shareUrl = `${baseUrl}/survey-result?bugId=${bugId}`;

  window.Kakao.Link.sendDefault({
    objectType: "feed",
    content: {
      title: `💚 내 성향테스트 결과는?! ${userType}!`,
      description: "내 성향이 궁금하다면 MDOi에서 테스트해보세요!",
      imageUrl: imageUrl,
      link: {
        mobileWebUrl: shareUrl,
        webUrl: shareUrl,
      },
    },
    buttons: [
      {
        title: "MODi에서 확인",
        link: {
          mobileWebUrl: shareUrl,
          webUrl: shareUrl,
        },
      },
    ],
  });
}
