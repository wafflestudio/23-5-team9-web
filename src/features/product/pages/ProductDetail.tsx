import { useNavigate, useParams } from "react-router-dom";
// import "@/styles/base-layout.css";
// import "@/styles/product-detail.css";
import { useProduct } from "@/features/product/hooks/useProducts";
import { Loading, ErrorMessage, EmptyState } from "@/shared/ui/StatusMessage";

function ProductDetail() {
  const navigate = useNavigate();
  const { id } = useParams();
  const { product, loading, error } = useProduct(id);

  if (loading) return <Loading />;
  if (error) return <ErrorMessage message={error} />;
  if (!product) return <EmptyState message="상품 정보가 없습니다." />;

  return (
    <div className="max-w-[720px] mx-auto my-10 px-5">
      <button onClick={() => navigate(-1)} className="mb-5 border-none bg-transparent cursor-pointer text-lg flex items-center gap-1">
        ← 뒤로가기
      </button>
      
      <section className="bg-white rounded-[20px] border-none shadow-[0_10px_25px_rgba(0,0,0,0.05)] overflow-hidden p-6">
        {product.imageUrl && (
          <div className="mb-5 rounded-lg overflow-hidden">
            <img src={product.imageUrl} alt={product.title} className="w-full max-h-[400px] object-cover" />
          </div>
        )}
        
        <h2 className="text-2xl font-bold mb-2">{product.title}</h2>
        <p className="text-lg text-gray-light mb-2.5">{product.category}</p>
        <h3 className="text-2xl font-bold mb-5">{product.price.toLocaleString()}원</h3>
        
        <div className="flex gap-2.5 mb-5 text-gray-light text-sm">
          <span>{product.location}</span>
          <span>·</span>
          <span>{new Date(product.createdAt).toLocaleDateString()}</span>
          <span>·</span>
          <span>관심 {product.likeCount}</span>
        </div>

        <hr className="my-5 border-0 border-t border-border" />
        
        <div className="whitespace-pre-wrap leading-relaxed">
          {product.content}
        </div>
      </section>
      
      <div className="mt-5 flex gap-2.5">
        <button 
          className="flex-1 p-[15px] bg-primary text-white border-none rounded-md text-lg font-bold cursor-pointer hover:bg-primary-hover"
          onClick={() => alert('채팅 기능은 준비중입니다.')}
        >
          채팅하기
        </button>
      </div>
    </div>
  );
}

export default ProductDetail;
