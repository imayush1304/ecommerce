import { useDispatch, useSelector } from 'react-redux';
import { toast } from 'react-toastify';
import { Link } from 'react-router-dom';
import { ShoppingCart, Trash2, HeartOff, Star } from 'lucide-react';
import { toggleWishlist } from '../../../actions/userActions';
import { addCartItem } from '../../../actions/cartActions';

export default function WishlistTab() {
  const dispatch = useDispatch();
  const { user } = useSelector(s => s.authState);
  const items = user?.wishlist || [];

  const handleRemove = (productId) => {
    dispatch(toggleWishlist(productId));
    toast.info('Removed from wishlist', { position: 'bottom-right' });
  };

  const handleAddToCart = (item) => {
    if (item.stock === 0) {
      toast.error('Item is out of stock', { position: 'bottom-right' });
      return;
    }
    dispatch(addCartItem(item._id, 1));
    toast.success(`Added to cart!`, { position: 'bottom-right' });
  };

  const formatCurrency = (amount) =>
    new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 }).format(amount);

  return (
    <div className="wl-wrap">
      <div className="wl-header">
        <h2 className="dash-section-title" style={{ margin: 0 }}>
          My Wishlist <span className="ord-count">{items.length}</span>
        </h2>
      </div>

      <div className="wl-grid">
        {items.map(item => {
          const isOutOfStock = item.stock <= 0;
          // Only show mrp/discount if the backend product actually has an mrp field
          const hasMrp = item.mrp != null && item.mrp > 0 && item.mrp > item.price;

          return (
            <div key={item._id} className={`wl-card${isOutOfStock ? ' out-of-stock' : ''}`}>
              <button
                className="wl-remove-btn"
                onClick={() => handleRemove(item._id)}
                title="Remove from Wishlist"
                aria-label="Remove from Wishlist"
              >
                <Trash2 size={13} />
              </button>

              <Link to={`/product/${item._id}`} className="wl-img-link">
                <div className="wl-img-wrap">
                  {item.images?.[0]?.image ? (
                    <img
                      src={item.images[0].image}
                      alt={item.name}
                      className="wl-img"
                      onError={(e) => { e.target.style.display = 'none'; }}
                    />
                  ) : (
                    <div style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'var(--surface-2)', fontSize: '2rem', opacity: 0.3 }}>📦</div>
                  )}
                  {isOutOfStock && <div className="wl-oos-overlay">OUT OF STOCK</div>}
                  {/* Only show discount if backend product has actual mrp field (not fabricated) */}
                  {hasMrp && (
                    <div className="wl-discount-badge">
                      {Math.round(((item.mrp - item.price) / item.mrp) * 100)}% OFF
                    </div>
                  )}
                </div>
              </Link>

              <div className="wl-body">
                {item.category && <div className="wl-category">{item.category}</div>}
                <Link to={`/product/${item._id}`} style={{ textDecoration: 'none' }}>
                  <h3 className="wl-name">{item.name}</h3>
                </Link>

                {item.ratings > 0 && item.numOfReviews > 0 && (
                  <div className="wl-rating">
                    <div className="wl-stars">
                      {[...Array(5)].map((_, i) => (
                        <Star key={i} size={11} fill={i < Math.round(item.ratings) ? "#fbbf24" : "none"} stroke={i < Math.round(item.ratings) ? "#fbbf24" : "#d1d5db"} />
                      ))}
                    </div>
                    <span className="wl-rating-val">{item.ratings.toFixed(1)}</span>
                    <span className="wl-reviews">({item.numOfReviews})</span>
                  </div>
                )}

                <div className="wl-price-row">
                  <div className="wl-price">{formatCurrency(item.price)}</div>
                  {/* Only show MRP/savings if backend actually returns mrp field */}
                  {hasMrp && <div className="wl-mrp">{formatCurrency(item.mrp)}</div>}
                  {hasMrp && <div className="wl-save">Save {formatCurrency(item.mrp - item.price)}</div>}
                </div>

                {item.seller && (
                  <div style={{ fontSize: '0.8rem', color: 'var(--muted-2)', marginBottom: '0.5rem' }}>
                    by {item.seller}
                  </div>
                )}

                <div className="wl-actions">
                  <button
                    className="wl-cart-btn"
                    disabled={isOutOfStock}
                    onClick={() => handleAddToCart(item)}
                  >
                    <ShoppingCart size={14} /> {isOutOfStock ? 'Out of Stock' : 'Add to Cart'}
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {items.length === 0 && (
        <div className="ord-empty">
          <div className="ord-empty-icon"><HeartOff size={48} color="var(--muted-2)" /></div>
          <h3>Your wishlist is empty</h3>
          <p>Save items you love and buy them later.</p>
          <Link to="/search" className="ord-shop-btn">Explore Products</Link>
        </div>
      )}
    </div>
  );
}
