import React, { useState, useRef, useEffect } from 'react';
import { Bell, LogOut, User } from 'lucide-react';
import { fmtDate } from '../utils/ledgerEngine';

const PAGE_TITLES = {
  dashboard: { title: 'Dashboard Overview',    subtitle: 'Welcome back! Here\'s what\'s happening today.' },
  wallets:   { title: 'Wallet Management',     subtitle: 'Manage all customer prepaid travel wallets.' },
  customers: { title: 'Customer Directory',    subtitle: 'View and manage your customer base.' },
  form:      { title: 'New Wallet Entry',      subtitle: 'Create or top-up a customer travel wallet.' },
  reports:   { title: 'Reports & Analytics',   subtitle: 'Insights, trends, and downloadable reports.' },
  settings:  { title: 'System Settings',       subtitle: 'Configure preferences and system options.' },
};

export default function Navbar({ activePage, alerts, useApi, onLogout }) {
  const [showNotif, setShowNotif] = useState(false);
  const notifRef = useRef(null);
  const { title, subtitle } = PAGE_TITLES[activePage] || PAGE_TITLES.dashboard;

  // Close dropdown on outside click
  useEffect(() => {
    function handle(e) {
      if (notifRef.current && !notifRef.current.contains(e.target)) {
        setShowNotif(false);
      }
    }
    document.addEventListener('mousedown', handle);
    return () => document.removeEventListener('mousedown', handle);
  }, []);

  return (
    <header className="navbar">
      <div className="navbar-left">
        <h1>{title}</h1>
        <p>{subtitle}</p>
      </div>

      <div className="navbar-right">
        <span className={`api-status ${useApi ? 'live' : 'demo'}`} title={useApi ? 'Connected to backend API' : 'Running in demo mode'}>
          <span className="api-status-dot" />
          {useApi ? 'Live API' : 'Demo Mode'}
        </span>
        <div ref={notifRef} style={{ position: 'relative' }}>
          <button
            id="notif-bell-btn"
            className="notif-btn"
            onClick={() => setShowNotif(v => !v)}
            title="Notifications"
          >
            <Bell size={18} />
            {alerts.length > 0 && <span className="notif-badge" />}
          </button>

          {showNotif && (
            <div className="notif-dropdown">
              <div className="notif-header">
                <h3>Notifications</h3>
                <span
                  className="notif-clear"
                  onClick={() => setShowNotif(false)}
                >
                  Close
                </span>
              </div>
              <div className="notif-list">
                {alerts.length === 0 ? (
                  <div style={{ padding: '24px', textAlign: 'center', color: 'var(--text-muted)', fontSize: '13px' }}>
                    No new alerts ðŸŽ‰
                  </div>
                ) : (
                  alerts.map((alert, i) => (
                    <div key={i} className="notif-item">
                      <span className={`notif-dot ${alert.type}`} />
                      <div>
                        <p>{alert.message}</p>
                        <span>{fmtDate(new Date().toISOString().split('T')[0])}</span>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          )}
        </div>

        <button className="notif-btn" onClick={onLogout} title="Logout">
          <LogOut size={18} />
        </button>

        {/* User Avatar */}
        <div className="avatar-btn" id="user-avatar-btn">
          <div className="avatar">
            <User size={15} color="white" />
          </div>
          <span className="avatar-name">Admin</span>
        </div>
      </div>
    </header>
  );
}

