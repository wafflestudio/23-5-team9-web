import React, { useState } from 'react';
import "../styles/common.css";
import "../styles/base-layout.css";
import CommunityCard from "../components/CommunityCard";
import LocationSelector from "../components/LocationSelector";
import { useCommunity, COMMUNITY_CATEGORIES, LOCATIONS } from "../hooks/useCommunity";

function CommunityList() {
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [selectedLocation, setSelectedLocation] = useState<string>('all');
  const { posts, loading, error } = useCommunity(selectedCategory, selectedLocation);

  if (loading) return <div className="loading">로딩 중...</div>;
  if (error) return <div className="error">{error}</div>;

  return (
    <div className="post-list-container">
      <h1 style={{ fontSize: '24px', fontWeight: 'bold', marginBottom: '20px' }}>동네생활</h1>
      
      {/* 지역 선택 */}
      <LocationSelector 
        selectedLocation={selectedLocation}
        onLocationChange={setSelectedLocation}
      />
      
      {/* 카테고리 필터 */}
      <div style={{ 
        display: 'flex', 
        gap: '8px', 
        marginBottom: '24px', 
        flexWrap: 'wrap',
        paddingBottom: '16px',
        borderBottom: '1px solid #e9ecef'
      }}>
        {COMMUNITY_CATEGORIES.map((category) => (
          <button
            key={category.value}
            onClick={() => setSelectedCategory(category.value)}
            style={{
              padding: '8px 16px',
              fontSize: '14px',
              fontWeight: 'bold',
              border: '1px solid #e9ecef',
              borderRadius: '20px',
              backgroundColor: selectedCategory === category.value ? '#ff6f0f' : '#ffffff',
              color: selectedCategory === category.value ? '#ffffff' : '#4d5159',
              cursor: 'pointer',
              transition: 'all 0.2s'
            }}
          >
            {category.label}
          </button>
        ))}
      </div>
      
      {selectedLocation !== 'all' && (
        <div style={{ 
          marginBottom: '16px', 
          padding: '12px',
          backgroundColor: '#fff4e6',
          borderRadius: '8px',
          fontSize: '14px',
          color: '#ff6f0f',
          fontWeight: 'bold'
        }}>
          {LOCATIONS.find(loc => loc.value === selectedLocation)?.label} 게시글 {posts.length}개
        </div>
      )}
      
      <div className="post-list-grid">
        {posts.map((post) => (
          <CommunityCard key={post.id} post={post} />
        ))}
      </div>
      
      {posts.length === 0 && (
        <div className="no-results">
          {selectedLocation !== 'all' 
            ? `${LOCATIONS.find(loc => loc.value === selectedLocation)?.label}에 등록된 게시글이 없습니다.`
            : '등록된 게시글이 없습니다.'
          }
        </div>
      )}
    </div>
  );
}

export default CommunityList;

