const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:3001/api';

class ApiClient {
  private baseUrl: string;
  private token: string | null = null;

  constructor(baseUrl: string) {
    this.baseUrl = baseUrl;
    // Load token from localStorage on init
    if (typeof window !== 'undefined') {
      this.token = localStorage.getItem('auth_token');
    }
  }

  setToken(token: string | null) {
    this.token = token;
    if (token) {
      localStorage.setItem('auth_token', token);
    } else {
      localStorage.removeItem('auth_token');
    }
  }

  private async request<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<T> {
    const headers: HeadersInit = {
      'Content-Type': 'application/json',
      ...options.headers,
    };

    if (this.token) {
      (headers as Record<string, string>)['Authorization'] = `Bearer ${this.token}`;
    }

    const response = await fetch(`${this.baseUrl}${endpoint}`, {
      ...options,
      headers,
      credentials: 'include', // Important for cookies
    });

    // Session expired / invalid: clear local auth and notify listeners once.
    if (response.status === 401 && !endpoint.startsWith('/auth/')) {
      this.setToken(null);
      window.dispatchEvent(new CustomEvent('sabaicraft:session-expired'));
    }

    let data: any = {};
    try {
      const text = await response.text();
      data = text ? JSON.parse(text) : {};
    } catch {
      // Non-JSON response (proxy error page, empty body) — fall through.
      data = {};
    }

    if (!response.ok) {
      throw new ApiError(
        response.status,
        data.message || `Request failed (${response.status} ${response.statusText})`,
        data.errors
      );
    }

    return data;
  }

  // Auth
  async register(data: { firstName: string; lastName: string; email: string; password: string }) {
    return this.request<{ success: boolean; message?: string; data: { user: any; token: string } }>(`'/auth/register'`, {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  async login(email: string, password: string) {
    return this.request<{ success: boolean; message?: string; data: { user: any; token: string } }>('/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email, password }),
    });
  }

  async logout() {
    return this.request<{ success: boolean }>('/auth/logout', { method: 'POST' });
  }

  async getMe() {
    return this.request<{ success: boolean; data: { user: any } }>('/auth/me');
  }

  // Products
  async getProducts(params?: {
    query?: string;
    category?: string;
    minPrice?: number;
    maxPrice?: number;
    sort?: string;
    page?: number;
    limit?: number;
    inStock?: boolean;
  }) {
    const searchParams = new URLSearchParams();
    if (params) {
      Object.entries(params).forEach(([key, value]) => {
        if (value !== undefined && value !== null) {
          searchParams.append(key, String(value));
        }
      });
    }
    return this.request<{
      success: boolean;
      data: any[];
      pagination: { page: number; limit: number; total: number; totalPages: number };
    }>(`/products?${searchParams.toString()}`);
  }

  async getFeaturedProducts(limit = 8) {
    return this.request<{ success: boolean; data: any[] }>(`/products/featured?limit=${limit}`);
  }

  async getProductBySlug(slug: string) {
    return this.request<{ success: boolean; data: any }>(`/products/${slug}`);
  }

  async searchSuggestions(query: string) {
    return this.request<{ success: boolean; data: any[] }>(`/products/search/suggestions?q=${encodeURIComponent(query)}`);
  }

  // Categories
  async getCategories() {
    return this.request<{ success: boolean; data: any[] }>('/categories');
  }

  async getCategoryBySlug(slug: string, params?: {
    page?: number;
    limit?: number;
    sort?: string;
    minPrice?: number;
    maxPrice?: number;
    inStock?: boolean;
  }) {
    const searchParams = new URLSearchParams();
    if (params) {
      Object.entries(params).forEach(([key, value]) => {
        if (value !== undefined && value !== null) {
          searchParams.append(key, String(value));
        }
      });
    }
    return this.request<{ success: boolean; data: any }>(`/categories/${slug}?${searchParams.toString()}`);
  }

  // Cart
  async getCart() {
    return this.request<{ success: boolean; data: any }>('/cart');
  }

  async addToCart(productId: string, variantId: string, quantity = 1) {
    return this.request<{ success: boolean; data: any }>('/cart/items', {
      method: 'POST',
      body: JSON.stringify({ productId, variantId, quantity }),
    });
  }

  async updateCartItem(itemId: string, quantity: number) {
    return this.request<{ success: boolean; data: any }>(`/cart/items/${itemId}`, {
      method: 'PATCH',
      body: JSON.stringify({ quantity }),
    });
  }

  async removeCartItem(itemId: string) {
    return this.request<{ success: boolean; data: any }>(`/cart/items/${itemId}`, {
      method: 'DELETE',
    });
  }

  async clearCart() {
    return this.request<{ success: boolean; data: any }>('/cart', {
      method: 'DELETE',
    });
  }

  // Orders
  async getOrders(params?: { status?: string; page?: number; limit?: number }) {
    const searchParams = new URLSearchParams();
    if (params) {
      Object.entries(params).forEach(([key, value]) => {
        if (value !== undefined && value !== null) {
          searchParams.append(key, String(value));
        }
      });
    }
    return this.request<{
      success: boolean;
      data: any[];
      pagination: { page: number; limit: number; total: number; totalPages: number };
    }>(`/orders?${searchParams.toString()}`);
  }

  async getOrderById(id: string) {
    return this.request<{ success: boolean; data: any }>(`/orders/${id}`);
  }

  async createOrder(data: {
    shippingAddressId: string;
    billingAddressId?: string;
    paymentMethod: 'CARD' | 'UPI' | 'NETBANKING' | 'WALLET' | 'COD';
    notes?: string;
  }) {
    return this.request<{ success: boolean; data: any }>('/orders', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  // Wishlist
  async getWishlist() {
    return this.request<{ success: boolean; data: any[] }>('/wishlist');
  }

  async addToWishlist(productId: string, variantId?: string) {
    return this.request<{ success: boolean; data: any }>('/wishlist', {
      method: 'POST',
      body: JSON.stringify({ productId, variantId }),
    });
  }

  async removeFromWishlist(itemId: string) {
    return this.request<{ success: boolean }>(`/wishlist/${itemId}`, {
      method: 'DELETE',
    });
  }

  async clearWishlist() {
    return this.request<{ success: boolean }>('/wishlist', {
      method: 'DELETE',
    });
  }

  // User
  async getProfile() {
    return this.request<{ success: boolean; data: any }>('/user/profile');
  }

  async updateProfile(data: { name?: string; phone?: string }) {
    return this.request<{ success: boolean; data: any }>('/user/profile', {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  }

  async changePassword(currentPassword: string, newPassword: string) {
    return this.request<{ success: boolean }>('/user/password', {
      method: 'PUT',
      body: JSON.stringify({ currentPassword, newPassword }),
    });
  }

  async getAddresses() {
    return this.request<{ success: boolean; data: any[] }>('/user/addresses');
  }

  async createAddress(data: {
    name: string;
    phone: string;
    addressLine1: string;
    addressLine2?: string;
    city: string;
    state: string;
    postalCode: string;
    country?: string;
    type?: 'shipping' | 'billing';
    isDefault?: boolean;
  }) {
    return this.request<{ success: boolean; data: any }>('/user/addresses', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  async updateAddress(id: string, data: {
    name?: string;
    phone?: string;
    addressLine1?: string;
    addressLine2?: string;
    city?: string;
    state?: string;
    postalCode?: string;
    country?: string;
    type?: 'shipping' | 'billing';
    isDefault?: boolean;
  }) {
    return this.request<{ success: boolean; data: any }>(`/user/addresses/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  }

  async deleteAddress(id: string) {
    return this.request<{ success: boolean }>(`/user/addresses/${id}`, {
      method: 'DELETE',
    });
  }

  // Admin
  async getDashboard() {
    return this.request<{ success: boolean; data: any }>('/admin/dashboard');
  }

  async getAdminUsers(params?: { page?: number; limit?: number; search?: string; role?: string }) {
    const searchParams = new URLSearchParams();
    if (params) {
      Object.entries(params).forEach(([key, value]) => {
        if (value !== undefined && value !== null) {
          searchParams.append(key, String(value));
        }
      });
    }
    return this.request<{ success: boolean; data: any[] }>(`/admin/users?${searchParams.toString()}`);
  }

  async updateUserRole(userId: string, role: 'CUSTOMER' | 'ADMIN') {
    return this.request<{ success: boolean; data: any }>(`/admin/users/${userId}/role`, {
      method: 'PATCH',
      body: JSON.stringify({ role }),
    });
  }

  async getInventory(params?: { page?: number; limit?: number; lowStock?: boolean }) {
    const searchParams = new URLSearchParams();
    if (params) {
      Object.entries(params).forEach(([key, value]) => {
        if (value !== undefined && value !== null) {
          searchParams.append(key, String(value));
        }
      });
    }
    return this.request<{ success: boolean; data: any[] }>(`/admin/inventory?${searchParams.toString()}`);
  }

  async updateInventory(variantId: string, inventory: number) {
    return this.request<{ success: boolean; data: any }>(`/admin/inventory/${variantId}`, {
      method: 'PATCH',
      body: JSON.stringify({ inventory }),
    });
  }

  async getCoupons() {
    return this.request<{ success: boolean; data: any[] }>('/admin/coupons');
  }

  async createCoupon(data: any) {
    return this.request<{ success: boolean; data: any }>('/admin/coupons', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  async updateCoupon(id: string, data: any) {
    return this.request<{ success: boolean; data: any }>(`/admin/coupons/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  }

  async deleteCoupon(id: string) {
    return this.request<{ success: boolean }>(`/admin/coupons/${id}`, {
      method: 'DELETE',
    });
  }

  async getReviews(params?: { page?: number; limit?: number; status?: string }) {
    const searchParams = new URLSearchParams();
    if (params) {
      Object.entries(params).forEach(([key, value]) => {
        if (value !== undefined && value !== null) {
          searchParams.append(key, String(value));
        }
      });
    }
    return this.request<{ success: boolean; data: any[] }>(`/admin/reviews?${searchParams.toString()}`);
  }

  async approveReview(id: string) {
    return this.request<{ success: boolean; data: any }>(`/admin/reviews/${id}/approve`, {
      method: 'PATCH',
    });
  }

  async rejectReview(id: string) {
    return this.request<{ success: boolean; data: any }>(`/admin/reviews/${id}/reject`, {
      method: 'PATCH',
    });
  }
}

export class ApiError extends Error {
  public readonly status: number;
  public readonly errors?: Record<string, string[]>;

  constructor(status: number, message: string, errors?: Record<string, string[]>) {
    super(message);
    this.name = 'ApiError';
    this.status = status;
    this.errors = errors;
  }
}

export const api = new ApiClient(API_BASE);