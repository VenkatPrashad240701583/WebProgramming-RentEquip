/**
 * RentEquip - Campus Shared UI Framework & Interactive Components
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

      window.addEventListener('rentequip:change', () => {
        this.updateNotificationBadge();
      });

      window.addEventListener('rentequip:auth_change', () => {
        this.renderHeader();
        this.updateNotificationBadge();
      });
    },

    renderHeader() {
      const headerEl = document.getElementById('main-header');
      if (!headerEl) return;

      const user = window.RentEquip.Auth.getUser();
      const currentPath = window.location.pathname.split('/').pop() || 'index.html';
      const unreadCount = window.RentEquip.Storage.getUnreadNotificationCount(user.id);

      const navLinks = [
        { href: 'index.html', label: 'Campus Marketplace', icon: 'M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253' },
        { href: 'customer.html', label: 'My Borrows', icon: 'M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z' },
        { href: 'owner.html', label: 'Lender & Club Desk', icon: 'M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4' },
        { href: 'admin.html', label: 'SAC Council Admin', icon: 'M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z' },
        { href: 'notifications.html', label: 'Campus Alerts', icon: 'M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9', badge: unreadCount },
        { href: 'presentation.html', label: 'Project Deck', icon: 'M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z' }
      ];

      const users = window.RentEquip.Auth.getAllUsers();

      headerEl.innerHTML = `
        <div class="nav-container">
          <div class="nav-brand-section">
            <a href="index.html" class="brand-logo" aria-label="RentEquip Campus Home">
              <span class="brand-icon">
                <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.3">
                  <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5"/>
                </svg>
              </span>
              <span class="brand-name">Rent<span class="brand-highlight">Equip</span></span>
            </a>
            <span class="simulation-pill" title="Simulated college campus equipment sharing">
              <span class="simulation-dot"></span> 🎓 CAMPUS DEMO TESTBED
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
              <label for="role-select" class="sr-only">Student Perspective</label>
              <div class="role-selector">
                <div class="role-avatar-circle" style="background: ${this.getUserColor(user.role)}">${user.avatar}</div>
                <select id="role-select" class="role-dropdown" aria-label="Switch Student Perspective">
                  ${users.map(u => `
                    <option value="${u.id}" ${u.id === user.id ? 'selected' : ''}>
                      ${u.name} — ${u.role === 'customer' ? 'Student Renter' : u.role === 'owner' ? 'Club/Senior Host' : 'SAC Admin'}
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
                <p class="user-meta-role">Perspective: <span class="badge badge-${user.role}">${user.role.toUpperCase()}</span></p>
                <p class="user-meta-email">${user.email}</p>
              </div>
            </div>
          </div>
        </div>
      `;

      const selectEl = document.getElementById('role-select');
      if (selectEl) {
        selectEl.addEventListener('change', (e) => {
          window.RentEquip.Auth.switchUser(e.target.value);
        });
      }

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

    renderFooter() {
      const footerEl = document.getElementById('main-footer');
      if (!footerEl) return;

      footerEl.innerHTML = `
        <div class="footer-container">
          <div class="footer-grid">
            <div class="brand-col">
              <div class="brand-logo footer-logo" style="color: #ffffff;">
                <span class="brand-icon">
                  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.3">
                    <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5"/>
                  </svg>
                </span>
                <span class="brand-name" style="color: #ffffff;">Rent<span class="brand-highlight">Equip</span></span>
              </div>
              <p class="footer-desc">
                College campus student equipment &amp; study resource sharing marketplace. Borrow lab coats, drafters, calculators, and electronics with zero friction.
              </p>
              <div class="footer-badges">
                <span class="meta-tag">Student Community</span>
                <span class="meta-tag">100% LocalStorage</span>
                <span class="meta-tag">GitHub Pages Native</span>
              </div>
            </div>

            <div class="footer-col">
              <h4 class="footer-heading">Campus Hubs</h4>
              <ul class="footer-links">
                <li><a href="index.html">Campus Catalog</a></li>
                <li><a href="customer.html">My Borrowed Items</a></li>
                <li><a href="owner.html">Student Lender Desk</a></li>
                <li><a href="admin.html">SAC Council Admin</a></li>
                <li><a href="notifications.html">Exam &amp; Return Alerts</a></li>
              </ul>
            </div>

            <div class="footer-col">
              <h4 class="footer-heading">Course Presentation</h4>
              <ul class="footer-links">
                <li><a href="presentation.html">🖥️ Interactive Slide Deck</a></li>
                <li><a href="RentEquip_Presentation.pptx" download>📥 Download PowerPoint (.PPTX)</a></li>
                <li><span class="sim-bullet">•</span> <strong>VENKAT PRASHAD A</strong> (240701583)</li>
                <li><span class="sim-bullet">•</span> Course: <strong>Web Programming</strong></li>
              </ul>
            </div>

            <div class="footer-col danger-zone-col">
              <h4 class="footer-heading">Demo Controls</h4>
              <p class="footer-help-text" style="color: #a3b8b0; font-size: 0.85rem; margin-bottom: 0.85rem;">
                Reset all 50+ campus listings, student bookings, and alerts back to initial demo state:
              </p>
              <button class="btn btn-outline btn-sm btn-reset-demo" id="btn-reset-demo" style="background: #2a3d3a; color: #ffffff; border-color: #3b524e;">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <path d="M3 12a9 9 0 0 1 9-9 9.75 9.75 0 0 1 6.74 2.74L21 8"></path>
                  <path d="M21 3v5h-5"></path>
                  <path d="M21 12a9 9 0 0 1-9 9 9.75 9.75 0 0 1-6.74-2.74L3 16"></path>
                  <path d="M3 21v-5h5"></path>
                </svg>
                Reset Campus Data
              </button>
            </div>
          </div>

          <div class="footer-bottom">
            <p>&copy; ${new Date().getFullYear()} RentEquip Campus Network. Built with pure HTML5, CSS3, and Vanilla JavaScript.</p>
            <p class="simulation-disclaimer" style="color: #728c83;">
              <strong>Notice:</strong> All peer-to-peer student transactions, security deposits, and identity profiles are simulated in your browser.
            </p>
          </div>
        </div>
      `;

      const resetBtn = document.getElementById('btn-reset-demo');
      if (resetBtn) {
        resetBtn.addEventListener('click', () => {
          if (confirm('Reset RentEquip campus inventory and bookings back to initial seed data?')) {
            window.RentEquip.Storage.resetToDefaults();
            this.showToast('Campus data restored to default 50+ listings.', 'success');
            setTimeout(() => window.location.reload(), 400);
          }
        });
      }
    },

    getUserColor(role) {
      if (role === 'admin') return '#7c3aed';
      if (role === 'owner') return '#0284c7';
      return '#15803d';
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

    initModalListeners() {
      document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') {
          const openModal = document.querySelector('.modal.open');
          if (openModal) {
            this.closeModal(openModal.id);
          }
        }
      });

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
          return `<span class="badge badge-active"><span class="badge-dot"></span> Currently Borrowed</span>`;
        case 'returned':
          return `<span class="badge badge-returned"><span class="badge-dot"></span> Returned — Awaiting Check</span>`;
        case 'completed':
          return `<span class="badge badge-completed"><span class="badge-dot"></span> Returned &amp; Settled</span>`;
        case 'rejected':
          return `<span class="badge badge-rejected"><span class="badge-dot"></span> Declined</span>`;
        case 'cancelled':
          return `<span class="badge badge-completed">Cancelled</span>`;
        case 'available':
          return `<span class="badge badge-available"><span class="badge-dot"></span> Available Now</span>`;
        case 'rented':
          return `<span class="badge badge-rented"><span class="badge-dot"></span> Out on Borrow</span>`;
        case 'maintenance':
          return `<span class="badge badge-maintenance"><span class="badge-dot"></span> Under Maintenance</span>`;
        default:
          return `<span class="badge badge-available">${status}</span>`;
      }
    }
  };

  window.RentEquip = window.RentEquip || {};
  window.RentEquip.UI = UI;

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => UI.init());
  } else {
    UI.init();
  }
})(window);
