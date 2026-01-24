interface SearchBarProps {
  searchQuery: string;
  setSearchQuery: (val: string) => void;
}

export default function SearchBar({ searchQuery, setSearchQuery }: SearchBarProps) {
  return (
    <div className="flex items-center bg-bg-page border border-border-medium rounded-xl overflow-hidden transition-all focus-within:border-primary focus-within:ring-1 focus-within:ring-primary/20 w-[300px] sm:w-[400px]">
      <input
        type="text"
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
        placeholder="검색어를 입력해주세요"
        className="flex-1 px-4 py-2.5 text-sm outline-none bg-transparent text-text-primary placeholder:text-text-placeholder"
      />
    </div>
  );
}
