import { useState } from "react";
import { Link } from "react-router-dom";
import { Globe, MessageCircle, Heart, Mail, Phone, MapPin, ArrowUp } from "lucide-react";

export default function Footer() {
  const scrollToTop = () => window.scrollTo({ top: 0, behavior: "smooth" });
  const [email, setEmail] = useState("");
  const [subscribed, setSubscribed] = useState(false);
  const [subscribing, setSubscribing] = useState(false);

  const handleSubscribe = async (e) => {
    e.preventDefault();
    if (!email.trim() || subscribing) return;
    setSubscribing(true);
    try {
      const res = await fetch("/api/newsletter", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });
      if (res.ok) {
        setSubscribed(true);
        setEmail("");
      }
    } catch (err) {
      console.error(err);
    } finally {
      setSubscribing(false);
    }
  };

  return (
    <footer className="bg-text-primary text-white relative">
      {/* Decorative top border */}
      <div className="h-px bg-gradient-to-r from-transparent via-primary/50 to-transparent" />

      {/* Newsletter */}
      <div className="border-b border-white/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 lg:py-20">
          <div className="flex flex-col lg:flex-row items-center justify-between gap-8">
            <div className="text-center lg:text-left">
              <h3 className="font-heading text-2xl lg:text-3xl mb-3">Stay in Touch</h3>
              <p className="text-white/50 text-sm lg:text-base">
                Subscribe for exclusive offers, new arrivals, and insider tips.
              </p>
            </div>
            <div className="flex w-full lg:w-auto">
              {subscribed ? (
                <div className="px-6 py-4 text-sage font-medium text-sm">
                  Thanks for subscribing!
                </div>
              ) : (
                <>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Enter your email"
                    className="flex-1 lg:w-96 px-6 py-4 bg-white/5 border border-white/15 rounded-l-full text-white placeholder-white/30 focus:outline-none focus:border-primary transition-colors text-sm"
                  />
                  <button
                    onClick={handleSubscribe}
                    disabled={subscribing}
                    className="px-8 py-4 bg-primary text-white rounded-r-full hover:bg-primary-dark transition-colors font-medium text-sm tracking-wider disabled:opacity-50"
                  >
                    {subscribing ? "..." : "Subscribe"}
                  </button>
                </>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Main Footer */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 lg:py-20">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-12 lg:gap-8">
          {/* Brand */}
          <div className="lg:col-span-4">
            <h2 className="font-heading text-3xl font-bold tracking-[0.25em] mb-6">MAISON</h2>
            <p className="text-white/40 leading-relaxed mb-8 text-sm">
              Crafting exquisite fragrances that tell your unique story. Each scent is a masterpiece of elegance and sophistication.
            </p>
            <div className="flex space-x-3">
              {[
                { icon: <Globe size={16} />, label: "Website" },
                { icon: <MessageCircle size={16} />, label: "Chat" },
                { icon: <Heart size={16} />, label: "Favorites" },
              ].map((social, i) => (
                <a
                  key={i}
                  href="#"
                  className="w-10 h-10 rounded-full bg-white/5 border border-white/10 flex items-center justify-center hover:bg-primary hover:border-primary transition-all duration-300"
                  aria-label={social.label}
                >
                  {social.icon}
                </a>
              ))}
            </div>
          </div>

          {/* Quick Links */}
          <div className="lg:col-span-2">
            <h4 className="font-heading text-sm tracking-[0.2em] uppercase mb-6 text-white/70">
              Shop
            </h4>
            <ul className="space-y-3">
              {["Men's Collection", "Women's Collection", "All Products", "New Arrivals", "Best Sellers"].map((link) => (
                <li key={link}>
                  <a href="#" className="text-white/40 hover:text-primary transition-colors text-sm">
                    {link}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Help */}
          <div className="lg:col-span-3">
            <h4 className="font-heading text-sm tracking-[0.2em] uppercase mb-6 text-white/70">
              Support
            </h4>
            <ul className="space-y-3">
              {["FAQs", "Shipping & Returns", "Track Order", "Size Guide", "Privacy Policy", "Terms of Service"].map((link) => (
                <li key={link}>
                  <a href="#" className="text-white/40 hover:text-primary transition-colors text-sm">
                    {link}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div className="lg:col-span-3">
            <h4 className="font-heading text-sm tracking-[0.2em] uppercase mb-6 text-white/70">
              Contact Us
            </h4>
            <ul className="space-y-4">
              <li className="flex items-start gap-3 text-white/40 text-sm">
                <MapPin size={16} className="flex-shrink-0 mt-0.5 text-primary" />
                <span>123 Fragrance Avenue,<br />New York, NY 10001</span>
              </li>
              <li className="flex items-center gap-3 text-white/40 text-sm">
                <Phone size={16} className="flex-shrink-0 text-primary" />
                <span>+1 (555) 123-4567</span>
              </li>
              <li className="flex items-center gap-3 text-white/40 text-sm">
                <Mail size={16} className="flex-shrink-0 text-primary" />
                <span>hello@maison.com</span>
              </li>
            </ul>
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="border-t border-white/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <p className="text-white/30 text-sm">
              &copy; 2026 MAISON. All rights reserved.
            </p>
            <div className="flex items-center gap-6">
              <a href="#" className="text-white/30 hover:text-primary transition-colors text-sm">Terms</a>
              <a href="#" className="text-white/30 hover:text-primary transition-colors text-sm">Privacy</a>
              <a href="#" className="text-white/30 hover:text-primary transition-colors text-sm">Cookies</a>
              <button
                onClick={scrollToTop}
                className="w-9 h-9 rounded-full border border-white/20 flex items-center justify-center hover:bg-primary hover:border-primary transition-all duration-300"
                aria-label="Back to top"
              >
                <ArrowUp size={14} />
              </button>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
