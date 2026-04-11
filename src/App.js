import React, { useState, useEffect, useCallback, useRef } from 'react';
import './App.css';

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
    id: 1,
    name: 'NVIDIA GeForce RTX 4090',
    category: 'gpu',
    price: 1599,
    tag: 'hot',
    icon: '🎮',
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
    id: 2,
    name: 'AMD Radeon RX 7900 XTX',
    category: 'gpu',
    price: 949,
    tag: 'new',
    icon: '🎮',
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
    id: 3,
    name: 'NVIDIA GeForce RTX 4070 Ti',
    category: 'gpu',
    price: 799,
    tag: 'sale',
    icon: '🎮',
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
    id: 4,
    name: 'AMD Ryzen 9 7950X',
    category: 'cpu',
    price: 549,
    tag: 'hot',
    icon: '⚡',
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
    id: 5,
    name: 'Intel Core i9-14900K',
    category: 'cpu',
    price: 589,
    tag: 'new',
    icon: '⚡',
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
    id: 6,
    name: 'AMD Ryzen 7 7800X3D',
    category: 'cpu',
    price: 349,
    tag: 'hot',
    icon: '⚡',
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
    id: 7,
    name: 'Corsair Vengeance DDR5 32GB',
    category: 'ram',
    price: 119,
    tag: 'sale',
    icon: '🧩',
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
    id: 8,
    name: 'G.Skill Trident Z5 RGB 32GB',
    category: 'ram',
    price: 139,
    tag: 'new',
    icon: '🧩',
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
    id: 9,
    name: 'Samsung 990 Pro 2TB NVMe',
    category: 'storage',
    price: 159,
    tag: 'hot',
    icon: '💾',
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
    id: 10,
    name: 'WD Black SN850X 1TB',
    category: 'storage',
    price: 89,
    tag: 'sale',
    icon: '💾',
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
    id: 11,
    name: 'ASUS ROG Strix X670E-E',
    category: 'motherboard',
    price: 399,
    tag: 'hot',
    icon: '🔲',
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
    id: 12,
    name: 'MSI MAG B650 Tomahawk',
    category: 'motherboard',
    price: 219,
    tag: 'new',
    icon: '🔲',
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
  {
    icon: '🚀',
    title: 'Blazing Fast Shipping',
    desc: 'Free next-day delivery on all orders over $500. Get your parts faster and start building sooner.',
  },
  {
    icon: '🛡️',
    title: 'Warranty Protection',
    desc: 'Every product comes with manufacturer warranty plus our extended 2-year TechForge guarantee.',
  },
  {
    icon: '💎',
    title: '100% Authentic Parts',
    desc: 'We source directly from manufacturers. Every component is genuine and factory sealed.',
  },
  {
    icon: '🔧',
    title: 'Expert Build Support',
    desc: 'Our team of PC enthusiasts provides free build consultation and technical support 24/7.',
  },
];

/* ========================================
   CUSTOM HOOKS
   ======================================== */

function useScrollAnimation() {
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('scroll-visible');
          }
        });
      },
      { threshold: 0.1, rootMargin: '0px 0px -50px 0px' }
    );

    const elements = document.querySelectorAll('.scroll-hidden');
    elements.forEach((el) => observer.observe(el));

    return () => observer.disconnect();
  }, []);
}

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

/* ========================================
   COMPONENTS
   ======================================== */

/* ---- Navbar ---- */
function Navbar({ cartCount, onCartClick, onNavClick }) {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 30);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleNavClick = (section) => {
    setMobileOpen(false);
    onNavClick(section);
  };

  return (
    <nav className={`navbar ${scrolled ? 'scrolled' : ''}`} id="navbar">
      <div className="navbar__logo" onClick={() => onNavClick('hero')}>
        <span className="navbar__logo-icon">⚡</span>
        TECHFORGE
      </div>
      <div className={`navbar__links ${mobileOpen ? 'open' : ''}`}>
        <span className="navbar__link" onClick={() => handleNavClick('products')}>Products</span>
        <span className="navbar__link" onClick={() => handleNavClick('categories')}>Categories</span>
        <span className="navbar__link" onClick={() => handleNavClick('about')}>Why Us</span>
        <span className="navbar__link" onClick={() => handleNavClick('newsletter')}>Contact</span>
      </div>
      <div className="navbar__actions">
        <button className="navbar__cart-btn" onClick={onCartClick} id="cart-button">
          🛒
          {cartCount > 0 && (
            <span className="navbar__cart-badge">{cartCount}</span>
          )}
        </button>
        <button
          className="navbar__mobile-toggle"
          onClick={() => setMobileOpen(!mobileOpen)}
          aria-label="Toggle menu"
        >
          {mobileOpen ? '✕' : '☰'}
        </button>
      </div>
    </nav>
  );
}

/* ---- Hero ---- */
function Hero({ onShopClick }) {
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
          <button className="hero__cta hero__cta--primary" onClick={onShopClick} id="shop-now-btn">
            Shop Now
          </button>
          <button className="hero__cta hero__cta--secondary" onClick={onShopClick}>
            Browse Catalog
          </button>
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

/* ---- Categories ---- */
function Categories({ selectedCategory, onCategorySelect }) {
  return (
    <section className="section categories" id="categories">
      <div className="section__container">
        <div className="section__header scroll-hidden">
          <span className="section__label">Browse By Category</span>
          <h2 className="section__title">Find Your Components</h2>
          <p className="section__description">
            From flagship GPUs to high-speed storage — explore our curated collection of premium PC parts.
          </p>
        </div>
        <div className="categories__grid">
          {CATEGORIES.map((cat, index) => (
            <div
              key={cat.id}
              className={`category-card scroll-hidden stagger-${index + 1} ${selectedCategory === cat.id ? 'active' : ''}`}
              onClick={() => onCategorySelect(cat.id)}
              id={`category-${cat.id}`}
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

/* ---- Product Card ---- */
function ProductCard({ product, onAddToCart, onClick, addedItems }) {
  const isAdded = addedItems.includes(product.id);

  return (
    <div className="product-card scroll-hidden" onClick={() => onClick(product)} id={`product-${product.id}`}>
      <div className="product-card__image" style={{ background: product.gradient }}>
        <span className="product-card__image-icon">{product.icon}</span>
        {product.tag && (
          <span className={`product-card__tag product-card__tag--${product.tag}`}>
            {product.tag === 'hot' ? '🔥 Hot' : product.tag === 'new' ? '✨ New' : '💰 Sale'}
          </span>
        )}
      </div>
      <div className="product-card__body">
        <div className="product-card__category">{product.category}</div>
        <h3 className="product-card__name">{product.name}</h3>
        <p className="product-card__specs">{product.specs}</p>
        <div className="product-card__footer">
          <span className="product-card__price">${product.price}</span>
          <button
            className={`product-card__add-btn ${isAdded ? 'product-card__add-btn--added' : ''}`}
            onClick={(e) => {
              e.stopPropagation();
              onAddToCart(product);
            }}
            id={`add-to-cart-${product.id}`}
          >
            {isAdded ? '✓ Added' : 'Add to Cart'}
          </button>
        </div>
      </div>
    </div>
  );
}

/* ---- Product Grid ---- */
function ProductGrid({ selectedCategory, onAddToCart, onProductClick, addedItems }) {
  const filtered = selectedCategory === 'all'
    ? PRODUCTS
    : PRODUCTS.filter((p) => p.category === selectedCategory);

  return (
    <section className="section products" id="products">
      <div className="section__container">
        <div className="section__header scroll-hidden">
          <span className="section__label">Our Collection</span>
          <h2 className="section__title">Premium Components</h2>
          <p className="section__description">
            Every part is carefully selected and verified for peak performance.
          </p>
        </div>
        <div className="products__grid">
          {filtered.map((product) => (
            <ProductCard
              key={product.id}
              product={product}
              onAddToCart={onAddToCart}
              onClick={onProductClick}
              addedItems={addedItems}
            />
          ))}
        </div>
      </div>
    </section>
  );
}

/* ---- Product Modal ---- */
function ProductModal({ product, onClose, onAddToCart }) {
  useEffect(() => {
    document.body.style.overflow = 'hidden';
    return () => { document.body.style.overflow = ''; };
  }, []);

  if (!product) return null;

  return (
    <div className="modal-overlay" onClick={onClose} id="product-modal">
      <div className="modal" onClick={(e) => e.stopPropagation()}>
        <div className="modal__image" style={{ background: product.gradient }}>
          <span className="modal__image-icon">{product.icon}</span>
          <button className="modal__close" onClick={onClose}>✕</button>
        </div>
        <div className="modal__body">
          <div className="modal__category">{product.category}</div>
          <h2 className="modal__name">{product.name}</h2>
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
            <span className="modal__price">${product.price}</span>
            <button
              className="modal__add-btn"
              onClick={() => onAddToCart(product)}
              id="modal-add-to-cart"
            >
              Add to Cart
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

/* ---- Cart Drawer ---- */
function CartDrawer({ cart, onClose, onUpdateQuantity, onRemoveItem }) {
  useEffect(() => {
    document.body.style.overflow = 'hidden';
    return () => { document.body.style.overflow = ''; };
  }, []);

  const subtotal = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const shipping = subtotal > 500 ? 0 : 29.99;
  const total = subtotal + shipping;
  const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);

  return (
    <>
      <div className="cart-overlay" onClick={onClose} />
      <div className="cart-drawer" id="cart-drawer">
        <div className="cart-drawer__header">
          <h3 className="cart-drawer__title">
            🛒 Your Cart
            <span className="cart-drawer__count">{totalItems} items</span>
          </h3>
          <button className="cart-drawer__close" onClick={onClose}>✕</button>
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
                    <button
                      className="cart-item__qty-btn"
                      onClick={() => onUpdateQuantity(item.id, item.quantity - 1)}
                    >
                      −
                    </button>
                    <span className="cart-item__qty-num">{item.quantity}</span>
                    <button
                      className="cart-item__qty-btn"
                      onClick={() => onUpdateQuantity(item.id, item.quantity + 1)}
                    >
                      +
                    </button>
                  </div>
                  <button className="cart-item__remove" onClick={() => onRemoveItem(item.id)}>
                    Remove
                  </button>
                </div>
              </div>
            ))
          )}
        </div>

        {cart.length > 0 && (
          <div className="cart-drawer__footer">
            <div className="cart-drawer__subtotal">
              <span className="cart-drawer__subtotal-label">Subtotal</span>
              <span className="cart-drawer__subtotal-value">${subtotal.toLocaleString()}</span>
            </div>
            <div className="cart-drawer__subtotal">
              <span className="cart-drawer__subtotal-label">Shipping</span>
              <span className="cart-drawer__subtotal-value">
                {shipping === 0 ? 'Free' : `$${shipping}`}
              </span>
            </div>
            <div className="cart-drawer__total">
              <span className="cart-drawer__total-label">Total</span>
              <span className="cart-drawer__total-value">${total.toLocaleString()}</span>
            </div>
            <button className="cart-drawer__checkout" id="checkout-btn">
              Proceed to Checkout
            </button>
          </div>
        )}
      </div>
    </>
  );
}

/* ---- Features / About ---- */
function About() {
  return (
    <section className="section about" id="about">
      <div className="section__container">
        <div className="section__header scroll-hidden">
          <span className="section__label">Why Choose Us</span>
          <h2 className="section__title">Built for Enthusiasts</h2>
          <p className="section__description">
            We're gamers and builders ourselves. Every product, every service is designed with your rig in mind.
          </p>
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

/* ---- Newsletter ---- */
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
          <p className="newsletter__desc">
            Get notified about new arrivals, exclusive deals, and build guides.
          </p>
          {submitted ? (
            <p style={{ color: 'var(--accent-green)', fontWeight: 600 }}>
              ✓ You're subscribed! Welcome to TechForge.
            </p>
          ) : (
            <form className="newsletter__form" onSubmit={handleSubmit}>
              <input
                type="email"
                className="newsletter__input"
                placeholder="Enter your email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                id="newsletter-email"
              />
              <button type="submit" className="newsletter__btn" id="newsletter-submit">
                Subscribe
              </button>
            </form>
          )}
        </div>
      </div>
    </section>
  );
}

/* ---- Footer ---- */
function Footer() {
  return (
    <footer className="footer" id="footer">
      <div className="footer__container">
        <div className="footer__grid">
          <div className="footer__brand">
            <div className="footer__logo">⚡ TECHFORGE</div>
            <p className="footer__brand-desc">
              Your one-stop shop for premium PC components. Building dream rigs since 2024.
            </p>
            <div className="footer__socials">
              <span className="footer__social">𝕏</span>
              <span className="footer__social">📘</span>
              <span className="footer__social">📸</span>
              <span className="footer__social">🎮</span>
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
            <span className="footer__link">Contact Us</span>
          </div>
        </div>
        <div className="footer__bottom">
          <span className="footer__copyright">
            © 2024 TechForge. All rights reserved.
          </span>
          <span className="footer__pwa-badge">
            ⚡ PWA Enabled — Works Offline
          </span>
        </div>
      </div>
    </footer>
  );
}

/* ---- Toast ---- */
function Toast({ message, visible }) {
  return (
    <div className={`toast ${visible ? 'toast--show' : ''}`}>
      <span className="toast__icon">✓</span>
      {message}
    </div>
  );
}

/* ---- Back to Top ---- */
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
      aria-label="Back to top"
      id="back-to-top"
    >
      ↑
    </button>
  );
}

/* ========================================
   MAIN APP
   ======================================== */

function App() {
  const [cart, setCart] = useLocalStorage('techforge-cart', []);
  const [showCart, setShowCart] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [toast, setToast] = useState({ message: '', visible: false });
  const [addedItems, setAddedItems] = useState([]);

  // Initialize scroll animations
  useScrollAnimation();

  // Re-run scroll animations when category changes
  useEffect(() => {
    const timer = setTimeout(() => {
      const observer = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            if (entry.isIntersecting) {
              entry.target.classList.add('scroll-visible');
            }
          });
        },
        { threshold: 0.1 }
      );

      document.querySelectorAll('.scroll-hidden:not(.scroll-visible)').forEach((el) => {
        observer.observe(el);
      });

      return () => observer.disconnect();
    }, 50);

    return () => clearTimeout(timer);
  }, [selectedCategory]);

  const showToast = useCallback((message) => {
    setToast({ message, visible: true });
    setTimeout(() => setToast({ message: '', visible: false }), 2500);
  }, []);

  const addToCart = useCallback((product) => {
    setCart((prev) => {
      const existing = prev.find((item) => item.id === product.id);
      if (existing) {
        return prev.map((item) =>
          item.id === product.id
            ? { ...item, quantity: item.quantity + 1 }
            : item
        );
      }
      return [...prev, { ...product, quantity: 1 }];
    });

    setAddedItems((prev) => {
      if (!prev.includes(product.id)) return [...prev, product.id];
      return prev;
    });

    showToast(`${product.name} added to cart`);

    // Reset "Added" state after 2 seconds
    setTimeout(() => {
      setAddedItems((prev) => prev.filter((id) => id !== product.id));
    }, 2000);
  }, [setCart, showToast]);

  const updateQuantity = useCallback((id, newQty) => {
    if (newQty < 1) return;
    setCart((prev) =>
      prev.map((item) =>
        item.id === id ? { ...item, quantity: newQty } : item
      )
    );
  }, [setCart]);

  const removeItem = useCallback((id) => {
    setCart((prev) => prev.filter((item) => item.id !== id));
  }, [setCart]);

  const scrollToSection = useCallback((sectionId) => {
    const el = document.getElementById(sectionId);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  }, []);

  const cartCount = cart.reduce((sum, item) => sum + item.quantity, 0);

  return (
    <div className="App">
      <Navbar
        cartCount={cartCount}
        onCartClick={() => setShowCart(true)}
        onNavClick={scrollToSection}
      />

      <Hero onShopClick={() => scrollToSection('products')} />

      <Categories
        selectedCategory={selectedCategory}
        onCategorySelect={setSelectedCategory}
      />

      <ProductGrid
        selectedCategory={selectedCategory}
        onAddToCart={addToCart}
        onProductClick={setSelectedProduct}
        addedItems={addedItems}
      />

      <About />
      <Newsletter />
      <Footer />

      {selectedProduct && (
        <ProductModal
          product={selectedProduct}
          onClose={() => setSelectedProduct(null)}
          onAddToCart={(product) => {
            addToCart(product);
            setSelectedProduct(null);
          }}
        />
      )}

      {showCart && (
        <CartDrawer
          cart={cart}
          onClose={() => setShowCart(false)}
          onUpdateQuantity={updateQuantity}
          onRemoveItem={removeItem}
        />
      )}

      <Toast message={toast.message} visible={toast.visible} />
      <BackToTop />
    </div>
  );
}

export default App;
