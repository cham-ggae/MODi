'use client';

import { useEffect, useState, useRef } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { handleKakaoCallback } from '@/lib/api/auth';

/**
 * 카카오 OAuth 콜백 처리 페이지
 * - URL에서 인가 코드 추출
 * - 백엔드에 토큰 교환 요청
 * - 추가 정보가 필요한 경우 /basic-info로 이동
 * - 성공 시 /chat 페이지로 이동
 * - 실패 시 로그인 페이지로 이동
 */
export default function KakaoCallbackPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [status, setStatus] = useState<'loading' | 'success' | 'error'>('loading');
  const [errorMessage, setErrorMessage] = useState<string>('');
  const hasProcessed = useRef(false);

  useEffect(() => {
    if (hasProcessed.current) return;
    hasProcessed.current = true;

    const processCallback = async () => {
      try {
        // URL에서 인가 코드 추출
        const code = searchParams.get('code');
        const error = searchParams.get('error');

        // 카카오에서 에러 응답을 보낸 경우
        if (error) {
          throw new Error(`카카오 로그인 오류: ${error}`);
        }

        // 인가 코드가 없는 경우
        if (!code) {
          throw new Error('인가 코드가 없습니다.');
        }

        // 백엔드에 토큰 교환 요청
        const userInfo = await handleKakaoCallback(code);

        // 추가 정보가 필요한 경우
        if (userInfo.requiresAdditionalInfo) {
          setStatus('success');
          // 짧은 딜레이 후 추가 정보 입력 페이지로 이동
          setTimeout(() => {
            router.push('/basic-info');
          }, 1000);
          return;
        }

        setStatus('success');

        // 짧은 딜레이 후 채팅 페이지로 이동
        setTimeout(() => {
          router.push('/chat');
        }, 1500);
      } catch (error) {
        console.error('카카오 로그인 콜백 처리 실패:', error);
        setStatus('error');
        setErrorMessage(error instanceof Error ? error.message : '알 수 없는 오류가 발생했습니다.');

        // 2초 후
        setTimeout(() => {
          router.push('/');
        }, 2000);
      }
    };

    processCallback();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // 로딩 상태
  if (status === 'loading') {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-500 mx-auto"></div>
          <h2 className="mt-4 text-xl font-semibold">로그인 처리 중...</h2>
          <p className="mt-2 text-gray-600">잠시만 기다려주세요.</p>
        </div>
      </div>
    );
  }

  // 성공 상태
  if (status === 'success') {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="text-green-500 text-6xl mb-4">✓</div>
          <h2 className="text-xl font-semibold text-green-600">로그인 성공!</h2>
          <p className="mt-2 text-gray-600">페이지로 이동 중...</p>
        </div>
      </div>
    );
  }

  // 에러 상태
  if (status === 'error') {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="text-red-500 text-6xl mb-4">✗</div>
          <h2 className="text-xl font-semibold text-red-600">로그인 실패</h2>
          <p className="mt-2 text-gray-600">{errorMessage}</p>
          <p className="mt-4 text-sm text-gray-500">로그인 페이지로 이동 중...</p>
        </div>
      </div>
    );
  }

  return null;
}
