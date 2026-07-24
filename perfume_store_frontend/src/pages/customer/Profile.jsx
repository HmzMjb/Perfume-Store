import { useState, useEffect } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { User, Package, Heart, LogOut, ChevronRight, ChevronDown, Loader2, X, CheckCircle } from "lucide-react";
import { useAuth } from "../../context/AuthContext";
import { useToast } from "../../context/ToastContext";

export default function Profile() {
  const { user, logout } = useAuth();
  const { showToast } = useToast();
  const location = useLocation();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("orders");
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [expandedOrder, setExpandedOrder] = useState(null);
  const [cancelling, setCancelling] = useState(null);
  const [showSuccess, setShowSuccess] = useState(location.state?.orderSuccess || false);

  useEffect(() => {
    if (location.state?.orderSuccess) {
      window.history.replaceState({}, "");
      const timer = setTimeout(() => setShowSuccess(false), 5000);
      return () => clearTimeout(timer);
    }
  }, [location.state]);

  useEffect(() => {
    const fetchOrders = async () => {
      const token = localStorage.getItem("token");
      if (!token) {
        setLoading(false);
        return;
      }
      try {
        const res = await fetch("/api/orders/my", {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (res.ok) {
          const data = await res.json();
          setOrders(data);
        }
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchOrders();
  }, []);

  const handleCancelOrder = async (orderId) => {
    setCancelling(orderId);
    const token = localStorage.getItem("token");
    try {
      const res = await fetch(`/api/orders/${orderId}/cancel`, {
        method: "PUT",
        headers: { Authorization: `Bearer ${token}` },
      });
      if (res.ok) {
        const updated = await res.json();
        setOrders((prev) => prev.map((o) => (o._id === orderId ? updated : o)));
        showToast("Order cancelled");
      }
    } catch (err) {
      console.error(err);
    } finally {
      setCancelling(null);
    }
  };

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  const statusColors = {
    Delivered: "text-sage bg-sage/10",
    Shipped: "text-primary bg-primary/10",
    Processing: "text-text-secondary bg-bg-tertiary",
    Cancelled: "text-rose bg-rose/10",
  };

  const formatDate = (date) => new Date(date).toLocaleDateString("en-US", {
    year: "numeric", month: "short", day: "numeric",
  });

  return (
    <div className="min-h-screen bg-bg-main">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {showSuccess && (
          <div className="mb-6 p-4 bg-sage/10 border border-sage/30 rounded-xl flex items-center gap-3">
            <CheckCircle size={20} className="text-sage flex-shrink-0" />
            <div>
              <p className="font-medium text-sage">Order placed successfully!</p>
              <p className="text-text-secondary text-sm">Thank you for your purchase.</p>
            </div>
            <button onClick={() => setShowSuccess(false)} className="ml-auto text-text-secondary hover:text-text-primary">
              <X size={16} />
            </button>
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Sidebar */}
          <div className="bg-bg-secondary rounded-2xl p-6 h-fit">
            <div className="flex items-center gap-4 mb-6 pb-6 border-b border-border">
              {user?.avatar ? (
                <img src={user.avatar} alt={user.name} className="w-16 h-16 rounded-full object-cover" />
              ) : (
                <div className="w-16 h-16 bg-primary/20 rounded-full flex items-center justify-center">
                  <User size={28} className="text-primary" />
                </div>
              )}
              <div>
                <h3 className="font-heading text-lg">{user?.name || "Guest"}</h3>
                <p className="text-text-secondary text-sm">{user?.email || ""}</p>
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
              <button
                onClick={handleLogout}
                className="flex items-center gap-3 w-full px-4 py-3 rounded-lg text-text-secondary hover:bg-rose/10 hover:text-rose transition-colors"
              >
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
                {loading ? (
                  <div className="space-y-4">
                    {[...Array(3)].map((_, i) => <div key={i} className="skeleton h-24 rounded-xl" />)}
                  </div>
                ) : orders.length === 0 ? (
                  <div className="text-center py-16 bg-bg-secondary rounded-2xl">
                    <Package size={48} className="mx-auto text-text-light mb-4" />
                    <p className="text-text-secondary text-lg mb-2">No orders yet</p>
                    <Link to="/products"
                      className="inline-block px-8 py-3 bg-text-primary text-white rounded-full font-medium hover:bg-primary transition-colors mt-4">
                      Start Shopping
                    </Link>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {orders.map((order) => (
                      <div key={order._id} className="bg-bg-secondary rounded-xl overflow-hidden">
                        <div className="p-6">
                          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                            <div>
                              <p className="font-medium">Order #{order._id.slice(-8).toUpperCase()}</p>
                              <p className="text-text-secondary text-sm">
                                {formatDate(order.createdAt)} · {order.items.length} item{order.items.length > 1 ? "s" : ""}
                              </p>
                            </div>
                            <div className="flex items-center gap-4">
                              <span className={`px-3 py-1 rounded-full text-xs font-medium ${statusColors[order.status]}`}>
                                {order.status}
                              </span>
                              <span className="font-medium">${order.total.toFixed(2)}</span>
                              <button
                                onClick={() => setExpandedOrder(expandedOrder === order._id ? null : order._id)}
                                className="text-text-light hover:text-primary transition-colors"
                              >
                                <ChevronDown
                                  size={18}
                                  className={`transition-transform ${expandedOrder === order._id ? "rotate-180" : ""}`}
                                />
                              </button>
                            </div>
                          </div>
                        </div>

                        {expandedOrder === order._id && (
                          <div className="px-6 pb-6 border-t border-border pt-4">
                            <div className="space-y-3 mb-4">
                              {order.items.map((item, i) => (
                                <div key={i} className="flex items-center gap-3">
                                  <img
                                    src={item.product?.image}
                                    alt={item.name}
                                    className="w-12 h-14 object-cover rounded-lg"
                                  />
                                  <div className="flex-1">
                                    <p className="font-medium text-sm">{item.name}</p>
                                    <p className="text-text-secondary text-xs">{item.size} x {item.quantity}</p>
                                  </div>
                                  <span className="text-sm font-medium">${(item.price * item.quantity).toFixed(2)}</span>
                                </div>
                              ))}
                            </div>
                            <div className="border-t border-border pt-3 space-y-2 text-sm">
                              <div className="flex justify-between text-text-secondary">
                                <span>Shipping Address</span>
                              </div>
                              <p className="text-text-primary">
                                {order.shippingAddress?.name}, {order.shippingAddress?.address},
                                {order.shippingAddress?.city}, {order.shippingAddress?.state} {order.shippingAddress?.zip}
                              </p>
                              <div className="flex justify-between pt-2">
                                <span className="text-text-secondary">Payment</span>
                                <span className="capitalize">{order.paymentMethod === "cod" ? "Cash on Delivery" : "Online"}</span>
                              </div>
                            </div>
                            {order.status === "Processing" && (
                              <button
                                onClick={() => handleCancelOrder(order._id)}
                                disabled={cancelling === order._id}
                                className="mt-4 px-6 py-2 border border-rose text-rose rounded-full text-sm font-medium hover:bg-rose/10 transition-colors disabled:opacity-50"
                              >
                                {cancelling === order._id ? "Cancelling..." : "Cancel Order"}
                              </button>
                            )}
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
