import { useNavigate, useParams } from "react-router-dom";
import "../styles/common.css";
import "../styles/base-layout.css";
import "../styles/product-detail.css";
import { useProduct } from "../hooks/useProducts";

function ProductDetail() {
  const navigate = useNavigate();
  const { id } = useParams();
  const { product, loading, error } = useProduct(id);

  if (loading) return <div className="loading">불러오는 중...</div>;
  if (error) return <div className="error-message">{error}</div>;
  if (!product) return <div className="no-data">상품 정보가 없습니다.</div>;

  return (
    <div className="post-body-container">
      <button onClick={() => navigate(-1)} className="product-detail-back-btn">
        ← 뒤로가기
      </button>
      
      <section className="position-details card">
        {product.imageUrl && (
          <div className="product-image-container">
            <img src={product.imageUrl} alt={product.title} className="product-image-full" />
          </div>
        )}
        
        <h2>{product.title}</h2>
        <p className="product-category">{product.category}</p>
        <h3 className="product-price-lg">{product.price.toLocaleString()}원</h3>
        
        <div className="product-meta-row">
          <span>{product.location}</span>
          <span>·</span>
          <span>{new Date(product.createdAt).toLocaleDateString()}</span>
          <span>·</span>
          <span>관심 {product.likeCount}</span>
        </div>

        <hr className="product-divider" />
        
        <div className="product-content">
          {product.content}
        </div>
      </section>
      
      <div className="product-action-bar">
        <button 
          className="product-chat-btn"
          onClick={() => alert('채팅 기능은 준비중입니다.')}
        >
          채팅하기
        </button>
      </div>
    </div>
  );
}

export default ProductDetail;
