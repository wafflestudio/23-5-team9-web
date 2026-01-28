import { useState } from "react";
import AuctionCard from "@/features/auction/components/list/AuctionCard";
import { useAuctions } from "@/features/auction/hooks/useAuctions";
import { PageContainer } from "@/shared/layouts/PageContainer";
import { DataListLayout } from "@/shared/layouts/DataListLayout";
import { useRegionSelection } from "@/features/location/hooks/useRegionSelection";
import RegionSelector from "@/features/location/components/RegionSelector";
import RegionSelectModal from "@/features/location/components/RegionSelectModal";
import { Button } from "@/shared/ui";
import { useNavigate } from "react-router-dom";
import { useIsLoggedIn } from "@/features/auth/hooks/store";

export default function AuctionList() {
  const navigate = useNavigate();
  const isLoggedIn = useIsLoggedIn();
  const {
    currentRegionId,
    currentRegionName,
    isModalOpen,
    openModal,
    closeModal,
    handleRegionSelect,
    handleSidoSelect,
    handleSigugunSelect,
  } = useRegionSelection();

  const [categoryId] = useState<string | undefined>(undefined);

  const { auctions, loading, error } = useAuctions({
    regionId: currentRegionId,
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
    <PageContainer title="경매">
      <div className="mb-6 flex items-center justify-between gap-4">
        <RegionSelector regionName={currentRegionName} onClick={openModal} />
        <Button onClick={handleCreateAuction} variant="primary" size="sm">
          경매 등록
        </Button>
      </div>
      <DataListLayout
        isLoading={loading}
        error={error}
        isEmpty={auctions.length === 0}
        emptyMessage="등록된 경매가 없습니다"
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
