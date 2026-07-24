import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { ChevronRight, Check, Loader2, ShoppingBag } from "lucide-react";
import { useAuth } from "../../context/AuthContext";
import { useToast } from "../../context/ToastContext";

export default function Checkout() {
  const { user } = useAuth();
  const { showToast } = useToast();
  const navigate = useNavigate();
  const [cartItems, setCartItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState("cod");
  const [errors, setErrors] = useState({});
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    address: "",
    city: "",
    state: "",
    zip: "",
  });

  useEffect(() => {
    const fetchCart = async () => {
      const token = localStorage.getItem("token");
      if (!token) {
        setLoading(false);
        return;
      }
      try {
        const res = await fetch("/api/cart", {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (res.ok) {
          const data = await res.json();
          setCartItems(data);
        }
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchCart();
  }, []);

  useEffect(() => {
    if (user) {
      setFormData((prev) => ({
        ...prev,
        firstName: user.name?.split(" ")[0] || "",
        lastName: user.name?.split(" ").slice(1).join(" ") || "",
        email: user.email || "",
      }));
    }
  }, [user]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    if (errors[e.target.name]) {
      setErrors({ ...errors, [e.target.name]: "" });
    }
  };

  const subtotal = cartItems.reduce((sum, item) => {
    const price = item.product?.price?.[item.size] || 0;
    return sum + price * item.quantity;
  }, 0);
  const shipping = subtotal > 150 ? 0 : 10;
  const total = subtotal + shipping;

  const validate = () => {
    const newErrors = {};
    if (!formData.firstName.trim()) newErrors.firstName = "First name is required";
    if (!formData.lastName.trim()) newErrors.lastName = "Last name is required";
    if (!formData.email.trim()) newErrors.email = "Email is required";
    if (!formData.phone.trim()) newErrors.phone = "Phone is required";
    if (!formData.address.trim()) newErrors.address = "Address is required";
    if (!formData.city.trim()) newErrors.city = "City is required";
    if (!formData.state.trim()) newErrors.state = "State is required";
    if (!formData.zip.trim()) newErrors.zip = "ZIP code is required";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handlePlaceOrder = async () => {
    if (!validate()) return;
    if (cartItems.length === 0) return;

    setSubmitting(true);
    const token = localStorage.getItem("token");
    const items = cartItems.map((item) => ({
      product: item.product._id,
      name: item.product.name,
      size: item.size,
      quantity: item.quantity,
      price: item.product.price[item.size],
    }));

    const shippingAddress = {
      name: `${formData.firstName} ${formData.lastName}`.trim(),
      email: formData.email,
      phone: formData.phone,
      address: formData.address,
      city: formData.city,
      state: formData.state,
      zip: formData.zip,
    };

    try {
      const res = await fetch("/api/orders", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ items, shippingAddress, paymentMethod }),
      });

      if (res.ok) {
        showToast("Order placed successfully!");
        navigate("/profile", { state: { orderSuccess: true } });
      } else {
        const data = await res.json();
        setErrors({ submit: data.message || "Failed to place order" });
      }
    } catch (err) {
      setErrors({ submit: "Network error. Please try again." });
    } finally {
      setSubmitting(false);
    }
  };

  const inputClass = (field) =>
    `w-full px-4 py-3 bg-bg-main border rounded-lg focus:outline-none focus:border-primary ${
      errors[field] ? "border-rose" : "border-border"
    }`;

  return (
    <div className="min-h-screen bg-bg-main">
      <div className="bg-bg-secondary py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center gap-2 text-sm text-text-secondary">
            <Link to="/cart" className="hover:text-primary">Cart</Link>
            <ChevronRight size={14} />
            <span className="text-text-primary">Checkout</span>
          </div>
          <h1 className="font-heading text-4xl mt-4">Checkout</h1>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {loading ? (
          <div className="space-y-4">
            {[...Array(3)].map((_, i) => <div key={i} className="skeleton h-16 rounded-lg" />)}
          </div>
        ) : cartItems.length === 0 ? (
          <div className="text-center py-20">
            <ShoppingBag size={48} className="mx-auto text-text-light mb-4" />
            <p className="text-text-secondary text-lg mb-4">Your cart is empty</p>
            <Link to="/products"
              className="inline-block px-8 py-3 bg-text-primary text-white rounded-full font-medium hover:bg-primary transition-colors">
              Shop Now
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
            <div className="lg:col-span-2 space-y-8">
              {/* Shipping */}
              <div className="bg-bg-secondary rounded-2xl p-8">
                <h2 className="font-heading text-xl mb-6">Shipping Information</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium mb-2">First Name</label>
                    <input type="text" name="firstName" value={formData.firstName} onChange={handleChange}
                      className={inputClass("firstName")} />
                    {errors.firstName && <p className="text-rose text-xs mt-1">{errors.firstName}</p>}
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2">Last Name</label>
                    <input type="text" name="lastName" value={formData.lastName} onChange={handleChange}
                      className={inputClass("lastName")} />
                    {errors.lastName && <p className="text-rose text-xs mt-1">{errors.lastName}</p>}
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2">Email</label>
                    <input type="email" name="email" value={formData.email} onChange={handleChange}
                      className={inputClass("email")} />
                    {errors.email && <p className="text-rose text-xs mt-1">{errors.email}</p>}
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2">Phone</label>
                    <input type="tel" name="phone" value={formData.phone} onChange={handleChange}
                      className={inputClass("phone")} />
                    {errors.phone && <p className="text-rose text-xs mt-1">{errors.phone}</p>}
                  </div>
                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium mb-2">Address</label>
                    <input type="text" name="address" value={formData.address} onChange={handleChange}
                      className={inputClass("address")} />
                    {errors.address && <p className="text-rose text-xs mt-1">{errors.address}</p>}
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2">City</label>
                    <input type="text" name="city" value={formData.city} onChange={handleChange}
                      className={inputClass("city")} />
                    {errors.city && <p className="text-rose text-xs mt-1">{errors.city}</p>}
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2">State</label>
                    <input type="text" name="state" value={formData.state} onChange={handleChange}
                      className={inputClass("state")} />
                    {errors.state && <p className="text-rose text-xs mt-1">{errors.state}</p>}
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2">ZIP Code</label>
                    <input type="text" name="zip" value={formData.zip} onChange={handleChange}
                      className={inputClass("zip")} />
                    {errors.zip && <p className="text-rose text-xs mt-1">{errors.zip}</p>}
                  </div>
                </div>
              </div>

              {/* Payment Method */}
              <div className="bg-bg-secondary rounded-2xl p-8">
                <h2 className="font-heading text-xl mb-6">Payment Method</h2>
                <div className="space-y-3">
                  <label className={`flex items-center gap-4 p-4 rounded-xl border-2 cursor-pointer transition-colors ${
                    paymentMethod === "cod" ? "border-primary bg-primary/5" : "border-border hover:border-text-light"
                  }`}>
                    <input type="radio" name="payment" value="cod" checked={paymentMethod === "cod"}
                      onChange={(e) => setPaymentMethod(e.target.value)}
                      className="accent-primary w-4 h-4" />
                    <div>
                      <p className="font-medium">Cash on Delivery</p>
                      <p className="text-text-secondary text-sm">Pay when your order arrives</p>
                    </div>
                  </label>
                  <label className={`flex items-center gap-4 p-4 rounded-xl border-2 cursor-pointer transition-colors ${
                    paymentMethod === "online" ? "border-primary bg-primary/5" : "border-border hover:border-text-light"
                  }`}>
                    <input type="radio" name="payment" value="online" checked={paymentMethod === "online"}
                      onChange={(e) => setPaymentMethod(e.target.value)}
                      className="accent-primary w-4 h-4" />
                    <div>
                      <p className="font-medium">Online Payment</p>
                      <p className="text-text-secondary text-sm">Pay now with card (coming soon)</p>
                    </div>
                  </label>
                </div>
              </div>
            </div>

            {/* Summary */}
            <div className="bg-bg-secondary rounded-2xl p-8 h-fit sticky top-24">
              <h2 className="font-heading text-xl mb-6">Order Summary</h2>
              <div className="space-y-4 mb-6 max-h-64 overflow-y-auto">
                {cartItems.map((item) => (
                  <div key={item._id} className="flex justify-between text-sm">
                    <div className="flex items-center gap-3">
                      <img src={item.product?.image} alt={item.product?.name}
                        className="w-12 h-14 object-cover rounded-lg" />
                      <div>
                        <p className="font-medium">{item.product?.name}</p>
                        <p className="text-text-secondary">{item.size} x {item.quantity}</p>
                      </div>
                    </div>
                    <span className="font-medium whitespace-nowrap">
                      ${(item.product?.price?.[item.size] * item.quantity).toFixed(2)}
                    </span>
                  </div>
                ))}
              </div>
              <div className="border-t border-border pt-4 space-y-3">
                <div className="flex justify-between text-text-secondary text-sm">
                  <span>Subtotal</span>
                  <span>${subtotal.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-text-secondary text-sm">
                  <span>Shipping</span>
                  <span>{shipping === 0 ? "Free" : `$${shipping.toFixed(2)}`}</span>
                </div>
                {shipping > 0 && (
                  <p className="text-xs text-sage">Add ${(150 - subtotal).toFixed(2)} more for free shipping</p>
                )}
                <div className="border-t border-border pt-3 flex justify-between font-medium text-lg">
                  <span>Total</span>
                  <span>${total.toFixed(2)}</span>
                </div>
              </div>

              {errors.submit && (
                <p className="text-rose text-sm mt-4 text-center">{errors.submit}</p>
              )}

              <button
                onClick={handlePlaceOrder}
                disabled={submitting || cartItems.length === 0}
                className="w-full mt-6 py-4 bg-text-primary text-white rounded-full font-medium hover:bg-primary transition-colors flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {submitting ? (
                  <>
                    <Loader2 size={18} className="animate-spin" />
                    Processing...
                  </>
                ) : (
                  <>
                    <Check size={18} />
                    Place Order
                  </>
                )}
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
