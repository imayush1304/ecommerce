import { Fragment } from "react/jsx-runtime";
import MetaData from "../layouts/MetaData";
import { useEffect } from "react";
import { validateShipping } from "./Shipping";
import { useSelector } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import CheckoutSteps from "./CheckoutSteps";
import { MapPin, Phone, CreditCard, ShieldCheck } from "lucide-react";

export default function ConfirmOrder() {

    const { shippingInfo, items: cartItems } = useSelector(state => state.cartState);
    const { user } = useSelector(state => state.authState);
    const navigate = useNavigate();

    const itemsPrice = cartItems.reduce((acc, item) => (acc + item.price * item.quantity), 0)
    const shippingPrice = itemsPrice > 200 ? 0 : 25;
    let taxPrice = Number(0.05 * itemsPrice);
    const totalPrice = Number(itemsPrice + shippingPrice + taxPrice).toFixed(2);
    taxPrice = Number(taxPrice).toFixed(2);

    const formatCurrency = (amount) => new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 }).format(amount);


    const ProcessPayment = () => {
        const data = {
            itemsPrice,
            shippingPrice,
            taxPrice,
            totalPrice
        }
        sessionStorage.setItem('orderInfo',JSON.stringify(data));
        navigate('/payment')
    }

    useEffect(() => {
        validateShipping(shippingInfo, navigate)
    }, [])

    return (
        <Fragment>
            <MetaData title={'Confirm Order'} />
            <CheckoutSteps shipping confirmOrder />
            
            <div className="cart-container mt-0">
                <div className="co-form-header mb-4">
                    <h2>Review Your Order</h2>
                    <p>Please check your details before proceeding to payment.</p>
                </div>

                <div className="cart-layout">
                    
                    {/* Left: Details */}
                    <div className="cart-items-section">
                        
                        {/* Shipping Card */}
                        <div className="co-review-card mb-4">
                            <div className="co-rc-header">
                                <h3>Shipping Address</h3>
                                <Link to="/shipping" className="co-rc-edit">Edit</Link>
                            </div>
                            <div className="co-rc-body">
                                <p className="co-rc-name">{user.name}</p>
                                <div className="co-rc-detail">
                                    <MapPin size={16} />
                                    <span>{shippingInfo.address}, {shippingInfo.city}, {shippingInfo.state}, {shippingInfo.postalCode}, {shippingInfo.country}</span>
                                </div>
                                <div className="co-rc-detail">
                                    <Phone size={16} />
                                    <span>{shippingInfo.phoneNo}</span>
                                </div>
                            </div>
                        </div>

                        {/* Items Card */}
                        <div className="co-review-card">
                            <div className="co-rc-header">
                                <h3>Items in Order ({cartItems.length})</h3>
                                <Link to="/cart" className="co-rc-edit">Edit Cart</Link>
                            </div>
                            
                            <div className="cart-items-list mt-3">
                                {cartItems.map(item => (
                                    <div className="cart-item py-3 px-0" key={item.product}>
                                        <div className="ci-product" style={{ flex: '0 0 60%' }}>
                                            <img src={item.image} alt={item.name} style={{ width: 60, height: 60 }} />
                                            <div className="ci-info">
                                                <Link to={`/product/${item.product}`} className="ci-name" style={{ fontSize: '1rem' }}>{item.name}</Link>
                                                <span className="text-muted small">Qty: {item.quantity}</span>
                                            </div>
                                        </div>
                                        <div className="ci-total" style={{ flex: '0 0 40%' }}>
                                            {formatCurrency(item.price * item.quantity)}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>

                    </div>

                    {/* Right: Summary */}
                    <div className="cart-summary-section">
                        <div className="cart-summary-card">
                            <h3>Order Summary</h3>
                            
                            <div className="cs-row mt-4">
                                <span>Subtotal</span>
                                <span>{formatCurrency(itemsPrice)}</span>
                            </div>
                            <div className="cs-row">
                                <span>Shipping</span>
                                <span>{shippingPrice === 0 ? <span className="text-success">Free</span> : formatCurrency(shippingPrice)}</span>
                            </div>
                            <div className="cs-row">
                                <span>Tax (5%)</span>
                                <span>{formatCurrency(taxPrice)}</span>
                            </div>
                            
                            <hr className="cs-divider" />
                            
                            <div className="cs-row cs-total">
                                <span>Total</span>
                                <span>{formatCurrency(totalPrice)}</span>
                            </div>

                            <button className="da-btn da-btn-primary cs-checkout-btn" onClick={ProcessPayment}>
                                Proceed to Payment <CreditCard size={20} />
                            </button>

                            <div className="cs-secure-badge">
                                <ShieldCheck size={20} color="#059669" />
                                <span>Safe & Secure Payments</span>
                            </div>
                        </div>
                    </div>

                </div>
            </div>
        </Fragment>
    )
}