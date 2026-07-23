import { useState, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import { SlidersHorizontal, X, ChevronDown } from "lucide-react";
import ProductCard from "../../components/shared/ProductCard";
import { accordFilters } from "../../data/products";

export default function Products() {
  const [searchParams] = useSearchParams();
  const genderFilter = searchParams.get("gender");

  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showFilters, setShowFilters] = useState(false);
  const [selectedGender, setSelectedGender] = useState(genderFilter || "all");
  const [selectedAccords, setSelectedAccords] = useState([]);
  const [priceRange, setPriceRange] = useState([0, 500]);
  const [showAll, setShowAll] = useState(true);
  const [sortBy, setSortBy] = useState("featured");

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const res = await fetch("/api/products");
        const data = await res.json();
        setProducts(data);
      } catch (err) {
        console.error("Failed to fetch products:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchProducts();
  }, []);

  useEffect(() => {
    setSelectedGender(genderFilter || "all");
  }, [genderFilter]);

  const filteredProducts = products.filter((p) => {
    if (selectedGender !== "all" && p.gender !== selectedGender) return false;
    if (selectedAccords.length > 0 && !selectedAccords.some((a) => p.accords.includes(a)))
      return false;
    if (showAll) return true;
    const minPrice = Math.min(...Object.values(p.price));
    if (minPrice < priceRange[0] || minPrice > priceRange[1]) return false;
    return true;
  });

  const sortedProducts = [...filteredProducts].sort((a, b) => {
    switch (sortBy) {
      case "price-low":
        return Math.min(...Object.values(a.price)) - Math.min(...Object.values(b.price));
      case "price-high":
        return Math.min(...Object.values(b.price)) - Math.min(...Object.values(a.price));
      case "rating":
        return b.rating - a.rating;
      default:
        return 0;
    }
  });

  const toggleAccord = (accord) => {
    setSelectedAccords((prev) =>
      prev.includes(accord) ? prev.filter((a) => a !== accord) : [...prev, accord]
    );
  };

  return (
    <div className="min-h-screen bg-bg-main">
      {/* Header */}
      <div className="bg-bg-secondary py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="font-heading text-4xl text-center">
            {selectedGender === "men"
              ? "Men's Collection"
              : selectedGender === "women"
              ? "Women's Collection"
              : "All Fragrances"}
          </h1>
          <p className="text-text-secondary text-center mt-2">
            {sortedProducts.length} products
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Mobile Filter Toggle */}
          <button
            onClick={() => setShowFilters(!showFilters)}
            className="lg:hidden flex items-center gap-2 px-4 py-2 border border-border rounded-lg"
          >
            <SlidersHorizontal size={18} />
            Filters
          </button>

          {/* Sidebar Filters */}
          <div
            className={`lg:w-64 flex-shrink-0 ${
              showFilters ? "block" : "hidden lg:block"
            }`}
          >
            <div className="sticky top-24 space-y-6">
              {/* Gender */}
              <div>
                <h3 className="font-heading text-lg mb-4">Gender</h3>
                <div className="space-y-2">
                  {["all", "men", "women"].map((g) => (
                    <button
                      key={g}
                      onClick={() => setSelectedGender(g)}
                      className={`block w-full text-left px-4 py-2 rounded-lg text-sm transition-colors ${
                        selectedGender === g
                          ? "bg-primary text-white"
                          : "bg-bg-secondary text-text-secondary hover:bg-bg-tertiary"
                      }`}
                    >
                      {g === "all" ? "All" : g.charAt(0).toUpperCase() + g.slice(1)}
                    </button>
                  ))}
                </div>
              </div>

              {/* Accord */}
              <div>
                <h3 className="font-heading text-lg mb-4">Scent Family</h3>
                <div className="flex flex-wrap gap-2">
                  {accordFilters.map((accord) => (
                    <button
                      key={accord}
                      onClick={() => toggleAccord(accord)}
                      className={`px-3 py-1.5 rounded-full text-xs font-medium transition-colors ${
                        selectedAccords.includes(accord)
                          ? "bg-primary text-white"
                          : "bg-bg-secondary text-text-secondary hover:bg-bg-tertiary"
                      }`}
                    >
                      {accord}
                    </button>
                  ))}
                </div>
              </div>

              {/* Price Range */}
              <div>
                <h3 className="font-heading text-lg mb-4">Price Range</h3>
                <div className="space-y-3">
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input type="checkbox" checked={showAll}
                      onChange={(e) => setShowAll(e.target.checked)}
                      className="accent-primary" />
                    <span className="text-sm font-medium">All Prices</span>
                  </label>
                  {!showAll && (
                    <>
                      <input type="range" min="0" max="500" step="10" value={priceRange[1]}
                        onChange={(e) => setPriceRange([0, parseInt(e.target.value)])}
                        className="w-full accent-primary" />
                      <div className="flex justify-between text-sm text-text-secondary">
                        <span>$0</span>
                        <span>${priceRange[1]}{priceRange[1] === 500 ? "+" : ""}</span>
                      </div>
                    </>
                  )}
                </div>
              </div>

              {/* Clear Filters */}
              <button
                onClick={() => {
                  setSelectedGender("all");
                  setSelectedAccords([]);
                  setPriceRange([0, 500]);
                  setShowAll(true);
                }}
                className="w-full py-2 text-sm text-text-secondary hover:text-primary transition-colors"
              >
                Clear All Filters
              </button>
            </div>
          </div>

          {/* Products Grid */}
          <div className="flex-1">
            {/* Sort Bar */}
            <div className="flex items-center justify-between mb-6">
              <p className="text-text-secondary text-sm">
                Showing {sortedProducts.length} results
              </p>
              <div className="relative">
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="appearance-none px-4 py-2 pr-10 bg-bg-secondary border border-border rounded-lg text-sm focus:outline-none focus:border-primary"
                >
                  <option value="featured">Featured</option>
                  <option value="price-low">Price: Low to High</option>
                  <option value="price-high">Price: High to Low</option>
                  <option value="rating">Top Rated</option>
                </select>
                <ChevronDown size={16} className="absolute right-3 top-1/2 -translate-y-1/2 text-text-light pointer-events-none" />
              </div>
            </div>

            {/* Grid */}
            {loading ? (
              <div className="grid grid-cols-2 lg:grid-cols-3 gap-6">
                {[...Array(6)].map((_, i) => (
                  <div key={i} className="skeleton rounded-xl aspect-[3/4]" />
                ))}
              </div>
            ) : (
              <div className="grid grid-cols-2 lg:grid-cols-3 gap-6">
                {sortedProducts.map((product) => (
                  <ProductCard key={product._id || product.id} product={product} />
                ))}
              </div>
            )}

            {sortedProducts.length === 0 && (
              <div className="text-center py-20">
                <p className="text-text-secondary text-lg">No products found matching your filters.</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
