import React, { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { fetchMessages, sendMessage, markMessagesAsRead, fetchChatRooms, Message, ChatRoom as ChatRoomType } from '@/features/chat/api/chatApi';
import { useUser, useUserProfile } from '@/features/user/hooks/useUser';
import { Loading, ErrorMessage, Avatar, DetailHeader } from '@/shared/ui';
import TransferMenu from '@/features/pay/components/TransferMenu';

function formatMessageTime(dateString: string): string {
  const date = new Date(dateString);
  return date.toLocaleTimeString('ko-KR', { hour: 'numeric', minute: '2-digit', hour12: true });
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
  const mobileMessagesEndRef = useRef<HTMLDivElement>(null);
  const desktopMessagesEndRef = useRef<HTMLDivElement>(null);

  const { profile: opponentProfile } = useUserProfile(roomInfo?.opponent_id);
  const [showTransferMenu, setShowTransferMenu] = useState(false);

  const scrollToBottom = () => {
    mobileMessagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    desktopMessagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
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
        const currentRoom = roomsData.find(r => r.room_id === chatId);
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
    // DOM 렌더링 후 스크롤이 적용되도록 약간의 딜레이 추가
    const timer = setTimeout(() => {
      scrollToBottom();
    }, 100);
    return () => clearTimeout(timer);
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

  // 연속 메시지 그룹핑: 같은 사람의 마지막 메시지에만 시간 표시
  const shouldShowTime = (index: number) => {
    if (index === messages.length - 1) return true;
    const current = messages[index];
    const next = messages[index + 1];
    return current.sender_id !== next.sender_id;
  };

  if (userLoading || loading) return <Loading />;
  if (error) return <ErrorMessage message={error} />;

  return (
    <>
      {/* 모바일: 전체 화면 (navbar 높이 64px 제외) */}
      <div className="flex flex-col h-[calc(100dvh-64px)] bg-bg-base md:hidden">
        {/* 헤더 */}
        <div className="flex items-center gap-3 px-4 py-3 bg-bg-box border-b border-border-base">
          <button
            onClick={() => navigate(-1)}
            className="p-1 -ml-1 text-text-secondary hover:text-text-heading transition-colors"
          >
            ←
          </button>
          <Avatar
            src={opponentProfile?.profile_image || undefined}
            alt={opponentProfile?.nickname || '상대방'}
            size="sm"
          />
          <span className="font-semibold text-text-heading flex-1">
            {opponentProfile?.nickname || '알 수 없음'}
          </span>
          <button
            onClick={() => setShowTransferMenu(!showTransferMenu)}
            className="px-3 py-1.5 text-sm bg-primary text-white rounded-lg hover:bg-primary-hover transition-colors"
          >
            {user?.coin.toLocaleString()} C
          </button>
        </div>

        {/* 송금 메뉴 */}
        {showTransferMenu && (
          <TransferMenu
            userId={user?.id}
            currentCoin={user?.coin || 0}
            recipientId={roomInfo?.opponent_id}
            recipientName={opponentProfile?.nickname || '상대방'}
          />
        )}

        {/* 메시지 영역 */}
        <div className="flex-1 overflow-y-auto px-4 py-3 space-y-1">
          {messages.length === 0 ? (
            <div className="flex items-center justify-center h-full text-text-secondary text-sm">
              대화를 시작해보세요
            </div>
          ) : (
            messages.map((msg, index) => {
              const isMe = msg.sender_id === String(user?.id);
              const showTime = shouldShowTime(index);

              return (
                <div
                  key={msg.id}
                  className={`flex items-end gap-1.5 ${isMe ? 'flex-row-reverse' : 'flex-row'}`}
                >
                  <div
                    className={`max-w-[75%] px-3 py-2 text-[15px] leading-relaxed break-words ${
                      isMe
                        ? 'bg-primary text-white rounded-2xl rounded-br-sm'
                        : 'bg-bg-box text-text-heading rounded-2xl rounded-bl-sm'
                    }`}
                  >
                    {msg.content}
                  </div>
                  {showTime && (
                    <span className="text-[11px] text-text-tertiary pb-0.5 shrink-0">
                      {formatMessageTime(msg.created_at)}
                    </span>
                  )}
                </div>
              );
            })
          )}
          <div ref={mobileMessagesEndRef} />
        </div>

        {/* 입력 영역 */}
        <form onSubmit={handleSend} className="flex items-center gap-2 px-3 py-2 bg-bg-box border-t border-border-base">
          <input
            type="text"
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            placeholder="메시지를 입력하세요"
            className="flex-1 px-4 py-2.5 bg-bg-base rounded-full text-sm text-text-heading placeholder:text-text-tertiary focus:outline-none"
          />
          <button
            type="submit"
            disabled={!newMessage.trim() || sending}
            className="px-5 py-2.5 bg-primary text-white text-sm font-medium rounded-full disabled:opacity-50 transition-opacity"
          >
            전송
          </button>
        </form>
      </div>

      {/* 데스크톱: 카드 레이아웃 */}
      <div className="hidden md:block w-full max-w-[1000px] mx-auto px-4 py-6 min-h-[calc(100vh-60px)]">
        <DetailHeader />

        <div className="bg-bg-page rounded-2xl border border-border-base shadow-sm overflow-hidden flex flex-col" style={{ height: '70vh' }}>
          <div className="flex items-center gap-3 px-4 py-3 border-b border-border-base">
            <Avatar
              src={opponentProfile?.profile_image || undefined}
              alt={opponentProfile?.nickname || '상대방'}
              size="sm"
            />
            <span className="font-semibold text-text-heading flex-1">
              {opponentProfile?.nickname || '알 수 없음'}
            </span>
            <button
              onClick={() => setShowTransferMenu(!showTransferMenu)}
              className="px-3 py-1.5 text-sm bg-primary text-white rounded-lg hover:bg-primary-hover transition-colors"
            >
              {user?.coin.toLocaleString()} C
            </button>
          </div>

          {/* 송금 메뉴 (데스크톱) */}
          {showTransferMenu && (
            <TransferMenu
              userId={user?.id}
              currentCoin={user?.coin || 0}
              recipientId={roomInfo?.opponent_id}
              recipientName={opponentProfile?.nickname || '상대방'}
            />
          )}

          <div className="flex-1 overflow-y-auto px-4 py-3 space-y-1 bg-bg-base">
            {messages.length === 0 ? (
              <div className="flex items-center justify-center h-full text-text-secondary text-sm">
                대화를 시작해보세요
              </div>
            ) : (
              messages.map((msg, index) => {
                const isMe = msg.sender_id === String(user?.id);
                const showTime = shouldShowTime(index);

                return (
                  <div
                    key={msg.id}
                    className={`flex items-end gap-1.5 ${isMe ? 'flex-row-reverse' : 'flex-row'}`}
                  >
                    <div
                      className={`max-w-[75%] px-3 py-2 text-[15px] leading-relaxed break-words ${
                        isMe
                          ? 'bg-primary text-white rounded-2xl rounded-br-sm'
                          : 'bg-bg-page text-text-heading rounded-2xl rounded-bl-sm border border-border-base'
                      }`}
                    >
                      {msg.content}
                    </div>
                    {showTime && (
                      <span className="text-[11px] text-text-tertiary pb-0.5 shrink-0">
                        {formatMessageTime(msg.created_at)}
                      </span>
                    )}
                  </div>
                );
              })
            )}
            <div ref={desktopMessagesEndRef} />
          </div>

          <form onSubmit={handleSend} className="flex items-center gap-2 px-3 py-3 border-t border-border-base bg-bg-page">
            <input
              type="text"
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
              placeholder="메시지를 입력하세요"
              className="flex-1 px-4 py-2.5 bg-bg-base rounded-full text-sm text-text-heading placeholder:text-text-tertiary focus:outline-none border border-border-base"
            />
            <button
              type="submit"
              disabled={!newMessage.trim() || sending}
              className="px-5 py-2.5 bg-primary text-white text-sm font-medium rounded-full disabled:opacity-50 transition-opacity"
            >
              전송
            </button>
          </form>
        </div>
      </div>
    </>
  );
}

export default ChatRoom;
