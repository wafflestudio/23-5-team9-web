import React, { useState, useEffect } from 'react';
import { MAIN_API_URL } from '../api/config';

interface Region {
  id: string;
  name: string;
}

interface ProfileEditFormProps {
  initialNickname?: string;
  initialRegionId?: string;
  initialProfileImage?: string;
  submitButtonText?: string;
  onSubmit: (data: { nickname: string; region_id: string; profile_image: string }) => Promise<void>;
}

export default function ProfileEditForm({
  initialNickname = '',
  initialRegionId = '',
  initialProfileImage = '',
  submitButtonText = '저장하기',
  onSubmit
}: ProfileEditFormProps) {
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
    if (initialProfileImage) setProfileImage(initialProfileImage);
  }, [initialNickname, initialRegionId, initialProfileImage]);

  useEffect(() => {
    const fetchRegions = async () => {
      try {
        const res = await fetch(`${MAIN_API_URL}/api/regions/`);
        if (res.ok) {
          const data = await res.json();
          setRegions(data);
          // If no region is selected and regions are loaded, select the first one
          if (!regionId && data.length > 0) {
            setRegionId(data[0].id);
          }
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
          const res = await fetch(`${MAIN_API_URL}/api/regions/detect`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ latitude, longitude }),
          });

          if (res.ok) {
            const detectedRegion = await res.json();
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
          } else {
            const errData = await res.json();
            alert(errData.detail || "위치 감지에 실패했습니다.");
          }
        } catch (error) {
          console.error("Error detecting location:", error);
          alert("위치 감지 중 오류가 발생했습니다.");
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
    <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
      <div style={{ textAlign: 'center', marginBottom: '10px' }}>
        <div style={{ position: 'relative', display: 'inline-block' }}>
          <img 
              src={profileImage || 'https://via.placeholder.com/100'} 
              alt="Profile" 
              style={{ 
                  width: '120px', 
                  height: '120px', 
                  borderRadius: '50%', 
                  objectFit: 'cover',
                  border: '1px solid #e9ecef',
                  backgroundColor: '#f8f9fa'
              }} 
          />
          <div style={{ 
            position: 'absolute', 
            bottom: -10, 
            left: '50%', 
            transform: 'translateX(-50%)', 
            display: 'flex', 
            gap: '8px',
            width: 'max-content'
          }}>
            <button 
                type="button" 
                onClick={generateRandomImage}
                style={{
                    padding: '6px 10px',
                    borderRadius: '20px',
                    border: '1px solid #dee2e6',
                    backgroundColor: 'white',
                    fontSize: '12px',
                    cursor: 'pointer',
                    boxShadow: '0 2px 4px rgba(0,0,0,0.05)'
                }}
            >
                랜덤
            </button>
            <button 
                type="button" 
                onClick={handleLinkInput}
                style={{
                    padding: '6px 10px',
                    borderRadius: '20px',
                    border: '1px solid #dee2e6',
                    backgroundColor: 'white',
                    fontSize: '12px',
                    cursor: 'pointer',
                    boxShadow: '0 2px 4px rgba(0,0,0,0.05)'
                }}
            >
                링크
            </button>
          </div>
        </div>
      </div>

      <div>
        <label style={{ display: 'block', marginBottom: '8px', fontWeight: 'bold' }}>닉네임</label>
        <input 
            type="text" 
            value={nickname} 
            onChange={e => setNickname(e.target.value)}
            className="form-input"
            required
        />
      </div>

      <div>
        <label style={{ display: 'block', marginBottom: '8px', fontWeight: 'bold' }}>지역</label>
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
                style={{
                    padding: '0 16px',
                    borderRadius: '8px',
                    border: '1px solid #ff6f0f',
                    backgroundColor: 'white',
                    color: '#ff6f0f',
                    fontSize: '14px',
                    fontWeight: 'bold',
                    cursor: 'pointer',
                    whiteSpace: 'nowrap'
                }}
            >
                {detecting ? "감지 중..." : "현재 위치 찾기"}
            </button>
        </div>
      </div>

      <button 
        type="submit" 
        className="button"
        disabled={loading}
        style={{
            marginTop: '10px',
            width: '100%',
            height: '48px'
        }}
      >
        {loading ? '처리 중...' : submitButtonText}
      </button>
    </form>
  );
}
