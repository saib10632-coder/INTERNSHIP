import React, { useState, useCallback, useMemo, useEffect } from 'react';
import Sidebar from './components/Sidebar';
import Navbar from './components/Navbar';
import DashboardOverview from './components/DashboardOverview';
import WalletTable from './components/WalletTable';
import DetailView from './components/DetailView';
import WalletForm from './components/WalletForm';
import CustomerDirectory from './components/CustomerDirectory';
import Reports from './components/Reports';
import Settings from './components/Settings';
import LoginPage from './components/LoginPage';
import { PageTransition, AnimatedBackground, LoadingScreen } from './components/PageTransition';
import { CUSTOMERS, WALLETS, TRANSACTIONS } from './data/mockData';
import { getWalletAlerts } from './utils/ledgerEngine';
import api, { checkHealth } from './services/api';
import { CheckCircle, XCircle, AlertTriangle, Info, X } from 'lucide-react';
import './index.css';
import './App.css';

let toastId = 0;

export default function App() {
  const [authenticated, setAuthenticated] = useState(() => localStorage.getItem('manivtha-auth') === 'true');
  const [darkMode, setDarkMode] = useState(() => localStorage.getItem('manivtha-theme') !== 'light');
  const [wallets, setWallets] = useState([]);
  const [customers, setCustomers] = useState([]);
  const [transactions, setTransactions] = useState({});
  const [activePage, setActivePage] = useState('dashboard');
  const [detailWalletId, setDetailWalletId] = useState(null);
  const [toasts, setToasts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [useApi, setUseApi] = useState(false);

  const alerts = useMemo(() => getWalletAlerts(wallets, customers), [wallets, customers]);
  const activeWallet = detailWalletId ? wallets.find(w => w.id === detailWalletId) : null;

  useEffect(() => {
    document.body.classList.toggle('theme-light', !darkMode);
    localStorage.setItem('manivtha-theme', darkMode ? 'dark' : 'light');
  }, [darkMode]);

  function handleLogin() {
    localStorage.setItem('manivtha-auth', 'true');
    setAuthenticated(true);
  }

  function handleLogout() {
    localStorage.removeItem('manivtha-auth');
    setAuthenticated(false);
  }

  const addToast = useCallback((title, desc, type = 'success') => {
    const id = ++toastId;
    setToasts(prev => [...prev, { id, title, desc, type }]);
    setTimeout(() => setToasts(prev => prev.filter(t => t.id !== id)), 4500);
  }, []);

  const loadData = useCallback(async () => {
    setLoading(true);
    try {
      const health = await checkHealth();
      if (health?.status === 'ok') {
        const [custData, walletData, txData] = await Promise.all([
          api.getCustomers(),
          api.getWallets({ limit: 100 }),
          api.getTransactions(),
        ]);
        setCustomers(custData);
        setWallets(walletData);
        setTransactions(txData);
        setUseApi(true);
      } else {
        throw new Error('API unavailable');
      }
    } catch {
      setCustomers(CUSTOMERS);
      setWallets(WALLETS);
      setTransactions(TRANSACTIONS);
      setUseApi(false);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { loadData(); }, [loadData]);

  const removeToast = (id) => setToasts(prev => prev.filter(t => t.id !== id));

  const handleNavigate = (page) => {
    setActivePage(page);
    setDetailWalletId(null);
  };

  const createLocalCustomer = (customer) => {
    const nextNumber = customers.reduce((max, c) => {
      const num = Number(String(c.id).replace(/\D/g, ''));
      return Number.isFinite(num) ? Math.max(max, num) : max;
    }, 0) + 1;
    const today = new Date().toISOString().split('T')[0];
    return {
      id: `C${String(nextNumber).padStart(3, '0')}`,
      name: customer.name.trim(),
      mobile: customer.mobile.trim(),
      email: customer.email.trim(),
      city: customer.city.trim(),
      status: customer.status || 'active',
      joined: today,
      photo: null,
    };
  };

  const handleAddWallet = async (wallet, customerDraft = null) => {
    if (useApi) {
      try {
        const customer = customerDraft
          ? await api.createCustomer(customerDraft)
          : customers.find(c => c.id === wallet.customerId);
        const created = await api.createWallet({
          customerId: customer.id,
          balance: wallet.balance,
          autoDeductLimit: wallet.autoDeductLimit,
          autoDeductEnabled: wallet.autoDeductEnabled,
          notes: wallet.notes,
        });
        if (customerDraft) setCustomers(prev => [customer, ...prev]);
        setWallets(prev => [created, ...prev]);
        const tx = await api.getTransactions();
        setTransactions(tx);
        addToast('Wallet Created', `Prepaid wallet ${created.id} saved to database.`, 'success');
        return { wallet: created, customer };
      } catch (err) {
        addToast('Error', err.message, 'error');
        throw err;
      }
    }

    const customer = customerDraft ? createLocalCustomer(customerDraft) : customers.find(c => c.id === wallet.customerId);
    const newWallet = { ...wallet, customerId: customer.id };
    if (customerDraft) setCustomers(prev => [customer, ...prev]);
    setWallets(prev => [newWallet, ...prev]);
    setTransactions(prev => ({
      ...prev,
      [newWallet.id]: [{
        id: `TX-${newWallet.id}-001`,
        walletId: newWallet.id,
        customerId: customer.id,
        date: newWallet.createdAt,
        description: 'Initial Deposit',
        type: 'credit',
        amount: newWallet.balance,
        status: 'completed',
        balanceAfter: newWallet.balance,
      }],
    }));
    addToast('Wallet Created', `Prepaid wallet ${newWallet.id} has been created successfully.`, 'success');
    return { wallet: newWallet, customer };
  };

  const handleTransact = async (walletId, transaction, newBalance, warnings = []) => {
    if (useApi) {
      try {
        const result = await api.transact(walletId, {
          type: transaction.type,
          amount: transaction.amount,
          description: transaction.description,
        });
        setWallets(prev => prev.map(w =>
          w.id === walletId ? { ...w, balance: result.newBalance, lastActivity: result.transaction.date } : w
        ));
        const tx = await api.getTransactions();
        setTransactions(tx);
        const label = transaction.type === 'credit' ? 'Deposit recorded' : 'Deduction recorded';
        addToast(label, `${transaction.description} â€” ${transaction.type === 'credit' ? '+' : '-'}â‚¹${transaction.amount.toLocaleString('en-IN')}`, 'success');
        (result.warnings || []).forEach(msg => addToast('Balance Warning', msg, 'warning'));
        return;
      } catch (err) {
        addToast('Transaction Failed', err.message, 'error');
        return;
      }
    }

    setTransactions(prev => ({
      ...prev,
      [walletId]: [transaction, ...(prev[walletId] || [])],
    }));
    setWallets(prev => prev.map(w =>
      w.id === walletId ? { ...w, balance: newBalance, lastActivity: transaction.date } : w
    ));
    const label = transaction.type === 'credit' ? 'Deposit recorded' : 'Deduction recorded';
    addToast(label, `${transaction.description} â€” ${transaction.type === 'credit' ? '+' : '-'}â‚¹${transaction.amount.toLocaleString('en-IN')}`, 'success');
    warnings.forEach(msg => addToast('Balance Warning', msg, 'warning'));
  };

  const handleViewDetail = (row) => {
    setDetailWalletId(row.id);
    setActivePage('wallets');
  };

  const toastIcons = { success: CheckCircle, error: XCircle, warning: AlertTriangle, info: Info };
  const toastColors = { success: 'var(--success)', error: 'var(--danger)', warning: 'var(--warning)', info: 'var(--info)' };

  if (!authenticated) {
    return <LoginPage onLogin={handleLogin} />;
  }

  if (loading) {
    return (
      <>
        <AnimatedBackground />
        <LoadingScreen />
      </>
    );
  }

  return (
    <div className="app-layout">
      <AnimatedBackground />
      <Sidebar active={activePage} onNavigate={handleNavigate} />

      <div className="main-content">
        <Navbar activePage={activePage} alerts={alerts} useApi={useApi} onLogout={handleLogout} />

        <main className="page-content">
          <PageTransition pageKey={activePage + (detailWalletId || '')}>
            {activePage === 'dashboard' && (
              <DashboardOverview
                wallets={wallets}
                customers={customers}
                transactions={transactions}
                onNavigate={handleNavigate}
              />
            )}

            {activePage === 'wallets' && !activeWallet && (
              <WalletTable
                wallets={wallets}
                customers={customers}
                transactions={transactions}
                onViewDetail={handleViewDetail}
                onNavigateForm={() => handleNavigate('form')}
              />
            )}

            {activePage === 'wallets' && activeWallet && (
              <DetailView
                wallet={activeWallet}
                customers={customers}
                transactions={transactions}
                onBack={() => setDetailWalletId(null)}
                onTransact={handleTransact}
              />
            )}

            {activePage === 'form' && (
              <WalletForm
                customers={customers}
                wallets={wallets}
                onSubmit={handleAddWallet}
              />
            )}

            {activePage === 'customers' && (
              <CustomerDirectory
                customers={customers}
                wallets={wallets}
                onViewWallet={(id) => {
                  setDetailWalletId(id);
                  setActivePage('wallets');
                }}
              />
            )}

            {activePage === 'reports' && (
              <Reports
                wallets={wallets}
                customers={customers}
                transactions={transactions}
              />
            )}

            {activePage === 'settings' && <Settings darkMode={darkMode} onThemeChange={setDarkMode} />}
          </PageTransition>
        </main>
      </div>

      <div className="toast-container">
        {toasts.map(t => {
          const Icon = toastIcons[t.type] || CheckCircle;
          return (
            <div key={t.id} className={`toast toast-${t.type}`}>
              <Icon size={20} style={{ color: toastColors[t.type], flexShrink: 0, marginTop: '2px' }} />
              <div className="toast-content">
                <div className="toast-title">{t.title}</div>
                {t.desc && <div className="toast-desc">{t.desc}</div>}
              </div>
              <button className="toast-close" onClick={() => removeToast(t.id)}><X size={16} /></button>
            </div>
          );
        })}
      </div>
    </div>
  );
}


