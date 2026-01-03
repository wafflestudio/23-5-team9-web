import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import LoginRequiredModal from './LoginRequiredModal';

const BASE_URL = 'https://api-internhasha.wafflestudio.com';

/**
 * 개별 포스트 카드를 렌더링하는 컴포넌트
 * @param {object} post - 개별 포스트 데이터
 */
function PostCard({ post }) {
  
  // 이미지는 post.profileImageKey (회사 로고)를 사용합니다.
  const imageUrl = post.profileImageKey ? `${BASE_URL}/${post.profileImageKey}` : null;
  const [imageError, setImageError] = useState(false);
  const [isBookmarked, setIsBookmarked] = useState(post.isBookmarked || false);
  const [isBookmarking, setIsBookmarking] = useState(false);
  const [showLoginModal, setShowLoginModal] = useState(false);
  const navigate = useNavigate();

  // post.isBookmarked가 변경되면 로컬 상태도 업데이트
  useEffect(() => {
    setIsBookmarked(post.isBookmarked || false);
  }, [post.isBookmarked]);
  
  // 상세 페이지로 이동할 경로 (예: /post/a5f5ead2...)
  const postDetailUrl = `/React-Week5/${post.id}`; 
  
  // 위치 데이터 정리 (예: "경기 성남시 분당구...")
  const location = post.location.split('|')[0];

  /**
   * 북마크 토글 핸들러
   */
  const handleBookmarkToggle = async (e) => {
    e.preventDefault(); // Link로의 이동 방지
    e.stopPropagation(); // 이벤트 전파 방지
    
    const token = localStorage.getItem('token');
    
    // 로그인 되어있지 않으면 모달 표시
    if (!token) {
      setShowLoginModal(true);
      return;
    }

    // 이미 요청 중이면 무시
    if (isBookmarking) return;
    
    setIsBookmarking(true);
    
    try {
      const method = isBookmarked ? 'DELETE' : 'POST';
      const response = await fetch(`${BASE_URL}/api/post/${post.id}/bookmark`, {
        method: method,
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      if (response.ok) {
        setIsBookmarked(!isBookmarked);
      } else if (response.status === 401) {
        localStorage.removeItem('token');
        setShowLoginModal(true);
      } else {
        throw new Error('북마크 처리에 실패했습니다.');
      }
    } catch (error) {
      console.error('북마크 처리 오류:', error);
      alert('북마크 처리 중 오류가 발생했습니다.');
    } finally {
      setIsBookmarking(false);
    }
  };

  return (
    <>
      <LoginRequiredModal 
        isOpen={showLoginModal} 
        onClose={() => setShowLoginModal(false)} 
      />
      {/* Link 컴포넌트로 카드 전체를 감싸 클릭 가능하게 만듭니다. */}
      <Link to={postDetailUrl} className="post-list-item">
        <div className="post-image-wrapper">
          {imageUrl && !imageError ? (
            <img 
              src={imageUrl} 
              alt="" 
              className="post-image"
              onError={() => setImageError(true)}
            />
          ) : (
            <div className="post-image-placeholder"></div>
          )}
        </div>
        <div className="post-details">
          <h3 className="post-title">{post.positionTitle}</h3>
          <div className="post-meta">
            <span className="post-location">{location}</span>
            <span className="post-time"> · 1분 전</span>
          </div>
          <div className="post-price-row">
             <span className="post-price">{post.companyName}</span>
             <button 
                className={`bookmark-button-list ${isBookmarked ? 'bookmarked' : ''}`}
                onClick={handleBookmarkToggle}
                disabled={isBookmarking}
              >
                {isBookmarked ? '♥' : '♡'}
              </button>
          </div>
        </div>
      </Link>
    </>
  );
}

export default PostCard;
