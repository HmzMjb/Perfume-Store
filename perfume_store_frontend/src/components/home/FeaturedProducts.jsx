import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";
import ProductCard from "../shared/ProductCard";

export default function FeaturedProducts() {
  const [featured, setFeatured] = useState([]);

  useEffect(() => {
    const fetchFeatured = async () => {
      try {
        const res = await fetch("/api/products");
        const data = await res.json();
        setFeatured(data.filter((p) => p.isFeatured).slice(0, 4));
      } catch (err) {
        console.error(err);
      }
    };
    fetchFeatured();
  }, []);

  return (
    <section className="py-24 bg-bg-secondary overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-14">
          <div>
            <span className="text-primary text-xs tracking-[0.3em] uppercase font-semibold">
              Curated
            </span>
            <h2 className="font-heading text-4xl lg:text-5xl mt-3 text-text-primary">
              Featured Fragrances
            </h2>
            <div className="w-16 h-0.5 bg-primary mt-4" />
          </div>
          <Link
            to="/products"
            className="group hidden md:inline-flex items-center gap-2 text-text-secondary hover:text-primary transition-colors mt-6 md:mt-0"
          >
            <span className="text-sm tracking-wider font-medium">View All Products</span>
            <ArrowRight size={16} className="transition-transform group-hover:translate-x-1" />
          </Link>
        </div>

        {/* Products Grid */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-6">
          {featured.map((product) => (
            <ProductCard key={product._id || product.id} product={product} />
          ))}
        </div>

        {/* Mobile View All */}
        <div className="mt-10 text-center md:hidden">
          <Link
            to="/products"
            className="inline-flex items-center gap-2 px-8 py-3 border-2 border-text-primary text-text-primary rounded-full font-medium text-sm hover:bg-text-primary hover:text-white transition-all duration-300"
          >
            View All Products
            <ArrowRight size={16} />
          </Link>
        </div>
      </div>
    </section>
  );
}
