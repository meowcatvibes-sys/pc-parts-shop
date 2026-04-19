import React, { useState, useEffect, useCallback, useRef, useMemo, createContext, useContext } from 'react';
import { HashRouter, Routes, Route, useNavigate } from 'react-router-dom';
import './App.css';

/* ========================================
   CONTEXT
   ======================================== */
const AppContext = createContext();

/* ========================================
   DATA
   ======================================== */
const CATEGORIES = [
  { id: 'all', name: 'All', icon: '🔥' },
  { id: 'gpu', name: 'GPUs', icon: '🎮' },
  { id: 'cpu', name: 'CPUs', icon: '⚡' },
  { id: 'ram', name: 'RAM', icon: '🧩' },
  { id: 'storage', name: 'Storage', icon: '💾' },
  { id: 'motherboard', name: 'Boards', icon: '🔲' },
];

const PRODUCTS = [
  {
    id: 1, name: 'NVIDIA GeForce RTX 4090', category: 'gpu', price: 1599, originalPrice: 1799,
    tag: 'hot', icon: '🎮', image: './images/rtx-4090.png', rating: 4.9, reviews: 342,
    specs: '24GB GDDR6X • 16384 CUDA Cores',
    description: 'The ultimate gaming GPU. Powered by the NVIDIA Ada Lovelace architecture with 24GB of GDDR6X memory for unparalleled 4K gaming and content creation performance.',
    details: [
      { label: 'Memory', value: '24GB GDDR6X' },
      { label: 'Cores', value: '16384 CUDA' },
      { label: 'Boost Clock', value: '2.52 GHz' },
      { label: 'TDP', value: '450W' },
    ],
    gradient: 'linear-gradient(135deg, #00d4ff15, #7c3aed20)',
  },
  {
    id: 2, name: 'AMD Radeon RX 7900 XTX', category: 'gpu', price: 949,
    tag: 'new', icon: '🎮', image: './images/rx-7900-xtx.png', rating: 4.7, reviews: 218,
    specs: '24GB GDDR6 • 6144 Stream Processors',
    description: 'AMD\'s flagship GPU built on RDNA 3 architecture. Features 24GB of high-speed GDDR6 memory and advanced ray tracing for stunning visual fidelity.',
    details: [
      { label: 'Memory', value: '24GB GDDR6' },
      { label: 'Cores', value: '6144 SP' },
      { label: 'Boost Clock', value: '2.50 GHz' },
      { label: 'TDP', value: '355W' },
    ],
    gradient: 'linear-gradient(135deg, #ec489915, #f59e0b20)',
  },
  {
    id: 3, name: 'NVIDIA GeForce RTX 4070 Ti', category: 'gpu', price: 799, originalPrice: 899,
    tag: 'sale', icon: '🎮', image: './images/rtx-4070-ti.png', rating: 4.8, reviews: 456,
    specs: '12GB GDDR6X • 7680 CUDA Cores',
    description: 'Outstanding 1440p and 4K gaming performance with DLSS 3 and ray tracing. The sweet spot for enthusiast gamers seeking top-tier performance.',
    details: [
      { label: 'Memory', value: '12GB GDDR6X' },
      { label: 'Cores', value: '7680 CUDA' },
      { label: 'Boost Clock', value: '2.61 GHz' },
      { label: 'TDP', value: '285W' },
    ],
    gradient: 'linear-gradient(135deg, #10b98115, #00d4ff20)',
  },
  {
    id: 4, name: 'AMD Ryzen 9 7950X', category: 'cpu', price: 549,
    tag: 'hot', icon: '⚡', image: './images/ryzen-7950x.png', rating: 4.8, reviews: 567,
    specs: '16 Cores • 32 Threads • 5.7 GHz',
    description: 'The world\'s best desktop processor for creators and enthusiasts. 16 cores of Zen 4 architecture delivering unmatched multi-threaded performance.',
    details: [
      { label: 'Cores', value: '16C / 32T' },
      { label: 'Base Clock', value: '4.5 GHz' },
      { label: 'Boost Clock', value: '5.7 GHz' },
      { label: 'TDP', value: '170W' },
    ],
    gradient: 'linear-gradient(135deg, #7c3aed15, #ec489920)',
  },
  {
    id: 5, name: 'Intel Core i9-14900K', category: 'cpu', price: 589,
    tag: 'new', icon: '⚡', image: './images/i9-14900k.png', rating: 4.6, reviews: 389,
    specs: '24 Cores • 32 Threads • 6.0 GHz',
    description: 'Intel\'s flagship 14th Gen processor featuring a hybrid architecture with 8 P-cores and 16 E-cores for dominant gaming and productivity.',
    details: [
      { label: 'Cores', value: '24C / 32T' },
      { label: 'Base Clock', value: '3.2 GHz' },
      { label: 'Boost Clock', value: '6.0 GHz' },
      { label: 'TDP', value: '253W' },
    ],
    gradient: 'linear-gradient(135deg, #00d4ff15, #7c3aed20)',
  },
  {
    id: 6, name: 'AMD Ryzen 7 7800X3D', category: 'cpu', price: 349,
    tag: 'hot', icon: '⚡', image: './images/ryzen-7800x3d.png', rating: 4.9, reviews: 723,
    specs: '8 Cores • 16 Threads • 3D V-Cache',
    description: 'The ultimate gaming CPU with 3D V-Cache technology. 96MB of L3 cache delivers best-in-class gaming performance at an incredible value.',
    details: [
      { label: 'Cores', value: '8C / 16T' },
      { label: 'L3 Cache', value: '96MB V-Cache' },
      { label: 'Boost Clock', value: '5.0 GHz' },
      { label: 'TDP', value: '120W' },
    ],
    gradient: 'linear-gradient(135deg, #f59e0b15, #ec489920)',
  },
  {
    id: 7, name: 'Corsair Vengeance DDR5 32GB', category: 'ram', price: 119, originalPrice: 149,
    tag: 'sale', icon: '🧩', image: './images/corsair-ddr5.png', rating: 4.7, reviews: 892,
    specs: '2x16GB • DDR5-6000 • CL36',
    description: 'High-performance DDR5 memory kit optimized for the latest Intel and AMD platforms. EXPO and XMP 3.0 support for easy overclocking.',
    details: [
      { label: 'Capacity', value: '32GB (2x16)' },
      { label: 'Speed', value: 'DDR5-6000' },
      { label: 'Latency', value: 'CL36' },
      { label: 'Voltage', value: '1.35V' },
    ],
    gradient: 'linear-gradient(135deg, #10b98115, #00d4ff20)',
  },
  {
    id: 8, name: 'G.Skill Trident Z5 RGB 32GB', category: 'ram', price: 139,
    tag: 'new', icon: '🧩', image: './images/gskill-trident-z5.png', rating: 4.8, reviews: 445,
    specs: '2x16GB • DDR5-6400 • CL32',
    description: 'Premium DDR5 RGB memory designed for extreme performance. Tri-fin heatspreader with stunning lighting effects and top-tier speed.',
    details: [
      { label: 'Capacity', value: '32GB (2x16)' },
      { label: 'Speed', value: 'DDR5-6400' },
      { label: 'Latency', value: 'CL32' },
      { label: 'Voltage', value: '1.40V' },
    ],
    gradient: 'linear-gradient(135deg, #7c3aed15, #00d4ff20)',
  },
  {
    id: 9, name: 'Samsung 990 Pro 2TB NVMe', category: 'storage', price: 159,
    tag: 'hot', icon: '💾', image: './images/samsung-990pro.png', rating: 4.9, reviews: 1203,
    specs: '7,450 MB/s Read • PCIe 4.0 x4',
    description: 'Top-tier NVMe SSD with read speeds up to 7,450 MB/s. Ideal for gaming, creative workloads, and operating system drives.',
    details: [
      { label: 'Capacity', value: '2TB' },
      { label: 'Read Speed', value: '7,450 MB/s' },
      { label: 'Write Speed', value: '6,900 MB/s' },
      { label: 'Interface', value: 'PCIe 4.0 x4' },
    ],
    gradient: 'linear-gradient(135deg, #f59e0b15, #ec489920)',
  },
  {
    id: 10, name: 'WD Black SN850X 1TB', category: 'storage', price: 89, originalPrice: 119,
    tag: 'sale', icon: '💾', image: './images/wd-sn850x.png', rating: 4.7, reviews: 678,
    specs: '7,300 MB/s Read • PCIe 4.0 x4',
    description: 'WD\'s flagship gaming SSD optimized for DirectStorage and next-gen game loading. Blazing fast performance at an unbeatable price.',
    details: [
      { label: 'Capacity', value: '1TB' },
      { label: 'Read Speed', value: '7,300 MB/s' },
      { label: 'Write Speed', value: '6,300 MB/s' },
      { label: 'Interface', value: 'PCIe 4.0 x4' },
    ],
    gradient: 'linear-gradient(135deg, #10b98115, #7c3aed20)',
  },
  {
    id: 11, name: 'ASUS ROG Strix X670E-E', category: 'motherboard', price: 399,
    tag: 'hot', icon: '🔲', image: './images/asus-rog-x670e.png', rating: 4.6, reviews: 234,
    specs: 'AM5 • DDR5 • PCIe 5.0',
    description: 'Premium AM5 motherboard with PCIe 5.0, DDR5 support, 18+2 power stages, and extensive connectivity for high-end builds.',
    details: [
      { label: 'Socket', value: 'AM5' },
      { label: 'Chipset', value: 'X670E' },
      { label: 'Memory', value: 'DDR5-6400+' },
      { label: 'Form Factor', value: 'ATX' },
    ],
    gradient: 'linear-gradient(135deg, #7c3aed15, #00d4ff20)',
  },
  {
    id: 12, name: 'MSI MAG B650 Tomahawk', category: 'motherboard', price: 219,
    tag: 'new', icon: '🔲', image: './images/msi-b650-tomahawk.png', rating: 4.5, reviews: 345,
    specs: 'AM5 • DDR5 • PCIe 4.0',
    description: 'Reliable and feature-rich AM5 motherboard for mainstream builders. Solid power delivery with comprehensive I/O for excellent value.',
    details: [
      { label: 'Socket', value: 'AM5' },
      { label: 'Chipset', value: 'B650' },
      { label: 'Memory', value: 'DDR5-6000+' },
      { label: 'Form Factor', value: 'ATX' },
    ],
    gradient: 'linear-gradient(135deg, #ec489915, #f59e0b20)',
  },
];

const FEATURES = [
  { icon: '🚀', title: 'Blazing Fast Shipping', desc: 'Free next-day delivery on all orders over $500. Get your parts faster and start building sooner.' },
  { icon: '🛡️', title: 'Warranty Protection', desc: 'Every product comes with manufacturer warranty plus our extended 2-year TechForge guarantee.' },
  { icon: '💎', title: '100% Authentic Parts', desc: 'We source directly from manufacturers. Every component is genuine and factory sealed.' },
  { icon: '🔧', title: 'Expert Build Support', desc: 'Our team of PC enthusiasts provides free build consultation and technical support 24/7.' },
];

const PROMO_CODES = [
  { code: 'TECHFORGE10', discount: 0.10, label: '10% off' },
  { code: 'SAVE50', amount: 50, label: '$50 off' },
  { code: 'FREESHIP', freeShipping: true, label: 'Free Shipping' },
];

const MOCK_REVIEWS = [
  { id: 1, name: 'Alex G.', avatar: '👨‍💻', rating: 5, text: 'Absolutely incredible performance! This component exceeded all my expectations. Runs cool and quiet even under heavy loads.', date: '2 weeks ago' },
  { id: 2, name: 'Sarah M.', avatar: '👩‍🔬', rating: 4, text: 'Great product overall. Installation was straightforward and performance is excellent. Minor packaging issue but the part itself is perfect.', date: '1 month ago' },
  { id: 3, name: 'Mike R.', avatar: '🧑‍🔧', rating: 5, text: 'Best upgrade I\'ve made in years. The difference is night and day. TechForge shipping was super fast too!', date: '3 weeks ago' },
  { id: 4, name: 'Jenny L.', avatar: '👩‍💻', rating: 5, text: 'Worth every penny. Build quality is outstanding and it performs exactly as advertised. Highly recommended!', date: '1 week ago' },
  { id: 5, name: 'David K.', avatar: '🧔', rating: 4, text: 'Solid component that delivers on its promises. Would definitely buy from TechForge again.', date: '2 months ago' },
];

const CHAT_RESPONSES = {
  greeting: 'Hello! 👋 Welcome to TechForge support. How can I help you today?',
  shipping: 'We offer free next-day delivery on orders over $500! Standard shipping is $29.99 and typically takes 3-5 business days.',
  returns: 'We have a hassle-free 30-day return policy. Items must be unopened and in original condition. We\'ll cover return shipping!',
  warranty: 'All products come with the manufacturer\'s warranty PLUS our exclusive 2-year TechForge guarantee at no extra cost!',
  discount: 'Great news! Use promo code TECHFORGE10 for 10% off your order, or SAVE50 for $50 off orders over $200! 🎉',
  payment: 'We accept all major credit cards, PayPal, and Apple Pay. All transactions are secured with 256-bit SSL encryption.',
  help: 'I can help with: 📦 Shipping & Delivery, 🔄 Returns & Refunds, 🛡️ Warranty, 💰 Pricing & Discounts, 💳 Payment Methods. Just ask!',
  default: 'Thanks for your message! For detailed inquiries, email support@techforge.com or call 1-800-TECHFORGE. We\'re available 24/7!',
};

/* ========================================
   CUSTOM HOOKS
   ======================================== */

function useLocalStorage(key, initialValue) {
  const [storedValue, setStoredValue] = useState(() => {
    try {
      const item = window.localStorage.getItem(key);
      return item ? JSON.parse(item) : initialValue;
    } catch (error) {
      return initialValue;
    }
  });
  const setValue = (value) => {
    try {
      const valueToStore = value instanceof Function ? value(storedValue) : value;
      setStoredValue(valueToStore);
      window.localStorage.setItem(key, JSON.stringify(valueToStore));
    } catch (error) {
      console.error(error);
    }
  };
  return [storedValue, setValue];
}

function useScrollAnimation() {
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) entry.target.classList.add('scroll-visible');
        });
      },
      { threshold: 0.1, rootMargin: '0px 0px -50px 0px' }
    );
    const elements = document.querySelectorAll('.scroll-hidden');
    elements.forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, []);
}

/* ========================================
   UTILITY COMPONENTS
   ======================================== */

function StarRating({ rating, size = 14, showCount, count }) {
  const stars = [];
  for (let i = 1; i <= 5; i++) {
    if (i <= Math.floor(rating)) {
      stars.push(<span key={i} className="star star--full" style={{ fontSize: size }} aria-hidden="true">★</span>);
    } else if (i - 0.5 <= rating) {
      stars.push(<span key={i} className="star star--half" style={{ fontSize: size }} aria-hidden="true">★</span>);
    } else {
      stars.push(<span key={i} className="star star--empty" style={{ fontSize: size }} aria-hidden="true">★</span>);
    }
  }
  return (
    <div className="star-rating" role="img" aria-label={`${rating} out of 5 stars`}>
      {stars}
      {showCount && <span className="star-rating__count">({count})</span>}
    </div>
  );
}

function SkeletonCard() {
  return (
    <div className="skeleton-card" aria-hidden="true">
      <div className="skeleton-card__image skeleton-shimmer" />
      <div className="skeleton-card__body">
        <div className="skeleton-card__line skeleton-shimmer" style={{ width: '40%' }} />
        <div className="skeleton-card__line skeleton-shimmer" style={{ width: '80%' }} />
        <div className="skeleton-card__line skeleton-shimmer" style={{ width: '60%' }} />
        <div className="skeleton-card__footer">
          <div className="skeleton-card__line skeleton-shimmer" style={{ width: '30%' }} />
          <div className="skeleton-card__line skeleton-shimmer" style={{ width: '35%', height: 36 }} />
        </div>
      </div>
    </div>
  );
}

/* ========================================
   NAVBAR
   ======================================== */

function Navbar() {
  const { cart, wishlist, theme, setTheme, setShowCart, setShowWishlist, setShowSearch, setShowBuild } = useContext(AppContext);
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 30);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleNavClick = (section) => {
    setMobileOpen(false);
    navigate('/');
    setTimeout(() => {
      const el = document.getElementById(section);
      if (el) el.scrollIntoView({ behavior: 'smooth' });
    }, 100);
  };

  const cartCount = cart.reduce((sum, item) => sum + item.quantity, 0);

  return (
    <nav className={`navbar ${scrolled ? 'scrolled' : ''}`} id="navbar" role="navigation" aria-label="Main navigation">
      <div className="navbar__logo" onClick={() => handleNavClick('hero')} tabIndex={0} role="button" aria-label="TechForge home">
        <span className="navbar__logo-icon">⚡</span>
        TECHFORGE
      </div>
      <div className={`navbar__links ${mobileOpen ? 'open' : ''}`}>
        <span className="navbar__link" onClick={() => handleNavClick('products')} tabIndex={0} role="button">Products</span>
        <span className="navbar__link" onClick={() => handleNavClick('categories')} tabIndex={0} role="button">Categories</span>
        <span className="navbar__link" onClick={() => setShowBuild(true)} tabIndex={0} role="button">Build a PC</span>
        <span className="navbar__link" onClick={() => handleNavClick('about')} tabIndex={0} role="button">Why Us</span>
        <span className="navbar__link" onClick={() => handleNavClick('newsletter')} tabIndex={0} role="button">Contact</span>
      </div>
      <div className="navbar__actions">
        <button className="navbar__icon-btn" onClick={() => setShowSearch(true)} aria-label="Search products" id="search-button">🔍</button>
        <button className="navbar__icon-btn" onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')} aria-label={`Switch to ${theme === 'dark' ? 'light' : 'dark'} mode`} id="theme-toggle">
          {theme === 'dark' ? '☀️' : '🌙'}
        </button>
        <button className="navbar__icon-btn navbar__wishlist-btn" onClick={() => setShowWishlist(true)} aria-label="View wishlist" id="wishlist-button">
          ❤️
          {wishlist.length > 0 && <span className="navbar__cart-badge">{wishlist.length}</span>}
        </button>
        <button className="navbar__cart-btn" onClick={() => setShowCart(true)} id="cart-button" aria-label={`Cart with ${cartCount} items`}>
          🛒
          {cartCount > 0 && <span className="navbar__cart-badge">{cartCount}</span>}
        </button>
        <button className="navbar__mobile-toggle" onClick={() => setMobileOpen(!mobileOpen)} aria-label="Toggle menu" aria-expanded={mobileOpen}>
          {mobileOpen ? '✕' : '☰'}
        </button>
      </div>
    </nav>
  );
}

/* ========================================
   SEARCH OVERLAY
   ======================================== */

function SearchOverlay() {
  const { setShowSearch, setSelectedProduct, addToRecentlyViewed } = useContext(AppContext);
  const [query, setQuery] = useState('');
  const inputRef = useRef(null);

  useEffect(() => {
    document.body.style.overflow = 'hidden';
    inputRef.current?.focus();
    const handleKey = (e) => { if (e.key === 'Escape') setShowSearch(false); };
    window.addEventListener('keydown', handleKey);
    return () => { document.body.style.overflow = ''; window.removeEventListener('keydown', handleKey); };
  }, [setShowSearch]);

  const results = useMemo(() => {
    if (!query.trim()) return [];
    const q = query.toLowerCase();
    return PRODUCTS.filter(p =>
      p.name.toLowerCase().includes(q) ||
      p.category.toLowerCase().includes(q) ||
      p.specs.toLowerCase().includes(q)
    );
  }, [query]);

  const handleProductClick = (product) => {
    setSelectedProduct(product);
    addToRecentlyViewed(product);
    setShowSearch(false);
  };

  return (
    <div className="search-overlay" onClick={() => setShowSearch(false)} role="dialog" aria-label="Search products" aria-modal="true">
      <div className="search-overlay__content" onClick={(e) => e.stopPropagation()}>
        <div className="search-overlay__header">
          <span className="search-overlay__icon">🔍</span>
          <input
            ref={inputRef}
            type="text"
            className="search-overlay__input"
            placeholder="Search GPUs, CPUs, RAM, Storage..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            aria-label="Search products"
            id="search-input"
          />
          <button className="search-overlay__close" onClick={() => setShowSearch(false)} aria-label="Close search">✕</button>
        </div>
        {query.trim() && (
          <div className="search-overlay__results">
            {results.length === 0 ? (
              <div className="search-overlay__empty">
                <span>😔</span>
                <p>No products found for "{query}"</p>
              </div>
            ) : (
              results.map(p => (
                <div key={p.id} className="search-result" onClick={() => handleProductClick(p)} role="button" tabIndex={0}>
                  {p.image ? (
                    <img src={p.image} alt={p.name} className="search-result__img" />
                  ) : (
                    <span className="search-result__icon">{p.icon}</span>
                  )}
                  <div className="search-result__info">
                    <div className="search-result__name">{p.name}</div>
                    <div className="search-result__specs">{p.specs}</div>
                  </div>
                  <div className="search-result__price">${p.price}</div>
                </div>
              ))
            )}
          </div>
        )}
        {!query.trim() && (
          <div className="search-overlay__suggestions">
            <p className="search-overlay__hint">Popular searches</p>
            <div className="search-overlay__tags">
              {['RTX 4090', 'Ryzen', 'DDR5', 'NVMe', 'AM5'].map(tag => (
                <button key={tag} className="search-overlay__tag" onClick={() => setQuery(tag)}>{tag}</button>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

/* ========================================
   HERO
   ======================================== */

function Hero() {
  const navigate = useNavigate();
  const [counts, setCounts] = useState({ products: 0, customers: 0, rating: 0 });
  const heroRef = useRef(null);
  const animated = useRef(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && !animated.current) {
          animated.current = true;
          animateCounters();
        }
      },
      { threshold: 0.3 }
    );
    if (heroRef.current) observer.observe(heroRef.current);
    return () => observer.disconnect();
  }, []);

  const animateCounters = () => {
    const targets = { products: 500, customers: 12000, rating: 4.9 };
    const duration = 2000;
    const start = Date.now();
    const tick = () => {
      const elapsed = Date.now() - start;
      const progress = Math.min(elapsed / duration, 1);
      const ease = 1 - Math.pow(1 - progress, 3);
      setCounts({
        products: Math.floor(targets.products * ease),
        customers: Math.floor(targets.customers * ease),
        rating: Math.round(targets.rating * ease * 10) / 10,
      });
      if (progress < 1) requestAnimationFrame(tick);
    };
    requestAnimationFrame(tick);
  };

  const scrollToProducts = () => {
    const el = document.getElementById('products');
    if (el) el.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <section className="hero" id="hero" ref={heroRef}>
      <div className="hero__bg">
        <div className="hero__bg-gradient" />
        <div className="hero__grid-lines" />
        <div className="hero__orb hero__orb--1" />
        <div className="hero__orb hero__orb--2" />
        <div className="hero__orb hero__orb--3" />
        <div className="hero__floating">
          <div className="hero__floating-shape hero__floating-shape--1" />
          <div className="hero__floating-shape hero__floating-shape--2" />
          <div className="hero__floating-shape hero__floating-shape--3" />
          <div className="hero__floating-shape hero__floating-shape--4" />
        </div>
      </div>
      <div className="hero__content">
        <div className="hero__badge">
          <span className="hero__badge-dot" />
          Premium PC Components
        </div>
        <h1 className="hero__title">
          Build Your Dream<br />
          <span className="hero__title-gradient">Gaming Rig</span>
        </h1>
        <p className="hero__subtitle">
          Discover top-tier GPUs, CPUs, RAM, and more. Handpicked components for enthusiasts
          who demand nothing but the best performance.
        </p>
        <div className="hero__cta-group">
          <button className="hero__cta hero__cta--primary" onClick={scrollToProducts} id="shop-now-btn">Shop Now</button>
          <button className="hero__cta hero__cta--secondary" onClick={() => navigate('/')} id="browse-catalog-btn">Browse Catalog</button>
        </div>
        <div className="hero__stats">
          <div className="hero__stat">
            <div className="hero__stat-number">{counts.products}+</div>
            <div className="hero__stat-label">Products</div>
          </div>
          <div className="hero__stat">
            <div className="hero__stat-number">{counts.customers.toLocaleString()}+</div>
            <div className="hero__stat-label">Happy Customers</div>
          </div>
          <div className="hero__stat">
            <div className="hero__stat-number">{counts.rating}</div>
            <div className="hero__stat-label">Rating</div>
          </div>
        </div>
      </div>
    </section>
  );
}

/* ========================================
   CATEGORIES
   ======================================== */

function Categories() {
  const { selectedCategory, handleCategoryChange } = useContext(AppContext);
  return (
    <section className="section categories" id="categories">
      <div className="section__container">
        <div className="section__header scroll-hidden">
          <span className="section__label">Browse By Category</span>
          <h2 className="section__title">Find Your Components</h2>
          <p className="section__description">From flagship GPUs to high-speed storage — explore our curated collection of premium PC parts.</p>
        </div>
        <div className="categories__grid">
          {CATEGORIES.map((cat, index) => (
            <div
              key={cat.id}
              className={`category-card scroll-hidden stagger-${index + 1} ${selectedCategory === cat.id ? 'active' : ''}`}
              onClick={() => handleCategoryChange(cat.id)}
              id={`category-${cat.id}`}
              role="button"
              tabIndex={0}
              aria-pressed={selectedCategory === cat.id}
              aria-label={`Filter by ${cat.name}`}
            >
              <span className="category-card__icon">{cat.icon}</span>
              <span className="category-card__name">{cat.name}</span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ========================================
   PRODUCT FILTERS
   ======================================== */

function ProductFilters() {
  const { sortBy, setSortBy, priceRange, setPriceRange } = useContext(AppContext);
  return (
    <div className="product-filters animate-in">
      <div className="product-filters__sort">
        <label htmlFor="sort-select" className="product-filters__label">Sort by</label>
        <select
          id="sort-select"
          className="product-filters__select"
          value={sortBy}
          onChange={(e) => setSortBy(e.target.value)}
          aria-label="Sort products"
        >
          <option value="default">Featured</option>
          <option value="price-low">Price: Low to High</option>
          <option value="price-high">Price: High to Low</option>
          <option value="rating">Highest Rated</option>
          <option value="name">Name A-Z</option>
        </select>
      </div>
      <div className="product-filters__price">
        <label className="product-filters__label">Price Range</label>
        <div className="product-filters__price-inputs">
          <input
            type="number"
            className="product-filters__price-input"
            placeholder="Min"
            value={priceRange[0] || ''}
            onChange={(e) => setPriceRange([Number(e.target.value) || 0, priceRange[1]])}
            aria-label="Minimum price"
          />
          <span className="product-filters__price-sep">—</span>
          <input
            type="number"
            className="product-filters__price-input"
            placeholder="Max"
            value={priceRange[1] === 9999 ? '' : priceRange[1]}
            onChange={(e) => setPriceRange([priceRange[0], Number(e.target.value) || 9999])}
            aria-label="Maximum price"
          />
        </div>
      </div>
    </div>
  );
}

/* ========================================
   PRODUCT CARD
   ======================================== */

function ProductCard({ product }) {
  const { addToCart, addedItems, wishlist, toggleWishlist, compareList, toggleCompare, setSelectedProduct, addToRecentlyViewed } = useContext(AppContext);
  const isAdded = addedItems.includes(product.id);
  const isWished = wishlist.some(w => w.id === product.id);
  const isComparing = compareList.includes(product.id);

  const handleClick = () => {
    setSelectedProduct(product);
    addToRecentlyViewed(product);
  };

  return (
    <div className="product-card animate-in" onClick={handleClick} id={`product-${product.id}`} role="article" aria-label={product.name}>
      <div className="product-card__image" style={{ background: product.gradient }}>
        {product.image ? (
          <img src={product.image} alt={product.name} className="product-card__img" loading="lazy" />
        ) : (
          <span className="product-card__image-icon">{product.icon}</span>
        )}
        {product.tag && (
          <span className={`product-card__tag product-card__tag--${product.tag}`}>
            {product.tag === 'hot' ? '🔥 Hot' : product.tag === 'new' ? '✨ New' : '💰 Sale'}
          </span>
        )}
        <button
          className={`product-card__wish-btn ${isWished ? 'active' : ''}`}
          onClick={(e) => { e.stopPropagation(); toggleWishlist(product); }}
          aria-label={isWished ? 'Remove from wishlist' : 'Add to wishlist'}
        >
          {isWished ? '❤️' : '🤍'}
        </button>
      </div>
      <div className="product-card__body">
        <div className="product-card__category">{product.category}</div>
        <h3 className="product-card__name">{product.name}</h3>
        <StarRating rating={product.rating} size={12} showCount count={product.reviews} />
        <p className="product-card__specs">{product.specs}</p>
        <div className="product-card__footer">
          <div className="product-card__pricing">
            <span className="product-card__price">${product.price}</span>
            {product.originalPrice && (
              <span className="product-card__original-price">${product.originalPrice}</span>
            )}
          </div>
          <div className="product-card__actions">
            <button
              className={`product-card__compare-btn ${isComparing ? 'active' : ''}`}
              onClick={(e) => { e.stopPropagation(); toggleCompare(product.id); }}
              aria-label={isComparing ? 'Remove from comparison' : 'Add to comparison'}
              title="Compare"
            >
              ⚖️
            </button>
            <button
              className={`product-card__add-btn ${isAdded ? 'product-card__add-btn--added' : ''}`}
              onClick={(e) => { e.stopPropagation(); addToCart(product); }}
              id={`add-to-cart-${product.id}`}
              aria-label={`Add ${product.name} to cart`}
            >
              {isAdded ? '✓' : '🛒'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

/* ========================================
   PRODUCT GRID
   ======================================== */

function ProductGrid() {
  const { selectedCategory, sortBy, priceRange, loading } = useContext(AppContext);

  const filtered = useMemo(() => {
    let items = selectedCategory === 'all' ? [...PRODUCTS] : PRODUCTS.filter((p) => p.category === selectedCategory);
    items = items.filter((p) => p.price >= priceRange[0] && p.price <= priceRange[1]);
    switch (sortBy) {
      case 'price-low': items.sort((a, b) => a.price - b.price); break;
      case 'price-high': items.sort((a, b) => b.price - a.price); break;
      case 'rating': items.sort((a, b) => b.rating - a.rating); break;
      case 'name': items.sort((a, b) => a.name.localeCompare(b.name)); break;
      default: break;
    }
    return items;
  }, [selectedCategory, sortBy, priceRange]);

  return (
    <section className="section products" id="products">
      <div className="section__container">
        <div className="section__header animate-in">
          <span className="section__label">Our Collection</span>
          <h2 className="section__title">Premium Components</h2>
          <p className="section__description">Every part is carefully selected and verified for peak performance.</p>
        </div>
        <ProductFilters />
        <div className="products__grid" role="list" key={selectedCategory + sortBy}>
          {loading ? (
            Array.from({ length: 6 }).map((_, i) => <SkeletonCard key={i} />)
          ) : filtered.length === 0 ? (
            <div className="products__empty">
              <span>😔</span>
              <p>No products match your filters</p>
            </div>
          ) : (
            filtered.map((product) => <ProductCard key={product.id} product={product} />)
          )}
        </div>
      </div>
    </section>
  );
}

/* ========================================
   PRODUCT MODAL
   ======================================== */

function ProductModal() {
  const { selectedProduct, setSelectedProduct, addToCart, wishlist, toggleWishlist } = useContext(AppContext);
  const isWished = wishlist.some(w => w.id === selectedProduct?.id);

  useEffect(() => {
    document.body.style.overflow = 'hidden';
    const handleKey = (e) => { if (e.key === 'Escape') setSelectedProduct(null); };
    window.addEventListener('keydown', handleKey);
    return () => { document.body.style.overflow = ''; window.removeEventListener('keydown', handleKey); };
  }, [setSelectedProduct]);

  if (!selectedProduct) return null;
  const product = selectedProduct;
  const productReviews = MOCK_REVIEWS.slice(0, 3 + (product.id % 2));

  return (
    <div className="modal-overlay" onClick={() => setSelectedProduct(null)} id="product-modal" role="dialog" aria-modal="true" aria-label={product.name}>
      <div className="modal" onClick={(e) => e.stopPropagation()}>
        <div className="modal__image" style={{ background: product.gradient }}>
          {product.image ? (
            <img src={product.image} alt={product.name} className="modal__img" />
          ) : (
            <span className="modal__image-icon">{product.icon}</span>
          )}
          <button className="modal__close" onClick={() => setSelectedProduct(null)} aria-label="Close modal">✕</button>
        </div>
        <div className="modal__body">
          <div className="modal__category">{product.category}</div>
          <h2 className="modal__name">{product.name}</h2>
          <StarRating rating={product.rating} size={16} showCount count={product.reviews} />
          <p className="modal__description">{product.description}</p>
          <div className="modal__specs">
            {product.details.map((spec, i) => (
              <div key={i} className="modal__spec">
                <div className="modal__spec-label">{spec.label}</div>
                <div className="modal__spec-value">{spec.value}</div>
              </div>
            ))}
          </div>
          <div className="modal__footer">
            <div className="modal__price-group">
              <span className="modal__price">${product.price}</span>
              {product.originalPrice && <span className="modal__original-price">${product.originalPrice}</span>}
            </div>
            <div className="modal__action-buttons">
              <button
                className={`modal__wish-btn ${isWished ? 'active' : ''}`}
                onClick={() => toggleWishlist(product)}
                aria-label={isWished ? 'Remove from wishlist' : 'Add to wishlist'}
              >
                {isWished ? '❤️' : '🤍'}
              </button>
              <button className="modal__add-btn" onClick={() => { addToCart(product); setSelectedProduct(null); }} id="modal-add-to-cart">
                Add to Cart
              </button>
            </div>
          </div>

          {/* Reviews Section */}
          <div className="modal__reviews">
            <h3 className="modal__reviews-title">Customer Reviews</h3>
            <div className="modal__reviews-summary">
              <div className="modal__reviews-big-rating">
                <span className="modal__reviews-number">{product.rating}</span>
                <StarRating rating={product.rating} size={18} />
                <span className="modal__reviews-total">{product.reviews} reviews</span>
              </div>
            </div>
            <div className="modal__reviews-list">
              {productReviews.map((review) => (
                <div key={review.id} className="review-card">
                  <div className="review-card__header">
                    <span className="review-card__avatar">{review.avatar}</span>
                    <div>
                      <div className="review-card__name">{review.name}</div>
                      <div className="review-card__date">{review.date}</div>
                    </div>
                    <StarRating rating={review.rating} size={12} />
                  </div>
                  <p className="review-card__text">{review.text}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

/* ========================================
   CART DRAWER
   ======================================== */

function CartDrawer() {
  const { cart, setShowCart, updateQuantity, removeFromCart, promoCode, setPromoCode, showToast } = useContext(AppContext);
  const [promoInput, setPromoInput] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    document.body.style.overflow = 'hidden';
    const handleKey = (e) => { if (e.key === 'Escape') setShowCart(false); };
    window.addEventListener('keydown', handleKey);
    return () => { document.body.style.overflow = ''; window.removeEventListener('keydown', handleKey); };
  }, [setShowCart]);

  const subtotal = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const shipping = subtotal > 500 || promoCode?.freeShipping ? 0 : 29.99;
  let discount = 0;
  if (promoCode?.discount) discount = subtotal * promoCode.discount;
  if (promoCode?.amount) discount = Math.min(promoCode.amount, subtotal);
  const total = subtotal - discount + shipping;
  const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);

  const applyPromo = () => {
    const found = PROMO_CODES.find(p => p.code === promoInput.toUpperCase().trim());
    if (found) {
      setPromoCode(found);
      showToast(`Promo "${found.code}" applied! ${found.label}`);
      setPromoInput('');
    } else {
      showToast('Invalid promo code');
    }
  };

  const handleCheckout = () => {
    setShowCart(false);
    navigate('/checkout');
  };

  return (
    <>
      <div className="cart-overlay" onClick={() => setShowCart(false)} />
      <div className="cart-drawer" id="cart-drawer" role="dialog" aria-modal="true" aria-label="Shopping cart">
        <div className="cart-drawer__header">
          <h3 className="cart-drawer__title">
            🛒 Your Cart
            <span className="cart-drawer__count">{totalItems} items</span>
          </h3>
          <button className="cart-drawer__close" onClick={() => setShowCart(false)} aria-label="Close cart">✕</button>
        </div>
        <div className="cart-drawer__items">
          {cart.length === 0 ? (
            <div className="cart-drawer__empty">
              <div className="cart-drawer__empty-icon">🛒</div>
              <p>Your cart is empty</p>
              <p style={{ fontSize: '0.78rem', marginTop: '8px' }}>Add some components to get started!</p>
            </div>
          ) : (
            cart.map((item) => (
              <div key={item.id} className="cart-item">
                <div className="cart-item__icon">{item.icon}</div>
                <div className="cart-item__info">
                  <div className="cart-item__name">{item.name}</div>
                  <div className="cart-item__price">${(item.price * item.quantity).toLocaleString()}</div>
                </div>
                <div className="cart-item__controls">
                  <div className="cart-item__qty">
                    <button className="cart-item__qty-btn" onClick={() => updateQuantity(item.id, item.quantity - 1)} aria-label="Decrease quantity">−</button>
                    <span className="cart-item__qty-num">{item.quantity}</span>
                    <button className="cart-item__qty-btn" onClick={() => updateQuantity(item.id, item.quantity + 1)} aria-label="Increase quantity">+</button>
                  </div>
                  <button className="cart-item__remove" onClick={() => removeFromCart(item.id)} aria-label="Remove item">Remove</button>
                </div>
              </div>
            ))
          )}
        </div>
        {cart.length > 0 && (
          <div className="cart-drawer__footer">
            {/* Promo Code */}
            <div className="cart-promo">
              {promoCode ? (
                <div className="cart-promo__applied">
                  <span>🎉 {promoCode.code} — {promoCode.label}</span>
                  <button onClick={() => setPromoCode(null)} aria-label="Remove promo code">✕</button>
                </div>
              ) : (
                <div className="cart-promo__form">
                  <input
                    type="text"
                    placeholder="Promo code"
                    value={promoInput}
                    onChange={(e) => setPromoInput(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && applyPromo()}
                    className="cart-promo__input"
                    aria-label="Enter promo code"
                  />
                  <button className="cart-promo__btn" onClick={applyPromo}>Apply</button>
                </div>
              )}
            </div>
            <div className="cart-drawer__subtotal">
              <span className="cart-drawer__subtotal-label">Subtotal</span>
              <span className="cart-drawer__subtotal-value">${subtotal.toLocaleString()}</span>
            </div>
            {discount > 0 && (
              <div className="cart-drawer__subtotal cart-drawer__discount">
                <span className="cart-drawer__subtotal-label">Discount</span>
                <span className="cart-drawer__subtotal-value">-${discount.toLocaleString()}</span>
              </div>
            )}
            <div className="cart-drawer__subtotal">
              <span className="cart-drawer__subtotal-label">Shipping</span>
              <span className="cart-drawer__subtotal-value">{shipping === 0 ? 'Free' : `$${shipping}`}</span>
            </div>
            <div className="cart-drawer__total">
              <span className="cart-drawer__total-label">Total</span>
              <span className="cart-drawer__total-value">${total.toLocaleString()}</span>
            </div>
            <button className="cart-drawer__checkout" id="checkout-btn" onClick={handleCheckout}>
              Proceed to Checkout
            </button>
          </div>
        )}
      </div>
    </>
  );
}

/* ========================================
   WISHLIST DRAWER
   ======================================== */

function WishlistDrawer() {
  const { wishlist, setShowWishlist, toggleWishlist, addToCart } = useContext(AppContext);

  useEffect(() => {
    document.body.style.overflow = 'hidden';
    const handleKey = (e) => { if (e.key === 'Escape') setShowWishlist(false); };
    window.addEventListener('keydown', handleKey);
    return () => { document.body.style.overflow = ''; window.removeEventListener('keydown', handleKey); };
  }, [setShowWishlist]);

  return (
    <>
      <div className="cart-overlay" onClick={() => setShowWishlist(false)} />
      <div className="cart-drawer wishlist-drawer" id="wishlist-drawer" role="dialog" aria-modal="true" aria-label="Wishlist">
        <div className="cart-drawer__header">
          <h3 className="cart-drawer__title">
            ❤️ Wishlist
            <span className="cart-drawer__count">{wishlist.length} items</span>
          </h3>
          <button className="cart-drawer__close" onClick={() => setShowWishlist(false)} aria-label="Close wishlist">✕</button>
        </div>
        <div className="cart-drawer__items">
          {wishlist.length === 0 ? (
            <div className="cart-drawer__empty">
              <div className="cart-drawer__empty-icon">❤️</div>
              <p>Your wishlist is empty</p>
              <p style={{ fontSize: '0.78rem', marginTop: '8px' }}>Save your favorite components here!</p>
            </div>
          ) : (
            wishlist.map((item) => (
              <div key={item.id} className="cart-item wishlist-item">
                <div className="cart-item__icon">{item.icon}</div>
                <div className="cart-item__info">
                  <div className="cart-item__name">{item.name}</div>
                  <div className="cart-item__price">${item.price.toLocaleString()}</div>
                  <StarRating rating={item.rating} size={10} />
                </div>
                <div className="cart-item__controls">
                  <button className="wishlist-item__cart-btn" onClick={() => addToCart(item)} aria-label="Add to cart">🛒</button>
                  <button className="cart-item__remove" onClick={() => toggleWishlist(item)} aria-label="Remove from wishlist">Remove</button>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </>
  );
}

/* ========================================
   COMPARISON
   ======================================== */

function ComparisonBar() {
  const { compareList, setShowCompare, setCompareList } = useContext(AppContext);
  const products = compareList.map(id => PRODUCTS.find(p => p.id === id)).filter(Boolean);

  return (
    <div className="comparison-bar" role="status" aria-live="polite">
      <div className="comparison-bar__items">
        {products.map(p => (
          <div key={p.id} className="comparison-bar__item">
            <span>{p.icon}</span>
            <span className="comparison-bar__name">{p.name.split(' ').slice(0, 3).join(' ')}</span>
            <button onClick={() => setCompareList(prev => prev.filter(id => id !== p.id))} aria-label={`Remove ${p.name} from comparison`}>✕</button>
          </div>
        ))}
      </div>
      <div className="comparison-bar__actions">
        <button className="comparison-bar__compare-btn" onClick={() => setShowCompare(true)} disabled={compareList.length < 2}>
          Compare ({compareList.length}/3)
        </button>
        <button className="comparison-bar__clear-btn" onClick={() => setCompareList([])}>Clear</button>
      </div>
    </div>
  );
}

function ComparisonModal() {
  const { compareList, setShowCompare, setCompareList } = useContext(AppContext);
  const products = compareList.map(id => PRODUCTS.find(p => p.id === id)).filter(Boolean);

  useEffect(() => {
    document.body.style.overflow = 'hidden';
    const handleKey = (e) => { if (e.key === 'Escape') setShowCompare(false); };
    window.addEventListener('keydown', handleKey);
    return () => { document.body.style.overflow = ''; window.removeEventListener('keydown', handleKey); };
  }, [setShowCompare]);

  const allSpecs = [...new Set(products.flatMap(p => p.details.map(d => d.label)))];

  return (
    <div className="modal-overlay" onClick={() => setShowCompare(false)} role="dialog" aria-modal="true" aria-label="Product comparison">
      <div className="comparison-modal" onClick={(e) => e.stopPropagation()}>
        <div className="comparison-modal__header">
          <h2>⚖️ Product Comparison</h2>
          <button className="modal__close" onClick={() => setShowCompare(false)} aria-label="Close comparison">✕</button>
        </div>
        <div className="comparison-modal__table-wrap">
          <table className="comparison-table">
            <thead>
              <tr>
                <th>Feature</th>
                {products.map(p => (
                  <th key={p.id}>
                    <span className="comparison-table__icon">{p.icon}</span>
                    <span className="comparison-table__name">{p.name}</span>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              <tr><td>Price</td>{products.map(p => <td key={p.id} className="comparison-table__price">${p.price}</td>)}</tr>
              <tr><td>Rating</td>{products.map(p => <td key={p.id}><StarRating rating={p.rating} size={12} showCount count={p.reviews} /></td>)}</tr>
              <tr><td>Category</td>{products.map(p => <td key={p.id}>{p.category.toUpperCase()}</td>)}</tr>
              {allSpecs.map(spec => (
                <tr key={spec}>
                  <td>{spec}</td>
                  {products.map(p => {
                    const detail = p.details.find(d => d.label === spec);
                    return <td key={p.id}>{detail ? detail.value : '—'}</td>;
                  })}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div className="comparison-modal__footer">
          <button className="comparison-modal__clear" onClick={() => { setCompareList([]); setShowCompare(false); }}>Clear All</button>
        </div>
      </div>
    </div>
  );
}

/* ========================================
   BUILD CONFIGURATOR
   ======================================== */

function BuildConfiguratorModal() {
  const { setShowBuild, addToCart, showToast } = useContext(AppContext);
  const [selectedParts, setSelectedParts] = useState({});

  useEffect(() => {
    document.body.style.overflow = 'hidden';
    const handleKey = (e) => { if (e.key === 'Escape') setShowBuild(false); };
    window.addEventListener('keydown', handleKey);
    return () => { document.body.style.overflow = ''; window.removeEventListener('keydown', handleKey); };
  }, [setShowBuild]);

  const buildCategories = CATEGORIES.filter(c => c.id !== 'all');

  const togglePart = (category, product) => {
    setSelectedParts(prev => {
      if (prev[category]?.id === product.id) {
        const next = { ...prev };
        delete next[category];
        return next;
      }
      return { ...prev, [category]: product };
    });
  };

  const total = Object.values(selectedParts).reduce((sum, p) => sum + p.price, 0);
  const partsCount = Object.keys(selectedParts).length;

  const addAllToCart = () => {
    Object.values(selectedParts).forEach(p => addToCart(p));
    showToast(`${partsCount} components added to cart!`);
    setShowBuild(false);
  };

  return (
    <div className="modal-overlay" onClick={() => setShowBuild(false)} role="dialog" aria-modal="true" aria-label="PC Build Configurator">
      <div className="build-modal" onClick={(e) => e.stopPropagation()}>
        <div className="build-modal__header">
          <h2>🏗️ PC Build Configurator</h2>
          <p>Select one component from each category to build your perfect rig</p>
          <button className="modal__close" onClick={() => setShowBuild(false)} aria-label="Close configurator">✕</button>
        </div>
        <div className="build-modal__body">
          {buildCategories.map(cat => {
            const catProducts = PRODUCTS.filter(p => p.category === cat.id);
            const selected = selectedParts[cat.id];
            return (
              <div key={cat.id} className="build-section">
                <h3 className="build-section__title">
                  <span>{cat.icon}</span> {cat.name}
                  {selected && <span className="build-section__check">✓ Selected</span>}
                </h3>
                <div className="build-section__products">
                  {catProducts.map(p => (
                    <div
                      key={p.id}
                      className={`build-product ${selected?.id === p.id ? 'selected' : ''}`}
                      onClick={() => togglePart(cat.id, p)}
                      role="button"
                      tabIndex={0}
                      aria-pressed={selected?.id === p.id}
                    >
                      <span className="build-product__icon">{p.icon}</span>
                      <div className="build-product__info">
                        <div className="build-product__name">{p.name}</div>
                        <div className="build-product__specs">{p.specs}</div>
                      </div>
                      <div className="build-product__price">${p.price}</div>
                      {selected?.id === p.id && <span className="build-product__check">✓</span>}
                    </div>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
        <div className="build-modal__footer">
          <div className="build-modal__summary">
            <span className="build-modal__count">{partsCount}/5 parts selected</span>
            <span className="build-modal__total">${total.toLocaleString()}</span>
          </div>
          <button className="build-modal__add-btn" onClick={addAllToCart} disabled={partsCount === 0}>
            Add All to Cart
          </button>
        </div>
      </div>
    </div>
  );
}

/* ========================================
   RECENTLY VIEWED
   ======================================== */

function RecentlyViewed() {
  const { recentlyViewed, setSelectedProduct, addToRecentlyViewed } = useContext(AppContext);

  if (recentlyViewed.length === 0) return null;

  return (
    <section className="section recently-viewed">
      <div className="section__container">
        <div className="section__header scroll-hidden">
          <span className="section__label">Recently Viewed</span>
          <h2 className="section__title">Pick Up Where You Left Off</h2>
        </div>
        <div className="recently-viewed__scroll">
          {recentlyViewed.map((product) => (
            <div
              key={product.id}
              className="recently-viewed__card animate-in"
              onClick={() => { setSelectedProduct(product); addToRecentlyViewed(product); }}
              role="button"
              tabIndex={0}
            >
              <div className="recently-viewed__icon" style={{ background: product.gradient }}>{product.icon}</div>
              <div className="recently-viewed__name">{product.name}</div>
              <div className="recently-viewed__price">${product.price}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ========================================
   ABOUT / FEATURES
   ======================================== */

function About() {
  return (
    <section className="section about" id="about">
      <div className="section__container">
        <div className="section__header scroll-hidden">
          <span className="section__label">Why Choose Us</span>
          <h2 className="section__title">Built for Enthusiasts</h2>
          <p className="section__description">We're gamers and builders ourselves. Every product, every service is designed with your rig in mind.</p>
        </div>
        <div className="features__grid">
          {FEATURES.map((feature, index) => (
            <div key={index} className={`feature-card scroll-hidden stagger-${index + 1}`}>
              <div className="feature-card__icon">{feature.icon}</div>
              <h3 className="feature-card__title">{feature.title}</h3>
              <p className="feature-card__desc">{feature.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ========================================
   NEWSLETTER
   ======================================== */

function Newsletter() {
  const [email, setEmail] = useState('');
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (email) {
      setSubmitted(true);
      setEmail('');
      setTimeout(() => setSubmitted(false), 3000);
    }
  };

  return (
    <section className="section newsletter" id="newsletter">
      <div className="section__container">
        <div className="newsletter__inner scroll-hidden">
          <h2 className="newsletter__title">Stay in the Loop</h2>
          <p className="newsletter__desc">Get notified about new arrivals, exclusive deals, and build guides.</p>
          {submitted ? (
            <p style={{ color: 'var(--accent-green)', fontWeight: 600 }}>✓ You're subscribed! Welcome to TechForge.</p>
          ) : (
            <form className="newsletter__form" onSubmit={handleSubmit}>
              <input
                type="email" className="newsletter__input" placeholder="Enter your email"
                value={email} onChange={(e) => setEmail(e.target.value)} required
                id="newsletter-email" aria-label="Email address"
              />
              <button type="submit" className="newsletter__btn" id="newsletter-submit">Subscribe</button>
            </form>
          )}
        </div>
      </div>
    </section>
  );
}

/* ========================================
   FOOTER
   ======================================== */

function Footer() {
  const navigate = useNavigate();

  return (
    <footer className="footer" id="footer">
      <div className="footer__container">
        <div className="footer__grid">
          <div className="footer__brand">
            <div className="footer__logo">⚡ TECHFORGE</div>
            <p className="footer__brand-desc">Your one-stop shop for premium PC components. Building dream rigs since 2024.</p>
            <div className="footer__socials">
              <span className="footer__social" role="link" aria-label="Twitter">𝕏</span>
              <span className="footer__social" role="link" aria-label="Facebook">📘</span>
              <span className="footer__social" role="link" aria-label="Instagram">📸</span>
              <span className="footer__social" role="link" aria-label="Discord">🎮</span>
            </div>
          </div>
          <div>
            <h4 className="footer__col-title">Products</h4>
            <span className="footer__link">Graphics Cards</span>
            <span className="footer__link">Processors</span>
            <span className="footer__link">Memory</span>
            <span className="footer__link">Storage</span>
            <span className="footer__link">Motherboards</span>
          </div>
          <div>
            <h4 className="footer__col-title">Company</h4>
            <span className="footer__link">About Us</span>
            <span className="footer__link">Careers</span>
            <span className="footer__link">Blog</span>
            <span className="footer__link">Press Kit</span>
          </div>
          <div>
            <h4 className="footer__col-title">Support</h4>
            <span className="footer__link">Help Center</span>
            <span className="footer__link">Returns</span>
            <span className="footer__link">Warranty</span>
            <span className="footer__link" onClick={() => navigate('/tracking')} style={{ cursor: 'pointer' }}>Track Order</span>
          </div>
        </div>
        <div className="footer__bottom">
          <span className="footer__copyright">© 2024 TechForge. All rights reserved.</span>
          <span className="footer__pwa-badge">⚡ PWA Enabled — Works Offline</span>
        </div>
      </div>
    </footer>
  );
}

/* ========================================
   TOAST
   ======================================== */

function Toast() {
  const { toast } = useContext(AppContext);
  return (
    <div className={`toast ${toast.visible ? 'toast--show' : ''}`} role="alert" aria-live="assertive">
      <span className="toast__icon">✓</span>
      {toast.message}
    </div>
  );
}

/* ========================================
   BACK TO TOP
   ======================================== */

function BackToTop() {
  const [visible, setVisible] = useState(false);
  useEffect(() => {
    const handleScroll = () => setVisible(window.scrollY > 500);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);
  return (
    <button
      className={`back-to-top ${visible ? 'visible' : ''}`}
      onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
      aria-label="Back to top" id="back-to-top"
    >↑</button>
  );
}

/* ========================================
   LIVE CHAT WIDGET
   ======================================== */

function LiveChatWidget() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([
    { from: 'bot', text: CHAT_RESPONSES.greeting, time: new Date() }
  ]);
  const [input, setInput] = useState('');
  const messagesEndRef = useRef(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const getBotResponse = (msg) => {
    const lower = msg.toLowerCase();
    if (lower.includes('shipping') || lower.includes('delivery')) return CHAT_RESPONSES.shipping;
    if (lower.includes('return') || lower.includes('refund')) return CHAT_RESPONSES.returns;
    if (lower.includes('warranty') || lower.includes('guarantee')) return CHAT_RESPONSES.warranty;
    if (lower.includes('price') || lower.includes('discount') || lower.includes('promo') || lower.includes('coupon')) return CHAT_RESPONSES.discount;
    if (lower.includes('pay') || lower.includes('credit') || lower.includes('card')) return CHAT_RESPONSES.payment;
    if (lower.includes('help') || lower.includes('support')) return CHAT_RESPONSES.help;
    if (lower.includes('hello') || lower.includes('hi') || lower.includes('hey')) return CHAT_RESPONSES.greeting;
    return CHAT_RESPONSES.default;
  };

  const sendMessage = (e) => {
    e.preventDefault();
    if (!input.trim()) return;
    const userMsg = { from: 'user', text: input.trim(), time: new Date() };
    setMessages(prev => [...prev, userMsg]);
    setInput('');
    setTimeout(() => {
      setMessages(prev => [...prev, { from: 'bot', text: getBotResponse(input), time: new Date() }]);
    }, 800);
  };

  return (
    <div className={`live-chat ${isOpen ? 'open' : ''}`}>
      {isOpen && (
        <div className="live-chat__window" role="dialog" aria-label="Live chat support">
          <div className="live-chat__header">
            <div className="live-chat__header-info">
              <span className="live-chat__status" />
              <div>
                <div className="live-chat__agent-name">TechForge Support</div>
                <div className="live-chat__agent-status">Online • Typically replies instantly</div>
              </div>
            </div>
            <button className="live-chat__close" onClick={() => setIsOpen(false)} aria-label="Close chat">✕</button>
          </div>
          <div className="live-chat__messages">
            {messages.map((msg, i) => (
              <div key={i} className={`live-chat__message live-chat__message--${msg.from}`}>
                {msg.from === 'bot' && <span className="live-chat__bot-avatar">🤖</span>}
                <div className="live-chat__bubble">{msg.text}</div>
              </div>
            ))}
            <div ref={messagesEndRef} />
          </div>
          <form className="live-chat__input-area" onSubmit={sendMessage}>
            <input
              type="text" className="live-chat__input" placeholder="Type a message..."
              value={input} onChange={(e) => setInput(e.target.value)}
              aria-label="Chat message"
            />
            <button type="submit" className="live-chat__send" aria-label="Send message">➤</button>
          </form>
        </div>
      )}
      <button className="live-chat__trigger" onClick={() => setIsOpen(!isOpen)} aria-label={isOpen ? 'Close chat' : 'Open chat'}>
        {isOpen ? '✕' : '💬'}
      </button>
    </div>
  );
}

/* ========================================
   PWA INSTALL PROMPT
   ======================================== */

function PWAInstallPrompt() {
  const [installPrompt, setInstallPrompt] = useState(null);
  const [showBanner, setShowBanner] = useState(false);

  useEffect(() => {
    const handler = (e) => {
      e.preventDefault();
      setInstallPrompt(e);
      setShowBanner(true);
    };
    window.addEventListener('beforeinstallprompt', handler);
    return () => window.removeEventListener('beforeinstallprompt', handler);
  }, []);

  const handleInstall = async () => {
    if (installPrompt) {
      installPrompt.prompt();
      await installPrompt.userChoice;
      setShowBanner(false);
      setInstallPrompt(null);
    }
  };

  if (!showBanner) return null;

  return (
    <div className="pwa-prompt" role="banner">
      <div className="pwa-prompt__content">
        <span className="pwa-prompt__icon">⚡</span>
        <div>
          <strong>Install TechForge</strong>
          <p>Get a faster, offline-ready experience</p>
        </div>
      </div>
      <div className="pwa-prompt__actions">
        <button className="pwa-prompt__install" onClick={handleInstall}>Install</button>
        <button className="pwa-prompt__dismiss" onClick={() => setShowBanner(false)}>Later</button>
      </div>
    </div>
  );
}

/* ========================================
   CHECKOUT PAGE
   ======================================== */

function CheckoutPage() {
  const { cart, promoCode, setCart, setPromoCode, showToast } = useContext(AppContext);
  const navigate = useNavigate();
  const [form, setForm] = useState({
    firstName: '', lastName: '', email: '', phone: '',
    address: '', city: '', state: '', zip: '',
    cardName: '', cardNumber: '', cardExpiry: '', cardCvv: '',
  });
  const [submitted, setSubmitted] = useState(false);
  const [orderId, setOrderId] = useState('');

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const updateField = (field, value) => setForm(prev => ({ ...prev, [field]: value }));

  const subtotal = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const shipping = subtotal > 500 || promoCode?.freeShipping ? 0 : 29.99;
  let discount = 0;
  if (promoCode?.discount) discount = subtotal * promoCode.discount;
  if (promoCode?.amount) discount = Math.min(promoCode.amount, subtotal);
  const total = subtotal - discount + shipping;

  const handleSubmit = (e) => {
    e.preventDefault();
    const id = 'TF-' + Date.now().toString(36).toUpperCase();
    setOrderId(id);
    setSubmitted(true);
    setCart([]);
    setPromoCode(null);
    showToast('Order placed successfully!');
  };

  if (submitted) {
    return (
      <div className="checkout-page">
        <div className="checkout-success">
          <div className="checkout-success__icon">🎉</div>
          <h2>Order Confirmed!</h2>
          <p>Thank you for your purchase. Your order has been placed successfully.</p>
          <div className="checkout-success__order-id">
            <span>Order ID</span>
            <strong>{orderId}</strong>
          </div>
          <p className="checkout-success__note">You'll receive a confirmation email shortly.</p>
          <div className="checkout-success__actions">
            <button className="checkout-success__track" onClick={() => navigate('/tracking')}>Track Order</button>
            <button className="checkout-success__continue" onClick={() => navigate('/')}>Continue Shopping</button>
          </div>
        </div>
      </div>
    );
  }

  if (cart.length === 0) {
    return (
      <div className="checkout-page">
        <div className="checkout-success">
          <div className="checkout-success__icon">🛒</div>
          <h2>Your Cart is Empty</h2>
          <p>Add some components before checking out.</p>
          <button className="checkout-success__continue" onClick={() => navigate('/')}>Browse Products</button>
        </div>
      </div>
    );
  }

  return (
    <div className="checkout-page">
      <div className="checkout-page__header">
        <button className="checkout-page__back" onClick={() => navigate('/')} aria-label="Go back">← Back to Shop</button>
        <h1>Checkout</h1>
      </div>
      <div className="checkout-page__grid">
        <form className="checkout-form" onSubmit={handleSubmit}>
          <div className="checkout-form__section">
            <h3>📦 Shipping Information</h3>
            <div className="checkout-form__row">
              <div className="checkout-form__field">
                <label htmlFor="checkout-firstName">First Name</label>
                <input id="checkout-firstName" type="text" required value={form.firstName} onChange={(e) => updateField('firstName', e.target.value)} />
              </div>
              <div className="checkout-form__field">
                <label htmlFor="checkout-lastName">Last Name</label>
                <input id="checkout-lastName" type="text" required value={form.lastName} onChange={(e) => updateField('lastName', e.target.value)} />
              </div>
            </div>
            <div className="checkout-form__row">
              <div className="checkout-form__field">
                <label htmlFor="checkout-email">Email</label>
                <input id="checkout-email" type="email" required value={form.email} onChange={(e) => updateField('email', e.target.value)} />
              </div>
              <div className="checkout-form__field">
                <label htmlFor="checkout-phone">Phone</label>
                <input id="checkout-phone" type="tel" value={form.phone} onChange={(e) => updateField('phone', e.target.value)} />
              </div>
            </div>
            <div className="checkout-form__field">
              <label htmlFor="checkout-address">Address</label>
              <input id="checkout-address" type="text" required value={form.address} onChange={(e) => updateField('address', e.target.value)} />
            </div>
            <div className="checkout-form__row checkout-form__row--3">
              <div className="checkout-form__field">
                <label htmlFor="checkout-city">City</label>
                <input id="checkout-city" type="text" required value={form.city} onChange={(e) => updateField('city', e.target.value)} />
              </div>
              <div className="checkout-form__field">
                <label htmlFor="checkout-state">State</label>
                <input id="checkout-state" type="text" required value={form.state} onChange={(e) => updateField('state', e.target.value)} />
              </div>
              <div className="checkout-form__field">
                <label htmlFor="checkout-zip">ZIP Code</label>
                <input id="checkout-zip" type="text" required value={form.zip} onChange={(e) => updateField('zip', e.target.value)} />
              </div>
            </div>
          </div>

          <div className="checkout-form__section">
            <h3>💳 Payment Details</h3>
            <div className="checkout-form__field">
              <label htmlFor="checkout-cardName">Name on Card</label>
              <input id="checkout-cardName" type="text" required value={form.cardName} onChange={(e) => updateField('cardName', e.target.value)} />
            </div>
            <div className="checkout-form__field">
              <label htmlFor="checkout-cardNumber">Card Number</label>
              <input id="checkout-cardNumber" type="text" required placeholder="•••• •••• •••• ••••" maxLength={19}
                value={form.cardNumber}
                onChange={(e) => {
                  const v = e.target.value.replace(/\D/g, '').replace(/(.{4})/g, '$1 ').trim();
                  updateField('cardNumber', v);
                }}
              />
            </div>
            <div className="checkout-form__row">
              <div className="checkout-form__field">
                <label htmlFor="checkout-expiry">Expiry Date</label>
                <input id="checkout-expiry" type="text" required placeholder="MM/YY" maxLength={5}
                  value={form.cardExpiry}
                  onChange={(e) => {
                    let v = e.target.value.replace(/\D/g, '');
                    if (v.length >= 2) v = v.slice(0, 2) + '/' + v.slice(2, 4);
                    updateField('cardExpiry', v);
                  }}
                />
              </div>
              <div className="checkout-form__field">
                <label htmlFor="checkout-cvv">CVV</label>
                <input id="checkout-cvv" type="text" required placeholder="•••" maxLength={4}
                  value={form.cardCvv}
                  onChange={(e) => updateField('cardCvv', e.target.value.replace(/\D/g, ''))}
                />
              </div>
            </div>
          </div>

          <button type="submit" className="checkout-form__submit">
            Place Order — ${total.toLocaleString()}
          </button>
          <p className="checkout-form__secure">🔒 Secured with 256-bit SSL encryption</p>
        </form>

        <div className="checkout-summary">
          <h3>Order Summary</h3>
          <div className="checkout-summary__items">
            {cart.map(item => (
              <div key={item.id} className="checkout-summary__item">
                <span className="checkout-summary__item-icon">{item.icon}</span>
                <div className="checkout-summary__item-info">
                  <span className="checkout-summary__item-name">{item.name}</span>
                  <span className="checkout-summary__item-qty">Qty: {item.quantity}</span>
                </div>
                <span className="checkout-summary__item-price">${(item.price * item.quantity).toLocaleString()}</span>
              </div>
            ))}
          </div>
          <div className="checkout-summary__totals">
            <div className="checkout-summary__row">
              <span>Subtotal</span><span>${subtotal.toLocaleString()}</span>
            </div>
            {discount > 0 && (
              <div className="checkout-summary__row checkout-summary__row--discount">
                <span>Discount ({promoCode?.label})</span><span>-${discount.toLocaleString()}</span>
              </div>
            )}
            <div className="checkout-summary__row">
              <span>Shipping</span><span>{shipping === 0 ? 'Free' : `$${shipping}`}</span>
            </div>
            <div className="checkout-summary__row checkout-summary__row--total">
              <span>Total</span><span>${total.toLocaleString()}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

/* ========================================
   ORDER TRACKING PAGE
   ======================================== */

function OrderTrackingPage() {
  const navigate = useNavigate();
  const [orderId, setOrderId] = useState('');
  const [tracking, setTracking] = useState(null);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const TRACKING_STEPS = [
    { id: 'confirmed', label: 'Order Confirmed', icon: '✅', desc: 'Your order has been received and confirmed.' },
    { id: 'processing', label: 'Processing', icon: '📋', desc: 'We\'re preparing your components with care.' },
    { id: 'shipped', label: 'Shipped', icon: '📦', desc: 'Your package is on its way!' },
    { id: 'out_for_delivery', label: 'Out for Delivery', icon: '🚚', desc: 'Your package is in your area.' },
    { id: 'delivered', label: 'Delivered', icon: '🏠', desc: 'Package delivered successfully!' },
  ];

  const trackOrder = (e) => {
    e.preventDefault();
    if (!orderId.trim()) return;
    const hash = orderId.split('').reduce((a, b) => a + b.charCodeAt(0), 0);
    const stepIndex = (hash % 4) + 1;
    setTracking({
      orderId: orderId.trim().toUpperCase(),
      currentStep: stepIndex,
      estimatedDelivery: new Date(Date.now() + (5 - stepIndex) * 86400000).toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' }),
    });
  };

  return (
    <div className="tracking-page">
      <div className="tracking-page__header">
        <button className="checkout-page__back" onClick={() => navigate('/')} aria-label="Go back">← Back to Shop</button>
        <h1>📦 Track Your Order</h1>
        <p>Enter your order ID to check the status of your delivery</p>
      </div>
      <form className="tracking-form" onSubmit={trackOrder}>
        <input
          type="text" className="tracking-form__input" placeholder="Enter Order ID (e.g. TF-ABC123)"
          value={orderId} onChange={(e) => setOrderId(e.target.value)} required
          aria-label="Order ID"
        />
        <button type="submit" className="tracking-form__btn">Track Order</button>
      </form>
      {tracking && (
        <div className="tracking-result">
          <div className="tracking-result__header">
            <div>
              <div className="tracking-result__order-id">Order: {tracking.orderId}</div>
              <div className="tracking-result__eta">Estimated delivery: {tracking.estimatedDelivery}</div>
            </div>
          </div>
          <div className="tracking-timeline">
            {TRACKING_STEPS.map((step, index) => {
              const isActive = index < tracking.currentStep;
              const isCurrent = index === tracking.currentStep - 1;
              return (
                <div key={step.id} className={`tracking-step ${isActive ? 'active' : ''} ${isCurrent ? 'current' : ''}`}>
                  <div className="tracking-step__indicator">
                    <div className="tracking-step__dot">{isActive ? step.icon : '○'}</div>
                    {index < TRACKING_STEPS.length - 1 && <div className="tracking-step__line" />}
                  </div>
                  <div className="tracking-step__content">
                    <div className="tracking-step__label">{step.label}</div>
                    <div className="tracking-step__desc">{step.desc}</div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}

/* ========================================
   HOME PAGE
   ======================================== */

function HomePage() {
  const ctx = useContext(AppContext);

  // Re-run scroll animations when category changes
  useEffect(() => {
    const timer = setTimeout(() => {
      const observer = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            if (entry.isIntersecting) entry.target.classList.add('scroll-visible');
          });
        },
        { threshold: 0.1 }
      );
      const els = document.querySelectorAll('.scroll-hidden:not(.scroll-visible)');
      els.forEach((el) => observer.observe(el));
      return () => observer.disconnect();
    }, 100);
    return () => clearTimeout(timer);
  }, [ctx.selectedCategory, ctx.loading]);

  return (
    <>
      <Hero />
      <Categories />
      <ProductGrid />
      <RecentlyViewed />
      <About />
      <Newsletter />
      <Footer />
    </>
  );
}

/* ========================================
   MAIN APP
   ======================================== */

function AppContent() {
  const [cart, setCart] = useLocalStorage('techforge-cart', []);
  const [wishlist, setWishlist] = useLocalStorage('techforge-wishlist', []);
  const [theme, setTheme] = useLocalStorage('techforge-theme', 'dark');
  const [recentlyViewed, setRecentlyViewedRaw] = useLocalStorage('techforge-recent', []);
  const [showCart, setShowCart] = useState(false);
  const [showWishlist, setShowWishlist] = useState(false);
  const [showSearch, setShowSearch] = useState(false);
  const [showBuild, setShowBuild] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [compareList, setCompareList] = useState([]);
  const [showCompare, setShowCompare] = useState(false);
  const [toast, setToast] = useState({ message: '', visible: false });
  const [addedItems, setAddedItems] = useState([]);
  const [sortBy, setSortBy] = useState('default');
  const [priceRange, setPriceRange] = useState([0, 9999]);
  const [promoCode, setPromoCode] = useState(null);
  const [loading, setLoading] = useState(false);

  useScrollAnimation();

  // Apply theme
  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
  }, [theme]);

  const showToast = useCallback((message) => {
    setToast({ message, visible: true });
    setTimeout(() => setToast({ message: '', visible: false }), 2500);
  }, []);

  const addToCart = useCallback((product) => {
    setCart((prev) => {
      const existing = prev.find((item) => item.id === product.id);
      if (existing) {
        return prev.map((item) => item.id === product.id ? { ...item, quantity: item.quantity + 1 } : item);
      }
      return [...prev, { ...product, quantity: 1 }];
    });
    setAddedItems((prev) => prev.includes(product.id) ? prev : [...prev, product.id]);
    showToast(`${product.name} added to cart`);
    setTimeout(() => {
      setAddedItems((prev) => prev.filter((id) => id !== product.id));
    }, 2000);
  }, [setCart, showToast]);

  const updateQuantity = useCallback((id, newQty) => {
    if (newQty < 1) return;
    setCart((prev) => prev.map((item) => item.id === id ? { ...item, quantity: newQty } : item));
  }, [setCart]);

  const removeFromCart = useCallback((id) => {
    setCart((prev) => prev.filter((item) => item.id !== id));
  }, [setCart]);

  const toggleWishlist = useCallback((product) => {
    setWishlist((prev) => {
      const exists = prev.some(w => w.id === product.id);
      if (exists) {
        showToast(`${product.name} removed from wishlist`);
        return prev.filter(w => w.id !== product.id);
      }
      showToast(`${product.name} added to wishlist`);
      return [...prev, product];
    });
  }, [setWishlist, showToast]);

  const toggleCompare = useCallback((productId) => {
    setCompareList(prev => {
      if (prev.includes(productId)) return prev.filter(id => id !== productId);
      if (prev.length >= 3) {
        showToast('You can compare up to 3 products');
        return prev;
      }
      return [...prev, productId];
    });
  }, [showToast]);

  const addToRecentlyViewed = useCallback((product) => {
    setRecentlyViewedRaw(prev => {
      const filtered = prev.filter(p => p.id !== product.id);
      return [product, ...filtered].slice(0, 8);
    });
  }, [setRecentlyViewedRaw]);

  const handleCategoryChange = useCallback((cat) => {
    setLoading(true);
    setSelectedCategory(cat);
    setTimeout(() => setLoading(false), 400);
  }, []);

  const contextValue = useMemo(() => ({
    cart, wishlist, theme, recentlyViewed, compareList,
    showCart, showWishlist, showSearch, showBuild,
    selectedProduct, selectedCategory, sortBy, priceRange, promoCode,
    addedItems, toast, loading,
    setCart, setWishlist, setTheme, setShowCart, setShowWishlist, setShowSearch, setShowBuild,
    setSelectedProduct, setSelectedCategory, setCompareList, setShowCompare,
    setSortBy, setPriceRange, setPromoCode,
    addToCart, removeFromCart, updateQuantity,
    toggleWishlist, addToRecentlyViewed, toggleCompare,
    handleCategoryChange, showToast,
  }), [
    cart, wishlist, theme, recentlyViewed, compareList,
    showCart, showWishlist, showSearch, showBuild,
    selectedProduct, selectedCategory, sortBy, priceRange, promoCode,
    addedItems, toast, loading,
    setCart, setWishlist, setTheme, setShowCart, setShowWishlist, setShowSearch, setShowBuild,
    setSelectedProduct, setSelectedCategory, setCompareList, setShowCompare,
    setSortBy, setPriceRange, setPromoCode,
    addToCart, removeFromCart, updateQuantity,
    toggleWishlist, addToRecentlyViewed, toggleCompare,
    handleCategoryChange, showToast,
  ]);

  return (
    <AppContext.Provider value={contextValue}>
      <div className="App">
        <Navbar />
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/checkout" element={<CheckoutPage />} />
          <Route path="/tracking" element={<OrderTrackingPage />} />
        </Routes>

        {showSearch && <SearchOverlay />}
        {selectedProduct && <ProductModal />}
        {showCart && <CartDrawer />}
        {showWishlist && <WishlistDrawer />}
        {showCompare && <ComparisonModal />}
        {showBuild && <BuildConfiguratorModal />}

        <LiveChatWidget />
        <PWAInstallPrompt />
        <Toast />
        <BackToTop />
        {compareList.length > 0 && !showCompare && <ComparisonBar />}
      </div>
    </AppContext.Provider>
  );
}

function App() {
  return (
    <HashRouter>
      <AppContent />
    </HashRouter>
  );
}

export default App;
