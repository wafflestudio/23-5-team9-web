import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { CommunityPost } from '../hooks/useCommunity';
import '../styles/community.css';

interface CommunityCardProps {
  post: CommunityPost;
}

function CommunityCard({ post }: CommunityCardProps) {
  const [isLiked, setIsLiked] = useState(post.isLiked);
  const [likeCount, setLikeCount] = useState(post.likeCount);
  const postDetailUrl = `/community/${post.id}`;

  const handleLikeClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    setIsLiked(!isLiked);
    setLikeCount(prev => isLiked ? prev - 1 : prev + 1);
  };

  const formatTimeAgo = (dateString: string) => {
    const now = new Date();
    const postDate = new Date(dateString);
    const diffInSeconds = Math.floor((now.getTime() - postDate.getTime()) / 1000);
    
    if (diffInSeconds < 60) return '방금 전';
    if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)}분 전`;
    if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)}시간 전`;
    if (diffInSeconds < 2592000) return `${Math.floor(diffInSeconds / 86400)}일 전`;
    return postDate.toLocaleDateString('ko-KR');
  };

  return (
    <Link to={postDetailUrl} className="post-list-item">
      <div className="post-image-wrapper">
        {post.imageUrl ? (
          <img 
            src={post.imageUrl} 
            alt={post.title} 
            className="post-image"
          />
        ) : (
          <div className="post-image-placeholder"></div>
        )}
      </div>
      <div className="post-content">
        <div className="community-card-category">
          <span className="community-card-category-label">
            {post.category}
          </span>
        </div>
        <h3 className="post-title">{post.title}</h3>
        <div className="post-info">
          <span className="post-location">{post.location}</span>
          <span className="post-dot">·</span>
          <span className="post-time">{formatTimeAgo(post.createdAt)}</span>
        </div>
        <div className="community-card-footer">
          <button
            onClick={handleLikeClick}
            className={`community-like-btn ${isLiked ? 'liked' : ''}`}
          >
            <span>{isLiked ? '♥' : '♡'}</span>
            <span>{likeCount}</span>
          </button>
          <span className="community-card-stat">
            💬 {post.commentCount}
          </span>
          <span className="community-card-stat">
            👁️ {post.viewCount}
          </span>
        </div>
      </div>
    </Link>
  );
}

export default CommunityCard;

