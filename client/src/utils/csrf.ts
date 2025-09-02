/**
 * CSRF Token Management for API Calls
 * Handles CSRF token retrieval and inclusion in requests
 */

class CSRFManager {
  private token: string | null = null;
  private tokenExpiry: number = 0;

  /**
   * Get CSRF token, fetching from server if needed
   */
  async getToken(): Promise<string> {
    // Check if we have a valid token
    if (this.token && Date.now() < this.tokenExpiry) {
      return this.token;
    }

    try {
      // Fetch new token from server
      const response = await fetch('/api/csrf-token', {
        method: 'GET',
        credentials: 'include', // Include cookies for session
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error(`Failed to fetch CSRF token: ${response.status}`);
      }

      const data = await response.json() as { token?: string };
      if (!data.token) {
        throw new Error('No CSRF token received from server');
      }
      this.token = data.token;
      this.tokenExpiry = Date.now() + (23 * 60 * 60 * 1000); // 23 hours (slightly less than server expiry)

      return this.token;
    } catch (error) {
      console.error('Error fetching CSRF token:', error);
      throw new Error('Failed to get CSRF token');
    }
  }

  /**
   * Make an authenticated API request with CSRF protection
   */
  async request<T>(
    url: string,
    options: RequestInit = {}
  ): Promise<T> {
    const token = await this.getToken();

    const requestOptions: RequestInit = {
      ...options,
      credentials: 'include', // Include cookies for session
      headers: {
        'Content-Type': 'application/json',
        'X-CSRF-Token': token,
        ...options.headers,
      },
    };

    const response = await fetch(url, requestOptions);

    if (!response.ok) {
      if (response.status === 403) {
        // CSRF token might be invalid, try to refresh
        this.token = null;
        this.tokenExpiry = 0;
        throw new Error('CSRF token invalid, please try again');
      }
      throw new Error(`API request failed: ${response.status}`);
    }

    return response.json();
  }

  /**
   * Clear stored token (useful for logout)
   */
  clearToken(): void {
    this.token = null;
    this.tokenExpiry = 0;
  }
}

// Export singleton instance
export const csrfManager = new CSRFManager();

/**
 * Convenience functions for common HTTP methods
 */
export const csrfApi = {
  get: <T>(url: string, options?: RequestInit): Promise<T> =>
    csrfManager.request<T>(url, { ...options, method: 'GET' }),

  post: <T>(url: string, data?: any, options?: RequestInit): Promise<T> =>
    csrfManager.request<T>(url, {
      ...options,
      method: 'POST',
      body: data ? JSON.stringify(data) : undefined,
    }),

  put: <T>(url: string, data?: any, options?: RequestInit): Promise<T> =>
    csrfManager.request<T>(url, {
      ...options,
      method: 'PUT',
      body: data ? JSON.stringify(data) : undefined,
    }),

  delete: <T>(url: string, options?: RequestInit): Promise<T> =>
    csrfManager.request<T>(url, { ...options, method: 'DELETE' }),

  patch: <T>(url: string, data?: any, options?: RequestInit): Promise<T> =>
    csrfManager.request<T>(url, {
      ...options,
      method: 'PATCH',
      body: data ? JSON.stringify(data) : undefined,
    }),
}; 