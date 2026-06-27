import React, { useState } from 'react';
import { Eye, EyeOff, Lock, Mail } from 'lucide-react';
import { AnimatedBackground } from './PageTransition';

export const ADMIN_EMAIL = 'admin@manivtha.com';
export const ADMIN_PASSWORD = 'TOUR@12345';

export default function LoginPage({ onLogin }) {
  const [form, setForm] = useState({ email: '', password: '' });
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');

  function handleSubmit(e) {
    e.preventDefault();
    if (form.email.trim().toLowerCase() === ADMIN_EMAIL && form.password === ADMIN_PASSWORD) {
      setError('');
      onLogin();
      return;
    }
    setError('Invalid admin email or password.');
  }

  return (
    <div className="login-page">
      <AnimatedBackground />
      <form className="login-card" onSubmit={handleSubmit}>
        <div className="login-brand">
          <div className="login-logo">MT</div>
          <div>
            <h1>Manivtha Tours & Travels</h1>
            <p>Admin Travel Wallet Login</p>
          </div>
        </div>

        <div className="login-field">
          <label htmlFor="admin-email">Admin Email</label>
          <div className="login-input-wrap">
            <Mail size={16} />
            <input
              id="admin-email"
              type="email"
              value={form.email}
              onChange={e => setForm(f => ({ ...f, email: e.target.value }))}
              placeholder={ADMIN_EMAIL}
              autoComplete="username"
            />
          </div>
        </div>

        <div className="login-field">
          <label htmlFor="admin-password">Password</label>
          <div className="login-input-wrap">
            <Lock size={16} />
            <input
              id="admin-password"
              type={showPassword ? 'text' : 'password'}
              value={form.password}
              onChange={e => setForm(f => ({ ...f, password: e.target.value }))}
              placeholder="Enter password"
              autoComplete="current-password"
            />
            <button
              type="button"
              className="password-toggle"
              onClick={() => setShowPassword(v => !v)}
              aria-label={showPassword ? 'Hide password' : 'Show password'}
            >
              {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
            </button>
          </div>
        </div>

        {error && <div className="login-error">{error}</div>}

        <button type="submit" className="btn btn-primary login-submit">
          <Lock size={16} />
          Login
        </button>

        <div className="login-hint">
          Email: {ADMIN_EMAIL}<br />
          Password: {ADMIN_PASSWORD}
        </div>
      </form>
    </div>
  );
}
