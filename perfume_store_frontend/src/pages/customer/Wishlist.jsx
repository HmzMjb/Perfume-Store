import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Heart, ShoppingBag, Trash2 } from "lucide-react";

export default function Wishlist() {
  const [wishlistItems, setWishlistItems] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchWishlist = async () => {
    const token = localStorage.getItem("token");
    if (!token) { setLoading(false); return; }
    try {
      const res = await fetch("/api/wishlist", {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (res.ok) {
        const data = await res.json();
        setWishlistItems(data);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchWishlist(); }, []);

  const removeItem = async (productId) => {
    const token = localStorage.getItem("token");
    try {
      const res = await fetch(`/api/wishlist/${productId}`, {
        method: "POST",
        headers: { Authorization: `Bearer ${token}` },
      });
      if (res.ok) {
        const data = await res.json();
        setWishlistItems(data);
      }
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="min-h-screen bg-bg-main">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <h1 className="font-heading text-4xl mb-2">Wishlist</h1>
        <p className="text-text-secondary mb-8">{wishlistItems.length} items saved</p>

        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {[...Array(3)].map((_, i) => <div key={i} className="skeleton rounded-2xl aspect-[3/4]" />)}
          </div>
        ) : wishlistItems.length === 0 ? (
          <div className="text-center py-20">
            <Heart size={64} className="mx-auto text-border mb-4" />
            <h2 className="font-heading text-2xl mb-2">Your Wishlist is Empty</h2>
            <p className="text-text-secondary mb-6">Save your favorite fragrances here</p>
            <Link to="/products"
              className="inline-flex items-center gap-2 px-8 py-3 bg-text-primary text-white rounded-full font-medium hover:bg-primary transition-colors">
              Explore Collection
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {wishlistItems.map((item) => (
              <div key={item._id} className="bg-bg-secondary rounded-2xl overflow-hidden">
                <div className="relative aspect-[3/4]">
                  <Link to={`/product/${item._id}`}>
                    <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
                  </Link>
                  <button onClick={() => removeItem(item._id)}
                    className="absolute top-3 right-3 w-10 h-10 rounded-full bg-white/90 flex items-center justify-center text-rose hover:bg-rose hover:text-white transition-all">
                    <Trash2 size={16} />
                  </button>
                </div>
                <div className="p-5">
                  <p className="text-text-light text-xs tracking-widest uppercase">{item.brand}</p>
                  <h3 className="font-heading text-lg mt-1">{item.name}</h3>
                  <div className="flex items-center gap-2 mt-2">
                    {Object.entries(item.price || {}).map(([size, price]) => (
                      <span key={size} className="text-sm text-text-secondary">
                        {size}: ${price}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
