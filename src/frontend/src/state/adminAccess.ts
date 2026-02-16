/**
 * Admin access state management using localStorage.
 * Controls whether the Admin screen is accessible in the UI.
 */

const ADMIN_ACCESS_KEY = 'callaway-admin-access-enabled';

/**
 * Check if admin access is enabled
 */
export function isAdminAccessEnabled(): boolean {
  try {
    const stored = localStorage.getItem(ADMIN_ACCESS_KEY);
    return stored === 'true';
  } catch {
    return false;
  }
}

/**
 * Set admin access enabled state and emit change event
 */
export function setAdminAccessEnabled(enabled: boolean): void {
  try {
    localStorage.setItem(ADMIN_ACCESS_KEY, enabled ? 'true' : 'false');
    // Emit custom event for same-tab reactivity
    window.dispatchEvent(new Event('admin-access-changed'));
  } catch (error) {
    console.error('Failed to save admin access setting:', error);
  }
}
