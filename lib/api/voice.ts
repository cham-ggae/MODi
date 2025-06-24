import { authenticatedApiClient } from './axios';

export interface TranscribedTextResponse {
  success: boolean;
  data: {
    transcribedText: string;
    messageId: string;
  };
}

export class VoiceService {
  // 음성 파일 업로드 및 STT 처리
  static async uploadAudio(audioBlob: Blob, sessionId: string): Promise<any> {
    const formData = new FormData();
    formData.append('audio_file', audioBlob, 'audio.wav');
    
    try {
      // 백엔드에서 String sessionId를 받도록 수정됨
      const response = await authenticatedApiClient.post(`/chat/voice/upload?session_id=${sessionId}`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

    //   console.log('VoiceService.uploadAudio 응답:', response.data);
      return response.data;
    } catch (error: any) {
    //   console.error('VoiceService.uploadAudio 오류:', {
    //     status: error.response?.status,
    //     statusText: error.response?.statusText,
    //     data: error.response?.data,
    //     message: error.message
    //   });
      throw error;
    }
  }

  // TTS 오디오 스트리밍
  static async getTtsAudio(cid: number): Promise<Blob> {
    // console.log('VoiceService.getTtsAudio 호출:', { cid });
    
    const response = await authenticatedApiClient.get(`/chat/voice/tts/${cid}`, {
      responseType: 'blob',
    });

    // console.log('VoiceService.getTtsAudio 응답:', { 
    //   status: response.status, 
    //   blobSize: response.data.size 
    // });
    return response.data;
  }
} 