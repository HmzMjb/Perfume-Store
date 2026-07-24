import { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { Heart, ShoppingBag, Star, ChevronRight, Minus, Plus, Loader2 } from "lucide-react";
import SizeSelector from "../../components/shared/SizeSelector";
import { useAuth } from "../../context/AuthContext";
import { useToast } from "../../context/ToastContext";

export default function ProductDetail() {
  const { id } = useParams();
  const { user } = useAuth();
  const { showToast } = useToast();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [selectedSize, setSelectedSize] = useState("50ml");
  const [quantity, setQuantity] = useState(1);
  const [activeImage, setActiveImage] = useState(0);
  const [isWishlisted, setIsWishlisted] = useState(false);
  const [activeTab, setActiveTab] = useState("notes");
  const [reviews, setReviews] = useState([]);
  const [reviewForm, setReviewForm] = useState({ rating: 5, comment: "" });
  const [submittingReview, setSubmittingReview] = useState(false);
  const [reviewError, setReviewError] = useState("");
  const [addingToCart, setAddingToCart] = useState(false);

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const res = await fetch(`/api/products/${id}`);
        if (!res.ok) throw new Error("Product not found");
        const data = await res.json();
        setProduct(data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchProduct();
  }, [id]);

  useEffect(() => {
    const fetchReviews = async () => {
      try {
        const res = await fetch(`/api/reviews/${id}`);
        if (res.ok) {
          const data = await res.json();
          setReviews(data);
        }
      } catch (err) {
        console.error(err);
      }
    };
    fetchReviews();
  }, [id]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="skeleton w-64 h-64 rounded-xl" />
      </div>
    );
  }

  if (!product) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-text-secondary text-lg">Product not found.</p>
      </div>
    );
  }

  const sizes = Object.keys(product.price);

  const handleSubmitReview = async (e) => {
    e.preventDefault();
    if (!user) return;
    setSubmittingReview(true);
    setReviewError("");
    const token = localStorage.getItem("token");
    try {
      const res = await fetch(`/api/reviews/${id}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(reviewForm),
      });
      if (res.ok) {
        const newReview = await res.json();
        setReviews((prev) => [newReview, ...prev]);
        setReviewForm({ rating: 5, comment: "" });
        showToast("Review submitted!");
      } else {
        const data = await res.json();
        setReviewError(data.message || "Failed to submit review");
      }
    } catch (err) {
      setReviewError("Network error. Please try again.");
    } finally {
      setSubmittingReview(false);
    }
  };

  const handleAddToCart = async () => {
    if (!user) { showToast("Please sign in to add items to cart", "error"); return; }
    setAddingToCart(true);
    const token = localStorage.getItem("token");
    try {
      const res = await fetch("/api/cart", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ productId: product._id, size: selectedSize, quantity }),
      });
      if (res.ok) {
        showToast("Added to cart!");
      } else {
        showToast("Failed to add to cart", "error");
      }
    } catch (err) {
      console.error(err);
      showToast("Network error", "error");
    } finally {
      setAddingToCart(false);
    }
  };

  const handleToggleWishlist = async () => {
    if (!user) { showToast("Please sign in to use wishlist", "error"); return; }
    const token = localStorage.getItem("token");
    try {
      const res = await fetch(`/api/wishlist/${product._id}`, {
        method: "POST",
        headers: { Authorization: `Bearer ${token}` },
      });
      if (res.ok) {
        setIsWishlisted(!isWishlisted);
        showToast(isWishlisted ? "Removed from wishlist" : "Added to wishlist!");
      }
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="min-h-screen bg-bg-main">
      {/* Breadcrumb */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
        <div className="flex items-center gap-2 text-sm text-text-secondary">
          <Link to="/" className="hover:text-primary">Home</Link>
          <ChevronRight size={14} />
          <Link to="/products" className="hover:text-primary">Products</Link>
          <ChevronRight size={14} />
          <span className="text-text-primary">{product.name}</span>
        </div>
      </div>

      {/* Product Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-20">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Images */}
          <div className="space-y-4">
            <div className="aspect-[3/4] bg-bg-secondary rounded-2xl overflow-hidden">
              <img
                src={product.images[activeImage]}
                alt={product.name}
                className="w-full h-full object-cover"
              />
            </div>
            {product.images.length > 1 && (
              <div className="flex gap-3">
                {product.images.map((img, i) => (
                  <button
                    key={i}
                    onClick={() => setActiveImage(i)}
                    className={`w-20 h-20 rounded-lg overflow-hidden border-2 transition-colors ${
                      activeImage === i ? "border-primary" : "border-transparent"
                    }`}
                  >
                    <img src={img} alt="" className="w-full h-full object-cover" />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Info */}
          <div className="space-y-6">
            <div>
              <p className="text-text-light text-sm tracking-widest uppercase mb-2">{product.brand}</p>
              <h1 className="font-heading text-4xl lg:text-5xl mb-3">{product.name}</h1>
              <div className="flex items-center gap-3">
                <div className="flex items-center gap-1">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      size={16}
                      className={i < Math.floor(product.rating) ? "text-primary fill-primary" : "text-border"}
                    />
                  ))}
                </div>
                <span className="text-text-secondary text-sm">
                  {product.rating} ({product.reviews} reviews)
                </span>
              </div>
            </div>

            <p className="text-2xl font-medium">
              ${product.price[selectedSize]}
            </p>

            <p className="text-text-secondary leading-relaxed">{product.description}</p>

            <SizeSelector
              sizes={sizes}
              selectedSize={selectedSize}
              onSelect={setSelectedSize}
              prices={product.price}
            />

            {/* Quantity */}
            <div className="space-y-3">
              <span className="text-sm font-medium">Quantity</span>
              <div className="flex items-center gap-4">
                <div className="flex items-center border border-border rounded-lg">
                  <button
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    className="p-3 hover:bg-bg-secondary transition-colors"
                  >
                    <Minus size={16} />
                  </button>
                  <span className="px-6 py-3 font-medium">{quantity}</span>
                  <button
                    onClick={() => setQuantity(quantity + 1)}
                    className="p-3 hover:bg-bg-secondary transition-colors"
                  >
                    <Plus size={16} />
                  </button>
                </div>
              </div>
            </div>

            {/* Actions */}
            <div className="flex gap-4">
              <button
                onClick={handleAddToCart}
                disabled={addingToCart}
                className="flex-1 py-4 bg-text-primary text-white rounded-full font-medium flex items-center justify-center gap-2 hover:bg-primary transition-colors disabled:opacity-50"
              >
                {addingToCart ? (
                  <Loader2 size={20} className="animate-spin" />
                ) : (
                  <ShoppingBag size={20} />
                )}
                {addingToCart ? "Adding..." : "Add to Cart"}
              </button>
              <button
                onClick={handleToggleWishlist}
                className={`w-14 h-14 rounded-full border-2 flex items-center justify-center transition-all ${
                  isWishlisted
                    ? "bg-rose border-rose text-white"
                    : "border-border text-text-secondary hover:border-rose hover:text-rose"
                }`}
              >
                <Heart size={20} fill={isWishlisted ? "currentColor" : "none"} />
              </button>
            </div>

            {/* Quick Info */}
            <div className="grid grid-cols-2 gap-4 pt-4 border-t border-border">
              <div className="text-center py-3">
                <p className="text-xs text-text-light uppercase tracking-wider mb-1">Longevity</p>
                <p className="text-sm font-medium">{product.longevity}</p>
              </div>
              <div className="text-center py-3">
                <p className="text-xs text-text-light uppercase tracking-wider mb-1">Sillage</p>
                <p className="text-sm font-medium">{product.sillage}</p>
              </div>
            </div>

            {/* Accords */}
            <div>
              <p className="text-sm font-medium mb-2">Scent Family</p>
              <div className="flex flex-wrap gap-2">
                {product.accords.map((accord) => (
                  <span key={accord} className="px-3 py-1 bg-bg-secondary rounded-full text-xs text-text-secondary">
                    {accord}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Tabs Section */}
        <div className="mt-20">
          <div className="flex border-b border-border mb-8">
            {["notes", "reviews", "details"].map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`px-8 py-4 text-sm tracking-wider uppercase transition-colors ${
                  activeTab === tab
                    ? "border-b-2 border-primary text-primary font-medium"
                    : "text-text-secondary hover:text-text-primary"
                }`}
              >
                {tab}
              </button>
            ))}
          </div>

          {/* Notes Tab */}
          {activeTab === "notes" && (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {["top", "middle", "base"].map((layer) => (
                <div key={layer} className="bg-bg-secondary rounded-2xl p-8 text-center">
                  <h3 className="font-heading text-xl capitalize mb-4">{layer} Notes</h3>
                  <div className="space-y-2">
                    {product.notes[layer].map((note) => (
                      <p key={note} className="text-text-secondary">{note}</p>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Reviews Tab */}
          {activeTab === "reviews" && (
            <div className="space-y-6">
              {/* Review Form */}
              {user ? (
                <div className="bg-bg-secondary rounded-xl p-6">
                  <h3 className="font-heading text-lg mb-4">Write a Review</h3>
                  {reviewError && (
                    <p className="text-rose text-sm mb-3">{reviewError}</p>
                  )}
                  <form onSubmit={handleSubmitReview} className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium mb-2">Rating</label>
                      <div className="flex gap-1">
                        {[1, 2, 3, 4, 5].map((star) => (
                          <button
                            key={star}
                            type="button"
                            onClick={() => setReviewForm({ ...reviewForm, rating: star })}
                            className="p-1"
                          >
                            <Star
                              size={24}
                              className={star <= reviewForm.rating ? "text-primary fill-primary" : "text-border"}
                            />
                          </button>
                        ))}
                      </div>
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-2">Comment</label>
                      <textarea
                        rows={3}
                        value={reviewForm.comment}
                        onChange={(e) => setReviewForm({ ...reviewForm, comment: e.target.value })}
                        placeholder="Share your experience with this fragrance..."
                        className="w-full px-4 py-3 bg-bg-main border border-border rounded-lg focus:outline-none focus:border-primary resize-none"
                        required
                      />
                    </div>
                    <button
                      type="submit"
                      disabled={submittingReview || !reviewForm.comment.trim()}
                      className="px-6 py-3 bg-text-primary text-white rounded-full font-medium hover:bg-primary transition-colors disabled:opacity-50 flex items-center gap-2 text-sm"
                    >
                      {submittingReview && <Loader2 size={16} className="animate-spin" />}
                      {submittingReview ? "Submitting..." : "Submit Review"}
                    </button>
                  </form>
                </div>
              ) : (
                <p className="text-text-secondary text-center py-4">
                  <Link to="/login" className="text-primary hover:underline">Sign in</Link> to write a review
                </p>
              )}

              {/* Reviews List */}
              {reviews.length === 0 ? (
                <p className="text-text-secondary text-center py-10">No reviews yet. Be the first to review!</p>
              ) : (
                reviews.map((review) => (
                  <div key={review._id} className="bg-bg-secondary rounded-xl p-6">
                    <div className="flex items-center justify-between mb-3">
                      <div>
                        <p className="font-medium">{review.user?.name || "Anonymous"}</p>
                        <div className="flex items-center gap-1 mt-1">
                          {[...Array(5)].map((_, i) => (
                            <Star
                              key={i}
                              size={12}
                              className={i < review.rating ? "text-primary fill-primary" : "text-border"}
                            />
                          ))}
                        </div>
                      </div>
                      <span className="text-text-light text-sm">
                        {new Date(review.createdAt).toLocaleDateString("en-US", {
                          year: "numeric", month: "short", day: "numeric",
                        })}
                      </span>
                    </div>
                    <p className="text-text-secondary">{review.comment}</p>
                  </div>
                ))
              )}
            </div>
          )}

          {/* Details Tab */}
          {activeTab === "details" && (
            <div className="grid grid-cols-2 gap-6">
              <div className="space-y-4">
                <div className="flex justify-between py-3 border-b border-border">
                  <span className="text-text-secondary">Brand</span>
                  <span className="font-medium">{product.brand}</span>
                </div>
                <div className="flex justify-between py-3 border-b border-border">
                  <span className="text-text-secondary">Gender</span>
                  <span className="font-medium capitalize">{product.gender}</span>
                </div>
                <div className="flex justify-between py-3 border-b border-border">
                  <span className="text-text-secondary">Longevity</span>
                  <span className="font-medium">{product.longevity}</span>
                </div>
              </div>
              <div className="space-y-4">
                <div className="flex justify-between py-3 border-b border-border">
                  <span className="text-text-secondary">Sillage</span>
                  <span className="font-medium">{product.sillage}</span>
                </div>
                <div className="flex justify-between py-3 border-b border-border">
                  <span className="text-text-secondary">Season</span>
                  <span className="font-medium">{product.season.join(", ")}</span>
                </div>
                <div className="flex justify-between py-3 border-b border-border">
                  <span className="text-text-secondary">Occasion</span>
                  <span className="font-medium">{product.occasion.join(", ")}</span>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
