import { useDispatch, useSelector } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import { Fragment } from "react/jsx-runtime";
import {
  decreaseCartItemQty,
  increaseCartItemQty,
  removeItemFromCart
} from "../../slices/cartSlice";
import MetaData from "../layouts/MetaData";
import { Trash2, ArrowRight, ShoppingBag, ShieldCheck } from 'lucide-react';

export default function Cart() {
  const dispatch = useDispatch();
  const { items = [] } = useSelector(state => state.cartState);
  const { isAuthenticated } = useSelector(state => state.authState);
  const navigate = useNavigate();

  const increaseQty = (item) => {
    if (item.quantity >= item.stock) return;
    dispatch(increaseCartItemQty(item.product));
  };

  const decreaseQty = (item) => {
    if (item.quantity <= 1) return;
    dispatch(decreaseCartItemQty(item.product));
  };

  const checkOutHandler = () => {
    if (isAuthenticated) {
      navigate('/shipping');
      return;
    }
    navigate(`/login?redirect=${encodeURIComponent('/shipping')}`);
  };

  const calculateSubtotal = () => items.reduce((acc, item) => acc + (item.quantity * item.price), 0);
  const formatCurrency = (amount) => new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 }).format(amount);

  if (items.length === 0) {
    return (
      <div className="cart-empty-state">
        <div className="cart-empty-circle">
          <ShoppingBag size={64} />
        </div>
        <h2>Your Cart is Empty</h2>
        <p>Looks like you haven't added anything to your cart yet.</p>
        <button className="da-btn da-btn-primary" onClick={() => navigate('/search')}>
          Continue Shopping
        </button>
      </div>
    );
  }

  return (
    <Fragment>
      <MetaData title={'Your Cart'} />
      <div className="cart-container">
        
        <div className="cart-header">
          <h1>Shopping Cart</h1>
          <span>{items.length} {items.length === 1 ? 'Item' : 'Items'}</span>
        </div>

        <div className="cart-layout">
          
          {/* Cart Items List */}
          <div className="cart-items-section">
            <div className="cart-items-header desktop-only">
              <div className="col-product">Product</div>
              <div className="col-price">Price</div>
              <div className="col-qty">Quantity</div>
              <div className="col-total">Total</div>
              <div className="col-action"></div>
            </div>

            <div className="cart-items-list">
              {items.map(item => (
                <div className="cart-item" key={item.product}>
                  
                  <div className="ci-product">
                    <img src={item.image} alt={item.name} />
                    <div className="ci-info">
                      <Link to={`/product/${item.product}`} className="ci-name">{item.name}</Link>
                      <span className="ci-stock">{item.stock > 0 ? 'In Stock' : 'Out of Stock'}</span>
                    </div>
                  </div>

                  <div className="ci-price desktop-only">
                    {formatCurrency(item.price)}
                  </div>

                  <div className="ci-qty">
                    <div className="pd-qty-selector small">
                      <button onClick={() => decreaseQty(item)}>-</button>
                      <input type="number" value={item.quantity} readOnly />
                      <button onClick={() => increaseQty(item)}>+</button>
                    </div>
                  </div>

                  <div className="ci-total desktop-only">
                    {formatCurrency(item.price * item.quantity)}
                  </div>

                  <div className="ci-action">
                    <button className="da-icon-btn danger" onClick={() => dispatch(removeItemFromCart(item.product))} title="Remove item">
                      <Trash2 size={20} />
                    </button>
                  </div>

                  {/* Mobile Pricing Row */}
                  <div className="ci-mobile-price mobile-only">
                    {formatCurrency(item.price * item.quantity)}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Order Summary Sidebar */}
          <div className="cart-summary-section">
            <div className="cart-summary-card">
              <h3>Order Summary</h3>
              
              <div className="cs-row">
                <span>Subtotal ({items.reduce((acc, item) => acc + item.quantity, 0)} items)</span>
                <span>{formatCurrency(calculateSubtotal())}</span>
              </div>
              <div className="cs-row">
                <span>Shipping</span>
                <span className="text-success">Free</span>
              </div>
              
              <hr className="cs-divider" />
              
              <div className="cs-row cs-total">
                <span>Total</span>
                <span>{formatCurrency(calculateSubtotal())}</span>
              </div>

              <button className="da-btn da-btn-primary cs-checkout-btn" onClick={checkOutHandler}>
                Proceed to Checkout <ArrowRight size={20} />
              </button>

              <div className="cs-secure-badge">
                <ShieldCheck size={20} color="#059669" />
                <span>100% Secure Checkout</span>
              </div>
            </div>
          </div>

        </div>
      </div>
    </Fragment>
  );
}
