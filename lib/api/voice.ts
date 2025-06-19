import { apiClient, authenticatedApiClient } from './axios';

export interface TranscribedTextResponse {
  success: boolean;
  data: {
    transcribedText: string;
    messageId: string;
  };
}

export interface TtsLogResponse {
  success: boolean;
  message: string;
}

export class VoiceService {
  // 음성 파일 업로드 및 STT 처리
  static async uploadAudio(audioFile: File, sessionId: number): Promise<TranscribedTextResponse> {
    const formData = new FormData();
    formData.append('audio_file', audioFile);
    formData.append('session_id', sessionId.toString());

    const response = await authenticatedApiClient.post('/chat/voice/upload', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });

    return response.data;
  }

  // TTS 오디오 스트리밍
  static async getTtsAudio(cid: number): Promise<Blob> {
    const response = await apiClient.get(`/chat/voice/tts/${cid}`, {
      responseType: 'blob',
    });

    return response.data;
  }
} 