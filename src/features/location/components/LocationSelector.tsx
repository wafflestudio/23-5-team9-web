import { LOCATIONS } from '@/features/product/hooks/useProducts';
import '@/styles/location-selector.css';

interface LocationSelectorProps {
  selectedLocation: string;
  onLocationChange: (location: string) => void;
}

function LocationSelector({ selectedLocation, onLocationChange }: LocationSelectorProps) {
  return (
    <div className="location-selector">
      <h3 className="location-selector-title">
        지역 선택
      </h3>
      <div className="location-buttons">
        {LOCATIONS.map((location) => (
          <button
            key={location.value}
            onClick={() => onLocationChange(location.value)}
            className={`location-btn ${selectedLocation === location.value ? 'active' : ''}`}
          >
            {location.label}
          </button>
        ))}
      </div>
    </div>
  );
}

export default LocationSelector;

