import React, { useState, useMemo } from 'react';
import { Search, Eye, ChevronDown, ChevronUp } from 'lucide-react';
import { fmt, getInitials, avatarColor } from '../utils/ledgerEngine';

const PAGE_SIZE = 10;

export default function CustomerDirectory({ customers, wallets, onViewWallet }) {
  const [search, setSearch] = useState('');
  const [statusFilter, setStatus] = useState('all');
  const [sortKey, setSortKey] = useState('name');
  const [sortDir, setSortDir] = useState('asc');
  const [page, setPage] = useState(1);

  const enriched = useMemo(() => {
    return customers.map(c => {
      const wallet = wallets.find(w => w.customerId === c.id);
      return { ...c, wallet };
    });
  }, [customers, wallets]);

  const filtered = useMemo(() => {
    let data = enriched;
    if (search) {
      const q = search.toLowerCase();
      data = data.filter(c =>
        c.name.toLowerCase().includes(q) ||
        c.mobile.includes(q) ||
        c.email.toLowerCase().includes(q) ||
        c.city.toLowerCase().includes(q)
      );
    }
    if (statusFilter !== 'all') data = data.filter(c => c.status === statusFilter);
    return data;
  }, [enriched, search, statusFilter]);

  const sorted = useMemo(() => {
    const dir = sortDir === 'asc' ? 1 : -1;
    return [...filtered].sort((a, b) => {
      if (sortKey === 'name') return dir * a.name.localeCompare(b.name);
      if (sortKey === 'joined') return dir * (new Date(a.joined) - new Date(b.joined));
      if (sortKey === 'balance') return dir * ((a.wallet?.balance || 0) - (b.wallet?.balance || 0));
      return 0;
    });
  }, [filtered, sortKey, sortDir]);

  const totalPages = Math.max(1, Math.ceil(sorted.length / PAGE_SIZE));
  const currentPage = Math.min(page, totalPages);
  const pageData = sorted.slice((currentPage - 1) * PAGE_SIZE, currentPage * PAGE_SIZE);

  function toggleSort(key) {
    if (sortKey === key) setSortDir(d => d === 'asc' ? 'desc' : 'asc');
    else { setSortKey(key); setSortDir('asc'); }
  }

  function SortIcon({ col }) {
    if (sortKey !== col) return <ChevronDown size={12} className="sort-icon" />;
    return sortDir === 'asc'
      ? <ChevronUp size={12} className="sort-icon" />
      : <ChevronDown size={12} className="sort-icon" />;
  }

  return (
    <div className="fade-in">
      <div className="search-filter-bar">
        <div className="search-input-wrap">
          <Search size={15} className="search-icon" />
          <input
            type="text"
            placeholder="Search by name, mobile, email, or city…"
            value={search}
            onChange={e => { setSearch(e.target.value); setPage(1); }}
          />
        </div>
        <select
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
      </div>

      <div className="glass-card" style={{ overflow: 'hidden', padding: 0 }}>
        <div className="table-wrapper" style={{ border: 'none' }}>
          <table className="data-table">
            <thead>
              <tr>
                <th className={sortKey === 'name' ? 'sorted' : ''} onClick={() => toggleSort('name')}>
                  Customer <SortIcon col="name" />
                </th>
                <th>Contact</th>
                <th>City</th>
                <th>Status</th>
                <th className={sortKey === 'balance' ? 'sorted' : ''} onClick={() => toggleSort('balance')}>
                  Wallet Balance <SortIcon col="balance" />
                </th>
                <th className={sortKey === 'joined' ? 'sorted' : ''} onClick={() => toggleSort('joined')}>
                  Joined <SortIcon col="joined" />
                </th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {pageData.length === 0 ? (
                <tr>
                  <td colSpan={7}>
                    <div className="empty-state">
                      <Search size={40} />
                      <h3>No customers found</h3>
                      <p>Try adjusting your search or filters.</p>
                    </div>
                  </td>
                </tr>
              ) : (
                pageData.map(c => (
                  <tr key={c.id}>
                    <td>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                        <div
                          style={{
                            width: 34, height: 34, borderRadius: '50%',
                            background: avatarColor(c.name),
                            display: 'flex', alignItems: 'center', justifyContent: 'center',
                            fontSize: 12, fontWeight: 700, color: 'white', flexShrink: 0,
                          }}
                        >
                          {getInitials(c.name)}
                        </div>
                        <div>
                          <strong>{c.name}</strong>
                          <div style={{ fontSize: 11, color: 'var(--text-muted)' }}>{c.id}</div>
                        </div>
                      </div>
                    </td>
                    <td>
                      <div style={{ fontSize: 13 }}>{c.mobile}</div>
                      <div style={{ fontSize: 11, color: 'var(--text-muted)' }}>{c.email}</div>
                    </td>
                    <td style={{ color: 'var(--text-muted)' }}>{c.city}</td>
                    <td><span className={`badge badge-${c.status}`}>{c.status}</span></td>
                    <td>
                      {c.wallet
                        ? <span className="amount-positive">{fmt(c.wallet.balance)}</span>
                        : <span style={{ color: 'var(--text-muted)', fontSize: 12 }}>No wallet</span>}
                    </td>
                    <td style={{ color: 'var(--text-muted)', fontSize: 12 }}>{c.joined}</td>
                    <td>
                      {c.wallet && (
                        <button
                          className="btn btn-secondary btn-sm btn-icon"
                          onClick={() => onViewWallet(c.wallet.id)}
                          title="View Wallet"
                        >
                          <Eye size={14} />
                        </button>
                      )}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        <div className="pagination">
          <div className="pagination-info">
            Showing {((currentPage - 1) * PAGE_SIZE) + 1}–{Math.min(currentPage * PAGE_SIZE, sorted.length)} of {sorted.length} customers
          </div>
          <div className="pagination-btns">
            <button
              className="page-btn"
              onClick={() => setPage(p => Math.max(1, p - 1))}
              disabled={currentPage === 1}
            >
              <ChevronDown size={13} style={{ transform: 'rotate(90deg)' }} />
            </button>
            {Array.from({ length: totalPages }, (_, i) => i + 1).map(p => (
              <button
                key={p}
                className={`page-btn${p === currentPage ? ' active' : ''}`}
                onClick={() => setPage(p)}
              >
                {p}
              </button>
            ))}
            <button
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
