import { useState } from "react";
import AuctionCard from "@/features/auction/components/AuctionCard";
import { useAuctions } from "@/features/auction/hooks/useAuctions";
import { PageContainer } from "@/shared/layouts/PageContainer";
import { DataListLayout } from "@/shared/layouts/DataListLayout";
import { useRegionSelection } from "@/features/location/hooks/useRegionSelection";
import RegionSelector from "@/features/location/components/RegionSelector";
import RegionSelectModal from "@/features/location/components/RegionSelectModal";
import { Button } from "@/shared/ui";
import { useNavigate } from "react-router-dom";
import { useIsLoggedIn } from "@/features/auth/hooks/store";
import { useTranslation } from "@/shared/i18n";

export default function AuctionList() {
  const navigate = useNavigate();
  const isLoggedIn = useIsLoggedIn();
  const t = useTranslation();
  const {
    currentRegionId,
    currentRegionName,
    currentSido,
    currentSigugun,
    isModalOpen,
    openModal,
    closeModal,
    handleRegionSelect,
    handleSidoSelect,
    handleSigugunSelect,
  } = useRegionSelection();

  const [categoryId] = useState<string | undefined>(undefined);

  // 지역 필터: 동 단위, 시/구/군 단위, 시/도 단위 모두 지원
  const { auctions, loading, error } = useAuctions({
    regionId: currentRegionId,
    sido: currentSido,
    sigugun: currentSigugun,
    categoryId,
  });

  const handleCreateAuction = () => {
    if (!isLoggedIn) {
      navigate('/auth/login');
      return;
    }
    navigate('/auction/new');
  };

  return (
    <PageContainer title={t.auction.auction}>
      <div className="mb-6 flex items-center justify-between gap-4">
        <RegionSelector regionName={currentRegionName} onClick={openModal} />
        <Button onClick={handleCreateAuction} variant="primary" size="sm">
          {t.auction.create}
        </Button>
      </div>
      <DataListLayout
        isLoading={loading}
        error={error}
        isEmpty={auctions.length === 0}
        emptyMessage={t.auction.noAuctions}
      >
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {auctions.map((auction) => (
            <AuctionCard key={auction.id} auction={auction} />
          ))}
        </div>
      </DataListLayout>
      <RegionSelectModal
        isOpen={isModalOpen}
        onClose={closeModal}
        onSelect={handleRegionSelect}
        onSelectSido={handleSidoSelect}
        onSelectSigugun={handleSigugunSelect}
        initialRegionId={currentRegionId}
      />
    </PageContainer>
  );
}
