import { useNavigate, useParams } from "react-router-dom";
import { useProduct } from "@/features/product/hooks/useProducts";
import { Loading, ErrorMessage, EmptyState } from "@/shared/ui/StatusMessage";
import { PageContainer } from "@/shared/layouts/PageContainer";
import { Button } from "@/shared/ui/Button";

function ProductDetail() {
  const navigate = useNavigate();
  const { id } = useParams();
  const { product, loading, error } = useProduct(id);

  if (loading) return <Loading />;
  if (error) return <ErrorMessage message={error} />;
  if (!product) return <EmptyState message="상품 정보가 없습니다." />;

  return (
    <PageContainer>
       <div className="mb-4">
        <Button 
            variant="ghost" 
            onClick={() => navigate(-1)} 
            className="pl-0 hover:bg-transparent hover:text-primary"
        >
            ← 뒤로가기
        </Button>
      </div>
      
      <section className="bg-bg-page rounded-2xl border border-border-base shadow-sm p-6 overflow-hidden">
        {product.imageUrl && (
          // 수정됨: bg-bg-box(회색 배경) 제거. 
          // 필요하다면 border-border-light로 아주 연한 테두리만 추가하거나, 아예 제거하여 깔끔하게 표현
          <div className="mb-6 rounded-xl overflow-hidden border border-border-light/50">
            <img 
              src={product.imageUrl} 
              alt={product.title} 
              // object-contain 유지하여 이미지 전체 보임 + 배경은 이제 흰색(섹션 배경)
              className="w-full max-h-[400px] object-contain" 
            />
          </div>
        )}

        <h2 className="text-2xl font-bold mb-2">{product.title}</h2>
        <p className="text-sm text-text-secondary mb-4">{product.category}</p>
        <h3 className="text-3xl font-bold mb-6 text-text-heading">{product.price.toLocaleString()}원</h3>

        <div className="flex gap-2 text-text-secondary text-sm pb-6 border-b border-border-base">
          <span>{product.location}</span>
          <span>·</span>
          <span>{new Date(product.createdAt).toLocaleDateString()}</span>
          <span>·</span>
          <span>관심 {product.likeCount}</span>
        </div>

        <div className="mt-6 whitespace-pre-wrap leading-relaxed text-text-body">
          {product.content}
        </div>
      </section>
      
      <div className="mt-6 flex gap-3">
         {/* 수정됨: 직접 스타일을 넣는 대신 variant="outline" 사용 (StatCard, CoinTab과 통일) */}
         <Button variant="outline" size="lg" className="gap-2">
            <span className="text-red-500">♥</span> {product.likeCount}
         </Button>
        <Button
          size="lg"
          fullWidth
          onClick={() => alert('채팅 기능은 준비중입니다.')}
        >
          채팅하기
        </Button>
      </div>
    </PageContainer>
  );
}

export default ProductDetail;