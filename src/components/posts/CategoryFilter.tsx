import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";

interface CategoryFilterProps {
  onSelectCategory: (category: string) => void;
  selectedCategory: string;
}

// These are example categories, you might want to fetch them dynamically
const predefinedCategories = [
  { value: "all", label: "All" },
  { value: "roblox", label: "Roblox" },
  { value: "free fire", label: "Free Fire" },
  { value: "valorant", label: "Valorant" },
  { value: "code", label: "Code" },
  { value: "gems", label: "Gems" },
  { value: "diamonds", label: "Diamonds" },
];

const CategoryFilter = ({ onSelectCategory, selectedCategory }: CategoryFilterProps) => {
  const [activeCategory, setActiveCategory] = useState(selectedCategory || "all");

  // Update local state when the prop changes
  useEffect(() => {
    if (selectedCategory !== activeCategory) {
      setActiveCategory(selectedCategory);
    }
  }, [selectedCategory]);

  const handleCategoryClick = (category: string) => {
    setActiveCategory(category);
    onSelectCategory(category);
  };

  return (
    <div className="flex items-center gap-2 overflow-x-auto pb-2 md:pb-0 no-scrollbar">
      {predefinedCategories.map((category) => (
        <Button
          key={category.value}
          variant={activeCategory === category.value ? "default" : "outline"}
          size="sm"
          onClick={() => handleCategoryClick(category.value)}
          className="whitespace-nowrap"
        >
          {category.label}
        </Button>
      ))}
    </div>
  );
};

export default CategoryFilter;
