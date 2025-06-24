import React, { memo } from 'react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Volume2, VolumeX } from 'lucide-react';
import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'
import rehypeSanitize from 'rehype-sanitize'
import TypingIndicator from './TypingIndicator';

interface MessageItemProps {
  role: string;
  content: string;
  timestamp: Date;
  cid?: number;
  isSpeaking: boolean;
  ttsSupported: boolean;
  handleSpeakMessage: (text: string, cid?: number) => void;
}
const MessageItem = ({ role, content, timestamp, cid, isSpeaking, ttsSupported, handleSpeakMessage }: MessageItemProps) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className={`flex ${role !== "bot" ? 'justify-end' : 'justify-start'}`}
    >
      {role === "bot" && (
        <div className="w-10 h-10 bg-green-100 dark:bg-green-800 rounded-full flex items-center justify-center mr-3 flex-shrink-0">
          <span className="text-green-600 dark:text-green-300 text-lg">🤖</span>
        </div>
      )}
      <div
        className={`max-w-xs px-4 py-3 rounded-2xl ${role === "user"
          ? 'bg-green-500 text-white rounded-br-md'
          : 'bg-white dark:bg-gray-700 text-gray-900 dark:text-white border border-gray-200 dark:border-gray-600 rounded-bl-md prose prose-p:mb-0 prose-sm dark:prose-invert'
          }`}
      >
        {role === 'bot' && content === ''
          ? (
            <TypingIndicator />
          )
          : role === 'bot'
            ? (
              <ReactMarkdown remarkPlugins={[remarkGfm]} rehypePlugins={[rehypeSanitize]}>
                {content}
              </ReactMarkdown>
            )
            : (
              <p className="text-sm m-0">{content}</p>
            )
        }
        <div className="flex items-center justify-between mt-2">
          <p
            className={`text-xs ${role === "user" ? 'text-green-100' : 'text-gray-500 dark:text-gray-400'
              }`}
          >
            {timestamp.toLocaleTimeString([], {
              hour: '2-digit',
              minute: '2-digit',
            })}
          </p>
          {role === "bot" && ttsSupported && (
            <Button
              onClick={() => handleSpeakMessage(content, cid)}
              variant="ghost"
              size="sm"
              className={`p-1 h-auto ml-2 ${!cid
                  ? 'opacity-50 cursor-not-allowed'
                  : 'hover:bg-gray-100 dark:hover:bg-gray-600 cursor-pointer'
                }`}
              disabled={!cid}
              title={!cid ? 'TTS 준비 중...' : '음성으로 들으기'}
            >
              {isSpeaking ? (
                <VolumeX className="w-4 h-4 text-gray-500 dark:text-gray-400" />
              ) : (
                <Volume2 className={`w-4 h-4 ${!cid ? 'text-gray-300 dark:text-gray-600' : 'text-gray-500 dark:text-gray-400'
                  }`} />
              )}
            </Button>
          )}
        </div>
      </div>
    </motion.div>
  );
};

export default memo(MessageItem);