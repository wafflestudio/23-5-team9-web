import { useAuthQuerySync } from '@/features/auth/model';

// Effect 기반 React Query 캐시 동기화 컴포넌트
// 인증 상태(isLoggedIn) 변경 시 자동으로 쿼리 캐시를 동기화
export function AuthQuerySync() {
  useAuthQuerySync();
  return null;
}
