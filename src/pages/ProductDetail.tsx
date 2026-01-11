import React from 'react';
import { useNavigate, useParams } from "react-router-dom";
import "../styles/common.css";
import "../styles/base-layout.css";
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
      <button onClick={() => navigate(-1)} style={{ marginBottom: '20px', border: 'none', background: 'none', cursor: 'pointer', fontSize: '1.2rem', display: 'flex', alignItems: 'center', gap: '5px' }}>
        ← 뒤로가기
      </button>
      
      <section className="position-details card">
        {product.imageUrl && (
          <div style={{ marginBottom: '20px', borderRadius: '8px', overflow: 'hidden' }}>
            <img src={product.imageUrl} alt={product.title} style={{ width: '100%', maxHeight: '400px', objectFit: 'cover' }} />
          </div>
        )}
        
        <h2>{product.title}</h2>
        <p style={{ fontSize: '1.1rem', color: '#868e96', marginBottom: '10px' }}>{product.category}</p>
        <h3 style={{ fontSize: '1.5rem', fontWeight: 'bold', marginBottom: '20px' }}>{product.price.toLocaleString()}원</h3>
        
        <div style={{ display: 'flex', gap: '10px', marginBottom: '20px', color: '#868e96', fontSize: '0.9rem' }}>
          <span>{product.location}</span>
          <span>·</span>
          <span>{new Date(product.createdAt).toLocaleDateString()}</span>
          <span>·</span>
          <span>관심 {product.likeCount}</span>
        </div>

        <hr style={{ margin: '20px 0', border: '0', borderTop: '1px solid #e9ecef' }} />
        
        <div style={{ whiteSpace: 'pre-wrap', lineHeight: '1.6' }}>
          {product.content}
        </div>
      </section>
      
      <div style={{ marginTop: '20px', display: 'flex', gap: '10px' }}>
        <button 
          style={{ 
            flex: 1, 
            padding: '15px', 
            backgroundColor: '#ff6f0f', 
            color: 'white', 
            border: 'none', 
            borderRadius: '6px', 
            fontSize: '1.1rem', 
            fontWeight: 'bold', 
            cursor: 'pointer' 
          }}
          onClick={() => alert('채팅 기능은 준비중입니다.')}
        >
          채팅하기
        </button>
      </div>
    </div>
  );
}

export default ProductDetail;
