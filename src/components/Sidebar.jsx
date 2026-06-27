import React, { useState } from 'react';
import {
  LayoutDashboard, Wallet, Users, FileText, BarChart3,
  Settings, ChevronLeft, ChevronRight, Plane,
} from 'lucide-react';

const NAV_ITEMS = [
  { id: 'dashboard', label: 'Dashboard',     icon: LayoutDashboard, section: 'MAIN' },
  { id: 'wallets',   label: 'Wallets',       icon: Wallet,          section: 'MAIN' },
  { id: 'customers', label: 'Customers',     icon: Users,           section: 'MAIN' },
  { id: 'form',      label: 'New Entry',     icon: FileText,        section: 'OPERATIONS' },
  { id: 'reports',   label: 'Reports',       icon: BarChart3,       section: 'ANALYTICS' },
  { id: 'settings',  label: 'Settings',      icon: Settings,        section: 'SYSTEM' },
];

export default function Sidebar({ active, onNavigate }) {
  const [collapsed, setCollapsed] = useState(false);

  const sections = [...new Set(NAV_ITEMS.map(i => i.section))];

  return (
    <aside className={`sidebar${collapsed ? ' collapsed' : ''} fade-in-left`}>
      {/* Logo */}
      <div className="sidebar-logo">
        <div className="logo-icon">
          <Plane size={22} color="white" />
        </div>
        <div className="logo-text">
          <h2>Manivtha Tours</h2>
          <p>&amp; Travels</p>
        </div>
      </div>

      {/* Navigation */}
      <nav className="sidebar-nav">
        {sections.map(section => {
          const items = NAV_ITEMS.filter(i => i.section === section);
          return (
            <React.Fragment key={section}>
              <div className="nav-section-label">{section}</div>
              {items.map(item => {
                const Icon = item.icon;
                const isActive = active === item.id;
                return (
                  <div
                    key={item.id}
                    id={`nav-${item.id}`}
                    className={`nav-item${isActive ? ' active' : ''}`}
                    onClick={() => onNavigate(item.id)}
                    title={collapsed ? item.label : ''}
                  >
                    <Icon size={19} className="nav-icon" />
                    <span className="nav-label">{item.label}</span>
                    {isActive && <span className="nav-active-bar" />}
                  </div>
                );
              })}
            </React.Fragment>
          );
        })}
      </nav>

      {/* Collapse Button */}
      <div className="sidebar-footer">
        <button
          className="collapse-btn"
          onClick={() => setCollapsed(c => !c)}
          id="sidebar-toggle-btn"
        >
          {collapsed
            ? <ChevronRight size={16} />
            : <ChevronLeft  size={16} />
          }
          <span className="collapse-btn-label">
            {collapsed ? '' : 'Collapse Sidebar'}
          </span>
        </button>
      </div>
    </aside>
  );
}
