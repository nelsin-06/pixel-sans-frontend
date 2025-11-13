import { Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import { useState } from "react";

interface SearchBarProps {
  onSearch: (term: string) => void;
  initialValue?: string;
}

const SearchBar = ({ onSearch, initialValue = "" }: SearchBarProps) => {
  const [searchTerm, setSearchTerm] = useState(initialValue);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setSearchTerm(value);
    // The actual API call is debounced in the usePosts hook
    onSearch(value);
  };

  return (
    <div className="relative w-full max-w-md">
      <div className="absolute inset-y-0 left-0 flex items-center pl-3">
        <Search className="h-4 w-4 text-muted-foreground" />
      </div>
      <Input
        type="search"
        placeholder="Search posts..."
        value={searchTerm}
        onChange={handleInputChange}
        className="pl-10 bg-background border-border focus-visible:ring-primary"
      />
    </div>
  );
};

export default SearchBar;
