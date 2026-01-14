import { Button } from '@/shared/ui/Button';

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
          <Button
            key={category.value}
            onClick={() => onSelect(category.value)}
            variant={isActive ? 'primary' : 'secondary'}
            size="sm"
            className="rounded-full"
          >
            {category.label}
          </Button>
        );
      })}
    </div>
  );
}
