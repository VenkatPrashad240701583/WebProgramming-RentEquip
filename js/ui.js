/**
 * RentEquip - Shared UI Framework & Interactive Components
 * Manages Header, Role Switcher, Mobile Navigation, Modals, Toasts, Badges, and Alerts.
 */

(function (window) {
  'use strict';

  const UI = {
    init() {
      this.renderHeader();
      this.renderFooter();
      this.initModalListeners();
      this.updateNotificationBadge();

      // Listen for data updates to sync badges and state
      window.addEventListener('rentequip:change', () => {
        this.updateNotificationBadge();
      });

      window.addEventListener('rentequip:auth_change', () => {
        this.renderHeader();
        this.updateNotificationBadge();
      });
    },

    /**
     * Renders standard top navigation bar across all pages
     */
    renderHeader() {
      const headerEl = document.getElementById('main-header');
      if (!headerEl) return;

      const user = window.RentEquip.Auth.getUser();
      const currentPath = window.location.pathname.split('/').pop() || 'index.html';
      const unreadCount = window.RentEquip.Storage.getUnreadNotificationCount(user.id);

      // Links defined relative to project root
      const navLinks = [
        { href: 'index.html', label: 'Marketplace', icon: 'M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6' },
        { href: 'customer.html', label: 'Customer Portal', icon: 'M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z' },
        { href: 'owner.html', label: 'Owner Portal', icon: 'M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4' },
        { href: 'admin.html', label: 'Admin Ops', icon: 'M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z' },
        { href: 'notifications.html', label: 'Alerts', icon: 'M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9', badge: unreadCount }
      ];

      const users = window.RentEquip.Auth.getAllUsers();

      headerEl.innerHTML = `
        <div class="nav-container">
          <div class="nav-brand-section">
            <a href="index.html" class="brand-logo" aria-label="RentEquip Home">
              <span class="brand-icon">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round">
                  <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"></path>
                  <polyline points="3.27 6.96 12 12.01 20.73 6.96"></polyline>
                  <line x1="12" y1="22.08" x2="12" y2="12"></line>
                </svg>
              </span>
              <span class="brand-name">Rent<span class="brand-highlight">Equip</span></span>
            </a>
            <span class="simulation-pill" title="Simulated environment with localStorage persistence">
              <span class="simulation-dot"></span> SIMULATED TESTBENCH
            </span>
          </div>

          <nav class="nav-links" id="desktop-nav" aria-label="Main Navigation">
            ${navLinks.map(link => {
              const isActive = currentPath === link.href || (currentPath === '' && link.href === 'index.html');
              return `
                <a href="${link.href}" class="nav-link ${isActive ? 'active' : ''}">
                  <svg class="nav-svg" width="18" height="18" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" d="${link.icon}"></path>
                  </svg>
                  <span>${link.label}</span>
                  ${link.badge > 0 ? `<span class="nav-badge" id="nav-badge-count">${link.badge}</span>` : ''}
                </a>
              `;
            }).join('')}
          </nav>

          <div class="nav-user-control">
            <div class="role-selector-wrapper">
              <label for="role-select" class="sr-only">Simulated User Perspective</label>
              <div class="role-selector">
                <div class="role-avatar-circle" style="background: ${this.getUserColor(user.role)}">${user.avatar}</div>
                <select id="role-select" class="role-dropdown" aria-label="Switch User Perspective">
                  ${users.map(u => `
                    <option value="${u.id}" ${u.id === user.id ? 'selected' : ''}>
                      ${u.name} — ${u.role.toUpperCase()}
                    </option>
                  `).join('')}
                </select>
                <svg class="dropdown-chevron" width="14" height="14" viewBox="0 0 20 20" fill="currentColor">
                  <path fill-rule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clip-rule="evenodd"/>
                </svg>
              </div>
            </div>

            <button class="mobile-menu-btn" id="mobile-toggle" aria-label="Toggle navigation menu" aria-expanded="false">
              <svg width="22" height="22" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" d="M4 6h16M4 12h16M4 18h16"></path>
              </svg>
            </button>
          </div>
        </div>

        <!-- Mobile Drawer Navigation -->
        <div class="mobile-drawer" id="mobile-drawer" hidden>
          <div class="mobile-drawer-content">
            <div class="mobile-nav-links">
              ${navLinks.map(link => {
                const isActive = currentPath === link.href;
                return `
                  <a href="${link.href}" class="mobile-nav-link ${isActive ? 'active' : ''}">
                    <svg class="nav-svg" width="20" height="20" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" d="${link.icon}"></path>
                    </svg>
                    <span>${link.label}</span>
                    ${link.badge > 0 ? `<span class="nav-badge">${link.badge}</span>` : ''}
                  </a>
                `;
              }).join('')}
            </div>
            <div class="mobile-drawer-footer">
              <div class="user-meta-summary">
                <p class="user-meta-name"><strong>${user.name}</strong></p>
                <p class="user-meta-role">Active Role: <span class="badge badge-${user.role}">${user.role.toUpperCase()}</span></p>
                <p class="user-meta-email">${user.email}</p>
              </div>
            </div>
          </div>
        </div>
      `;

      // Role selector change listener
      const selectEl = document.getElementById('role-select');
      if (selectEl) {
        selectEl.addEventListener('change', (e) => {
          window.RentEquip.Auth.switchUser(e.target.value);
        });
      }

      // Mobile toggle button listener
      const toggleBtn = document.getElementById('mobile-toggle');
      const drawerEl = document.getElementById('mobile-drawer');
      if (toggleBtn && drawerEl) {
        toggleBtn.addEventListener('click', () => {
          const isExpanded = toggleBtn.getAttribute('aria-expanded') === 'true';
          toggleBtn.setAttribute('aria-expanded', !isExpanded);
          drawerEl.hidden = isExpanded;
          drawerEl.classList.toggle('open', !isExpanded);
        });
      }
    },

    /**
     * Renders clean, informative footer
     */
    renderFooter() {
      const footerEl = document.getElementById('main-footer');
      if (!footerEl) return;

      footerEl.innerHTML = `
        <div class="footer-container">
          <div class="footer-grid">
            <div class="footer-col brand-col">
              <div class="brand-logo footer-logo">
                <span class="brand-icon">
                  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2">
                    <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"></path>
                  </svg>
                </span>
                <span class="brand-name">Rent<span class="brand-highlight">Equip</span></span>
              </div>
              <p class="footer-desc">
                High-performance commercial equipment rental marketplace running natively on client-side vanilla JavaScript &amp; HTML5.
              </p>
              <div class="footer-badges">
                <span class="meta-tag">Zero Backend</span>
                <span class="meta-tag">100% LocalStorage</span>
                <span class="meta-tag">GitHub Pages Ready</span>
              </div>
            </div>

            <div class="footer-col">
              <h4 class="footer-heading">Platform Hubs</h4>
              <ul class="footer-links">
                <li><a href="index.html">Marketplace Catalog</a></li>
                <li><a href="customer.html">Customer Bookings</a></li>
                <li><a href="owner.html">Equipment Owner Portal</a></li>
                <li><a href="admin.html">Platform Administration</a></li>
                <li><a href="notifications.html">Notifications &amp; Alerts</a></li>
              </ul>
            </div>

            <div class="footer-col">
              <h4 class="footer-heading">Simulated Scenarios</h4>
              <ul class="footer-links">
                <li><span class="sim-bullet">•</span> Alex Rivera: Active, Returned &amp; Pending Rentals</li>
                <li><span class="sim-bullet">•</span> Marcus Vance: Inventory CRUD &amp; Return Inspections</li>
                <li><span class="sim-bullet">•</span> Elena Rostova: Platform KPIs &amp; Global Audits</li>
                <li><span class="sim-bullet">•</span> Date Overlap &amp; Conflict Prevention Engine</li>
              </ul>
            </div>

            <div class="footer-col danger-zone-col">
              <h4 class="footer-heading">Demo Controls</h4>
              <p class="footer-help-text">Reset all equipment, bookings, and notifications back to initial realistic demo state:</p>
              <button class="btn btn-outline btn-sm btn-reset-demo" id="btn-reset-demo">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <path d="M3 12a9 9 0 0 1 9-9 9.75 9.75 0 0 1 6.74 2.74L21 8"></path>
                  <path d="M21 3v5h-5"></path>
                  <path d="M21 12a9 9 0 0 1-9 9 9.75 9.75 0 0 1-6.74-2.74L3 16"></path>
                  <path d="M3 21v-5h5"></path>
                </svg>
                Reset Demo Data
              </button>
            </div>
          </div>

          <div class="footer-bottom">
            <p>&copy; ${new Date().getFullYear()} RentEquip Marketplace. Built with vanilla HTML5, CSS3, and JavaScript.</p>
            <p class="simulation-disclaimer">
              <strong>Notice:</strong> All payments, security deposits, identities, and certifications displayed on RentEquip are simulated for demonstration purposes.
            </p>
          </div>
        </div>
      `;

      // Reset button listener
      const resetBtn = document.getElementById('btn-reset-demo');
      if (resetBtn) {
        resetBtn.addEventListener('click', () => {
          if (confirm('Are you sure you want to reset all RentEquip data? Custom bookings, equipment, and reviews will be reset to factory defaults.')) {
            window.RentEquip.Storage.resetToDefaults();
            this.showToast('Demo data successfully restored to factory seed defaults.', 'success');
            setTimeout(() => window.location.reload(), 400);
          }
        });
      }
    },

    getUserColor(role) {
      if (role === 'admin') return '#8b5cf6';
      if (role === 'owner') return '#0284c7';
      return '#f59e0b';
    },

    updateNotificationBadge() {
      const user = window.RentEquip.Auth.getUser();
      const count = window.RentEquip.Storage.getUnreadNotificationCount(user.id);
      const badges = document.querySelectorAll('#nav-badge-count, .nav-badge');
      badges.forEach(b => {
        if (count > 0) {
          b.textContent = count;
          b.style.display = 'inline-flex';
        } else {
          b.style.display = 'none';
        }
      });
    },

    /**
     * Toast System
     */
    showToast(message, type = 'info', duration = 4000) {
      let container = document.getElementById('toast-container');
      if (!container) {
        container = document.createElement('div');
        container.id = 'toast-container';
        container.className = 'toast-container';
        document.body.appendChild(container);
      }

      const toast = document.createElement('div');
      toast.className = `toast toast-${type}`;
      toast.setAttribute('role', 'alert');

      let icon = '';
      if (type === 'success') {
        icon = '<svg width="18" height="18" fill="none" stroke="currentColor" stroke-width="2.5" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M5 13l4 4L19 7"/></svg>';
      } else if (type === 'error') {
        icon = '<svg width="18" height="18" fill="none" stroke="currentColor" stroke-width="2.5" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M6 18L18 6M6 6l12 12"/></svg>';
      } else if (type === 'warning') {
        icon = '<svg width="18" height="18" fill="none" stroke="currentColor" stroke-width="2.5" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"/></svg>';
      } else {
        icon = '<svg width="18" height="18" fill="none" stroke="currentColor" stroke-width="2.5" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/></svg>';
      }

      toast.innerHTML = `
        <span class="toast-icon">${icon}</span>
        <span class="toast-message">${message}</span>
        <button class="toast-close" aria-label="Close Notification">&times;</button>
      `;

      container.appendChild(toast);

      const closeBtn = toast.querySelector('.toast-close');
      const dismiss = () => {
        toast.classList.add('fade-out');
        setTimeout(() => toast.remove(), 250);
      };

      closeBtn.addEventListener('click', dismiss);
      setTimeout(dismiss, duration);
    },

    /**
     * Modal Controller
     */
    initModalListeners() {
      // Close modal on escape key
      document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') {
          const openModal = document.querySelector('.modal.open');
          if (openModal) {
            this.closeModal(openModal.id);
          }
        }
      });

      // Close modal when clicking overlay background
      document.addEventListener('click', (e) => {
        if (e.target.classList.contains('modal-backdrop')) {
          const modal = e.target.closest('.modal');
          if (modal) {
            this.closeModal(modal.id);
          }
        }
      });
    },

    openModal(modalId) {
      const modal = document.getElementById(modalId);
      if (!modal) return;
      modal.classList.add('open');
      modal.setAttribute('aria-hidden', 'false');
      document.body.classList.add('modal-open');

      // Focus first input or button
      const focusable = modal.querySelector('button, input, select, textarea');
      if (focusable) focusable.focus();
    },

    closeModal(modalId) {
      const modal = document.getElementById(modalId);
      if (!modal) return;
      modal.classList.remove('open');
      modal.setAttribute('aria-hidden', 'true');
      document.body.classList.remove('modal-open');
    },

    /**
     * Status Badges Generator
     */
    getStatusBadge(status, isOverdue = false) {
      if (isOverdue) {
        return `<span class="badge badge-overdue"><span class="badge-dot"></span> OVERDUE</span>`;
      }

      switch (status) {
        case 'pending':
          return `<span class="badge badge-pending"><span class="badge-dot"></span> Pending Approval</span>`;
        case 'approved':
          return `<span class="badge badge-approved"><span class="badge-dot"></span> Approved — Ready for Pickup</span>`;
        case 'active':
          return `<span class="badge badge-active"><span class="badge-dot"></span> Active Rental</span>`;
        case 'returned':
          return `<span class="badge badge-returned"><span class="badge-dot"></span> Returned — Awaiting Inspection</span>`;
        case 'completed':
          return `<span class="badge badge-completed"><span class="badge-dot"></span> Completed &amp; Settled</span>`;
        case 'rejected':
          return `<span class="badge badge-rejected"><span class="badge-dot"></span> Declined</span>`;
        case 'cancelled':
          return `<span class="badge badge-cancelled">Cancelled</span>`;
        case 'available':
          return `<span class="badge badge-available"><span class="badge-dot"></span> Available</span>`;
        case 'rented':
          return `<span class="badge badge-rented"><span class="badge-dot"></span> Currently Rented</span>`;
        case 'maintenance':
          return `<span class="badge badge-maintenance"><span class="badge-dot"></span> In Maintenance</span>`;
        default:
          return `<span class="badge badge-default">${status}</span>`;
      }
    }
  };

  window.RentEquip = window.RentEquip || {};
  window.RentEquip.UI = UI;

  // Auto initialize header/footer when DOM is ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => UI.init());
  } else {
    UI.init();
  }
})(window);
