import React, { useState } from 'react';
import "../styles/common.css";
import "../styles/base-layout.css";
import "../styles/community.css";
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
      <h1 className="community-title">동네생활</h1>
      
      {/* 지역 선택 */}
      <LocationSelector 
        selectedLocation={selectedLocation}
        onLocationChange={setSelectedLocation}
      />
      
      {/* 카테고리 필터 */}
      <div className="category-filter-container">
        {COMMUNITY_CATEGORIES.map((category) => (
          <button
            key={category.value}
            onClick={() => setSelectedCategory(category.value)}
            className={`category-filter-btn ${selectedCategory === category.value ? 'active' : ''}`}
          >
            {category.label}
          </button>
        ))}
      </div>
      
      {selectedLocation !== 'all' && (
        <div className="filter-info-box">
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
