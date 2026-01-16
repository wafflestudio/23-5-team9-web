import React, { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { PageContainer } from '@/shared/layouts/PageContainer';
import { DetailHeader } from '@/shared/ui/DetailHeader';
import { DetailSection } from '@/shared/ui/DetailSection';
import { CommentForm } from '@/shared/ui/CommentForm';
import { Loading, ErrorMessage } from '@/shared/ui/StatusMessage';
import { fetchMessages, sendMessage, markMessagesAsRead, fetchChatRooms, Message, ChatRoom as ChatRoomType } from '@/features/chat/api/chatApi';
import { useUser, useUserProfile } from '@/features/user/hooks/useUser';
import Avatar from '@/shared/ui/Avatar';

function formatMessageTime(dateString: string): string {
  const date = new Date(dateString);
  return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
}

function ChatRoom() {
  const { chatId } = useParams();
  const navigate = useNavigate();
  const { user, isLoggedIn, isLoading: userLoading } = useUser();
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [sending, setSending] = useState(false);
  const [roomInfo, setRoomInfo] = useState<ChatRoomType | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // opponent_id로 상대방 프로필 조회
  const { profile: opponentProfile } = useUserProfile(roomInfo?.opponentId);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    if (userLoading) return;

    if (!isLoggedIn) {
      navigate('/auth/login');
      return;
    }

    if (!chatId) return;

    const loadData = async () => {
      try {
        const [messagesData, roomsData] = await Promise.all([
          fetchMessages(chatId),
          fetchChatRooms(),
        ]);
        setMessages(messagesData);
        const currentRoom = roomsData.find(r => r.roomId === chatId);
        if (currentRoom) {
          setRoomInfo(currentRoom);
        }
        await markMessagesAsRead(chatId);
      } catch (err) {
        console.error('메시지 조회 실패:', err);
        setError('메시지를 불러올 수 없습니다.');
      } finally {
        setLoading(false);
      }
    };

    loadData();

    // 주기적으로 새 메시지 확인 (폴링)
    const interval = setInterval(async () => {
      try {
        const data = await fetchMessages(chatId);
        setMessages(data);
        await markMessagesAsRead(chatId);
      } catch (err) {
        console.error('메시지 갱신 실패:', err);
      }
    }, 3000);

    return () => clearInterval(interval);
  }, [chatId, isLoggedIn, userLoading, navigate]);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSend = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMessage.trim() || !chatId || sending) return;

    setSending(true);
    try {
      const sentMessage = await sendMessage(chatId, newMessage.trim());
      setMessages((prev) => [...prev, sentMessage]);
      setNewMessage('');
    } catch (err) {
      console.error('메시지 전송 실패:', err);
      alert('메시지를 전송할 수 없습니다.');
    } finally {
      setSending(false);
    }
  };

  if (userLoading || loading) return <Loading />;
  if (error) return <ErrorMessage message={error} />;

  return (
    <PageContainer>
      <DetailHeader />

      <DetailSection className="flex flex-col p-0" style={{ height: '70vh' }}>
        {/* 채팅방 헤더 - 상대방 프로필 */}
        <div className="px-6 py-4 border-b border-border-base">
          <div className="flex items-center gap-3">
            <Avatar
              src={opponentProfile?.profile_image || undefined}
              alt={opponentProfile?.nickname || '상대방'}
              size="sm"
            />
            <div className="font-bold text-text-heading">
              {opponentProfile?.nickname || '알 수 없음'}
            </div>
          </div>
        </div>

        {/* 메시지 영역 */}
        <div className="flex-1 overflow-y-auto px-6 py-4 flex flex-col gap-2.5">
          {messages.length === 0 ? (
            <div className="flex-1 flex items-center justify-center text-text-secondary">
              메시지가 없습니다. 대화를 시작해보세요!
            </div>
          ) : (
            messages.map((msg) => {
              const isMe = msg.senderId === String(user?.id);
              return (
                <div
                  key={msg.id}
                  className={`max-w-[70%] flex flex-col ${isMe ? 'self-end items-end' : 'self-start items-start'}`}
                >
                  <div
                    className={`py-2.5 px-4 rounded-[15px] text-sm break-words max-w-full ${
                      isMe
                        ? 'bg-primary text-text-inverse rounded-tr-none shadow-sm'
                        : 'bg-bg-box-light text-text-heading rounded-tl-none border border-border-base shadow-sm'
                    }`}
                  >
                    {msg.content}
                  </div>
                  <div className={`text-xs text-text-secondary mt-1 ${isMe ? 'text-right' : 'text-left'}`}>
                    {formatMessageTime(msg.createdAt)}
                  </div>
                </div>
              );
            })
          )}
          <div ref={messagesEndRef} />
        </div>

        {/* 입력 영역 */}
        <div className="px-6 py-4 border-t border-border-base bg-bg-box/30">
          <CommentForm
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            onSubmit={handleSend}
            placeholder="메시지를 입력하세요"
          />
        </div>
      </DetailSection>
    </PageContainer>
  );
}

export default ChatRoom;
