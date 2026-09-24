import { useEffect, useRef, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate, useSearchParams, Link } from 'react-router-dom';
import { toast } from 'react-toastify';
import {
  LayoutDashboard, ShoppingBag, Heart, MapPin, CreditCard,
  Tag, Bell, Shield, Settings, HelpCircle, LogOut,
  Camera, Edit3, ChevronRight, X, Menu, User,
  CheckCircle, Phone, Calendar, Mail
} from 'lucide-react';

import { logout, updateProfile } from '../../actions/userActions';
import { clearError, clearUpdateProfile } from '../../slices/authSlice';
import Loader from '../layouts/Loader';
import MetaData from '../layouts/MetaData';

import OverviewTab     from './account/OverviewTab';
import OrdersTab       from './account/OrdersTab';
import WishlistTab     from './account/WishlistTab';
import AddressesTab    from './account/AddressesTab';
import SecurityTab     from './account/SecurityTab';
import {
  PaymentsTab,
  CouponsTab,
  NotificationsTab,
  SettingsTab,
  SupportTab,
} from './account/SettingsTabs';

/* ── Sidebar config ── */
const NAV_ITEMS = [
  { id: 'overview',       label: 'Overview',         icon: LayoutDashboard },
  { id: 'orders',         label: 'My Orders',         icon: ShoppingBag },
  { id: 'wishlist',       label: 'Wishlist',          icon: Heart },
  { id: 'addresses',      label: 'Addresses',         icon: MapPin },
  { id: 'payments',       label: 'Payment Methods',   icon: CreditCard },
  { id: 'coupons',        label: 'Coupons & Offers',  icon: Tag },
  { id: 'notifications',  label: 'Notifications',     icon: Bell },
  { id: 'security',       label: 'Security',          icon: Shield },
  { id: 'settings',       label: 'Settings',          icon: Settings },
  { id: 'support',        label: 'Help & Support',    icon: HelpCircle },
];

function AvatarUpload({ user, onAvatarChange, onAvatarDelete }) {
  const fileRef = useRef(null);
  const [showMenu, setShowMenu] = useState(false);
  const src = user?.avatar || '/images/default_avatar.png';

  return (
    <div className="da-avatar-wrap" onMouseLeave={() => setShowMenu(false)}>
      <div className="da-avatar-circle" onClick={() => setShowMenu(v => !v)}>
        <img src={src} alt={user?.name} className="da-avatar-img" />
        <div className="da-avatar-overlay"><Camera size={16} /></div>
      </div>
      <input ref={fileRef} type="file" accept="image/*" style={{ display: 'none' }} onChange={e => {
        const f = e.target.files?.[0];
        if (!f) return;
        const fd = new FormData();
        fd.append('avatar', f);
        onAvatarChange(fd);
        e.target.value = '';
        setShowMenu(false);
      }} />
      {showMenu && (
        <div className="da-avatar-menu">
          <button onClick={() => { fileRef.current?.click(); }}><Camera size={13} /> Change Photo</button>
          {user?.avatar && (
            <button className="danger" onClick={() => { onAvatarDelete(); setShowMenu(false); }}><X size={13} /> Remove Photo</button>
          )}
        </div>
      )}
    </div>
  );
}

function PersonalInfoModal({ user, onClose, onSave }) {
  const [form, setForm] = useState({
    name: user?.name || '',
    phone: user?.phone || '',
    dob: user?.dob || '',
    gender: user?.gender || '',
  });
  const [errors, setErrors] = useState({});

  const validate = () => {
    const e = {};
    if (!form.name.trim()) e.name = 'Name is required';
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleSubmit = (ev) => {
    ev.preventDefault();
    if (!validate()) return;
    onSave(form);
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-box modal-lg" onClick={e => e.stopPropagation()}>
        <div className="modal-head">
          <h3 className="modal-title">Edit Personal Info</h3>
          <button className="modal-close-btn" onClick={onClose}><X size={18} /></button>
        </div>
        <form onSubmit={handleSubmit} className="pi-form">
          <div className="af-grid-2">
            <div className="af-field">
              <label className="af-label">Full Name</label>
              <input
                className={`af-input${errors.name ? ' af-input-err' : ''}`}
                value={form.name}
                onChange={e => setForm(f => ({ ...f, name: e.target.value }))}
                placeholder="Full Name"
              />
              {errors.name && <span className="af-err">{errors.name}</span>}
            </div>
            <div className="af-field">
              <label className="af-label">Phone Number</label>
              <input
                className="af-input"
                value={form.phone}
                onChange={e => setForm(f => ({ ...f, phone: e.target.value }))}
                placeholder="+91 XXXXX-XXXXX"
                type="tel"
              />
            </div>
          </div>
          <div className="af-grid-2">
            <div className="af-field">
              <label className="af-label">Date of Birth</label>
              <input
                className="af-input"
                type="date"
                value={form.dob}
                onChange={e => setForm(f => ({ ...f, dob: e.target.value }))}
              />
            </div>
            <div className="af-field">
              <label className="af-label">Gender</label>
              <select className="af-input af-select" value={form.gender} onChange={e => setForm(f => ({ ...f, gender: e.target.value }))}>
                <option value="">Prefer not to say</option>
                <option value="male">Male</option>
                <option value="female">Female</option>
                <option value="other">Other</option>
              </select>
            </div>
          </div>
          <div className="modal-actions" style={{ marginTop: '1.5rem' }}>
            <button type="button" className="modal-cancel" onClick={onClose}>Cancel</button>
            <button type="submit" className="af-save-btn">Save Changes</button>
          </div>
        </form>
      </div>
    </div>
  );
}

function DeleteAccountModal({ onClose, onConfirm }) {
  const [input, setInput] = useState('');
  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-box" onClick={e => e.stopPropagation()}>
        <h3 className="modal-title danger-title">⚠️ Delete Account</h3>
        <p className="modal-body">This action is <strong>permanent and irreversible</strong>. All your data, orders, and saved information will be deleted.</p>
        <p className="modal-body">Type <code>DELETE</code> to confirm:</p>
        <input
          className="af-input"
          value={input}
          onChange={e => setInput(e.target.value)}
          placeholder="Type DELETE"
          style={{ margin: '0.75rem 0' }}
        />
        <div className="modal-actions">
          <button className="modal-cancel" onClick={onClose}>Cancel</button>
          <button
            className="modal-confirm danger"
            disabled={input !== 'DELETE'}
            onClick={onConfirm}
          >
            Delete My Account
          </button>
        </div>
      </div>
    </div>
  );
}

function LogoutAllModal({ onClose, onConfirm }) {
  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-box" onClick={e => e.stopPropagation()}>
        <h3 className="modal-title">Logout from all devices?</h3>
        <p className="modal-body">You will be signed out from all devices including this one.</p>
        <div className="modal-actions">
          <button className="modal-cancel" onClick={onClose}>Cancel</button>
          <button className="modal-confirm danger" onClick={onConfirm}>Logout All</button>
        </div>
      </div>
    </div>
  );
}

/* ── Main Dashboard Component ── */
export default function Profile() {
  const dispatch   = useDispatch();
  const navigate   = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  const activeTab  = searchParams.get('tab') || 'overview';

  const { user = {}, loading, isUpdated, error } = useSelector(s => s.authState || {});
  const [sidebarOpen,   setSidebarOpen]   = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showLogoutAllModal, setShowLogoutAllModal] = useState(false);

  useEffect(() => {
    if (isUpdated) {
      toast.success('Profile updated!', { position: 'bottom-right' });
      dispatch(clearUpdateProfile());
      setShowEditModal(false);
    }
    if (error) {
      toast.error(error, { position: 'bottom-right' });
      dispatch(clearError());
    }
  }, [isUpdated, error, dispatch]);

  if (loading) return <Loader />;

  const setTab = (id) => {
    setSearchParams({ tab: id });
    setSidebarOpen(false);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleLogout = async () => {
    await dispatch(logout());
    navigate('/login');
  };

  const handleAvatarChange = (fd) => dispatch(updateProfile(fd));
  const handleAvatarDelete = () => dispatch(updateProfile({ removeAvatar: true }));
  const handleSaveInfo     = (form) => {
    const fd = new FormData();
    fd.append('name', form.name);
    if (form.phone) fd.append('phone', form.phone);
    dispatch(updateProfile(fd));
  };

  const joinedDate = user?.createdAt
    ? new Date(user.createdAt).toLocaleDateString('en-IN', { year: 'numeric', month: 'long', day: 'numeric' })
    : '—';

  const avatarSrc = user?.avatar || '/images/default_avatar.png';

  /* ── Tab content ── */
  const tabContent = () => {
    switch (activeTab) {
      case 'overview':      return <OverviewTab user={user} onTabChange={setTab} />;
      case 'orders':        return <OrdersTab />;
      case 'wishlist':      return <WishlistTab />;
      case 'addresses':     return <AddressesTab />;
      case 'payments':      return <PaymentsTab />;
      case 'coupons':       return <CouponsTab />;
      case 'notifications': return <NotificationsTab />;
      case 'security':      return <SecurityTab user={user} />;
      case 'settings':      return <SettingsTab />;
      case 'support':       return <SupportTab />;
      default:              return <OverviewTab user={user} onTabChange={setTab} />;
    }
  };

  return (
    <>
      <MetaData title={`My Account — VIPStore`} />

      {/* Modals */}
      {showEditModal && (
        <PersonalInfoModal
          user={user}
          onClose={() => setShowEditModal(false)}
          onSave={handleSaveInfo}
        />
      )}
      {showDeleteModal && (
        <DeleteAccountModal
          onClose={() => setShowDeleteModal(false)}
          onConfirm={() => {
            // No backend API for account deletion exists.
            // Redirect user to contact support instead of faking a delete.
            toast.info('To delete your account, please contact our support team.', { position: 'bottom-right' });
            setShowDeleteModal(false);
          }}
        />
      )}
      {showLogoutAllModal && (
        <LogoutAllModal
          onClose={() => setShowLogoutAllModal(false)}
          onConfirm={() => { handleLogout(); setShowLogoutAllModal(false); }}
        />
      )}

      {/* Mobile overlay */}
      {sidebarOpen && (
        <div className="da-overlay" onClick={() => setSidebarOpen(false)} />
      )}

      <div className="da-shell">
        {/* ── Sidebar ── */}
        <aside className={`da-sidebar${sidebarOpen ? ' da-sidebar-open' : ''}`}>
          {/* Profile mini card */}
          <div className="da-sidebar-profile">
            <img src={avatarSrc} alt={user?.name} className="da-sb-avatar" />
            <div className="da-sb-info">
              <div className="da-sb-name">{user?.name || 'User'}</div>
              <div className="da-sb-email">{user?.email || ''}</div>
            </div>
          </div>

          <div className="da-sb-divider" />

          {/* Nav items */}
          <nav className="da-sb-nav">
            {NAV_ITEMS.map(item => (
              <button
                key={item.id}
                className={`da-sb-item${activeTab === item.id ? ' da-sb-active' : ''}`}
                onClick={() => setTab(item.id)}
                id={`sb-${item.id}`}
              >
                <item.icon size={18} className="da-sb-icon" />
                <span>{item.label}</span>
                {activeTab === item.id && <span className="da-sb-active-dot" />}
              </button>
            ))}
          </nav>

          <div className="da-sb-divider" />

          {/* Logout */}
          <div className="da-sb-footer">
            <button className="da-sb-logout" onClick={handleLogout}>
              <LogOut size={16} /> Logout
            </button>
            <button className="da-sb-logout-all" onClick={() => setShowLogoutAllModal(true)}>
              Logout from all devices
            </button>
            <button className="da-sb-delete" onClick={() => setShowDeleteModal(true)}>
              Delete Account
            </button>
          </div>
        </aside>

        {/* ── Main content ── */}
        <main className="da-main">
          {/* Mobile header */}
          <div className="da-mobile-header">
            <button className="da-hamburger" onClick={() => setSidebarOpen(v => !v)} aria-label="Open menu">
              <Menu size={22} />
            </button>
            <span className="da-mobile-title">
              {NAV_ITEMS.find(n => n.id === activeTab)?.label || 'My Account'}
            </span>
            <img src={avatarSrc} alt="" className="da-mobile-avatar" />
          </div>

          {/* Profile header (desktop — shown at top of main) */}
          <div className="da-profile-header">
            <div className="da-ph-left">
              <AvatarUpload user={user} onAvatarChange={handleAvatarChange} onAvatarDelete={handleAvatarDelete} />
              <div className="da-ph-info">
                <div className="da-ph-name">{user?.name || 'User'}</div>
                <div className="da-ph-row"><Mail size={13}/> {user?.email}</div>
                {user?.phone && <div className="da-ph-row"><Phone size={13}/> {user.phone}</div>}
                <div className="da-ph-row"><Calendar size={13}/> Member since {joinedDate}</div>
                <div className="da-ph-badges">
                  <span className="da-badge verified"><CheckCircle size={11}/> Email Verified</span>
                  {user?.role === 'admin' && <span className="da-badge admin">Admin</span>}
                </div>
              </div>
            </div>
            <button
              className="da-edit-btn"
              id="edit_profile"
              onClick={() => setShowEditModal(true)}
            >
              <Edit3 size={15} /> Edit Profile
            </button>
          </div>

          {/* Tab content */}
          <div className="da-content">
            {tabContent()}
          </div>

          {/* Bottom danger zone (visible in all tabs) */}
          {activeTab !== 'security' && (
            <div className="da-danger-zone">
              <button className="da-dz-btn" onClick={() => setShowLogoutAllModal(true)}>
                <LogOut size={14}/> Logout from All Devices
              </button>
              <button className="da-dz-btn danger" onClick={() => setShowDeleteModal(true)}>
                Delete My Account
              </button>
            </div>
          )}
        </main>
      </div>
    </>
  );
}
