import { useSocialLogin } from '../hooks/useSocialLogin';

export function SocialLoginHandler() {
  useSocialLogin();
  return null; // 화면에 렌더링할 것은 없음
}
