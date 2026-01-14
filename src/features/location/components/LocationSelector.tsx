import { LOCATIONS } from '@/features/product/hooks/useProducts';
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
          <button
            key={location.value}
            onClick={() => onChange(location.value)}
            className={`px-4 py-2 text-sm font-bold rounded-full transition-all cursor-pointer ${
              selected === location.value
                ? 'bg-primary text-text-inverse shadow-sm'
                : 'bg-bg-box text-text-body hover:bg-bg-box-hover'
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

