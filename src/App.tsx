import { useState, useEffect } from "react";
import { PRODUCTS } from "./data/products";
import { Product, CartItem } from "./types";
import ProductCard from "./components/ProductCard";
import ProductModal from "./components/ProductModal";
import CartDrawer from "./components/CartDrawer";
import CheckoutModal from "./components/CheckoutModal";
import UserAccountModal from "./components/UserAccountModal";
import BrandLogo from "./components/BrandLogo";
import AdminPanel from "./components/AdminPanel";

import {
  Search,
  Heart,
  ShoppingBag,
  User,
  X,
  Phone,
  Check,
  Sparkles,
  ChevronRight,
  ArrowRight,
  Gift,
  Plus,
  Send,
  MessageSquare,
  ShieldCheck,
  Instagram,
  Facebook,
  Twitter,
  Menu,
} from "lucide-react";

export default function App() {
  // --- Cart, Wishlist & UI States ---
  const [cart, setCart] = useState<CartItem[]>(() => {
    try {
      const saved = localStorage.getItem("bc_cart");
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  const [wishlist, setWishlist] = useState<string[]>(() => {
    try {
      const saved = localStorage.getItem("bc_wishlist");
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  const [searchQuery, setSearchQuery] = useState("");
  const [searchOpen, setSearchOpen] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState("ALL");
  const [quickViewProduct, setQuickViewProduct] = useState<Product | null>(null);
  
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);
  const [isAccountOpen, setIsAccountOpen] = useState(false);
  
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [announcementClosed, setAnnouncementClosed] = useState(false);
  const [emailSubscription, setEmailSubscription] = useState("");
  const [emailSubscribedStatus, setEmailSubscribedStatus] = useState(false);

  // --- Cosmic Admin States & Dynamic Products Catalog ---
  const [isAdminOpen, setIsAdminOpen] = useState(false);
  const [products, setProducts] = useState<Product[]>(() => {
    try {
      const saved = localStorage.getItem("bc_products");
      return saved ? JSON.parse(saved) : PRODUCTS;
    } catch {
      return PRODUCTS;
    }
  });

  const [heroImage, setHeroImage] = useState<string>(() => {
    return localStorage.getItem("bc_hero_image") || "/src/assets/images/man_purple_tshirt_1780198411762.png";
  });

  const [lookbookLeftImage, setLookbookLeftImage] = useState<string>(() => {
    return localStorage.getItem("bc_lookbook_left_image") || "/src/assets/images/man_coffee_sweatshirt_1780198396172.png";
  });

  const [lookbookRightTopImage, setLookbookRightTopImage] = useState<string>(() => {
    return localStorage.getItem("bc_lookbook_right_top_image") || "/src/assets/images/woman_bedroom_tshirt_1780198442699.png";
  });

  const [lookbookRightBottomLeftImage, setLookbookRightBottomLeftImage] = useState<string>(() => {
    return localStorage.getItem("bc_lookbook_right_btm_left_image") || "/src/assets/images/ribbed_tshirt_close_1780198427615.png";
  });

  const [lookbookRightBottomRightImage, setLookbookRightBottomRightImage] = useState<string>(() => {
    return localStorage.getItem("bc_lookbook_right_btm_right_image") || "/src/assets/images/black_tshirt_flat_1780198458828.png";
  });

  const [aboutSectionImage, setAboutSectionImage] = useState<string>(() => {
    return localStorage.getItem("bc_about_section_image") || "/src/assets/images/black_tshirt_tag_1780198474031.png";
  });

  // Sync to local storage
  useEffect(() => {
    localStorage.setItem("bc_cart", JSON.stringify(cart));
  }, [cart]);

  useEffect(() => {
    localStorage.setItem("bc_wishlist", JSON.stringify(wishlist));
  }, [wishlist]);

  useEffect(() => {
    localStorage.setItem("bc_products", JSON.stringify(products));
  }, [products]);

  useEffect(() => {
    localStorage.setItem("bc_hero_image", heroImage);
  }, [heroImage]);

  useEffect(() => {
    localStorage.setItem("bc_lookbook_left_image", lookbookLeftImage);
  }, [lookbookLeftImage]);

  useEffect(() => {
    localStorage.setItem("bc_lookbook_right_top_image", lookbookRightTopImage);
  }, [lookbookRightTopImage]);

  useEffect(() => {
    localStorage.setItem("bc_lookbook_right_btm_left_image", lookbookRightBottomLeftImage);
  }, [lookbookRightBottomLeftImage]);

  useEffect(() => {
    localStorage.setItem("bc_lookbook_right_btm_right_image", lookbookRightBottomRightImage);
  }, [lookbookRightBottomRightImage]);

  useEffect(() => {
    localStorage.setItem("bc_about_section_image", aboutSectionImage);
  }, [aboutSectionImage]);

  // --- Cart Operations ---
  const handleAddToCart = (product: Product, size: string, color: any, qty: number) => {
    const compositeId = `${product.id}_${size}_${color.name}`;
    setCart((prevCart) => {
      const idx = prevCart.findIndex((item) => item.id === compositeId);
      if (idx > -1) {
        const updated = [...prevCart];
        updated[idx] = {
          ...updated[idx],
          quantity: updated[idx].quantity + qty,
        };
        return updated;
      } else {
        return [
          ...prevCart,
          {
            id: compositeId,
            product,
            selectedSize: size,
            selectedColor: color,
            quantity: qty,
          },
        ];
      }
    });
    // Trigger slide-out draw showing added visual feedback
    setIsCartOpen(true);
  };

  const handleAddToCartDirect = (product: Product) => {
    // Pick the default first size and color straight-away
    const size = product.sizes[0] || "One Size";
    const color = product.colors[0];
    handleAddToCart(product, size, color, 1);
  };

  const handleUpdateQty = (cartItemId: string, newQty: number) => {
    if (newQty < 1) {
      handleRemoveItem(cartItemId);
    } else {
      setCart((prev) =>
        prev.map((item) => (item.id === cartItemId ? { ...item, quantity: newQty } : item))
      );
    }
  };

  const handleRemoveItem = (cartItemId: string) => {
    setCart((prev) => prev.filter((item) => item.id !== cartItemId));
  };

  const handleOrderSuccess = () => {
    setCart([]); // Reset shopping cart when checkout registers successfully
  };

  // --- Wishlist togglers ---
  const toggleWishlist = (productId: string) => {
    setWishlist((prev) => {
      if (prev.includes(productId)) {
        return prev.filter((id) => id !== productId);
      } else {
        return [...prev, productId];
      }
    });
  };

  // --- Filtering & Sorting lists ---
  const filteredProducts = products.filter((product) => {
    const matchesCategory =
      selectedCategory === "ALL" ||
      product.category.toUpperCase() === selectedCategory.toUpperCase();
    const matchesSearch =
      product.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      product.category.toLowerCase().includes(searchQuery.toLowerCase()) ||
      product.description.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const cartItemsCount = cart.reduce((sums, item) => sums + item.quantity, 0);

  return (
    <div className="min-h-screen bg-[#f8f7f4] text-[#1a1a1a] font-sans antialiased overflow-x-hidden selection:bg-[#D4AF37]/30 selection:text-black">
      
      {/* 1. TOP ANNOUNCEMENT BAR */}
      {!announcementClosed && (
        <div id="announcement-bar" className="bg-[#1a1a1a] text-[#f8f7f4] py-3 px-4 text-center text-[10px] font-black uppercase tracking-widest relative flex items-center justify-center gap-2 animate-slide-down border-b-2 border-[#1a1a1a] font-mono">
          <span className="inline-block animate-ping w-2.5 h-2.5 rounded-full bg-[#D4AF37] shrink-0" />
          <span>🚀 Checkout Direct on WhatsApp: +27 61 610 0885 • We package & ship in minutes!</span>
          <button
            onClick={() => setAnnouncementClosed(true)}
            className="absolute right-3 top-1/2 -translate-y-1/2 p-1.5 text-gray-400 hover:text-white rounded-none cursor-pointer"
            title="Dismiss"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* 2. NAVIGATION HEADER */}
      <header id="global-header" className="sticky top-0 z-40 bg-white border-b-4 border-[#1a1a1a] transition-all duration-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
          
          {/* Logo Brand Title */}
          <div className="flex items-center gap-2">
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 -ml-2 text-[#1a1a1a] hover:text-[#D4AF37] lg:hidden rounded-none cursor-pointer"
              title="Menu"
            >
              <Menu className="w-6 h-6" />
            </button>
            
            <a href="#" className="flex items-center gap-3 text-left group">
              <BrandLogo iconOnly={true} size="md" className="text-[#1a1a1a] group-hover:text-[#D4AF37] transition-colors" />
              <div className="flex flex-col">
                <span className="font-black text-lg sm:text-xl tracking-[0.18em] text-[#1a1a1a] group-hover:text-[#D4AF37] transition-colors uppercase font-sans">
                  Badney Cotton
                </span>
                <span className="text-[9px] tracking-[0.35em] font-black text-gray-400 group-hover:text-gray-500 uppercase font-mono">
                  Johannesburg, ZA
                </span>
              </div>
            </a>
          </div>

          {/* Desktop Navigation Links */}
          <nav className="hidden lg:flex items-center gap-8 text-[11px] font-black uppercase tracking-widest text-[#1a1a1a]">
            <a href="#" className="text-[#1a1a1a] border-b-2 border-[#1a1a1a] pb-1">Home</a>
            <a href="#quick-shop" className="hover:border-b-2 hover:border-[#1a1a1a] pb-1 transition-all">Shop</a>
            <a href="#lookbook-section" className="hover:border-b-2 hover:border-[#1a1a1a] pb-1 transition-all">Lookbook</a>
            <a href="#about-section" className="hover:border-b-2 hover:border-[#1a1a1a] pb-1 transition-all">Our Ethos</a>
            <a href="#footer-section" className="hover:border-b-2 hover:border-[#1a1a1a] pb-1 transition-all">Contact Us</a>
          </nav>

          {/* Header Action Icons */}
          <div className="flex items-center gap-2.5 sm:gap-4">
            
            {/* Local Search input trigger */}
            <div className="relative">
              {searchOpen && (
                <div className="absolute right-0 top-1/2 -translate-y-1/2 bg-white border-2 border-[#1a1a1a] rounded-none p-1.5 flex items-center gap-2 w-[220px] sm:w-[280px] animate-fade-in z-20">
                  <Search className="w-4 h-4 text-[#1a1a1a] shrink-0 ml-1.5" />
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Search brand products..."
                    className="w-full text-xs font-bold bg-transparent outline-hidden border-none py-1 text-[#1a1a1a]"
                    autoFocus
                  />
                  <button
                    onClick={() => {
                      setSearchQuery("");
                      setSearchOpen(false);
                    }}
                    className="p-1 hover:bg-gray-100 rounded text-gray-400"
                  >
                    <X className="w-3.5 h-3.5" />
                  </button>
                </div>
              )}
              
              <button
                onClick={() => setSearchOpen(!searchOpen)}
                className={`p-2 rounded-none cursor-pointer hover:bg-gray-100 text-[#1a1a1a] hover:text-[#D4AF37] transition-all ${searchOpen ? "opacity-0" : "opacity-100"}`}
                title="Search Store"
              >
                <Search className="w-5 h-5" />
              </button>
            </div>

            {/* Profile Avatar icon */}
            <button 
              onClick={() => setIsAccountOpen(true)}
              className="hidden sm:inline-flex p-2 rounded-none hover:bg-gray-100 text-[#1a1a1a] hover:text-[#D4AF37] transition-colors cursor-pointer" 
              title="My Account"
            >
              <User className="w-5 h-5" />
            </button>

            {/* Wishlist count icon (interactive) */}
            <div className="relative">
              <button
                onClick={() => {
                  if (wishlist.length > 0) {
                    alert(`Your marked wishlist items count: ${wishlist.length}. Click details to see sizing details!`);
                  } else {
                    alert("Your wishlist is currently empty. Tap the heart icons on items to bookmark favorites!");
                  }
                }}
                className="p-2 rounded-none hover:bg-gray-100 text-[#1a1a1a] hover:text-red-500 transition-colors relative"
                title="Wishlist"
              >
                <Heart className={`w-5 h-5 ${wishlist.length > 0 ? "fill-red-500 text-red-500" : ""}`} />
                {wishlist.length > 0 && (
                  <span className="absolute top-1 right-1 w-2.5 h-2.5 bg-red-500 rounded-none border-2 border-white" />
                )}
              </button>
            </div>

            {/* Shopping cart button with real reactive quantity badge */}
            <button
              onClick={() => setIsCartOpen(true)}
              className="p-2 bg-white hover:bg-[#1a1a1a] hover:text-white border-2 border-[#1a1a1a] rounded-none text-[#1a1a1a] transition-all relative flex items-center justify-center h-11 w-11 shadow-[2px_2px_0px_0px_rgba(26,26,26,1)] cursor-pointer"
              id="header-cart-icon"
              title="Shopping Bag"
            >
              <ShoppingBag className="w-5 h-5" />
              {cartItemsCount > 0 && (
                <span className="absolute -top-1.5 -right-1.5 bg-[#D4AF37] border border-[#1a1a1a] text-white text-[9px] font-black font-mono h-5 min-w-5 px-1 rounded-none flex items-center justify-center">
                  {cartItemsCount}
                </span>
              )}
            </button>

            {/* Direct Admin Control toggle */}
            <button
              onClick={() => setIsAdminOpen(true)}
              className="p-2 bg-black hover:bg-[#D4AF37] text-white border-2 border-[#1a1a1a] rounded-none transition-all relative flex items-center justify-center h-11 px-3.5 text-[10px] font-black uppercase tracking-widest font-mono shadow-[2px_2px_0px_0px_rgba(212,175,55,1)] cursor-pointer hover:shadow-none"
              title="Catalog Management Controls"
            >
              HQ Admin
            </button>
          </div>
        </div>

        {/* Mobile Navigation Sidebar overlay */}
        {mobileMenuOpen && (
          <div className="lg:hidden absolute top-20 left-0 w-full bg-white border-b-2 border-[#1a1a1a] shadow-xl overflow-hidden py-5 px-6 space-y-4 animate-slide-down flex flex-col z-30">
            <a
              href="#"
              onClick={() => setMobileMenuOpen(false)}
              className="text-xs font-black uppercase tracking-wider text-[#1a1a1a] py-1.5 border-b border-gray-100"
            >
              Home
            </a>
            <a
              href="#quick-shop"
              onClick={() => setMobileMenuOpen(false)}
              className="text-xs font-black uppercase tracking-wider text-[#1a1a1a] py-1.5 border-b border-gray-100 hover:text-[#D4AF37]"
            >
              Shop Collection
            </a>
            <a
              href="#lookbook-section"
              onClick={() => setMobileMenuOpen(false)}
              className="text-xs font-black uppercase tracking-wider text-[#1a1a1a] py-1.5 border-b border-gray-100 hover:text-[#D4AF37]"
            >
              Lookbook
            </a>
            <a
              href="#about-section"
              onClick={() => setMobileMenuOpen(false)}
              className="text-xs font-black uppercase tracking-wider text-[#1a1a1a] py-1.5 border-b border-gray-100 hover:text-[#D4AF37]"
            >
              Our Ethos
            </a>
            <a
              href="#footer-section"
              onClick={() => setMobileMenuOpen(false)}
              className="text-xs font-black uppercase tracking-wider text-[#1a1a1a] py-1.5 border-b border-gray-100 hover:text-[#D4AF37]"
            >
              Contact Support
            </a>
            <button
              onClick={() => {
                setMobileMenuOpen(false);
                setIsAccountOpen(true);
              }}
              className="text-xs font-black uppercase tracking-wider text-left py-1.5 border-b border-gray-100 hover:text-[#D4AF37] flex items-center gap-2 text-[#1a1a1a] cursor-pointer"
            >
              My Account & Orders
            </button>
            <button
              onClick={() => {
                setMobileMenuOpen(false);
                setIsAdminOpen(true);
              }}
              className="text-xs font-black uppercase tracking-wider text-left py-2 text-[#D4AF37] hover:text-[#1a1a1a] flex items-center gap-2"
            >
              <span className="w-2 h-2 bg-[#D4AF37] rounded-none inline-block animate-ping" />
              HQ Catalog Admin Console
            </button>
          </div>
        )}
      </header>

      {/* 3. HERO SLIDER CAMPAIGN (Mirrors Reference layout with Bold Typography style) */}
      <section className="relative w-full bg-stone-900 border-b-4 border-[#1a1a1a] overflow-hidden min-h-[480px] md:min-h-[580px] flex items-center">
        
        {/* Background Generated Image */}
        <div className="absolute inset-0 select-none">
          <img
            src={heroImage}
            alt="Badney Cotton Urban Edge Campaign"
            referrerPolicy="no-referrer"
            className="w-full h-full object-cover object-center opacity-85 scale-102 filter brightness-95 contrast-105"
          />
        </div>

        {/* Cover gradient mask */}
        <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-stone-950/40 to-transparent" />

        {/* Campaign content layout aligned precisely to the left */}
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full py-16 text-white z-10">
          <div className="max-w-xl text-left space-y-4 md:space-y-6">
            
            <div className="inline-flex items-center gap-1.5 py-1.5 px-3.5 bg-[#1a1a1a] border-2 border-white rounded-none">
              <Sparkles className="w-3.5 h-3.5 text-[#D4AF37]" />
              <span className="text-[10px] sm:text-xs font-black uppercase tracking-widest text-[#D4AF37] font-mono">
                Urban Edge Campaign
              </span>
            </div>

            <h1 className="text-4xl sm:text-5xl md:text-6.5xl font-black tracking-tight leading-none uppercase font-sans">
              Basics <br />
              <span className="text-white font-black bg-[#D4AF37] text-[#1a1a1a] px-3 border-2 border-[#1a1a1a] inline-block mt-1">for the</span> <br />
              Modern Citizen
            </h1>

            <p className="text-xs sm:text-sm text-gray-200 leading-relaxed font-bold font-sans max-w-lg">
              Engineered combed-cotton basics for lifestyle wear under our South African sun, balancing relaxed modernism and heavy collegiate structures. Produced ethically with 100% Ring-Spun heavyweight yarn.
            </p>

            <div className="pt-2 flex flex-wrap gap-4">
              <a
                href="#quick-shop"
                className="px-6 py-4 bg-[#D4AF37] text-white border-2 border-[#1a1a1a] text-xs font-black uppercase tracking-widest shadow-[4px_4px_0px_0px_rgba(26,26,26,1)] hover:shadow-none hover:translate-x-0.5 hover:translate-y-0.5 transition-all flex items-center gap-2 group cursor-pointer rounded-none"
              >
                Discover Collection
                <ArrowRight className="w-4 h-4 transition-transform duration-250 group-hover:translate-x-1" />
              </a>
              <a
                href="#about-section"
                className="px-6 py-4 bg-white/10 backdrop-blur-md hover:bg-white/20 text-white text-xs font-black uppercase tracking-widest rounded-none border-2 border-white transition-all cursor-pointer"
              >
                Our Heritage
              </a>
            </div>
          </div>
        </div>

        {/* Mini tabs indicators */}
        <div className="absolute bottom-6 right-8 flex gap-2 font-mono">
          <span className="w-8 h-2 bg-[#D4AF37] inline-block border border-black" />
          <span className="w-2.5 h-2 bg-white/30 inline-block border border-black" />
          <span className="w-2.5 h-2 bg-white/30 inline-block border border-black" />
        </div>
      </section>

      {/* 4. VALUE PROPOSITION RIBBON */}
      <section className="bg-[#e5e3de] border-b-4 border-[#1a1a1a] py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-center md:text-left">
            
            <div className="flex flex-col sm:flex-row items-center gap-3 p-4 bg-white border-2 border-[#1a1a1a] rounded-none hover:shadow-[4px_4px_0px_0px_rgba(26,26,26,1)] transition-all">
              <div className="w-10 h-10 rounded-none border-2 border-[#1a1a1a] bg-[#e5e3de] flex items-center justify-center shrink-0">
                <svg className="w-5 h-5 text-[#1a1a1a]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"/>
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"/>
                </svg>
              </div>
              <div>
                <h4 className="text-xs font-black uppercase text-gray-900 tracking-wider">Fast Courier Delivery SPEED</h4>
                <p className="text-[11px] text-[#1a1a1a]/75 mt-0.5 font-bold">Dispatched from our Johannesburg fulfillment center hub.</p>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row items-center gap-3 p-4 bg-white border-2 border-[#1a1a1a] rounded-none hover:shadow-[4px_4px_0px_0px_rgba(26,26,26,1)] transition-all">
              <div className="w-10 h-10 rounded-none border-2 border-[#1a1a1a] bg-[#D4AF37] flex items-center justify-center shrink-0">
                <MessageSquare className="w-5 h-5 text-white" />
              </div>
              <div>
                <h4 className="text-xs font-black uppercase text-gray-900 tracking-wider">Secure WhatsApp Receipts</h4>
                <p className="text-[11px] text-[#1a1a1a]/75 mt-0.5 font-bold">Instantly opens a secure chat session with our direct line.</p>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row items-center gap-3 p-4 bg-white border-2 border-[#1a1a1a] rounded-none hover:shadow-[4px_4px_0px_0px_rgba(26,26,26,1)] transition-all">
              <div className="w-10 h-10 rounded-none border-2 border-[#1a1a1a] bg-[#e5e3de] flex items-center justify-center shrink-0">
                <Gift className="w-5 h-5 text-[#1a1a1a]" />
              </div>
              <div>
                <h4 className="text-xs font-black uppercase text-gray-900 tracking-wider">Exclusive Combed Weaves</h4>
                <p className="text-[11px] text-[#1a1a1a]/75 mt-0.5 font-bold">Finest heavyweight yarns for structured, breathable fits.</p>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* 5. MAIN COMMERCIAL STORE SECTION */}
      <section id="quick-shop" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-20 scroll-mt-20">
        
        {/* Title matches ref */}
        <div className="text-center space-y-3 mb-10">
          <h2 className="text-2xl sm:text-4xl font-black text-gray-950 uppercase tracking-tight font-sans">
            New Arrivals
          </h2>
          <div className="w-16 h-1.5 bg-[#1a1a1a] mx-auto rounded-none" />
        </div>

        {/* Tab Filters aligned centered - Bold Typography style */}
        <div className="flex flex-wrap justify-center border-4 border-[#1a1a1a] bg-white divide-y-2 sm:divide-y-0 sm:divide-x-2 divide-[#1a1a1a] max-w-2xl mx-auto rounded-none overflow-hidden mb-12 shadow-[4px_4px_0px_0px_rgba(26,26,26,1)]">
          {["ALL", "MEN", "WOMEN", "SHOES", "BAGS", "ACCESSORIES"].map((cat) => {
            const isActive = selectedCategory.toUpperCase() === cat.toUpperCase();
            return (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`flex-grow py-3 px-5 text-xs font-black uppercase tracking-widest cursor-pointer transition-all ${
                  isActive
                    ? "bg-[#1a1a1a] text-white"
                    : "bg-white text-[#1a1a1a] hover:bg-gray-100"
                }`}
              >
                {cat}
              </button>
            );
          })}
        </div>

        {/* Active Filters list banner */}
        {searchQuery && (
          <div className="mb-6 flex items-center justify-between p-4 bg-white border-2 border-[#1a1a1a] rounded-none text-xs text-[#1a1a1a] font-bold uppercase tracking-wider animate-fade-in shadow-[3px_3px_0px_0px_rgba(26,26,26,1)]">
            <span>
              Found <strong>{filteredProducts.length}</strong> items matching search: "{searchQuery}"
            </span>
            <button
              onClick={() => setSearchQuery("")}
              className="text-xs font-black underline cursor-pointer hover:text-[#D4AF37]"
            >
              Clear Search Filter
            </button>
          </div>
        )}

        {/* Product Grid */}
        {filteredProducts.length === 0 ? (
          <div className="text-center py-20 bg-white border-4 border-[#1a1a1a] rounded-none max-w-xl mx-auto flex flex-col items-center p-6 shadow-[5px_5px_0px_0px_rgba(26,26,26,1)]">
            <h3 className="text-lg font-black uppercase text-gray-850 mb-1">No products found</h3>
            <p className="text-xs text-[#1a1a1a]/60 font-bold mb-6 uppercase tracking-wider">
              There are currently no items matching your selection.
            </p>
            <button
              onClick={() => {
                setSelectedCategory("ALL");
                setSearchQuery("");
              }}
              className="px-6 py-3 bg-[#1a1a1a] text-white border-2 border-[#1a1a1a] rounded-none text-xs font-black uppercase tracking-widest hover:bg-[#1a1a1a]/80 cursor-pointer"
            >
              Reset Filters
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8 animate-fade-in">
            {filteredProducts.map((p) => (
              <ProductCard
                key={p.id}
                product={p}
                onOpenQuickView={(product) => setQuickViewProduct(product)}
                onAddToCartDirect={handleAddToCartDirect}
              />
            ))}
          </div>
        )}
      </section>

      {/* 6. LOOKBOOK CAMPAIGN GRIDS */}
      <section id="lookbook-section" className="bg-[#e5e3de] border-t-4 border-b-4 border-[#1a1a1a] py-16 sm:py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch">
            
            {/* Split Left Column - Oversized Block */}
            <div className="lg:col-span-5 relative bg-[#1a1a1a] text-white border-4 border-[#1a1a1a] rounded-none overflow-hidden min-h-[460px] flex flex-col justify-end p-8 group shadow-[8px_8px_0px_0px_rgba(26,26,26,1)]">
              
              {/* Background white hoodie image */}
              <div className="absolute inset-0 select-none">
                <img
                  src={lookbookLeftImage}
                  alt="Badney Collegiate Monogram"
                  referrerPolicy="no-referrer"
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-102 opacity-75 filter brightness-95 contrast-105"
                />
              </div>

              {/* Cover gradient mask */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent" />

              <div className="relative z-10 space-y-4 text-left">
                <span className="inline-block bg-[#1a1a1a] border border-white text-[9px] font-black uppercase tracking-widest text-[#D4AF37] px-2.5 py-1 font-mono rounded-none">
                  COLLEGIATE CREST
                </span>
                
                <h3 className="text-3xl sm:text-4xl font-black tracking-tight uppercase leading-none font-sans max-w-xs">
                  Collegiate BD Crest
                </h3>

                <p className="text-xs text-gray-200 leading-relaxed font-bold font-sans max-w-sm">
                  Experience ultimate heavy-combed softness through our classic monogram crest sweaters, featuring premium dropped shoulder lines and comfortable ribbed collars.
                </p>

                <div className="pt-2">
                  <a
                    href="#quick-shop"
                    onClick={() => setSelectedCategory("MEN")}
                    className="inline-flex items-center gap-2 bg-[#D4AF37] text-white border-2 border-[#1a1a1a] px-5 py-3.5 text-xs font-black uppercase tracking-widest shadow-[3px_3px_0px_0px_rgba(26,26,26,1)] hover:shadow-none hover:translate-x-0.5 hover:translate-y-0.5 transition-all cursor-pointer rounded-none"
                  >
                    Explore Sweaters
                    <ChevronRight className="w-4 h-4" />
                  </a>
                </div>
              </div>
            </div>

            {/* Split Right Columns */}
            <div className="lg:col-span-7 flex flex-col gap-8">
              
              {/* Top Wide Banner */}
              <div className="relative bg-[#1a1a1a] text-white border-4 border-[#1a1a1a] rounded-none overflow-hidden min-h-[220px] sm:min-h-[240px] flex items-center p-8 sm:p-10 group shadow-[8px_8px_0px_0px_rgba(26,26,26,1)] text-left">
                
                {/* Background Right Align Side-by-Side Model Image */}
                <div className="absolute inset-0 select-none">
                  <img
                    src={lookbookRightTopImage}
                    alt="Badney Cotton Classic Afro Edition"
                    referrerPolicy="no-referrer"
                    className="w-full h-full object-cover object-center sm:object-right transition-transform duration-700 group-hover:scale-102 opacity-70 filter brightness-95 contrast-105"
                  />
                </div>

                <div className="absolute inset-0 bg-gradient-to-r from-black/90 via-black/50 to-transparent" />

                <div className="relative z-10 max-w-sm space-y-3">
                  <span className="inline-block bg-[#1a1a1a] border border-white text-[9px] font-black uppercase tracking-widest text-[#D4AF37] px-2 py-0.5 font-mono rounded-none">
                    AFRO EDITION
                  </span>
                  
                  <h3 className="text-2xl sm:text-3xl font-black uppercase tracking-tight leading-none font-sans">
                    Classic Afro Tee
                  </h3>

                  <p className="text-xs text-gray-200 leading-relaxed font-bold font-sans">
                    A tribute to warm South African spaces and minimalist living. Fine organic long-loop combed cotton crafted for ultimate softness.
                  </p>

                  <div className="pt-1">
                    <a
                      href="#quick-shop"
                      onClick={() => setSelectedCategory("MEN")}
                      className="inline-flex items-center gap-1.5 bg-white text-[#1a1a1a] border-2 border-[#1a1a1a] px-4 py-2.5 text-[11px] font-black uppercase tracking-widest shadow-[3px_3px_0px_0px_rgba(26,26,26,1)] hover:shadow-none transition-all cursor-pointer rounded-none"
                    >
                      Shop Collection
                    </a>
                  </div>
                </div>
              </div>

              {/* Lower split grids */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
                
                {/* Left Mini Grid (Footwear replaced with Ribbed Tee Close-up) */}
                <div className="relative bg-white text-gray-900 border-4 border-[#1a1a1a] rounded-none overflow-hidden min-h-[210px] flex flex-col justify-end p-6 group shadow-[8px_8px_0px_0px_rgba(26,26,26,1)]">
                  
                  {/* Ribbed detail visual backplate */}
                  <div className="absolute inset-x-0 top-0 bottom-12 select-none overflow-hidden">
                    <img
                      src={lookbookRightBottomLeftImage}
                      alt="Ribbed Monogram Close-up"
                      referrerPolicy="no-referrer"
                      className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105 filter brightness-100"
                    />
                  </div>

                  {/* Fading border overlays */}
                  <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-white via-white/95 to-transparent pt-20" />

                  <div className="relative z-10 text-left space-y-1">
                    <span className="text-[9px] font-black tracking-widest text-[#D4AF37] bg-[#1a1a1a] px-2 py-0.5 font-mono inline-block rounded-none">
                      STUDIO MINIMALIST
                    </span>
                    <h4 className="text-sm font-black uppercase text-gray-900 tracking-tight leading-none">
                      Ribbed Crest Tees
                    </h4>
                    <div className="pt-1.5 flex items-center gap-1">
                      <a href="#quick-shop" onClick={() => setSelectedCategory("ACCESSORIES")} className="text-[10px] font-black uppercase tracking-widest text-[#1a1a1a] hover:text-[#D4AF37] transition-colors cursor-pointer flex items-center gap-1">
                        Explore <ChevronRight className="w-3 h-3" />
                      </a>
                    </div>
                  </div>
                </div>

                {/* Right Mini Grid (Bags replaced with Onyx Essentials) */}
                <div className="relative bg-white text-gray-900 border-4 border-[#1a1a1a] rounded-none overflow-hidden min-h-[210px] flex flex-col justify-end p-6 group shadow-[8px_8px_0px_0px_rgba(26,26,26,1)]">
                  
                  {/* Black Flatlay backplate */}
                  <div className="absolute inset-x-0 top-0 bottom-12 select-none overflow-hidden">
                    <img
                      src={lookbookRightBottomRightImage}
                      alt="Midnight Onyx Flat"
                      referrerPolicy="no-referrer"
                      className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105 filter brightness-100"
                    />
                  </div>

                  {/* Fading border overlays */}
                  <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-white via-white/95 to-transparent pt-20" />

                  <div className="relative z-10 text-left space-y-1">
                    <span className="text-[9px] font-black tracking-widest text-[#D4AF37] bg-[#1a1a1a] px-2 py-0.5 font-mono inline-block rounded-none">
                      ONYX ESSENTIALS
                    </span>
                    <h4 className="text-sm font-black uppercase text-gray-900 tracking-tight leading-none">
                      Midnight Onyx Tees
                    </h4>
                    <div className="pt-1.5 flex items-center gap-1">
                      <a href="#quick-shop" onClick={() => setSelectedCategory("MEN")} className="text-[10px] font-black uppercase tracking-widest text-[#1a1a1a] hover:text-[#D4AF37] transition-colors cursor-pointer flex items-center gap-1">
                        Explore <ChevronRight className="w-3 h-3" />
                      </a>
                    </div>
                  </div>
                </div>

              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 7. HERITAGE & BRAND ETHOS (About Section) */}
      <section id="about-section" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-24 scroll-mt-20">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
          
          <div className="space-y-6 text-left">
            <span className="text-[11px] font-black tracking-widest text-white bg-[#1a1a1a] px-3.5 py-1.5 rounded-none inline-block font-mono border-2 border-[#1a1a1a]">
              Our Manufacturing Ethos
            </span>
            
            <h3 className="text-3xl sm:text-5xl font-black text-gray-950 leading-none font-sans uppercase">
              Grown locally. <br />Combed to perfection.
            </h3>

            <p className="text-xs sm:text-sm text-[#1a1a1a] leading-relaxed font-bold">
              Badney Cotton is more than a streetwear imprint. Born out of local textile mills, we operate on a close-loop standard, procuring premium cotton yarn, knitwear fabrics and organic dye structures directly in Johannesburg. Each thread is treated with absolute patience for a heavy luxury texture that stands extensive wash cycles without fading.
            </p>

            <blockquote className="border-l-4 border-[#1a1a1a] pl-4 py-1.5 italic font-sans text-[#1a1a1a]/85 text-xs sm:text-sm font-bold">
              "We believe garments should outlive fast trends. Our collections focus entirely on meticulous stitching, pure visual geometry, and premium structural weight."
            </blockquote>

            <div className="pt-2">
              <a
                href="#quick-shop"
                className="px-5 py-3.5 bg-white text-[#1a1a1a] border-4 border-[#1a1a1a] hover:bg-[#1a1a1a] hover:text-white rounded-none text-xs font-black uppercase tracking-widest transition-all inline-block cursor-pointer shadow-[4px_4px_0px_0px_rgba(26,26,26,1)]"
              >
                Explore Combed Tees
              </a>
            </div>
          </div>

          <div className="relative aspect-video sm:aspect-square bg-white border-4 border-[#1a1a1a] rounded-none overflow-hidden group shadow-[8px_8px_0px_0px_rgba(26,26,26,1)]">
            <img
              src={aboutSectionImage}
              alt="Combed Cotton Fabric detail and verified secure hangtag"
              referrerPolicy="no-referrer"
              className="w-full h-full object-cover transition-transform duration-750 group-hover:scale-102 filter saturate-100 brightness-100"
            />
            <div className="absolute inset-0 bg-black/10" />
            <div className="absolute bottom-5 left-5 bg-white p-4 rounded-none border-2 border-[#1a1a1a] text-left max-w-xs shadow-md">
              <p className="text-xs font-black uppercase text-gray-950">100% Ring-Spun Cotton Certified</p>
              <p className="text-[10px] text-[#1a1a1a]/70 font-bold uppercase tracking-wider mt-1">Heavyweight knit treatment designed for urban lifestyle conditions.</p>
            </div>
          </div>

        </div>
      </section>

      {/* 8. NEWSLETTER SUBSCRIBE BANNER */}
      <section className="bg-[#1a1a1a] border-t-4 border-b-4 border-black text-white py-16">
        <div className="max-w-4xl mx-auto px-4 text-center space-y-6">
          <span className="text-[10px] font-black tracking-widest text-[#D4AF37] uppercase block font-mono">
            Badney Citizen Journal
          </span>
          <h3 className="text-3xl sm:text-4xl font-black uppercase tracking-tight leading-none">
            Elevate Your Style. Unlock Free Shipping.
          </h3>
          <p className="text-xs sm:text-sm text-gray-300 max-w-lg mx-auto leading-relaxed font-bold">
            Subscribe to receive exclusive lookbook releases, local drop notifications, and a discount voucher token direct to your mailbox.
          </p>

          <form
            onSubmit={(e) => {
              e.preventDefault();
              if (emailSubscription.trim()) {
                setEmailSubscribedStatus(true);
                setEmailSubscription("");
              }
            }}
            className="flex flex-col sm:flex-row gap-2 max-w-md mx-auto"
          >
            {emailSubscribedStatus ? (
              <div className="w-full py-3.5 bg-black/55 text-[#D4AF37] text-xs font-black uppercase tracking-widest rounded-none border-2 border-[#D4AF37] flex items-center justify-center gap-1.5">
                <Check className="w-4 h-4 text-[#D4AF37]" />
                <span>You have been subscribed! Keep an eye on your inbox.</span>
              </div>
            ) : (
              <>
                <input
                  type="email"
                  required
                  value={emailSubscription}
                  onChange={(e) => setEmailSubscription(e.target.value)}
                  placeholder="Enter your personal email..."
                  className="bg-white border-2 border-white px-4 py-3 rounded-none text-xs text-[#1a1a1a] font-bold placeholder-gray-500 focus:ring-0 uppercase tracking-widest outline-hidden w-full sm:flex-grow"
                />
                <button
                  type="submit"
                  className="px-6 py-3 bg-[#D4AF37] text-white hover:bg-[#D4AF37]/95 border-2 border-[#D4AF37] rounded-none font-black text-xs uppercase tracking-widest shrink-0 transition-all cursor-pointer"
                >
                  Join List
                </button>
              </>
            )}
          </form>
        </div>
      </section>

      {/* 9. GLOBAL FOOTER COLOURED SECTION */}
      <footer id="footer-section" className="bg-white text-[#1a1a1a] py-16 border-t-4 border-[#1a1a1a] text-xs">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-1 md:grid-cols-4 gap-12 text-left">
          
          {/* Logo brand and support hotline */}
          <div className="space-y-4">
            <div className="flex items-center gap-2.5">
              <BrandLogo iconOnly={true} size="sm" className="text-[#1a1a1a]" />
              <h4 className="text-[#1a1a1a] font-black tracking-[0.18em] text-sm uppercase">
                Badney Cotton
              </h4>
            </div>
            <p className="text-[#1a1a1a]/70 leading-relaxed font-bold">
              Premium clothing brand executing cotton basics. Designed and tailored locally in Johannesburg, South Africa.
            </p>
            <div className="space-y-1.5">
              <p className="flex items-center gap-2 text-[#1a1a1a] font-black">
                <Phone className="w-4 h-4 text-[#D4AF37] shrink-0" />
                <span>Order Support: +27 61 610 0885</span>
              </p>
              <p className="text-[10px] text-gray-500 font-mono font-bold uppercase tracking-wider">Mon - Fri: 8:00 AM - 5:00 PM (SAST)</p>
            </div>
          </div>

          {/* Links Quick Finder */}
          <div className="space-y-3">
            <h4 className="text-[#1a1a1a] font-black tracking-widest text-xs uppercase">Customer Service</h4>
            <ul className="space-y-2 font-bold uppercase tracking-wider text-[10px]">
              <li><a href="#quick-shop" className="hover:text-[#D4AF37] transition-colors">Browse Collections</a></li>
              <li><button onClick={() => alert("Free nationwide shipping processed under South African local limits. Standard Courier takes 3-5 business days.")} className="hover:text-[#D4AF37] transition-colors text-left font-bold uppercase tracking-wider text-[10px]">Shipping Policy & Speeds</button></li>
              <li><button onClick={() => alert("Defective or unwashed clothes can be easily registered for replacement within 14 days of checkout.")} className="hover:text-[#D4AF37] transition-colors text-left font-bold uppercase tracking-wider text-[10px]">Exchange Guarantee</button></li>
              <li><a href="#about-section" className="hover:text-[#D4AF37] transition-colors">Our Manufacturing Story</a></li>
            </ul>
          </div>

          {/* Catalog Categories */}
          <div className="space-y-3">
            <h4 className="text-[#1a1a1a] font-black tracking-widest text-xs uppercase">Store Collections</h4>
            <ul className="space-y-2 font-bold uppercase tracking-wider text-[10px]">
              <li><button onClick={() => { setSelectedCategory("MEN"); window.scrollTo({top: document.getElementById('quick-shop')?.offsetTop, behavior: 'smooth'}); }} className="hover:text-[#D4AF37] transition-colors">Combed Shirts & Knits</button></li>
              <li><button onClick={() => { setSelectedCategory("WOMEN"); window.scrollTo({top: document.getElementById('quick-shop')?.offsetTop, behavior: 'smooth'}); }} className="hover:text-[#D4AF37] transition-colors">Womens Luxury Basics</button></li>
              <li><button onClick={() => { setSelectedCategory("SHOES"); window.scrollTo({top: document.getElementById('quick-shop')?.offsetTop, behavior: 'smooth'}); }} className="hover:text-[#D4AF37] transition-colors">Premium Court Trainers</button></li>
              <li><button onClick={() => { setSelectedCategory("BAGS"); window.scrollTo({top: document.getElementById('quick-shop')?.offsetTop, behavior: 'smooth'}); }} className="hover:text-[#D4AF37] transition-colors">Minimalist Canvas Totes</button></li>
              <li><button onClick={() => { setSelectedCategory("ACCESSORIES"); window.scrollTo({top: document.getElementById('quick-shop')?.offsetTop, behavior: 'smooth'}); }} className="hover:text-[#D4AF37] transition-colors">Classic Structured Caps</button></li>
            </ul>
          </div>

          {/* Support channels */}
          <div className="space-y-4">
            <h4 className="text-[#1a1a1a] font-black tracking-widest text-xs uppercase">Local Security Assured</h4>
            <p className="text-[#1a1a1a]/70 leading-relaxed font-bold">
              Orders placed on this applet directly compile selections and trigger deep WhatsApp redirect URLs. Pay via bank EFT or secure card links with billing supervisors.
            </p>
            
            {/* Social media anchors */}
            <div className="flex gap-4 text-[#1a1a1a]">
              <a href="https://instagram.com" className="hover:text-[#D4AF37] transition-colors" title="Instagram Profile">
                <Instagram className="w-5 h-5" />
              </a>
              <a href="https://facebook.com" className="hover:text-[#D4AF37] transition-colors" title="Facebook Page">
                <Facebook className="w-5 h-5" />
              </a>
              <a href="https://twitter.com" className="hover:text-[#D4AF37] transition-colors" title="Twitter Handle">
                <Twitter className="w-5 h-5" />
              </a>
            </div>
          </div>

        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-12 pt-8 border-t-2 border-[#1a1a1a]/15 text-center text-[#1a1a1a]/60 flex flex-col sm:flex-row justify-between items-center gap-4 font-bold uppercase tracking-wider text-[10px]">
          <p>© 2026 Badney Cotton (Pty) Ltd. All brand rights reserved.</p>
          <div className="flex items-center gap-2 font-mono text-[9px] text-[#D4AF37]">
            <ShieldCheck className="w-4 h-4 shrink-0" />
            <span>Secure SSL WhatsApp Gateway Certified</span>
          </div>
        </div>
      </footer>

      {/* 10. PRODUCT DETAILED MODAL CONTROLS */}
      <ProductModal
        product={quickViewProduct}
        isOpen={quickViewProduct !== null}
        onClose={() => setQuickViewProduct(null)}
        onAddToCart={handleAddToCart}
      />

      {/* 11. SHOPPING BAG DRAWER OVERLAYS */}
      <CartDrawer
        isOpen={isCartOpen}
        onClose={() => setIsCartOpen(false)}
        cartItems={cart}
        onUpdateQty={handleUpdateQty}
        onRemoveItem={handleRemoveItem}
        onProceedToCheckout={() => {
          setIsCartOpen(false);
          setIsCheckoutOpen(true);
        }}
      />

      {/* 12. DELIVERIES AND WHATSAPP REDIRECT BUILDERS */}
      <CheckoutModal
        isOpen={isCheckoutOpen}
        onClose={() => setIsCheckoutOpen(false)}
        cartItems={cart}
        onOrderSuccess={handleOrderSuccess}
      />

      {/* 13. HQ CATALOG AND PRICES MANAGEMENT CONTROL PANEL */}
      <AdminPanel
        isOpen={isAdminOpen}
        onClose={() => setIsAdminOpen(false)}
        products={products}
        onSaveProducts={(newProducts) => setProducts(newProducts)}
        onResetProducts={() => setProducts(PRODUCTS)}
        heroImage={heroImage}
        onSaveHeroImage={(url) => setHeroImage(url)}
        lookbookLeftImage={lookbookLeftImage}
        onSaveLookbookLeftImage={(url) => setLookbookLeftImage(url)}
        lookbookRightTopImage={lookbookRightTopImage}
        onSaveLookbookRightTopImage={(url) => setLookbookRightTopImage(url)}
        lookbookRightBottomLeftImage={lookbookRightBottomLeftImage}
        onSaveLookbookRightBottomLeftImage={(url) => setLookbookRightBottomLeftImage(url)}
        lookbookRightBottomRightImage={lookbookRightBottomRightImage}
        onSaveLookbookRightBottomRightImage={(url) => setLookbookRightBottomRightImage(url)}
        aboutSectionImage={aboutSectionImage}
        onSaveAboutSectionImage={(url) => setAboutSectionImage(url)}
      />

      {/* 14. CUSTOMER SECURITY ACCREDITATION & ORDER LEDGER PORTAL */}
      <UserAccountModal
        isOpen={isAccountOpen}
        onClose={() => setIsAccountOpen(false)}
      />

    </div>
  );
}
