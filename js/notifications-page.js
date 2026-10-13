/**
 * RentEquip - Notification Center Controller (notifications.html)
 * Powers alert categorization, unread toggles, overdue warnings, and deep navigation links.
 */

(function (window) {
  'use strict';

  const NotificationCenter = {
    activeFilter: 'all',
    scope: 'user', // 'user' or 'all'

    init() {
      this.bindEvents();
      this.render();

      window.addEventListener('rentequip:change', () => this.render());
      window.addEventListener('rentequip:auth_change', () => this.render());
    },

    bindEvents() {
      // Filter tabs
      const tabs = document.getElementById('notif-filter-tabs');
      if (tabs) {
        tabs.addEventListener('click', (e) => {
          const btn = e.target.closest('.tab-btn');
          if (!btn) return;
          this.activeFilter = btn.getAttribute('data-filter');
          tabs.querySelectorAll('.tab-btn').forEach(b => b.classList.remove('active'));
          btn.classList.add('active');
          this.renderList();
        });
      }

      // Mark all read button
      const markAllBtn = document.getElementById('btn-mark-all-read');
      if (markAllBtn) {
        markAllBtn.addEventListener('click', () => {
          const user = window.RentEquip.Auth.getUser();
          const targetUserId = this.scope === 'user' ? user.id : null;
          window.RentEquip.Storage.markAllNotificationsRead(targetUserId);
          window.RentEquip.UI.showToast('All notifications marked as read.', 'info');
        });
      }

      // Scope toggle (current user vs all platform alerts)
      const scopeToggle = document.getElementById('notif-scope-toggle');
      if (scopeToggle) {
        scopeToggle.addEventListener('change', (e) => {
          this.scope = e.target.checked ? 'all' : 'user';
          this.render();
        });
      }
    },

    render() {
      this.renderHeader();
      this.renderOverdueBanner();
      this.renderList();
    },

    renderHeader() {
      const user = window.RentEquip.Auth.getUser();
      const scopeLabel = document.getElementById('notif-scope-user-label');
      if (scopeLabel) {
        scopeLabel.textContent = `Alerts for ${user.name} (${user.role.toUpperCase()})`;
      }
    },

    renderOverdueBanner() {
      const banner = document.getElementById('notif-overdue-banner');
      if (!banner) return;

      const user = window.RentEquip.Auth.getUser();
      const bookings = window.RentEquip.Storage.getBookings();
      const Calc = window.RentEquip.Calc;
      const today = Calc.getTodayISO();

      // Check if current user has any active overdue bookings
      const overdueBookings = bookings.filter(b => {
        if (b.status !== 'active') return false;
        if (b.endDate >= today) return false;
        if (user.role === 'customer') return b.customerId === user.id;
        if (user.role === 'owner') return b.ownerId === user.id;
        return true; // Admin sees all
      });

      if (overdueBookings.length > 0) {
        const first = overdueBookings[0];
        const overdueDays = Calc.calculateOverdueDays(first.endDate, today);
        banner.style.display = 'block';
        banner.innerHTML = `
          <div class="overdue-warning-banner" style="display: flex; align-items: center; justify-content: space-between; flex-wrap: wrap; gap: 1rem; padding: 1rem 1.25rem;">
            <div style="display: flex; align-items: center; gap: 0.75rem;">
              <span style="font-size: 1.5rem;">🚨</span>
              <div>
                <strong>Overdue Equipment Notice:</strong> ${first.equipmentTitle} was scheduled for return on ${Calc.formatDate(first.endDate)} (${overdueDays} days past due).
                <div style="font-size: 0.8rem; opacity: 0.85;">Late return penalty accumulating at standard daily rate multiplier.</div>
              </div>
            </div>
            <div>
              <a href="${user.role === 'owner' ? 'owner.html' : 'customer.html'}" class="btn btn-danger btn-sm">
                ${user.role === 'owner' ? 'Manage Overdue Rental &rarr;' : 'Initiate Immediate Return &rarr;'}
              </a>
            </div>
          </div>
        `;
      } else {
        banner.style.display = 'none';
      }
    },

    renderList() {
      const listEl = document.getElementById('notifications-list-container');
      const emptyEl = document.getElementById('notif-empty-state');
      if (!listEl) return;

      const user = window.RentEquip.Auth.getUser();
      const allNotifs = window.RentEquip.Storage.getNotifications(this.scope === 'user' ? user.id : null);

      const filtered = allNotifs.filter(n => {
        if (this.activeFilter === 'unread') return !n.read;
        if (this.activeFilter === 'actions') {
          return ['booking_request', 'return_submitted', 'overdue_alert'].includes(n.type);
        }
        return true;
      });

      if (filtered.length === 0) {
        listEl.innerHTML = '';
        if (emptyEl) emptyEl.style.display = 'flex';
        return;
      }

      if (emptyEl) emptyEl.style.display = 'none';

      listEl.innerHTML = filtered.map(item => this.createNotificationItemHTML(item)).join('');

      // Bind mark read listeners
      listEl.querySelectorAll('.btn-mark-single-read').forEach(btn => {
        btn.addEventListener('click', (e) => {
          const id = e.currentTarget.getAttribute('data-id');
          window.RentEquip.Storage.markNotificationRead(id);
        });
      });
    },

    createNotificationItemHTML(item) {
      const timeStr = this.formatRelativeTime(item.createdAt);
      const icon = this.getTypeIcon(item.type);

      let actionBtnText = 'View Details';
      if (item.type === 'booking_request') actionBtnText = 'Review &amp; Approve';
      if (item.type === 'booking_approved') actionBtnText = 'Confirm Pickup';
      if (item.type === 'return_submitted') actionBtnText = 'Inspect Condition';
      if (item.type === 'inspection_completed') actionBtnText = 'View Settlement Receipt';
      if (item.type === 'overdue_alert') actionBtnText = 'Resolve Overdue Status';

      return `
        <div class="notification-item ${item.read ? '' : 'unread'}" id="notif-item-${item.id}">
          <div class="notification-icon-wrapper notif-type-${item.type}">
            ${icon}
          </div>

          <div class="notification-body">
            <div class="notification-title-row">
              <span class="notification-title">${item.title}</span>
              <span class="notification-time">${timeStr}</span>
            </div>

            <p class="notification-text">${item.message}</p>

            <div class="notification-actions">
              ${item.link ? `
                <a href="${item.link}" class="btn btn-primary btn-sm" style="font-size: 0.78rem; padding: 0.35rem 0.75rem;">
                  ${actionBtnText} &rarr;
                </a>
              ` : ''}

              ${!item.read ? `
                <button class="btn btn-outline btn-sm btn-mark-single-read" data-id="${item.id}" style="font-size: 0.78rem; padding: 0.35rem 0.65rem;">
                  Mark as Read
                </button>
              ` : `
                <span class="text-xs text-dim">✓ Read</span>
              `}
            </div>
          </div>
        </div>
      `;
    },

    getTypeIcon(type) {
      switch (type) {
        case 'booking_request':
          return `<svg width="20" height="20" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"/></svg>`;
        case 'booking_approved':
          return `<svg width="20" height="20" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"/></svg>`;
        case 'overdue_alert':
          return `<svg width="20" height="20" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"/></svg>`;
        case 'return_submitted':
          return `<svg width="20" height="20" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.033 8.033 0 01-15.357-2m15.357 2H15"/></svg>`;
        case 'inspection_completed':
          return `<svg width="20" height="20" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z"/></svg>`;
        default:
          return `<svg width="20" height="20" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/></svg>`;
      }
    },

    formatRelativeTime(isoStr) {
      if (!isoStr) return 'Recently';
      const d = new Date(isoStr);
      const now = new Date();
      const diffMs = now.getTime() - d.getTime();
      const diffHrs = Math.floor(diffMs / (1000 * 60 * 60));
      const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

      if (diffDays > 0) return `${diffDays}d ago`;
      if (diffHrs > 0) return `${diffHrs}h ago`;
      return 'Just now';
    }
  };

  window.RentEquip = window.RentEquip || {};
  window.RentEquip.NotificationCenter = NotificationCenter;

  document.addEventListener('DOMContentLoaded', () => {
    NotificationCenter.init();
  });
})(window);
