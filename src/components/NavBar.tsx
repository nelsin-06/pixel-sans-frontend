import { Link, useLocation } from "react-router-dom";
import { Search, Gamepad2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import ThemeToggle from "./ThemeToggle";

const categories = [
  { name: "HOME", path: "/" },
  { name: "GEMS", path: "/category/gems" },
  { name: "ROBLOX", path: "/category/roblox" },
  { name: "FREE FIRE", path: "/category/free-fire" },
  { name: "DIAMONDS", path: "/category/diamonds" },
  { name: "VALORANT", path: "/category/valorant" },
  { name: "BRAWL STARS", path: "/category/brawl-stars" },
  { name: "CODE", path: "/category/code" },
];

const NavBar = () => {
  const location = useLocation();

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    // TODO: Connect to search API
    // const searchTerm = e.target.search.value;
    // searchAPI(searchTerm);
    console.log("Search functionality ready for backend integration");
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
          {categories.map((category) => (
            <Link
              key={category.name}
              to={category.path}
              className={`
                px-4 py-2 rounded-md text-sm font-medium whitespace-nowrap transition-all
                ${
                  location.pathname === category.path
                    ? "bg-gradient-gaming text-primary-foreground shadow-gaming"
                    : "hover:bg-muted text-muted-foreground hover:text-foreground"
                }
              `}
            >
              {category.name}
            </Link>
          ))}
        </nav>
      </div>
    </header>
  );
};

export default NavBar;