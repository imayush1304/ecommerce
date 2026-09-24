import { useEffect, useState } from "react";
import { Fragment } from "react/jsx-runtime";
import { createReview, getProduct } from "../../actions/productAction";
import { useDispatch, useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import MetaData from "../layouts/MetaData";
import { addCartItem } from "../../actions/cartActions";
import { Modal } from 'react-bootstrap'
import { toast } from "react-toastify";
import { clearReviewSubmitted, clearError, clearProduct } from '../../slices/productSlice';
import { Star, Truck, ShieldCheck, RefreshCw, ShoppingCart, Heart, AlertCircle } from 'lucide-react';
import { toggleWishlist } from "../../actions/userActions";

// ── Skeleton for product detail loading state ──
function ProductDetailSkeleton() {
  return (
    <div className="pd-container">
      <div className="pd-main-grid">
        <div className="pd-gallery">
          <div className="pd-thumbnails">
            {[0,1,2].map(i => (
              <div key={i} className="pd-thumb">
                <div className="skeleton-block" style={{ width: '100%', height: '100%', borderRadius: 8 }} />
              </div>
            ))}
          </div>
          <div className="pd-main-image">
            <div className="skeleton-block" style={{ width: '100%', height: '400px', borderRadius: 'var(--radius)' }} />
          </div>
        </div>
        <div className="pd-info">
          <div className="skeleton-block" style={{ height: 32, width: '80%', marginBottom: 16, borderRadius: 6 }} />
          <div className="skeleton-block" style={{ height: 18, width: '50%', marginBottom: 12, borderRadius: 6 }} />
          <div className="skeleton-block" style={{ height: 28, width: '35%', marginBottom: 16, borderRadius: 6 }} />
          <div className="skeleton-block" style={{ height: 80, width: '100%', marginBottom: 16, borderRadius: 6 }} />
          <div className="skeleton-block" style={{ height: 52, width: '100%', borderRadius: 12 }} />
        </div>
      </div>
    </div>
  );
}

// ── Error state ──
function ProductDetailError({ error, onRetry }) {
  return (
    <div className="vip-error-state" style={{ minHeight: '50vh' }}>
      <AlertCircle size={56} color="var(--error)" />
      <h3>Failed to Load Product</h3>
      <p>{error || 'Something went wrong. Please try again.'}</p>
      <button className="da-btn da-btn-primary" onClick={onRetry}>
        <RefreshCw size={16} /> Try Again
      </button>
    </div>
  );
}

export default function ProductDetail() {
  const productState = useSelector((state) => state.productState || {});
  const product = productState.product || {};
  const loading = productState.loading ?? false;
  const isReviewSubmitted = productState.isReviewSubmitted ?? false;
  const error = productState.error ?? null;
  const { user, isAuthenticated } = useSelector((state) => state.authState);

  const dispatch = useDispatch();
  const { id } = useParams();
  const [quantity, setQuantity] = useState(1);
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const [activeTab, setActiveTab] = useState('description');

  const inWishlist = user?.wishlist?.some(w => w._id === product._id || w === product._id);

  const increaseQuantity = () => {
    const stock = product?.stock ?? 0;
    setQuantity(prev => {
      const next = prev + 1;
      if (stock === 0) return prev;
      return next > stock ? stock : next;
    });
  };

  const decreaseQuantity = () => {
    setQuantity(prev => {
      const next = prev - 1;
      return next < 1 ? 1 : next;
    });
  };

  const [show, setShow] = useState(false);
  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);
  const [rating, setRating] = useState(1);
  const [comment, setComment] = useState('');

  const reviewHandler = () => {
    const payload = {
      rating,
      comment,
      productId: id
    };
    dispatch(createReview(payload));
  };

  const handleWishlist = () => {
    if (!isAuthenticated) {
      toast.info('Please login to add to wishlist', { position: 'bottom-right' });
      return;
    }
    dispatch(toggleWishlist(product._id));
    if (inWishlist) {
      toast.info('Removed from wishlist', { position: 'bottom-right' });
    } else {
      toast.success('Added to wishlist', { position: 'bottom-right' });
    }
  };

  const handleRetry = () => {
    dispatch(clearError());
    dispatch(getProduct(id));
  };

  useEffect(() => {
    if (isReviewSubmitted) {
      handleClose();
      toast('Review Submitted Successfully!', {
        type: 'success',
        theme: 'light',
        position: 'bottom-right',
        onOpen: () => { dispatch(clearReviewSubmitted()); }
      });
    }
    if (error && !isReviewSubmitted) {
      // Don't show toast here — the error state component handles display
    }
    if (!product._id || isReviewSubmitted || product._id !== id) {
      dispatch(getProduct(id));
      return () => {
        dispatch(clearProduct());
      };
    }
    setSelectedImageIndex(0);
  }, [id, dispatch, isReviewSubmitted]);

  const formattedPrice = product.price
    ? new Intl.NumberFormat('en-IN', {
        style: 'currency',
        currency: 'INR',
        maximumFractionDigits: 0,
      }).format(product.price)
    : null;

  if (loading && !product._id) {
    return <ProductDetailSkeleton />;
  }

  if (error && !product._id) {
    return <ProductDetailError error={error} onRetry={handleRetry} />;
  }

  if (!product._id) {
    return <ProductDetailSkeleton />;
  }

  return (
    <Fragment>
      <MetaData title={product?.name || 'Product'} />

      <div className="pd-container">

        {/* ── Breadcrumb ── */}
        <div className="pd-breadcrumb">
          <span style={{ color: 'var(--muted)' }}>Home</span>
          {product.category && (
            <> / <span style={{ color: 'var(--muted)' }}>{product.category}</span></>
          )}
          / <span>{product.name}</span>
        </div>

        {/* ── Main Product Section ── */}
        <div className="pd-main-grid">

          {/* Left: Gallery */}
          <div className="pd-gallery">
            <div className="pd-thumbnails">
              {product?.images?.map((img, i) => (
                <div
                  key={img.image + i}
                  className={`pd-thumb ${i === selectedImageIndex ? 'active' : ''}`}
                  onClick={() => setSelectedImageIndex(i)}
                >
                  <img src={img.image} alt={`${product.name} view ${i + 1}`} />
                </div>
              ))}
            </div>
            <div className="pd-main-image">
              {product?.images?.length > 0 ? (
                <img
                  src={product.images[selectedImageIndex]?.image}
                  alt={product?.name}
                />
              ) : (
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '400px', background: 'var(--surface-2)', borderRadius: 'var(--radius)', fontSize: '4rem', opacity: 0.3 }}>
                  📦
                </div>
              )}
              <button
                className="pd-wishlist-btn"
                onClick={handleWishlist}
                aria-label={inWishlist ? "Remove from wishlist" : "Add to wishlist"}
              >
                <Heart size={24} fill={inWishlist ? "var(--error)" : "none"} color={inWishlist ? "var(--error)" : "var(--muted)"} />
              </button>
            </div>
          </div>

          {/* Right: Info */}
          <div className="pd-info">
            <h1 className="pd-title">{product?.name}</h1>

            <div className="pd-meta">
              <div className="pd-rating">
                <div className="pd-stars">
                  {[1,2,3,4,5].map(i => (
                    <Star
                      key={i}
                      size={16}
                      fill={i <= Math.round(product.ratings || 0) ? "#fbbf24" : "none"}
                      color={i <= Math.round(product.ratings || 0) ? "#fbbf24" : "#d1d5db"}
                    />
                  ))}
                </div>
                <span>
                  {product.ratings > 0 ? product.ratings.toFixed(1) : 'No rating'}
                  {product.numOfReviews > 0 && ` (${product.numOfReviews} ${product.numOfReviews === 1 ? 'Review' : 'Reviews'})`}
                </span>
              </div>
              {product.seller && (
                <span className="pd-brand">Seller: <strong>{product.seller}</strong></span>
              )}
              {product.category && (
                <span className="pd-brand">Category: <strong>{product.category}</strong></span>
              )}
            </div>

            {formattedPrice && (
              <div className="pd-price-row">
                <span className="pd-price">{formattedPrice}</span>
              </div>
            )}

            {product.description && (
              <p className="pd-short-desc">
                {product.description.substring(0, 200)}{product.description.length > 200 ? '...' : ''}
              </p>
            )}

            <hr className="pd-divider" />

            {/* Stock status */}
            <div style={{ marginBottom: '1rem' }}>
              {product.stock > 0 ? (
                <span className="pd-stock-badge in-stock">
                  ✓ In Stock ({product.stock} available)
                </span>
              ) : (
                <span className="pd-stock-badge out-of-stock">
                  ✕ Out of Stock
                </span>
              )}
            </div>

            <div className="pd-actions">
              <div className="pd-qty-selector">
                <button onClick={decreaseQuantity} disabled={quantity <= 1} aria-label="Decrease quantity">-</button>
                <input type="number" value={quantity} readOnly aria-label="Quantity" />
                <button onClick={increaseQuantity} disabled={product.stock === 0 || quantity >= product.stock} aria-label="Increase quantity">+</button>
              </div>
              <button
                className="da-btn da-btn-primary pd-add-btn"
                disabled={product.stock === 0}
                onClick={() => {
                  toast.success('Added to Cart', { position: 'bottom-right' });
                  dispatch(addCartItem(product._id, quantity));
                }}
              >
                <ShoppingCart size={20} />
                {product.stock === 0 ? 'Out of Stock' : 'Add to Cart'}
              </button>
            </div>

            <div className="pd-features">
              <div className="pd-feature">
                <Truck size={22} color="var(--accent)" />
                <div>
                  <strong>Shipping Available</strong>
                  <p>Delivered to your doorstep</p>
                </div>
              </div>
              <div className="pd-feature">
                <RefreshCw size={22} color="var(--accent)" />
                <div>
                  <strong>Easy Returns</strong>
                  <p>Hassle-free return policy</p>
                </div>
              </div>
              <div className="pd-feature">
                <ShieldCheck size={22} color="var(--accent)" />
                <div>
                  <strong>Secure Payment</strong>
                  <p>Safe and encrypted checkout</p>
                </div>
              </div>
            </div>

          </div>
        </div>

        {/* ── Tabs Section ── */}
        <div className="pd-tabs-section">
          <div className="pd-tabs-header">
            <button
              className={activeTab === 'description' ? 'active' : ''}
              onClick={() => setActiveTab('description')}
            >
              Description
            </button>
            <button
              className={activeTab === 'specs' ? 'active' : ''}
              onClick={() => setActiveTab('specs')}
            >
              Specifications
            </button>
            <button
              className={activeTab === 'reviews' ? 'active' : ''}
              onClick={() => setActiveTab('reviews')}
            >
              Reviews {product.numOfReviews > 0 ? `(${product.numOfReviews})` : ''}
            </button>
          </div>

          <div className="pd-tabs-content">
            {activeTab === 'description' && (
              <div className="pd-tab-pane fade-in">
                <h3 className="mb-4">Product Overview</h3>
                {product.description ? (
                  <p style={{ lineHeight: 1.8, fontSize: '1.05rem', color: 'var(--text)' }}>
                    {product.description}
                  </p>
                ) : (
                  <p style={{ color: 'var(--muted)' }}>No description available for this product.</p>
                )}
              </div>
            )}

            {activeTab === 'specs' && (
              <div className="pd-tab-pane fade-in">
                <h3 className="mb-4">Specifications</h3>
                <table className="pd-specs-table">
                  <tbody>
                    {product.category && (
                      <tr>
                        <td>Category</td>
                        <td>{product.category}</td>
                      </tr>
                    )}
                    {product.seller && (
                      <tr>
                        <td>Seller / Brand</td>
                        <td>{product.seller}</td>
                      </tr>
                    )}
                    <tr>
                      <td>Availability</td>
                      <td>
                        {product.stock > 0
                          ? `${product.stock} unit${product.stock !== 1 ? 's' : ''} in stock`
                          : 'Out of Stock'}
                      </td>
                    </tr>
                    {product.ratings > 0 && (
                      <tr>
                        <td>Rating</td>
                        <td>{product.ratings.toFixed(1)} / 5 ({product.numOfReviews} review{product.numOfReviews !== 1 ? 's' : ''})</td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            )}

            {activeTab === 'reviews' && (
              <div className="pd-tab-pane fade-in">
                <div className="pd-reviews-header">
                  <h3>Customer Reviews</h3>
                  <button
                    className="da-btn da-btn-outline"
                    onClick={() => {
                      if (!user) {
                        toast.info('Please login to post a review', { position: 'bottom-right' });
                      } else {
                        handleShow();
                      }
                    }}
                  >
                    Write a Review
                  </button>
                </div>

                {product.reviews && product.reviews.length > 0 ? (
                  <div className="pd-reviews-list">
                    {product.reviews.map(review => (
                      <div key={review._id} className="pd-review-card">
                        <div className="pd-review-user">
                          <div className="avatar">
                            {/* review.user is populated with name/email from backend */}
                            {review.user?.name?.charAt(0)?.toUpperCase() || 'U'}
                          </div>
                          <div>
                            <strong>{review.user?.name || 'Verified Buyer'}</strong>
                            <div className="pd-stars">
                              {[1,2,3,4,5].map(i => (
                                <Star
                                  key={i}
                                  size={12}
                                  fill={i <= review.rating ? "#fbbf24" : "none"}
                                  color={i <= review.rating ? "#fbbf24" : "#d1d5db"}
                                />
                              ))}
                            </div>
                          </div>
                        </div>
                        <p className="pd-review-text">{review.comment}</p>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="vip-empty-state" style={{ padding: '3rem' }}>
                    <Star size={48} color="var(--muted-2)" strokeWidth={1} />
                    <p>No reviews yet. Be the first to review this product!</p>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>

        {/* Review Modal */}
        <Modal show={show} onHide={handleClose} centered size="md" dialogClassName="da-modal">
          <Modal.Header closeButton style={{ borderBottom: '1px solid var(--border)' }}>
            <Modal.Title style={{ fontWeight: 700 }}>Write a Review</Modal.Title>
          </Modal.Header>
          <Modal.Body style={{ padding: '2rem' }}>
            <div className="text-center mb-4">
              <p className="mb-2 font-weight-bold">Rate this product</p>
              <div style={{ display: 'flex', justifyContent: 'center', gap: '10px', cursor: 'pointer' }}>
                {[1, 2, 3, 4, 5].map((star) => (
                  <Star
                    key={star}
                    size={32}
                    fill={star <= rating ? "#fbbf24" : "none"}
                    color={star <= rating ? "#fbbf24" : "#d1d5db"}
                    onClick={() => setRating(star)}
                    style={{ transition: 'all 0.2s', cursor: 'pointer' }}
                  />
                ))}
              </div>
              <div className="mt-2 text-muted">
                {["Poor", "Fair", "Good", "Very Good", "Excellent"][rating - 1]}
              </div>
            </div>

            <div className="form-group">
              <label className="font-weight-bold mb-2">Your Review</label>
              <textarea
                rows="4"
                maxLength="500"
                placeholder="What did you like or dislike about this product?"
                className="da-input"
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                style={{ height: 'auto', resize: 'none' }}
              />
              <div className="text-right mt-1 text-muted small">{comment.length}/500</div>
            </div>
          </Modal.Body>
          <Modal.Footer style={{ borderTop: 'none', padding: '0 2rem 2rem 2rem' }}>
            <button className="da-btn da-btn-outline" onClick={handleClose}>Cancel</button>
            <button
              className="da-btn da-btn-primary"
              disabled={loading || comment.trim().length === 0}
              onClick={reviewHandler}
            >
              {loading ? 'Submitting...' : 'Submit Review'}
            </button>
          </Modal.Footer>
        </Modal>

      </div>

      {/* Floating Mobile Cart Bar */}
      <div className="pd-mobile-cart-bar">
        <div className="pd-mobile-price">
          {formattedPrice && <span className="price">{formattedPrice}</span>}
        </div>
        <button
          className="da-btn da-btn-primary"
          disabled={product.stock === 0}
          onClick={() => {
            toast.success('Added to Cart', { position: 'bottom-right' });
            dispatch(addCartItem(product._id, quantity));
          }}
        >
          {product.stock === 0 ? 'Out of Stock' : 'Add to Cart'}
        </button>
      </div>
    </Fragment>
  );
}