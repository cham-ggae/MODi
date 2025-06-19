"use client"

import { useState, useCallback, useRef } from "react"
import { VoiceService } from "@/lib/api/voice"

interface UseSpeechProps {
  onResult?: (transcript: string) => void
  onError?: (error: string) => void
}

export function useSpeechRecognition({ onResult, onError }: UseSpeechProps = {}) {
  const [isListening, setIsListening] = useState(false)
  const [transcript, setTranscript] = useState("")
  const [isSupported, setIsSupported] = useState(true) // 브라우저 지원 여부와 관계없이 항상 true
  const mediaRecorderRef = useRef<MediaRecorder | null>(null)
  const audioChunksRef = useRef<Blob[]>([])

  const startListening = useCallback(() => {
    if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
      onError?.("마이크 접근이 지원되지 않는 브라우저입니다.")
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
            // 오디오 데이터를 파일로 변환
            const audioBlob = new Blob(audioChunksRef.current, { type: 'audio/webm' })
            const audioFile = new File([audioBlob], `audio_${Date.now()}.webm`, { type: 'audio/webm' })
            
            // 백엔드 API로 전송
            const sessionId = Date.now() // 임시 세션 ID
            const response = await VoiceService.uploadAudio(audioFile, sessionId)
            
            if (response.success) {
              const transcribedText = response.data.transcribedText
              setTranscript(transcribedText)
              onResult?.(transcribedText)
            } else {
              onError?.("음성 인식에 실패했습니다.")
            }
          } catch (error) {
            console.error("음성 인식 오류:", error)
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
        console.error("마이크 접근 오류:", error)
        onError?.("마이크 접근 권한이 필요합니다.")
        setIsListening(false)
      })
  }, [onResult, onError])

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
  const [isSupported, setIsSupported] = useState(true)
  const audioRef = useRef<HTMLAudioElement | null>(null)

  const speak = useCallback(async (text: string, cid?: number) => {
    try {
      setIsSpeaking(true)
      
      if (cid) {
        // 백엔드 TTS API 사용
        const audioBlob = await VoiceService.getTtsAudio(cid)
        const audioUrl = URL.createObjectURL(audioBlob)
        
        if (audioRef.current) {
          audioRef.current.pause()
          URL.revokeObjectURL(audioRef.current.src)
        }
        
        audioRef.current = new Audio(audioUrl)
        audioRef.current.onended = () => {
          setIsSpeaking(false)
          URL.revokeObjectURL(audioUrl)
        }
        audioRef.current.onerror = () => {
          setIsSpeaking(false)
          URL.revokeObjectURL(audioUrl)
        }
        
        await audioRef.current.play()
      } else {
        // 브라우저 기본 TTS 사용 (fallback)
        if (!("speechSynthesis" in window)) {
          throw new Error("TTS가 지원되지 않는 브라우저입니다.")
        }

        window.speechSynthesis.cancel()

        const utterance = new SpeechSynthesisUtterance(text)
        utterance.lang = "ko-KR"
        utterance.rate = 0.9
        utterance.pitch = 1

        utterance.onstart = () => {
          setIsSpeaking(true)
        }

        utterance.onend = () => {
          setIsSpeaking(false)
        }

        utterance.onerror = () => {
          setIsSpeaking(false)
        }

        window.speechSynthesis.speak(utterance)
      }
    } catch (error) {
      console.error("TTS 오류:", error)
      setIsSpeaking(false)
    }
  }, [])

  const stopSpeaking = useCallback(() => {
    if (audioRef.current) {
      audioRef.current.pause()
      URL.revokeObjectURL(audioRef.current.src)
      audioRef.current = null
    }
    
    if ("speechSynthesis" in window) {
      window.speechSynthesis.cancel()
    }
    
    setIsSpeaking(false)
  }, [])

  return {
    isSpeaking,
    speak,
    stopSpeaking,
    isSupported,
  }
}
