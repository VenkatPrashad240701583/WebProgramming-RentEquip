/**
 * RentEquip - Administrator Operations Portal Controller (admin.html)
 * Powers platform analytics, user registry management, global equipment audits,
 * system-wide booking overrides, and data export/import/reset tools.
 */

(function (window) {
  'use strict';

  const AdminPortal = {
    activeTab: 'overview',

    init() {
      this.bindEvents();
      this.render();

      window.addEventListener('rentequip:change', () => this.render());
      window.addEventListener('rentequip:auth_change', () => this.render());
    },

    bindEvents() {
      // Tab switching
      const tabGroup = document.getElementById('admin-tabs');
      if (tabGroup) {
        tabGroup.addEventListener('click', (e) => {
          const tabBtn = e.target.closest('.tab-btn');
          if (!tabBtn) return;
          this.activeTab = tabBtn.getAttribute('data-tab');
          tabGroup.querySelectorAll('.tab-btn').forEach(b => b.classList.remove('active'));
          tabBtn.classList.add('active');
          this.renderTabPanels();
        });
      }

      // Reset data button
      const resetBtn = document.getElementById('btn-admin-reset-data');
      if (resetBtn) {
        resetBtn.addEventListener('click', () => {
          if (confirm('CAUTION: Reset entire RentEquip platform data to seed defaults? All custom bookings, equipment, and notifications will be restored.')) {
            window.RentEquip.Storage.resetToDefaults();
            window.RentEquip.UI.showToast('Platform data reset to factory seed defaults.', 'success');
            setTimeout(() => window.location.reload(), 400);
          }
        });
      }

      // Export JSON backup
      const exportBtn = document.getElementById('btn-export-json');
      if (exportBtn) {
        exportBtn.addEventListener('click', () => {
          this.exportDatabaseJSON();
        });
      }

      // Import JSON backup
      const importBtn = document.getElementById('btn-import-json');
      const fileInput = document.getElementById('import-file-input');
      if (importBtn && fileInput) {
        importBtn.addEventListener('click', () => fileInput.click());
        fileInput.addEventListener('change', (e) => {
          const file = e.target.files[0];
          if (file) this.importDatabaseJSON(file);
        });
      }
    },

    render() {
      this.renderHeaderSummary();
      this.renderKPIs();
      this.renderTabPanels();
    },

    renderHeaderSummary() {
      const user = window.RentEquip.Auth.getUser();
      const nameEl = document.getElementById('admin-user-name');
      const avatarEl = document.getElementById('admin-user-avatar');
      const companyEl = document.getElementById('admin-user-company');

      if (nameEl) nameEl.textContent = user.name;
      if (avatarEl) {
        avatarEl.textContent = user.avatar;
        avatarEl.style.background = window.RentEquip.UI.getUserColor(user.role);
      }
      if (companyEl) companyEl.textContent = user.company || 'Platform Trust & Safety';

      const roleBanner = document.getElementById('admin-role-warning-banner');
      if (roleBanner) {
        if (user.role !== 'admin') {
          roleBanner.style.display = 'flex';
          roleBanner.innerHTML = `
            <div>
              <strong>Perspective Note:</strong> You are currently viewing as <em>${user.name} (${user.role.toUpperCase()})</em>. 
              To access Elena Rostova's full marketplace administration rights, <a href="#" id="switch-to-admin-link" style="text-decoration: underline; font-weight: 700; color: inherit;">click here to switch to Admin perspective</a>.
            </div>
          `;
          const switchLink = document.getElementById('switch-to-admin-link');
          if (switchLink) {
            switchLink.addEventListener('click', (e) => {
              e.preventDefault();
              window.RentEquip.Auth.switchUser('usr_elena');
            });
          }
        } else {
          roleBanner.style.display = 'none';
        }
      }
    },

    renderKPIs() {
      const equipment = window.RentEquip.Storage.getEquipment();
      const bookings = window.RentEquip.Storage.getBookings();
      const users = window.RentEquip.Storage.getUsers();
      const Calc = window.RentEquip.Calc;
      const today = Calc.getTodayISO();

      const totalVolume = bookings
        .filter(b => !['cancelled', 'rejected'].includes(b.status))
        .reduce((sum, b) => sum + b.totalUpfrontPaid, 0);

      const ongoingRentals = bookings.filter(b => ['active', 'approved'].includes(b.status)).length;
      
      const escrowDeposits = bookings
        .filter(b => ['active', 'approved', 'returned'].includes(b.status))
        .reduce((sum, b) => sum + b.securityDeposit, 0);

      const overdueCount = bookings.filter(b => b.status === 'active' && b.endDate < today).length;

      const kpiVol = document.getElementById('kpi-admin-volume');
      const kpiEquipment = document.getElementById('kpi-admin-equipment');
      const kpiRentals = document.getElementById('kpi-admin-rentals');
      const kpiUsers = document.getElementById('kpi-admin-users');
      const kpiEscrow = document.getElementById('kpi-admin-escrow');
      const kpiOverdue = document.getElementById('kpi-admin-overdue');

      if (kpiVol) kpiVol.textContent = Calc.formatCurrency(totalVolume);
      if (kpiEquipment) kpiEquipment.textContent = equipment.length;
      if (kpiRentals) kpiRentals.textContent = ongoingRentals;
      if (kpiUsers) kpiUsers.textContent = users.length;
      if (kpiEscrow) kpiEscrow.textContent = Calc.formatCurrency(escrowDeposits);
      if (kpiOverdue) kpiOverdue.textContent = overdueCount;
    },

    renderTabPanels() {
      const panels = ['overview', 'users', 'equipment', 'rentals', 'maintenance'];
      panels.forEach(p => {
        const el = document.getElementById(`panel-${p}`);
        if (el) el.style.display = this.activeTab === p ? 'block' : 'none';
      });

      if (this.activeTab === 'overview') this.renderOverviewCharts();
      if (this.activeTab === 'users') this.renderUsersTable();
      if (this.activeTab === 'equipment') this.renderEquipmentTable();
      if (this.activeTab === 'rentals') this.renderRentalsAuditTable();
    },

    // -------------------------------------------------------------
    // OVERVIEW & METRICS
    // -------------------------------------------------------------
    renderOverviewCharts() {
      const equipment = window.RentEquip.Storage.getEquipment();
      const bookings = window.RentEquip.Storage.getBookings();
      const Calc = window.RentEquip.Calc;

      // Category breakdown
      const catCount = {};
      equipment.forEach(e => {
        catCount[e.category] = (catCount[e.category] || 0) + 1;
      });

      const catContainer = document.getElementById('admin-category-breakdown');
      if (catContainer) {
        catContainer.innerHTML = Object.entries(catCount).map(([cat, count]) => {
          const pct = Math.round((count / equipment.length) * 100);
          return `
            <div style="margin-bottom: 0.85rem;">
              <div style="display: flex; justify-content: space-between; font-size: 0.85rem; margin-bottom: 0.25rem;">
                <span>${cat}</span>
                <strong>${count} units (${pct}%)</strong>
              </div>
              <div style="height: 6px; background: var(--color-surface-raised); border-radius: 3px; overflow: hidden;">
                <div style="width: ${pct}%; height: 100%; background: var(--color-primary); border-radius: 3px;"></div>
              </div>
            </div>
          `;
        }).join('');
      }

      // Top booked equipment
      const topContainer = document.getElementById('admin-top-equipment');
      if (topContainer) {
        const bookedCounts = {};
        bookings.forEach(b => {
          bookedCounts[b.equipmentTitle] = (bookedCounts[b.equipmentTitle] || 0) + 1;
        });

        const sorted = Object.entries(bookedCounts).sort((a, b) => b[1] - a[1]).slice(0, 5);

        topContainer.innerHTML = sorted.map(([title, cnt]) => `
          <div style="display: flex; align-items: center; justify-content: space-between; padding: 0.75rem 0; border-bottom: 1px solid var(--color-border); font-size: 0.88rem;">
            <div>
              <strong>${title}</strong>
            </div>
            <span class="badge badge-primary" style="background: rgba(245, 158, 11, 0.15); color: #fbbf24;">
              ${cnt} ${cnt === 1 ? 'booking' : 'bookings'}
            </span>
          </div>
        `).join('');
      }
    },

    // -------------------------------------------------------------
    // USERS REGISTRY
    // -------------------------------------------------------------
    renderUsersTable() {
      const tbody = document.getElementById('admin-users-tbody');
      if (!tbody) return;

      const users = window.RentEquip.Storage.getUsers();
      const activeUser = window.RentEquip.Auth.getUser();

      tbody.innerHTML = users.map(u => `
        <tr>
          <td>
            <div class="table-item-cell">
              <div class="role-avatar-circle" style="background: ${window.RentEquip.UI.getUserColor(u.role)}; width: 34px; height: 34px; font-size: 0.85rem;">
                ${u.avatar}
              </div>
              <div>
                <div class="table-item-title">${u.name} ${u.id === activeUser.id ? '<span class="badge badge-success" style="font-size: 0.65rem;">Active</span>' : ''}</div>
                <div class="table-item-sub">${u.email} • ID: ${u.id}</div>
              </div>
            </div>
          </td>
          <td>
            <span class="badge badge-${u.role}">${u.role.toUpperCase()}</span>
          </td>
          <td>
            <div>${u.company || 'Individual User'}</div>
            <div class="table-item-sub">${u.phone || 'N/A'}</div>
          </td>
          <td>
            <div>★ ${u.rating ? u.rating.toFixed(2) : '5.0'}</div>
            <div class="table-item-sub">Joined: ${u.joinedDate || '2025'}</div>
          </td>
          <td>
            <button class="btn btn-outline btn-sm btn-switch-user" data-id="${u.id}">
              Simulate Login
            </button>
          </td>
        </tr>
      `).join('');

      tbody.querySelectorAll('.btn-switch-user').forEach(btn => {
        btn.addEventListener('click', (e) => {
          const id = e.currentTarget.getAttribute('data-id');
          window.RentEquip.Auth.switchUser(id);
          this.render();
        });
      });
    },

    // -------------------------------------------------------------
    // EQUIPMENT GLOBAL AUDIT
    // -------------------------------------------------------------
    renderEquipmentTable() {
      const tbody = document.getElementById('admin-equipment-tbody');
      if (!tbody) return;

      const equipment = window.RentEquip.Storage.getEquipment();
      const Calc = window.RentEquip.Calc;

      tbody.innerHTML = equipment.map(item => `
        <tr>
          <td>
            <div class="table-item-cell">
              <div class="table-item-thumb">
                <img src="${item.image}" alt="${item.title}">
              </div>
              <div>
                <div class="table-item-title">${item.title}</div>
                <div class="table-item-sub">ID: ${item.id} • ${item.category}</div>
              </div>
            </div>
          </td>
          <td>
            <div>${item.ownerName}</div>
            <div class="table-item-sub">Host ID: ${item.ownerId}</div>
          </td>
          <td>
            <div><strong>${Calc.formatCurrency(item.dailyRate)} / day</strong></div>
            <div class="table-item-sub">Deposit: ${Calc.formatCurrency(item.securityDeposit)}</div>
          </td>
          <td>
            ${window.RentEquip.UI.getStatusBadge(item.status)}
          </td>
          <td>
            <div class="table-actions">
              <a href="equipment.html?id=${item.id}" class="btn btn-outline btn-sm">Inspect</a>
              <button class="btn btn-outline btn-sm btn-admin-toggle-status" data-id="${item.id}">
                ${item.status === 'maintenance' ? 'Set Available' : 'Maintenance'}
              </button>
              <button class="btn btn-outline btn-sm btn-admin-delete-eq" data-id="${item.id}" style="color: var(--color-danger); border-color: rgba(239, 68, 68, 0.4);">
                Remove
              </button>
            </div>
          </td>
        </tr>
      `).join('');

      tbody.querySelectorAll('.btn-admin-toggle-status').forEach(btn => {
        btn.addEventListener('click', (e) => {
          const id = e.currentTarget.getAttribute('data-id');
          const item = window.RentEquip.Storage.getEquipmentById(id);
          if (item) {
            item.status = item.status === 'maintenance' ? 'available' : 'maintenance';
            window.RentEquip.Storage.saveEquipment(item);
            window.RentEquip.UI.showToast(`Admin updated ${item.title} to ${item.status}.`, 'info');
          }
        });
      });

      tbody.querySelectorAll('.btn-admin-delete-eq').forEach(btn => {
        btn.addEventListener('click', (e) => {
          const id = e.currentTarget.getAttribute('data-id');
          if (confirm('Admin Override: Delete this listing from the marketplace?')) {
            window.RentEquip.Storage.deleteEquipment(id);
            window.RentEquip.UI.showToast('Listing removed by administrator.', 'info');
          }
        });
      });
    },

    // -------------------------------------------------------------
    // RENTALS GLOBAL AUDIT & OVERRIDES
    // -------------------------------------------------------------
    renderRentalsAuditTable() {
      const tbody = document.getElementById('admin-rentals-tbody');
      if (!tbody) return;

      const bookings = window.RentEquip.Storage.getBookings();
      const Calc = window.RentEquip.Calc;
      const today = Calc.getTodayISO();

      tbody.innerHTML = bookings.map(b => {
        const isOverdue = b.status === 'active' && b.endDate < today;
        const statusBadge = window.RentEquip.UI.getStatusBadge(b.status, isOverdue);

        return `
          <tr>
            <td>
              <div><strong>${b.id}</strong></div>
              <div class="table-item-sub">${b.equipmentTitle}</div>
            </td>
            <td>
              <div>${b.customerName} &rarr; ${b.ownerName}</div>
              <div class="table-item-sub">${b.customerEmail}</div>
            </td>
            <td>
              <div>${Calc.formatDate(b.startDate)} to ${Calc.formatDate(b.endDate)}</div>
              <div class="table-item-sub">${b.rentalDays} days (${Calc.formatCurrency(b.totalUpfrontPaid)})</div>
            </td>
            <td>
              ${statusBadge}
            </td>
            <td>
              <div>${b.payment ? b.payment.rentalPaymentStatus : 'N/A'}</div>
              <div class="table-item-sub">Deposit: ${b.payment ? b.payment.depositStatus : 'N/A'}</div>
            </td>
            <td>
              <div class="table-actions">
                <select class="form-select admin-override-select" data-id="${b.id}" style="padding: 0.3rem 0.5rem; font-size: 0.78rem; width: auto;">
                  <option value="" disabled selected>Override...</option>
                  <option value="approved">Force Approve</option>
                  <option value="active">Force Active</option>
                  <option value="returned">Force Returned</option>
                  <option value="completed">Force Complete</option>
                  <option value="cancelled">Force Cancel</option>
                </select>
              </div>
            </td>
          </tr>
        `;
      }).join('');

      tbody.querySelectorAll('.admin-override-select').forEach(select => {
        select.addEventListener('change', (e) => {
          const id = e.target.getAttribute('data-id');
          const newStatus = e.target.value;
          if (confirm(`Admin Override: Force transition booking #${id} to status "${newStatus}"?`)) {
            window.RentEquip.Storage.transitionBookingStatus(id, newStatus, {
              reason: 'Admin Override Enforcement',
              condition: 'pristine',
              damageFee: 0,
              depositRefunded: window.RentEquip.Storage.getBookingById(id).securityDeposit
            });
            window.RentEquip.UI.showToast(`Admin override applied: #${id} is now ${newStatus}.`, 'success');
          }
        });
      });
    },

    // -------------------------------------------------------------
    // DATA EXPORT / IMPORT
    // -------------------------------------------------------------
    exportDatabaseJSON() {
      const data = {
        exportedAt: new Date().toISOString(),
        users: window.RentEquip.Storage.getUsers(),
        equipment: window.RentEquip.Storage.getEquipment(),
        bookings: window.RentEquip.Storage.getBookings(),
        reviews: window.RentEquip.Storage.getReviews(),
        notifications: window.RentEquip.Storage.getNotifications()
      };

      const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `rentequip_backup_${window.RentEquip.Calc.getTodayISO()}.json`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
      window.RentEquip.UI.showToast('Backup JSON exported successfully.', 'success');
    },

    importDatabaseJSON(file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        try {
          const parsed = JSON.parse(e.target.result);
          if (parsed.equipment && parsed.bookings) {
            localStorage.setItem('rentequip_equipment_v2', JSON.stringify(parsed.equipment));
            localStorage.setItem('rentequip_bookings_v2', JSON.stringify(parsed.bookings));
            if (parsed.users) localStorage.setItem('rentequip_users_v2', JSON.stringify(parsed.users));
            if (parsed.reviews) localStorage.setItem('rentequip_reviews_v2', JSON.stringify(parsed.reviews));
            if (parsed.notifications) localStorage.setItem('rentequip_notifications_v2', JSON.stringify(parsed.notifications));
            window.RentEquip.UI.showToast('Database backup successfully restored!', 'success');
            setTimeout(() => window.location.reload(), 400);
          } else {
            window.RentEquip.UI.showToast('Invalid backup file format.', 'error');
          }
        } catch (err) {
          window.RentEquip.UI.showToast('Failed to parse JSON backup file.', 'error');
        }
      };
      reader.readAsText(file);
    }
  };

  window.RentEquip = window.RentEquip || {};
  window.RentEquip.AdminPortal = AdminPortal;

  document.addEventListener('DOMContentLoaded', () => {
    AdminPortal.init();
  });
})(window);
