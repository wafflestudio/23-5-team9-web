import { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useUserProfile, useUser } from "@/features/user/hooks/useUser";
import { useUserProducts, useCreateProduct, useUpdateProduct, useDeleteProduct } from "@/features/product/hooks/useProducts";
import { createOrGetRoom } from "@/features/chat/api/chatApi";
import { PageContainer } from "@/shared/layouts/PageContainer";
import { Loading, ErrorMessage, EmptyState, Button, DetailHeader, Avatar, Input, Card, CardContent } from '@/shared/ui';
import ProductCard from "@/features/product/components/ProductCard";
import type { Product } from "@/features/product/api/productApi";

// ----------------------------------------------------------------------
// 1. Sub-component: ProductUpsertForm (등록/수정 폼)
// ----------------------------------------------------------------------

const ProductUpsertForm = ({ 
  initialData, 
  onSuccess, 
  onCancel 
}: { 
  initialData?: Product; 
  onSuccess: () => void; 
  onCancel: () => void; 
}) => {
  const isEditMode = !!initialData;
  const createProduct = useCreateProduct();
  const updateProduct = useUpdateProduct();

  const [formState, setFormState] = useState({
    title: initialData?.title || '',
    content: initialData?.content || '',
    price: initialData?.price ? String(initialData.price) : '',
    is_sold: initialData?.is_sold || false,
  });

  const isPending = createProduct.isPending || updateProduct.isPending;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const { title, content, price, is_sold } = formState;

    if (!title.trim() || !content.trim() || !price) {
      alert('모든 필드를 입력해주세요.');
      return;
    }

    try {
      const payload = {
        title: title.trim(),
        content: content.trim(),
        price: Number(price),
        category_id: initialData?.category_id || '1',
      };

      if (isEditMode && initialData) {
        await updateProduct.mutateAsync({ 
          id: initialData.id, 
          data: { ...payload, is_sold } 
        });
        alert('상품이 수정되었습니다.');
      } else {
        await createProduct.mutateAsync(payload);
        alert('상품이 등록되었습니다.');
      }
      onSuccess();
    } catch {
      alert(`상품 ${isEditMode ? '수정' : '등록'}에 실패했습니다.`);
    }
  };

  const handleChange = (field: string, value: any) => {
    setFormState(prev => ({ ...prev, [field]: value }));
  };

  return (
    <Card className="mb-6 border border-border-base rounded-lg p-3 mt-6">
      <CardContent>
        <h4 className="text-base font-medium text-text-heading mb-4">
          {isEditMode ? '상품 수정' : '새 상품 등록'}
        </h4>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm text-text-secondary mb-1">제목</label>
            <Input
              type="text"
              value={formState.title}
              onChange={(e) => handleChange('title', e.target.value)}
              placeholder="상품 제목을 입력하세요"
            />
          </div>
          <div>
            <label className="block text-sm text-text-secondary mb-1">내용</label>
            <textarea
              value={formState.content}
              onChange={(e) => handleChange('content', e.target.value)}
              rows={3}
              className="w-full rounded-xl bg-bg-page border border-border-medium p-4 text-base outline-none transition-all placeholder:text-text-placeholder focus:border-primary focus:ring-1 focus:ring-primary/20 resize-none"
              placeholder="상품 설명을 입력하세요"
            />
          </div>
          <div>
            <label className="block text-sm text-text-secondary mb-1">가격 (원)</label>
            <Input
              type="number"
              value={formState.price}
              onChange={(e) => handleChange('price', e.target.value)}
              placeholder="가격을 입력하세요"
              min="0"
            />
          </div>
          {isEditMode && (
            <div className="flex items-center gap-2">
              <input
                type="checkbox"
                id="is_sold"
                checked={formState.is_sold}
                onChange={(e) => handleChange('is_sold', e.target.checked)}
                className="w-4 h-4 accent-primary"
              />
              <label htmlFor="is_sold" className="text-sm text-text-secondary">판매 완료</label>
            </div>
          )}
          <div className="flex gap-2 pt-2 border-t border-border-base">
            <Button type="button" variant="secondary" fullWidth onClick={onCancel}>
              취소
            </Button>
            <Button type="submit" fullWidth disabled={isPending}>
              {isPending ? '처리 중...' : (isEditMode ? '수정 완료' : '상품 등록')}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
};

// ----------------------------------------------------------------------
// 2. Main Component: UserProfile
// ----------------------------------------------------------------------

function UserProfile() {
  const { userId } = useParams();
  const navigate = useNavigate();
  
  // Hooks
  const { profile, isLoading: profileLoading, error: profileError } = useUserProfile(userId);
  const { user, isLoggedIn } = useUser();
  const { products, loading: productsLoading } = useUserProducts(userId!);
  const deleteProduct = useDeleteProduct();

  // Local State
  const [chatLoading, setChatLoading] = useState(false);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);

  // Checks
  const isMyProfile = (user?.id && String(user.id) === userId) || userId === 'me';

  // Handlers
  const handleChatClick = async () => {
    if (!isLoggedIn) return navigate('/auth/login');
    if (isMyProfile) return alert('본인에게는 채팅을 보낼 수 없습니다.');

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

  const handleEditClick = (product: Product) => {
    setEditingProduct(product);
    setIsFormOpen(true);
  };

  const handleDeleteClick = async (product: Product) => {
    if (!confirm('정말로 이 상품을 삭제하시겠습니까?')) return;
    try {
      await deleteProduct.mutateAsync(product.id);
      alert('상품이 삭제되었습니다.');
    } catch {
      alert('상품 삭제에 실패했습니다.');
    }
  };

  const handleRegisterClick = () => {
    setEditingProduct(null);
    setIsFormOpen(true);
  };

  const closeForm = () => {
    setIsFormOpen(false);
    setEditingProduct(null);
  };

  // Rendering
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
            {isMyProfile && (
               <p className="text-sm text-text-secondary mt-1">내 프로필</p>
            )}
          </div>

          {!isMyProfile ? (
            <Button
              size="lg"
              fullWidth
              onClick={handleChatClick}
              disabled={chatLoading}
            >
              {chatLoading ? '채팅방 연결 중...' : '채팅하기'}
            </Button>
          ) : (
            // 내 프로필일 경우: 상품 등록 버튼 표시 (선택 사항)
            !isFormOpen && (
              <Button size="sm" variant="outline" onClick={handleRegisterClick}>
                + 상품 등록하기
              </Button>
            )
          )}
        </div>
      </div>

      {/* 상품 등록/수정 폼 (조건부 렌더링) */}
      {isMyProfile && isFormOpen && (
        <ProductUpsertForm
          initialData={editingProduct || undefined}
          onSuccess={closeForm}
          onCancel={closeForm}
        />
      )}

      {/* 판매 상품 섹션 */}
      <div className="mt-6">
        <h2 className="text-lg font-bold mb-4 text-text-heading">
          {isMyProfile ? '나의 판매 상품' : `${profile.nickname}님의 판매 상품`}
        </h2>
        
        {products.length === 0 && !isFormOpen ? (
          <EmptyState message="판매 중인 상품이 없습니다." />
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {products.map(p => (
              <ProductCard 
                key={p.id} 
                product={p} 
                // 내 프로필이면 수정/삭제 버튼 활성화
                showActions={isMyProfile} 
                onEdit={handleEditClick}
                onDelete={handleDeleteClick}
              />
            ))}
          </div>
        )}
      </div>
    </PageContainer>
  );
}

export default UserProfile;