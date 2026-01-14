import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { PageContainer } from '@/shared/layouts/PageContainer';
import { Input } from '@/shared/ui/Input';
import { Button } from '@/shared/ui/Button';

const mockMessages = [
  { id: 1, sender: 'partner', text: '안녕하세요! 이 상품 구매하고 싶어요.', time: '오후 2:00' },
  { id: 2, sender: 'me', text: '네 안녕하세요! 아직 판매중입니다.', time: '오후 2:05' },
  { id: 3, sender: 'partner', text: '직거래 가능한가요?', time: '오후 2:06' },
];

function ChatRoom() {
  const { chatId } = useParams();
  const navigate = useNavigate();
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
    <PageContainer fullWidth>
      <div className="p-3 border-b border-border-base flex items-center bg-bg-page sticky top-0 z-10">
        <Button onClick={() => navigate(-1)} variant="ghost" className="mr-3 text-xl p-1">←</Button>
        <h3 className="m-0 text-lg font-bold">채팅방 {chatId}</h3>
      </div>

      <div className="flex-1 overflow-y-auto p-5 flex flex-col gap-2.5">
        {messages.map((msg) => (
          <div key={msg.id} className={`max-w-[70%] flex flex-col ${msg.sender === 'me' ? 'self-end items-end' : 'self-start items-start'}`}>
            <div className={`py-2.5 px-4 rounded-[15px] text-sm break-words max-w-full ${
              msg.sender === 'me'
                ? 'bg-primary text-text-inverse rounded-tr-none'
                : 'bg-bg-box-light text-text-heading rounded-tl-none border border-border-base'
            }`}>
              {msg.text}
            </div>
            <div className={`text-xs text-text-secondary mt-1 ${msg.sender === 'me' ? 'text-right' : 'text-left'}`}>
              {msg.time}
            </div>
          </div>
        ))}
      </div>

      <form onSubmit={handleSend} className="p-3 border-t border-border-base flex gap-2.5 bg-bg-page pb-6">
        <Input 
          type="text" 
          value={newMessage}
          onChange={(e) => setNewMessage(e.target.value)}
          placeholder="메시지를 입력하세요"
          className="flex-1 rounded-full bg-bg-box-light"
          // Override rounded-xl to rounded-full for chat input look
        />
        <Button 
          type="submit" 
          variant="primary" 
          className="rounded-full px-5 whitespace-nowrap"
        >
          전송
        </Button>
      </form>
    </PageContainer>
  );
}

export default ChatRoom;
