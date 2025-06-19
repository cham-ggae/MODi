import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { motion } from 'framer-motion';
import { Volume2, VolumeX } from 'lucide-react';
import { ClientMessage } from '@/types/chat.type';
import { useTextToSpeech } from '@/hooks/use-speech';
import { useToast } from '../ui/use-toast';

interface ChatMessages {
  messages: ClientMessage[];
}
const ChatMessages = ({ messages }: ChatMessages) => {
  const { isSpeaking, speak, stopSpeaking, isSupported: ttsSupported } = useTextToSpeech();
  const { toast } = useToast();

  const handleSpeakMessage = (text: string) => {
    if (!ttsSupported) {
      toast({
        title: 'TTS 미지원',
        description: '이 브라우저에서는 음성 재생이 지원되지 않습니다.',
        variant: 'destructive',
      });
      return;
    }

    if (isSpeaking) {
      stopSpeaking();
    } else {
      speak(text);
    }
  };
  return (
    <div className="flex-1 overflow-y-auto">
      <div className="flex-1 overflow-y-auto">
        <div className="p-4 space-y-4">
          {messages.map((msg) => (
            <motion.div
              key={msg.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className={`flex ${msg.role !== "bot" ? 'justify-end' : 'justify-start'}`}
            >
              {msg.role === "bot" && (
                <div className="w-10 h-10 bg-green-100 dark:bg-green-800 rounded-full flex items-center justify-center mr-3 flex-shrink-0">
                  <span className="text-green-600 dark:text-green-300 text-lg">🤖</span>
                </div>
              )}
              <div
                className={`max-w-xs px-4 py-3 rounded-2xl ${msg.role === "user"
                  ? 'bg-green-500 text-white rounded-br-md'
                  : 'bg-white dark:bg-gray-700 text-gray-900 dark:text-white border border-gray-200 dark:border-gray-600 rounded-bl-md'
                  }`}
              >
                <p className="text-sm">{msg.content}</p>
                <div className="flex items-center justify-between mt-2">
                  <p
                    className={`text-xs ${msg.role === "user" ? 'text-green-100' : 'text-gray-500 dark:text-gray-400'
                      }`}
                  >
                    {msg.timestamp.toLocaleTimeString([], {
                      hour: '2-digit',
                      minute: '2-digit',
                    })}
                  </p>
                  {msg.role === "bot" && ttsSupported && (
                    <Button
                      onClick={() => handleSpeakMessage(msg.content)}
                      variant="ghost"
                      size="sm"
                      className="p-1 h-auto ml-2 hover:bg-gray-100 dark:hover:bg-gray-600"
                    >
                      {isSpeaking ? (
                        <VolumeX className="w-4 h-4 text-gray-500 dark:text-gray-400" />
                      ) : (
                        <Volume2 className="w-4 h-4 text-gray-500 dark:text-gray-400" />
                      )}
                    </Button>
                  )}
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ChatMessages;