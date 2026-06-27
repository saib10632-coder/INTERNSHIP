import React, { useState, useMemo } from 'react';
import {
  Search, ChevronUp, ChevronDown, Eye,
  Download, Plus, RefreshCw,
} from 'lucide-react';
import { fmt, fmtDate, walletHealth, getInitials, avatarColor } from '../utils/ledgerEngine';

const PAGE_SIZE = 8;

export default function WalletTable({ wallets, customers, transactions, onViewDetail, onNavigateForm }) {
  const [search, setSearch]         = useState('');
  const [statusFilter, setStatus]   = useState('all');
  const [adFilter, setAdFilter]     = useState('all');
  const [sortKey, setSortKey]       = useState('balance');
  const [sortDir, setSortDir]       = useState('desc');
  const [page, setPage]             = useState(1);

  // Merge wallet + customer data
  const enriched = useMemo(() => {
    return wallets.map(w => {
      const cust = customers.find(c => c.id === w.customerId) || {};
      const txList = transactions[w.id] || [];
      return { ...w, customer: cust, txCount: txList.length };
    });
  }, [wallets, customers, transactions]);

  // Filters
  const filtered = useMemo(() => {
    let data = enriched;
    if (search) {
      const q = search.toLowerCase();
      data = data.filter(r =>
        r.customer?.name?.toLowerCase().includes(q) ||
        r.customer?.mobile?.includes(q) ||
        r.id.toLowerCase().includes(q)
      );
    }
    if (statusFilter !== 'all') data = data.filter(r => r.customer?.status === statusFilter);
    if (adFilter === 'enabled')  data = data.filter(r => r.autoDeductEnabled);
    if (adFilter === 'disabled') data = data.filter(r => !r.autoDeductEnabled);
    return data;
  }, [enriched, search, statusFilter, adFilter]);

  // Sort
  const sorted = useMemo(() => {
    const dir = sortDir === 'asc' ? 1 : -1;
    return [...filtered].sort((a, b) => {
      if (sortKey === 'name')    return dir * (a.customer?.name || '').localeCompare(b.customer?.name || '');
      if (sortKey === 'balance') return dir * (a.balance - b.balance);
      if (sortKey === 'limit')   return dir * (a.autoDeductLimit - b.autoDeductLimit);
      if (sortKey === 'txCount') return dir * (a.txCount - b.txCount);
      return 0;
    });
  }, [filtered, sortKey, sortDir]);

  // Pagination
  const totalPages = Math.max(1, Math.ceil(sorted.length / PAGE_SIZE));
  const currentPage = Math.min(page, totalPages);
  const pageData = sorted.slice((currentPage - 1) * PAGE_SIZE, currentPage * PAGE_SIZE);

  function toggleSort(key) {
    if (sortKey === key) setSortDir(d => d === 'asc' ? 'desc' : 'asc');
    else { setSortKey(key); setSortDir('desc'); }
  }

  function SortIcon({ col }) {
    if (sortKey !== col) return <ChevronDown size={12} className="sort-icon" />;
    return sortDir === 'asc'
      ? <ChevronUp size={12} className="sort-icon" />
      : <ChevronDown size={12} className="sort-icon" />;
  }

  // CSV Export
  function exportCSV() {
    const rows = [
      ['Wallet ID','Customer','Mobile','Status','Balance','Auto-Deduct Limit','Auto-Deduction','Transactions','Created'],
      ...sorted.map(r => [
        r.id,
        r.customer?.name,
        r.customer?.mobile,
        r.customer?.status,
        r.balance,
        r.autoDeductLimit,
        r.autoDeductEnabled ? 'Yes' : 'No',
        r.txCount,
        r.createdAt,
      ])
    ];
    const csv = rows.map(r => r.join(',')).join('\n');
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url; a.download = 'wallets_export.csv'; a.click();
    URL.revokeObjectURL(url);
  }

  return (
    <div className="fade-in">
      {/* Top Bar */}
      <div className="search-filter-bar">
        <div className="search-input-wrap">
          <Search size={15} className="search-icon" />
          <input
            id="wallet-search-input"
            type="text"
            placeholder="Search by name, mobile, or wallet ID…"
            value={search}
            onChange={e => { setSearch(e.target.value); setPage(1); }}
          />
        </div>
        <select
          id="wallet-status-filter"
          className="filter-select"
          value={statusFilter}
          onChange={e => { setStatus(e.target.value); setPage(1); }}
        >
          <option value="all">All Status</option>
          <option value="active">Active</option>
          <option value="inactive">Inactive</option>
          <option value="pending">Pending</option>
          <option value="blocked">Blocked</option>
        </select>
        <select
          id="wallet-ad-filter"
          className="filter-select"
          value={adFilter}
          onChange={e => { setAdFilter(e.target.value); setPage(1); }}
        >
          <option value="all">All Auto-Deduct</option>
          <option value="enabled">Enabled</option>
          <option value="disabled">Disabled</option>
        </select>
        <button
          id="export-wallets-btn"
          className="btn btn-secondary btn-sm"
          onClick={exportCSV}
          title="Export CSV"
        >
          <Download size={14} /> Export
        </button>
        <button
          id="new-wallet-btn"
          className="btn btn-primary btn-sm"
          onClick={onNavigateForm}
        >
          <Plus size={14} /> New Wallet
        </button>
      </div>

      {/* Table */}
      <div className="glass-card" style={{ overflow: 'hidden', padding: 0 }}>
        <div className="table-wrapper" style={{ border: 'none' }}>
          <table className="data-table">
            <thead>
              <tr>
                <th id="col-customer"
                  className={sortKey === 'name' ? 'sorted' : ''}
                  onClick={() => toggleSort('name')}
                >
                  Customer <SortIcon col="name" />
                </th>
                <th>Wallet ID</th>
                <th>Status</th>
                <th
                  id="col-balance"
                  className={sortKey === 'balance' ? 'sorted' : ''}
                  onClick={() => toggleSort('balance')}
                >
                  Balance <SortIcon col="balance" />
                </th>
                <th
                  id="col-limit"
                  className={sortKey === 'limit' ? 'sorted' : ''}
                  onClick={() => toggleSort('limit')}
                >
                  Auto-Deduct Limit <SortIcon col="limit" />
                </th>
                <th>Auto-Deduction</th>
                <th>Health</th>
                <th
                  id="col-tx"
                  className={sortKey === 'txCount' ? 'sorted' : ''}
                  onClick={() => toggleSort('txCount')}
                >
                  Transactions <SortIcon col="txCount" />
                </th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {pageData.length === 0 ? (
                <tr>
                  <td colSpan={9}>
                    <div className="empty-state">
                      <RefreshCw size={40} />
                      <h3>No wallets found</h3>
                      <p>Try adjusting your search or filters.</p>
                    </div>
                  </td>
                </tr>
              ) : (
                pageData.map(row => {
                  const health = walletHealth(row.balance, row.autoDeductLimit);
                  const cust = row.customer;
                  return (
                    <tr key={row.id}>
                      <td>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                          <div
                            style={{
                              width: 34, height: 34, borderRadius: '50%',
                              background: avatarColor(cust?.name || 'A'),
                              display: 'flex', alignItems: 'center', justifyContent: 'center',
                              fontSize: 12, fontWeight: 700, color: 'white', flexShrink: 0,
                            }}
                          >
                            {getInitials(cust?.name || 'A')}
                          </div>
                          <div>
                            <strong>{cust?.name}</strong>
                            <div style={{ fontSize: 11, color: 'var(--text-muted)' }}>{cust?.mobile}</div>
                          </div>
                        </div>
                      </td>
                      <td style={{ fontFamily: 'monospace', fontSize: 12, color: 'var(--text-muted)' }}>{row.id}</td>
                      <td><span className={`badge badge-${cust?.status}`}>{cust?.status}</span></td>
                      <td className="amount-positive">{fmt(row.balance)}</td>
                      <td style={{ color: 'var(--text-muted)' }}>{fmt(row.autoDeductLimit)}</td>
                      <td>
                        <span
                          style={{
                            fontSize: 11, fontWeight: 700,
                            color: row.autoDeductEnabled ? 'var(--color-active)' : 'var(--color-inactive)',
                          }}
                        >
                          {row.autoDeductEnabled ? '● Enabled' : '○ Disabled'}
                        </span>
                      </td>
                      <td>
                        <span style={{ fontSize: 12, fontWeight: 600, color: health.color }}>
                          ● {health.label}
                        </span>
                      </td>
                      <td style={{ color: 'var(--text-muted)' }}>{row.txCount}</td>
                      <td>
                        <button
                          id={`view-wallet-${row.id}`}
                          className="btn btn-secondary btn-sm btn-icon"
                          onClick={() => onViewDetail(row)}
                          title="View Details"
                        >
                          <Eye size={14} />
                        </button>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        <div className="pagination">
          <div className="pagination-info">
            Showing {((currentPage - 1) * PAGE_SIZE) + 1}–{Math.min(currentPage * PAGE_SIZE, sorted.length)} of {sorted.length} wallets
          </div>
          <div className="pagination-btns">
            <button
              id="page-prev-btn"
              className="page-btn"
              onClick={() => setPage(p => Math.max(1, p - 1))}
              disabled={currentPage === 1}
            >
              <ChevronDown size={13} style={{ transform: 'rotate(90deg)' }} />
            </button>
            {Array.from({ length: totalPages }, (_, i) => i + 1).map(p => (
              <button
                key={p}
                id={`page-btn-${p}`}
                className={`page-btn${p === currentPage ? ' active' : ''}`}
                onClick={() => setPage(p)}
              >
                {p}
              </button>
            ))}
            <button
              id="page-next-btn"
              className="page-btn"
              onClick={() => setPage(p => Math.min(totalPages, p + 1))}
              disabled={currentPage === totalPages}
            >
              <ChevronDown size={13} style={{ transform: 'rotate(-90deg)' }} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
