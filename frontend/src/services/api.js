// API Service for F-Guard Frontend
const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000';

class ApiService {
  constructor(baseURL = API_BASE_URL) {
    this.baseURL = baseURL;
  }

  async request(endpoint, options = {}) {
    const url = `${this.baseURL}${endpoint}`;
    const config = {
      headers: {
        'Content-Type': 'application/json',
        ...options.headers,
      },
      ...options,
    };

    try {
      const response = await fetch(url, config);
      
      if (!response.ok) {
        const error = await response.json().catch(() => ({}));
        throw new Error(error.detail || `HTTP error! status: ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      console.error('API request failed:', error);
      throw error;
    }
  }

  // Dashboard API
  async getDashboardStats() {
    return this.request('/api/dashboard/stats');
  }

  // Alerts API
  async getAlerts(filters = {}) {
    const params = new URLSearchParams();
    if (filters.status && filters.status !== 'All Alerts') {
      params.append('status', filters.status);
    }
    if (filters.search) {
      params.append('search', filters.search);
    }
    
    const queryString = params.toString();
    const endpoint = queryString ? `/api/alerts?${queryString}` : '/api/alerts';
    return this.request(endpoint);
  }

  async getAlert(id) {
    return this.request(`/api/alerts/${id}`);
  }

  async createAlert(alertData) {
    return this.request('/api/alerts', {
      method: 'POST',
      body: JSON.stringify(alertData),
    });
  }

  async updateAlert(id, updateData) {
    return this.request(`/api/alerts/${id}`, {
      method: 'PATCH',
      body: JSON.stringify(updateData),
    });
  }

  async deleteAlert(id) {
    return this.request(`/api/alerts/${id}`, {
      method: 'DELETE',
    });
  }

  // Reports API
  async getReportStats(range = 'Month') {
    return this.request(`/api/reports/stats?range=${range}`);
  }

  // Settings API
  async getSettings() {
    return this.request('/api/settings');
  }

  async updateSettings(settingsData) {
    return this.request('/api/settings', {
      method: 'PUT',
      body: JSON.stringify(settingsData),
    });
  }

  // Health check
  async healthCheck() {
    return this.request('/health');
  }
}

// Create and export a singleton instance
const apiService = new ApiService();
export default apiService;
