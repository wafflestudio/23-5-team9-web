import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { userApi, User } from '../api/user';

export const useMyCarrotData = () => {
  const [user, setUser] = useState<User | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchUser = async () => {
      const token = localStorage.getItem('token');
      if (!token) return navigate('/login');
      
      try {
        const res = await userApi.getMe();
        if (res.ok) setUser(await res.json());
      } catch (err) { console.error(err); }
    };
    fetchUser();
  }, [navigate]);

  const updateProfile = async (data: any) => {
    if (!user) return;
    try {
      const res = await userApi.updateOnboard({ ...data, coin: user.coin }); // 기존 코인 유지
      if (res.ok) {
        setUser(await res.json());
        alert('정보가 수정되었습니다.');
      }
    } catch (err) { console.error(err); alert('오류 발생'); }
  };

  const chargeCoin = async (amount: number) => {
    if (!user) return;
    try {
      const res = await userApi.updateOnboard({
        nickname: user.nickname || '',
        region_id: user.region?.id || "default-id",
        profile_image: user.profile_image || '',
        coin: user.coin + amount
      });
      if (res.ok) {
        setUser(await res.json());
        // alert('충전 완료!'); // Optional feedback
      }
    } catch (err) { console.error(err); alert('충전 오류'); }
  };

  return { user, updateProfile, chargeCoin };
};
