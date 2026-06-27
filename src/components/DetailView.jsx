import React, { useState } from 'react';
import {
  ArrowLeft, Phone, Mail, MapPin, Calendar, CreditCard,
  Plus, Minus, Download, CheckCircle, AlertTriangle,
} from 'lucide-react';
import {
  fmt, fmtDate, walletHealth, getInitials, avatarColor, processTransaction,
} from '../utils/ledgerEngine';

export default function DetailView({ wallet, customers, transactions, onBack, onTransact, onExportPDF }) {
  const customer = customers.find(c => c.id === wallet.customerId);
  const txList   = [...(transactions[wallet.id] || [])].sort((a, b) => new Date(b.date) - new Date(a.date));
  const health   = walletHealth(wallet.balance, wallet.autoDeductLimit);

  const [mode, setMode]       = useState(null); // 'deposit' | 'deduct'
  const [amount, setAmount]   = useState('');
  const [desc, setDesc]       = useState('');
  const [txError, setTxError] = useState('');
  const [processing, setProc] = useState(false);

  function handleTransact(type) {
    setTxError('');
    const amt = Number(amount);
    if (!amt || amt <= 0) { setTxError('Please enter a valid amount.'); return; }

    setProc(true);
    setTimeout(() => {
      const result = processTransaction({ wallet, type, amount: amt, description: desc, transactions: txList });
      if (!result.success) { setTxError(result.error); setProc(false); return; }
      onTransact(wallet.id, result.transaction, result.newBalance, result.warnings);
      setMode(null);
      setAmount('');
      setDesc('');
      setProc(false);
    }, 800);
  }

  // PDF Export (uses print)
  function exportPDF() {
    const w = window.open('', '_blank');
    w.document.write(`
      <html><head><title>Wallet Report – ${customer?.name}</title>
      <style>
        body { font-family: Arial, sans-serif; padding: 32px; color: #111; }
        h1 { font-size: 24px; margin-bottom: 4px; }
        .meta { color: #666; font-size: 13px; margin-bottom: 24px; }
        .row { display: flex; justify-content: space-between; padding: 8px 0; border-bottom: 1px solid #eee; }
        table { width: 100%; border-collapse: collapse; margin-top: 24px; }
        th, td { padding: 10px 12px; text-align: left; border-bottom: 1px solid #eee; font-size: 13px; }
        th { background: #f5f5f5; font-weight: 700; }
        .credit { color: #06d6a0; } .debit { color: #ef476f; }
      </style></head>
      <body>
        <h1>Customer Wallet Report</h1>
        <div class="meta">Manivtha Tours &amp; Travels · Generated: ${new Date().toLocaleDateString('en-IN')}</div>
        <div class="row"><span>Customer</span><strong>${customer?.name}</strong></div>
        <div class="row"><span>Mobile</span><strong>${customer?.mobile}</strong></div>
        <div class="row"><span>Wallet ID</span><strong>${wallet.id}</strong></div>
        <div class="row"><span>Current Balance</span><strong>${fmt(wallet.balance)}</strong></div>
        <div class="row"><span>Auto-Deduct Limit</span><strong>${fmt(wallet.autoDeductLimit)}</strong></div>
        <div class="row"><span>Auto-Deduction</span><strong>${wallet.autoDeductEnabled ? 'Enabled' : 'Disabled'}</strong></div>
        <table>
          <thead><tr><th>Date</th><th>Description</th><th>Type</th><th>Amount</th></tr></thead>
          <tbody>
            ${txList.map(tx => `
              <tr>
                <td>${fmtDate(tx.date)}</td>
                <td>${tx.description}</td>
                <td class="${tx.type}">${tx.type.toUpperCase()}</td>
                <td class="${tx.type}">${tx.type === 'credit' ? '+' : '-'}${fmt(tx.amount)}</td>
              </tr>
            `).join('')}
          </tbody>
        </table>
      </body></html>
    `);
    w.document.close();
    w.focus();
    setTimeout(() => { w.print(); }, 500);
  }

  return (
    <div className="fade-in" style={{ maxWidth: 900, margin: '0 auto' }}>
      {/* Back Button */}
      <button
        id="detail-back-btn"
        className="btn btn-secondary btn-sm"
        style={{ marginBottom: 20 }}
        onClick={onBack}
      >
        <ArrowLeft size={14} /> Back to Wallets
      </button>

      {/* Profile Card */}
      <div
        className="glass-card"
        style={{
          padding: '28px',
          marginBottom: '20px',
          background: 'var(--grad-card)',
          display: 'flex',
          gap: '24px',
          alignItems: 'flex-start',
          flexWrap: 'wrap',
        }}
      >
        <div
          style={{
            width: 72, height: 72, borderRadius: '50%',
            background: avatarColor(customer?.name || 'A'),
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontSize: 24, fontWeight: 800, color: 'white', flexShrink: 0,
          }}
        >
          {getInitials(customer?.name || 'A')}
        </div>
        <div style={{ flex: 1 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px', flexWrap: 'wrap', marginBottom: '8px' }}>
            <h2 style={{ fontFamily: 'Outfit', fontSize: 22, fontWeight: 800 }}>{customer?.name}</h2>
            <span className={`badge badge-${customer?.status}`}>{customer?.status}</span>
          </div>
          <div style={{ display: 'flex', gap: '20px', flexWrap: 'wrap' }}>
            {[
              [Phone,    customer?.mobile],
              [Mail,     customer?.email],
              [MapPin,   customer?.city],
              [Calendar, `Joined ${fmtDate(customer?.joined)}`],
            ].map(([Icon, val], i) => (
              <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: 13, color: 'var(--text-muted)' }}>
                <Icon size={13} />
                {val}
              </div>
            ))}
          </div>
        </div>
        <button
          id="export-pdf-btn"
          className="btn btn-secondary btn-sm"
          onClick={exportPDF}
        >
          <Download size={14} /> Export PDF
        </button>
      </div>

      {/* Wallet Stats Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '16px', marginBottom: '20px' }}>
        {[
          { label: 'Current Balance',    value: fmt(wallet.balance),          color: 'var(--color-active)',   icon: '💰' },
          { label: 'Auto-Deduct Limit',  value: fmt(wallet.autoDeductLimit),  color: 'var(--brand-primary)', icon: '⚡' },
          { label: 'Total Transactions', value: txList.length,                color: 'var(--text-primary)',  icon: '📊' },
          { label: 'Wallet Health',      value: health.label,                 color: health.color,           icon: health.level === 'healthy' ? '✅' : '⚠️' },
        ].map(({ label, value, color, icon }) => (
          <div key={label} className="glass-card" style={{ padding: '18px' }}>
            <div style={{ fontSize: 22, marginBottom: 8 }}>{icon}</div>
            <div style={{ fontSize: 11, textTransform: 'uppercase', letterSpacing: '0.08em', color: 'var(--text-muted)', marginBottom: 4 }}>{label}</div>
            <div style={{ fontSize: 18, fontWeight: 800, color }}>{value}</div>
          </div>
        ))}
      </div>

      {/* Low Balance Warning */}
      {(health.level === 'low' || health.level === 'critical') && (
        <div className={`alert-banner ${health.level === 'critical' ? 'danger' : 'warning'}`} style={{ marginBottom: 20 }}>
          <AlertTriangle size={16} className="alert-banner-icon" />
          <div className="alert-banner-text">
            <h4>{health.level === 'critical' ? 'Insufficient Funds' : 'Low Balance Warning'}</h4>
            <p>
              Current balance ({fmt(wallet.balance)}) is{' '}
              {health.level === 'critical' ? 'zero.' : `below the auto-deduction limit (${fmt(wallet.autoDeductLimit)}).`}
            </p>
          </div>
        </div>
      )}

      {/* Action Buttons */}
      <div style={{ display: 'flex', gap: '12px', marginBottom: '20px', flexWrap: 'wrap' }}>
        <button
          id="deposit-btn"
          className={`btn ${mode === 'deposit' ? 'btn-primary' : 'btn-secondary'}`}
          onClick={() => setMode(mode === 'deposit' ? null : 'deposit')}
        >
          <Plus size={15} /> Add Deposit
        </button>
        <button
          id="deduct-btn"
          className={`btn ${mode === 'deduct' ? 'btn-danger' : 'btn-secondary'}`}
          onClick={() => setMode(mode === 'deduct' ? null : 'deduct')}
        >
          <Minus size={15} /> Manual Deduction
        </button>
      </div>

      {/* Transaction Input Panel */}
      {mode && (
        <div
          className="glass-card"
          style={{ padding: '24px', marginBottom: '20px', animation: 'scaleIn 0.3s ease both', borderColor: mode === 'deposit' ? 'rgba(6,214,160,0.3)' : 'rgba(239,71,111,0.3)' }}
        >
          <h3 style={{ marginBottom: '16px', color: mode === 'deposit' ? 'var(--color-active)' : 'var(--color-blocked)' }}>
            {mode === 'deposit' ? '+ Add Deposit' : '− Manual Deduction'}
          </h3>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginBottom: '16px' }}>
            <div className="form-group" style={{ marginBottom: 0 }}>
              <label className="form-label">Amount (₹)</label>
              <input
                id="tx-amount-input"
                type="number"
                min="1"
                className={`form-input${txError ? ' error' : ''}`}
                placeholder="e.g. 5000"
                value={amount}
                onChange={e => { setAmount(e.target.value); setTxError(''); }}
              />
            </div>
            <div className="form-group" style={{ marginBottom: 0 }}>
              <label className="form-label">Description</label>
              <input
                id="tx-desc-input"
                type="text"
                className="form-input"
                placeholder="Optional description"
                value={desc}
                onChange={e => setDesc(e.target.value)}
              />
            </div>
          </div>
          {txError && <div className="form-error" style={{ marginBottom: '12px' }}>{txError}</div>}
          <div style={{ display: 'flex', gap: '10px' }}>
            <button
              id="tx-confirm-btn"
              className={`btn ${mode === 'deposit' ? 'btn-primary' : 'btn-danger'}`}
              onClick={() => handleTransact(mode === 'deposit' ? 'credit' : 'debit')}
              disabled={processing}
            >
              {processing ? <><span className="spinner" /> Processing…</> : <><CheckCircle size={15} /> Confirm</>}
            </button>
            <button className="btn btn-secondary" onClick={() => { setMode(null); setTxError(''); setAmount(''); setDesc(''); }}>
              Cancel
            </button>
          </div>
        </div>
      )}

      {/* Transaction History */}
      <div className="glass-card" style={{ padding: '24px' }}>
        <div className="section-header">
          <div>
            <div className="section-title">Transaction History</div>
            <div className="section-subtitle">{txList.length} records for wallet {wallet.id}</div>
          </div>
        </div>
        <div className="timeline">
          {txList.length === 0 ? (
            <div className="empty-state">
              <CreditCard size={40} />
              <h3>No transactions yet</h3>
              <p>Use the deposit/deduct buttons above to record transactions.</p>
            </div>
          ) : (
            txList.map((tx, i) => (
              <div key={tx.id} className="timeline-item" style={{ animationDelay: `${i * 0.04}s` }}>
                <div className={`tl-icon ${tx.type}`}>
                  {tx.type === 'credit' ? <Plus size={15} /> : <Minus size={15} />}
                </div>
                <div className="tl-body">
                  <div className="tl-desc">{tx.description}</div>
                  <div className="tl-date">{fmtDate(tx.date)} · Balance after: {fmt(tx.balanceAfter)}</div>
                </div>
                <div className={`tl-amount ${tx.type}`}>
                  {tx.type === 'credit' ? '+' : '-'}{fmt(tx.amount)}
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
