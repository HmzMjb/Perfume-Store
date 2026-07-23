import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Leaf, Shield, Truck, RefreshCw, ArrowRight, Star } from "lucide-react";
import Hero from "../../components/home/Hero";
import FeaturedProducts from "../../components/home/FeaturedProducts";
import CategoryCards from "../../components/home/CategoryCards";
import ProductCard from "../../components/shared/ProductCard";

export default function Home() {
  const [newArrivals, setNewArrivals] = useState([]);

  useEffect(() => {
    const fetchNewArrivals = async () => {
      try {
        const res = await fetch("/api/products");
        const data = await res.json();
        setNewArrivals(data.filter((p) => p.isNew).slice(0, 4));
      } catch (err) {
        console.error(err);
      }
    };
    fetchNewArrivals();
  }, []);
  const features = [
    { icon: <Truck size={22} />, title: "Free Shipping", desc: "On orders above $150" },
    { icon: <Shield size={22} />, title: "Authentic Products", desc: "100% genuine fragrances" },
    { icon: <RefreshCw size={22} />, title: "Easy Returns", desc: "30-day return policy" },
    { icon: <Leaf size={22} />, title: "Cruelty Free", desc: "Ethically crafted" },
  ];

  return (
    <div>
      <Hero />
      <FeaturedProducts />
      <CategoryCards />

      {/* New Arrivals */}
      {newArrivals.length > 0 && (
        <section className="py-24 bg-bg-main">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-14">
              <span className="text-primary text-xs tracking-[0.3em] uppercase font-semibold">
                Just Arrived
              </span>
              <h2 className="font-heading text-4xl lg:text-5xl mt-3 text-text-primary">
                New Arrivals
              </h2>
              <div className="w-16 h-0.5 bg-primary mx-auto mt-4" />
            </div>
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-6">
              {newArrivals.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Brand Story Banner */}
      <section className="py-24 bg-bg-secondary relative overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 bg-primary/5 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-48 h-48 bg-rose/5 rounded-full blur-3xl pointer-events-none" />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 items-center">
            <div>
              <span className="text-primary text-xs tracking-[0.3em] uppercase font-semibold">
                Our Story
              </span>
              <h2 className="font-heading text-4xl lg:text-5xl mt-3 text-text-primary leading-tight">
                The Art of <span className="italic text-primary">Fragrance</span>
              </h2>
              <div className="w-16 h-0.5 bg-primary mt-4 mb-6" />
              <p className="text-text-secondary leading-relaxed mb-6">
                At MAISON, we believe that a fragrance is more than a scent — it's an extension of who you are.
                Each perfume in our collection is carefully selected from the world's finest maisons, ensuring
                an unforgettable olfactory experience.
              </p>
              <p className="text-text-secondary leading-relaxed mb-8">
                From timeless classics to bold modern compositions, our curated collection celebrates the art
                of perfumery in all its elegance.
              </p>
              <Link
                to="/products"
                className="group inline-flex items-center gap-3 px-8 py-4 bg-text-primary text-white rounded-full font-medium hover:bg-primary transition-all duration-300 shadow-lg hover:shadow-primary/20"
              >
                Discover More
                <ArrowRight size={18} className="transition-transform group-hover:translate-x-1" />
              </Link>
            </div>
            <div className="relative">
              <div className="aspect-[4/5] rounded-2xl overflow-hidden shadow-2xl">
                <img
                  src="https://images.unsplash.com/photo-1592945530025-2c9f4f05d0b5?w=800&h=1000&fit=crop"
                  alt="Perfume making"
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    e.target.style.display = "none";
                    e.target.parentElement.classList.add("bg-gradient-to-br", "from-primary/20", "to-rose/20");
                  }}
                />
              </div>
              {/* Floating card */}
              <div className="absolute -bottom-6 left-6 bg-white rounded-xl p-5 shadow-xl max-w-[200px]">
                <div className="flex items-center gap-1 mb-1">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} size={12} className="text-primary fill-primary" />
                  ))}
                </div>
                <p className="text-sm font-medium text-text-primary">Trusted by</p>
                <p className="text-2xl font-heading text-primary">50,000+</p>
                <p className="text-xs text-text-secondary">customers worldwide</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="py-20 bg-bg-main border-y border-border">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-12">
            {features.map((f, i) => (
              <div key={i} className="text-center group">
                <div className="w-16 h-16 mx-auto mb-5 bg-primary/10 rounded-2xl flex items-center justify-center text-primary group-hover:bg-primary group-hover:text-white transition-all duration-300 rotate-3 group-hover:rotate-0">
                  {f.icon}
                </div>
                <h3 className="font-heading text-lg mb-1 text-text-primary">{f.title}</h3>
                <p className="text-text-secondary text-sm">{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Banner */}
      <section className="relative py-24 bg-text-primary overflow-hidden">
        <div className="absolute inset-0 opacity-10 pointer-events-none">
          <div className="absolute top-10 left-1/4 w-64 h-64 border border-white/30 rounded-full" />
          <div className="absolute bottom-10 right-1/4 w-48 h-48 border border-white/20 rounded-full" />
        </div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative">
          <span className="text-primary text-xs tracking-[0.3em] uppercase font-semibold">
            Exclusive
          </span>
          <h2 className="font-heading text-4xl lg:text-5xl text-white mt-3 mb-5">
            Find Your Perfect Scent
          </h2>
          <p className="text-white/50 max-w-xl mx-auto mb-10 leading-relaxed">
            Take our fragrance quiz and discover the perfumes that match your personality and style.
          </p>
          <Link
            to="/products"
            className="group inline-flex items-center gap-3 px-10 py-4 bg-primary text-white rounded-full font-medium hover:bg-primary-light transition-all duration-300 shadow-lg shadow-primary/30"
          >
            Explore Now
            <ArrowRight size={18} className="transition-transform group-hover:translate-x-1" />
          </Link>
        </div>
      </section>
    </div>
  );
}
