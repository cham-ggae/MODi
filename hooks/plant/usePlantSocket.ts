import { useEffect } from "react";
import { getAccessToken } from "@/lib/api/axios";
import { PlantEventData } from "@/types/plants.type";

export const usePlantSocket = (fid: number, onReceive: (event: PlantEventData) => void) => {
  useEffect(() => {
    const token = getAccessToken();
    if (!fid || !token) return;

    const socket = new WebSocket(`${process.env.NEXT_PUBLIC_SOCKET_URL}/ws/plant?token=${token}`);

    socket.onopen = () => {
      console.log(" WebSocket 연결됨:", fid);
    };

    socket.onmessage = (event) => {
      try {
        const data: PlantEventData = JSON.parse(event.data);

        if (data.fid !== fid) return; // 다른 가족 이벤트는 무시
        onReceive(data); // 콜백 실행
        console.log(" 이벤트 수신:", data);
      } catch (e) {
        console.error("소켓 메시지 파싱 실패:", e);
      }
    };

    socket.onerror = (e) => {
      console.error("소켓 에러:", e);
    };

    socket.onclose = () => {
      console.log("WebSocket 종료됨");
    };

    return () => socket.close();
  }, [fid, onReceive]);
};
