// =====================================================================
// Mock Data – Customer Prepaid Travel Wallet System
// Manivtha Tours & Travels
// =====================================================================

export const CUSTOMERS = [
  { id: 'C001', name: 'Arjun Sharma',    mobile: '9876543210', email: 'arjun.s@email.com',    status: 'active',   joined: '2024-01-15', city: 'Chennai',    photo: null },
  { id: 'C002', name: 'Priya Nair',      mobile: '9845012345', email: 'priya.n@email.com',    status: 'active',   joined: '2024-02-20', city: 'Bangalore',  photo: null },
  { id: 'C003', name: 'Ravi Kumar',      mobile: '9765432100', email: 'ravi.k@email.com',     status: 'inactive', joined: '2024-03-05', city: 'Hyderabad',  photo: null },
  { id: 'C004', name: 'Sneha Reddy',     mobile: '9988776655', email: 'sneha.r@email.com',    status: 'active',   joined: '2024-03-18', city: 'Mumbai',     photo: null },
  { id: 'C005', name: 'Vikram Patel',    mobile: '9912345678', email: 'vikram.p@email.com',   status: 'active',   joined: '2024-04-01', city: 'Ahmedabad',  photo: null },
  { id: 'C006', name: 'Meena Iyer',      mobile: '9823456789', email: 'meena.i@email.com',    status: 'blocked',  joined: '2024-04-22', city: 'Coimbatore', photo: null },
  { id: 'C007', name: 'Suresh Babu',     mobile: '9734567890', email: 'suresh.b@email.com',   status: 'active',   joined: '2024-05-10', city: 'Trichy',     photo: null },
  { id: 'C008', name: 'Anitha Lakshmi',  mobile: '9645678901', email: 'anitha.l@email.com',   status: 'active',   joined: '2024-05-28', city: 'Madurai',    photo: null },
  { id: 'C009', name: 'Deepak Menon',    mobile: '9556789012', email: 'deepak.m@email.com',   status: 'pending',  joined: '2024-06-14', city: 'Kochi',      photo: null },
  { id: 'C010', name: 'Kavitha Raj',     mobile: '9467890123', email: 'kavitha.r@email.com',  status: 'active',   joined: '2024-06-30', city: 'Salem',      photo: null },
  { id: 'C011', name: 'Balaji Natarajan',mobile: '9378901234', email: 'balaji.n@email.com',   status: 'active',   joined: '2024-07-15', city: 'Chennai',    photo: null },
  { id: 'C012', name: 'Radha Krishnan',  mobile: '9289012345', email: 'radha.k@email.com',    status: 'active',   joined: '2024-07-28', city: 'Vellore',    photo: null },
  { id: 'C013', name: 'Sundar Pichai',   mobile: '9190123456', email: 'sundar.p@email.com',   status: 'inactive', joined: '2024-08-10', city: 'Madurai',    photo: null },
  { id: 'C014', name: 'Lalitha Devi',    mobile: '9001234567', email: 'lalitha.d@email.com',  status: 'active',   joined: '2024-08-25', city: 'Pondicherry',photo: null },
  { id: 'C015', name: 'Gopal Krishnan',  mobile: '8912345678', email: 'gopal.k@email.com',    status: 'active',   joined: '2024-09-05', city: 'Tirunelveli',photo: null },
  { id: 'C016', name: 'Nithya Srinivasan',mobile:'8823456789', email: 'nithya.s@email.com',  status: 'active',   joined: '2024-09-18', city: 'Chennai',    photo: null },
  { id: 'C017', name: 'Karthik Raja',    mobile: '8734567890', email: 'karthik.r@email.com',  status: 'pending',  joined: '2024-10-02', city: 'Erode',      photo: null },
  { id: 'C018', name: 'Divya Bharathi',  mobile: '8645678901', email: 'divya.b@email.com',    status: 'active',   joined: '2024-10-20', city: 'Tirupur',    photo: null },
];

export const WALLETS = [
  { id: 'W001', customerId: 'C001', balance: 45000, autoDeductLimit: 5000,  autoDeductEnabled: true,  createdAt: '2024-01-15', notes: 'Family tour package', lastActivity: '2024-12-01' },
  { id: 'W002', customerId: 'C002', balance: 78500, autoDeductLimit: 10000, autoDeductEnabled: true,  createdAt: '2024-02-20', notes: 'Honeymoon package',    lastActivity: '2024-11-28' },
  { id: 'W003', customerId: 'C003', balance: 12000, autoDeductLimit: 8000,  autoDeductEnabled: false, createdAt: '2024-03-05', notes: 'Business travel',      lastActivity: '2024-10-15' },
  { id: 'W004', customerId: 'C004', balance: 95000, autoDeductLimit: 15000, autoDeductEnabled: true,  createdAt: '2024-03-18', notes: 'Corporate account',    lastActivity: '2024-12-05' },
  { id: 'W005', customerId: 'C005', balance: 33000, autoDeductLimit: 6000,  autoDeductEnabled: true,  createdAt: '2024-04-01', notes: 'Weekend trips',        lastActivity: '2024-11-22' },
  { id: 'W006', customerId: 'C006', balance: 4200,  autoDeductLimit: 5000,  autoDeductEnabled: false, createdAt: '2024-04-22', notes: 'Low balance – blocked',lastActivity: '2024-09-10' },
  { id: 'W007', customerId: 'C007', balance: 62000, autoDeductLimit: 8000,  autoDeductEnabled: true,  createdAt: '2024-05-10', notes: 'Annual trip plan',     lastActivity: '2024-12-03' },
  { id: 'W008', customerId: 'C008', balance: 28500, autoDeductLimit: 7000,  autoDeductEnabled: true,  createdAt: '2024-05-28', notes: 'Pilgrimage packages',  lastActivity: '2024-11-30' },
  { id: 'W009', customerId: 'C009', balance: 15000, autoDeductLimit: 5000,  autoDeductEnabled: false, createdAt: '2024-06-14', notes: 'Pending verification', lastActivity: '2024-11-01' },
  { id: 'W010', customerId: 'C010', balance: 52000, autoDeductLimit: 9000,  autoDeductEnabled: true,  createdAt: '2024-06-30', notes: 'Group tour leader',    lastActivity: '2024-12-04' },
  { id: 'W011', customerId: 'C011', balance: 88000, autoDeductLimit: 12000, autoDeductEnabled: true,  createdAt: '2024-07-15', notes: 'Premium member',       lastActivity: '2024-12-06' },
  { id: 'W012', customerId: 'C012', balance: 19500, autoDeductLimit: 4000,  autoDeductEnabled: true,  createdAt: '2024-07-28', notes: 'Monthly deductions',   lastActivity: '2024-11-25' },
  { id: 'W013', customerId: 'C013', balance: 7000,  autoDeductLimit: 6000,  autoDeductEnabled: false, createdAt: '2024-08-10', notes: 'Inactive account',     lastActivity: '2024-08-30' },
  { id: 'W014', customerId: 'C014', balance: 41000, autoDeductLimit: 7500,  autoDeductEnabled: true,  createdAt: '2024-08-25', notes: 'Heritage tours',       lastActivity: '2024-12-02' },
  { id: 'W015', customerId: 'C015', balance: 73000, autoDeductLimit: 11000, autoDeductEnabled: true,  createdAt: '2024-09-05', notes: 'VIP customer',         lastActivity: '2024-12-07' },
  { id: 'W016', customerId: 'C016', balance: 56000, autoDeductLimit: 8500,  autoDeductEnabled: true,  createdAt: '2024-09-18', notes: 'Adventure packages',   lastActivity: '2024-12-01' },
  { id: 'W017', customerId: 'C017', balance: 22000, autoDeductLimit: 5500,  autoDeductEnabled: false, createdAt: '2024-10-02', notes: 'Awaiting ID proof',    lastActivity: '2024-10-20' },
  { id: 'W018', customerId: 'C018', balance: 49000, autoDeductLimit: 9500,  autoDeductEnabled: true,  createdAt: '2024-10-20', notes: 'Festival specials',    lastActivity: '2024-11-28' },
];

// Generate transaction history per wallet
const _txSeed = [
  { desc: 'Initial Deposit',            type: 'credit', amount: 50000 },
  { desc: 'Ooty Hill Station Tour',     type: 'debit',  amount: 8500  },
  { desc: 'Top-Up by Customer',         type: 'credit', amount: 20000 },
  { desc: 'Kerala Backwaters Package',  type: 'debit',  amount: 15000 },
  { desc: 'Auto-Deduction – Monthly',   type: 'debit',  amount: 6000  },
  { desc: 'Goa Beach Trip',             type: 'debit',  amount: 12000 },
  { desc: 'Refund – Cancelled Tour',    type: 'credit', amount: 7500  },
  { desc: 'Manali Snow Tour Package',   type: 'debit',  amount: 18000 },
  { desc: 'Corporate Account Top-Up',   type: 'credit', amount: 30000 },
  { desc: 'Rajasthan Heritage Tour',    type: 'debit',  amount: 22000 },
  { desc: 'Auto-Deduction – Monthly',   type: 'debit',  amount: 6000  },
  { desc: 'Balaji Temple Pilgrimage',   type: 'debit',  amount: 9000  },
  { desc: 'Bonus – Referral Credit',    type: 'credit', amount: 2000  },
  { desc: 'Andaman Island Package',     type: 'debit',  amount: 25000 },
  { desc: 'Emergency Top-Up',           type: 'credit', amount: 10000 },
  { desc: 'Shimla-Manali Combo Tour',   type: 'debit',  amount: 20000 },
];

function dateOffset(days) {
  const d = new Date('2024-12-08');
  d.setDate(d.getDate() - days);
  return d.toISOString().split('T')[0];
}

export const TRANSACTIONS = {};
WALLETS.forEach(w => {
  const txCount = 5 + Math.floor(Math.random() * 8);
  const txList = [];
  let runBal = w.balance;
  for (let i = 0; i < txCount; i++) {
    const seed = _txSeed[(i + w.id.charCodeAt(1)) % _txSeed.length];
    const amt = seed.amount + Math.floor(Math.random() * 2000 - 1000);
    const tx = {
      id: `TX-${w.id}-${String(i+1).padStart(3,'0')}`,
      walletId: w.id,
      customerId: w.customerId,
      date: dateOffset(i * 4 + 1),
      description: seed.desc,
      type: seed.type,
      amount: Math.abs(amt),
      status: 'completed',
      balanceAfter: runBal,
    };
    if (seed.type === 'credit') runBal -= amt; else runBal += amt;
    txList.push(tx);
  }
  TRANSACTIONS[w.id] = txList;
});

// Aggregated monthly revenue data for charts
export const MONTHLY_REVENUE = [
  { month: 'Jan', revenue: 285000, customers: 4,  transactions: 18 },
  { month: 'Feb', revenue: 342000, customers: 6,  transactions: 24 },
  { month: 'Mar', revenue: 428000, customers: 8,  transactions: 31 },
  { month: 'Apr', revenue: 395000, customers: 7,  transactions: 27 },
  { month: 'May', revenue: 512000, customers: 11, transactions: 38 },
  { month: 'Jun', revenue: 478000, customers: 9,  transactions: 34 },
  { month: 'Jul', revenue: 625000, customers: 13, transactions: 45 },
  { month: 'Aug', revenue: 589000, customers: 12, transactions: 42 },
  { month: 'Sep', revenue: 710000, customers: 15, transactions: 52 },
  { month: 'Oct', revenue: 685000, customers: 14, transactions: 49 },
  { month: 'Nov', revenue: 832000, customers: 17, transactions: 58 },
  { month: 'Dec', revenue: 948000, customers: 18, transactions: 64 },
];

export const TOUR_CATEGORIES = [
  { label: 'Pilgrimage',   value: 32, color: '#6C63FF' },
  { label: 'Adventure',    value: 25, color: '#3ECFCF' },
  { label: 'Heritage',     value: 20, color: '#FFD166' },
  { label: 'Beach',        value: 15, color: '#FF6B6B' },
  { label: 'Hill Station', value: 8,  color: '#06d6a0' },
];
