import { LOCATIONS } from '@/features/product/hooks/useProducts';
import CategorySelector from '@/shared/ui/CategorySelector';

interface LocationSelectorProps {
  selected: string;
  onChange: (location: string) => void;
}

function LocationSelector({ selected, onChange }: LocationSelectorProps) {
  return (
    <CategorySelector
      options={LOCATIONS}
      selected={selected}
      onSelect={onChange}
      title="지역 선택"
      className="mb-6"
    />
  );
}

export default LocationSelector;
