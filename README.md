# RentEquip — Equipment Rental Marketplace

A high-performance, responsive commercial equipment and machinery rental marketplace built exclusively with **native HTML5, modern CSS3, and vanilla JavaScript (ES6+)**. 

RentEquip operates without external frameworks, libraries, build tools, or backend servers. It runs in the browser using `localStorage` for state management, date overlap validation, and realistic workflow simulations across customer, owner, and administrator roles.

---

## 🏗️ Core Technology & Architecture

- **Vanilla HTML5 & CSS3**: Pure semantic markup and CSS design tokens with responsive Flexbox/Grid layouts, custom SVG graphics, modal dialogs, toast notifications, and interactive status badges.
- **Zero External Dependencies**: No React, Vue, jQuery, Bootstrap, Tailwind, Chart.js, or npm packages.
- **Client-Side Persistence**: Complete equipment inventory, booking lifecycles, user profiles, verified reviews, and notifications persist in `localStorage`.
- **GitHub Pages Native**: Designed specifically for static deployment with relative paths across all assets, navigation links, and subdirectories.

---

## 📄 Application Pages

| Page | Filename | Purpose & Key Workflows |
|---|---|---|
| **Marketplace Catalog** | `index.html` | Search by keywords/depot, filter by category chips, price range sliders, availability toggle, sort options, equipment cards, and quick-view modal. |
| **Equipment Details** | `equipment.html` | Technical specifications, standard feature checklists, operator licensing warnings, verified customer reviews, and a **live rental cost calculator** with real-time date conflict validation and simulated checkout. |
| **Customer Portal** | `customer.html` | Active rental tracking, pending request management, equipment pickup confirmation, return handover modal, simulated receipts, and verified post-rental reviews. |
| **Equipment Owner Portal** | `owner.html` | Fleet inventory CRUD (Add, Edit, Delete, Toggle Maintenance), rental request approvals/rejections, and **return condition inspections** with late penalty and damage fee calculations. |
| **Admin Operations** | `admin.html` | Platform-wide KPIs, category utilization analytics, registered user management, global equipment audit, booking overrides, JSON database backup/restore, and demo data reset. |
| **Notification Center** | `notifications.html` | Real-time alerts for booking approvals, returns awaiting inspection, overdue warnings, mark-as-read toggles, and deep action links. |

---

## 👥 Simulated Demo Roles & Perspectives

The top navigation bar includes an **instant role selector** allowing you to switch perspectives at any time:

1. **Alex Rivera — Customer / Contractor (`usr_alex`)**
   - Company: *Rivera Renovations LLC*
   - Pre-seeded with active rentals (e.g. CAT 308 Excavator), approved bookings awaiting pickup, returned machinery awaiting host inspection, and overdue alert scenarios.
   - Allowed to submit verified reviews only after an equipment return has been inspected and settled.

2. **Marcus Vance — Equipment Owner / Host (`usr_marcus`)**
   - Company: *Vance Earthworks & Machinery*
   - Fleet owner with full CRUD over 12 commercial machinery models.
   - Manages incoming rental requests (Approve / Decline) and conducts return condition inspections.

3. **Elena Rostova — Platform Administrator (`usr_elena`)**
   - Department: *RentEquip Trust & Safety*
   - Has platform-wide oversight: audits all equipment listings, reviews platform gross volume and escrow deposits, enforces status overrides, and manages system backups.

---

## 🧮 Financial & Rental Calculation Invariants

All monetary calculations use strict financial rounding:

- **Billable Rental Days**: 
  - Same-day pickup and return: 1 day minimum.
  - Multi-day rentals: `Math.ceil((end - start) / 86400000)`.
- **Base Rental Fee**: `rentalDays * dailyRate`.
- **Damage Protection & Platform Fee**: `Math.round(rentalFee * 0.06 * 100) / 100` (6% protection fee).
- **Security Deposit**: 100% refundable escrow deposit held during rental.
- **Upfront Charge**: `rentalFee + serviceFee + securityDeposit`.
- **Date Overlap Prevention**:
  - Two bookings overlap if: `startA <= endB && startB <= endA`.
  - Confirmed bookings (`approved` or `active`) block the equipment calendar. The calculator warns the user and disables submission if dates conflict.
- **Overdue Penalty**:
  - If actual return date is later than scheduled end date: `lateDays * (dailyRate * 1.5)`.
- **Net Deposit Settlement Refund**:
  - `depositRefund = Math.max(0, securityDeposit - latePenaltyFee - damageFee)`.
  - If deductions exceed the deposit, the customer liability balance is flagged.

---

## 🚀 GitHub Pages Deployment Guide

The repository includes an automated GitHub Actions deployment workflow at `.github/workflows/deploy.yml`.

### One-Time Repository Configuration
To activate GitHub Pages using GitHub Actions:

1. Go to your repository on GitHub:  
   `https://github.com/VenkatPrashad240701583/WebProgramming-RentEquip`
2. Navigate to **Settings** &rarr; **Pages** (under the "Code and automation" section).
3. Under **Build and deployment** &rarr; **Source**, select **GitHub Actions** from the dropdown menu (instead of "Deploy from a branch").
4. Any push to `main` will now automatically trigger `.github/workflows/deploy.yml` and publish the site.
5. You can also manually trigger a deployment from the **Actions** tab using the **Run workflow** button (`workflow_dispatch`).

### Workflow Details
- **Checkout**: `actions/checkout@v4`
- **Pages Config**: `actions/configure-pages@v5`
- **Artifact Upload**: `actions/upload-pages-artifact@v3` with `path: '.'`
- **Deploy**: `actions/deploy-pages@v4`
- **Permissions**: Minimum required privileges (`contents: read`, `pages: write`, `id-token: write`).

---

## ⚠️ Limitations & Simulation Disclaimer

- **Simulated Transactions**: All credit card processing, corporate ACH payments, and security deposit escrow refunds are simulated client-side. No real monetary transactions occur.
- **Local Persistence Scope**: Data is stored in your individual browser's `localStorage`. Opening the application in an incognito window or clearing browser data will reset the state to the pre-seeded defaults.
- **Factory Reset**: A "Reset Demo Data" button is located in the global footer and in the Admin portal to restore the initial test scenarios at any time.
