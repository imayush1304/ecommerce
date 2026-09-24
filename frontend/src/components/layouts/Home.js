import { Fragment } from "react/jsx-runtime";
import { useDispatch, useSelector } from 'react-redux';
import { useEffect, useMemo, useState } from "react";
import MetaData from "./MetaData";
import { getProducts } from "../../actions/productAction";
import Products from "../product/Products";
import ProductSkeleton from "../product/ProductSkeleton";
import { toast } from "react-toastify";
import Pagination from 'react-js-pagination';
import { useNavigate } from "react-router-dom";
import { TrendingUp, Tag, Zap, AlertCircle, RefreshCw } from 'lucide-react';

// These match the actual backend productModel category enum exactly.
// Using as UI config constants (schema-level, not dynamic business data).
const SCHEMA_CATEGORIES = [
  { label: "PC Games",              icon: "🖥️" },
  { label: "PS3 Games",             icon: "🎮" },
  { label: "PS4 Games",             icon: "🎮" },
  { label: "Nintendo Games",        icon: "🕹️" },
  { label: "Xbox Games",            icon: "🎯" },
  { label: "Business Books",        icon: "💼" },
  { label: "Cooking Books",         icon: "🍳" },
  { label: "History Books",         icon: "📜" },
  { label: "Programming Books",     icon: "💻" },
  { label: "Sci-Fi Books",          icon: "🚀" },
  { label: "Beauty & Personal Care",icon: "💄" },
  { label: "Electronics & Gadgets", icon: "⚡" },
  { label: "Fashion & Apparel",     icon: "👗" },
  { label: "Home & Kitchen",        icon: "🏠" },
  { label: "Health & Fitness",      icon: "🏋️" },
  { label: "Books",                 icon: "📚" },
  { label: "Home Decor",            icon: "🪑" },
  { label: "Kids & Toys",           icon: "🧨" },
  { label: "Health & Wellness",     icon: "💚" },
  { label: "Clothing",              icon: "👕" },
];

export default function Home() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const {
    products = [],
    loading = false,
    error = null,
    productsCount = 0,
    resPerPage = 0
  } = useSelector(state => state.productsState || {});

  const [currentPage, setCurrentPage] = useState(1);
  const [activeCategory, setActiveCategory] = useState(null);
  const [hasAttempted, setHasAttempted] = useState(false);

  const setCurrentPageNo = (pageNo) => setCurrentPage(pageNo);

  useEffect(() => {
    if (error) {
      toast.error(error, { position: "bottom-right" });
      setHasAttempted(true);
      return;
    }
    dispatch(getProducts("", null, activeCategory, null, currentPage));
    setHasAttempted(true);
  }, [error, dispatch, currentPage, activeCategory]);

  const handleCategoryFilter = (val) => {
    setActiveCategory(prev => prev === val ? null : val);
    setCurrentPage(1);
  };

  const handleRetry = () => {
    setHasAttempted(false);
    dispatch(getProducts("", null, activeCategory, null, currentPage));
  };

  // Derive distinct sections from actual API products — no hardcoded IDs
  const featuredProducts = products.slice(0, 4);
  const trendingProducts = products.slice(4, 8);
  const newArrivals     = products.slice(8, 16);

  // Derive unique sellers/brands dynamically from actual product data
  const dynamicBrands = useMemo(() => {
    const sellers = products
      .map(p => p.seller)
      .filter(Boolean);
    return [...new Set(sellers)].slice(0, 8);
  }, [products]);

  const skeletonCount = 4;

  return (
    <Fragment>
      <MetaData title={'VIPcart — Premium Shopping Destination'} />

      {/* ── Hero Section ── */}
      <section className="hero-section" style={{ minHeight: '80vh', marginTop: '1rem', borderRadius: 'var(--radius-lg)' }}>
        <div className="hero-glow" />
        <div className="hero-content">
          <div className="hero-badges">
            <span className="hero-badge" style={{ background: 'var(--accent-light)', color: 'var(--accent)' }}>
              🛍️ Explore Our Collection
            </span>
          </div>
          <h1 className="hero-title" style={{ fontSize: 'clamp(2rem, 5vw, 4rem)', fontWeight: 900 }}>
            Discover Your<br />
            <span className="hero-accent">Perfect Style.</span>
          </h1>
          <p className="hero-subtitle" style={{ fontSize: '1.1rem', maxWidth: '480px' }}>
            Shop from a curated collection of premium electronics, fashion, accessories, and more.
          </p>
          <div className="hero-cta-row" style={{ marginTop: '2.5rem' }}>
            <button className="da-btn da-btn-primary" onClick={() => navigate('/search/')} style={{ padding: '1rem 2.5rem', fontSize: '1.05rem' }}>
              Shop Now
            </button>
            <button
              className="da-btn da-btn-outline"
              onClick={() => document.getElementById('all-products')?.scrollIntoView({ behavior: 'smooth' })}
              style={{ padding: '1rem 2.5rem', fontSize: '1.05rem' }}
            >
              Browse All
            </button>
          </div>
        </div>
        <div className="hero-visual" style={{ right: '5%', top: '15%' }}>
          <div className="hero-shape-blob" />
        </div>
      </section>

      {/* ── Featured Categories (from schema enum) ── */}
      <section className="hm-section">
        <div className="hm-section-header">
          <h2>Browse Categories</h2>
        </div>
        <div className="hm-categories-grid">
          {SCHEMA_CATEGORIES.map(cat => (
            <div
              key={cat.label}
              className={`hm-category-card ${activeCategory === cat.label ? 'active' : ''}`}
              onClick={() => handleCategoryFilter(cat.label)}
              role="button"
              tabIndex={0}
              onKeyDown={e => e.key === 'Enter' && handleCategoryFilter(cat.label)}
            >
              <div className="hm-cat-icon">{cat.icon}</div>
              <h3>{cat.label}</h3>
              <p>{activeCategory === cat.label ? 'Active' : 'Explore'}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ── Error State ── */}
      {error && hasAttempted && (
        <section className="hm-section">
          <div className="vip-error-state">
            <AlertCircle size={48} color="var(--error)" />
            <h3>Couldn't Load Products</h3>
            <p>Something went wrong while fetching products. Please try again.</p>
            <button className="da-btn da-btn-primary" onClick={handleRetry}>
              <RefreshCw size={16} /> Try Again
            </button>
          </div>
        </section>
      )}

      {/* ── Featured Products ── */}
      {!error && (
        <section className="hm-section">
          <div className="hm-section-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <h2 style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', margin: 0 }}>
              <Zap color="var(--accent)" fill="var(--accent)" size={22} /> Featured Products
            </h2>
            <button className="da-btn da-btn-outline" onClick={() => navigate('/search/')}>View All</button>
          </div>
          <div className="products-grid-home">
            {loading
              ? Array.from({ length: skeletonCount }).map((_, i) => <ProductSkeleton key={i} />)
              : featuredProducts.length > 0
                ? featuredProducts.map(product => (
                    <Products key={product._id} product={product} />
                  ))
                : !loading && hasAttempted && (
                    <div className="vip-empty-state" style={{ gridColumn: '1 / -1' }}>
                      <p>No products available. Check back soon!</p>
                    </div>
                  )
            }
          </div>
        </section>
      )}

      {/* ── Trending Products ── */}
      {!error && (trendingProducts.length > 0 || loading) && (
        <section className="hm-section">
          <div className="hm-section-header">
            <h2 style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <TrendingUp color="var(--accent)" size={22} /> Trending Now
            </h2>
          </div>
          <div className="products-grid-home">
            {loading
              ? Array.from({ length: skeletonCount }).map((_, i) => <ProductSkeleton key={i} />)
              : trendingProducts.map(product => (
                  <Products key={product._id} product={product} />
                ))
            }
          </div>
        </section>
      )}

      {/* ── New Arrivals ── */}
      {!error && (newArrivals.length > 0 || loading) && (
        <section id="all-products" className="hm-section">
          <div className="hm-section-header">
            <h2 style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <Tag color="var(--accent)" size={22} /> New Arrivals
            </h2>
          </div>
          <div className="products-grid-home">
            {loading
              ? Array.from({ length: 8 }).map((_, i) => <ProductSkeleton key={i} />)
              : newArrivals.map(product => (
                  <Products key={product._id} product={product} />
                ))
            }
          </div>
        </section>
      )}

      {/* ── Shop by Brand (dynamically derived from actual product sellers) ── */}
      {!loading && dynamicBrands.length > 0 && (
        <section className="hm-section">
          <div className="hm-section-header">
            <h2>Shop by Brand</h2>
          </div>
          <div className="hm-brands-grid">
            {dynamicBrands.map(brand => (
              <div
                key={brand}
                className="hm-brand-card"
                onClick={() => navigate(`/search/?keyword=${encodeURIComponent(brand)}`)}
                role="button"
                tabIndex={0}
                onKeyDown={e => e.key === 'Enter' && navigate(`/search/?keyword=${encodeURIComponent(brand)}`)}
              >
                <h3>{brand}</h3>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* ── Pagination ── */}
      {!loading && productsCount > 0 && productsCount > resPerPage && (
        <div className="pagination-wrap" style={{ marginTop: '3rem' }}>
          <Pagination
            activePage={currentPage}
            onChange={setCurrentPageNo}
            totalItemsCount={productsCount}
            itemsCountPerPage={resPerPage}
            nextPageText={'Next'}
            firstPageText={'First'}
            lastPageText={'Last'}
            itemClass={"page-item"}
            linkClass={"page-link"}
          />
        </div>
      )}

    </Fragment>
  );
}