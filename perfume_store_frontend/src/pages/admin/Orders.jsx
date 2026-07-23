import { useState, useEffect } from "react";
import { Search, Eye, ChevronDown } from "lucide-react";
import Modal from "../../components/shared/Modal";

export default function AdminOrders() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [selectedOrder, setSelectedOrder] = useState(null);

  const fetchOrders = async () => {
    try {
      const token = localStorage.getItem("token");
      const query = statusFilter !== "all" ? `?status=${statusFilter}` : "";
      const res = await fetch(`/api/orders${query}`, {
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

  useEffect(() => { fetchOrders(); }, [statusFilter]);

  const filteredOrders = orders.filter((o) => {
    if (searchQuery && !o._id.toLowerCase().includes(searchQuery.toLowerCase()) &&
        !o.user?.name?.toLowerCase().includes(searchQuery.toLowerCase())) return false;
    return true;
  });

  const handleStatusUpdate = async (orderId, newStatus) => {
    const token = localStorage.getItem("token");
    await fetch(`/api/orders/${orderId}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
      body: JSON.stringify({ status: newStatus }),
    });
    fetchOrders();
  };

  const statusColors = {
    Delivered: "text-sage bg-sage/10",
    Shipped: "text-primary bg-primary/10",
    Processing: "text-text-secondary bg-bg-tertiary",
    Cancelled: "text-rose bg-rose/10",
  };

  return (
    <div className="min-h-screen bg-bg-main">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="font-heading text-3xl">Orders</h1>
          <p className="text-text-secondary mt-1">Manage customer orders</p>
        </div>

        <div className="flex flex-col sm:flex-row gap-4 mb-6">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-text-light" size={18} />
            <input
              type="text"
              placeholder="Search by order ID or customer..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-12 pr-4 py-3 bg-bg-secondary border border-border rounded-lg focus:outline-none focus:border-primary"
            />
          </div>
          <div className="relative">
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="appearance-none px-4 py-3 pr-10 bg-bg-secondary border border-border rounded-lg focus:outline-none focus:border-primary"
            >
              <option value="all">All Status</option>
              <option value="processing">Processing</option>
              <option value="shipped">Shipped</option>
              <option value="delivered">Delivered</option>
              <option value="cancelled">Cancelled</option>
            </select>
            <ChevronDown size={16} className="absolute right-3 top-1/2 -translate-y-1/2 text-text-light pointer-events-none" />
          </div>
        </div>

        <div className="bg-bg-secondary rounded-2xl overflow-hidden">
          {loading ? (
            <div className="p-6 space-y-3">
              {[...Array(5)].map((_, i) => <div key={i} className="skeleton h-12 rounded-lg" />)}
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="text-left text-text-secondary text-sm border-b border-border">
                    <th className="p-4 font-medium">Order ID</th>
                    <th className="p-4 font-medium">Customer</th>
                    <th className="p-4 font-medium">Items</th>
                    <th className="p-4 font-medium">Total</th>
                    <th className="p-4 font-medium">Status</th>
                    <th className="p-4 font-medium">Date</th>
                    <th className="p-4 font-medium">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredOrders.map((order) => (
                    <tr key={order._id} className="border-b border-border last:border-0 hover:bg-bg-main/50 transition-colors">
                      <td className="p-4 font-medium">{order._id.slice(-6).toUpperCase()}</td>
                      <td className="p-4 text-text-secondary">{order.user?.name || "N/A"}</td>
                      <td className="p-4 text-text-secondary">{order.items.length}</td>
                      <td className="p-4 font-medium">${order.total}</td>
                      <td className="p-4">
                        <span className={`px-3 py-1 rounded-full text-xs font-medium ${statusColors[order.status]}`}>
                          {order.status}
                        </span>
                      </td>
                      <td className="p-4 text-text-secondary text-sm">
                        {new Date(order.createdAt).toLocaleDateString()}
                      </td>
                      <td className="p-4">
                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => setSelectedOrder(order)}
                            className="p-2 text-text-secondary hover:text-primary hover:bg-primary/10 rounded-lg transition-colors"
                          >
                            <Eye size={16} />
                          </button>
                          <select
                            value={order.status}
                            onChange={(e) => handleStatusUpdate(order._id, e.target.value)}
                            className="appearance-none px-2 py-1 text-xs bg-bg-main border border-border rounded focus:outline-none focus:border-primary"
                          >
                            <option>Processing</option>
                            <option>Shipped</option>
                            <option>Delivered</option>
                            <option>Cancelled</option>
                          </select>
                        </div>
                      </td>
                    </tr>
                  ))}
                  {filteredOrders.length === 0 && (
                    <tr>
                      <td colSpan="7" className="p-8 text-center text-text-secondary">No orders found</td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          )}
        </div>

        <Modal isOpen={!!selectedOrder} onClose={() => setSelectedOrder(null)} title={`Order #${selectedOrder?._id.slice(-6).toUpperCase()}`}>
          {selectedOrder && (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <p className="text-text-light">Customer</p>
                  <p className="font-medium">{selectedOrder.user?.name || "N/A"}</p>
                </div>
                <div>
                  <p className="text-text-light">Email</p>
                  <p className="font-medium">{selectedOrder.user?.email || "N/A"}</p>
                </div>
                <div>
                  <p className="text-text-light">Date</p>
                  <p className="font-medium">{new Date(selectedOrder.createdAt).toLocaleDateString()}</p>
                </div>
                <div>
                  <p className="text-text-light">Status</p>
                  <span className={`px-3 py-1 rounded-full text-xs font-medium ${statusColors[selectedOrder.status]}`}>
                    {selectedOrder.status}
                  </span>
                </div>
              </div>

              <div>
                <p className="text-text-light text-sm mb-2">Shipping Address</p>
                <p className="text-sm">{selectedOrder.shippingAddress?.address}, {selectedOrder.shippingAddress?.city}</p>
              </div>

              <div>
                <p className="text-text-light text-sm mb-2">Items</p>
                <div className="space-y-2">
                  {selectedOrder.items.map((item, i) => (
                    <div key={i} className="flex justify-between text-sm bg-bg-main rounded-lg p-3">
                      <div>
                        <p className="font-medium">{item.name}</p>
                        <p className="text-text-secondary">{item.size} x {item.quantity}</p>
                      </div>
                      <span className="font-medium">${item.price * item.quantity}</span>
                    </div>
                  ))}
                </div>
                <div className="flex justify-between mt-3 pt-3 border-t border-border font-medium">
                  <span>Total</span>
                  <span>${selectedOrder.total}</span>
                </div>
              </div>
            </div>
          )}
        </Modal>
      </div>
    </div>
  );
}
