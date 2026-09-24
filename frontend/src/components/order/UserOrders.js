import { Fragment, useEffect } from "react";
import MetaData from "../layouts/MetaData";
import { useDispatch, useSelector } from "react-redux";
import { userOrders as userOrdersActions } from "../../actions/orderActions";
import { Link } from "react-router-dom";
import { Package, ChevronRight, Clock, CheckCircle, Truck, AlertCircle, RefreshCw } from "lucide-react";

function OrderCardSkeleton() {
  return (
    <div className="order-list-card" style={{ pointerEvents: 'none' }}>
      <div className="order-card-header">
        <div className="skeleton-block" style={{ height: 16, width: 120, borderRadius: 4 }} />
        <div className="skeleton-block" style={{ height: 14, width: 80, borderRadius: 4 }} />
      </div>
      <div className="order-card-body" style={{ marginTop: '0.75rem' }}>
        <div style={{ display: 'flex', gap: '0.5rem' }}>
          {[0,1,2].map(i => (
            <div key={i} className="order-img-thumb">
              <div className="skeleton-block" style={{ width: '100%', height: '100%' }} />
            </div>
          ))}
        </div>
        <div className="order-card-details" style={{ marginLeft: '1rem' }}>
          <div className="skeleton-block" style={{ height: 12, width: 160, borderRadius: 4, marginBottom: 8 }} />
          <div className="skeleton-block" style={{ height: 18, width: 80, borderRadius: 4 }} />
        </div>
      </div>
    </div>
  );
}

function getStatusConfig(status) {
  switch (status) {
    case 'Delivered':
      return { Icon: CheckCircle, color: 'var(--success)' };
    case 'Shipped':
      return { Icon: Truck, color: 'var(--info)' };
    case 'Processing':
    default:
      return { Icon: Clock, color: 'var(--warning)' };
  }
}

export default function UserOrders() {
  const { userOrders = [], loading, error } = useSelector(state => state.orderState);
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(userOrdersActions());
  }, [dispatch]);

  const handleRetry = () => {
    dispatch(userOrdersActions());
  };

  const formatDate = (dateString) => {
    if (!dateString) return '—';
    return new Date(dateString).toLocaleDateString('en-IN', {
      year: 'numeric', month: 'long', day: 'numeric'
    });
  };

  const formatCurrency = (amount) =>
    new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0
    }).format(amount);

  return (
    <Fragment>
      <MetaData title="My Orders" />
      <div className="orders-container wrapper mt-5 mb-5">
        <h2 className="mb-4 fw-bold">My Orders</h2>

        {/* Loading State */}
        {loading && (
          <div className="orders-skeleton-list">
            {[0,1,2,3].map(i => <OrderCardSkeleton key={i} />)}
          </div>
        )}

        {/* Error State */}
        {!loading && error && (
          <div className="vip-error-state" style={{ minHeight: '40vh' }}>
            <AlertCircle size={48} color="var(--error)" />
            <h3>Couldn't Load Orders</h3>
            <p>Something went wrong while fetching your orders.</p>
            <button className="da-btn da-btn-primary" onClick={handleRetry}>
              <RefreshCw size={16} /> Try Again
            </button>
          </div>
        )}

        {/* Empty State */}
        {!loading && !error && userOrders.length === 0 && (
          <div className="empty-orders-state text-center py-5">
            <Package size={64} className="text-muted mb-3" strokeWidth={1} />
            <h4 className="fw-bold">No orders yet</h4>
            <p className="text-muted mb-4">You haven't placed any orders yet. Start shopping!</p>
            <Link to="/search" className="da-btn da-btn-primary px-4 py-2">Start Shopping</Link>
          </div>
        )}

        {/* Orders List */}
        {!loading && !error && userOrders.length > 0 && (
          <>
            <p style={{ color: 'var(--muted)', fontSize: '0.9rem', marginBottom: '1rem' }}>
              {userOrders.length} order{userOrders.length !== 1 ? 's' : ''} found
            </p>
            <div className="orders-list">
              {userOrders.map(order => {
                const { Icon: StatusIcon, color } = getStatusConfig(order.orderStatus);

                return (
                  <Link
                    to={`/order/${order._id}`}
                    className="order-list-card text-decoration-none"
                    key={order._id}
                  >
                    <div className="order-card-header">
                      <div className="order-status-badge" style={{ color }}>
                        <StatusIcon size={16} className="me-2" />
                        <span className="fw-bold">{order.orderStatus}</span>
                      </div>
                      <span className="order-date text-muted">{formatDate(order.createdAt)}</span>
                    </div>

                    <div className="order-card-body">
                      <div className="order-items-preview">
                        {order.orderItems.slice(0, 3).map((item, idx) => (
                          <div className="order-img-thumb" key={idx}>
                            {item.image ? (
                              <img
                                src={item.image}
                                alt={item.name}
                                onError={(e) => { e.target.style.display = 'none'; }}
                              />
                            ) : (
                              <span style={{ fontSize: '1.2rem' }}>📦</span>
                            )}
                          </div>
                        ))}
                        {order.orderItems.length > 3 && (
                          <div className="order-img-thumb more-thumb">
                            +{order.orderItems.length - 3}
                          </div>
                        )}
                      </div>

                      <div className="order-card-details">
                        <div className="order-id text-muted mb-1">Order #{order._id}</div>
                        <div className="order-total fw-bold">
                          {formatCurrency(order.totalPrice)}
                        </div>
                        <div style={{ fontSize: '0.8rem', color: 'var(--muted)', marginTop: 2 }}>
                          {order.orderItems.length} item{order.orderItems.length !== 1 ? 's' : ''}
                        </div>
                      </div>

                      <div className="order-card-action">
                        <ChevronRight size={20} className="text-muted" />
                      </div>
                    </div>
                  </Link>
                );
              })}
            </div>
          </>
        )}
      </div>
    </Fragment>
  );
}
