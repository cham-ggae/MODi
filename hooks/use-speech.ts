"use client"

import { useState, useCallback, useRef, useEffect } from "react"
import { VoiceService } from "@/lib/api/voice"

interface UseSpeechProps {
  onResult?: (transcript: string) => void
  onError?: (error: string) => void
  sessionId?: string
}

export function useSpeechRecognition({ onResult, onError, sessionId }: UseSpeechProps = {}) {
  const [isListening, setIsListening] = useState(false)
  const [transcript, setTranscript] = useState("")
  const [isSupported] = useState(true)
  const mediaRecorderRef = useRef<MediaRecorder | null>(null)
  const audioChunksRef = useRef<Blob[]>([])

  const startListening = useCallback(() => {
    if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
      onError?.("마이크 접근이 지원되지 않는 브라우저입니다.")
      return
    }

    if (!sessionId) {
      onError?.("세션 ID가 필요합니다.")
      return
    }

    navigator.mediaDevices.getUserMedia({ audio: true })
      .then((stream) => {
        setIsListening(true)
        audioChunksRef.current = []

        const mediaRecorder = new MediaRecorder(stream, {
          mimeType: 'audio/webm;codecs=opus'
        })

        mediaRecorder.ondataavailable = (event) => {
          if (event.data.size > 0) {
            audioChunksRef.current.push(event.data)
          }
        }

        mediaRecorder.onstop = async () => {
          try {
            // 오디오 데이터를 Blob으로 변환
            const audioBlob = new Blob(audioChunksRef.current, { type: 'audio/webm' })
            
            // console.log('STT API 호출:', '/chat/voice/upload');
            // console.log('오디오 정보:', {
            //   blobSize: audioBlob.size,
            //   duration: audioChunksRef.current.length,
            //   type: audioBlob.type
            // });
            
            // 1) 토큰 갱신 트리거
            const { authenticatedApiClient } = await import('@/lib/api/axios');
            await authenticatedApiClient.get('/test');
            
            // 백엔드 STT API로 전송 (VoiceService static 메서드 사용)
            const response = await VoiceService.uploadAudio(audioBlob, sessionId)
            
            // console.log('STT 응답 상세:', response);
            
            if (response.success) {
              const transcribedText = response.data.transcribedText
              // console.log('인식된 텍스트:', transcribedText);
              setTranscript(transcribedText)
              onResult?.(transcribedText)
            } else {
              onError?.("음성 인식에 실패했습니다.")
            }
          } catch (error) {
            // console.error("음성 인식 오류:", error)
            onError?.("음성 인식 중 오류가 발생했습니다.")
          } finally {
            setIsListening(false)
            // 스트림 정리
            stream.getTracks().forEach(track => track.stop())
          }
        }

        mediaRecorderRef.current = mediaRecorder
        mediaRecorder.start()
      })
      .catch((error) => {
        // console.error("마이크 접근 오류:", error)
        onError?.("마이크 접근 권한이 필요합니다.")
        setIsListening(false)
      })
  }, [onResult, onError, sessionId])

  const stopListening = useCallback(() => {
    if (mediaRecorderRef.current && isListening) {
      mediaRecorderRef.current.stop()
    }
  }, [isListening])

  return {
    isListening,
    transcript,
    startListening,
    stopListening,
    isSupported,
  }
}

export function useTextToSpeech() {
  const [isSpeaking, setIsSpeaking] = useState(false)
  const [isSupported] = useState(true) // 백엔드 API 사용하므로 항상 true
  const audioRef = useRef<HTMLAudioElement | null>(null)

  const speak = useCallback(async (text: string, cid?: number) => {
    if (!cid) {
      console.error("cid가 필요합니다.");
      setIsSpeaking(false);
      return;
    }

    try {
      setIsSpeaking(true);
      // console.log('TTS API 호출:', `/chat/voice/tts/${cid}`);
      
      // 백엔드 TTS API 호출
      const audioBlob = await VoiceService.getTtsAudio(cid);
      const audioUrl = URL.createObjectURL(audioBlob);
      
      if (audioRef.current) {
        audioRef.current.pause();
        URL.revokeObjectURL(audioRef.current.src);
      }
      
      audioRef.current = new Audio(audioUrl);
      audioRef.current.onended = () => {
        setIsSpeaking(false);
        URL.revokeObjectURL(audioUrl);
      }
      audioRef.current.onerror = () => {
        setIsSpeaking(false);
        URL.revokeObjectURL(audioUrl);
      }
      
      await audioRef.current.play();
    } catch (error) {
      // console.error("TTS 오류:", error);
      setIsSpeaking(false);
    }
  }, [])

  const stopSpeaking = useCallback(() => {
    if (audioRef.current) {
      audioRef.current.pause();
      URL.revokeObjectURL(audioRef.current.src);
      audioRef.current = null;
    }
    setIsSpeaking(false);
  }, [])

  return {
    isSpeaking,
    speak,
    stopSpeaking,
    isSupported,
  }
}
