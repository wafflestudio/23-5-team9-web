import { create } from 'zustand';
import { fetchChatRooms } from '@/features/chat/api/chatApi';

interface ChatState {
  totalUnreadCount: number;
  setTotalUnreadCount: (count: number) => void;
  fetchUnreadCount: () => Promise<void>;
}

export const useChatStore = create<ChatState>((set) => ({
  totalUnreadCount: 0,
  setTotalUnreadCount: (count) => set({ totalUnreadCount: count }),
  fetchUnreadCount: async () => {
    try {
      const rooms = await fetchChatRooms();
      const total = rooms.reduce((sum, room) => sum + room.unreadCount, 0);
      set({ totalUnreadCount: total });
    } catch (err) {
      console.error('읽지 않은 메시지 수 조회 실패:', err);
    }
  },
}));
