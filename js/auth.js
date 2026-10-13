/**
 * RentEquip - Simulated Authentication & Role Switching
 * Enables seamless instant switching between Customer, Owner, and Admin roles.
 */

(function (window) {
  'use strict';

  const Auth = {
    getUser() {
      return window.RentEquip.Storage.getCurrentUser();
    },

    getRole() {
      const u = this.getUser();
      return u ? u.role : 'customer';
    },

    isCustomer() {
      return this.getRole() === 'customer';
    },

    isOwner() {
      return this.getRole() === 'owner';
    },

    isAdmin() {
      return this.getRole() === 'admin';
    },

    getAllUsers() {
      return window.RentEquip.Storage.getUsers();
    },

    switchUser(userId) {
      const u = window.RentEquip.Storage.setCurrentUser(userId);
      if (u) {
        if (window.RentEquip.UI && window.RentEquip.UI.showToast) {
          window.RentEquip.UI.showToast(`Switched perspective to ${u.name} (${u.role.toUpperCase()})`, 'info');
        }
        // Dispatch role change event
        window.dispatchEvent(new CustomEvent('rentequip:auth_change', { detail: u }));
      }
      return u;
    }
  };

  window.RentEquip = window.RentEquip || {};
  window.RentEquip.Auth = Auth;
})(window);
