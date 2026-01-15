import { useUser, useUpdateUser } from '@/features/user/hooks/useUser';

export const useMyCarrotData = () => {
  const { user } = useUser();
  const updateUserMutation = useUpdateUser();

  const updateProfile = async (data: any) => {
    if (!user) return;
    try {
      await updateUserMutation.mutateAsync({ ...data, coin: user.coin });
      alert('정보가 수정되었습니다.');
    } catch (err) {
      console.error(err);
      alert('오류 발생');
    }
  };

  const chargeCoin = async (amount: number) => {
    if (!user) return;
    try {
      await updateUserMutation.mutateAsync({
        nickname: user.nickname || '',
        region_id: user.region?.id || "default-id",
        profile_image: user.profile_image || '',
        coin: user.coin + amount
      });
    } catch (err) {
      console.error(err);
      alert('충전 오류');
    }
  };

  return { user, updateProfile, chargeCoin };
};
