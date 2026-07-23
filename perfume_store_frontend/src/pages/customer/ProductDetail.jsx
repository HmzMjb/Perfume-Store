import { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { Heart, ShoppingBag, Star, ChevronRight, Minus, Plus } from "lucide-react";
import SizeSelector from "../../components/shared/SizeSelector";

export default function ProductDetail() {
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [selectedSize, setSelectedSize] = useState("50ml");
  const [quantity, setQuantity] = useState(1);
  const [activeImage, setActiveImage] = useState(0);
  const [isWishlisted, setIsWishlisted] = useState(false);
  const [activeTab, setActiveTab] = useState("notes");

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
  const productReviews = [];

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
              <button className="flex-1 py-4 bg-text-primary text-white rounded-full font-medium flex items-center justify-center gap-2 hover:bg-primary transition-colors">
                <ShoppingBag size={20} />
                Add to Cart
              </button>
              <button
                onClick={() => setIsWishlisted(!isWishlisted)}
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
              {productReviews.length === 0 ? (
                <p className="text-text-secondary text-center py-10">No reviews yet. Be the first to review!</p>
              ) : (
                productReviews.map((review) => (
                  <div key={review.id} className="bg-bg-secondary rounded-xl p-6">
                    <div className="flex items-center justify-between mb-3">
                      <div>
                        <p className="font-medium">{review.user}</p>
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
                      <span className="text-text-light text-sm">{review.date}</span>
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
