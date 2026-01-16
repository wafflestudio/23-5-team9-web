import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import ChatRoomItem from '@/features/chat/components/ChatRoomItem';
import { PageContainer } from '@/shared/layouts/PageContainer';
import { Loading, ErrorMessage, EmptyState } from '@/shared/ui/StatusMessage';
import { fetchChatRooms, ChatRoom } from '@/features/chat/api/chatApi';
import { useUser } from '@/features/user/hooks/useUser';

function formatTime(dateString: string | null): string {
  if (!dateString) return '';

  const date = new Date(dateString);
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffMins = Math.floor(diffMs / (1000 * 60));
  const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
  const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

  if (diffMins < 1) return '방금 전';
  if (diffMins < 60) return `${diffMins}분 전`;
  if (diffHours < 24) return `${diffHours}시간 전`;
  if (diffDays < 7) return `${diffDays}일 전`;
  return date.toLocaleDateString();
}

function ChatList() {
  const navigate = useNavigate();
  const { isLoggedIn, isLoading: userLoading } = useUser();
  const [rooms, setRooms] = useState<ChatRoom[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (userLoading) return;

    if (!isLoggedIn) {
      navigate('/auth/login');
      return;
    }

    const loadRooms = async () => {
      try {
        const data = await fetchChatRooms();
        setRooms(data);
      } catch (err) {
        console.error('채팅방 목록 조회 실패:', err);
        setError('채팅방 목록을 불러올 수 없습니다.');
      } finally {
        setLoading(false);
      }
    };

    loadRooms();
  }, [isLoggedIn, userLoading, navigate]);

  if (userLoading || loading) return <Loading />;
  if (error) return <ErrorMessage message={error} />;
  if (rooms.length === 0) return (
    <PageContainer title="채팅">
      <EmptyState message="채팅 내역이 없습니다." />
    </PageContainer>
  );

  return (
    <PageContainer title="채팅">
      <div className="flex flex-col">
        {rooms.map((room) => (
          <ChatRoomItem
            key={room.roomId}
            room={{
              id: room.roomId,
              partnerId: room.opponentId,
              lastMessage: room.lastMessage || '',
              time: formatTime(room.lastMessageAt),
              unread: room.unreadCount,
            }}
          />
        ))}
      </div>
    </PageContainer>
  );
}

export default ChatList;
