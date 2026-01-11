import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { CommunityPost } from '../hooks/useCommunity';

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
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
          <span style={{ 
            fontSize: '12px', 
            color: '#ff6f0f', 
            backgroundColor: '#fff4e6', 
            padding: '2px 8px', 
            borderRadius: '4px',
            fontWeight: 'bold'
          }}>
            {post.category}
          </span>
        </div>
        <h3 className="post-title">{post.title}</h3>
        <div className="post-info">
          <span className="post-location">{post.location}</span>
          <span className="post-dot">·</span>
          <span className="post-time">{formatTimeAgo(post.createdAt)}</span>
        </div>
        <div className="post-footer" style={{ marginTop: 'auto', paddingTop: '10px', display: 'flex', gap: '12px', alignItems: 'center' }}>
          <button
            onClick={handleLikeClick}
            style={{
              border: 'none',
              background: 'none',
              cursor: 'pointer',
              padding: '4px',
              display: 'flex',
              alignItems: 'center',
              gap: '4px',
              color: isLiked ? '#ff6f0f' : '#868e96',
              fontSize: '13px'
            }}
          >
            <span>{isLiked ? '♥' : '♡'}</span>
            <span>{likeCount}</span>
          </button>
          <span style={{ color: '#868e96', fontSize: '13px' }}>
            💬 {post.commentCount}
          </span>
          <span style={{ color: '#868e96', fontSize: '13px' }}>
            👁️ {post.viewCount}
          </span>
        </div>
      </div>
    </Link>
  );
}

export default CommunityCard;

