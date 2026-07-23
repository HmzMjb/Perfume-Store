import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Heart, ShoppingBag, Star, Eye } from "lucide-react";

export default function ProductCard({ product }) {
  const [isWishlisted, setIsWishlisted] = useState(false);

  useEffect(() => {
    const checkWishlist = async () => {
      const token = localStorage.getItem("token");
      if (!token) return;
      try {
        const res = await fetch("/api/wishlist", {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (res.ok) {
          const data = await res.json();
          setIsWishlisted(data.some((p) => p._id === product._id));
        }
      } catch (err) {
        console.error(err);
      }
    };
    checkWishlist();
  }, [product._id]);

  const toggleWishlist = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem("token");
    if (!token) return;
    try {
      const res = await fetch(`/api/wishlist/${product._id}`, {
        method: "POST",
        headers: { Authorization: `Bearer ${token}` },
      });
      if (res.ok) {
        const data = await res.json();
        setIsWishlisted(data.some((p) => p._id === product._id));
      }
    } catch (err) {
      console.error(err);
    }
  };

  const minPrice = Math.min(...Object.values(product.price));

  return (
    <div className="group relative">
      {/* Image Container */}
      <div className="relative aspect-[3/4] overflow-hidden bg-bg-secondary rounded-xl mb-4 shadow-sm group-hover:shadow-xl transition-shadow duration-500">
        <img
          src={product.image}
          alt={product.name}
          className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
          onError={(e) => {
            e.target.style.display = "none";
            e.target.parentElement.classList.add("bg-gradient-to-br", "from-primary/10", "to-rose/10");
          }}
        />

        {/* Overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-black/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

        {/* Badges */}
        <div className="absolute top-3 left-3 flex flex-col gap-2 z-10">
          {product.isNew && (
            <span className="px-3 py-1 bg-sage text-white text-[10px] font-bold tracking-wider rounded-full uppercase">
              New
            </span>
          )}
        </div>

        {/* Wishlist Button */}
        <button
          onClick={toggleWishlist}
          className={`absolute top-3 right-3 w-10 h-10 rounded-full flex items-center justify-center transition-all duration-300 z-10 shadow-md ${
            isWishlisted
              ? "bg-rose text-white shadow-rose/30"
              : "bg-white/90 backdrop-blur-sm text-text-secondary hover:bg-rose hover:text-white hover:shadow-rose/30"
          } opacity-0 group-hover:opacity-100 translate-y-2 group-hover:translate-y-0`}
        >
          <Heart size={16} fill={isWishlisted ? "currentColor" : "none"} strokeWidth={2} />
        </button>

        {/* Quick View Button */}
        <Link
          to={`/product/${product._id}`}
          className="absolute top-3 right-14 w-10 h-10 rounded-full bg-white/90 backdrop-blur-sm flex items-center justify-center text-text-secondary hover:bg-white hover:text-primary transition-all duration-300 opacity-0 group-hover:opacity-100 translate-y-2 group-hover:translate-y-0 z-10 shadow-md"
        >
          <Eye size={16} strokeWidth={2} />
        </Link>

        {/* Add to Cart Button */}
        <div className="absolute bottom-0 left-0 right-0 p-3 translate-y-full group-hover:translate-y-0 transition-transform duration-500 z-10">
          <button className="w-full py-3 bg-white/95 backdrop-blur-sm text-text-primary rounded-xl flex items-center justify-center gap-2 text-sm font-semibold hover:bg-primary hover:text-white transition-colors duration-300 shadow-lg">
            <ShoppingBag size={16} strokeWidth={2} />
            Add to Cart
          </button>
        </div>
      </div>

      {/* Product Info */}
      <Link to={`/product/${product._id}`} className="block group/info">
        <div className="space-y-1.5 px-1">
          <p className="text-text-light text-[11px] tracking-[0.2em] uppercase font-medium">
            {product.brand}
          </p>
          <h3 className="font-heading text-base lg:text-lg text-text-primary group-hover:text-primary transition-colors duration-300">
            {product.name}
          </h3>
          <div className="flex items-center gap-1.5">
            <div className="flex items-center">
              {[...Array(5)].map((_, i) => (
                <Star
                  key={i}
                  size={11}
                  className={
                    i < Math.floor(product.rating)
                      ? "text-primary fill-primary"
                      : "text-border fill-border"
                  }
                />
              ))}
            </div>
            <span className="text-text-light text-[11px]">({product.reviews})</span>
          </div>
          <div className="flex items-center gap-2 pt-1">
            <span className="text-text-primary font-semibold text-sm">
              From ${minPrice}
            </span>
          </div>
        </div>
      </Link>
    </div>
  );
}
