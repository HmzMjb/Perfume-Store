import { useState, useEffect } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { Search, ShoppingBag, Heart, User, Menu, X, LogOut, LayoutDashboard } from "lucide-react";
import { useAuth } from "../../context/AuthContext";

export default function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [wishlistCount, setWishlistCount] = useState(0);
  const [cartCount, setCartCount] = useState(0);
  const [searchQuery, setSearchQuery] = useState("");
  const location = useLocation();
  const navigate = useNavigate();
  const { user, logout } = useAuth();

  useEffect(() => {
    const fetchCounts = async () => {
      const token = localStorage.getItem("token");
      if (!token) return;
      try {
        const [wishlistRes, cartRes] = await Promise.all([
          fetch("/api/wishlist", { headers: { Authorization: `Bearer ${token}` } }),
          fetch("/api/cart", { headers: { Authorization: `Bearer ${token}` } }),
        ]);
        if (wishlistRes.ok) {
          const wishlist = await wishlistRes.json();
          setWishlistCount(wishlist.length);
        }
        if (cartRes.ok) {
          const cart = await cartRes.json();
          setCartCount(cart.length);
        }
      } catch (err) {
        console.error(err);
      }
    };
    fetchCounts();
  }, [user]);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    setIsMenuOpen(false);
    setIsSearchOpen(false);
  }, [location]);

  const navLinks = [
    { name: "Home", path: "/" },
    { name: "Men", path: "/products?gender=men" },
    { name: "Women", path: "/products?gender=women" },
    { name: "All Products", path: "/products" },
  ];

  const isActive = (path) => location.pathname === path;

  return (
    <>
      <nav
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
          scrolled
            ? "bg-bg-main/98 backdrop-blur-xl shadow-[0_4px_30px_rgba(0,0,0,0.06)]"
            : "bg-bg-main"
        }`}
      >
        {/* Top Bar */}
        <div
          className={`text-center text-sm font-light tracking-wider transition-all duration-500 overflow-hidden ${
            scrolled ? "max-h-0 py-0 opacity-0" : "max-h-12 py-2.5 opacity-100 bg-text-primary text-white"
          }`}
        >
          Free shipping on orders above $150
        </div>

        {/* Main Nav */}
        <div className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-10">
          <div className="flex items-center justify-between h-16 lg:h-20">

            {/* Left Section */}
            <div className="flex items-center gap-8 flex-1">
              {/* Mobile Menu Button */}
              <button
                className="lg:hidden text-text-primary"
                onClick={() => setIsMenuOpen(!isMenuOpen)}
                aria-label="Menu"
              >
                {isMenuOpen ? <X size={22} /> : <Menu size={22} />}
              </button>

              {/* Desktop Nav Links */}
              <div className="hidden lg:flex items-center gap-8">
                {navLinks.map((link) => (
                  <Link
                    key={link.name}
                    to={link.path}
                    className={`relative text-[11px] tracking-[0.2em] uppercase transition-all duration-300 py-2 ${
                      isActive(link.path)
                        ? "text-primary font-semibold"
                        : "text-text-secondary hover:text-text-primary font-medium"
                    }`}
                  >
                    {link.name}
                    {isActive(link.path) && (
                      <span className="absolute -bottom-1 left-0 right-0 h-[2px] bg-primary rounded-full" />
                    )}
                  </Link>
                ))}
              </div>
            </div>

            {/* Center Logo */}
            <Link to="/" className="flex-shrink-0 mx-6 lg:mx-10">
              <h1 className="font-heading text-2xl lg:text-3xl font-bold tracking-[0.25em] text-text-primary whitespace-nowrap">
                MAISON
              </h1>
            </Link>

            {/* Right Section */}
            <div className="flex items-center gap-2 sm:gap-3 flex-1 justify-end">
              <button
                onClick={() => setIsSearchOpen(true)}
                className="p-2.5 text-text-secondary hover:text-primary transition-colors rounded-full hover:bg-primary/5"
                aria-label="Search"
              >
                <Search size={19} strokeWidth={1.5} />
              </button>
              <Link
                to="/wishlist"
                className="relative p-2.5 text-text-secondary hover:text-primary transition-colors rounded-full hover:bg-primary/5 hidden sm:flex"
                aria-label="Wishlist"
              >
                <Heart size={19} strokeWidth={1.5} />
                {wishlistCount > 0 && (
                  <span className="absolute top-0.5 right-0.5 bg-rose text-white text-[9px] w-[18px] h-[18px] rounded-full flex items-center justify-center font-bold leading-none">
                    {wishlistCount}
                  </span>
                )}
              </Link>
              <Link
                to="/cart"
                className="relative p-2.5 text-text-secondary hover:text-primary transition-colors rounded-full hover:bg-primary/5"
                aria-label="Cart"
              >
                <ShoppingBag size={19} strokeWidth={1.5} />
                {cartCount > 0 && (
                  <span className="absolute top-0.5 right-0.5 bg-primary text-white text-[9px] w-[18px] h-[18px] rounded-full flex items-center justify-center font-bold leading-none">
                    {cartCount}
                  </span>
                )}
              </Link>
              {user ? (
                <div className="hidden sm:flex items-center gap-2">
                  {user.role === "admin" && (
                    <Link
                      to="/admin"
                      className="p-2.5 text-text-secondary hover:text-primary transition-colors rounded-full hover:bg-primary/5"
                      aria-label="Admin Dashboard"
                    >
                      <LayoutDashboard size={19} strokeWidth={1.5} />
                    </Link>
                  )}
                  <Link
                    to="/profile"
                    className="p-2.5 text-text-secondary hover:text-primary transition-colors rounded-full hover:bg-primary/5"
                    aria-label="Profile"
                  >
                    <User size={19} strokeWidth={1.5} />
                  </Link>
                  <button
                    onClick={logout}
                    className="p-2.5 text-text-secondary hover:text-rose transition-colors rounded-full hover:bg-rose/5"
                    aria-label="Logout"
                  >
                    <LogOut size={19} strokeWidth={1.5} />
                  </button>
                </div>
              ) : (
                <Link
                  to="/login"
                  className="p-2.5 text-text-secondary hover:text-primary transition-colors rounded-full hover:bg-primary/5 hidden sm:flex"
                  aria-label="Account"
                >
                  <User size={19} strokeWidth={1.5} />
                </Link>
              )}
            </div>
          </div>
        </div>
      </nav>

      {/* Search Overlay */}
      <div
        className={`fixed inset-0 z-[60] transition-all duration-400 ${
          isSearchOpen ? "visible opacity-100" : "invisible opacity-0"
        }`}
      >
        <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={() => setIsSearchOpen(false)} />
        <div
          className={`absolute top-0 left-0 right-0 bg-bg-main shadow-2xl transition-transform duration-400 ${
            isSearchOpen ? "translate-y-0" : "-translate-y-full"
          }`}
        >
          <div className="max-w-3xl mx-auto px-6 py-8">
            <div className="flex items-center gap-4">
              <Search className="text-primary flex-shrink-0" size={22} />
              <input
                type="text"
                placeholder="Search for perfumes, brands, notes..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter" && searchQuery.trim()) {
                    navigate(`/products?search=${encodeURIComponent(searchQuery.trim())}`);
                    setIsSearchOpen(false);
                    setSearchQuery("");
                  }
                }}
                className="w-full text-lg bg-transparent border-b-2 border-border focus:border-primary py-3 text-text-primary placeholder-text-light focus:outline-none transition-colors"
              />
              <button
                onClick={() => { setIsSearchOpen(false); setSearchQuery(""); }}
                className="p-2 text-text-secondary hover:text-text-primary transition-colors flex-shrink-0"
              >
                <X size={22} />
              </button>
            </div>
            <div className="flex gap-2 mt-5">
              {[
                { label: "Popular", path: "/products?sort=rating" },
                { label: "New Arrivals", path: "/products?sort=newest" },
                { label: "Best Sellers", path: "/products?sort=featured" },
              ].map((tag) => (
                <span
                  key={tag.label}
                  onClick={() => { navigate(tag.path); setIsSearchOpen(false); setSearchQuery(""); }}
                  className="px-4 py-1.5 bg-bg-secondary rounded-full text-xs text-text-secondary hover:text-primary hover:bg-primary/5 cursor-pointer transition-colors"
                >
                  {tag.label}
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      <div
        className={`fixed inset-0 z-[55] lg:hidden transition-all duration-400 ${
          isMenuOpen ? "visible opacity-100" : "invisible opacity-0"
        }`}
      >
        <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={() => setIsMenuOpen(false)} />
        <div
          className={`absolute top-0 left-0 bottom-0 w-72 bg-bg-main shadow-2xl transition-transform duration-400 ${
            isMenuOpen ? "translate-x-0" : "-translate-x-full"
          }`}
        >
          <div className="p-6">
            <div className="flex items-center justify-between mb-8">
              <h2 className="font-heading text-lg">Menu</h2>
              <button onClick={() => setIsMenuOpen(false)} className="p-2" aria-label="Close menu">
                <X size={20} />
              </button>
            </div>
            <div className="space-y-5">
              {navLinks.map((link) => (
                <Link
                  key={link.name}
                  to={link.path}
                  className={`block text-sm tracking-[0.15em] uppercase transition-colors py-1 ${
                    isActive(link.path)
                      ? "text-primary font-semibold"
                      : "text-text-secondary hover:text-text-primary"
                  }`}
                  onClick={() => setIsMenuOpen(false)}
                >
                  {link.name}
                </Link>
              ))}
            </div>
            <div className="mt-8 pt-6 border-t border-border space-y-4">
              {user ? (
                <>
                  {user.role === "admin" && (
                    <Link
                      to="/admin"
                      className="flex items-center gap-3 text-sm text-text-secondary hover:text-primary transition-colors"
                      onClick={() => setIsMenuOpen(false)}
                    >
                      <LayoutDashboard size={18} />
                      Admin Dashboard
                    </Link>
                  )}
                  <Link
                    to="/profile"
                    className="flex items-center gap-3 text-sm text-text-secondary hover:text-primary transition-colors"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    <User size={18} />
                    Profile
                  </Link>
                  <button
                    onClick={() => { logout(); setIsMenuOpen(false); }}
                    className="flex items-center gap-3 text-sm text-text-secondary hover:text-rose transition-colors"
                  >
                    <LogOut size={18} />
                    Sign Out
                  </button>
                </>
              ) : (
                <Link
                  to="/login"
                  className="flex items-center gap-3 text-sm text-text-secondary hover:text-primary transition-colors"
                  onClick={() => setIsMenuOpen(false)}
                >
                  <User size={18} />
                  Sign In
                </Link>
              )}
              <Link
                to="/wishlist"
                className="flex items-center gap-3 text-sm text-text-secondary hover:text-primary transition-colors"
                onClick={() => setIsMenuOpen(false)}
              >
                <Heart size={18} />
                Wishlist
              </Link>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
