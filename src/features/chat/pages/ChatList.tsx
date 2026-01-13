import ChatRoomItem from '@/features/chat/components/ChatRoomItem';
import '@/styles/common.css';

const mockChatRooms = [
  { id: 1, partner: '당근이', lastMessage: '안녕하세요! 물건 팔렸나요?', time: '방금 전', unread: 2 },
  { id: 2, partner: '토끼', lastMessage: '네고 가능한가요?', time: '1시간 전', unread: 0 },
  { id: 3, partner: '거북이', lastMessage: '직거래 어디서 하시나요?', time: '어제', unread: 0 },
];

function ChatList() {

  return (
    <div className="page-padding">
      <h2>채팅</h2>
      <div className="chat-list">
        {mockChatRooms.map((room) => (
          <ChatRoomItem key={room.id} room={room} />
        ))}
      </div>
    </div>
  );
}

export default ChatList;
