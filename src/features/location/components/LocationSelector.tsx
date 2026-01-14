import { LOCATIONS } from '@/features/product/hooks/useProducts';
import { Button } from '@/shared/ui/Button';
// import '@/styles/location-selector.css';

interface LocationSelectorProps {
  selected: string;
  onChange: (location: string) => void;
}

function LocationSelector({ selected, onChange }: LocationSelectorProps) {
  return (
    <div className="mb-6">
      <h3 className="text-base font-bold mb-3 text-text-primary">
        지역 선택
      </h3>
      <div className="flex gap-2 flex-wrap">
        {LOCATIONS.map((location) => (
          <Button
            key={location.value}
            onClick={() => onChange(location.value)}
            variant={selected === location.value ? 'primary' : 'secondary'}
            size="sm"
            className="rounded-full"
          >
            {location.label}
          </Button>
        ))}
      </div>
    </div>
  );
}

export default LocationSelector;

