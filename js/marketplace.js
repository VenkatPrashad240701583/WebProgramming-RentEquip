/**
 * RentEquip - Campus Marketplace Controller (index.html)
 * Powers real-time search, multi-category filtering, campus location filters,
 * student pricing (₹), and quick view modals.
 */

(function (window) {
  'use strict';

  const Marketplace = {
    state: {
      searchQuery: '',
      selectedCategory: 'all',
      selectedLocation: 'all',
      maxPrice: 300,
      availableOnly: false,
      featuredOnly: false,
      sortBy: 'featured',
      equipmentList: []
    },

    init() {
      this.loadEquipment();
      this.bindEvents();
      this.render();

      window.addEventListener('rentequip:change', () => {
        this.loadEquipment();
        this.render();
      });
    },

    loadEquipment() {
      this.state.equipmentList = window.RentEquip.Storage.getEquipment();
    },

    bindEvents() {
      // Hero search form
      const searchForm = document.getElementById('search-form');
      if (searchForm) {
        searchForm.addEventListener('submit', (e) => {
          e.preventDefault();
          const queryInput = document.getElementById('search-input');
          const catSelect = document.getElementById('search-category-select');
          const locSelect = document.getElementById('search-location-select');

          if (queryInput) this.state.searchQuery = queryInput.value.trim().toLowerCase();
          if (catSelect) this.state.selectedCategory = catSelect.value;
          if (locSelect) this.state.selectedLocation = locSelect.value;

          this.syncSidebarFilters();
          this.render();
        });
      }

      // Category chips in hero
      const chipsContainer = document.getElementById('category-chips');
      if (chipsContainer) {
        chipsContainer.addEventListener('click', (e) => {
          const chip = e.target.closest('.category-chip');
          if (!chip) return;
          const category = chip.getAttribute('data-category');
          this.state.selectedCategory = category;

          document.querySelectorAll('.category-chip').forEach(c => c.classList.remove('active'));
          chip.classList.add('active');

          const heroSelect = document.getElementById('search-category-select');
          if (heroSelect) heroSelect.value = category;

          this.syncSidebarFilters();
          this.render();
        });
      }

      // Sidebar Category Checkboxes
      const catCheckboxes = document.querySelectorAll('.filter-category-checkbox');
      catCheckboxes.forEach(cb => {
        cb.addEventListener('change', () => {
          const checked = Array.from(catCheckboxes).filter(c => c.checked).map(c => c.value);
          if (checked.length === 0 || checked.length === catCheckboxes.length) {
            this.state.selectedCategory = 'all';
          } else if (checked.length === 1) {
            this.state.selectedCategory = checked[0];
          } else {
            this.state.selectedCategory = checked;
          }
          this.render();
        });
      });

      // Price slider
      const priceSlider = document.getElementById('price-slider');
      const priceDisplay = document.getElementById('price-display');
      if (priceSlider && priceDisplay) {
        priceSlider.addEventListener('input', (e) => {
          this.state.maxPrice = Number(e.target.value);
          priceDisplay.textContent = `₹${this.state.maxPrice}`;
          this.render();
        });
      }

      // Available only toggle
      const availToggle = document.getElementById('filter-available-only');
      if (availToggle) {
        availToggle.addEventListener('change', (e) => {
          this.state.availableOnly = e.target.checked;
          this.render();
        });
      }

      // Featured only toggle
      const featuredToggle = document.getElementById('filter-featured-only');
      if (featuredToggle) {
        featuredToggle.addEventListener('change', (e) => {
          this.state.featuredOnly = e.target.checked;
          this.render();
        });
      }

      // Sort select
      const sortSelect = document.getElementById('sort-select');
      if (sortSelect) {
        sortSelect.addEventListener('change', (e) => {
          this.state.sortBy = e.target.value;
          this.render();
        });
      }

      // Reset filters button
      const resetBtn = document.getElementById('btn-reset-filters');
      if (resetBtn) {
        resetBtn.addEventListener('click', () => {
          this.resetFilters();
        });
      }

      // Delegate Quick View Button
      const grid = document.getElementById('equipment-grid');
      if (grid) {
        grid.addEventListener('click', (e) => {
          const quickBtn = e.target.closest('.btn-quick-view');
          if (quickBtn) {
            const eqId = quickBtn.getAttribute('data-id');
            this.openQuickView(eqId);
          }
        });
      }
    },

    syncSidebarFilters() {
      const catCheckboxes = document.querySelectorAll('.filter-category-checkbox');
      catCheckboxes.forEach(cb => {
        if (this.state.selectedCategory === 'all') {
          cb.checked = true;
        } else if (Array.isArray(this.state.selectedCategory)) {
          cb.checked = this.state.selectedCategory.includes(cb.value);
        } else {
          cb.checked = cb.value === this.state.selectedCategory;
        }
      });
    },

    resetFilters() {
      this.state.searchQuery = '';
      this.state.selectedCategory = 'all';
      this.state.selectedLocation = 'all';
      this.state.maxPrice = 300;
      this.state.availableOnly = false;
      this.state.featuredOnly = false;
      this.state.sortBy = 'featured';

      const searchInput = document.getElementById('search-input');
      if (searchInput) searchInput.value = '';

      const heroCat = document.getElementById('search-category-select');
      if (heroCat) heroCat.value = 'all';

      const heroLoc = document.getElementById('search-location-select');
      if (heroLoc) heroLoc.value = 'all';

      const priceSlider = document.getElementById('price-slider');
      const priceDisplay = document.getElementById('price-display');
      if (priceSlider) priceSlider.value = 300;
      if (priceDisplay) priceDisplay.textContent = '₹300';

      const availToggle = document.getElementById('filter-available-only');
      if (availToggle) availToggle.checked = false;

      const featuredToggle = document.getElementById('filter-featured-only');
      if (featuredToggle) featuredToggle.checked = false;

      const sortSelect = document.getElementById('sort-select');
      if (sortSelect) sortSelect.value = 'featured';

      document.querySelectorAll('.category-chip').forEach(c => {
        c.classList.toggle('active', c.getAttribute('data-category') === 'all');
      });

      this.syncSidebarFilters();
      this.render();
    },

    getFilteredEquipment() {
      return this.state.equipmentList.filter(item => {
        if (this.state.searchQuery) {
          const q = this.state.searchQuery;
          const matchTitle = item.title.toLowerCase().includes(q);
          const matchDesc = item.description.toLowerCase().includes(q);
          const matchCat = item.category.toLowerCase().includes(q);
          const matchLoc = item.location.toLowerCase().includes(q);
          if (!matchTitle && !matchDesc && !matchCat && !matchLoc) {
            return false;
          }
        }

        if (this.state.selectedCategory !== 'all') {
          if (Array.isArray(this.state.selectedCategory)) {
            if (!this.state.selectedCategory.includes(item.category)) return false;
          } else {
            if (item.category !== this.state.selectedCategory) return false;
          }
        }

        if (this.state.selectedLocation !== 'all') {
          if (!item.location.toLowerCase().includes(this.state.selectedLocation.toLowerCase())) {
            return false;
          }
        }

        if (item.dailyRate > this.state.maxPrice) {
          return false;
        }

        if (this.state.availableOnly && item.status !== 'available') {
          return false;
        }

        if (this.state.featuredOnly && !item.featured) {
          return false;
        }

        return true;
      });
    },

    getSortedEquipment(list) {
      const sorted = [...list];
      switch (this.state.sortBy) {
        case 'price-asc':
          return sorted.sort((a, b) => a.dailyRate - b.dailyRate);
        case 'price-desc':
          return sorted.sort((a, b) => b.dailyRate - a.dailyRate);
        case 'rating-desc':
          return sorted.sort((a, b) => b.rating - a.rating);
        case 'title-asc':
          return sorted.sort((a, b) => a.title.localeCompare(b.title));
        case 'featured':
        default:
          return sorted.sort((a, b) => (b.featured ? 1 : 0) - (a.featured ? 1 : 0));
      }
    },

    render() {
      const grid = document.getElementById('equipment-grid');
      const countEl = document.getElementById('listings-count-num');
      const activeFiltersContainer = document.getElementById('active-filters-badges');

      if (!grid) return;

      const filtered = this.getFilteredEquipment();
      const sorted = this.getSortedEquipment(filtered);

      if (countEl) {
        countEl.textContent = sorted.length;
      }

      this.renderActiveFilterBadges(activeFiltersContainer);

      if (sorted.length === 0) {
        grid.innerHTML = `
          <div class="empty-state" style="grid-column: 1 / -1;">
            <svg class="empty-icon" fill="none" stroke="currentColor" stroke-width="1.5" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253"/>
            </svg>
            <h3 class="empty-title">No matching student supplies found</h3>
            <p class="empty-desc">Try clearing filters, raising the daily rate budget, or searching for essentials like "lab coat", "calculator", "drafter", or "pen".</p>
            <button class="btn btn-outline" id="empty-reset-btn">Reset All Filters</button>
          </div>
        `;
        const emptyBtn = document.getElementById('empty-reset-btn');
        if (emptyBtn) {
          emptyBtn.addEventListener('click', () => this.resetFilters());
        }
        return;
      }

      grid.innerHTML = sorted.map(item => this.createCardHTML(item)).join('');
    },

    renderActiveFilterBadges(container) {
      if (!container) return;

      const badges = [];

      if (this.state.searchQuery) {
        badges.push({
          label: `Search: "${this.state.searchQuery}"`,
          clear: () => {
            this.state.searchQuery = '';
            const input = document.getElementById('search-input');
            if (input) input.value = '';
            this.render();
          }
        });
      }

      if (this.state.selectedCategory !== 'all') {
        const catLabel = Array.isArray(this.state.selectedCategory)
          ? this.state.selectedCategory.join(', ')
          : this.state.selectedCategory;
        badges.push({
          label: `Category: ${catLabel}`,
          clear: () => {
            this.state.selectedCategory = 'all';
            this.syncSidebarFilters();
            this.render();
          }
        });
      }

      if (this.state.maxPrice < 300) {
        badges.push({
          label: `Max: ₹${this.state.maxPrice}/day`,
          clear: () => {
            this.state.maxPrice = 300;
            const slider = document.getElementById('price-slider');
            if (slider) slider.value = 300;
            const display = document.getElementById('price-display');
            if (display) display.textContent = '₹300';
            this.render();
          }
        });
      }

      if (this.state.availableOnly) {
        badges.push({
          label: 'Available Now',
          clear: () => {
            this.state.availableOnly = false;
            const toggle = document.getElementById('filter-available-only');
            if (toggle) toggle.checked = false;
            this.render();
          }
        });
      }

      if (this.state.featuredOnly) {
        badges.push({
          label: 'Featured Picks',
          clear: () => {
            this.state.featuredOnly = false;
            const toggle = document.getElementById('filter-featured-only');
            if (toggle) toggle.checked = false;
            this.render();
          }
        });
      }

      if (badges.length === 0) {
        container.innerHTML = '';
        container.style.display = 'none';
        return;
      }

      container.style.display = 'flex';
      container.innerHTML = badges.map((b, idx) => `
        <span class="filter-badge">
          ${b.label}
          <button class="filter-badge-remove" data-badge-idx="${idx}" aria-label="Remove filter">&times;</button>
        </span>
      `).join('');

      container.querySelectorAll('.filter-badge-remove').forEach(btn => {
        btn.addEventListener('click', (e) => {
          const idx = Number(e.target.getAttribute('data-badge-idx'));
          if (badges[idx]) badges[idx].clear();
        });
      });
    },

    createCardHTML(item) {
      const Calc = window.RentEquip.Calc;
      const statusBadge = window.RentEquip.UI.getStatusBadge(item.status);
      const specsPreview = (item.specs || []).slice(0, 2);

      let conditionBadge = '';
      if (item.condition) {
        const condClass = item.condition.includes('Pristine') ? 'condition-pristine' : item.condition.includes('Gently') ? 'condition-gently-used' : 'condition-good';
        conditionBadge = `<span class="condition-tag ${condClass}">${item.condition.split('/')[0].trim()}</span>`;
      }

      return `
        <article class="equipment-card" id="card-${item.id}">
          <div class="card-media-wrapper">
            <img src="${item.image}" alt="${item.title}" loading="lazy" />
            <div class="card-badge-status">${statusBadge}</div>
            <div class="card-category-tag">${item.category}</div>
          </div>

          <div class="equipment-card-content">
            <div style="display: flex; align-items: center; justify-content: space-between; margin-bottom: 0.35rem;">
              ${conditionBadge}
              <div class="rating-stars" style="font-size: 0.82rem;">
                ★ ${item.rating.toFixed(1)} <span class="text-xs text-muted">(${item.reviewCount || 0})</span>
              </div>
            </div>

            <a href="equipment.html?id=${item.id}" class="card-title-link">
              <h3 class="equipment-card-title">${item.title}</h3>
            </a>

            <div class="card-location">
              <svg width="14" height="14" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"/>
                <path stroke-linecap="round" stroke-linejoin="round" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"/>
              </svg>
              <span>${item.location}</span>
            </div>

            <div class="card-specs-preview">
              ${specsPreview.map(s => `<span class="spec-pill">${s.label}: <strong>${s.value}</strong></span>`).join('')}
            </div>

            <div class="equipment-card-pricing">
              <div>
                <div class="price-main">
                  ${Calc.formatCurrency(item.dailyRate)} <span class="price-period">/ day</span>
                </div>
                <div class="price-deposit-note">
                  Deposit: ${Calc.formatCurrency(item.securityDeposit)} (100% Refundable)
                </div>
              </div>
            </div>

            <div class="card-actions-row">
              <button class="btn btn-secondary btn-sm btn-quick-view" data-id="${item.id}" aria-label="Quick View ${item.title}">
                Quick View
              </button>
              <a href="equipment.html?id=${item.id}" class="btn btn-primary btn-sm">
                Borrow Item
              </a>
            </div>
          </div>
        </article>
      `;
    },

    openQuickView(eqId) {
      const item = window.RentEquip.Storage.getEquipmentById(eqId);
      if (!item) return;

      const Calc = window.RentEquip.Calc;
      const modalBody = document.getElementById('quick-view-modal-body');
      const modalTitle = document.getElementById('quick-view-modal-title');
      const modalActionBtn = document.getElementById('quick-view-action-btn');

      if (modalTitle) modalTitle.textContent = item.title;
      if (modalActionBtn) {
        modalActionBtn.href = `equipment.html?id=${item.id}`;
      }

      if (modalBody) {
        modalBody.innerHTML = `
          <div style="display: grid; grid-template-columns: 1fr 1.2fr; gap: 1.5rem; align-items: start;">
            <div style="background-color: var(--color-surface-raised); border-radius: var(--radius-md); overflow: hidden; border: 1.5px solid var(--color-border); height: 220px; display: flex; align-items: center; justify-content: center; padding: 1rem;">
              <img src="${item.image}" alt="${item.title}" style="width: 100%; height: 100%; object-fit: contain;" />
            </div>

            <div>
              <div style="display: flex; align-items: center; justify-content: space-between; margin-bottom: 0.75rem;">
                <span class="sticker-tag sticker-tag-blue">${item.category}</span>
                ${window.RentEquip.UI.getStatusBadge(item.status)}
              </div>

              <p style="font-size: 0.9rem; margin-bottom: 1rem; color: var(--color-text-muted); line-height: 1.55;">
                ${item.description}
              </p>

              <div style="background-color: var(--color-surface-raised); border-radius: var(--radius-sm); padding: 0.75rem 1rem; margin-bottom: 1rem; border: 1.5px solid var(--color-border);">
                <div style="display: flex; justify-content: space-between; font-size: 0.9rem; margin-bottom: 0.35rem;">
                  <span>Student Daily Rate:</span>
                  <strong style="color: var(--color-primary);">${Calc.formatCurrency(item.dailyRate)} / day</strong>
                </div>
                <div style="display: flex; justify-content: space-between; font-size: 0.9rem; margin-bottom: 0.35rem;">
                  <span>Weekly Study Pass:</span>
                  <strong>${Calc.formatCurrency(item.weeklyRate)} / wk</strong>
                </div>
                <div style="display: flex; justify-content: space-between; font-size: 0.9rem; color: var(--color-success); font-weight: 700;">
                  <span>Refundable Escrow Deposit:</span>
                  <strong>${Calc.formatCurrency(item.securityDeposit)}</strong>
                </div>
              </div>

              <div style="font-size: 0.84rem; color: var(--color-text-muted); font-weight: 600;">
                📍 Pickup Point: <strong>${item.location}</strong>
              </div>
              <div style="font-size: 0.82rem; color: var(--color-text-dim); margin-top: 0.25rem;">
                👤 Student Host: <strong>${item.ownerName}</strong>
              </div>
            </div>
          </div>

          <div style="margin-top: 1.5rem; border-top: 1.5px solid var(--color-border); padding-top: 1rem;">
            <h4 style="font-size: 0.95rem; margin-bottom: 0.75rem; color: var(--color-primary);">Item Specifications</h4>
            <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 0.5rem; font-size: 0.86rem;">
              ${(item.specs || []).map(s => `
                <div style="display: flex; justify-content: space-between; padding: 0.4rem 0.6rem; background: var(--color-surface-raised); border-radius: 4px; border: 1px solid var(--color-border);">
                  <span style="color: var(--color-text-muted);">${s.label}:</span>
                  <span style="font-weight: 700;">${s.value}</span>
                </div>
              `).join('')}
            </div>
          </div>
        `;
      }

      window.RentEquip.UI.openModal('quick-view-modal');
    }
  };

  window.RentEquip = window.RentEquip || {};
  window.RentEquip.Marketplace = Marketplace;

  document.addEventListener('DOMContentLoaded', () => {
    Marketplace.init();
  });
})(window);
