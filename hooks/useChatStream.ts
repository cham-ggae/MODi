// src/hooks/useChatFetchStream.ts
import { useState, useRef, useCallback, useEffect } from 'react';
import { authenticatedApiClient } from '@/lib/api/axios';
import { useAuthStore } from '@/store/useAuthStore';
import { ChatCompletionChunk } from '@/types/chat.type';

export function useChatStream() {
  const [message, setMessage] = useState('');
  const [isStreaming, setIsStreaming] = useState(false);
  const [error, setError] = useState<Error | null>(null);
  const controllerRef = useRef<AbortController | null>(null);
  const currentMessageRef = useRef('');

  const start = useCallback(async (prompt: string, sessionId: string, members: number) => {
    controllerRef.current?.abort();
    setMessage('');
    setError(null);
    setIsStreaming(true);

    // 1) 토큰 갱신 트리거
    await authenticatedApiClient.get('/test');
    const accessToken = localStorage.getItem("accessToken");

    // 2) fetch 스트림 열기
    const controller = new AbortController();
    controllerRef.current = controller;

    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_ADDR}/chat?sessionId=${encodeURIComponent(sessionId)}&prompt=${encodeURIComponent(`${prompt} (요금제 추천 시 LGU+만)`)}&members=${members}`,
        {
          headers: { 'Authorization': `Bearer ${accessToken}` },
          credentials: 'include',
          signal: controller.signal,
        }
      );
      if (!res.body) throw new Error('ReadableStream 미지원');

      const reader = res.body.getReader();
      const decoder = new TextDecoder();
      let buffer = ''; // 청크가 잘릴 수 있으니 누적

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        buffer += decoder.decode(value, { stream: true });

        // "\n\n" 로 완결된 메시지 단위 분리
        const parts = buffer.split('\n\n');
        buffer = parts.pop()!; // 아직 끝나지 않은 마지막 조각은 버퍼에 남겨두고
        for (const part of parts) {
          // part에는 "data:{...}" 형태가 와 있으므로
          if (!part.startsWith('data:')) continue;
          const jsonString = part.replace(/^data:/, '').trim();
          try {
            const chunk = JSON.parse(jsonString) as ChatCompletionChunk;
            console.log(chunk);
            const choice = chunk.choices[0];
            if (choice.finish_reason) {
              controller.abort();
              setIsStreaming(false);
              return;
            }
            const delta = chunk.choices[0].delta.content;
            if (delta) {
              // ① 기존 텍스트 + delta 합치고
              const combined = currentMessageRef.current + delta;
              // ② ### 바로붙어 있는 곳에 공백 추가
              let fixed = combined
                // 붙어 있는 “###” → “### ” (헤딩 문법 보정)
                .replace(/###(?=\S)/g, '### ')
                // “### 제목” → “- 제목” (마크다운 리스트로 변환)
                .replace(/^###\s*(.*)$/gm, '- $1');
              // ③ 한 줄에 붙은 “ - ” 구문을 실제 리스트 항목으로 분리
              fixed = fixed
                // “<내용> - <키워드>” 패턴을 “\n- <키워드>”로 분리
                .replace(/([^\n])\s*-\s*/g, '$1\n- ')
                // 혹시 연속된 빈 줄이 많다면 하나로
                .replace(/\n{2,}/g, '\n\n')
                .trim();
              // ③ state 에 반영
              setMessage(fixed);
              // ④ ref 도 업데이트
              currentMessageRef.current = fixed;
              setMessage(prev => prev + delta);
            }
          } catch (e) {
            console.error('JSON 파싱 에러', e);
          }
        }
      }
    } catch (e: any | null) {
      if (e.name !== 'AbortError') setError(e);
    } finally {
      setIsStreaming(false);
    }
  }, []);

  const stop = useCallback(() => {
    controllerRef.current?.abort();
    setIsStreaming(false);
  }, []);

  useEffect(() => () => controllerRef.current?.abort(), []);

  return { message, isStreaming, error, start, stop };
}
