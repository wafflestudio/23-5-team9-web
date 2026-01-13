import { LOCATIONS } from '@/features/product/hooks/useProducts';
// import '@/styles/location-selector.css';

interface LocationSelectorProps {
  selectedLocation: string;
  onLocationChange: (location: string) => void;
}

function LocationSelector({ selectedLocation, onLocationChange }: LocationSelectorProps) {
  return (
    <div className="mb-6 pb-4 border-b border-[#e9ecef]">
      <h3 className="text-base font-bold mb-3 text-[#212529]">
        지역 선택
      </h3>
      <div className="flex gap-2 flex-wrap">
        {LOCATIONS.map((location) => (
          <button
            key={location.value}
            onClick={() => onLocationChange(location.value)}
            className={`px-4 py-2 text-sm font-bold border border-[#e9ecef] rounded-[20px] cursor-pointer whitespace-nowrap hover:bg-[#f8f9fa] ${
              selectedLocation === location.value 
                ? 'bg-primary text-white' 
                : 'bg-white text-[#4d5159]'
            }`}
          >
            {location.label}
          </button>
        ))}
      </div>
    </div>
  );
}

export default LocationSelector;

