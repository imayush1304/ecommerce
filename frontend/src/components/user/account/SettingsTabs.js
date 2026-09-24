import { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { toast } from 'react-toastify';
import axios from 'axios';
import {
  CreditCard, Smartphone, Plus, Trash2, Check,
  Copy, Tag, Bell, Globe, Moon, Sun, Monitor,
  HelpCircle, MessageCircle, FileText, ChevronRight, AlertTriangle
} from 'lucide-react';
import {
    addPaymentMethod,
    deletePaymentMethod,
    updatePreferences,
    updateSettings
} from '../../../actions/userActions';

/* ─── Payment Methods ─── */
function PaymentsSection() {
  const dispatch = useDispatch();
  const { user } = useSelector(s => s.authState);
  
  const paymentMethods = user?.paymentMethods || [];
  const cards = paymentMethods.filter(p => p.type === 'card');
  const upis = paymentMethods.filter(p => p.type === 'upi');

  const removeMethod = (id) => {
    dispatch(deletePaymentMethod(id));
    toast.info('Payment method removed.', { position: 'bottom-right' });
  };
  const setDefaultMethod = (method) => {
    dispatch(addPaymentMethod({ ...method, isDefault: true }));
  };

  return (
    <div className="settings-section">
      <h3 className="settings-sec-title"><CreditCard size={18}/> Saved Cards</h3>
      {cards.map(card => (
        <div key={card._id} className={`pay-card-row${card.isDefault ? ' pay-default' : ''}`}>
          <div className="pay-card-icon">{card.brand === 'Visa' ? '💳' : '💳'}</div>
          <div className="pay-card-info">
            <div className="pay-card-label">{card.brand} •••• {card.last4}</div>
            <div className="pay-card-exp">Expires {card.expiry}</div>
          </div>
          <div className="pay-card-actions">
            {card.isDefault
              ? <span className="pay-default-tag"><Check size={11}/> Default</span>
              : <button className="pay-action-btn" onClick={() => setDefaultMethod(card)}>Set Default</button>
            }
            <button className="pay-action-btn danger" onClick={() => removeMethod(card._id)}><Trash2 size={13}/></button>
          </div>
        </div>
      ))}
      <button className="settings-add-btn" onClick={() => {
          // Demo: Add a dummy card
          dispatch(addPaymentMethod({ type: 'card', brand: 'Visa', last4: '1234', expiry: '12/28', isDefault: false }));
          toast.success('Added test card', { position: 'bottom-right' });
      }}>
        <Plus size={14}/> Add New Card (Demo)
      </button>

      <h3 className="settings-sec-title mt-20"><Smartphone size={18}/> Saved UPI IDs</h3>
      {upis.map(u => (
        <div key={u._id} className={`pay-card-row${u.isDefault ? ' pay-default' : ''}`}>
          <div className="pay-card-icon">📲</div>
          <div className="pay-card-info">
            <div className="pay-card-label">{u.upiId}</div>
          </div>
          <div className="pay-card-actions">
            {u.isDefault
              ? <span className="pay-default-tag"><Check size={11}/> Default</span>
              : <button className="pay-action-btn" onClick={() => setDefaultMethod(u)}>Set Default</button>
            }
            <button className="pay-action-btn danger" onClick={() => removeMethod(u._id)}><Trash2 size={13}/></button>
          </div>
        </div>
      ))}
      <button className="settings-add-btn" onClick={() => {
           // Demo: Add a dummy UPI
           dispatch(addPaymentMethod({ type: 'upi', upiId: 'test@upi', isDefault: false }));
           toast.success('Added test UPI', { position: 'bottom-right' });
      }}>
        <Plus size={14}/> Add UPI ID (Demo)
      </button>
    </div>
  );
}

/* ─── Coupons ─── */
function CouponsSection() {
  const [tab, setTab] = useState('active');
  const [coupons, setCoupons] = useState([]);

  useEffect(() => {
      const fetchCoupons = async () => {
          try {
              const { data } = await axios.get('/api/v1/coupons', { withCredentials: true });
              setCoupons(data.coupons);
          } catch(e) {
              console.error("Failed to fetch coupons", e);
          }
      };
      fetchCoupons();
  }, []);

  const filtered = coupons.filter(c => tab === 'all' || c.status === tab);

  return (
    <div className="settings-section">
      <h3 className="settings-sec-title"><Tag size={18}/> My Coupons</h3>
      <div className="ord-filters" style={{ marginBottom: '1rem' }}>
        {['all','active','expired'].map(t => (
          <button key={t} className={`ord-filter-btn${tab === t ? ' active' : ''}`} onClick={() => setTab(t)}>
            {t.charAt(0).toUpperCase() + t.slice(1)}
          </button>
        ))}
      </div>
      {filtered.length === 0
        ? <div className="settings-empty">No {tab} coupons found.</div>
        : filtered.map(c => (
          <div key={c._id} className={`coupon-card${c.status === 'expired' ? ' expired' : ''}`}>
            <div className="coupon-left">
              <div className="coupon-code">{c.code}</div>
              <div className="coupon-desc">{c.description}</div>
              <div className="coupon-meta">Min. ₹{c.minOrder} · Expires {new Date(c.expiry).toLocaleDateString()}</div>
            </div>
            <div className="coupon-right">
              <div className="coupon-discount">{c.discountType === 'percentage' ? `${c.discountValue}% off` : `₹${c.discountValue} off`}</div>
              {c.status === 'active' && (
                <button
                  className="coupon-copy-btn"
                  onClick={() => {
                    navigator.clipboard.writeText(c.code).catch(() => {});
                    toast.success(`Copied: ${c.code}`, { position: 'bottom-right' });
                  }}
                >
                  <Copy size={12}/> Copy
                </button>
              )}
              {c.status === 'expired' && <span className="coupon-expired-tag">Expired</span>}
            </div>
          </div>
        ))
      }
    </div>
  );
}

/* ─── Notifications ─── */
const NOTIFICATION_PREFS = [
  { id: 'order_updates',   label: 'Order Updates',            sub: 'Shipping, delivery and return updates',   icon: '📦' },
  { id: 'promo_emails',    label: 'Promotional Emails',       sub: 'Deals, offers and sale alerts',           icon: '📧' },
  { id: 'promo_sms',       label: 'Promotional SMS',          sub: 'Exclusive offers via text messages',      icon: '💬' },
  { id: 'push_notifs',     label: 'Push Notifications',       sub: 'Real-time alerts in your browser',        icon: '🔔' },
  { id: 'recommendations', label: 'Personalized Suggestions', sub: 'Product picks based on your browsing',    icon: '✨' },
  { id: 'review_reminders',label: 'Review Reminders',         sub: 'Prompts to review your purchases',        icon: '⭐' },
];

function NotificationsSection() {
  const dispatch = useDispatch();
  const { user } = useSelector(s => s.authState);
  const prefs = user?.preferences || {};

  const toggle = (id) => {
    dispatch(updatePreferences({ [id]: !prefs[id] }));
    toast.success('Preference saved.', { position: 'bottom-right', autoClose: 1200 });
  };

  return (
    <div className="settings-section">
      <h3 className="settings-sec-title"><Bell size={18}/> Notification Preferences</h3>
      <div className="notif-list">
        {NOTIFICATION_PREFS.map(n => (
          <div key={n.id} className="notif-row">
            <div className="notif-left">
              <span className="notif-icon">{n.icon}</span>
              <div>
                <div className="notif-label">{n.label}</div>
                <div className="notif-sub">{n.sub}</div>
              </div>
            </div>
            <button
              className={`toggle-switch${prefs[n.id] ? ' active' : ''}`}
              onClick={() => toggle(n.id)}
              aria-label={`Toggle ${n.label}`}
            />
          </div>
        ))}
      </div>
    </div>
  );
}

/* ─── Account Settings ─── */
function AccountSettings() {
  const dispatch = useDispatch();
  const { user } = useSelector(s => s.authState);
  const settings = user?.settings || { language: 'en', currency: 'INR', theme: 'system' };

  const handleChange = (key, val) => {
      dispatch(updateSettings({ [key]: val }));
  };

  return (
    <div className="settings-section">
      <h3 className="settings-sec-title"><Globe size={18}/> Account Settings</h3>
      <div className="settings-grid">
        <div className="settings-field">
          <label className="af-label">Language</label>
          <select className="af-input af-select" value={settings.language} onChange={e => handleChange('language', e.target.value)}>
            <option value="en">English</option>
            <option value="hi">Hindi</option>
            <option value="kn">Kannada</option>
            <option value="ta">Tamil</option>
          </select>
        </div>
        <div className="settings-field">
          <label className="af-label">Currency</label>
          <select className="af-input af-select" value={settings.currency} onChange={e => handleChange('currency', e.target.value)}>
            <option value="INR">₹ Indian Rupee (INR)</option>
            <option value="USD">$ US Dollar (USD)</option>
            <option value="EUR">€ Euro (EUR)</option>
          </select>
        </div>
      </div>

      <div className="settings-field" style={{ marginTop: '1rem' }}>
        <label className="af-label">Theme</label>
        <div className="theme-row">
          {[
            { val: 'light',  label: 'Light',  icon: Sun },
            { val: 'dark',   label: 'Dark',   icon: Moon },
            { val: 'system', label: 'System', icon: Monitor },
          ].map(t => (
            <button
              key={t.val}
              className={`theme-btn${settings.theme === t.val ? ' active' : ''}`}
              onClick={() => { handleChange('theme', t.val); toast.success(`Theme: ${t.label}`, { position: 'bottom-right', autoClose: 1000 }); }}
            >
              <t.icon size={16}/> {t.label}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}

/* ─── Help & Support ─── */
function SupportSection() {
  const ITEMS = [
    { icon: HelpCircle, label: 'Help Center',        sub: 'Browse FAQs and guides' },
    { icon: MessageCircle, label: 'Contact Support', sub: 'Chat with our support team' },
    { icon: FileText, label: 'My Support Tickets',   sub: 'Track your open issues' },
    { icon: AlertTriangle, label: 'Report a Problem',sub: 'Report bugs or policy violations' },
  ];
  return (
    <div className="settings-section">
      <h3 className="settings-sec-title"><HelpCircle size={18}/> Help & Support</h3>
      {ITEMS.map(item => (
        <button key={item.label} className="support-row">
          <item.icon size={20} className="support-icon"/>
          <div>
            <div className="support-label">{item.label}</div>
            <div className="support-sub">{item.sub}</div>
          </div>
          <ChevronRight size={16} className="support-arrow"/>
        </button>
      ))}
    </div>
  );
}

/* ─── Export by sub-section ─── */
export function PaymentsTab()       { return <div className="settings-wrap"><h2 className="dash-section-title">Payment Methods</h2><PaymentsSection /></div>; }
export function CouponsTab()        { return <div className="settings-wrap"><h2 className="dash-section-title">Coupons & Offers</h2><CouponsSection /></div>; }
export function NotificationsTab()  { return <div className="settings-wrap"><h2 className="dash-section-title">Notifications</h2><NotificationsSection /></div>; }
export function SettingsTab()       { return <div className="settings-wrap"><h2 className="dash-section-title">Account Settings</h2><AccountSettings /><NotificationsSection /></div>; }
export function SupportTab()        { return <div className="settings-wrap"><h2 className="dash-section-title">Help & Support</h2><SupportSection /></div>; }
