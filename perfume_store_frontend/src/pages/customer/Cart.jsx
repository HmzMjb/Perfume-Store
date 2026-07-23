import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Trash2, Minus, Plus, ShoppingBag, ArrowLeft } from "lucide-react";

export default function Cart() {
  const [cartItems, setCartItems] = useState([]);
  const [loading, setLoading] = useState(true);

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

  useEffect(() => { fetchCart(); }, []);

  const updateQuantity = async (itemId, newQuantity) => {
    if (newQuantity < 1) return;
    const token = localStorage.getItem("token");
    try {
      const res = await fetch(`/api/cart/${itemId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
        body: JSON.stringify({ quantity: newQuantity }),
      });
      if (res.ok) {
        const data = await res.json();
        setCartItems(data);
      }
    } catch (err) {
      console.error(err);
    }
  };

  const removeItem = async (itemId) => {
    const token = localStorage.getItem("token");
    try {
      const res = await fetch(`/api/cart/${itemId}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });
      if (res.ok) {
        const data = await res.json();
        setCartItems(data);
      }
    } catch (err) {
      console.error(err);
    }
  };

  const subtotal = cartItems.reduce((sum, item) => {
    const price = item.product?.price?.[item.size] || 0;
    return sum + price * item.quantity;
  }, 0);
  const shipping = subtotal > 150 ? 0 : 10;
  const total = subtotal + shipping;

  return (
    <div className="min-h-screen bg-bg-main">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <h1 className="font-heading text-4xl mb-8">Shopping Cart</h1>

        {loading ? (
          <div className="space-y-4">
            {[...Array(3)].map((_, i) => <div key={i} className="skeleton h-32 rounded-xl" />)}
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
            <div className="lg:col-span-2 space-y-6">
              {cartItems.map((item) => (
                <div key={item._id} className="flex gap-6 bg-bg-secondary rounded-xl p-4">
                  <img
                    src={item.product?.image}
                    alt={item.product?.name}
                    className="w-24 h-32 object-cover rounded-lg"
                  />
                  <div className="flex-1">
                    <div className="flex justify-between">
                      <div>
                        <p className="text-text-light text-xs tracking-widest uppercase">{item.product?.brand}</p>
                        <h3 className="font-heading text-lg">{item.product?.name}</h3>
                        <p className="text-text-secondary text-sm">Size: {item.size}</p>
                      </div>
                      <button onClick={() => removeItem(item._id)}
                        className="text-text-light hover:text-rose transition-colors">
                        <Trash2 size={18} />
                      </button>
                    </div>
                    <div className="flex items-center justify-between mt-4">
                      <div className="flex items-center border border-border rounded-lg">
                        <button onClick={() => updateQuantity(item._id, item.quantity - 1)}
                          className="p-2 hover:bg-bg-tertiary transition-colors">
                          <Minus size={14} />
                        </button>
                        <span className="px-4 py-2 text-sm font-medium">{item.quantity}</span>
                        <button onClick={() => updateQuantity(item._id, item.quantity + 1)}
                          className="p-2 hover:bg-bg-tertiary transition-colors">
                          <Plus size={14} />
                        </button>
                      </div>
                      <p className="font-medium">${item.product?.price?.[item.size] * item.quantity}</p>
                    </div>
                  </div>
                </div>
              ))}

              <Link to="/products"
                className="inline-flex items-center gap-2 text-text-secondary hover:text-primary transition-colors">
                <ArrowLeft size={16} /> Continue Shopping
              </Link>
            </div>

            <div className="bg-bg-secondary rounded-2xl p-8 h-fit sticky top-24">
              <h2 className="font-heading text-xl mb-6">Order Summary</h2>
              <div className="space-y-4 mb-6">
                <div className="flex justify-between text-text-secondary">
                  <span>Subtotal</span>
                  <span>${subtotal}</span>
                </div>
                <div className="flex justify-between text-text-secondary">
                  <span>Shipping</span>
                  <span>{shipping === 0 ? "Free" : `$${shipping}`}</span>
                </div>
                {shipping > 0 && (
                  <p className="text-xs text-sage">Free shipping on orders above $150</p>
                )}
                <div className="border-t border-border pt-4 flex justify-between font-medium text-lg">
                  <span>Total</span>
                  <span>${total}</span>
                </div>
              </div>

              <Link to="/checkout"
                className="block w-full py-4 bg-text-primary text-white text-center rounded-full font-medium hover:bg-primary transition-colors">
                Proceed to Checkout
              </Link>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
