import { useState } from "react";
import { Link } from "react-router-dom";
import { ChevronRight, Check } from "lucide-react";

export default function Checkout() {
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

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const orderSummary = [
    { name: "Noir Elegance", size: "100ml", price: 149, qty: 1 },
    { name: "Rose Velvet", size: "50ml", price: 95, qty: 2 },
  ];

  const subtotal = orderSummary.reduce((sum, item) => sum + item.price * item.qty, 0);

  return (
    <div className="min-h-screen bg-bg-main">
      {/* Header */}
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
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
          {/* Form */}
          <div className="lg:col-span-2 space-y-8">
            {/* Shipping */}
            <div className="bg-bg-secondary rounded-2xl p-8">
              <h2 className="font-heading text-xl mb-6">Shipping Information</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-2">First Name</label>
                  <input
                    type="text"
                    name="firstName"
                    value={formData.firstName}
                    onChange={handleChange}
                    className="w-full px-4 py-3 bg-bg-main border border-border rounded-lg focus:outline-none focus:border-primary"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">Last Name</label>
                  <input
                    type="text"
                    name="lastName"
                    value={formData.lastName}
                    onChange={handleChange}
                    className="w-full px-4 py-3 bg-bg-main border border-border rounded-lg focus:outline-none focus:border-primary"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">Email</label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    className="w-full px-4 py-3 bg-bg-main border border-border rounded-lg focus:outline-none focus:border-primary"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">Phone</label>
                  <input
                    type="tel"
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                    className="w-full px-4 py-3 bg-bg-main border border-border rounded-lg focus:outline-none focus:border-primary"
                  />
                </div>
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium mb-2">Address</label>
                  <input
                    type="text"
                    name="address"
                    value={formData.address}
                    onChange={handleChange}
                    className="w-full px-4 py-3 bg-bg-main border border-border rounded-lg focus:outline-none focus:border-primary"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">City</label>
                  <input
                    type="text"
                    name="city"
                    value={formData.city}
                    onChange={handleChange}
                    className="w-full px-4 py-3 bg-bg-main border border-border rounded-lg focus:outline-none focus:border-primary"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">State</label>
                  <input
                    type="text"
                    name="state"
                    value={formData.state}
                    onChange={handleChange}
                    className="w-full px-4 py-3 bg-bg-main border border-border rounded-lg focus:outline-none focus:border-primary"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">ZIP Code</label>
                  <input
                    type="text"
                    name="zip"
                    value={formData.zip}
                    onChange={handleChange}
                    className="w-full px-4 py-3 bg-bg-main border border-border rounded-lg focus:outline-none focus:border-primary"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Summary */}
          <div className="bg-bg-secondary rounded-2xl p-8 h-fit sticky top-24">
            <h2 className="font-heading text-xl mb-6">Order Summary</h2>
            <div className="space-y-4 mb-6">
              {orderSummary.map((item, i) => (
                <div key={i} className="flex justify-between text-sm">
                  <div>
                    <p className="font-medium">{item.name}</p>
                    <p className="text-text-secondary">{item.size} x {item.qty}</p>
                  </div>
                  <span>${item.price * item.qty}</span>
                </div>
              ))}
            </div>
            <div className="border-t border-border pt-4 space-y-3">
              <div className="flex justify-between text-text-secondary text-sm">
                <span>Subtotal</span>
                <span>${subtotal}</span>
              </div>
              <div className="flex justify-between text-text-secondary text-sm">
                <span>Shipping</span>
                <span>Free</span>
              </div>
              <div className="border-t border-border pt-3 flex justify-between font-medium text-lg">
                <span>Total</span>
                <span>${subtotal}</span>
              </div>
            </div>

            <button className="w-full mt-6 py-4 bg-text-primary text-white rounded-full font-medium hover:bg-primary transition-colors flex items-center justify-center gap-2">
              <Check size={18} />
              Place Order
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
