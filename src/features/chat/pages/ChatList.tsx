import { useEffect, useState } from 'react';
import ChatRoomItem from '@/features/chat/components/ChatRoomItem';
import { PageContainer } from '@/shared/layouts/PageContainer';
import { Loading, ErrorMessage, EmptyState, LoginRequired, OnboardingRequired } from '@/shared/ui';
import { fetchChatRooms, ChatRoom } from '@/features/chat/api/chatApi';
import { useUser } from '@/features/user/hooks/useUser';
import { useChatStore } from '@/shared/store/chatStore';

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
  const { isLoggedIn, isLoading: userLoading, needsOnboarding } = useUser();
  const { setTotalUnreadCount } = useChatStore();
  const [rooms, setRooms] = useState<ChatRoom[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (userLoading || !isLoggedIn || needsOnboarding) {
      setLoading(false);
      return;
    }

    const loadRooms = async () => {
      try {
        const data = await fetchChatRooms();
        setRooms(data);
        const total = data.reduce((sum, room) => sum + room.unread_count, 0);
        setTotalUnreadCount(total);
      } catch (err) {
        console.error('채팅방 목록 조회 실패:', err);
        setError('채팅방 목록을 불러올 수 없습니다.');
      } finally {
        setLoading(false);
      }
    };

    loadRooms();

    // 주기적으로 채팅방 목록 갱신 (폴링)
    const interval = setInterval(async () => {
      try {
        const data = await fetchChatRooms();
        setRooms(data);
        const total = data.reduce((sum, room) => sum + room.unread_count, 0);
        setTotalUnreadCount(total);
      } catch (err) {
        console.error('채팅방 목록 갱신 실패:', err);
      }
    }, 3000);

    return () => clearInterval(interval);
  }, [isLoggedIn, userLoading, needsOnboarding, setTotalUnreadCount]);

  if (userLoading) return <Loading />;

  if (!isLoggedIn) {
    return (
      <PageContainer title="채팅">
        <LoginRequired message="로그인하고 채팅을 시작하세요" />
      </PageContainer>
    );
  }

  if (needsOnboarding) {
    return (
      <PageContainer title="채팅">
        <OnboardingRequired />
      </PageContainer>
    );
  }

  if (loading) return <Loading />;
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
            key={room.room_id}
            room={{
              id: room.room_id,
              partnerId: room.opponent_id,
              lastMessage: room.last_message || '',
              time: formatTime(room.last_message_at),
              unread: room.unread_count,
            }}
          />
        ))}
      </div>
    </PageContainer>
  );
}

export default ChatList;
