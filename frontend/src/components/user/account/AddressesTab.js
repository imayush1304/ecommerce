import { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { toast } from 'react-toastify';
import { MapPin, Plus, Edit2, Trash2, Check, X, CheckCircle, Home, Briefcase, Map } from 'lucide-react';
import { addAddress, updateAddress, deleteAddress } from '../../../actions/userActions';

const INDIAN_STATES = [
  "Andaman and Nicobar Islands","Andhra Pradesh","Arunachal Pradesh","Assam","Bihar","Chandigarh","Chhattisgarh","Dadra and Nagar Haveli","Daman and Diu",
  "Delhi","Goa","Gujarat","Haryana","Himachal Pradesh","Jammu and Kashmir","Jharkhand","Karnataka","Kerala","Ladakh","Lakshadweep","Madhya Pradesh",
  "Maharashtra","Manipur","Meghalaya","Mizoram","Nagaland","Odisha","Puducherry","Punjab","Rajasthan","Sikkim","Tamil Nadu","Telangana","Tripura",
  "Uttar Pradesh","Uttarakhand","West Bengal"
];

function AddressForm({ initialData = null, onClose }) {
  const dispatch = useDispatch();
  const [form, setForm] = useState(initialData || {
    name: '', phone: '', house: '', street: '', city: '', state: '', pincode: '', type: 'home', isDefault: false
  });
  const [errors, setErrors] = useState({});

  const validate = () => {
    const e = {};
    if (!form.name.trim()) e.name = 'Name is required';
    if (!form.phone.trim() || !/^\d{10}$/.test(form.phone)) e.phone = 'Valid 10-digit phone required';
    if (!form.house.trim()) e.house = 'House/Flat is required';
    if (!form.street.trim()) e.street = 'Street is required';
    if (!form.city.trim()) e.city = 'City is required';
    if (!form.state) e.state = 'State is required';
    if (!form.pincode.trim() || !/^\d{6}$/.test(form.pincode)) e.pincode = 'Valid 6-digit pincode required';
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleSubmit = (ev) => {
    ev.preventDefault();
    if (!validate()) return;
    
    if (initialData?._id) {
        dispatch(updateAddress(initialData._id, form));
        toast.success('Address updated!', { position: 'bottom-right' });
    } else {
        dispatch(addAddress(form));
        toast.success('Address saved!', { position: 'bottom-right' });
    }
    onClose();
  };

  return (
    <div className="addr-form-card">
      <h3 className="addr-form-title">{initialData ? 'Edit Address' : 'Add New Address'}</h3>
      <form onSubmit={handleSubmit} className="af-form">
        <div className="af-grid-2">
          <div className="af-field">
            <label className="af-label">Full Name</label>
            <input className={`af-input${errors.name ? ' af-input-err' : ''}`} value={form.name} onChange={e => setForm(f => ({ ...f, name: e.target.value }))} placeholder="John Doe" />
            {errors.name && <span className="af-err">{errors.name}</span>}
          </div>
          <div className="af-field">
            <label className="af-label">Phone Number</label>
            <input className={`af-input${errors.phone ? ' af-input-err' : ''}`} value={form.phone} onChange={e => setForm(f => ({ ...f, phone: e.target.value }))} placeholder="10-digit mobile number" maxLength={10} />
            {errors.phone && <span className="af-err">{errors.phone}</span>}
          </div>
        </div>

        <div className="af-grid-2">
          <div className="af-field">
            <label className="af-label">House/Flat No., Building</label>
            <input className={`af-input${errors.house ? ' af-input-err' : ''}`} value={form.house} onChange={e => setForm(f => ({ ...f, house: e.target.value }))} placeholder="e.g. Flat 101, A Wing" />
            {errors.house && <span className="af-err">{errors.house}</span>}
          </div>
          <div className="af-field">
            <label className="af-label">Street, Sector, Area</label>
            <input className={`af-input${errors.street ? ' af-input-err' : ''}`} value={form.street} onChange={e => setForm(f => ({ ...f, street: e.target.value }))} placeholder="e.g. MG Road, Sector 14" />
            {errors.street && <span className="af-err">{errors.street}</span>}
          </div>
        </div>

        <div className="af-grid-3">
          <div className="af-field">
            <label className="af-label">City</label>
            <input className={`af-input${errors.city ? ' af-input-err' : ''}`} value={form.city} onChange={e => setForm(f => ({ ...f, city: e.target.value }))} placeholder="City Name" />
            {errors.city && <span className="af-err">{errors.city}</span>}
          </div>
          <div className="af-field">
            <label className="af-label">State</label>
            <select className={`af-input af-select${errors.state ? ' af-input-err' : ''}`} value={form.state} onChange={e => setForm(f => ({ ...f, state: e.target.value }))}>
              <option value="">Select State</option>
              {INDIAN_STATES.map(s => <option key={s} value={s}>{s}</option>)}
            </select>
            {errors.state && <span className="af-err">{errors.state}</span>}
          </div>
          <div className="af-field">
            <label className="af-label">Pincode</label>
            <input className={`af-input${errors.pincode ? ' af-input-err' : ''}`} value={form.pincode} onChange={e => setForm(f => ({ ...f, pincode: e.target.value }))} placeholder="6 digits" maxLength={6} />
            {errors.pincode && <span className="af-err">{errors.pincode}</span>}
          </div>
        </div>

        <div className="af-field" style={{ marginTop: '0.5rem' }}>
          <label className="af-label">Address Type</label>
          <div className="af-type-row">
            <button type="button" className={`af-type-btn${form.type === 'home' ? ' active' : ''}`} onClick={() => setForm(f => ({ ...f, type: 'home' }))}><Home size={14} style={{ display: 'inline', marginBottom: '-2px' }}/> Home</button>
            <button type="button" className={`af-type-btn${form.type === 'work' ? ' active' : ''}`} onClick={() => setForm(f => ({ ...f, type: 'work' }))}><Briefcase size={14} style={{ display: 'inline', marginBottom: '-2px' }}/> Work</button>
            <button type="button" className={`af-type-btn${form.type === 'other' ? ' active' : ''}`} onClick={() => setForm(f => ({ ...f, type: 'other' }))}><Map size={14} style={{ display: 'inline', marginBottom: '-2px' }}/> Other</button>
          </div>
        </div>

        <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', cursor: 'pointer', marginTop: '1rem', fontSize: '0.85rem' }}>
          <input type="checkbox" checked={form.isDefault} onChange={e => setForm(f => ({ ...f, isDefault: e.target.checked }))} style={{ accentColor: 'var(--accent)', width: '16px', height: '16px' }} />
          Make this my default address
        </label>

        <div className="af-footer">
          <button type="button" className="af-cancel-btn" onClick={onClose}>Cancel</button>
          <button type="submit" className="af-save-btn">Save Address</button>
        </div>
      </form>
    </div>
  );
}

export default function AddressesTab() {
  const dispatch = useDispatch();
  const { user } = useSelector(s => s.authState);
  const addresses = user?.addresses || [];

  const [showForm, setShowForm] = useState(false);
  const [editingAddr, setEditingAddr] = useState(null);
  const [deletingId, setDeletingId] = useState(null);

  const openNew = () => { setEditingAddr(null); setShowForm(true); };
  const openEdit = (addr) => { setEditingAddr(addr); setShowForm(true); };

  const handleSetDefault = (addr) => {
      dispatch(updateAddress(addr._id, { ...addr, isDefault: true }));
      toast.success('Default address updated', { position: 'bottom-right' });
  };

  const confirmDelete = () => {
    dispatch(deleteAddress(deletingId));
    toast.success('Address deleted.', { position: 'bottom-right' });
    setDeletingId(null);
  };

  return (
    <div className="addr-wrap">
      {deletingId && (
        <div className="modal-overlay" onClick={() => setDeletingId(null)}>
          <div className="modal-box" onClick={e => e.stopPropagation()}>
            <h3 className="modal-title danger-title">Delete Address</h3>
            <p className="modal-body">Are you sure you want to delete this address? This action cannot be undone.</p>
            <div className="modal-actions">
              <button className="modal-cancel" onClick={() => setDeletingId(null)}>Cancel</button>
              <button className="modal-confirm danger" onClick={confirmDelete}>Delete Address</button>
            </div>
          </div>
        </div>
      )}

      <div className="addr-header">
        <h2 className="dash-section-title" style={{ margin: 0 }}>Saved Addresses</h2>
        {!showForm && (
          <button className="addr-add-btn" onClick={openNew}>
            <Plus size={16} /> Add New
          </button>
        )}
      </div>

      {showForm && (
        <AddressForm
          initialData={editingAddr}
          onClose={() => { setShowForm(false); setEditingAddr(null); }}
        />
      )}

      <div className="addr-grid">
        {addresses.map(addr => (
          <div key={addr._id} className={`addr-card${addr.isDefault ? ' addr-card-default' : ''}`}>
            {addr.isDefault && <span className="addr-default-badge"><CheckCircle size={12}/> Default</span>}
            <div className="addr-type-chip">
              {addr.type === 'home' && <Home size={13} style={{ display: 'inline', marginBottom: '-2px' }}/>}
              {addr.type === 'work' && <Briefcase size={13} style={{ display: 'inline', marginBottom: '-2px' }}/>}
              {addr.type === 'other' && <Map size={13} style={{ display: 'inline', marginBottom: '-2px' }}/>}
              {' '} {addr.type.toUpperCase()}
            </div>
            <div className="addr-name">{addr.name}</div>
            <div className="addr-phone">{addr.phone}</div>
            <div className="addr-line">{addr.house}, {addr.street}</div>
            <div className="addr-line">{addr.city}, {addr.state} — {addr.pincode}</div>
            
            <div className="addr-actions">
              {!addr.isDefault && (
                <button className="addr-btn addr-btn-ghost" onClick={() => handleSetDefault(addr)}>Set Default</button>
              )}
              <button className="addr-btn addr-btn-ghost" onClick={() => openEdit(addr)}><Edit2 size={13}/> Edit</button>
              <button className="addr-btn addr-btn-danger" onClick={() => setDeletingId(addr._id)}><Trash2 size={13}/> Delete</button>
            </div>
          </div>
        ))}

        {addresses.length === 0 && !showForm && (
          <div className="ord-empty" style={{ gridColumn: '1 / -1' }}>
            <div className="ord-empty-icon">📍</div>
            <h3>No Addresses Found</h3>
            <p>You haven't saved any addresses yet.</p>
          </div>
        )}
      </div>
    </div>
  );
}
