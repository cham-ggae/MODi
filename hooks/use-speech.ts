"use client"

import { useState, useCallback, useRef, useEffect } from "react"

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
  const [isSupported, setIsSupported] = useState(false)

  useEffect(() => {
    setIsSupported("speechSynthesis" in window)
  }, [])

  const speak = useCallback((text: string) => {
    if (!("speechSynthesis" in window)) {
      console.error("TTS가 지원되지 않는 브라우저입니다.")
      return
    }

    // 기존 음성 중지
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
  }, [])

  const stopSpeaking = useCallback(() => {
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
