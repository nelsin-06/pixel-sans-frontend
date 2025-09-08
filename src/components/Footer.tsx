import { Link } from "react-router-dom";
import { Gamepad2 } from "lucide-react";

const categories = [
  { name: "Gems", path: "/category/gems" },
  { name: "Roblox", path: "/category/roblox" },
  { name: "Free Fire", path: "/category/free-fire" },
  { name: "Diamonds", path: "/category/diamonds" },
  { name: "Valorant", path: "/category/valorant" },
  { name: "Brawl Stars", path: "/category/brawl-stars" },
  { name: "Code", path: "/category/code" },
];

const Footer = () => {
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
            <Link
              key={category.name}
              to={category.path}
              className="text-sm text-muted-foreground hover:text-primary transition-colors text-center"
            >
              {category.name}
            </Link>
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