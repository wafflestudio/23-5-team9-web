import { useState } from 'react';
import CommunityCard from "@/features/community/components/CommunityCard";
import LocationSelector from "@/features/location/components/LocationSelector";
import CategorySelector from "@/shared/ui/CategorySelector";
import Badge from "@/shared/ui/Badge";
import { useCommunity, COMMUNITY_CATEGORIES, LOCATIONS } from "@/features/community/hooks/useCommunity";
import { PageContainer } from "@/shared/layouts/PageContainer";
import { DataListLayout } from "@/shared/layouts/DataListLayout";

function CommunityList() {
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [selectedLocation, setSelectedLocation] = useState<string>('all');
  const { posts, loading, error } = useCommunity(selectedCategory, selectedLocation);

  const locationLabel = LOCATIONS.find(loc => loc.value === selectedLocation)?.label;

  const Filters = (
    <div className="flex flex-col gap-2 bg-bg-page pb-2">
      <LocationSelector
          selected={selectedLocation}
          onChange={setSelectedLocation}
        />
        <CategorySelector
          options={COMMUNITY_CATEGORIES}
          selected={selectedCategory}
          onSelect={setSelectedCategory}
        />
        {selectedLocation !== 'all' && (
          <Badge variant="primary" className="text-sm w-fit p-3">
            {locationLabel} 게시글 {posts.length}개
          </Badge>
        )}
    </div>
  );

  return (
    <PageContainer title="동네생활">
      <DataListLayout
        isLoading={loading}
        error={error}
        isEmpty={posts.length === 0}
        emptyMessage={selectedLocation !== 'all'
          ? `${locationLabel}에 등록된 게시글이 없습니다.`
          : '등록된 게시글이 없습니다.'
        }
        filters={Filters}
      >
        <div className="grid grid-cols-[repeat(auto-fill,minmax(210px,1fr))] gap-y-8 gap-x-6">
          {posts.map((post) => (
            <CommunityCard key={post.id} post={post} />
          ))}
        </div>
      </DataListLayout>
    </PageContainer>
  );
}

export default CommunityList;
