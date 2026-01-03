import React from 'react';
import { useNavigate } from 'react-router-dom';
import './styles/common.css';

const mockChatRooms = [
  { id: 1, partner: '당근이', lastMessage: '안녕하세요! 물건 팔렸나요?', time: '방금 전', unread: 2 },
  { id: 2, partner: '토끼', lastMessage: '네고 가능한가요?', time: '1시간 전', unread: 0 },
  { id: 3, partner: '거북이', lastMessage: '직거래 어디서 하시나요?', time: '어제', unread: 0 },
];

function ChatList() {
  const navigate = useNavigate();

  return (
    <div className="page-padding">
      <h2>채팅</h2>
      <div className="chat-list">
        {mockChatRooms.map((room) => (
          <div 
            key={room.id} 
            className="chat-room-item"
            onClick={() => navigate(`/React-Week5/chat/${room.id}`)}
            style={{ padding: '15px', borderBottom: '1px solid #eee', cursor: 'pointer', display: 'flex', justifyContent: 'space-between' }}
          >
            <div>
              <div style={{ fontWeight: 'bold', marginBottom: '5px' }}>{room.partner}</div>
              <div style={{ color: '#666', fontSize: '0.9rem' }}>{room.lastMessage}</div>
            </div>
            <div style={{ textAlign: 'right' }}>
              <div style={{ color: '#999', fontSize: '0.8rem', marginBottom: '5px' }}>{room.time}</div>
              {room.unread > 0 && (
                <span style={{ background: '#ff6f0f', color: 'white', padding: '2px 6px', borderRadius: '10px', fontSize: '0.8rem' }}>
                  {room.unread}
                </span>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default ChatList;
