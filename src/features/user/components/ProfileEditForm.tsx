import React, { useState, useEffect } from 'react';
import { Button } from "@/shared/ui/Button";
import { Input } from "@/shared/ui/Input";
import { Select } from "@/shared/ui/Select";
import Avatar from "@/shared/ui/Avatar";

interface Region {
  id: string;
  name: string;
}

const DEFAULT_REGIONS: Region[] = [
  { id: '1', name: '서울' },
  { id: '2', name: '부산' },
  { id: '3', name: '대구' },
  { id: '4', name: '인천' },
  { id: '5', name: '광주' },
];

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
  const [regions] = useState<Region[]>(DEFAULT_REGIONS);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
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
    if (!regionId && regions.length > 0) {
      setRegionId(regions[0].id);
    }
  }, [regions, regionId]);

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

  const regionOptions = regions.map(r => ({ value: r.id, label: r.name }));

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
        <Select
          options={regionOptions}
          value={regionId}
          onChange={e => setRegionId(e.target.value)}
        />
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
