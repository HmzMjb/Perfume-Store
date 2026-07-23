import { useState, useEffect } from "react";
import { Plus, Edit2, Trash2, Search, Upload, X, Link as LinkIcon } from "lucide-react";
import Modal from "../../components/shared/Modal";

export default function AdminProducts() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [uploading, setUploading] = useState(false);
  const [imageMode, setImageMode] = useState("upload");
  const [formData, setFormData] = useState({
    name: "", brand: "MAISON", gender: "men", category: "men",
    description: "", image: "",
    sizes: [{ ml: "50ml", price: "" }],
    isNew: false, isFeatured: false,
  });

  const fetchProducts = async () => {
    try {
      const res = await fetch("/api/products");
      const data = await res.json();
      setProducts(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchProducts(); }, []);

  const filteredProducts = products.filter((p) =>
    p.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleEdit = (product) => {
    setEditingProduct(product);
    const sizesList = Object.entries(product.price || {}).map(([ml, price]) => ({
      ml, price: String(price),
    }));
    setFormData({
      name: product.name, brand: product.brand, gender: product.gender,
      category: product.category, description: product.description,
      image: product.image,
      sizes: sizesList.length > 0 ? sizesList : [{ ml: "50ml", price: "" }],
      isNew: product.isNew, isFeatured: product.isFeatured,
    });
    setImageMode("upload");
    setShowModal(true);
  };

  const handleAdd = () => {
    setEditingProduct(null);
    setFormData({
      name: "", brand: "MAISON", gender: "men", category: "men",
      description: "", image: "",
      sizes: [{ ml: "50ml", price: "" }],
      isNew: false, isFeatured: false,
    });
    setImageMode("upload");
    setShowModal(true);
  };

  const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setUploading(true);
    const token = localStorage.getItem("token");
    const fd = new FormData();
    fd.append("image", file);
    try {
      const res = await fetch("/api/upload", {
        method: "POST",
        headers: { Authorization: `Bearer ${token}` },
        body: fd,
      });
      const data = await res.json();
      if (res.ok) setFormData((prev) => ({ ...prev, image: data.url }));
    } catch (err) {
      console.error("Upload failed:", err);
    } finally {
      setUploading(false);
    }
  };

  const addSize = () => {
    setFormData((prev) => ({
      ...prev,
      sizes: [...prev.sizes, { ml: "", price: "" }],
    }));
  };

  const removeSize = (index) => {
    setFormData((prev) => ({
      ...prev,
      sizes: prev.sizes.filter((_, i) => i !== index),
    }));
  };

  const updateSize = (index, field, value) => {
    setFormData((prev) => {
      const newSizes = [...prev.sizes];
      newSizes[index] = { ...newSizes[index], [field]: value };
      return { ...prev, sizes: newSizes };
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem("token");
    const price = {};
    formData.sizes.forEach((s) => {
      if (s.ml && s.price) price[s.ml] = Number(s.price);
    });
    const body = {
      name: formData.name, brand: formData.brand, gender: formData.gender,
      category: formData.category, description: formData.description,
      price, image: formData.image, images: [formData.image],
      notes: { top: [], middle: [], base: [] },
      accords: [], isNew: formData.isNew, isFeatured: formData.isFeatured,
    };
    try {
      if (editingProduct) {
        await fetch(`/api/products/${editingProduct._id}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
          body: JSON.stringify(body),
        });
      } else {
        await fetch("/api/products", {
          method: "POST",
          headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
          body: JSON.stringify(body),
        });
      }
      setShowModal(false);
      fetchProducts();
    } catch (err) {
      console.error(err);
    }
  };

  const handleDelete = async (id) => {
    if (!confirm("Delete this product?")) return;
    const token = localStorage.getItem("token");
    await fetch(`/api/products/${id}`, {
      method: "DELETE",
      headers: { Authorization: `Bearer ${token}` },
    });
    fetchProducts();
  };

  return (
    <div className="min-h-screen bg-bg-main">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-8">
          <div>
            <h1 className="font-heading text-3xl">Products</h1>
            <p className="text-text-secondary mt-1">Manage your perfume inventory</p>
          </div>
          <button onClick={handleAdd}
            className="px-6 py-3 bg-text-primary text-white rounded-full font-medium hover:bg-primary transition-colors flex items-center gap-2 text-sm">
            <Plus size={18} /> Add Product
          </button>
        </div>

        <div className="mb-6">
          <div className="relative max-w-md">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-text-light" size={18} />
            <input type="text" placeholder="Search products..." value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-12 pr-4 py-3 bg-bg-secondary border border-border rounded-lg focus:outline-none focus:border-primary" />
          </div>
        </div>

        <div className="bg-bg-secondary rounded-2xl overflow-hidden">
          {loading ? (
            <div className="p-6 space-y-3">
              {[...Array(5)].map((_, i) => <div key={i} className="skeleton h-16 rounded-lg" />)}
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="text-left text-text-secondary text-sm border-b border-border">
                    <th className="p-4 font-medium">Product</th>
                    <th className="p-4 font-medium">Category</th>
                    <th className="p-4 font-medium">Sizes</th>
                    <th className="p-4 font-medium">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredProducts.map((product) => (
                    <tr key={product._id} className="border-b border-border last:border-0 hover:bg-bg-main/50 transition-colors">
                      <td className="p-4">
                        <div className="flex items-center gap-3">
                          <img src={product.image} alt={product.name} className="w-12 h-14 object-cover rounded-lg" />
                          <div>
                            <p className="font-medium">{product.name}</p>
                            <p className="text-text-light text-xs">{product.brand}</p>
                          </div>
                        </div>
                      </td>
                      <td className="p-4 text-text-secondary capitalize">{product.gender}</td>
                      <td className="p-4">
                        <div className="flex flex-wrap gap-1">
                          {Object.entries(product.price || {}).map(([ml, price]) => (
                            <span key={ml} className="px-2 py-0.5 bg-bg-main rounded text-xs text-text-secondary">
                              {ml} - ${price}
                            </span>
                          ))}
                        </div>
                      </td>
                      <td className="p-4">
                        <div className="flex items-center gap-2">
                          <button onClick={() => handleEdit(product)}
                            className="p-2 text-text-secondary hover:text-primary hover:bg-primary/10 rounded-lg transition-colors">
                            <Edit2 size={16} />
                          </button>
                          <button onClick={() => handleDelete(product._id)}
                            className="p-2 text-text-secondary hover:text-rose hover:bg-rose/10 rounded-lg transition-colors">
                            <Trash2 size={16} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        <Modal isOpen={showModal} onClose={() => setShowModal(false)} title={editingProduct ? "Edit Product" : "Add Product"}>
          <form className="space-y-4" onSubmit={handleSubmit}>
            <div>
              <label className="block text-sm font-medium mb-2">Product Name</label>
              <input type="text" value={formData.name} onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="w-full px-4 py-3 bg-bg-secondary border border-border rounded-lg focus:outline-none focus:border-primary" required />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-2">Category</label>
                <select value={formData.gender} onChange={(e) => setFormData({ ...formData, gender: e.target.value, category: e.target.value })}
                  className="w-full px-4 py-3 bg-bg-secondary border border-border rounded-lg focus:outline-none focus:border-primary">
                  <option value="men">Men</option>
                  <option value="women">Women</option>
                </select>
              </div>
            </div>

            {/* Image Section */}
            <div>
              <label className="block text-sm font-medium mb-2">Product Image</label>
              <div className="flex gap-2 mb-3">
                <button type="button" onClick={() => setImageMode("upload")}
                  className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-colors ${imageMode === "upload" ? "bg-text-primary text-white" : "bg-bg-secondary text-text-secondary border border-border"}`}>
                  <Upload size={16} /> Upload
                </button>
                <button type="button" onClick={() => setImageMode("url")}
                  className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-colors ${imageMode === "url" ? "bg-text-primary text-white" : "bg-bg-secondary text-text-secondary border border-border"}`}>
                  <LinkIcon size={16} /> URL
                </button>
              </div>

              {imageMode === "url" ? (
                <input type="text" value={formData.image} placeholder="https://example.com/image.jpg"
                  onChange={(e) => setFormData({ ...formData, image: e.target.value })}
                  className="w-full px-4 py-3 bg-bg-secondary border border-border rounded-lg focus:outline-none focus:border-primary" />
              ) : (
                <div>
                  {formData.image ? (
                    <div className="relative">
                      <img src={formData.image} alt="Preview" className="w-full h-48 object-cover rounded-lg" />
                      <button type="button" onClick={() => setFormData({ ...formData, image: "" })}
                        className="absolute top-2 right-2 p-1 bg-black/60 text-white rounded-full hover:bg-black/80">
                        <X size={16} />
                      </button>
                    </div>
                  ) : (
                    <label className="flex flex-col items-center justify-center w-full h-48 border-2 border-dashed border-border rounded-lg cursor-pointer hover:border-primary transition-colors">
                      {uploading ? (
                        <div className="text-text-secondary text-sm">Uploading...</div>
                      ) : (
                        <>
                          <Upload size={32} className="text-text-light mb-2" />
                          <span className="text-text-secondary text-sm">Click to upload image</span>
                          <span className="text-text-light text-xs mt-1">JPG, PNG, WebP (max 5MB)</span>
                        </>
                      )}
                      <input type="file" accept="image/*" onChange={handleImageUpload} className="hidden" />
                    </label>
                  )}
                </div>
              )}
            </div>

            {/* Sizes & Prices */}
            <div>
              <div className="flex items-center justify-between mb-2">
                <label className="text-sm font-medium">Sizes & Prices</label>
                <button type="button" onClick={addSize}
                  className="flex items-center gap-1 text-xs text-primary hover:text-primary-dark font-medium">
                  <Plus size={14} /> Add Size
                </button>
              </div>
              <div className="space-y-2">
                {formData.sizes.map((size, index) => (
                  <div key={index} className="flex gap-2 items-center">
                    <input type="text" placeholder="ml" value={size.ml}
                      onChange={(e) => updateSize(index, "ml", e.target.value)}
                      className="w-24 px-3 py-2 bg-bg-secondary border border-border rounded-lg text-sm focus:outline-none focus:border-primary" />
                    <input type="number" placeholder="Price ($)" value={size.price}
                      onChange={(e) => updateSize(index, "price", e.target.value)}
                      className="flex-1 px-3 py-2 bg-bg-secondary border border-border rounded-lg text-sm focus:outline-none focus:border-primary" />
                    {formData.sizes.length > 1 && (
                      <button type="button" onClick={() => removeSize(index)}
                        className="p-2 text-text-secondary hover:text-rose transition-colors">
                        <X size={16} />
                      </button>
                    )}
                  </div>
                ))}
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">Description</label>
              <textarea rows={3} value={formData.description} onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                className="w-full px-4 py-3 bg-bg-secondary border border-border rounded-lg focus:outline-none focus:border-primary resize-none" required />
            </div>

            <div className="flex gap-4">
              <label className="flex items-center gap-2">
                <input type="checkbox" checked={formData.isNew} onChange={(e) => setFormData({ ...formData, isNew: e.target.checked })} className="accent-primary" />
                <span className="text-sm">New Arrival</span>
              </label>
              <label className="flex items-center gap-2">
                <input type="checkbox" checked={formData.isFeatured} onChange={(e) => setFormData({ ...formData, isFeatured: e.target.checked })} className="accent-primary" />
                <span className="text-sm">Featured</span>
              </label>
            </div>

            <div className="flex gap-3 pt-4">
              <button type="button" onClick={() => setShowModal(false)}
                className="flex-1 py-3 border border-border rounded-full font-medium text-text-secondary hover:bg-bg-tertiary transition-colors">
                Cancel
              </button>
              <button type="submit" disabled={uploading}
                className="flex-1 py-3 bg-text-primary text-white rounded-full font-medium hover:bg-primary transition-colors disabled:opacity-50">
                {editingProduct ? "Save Changes" : "Add Product"}
              </button>
            </div>
          </form>
        </Modal>
      </div>
    </div>
  );
}
