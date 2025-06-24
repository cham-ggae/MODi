import { useEffect } from "react";

declare global {
  interface Window {
    Kakao: any;
  }
}

export function useKakaoInit() {
  useEffect(() => {
    const loadKakaoSDK = () => {
      return new Promise<void>((resolve, reject) => {
        // 이미 로드되어 있는 경우
        if (window.Kakao) {
          resolve();
          return;
        }

        // 스크립트가 로드 중인지 확인
        const existingScript = document.querySelector('script[src*="kakao.js"]');
        if (existingScript) {
          // 스크립트가 로드될 때까지 대기
          const checkLoaded = setInterval(() => {
            if (window.Kakao) {
              clearInterval(checkLoaded);
              resolve();
            }
          }, 100);

          // 10초 후 타임아웃
          setTimeout(() => {
            clearInterval(checkLoaded);
            reject(new Error("카카오 SDK 로드 타임아웃"));
          }, 10000);
          return;
        }

        // 스크립트 동적 로드
        const script = document.createElement("script");
        script.src = "https://developers.kakao.com/sdk/js/kakao.js";
        script.async = true;
        script.onload = () => {
          console.log("✅ 카카오 SDK 스크립트 로드 완료");
          resolve();
        };
        script.onerror = () => {
          console.error("❌ 카카오 SDK 스크립트 로드 실패");
          reject(new Error("카카오 SDK 스크립트 로드 실패"));
        };
        document.head.appendChild(script);
      });
    };

    const initKakao = async () => {
      try {
        console.log("🔍 카카오 SDK 초기화 시도:", {
          windowExists: typeof window !== "undefined",
          windowKakao: typeof window !== "undefined" ? !!window.Kakao : false,
          isInitialized:
            typeof window !== "undefined" && window.Kakao ? window.Kakao.isInitialized() : false,
          jsKey: process.env.NEXT_PUBLIC_KAKAO_JS_KEY,
        });

        // SDK 로드 대기
        await loadKakaoSDK();

        if (typeof window !== "undefined" && window.Kakao && !window.Kakao.isInitialized()) {
          console.log("✅ 카카오 SDK 초기화 실행");
          window.Kakao.init(process.env.NEXT_PUBLIC_KAKAO_JS_KEY);
          console.log("✅ 카카오 SDK 초기화 완료");
        }
      } catch (error) {
        console.error("❌ 카카오 SDK 초기화 실패:", error);
      }
    };

    if (typeof window !== "undefined") {
      initKakao();
    }
  }, []);
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
