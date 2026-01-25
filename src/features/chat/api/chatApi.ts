import client from '@/shared/api/client';

export interface ChatRoom {
  room_id: string;
  opponent_id: string;
  last_message: string | null;
  last_message_at: string | null;
  unread_count: number;
}

export interface Message {
  id: number;
  room_id: string;
  sender_id: string;
  content: string;
  created_at: string;
  is_read: boolean;
}

export interface CreateRoomResponse {
  id: string;
  user_one_id: string;
  user_two_id: string;
  created_at: string;
}

// 채팅방 생성 또는 기존 채팅방 조회
export async function createOrGetRoom(opponent_id: string): Promise<string> {
  const response = await client
    .post(`/api/chat/rooms?opponent_id=${opponent_id}`)
    .json<CreateRoomResponse>();
  return response.id;
}

// 채팅방 목록 조회
export async function fetchChatRooms(): Promise<ChatRoom[]> {
  return client.get('/api/chat/rooms').json<ChatRoom[]>();
}

// 메시지 목록 조회
export async function fetchMessages(room_id: string): Promise<Message[]> {
  return client.get(`/api/chat/rooms/${room_id}/messages`).json<Message[]>();
}

// 메시지 전송
export async function sendMessage(room_id: string, content: string): Promise<Message> {
  return client
    .post(`/api/chat/rooms/${room_id}/messages`, { json: { content } })
    .json<Message>();
}

// 메시지 읽음 처리
export async function markMessagesAsRead(room_id: string): Promise<void> {
  await client.patch(`/api/chat/rooms/${room_id}/messages/read`);
}
