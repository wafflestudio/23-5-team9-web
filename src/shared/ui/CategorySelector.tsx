interface Category {
  value: string;
  label: string;
}

interface CategorySelectorProps {
  categories: Category[];
  selectedCategory: string;
  onSelect: (value: string) => void;
}

export default function CategorySelector({ categories, selectedCategory, onSelect }: CategorySelectorProps) {
  return (
    <div className="flex gap-2 mb-6 flex-wrap">
      {categories.map((category) => {
        const isActive = selectedCategory === category.value;
        return (
          <button
            key={category.value}
            onClick={() => onSelect(category.value)}
            className={`
              px-4 py-2 text-sm font-bold rounded-full transition-all cursor-pointer
              ${isActive
                ? 'bg-primary text-text-inverse shadow-sm'
                : 'bg-bg-box text-text-body hover:bg-bg-box-hover'
              }
            `}
          >
            {category.label}
          </button>
        );
      })}
    </div>
  );
}
