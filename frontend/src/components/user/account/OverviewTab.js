import { useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import {
  ShoppingBag, Clock, CheckCircle, Heart, MapPin, Tag,
  TrendingUp, Star, Award, Zap
} from 'lucide-react';



const STATUS_COLOR = {
  Delivered:  { bg: 'rgba(16,185,129,0.12)', color: '#059669' },
  Processing: { bg: 'rgba(251,191,36,0.15)', color: '#d97706' },
  Shipped:    { bg: 'rgba(59,130,246,0.12)', color: '#2563eb' },
  Cancelled:  { bg: 'rgba(239,68,68,0.12)',  color: '#dc2626' },
};

export default function OverviewTab({ user, onTabChange }) {
  const { userOrders: orders = [] } = useSelector(s => s.orderState || {});

  const totalOrders    = orders.length || 0;
  const pendingOrders  = orders.filter(o => o.orderStatus !== 'Delivered').length || 0;
  const deliveredOrders = orders.filter(o => o.orderStatus === 'Delivered').length || 0;

  const STAT_CARDS = [
    { label: 'Total Orders',     value: totalOrders,     icon: ShoppingBag, color: '#ff6b35', bg: 'rgba(255,107,53,0.10)', tab: 'orders' },
    { label: 'Pending',          value: pendingOrders,   icon: Clock,       color: '#d97706', bg: 'rgba(251,191,36,0.10)', tab: 'orders' },
    { label: 'Delivered',        value: deliveredOrders, icon: CheckCircle, color: '#059669', bg: 'rgba(16,185,129,0.10)', tab: 'orders' },
    { label: 'Wishlist Items',   value: user?.wishlist?.length || 0, icon: Heart, color: '#e11d48', bg: 'rgba(225,29,72,0.10)',  tab: 'wishlist' },
    { label: 'Saved Addresses',  value: user?.addresses?.length || 0, icon: MapPin, color: '#7c3aed', bg: 'rgba(124,58,237,0.10)',tab: 'addresses' },
    { label: 'Saved Cards',      value: user?.paymentMethods?.filter(p=>p.type==='card').length || 0, icon: Tag, color: '#0891b2', bg: 'rgba(8,145,178,0.10)', tab: 'payments' },
  ];

  const recentToShow = orders.slice(0, 3).map(o => ({
        id: o._id,
        date: String(o.createdAt).substring(0, 10),
        name: o.orderItems?.[0]?.name || 'Order',
        img: o.orderItems?.[0]?.image || '/images/default_avatar.png',
        price: o.totalPrice,
        status: o.orderStatus,
        qty: o.orderItems?.length || 1,
      }));

  const joinedDate = user?.createdAt
    ? new Date(user.createdAt).toLocaleDateString('en-IN', { year: 'numeric', month: 'long' })
    : '—';

  return (
    <div className="ov-wrap">
      {/* Welcome banner */}
      <div className="ov-banner">
        <div className="ov-banner-left">
          <div className="ov-banner-greeting">👋 Welcome back,</div>
          <h2 className="ov-banner-name">{user?.name || 'Shopper'}!</h2>
          <p className="ov-banner-sub">Member since {joinedDate}</p>
          <div className="ov-banner-badges">
            {/* Badge based on actual order count — no fake tier */}
            {deliveredOrders >= 10 && <span className="ov-badge gold"><Award size={12} /> Loyal Member</span>}
            <span className="ov-badge verified"><Zap size={12} /> Verified</span>
          </div>
        </div>
        <div className="ov-banner-right">
          <div className="ov-banner-score">
            {/* Show actual order count instead of fake trust score */}
            <div className="ov-score-val">{totalOrders}</div>
            <div className="ov-score-label">Total Orders</div>
            <div className="ov-score-stars" style={{ color: 'var(--muted)', fontSize: '0.75rem' }}>
              {deliveredOrders} delivered
            </div>
          </div>
        </div>
      </div>

      {/* Stat cards */}
      <div className="ov-stats-grid">
        {STAT_CARDS.map(card => (
          <button key={card.label} className="ov-stat-card" onClick={() => onTabChange(card.tab)}>
            <div className="ov-stat-icon" style={{ background: card.bg, color: card.color }}>
              <card.icon size={22} />
            </div>
            <div className="ov-stat-body">
              <div className="ov-stat-val">{card.value}</div>
              <div className="ov-stat-label">{card.label}</div>
            </div>
            <TrendingUp size={14} className="ov-stat-arrow" />
          </button>
        ))}
      </div>

      {/* Recent orders */}
      <div className="ov-section">
        <div className="ov-section-head">
          <h3 className="ov-section-title">Recent Orders</h3>
          <button className="ov-see-all" onClick={() => onTabChange('orders')}>View All →</button>
        </div>

        <div className="ov-orders-list">
          {recentToShow.length === 0 ? (
            <div className="ord-empty" style={{ padding: '2rem 1rem' }}>
              <div className="ord-empty-icon" style={{ fontSize: '2rem', marginBottom: '1rem' }}>📦</div>
              <p>You haven't placed any orders yet.</p>
            </div>
          ) : (
            recentToShow.map(order => {
              const sc = STATUS_COLOR[order.status] || STATUS_COLOR.Processing;
              return (
                <div key={order.id} className="ov-order-row">
                  <img
                    src={order.img}
                    alt={order.name}
                    className="ov-order-img"
                    onError={e => { e.target.src = '/images/default_avatar.png'; }}
                  />
                  <div className="ov-order-info">
                    <div className="ov-order-name">{order.name}</div>
                    <div className="ov-order-meta">#{order.id?.toString().slice(-8).toUpperCase()} · {order.date} · Qty: {order.qty}</div>
                  </div>
                  <div className="ov-order-right">
                    <div className="ov-order-price">₹{Number(order.price).toLocaleString('en-IN')}</div>
                    <span className="ov-order-status" style={{ background: sc.bg, color: sc.color }}>{order.status}</span>
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>

      {/* Quick actions */}
      <div className="ov-section">
        <h3 className="ov-section-title" style={{ marginBottom: '0.9rem' }}>Quick Actions</h3>
        <div className="ov-quick-grid">
          {[
            { label: 'Track Order', icon: '📦', tab: 'orders' },
            { label: 'My Wishlist', icon: '❤️', tab: 'wishlist' },
            { label: 'Addresses',   icon: '📍', tab: 'addresses' },
            { label: 'Coupons',     icon: '🎟️', tab: 'coupons' },
            { label: 'Security',    icon: '🔒', tab: 'security' },
            { label: 'Help',        icon: '🙋', tab: 'support' },
          ].map(a => (
            <button key={a.label} className="ov-quick-btn" onClick={() => onTabChange(a.tab)}>
              <span className="ov-quick-icon">{a.icon}</span>
              <span>{a.label}</span>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
