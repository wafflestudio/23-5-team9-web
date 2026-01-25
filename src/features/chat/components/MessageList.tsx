import { useRef, useEffect } from 'react';
import type { Message } from '@/features/chat/api/chatApi';
import { useTranslation } from '@/shared/i18n';
import { useLanguage } from '@/shared/store/languageStore';

interface MessageListProps {
  messages: Message[];
  currentUserId?: string;
}

function MessageList({ messages, currentUserId }: MessageListProps) {
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const t = useTranslation();
  const { language } = useLanguage();

  const formatMessageTime = (dateString: string): string => {
    const date = new Date(dateString);
    return date.toLocaleTimeString(language === 'ko' ? 'ko-KR' : 'en-US', { hour: 'numeric', minute: '2-digit', hour12: true });
  };

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    const timer = setTimeout(() => {
      scrollToBottom();
    }, 100);
    return () => clearTimeout(timer);
  }, [messages]);

  const shouldShowTime = (index: number) => {
    if (index === messages.length - 1) return true;
    const current = messages[index];
    const next = messages[index + 1];
    return current.sender_id !== next.sender_id;
  };

  if (messages.length === 0) {
    return (
      <div className="flex-1 overflow-y-auto px-4 py-3 bg-bg-base flex items-center justify-center">
        <span className="text-text-secondary text-sm">{t.chat.startConversation}</span>
      </div>
    );
  }

  return (
    <div className="flex-1 overflow-y-auto px-4 py-3 space-y-1 bg-bg-base">
      {messages.map((msg, index) => {
        const isMe = msg.sender_id === currentUserId;
        const showTime = shouldShowTime(index);

        return (
          <div
            key={msg.id}
            className={`flex items-end gap-1.5 ${isMe ? 'flex-row-reverse' : 'flex-row'}`}
          >
            <div
              className={`max-w-[75%] px-3 py-2 text-[15px] leading-relaxed wrap-break-word ${
                isMe
                  ? 'bg-primary text-white rounded-lg'
                  : 'bg-bg-page text-text-heading rounded-lg border border-border-medium'
              }`}
            >
              {msg.content}
            </div>
            {showTime && (
              <span className="text-[11px] text-text-tertiary pb-0.5 shrink-0">
                {formatMessageTime(msg.created_at)}
              </span>
            )}
          </div>
        );
      })}
      <div ref={messagesEndRef} />
    </div>
  );
}

export default MessageList;
