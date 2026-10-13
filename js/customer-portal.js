/**
 * RentEquip - Student Customer Portal Controller (customer.html)
 * Powers student booking management, pickup confirmation, item returns,
 * simulated UPI receipts in ₹, and verified peer reviews.
 */

(function (window) {
  'use strict';

  const CustomerPortal = {
    activeTab: 'all',
    selectedBookingId: null,

    init() {
      this.bindEvents();
      this.render();

      window.addEventListener('rentequip:change', () => this.render());
      window.addEventListener('rentequip:auth_change', () => this.render());
    },

    bindEvents() {
      const tabGroup = document.getElementById('booking-tabs');
      if (tabGroup) {
        tabGroup.addEventListener('click', (e) => {
          const tabBtn = e.target.closest('.tab-btn');
          if (!tabBtn) return;
          this.activeTab = tabBtn.getAttribute('data-tab');
          tabGroup.querySelectorAll('.tab-btn').forEach(b => b.classList.remove('active'));
          tabBtn.classList.add('active');
          this.renderBookingsTable();
        });
      }

      const starGroup = document.getElementById('review-star-group');
      if (starGroup) {
        starGroup.addEventListener('click', (e) => {
          const starBtn = e.target.closest('.star-btn');
          if (!starBtn) return;
          const val = Number(starBtn.getAttribute('data-val'));
          document.getElementById('review-rating-val').value = val;
          this.updateStarRatingUI(val);
        });
      }

      const reviewForm = document.getElementById('review-form');
      if (reviewForm) {
        reviewForm.addEventListener('submit', (e) => {
          e.preventDefault();
          this.submitReview();
        });
      }

      const returnForm = document.getElementById('return-form');
      if (returnForm) {
        returnForm.addEventListener('submit', (e) => {
          e.preventDefault();
          this.submitReturn();
        });
      }
    },

    updateStarRatingUI(val) {
      const starBtns = document.querySelectorAll('#review-star-group .star-btn');
      starBtns.forEach(btn => {
        const btnVal = Number(btn.getAttribute('data-val'));
        btn.classList.toggle('active', btnVal <= val);
        btn.style.color = btnVal <= val ? '#f59e0b' : '#cbd5e1';
      });
      const desc = document.getElementById('review-star-desc');
      const descriptions = ['', 'Poor condition / Missing parts', 'Fair / Barely functional', 'Good working order', 'Very good & clean', 'Mint condition / Excellent!'];
      if (desc) desc.textContent = descriptions[val] || '';
    },

    render() {
      this.renderHeaderSummary();
      this.renderKPICards();
      this.renderBookingsTable();
    },

    renderHeaderSummary() {
      const user = window.RentEquip.Auth.getUser();
      const userNameEl = document.getElementById('customer-user-name');
      const userAvatarEl = document.getElementById('customer-user-avatar');
      const userCompanyEl = document.getElementById('customer-user-company');

      if (userNameEl) userNameEl.textContent = user.name;
      if (userAvatarEl) {
        userAvatarEl.textContent = user.avatar;
        userAvatarEl.style.background = window.RentEquip.UI.getUserColor(user.role);
      }
      if (userCompanyEl) userCompanyEl.textContent = user.company || 'Verified Student Renter';

      const roleBanner = document.getElementById('role-warning-banner');
      if (roleBanner) {
        if (user.role !== 'customer') {
          roleBanner.style.display = 'flex';
          roleBanner.innerHTML = `
            <div>
              <strong>Perspective Note:</strong> You are currently viewing as <em>${user.name} (${user.role.toUpperCase()})</em>. 
              To view student bookings for Aarav Sharma, <a href="#" id="switch-to-customer-link" style="text-decoration: underline; font-weight: 800; color: inherit;">click here to switch to Aarav Sharma's perspective</a>.
            </div>
          `;
          const switchLink = document.getElementById('switch-to-customer-link');
          if (switchLink) {
            switchLink.addEventListener('click', (e) => {
              e.preventDefault();
              window.RentEquip.Auth.switchUser('usr_aarav');
            });
          }
        } else {
          roleBanner.style.display = 'none';
        }
      }
    },

    getCustomerBookings() {
      const user = window.RentEquip.Auth.getUser();
      const allBookings = window.RentEquip.Storage.getBookings();
      return allBookings.filter(b => b.customerId === user.id);
    },

    renderKPICards() {
      const bookings = this.getCustomerBookings();
      const Calc = window.RentEquip.Calc;

      const activeCount = bookings.filter(b => ['active', 'approved'].includes(b.status)).length;
      const pendingCount = bookings.filter(b => b.status === 'pending').length;
      
      const totalSpent = bookings
        .filter(b => !['cancelled', 'rejected'].includes(b.status))
        .reduce((sum, b) => sum + (b.rentalFee + b.serviceFee), 0);

      const depositsHeld = bookings
        .filter(b => ['active', 'approved', 'returned'].includes(b.status))
        .reduce((sum, b) => sum + b.securityDeposit, 0);

      const depositsRefunded = bookings
        .filter(b => b.status === 'completed' && b.inspection)
        .reduce((sum, b) => sum + (b.inspection.depositRefunded || 0), 0);

      const kpiActive = document.getElementById('kpi-active-rentals');
      const kpiPending = document.getElementById('kpi-pending-requests');
      const kpiSpend = document.getElementById('kpi-total-spend');
      const kpiDeposits = document.getElementById('kpi-deposits-held');
      const kpiDepositsRefunded = document.getElementById('kpi-deposits-refunded-sub');

      if (kpiActive) kpiActive.textContent = activeCount;
      if (kpiPending) kpiPending.textContent = pendingCount;
      if (kpiSpend) kpiSpend.textContent = Calc.formatCurrency(totalSpent);
      if (kpiDeposits) kpiDeposits.textContent = Calc.formatCurrency(depositsHeld);
      if (kpiDepositsRefunded) kpiDepositsRefunded.textContent = `Refunded: ${Calc.formatCurrency(depositsRefunded)}`;
    },

    renderBookingsTable() {
      const tbody = document.getElementById('bookings-table-body');
      const emptyState = document.getElementById('bookings-empty-state');
      if (!tbody) return;

      const bookings = this.getCustomerBookings();
      const Calc = window.RentEquip.Calc;
      const today = Calc.getTodayISO();

      const filtered = bookings.filter(b => {
        if (this.activeTab === 'active') return ['active', 'approved'].includes(b.status);
        if (this.activeTab === 'pending') return b.status === 'pending';
        if (this.activeTab === 'completed') return b.status === 'completed';
        if (this.activeTab === 'cancelled') return ['cancelled', 'rejected'].includes(b.status);
        return true;
      });

      if (filtered.length === 0) {
        tbody.innerHTML = '';
        if (emptyState) emptyState.style.display = 'flex';
        return;
      }

      if (emptyState) emptyState.style.display = 'none';

      tbody.innerHTML = filtered.map(b => {
        const isOverdue = b.status === 'active' && b.endDate < today;
        const statusBadge = window.RentEquip.UI.getStatusBadge(b.status, isOverdue);

        return `
          <tr id="booking-row-${b.id}">
            <td>
              <div class="table-item-cell">
                <div class="table-item-thumb">
                  <img src="${b.equipmentImage}" alt="${b.equipmentTitle}">
                </div>
                <div>
                  <div class="table-item-title">${b.equipmentTitle}</div>
                  <div class="table-item-sub">Ref: ${b.id} • Host: ${b.ownerName}</div>
                </div>
              </div>
            </td>
            <td>
              <div><strong>${Calc.formatDate(b.startDate)}</strong> to <strong>${Calc.formatDate(b.endDate)}</strong></div>
              <div class="table-item-sub">${b.rentalDays} days duration</div>
            </td>
            <td>
              <div><strong>${Calc.formatCurrency(b.totalUpfrontPaid)}</strong></div>
              <div class="table-item-sub">Deposit: ${Calc.formatCurrency(b.securityDeposit)} (${b.payment ? b.payment.depositStatus.replace('_', ' ') : 'held'})</div>
            </td>
            <td>
              ${statusBadge}
            </td>
            <td>
              <div class="table-actions">
                ${this.renderActionButtons(b, isOverdue)}
                <button class="btn btn-outline btn-sm btn-view-receipt" data-id="${b.id}" title="View Campus UPI Receipt">
                  <svg width="14" height="14" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"/>
                  </svg>
                  Receipt
                </button>
              </div>
            </td>
          </tr>
        `;
      }).join('');

      this.bindTableActionListeners();
    },

    renderActionButtons(b, isOverdue) {
      if (b.status === 'pending') {
        return `
          <button class="btn btn-outline btn-sm btn-cancel-booking" data-id="${b.id}">
            Cancel
          </button>
        `;
      }
      if (b.status === 'approved') {
        return `
          <button class="btn btn-primary btn-sm btn-confirm-pickup" data-id="${b.id}">
            Confirm Pickup
          </button>
        `;
      }
      if (b.status === 'active') {
        return `
          <button class="btn ${isOverdue ? 'btn-danger' : 'btn-primary'} btn-sm btn-open-return" data-id="${b.id}">
            ${isOverdue ? 'Return Overdue Item' : 'Return Item'}
          </button>
        `;
      }
      if (b.status === 'returned') {
        return `
          <span class="badge badge-returned" style="font-size: 0.75rem;">Awaiting Check</span>
        `;
      }
      if (b.status === 'completed') {
        if (!b.reviewed) {
          return `
            <button class="btn btn-primary btn-sm btn-open-review" data-id="${b.id}">
              Write Review
            </button>
          `;
        } else {
          return `
            <span class="badge badge-available" style="font-size: 0.75rem;">Reviewed ★</span>
          `;
        }
      }
      if (b.status === 'rejected') {
        return `
          <span class="badge badge-rejected" style="font-size: 0.72rem;">Declined: ${b.rejectionReason || 'Unavailable'}</span>
        `;
      }
      return '';
    },

    bindTableActionListeners() {
      const tbody = document.getElementById('bookings-table-body');
      if (!tbody) return;

      tbody.querySelectorAll('.btn-cancel-booking').forEach(btn => {
        btn.addEventListener('click', (e) => {
          const id = e.currentTarget.getAttribute('data-id');
          if (confirm('Cancel this borrow request? Your simulated payment will be refunded immediately.')) {
            window.RentEquip.Storage.transitionBookingStatus(id, 'cancelled');
            window.RentEquip.UI.showToast(`Request #${id} cancelled. Simulated refund issued.`, 'info');
          }
        });
      });

      tbody.querySelectorAll('.btn-confirm-pickup').forEach(btn => {
        btn.addEventListener('click', (e) => {
          const id = e.currentTarget.getAttribute('data-id');
          window.RentEquip.Storage.transitionBookingStatus(id, 'active');
          window.RentEquip.UI.showToast(`Handover confirmed! Item #${id} is now in your custody.`, 'success');
        });
      });

      tbody.querySelectorAll('.btn-open-return').forEach(btn => {
        btn.addEventListener('click', (e) => {
          const id = e.currentTarget.getAttribute('data-id');
          this.openReturnModal(id);
        });
      });

      tbody.querySelectorAll('.btn-open-review').forEach(btn => {
        btn.addEventListener('click', (e) => {
          const id = e.currentTarget.getAttribute('data-id');
          this.openReviewModal(id);
        });
      });

      tbody.querySelectorAll('.btn-view-receipt').forEach(btn => {
        btn.addEventListener('click', (e) => {
          const id = e.currentTarget.getAttribute('data-id');
          this.openReceiptModal(id);
        });
      });
    },

    openReturnModal(bookingId) {
      const b = window.RentEquip.Storage.getBookingById(bookingId);
      if (!b) return;

      this.selectedBookingId = bookingId;
      const Calc = window.RentEquip.Calc;
      const today = Calc.getTodayISO();

      const modalTitle = document.getElementById('return-modal-title');
      const unitSummary = document.getElementById('return-unit-summary');
      const returnDateInput = document.getElementById('return-actual-date');

      if (modalTitle) modalTitle.textContent = `Return Item: ${b.equipmentTitle}`;
      if (returnDateInput) {
        returnDateInput.value = today;
        returnDateInput.max = today;
      }

      if (unitSummary) {
        const isOverdue = b.endDate < today;
        const overdueDays = Calc.calculateOverdueDays(b.endDate, today);

        unitSummary.innerHTML = `
          <div style="background: var(--color-surface-raised); border-radius: var(--radius-sm); padding: 1rem; margin-bottom: 1.25rem; border: 1.5px solid var(--color-border);">
            <div style="display: flex; justify-content: space-between; margin-bottom: 0.5rem;">
              <span>Scheduled Return Date:</span>
              <strong>${Calc.formatDate(b.endDate)}</strong>
            </div>
            <div style="display: flex; justify-content: space-between; margin-bottom: 0.5rem;">
              <span>Security Deposit in Escrow:</span>
              <strong style="color: var(--color-success);">${Calc.formatCurrency(b.securityDeposit)}</strong>
            </div>
            ${isOverdue ? `
              <div class="overdue-warning-banner" style="margin-top: 0.75rem; margin-bottom: 0;">
                ⚠️ <strong>Item is Overdue:</strong> Due date was ${Calc.formatDate(b.endDate)} (${overdueDays} days late). Standard student late fee (1.25x daily rate) will apply during host inspection.
              </div>
            ` : `
              <div style="font-size: 0.85rem; color: var(--color-success); margin-top: 0.5rem; font-weight: 700;">
                ✓ Returning on schedule! 100% deposit will be refunded after host check.
              </div>
            `}
          </div>
        `;
      }

      window.RentEquip.UI.openModal('return-modal');
    },

    submitReturn() {
      if (!this.selectedBookingId) return;

      const dateInput = document.getElementById('return-actual-date');
      const actualDate = dateInput ? dateInput.value : window.RentEquip.Calc.getTodayISO();

      window.RentEquip.Storage.transitionBookingStatus(this.selectedBookingId, 'returned', {
        actualReturnDate: actualDate
      });

      window.RentEquip.UI.closeModal('return-modal');
      window.RentEquip.UI.showToast(`Item returned! Host notified to verify condition.`, 'success');
      this.selectedBookingId = null;
    },

    openReviewModal(bookingId) {
      const b = window.RentEquip.Storage.getBookingById(bookingId);
      if (!b) return;

      this.selectedBookingId = bookingId;
      document.getElementById('review-equipment-id').value = b.equipmentId;
      document.getElementById('review-booking-id').value = b.id;
      document.getElementById('review-equipment-title').textContent = b.equipmentTitle;
      document.getElementById('review-comment').value = '';

      document.getElementById('review-rating-val').value = '5';
      this.updateStarRatingUI(5);

      window.RentEquip.UI.openModal('review-modal');
    },

    submitReview() {
      const eqId = document.getElementById('review-equipment-id').value;
      const bkId = document.getElementById('review-booking-id').value;
      const rating = document.getElementById('review-rating-val').value;
      const comment = document.getElementById('review-comment').value;

      if (!comment.trim()) {
        window.RentEquip.UI.showToast('Please provide a brief peer review note.', 'warning');
        return;
      }

      const res = window.RentEquip.Storage.addReview({
        equipmentId: eqId,
        bookingId: bkId,
        rating: Number(rating),
        comment: comment
      });

      if (res.success) {
        window.RentEquip.UI.closeModal('review-modal');
        window.RentEquip.UI.showToast('Thank you! Your peer review is now visible to other students.', 'success');
        this.render();
      } else {
        window.RentEquip.UI.showToast(res.error, 'error');
      }
    },

    openReceiptModal(bookingId) {
      const b = window.RentEquip.Storage.getBookingById(bookingId);
      if (!b) return;

      const Calc = window.RentEquip.Calc;
      const receiptContainer = document.getElementById('receipt-modal-content');
      if (!receiptContainer) return;

      const isCompleted = b.status === 'completed' && b.inspection;

      receiptContainer.innerHTML = `
        <div class="receipt-paper">
          <div class="receipt-header">
            <div>
              <div class="receipt-title">RentEquip Campus Receipt</div>
              <div style="font-size: 0.85rem; color: var(--color-text-muted); font-weight: 600;">Student Resource Sharing Network</div>
            </div>
            <div class="receipt-meta">
              <div><strong>Transaction Ref:</strong> ${b.payment ? b.payment.transactionId : 'CAMPUS-UPI'}</div>
              <div><strong>Booking ID:</strong> ${b.id}</div>
              <div><strong>Date:</strong> ${Calc.formatDate(b.createdAt.split('T')[0])}</div>
            </div>
          </div>

          <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 1rem; margin-bottom: 1.5rem; font-size: 0.88rem;">
            <div>
              <strong style="color: var(--color-primary);">Renter (Student):</strong><br>
              ${b.customerName}<br>
              ${b.customerCompany || 'Student'}<br>
              ${b.customerEmail}
            </div>
            <div>
              <strong style="color: var(--color-primary);">Host / Lender:</strong><br>
              ${b.ownerName}<br>
              Item: ${b.equipmentTitle}<br>
              Duration: ${b.rentalDays} days (${Calc.formatDate(b.startDate)} - ${Calc.formatDate(b.endDate)})
            </div>
          </div>

          <table class="receipt-table">
            <thead>
              <tr>
                <th>Description</th>
                <th>Rate / Term</th>
                <th style="text-align: right;">Amount</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>Item Rental (${b.equipmentTitle})</td>
                <td>${b.rentalDays} days @ ${Calc.formatCurrency(b.dailyRate)}/day</td>
                <td style="text-align: right;">${Calc.formatCurrency(b.rentalFee)}</td>
              </tr>
              <tr>
                <td>Student Community Pool Fee (5%)</td>
                <td>Platform Maintenance</td>
                <td style="text-align: right;">${Calc.formatCurrency(b.serviceFee)}</td>
              </tr>
              <tr>
                <td>Refundable Security Deposit (Escrow)</td>
                <td>100% Refundable after return check</td>
                <td style="text-align: right;">${Calc.formatCurrency(b.securityDeposit)}</td>
              </tr>
              <tr class="total-row">
                <td colspan="2"><strong>Total Upfront Paid</strong></td>
                <td style="text-align: right;"><strong>${Calc.formatCurrency(b.totalUpfrontPaid)}</strong></td>
              </tr>
            </tbody>
          </table>

          ${isCompleted ? `
            <div style="margin-top: 1.5rem; background: var(--color-surface-raised); border: 1.5px solid var(--color-border); border-radius: 6px; padding: 1rem;">
              <h4 style="font-size: 0.95rem; color: var(--color-primary); margin-bottom: 0.5rem;">Return Inspection &amp; Deposit Settlement</h4>
              <div style="display: flex; justify-content: space-between; font-size: 0.88rem; margin-bottom: 0.35rem;">
                <span>Item Condition:</span>
                <strong style="text-transform: capitalize;">${b.inspection.condition.replace('_', ' ')}</strong>
              </div>
              <div style="display: flex; justify-content: space-between; font-size: 0.88rem; margin-bottom: 0.35rem;">
                <span>Late Penalty (${b.inspection.lateDays} days late):</span>
                <span style="color: ${b.inspection.latePenaltyFee > 0 ? '#dc2626' : 'inherit'}; font-weight: 700;">${Calc.formatCurrency(b.inspection.latePenaltyFee)}</span>
              </div>
              <div style="display: flex; justify-content: space-between; font-size: 0.88rem; margin-bottom: 0.35rem;">
                <span>Wear / Damage Deductions:</span>
                <span style="color: ${b.inspection.damageFee > 0 ? '#dc2626' : 'inherit'}; font-weight: 700;">${Calc.formatCurrency(b.inspection.damageFee)}</span>
              </div>
              <div style="display: flex; justify-content: space-between; font-size: 1.05rem; font-weight: 900; border-top: 1.5px solid var(--color-border); padding-top: 0.5rem; margin-top: 0.5rem; color: var(--color-success);">
                <span>Deposit Refunded:</span>
                <span>${Calc.formatCurrency(b.inspection.depositRefunded)}</span>
              </div>
              <p style="font-size: 0.8rem; color: var(--color-text-dim); margin-top: 0.5rem;">Inspector Notes: "${b.inspection.damageNotes}"</p>
            </div>
          ` : `
            <div style="margin-top: 1rem; font-size: 0.85rem; color: var(--color-text-dim); background: var(--color-surface-raised); padding: 0.75rem; border-radius: 4px; border: 1px solid var(--color-border);">
              <strong>Security Deposit Status:</strong> ${b.payment ? b.payment.depositStatus.replace('_', ' ').toUpperCase() : 'HELD'} (Full refund processed upon safe item return).
            </div>
          `}

          <div style="margin-top: 2rem; border-top: 1.5px dashed var(--color-border); padding-top: 1rem; text-align: center; font-size: 0.78rem; color: var(--color-text-dim);">
            Simulated College UPI Transfer • Paid via ${b.payment ? b.payment.method : 'UPI'} • RentEquip Testbed
          </div>
        </div>
      `;

      window.RentEquip.UI.openModal('receipt-modal');
    }
  };

  window.RentEquip = window.RentEquip || {};
  window.RentEquip.CustomerPortal = CustomerPortal;

  document.addEventListener('DOMContentLoaded', () => {
    CustomerPortal.init();
  });
})(window);
