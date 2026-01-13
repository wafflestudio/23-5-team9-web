import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';

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
    <div className="flex flex-col h-[calc(100vh-140px)]">
      <div className="p-3 border-b border-border flex items-center bg-white sticky top-0 z-10">
        <button onClick={() => navigate(-1)} className="mr-3 bg-transparent border-none cursor-pointer text-xl flex items-center justify-center p-1">←</button>
        <h3 className="m-0 text-lg font-bold">채팅방 {chatId}</h3>
      </div>
      
      <div className="flex-1 overflow-y-auto p-5 flex flex-col gap-2.5">
        {messages.map((msg) => (
          <div key={msg.id} className={`max-w-[70%] flex flex-col ${msg.sender === 'me' ? 'self-end items-end' : 'self-start items-start'}`}>
            <div className={`py-2.5 px-4 rounded-[15px] text-sm break-words max-w-full ${
              msg.sender === 'me' 
                ? 'bg-primary text-white rounded-tr-none' 
                : 'bg-light text-dark rounded-tl-none border border-border'
            }`}>
              {msg.text}
            </div>
            <div className={`text-xs text-gray-light mt-1 ${msg.sender === 'me' ? 'text-right' : 'text-left'}`}>
              {msg.time}
            </div>
          </div>
        ))}
      </div>

      <form onSubmit={handleSend} className="p-3 border-t border-border flex gap-2.5 bg-white pb-6">
        <input 
          type="text" 
          value={newMessage}
          onChange={(e) => setNewMessage(e.target.value)}
          placeholder="메시지를 입력하세요"
          className="flex-1 p-3 rounded-full border border-border outline-none focus:border-primary transition-colors bg-light"
        />
        <button type="submit" className="bg-primary text-white border-none px-5 py-2 rounded-full cursor-pointer hover:bg-primary-hover font-bold transition-colors whitespace-nowrap">
          전송
        </button>
      </form>
    </div>
  );
}

export default ChatRoom;
