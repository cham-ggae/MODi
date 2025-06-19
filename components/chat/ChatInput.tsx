import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Mic, MicOff, Send } from 'lucide-react';
import { useSpeechRecognition, useTextToSpeech } from '@/hooks/use-speech';
import { useToast } from '../ui/use-toast';
import SttButton from './SttButton';

const ChatInput = () => {
  const [message, setMessage] = useState('');
  const {
    isListening,
    startListening,
    stopListening,
    isSupported: sttSupported,
  } = useSpeechRecognition();
  return (
    <div className="w-full max-w-md mx-auto bg-white dark:bg-gray-800 border-t border-gray-100 dark:border-gray-700 flex-shrink-0">
      <div className="p-4">
        <div className="flex items-center space-x-3">
          {sttSupported && (
            <SttButton setMessage={setMessage} />
          )}
          <Input
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            placeholder={isListening ? '음성을 인식하고 있습니다...' : '메시지를 입력하세요...'}
            className="flex-1 rounded-full border-gray-300 dark:border-gray-600 px-4 py-3 focus:border-green-500 focus:ring-green-500 dark:bg-gray-700 dark:text-white"
            disabled={isListening}
          />
          <Button
            // onClick={sendMessage} // 메시지 전송은 page에서 props로 내려받아 처리할 수 있음
            size="icon"
            className="bg-green-500 hover:bg-gray-600 dark:hover:bg-gray-400 rounded-full w-12 h-12"
          >
            <Send className="w-5 h-5" />
          </Button>
        </div>
      </div>
    </div>
  );
};

export default ChatInput;