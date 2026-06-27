import React, { useState } from 'react';
import {
  CheckCircle,
  ChevronDown,
  IndianRupee,
  Mail,
  MapPin,
  Phone,
  StickyNote,
  User,
  UserPlus,
  Zap,
} from 'lucide-react';
import {
  validateWalletForm, walletHealth, fmt, getInitials, avatarColor,
} from '../utils/ledgerEngine';

const EMPTY_CUSTOMER = {
  name: '',
  mobile: '',
  email: '',
  city: '',
  status: 'active',
};

export default function WalletForm({ customers, wallets, onSubmit }) {
  const [customerMode, setCustomerMode] = useState('existing');
  const [form, setForm] = useState({
    customerId: '',
    balance: '',
    autoDeductLimit: '',
    autoDeductEnabled: true,
    notes: '',
  });
  const [newCustomer, setNewCustomer] = useState(EMPTY_CUSTOMER);
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [created, setCreated] = useState(null);

  const existingWalletCustIds = wallets.map(w => w.customerId);
  const eligibleCustomers = customers.filter(
    c => c.status !== 'blocked' && !existingWalletCustIds.includes(c.id)
  );

  const selected = customers.find(c => c.id === form.customerId);

  function handleChange(field, value) {
    setForm(f => ({ ...f, [field]: value }));
    if (errors[field]) setErrors(e => ({ ...e, [field]: undefined }));
  }

  function handleCustomerChange(field, value) {
    setNewCustomer(c => ({ ...c, [field]: value }));
    if (errors[field]) setErrors(e => ({ ...e, [field]: undefined }));
  }

  function switchCustomerMode(mode) {
    setCustomerMode(mode);
    setErrors({});
    if (mode === 'new') setForm(f => ({ ...f, customerId: '' }));
  }

  function validateNewCustomer() {
    const errs = {};
    const mobile = newCustomer.mobile.trim();
    if (!newCustomer.name.trim()) errs.name = 'Enter customer name.';
    if (!mobile) errs.mobile = 'Enter mobile number.';
    else if (!/^[6-9]\d{9}$/.test(mobile)) errs.mobile = 'Enter a valid 10-digit Indian mobile number.';
    if (!newCustomer.city.trim()) errs.city = 'Enter city.';
    if (newCustomer.email.trim() && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(newCustomer.email.trim())) {
      errs.email = 'Enter a valid email address.';
    }
    if (customers.some(c => c.mobile === mobile)) errs.mobile = 'A customer with this mobile number already exists.';
    return errs;
  }

  async function handleSubmit(e) {
    e.preventDefault();
    const errs = validateWalletForm({
      ...form,
      customerId: customerMode === 'new' ? 'new-customer' : form.customerId,
    });
    if (customerMode === 'new') Object.assign(errs, validateNewCustomer());
    if (Object.keys(errs).length) {
      setErrors(errs);
      return;
    }

    setLoading(true);
    try {
      await new Promise(resolve => setTimeout(resolve, 500));
      const nextWalletNumber = wallets.reduce((max, w) => {
        const num = Number(String(w.id).replace(/\D/g, ''));
        return Number.isFinite(num) ? Math.max(max, num) : max;
      }, 0) + 1;
      const newWallet = {
        id: `W${String(nextWalletNumber).padStart(3, '0')}`,
        customerId: form.customerId,
        balance: Number(form.balance),
        autoDeductLimit: Number(form.autoDeductLimit),
        autoDeductEnabled: form.autoDeductEnabled,
        notes: form.notes,
        createdAt: new Date().toISOString().split('T')[0],
        lastActivity: new Date().toISOString().split('T')[0],
      };
      const customerDraft = customerMode === 'new'
        ? {
            name: newCustomer.name.trim(),
            mobile: newCustomer.mobile.trim(),
            email: newCustomer.email.trim(),
            city: newCustomer.city.trim(),
            status: newCustomer.status,
          }
        : null;
      const result = await onSubmit(newWallet, customerDraft);
      setCreated(result || { wallet: newWallet, customer: selected });
      setSuccess(true);
    } finally {
      setLoading(false);
    }
  }

  function handleReset() {
    setForm({ customerId: '', balance: '', autoDeductLimit: '', autoDeductEnabled: true, notes: '' });
    setNewCustomer(EMPTY_CUSTOMER);
    setCustomerMode('existing');
    setErrors({});
    setSuccess(false);
    setCreated(null);
  }

  if (success && created) {
    const health = walletHealth(created.wallet.balance, created.wallet.autoDeductLimit);
    return (
      <div className="glass-card" style={{ maxWidth: 560, margin: '0 auto' }}>
        <div className="success-screen">
          <div className="success-ring">
            <svg width="48" height="48" viewBox="0 0 48 48" fill="none">
              <polyline
                points="10,24 20,34 38,14"
                stroke="white"
                strokeWidth="4"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="success-check"
              />
            </svg>
          </div>
          <div className="success-title">Wallet Created!</div>
          <div className="success-subtitle">
            A prepaid travel wallet has been successfully created for{' '}
            <strong style={{ color: 'var(--brand-primary)' }}>{created.customer?.name}</strong>.
          </div>

          <div
            className="glass-card"
            style={{ width: '100%', padding: '24px', marginTop: '24px', textAlign: 'left' }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '16px', marginBottom: '20px' }}>
              <div
                style={{
                  width: 52, height: 52, borderRadius: '50%',
                  background: avatarColor(created.customer?.name || 'A'),
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  fontWeight: 700, fontSize: 18, color: 'white',
                }}
              >
                {getInitials(created.customer?.name || 'A')}
              </div>
              <div>
                <div style={{ fontSize: 16, fontWeight: 700, color: 'var(--text-primary)' }}>{created.customer?.name}</div>
                <div style={{ fontSize: 12, color: 'var(--text-muted)' }}>{created.wallet.id} / {created.customer?.city}</div>
              </div>
            </div>
            {[
              ['Initial Balance', fmt(created.wallet.balance)],
              ['Auto-Deduct Limit', fmt(created.wallet.autoDeductLimit)],
              ['Auto-Deduction', created.wallet.autoDeductEnabled ? 'Enabled' : 'Disabled'],
              ['Wallet Health', health.label],
            ].map(([label, val]) => (
              <div key={label} style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '10px' }}>
                <span style={{ fontSize: 13, color: 'var(--text-muted)' }}>{label}</span>
                <span style={{ fontSize: 13, fontWeight: 600, color: 'var(--text-primary)' }}>{val}</span>
              </div>
            ))}
            {created.wallet.notes && (
              <div style={{ marginTop: '12px', padding: '10px 12px', background: 'var(--glass-bg)', borderRadius: 8, fontSize: 12, color: 'var(--text-muted)' }}>
                {created.wallet.notes}
              </div>
            )}
          </div>

          <button
            id="create-another-wallet-btn"
            className="btn btn-primary"
            style={{ marginTop: '24px' }}
            onClick={handleReset}
          >
            Create Another Wallet
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="glass-card" style={{ maxWidth: 760, margin: '0 auto', padding: '32px' }}>
      <div style={{ marginBottom: '28px' }}>
        <h2 style={{ fontFamily: 'Outfit', fontSize: 22, fontWeight: 800, color: 'var(--text-primary)', marginBottom: 4 }}>
          New Wallet Entry
        </h2>
        <p style={{ fontSize: 14, color: 'var(--text-muted)' }}>
          Create a prepaid travel wallet for an existing customer or add a new customer first.
        </p>
      </div>

      <form onSubmit={handleSubmit} id="wallet-form" noValidate>
        <div className="customer-mode-tabs" role="tablist" aria-label="Customer type">
          <button
            type="button"
            className={`customer-mode-tab${customerMode === 'existing' ? ' active' : ''}`}
            onClick={() => switchCustomerMode('existing')}
          >
            <User size={15} />
            Select Customer
          </button>
          <button
            type="button"
            className={`customer-mode-tab${customerMode === 'new' ? ' active' : ''}`}
            onClick={() => switchCustomerMode('new')}
          >
            <UserPlus size={15} />
            Add New Customer
          </button>
        </div>

        {customerMode === 'existing' ? (
          <div className="form-group">
            <label className="form-label" htmlFor="form-customer">
              <User size={12} style={{ marginRight: 4 }} />
              Customer
            </label>
            <div style={{ position: 'relative' }}>
              <select
                id="form-customer"
                className={`form-select${errors.customerId ? ' error' : ''}`}
                value={form.customerId}
                onChange={e => handleChange('customerId', e.target.value)}
              >
                <option value="">Select a customer</option>
                {eligibleCustomers.map(c => (
                  <option key={c.id} value={c.id}>
                    {c.name} / {c.mobile} / {c.city}
                  </option>
                ))}
              </select>
              <ChevronDown
                size={16}
                style={{
                  position: 'absolute', right: 14, top: '50%',
                  transform: 'translateY(-50%)',
                  color: 'var(--text-muted)', pointerEvents: 'none',
                }}
              />
            </div>
            {errors.customerId && <div className="form-error">{errors.customerId}</div>}
            {eligibleCustomers.length === 0 && (
              <div className="form-error">All active customers already have wallets.</div>
            )}
          </div>
        ) : (
          <div className="new-customer-panel">
            <div className="form-grid">
              <div className="form-group">
                <label className="form-label" htmlFor="new-customer-name">
                  <User size={12} style={{ marginRight: 4 }} />
                  Full Name
                </label>
                <input
                  id="new-customer-name"
                  className={`form-input${errors.name ? ' error' : ''}`}
                  placeholder="e.g. Rahul Kumar"
                  value={newCustomer.name}
                  onChange={e => handleCustomerChange('name', e.target.value)}
                />
                {errors.name && <div className="form-error">{errors.name}</div>}
              </div>
              <div className="form-group">
                <label className="form-label" htmlFor="new-customer-mobile">
                  <Phone size={12} style={{ marginRight: 4 }} />
                  Mobile
                </label>
                <input
                  id="new-customer-mobile"
                  className={`form-input${errors.mobile ? ' error' : ''}`}
                  inputMode="numeric"
                  maxLength="10"
                  placeholder="10-digit mobile"
                  value={newCustomer.mobile}
                  onChange={e => handleCustomerChange('mobile', e.target.value.replace(/\D/g, '').slice(0, 10))}
                />
                {errors.mobile && <div className="form-error">{errors.mobile}</div>}
              </div>
              <div className="form-group">
                <label className="form-label" htmlFor="new-customer-email">
                  <Mail size={12} style={{ marginRight: 4 }} />
                  Email
                </label>
                <input
                  id="new-customer-email"
                  type="email"
                  className={`form-input${errors.email ? ' error' : ''}`}
                  placeholder="customer@email.com"
                  value={newCustomer.email}
                  onChange={e => handleCustomerChange('email', e.target.value)}
                />
                {errors.email && <div className="form-error">{errors.email}</div>}
              </div>
              <div className="form-group">
                <label className="form-label" htmlFor="new-customer-city">
                  <MapPin size={12} style={{ marginRight: 4 }} />
                  City
                </label>
                <input
                  id="new-customer-city"
                  className={`form-input${errors.city ? ' error' : ''}`}
                  placeholder="e.g. Chennai"
                  value={newCustomer.city}
                  onChange={e => handleCustomerChange('city', e.target.value)}
                />
                {errors.city && <div className="form-error">{errors.city}</div>}
              </div>
            </div>
          </div>
        )}

        {customerMode === 'existing' && selected && (
          <div
            className="glass-card"
            style={{ padding: '14px 18px', marginBottom: '24px', display: 'flex', alignItems: 'center', gap: '14px', animation: 'scaleIn 0.3s ease both' }}
          >
            <div
              style={{
                width: 40, height: 40, borderRadius: '50%',
                background: avatarColor(selected.name),
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontSize: 14, fontWeight: 700, color: 'white',
              }}
            >
              {getInitials(selected.name)}
            </div>
            <div>
              <div style={{ fontWeight: 700, fontSize: 14, color: 'var(--text-primary)' }}>{selected.name}</div>
              <div style={{ fontSize: 12, color: 'var(--text-muted)' }}>{selected.email} / {selected.city}</div>
            </div>
            <div
              className={`badge badge-${selected.status}`}
              style={{ marginLeft: 'auto' }}
            >
              {selected.status}
            </div>
          </div>
        )}

        <div className="form-grid">
          <div className="form-group">
            <label className="form-label" htmlFor="form-balance">
              <IndianRupee size={12} style={{ marginRight: 4 }} />
              Initial Balance
            </label>
            <input
              id="form-balance"
              type="number"
              min="1"
              className={`form-input${errors.balance ? ' error' : ''}`}
              placeholder="e.g. 50000"
              value={form.balance}
              onChange={e => handleChange('balance', e.target.value)}
            />
            {errors.balance && <div className="form-error">{errors.balance}</div>}
          </div>
          <div className="form-group">
            <label className="form-label" htmlFor="form-limit">
              <Zap size={12} style={{ marginRight: 4 }} />
              Auto-Deduction Limit
            </label>
            <input
              id="form-limit"
              type="number"
              min="1"
              className={`form-input${errors.autoDeductLimit ? ' error' : ''}`}
              placeholder="e.g. 5000"
              value={form.autoDeductLimit}
              onChange={e => handleChange('autoDeductLimit', e.target.value)}
            />
            {errors.autoDeductLimit && <div className="form-error">{errors.autoDeductLimit}</div>}
          </div>
        </div>

        {form.balance && form.autoDeductLimit && !errors.balance && !errors.autoDeductLimit && (
          <div
            className="glass-card"
            style={{ padding: '12px 16px', marginBottom: '24px', display: 'flex', gap: '10px', alignItems: 'center', animation: 'fadeIn 0.3s ease both' }}
          >
            {(() => {
              const h = walletHealth(Number(form.balance), Number(form.autoDeductLimit));
              return (
                <>
                  <div>
                    <div style={{ fontWeight: 700, fontSize: 13, color: h.color }}>{h.label}</div>
                    <div style={{ fontSize: 12, color: 'var(--text-muted)' }}>
                      Balance covers {Math.floor(Number(form.balance) / Number(form.autoDeductLimit))} auto-deduction cycles
                    </div>
                  </div>
                </>
              );
            })()}
          </div>
        )}

        <div className="form-group">
          <div className="toggle-wrapper">
            <label className="toggle" htmlFor="form-auto-deduct">
              <input
                id="form-auto-deduct"
                type="checkbox"
                checked={form.autoDeductEnabled}
                onChange={e => handleChange('autoDeductEnabled', e.target.checked)}
              />
              <span className="toggle-slider" />
            </label>
            <span className="toggle-label">
              <strong>Auto-Deduction {form.autoDeductEnabled ? 'Enabled' : 'Disabled'}</strong>
              {' '}Automatically deduct the scheduled amount from the wallet balance.
            </span>
          </div>
        </div>

        <div className="form-group">
          <label className="form-label" htmlFor="form-notes">
            <StickyNote size={12} style={{ marginRight: 4 }} />
            Notes
          </label>
          <textarea
            id="form-notes"
            className="form-textarea"
            placeholder="e.g. Family tour package, preferred destinations, special requirements..."
            value={form.notes}
            onChange={e => handleChange('notes', e.target.value)}
          />
        </div>

        <div style={{ display: 'flex', gap: '12px', justifyContent: 'flex-end', marginTop: '8px' }}>
          <button
            type="button"
            id="form-reset-btn"
            className="btn btn-secondary"
            onClick={handleReset}
          >
            Reset
          </button>
          <button
            type="submit"
            id="form-submit-btn"
            className="btn btn-primary"
            disabled={loading}
          >
            {loading ? (
              <>
                <span className="spinner" />
                Creating Wallet...
              </>
            ) : (
              <>
                <CheckCircle size={16} />
                Create Wallet
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
}
