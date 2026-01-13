import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import '../styles/common.css';
import '../styles/chat-room.css';

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
    <div className="page-padding chat-room-container">
      <div className="chat-header">
        <button onClick={() => navigate(-1)} className="chat-back-button">←</button>
        <h3>채팅방 {chatId}</h3>
      </div>
      
      <div className="chat-messages">
        {messages.map((msg) => (
          <div key={msg.id} className={`chat-message-bubble-container ${msg.sender}`}>
            <div className={`chat-message-bubble ${msg.sender}`}>
              {msg.text}
            </div>
            <div className={`chat-message-time ${msg.sender}`}>
              {msg.time}
            </div>
          </div>
        ))}
      </div>

      <form onSubmit={handleSend} className="chat-input-form">
        <input 
          type="text" 
          value={newMessage}
          onChange={(e) => setNewMessage(e.target.value)}
          placeholder="메시지를 입력하세요"
          className="chat-input"
        />
        <button type="submit" className="chat-send-button">전송</button>
      </form>
    </div>
  );
}

export default ChatRoom;
