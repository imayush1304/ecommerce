import { useEffect, useMemo } from "react";
import Sidebar from "./Sidebar";
import { useDispatch, useSelector } from 'react-redux';
import { getAdminProducts } from "../../actions/productAction";
import { getUsers } from '../../actions/userActions';
import { adminOrders as adminOrdersAction } from '../../actions/orderActions';
import { Link } from "react-router-dom";
import { TrendingUp, Package, Users, ShoppingCart, AlertTriangle, DollarSign } from 'lucide-react';

/**
 * Builds a monthly revenue chart from actual adminOrders data.
 * Groups orders by month using the real `createdAt` field.
 * Returns the last 6 months.
 */
function buildMonthlyChart(orders) {
  const now = new Date();
  const months = [];

  for (let i = 5; i >= 0; i--) {
    const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
    months.push({
      label: d.toLocaleDateString('en-IN', { month: 'short' }),
      year: d.getFullYear(),
      month: d.getMonth(),
      revenue: 0,
      count: 0,
    });
  }

  orders.forEach(order => {
    const d = new Date(order.createdAt || order.paidAt);
    if (isNaN(d.getTime())) return;
    const month = months.find(m => m.year === d.getFullYear() && m.month === d.getMonth());
    if (month) {
      month.revenue += order.totalPrice || 0;
      month.count += 1;
    }
  });

  return months;
}

function StatCard({ icon: Icon, title, value, link, linkLabel, color = 'var(--accent)' }) {
  return (
    <div className="stat-card" style={{ borderLeft: `4px solid ${color}` }}>
      <div className="stat-icon" style={{ color }}>
        <Icon size={28} />
      </div>
      <div className="stat-body">
        <div className="stat-title">{title}</div>
        <div className="stat-value">{value}</div>
      </div>
      {link && (
        <Link className="stat-link" to={link}>{linkLabel || 'View Details'} →</Link>
      )}
    </div>
  );
}

function RevenueChart({ orders }) {
  const chartData = useMemo(() => buildMonthlyChart(orders), [orders]);
  const maxRevenue = Math.max(...chartData.map(m => m.revenue), 1);

  return (
    <div className="admin-chart-section">
      <div className="admin-chart-title" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
        <TrendingUp size={18} color="var(--accent)" />
        Revenue — Last 6 Months
        <span style={{ marginLeft: 'auto', fontSize: '0.8rem', color: 'var(--muted)', fontWeight: 400 }}>
          Based on {orders.length} actual order{orders.length !== 1 ? 's' : ''}
        </span>
      </div>
      <div className="admin-bar-chart">
        {chartData.map((m, i) => {
          const pct = maxRevenue > 0 ? (m.revenue / maxRevenue) * 100 : 0;
          return (
            <div key={i} className="admin-bar-group" title={`${m.label}: ₹${m.revenue.toLocaleString('en-IN')}`}>
              <div className="admin-bar-value">
                {m.revenue > 0
                  ? m.revenue >= 100000
                    ? `₹${(m.revenue / 100000).toFixed(1)}L`
                    : m.revenue >= 1000
                      ? `₹${(m.revenue / 1000).toFixed(1)}k`
                      : `₹${m.revenue}`
                  : '—'}
              </div>
              <div
                className="admin-bar"
                style={{ height: `${Math.max(pct, m.revenue > 0 ? 5 : 0)}%` }}
              />
              <div className="admin-bar-label">{m.label}</div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

function OrderStatusChart({ orders }) {
  const statusData = useMemo(() => {
    const counts = {};
    orders.forEach(o => {
      counts[o.orderStatus] = (counts[o.orderStatus] || 0) + 1;
    });
    return Object.entries(counts).map(([status, count]) => ({ status, count }));
  }, [orders]);

  if (statusData.length === 0) return null;

  const total = orders.length;
  const statusColors = {
    Processing: '#F59E0B',
    Shipped: '#3B82F6',
    Delivered: '#10B981',
    Cancelled: '#EF4444',
  };

  return (
    <div className="admin-chart-section">
      <div className="admin-chart-title">Order Status Breakdown</div>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
        {statusData.map(({ status, count }) => {
          const pct = total > 0 ? Math.round((count / total) * 100) : 0;
          const color = statusColors[status] || 'var(--accent)';
          return (
            <div key={status}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 4, fontSize: '0.875rem' }}>
                <span style={{ fontWeight: 600, color: 'var(--text)' }}>{status}</span>
                <span style={{ color: 'var(--muted)', fontWeight: 500 }}>{count} ({pct}%)</span>
              </div>
              <div style={{ background: 'var(--surface-2)', borderRadius: 99, height: 8, overflow: 'hidden' }}>
                <div style={{
                  height: '100%',
                  width: `${pct}%`,
                  background: color,
                  borderRadius: 99,
                  transition: 'width 0.5s ease',
                }} />
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default function Dashboard() {
  const { products = [], loading: productsLoading } = useSelector(state => state.productsState);
  const { adminOrders = [], loading: ordersLoading } = useSelector(state => state.orderState);
  const { users = [], loading: usersLoading } = useSelector(state => state.userState);
  const dispatch = useDispatch();

  const isLoading = productsLoading || ordersLoading || usersLoading;

  // Derived from actual API data — NOT hardcoded
  const outOfStock = products.filter(p => p.stock === 0).length;
  const totalRevenue = adminOrders.reduce((acc, o) => acc + (o.totalPrice || 0), 0);

  const formattedRevenue = new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 0,
  }).format(totalRevenue);

  useEffect(() => {
    dispatch(getAdminProducts());
    dispatch(adminOrdersAction());
    dispatch(getUsers());
  }, [dispatch]);

  return (
    <div className="row">
      <div className="col-12 col-md-2">
        <Sidebar />
      </div>
      <div className="col-12 col-md-10" style={{ padding: '1.5rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.5rem' }}>
          <div>
            <h1 style={{ margin: 0, fontWeight: 800, fontSize: '1.75rem' }}>Admin Dashboard</h1>
            <p style={{ color: 'var(--muted)', margin: '0.25rem 0 0', fontSize: '0.9rem' }}>
              All data from live backend
            </p>
          </div>
          {isLoading && (
            <span style={{ fontSize: '0.85rem', color: 'var(--muted)' }}>
              Fetching latest data...
            </span>
          )}
        </div>

        {/* ── Revenue Card (full width) ── */}
        <div style={{ marginBottom: '1rem' }}>
          <div className="stat-card stat-primary" style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
            <div className="stat-icon">
              <DollarSign size={28} />
            </div>
            <div className="stat-body">
              <div className="stat-title">Total Revenue</div>
              <div className="stat-value">
                {ordersLoading ? (
                  <div className="skeleton-block" style={{ height: 28, width: 140, borderRadius: 6 }} />
                ) : formattedRevenue}
              </div>
            </div>
          </div>
        </div>

        {/* ── 4 Stat Cards ── */}
        <div className="row gx-3">
          <div className="col-xl-3 col-sm-6 mb-3">
            <div className="stat-card stat-green">
              <div className="stat-icon"><Package size={28} /></div>
              <div className="stat-body">
                <div className="stat-title">Products</div>
                <div className="stat-value">
                  {productsLoading
                    ? <div className="skeleton-block" style={{ height: 24, width: 60, borderRadius: 6 }} />
                    : products.length}
                </div>
              </div>
              <Link className="stat-link" to="/admin/products">View Details →</Link>
            </div>
          </div>

          <div className="col-xl-3 col-sm-6 mb-3">
            <div className="stat-card stat-red">
              <div className="stat-icon"><ShoppingCart size={28} /></div>
              <div className="stat-body">
                <div className="stat-title">Orders</div>
                <div className="stat-value">
                  {ordersLoading
                    ? <div className="skeleton-block" style={{ height: 24, width: 60, borderRadius: 6 }} />
                    : adminOrders.length}
                </div>
              </div>
              <Link className="stat-link" to="/admin/orders">View Details →</Link>
            </div>
          </div>

          <div className="col-xl-3 col-sm-6 mb-3">
            <div className="stat-card stat-blue">
              <div className="stat-icon"><Users size={28} /></div>
              <div className="stat-body">
                <div className="stat-title">Users</div>
                <div className="stat-value">
                  {usersLoading
                    ? <div className="skeleton-block" style={{ height: 24, width: 60, borderRadius: 6 }} />
                    : users.length}
                </div>
              </div>
              <Link className="stat-link" to="/admin/users">View Details →</Link>
            </div>
          </div>

          <div className="col-xl-3 col-sm-6 mb-3">
            <div className="stat-card stat-yellow">
              <div className="stat-icon"><AlertTriangle size={28} /></div>
              <div className="stat-body">
                <div className="stat-title">Out of Stock</div>
                <div className="stat-value">
                  {productsLoading
                    ? <div className="skeleton-block" style={{ height: 24, width: 60, borderRadius: 6 }} />
                    : outOfStock}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* ── Revenue Chart (from real order data) ── */}
        {!ordersLoading && adminOrders.length > 0 && (
          <div className="row gx-3 mt-2">
            <div className="col-12 col-lg-8">
              <RevenueChart orders={adminOrders} />
            </div>
            <div className="col-12 col-lg-4">
              <OrderStatusChart orders={adminOrders} />
            </div>
          </div>
        )}

        {/* ── Empty state if no orders yet ── */}
        {!ordersLoading && adminOrders.length === 0 && (
          <div className="admin-chart-section" style={{ textAlign: 'center', color: 'var(--muted)', padding: '2rem' }}>
            <ShoppingCart size={40} strokeWidth={1} style={{ marginBottom: '0.5rem', opacity: 0.4 }} />
            <p style={{ margin: 0 }}>No orders yet. Charts will appear once orders are placed.</p>
          </div>
        )}

      </div>
    </div>
  );
}