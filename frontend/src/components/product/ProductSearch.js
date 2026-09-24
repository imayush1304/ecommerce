import { Fragment } from "react/jsx-runtime";
import { useDispatch, useSelector } from 'react-redux';
import { useEffect, useState } from "react";
import MetaData from "../layouts/MetaData";
import { getProducts } from "../../actions/productAction";
import Products from "../product/Products";
import ProductSkeleton from "../product/ProductSkeleton";
import { toast } from "react-toastify";
import Pagination from 'react-js-pagination';
import { useNavigate, useLocation } from "react-router-dom";
import Slider from "rc-slider";
import 'rc-slider/assets/index.css';
import { Filter, X, SearchX, Star, AlertCircle, RefreshCw } from 'lucide-react';

// These match the actual backend productModel category enum exactly.
// Using as UI config constants (schema-level constants, not dynamic business data).
const SCHEMA_CATEGORIES = [
  'PC Games',
  'PS3 Games',
  'PS4 Games',
  'Nintendo Games',
  'Xbox Games',
  'Business Books',
  'Cooking Books',
  'History Books',
  'Programming Books',
  'Sci-Fi Books',
  'Beauty & Personal Care',
  'Electronics & Gadgets',
  'Fashion & Apparel',
  'Home & Kitchen',
  'Health & Fitness',
  'Books',
  'Home Decor',
  'Kids & Toys',
  'Health & Wellness',
  'Clothing',
];

export default function ProductSearch() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();

  const {
    products = [],
    loading = false,
    error = null,
    productsCount = 0,
    resPerPage = 0
  } = useSelector(state => state.productsState || {});

  const [currentPage, setCurrentPage] = useState(1);
  const [price, setPrice] = useState([1, 150000]);
  const [priceChanged, setPriceChanged] = useState(price);
  const [category, setCategory] = useState(null);
  const [rating, setRating] = useState(0);
  const [showMobileFilters, setShowMobileFilters] = useState(false);
  const [hasAttempted, setHasAttempted] = useState(false);

  const searchParams = new URLSearchParams(location.search);
  const keyword = searchParams.get("keyword") || "";

  // Sync category from URL params
  const urlCategory = searchParams.get("category");
  useEffect(() => {
    if (urlCategory && urlCategory !== category) {
      setCategory(urlCategory);
    }
  }, [urlCategory]);

  const normalizedKeyword = typeof keyword === "string" ? keyword.trim() : "";
  const hasActiveFilters = Boolean(
    normalizedKeyword ||
    category ||
    rating ||
    (priceChanged[0] !== 1 || priceChanged[1] !== 150000)
  );

  const setCurrentPageNo = (pageNo) => setCurrentPage(pageNo);

  useEffect(() => {
    if (error) {
      toast.error(error, { position: "bottom-right" });
      setHasAttempted(true);
      return;
    }
    dispatch(getProducts(keyword, priceChanged, category, rating, currentPage));
    setHasAttempted(true);
  }, [dispatch, keyword, priceChanged, category, rating, currentPage]);

  const clearFilters = () => {
    setCategory(null);
    setRating(0);
    setPrice([1, 150000]);
    setPriceChanged([1, 150000]);
    navigate('/search');
  };

  const handleRetry = () => {
    setHasAttempted(false);
    dispatch(getProducts(keyword, priceChanged, category, rating, currentPage));
  };

  const FilterSidebar = () => (
    <div className="ps-sidebar">
      <div className="ps-filter-header">
        <h3>Filters</h3>
        {hasActiveFilters && (
          <button className="ps-clear-btn" onClick={clearFilters}>Clear All</button>
        )}
      </div>

      <div className="ps-filter-group">
        <h4>Price Range</h4>
        <div
          className="ps-slider-wrap"
          onMouseUp={() => setPriceChanged(price)}
          onTouchEnd={() => setPriceChanged(price)}
        >
          <Slider
            range
            marks={{ 1: "₹1", 150000: "₹1.5L" }}
            min={1}
            max={150000}
            defaultValue={price}
            value={price}
            onChange={setPrice}
            trackStyle={[{ backgroundColor: 'var(--accent)' }]}
            handleStyle={[
              { borderColor: 'var(--accent)', backgroundColor: 'var(--accent)' },
              { borderColor: 'var(--accent)', backgroundColor: 'var(--accent)' }
            ]}
          />
          <div className="ps-price-labels">
            <span>₹{price[0].toLocaleString('en-IN')}</span>
            <span>₹{price[1].toLocaleString('en-IN')}</span>
          </div>
        </div>
      </div>

      <div className="ps-filter-group">
        <h4>Categories</h4>
        <ul className="ps-cat-list">
          {SCHEMA_CATEGORIES.map(cat => (
            <li
              key={cat}
              className={category === cat ? 'active' : ''}
              onClick={() => { setCategory(prev => prev === cat ? null : cat); setCurrentPage(1); }}
            >
              {cat}
            </li>
          ))}
        </ul>
      </div>

      <div className="ps-filter-group">
        <h4>Minimum Rating</h4>
        <ul className="ps-rating-list">
          {[4, 3, 2, 1].map(star => (
            <li
              key={star}
              className={rating === star ? 'active' : ''}
              onClick={() => { setRating(prev => prev === star ? 0 : star); setCurrentPage(1); }}
            >
              <div className="ps-star-row">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} size={14} fill={i < star ? "#fbbf24" : "none"} color={i < star ? "#fbbf24" : "#d1d5db"} />
                ))}
                <span>& up</span>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );

  return (
    <Fragment>
      <MetaData title={normalizedKeyword ? `Search: "${normalizedKeyword}"` : category ? category : 'All Products'} />

      <div className="ps-container">

        {/* Header */}
        <div className="ps-header">
          <div>
            <div className="ps-breadcrumb">
              Home{category ? ` / ${category}` : ''}{normalizedKeyword ? ` / "${normalizedKeyword}"` : ''}
            </div>
            <h1>
              {normalizedKeyword
                ? `Results for "${normalizedKeyword}"`
                : category
                  ? category
                  : 'All Products'}
            </h1>
            {!loading && hasAttempted && (
              <p className="ps-count">
                {productsCount > 0
                  ? `Showing ${productsCount} ${productsCount === 1 ? 'product' : 'products'}`
                  : 'No products found'}
              </p>
            )}
          </div>
          <button className="da-btn da-btn-outline mobile-filter-btn" onClick={() => setShowMobileFilters(true)}>
            <Filter size={18} /> Filters
          </button>
        </div>

        <div className="ps-layout">
          {/* Desktop Sidebar */}
          <div className="ps-sidebar-desktop">
            <FilterSidebar />
          </div>

          {/* Mobile Sidebar Overlay */}
          {showMobileFilters && (
            <div className="ps-mobile-overlay">
              <div className="ps-mobile-sidebar">
                <div className="ps-mobile-header">
                  <h2>Filters</h2>
                  <button className="da-icon-btn" onClick={() => setShowMobileFilters(false)} aria-label="Close filters">
                    <X size={24} />
                  </button>
                </div>
                <div className="ps-mobile-body">
                  <FilterSidebar />
                </div>
                <div className="ps-mobile-footer">
                  <button className="da-btn da-btn-primary" style={{ width: '100%' }} onClick={() => setShowMobileFilters(false)}>
                    Apply Filters
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Main Content */}
          <div className="ps-main">

            {/* Error State */}
            {error && hasAttempted && (
              <div className="vip-error-state" style={{ minHeight: '40vh' }}>
                <AlertCircle size={48} color="var(--error)" />
                <h3>Couldn't Load Products</h3>
                <p>Something went wrong. Please try again.</p>
                <button className="da-btn da-btn-primary" onClick={handleRetry}>
                  <RefreshCw size={16} /> Try Again
                </button>
              </div>
            )}

            {/* Loading State */}
            {loading && !error && (
              <div className="products-grid-home" style={{ marginTop: 0 }}>
                {Array.from({ length: 8 }).map((_, i) => (
                  <ProductSkeleton key={i} />
                ))}
              </div>
            )}

            {/* Empty State */}
            {!loading && !error && hasAttempted && products.length === 0 && (
              <div className="ps-empty">
                <SearchX size={64} color="var(--muted-2)" style={{ marginBottom: '1rem' }} />
                <h3>No products found</h3>
                <p>Try adjusting your search or removing some filters.</p>
                {hasActiveFilters && (
                  <button className="da-btn da-btn-primary mt-3" onClick={clearFilters}>
                    Clear Filters
                  </button>
                )}
              </div>
            )}

            {/* Products Grid */}
            {!loading && !error && products.length > 0 && (
              <div className="products-grid-home" style={{ marginTop: 0 }}>
                {products.map(product => (
                  <Products key={product._id} product={product} />
                ))}
              </div>
            )}

            {/* Pagination — only when not loading and has results */}
            {!loading && !error && productsCount > resPerPage && (
              <div className="pagination-wrap">
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
          </div>
        </div>
      </div>
    </Fragment>
  );
}
