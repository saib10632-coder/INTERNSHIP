# Database Schema

## Entity Relationship

```
customers (1) ──── (N) customer_prepaid_travel_wallet (1) ──── (N) orders
```

## Tables

### customers

| Column | Type | Notes |
|--------|------|-------|
| id | TEXT PK | e.g. C001 |
| name | TEXT | Customer full name |
| mobile | TEXT | Contact number |
| email | TEXT | Email address |
| status | TEXT | active, inactive, blocked, pending |
| city | TEXT | City |
| joined | TEXT | Join date |
| created_at | TEXT | Audit timestamp |
| updated_at | TEXT | Audit timestamp |

### customer_prepaid_travel_wallet

| Column | Type | Notes |
|--------|------|-------|
| id | TEXT PK | e.g. W001 |
| customer_id | TEXT FK | References customers |
| balance | REAL | Current wallet balance (INR) |
| auto_deduct_limit | REAL | Auto-deduction threshold |
| auto_deduct_enabled | INTEGER | 1 = enabled, 0 = disabled |
| status | TEXT | active, inactive, archived, completed |
| notes | TEXT | Staff notes |
| created_date | TEXT | Wallet creation date |
| last_activity | TEXT | Last transaction date |
| created_at | TEXT | Audit timestamp |
| updated_at | TEXT | Audit timestamp |

### orders (transactions)

| Column | Type | Notes |
|--------|------|-------|
| id | TEXT PK | e.g. TX-W001-001 |
| wallet_id | TEXT FK | References wallet |
| customer_id | TEXT FK | References customer |
| type | TEXT | credit or debit |
| amount | REAL | Transaction amount |
| description | TEXT | e.g. "Ooty Hill Station Tour" |
| status | TEXT | completed, pending |
| balance_after | REAL | Balance after transaction |
| transaction_date | TEXT | Date of transaction |
| created_at | TEXT | Audit timestamp |

## Business Rules (Ledger Engine)

1. Debit amount cannot exceed current wallet balance
2. Auto-deduction limit cannot exceed initial balance
3. Low-balance alert fires when balance < auto_deduct_limit
4. Critical alert fires when balance ≤ 0
5. Each wallet is linked to exactly one customer
