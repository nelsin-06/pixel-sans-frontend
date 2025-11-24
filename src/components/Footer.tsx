import { Link, useNavigate } from "react-router-dom";
import { Gamepad2 } from "lucide-react";
import { usePosts } from "@/hooks/usePosts/context";

const categories = [
  { name: "Gems", value: "gems" },
  { name: "Roblox", value: "roblox" },
  { name: "Free Fire", value: "free fire" },
  { name: "Diamonds", value: "diamonds" },
  { name: "Valorant", value: "valorant" },
  { name: "Brawl Stars", value: "brawl stars" },
  { name: "Code", value: "code" },
];

const Footer = () => {
  const { setCategory } = usePosts();
  const navigate = useNavigate();

  const handleCategoryClick = (value: string) => {
    setCategory(value);
    navigate("/");
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <footer className="mt-auto border-t border-border bg-background">
      <div className="container mx-auto px-4 py-8">
        {/* Logo and Description */}
        <div className="mb-8 text-center">
          <div className="flex items-center justify-center gap-2 mb-3">
            <Gamepad2 className="h-6 w-6 text-primary" />
            <span className="text-xl font-bold bg-gradient-gaming bg-clip-text text-transparent">
              gaming.pixel-sans
            </span>
          </div>
          <p className="text-muted-foreground text-sm max-w-md mx-auto">
            Your ultimate source for gaming news, free diamonds, gems, and exclusive codes
          </p>
        </div>

        {/* Quick Links - Categories */}
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-4 mb-8">
          {categories.map((category) => (
            <button
              key={category.name}
              onClick={() => handleCategoryClick(category.value)}
              className="text-sm text-muted-foreground hover:text-primary transition-colors text-center bg-transparent border-none cursor-pointer"
            >
              {category.name}
            </button>
          ))}
        </div>

        {/* Legal Links */}
        <div className="border-t border-border pt-6">
          <div className="flex flex-wrap justify-center gap-4 text-xs text-muted-foreground">
            <Link to="/privacy-policy" className="hover:text-primary transition-colors">
              Privacy Policy
            </Link>
            <span className="hidden sm:inline">|</span>
            <Link to="/legal-notice" className="hover:text-primary transition-colors">
              Legal Notice
            </Link>
            <span className="hidden sm:inline">|</span>
            <Link to="/terms" className="hover:text-primary transition-colors">
              Terms and Conditions
            </Link>
            <span className="hidden sm:inline">|</span>
            <Link to="/contact" className="hover:text-primary transition-colors">
              Contact
            </Link>
          </div>
          <p className="text-center text-xs text-muted-foreground mt-4">
            © 2024 gaming.pixel-sans. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;