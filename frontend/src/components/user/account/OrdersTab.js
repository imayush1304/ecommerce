import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import { userOrders } from '../../../actions/orderActions';
import { Eye, RotateCcw, XCircle, ChevronRight, Package } from 'lucide-react';

const STATUS_COLOR = {
  Delivered:   { bg: 'rgba(16,185,129,0.12)',  color: '#059669' },
  Processing:  { bg: 'rgba(251,191,36,0.15)',  color: '#d97706' },
  Shipped:     { bg: 'rgba(59,130,246,0.12)',  color: '#2563eb' },
  Cancelled:   { bg: 'rgba(239,68,68,0.12)',   color: '#dc2626' },
  'Out for Delivery': { bg: 'rgba(124,58,237,0.12)', color: '#7c3aed' },
};



function OrderCard({ order }) {
  const item = order.orderItems?.[0] || {};
  const sc = STATUS_COLOR[order.orderStatus] || STATUS_COLOR.Processing;
  const date = new Date(order.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' });
  const canCancel = ['Processing', 'Shipped'].includes(order.orderStatus);
  const canBuyAgain = order.orderStatus === 'Delivered';

  return (
    <div className="ord-card">
      <div className="ord-card-head">
        <div className="ord-head-left">
          <span className="ord-id">#{order._id?.slice(-10).toUpperCase()}</span>
          <span className="ord-date">{date}</span>
        </div>
        <div className="ord-head-right">
          <span className="ord-pay-badge" style={{ color: order.paymentInfo?.status === 'paid' ? '#059669' : '#d97706' }}>
            {order.paymentInfo?.status === 'paid' ? '✓ Paid' : order.paymentInfo?.status || 'Pending'}
          </span>
          <span className="ord-status-pill" style={{ background: sc.bg, color: sc.color }}>
            {order.orderStatus}
          </span>
        </div>
      </div>

      <div className="ord-card-body">
        <img
          src={item.image || '/images/default_avatar.png'}
          alt={item.name}
          className="ord-item-img"
          onError={e => { e.target.src = '/images/default_avatar.png'; }}
        />
        <div className="ord-item-info">
          <div className="ord-item-name">{item.name}</div>
          <div className="ord-item-meta">
            Qty: {item.quantity || 1} · ₹{Number(item.price).toLocaleString('en-IN')} each
          </div>
          {order.orderItems?.length > 1 && (
            <div className="ord-more">+{order.orderItems.length - 1} more item(s)</div>
          )}
        </div>
        <div className="ord-item-total">
          ₹{Number(order.totalPrice).toLocaleString('en-IN')}
        </div>
      </div>

      <div className="ord-card-foot">
        <Link to={`/order/${order._id}`} className="ord-btn ord-btn-outline">
          <Eye size={14} /> View Details
        </Link>
        {order.orderStatus === 'Shipped' && (
          <button className="ord-btn ord-btn-outline">
            <Package size={14} /> Track
          </button>
        )}
        {canBuyAgain && (
          <button className="ord-btn ord-btn-outline">
            <RotateCcw size={14} /> Buy Again
          </button>
        )}
        {canCancel && (
          <button className="ord-btn ord-btn-danger">
            <XCircle size={14} /> Cancel
          </button>
        )}
      </div>
    </div>
  );
}

function OrderSkeleton() {
  return (
    <div className="ord-card" style={{ pointerEvents: 'none' }}>
      <div className="ord-card-head">
        <div className="skeleton-block" style={{ height: 16, width: '30%', borderRadius: 4 }} />
        <div className="skeleton-block" style={{ height: 20, width: 80, borderRadius: 12 }} />
      </div>
      <div className="ord-card-body">
        <div className="skeleton-block" style={{ width: 60, height: 60, borderRadius: 8 }} />
        <div className="ord-item-info" style={{ marginLeft: 12, flex: 1 }}>
          <div className="skeleton-block" style={{ height: 16, width: '70%', marginBottom: 8, borderRadius: 4 }} />
          <div className="skeleton-block" style={{ height: 14, width: '40%', borderRadius: 4 }} />
        </div>
      </div>
    </div>
  );
}

export default function OrdersTab() {
  const dispatch = useDispatch();
  const { userOrders: orders = [], loading, error } = useSelector(s => s.orderState || {});
  const [filter, setFilter] = useState('All');

  useEffect(() => { dispatch(userOrders()); }, [dispatch]);

  const handleRetry = () => { dispatch(userOrders()); };

  const displayOrders = orders;

  const FILTERS = ['All', 'Processing', 'Shipped', 'Delivered', 'Cancelled'];
  const filtered = filter === 'All' ? displayOrders : displayOrders.filter(o => o.orderStatus === filter);

  return (
    <div className="ord-wrap">
      <div className="ord-header">
        <h2 className="dash-section-title">My Orders</h2>
        <span className="ord-count">{displayOrders.length} orders</span>
      </div>

      <div className="ord-filters">
        {FILTERS.map(f => (
          <button
            key={f}
            className={`ord-filter-btn${filter === f ? ' active' : ''}`}
            onClick={() => setFilter(f)}
          >
            {f}
          </button>
        ))}
      </div>

      {loading ? (
        [1,2,3].map(i => <OrderSkeleton key={i} />)
      ) : error ? (
        <div className="vip-error-state" style={{ padding: '3rem 1rem' }}>
          <div style={{ fontSize: '2rem', marginBottom: '1rem', color: 'var(--error)' }}>⚠️</div>
          <h3>Failed to load orders</h3>
          <p>{error || 'Something went wrong. Please try again.'}</p>
          <button className="da-btn da-btn-outline" onClick={handleRetry}>Try Again</button>
        </div>
      ) : filtered.length === 0 ? (
        <div className="ord-empty">
          <div className="ord-empty-icon">📦</div>
          <h3>No {filter !== 'All' ? filter : ''} orders</h3>
          <p>When you place orders, they'll appear here.</p>
          <Link to="/" className="ord-shop-btn">Start Shopping</Link>
        </div>
      ) : (
        <div className="ord-list">
          {filtered.map(o => <OrderCard key={o._id} order={o} />)}
        </div>
      )}
    </div>
  );
}
