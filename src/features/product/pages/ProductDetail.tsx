import { useParams } from "react-router-dom";
import { PageContainer } from "@/shared/layouts/PageContainer";
import { Loading, ErrorMessage, EmptyState, Button, DetailHeader, DetailSection, Avatar } from '@/shared/ui';
import ProductCard from "@/features/product/components/ProductCard";
import { ProductDetailView } from "@/features/product/components/ProductDetailView";
import ProductForm from "@/features/product/components/ProductForm";
import { useProductDetailLogic } from "@/features/product/hooks/useProductDetailLogic";
import { useTranslation } from "@/shared/i18n";

// ----------------------------------------------------------------------
// UI Components
// ----------------------------------------------------------------------

interface TranslationProps {
  t: ReturnType<typeof useTranslation>;
}

const SellerProfileCard = ({ profile, onClick, t }: { profile: any; onClick?: () => void } & TranslationProps) => (
  <div
    className={`flex items-center gap-3 ${onClick ? 'cursor-pointer hover:opacity-80 transition-opacity' : ''}`}
    onClick={onClick}
  >
    <Avatar src={profile?.profile_image} alt={profile?.nickname} size="sm" />
    <div>
      <div className="font-semibold text-text-heading">{profile?.nickname || t.common.unknown}</div>
      <div className="text-sm text-text-secondary">{t.product.seller}</div>
    </div>
  </div>
);

const SellerSection = ({
  profile,
  onProfileClick,
  onChatClick,
  chatLoading,
  showChatButton,
  t
}: {
  profile: any,
  onProfileClick: () => void,
  onChatClick: () => void,
  chatLoading: boolean,
  showChatButton: boolean
} & TranslationProps) => (
  <div className="flex items-center justify-between">
    <SellerProfileCard profile={profile} onClick={onProfileClick} t={t} />
    {showChatButton && (
      <Button size="sm" onClick={onChatClick} disabled={chatLoading}>
        {chatLoading ? t.product.connecting : t.product.startChat}
      </Button>
    )}
  </div>
);

const SellerProductList = ({ products, currentOwnerId, nickname, t }: { products: any[], currentOwnerId: string, nickname?: string } & TranslationProps) => {
  const sellerProducts = products.filter(p => p.owner_id === currentOwnerId).slice(0, 4);

  if (sellerProducts.length === 0) return null;

  return (
    <div className="mt-8">
      <h3 className="text-lg font-bold mb-4">{nickname || t.product.seller}{t.product.salesItems}</h3>
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {sellerProducts.map(p => <ProductCard key={p.id} product={p} />)}
      </div>
    </div>
  );
};

// ----------------------------------------------------------------------
// Main Page Component
// ----------------------------------------------------------------------

function ProductDetail() {
  const { id } = useParams();
  const t = useTranslation();
  const {
    // Data
    product,
    sellerProfile,
    sellerProducts,
    // Loading/Error States
    productLoading,
    productError,
    isDeleting,
    isUpdating,
    isChatLoading,
    // UI State
    isLiked,
    isEditing,
    isOwner,
    // Handlers
    handleLike,
    handleChat,
    handleDelete,
    handleEdit,
    handleNavigateToSeller,
    startEditing,
    cancelEditing,
  } = useProductDetailLogic(id!);

  if (productLoading) return <Loading />;
  if (productError) return <ErrorMessage message={t.product.loadFailed} />;
  if (!product) return <EmptyState message={t.product.noInfo} />;

  return (
    <PageContainer>
      <DetailHeader />

      <DetailSection className="mb-4">
        <SellerSection
          profile={sellerProfile}
          onProfileClick={handleNavigateToSeller}
          onChatClick={handleChat}
          chatLoading={isChatLoading}
          showChatButton={!isOwner}
          t={t}
        />
      </DetailSection>

      <DetailSection>
        {isEditing ? (
          <ProductForm
            initialData={product}
            onSubmit={handleEdit}
            onCancel={cancelEditing}
            submitLabel={t.common.save}
            showIsSold={true}
            isLoading={isUpdating}
          />
        ) : (
          <ProductDetailView
            product={product}
            isLiked={isLiked}
            isOwner={!!isOwner}
            isDeleting={isDeleting}
            onLike={handleLike}
            onEdit={startEditing}
            onDelete={handleDelete}
          />
        )}
      </DetailSection>

      {sellerProducts && (
        <SellerProductList
          products={sellerProducts}
          currentOwnerId={product.owner_id}
          nickname={sellerProfile?.nickname || ''}
          t={t}
        />
      )}
    </PageContainer>
  );
}

export default ProductDetail;
