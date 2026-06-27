import React, { useMemo } from 'react';
import {
  BarChart, Bar, LineChart, Line, XAxis, YAxis, CartesianGrid,
  Tooltip, ResponsiveContainer, PieChart, Pie, Cell, Legend,
} from 'recharts';
import { Download, TrendingUp, Users, Wallet, Calendar } from 'lucide-react';
import { fmt, walletHealth, getInitials, avatarColor } from '../utils/ledgerEngine';
import { MONTHLY_REVENUE } from '../data/mockData';

const COLORS = ['#6C63FF', '#3ECFCF', '#FFD166', '#FF6B6B', '#06d6a0', '#ef476f'];

function monthLabel(ym) {
  return new Date(ym + '-01').toLocaleDateString('en-IN', { month: 'short', year: '2-digit' });
}

export default function Reports({ wallets, customers, transactions }) {
  const allTx = useMemo(() => Object.values(transactions).flat(), [transactions]);

  const monthlyCredits = useMemo(() => {
    const map = {};
    allTx.filter(tx => tx.type === 'credit').forEach(tx => {
      const month = tx.date.slice(0, 7);
      map[month] = (map[month] || 0) + tx.amount;
    });
    return Object.entries(map).sort().map(([m, v]) => ({ month: monthLabel(m), Revenue: v }));
  }, [allTx]);

  const monthlyDebits = useMemo(() => {
    const map = {};
    allTx.filter(tx => tx.type === 'debit').forEach(tx => {
      const month = tx.date.slice(0, 7);
      map[month] = (map[month] || 0) + tx.amount;
    });
    return Object.entries(map).sort().map(([m, v]) => ({ month: monthLabel(m), Bookings: v }));
  }, [allTx]);

  const healthData = useMemo(() => {
    const map = {};
    wallets.forEach(w => {
      const label = walletHealth(w.balance, w.autoDeductLimit).label;
      map[label] = (map[label] || 0) + 1;
    });
    return Object.entries(map).map(([name, value]) => ({ name, value }));
  }, [wallets]);

  const growthData = useMemo(() => {
    const map = {};
    customers.forEach(c => {
      const month = c.joined.slice(0, 7);
      map[month] = (map[month] || 0) + 1;
    });
    return Object.entries(map).sort().map(([m, v]) => ({ month: monthLabel(m), Customers: v }));
  }, [customers]);

  const totalCredits = allTx.filter(t => t.type === 'credit').reduce((s, t) => s + t.amount, 0);
  const totalDebits = allTx.filter(t => t.type === 'debit').reduce((s, t) => s + t.amount, 0);
  const totalBalance = wallets.reduce((s, w) => s + w.balance, 0);

  const exportCSV = () => {
    const rows = [
      ['Wallet ID', 'Customer', 'Mobile', 'Balance', 'Health', 'Auto-Deduct', 'Created', 'Total Credits', 'Total Debits'],
      ...wallets.map(w => {
        const cust = customers.find(c => c.id === w.customerId);
        const txList = transactions[w.id] || [];
        const cr = txList.filter(t => t.type === 'credit').reduce((a, t) => a + t.amount, 0);
        const db = txList.filter(t => t.type === 'debit').reduce((a, t) => a + t.amount, 0);
        return [
          w.id, cust?.name, cust?.mobile, w.balance,
          walletHealth(w.balance, w.autoDeductLimit).label,
          w.autoDeductEnabled ? 'Yes' : 'No', w.createdAt, cr, db,
        ];
      }),
    ];
    const csv = rows.map(r => r.join(',')).join('\n');
    const blob = new Blob([csv], { type: 'text/csv' });
    const a = document.createElement('a');
    a.href = URL.createObjectURL(blob);
    a.download = 'Manivtha_Wallet_Report.csv';
    a.click();
  };

  const tooltipStyle = {
    background: 'rgba(15,23,42,0.95)', border: '1px solid rgba(255,255,255,0.1)',
    borderRadius: '8px', color: '#f8fafc', fontSize: '0.8rem',
  };

  return (
    <div className="reports-page fade-in">
      <div className="reports-header">
        <div>
          <h2 style={{ fontFamily: 'Outfit', fontWeight: 800 }}>Reports &amp; Analytics</h2>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.875rem', marginTop: '0.25rem' }}>
            Insights across all customer travel wallets
          </p>
        </div>
        <button className="btn btn-primary btn-sm" onClick={exportCSV}>
          <Download size={16} /> Export CSV
        </button>
      </div>

      <div className="kpi-row">
        {[
          { label: 'Total Wallet Balances', value: fmt(totalBalance), icon: Wallet, color: '#6C63FF' },
          { label: 'Total Credits Loaded', value: fmt(totalCredits), icon: TrendingUp, color: '#06d6a0' },
          { label: 'Total Bookings Amount', value: fmt(totalDebits), icon: Calendar, color: '#ef476f' },
          { label: 'Active Customers', value: customers.filter(c => c.status === 'active').length, icon: Users, color: '#FFD166' },
        ].map((k, i) => {
          const Icon = k.icon;
          return (
            <div key={i} className="kpi-card glass-card">
              <div className="kpi-icon" style={{ background: `${k.color}22`, color: k.color }}><Icon size={20} /></div>
              <div className="kpi-val">{k.value}</div>
              <div className="kpi-lbl">{k.label}</div>
            </div>
          );
        })}
      </div>

      <div className="charts-grid">
        <div className="chart-card glass-card">
          <h3 className="chart-title">Monthly Credits Loaded</h3>
          <ResponsiveContainer width="100%" height={220}>
            <BarChart data={monthlyCredits.length ? monthlyCredits : MONTHLY_REVENUE.map(d => ({ month: d.month, Revenue: d.revenue }))}>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.06)" />
              <XAxis dataKey="month" tick={{ fill: '#94a3b8', fontSize: 12 }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fill: '#94a3b8', fontSize: 11 }} axisLine={false} tickLine={false} tickFormatter={v => `₹${(v / 1000).toFixed(0)}k`} />
              <Tooltip contentStyle={tooltipStyle} formatter={v => [fmt(v), 'Credits']} />
              <Bar dataKey="Revenue" fill="#6C63FF" radius={[5, 5, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        <div className="chart-card glass-card">
          <h3 className="chart-title">Monthly Booking Deductions</h3>
          <ResponsiveContainer width="100%" height={220}>
            <LineChart data={monthlyDebits}>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.06)" />
              <XAxis dataKey="month" tick={{ fill: '#94a3b8', fontSize: 12 }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fill: '#94a3b8', fontSize: 11 }} axisLine={false} tickLine={false} tickFormatter={v => `₹${(v / 1000).toFixed(0)}k`} />
              <Tooltip contentStyle={tooltipStyle} formatter={v => [fmt(v), 'Bookings']} />
              <Line type="monotone" dataKey="Bookings" stroke="#06d6a0" strokeWidth={2.5} dot={{ fill: '#06d6a0', r: 5 }} />
            </LineChart>
          </ResponsiveContainer>
        </div>

        <div className="chart-card glass-card">
          <h3 className="chart-title">Customer Growth by Month</h3>
          <ResponsiveContainer width="100%" height={220}>
            <BarChart data={growthData}>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.06)" />
              <XAxis dataKey="month" tick={{ fill: '#94a3b8', fontSize: 12 }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fill: '#94a3b8', fontSize: 11 }} axisLine={false} tickLine={false} allowDecimals={false} />
              <Tooltip contentStyle={tooltipStyle} />
              <Bar dataKey="Customers" fill="#FFD166" radius={[5, 5, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        <div className="chart-card glass-card">
          <h3 className="chart-title">Wallet Health Distribution</h3>
          <ResponsiveContainer width="100%" height={220}>
            <PieChart>
              <Pie data={healthData} cx="50%" cy="50%" innerRadius={55} outerRadius={85} paddingAngle={3} dataKey="value">
                {healthData.map((_, i) => <Cell key={i} fill={COLORS[i % COLORS.length]} />)}
              </Pie>
              <Tooltip contentStyle={tooltipStyle} />
              <Legend wrapperStyle={{ color: '#94a3b8', fontSize: '0.8rem' }} />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="glass-card report-table-card">
        <h3 className="chart-title" style={{ marginBottom: '1rem' }}>Wallet Summary Table</h3>
        <div style={{ overflowX: 'auto' }}>
          <table className="data-table">
            <thead>
              <tr>
                <th>Customer</th><th>Balance</th><th>Health</th><th>Auto-Deduct</th><th>Credits</th><th>Debits</th><th>Txns</th>
              </tr>
            </thead>
            <tbody>
              {wallets.map(w => {
                const cust = customers.find(c => c.id === w.customerId);
                const txList = transactions[w.id] || [];
                const cr = txList.filter(t => t.type === 'credit').reduce((a, t) => a + t.amount, 0);
                const db = txList.filter(t => t.type === 'debit').reduce((a, t) => a + t.amount, 0);
                const health = walletHealth(w.balance, w.autoDeductLimit);
                return (
                  <tr key={w.id}>
                    <td>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <div style={{
                          width: 28, height: 28, borderRadius: '50%',
                          background: avatarColor(cust?.name || 'A'),
                          display: 'flex', alignItems: 'center', justifyContent: 'center',
                          fontSize: 10, fontWeight: 700, color: 'white',
                        }}>
                          {getInitials(cust?.name || 'A')}
                        </div>
                        <div>
                          <span style={{ fontWeight: 600 }}>{cust?.name}</span>
                          <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>{w.id}</div>
                        </div>
                      </div>
                    </td>
                    <td className="amount-positive">{fmt(w.balance)}</td>
                    <td><span style={{ fontWeight: 600, color: health.color }}>{health.label}</span></td>
                    <td><span style={{ color: w.autoDeductEnabled ? 'var(--color-active)' : 'var(--text-muted)' }}>{w.autoDeductEnabled ? 'ON' : 'OFF'}</span></td>
                    <td style={{ color: 'var(--color-active)', fontWeight: 600 }}>{fmt(cr)}</td>
                    <td style={{ color: 'var(--color-blocked)', fontWeight: 600 }}>{fmt(db)}</td>
                    <td style={{ color: 'var(--text-muted)' }}>{txList.length}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      <style dangerouslySetInnerHTML={{ __html: `
        .reports-page { display: flex; flex-direction: column; gap: 1.75rem; }
        .reports-header { display: flex; justify-content: space-between; align-items: flex-start; flex-wrap: wrap; gap: 1rem; }
        .kpi-row { display: grid; grid-template-columns: repeat(4,1fr); gap: 1.25rem; }
        .kpi-card { padding: 1.25rem; display: flex; flex-direction: column; gap: 0.5rem; }
        .kpi-icon { width: 42px; height: 42px; border-radius: 10px; display: flex; align-items: center; justify-content: center; }
        .kpi-val { font-size: 1.4rem; font-weight: 800; font-family: Outfit, sans-serif; color: var(--text-primary); }
        .kpi-lbl { font-size: 0.8rem; color: var(--text-muted); }
        .charts-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 1.25rem; }
        .chart-card { padding: 1.5rem; }
        .chart-title { font-size: 0.95rem; font-weight: 600; margin-bottom: 1.25rem; color: var(--text-primary); }
        .report-table-card { padding: 1.5rem; }
        @media (max-width: 1100px) { .kpi-row { grid-template-columns: repeat(2,1fr); } .charts-grid { grid-template-columns: 1fr; } }
        @media (max-width: 600px) { .kpi-row { grid-template-columns: 1fr 1fr; } .kpi-val { font-size: 1.1rem; } }
      `}} />
    </div>
  );
}
