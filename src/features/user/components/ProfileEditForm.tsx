import React, { useState, useEffect } from 'react';
import { regionApi } from '@/features/location/api/region';
// import '@/styles/profile-edit-form.css';

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
    <form onSubmit={handleSubmit} className="flex flex-col gap-6">
      <div className="text-center mb-2.5">
        <div className="relative inline-block">
          <img 
              src={profileImage || 'https://via.placeholder.com/100'} 
              alt="Profile" 
              className="w-[120px] h-[120px] rounded-full object-cover border border-[#e9ecef] bg-[#f8f9fa]"
          />
          <div className="absolute -bottom-2.5 left-1/2 -translate-x-1/2 flex gap-2 w-max">
            <button 
                type="button" 
                onClick={generateRandomImage}
                className="px-2.5 py-1.5 rounded-[20px] border border-[#dee2e6] bg-white text-xs cursor-pointer shadow-[0_2px_4px_rgba(0,0,0,0.05)]"
            >
                랜덤
            </button>
            <button 
                type="button" 
                onClick={handleLinkInput}
                className="px-2.5 py-1.5 rounded-[20px] border border-[#dee2e6] bg-white text-xs cursor-pointer shadow-[0_2px_4px_rgba(0,0,0,0.05)]"
            >
                링크
            </button>
          </div>
        </div>
      </div>

      {initialEmail && (
        <div>
          <label className="block mb-2 font-bold">이메일</label>
          <input
            type="text"
            value={initialEmail}
            readOnly
            className="w-full p-2.5 border border-gray-300 rounded-lg text-base outline-none bg-[#f0f0f0] text-[#666] cursor-not-allowed"
          />
        </div>
      )}

      <div>
        <label className="block mb-2 font-bold">닉네임</label>
        <input 
            type="text" 
            value={nickname} 
            onChange={e => setNickname(e.target.value)}
            className="w-full p-2.5 border border-gray-300 rounded-lg text-base outline-none"
            required
        />
      </div>

      <div>
        <label className="block mb-2 font-bold">지역</label>
        <div style={{ display: 'flex', gap: '8px' }}>
            <select 
                value={regionId} 
                onChange={e => setRegionId(e.target.value)}
                className="w-full p-2.5 border border-gray-300 rounded-lg text-base outline-none flex-1"
                disabled={regionsLoading}
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
                className="px-3 py-2 bg-gray text-white border-none rounded-md cursor-pointer text-sm disabled:bg-gray-400 disabled:cursor-not-allowed"
            >
                {detecting ? "감지 중..." : "현재 위치 찾기"}
            </button>
        </div>
      </div>

      <button 
        type="submit" 
        className="w-full p-3.5 bg-primary text-white border-none rounded-lg text-base font-bold cursor-pointer mt-3 disabled:bg-[#ffcfb0] disabled:cursor-not-allowed"
        disabled={loading}
      >
        {loading ? '처리 중...' : submitButtonText}
      </button>
    </form>
  );
}
