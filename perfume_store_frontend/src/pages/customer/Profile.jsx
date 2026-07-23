import { useState } from "react";
import { Link } from "react-router-dom";
import { User, Package, Heart, LogOut, ChevronRight } from "lucide-react";

export default function Profile() {
  const [activeTab, setActiveTab] = useState("orders");

  const orders = [
    { id: "ORD-001", date: "2026-06-15", items: 2, total: 244, status: "Delivered" },
    { id: "ORD-002", date: "2026-07-01", items: 1, total: 95, status: "Shipped" },
    { id: "ORD-003", date: "2026-07-10", items: 3, total: 389, status: "Processing" },
  ];

  const statusColors = {
    Delivered: "text-sage bg-sage/10",
    Shipped: "text-primary bg-primary/10",
    Processing: "text-text-secondary bg-bg-tertiary",
  };

  return (
    <div className="min-h-screen bg-bg-main">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Sidebar */}
          <div className="bg-bg-secondary rounded-2xl p-6 h-fit">
            <div className="flex items-center gap-4 mb-6 pb-6 border-b border-border">
              <div className="w-16 h-16 bg-primary/20 rounded-full flex items-center justify-center">
                <User size={28} className="text-primary" />
              </div>
              <div>
                <h3 className="font-heading text-lg">John Doe</h3>
                <p className="text-text-secondary text-sm">john@example.com</p>
              </div>
            </div>

            <nav className="space-y-2">
              {[
                { id: "orders", icon: <Package size={18} />, label: "My Orders" },
                { id: "wishlist", icon: <Heart size={18} />, label: "Wishlist", link: "/wishlist" },
              ].map((item) =>
                item.link ? (
                  <Link
                    key={item.id}
                    to={item.link}
                    className="flex items-center gap-3 px-4 py-3 rounded-lg text-text-secondary hover:bg-bg-main hover:text-text-primary transition-colors"
                  >
                    {item.icon}
                    <span className="text-sm">{item.label}</span>
                  </Link>
                ) : (
                  <button
                    key={item.id}
                    onClick={() => setActiveTab(item.id)}
                    className={`flex items-center gap-3 w-full px-4 py-3 rounded-lg text-sm transition-colors ${
                      activeTab === item.id
                        ? "bg-primary/10 text-primary font-medium"
                        : "text-text-secondary hover:bg-bg-main hover:text-text-primary"
                    }`}
                  >
                    {item.icon}
                    <span>{item.label}</span>
                  </button>
                )
              )}
              <button className="flex items-center gap-3 w-full px-4 py-3 rounded-lg text-text-secondary hover:bg-rose/10 hover:text-rose transition-colors">
                <LogOut size={18} />
                <span className="text-sm">Sign Out</span>
              </button>
            </nav>
          </div>

          {/* Content */}
          <div className="lg:col-span-3">
            {activeTab === "orders" && (
              <div>
                <h2 className="font-heading text-2xl mb-6">Order History</h2>
                <div className="space-y-4">
                  {orders.map((order) => (
                    <div key={order.id} className="bg-bg-secondary rounded-xl p-6">
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                        <div>
                          <p className="font-medium">{order.id}</p>
                          <p className="text-text-secondary text-sm">{order.date} · {order.items} items</p>
                        </div>
                        <div className="flex items-center gap-4">
                          <span className={`px-3 py-1 rounded-full text-xs font-medium ${statusColors[order.status]}`}>
                            {order.status}
                          </span>
                          <span className="font-medium">${order.total}</span>
                          <button className="text-text-light hover:text-primary transition-colors">
                            <ChevronRight size={18} />
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
