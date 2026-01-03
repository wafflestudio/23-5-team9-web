import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import '../styles/common.css';

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

  const handleSend = (e) => {
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
    <div className="page-padding" style={{ display: 'flex', flexDirection: 'column', height: 'calc(100vh - 100px)' }}>
      <div style={{ padding: '10px', borderBottom: '1px solid #eee', display: 'flex', alignItems: 'center' }}>
        <button onClick={() => navigate(-1)} style={{ marginRight: '10px', border: 'none', background: 'none', cursor: 'pointer', fontSize: '1.2rem' }}>←</button>
        <h3>채팅방 {chatId}</h3>
      </div>
      
      <div style={{ flex: 1, overflowY: 'auto', padding: '20px', display: 'flex', flexDirection: 'column', gap: '10px' }}>
        {messages.map((msg) => (
          <div key={msg.id} style={{ 
            alignSelf: msg.sender === 'me' ? 'flex-end' : 'flex-start',
            maxWidth: '70%'
          }}>
            <div style={{ 
              background: msg.sender === 'me' ? '#ff6f0f' : '#eee',
              color: msg.sender === 'me' ? 'white' : 'black',
              padding: '10px 15px',
              borderRadius: '15px',
              borderTopRightRadius: msg.sender === 'me' ? '0' : '15px',
              borderTopLeftRadius: msg.sender === 'me' ? '15px' : '0'
            }}>
              {msg.text}
            </div>
            <div style={{ fontSize: '0.7rem', color: '#999', marginTop: '2px', textAlign: msg.sender === 'me' ? 'right' : 'left' }}>
              {msg.time}
            </div>
          </div>
        ))}
      </div>

      <form onSubmit={handleSend} style={{ padding: '10px', borderTop: '1px solid #eee', display: 'flex', gap: '10px' }}>
        <input 
          type="text" 
          value={newMessage}
          onChange={(e) => setNewMessage(e.target.value)}
          placeholder="메시지를 입력하세요"
          style={{ flex: 1, padding: '10px', borderRadius: '20px', border: '1px solid #ddd' }}
        />
        <button type="submit" style={{ background: '#ff6f0f', color: 'white', border: 'none', padding: '10px 20px', borderRadius: '20px', cursor: 'pointer' }}>전송</button>
      </form>
    </div>
  );
}

export default ChatRoom;
