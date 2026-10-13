/**
 * RentEquip - Student Affairs Council (SAC) Admin Portal Controller (admin.html)
 * Powers campus sharing metrics, student registry, campus-wide equipment audit,
 * booking overrides, and JSON backup/restore tools.
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

      const resetBtn = document.getElementById('btn-admin-reset-data');
      if (resetBtn) {
        resetBtn.addEventListener('click', () => {
          if (confirm('CAUTION: Reset RentEquip to the 50+ campus seed listings? All test borrows and custom items will be restored to seed defaults.')) {
            window.RentEquip.Storage.resetToDefaults();
            window.RentEquip.UI.showToast('Campus data restored to default 50+ student supplies.', 'success');
            setTimeout(() => window.location.reload(), 400);
          }
        });
      }

      const exportBtn = document.getElementById('btn-export-json');
      if (exportBtn) {
        exportBtn.addEventListener('click', () => {
          this.exportDatabaseJSON();
        });
      }

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
      if (companyEl) companyEl.textContent = user.company || 'Student Affairs Council & Equipment Library';

      const roleBanner = document.getElementById('admin-role-warning-banner');
      if (roleBanner) {
        if (user.role !== 'admin') {
          roleBanner.style.display = 'flex';
          roleBanner.innerHTML = `
            <div>
              <strong>Perspective Note:</strong> You are viewing as <em>${user.name} (${user.role.toUpperCase()})</em>. 
              To access Student Affairs Council oversight, <a href="#" id="switch-to-admin-link" style="text-decoration: underline; font-weight: 800; color: inherit;">click here to switch to SAC Council perspective</a>.
            </div>
          `;
          const switchLink = document.getElementById('switch-to-admin-link');
          if (switchLink) {
            switchLink.addEventListener('click', (e) => {
              e.preventDefault();
              window.RentEquip.Auth.switchUser('usr_council');
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

    renderOverviewCharts() {
      const equipment = window.RentEquip.Storage.getEquipment();
      const bookings = window.RentEquip.Storage.getBookings();

      const catCount = {};
      equipment.forEach(e => {
        catCount[e.category] = (catCount[e.category] || 0) + 1;
      });

      const catContainer = document.getElementById('admin-category-breakdown');
      if (catContainer) {
        catContainer.innerHTML = Object.entries(catCount).map(([cat, count]) => {
          const pct = Math.round((count / equipment.length) * 100);
          return `
            <div style="margin-bottom: 0.95rem;">
              <div style="display: flex; justify-content: space-between; font-size: 0.88rem; margin-bottom: 0.3rem;">
                <span style="font-weight: 700;">${cat}</span>
                <strong style="color: var(--color-primary);">${count} items (${pct}%)</strong>
              </div>
              <div style="height: 8px; background: var(--color-surface-raised); border-radius: 4px; overflow: hidden; border: 1px solid var(--color-border);">
                <div style="width: ${pct}%; height: 100%; background: var(--color-accent-orange); border-radius: 4px;"></div>
              </div>
            </div>
          `;
        }).join('');
      }

      const topContainer = document.getElementById('admin-top-equipment');
      if (topContainer) {
        const bookedCounts = {};
        bookings.forEach(b => {
          bookedCounts[b.equipmentTitle] = (bookedCounts[b.equipmentTitle] || 0) + 1;
        });

        const sorted = Object.entries(bookedCounts).sort((a, b) => b[1] - a[1]).slice(0, 5);

        topContainer.innerHTML = sorted.map(([title, cnt]) => `
          <div style="display: flex; align-items: center; justify-content: space-between; padding: 0.85rem 0; border-bottom: 1.5px solid var(--color-border); font-size: 0.9rem;">
            <div>
              <strong>${title}</strong>
            </div>
            <span class="badge badge-primary" style="background: #fef3c7; color: #b45309; border: 1px solid #fde047;">
              ${cnt} ${cnt === 1 ? 'borrow' : 'borrows'}
            </span>
          </div>
        `).join('');
      }
    },

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
                <div class="table-item-title">${u.name} ${u.id === activeUser.id ? '<span class="badge badge-available" style="font-size: 0.65rem;">Active</span>' : ''}</div>
                <div class="table-item-sub">${u.email} • ID: ${u.id}</div>
              </div>
            </div>
          </td>
          <td>
            <span class="badge badge-${u.role}">${u.role.toUpperCase()}</span>
          </td>
          <td>
            <div>${u.company || 'Student Member'}</div>
            <div class="table-item-sub">${u.phone || 'N/A'}</div>
          </td>
          <td>
            <div>★ ${u.rating ? u.rating.toFixed(2) : '5.0'}</div>
            <div class="table-item-sub">Batch: ${u.joinedDate || '2025'}</div>
          </td>
          <td>
            <button class="btn btn-outline btn-sm btn-switch-user" data-id="${u.id}">
              Simulate View
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
            <div class="table-item-sub">Pickup: ${item.location}</div>
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
                ${item.status === 'maintenance' ? 'Set Available' : 'Under Check'}
              </button>
              <button class="btn btn-outline btn-sm btn-admin-delete-eq" data-id="${item.id}" style="color: var(--color-danger); border-color: rgba(220, 38, 38, 0.4);">
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
            window.RentEquip.UI.showToast(`SAC Admin updated ${item.title} status to ${item.status}.`, 'info');
          }
        });
      });

      tbody.querySelectorAll('.btn-admin-delete-eq').forEach(btn => {
        btn.addEventListener('click', (e) => {
          const id = e.currentTarget.getAttribute('data-id');
          if (confirm('Admin Override: Remove this supply listing from campus catalog?')) {
            window.RentEquip.Storage.deleteEquipment(id);
            window.RentEquip.UI.showToast('Listing removed by SAC administrator.', 'info');
          }
        });
      });
    },

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
                <select class="form-select admin-override-select" data-id="${b.id}" style="padding: 0.3rem 0.5rem; font-size: 0.8rem; width: auto;">
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
          if (confirm(`SAC Override: Force transition borrow #${id} to status "${newStatus}"?`)) {
            window.RentEquip.Storage.transitionBookingStatus(id, newStatus, {
              reason: 'Student Affairs Council Override',
              condition: 'pristine',
              damageFee: 0,
              depositRefunded: window.RentEquip.Storage.getBookingById(id).securityDeposit
            });
            window.RentEquip.UI.showToast(`SAC override applied: #${id} is now ${newStatus}.`, 'success');
          }
        });
      });
    },

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
      a.download = `rentequip_campus_backup_${window.RentEquip.Calc.getTodayISO()}.json`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
      window.RentEquip.UI.showToast('Campus backup JSON exported successfully.', 'success');
    },

    importDatabaseJSON(file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        try {
          const parsed = JSON.parse(e.target.result);
          if (parsed.equipment && parsed.bookings) {
            localStorage.setItem('rentequip_campus_equipment_v3', JSON.stringify(parsed.equipment));
            localStorage.setItem('rentequip_campus_bookings_v3', JSON.stringify(parsed.bookings));
            if (parsed.users) localStorage.setItem('rentequip_campus_users_v3', JSON.stringify(parsed.users));
            if (parsed.reviews) localStorage.setItem('rentequip_campus_reviews_v3', JSON.stringify(parsed.reviews));
            if (parsed.notifications) localStorage.setItem('rentequip_campus_notifications_v3', JSON.stringify(parsed.notifications));
            window.RentEquip.UI.showToast('Campus backup restored!', 'success');
            setTimeout(() => window.location.reload(), 400);
          } else {
            window.RentEquip.UI.showToast('Invalid backup file format.', 'error');
          }
        } catch (err) {
          window.RentEquip.UI.showToast('Failed to parse backup JSON file.', 'error');
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
