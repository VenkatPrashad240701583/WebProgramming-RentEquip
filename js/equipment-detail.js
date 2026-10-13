/**
 * RentEquip - Campus Equipment Detail & Quote Controller (equipment.html)
 * Powers item details, condition badges, real-time date conflict verification,
 * live student cost calculations in ₹, and simulated campus borrow checkout.
 */

(function (window) {
  'use strict';

  const Detail = {
    equipment: null,
    quote: null,
    conflictCheck: null,

    init() {
      const params = new URLSearchParams(window.location.search);
      let eqId = params.get('id');

      const allEquipment = window.RentEquip.Storage.getEquipment();
      if (!eqId || !window.RentEquip.Storage.getEquipmentById(eqId)) {
        eqId = allEquipment.length > 0 ? allEquipment[0].id : null;
      }

      if (!eqId) {
        window.location.href = 'index.html';
        return;
      }

      this.equipment = window.RentEquip.Storage.getEquipmentById(eqId);
      this.render();
      this.initCalculator();
      this.bindEvents();

      window.addEventListener('rentequip:change', () => {
        this.equipment = window.RentEquip.Storage.getEquipmentById(this.equipment.id);
        if (this.equipment) {
          this.recalculate();
          this.renderReviews();
        }
      });
    },

    render() {
      const eq = this.equipment;
      const Calc = window.RentEquip.Calc;

      document.title = `${eq.title} — RentEquip Campus Gear`;

      // Breadcrumb & Header
      const breadcrumbCat = document.getElementById('breadcrumb-category');
      const breadcrumbTitle = document.getElementById('breadcrumb-title');
      if (breadcrumbCat) breadcrumbCat.textContent = eq.category;
      if (breadcrumbTitle) breadcrumbTitle.textContent = eq.title;

      // Media Visual
      const mediaContainer = document.getElementById('detail-media');
      if (mediaContainer) {
        mediaContainer.innerHTML = `<img src="${eq.image}" alt="${eq.title}" style="width: 100%; height: 100%; object-fit: contain;">`;
      }

      // Title & Status
      const catBadge = document.getElementById('detail-category-badge');
      const titleEl = document.getElementById('detail-title');
      const statusBadge = document.getElementById('detail-status-badge');
      const locEl = document.getElementById('detail-location');
      const ratingEl = document.getElementById('detail-rating');

      if (catBadge) catBadge.textContent = eq.category;
      if (titleEl) titleEl.textContent = eq.title;
      if (statusBadge) statusBadge.innerHTML = window.RentEquip.UI.getStatusBadge(eq.status);
      if (locEl) locEl.textContent = eq.location;
      if (ratingEl) ratingEl.innerHTML = `★ ${eq.rating.toFixed(1)} <span class="text-xs text-muted font-bold">(${eq.reviewCount || 0} student reviews)</span>`;

      // Condition badge if available
      const conditionBadgeEl = document.getElementById('detail-condition-badge');
      if (conditionBadgeEl && eq.condition) {
        conditionBadgeEl.style.display = 'inline-flex';
        conditionBadgeEl.textContent = `Condition: ${eq.condition}`;
      }

      // Description
      const descEl = document.getElementById('detail-description');
      if (descEl) descEl.textContent = eq.description;

      // Operator/Lab Safety Notice
      const licenseNotice = document.getElementById('detail-license-notice');
      if (licenseNotice) {
        licenseNotice.style.display = eq.requiresOperatorLicense ? 'flex' : 'none';
      }

      // Specifications Table
      const specsTableBody = document.getElementById('detail-specs-body');
      if (specsTableBody) {
        specsTableBody.innerHTML = (eq.specs || []).map(s => `
          <tr>
            <td class="spec-key">${s.label}</td>
            <td class="spec-val">${s.value}</td>
          </tr>
        `).join('');
      }

      // Features / Included Items List
      const featuresList = document.getElementById('detail-features-list');
      if (featuresList) {
        featuresList.innerHTML = (eq.features || []).map(f => `
          <div class="feature-item">
            <svg class="feature-check-icon" width="18" height="18" fill="none" stroke="currentColor" stroke-width="2.5" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" d="M5 13l4 4L19 7"/>
            </svg>
            <span>${f}</span>
          </div>
        `).join('');
      }

      // Student Owner / Host Card
      const ownerName = document.getElementById('owner-name');
      const ownerCompany = document.getElementById('owner-company');
      const ownerRating = document.getElementById('owner-rating');
      const ownerAvatar = document.getElementById('owner-avatar');

      const ownerObj = window.RentEquip.Storage.getUserById(eq.ownerId);
      if (ownerName) ownerName.textContent = eq.ownerName;
      if (ownerCompany) ownerCompany.textContent = ownerObj ? ownerObj.company : 'Verified Student Lender';
      if (ownerRating) ownerRating.textContent = `★ ${eq.ownerRating || 4.9} Verified Peer Host • Fast Response`;
      if (ownerAvatar && ownerObj) ownerAvatar.textContent = ownerObj.avatar;

      // Reviews
      this.renderReviews();

      // Calculator Rates Display
      const calcRate = document.getElementById('calc-display-rate');
      const calcDeposit = document.getElementById('calc-display-deposit');
      if (calcRate) calcRate.textContent = Calc.formatCurrency(eq.dailyRate);
      if (calcDeposit) calcDeposit.textContent = Calc.formatCurrency(eq.securityDeposit);
    },

    renderReviews() {
      const container = document.getElementById('reviews-container');
      const countEl = document.getElementById('reviews-count-badge');
      if (!container) return;

      const reviews = window.RentEquip.Storage.getReviews(this.equipment.id);
      if (countEl) countEl.textContent = reviews.length;

      if (reviews.length === 0) {
        container.innerHTML = `
          <div style="padding: 1.5rem; background: var(--color-surface-raised); border: 1.5px solid var(--color-border); border-radius: var(--radius-md); text-align: center;">
            <p style="color: var(--color-text-muted); font-size: 0.9rem;">No peer reviews yet for this item. Reviews are submitted by verified students after inspecting and returning the item.</p>
          </div>
        `;
        return;
      }

      container.innerHTML = reviews.map(r => `
        <div style="background: #ffffff; border: 1.5px solid var(--color-border); border-radius: var(--radius-md); padding: 1.25rem; margin-bottom: 1rem; box-shadow: var(--shadow-sm);">
          <div style="display: flex; align-items: center; justify-content: space-between; margin-bottom: 0.5rem;">
            <div>
              <strong style="color: var(--color-text-main); font-size: 0.95rem;">${r.customerName}</strong>
              <span class="sticker-tag sticker-tag-green" style="font-size: 0.68rem; margin-left: 0.5rem;">Verified Student Renter</span>
            </div>
            <div style="color: #f59e0b; font-weight: 800; font-size: 0.92rem;">
              ${'★'.repeat(r.rating)}${'☆'.repeat(5 - r.rating)}
            </div>
          </div>
          <p style="color: var(--color-text-muted); font-size: 0.9rem; line-height: 1.55; margin-bottom: 0.5rem;">
            "${r.comment}"
          </p>
          <div style="font-size: 0.78rem; color: var(--color-text-dim); font-weight: 600;">
            Borrowed on ${window.RentEquip.Calc.formatDate(r.date)}
          </div>
        </div>
      `).join('');
    },

    initCalculator() {
      const Calc = window.RentEquip.Calc;
      const startInput = document.getElementById('calc-start-date');
      const endInput = document.getElementById('calc-end-date');

      if (!startInput || !endInput) return;

      const today = Calc.getTodayISO();
      startInput.min = today;
      endInput.min = today;

      // Default start date = today (emergency borrow) or tomorrow
      startInput.value = today;
      endInput.value = Calc.addDays(today, 2);

      this.recalculate();
    },

    bindEvents() {
      const startInput = document.getElementById('calc-start-date');
      const endInput = document.getElementById('calc-end-date');
      const bookBtn = document.getElementById('btn-request-booking');
      const checkoutForm = document.getElementById('checkout-form');

      if (startInput) {
        startInput.addEventListener('change', () => {
          if (endInput && endInput.value < startInput.value) {
            endInput.value = startInput.value;
          }
          if (endInput) endInput.min = startInput.value;
          this.recalculate();
        });
      }

      if (endInput) {
        endInput.addEventListener('change', () => {
          this.recalculate();
        });
      }

      if (bookBtn) {
        bookBtn.addEventListener('click', () => {
          this.openCheckoutModal();
        });
      }

      if (checkoutForm) {
        checkoutForm.addEventListener('submit', (e) => {
          e.preventDefault();
          this.submitBooking();
        });
      }
    },

    recalculate() {
      const Calc = window.RentEquip.Calc;
      const startInput = document.getElementById('calc-start-date');
      const endInput = document.getElementById('calc-end-date');
      const alertBox = document.getElementById('calc-availability-alert');
      const bookBtn = document.getElementById('btn-request-booking');

      if (!startInput || !endInput) return;

      const startDate = startInput.value;
      const endDate = endInput.value;

      if (!startDate || !endDate || endDate < startDate) {
        this.renderBreakdownError('Please choose valid pickup and return dates.');
        if (bookBtn) bookBtn.disabled = true;
        return;
      }

      this.conflictCheck = window.RentEquip.Storage.isEquipmentAvailable(this.equipment.id, startDate, endDate);

      if (!this.conflictCheck.available) {
        if (alertBox) {
          alertBox.className = 'calc-availability-alert alert-conflict';
          alertBox.style.display = 'flex';
          alertBox.innerHTML = `
            <svg width="18" height="18" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/>
            </svg>
            <div>
              <strong>Dates Unavailable!</strong><br>
              ${this.conflictCheck.reason}
            </div>
          `;
        }
        if (bookBtn) bookBtn.disabled = true;
      } else {
        if (alertBox) {
          alertBox.className = 'calc-availability-alert alert-available';
          alertBox.style.display = 'flex';
          alertBox.innerHTML = `
            <svg width="18" height="18" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" d="M5 13l4 4L19 7"/>
            </svg>
            <div>
              <strong>Available for Pickup!</strong> Ready on ${Calc.formatDate(startDate)} at ${this.equipment.location}.
            </div>
          `;
        }
        if (bookBtn) bookBtn.disabled = false;
      }

      this.quote = Calc.calculateQuote(this.equipment.dailyRate, this.equipment.securityDeposit, startDate, endDate);
      this.renderBreakdown(this.quote);
    },

    renderBreakdown(q) {
      const Calc = window.RentEquip.Calc;
      const daysEl = document.getElementById('calc-val-days');
      const feeEl = document.getElementById('calc-val-fee');
      const serviceEl = document.getElementById('calc-val-service');
      const depositEl = document.getElementById('calc-val-deposit');
      const totalEl = document.getElementById('calc-val-total');

      if (daysEl) daysEl.textContent = `${q.days} ${q.days === 1 ? 'Day (Exam/Class Borrow)' : 'Days'}`;
      if (feeEl) feeEl.textContent = Calc.formatCurrency(q.rentalFee);
      if (serviceEl) serviceEl.textContent = Calc.formatCurrency(q.serviceFee);
      if (depositEl) depositEl.textContent = Calc.formatCurrency(q.securityDeposit);
      if (totalEl) totalEl.textContent = Calc.formatCurrency(q.totalUpfront);
    },

    renderBreakdownError(msg) {
      const alertBox = document.getElementById('calc-availability-alert');
      if (alertBox) {
        alertBox.className = 'calc-availability-alert alert-conflict';
        alertBox.style.display = 'flex';
        alertBox.innerHTML = `<span>${msg}</span>`;
      }
    },

    openCheckoutModal() {
      if (!this.quote || !this.conflictCheck.available) return;

      const Calc = window.RentEquip.Calc;
      const user = window.RentEquip.Auth.getUser();

      const modalSummary = document.getElementById('checkout-rental-summary');
      if (modalSummary) {
        modalSummary.innerHTML = `
          <div style="background: var(--color-surface-raised); border-radius: var(--radius-sm); padding: 1rem; margin-bottom: 1.25rem; border: 1.5px solid var(--color-border);">
            <div style="display: flex; gap: 1rem; align-items: center; margin-bottom: 0.75rem;">
              <div style="width: 50px; height: 50px; border-radius: var(--radius-sm); overflow: hidden; background: #ffffff; border: 1px solid var(--color-border); padding: 2px;">
                <img src="${this.equipment.image}" alt="" style="width: 100%; height: 100%; object-fit: contain;">
              </div>
              <div>
                <strong style="color: var(--color-text-main); font-size: 0.95rem;">${this.equipment.title}</strong>
                <div style="font-size: 0.8rem; color: var(--color-text-muted);">Pickup: ${this.equipment.location}</div>
              </div>
            </div>

            <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 0.5rem; font-size: 0.85rem; border-top: 1px solid var(--color-border); padding-top: 0.75rem;">
              <div><strong>Pickup:</strong> ${Calc.formatDate(document.getElementById('calc-start-date').value)}</div>
              <div><strong>Return:</strong> ${Calc.formatDate(document.getElementById('calc-end-date').value)}</div>
              <div><strong>Duration:</strong> ${this.quote.days} days</div>
              <div><strong>Rate:</strong> ${Calc.formatCurrency(this.equipment.dailyRate)}/day</div>
            </div>
          </div>

          <div style="background: #ffffff; border: 1.5px solid var(--color-border); border-radius: var(--radius-sm); padding: 1rem; margin-bottom: 1.25rem;">
            <div class="calc-breakdown-row">
              <span>Rental Fee (${this.quote.days} days):</span>
              <strong>${Calc.formatCurrency(this.quote.rentalFee)}</strong>
            </div>
            <div class="calc-breakdown-row">
              <span>Student Platform Maintenance (5%):</span>
              <strong>${Calc.formatCurrency(this.quote.serviceFee)}</strong>
            </div>
            <div class="calc-breakdown-row">
              <span style="color: var(--color-success);">Refundable Security Deposit:</span>
              <strong style="color: var(--color-success);">${Calc.formatCurrency(this.quote.securityDeposit)}</strong>
            </div>
            <div class="calc-breakdown-row total-row">
              <span>Total Upfront Amount (Simulated):</span>
              <span class="calc-val">${Calc.formatCurrency(this.quote.totalUpfront)}</span>
            </div>
          </div>
        `;
      }

      const customerNameInput = document.getElementById('checkout-customer-name');
      const customerEmailInput = document.getElementById('checkout-customer-email');
      if (customerNameInput) customerNameInput.value = user.name;
      if (customerEmailInput) customerEmailInput.value = user.email;

      window.RentEquip.UI.openModal('checkout-modal');
    },

    submitBooking() {
      const user = window.RentEquip.Auth.getUser();
      const startDate = document.getElementById('calc-start-date').value;
      const endDate = document.getElementById('calc-end-date').value;
      const methodSelect = document.getElementById('checkout-payment-method');
      const notesInput = document.getElementById('checkout-notes');

      const paymentMethod = methodSelect ? methodSelect.value : 'Simulated UPI • GPay';

      const freshConflictCheck = window.RentEquip.Storage.isEquipmentAvailable(this.equipment.id, startDate, endDate);
      if (!freshConflictCheck.available) {
        window.RentEquip.UI.showToast(`Borrow Conflict: ${freshConflictCheck.reason}`, 'error');
        window.RentEquip.UI.closeModal('checkout-modal');
        this.recalculate();
        return;
      }

      const bookingData = {
        equipmentId: this.equipment.id,
        equipmentTitle: this.equipment.title,
        equipmentImage: this.equipment.image,
        category: this.equipment.category,
        customerId: user.id,
        customerName: user.name,
        customerEmail: user.email,
        customerCompany: user.company,
        ownerId: this.equipment.ownerId,
        ownerName: this.equipment.ownerName,
        startDate: startDate,
        endDate: endDate,
        rentalDays: this.quote.days,
        dailyRate: this.quote.dailyRate,
        rentalFee: this.quote.rentalFee,
        serviceFee: this.quote.serviceFee,
        securityDeposit: this.quote.securityDeposit,
        totalUpfrontPaid: this.quote.totalUpfront,
        notes: notesInput ? notesInput.value.trim() : '',
        paymentMethod: paymentMethod
      };

      const newBooking = window.RentEquip.Storage.createBooking(bookingData);

      window.RentEquip.UI.closeModal('checkout-modal');
      window.RentEquip.UI.showToast(`🎉 Borrow request #${newBooking.id} submitted! Awaiting ${this.equipment.ownerName}'s approval...`, 'success', 3000);

      setTimeout(() => {
        window.location.href = 'customer.html';
      }, 1200);
    }
  };

  window.RentEquip = window.RentEquip || {};
  window.RentEquip.Detail = Detail;

  document.addEventListener('DOMContentLoaded', () => {
    Detail.init();
  });
})(window);
