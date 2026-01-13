import ChatRoomItem from '@/features/chat/components/ChatRoomItem';
import { PageContainer } from '@/shared/layouts/PageContainer';

const mockChatRooms = [
  { id: 1, partner: '당근이', lastMessage: '안녕하세요! 물건 팔렸나요?', time: '방금 전', unread: 2 },
  { id: 2, partner: '토끼', lastMessage: '네고 가능한가요?', time: '1시간 전', unread: 0 },
  { id: 3, partner: '거북이', lastMessage: '직거래 어디서 하시나요?', time: '어제', unread: 0 },
];

function ChatList() {

  return (
    <PageContainer title="채팅">
      <div className="flex flex-col">
        {mockChatRooms.map((room) => (
          <ChatRoomItem key={room.id} room={room} />
        ))}
      </div>
    </PageContainer>
  );
}

export default ChatList;
