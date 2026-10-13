/**
 * RentEquip - Calculation Engine & Date Utilities
 * Pure financial, rental duration, and date overlap calculations.
 */

(function (window) {
  'use strict';

  const Calc = {
    /**
     * Parses YYYY-MM-DD safely into local Date object at 00:00:00
     */
    parseDate(dateStr) {
      if (!dateStr) return null;
      if (dateStr instanceof Date) return dateStr;
      const parts = dateStr.split('-');
      if (parts.length !== 3) return new Date(dateStr);
      return new Date(parseInt(parts[0], 10), parseInt(parts[1], 10) - 1, parseInt(parts[2], 10));
    },

    /**
     * Formats Date to YYYY-MM-DD
     */
    toISODateString(date) {
      if (!date) return '';
      const d = date instanceof Date ? date : new Date(date);
      const year = d.getFullYear();
      const month = String(d.getMonth() + 1).padStart(2, '0');
      const day = String(d.getDate()).padStart(2, '0');
      return `${year}-${month}-${day}`;
    },

    /**
     * Formats date nicely for display: "Oct 14, 2026"
     */
    formatDate(dateStr) {
      if (!dateStr) return 'N/A';
      const d = this.parseDate(dateStr);
      if (isNaN(d.getTime())) return dateStr;
      return d.toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
        year: 'numeric'
      });
    },

    /**
     * Returns today's date formatted as YYYY-MM-DD
     */
    getTodayISO() {
      const today = new Date();
      return this.toISODateString(today);
    },

    /**
     * Adds days to a date string and returns YYYY-MM-DD
     */
    addDays(dateStr, days) {
      const d = this.parseDate(dateStr);
      d.setDate(d.getDate() + days);
      return this.toISODateString(d);
    },

    /**
     * Calculates billable rental days.
     * Same day (pick up & return same day) = 1 day.
     * Consecutive days (e.g. Oct 10 to Oct 12) = 2 days (48 hrs) or 2 billing cycles.
     */
    calculateRentalDays(startDate, endDate) {
      if (!startDate || !endDate) return 0;
      const start = this.parseDate(startDate);
      const end = this.parseDate(endDate);

      if (isNaN(start.getTime()) || isNaN(end.getTime())) return 0;
      if (end < start) return 0;

      const diffTime = end.getTime() - start.getTime();
      const diffDays = Math.round(diffTime / (1000 * 60 * 60 * 24));

      // Same day pickup and return = 1 day minimum
      return diffDays === 0 ? 1 : diffDays;
    },

    /**
     * Comprehensive upfront rental cost calculation
     */
    calculateQuote(dailyRate, securityDeposit, startDate, endDate) {
      const rate = Number(dailyRate) || 0;
      const deposit = Number(securityDeposit) || 0;
      const days = this.calculateRentalDays(startDate, endDate);

      if (days <= 0) {
        return {
          days: 0,
          dailyRate: rate,
          rentalFee: 0,
          serviceFee: 0,
          securityDeposit: deposit,
          totalUpfront: 0,
          isValid: false,
          error: 'End date must be on or after start date.'
        };
      }

      // Base rental fee
      const rentalFee = Math.round(rate * days * 100) / 100;
      // 6% platform insurance & processing fee
      const serviceFee = Math.round(rentalFee * 0.06 * 100) / 100;
      // Total upfront charge: rental fee + service fee + refundable security deposit
      const totalUpfront = Math.round((rentalFee + serviceFee + deposit) * 100) / 100;

      return {
        days,
        dailyRate: rate,
        rentalFee,
        serviceFee,
        securityDeposit: deposit,
        totalUpfront,
        isValid: true,
        error: null
      };
    },

    /**
     * Checks if two date ranges overlap.
     * Overlap occurs when startA <= endB and startB <= endA
     */
    areDatesOverlapping(startA, endA, startB, endB) {
      const sA = this.parseDate(startA);
      const eA = this.parseDate(endA);
      const sB = this.parseDate(startB);
      const eB = this.parseDate(endB);

      if (!sA || !eA || !sB || !eB) return false;
      return sA.getTime() <= eB.getTime() && sB.getTime() <= eA.getTime();
    },

    /**
     * Calculates overdue days between scheduled end date and actual return date
     */
    calculateOverdueDays(scheduledEndDate, actualReturnDate) {
      if (!scheduledEndDate || !actualReturnDate) return 0;
      const sched = this.parseDate(scheduledEndDate);
      const actual = this.parseDate(actualReturnDate);

      if (isNaN(sched.getTime()) || isNaN(actual.getTime())) return 0;
      if (actual <= sched) return 0;

      const diffTime = actual.getTime() - sched.getTime();
      return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    },

    /**
     * Calculates late return penalty (1.5x daily rate for each overdue day)
     */
    calculateLatePenalty(dailyRate, lateDays) {
      const days = Number(lateDays) || 0;
      const rate = Number(dailyRate) || 0;
      if (days <= 0) return 0;
      return Math.round(days * (rate * 1.5) * 100) / 100;
    },

    /**
     * Calculates comprehensive return settlement and deposit refund
     */
    calculateSettlement({
      securityDeposit = 0,
      dailyRate = 0,
      scheduledEndDate,
      actualReturnDate,
      damageDeduction = 0
    }) {
      const deposit = Math.max(0, Number(securityDeposit) || 0);
      const rate = Math.max(0, Number(dailyRate) || 0);
      const damageFee = Math.max(0, Number(damageDeduction) || 0);

      const lateDays = this.calculateOverdueDays(scheduledEndDate, actualReturnDate);
      const latePenaltyFee = this.calculateLatePenalty(rate, lateDays);
      const totalDeductions = Math.round((latePenaltyFee + damageFee) * 100) / 100;

      // Deposit refund is the deposit minus deductions (bounded at 0)
      const depositRefund = Math.max(0, Math.round((deposit - totalDeductions) * 100) / 100);
      // If deductions exceed security deposit, customer owes the difference
      const additionalAmountOwed = Math.max(0, Math.round((totalDeductions - deposit) * 100) / 100);

      return {
        originalDeposit: deposit,
        lateDays,
        latePenaltyFee,
        damageFee,
        totalDeductions,
        depositRefund,
        additionalAmountOwed,
        isFullyRefunded: totalDeductions === 0,
        hasLateFee: lateDays > 0,
        hasDamageFee: damageFee > 0
      };
    },

    /**
     * Formats currency as $XX.XX
     */
    formatCurrency(amount) {
      const num = Number(amount) || 0;
      return new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: 'USD',
        minimumFractionDigits: 2,
        maximumFractionDigits: 2
      }).format(num);
    }
  };

  window.RentEquip = window.RentEquip || {};
  window.RentEquip.Calc = Calc;
})(window);
