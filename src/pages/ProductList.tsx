import React from 'react';
import "../styles/common.css";
import "../styles/postlist.css";
import ProductCard from "../components/ProductCard";
import { useProducts } from "../hooks/useProducts";

function ProductList() {
  const { products, loading, error } = useProducts();

  if (loading) return <div className="loading">로딩 중...</div>;
  if (error) return <div className="error">{error}</div>;

  return (
    <div className="post-list-container">
      <h1 style={{ fontSize: '24px', fontWeight: 'bold', marginBottom: '20px' }}>중고거래 매물</h1>
      
      <div className="post-list-grid">
        {products.map((product) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>
      
      {products.length === 0 && (
        <div className="no-results">
          등록된 상품이 없습니다.
        </div>
      )}
    </div>
  );
}

export default ProductList;
