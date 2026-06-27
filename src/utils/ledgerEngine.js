// =====================================================================
// Ledger Engine – Business Logic for Travel Wallet Transactions
// =====================================================================

export function fmt(amount) {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 0,
  }).format(amount);
}

export function fmtDate(dateStr) {
  return new Date(dateStr).toLocaleDateString('en-IN', {
    day: '2-digit', month: 'short', year: 'numeric',
  });
}

export function fmtDateShort(dateStr) {
  return new Date(dateStr).toLocaleDateString('en-IN', {
    day: '2-digit', month: 'short',
  });
}

// Calculate current balance from transaction list
export function computeBalance(initialBalance, transactions) {
  return transactions.reduce((bal, tx) => {
    return tx.type === 'credit' ? bal + tx.amount : bal - tx.amount;
  }, initialBalance);
}

// Determine wallet health status
export function walletHealth(balance, autoDeductLimit) {
  if (balance <= 0) return { level: 'critical', label: 'Insufficient Funds', color: '#ef476f' };
  if (balance < autoDeductLimit) return { level: 'low', label: 'Low Balance', color: '#ffd166' };
  if (balance < autoDeductLimit * 2) return { level: 'moderate', label: 'Moderate', color: '#f4a261' };
  return { level: 'healthy', label: 'Healthy', color: '#06d6a0' };
}

// Process a new transaction and return updated wallet + transaction
export function processTransaction({ wallet, type, amount, description, transactions }) {
  const balance = wallet.balance;
  const newBalance = type === 'credit' ? balance + amount : balance - amount;

  // Business rules
  const warnings = [];
  if (type === 'debit' && amount > balance) {
    return { success: false, error: 'Insufficient wallet balance for this deduction.' };
  }
  if (type === 'debit' && newBalance < wallet.autoDeductLimit && wallet.autoDeductEnabled) {
    warnings.push(`Balance ₹${newBalance.toLocaleString('en-IN')} will fall below auto-deduction limit (₹${wallet.autoDeductLimit.toLocaleString('en-IN')}).`);
  }

  const newTx = {
    id: `TX-${wallet.id}-${String(transactions.length + 1).padStart(3, '0')}`,
    walletId: wallet.id,
    customerId: wallet.customerId,
    date: new Date().toISOString().split('T')[0],
    description: description || (type === 'credit' ? 'Manual Top-Up' : 'Manual Deduction'),
    type,
    amount,
    status: 'completed',
    balanceAfter: newBalance,
  };

  return {
    success: true,
    newBalance,
    transaction: newTx,
    warnings,
  };
}

// Run auto-deductions for all eligible wallets
export function runAutoDeductions(wallets, transactions) {
  const results = [];
  wallets.forEach(wallet => {
    if (!wallet.autoDeductEnabled) return;
    if (wallet.balance >= wallet.autoDeductLimit) {
      const res = processTransaction({
        wallet,
        type: 'debit',
        amount: wallet.autoDeductLimit,
        description: 'Auto-Deduction – Scheduled',
        transactions: transactions[wallet.id] || [],
      });
      if (res.success) {
        results.push({ walletId: wallet.id, ...res });
      }
    }
  });
  return results;
}

// Summary statistics across all wallets
export function computeSummary(wallets, customers, allTransactions) {
  const activeCustomers = customers.filter(c => c.status === 'active').length;
  const totalBalance    = wallets.reduce((s, w) => s + w.balance, 0);
  const totalTx         = Object.values(allTransactions).flat().length;
  const lowBalance      = wallets.filter(w => walletHealth(w.balance, w.autoDeductLimit).level !== 'healthy').length;

  const thisMonth = new Date().getMonth();
  const monthlyRevenue = Object.values(allTransactions).flat()
    .filter(tx => tx.type === 'debit' && new Date(tx.date).getMonth() === thisMonth)
    .reduce((s, tx) => s + tx.amount, 0);

  return { activeCustomers, totalBalance, totalTx, lowBalance, monthlyRevenue };
}

// Get recent transactions across all wallets (sorted by date)
export function getRecentTransactions(allTransactions, limit = 10) {
  return Object.values(allTransactions)
    .flat()
    .sort((a, b) => new Date(b.date) - new Date(a.date))
    .slice(0, limit);
}

// Get alerts for wallets with low/critical balance
export function getWalletAlerts(wallets, customers) {
  const alerts = [];
  wallets.forEach(w => {
    const health = walletHealth(w.balance, w.autoDeductLimit);
    if (health.level === 'critical' || health.level === 'low') {
      const cust = customers.find(c => c.id === w.customerId);
      alerts.push({
        walletId: w.id,
        customerId: w.customerId,
        customerName: cust?.name || 'Unknown',
        balance: w.balance,
        autoDeductLimit: w.autoDeductLimit,
        health,
        type: health.level === 'critical' ? 'danger' : 'warning',
        message: health.level === 'critical'
          ? `${cust?.name}'s wallet has ZERO balance. Auto-deductions paused.`
          : `${cust?.name}'s wallet balance (${fmt(w.balance)}) is below auto-deduction limit.`,
      });
    }
  });
  return alerts;
}

// Avatar initials helper
export function getInitials(name) {
  return name.split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase();
}

// Avatar background color (deterministic)
const AVATAR_COLORS = [
  'linear-gradient(135deg,#6C63FF,#3ECFCF)',
  'linear-gradient(135deg,#FF6B6B,#FFD166)',
  'linear-gradient(135deg,#06d6a0,#1b9aaa)',
  'linear-gradient(135deg,#f77f00,#d62828)',
  'linear-gradient(135deg,#7209b7,#3a0ca3)',
  'linear-gradient(135deg,#4cc9f0,#4361ee)',
];
export function avatarColor(name) {
  const idx = name.charCodeAt(0) % AVATAR_COLORS.length;
  return AVATAR_COLORS[idx];
}

// Validate wallet form fields
export function validateWalletForm(data) {
  const errors = {};
  if (!data.customerId) errors.customerId = 'Please select a customer.';
  if (!data.balance || isNaN(data.balance) || Number(data.balance) <= 0)
    errors.balance = 'Enter a valid initial balance.';
  if (!data.autoDeductLimit || isNaN(data.autoDeductLimit) || Number(data.autoDeductLimit) <= 0)
    errors.autoDeductLimit = 'Enter a valid auto-deduction limit.';
  if (Number(data.balance) < Number(data.autoDeductLimit))
    errors.autoDeductLimit = 'Auto-deduct limit cannot exceed initial balance.';
  return errors;
}
