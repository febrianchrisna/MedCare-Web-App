export const API_URL = 'http://localhost:5000';

export const ORDER_STATUS = {
  PENDING: 'pending',
  PROCESSING: 'processing',
  SHIPPED: 'shipped',
  COMPLETED: 'completed',
  CANCELLED: 'cancelled'
};

export const STATUS_COLORS = {
  pending: 'warning',
  processing: 'primary',
  shipped: 'info',
  completed: 'success',
  cancelled: 'danger'
};

export const MEDICINE_DEFAULT_IMG = '/medicine-placeholder.png';

// Storage keys
export const STORAGE_KEYS = {
  TOKEN: 'apotek_token',
  USER: 'apotek_user',
  CART: 'apotek_cart'
};
