import { useEffect } from "react";
import { getAccessToken } from "@/lib/api/axios"; // SSR-safe 버전 사용
import { WaterEventData } from "@/types/plants.type";

export const useWaterSocket = (fid: number, onReceive: (eventData: WaterEventData) => void) => {
  useEffect(() => {
    const token = getAccessToken();
    if (!fid || !token) return;

    const socket = new WebSocket(`${process.env.NEXT_PUBLIC_SOCKET_URL}/ws/water?token=${token}`);

    socket.onopen = () => {
      console.log("WebSocket 연결됨:", fid);
    };

    socket.onmessage = (event) => {
      try {
        const data: WaterEventData = JSON.parse(event.data);
        if (data.fid === fid) {
          onReceive(data);
          console.log("물주기 수신:", data);
        }
      } catch (e) {
        console.error("메시지 파싱 실패:", e);
      }
    };

    socket.onerror = (e) => console.error("소켓 에러:", e);
    socket.onclose = () => console.log("WebSocket 종료됨");

    return () => socket.close();
  }, [fid, onReceive]);
};
