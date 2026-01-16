import { useNavigate } from 'react-router-dom';
import Avatar from '@/shared/ui/Avatar';
import { useUserProfile } from '@/features/user/hooks/useUser';

interface ChatRoom {
  id: string | number;
  partnerId: string;
  lastMessage: string;
  time: string;
  unread: number;
}

interface ChatRoomItemProps {
  room: ChatRoom;
}

function ChatRoomItem({ room }: ChatRoomItemProps) {
  const navigate = useNavigate();
  const { profile } = useUserProfile(room.partnerId);

  return (
    <div
      className="p-4 border-b border-border-base cursor-pointer flex items-center gap-3 hover:bg-bg-box-light transition-colors"
      onClick={() => navigate(`/chat/${room.id}`)}
    >
      <Avatar
        src={profile?.profile_image || undefined}
        alt={profile?.nickname || '상대방'}
        size="sm"
      />
      <div className="flex-1 min-w-0">
        <div className="font-bold mb-1.5 truncate">{profile?.nickname || '알 수 없음'}</div>
        <div className="text-text-secondary text-sm truncate">{room.lastMessage}</div>
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
