import { useNavigate } from 'react-router-dom';
import '../styles/chat-room.css';

interface ChatRoom {
  id: number;
  partner: string;
  lastMessage: string;
  time: string;
  unread: number;
}

interface ChatRoomItemProps {
  room: ChatRoom;
}

function ChatRoomItem({ room }: ChatRoomItemProps) {
  const navigate = useNavigate();

  return (
    <div 
      className="chat-room-item"
      onClick={() => navigate(`/chat/${room.id}`)}
    >
      <div className="chat-room-info-left">
        <div className="chat-room-partner">{room.partner}</div>
        <div className="chat-room-last-message">{room.lastMessage}</div>
      </div>
      <div className="chat-room-info-right">
        <div className="chat-room-time">{room.time}</div>
        {room.unread > 0 && (
          <span className="chat-room-unread">
            {room.unread}
          </span>
        )}
      </div>
    </div>
  );
}

export default ChatRoomItem;
