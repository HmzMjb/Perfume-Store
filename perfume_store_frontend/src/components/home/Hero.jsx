import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { ArrowRight, ChevronDown } from "lucide-react";

export default function Hero() {
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    setTimeout(() => setLoaded(true), 100);
  }, []);

  return (
    <section className="relative min-h-screen flex items-center overflow-hidden bg-bg-secondary">
      {/* Background with overlay */}
      <div className="absolute inset-0">
        <img
          src="https://images.unsplash.com/photo-1541643600914-78b084683601?w=1920&h=1080&fit=crop"
          alt="Luxury Perfume"
          className="w-full h-full object-cover"
          onError={(e) => { e.target.style.display = "none"; }}
        />
        {/* Gradient overlays for luxury feel */}
        <div className="absolute inset-0 bg-gradient-to-r from-bg-main via-bg-main/80 to-transparent" />
        <div className="absolute inset-0 bg-gradient-to-t from-bg-main via-transparent to-transparent" />
      </div>

      {/* Decorative elements */}
      <div className="absolute top-20 right-10 w-48 h-48 bg-primary/5 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-20 left-10 w-64 h-64 bg-rose/5 rounded-full blur-3xl pointer-events-none" />

      {/* Content */}
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full py-20">
        <div className="max-w-2xl">
          {/* Badge */}
          <div
            className={`inline-flex items-center gap-2 px-5 py-2.5 bg-primary/10 border border-primary/20 rounded-full mb-8 transition-all duration-700 ${
              loaded ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
            }`}
          >
            <span className="w-2 h-2 bg-primary rounded-full animate-pulse" />
            <span className="text-primary text-sm font-medium tracking-wider uppercase">
              New Collection 2026
            </span>
          </div>

          {/* Heading */}
          <h1
            className={`font-heading text-5xl sm:text-6xl lg:text-7xl xl:text-8xl font-bold text-text-primary leading-[1.1] mb-6 transition-all duration-700 delay-150 ${
              loaded ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6"
            }`}
          >
            Discover Your
            <span className="block text-primary italic font-normal mt-1">
              Signature
            </span>
            Scent
          </h1>

          {/* Subtitle */}
          <p
            className={`text-text-secondary text-lg sm:text-xl leading-relaxed mb-10 max-w-lg transition-all duration-700 delay-300 ${
              loaded ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6"
            }`}
          >
            Explore our curated collection of luxury fragrances, each crafted to tell your unique story.
          </p>

          {/* CTA Buttons */}
          <div
            className={`flex flex-wrap gap-4 transition-all duration-700 delay-[450ms] ${
              loaded ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6"
            }`}
          >
            <Link
              to="/products?gender=women"
              className="group px-8 py-4 bg-text-primary text-white rounded-full font-medium hover:bg-primary transition-all duration-300 flex items-center gap-3 shadow-lg shadow-text-primary/20 hover:shadow-primary/30 hover:shadow-lg"
            >
              Shop Women
              <ArrowRight size={18} className="transition-transform group-hover:translate-x-1" />
            </Link>
            <Link
              to="/products?gender=men"
              className="group px-8 py-4 border-2 border-text-primary text-text-primary rounded-full font-medium hover:bg-text-primary hover:text-white transition-all duration-300 flex items-center gap-3"
            >
              Shop Men
              <ArrowRight size={18} className="transition-transform group-hover:translate-x-1" />
            </Link>
          </div>

          {/* Stats */}
          <div
            className={`flex gap-12 mt-14 transition-all duration-700 delay-[600ms] ${
              loaded ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6"
            }`}
          >
            <div>
              <p className="font-heading text-3xl text-text-primary">200+</p>
              <p className="text-text-secondary text-sm mt-1">Premium Brands</p>
            </div>
            <div className="w-px bg-border" />
            <div>
              <p className="font-heading text-3xl text-text-primary">50K+</p>
              <p className="text-text-secondary text-sm mt-1">Happy Customers</p>
            </div>
            <div className="w-px bg-border hidden sm:block" />
            <div className="hidden sm:block">
              <p className="font-heading text-3xl text-text-primary">4.9</p>
              <p className="text-text-secondary text-sm mt-1">Average Rating</p>
            </div>
          </div>
        </div>
      </div>

      {/* Scroll indicator */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 animate-bounce">
        <span className="text-text-light text-xs tracking-widest uppercase">Scroll</span>
        <ChevronDown size={16} className="text-text-light" />
      </div>
    </section>
  );
}
