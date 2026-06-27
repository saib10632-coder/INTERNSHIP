# Test Cases — Customer Prepaid Travel Wallet System

## Health Check

| ID | Module | Description | Expected | Status |
|----|--------|-------------|----------|--------|
| TC-01 | Health | GET /health | `{ status: "ok" }` | Pass |

## Wallet Entry Form

| ID | Module | Description | Expected | Status |
|----|--------|-------------|----------|--------|
| TC-02 | Form | Submit valid wallet | 201, wallet created with ID | Pass |
| TC-03 | Form | Missing customer | 400 validation error | Pass |
| TC-04 | Form | Invalid balance (0) | 400 validation error | Pass |
| TC-05 | Form | Auto-deduct > balance | 400 validation error | Pass |

## Dashboard

| ID | Module | Description | Expected | Status |
|----|--------|-------------|----------|--------|
| TC-06 | Dashboard | GET all wallets | Sorted by created_at DESC | Pass |
| TC-07 | Dashboard | Filter by status | Only matching wallets | Pass |
| TC-08 | Dashboard | Search by customer name | Filtered results | Pass |
| TC-09 | Dashboard | Pagination page 2 | Correct offset records | Pass |

## Detail View

| ID | Module | Description | Expected | Status |
|----|--------|-------------|----------|--------|
| TC-10 | Detail | GET wallet by valid ID | Full record returned | Pass |
| TC-11 | Detail | GET invalid ID | 404 not found | Pass |
| TC-12 | Detail | Credit transaction | Balance increases | Pass |
| TC-13 | Detail | Debit exceeds balance | 400 insufficient funds | Pass |

## Ledger Engine

| ID | Module | Description | Expected | Status |
|----|--------|-------------|----------|--------|
| TC-14 | Ledger | Debit ₹5000 from ₹45000 wallet | Balance = ₹40000 | Pass |
| TC-15 | Ledger | Debit ₹50000 from ₹45000 wallet | Error returned | Pass |
| TC-16 | Ledger | Low balance alert | Alert when balance < limit | Pass |

## Reports

| ID | Module | Description | Expected | Status |
|----|--------|-------------|----------|--------|
| TC-17 | Reports | GET /api/reports/summary | Totals + time series | Pass |
| TC-18 | Reports | Health distribution | healthy/low/critical counts | Pass |

## Integration

| ID | Module | Description | Expected | Status |
|----|--------|-------------|----------|--------|
| TC-19 | E2E | Create → Dashboard → Detail | Same data across screens | Pass |
| TC-20 | E2E | Transaction persists after refresh | Data in database | Pass |

## First Test Result (Day 3)

**Test:** GET /health  
**Expected:** `{ "status": "ok", "project": "customer-prepaid-travel-wallet" }`  
**Actual:** Matches expected  
**Result:** PASS  
**Date:** 2026-06-03
