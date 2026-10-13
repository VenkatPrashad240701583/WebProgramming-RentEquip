/**
 * RentEquip - Student Lender & Club Portal Controller (owner.html)
 * Powers student inventory CRUD, borrow request approvals/rejections,
 * condition inspections, and security deposit settlements in ₹.
 */

(function (window) {
  'use strict';

  const OwnerPortal = {
    activeTab: 'inventory',
    selectedBookingId: null,
    editingEquipmentId: null,

    init() {
      this.bindEvents();
      this.render();

      window.addEventListener('rentequip:change', () => this.render());
      window.addEventListener('rentequip:auth_change', () => this.render());
    },

    bindEvents() {
      const tabGroup = document.getElementById('owner-tabs');
      if (tabGroup) {
        tabGroup.addEventListener('click', (e) => {
          const tabBtn = e.target.closest('.tab-btn');
          if (!tabBtn) return;
          this.activeTab = tabBtn.getAttribute('data-tab');
          tabGroup.querySelectorAll('.tab-btn').forEach(b => b.classList.remove('active'));
          tabBtn.classList.add('active');
          this.renderTabContent();
        });
      }

      const addBtn = document.getElementById('btn-add-equipment');
      if (addBtn) {
        addBtn.addEventListener('click', () => {
          this.openEquipmentModal();
        });
      }

      const eqForm = document.getElementById('equipment-form');
      if (eqForm) {
        eqForm.addEventListener('submit', (e) => {
          e.preventDefault();
          this.saveEquipmentForm();
        });
      }

      const rejectForm = document.getElementById('reject-form');
      if (rejectForm) {
        rejectForm.addEventListener('submit', (e) => {
          e.preventDefault();
          this.submitRejection();
        });
      }

      const inspectForm = document.getElementById('inspection-form');
      if (inspectForm) {
        inspectForm.addEventListener('submit', (e) => {
          e.preventDefault();
          this.submitInspection();
        });
      }

      const conditionButtons = document.querySelectorAll('.condition-btn');
      conditionButtons.forEach(btn => {
        btn.addEventListener('click', () => {
          conditionButtons.forEach(b => b.classList.remove('active'));
          btn.classList.add('active');
          const condition = btn.getAttribute('data-condition');
          document.getElementById('inspect-condition-val').value = condition;
          this.recalculateInspectionSettlement();
        });
      });

      const damageInput = document.getElementById('inspect-damage-fee');
      if (damageInput) {
        damageInput.addEventListener('input', () => {
          this.recalculateInspectionSettlement();
        });
      }
    },

    render() {
      this.renderHeaderSummary();
      this.renderKPICards();
      this.renderTabContent();
    },

    renderHeaderSummary() {
      const user = window.RentEquip.Auth.getUser();
      const userNameEl = document.getElementById('owner-user-name');
      const userAvatarEl = document.getElementById('owner-user-avatar');
      const userCompanyEl = document.getElementById('owner-user-company');

      if (userNameEl) userNameEl.textContent = user.name;
      if (userAvatarEl) {
        userAvatarEl.textContent = user.avatar;
        userAvatarEl.style.background = window.RentEquip.UI.getUserColor(user.role);
      }
      if (userCompanyEl) userCompanyEl.textContent = user.company || 'Student Lender & Club Host';

      const roleBanner = document.getElementById('owner-role-warning-banner');
      if (roleBanner) {
        if (user.role !== 'owner') {
          roleBanner.style.display = 'flex';
          roleBanner.innerHTML = `
            <div>
              <strong>Perspective Note:</strong> You are viewing as <em>${user.name} (${user.role.toUpperCase()})</em>. 
              To manage Priya Patel's inventory and rental approvals, <a href="#" id="switch-to-owner-link" style="text-decoration: underline; font-weight: 800; color: inherit;">click here to switch to Priya Patel's perspective</a>.
            </div>
          `;
          const switchLink = document.getElementById('switch-to-owner-link');
          if (switchLink) {
            switchLink.addEventListener('click', (e) => {
              e.preventDefault();
              window.RentEquip.Auth.switchUser('usr_priya');
            });
          }
        } else {
          roleBanner.style.display = 'none';
        }
      }
    },

    getOwnerEquipment() {
      const user = window.RentEquip.Auth.getUser();
      const all = window.RentEquip.Storage.getEquipment();
      if (user.role === 'admin') return all;
      return all.filter(e => e.ownerId === user.id);
    },

    getOwnerBookings() {
      const user = window.RentEquip.Auth.getUser();
      const all = window.RentEquip.Storage.getBookings();
      if (user.role === 'admin') return all;
      return all.filter(b => b.ownerId === user.id);
    },

    renderKPICards() {
      const eqList = this.getOwnerEquipment();
      const bookings = this.getOwnerBookings();
      const Calc = window.RentEquip.Calc;

      const activeRentals = bookings.filter(b => b.status === 'active').length;
      const pendingApprovals = bookings.filter(b => b.status === 'pending').length;
      const needsInspection = bookings.filter(b => b.status === 'returned').length;

      const totalEarnings = bookings
        .filter(b => ['active', 'returned', 'completed'].includes(b.status))
        .reduce((sum, b) => sum + b.rentalFee, 0);

      const kpiUnits = document.getElementById('kpi-owner-units');
      const kpiActive = document.getElementById('kpi-owner-active');
      const kpiPending = document.getElementById('kpi-owner-pending');
      const kpiEarnings = document.getElementById('kpi-owner-earnings');

      if (kpiUnits) kpiUnits.textContent = eqList.length;
      if (kpiActive) kpiActive.textContent = activeRentals;
      if (kpiPending) kpiPending.textContent = pendingApprovals;
      if (kpiEarnings) kpiEarnings.textContent = Calc.formatCurrency(totalEarnings);

      const inspectBadge = document.getElementById('tab-inspection-badge');
      if (inspectBadge) {
        if (needsInspection > 0) {
          inspectBadge.textContent = needsInspection;
          inspectBadge.style.display = 'inline-flex';
        } else {
          inspectBadge.style.display = 'none';
        }
      }
    },

    renderTabContent() {
      const inventoryPanel = document.getElementById('panel-inventory');
      const bookingsPanel = document.getElementById('panel-bookings');
      const inspectionsPanel = document.getElementById('panel-inspections');

      if (inventoryPanel) inventoryPanel.style.display = this.activeTab === 'inventory' ? 'block' : 'none';
      if (bookingsPanel) bookingsPanel.style.display = this.activeTab === 'bookings' ? 'block' : 'none';
      if (inspectionsPanel) inspectionsPanel.style.display = this.activeTab === 'inspections' ? 'block' : 'none';

      if (this.activeTab === 'inventory') {
        this.renderInventoryTable();
      } else if (this.activeTab === 'bookings') {
        this.renderBookingsTable();
      } else if (this.activeTab === 'inspections') {
        this.renderInspectionsTable();
      }
    },

    renderInventoryTable() {
      const tbody = document.getElementById('inventory-table-body');
      if (!tbody) return;

      const equipment = this.getOwnerEquipment();
      const Calc = window.RentEquip.Calc;

      tbody.innerHTML = equipment.map(item => `
        <tr id="eq-row-${item.id}">
          <td>
            <div class="table-item-cell">
              <div class="table-item-thumb">
                <img src="${item.image}" alt="${item.title}">
              </div>
              <div>
                <div class="table-item-title">${item.title}</div>
                <div class="table-item-sub">${item.category} • Pickup: ${item.location}</div>
              </div>
            </div>
          </td>
          <td>
            <div><strong>${Calc.formatCurrency(item.dailyRate)} / day</strong></div>
            <div class="table-item-sub">Deposit: ${Calc.formatCurrency(item.securityDeposit)}</div>
          </td>
          <td>
            <div>★ ${item.rating.toFixed(1)} <span class="text-xs text-muted font-bold">(${item.reviewCount || 0})</span></div>
          </td>
          <td>
            ${window.RentEquip.UI.getStatusBadge(item.status)}
          </td>
          <td>
            <div class="table-actions">
              <button class="btn btn-outline btn-sm btn-edit-equipment" data-id="${item.id}">Edit</button>
              <button class="btn btn-outline btn-sm btn-toggle-maintenance" data-id="${item.id}">
                ${item.status === 'maintenance' ? 'Set Available' : 'Under Check'}
              </button>
              <button class="btn btn-outline btn-sm btn-delete-equipment" data-id="${item.id}" style="color: var(--color-danger); border-color: rgba(220, 38, 38, 0.4);">
                Remove
              </button>
            </div>
          </td>
        </tr>
      `).join('');

      tbody.querySelectorAll('.btn-edit-equipment').forEach(btn => {
        btn.addEventListener('click', (e) => {
          const id = e.currentTarget.getAttribute('data-id');
          this.openEquipmentModal(id);
        });
      });

      tbody.querySelectorAll('.btn-toggle-maintenance').forEach(btn => {
        btn.addEventListener('click', (e) => {
          const id = e.currentTarget.getAttribute('data-id');
          const item = window.RentEquip.Storage.getEquipmentById(id);
          if (item) {
            item.status = item.status === 'maintenance' ? 'available' : 'maintenance';
            window.RentEquip.Storage.saveEquipment(item);
            window.RentEquip.UI.showToast(`Updated ${item.title} status to ${item.status}.`, 'info');
          }
        });
      });

      tbody.querySelectorAll('.btn-delete-equipment').forEach(btn => {
        btn.addEventListener('click', (e) => {
          const id = e.currentTarget.getAttribute('data-id');
          const item = window.RentEquip.Storage.getEquipmentById(id);
          if (confirm(`Remove ${item ? item.title : 'this item'} from your listings?`)) {
            window.RentEquip.Storage.deleteEquipment(id);
            window.RentEquip.UI.showToast('Item removed from inventory.', 'info');
          }
        });
      });
    },

    openEquipmentModal(equipmentId = null) {
      this.editingEquipmentId = equipmentId;
      const modal = document.getElementById('equipment-modal');
      const titleEl = document.getElementById('equipment-modal-title');
      const form = document.getElementById('equipment-form');

      if (!modal || !form) return;

      if (equipmentId) {
        const item = window.RentEquip.Storage.getEquipmentById(equipmentId);
        if (!item) return;
        titleEl.textContent = `Edit Listing: ${item.title}`;
        document.getElementById('eq-field-title').value = item.title;
        document.getElementById('eq-field-category').value = item.category;
        document.getElementById('eq-field-daily-rate').value = item.dailyRate;
        document.getElementById('eq-field-weekly-rate').value = item.weeklyRate || item.dailyRate * 4;
        document.getElementById('eq-field-deposit').value = item.securityDeposit;
        document.getElementById('eq-field-location').value = item.location;
        document.getElementById('eq-field-image').value = item.image;
        document.getElementById('eq-field-description').value = item.description;
        document.getElementById('eq-field-license').checked = !!item.requiresOperatorLicense;
        document.getElementById('eq-field-featured').checked = !!item.featured;
      } else {
        titleEl.textContent = 'List New Campus Equipment / Supply';
        form.reset();
        document.getElementById('eq-field-daily-rate').value = '20';
        document.getElementById('eq-field-weekly-rate').value = '70';
        document.getElementById('eq-field-deposit').value = '50';
        document.getElementById('eq-field-image').value = 'assets/images/stationery.svg';
        document.getElementById('eq-field-location').value = 'Kaveri Boys Hostel - Common Room';
      }

      window.RentEquip.UI.openModal('equipment-modal');
    },

    saveEquipmentForm() {
      const user = window.RentEquip.Auth.getUser();
      const title = document.getElementById('eq-field-title').value.trim();
      const category = document.getElementById('eq-field-category').value;
      const dailyRate = Number(document.getElementById('eq-field-daily-rate').value) || 10;
      const weeklyRate = Number(document.getElementById('eq-field-weekly-rate').value) || dailyRate * 4;
      const securityDeposit = Number(document.getElementById('eq-field-deposit').value) || 50;
      const location = document.getElementById('eq-field-location').value.trim();
      const image = document.getElementById('eq-field-image').value;
      const description = document.getElementById('eq-field-description').value.trim();
      const requiresOperatorLicense = document.getElementById('eq-field-license').checked;
      const featured = document.getElementById('eq-field-featured').checked;

      const equipmentData = {
        title,
        category,
        dailyRate,
        weeklyRate,
        securityDeposit,
        replacementValue: securityDeposit * 3,
        location,
        image,
        description,
        requiresOperatorLicense,
        featured,
        condition: 'Pristine / Like New',
        ownerId: user.id,
        ownerName: user.name,
        ownerRating: user.rating || 4.9,
        specs: [
          { label: 'Condition', value: 'Pristine / Like New' },
          { label: 'Pickup Point', value: location }
        ],
        features: [
          'Pre-Checked & Cleaned',
          'Academic Tested Quality',
          'Peer Borrow Guarantee'
        ]
      };

      if (this.editingEquipmentId) {
        equipmentData.id = this.editingEquipmentId;
        window.RentEquip.Storage.saveEquipment(equipmentData);
        window.RentEquip.UI.showToast(`Updated item: ${title}`, 'success');
      } else {
        const created = window.RentEquip.Storage.saveEquipment(equipmentData);
        window.RentEquip.UI.showToast(`New item listed: ${created.title}`, 'success');
      }

      window.RentEquip.UI.closeModal('equipment-modal');
      this.editingEquipmentId = null;
    },

    renderBookingsTable() {
      const tbody = document.getElementById('owner-bookings-tbody');
      if (!tbody) return;

      const bookings = this.getOwnerBookings();
      const Calc = window.RentEquip.Calc;
      const today = Calc.getTodayISO();

      tbody.innerHTML = bookings.map(b => {
        const isOverdue = b.status === 'active' && b.endDate < today;
        const statusBadge = window.RentEquip.UI.getStatusBadge(b.status, isOverdue);

        return `
          <tr id="owner-bk-row-${b.id}">
            <td>
              <div class="table-item-cell">
                <div class="table-item-thumb">
                  <img src="${b.equipmentImage}" alt="${b.equipmentTitle}">
                </div>
                <div>
                  <div class="table-item-title">${b.equipmentTitle}</div>
                  <div class="table-item-sub">Ref: ${b.id}</div>
                </div>
              </div>
            </td>
            <td>
              <div><strong>${b.customerName}</strong></div>
              <div class="table-item-sub">${b.customerCompany || 'Student'}</div>
            </td>
            <td>
              <div><strong>${Calc.formatDate(b.startDate)}</strong> to <strong>${Calc.formatDate(b.endDate)}</strong></div>
              <div class="table-item-sub">${b.rentalDays} days • Fee: ${Calc.formatCurrency(b.rentalFee)}</div>
            </td>
            <td>
              ${statusBadge}
            </td>
            <td>
              <div class="table-actions">
                ${this.renderOwnerActionButtons(b)}
              </div>
            </td>
          </tr>
        `;
      }).join('');

      this.bindOwnerBookingActionListeners();
    },

    renderOwnerActionButtons(b) {
      if (b.status === 'pending') {
        return `
          <button class="btn btn-success btn-sm btn-approve-booking" data-id="${b.id}">
            Approve
          </button>
          <button class="btn btn-danger btn-sm btn-reject-booking" data-id="${b.id}">
            Decline
          </button>
        `;
      }
      if (b.status === 'returned') {
        return `
          <button class="btn btn-primary btn-sm btn-open-inspection" data-id="${b.id}">
            Check &amp; Settle Deposit
          </button>
        `;
      }
      if (b.status === 'active') {
        return `
          <span class="badge badge-active">With Student</span>
        `;
      }
      if (b.status === 'approved') {
        return `
          <span class="badge badge-approved">Ready for Pickup</span>
        `;
      }
      if (b.status === 'completed') {
        return `
          <span class="badge badge-completed">Settled &amp; Returned</span>
        `;
      }
      if (b.status === 'rejected') {
        return `
          <span class="badge badge-rejected">Declined</span>
        `;
      }
      return '';
    },

    bindOwnerBookingActionListeners() {
      const tbody = document.getElementById('owner-bookings-tbody');
      if (!tbody) return;

      tbody.querySelectorAll('.btn-approve-booking').forEach(btn => {
        btn.addEventListener('click', (e) => {
          const id = e.currentTarget.getAttribute('data-id');
          window.RentEquip.Storage.transitionBookingStatus(id, 'approved');
          window.RentEquip.UI.showToast(`Request #${id} approved! Student notified for pickup.`, 'success');
        });
      });

      tbody.querySelectorAll('.btn-reject-booking').forEach(btn => {
        btn.addEventListener('click', (e) => {
          const id = e.currentTarget.getAttribute('data-id');
          this.openRejectModal(id);
        });
      });

      tbody.querySelectorAll('.btn-open-inspection').forEach(btn => {
        btn.addEventListener('click', (e) => {
          const id = e.currentTarget.getAttribute('data-id');
          this.openInspectionModal(id);
        });
      });
    },

    openRejectModal(bookingId) {
      this.selectedBookingId = bookingId;
      const b = window.RentEquip.Storage.getBookingById(bookingId);
      const title = document.getElementById('reject-modal-title');
      if (title && b) title.textContent = `Decline Request: ${b.equipmentTitle}`;
      window.RentEquip.UI.openModal('reject-modal');
    },

    submitRejection() {
      if (!this.selectedBookingId) return;
      const reasonInput = document.getElementById('reject-reason-input');
      const reason = reasonInput ? reasonInput.value.trim() : 'Item currently in personal use for exam';

      window.RentEquip.Storage.transitionBookingStatus(this.selectedBookingId, 'rejected', { reason });
      window.RentEquip.UI.closeModal('reject-modal');
      window.RentEquip.UI.showToast(`Request #${this.selectedBookingId} declined. Student issued full simulated refund.`, 'info');
      this.selectedBookingId = null;
    },

    renderInspectionsTable() {
      const tbody = document.getElementById('inspections-tbody');
      const emptyState = document.getElementById('inspections-empty-state');
      if (!tbody) return;

      const bookings = this.getOwnerBookings();
      const needsInspect = bookings.filter(b => b.status === 'returned');
      const recentlyCompleted = bookings.filter(b => b.status === 'completed').slice(0, 5);

      const combined = [...needsInspect, ...recentlyCompleted];

      if (combined.length === 0) {
        tbody.innerHTML = '';
        if (emptyState) emptyState.style.display = 'flex';
        return;
      }

      if (emptyState) emptyState.style.display = 'none';

      const Calc = window.RentEquip.Calc;

      tbody.innerHTML = combined.map(b => {
        const isNeedsInspect = b.status === 'returned';

        return `
          <tr>
            <td>
              <div class="table-item-cell">
                <div class="table-item-thumb">
                  <img src="${b.equipmentImage}" alt="${b.equipmentTitle}">
                </div>
                <div>
                  <div class="table-item-title">${b.equipmentTitle}</div>
                  <div class="table-item-sub">Ref: ${b.id} • Renter: ${b.customerName}</div>
                </div>
              </div>
            </td>
            <td>
              <div>Returned: <strong>${Calc.formatDate(b.actualReturnDate || b.endDate)}</strong></div>
              <div class="table-item-sub">Scheduled: ${Calc.formatDate(b.endDate)}</div>
            </td>
            <td>
              <div>Deposit: <strong>${Calc.formatCurrency(b.securityDeposit)}</strong></div>
              ${b.inspection ? `<div class="table-item-sub" style="color: var(--color-success); font-weight: 700;">Refunded: ${Calc.formatCurrency(b.inspection.depositRefunded)}</div>` : ''}
            </td>
            <td>
              ${isNeedsInspect 
                ? '<span class="badge badge-returned"><span class="badge-dot"></span> Return Check Pending</span>' 
                : '<span class="badge badge-completed">Checked &amp; Refunded</span>'
              }
            </td>
            <td>
              ${isNeedsInspect ? `
                <button class="btn btn-primary btn-sm btn-open-inspection" data-id="${b.id}">
                  Check &amp; Settle Refund
                </button>
              ` : `
                <button class="btn btn-outline btn-sm btn-view-inspection-report" data-id="${b.id}">
                  View Report
                </button>
              `}
            </td>
          </tr>
        `;
      }).join('');

      tbody.querySelectorAll('.btn-open-inspection').forEach(btn => {
        btn.addEventListener('click', (e) => {
          const id = e.currentTarget.getAttribute('data-id');
          this.openInspectionModal(id);
        });
      });

      tbody.querySelectorAll('.btn-view-inspection-report').forEach(btn => {
        btn.addEventListener('click', (e) => {
          const id = e.currentTarget.getAttribute('data-id');
          this.openInspectionReportModal(id);
        });
      });
    },

    openInspectionModal(bookingId) {
      const b = window.RentEquip.Storage.getBookingById(bookingId);
      if (!b) return;

      this.selectedBookingId = bookingId;
      const Calc = window.RentEquip.Calc;

      const modalTitle = document.getElementById('inspection-modal-title');
      const unitSummary = document.getElementById('inspection-unit-summary');

      if (modalTitle) modalTitle.textContent = `Return Inspection: ${b.equipmentTitle}`;

      document.getElementById('inspect-damage-fee').value = '0';
      document.getElementById('inspect-condition-val').value = 'pristine';
      document.querySelectorAll('.condition-btn').forEach(btn => {
        btn.classList.toggle('active', btn.getAttribute('data-condition') === 'pristine');
      });
      document.getElementById('inspect-notes').value = 'Clean return, complete set, fully working order.';

      const actualReturn = b.actualReturnDate || Calc.getTodayISO();
      const overdueDays = Calc.calculateOverdueDays(b.endDate, actualReturn);
      const lateFee = Calc.calculateLatePenalty(b.dailyRate, overdueDays);

      if (unitSummary) {
        unitSummary.innerHTML = `
          <div class="inspection-dates-row">
            <span>Scheduled Return Date:</span>
            <strong>${Calc.formatDate(b.endDate)}</strong>
          </div>
          <div class="inspection-dates-row">
            <span>Actual Handover Date:</span>
            <strong>${Calc.formatDate(actualReturn)}</strong>
          </div>
          <div class="inspection-dates-row">
            <span>Security Deposit on Hold:</span>
            <strong style="color: var(--color-success);">${Calc.formatCurrency(b.securityDeposit)}</strong>
          </div>
          ${overdueDays > 0 ? `
            <div class="overdue-warning-banner" style="margin-top: 0.75rem;">
              ⚠️ <strong>Late Return Detected:</strong> Item was returned ${overdueDays} days late. Standard student late fee (1.25x daily rate = ${Calc.formatCurrency(lateFee)}) will be deducted.
            </div>
          ` : `
            <div style="font-size: 0.85rem; color: var(--color-success); margin-top: 0.5rem; font-weight: 700;">
              ✓ Returned on time! Zero late penalty.
            </div>
          `}
        `;
      }

      this.recalculateInspectionSettlement();
      window.RentEquip.UI.openModal('inspection-modal');
    },

    recalculateInspectionSettlement() {
      if (!this.selectedBookingId) return;
      const b = window.RentEquip.Storage.getBookingById(this.selectedBookingId);
      if (!b) return;

      const Calc = window.RentEquip.Calc;
      const damageFee = Number(document.getElementById('inspect-damage-fee').value) || 0;
      const actualReturn = b.actualReturnDate || Calc.getTodayISO();

      const settlement = Calc.calculateSettlement({
        securityDeposit: b.securityDeposit,
        dailyRate: b.dailyRate,
        scheduledEndDate: b.endDate,
        actualReturnDate: actualReturn,
        damageDeduction: damageFee
      });

      const previewBox = document.getElementById('settlement-preview-box');
      if (previewBox) {
        previewBox.innerHTML = `
          <div class="settlement-row">
            <span>Escrow Deposit:</span>
            <strong>${Calc.formatCurrency(settlement.originalDeposit)}</strong>
          </div>
          <div class="settlement-row">
            <span>Late Penalty (${settlement.lateDays} days late):</span>
            <span style="color: ${settlement.latePenaltyFee > 0 ? '#dc2626' : 'inherit'}; font-weight: 700;">
              - ${Calc.formatCurrency(settlement.latePenaltyFee)}
            </span>
          </div>
          <div class="settlement-row">
            <span>Damage / Missing Item Deductions:</span>
            <span style="color: ${settlement.damageFee > 0 ? '#dc2626' : 'inherit'}; font-weight: 700;">
              - ${Calc.formatCurrency(settlement.damageFee)}
            </span>
          </div>
          <div class="settlement-row total-refund">
            <span>Net Deposit Refund to Student:</span>
            <span class="settlement-amount">${Calc.formatCurrency(settlement.depositRefund)}</span>
          </div>
          ${settlement.additionalAmountOwed > 0 ? `
            <div style="margin-top: 0.5rem; font-size: 0.82rem; color: #dc2626; font-weight: 700;">
              ⚠️ Deductions exceed security deposit! Balance due: ${Calc.formatCurrency(settlement.additionalAmountOwed)}
            </div>
          ` : ''}
        `;
      }
    },

    submitInspection() {
      if (!this.selectedBookingId) return;
      const b = window.RentEquip.Storage.getBookingById(this.selectedBookingId);
      if (!b) return;

      const user = window.RentEquip.Auth.getUser();
      const Calc = window.RentEquip.Calc;

      const condition = document.getElementById('inspect-condition-val').value;
      const damageFee = Number(document.getElementById('inspect-damage-fee').value) || 0;
      const notes = document.getElementById('inspect-notes').value.trim();
      const actualReturn = b.actualReturnDate || Calc.getTodayISO();

      const settlement = Calc.calculateSettlement({
        securityDeposit: b.securityDeposit,
        dailyRate: b.dailyRate,
        scheduledEndDate: b.endDate,
        actualReturnDate: actualReturn,
        damageDeduction: damageFee
      });

      window.RentEquip.Storage.transitionBookingStatus(this.selectedBookingId, 'completed', {
        condition,
        damageFee: settlement.damageFee,
        damageNotes: notes,
        lateDays: settlement.lateDays,
        latePenaltyFee: settlement.latePenaltyFee,
        depositRefunded: settlement.depositRefund,
        inspectedBy: user.name
      });

      window.RentEquip.UI.closeModal('inspection-modal');
      window.RentEquip.UI.showToast(`Inspection finalized! Deposit refund of ${Calc.formatCurrency(settlement.depositRefund)} released to ${b.customerName}.`, 'success');

      this.selectedBookingId = null;
      this.render();
    },

    openInspectionReportModal(bookingId) {
      const b = window.RentEquip.Storage.getBookingById(bookingId);
      if (!b || !b.inspection) return;

      const Calc = window.RentEquip.Calc;
      alert(`Return Report for ${b.equipmentTitle} (#${b.id}):\n\nCondition: ${b.inspection.condition.toUpperCase()}\nLate Penalty: ${Calc.formatCurrency(b.inspection.latePenaltyFee)} (${b.inspection.lateDays} days)\nDamage Deductions: ${Calc.formatCurrency(b.inspection.damageFee)}\nDeposit Refunded: ${Calc.formatCurrency(b.inspection.depositRefunded)}\n\nNotes: "${b.inspection.damageNotes}"\nChecked by: ${b.inspection.inspectedBy}`);
    }
  };

  window.RentEquip = window.RentEquip || {};
  window.RentEquip.OwnerPortal = OwnerPortal;

  document.addEventListener('DOMContentLoaded', () => {
    OwnerPortal.init();
  });
})(window);
