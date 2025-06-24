"use client"

import { useState, useCallback, useRef, useEffect } from "react"
import { VoiceService } from "@/lib/api/voice"

interface UseSpeechProps {
  onResult?: (transcript: string) => void
  onError?: (error: string) => void
}

export function useSpeechRecognition({ onResult, onError }: UseSpeechProps = {}) {
  const [isListening, setIsListening] = useState(false)
  const [transcript, setTranscript] = useState("")
  const [isSupported, setIsSupported] = useState(false)
  const recognitionRef = useRef<any | null>(null)

  useEffect(() => {
    // Check if speech recognition is supported
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition
    setIsSupported(!!SpeechRecognition)
  }, [])

  const startListening = useCallback(() => {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition

    if (!SpeechRecognition) {
      onError?.("음성인식이 지원되지 않는 브라우저입니다.")
      return
    }

    const recognition = new SpeechRecognition()

    recognition.continuous = false
    recognition.interimResults = false
    recognition.lang = "ko-KR"

    recognition.onstart = () => {
      setIsListening(true)
    }

    recognition.onresult = (event: any) => {
      const result = event.results[0][0].transcript
      setTranscript(result)
      onResult?.(result)
    }

    recognition.onerror = (event: any) => {
      setIsListening(false)
      onError?.(event.error || "음성인식 오류가 발생했습니다.")
    }

    recognition.onend = () => {
      setIsListening(false)
    }

    recognitionRef.current = recognition
    recognition.start()
  }, [onResult, onError])

  const stopListening = useCallback(() => {
    if (recognitionRef.current) {
      recognitionRef.current.stop()
    }
    setIsListening(false)
  }, [])

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
      console.log('TTS API 호출:', `/chat/voice/tts/${cid}`);
      
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
      console.error("TTS 오류:", error);
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
