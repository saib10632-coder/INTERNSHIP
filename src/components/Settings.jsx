import React, { useState } from 'react';
import { Building2, Bell, Shield, Zap } from 'lucide-react';

export default function Settings({ darkMode, onThemeChange }) {
  const [prefs, setPrefs] = useState({
    lowBalanceAlerts: true,
    autoDeductNotify: true,
    emailReports: false,
    darkMode,
  });

  function toggle(key) {
    if (key === 'darkMode') {
      onThemeChange(!darkMode);
      return;
    }
    setPrefs(p => ({ ...p, [key]: !p[key] }));
  }

  const TOGGLES = [
    { key: 'lowBalanceAlerts', label: 'Low Balance Alerts', desc: 'Show notifications when wallet balance falls below auto-deduct limit.', icon: Bell },
    { key: 'autoDeductNotify', label: 'Auto-Deduction Notifications', desc: 'Notify admin when scheduled auto-deductions are processed.', icon: Zap },
    { key: 'emailReports', label: 'Weekly Email Reports', desc: 'Send a summary report to admin@manivtha.com every Monday.', icon: Building2 },
    { key: 'darkMode', label: 'Dark Theme', desc: 'Switch between dark and light dashboard themes.', icon: Shield },
  ];

  return (
    <div className="fade-in" style={{ maxWidth: 720 }}>
      <div className="glass-card" style={{ padding: '28px', marginBottom: '20px' }}>
        <h2 style={{ fontFamily: 'Outfit', fontSize: 20, fontWeight: 800, marginBottom: 4 }}>Company Profile</h2>
        <p style={{ fontSize: 14, color: 'var(--text-muted)', marginBottom: 20 }}>
          Manivtha Tours &amp; Travels â€” Customer Prepaid Travel Wallet System
        </p>
        {[
          ['Business Name', 'Manivtha Tours & Travels'],
          ['Location', 'Chennai, Tamil Nadu'],
          ['Admin Contact', 'admin@manivtha.com'],
          ['Support Phone', '+91 98765 43210'],
          ['Currency', 'INR (â‚¹)'],
          ['System Version', '1.0.0'],
        ].map(([label, val]) => (
          <div key={label} style={{ display: 'flex', justifyContent: 'space-between', padding: '10px 0', borderBottom: '1px solid var(--glass-border)' }}>
            <span style={{ fontSize: 13, color: 'var(--text-muted)' }}>{label}</span>
            <span style={{ fontSize: 13, fontWeight: 600 }}>{val}</span>
          </div>
        ))}
      </div>

      <div className="glass-card" style={{ padding: '28px' }}>
        <h2 style={{ fontFamily: 'Outfit', fontSize: 20, fontWeight: 800, marginBottom: 20 }}>Notification Preferences</h2>
        {TOGGLES.map(({ key, label, desc, icon: Icon }) => (
          <div key={key} className="toggle-wrapper" style={{ marginBottom: 20 }}>
            <label className="toggle" htmlFor={`pref-${key}`}>
              <input
                id={`pref-${key}`}
                type="checkbox"
                checked={key === 'darkMode' ? darkMode : prefs[key]}
                onChange={() => toggle(key)}
              />
              <span className="toggle-slider" />
            </label>
            <span className="toggle-label">
              <strong><Icon size={12} style={{ marginRight: 4, verticalAlign: 'middle' }} />{label}</strong>
              <br />
              <span style={{ fontSize: 12, color: 'var(--text-muted)' }}>{desc}</span>
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}


