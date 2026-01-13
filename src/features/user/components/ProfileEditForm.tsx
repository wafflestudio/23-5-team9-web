import React, { useState, useEffect } from 'react';
import { regionApi } from '@/features/location/api/region';
import '@/styles/profile-edit-form.css';

interface Region {
  id: string;
  name: string;
}

interface ProfileEditFormProps {
  initialEmail?: string;
  initialNickname?: string;
  initialRegionId?: string;
  initialProfileImage?: string;
  submitButtonText?: string;
  onSubmit: (data: { nickname: string; region_id: string; profile_image: string }) => Promise<void>;
}

export default function ProfileEditForm({
  initialEmail = '',
  initialNickname = '',
  initialRegionId = '',
  initialProfileImage = '',
  submitButtonText = '저장하기',
  onSubmit
}: ProfileEditFormProps) {

  // onboarding data
  const [nickname, setNickname] = useState(initialNickname);
  const [regionId, setRegionId] = useState(initialRegionId);
  const [profileImage, setProfileImage] = useState(initialProfileImage);
  const [regions, setRegions] = useState<Region[]>([]);
  const [loading, setLoading] = useState(false);
  const [regionsLoading, setRegionsLoading] = useState(true);
  const [detecting, setDetecting] = useState(false);

  useEffect(() => {
    // Update local state if props change (e.g. data loaded from parent)
    if (initialNickname) setNickname(initialNickname);
    if (initialRegionId) setRegionId(initialRegionId);
    if (initialProfileImage) {
      setProfileImage(initialProfileImage);
    } else {
      const randomSeed = Math.random().toString(36).substring(7);
      setProfileImage(`https://robohash.org/${randomSeed}?set=set4`);
    }
  }, [initialNickname, initialRegionId, initialProfileImage]);

  useEffect(() => {
    const fetchRegions = async () => {
      try {
        const res = await regionApi.getRegions();
        const data = res.data;
        setRegions(data);
        // If no region is selected and regions are loaded, select the first one
        if (!regionId && data.length > 0) {
          setRegionId(data[0].id);
        }
      } catch (error) {
        console.error('Error fetching regions:', error);
      } finally {
        setRegionsLoading(false);
      }
    };
    fetchRegions();
  }, []);

  // Effect to set default region if loaded and none selected yet (handling race conditions)
  useEffect(() => {
    if (!regionId && regions.length > 0) {
      setRegionId(regions[0].id);
    }
  }, [regions, regionId]);

  const handleDetectLocation = () => {
    if (!navigator.geolocation) {
      alert("브라우저가 위치 정보를 지원하지 않습니다.");
      return;
    }

    setDetecting(true);
    navigator.geolocation.getCurrentPosition(
      async (position) => {
        try {
          const { latitude, longitude } = position.coords;
          const res = await regionApi.detectRegion(latitude, longitude);
          const detectedRegion = res.data;

          // Check if detected region is in the region list
          const found = regions.find(r => r.id === detectedRegion.id);
          if (found) {
              setRegionId(detectedRegion.id);
              alert(`현재 위치('${detectedRegion.name}')가 선택되었습니다.`);
          } else {
              // Should not happen if regions are up to date, but if it does:
              setRegions(prev => [...prev, detectedRegion]);
              setRegionId(detectedRegion.id);
               alert(`현재 위치('${detectedRegion.name}')가 선택되었습니다.`);
          }
        } catch (error: any) {
          console.error("Error detecting location:", error);
          const msg = error.response?.data?.detail || "위치 감지 중 오류가 발생했습니다.";
          alert(msg);
        } finally {
          setDetecting(false);
        }
      },
      (error) => {
        console.error("Geolocation error:", error);
        alert("위치 정보를 가져올 수 없습니다. 설정에서 위치 권한을 허용해주세요.");
        setDetecting(false);
      }
    );
  };



  const generateRandomImage = () => {
    const randomSeed = Math.random().toString(36).substring(7);
    setProfileImage(`https://robohash.org/${randomSeed}?set=set4`);
  };

  const handleLinkInput = () => {
    const url = prompt('이미지 URL을 입력하세요:', profileImage);
    if (url) {
      setProfileImage(url);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      await onSubmit({ nickname, region_id: regionId, profile_image: profileImage });
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="profile-edit-form">
      <div className="profile-image-section">
        <div className="profile-image-container">
          <img 
              src={profileImage || 'https://via.placeholder.com/100'} 
              alt="Profile" 
              className="profile-image"
          />
          <div className="profile-image-actions">
            <button 
                type="button" 
                onClick={generateRandomImage}
                className="profile-action-btn"
            >
                랜덤
            </button>
            <button 
                type="button" 
                onClick={handleLinkInput}
                className="profile-action-btn"
            >
                링크
            </button>
          </div>
        </div>
      </div>

      {initialEmail && (
        <div>
          <label className="profile-form-label">이메일</label>
          <input
            type="text"
            value={initialEmail}
            readOnly
            className="form-input"
            style={{ backgroundColor: '#f0f0f0', color: '#666', cursor: 'not-allowed' }}
          />
        </div>
      )}

      <div>
        <label className="profile-form-label">닉네임</label>
        <input 
            type="text" 
            value={nickname} 
            onChange={e => setNickname(e.target.value)}
            className="form-input"
            required
        />
      </div>

      <div>
        <label className="profile-form-label">지역</label>
        <div style={{ display: 'flex', gap: '8px' }}>
            <select 
                value={regionId} 
                onChange={e => setRegionId(e.target.value)}
                className="form-input"
                disabled={regionsLoading}
                style={{ flex: 1 }}
            >
                {regionsLoading ? (
                    <option value="">불러오는 중...</option>
                ) : (
                    regions.map(region => (
                        <option key={region.id} value={region.id}>{region.name}</option>
                    ))
                )}
            </select>
            <button 
                type="button" 
                onClick={handleDetectLocation}
                disabled={detecting}
                className="profile-detect-location-btn"
            >
                {detecting ? "감지 중..." : "현재 위치 찾기"}
            </button>
        </div>
      </div>

      <button 
        type="submit" 
        className="profile-submit-btn"
        disabled={loading}
      >
        {loading ? '처리 중...' : submitButtonText}
      </button>
    </form>
  );
}
