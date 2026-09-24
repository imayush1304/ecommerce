import { Fragment, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link, useParams } from "react-router-dom";
import { orderDetail as orderDetailAction } from "../../actions/orderActions";
import MetaData from "../layouts/MetaData";
import { Package, Truck, CheckCircle, CreditCard, MapPin, Calendar, Clock, ChevronLeft, AlertCircle, RefreshCw } from "lucide-react";

function OrderDetailSkeleton() {
  return (
    <div className="od-container">
      <div className="od-header">
        <div className="skeleton-block" style={{ height: 16, width: 120, borderRadius: 4 }} />
        <div className="skeleton-block" style={{ height: 28, width: 220, borderRadius: 6, marginTop: 8 }} />
      </div>
      <div className="od-grid" style={{ marginTop: '1.5rem' }}>
        <div className="od-main">
          <div className="od-card">
            <div className="skeleton-block" style={{ height: 18, width: 120, borderRadius: 4, marginBottom: 16 }} />
            <div style={{ display: 'flex', gap: '1rem' }}>
              {[0,1,2].map(i => (
                <div key={i} style={{ flex: 1 }}>
                  <div className="skeleton-block" style={{ height: 60, borderRadius: 8 }} />
                </div>
              ))}
            </div>
          </div>
          <div className="od-card" style={{ marginTop: '1.5rem' }}>
            <div className="skeleton-block" style={{ height: 18, width: 180, borderRadius: 4, marginBottom: 16 }} />
            {[0,1,2].map(i => (
              <div key={i} style={{ display: 'flex', gap: '1rem', marginBottom: 16 }}>
                <div className="skeleton-block" style={{ width: 60, height: 60, borderRadius: 8, flexShrink: 0 }} />
                <div style={{ flex: 1 }}>
                  <div className="skeleton-block" style={{ height: 14, width: '70%', borderRadius: 4, marginBottom: 8 }} />
                  <div className="skeleton-block" style={{ height: 12, width: '40%', borderRadius: 4 }} />
                </div>
              </div>
            ))}
          </div>
        </div>
        <div className="od-sidebar">
          {[0,1,2].map(i => (
            <div key={i} className="od-card" style={{ marginBottom: '1rem' }}>
              <div className="skeleton-block" style={{ height: 18, width: 120, borderRadius: 4, marginBottom: 12 }} />
              <div className="skeleton-block" style={{ height: 60, borderRadius: 6 }} />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default function OrderDetail() {
    const { orderDetail, loading, error } = useSelector(state => state.orderState);
    const { shippingInfo = {}, user = {}, orderStatus = "Processing", orderItems = [], totalPrice = 0, paymentInfo = {} } = orderDetail || {};
    const paidStatuses = ['succeeded', 'paid', 'captured'];
    const isPaid = paymentInfo && paidStatuses.includes((paymentInfo.status || '').toString().toLowerCase());
    const isCOD = paymentInfo?.method === 'cod';
    const dispatch = useDispatch();
    const { id } = useParams();

    useEffect(() => {
        dispatch(orderDetailAction(id));
    }, [id, dispatch]);

    const handleRetry = () => dispatch(orderDetailAction(id));

    const formatCurrency = (amount) =>
        new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 }).format(amount);

    // Timeline steps driven entirely by actual backend orderStatus field
    const getStatusStep = () => {
        if (orderStatus === 'Delivered') return 3;
        if (orderStatus === 'Shipped') return 2;
        return 1;
    };
    const currentStep = getStatusStep();

    if (loading && !orderDetail?._id) {
        return <OrderDetailSkeleton />;
    }

    if (error && !orderDetail?._id) {
        return (
            <div className="vip-error-state" style={{ minHeight: '50vh' }}>
                <AlertCircle size={56} color="var(--error)" />
                <h3>Order Not Found</h3>
                <p>{error || 'Something went wrong loading this order.'}</p>
                <button className="da-btn da-btn-primary" onClick={handleRetry}>
                    <RefreshCw size={16} /> Try Again
                </button>
            </div>
        );
    }

    if (!orderDetail?._id) {
        return <OrderDetailSkeleton />;
    }

    return (
        <Fragment>
            <div className="od-container">
                <MetaData title={`Order #${orderDetail._id}`} />

                <div className="od-header">
                    <Link to="/orders" className="od-back">
                        <ChevronLeft size={20} /> Back to Orders
                    </Link>
                    <h1>Order Details</h1>
                    <span className="od-id">Order #{orderDetail._id}</span>
                </div>

                <div className="od-grid">

                    {/* Main Content */}
                    <div className="od-main">

                        {/* Order Timeline — steps based on actual orderStatus from backend */}
                        <div className="od-card">
                            <h3>Order Status</h3>
                            <div className="od-timeline">
                                <div className={`odt-step ${currentStep >= 1 ? 'active' : ''}`}>
                                    <div className="odt-icon"><Package size={20} /></div>
                                    <div className="odt-info">
                                        <strong>Processing</strong>
                                        <p>Order received</p>
                                    </div>
                                </div>
                                <div className={`odt-step ${currentStep >= 2 ? 'active' : ''}`}>
                                    <div className="odt-icon"><Truck size={20} /></div>
                                    <div className="odt-info">
                                        <strong>Shipped</strong>
                                        <p>On the way</p>
                                    </div>
                                </div>
                                <div className={`odt-step ${currentStep >= 3 ? 'active' : ''}`}>
                                    <div className="odt-icon"><CheckCircle size={20} /></div>
                                    <div className="odt-info">
                                        <strong>Delivered</strong>
                                        <p>Package arrived</p>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Order Items — all from actual order data */}
                        <div className="od-card mt-4">
                            <h3>Items in your order ({orderItems.length})</h3>
                            <div className="od-items-list mt-3">
                                {orderItems.map(item => (
                                    <div key={item.product} className="od-item">
                                        {item.image ? (
                                            <img
                                                src={item.image}
                                                alt={item.name}
                                                onError={(e) => { e.target.style.display = 'none'; }}
                                            />
                                        ) : (
                                            <div style={{ width: 64, height: 64, display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'var(--surface-2)', borderRadius: 8, fontSize: '1.5rem' }}>📦</div>
                                        )}
                                        <div className="od-item-info">
                                            <Link to={`/product/${item.product}`} className="od-item-name">{item.name}</Link>
                                            <span className="od-item-meta">Qty: {item.quantity} × {formatCurrency(item.price)}</span>
                                        </div>
                                        <div className="od-item-total">
                                            {formatCurrency(item.price * item.quantity)}
                                        </div>
                                    </div>
                                ))}
                            </div>
                            <div className="od-total-row">
                                <span>Total Amount:</span>
                                <span className="amount">{formatCurrency(totalPrice)}</span>
                            </div>
                        </div>

                    </div>

                    {/* Sidebar */}
                    <div className="od-sidebar">

                        <div className="od-card mb-4">
                            <h3>Shipping Address</h3>
                            <div className="od-info-block mt-3">
                                <MapPin size={18} />
                                <div>
                                    {user.name && <strong>{user.name}</strong>}
                                    {shippingInfo.address && <p>{shippingInfo.address}</p>}
                                    {(shippingInfo.city || shippingInfo.postalCode) && (
                                        <p>{[shippingInfo.city, shippingInfo.postalCode].filter(Boolean).join(', ')}</p>
                                    )}
                                    {shippingInfo.country && <p>{shippingInfo.country}</p>}
                                    {shippingInfo.phoneNo && <p>📞 {shippingInfo.phoneNo}</p>}
                                </div>
                            </div>
                        </div>

                        <div className="od-card mb-4">
                            <h3>Payment Info</h3>
                            <div className="od-info-block mt-3">
                                <CreditCard size={18} />
                                <div>
                                    <strong>{isCOD ? 'Cash on Delivery' : 'Online Payment'}</strong>
                                    <p className={isPaid ? "text-success fw-bold mt-1" : "text-danger fw-bold mt-1"}>
                                        Status: {isPaid ? "PAID" : "UNPAID"}
                                    </p>
                                </div>
                            </div>
                        </div>

                        <div className="od-card">
                            <h3>Order Info</h3>
                            <div className="od-info-block mt-3">
                                <Calendar size={18} />
                                <div>
                                    <strong>Date Placed</strong>
                                    <p>{orderDetail?.createdAt ? new Date(orderDetail.createdAt).toLocaleDateString('en-IN', { year: 'numeric', month: 'long', day: 'numeric' }) : '—'}</p>
                                </div>
                            </div>
                            <div className="od-info-block mt-3">
                                <Clock size={18} />
                                <div>
                                    <strong>Time</strong>
                                    <p>{orderDetail?.createdAt ? new Date(orderDetail.createdAt).toLocaleTimeString('en-IN') : '—'}</p>
                                </div>
                            </div>
                        </div>

                    </div>

                </div>
            </div>
        </Fragment>
    );
}