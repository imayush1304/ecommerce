import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { updatePassword } from '../../../actions/userActions';
import { clearUpdateProfile, clearError } from '../../../slices/authSlice';
import { toast } from 'react-toastify';
import { Eye, EyeOff, Shield, Smartphone, Monitor, Laptop, LogOut, CheckCircle, AlertCircle, Key, Lock } from 'lucide-react';

const MOCK_DEVICES = [
  { id: 'd1', device: 'Chrome on Windows', icon: Monitor,  location: 'Bengaluru, India', time: 'Now (Current)', current: true },
  { id: 'd2', device: 'Safari on iPhone',   icon: Smartphone, location: 'Bengaluru, India', time: '2 days ago', current: false },
  { id: 'd3', device: 'Chrome on MacBook',  icon: Laptop,   location: 'Mumbai, India',    time: '5 days ago', current: false },
];

function PasswordField({ label, id, value, onChange, error, show, onToggle }) {
  return (
    <div className="sec-field">
      <label className="af-label">{label}</label>
      <div className="sec-pw-wrap">
        <input
          id={id}
          type={show ? 'text' : 'password'}
          className={`af-input${error ? ' af-input-err' : ''}`}
          value={value}
          onChange={e => onChange(e.target.value)}
          placeholder={label}
        />
        <button type="button" className="sec-pw-eye" onClick={onToggle}>
          {show ? <EyeOff size={16} /> : <Eye size={16} />}
        </button>
      </div>
      {error && <span className="af-err">{error}</span>}
    </div>
  );
}

function ChangePasswordSection({ user }) {
  const dispatch = useDispatch();
  const { loading, isUpdated, error } = useSelector(s => s.authState || {});
  const [form, setForm] = useState({ oldPassword: '', password: '', confirmPassword: '' });
  const [show, setShow] = useState({ old: false, new: false, confirm: false });
  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (isUpdated) {
      toast.success('Password changed successfully!', { position: 'bottom-right' });
      dispatch(clearUpdateProfile());
      setForm({ oldPassword: '', password: '', confirmPassword: '' });
    }
    if (error) {
      toast.error(error, { position: 'bottom-right' });
      dispatch(clearError());
    }
  }, [isUpdated, error, dispatch]);

  const validate = () => {
    const e = {};
    if (!form.oldPassword) e.oldPassword = 'Required';
    if (form.password.length < 6) e.password = 'At least 6 characters';
    if (form.password !== form.confirmPassword) e.confirmPassword = 'Passwords do not match';
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleSubmit = (ev) => {
    ev.preventDefault();
    if (!validate()) return;
    dispatch(updatePassword({ oldPassword: form.oldPassword, password: form.password, confirmPassword: form.confirmPassword }));
  };

  return (
    <div className="sec-section">
      <div className="sec-section-head">
        <Key size={20} className="sec-section-icon" />
        <div>
          <h3 className="sec-section-title">Change Password</h3>
          <p className="sec-section-sub">Use a strong, unique password</p>
        </div>
      </div>
      <form onSubmit={handleSubmit} className="sec-pw-form">
        <PasswordField
          label="Current Password" id="oldPw"
          value={form.oldPassword} onChange={v => setForm(f => ({ ...f, oldPassword: v }))}
          error={errors.oldPassword} show={show.old} onToggle={() => setShow(s => ({ ...s, old: !s.old }))}
        />
        <PasswordField
          label="New Password" id="newPw"
          value={form.password} onChange={v => setForm(f => ({ ...f, password: v }))}
          error={errors.password} show={show.new} onToggle={() => setShow(s => ({ ...s, new: !s.new }))}
        />
        <PasswordField
          label="Confirm New Password" id="confirmPw"
          value={form.confirmPassword} onChange={v => setForm(f => ({ ...f, confirmPassword: v }))}
          error={errors.confirmPassword} show={show.confirm} onToggle={() => setShow(s => ({ ...s, confirm: !s.confirm }))}
        />

        {/* Strength hint */}
        {form.password && (
          <div className="sec-strength">
            <div className={`sec-strength-bar ${form.password.length >= 12 ? 'strong' : form.password.length >= 8 ? 'medium' : 'weak'}`} />
            <span>{form.password.length >= 12 ? 'Strong' : form.password.length >= 8 ? 'Medium' : 'Weak'} password</span>
          </div>
        )}

        <button type="submit" className="sec-save-btn" disabled={loading}>
          {loading ? 'Saving...' : 'Update Password'}
        </button>
      </form>
    </div>
  );
}

function VerificationSection({ user }) {
  return (
    <div className="sec-section">
      <div className="sec-section-head">
        <Shield size={20} className="sec-section-icon" />
        <div>
          <h3 className="sec-section-title">Verification</h3>
          <p className="sec-section-sub">Your account verification status</p>
        </div>
      </div>
      <div className="sec-verify-list">
        {[
          { label: 'Email', value: user?.email || 'user@email.com', verified: true },
          { label: 'Phone', value: '+91 98765-43210', verified: false },
        ].map(v => (
          <div key={v.label} className="sec-verify-row">
            <div className="sec-verify-left">
              {v.verified
                ? <CheckCircle size={18} color="#059669" />
                : <AlertCircle size={18} color="#d97706" />}
              <div>
                <div className="sec-verify-label">{v.label}</div>
                <div className="sec-verify-val">{v.value}</div>
              </div>
            </div>
            {!v.verified && (
              <button className="sec-verify-btn">Verify Now</button>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

function TwoFactorSection() {
  const [enabled, setEnabled] = useState(false);
  return (
    <div className="sec-section">
      <div className="sec-section-head">
        <Lock size={20} className="sec-section-icon" />
        <div>
          <h3 className="sec-section-title">Two-Factor Authentication</h3>
          <p className="sec-section-sub">Add an extra layer of security</p>
        </div>
        <div style={{ marginLeft: 'auto' }}>
          <button
            className={`toggle-switch${enabled ? ' active' : ''}`}
            onClick={() => {
              setEnabled(v => !v);
              toast.info(enabled ? '2FA disabled' : '2FA enabled', { position: 'bottom-right' });
            }}
            aria-label="Toggle 2FA"
          />
        </div>
      </div>
      <p className="sec-2fa-desc">
        {enabled
          ? '✅ Two-factor authentication is enabled. Your account is more secure.'
          : 'Enable 2FA to protect your account from unauthorized access using your phone.'}
      </p>
    </div>
  );
}

function DevicesSection() {
  const [devices, setDevices] = useState(MOCK_DEVICES);

  const revokeDevice = (id) => {
    setDevices(prev => prev.filter(d => d.id !== id));
    toast.info('Device logged out.', { position: 'bottom-right' });
  };

  return (
    <div className="sec-section">
      <div className="sec-section-head">
        <Monitor size={20} className="sec-section-icon" />
        <div>
          <h3 className="sec-section-title">Login Activity</h3>
          <p className="sec-section-sub">Devices currently logged into your account</p>
        </div>
      </div>
      <div className="sec-devices-list">
        {devices.map(d => (
          <div key={d.id} className={`sec-device-row${d.current ? ' current-device' : ''}`}>
            <d.icon size={22} className="sec-device-icon" />
            <div className="sec-device-info">
              <div className="sec-device-name">{d.device}</div>
              <div className="sec-device-meta">{d.location} · {d.time}</div>
            </div>
            {d.current
              ? <span className="sec-device-current">Current</span>
              : (
                <button className="sec-device-revoke" onClick={() => revokeDevice(d.id)}>
                  <LogOut size={13} /> Revoke
                </button>
              )
            }
          </div>
        ))}
      </div>
      <button
        className="sec-logout-all"
        onClick={() => {
          setDevices(prev => prev.filter(d => d.current));
          toast.success('All other devices logged out.', { position: 'bottom-right' });
        }}
      >
        <LogOut size={15} /> Log Out All Other Devices
      </button>
    </div>
  );
}

export default function SecurityTab({ user }) {
  return (
    <div className="sec-wrap">
      <h2 className="dash-section-title">Security</h2>
      <ChangePasswordSection user={user} />
      <VerificationSection user={user} />
      <TwoFactorSection />
      <DevicesSection />
    </div>
  );
}
