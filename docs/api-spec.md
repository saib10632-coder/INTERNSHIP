# API Specification

Base URL: `http://localhost:3001`

## Health

| Method | Route | Response |
|--------|-------|----------|
| GET | `/health` | `{ "status": "ok", "project": "customer-prepaid-travel-wallet" }` |

## Wallets

| Method | Route | Description |
|--------|-------|-------------|
| GET | `/api/customer_prepaid_travel_wallet` | List wallets (query: `status`, `search`, `page`, `limit`) |
| GET | `/api/customer_prepaid_travel_wallet/:id` | Single wallet |
| GET | `/api/customer_prepaid_travel_wallet/:id/detail` | Wallet with customer + transactions |
| POST | `/api/customer_prepaid_travel_wallet` | Create wallet |
| PUT | `/api/customer_prepaid_travel_wallet/:id` | Update wallet |
| PATCH | `/api/customer_prepaid_travel_wallet/:id/status` | Change status |
| POST | `/api/customer_prepaid_travel_wallet/:id/transact` | Credit/debit transaction |

### POST Body (Create Wallet)

```json
{
  "customerId": "C001",
  "balance": 50000,
  "autoDeductLimit": 5000,
  "autoDeductEnabled": true,
  "notes": "Family tour package"
}
```

## Customers

| Method | Route | Description |
|--------|-------|-------------|
| GET | `/api/customers` | List all customers |
| POST | `/api/customers` | Create customer |

## Dashboard & Reports

| Method | Route | Description |
|--------|-------|-------------|
| GET | `/api/dashboard/summary` | KPI metrics and alerts |
| GET | `/api/reports/summary` | Analytics with time series |
| GET | `/api/transactions` | All transactions grouped by wallet |

## Error Format

```json
{ "success": false, "message": "Specific error message", "code": 400 }
```
