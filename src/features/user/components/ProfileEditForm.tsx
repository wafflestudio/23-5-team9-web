import React, { useState, useEffect } from 'react';
import { Region, regionApi } from '@/features/location/api/region';
import { useGeoLocation } from '@/features/location/hooks/useGeoLocation';
import { Button, Input, Select, Avatar } from '@/shared/ui';

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

  const [nickname, setNickname] = useState(initialNickname);
  const [regionId, setRegionId] = useState(initialRegionId);
  const [profileImage, setProfileImage] = useState(initialProfileImage);
  const [regions, setRegions] = useState<Region[]>([]);
  const [loading, setLoading] = useState(false);
  const [regionsLoading, setRegionsLoading] = useState(true);

  const { detectRegion, detecting } = useGeoLocation();

  useEffect(() => {
    if (initialNickname) setNickname(initialNickname);
  }, [initialNickname]);

  useEffect(() => {
    if (initialRegionId) setRegionId(initialRegionId);
  }, [initialRegionId]);

  useEffect(() => {
    if (initialProfileImage) {
      setProfileImage(initialProfileImage);
    } else {
      const randomSeed = Math.random().toString(36).substring(7);
      setProfileImage(`https://robohash.org/${randomSeed}?set=set4`);
    }
  }, [initialProfileImage]);

  useEffect(() => {
    const fetchRegions = async () => {
      try {
        const res = await regionApi.getRegions();
        const data = res.data;
        setRegions(data);
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

  const handleDetectLocation = async () => {
    try {
      const detectedRegion = await detectRegion();

      const found = regions.find(r => r.id === detectedRegion.id);
      if (!found) {
        setRegions(prev => [...prev, detectedRegion]);
      }
      setRegionId(detectedRegion.id);
      alert(`현재 위치('${detectedRegion.name}')가 선택되었습니다.`);
    } catch (error: any) {
      console.error("Error detecting location:", error);
      alert(error.message || "위치 감지 실패");
    }
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

  const regionOptions = regionsLoading
    ? [{ value: '', label: '불러오는 중...' }]
    : regions.map(r => ({ value: r.id, label: r.name }));

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-6">
      <div className="text-center mb-2">
        <div className="relative inline-block">
          <Avatar src={profileImage} alt="Profile" size="xl" />
          <div className="absolute -bottom-2 left-1/2 -translate-x-1/2 flex gap-1 w-max">
            <Button type="button" size="sm" variant="secondary" onClick={generateRandomImage} className="text-xs py-1 px-3">
                랜덤
            </Button>
            <Button type="button" size="sm" variant="secondary" onClick={handleLinkInput} className="text-xs py-1 px-3">
                링크
            </Button>
          </div>
        </div>
      </div>

      {initialEmail && (
        <div>
          <label className="block mb-2 font-bold text-sm text-text-secondary">이메일</label>
          <Input value={initialEmail} readOnly className="cursor-not-allowed opacity-70" />
        </div>
      )}

      <div>
        <label className="block mb-2 font-bold text-sm text-text-secondary">닉네임</label>
        <Input
            value={nickname}
            onChange={e => setNickname(e.target.value)}
            required
            placeholder="닉네임을 입력하세요"
        />
      </div>

      <div>
        <label className="block mb-2 font-bold text-sm text-text-secondary">지역</label>
        <div className="flex gap-2">
          <Select
            options={regionOptions}
            value={regionId}
            onChange={e => setRegionId(e.target.value)}
            disabled={regionsLoading}
            className="flex-1"
          />
          <Button
              type="button"
              onClick={handleDetectLocation}
              disabled={detecting}
              variant="secondary"
              className="whitespace-nowrap"
          >
              {detecting ? "감지 중..." : "위치 찾기"}
          </Button>
        </div>
      </div>

      <Button
        type="submit"
        size="lg"
        fullWidth
        disabled={loading}
        className="mt-4"
      >
        {loading ? '처리 중...' : submitButtonText}
      </Button>
    </form>
  );
}
