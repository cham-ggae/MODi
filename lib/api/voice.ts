import { authenticatedApiClient } from './axios';

export interface TranscribedTextResponse {
  success: boolean;
  data: {
    transcribedText: string;
    messageId: string;
  };
}

export class VoiceService {
  // TTS 오디오 스트리밍
  static async getTtsAudio(cid: number): Promise<Blob> {
    const response = await authenticatedApiClient.get(`/chat/voice/tts/${cid}`, {
      responseType: 'blob',
    });

    return response.data;
  }
} 