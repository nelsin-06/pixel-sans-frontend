import { Link, useLocation, useNavigate } from "react-router-dom";
import { Search, Gamepad2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import ThemeToggle from "./ThemeToggle";
import { useState } from "react";
import { usePosts } from "@/hooks/usePosts/context";

const categories = [
  { name: "ALL", path: "/", value: "all" },
  { name: "GEMS", path: "/", value: "gems" },
  { name: "ROBLOX", path: "/", value: "roblox" },
  { name: "FREE FIRE", path: "/", value: "free fire" },
  { name: "DIAMONDS", path: "/", value: "diamonds" },
  { name: "VALORANT", path: "/", value: "valorant" },
  { name: "BRAWL STARS", path: "/", value: "brawl stars" },
  { name: "CODE", path: "/", value: "code" },
];

const NavBar = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState("");
  
  // Get access to the global posts state to manipulate filters
  const { setSearchTerm: setGlobalSearchTerm, setCategory, currentCategory } = usePosts();

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    const form = e.target as HTMLFormElement;
    const formData = new FormData(form);
    const term = formData.get("search") as string;
    setSearchTerm(term);
    setGlobalSearchTerm(term);
    
    if (location.pathname !== "/") {
      navigate("/");
    }
  };

  const handleCategoryClick = (categoryValue: string) => {
    setCategory(categoryValue);
    if (location.pathname !== "/") {
      navigate("/");
    }
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container mx-auto px-4">
        {/* Title and Search Section */}
        <div className="flex items-center justify-between py-4">
          <Link to="/" className="flex items-center gap-2 hover:opacity-90 transition-opacity">
            <Gamepad2 className="h-8 w-8 text-primary" />
            <h1 className="text-2xl font-bold bg-gradient-gaming bg-clip-text text-transparent">
              gaming.pixel-sans
            </h1>
          </Link>

          <div className="flex items-center gap-4">
            <form onSubmit={handleSearch} className="relative hidden md:flex">
              <Input
                type="search"
                name="search"
                value={searchTerm}
                onChange={(e) => {
                  setSearchTerm(e.target.value);
                  // El debounce está implementado en el hook usePosts
                  setGlobalSearchTerm(e.target.value);
                }}
                placeholder="Search games, guides, codes..."
                className="w-80 pr-10 bg-muted/50 border-muted focus:border-primary"
              />
              <Button
                type="submit"
                size="sm"
                variant="ghost"
                className="absolute right-0 top-0 h-full px-3 hover:bg-transparent"
              >
                <Search className="h-4 w-4 text-muted-foreground" />
              </Button>
            </form>
            <ThemeToggle />
          </div>
        </div>

        {/* Category Navigation */}
        <nav className="flex gap-1 overflow-x-auto pb-3 scrollbar-hide">
          {categories.map((category) => {
            const isActive = category.value === currentCategory || 
                          (category.value === "all" && !currentCategory);
            
            return (
              <button
                key={category.name}
                onClick={() => handleCategoryClick(category.value)}
                className={`
                  px-4 py-2 rounded-md text-sm font-medium whitespace-nowrap transition-all
                  ${
                    isActive
                      ? "bg-gradient-gaming text-primary-foreground shadow-gaming"
                      : "hover:bg-muted text-muted-foreground hover:text-foreground"
                  }
                `}
              >
                {category.name}
              </button>
            );
          })}
        </nav>
      </div>
    </header>
  );
};

export default NavBar;