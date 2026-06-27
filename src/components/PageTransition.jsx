import React from 'react';

export function PageTransition({ children, pageKey }) {
  return (
    <div key={pageKey} className="page-transition">
      {children}
    </div>
  );
}

export function StaggerItem({ index = 0, children, className = '' }) {
  return (
    <div
      className={`stagger-item ${className}`}
      style={{ animationDelay: `${index * 0.08}s` }}
    >
      {children}
    </div>
  );
}

export function AnimatedBackground() {
  return (
    <div className="animated-bg" aria-hidden="true">
      <div className="orb orb-1" />
      <div className="orb orb-2" />
      <div className="orb orb-3" />
    </div>
  );
}

export function LoadingScreen({ message = 'Loading wallet data…' }) {
  return (
    <div className="loading-screen">
      <div className="loading-spinner" />
      <p className="loading-text">{message}</p>
      <div className="loading-dots">
        <span /><span /><span />
      </div>
    </div>
  );
}

export function SkeletonCard() {
  return <div className="skeleton-card shimmer" />;
}
