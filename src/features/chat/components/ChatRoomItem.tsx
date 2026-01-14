import { useNavigate } from 'react-router-dom';

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
      className="p-4 border-b border-border-base cursor-pointer flex justify-between hover:bg-bg-box-light transition-colors"
      onClick={() => navigate(`/chat/${room.id}`)}
    >
      <div className="flex flex-col">
        <div className="font-bold mb-1.5 min-w-0 truncate">{room.partner}</div>
        <div className="text-text-secondary text-sm min-w-0 truncate">{room.lastMessage}</div>
      </div>
      <div className="text-right flex flex-col items-end min-w-[60px]">
        <div className="text-text-secondary text-xs mb-1.5">{room.time}</div>
        {room.unread > 0 && (
          <span className="bg-primary text-white px-2.5 py-1 rounded-full text-xs font-bold inline-block min-w-[24px] text-center">
            {room.unread}
          </span>
        )}
      </div>
    </div>
  );
}

export default ChatRoomItem;
