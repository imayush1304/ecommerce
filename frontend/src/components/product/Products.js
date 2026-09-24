import { Link } from "react-router-dom";
import { Star, Heart } from "lucide-react";
import { useDispatch, useSelector } from "react-redux";
import { toggleWishlist } from "../../actions/userActions";
import { toast } from "react-toastify";

export default function Products({ product }) {
  const dispatch = useDispatch();
  const { isAuthenticated, user } = useSelector(s => s.authState || {});

  const inWishlist = user?.wishlist?.some(w => w._id === product._id || w === product._id);

  const imgSrc =
    product?.images?.length > 0
      ? product.images[0].image
      : null;

  const formattedPrice = new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 0,
  }).format(product.price);

  const handleWishlist = (e) => {
    e.preventDefault();
    e.stopPropagation();
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

  return (
    <div className="myntra-card-wrap">
      <Link to={`/product/${product._id}`} className="myntra-card text-decoration-none">

        {/* Image Container */}
        <div className="myntra-card-img-wrap">
          {imgSrc ? (
            <img
              src={imgSrc}
              alt={product.name}
              className="myntra-card-img"
              loading="lazy"
              onError={(e) => {
                e.target.style.display = 'none';
                e.target.nextSibling && (e.target.nextSibling.style.display = 'flex');
              }}
            />
          ) : null}
          {/* Fallback placeholder */}
          <div
            className="myntra-card-img-placeholder"
            style={{ display: imgSrc ? 'none' : 'flex' }}
          >
            <span style={{ fontSize: '2rem', opacity: 0.3 }}>📦</span>
          </div>

          {/* Rating Badge (Bottom Left of Image) */}
          {product.ratings > 0 && product.numOfReviews > 0 && (
            <div className="myntra-rating-badge">
              <span className="rating-num">{product.ratings.toFixed(1)}</span>
              <Star size={10} fill="var(--success)" color="var(--success)" className="ms-1" />
              <div className="rating-divider" />
              <span className="rating-count">
                {product.numOfReviews >= 1000
                  ? `${(product.numOfReviews / 1000).toFixed(1)}k`
                  : product.numOfReviews}
              </span>
            </div>
          )}

          {/* Out of Stock Badge */}
          {product.stock === 0 && (
            <div className="myntra-oos-badge">Out of Stock</div>
          )}

          {/* Wishlist Button Overlay */}
          <button
            className={`myntra-wishlist-btn ${inWishlist ? 'active' : ''}`}
            onClick={handleWishlist}
            title={inWishlist ? "Remove from wishlist" : "Add to wishlist"}
            aria-label={inWishlist ? "Remove from wishlist" : "Add to wishlist"}
          >
            <Heart size={18} fill={inWishlist ? "var(--error)" : "none"} color={inWishlist ? "var(--error)" : "var(--muted)"} />
          </button>
        </div>

        {/* Body Container */}
        <div className="myntra-card-body">
          {product.seller && (
            <h3 className="myntra-brand">{product.seller}</h3>
          )}
          <h4 className="myntra-title">{product.name}</h4>

          <div className="myntra-price-row">
            <span className="myntra-price">{formattedPrice}</span>
          </div>

          {product.category && (
            <span className="myntra-category-tag">{product.category}</span>
          )}
        </div>

      </Link>
    </div>
  );
}
