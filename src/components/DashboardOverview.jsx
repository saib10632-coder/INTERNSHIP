import React, { useEffect, useState } from 'react';
import {
  Wallet, Users, TrendingUp, ArrowUpRight, ArrowDownRight,
  Activity, AlertTriangle, CreditCard, Zap,
} from 'lucide-react';
import {
  fmt, fmtDateShort, computeSummary, getRecentTransactions,
  getWalletAlerts, getInitials, avatarColor,
} from '../utils/ledgerEngine';
import { MONTHLY_REVENUE } from '../data/mockData';

// ── Animated counter ──
function AnimatedNumber({ target, prefix = '', suffix = '' }) {
  const [val, setVal] = useState(0);
  useEffect(() => {
    let start = 0;
    const step = target / 40;
    const timer = setInterval(() => {
      start += step;
      if (start >= target) { setVal(target); clearInterval(timer); }
      else setVal(Math.floor(start));
    }, 28);
    return () => clearInterval(timer);
  }, [target]);
  return <>{prefix}{val.toLocaleString('en-IN')}{suffix}</>;
}

// ── Mini Bar Chart ──
function MiniBarChart({ data }) {
  const max = Math.max(...data.map(d => d.revenue));
  return (
    <svg width="100%" height="52" viewBox={`0 0 ${data.length * 18} 52`} preserveAspectRatio="none">
      {data.map((d, i) => {
        const h = (d.revenue / max) * 44;
        return (
          <rect
            key={i}
            x={i * 18 + 2}
            y={48 - h}
            width={13}
            height={h}
            rx={3}
            fill={i === data.length - 1 ? 'url(#barGrad)' : 'rgba(108,99,255,0.3)'}
          />
        );
      })}
      <defs>
        <linearGradient id="barGrad" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#6C63FF" />
          <stop offset="100%" stopColor="#3ECFCF" />
        </linearGradient>
      </defs>
    </svg>
  );
}

// ── Line Sparkline ──
function Sparkline({ data, color = '#6C63FF' }) {
  const max = Math.max(...data);
  const min = Math.min(...data);
  const range = max - min || 1;
  const w = 80, h = 30;
  const pts = data.map((v, i) => {
    const x = (i / (data.length - 1)) * w;
    const y = h - ((v - min) / range) * (h - 4);
    return `${x},${y}`;
  }).join(' ');
  return (
    <svg width={w} height={h}>
      <polyline points={pts} fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

export default function DashboardOverview({ wallets, customers, transactions, onNavigate }) {
  const summary = computeSummary(wallets, customers, transactions);
  const recentTx = getRecentTransactions(transactions, 8);
  const alerts = getWalletAlerts(wallets, customers);

  const STATS = [
    {
      label: 'Total Wallet Balance',
      value: summary.totalBalance,
      prefix: '₹',
      icon: Wallet,
      gradient: 'linear-gradient(135deg,rgba(108,99,255,0.25),rgba(108,99,255,0.08))',
      iconColor: '#6C63FF',
      trend: '+12.4%',
      trendUp: true,
      spark: MONTHLY_REVENUE.slice(-6).map(d => d.revenue / 1000),
    },
    {
      label: 'Active Customers',
      value: summary.activeCustomers,
      icon: Users,
      gradient: 'linear-gradient(135deg,rgba(62,207,207,0.25),rgba(62,207,207,0.08))',
      iconColor: '#3ECFCF',
      trend: '+3 this month',
      trendUp: true,
      spark: [4, 6, 7, 9, 11, summary.activeCustomers],
    },
    {
      label: 'Monthly Revenue',
      value: summary.monthlyRevenue || MONTHLY_REVENUE[11].revenue,
      prefix: '₹',
      icon: TrendingUp,
      gradient: 'linear-gradient(135deg,rgba(255,209,102,0.25),rgba(255,209,102,0.08))',
      iconColor: '#FFD166',
      trend: '+18.2%',
      trendUp: true,
      spark: MONTHLY_REVENUE.slice(-6).map(d => d.revenue / 10000),
    },
    {
      label: 'Total Transactions',
      value: summary.totalTx,
      icon: Activity,
      gradient: 'linear-gradient(135deg,rgba(255,107,107,0.25),rgba(255,107,107,0.08))',
      iconColor: '#FF6B6B',
      trend: `${summary.lowBalance} low balance`,
      trendUp: false,
      spark: MONTHLY_REVENUE.slice(-6).map(d => d.transactions),
    },
  ];

  return (
    <div className="fade-in">
      {/* Alert Banners */}
      {alerts.slice(0, 2).map((alert, i) => (
        <div key={i} className={`alert-banner ${alert.type}`}>
          <AlertTriangle size={16} className="alert-banner-icon" />
          <div className="alert-banner-text">
            <h4>{alert.type === 'danger' ? 'Critical Balance Alert' : 'Low Balance Warning'}</h4>
            <p>{alert.message}</p>
          </div>
        </div>
      ))}

      {/* Stat Cards */}
      <div className="stat-grid">
        {STATS.map((s, i) => {
          const Icon = s.icon;
          return (
            <div
              key={i}
              className="glass-card stat-card"
              style={{ animationDelay: `${i * 0.08}s` }}
            >
              <div
                className="stat-card-icon"
                style={{ background: s.gradient }}
              >
                <Icon size={22} color={s.iconColor} />
              </div>
              <div className="stat-card-label">{s.label}</div>
              <div className="stat-card-value">
                <AnimatedNumber target={s.value} prefix={s.prefix || ''} />
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginTop: '8px' }}>
                <div className={`stat-card-trend ${s.trendUp ? 'up' : 'down'}`}>
                  {s.trendUp ? <ArrowUpRight size={14} /> : <ArrowDownRight size={14} />}
                  {s.trend}
                </div>
                <Sparkline data={s.spark} color={s.iconColor} />
              </div>
              <div className="stat-bg-icon">
                <Icon size={90} color={s.iconColor} />
              </div>
            </div>
          );
        })}
      </div>

      {/* Main Two-Column Grid */}
      <div className="dashboard-grid">
        {/* Left – Recent Transactions */}
        <div className="glass-card" style={{ padding: '0', overflow: 'hidden' }}>
          <div className="section-header" style={{ padding: '20px 24px 0' }}>
            <div>
              <div className="section-title">Recent Transactions</div>
              <div className="section-subtitle">Latest wallet activity across all customers</div>
            </div>
            <button
              className="btn btn-secondary btn-sm"
              id="view-all-wallets-btn"
              onClick={() => onNavigate('wallets')}
            >
              View All
            </button>
          </div>
          <div style={{ padding: '16px 24px 24px' }}>
            <div className="timeline">
              {recentTx.map((tx, i) => {
                const cust = customers.find(c => c.id === tx.customerId);
                return (
                  <div key={tx.id} className="timeline-item" style={{ animationDelay: `${i * 0.06}s` }}>
                    <div className={`tl-icon ${tx.type}`}>
                      <CreditCard size={16} />
                    </div>
                    <div className="tl-body">
                      <div className="tl-desc">{tx.description}</div>
                      <div className="tl-date">{cust?.name} · {fmtDateShort(tx.date)}</div>
                    </div>
                    <div className={`tl-amount ${tx.type}`}>
                      {tx.type === 'credit' ? '+' : '-'}{fmt(tx.amount)}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Right – Monthly Chart + Top Wallets */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          {/* Mini Bar Chart Card */}
          <div className="glass-card" style={{ padding: '20px' }}>
            <div className="section-title" style={{ marginBottom: '4px' }}>Monthly Revenue</div>
            <div className="section-subtitle" style={{ marginBottom: '16px' }}>FY 2024 performance</div>
            <MiniBarChart data={MONTHLY_REVENUE} />
            <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '8px' }}>
              {['Jan','Mar','May','Jul','Sep','Nov','Dec'].map(m => (
                <span key={m} style={{ fontSize: '10px', color: 'var(--text-muted)' }}>{m}</span>
              ))}
            </div>
          </div>

          {/* Top 5 Wallets */}
          <div className="glass-card" style={{ padding: '20px' }}>
            <div className="section-title" style={{ marginBottom: '16px' }}>Top Wallets</div>
            <div className="activity-feed">
              {wallets
                .slice()
                .sort((a, b) => b.balance - a.balance)
                .slice(0, 5)
                .map(w => {
                  const cust = customers.find(c => c.id === w.customerId);
                  return (
                    <div key={w.id} className="activity-item">
                      <div
                        className="activity-avatar"
                        style={{ background: avatarColor(cust?.name || 'A') }}
                      >
                        {getInitials(cust?.name || 'A')}
                      </div>
                      <div className="activity-text">
                        <strong>{cust?.name}</strong>
                        <span>{w.id}</span>
                      </div>
                      <div className="activity-amount" style={{ color: 'var(--color-active)' }}>
                        {fmt(w.balance)}
                      </div>
                    </div>
                  );
                })
              }
            </div>
          </div>

          {/* Quick Stats */}
          <div className="glass-card" style={{ padding: '20px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '16px' }}>
              <Zap size={16} color="var(--brand-gold)" />
              <div className="section-title">Quick Stats</div>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              {[
                { label: 'Auto-Deduction Active', val: wallets.filter(w => w.autoDeductEnabled).length, color: 'var(--color-active)' },
                { label: 'Low Balance Wallets',   val: summary.lowBalance, color: 'var(--color-pending)' },
                { label: 'Blocked Customers',     val: customers.filter(c => c.status === 'blocked').length, color: 'var(--color-blocked)' },
                { label: 'Pending Customers',     val: customers.filter(c => c.status === 'pending').length, color: 'var(--color-inactive)' },
              ].map(({ label, val, color }) => (
                <div key={label} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <span style={{ fontSize: '13px', color: 'var(--text-muted)' }}>{label}</span>
                  <span style={{ fontSize: '15px', fontWeight: 700, color }}>{val}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
