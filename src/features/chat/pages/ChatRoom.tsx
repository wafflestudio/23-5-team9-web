import React, { useState } from 'react';
import { useParams } from 'react-router-dom';
import { PageContainer } from '@/shared/layouts/PageContainer';
import { DetailHeader } from '@/shared/ui/DetailHeader';
import { DetailSection } from '@/shared/ui/DetailSection';
import { CommentForm } from '@/shared/ui/CommentForm';

const mockMessages = [
  { id: 1, sender: 'partner', text: '안녕하세요! 이 상품 구매하고 싶어요.', time: '오후 2:00' },
  { id: 2, sender: 'me', text: '네 안녕하세요! 아직 판매중입니다.', time: '오후 2:05' },
  { id: 3, sender: 'partner', text: '직거래 가능한가요?', time: '오후 2:06' },
];

function ChatRoom() {
  const { chatId } = useParams();
  const [messages, setMessages] = useState(mockMessages);
  const [newMessage, setNewMessage] = useState('');

  const handleSend = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMessage.trim()) return;

    const nextId = messages.length + 1;
    setMessages([...messages, {
      id: nextId,
      sender: 'me',
      text: newMessage,
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    }]);
    setNewMessage('');
  };

  return (
    <PageContainer>
      <DetailHeader />

      <DetailSection className="flex flex-col p-0" style={{ height: '70vh' }}>
        {/* 채팅방 헤더 */}
        <div className="px-6 py-4 border-b border-border-base">
          <h3 className="text-lg font-bold">채팅방 {chatId}</h3>
        </div>

        {/* 메시지 영역 */}
        <div className="flex-1 overflow-y-auto px-6 py-4 flex flex-col gap-2.5">
          {messages.map((msg) => (
            <div key={msg.id} className={`max-w-[70%] flex flex-col ${msg.sender === 'me' ? 'self-end items-end' : 'self-start items-start'}`}>
              <div className={`py-2.5 px-4 rounded-[15px] text-sm break-words max-w-full ${
                msg.sender === 'me'
                  ? 'bg-primary text-text-inverse rounded-tr-none shadow-sm'
                  : 'bg-bg-box-light text-text-heading rounded-tl-none border border-border-base shadow-sm'
              }`}>
                {msg.text}
              </div>
              <div className={`text-xs text-text-secondary mt-1 ${msg.sender === 'me' ? 'text-right' : 'text-left'}`}>
                {msg.time}
              </div>
            </div>
          ))}
        </div>

        {/* 입력 영역 */}
        <div className="px-6 py-4 border-t border-border-base bg-bg-box/30">
          <CommentForm
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            onSubmit={handleSend}
            placeholder="메시지를 입력하세요"
          />
        </div>
      </DetailSection>
    </PageContainer>
  );
}

export default ChatRoom;
