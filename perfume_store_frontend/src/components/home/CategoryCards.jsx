import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";
import { categories } from "../../data/products";

export default function CategoryCards() {
  return (
    <section className="py-24 bg-bg-main overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-16">
          <span className="text-primary text-xs tracking-[0.3em] uppercase font-semibold">
            Browse By
          </span>
          <h2 className="font-heading text-4xl lg:text-5xl mt-3 text-text-primary">
            Our Collection
          </h2>
          <div className="w-16 h-0.5 bg-primary mx-auto mt-4" />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 lg:gap-8">
          {categories.map((category) => (
            <Link
              key={category.id}
              to={`/products?gender=${category.id}`}
              className="group relative h-[28rem] lg:h-[32rem] rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl transition-shadow duration-700"
            >
              <img
                src={category.image}
                alt={category.name}
                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                onError={(e) => {
                  e.target.style.display = "none";
                  e.target.parentElement.classList.add("bg-gradient-to-br", "from-primary/20", "to-rose/20");
                }}
              />
              {/* Gradient overlay */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-black/10" />

              {/* Content */}
              <div className="absolute bottom-0 left-0 right-0 p-8 lg:p-10">
                <span className="text-white/60 text-xs tracking-[0.2em] uppercase font-medium">
                  {category.id === "men" ? "Masculine" : "Feminine"} Collection
                </span>
                <h3 className="font-heading text-4xl lg:text-5xl text-white mt-2 mb-4">
                  {category.name}
                </h3>
                <div className="inline-flex items-center gap-3 text-white/80 group-hover:text-primary transition-colors duration-300">
                  <span className="text-sm tracking-wider font-medium">Explore Collection</span>
                  <ArrowRight
                    size={18}
                    className="transition-transform duration-300 group-hover:translate-x-2"
                  />
                </div>
                {/* Bottom border animation */}
                <div className="w-0 group-hover:w-full h-0.5 bg-primary mt-4 transition-all duration-500" />
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
