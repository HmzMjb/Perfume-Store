import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Package, DollarSign, Users, ShoppingBag, TrendingUp, ArrowUpRight } from "lucide-react";

export default function AdminDashboard() {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const token = localStorage.getItem("token");
        const res = await fetch("/api/admin/stats", {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (res.ok) {
          const data = await res.json();
          setStats(data);
        }
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchStats();
  }, []);

  const statCards = stats
    ? [
        { icon: <Package size={24} />, label: "Total Products", value: stats.totalProducts, change: "" },
        { icon: <DollarSign size={24} />, label: "Total Revenue", value: `$${stats.totalRevenue.toLocaleString()}`, change: "" },
        { icon: <Users size={24} />, label: "Total Users", value: stats.totalUsers, change: "" },
        { icon: <ShoppingBag size={24} />, label: "Total Orders", value: stats.totalOrders, change: "" },
      ]
    : [];

  const statusColors = {
    Delivered: "text-sage bg-sage/10",
    Shipped: "text-primary bg-primary/10",
    Processing: "text-text-secondary bg-bg-tertiary",
    Cancelled: "text-rose bg-rose/10",
  };

  return (
    <div className="min-h-screen bg-bg-main">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="font-heading text-3xl">Admin Dashboard</h1>
            <p className="text-text-secondary mt-1">Welcome back. Here's your store overview.</p>
          </div>
          <Link
            to="/admin/products"
            className="px-6 py-3 bg-text-primary text-white rounded-full font-medium hover:bg-primary transition-colors text-sm"
          >
            Manage Products
          </Link>
        </div>

        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="skeleton rounded-xl h-32" />
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            {statCards.map((stat, i) => (
              <div key={i} className="bg-bg-secondary rounded-xl p-6">
                <div className="flex items-center justify-between mb-4">
                  <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center text-primary">
                    {stat.icon}
                  </div>
                  <TrendingUp size={16} className="text-sage" />
                </div>
                <p className="text-text-secondary text-sm">{stat.label}</p>
                <p className="font-heading text-2xl mt-1">{stat.value}</p>
                {stat.change && <p className="text-sage text-xs mt-2">{stat.change}</p>}
              </div>
            ))}
          </div>
        )}

        {/* Recent Orders */}
        <div className="bg-bg-secondary rounded-2xl p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="font-heading text-xl">Recent Orders</h2>
            <Link to="/admin/orders" className="text-primary text-sm hover:text-primary-dark flex items-center gap-1">
              View All <ArrowUpRight size={14} />
            </Link>
          </div>

          {loading ? (
            <div className="space-y-3">
              {[...Array(5)].map((_, i) => (
                <div key={i} className="skeleton h-12 rounded-lg" />
              ))}
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="text-left text-text-secondary text-sm border-b border-border">
                    <th className="pb-3 font-medium">Order ID</th>
                    <th className="pb-3 font-medium">Customer</th>
                    <th className="pb-3 font-medium">Total</th>
                    <th className="pb-3 font-medium">Status</th>
                    <th className="pb-3 font-medium">Date</th>
                  </tr>
                </thead>
                <tbody>
                  {stats?.recentOrders.map((order) => (
                    <tr key={order._id} className="border-b border-border last:border-0">
                      <td className="py-4 font-medium">{order._id.slice(-6).toUpperCase()}</td>
                      <td className="py-4 text-text-secondary">{order.user?.name || "N/A"}</td>
                      <td className="py-4 font-medium">${order.total}</td>
                      <td className="py-4">
                        <span className={`px-3 py-1 rounded-full text-xs font-medium ${statusColors[order.status]}`}>
                          {order.status}
                        </span>
                      </td>
                      <td className="py-4 text-text-secondary text-sm">
                        {new Date(order.createdAt).toLocaleDateString()}
                      </td>
                    </tr>
                  ))}
                  {stats?.recentOrders.length === 0 && (
                    <tr>
                      <td colSpan="5" className="py-8 text-center text-text-secondary">
                        No orders yet
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
