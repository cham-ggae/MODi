"use client"

import { useEffect, useRef, useState } from "react"

export interface WaterEventData {
  fid: string
  uid: string
  name: string
  avatarUrl: string
  timestamp: string
}

export function usePlantSocket(familyId?: string) {
  const [isConnected, setIsConnected] = useState(false)
  const [waterEvents, setWaterEvents] = useState<WaterEventData[]>([])
  const wsRef = useRef<WebSocket | null>(null)

  useEffect(() => {
    if (!familyId) return

    // WebSocket 연결
    const connectWebSocket = () => {
      try {
        // 실제 환경에서는 wss://your-domain/ws/water 사용
        const wsUrl = `ws://localhost:8080/ws/water?fid=${familyId}`
        wsRef.current = new WebSocket(wsUrl)

        wsRef.current.onopen = () => {
          console.log("WebSocket connected")
          setIsConnected(true)
        }

        wsRef.current.onmessage = (event) => {
          try {
            const data: WaterEventData = JSON.parse(event.data)
            setWaterEvents((prev) => [data, ...prev.slice(0, 9)]) // 최근 10개만 유지
          } catch (error) {
            console.error("Failed to parse WebSocket message:", error)
          }
        }

        wsRef.current.onclose = () => {
          console.log("WebSocket disconnected")
          setIsConnected(false)
          // 재연결 시도
          setTimeout(connectWebSocket, 3000)
        }

        wsRef.current.onerror = (error) => {
          console.error("WebSocket error:", error)
          setIsConnected(false)
        }
      } catch (error) {
        console.error("Failed to connect WebSocket:", error)
        // 재연결 시도
        setTimeout(connectWebSocket, 3000)
      }
    }

    connectWebSocket()

    return () => {
      if (wsRef.current) {
        wsRef.current.close()
      }
    }
  }, [familyId])

  const sendWaterEvent = (uid: string, name: string, avatarUrl: string) => {
    if (wsRef.current && wsRef.current.readyState === WebSocket.OPEN && familyId) {
      const message = {
        fid: familyId,
        uid,
        name,
        avatarUrl,
        timestamp: new Date().toISOString(),
      }
      wsRef.current.send(JSON.stringify(message))
    }
  }

  return {
    isConnected,
    waterEvents,
    sendMessage: sendWaterEvent,
  }
}
