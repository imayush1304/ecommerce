import { Fragment, useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { validateShipping } from "./Shipping";
import { toast } from "react-toastify";
import axios from 'axios';
import { clearError as clearOrderError } from "../../slices/orderSlice";
import CheckoutSteps from "./CheckoutSteps";
import MetaData from "../layouts/MetaData";
import { CreditCard, Wallet, Banknote, ArrowRight, ShieldCheck } from "lucide-react";

export default function Payment() {

    const dispatch = useDispatch();
    const navigate = useNavigate();
    const orderInfoRaw = sessionStorage.getItem('orderInfo');
    const orderInfo = orderInfoRaw ? JSON.parse(orderInfoRaw) : null;
    const { user } = useSelector(state => state.authState);
    const { items: cartItems, shippingInfo } = useSelector(state => state.cartState);
    const { error: orderError } = useSelector(state => state.orderState);

    const [isRedirecting, setIsRedirecting] = useState(false);
    const [method, setMethod] = useState('razorpay');

    const loadRazorpayScript = () => new Promise((resolve, reject) => {
        if (window.Razorpay) return resolve(true);
        const script = document.createElement('script');
        script.src = 'https://checkout.razorpay.com/v1/checkout.js';
        script.onload = () => resolve(true);
        script.onerror = () => reject(new Error('Razorpay SDK failed to load'));
        document.body.appendChild(script);
    });

    useEffect(() => {
        if (shippingInfo && Object.keys(shippingInfo).length > 0) {
            validateShipping(shippingInfo, navigate);
        }

        if (orderError) {
            toast(orderError, {
                position: "bottom-right",
                type: 'error',
                onOpen: () => { dispatch(clearOrderError()) }
            })
            return;
        }
    }, [navigate]);


    const submitHandler = async (e) => {
        e.preventDefault();
        if (!orderInfo || !cartItems || cartItems.length === 0) {
            toast.error('Order info missing or empty cart.', { position: 'bottom-right' });
            navigate('/cart');
            return;
        }

        try {
            setIsRedirecting(true);
            const { data } = await axios.post('/api/v1/payment/checkout-session', {
                cartItems: cartItems.map((i) => ({ product: i.product, quantity: i.quantity })),
                shippingInfo,
                user: { name: user?.name, email: user?.email }
            });

            if (!data?.url) {
                toast.error('Unable to start Stripe Checkout.', { position: 'bottom-right' });
                setIsRedirecting(false);
                return;
            }

            window.location.href = data.url;
        } catch (error) {
            toast.error(error?.response?.data?.message || 'Payment error', { position: 'bottom-right' });
            setIsRedirecting(false);
        }
    }

    const razorpayHandler = async (e) => {
        e.preventDefault();
        if (!orderInfo || !cartItems || cartItems.length === 0) {
            toast.error('Order info missing or empty cart.', { position: 'bottom-right' });
            navigate('/cart');
            return;
        }

        try {
            setIsRedirecting(true);
            await loadRazorpayScript();

            const { data } = await axios.post('/api/v1/payment/razorpay-order', {
                cartItems: cartItems.map((i) => ({ product: i.product, quantity: i.quantity })),
                shippingInfo
            });

            const options = {
                key: data.razorpayKey,
                amount: data.amount,
                currency: data.currency || 'INR',
                name: 'VIPStore',
                description: 'Order Payment',
                order_id: data.id,
                handler: async function (response) {
                    try {
                        const paymentInfo = { id: response.razorpay_payment_id, status: 'paid', method: 'razorpay' };
                        const payload = {
                            orderItems: cartItems,
                            shippingInfo,
                            itemsPrice: orderInfo.itemsPrice || orderInfo.subtotal || 0,
                            taxPrice: orderInfo.taxPrice || orderInfo.tax || 0,
                            shippingPrice: orderInfo.shippingPrice || orderInfo.shippingCharges || 0,
                            totalPrice: orderInfo.totalPrice || 0,
                            paymentInfo
                        };

                        await axios.post('/api/v1/order/new', payload);
                        toast.success('Payment successful — order placed!', { position: 'bottom-right' });
                        navigate('/order/success');
                    } catch (err) {
                        toast.error(err?.response?.data?.message || 'Order creation failed', { position: 'bottom-right' });
                    }
                },
                prefill: { name: user?.name || '', email: user?.email || '' },
                theme: { color: '#ff6b35' }
            };

            const rzp = new window.Razorpay(options);
            rzp.open();
            setIsRedirecting(false);

        } catch (error) {
            toast.error(error?.response?.data?.message || 'Razorpay error', { position: 'bottom-right' });
            setIsRedirecting(false);
        }
    }

    const codHandler = async () => {
        toast.info('Processing order...', { position: 'bottom-right' });
        try {
            const displayTotal = orderInfo?.totalPrice ?? cartItems.reduce((acc, i) => acc + (i.price || 0) * (i.quantity || 0), 0);
            const itemsPrice = orderInfo?.itemsPrice ?? displayTotal;
            const taxPrice = orderInfo?.taxPrice ?? Math.round(itemsPrice * 0.05);
            const shippingPrice = orderInfo?.shippingPrice ?? (displayTotal < 200 ? 25 : 0);

            const payload = {
                orderItems: cartItems,
                shippingInfo,
                itemsPrice,
                taxPrice,
                shippingPrice,
                totalPrice: displayTotal,
                paymentInfo: { id: `COD_${Date.now()}`, method: 'cod', status: 'pending' }
            };
            await axios.post('/api/v1/order/new', payload);
            toast.success('Order placed (COD).', { position: 'bottom-right' });
            navigate('/order/success');
        } catch (err) {
            toast.error(err?.response?.data?.message || 'Order failed', { position: 'bottom-right' });
        }
    }

    const displayTotal = orderInfo?.totalPrice ?? cartItems.reduce((acc, i) => acc + (i.price || 0) * (i.quantity || 0), 0);
    const formatCurrency = (amount) => new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 }).format(amount);

    return (
        <Fragment>
            <MetaData title={'Payment'} />
            <CheckoutSteps shipping confirmOrder payment />
            
            <div className="cart-container mt-0">
                <div className="co-form-header mb-4">
                    <h2>Payment Options</h2>
                    <p>Select how you would like to pay for your order.</p>
                </div>

                <div className="cart-layout">
                    
                    {/* Left: Payment Methods */}
                    <div className="cart-items-section">
                        <div className="payment-methods-grid">
                            
                            <div className={`payment-method-card ${method === 'razorpay' ? 'active' : ''}`} onClick={() => setMethod('razorpay')}>
                                <div className="pmc-icon"><Wallet size={24} /></div>
                                <div className="pmc-content">
                                    <h3>Razorpay</h3>
                                    <p>UPI, Credit/Debit Cards, Netbanking</p>
                                </div>
                                <div className="pmc-radio"></div>
                            </div>

                            <div className={`payment-method-card ${method === 'stripe' ? 'active' : ''}`} onClick={() => setMethod('stripe')}>
                                <div className="pmc-icon"><CreditCard size={24} /></div>
                                <div className="pmc-content">
                                    <h3>Stripe Checkout</h3>
                                    <p>International Cards, Apple Pay, Google Pay</p>
                                </div>
                                <div className="pmc-radio"></div>
                            </div>

                            <div className={`payment-method-card ${method === 'cod' ? 'active' : ''}`} onClick={() => setMethod('cod')}>
                                <div className="pmc-icon"><Banknote size={24} /></div>
                                <div className="pmc-content">
                                    <h3>Cash on Delivery</h3>
                                    <p>Pay with cash upon delivery</p>
                                </div>
                                <div className="pmc-radio"></div>
                            </div>

                        </div>
                    </div>

                    {/* Right: Summary */}
                    <div className="cart-summary-section">
                        <div className="cart-summary-card">
                            <h3>Amount to Pay</h3>
                            
                            <div className="cs-row cs-total mt-4 mb-2">
                                <span>{formatCurrency(displayTotal)}</span>
                            </div>

                            <hr className="cs-divider mt-2" />

                            <div className="d-grid mt-4">
                                {method === 'stripe' && (
                                    <button onClick={submitHandler} className="da-btn da-btn-primary cs-checkout-btn w-100" disabled={isRedirecting}>
                                        {isRedirecting ? 'Redirecting…' : 'Pay with Stripe'} <ArrowRight size={20} />
                                    </button>
                                )}

                                {method === 'razorpay' && (
                                    <button onClick={razorpayHandler} className="da-btn da-btn-primary cs-checkout-btn w-100" disabled={isRedirecting}>
                                        {isRedirecting ? 'Processing…' : 'Pay with Razorpay'} <ArrowRight size={20} />
                                    </button>
                                )}

                                {method === 'cod' && (
                                    <button onClick={codHandler} className="da-btn da-btn-primary cs-checkout-btn w-100" disabled={isRedirecting}>
                                        {isRedirecting ? 'Processing...' : 'Place Order Now'} <ArrowRight size={20} />
                                    </button>
                                )}
                            </div>

                            <div className="cs-secure-badge">
                                <ShieldCheck size={20} color="#059669" />
                                <span>Encrypted & Secure Payment</span>
                            </div>
                        </div>
                    </div>

                </div>
            </div>
        </Fragment>
    )
}
