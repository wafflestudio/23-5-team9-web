import { useUser, useOnboarding, usePatchUser } from '@/features/user/hooks/useUser';

export const useMyCarrotData = () => {
  const { user } = useUser();
  const onboardingMutation = useOnboarding();
  const patchUserMutation = usePatchUser();

  const updateProfile = async (data: any) => {
    if (!user) return;
    try {
      await onboardingMutation.mutateAsync(data);
      alert('정보가 수정되었습니다.');
    } catch (err) {
      console.error(err);
      alert('오류 발생');
    }
  };

  const chargeCoin = async (amount: number) => {
    if (!user) return;
    try {
      await patchUserMutation.mutateAsync({
        coin: user.coin + amount
      });
    } catch (err) {
      console.error(err);
      alert('충전 오류');
    }
  };

  return { user, updateProfile, chargeCoin };
};
