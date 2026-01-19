import { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useUserProfile, useUser } from "@/features/user/hooks/useUser";
import { useProducts } from "@/features/product/hooks/useProducts";
import { createOrGetRoom } from "@/features/chat/api/chatApi";
import { PageContainer } from "@/shared/layouts/PageContainer";
import { Loading, ErrorMessage, EmptyState, Button, DetailHeader, Avatar } from '@/shared/ui';
import ProductCard from "@/features/product/components/ProductCard";

function UserProfile() {
  const { userId } = useParams();
  const navigate = useNavigate();
  const { profile, isLoading: profileLoading, error: profileError } = useUserProfile(userId);
  const { user, isLoggedIn } = useUser();
  const { products, loading: productsLoading } = useProducts();
  const [chatLoading, setChatLoading] = useState(false);

  const isMyProfile = user?.id && String(user.id) === userId;

  const userProducts = products.filter(p => p.owner_id === userId);

  const handleChatClick = async () => {
    if (!isLoggedIn) {
      navigate('/auth/login');
      return;
    }

    if (isMyProfile) {
      alert('본인에게는 채팅을 보낼 수 없습니다.');
      return;
    }

    setChatLoading(true);
    try {
      const roomId = await createOrGetRoom(userId!);
      navigate(`/chat/${roomId}`);
    } catch (err) {
      console.error('채팅방 생성 실패:', err);
      alert('채팅방을 열 수 없습니다.');
    } finally {
      setChatLoading(false);
    }
  };

  if (profileLoading || productsLoading) return <Loading />;
  if (profileError) return <ErrorMessage message="프로필을 불러올 수 없습니다." />;
  if (!profile) return <EmptyState message="사용자를 찾을 수 없습니다." />;

  return (
    <PageContainer>
      <DetailHeader />

      {/* 프로필 섹션 */}
      <div className="bg-bg-page rounded-2xl p-6 border border-border-medium">
        <div className="flex flex-col items-center gap-4">
          <Avatar
            src={profile.profile_image || undefined}
            alt={profile.nickname || '사용자'}
            size="lg"
          />
          <div className="text-center">
            <h1 className="text-xl font-bold text-text-heading">
              {profile.nickname || '알 수 없음'}
            </h1>
          </div>

          {!isMyProfile && (
            <Button
              size="lg"
              fullWidth
              onClick={handleChatClick}
              disabled={chatLoading}
            >
              {chatLoading ? '채팅방 연결 중...' : '채팅하기'}
            </Button>
          )}
        </div>
      </div>

      {/* 판매 상품 섹션 */}
      <div className="mt-6">
        <h2 className="text-lg font-bold mb-4 text-text-heading">
          {profile.nickname || '사용자'}의 판매 상품
        </h2>
        {userProducts.length === 0 ? (
          <EmptyState message="판매 중인 상품이 없습니다." />
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {userProducts.map(p => (
              <ProductCard key={p.id} product={p} />
            ))}
          </div>
        )}
      </div>
    </PageContainer>
  );
}

export default UserProfile;
