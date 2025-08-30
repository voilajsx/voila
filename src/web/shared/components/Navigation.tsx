import { useState } from "react";
import { Button } from "@voilajsx/uikit/button";
import { Menu, X } from "lucide-react";

interface NavigationProps {
  brand?: string;
  basePath?: string;
  navigation?: Array<{
    name: string;
    href: string;
  }>;
  ctaButton?: {
    label: string;
    href?: string;
    onClick?: () => void;
  };
}

const Navigation: React.FC<NavigationProps> = ({ 
  brand = "Voila",
  basePath = "",
  navigation = [
    { name: "Home", href: "/" },
    { name: "About", href: "/about" },
    { name: "Services", href: "/services" },
    { name: "Gallery", href: "/gallery" },
  ],
  ctaButton = { label: "Get Started" }
}) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  
  // Get current path for active state
  const currentPath = typeof window !== 'undefined' ? window.location.pathname : '';
  
  const isActive = (href: string) => {
    const fullHref = basePath + href;
    return currentPath === fullHref || (fullHref !== basePath && currentPath.startsWith(fullHref));
  };

  const handleNavClick = (href: string) => {
    const fullHref = basePath + href;
    window.location.href = fullHref;
    setIsMenuOpen(false);
  };

  const handleCtaClick = () => {
    if (ctaButton.onClick) {
      ctaButton.onClick();
    } else if (ctaButton.href) {
      window.location.href = ctaButton.href;
    }
  };

  return (
    <header className="fixed top-0 w-full bg-background/95 backdrop-blur-sm border-b border-border z-50">
      <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <button 
            onClick={() => handleNavClick("/")}
            className="flex items-center cursor-pointer"
          >
            <span className="text-2xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
              {brand}
            </span>
          </button>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            {navigation.map((item) => (
              <button
                key={item.name}
                onClick={() => handleNavClick(item.href)}
                className={`transition-colors duration-200 cursor-pointer ${
                  isActive(item.href)
                    ? "text-primary font-medium"
                    : "text-muted-foreground hover:text-foreground"
                }`}
              >
                {item.name}
              </button>
            ))}
            <Button 
              onClick={handleCtaClick}
              className="bg-primary hover:bg-primary/90 transition-all duration-500 hover:scale-105 transform"
            >
              {ctaButton.label}
            </Button>
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              aria-label="Toggle menu"
            >
              {isMenuOpen ? (
                <X className="h-6 w-6" />
              ) : (
                <Menu className="h-6 w-6" />
              )}
            </Button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <div className="md:hidden">
            <div className="px-2 pt-2 pb-3 space-y-1 bg-card shadow-lg rounded-lg mt-2">
              {navigation.map((item) => (
                <button
                  key={item.name}
                  onClick={() => handleNavClick(item.href)}
                  className={`block w-full text-left px-3 py-2 rounded-md text-sm font-medium transition-colors duration-200 ${
                    isActive(item.href)
                      ? "text-primary bg-accent"
                      : "text-muted-foreground hover:text-foreground hover:bg-accent"
                  }`}
                >
                  {item.name}
                </button>
              ))}
              <div className="px-3 py-2">
                <Button 
                  onClick={handleCtaClick}
                  className="w-full bg-primary hover:bg-primary/90 transition-all duration-500"
                >
                  {ctaButton.label}
                </Button>
              </div>
            </div>
          </div>
        )}
      </nav>
    </header>
  );
};

export default Navigation;