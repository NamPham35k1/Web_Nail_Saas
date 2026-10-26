// NailVibe API Client

const BASE_URL = '/api';

export function getToken(): string | null {
  return localStorage.getItem('nailvibe_token');
}

export function setToken(token: string) {
  localStorage.setItem('nailvibe_token', token);
}

export function removeToken() {
  localStorage.removeItem('nailvibe_token');
  localStorage.removeItem('nailvibe_active_tenant');
}

export function getActiveTenant(): any | null {
  const data = localStorage.getItem('nailvibe_active_tenant');
  if (!data) return null;
  try {
    return JSON.parse(data);
  } catch (e) {
    return null;
  }
}

export function setActiveTenant(tenant: any) {
  localStorage.setItem('nailvibe_active_tenant', JSON.stringify(tenant));
}

async function request<T = any>(endpoint: string, options: RequestInit = {}): Promise<T> {
  const token = getToken();
  const activeTenant = getActiveTenant();

  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    ...(options.headers as Record<string, string> || {})
  };

  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  if (activeTenant?.id) {
    headers['x-tenant-id'] = activeTenant.id;
  }

  const res = await fetch(`${BASE_URL}${endpoint}`, {
    ...options,
    headers
  });

  const data = await res.json().catch(() => ({}));

  if (!res.ok) {
    const errorMsg = data.error || `Yêu cầu thất bại (${res.status})`;
    throw new Error(errorMsg);
  }

  return data;
}

export const api = {
  // Auth
  register: (body: any) => request('/auth/register', { method: 'POST', body: JSON.stringify(body) }),
  login: (body: any) => request('/auth/login', { method: 'POST', body: JSON.stringify(body) }),
  getMe: () => request('/auth/me'),

  // Onboarding
  getOnboardingDraft: () => request('/onboarding/draft'),
  saveOnboardingStep: (step: number, data: any) => request('/onboarding/step', { method: 'POST', body: JSON.stringify({ step, data }) }),
  applySampleTemplate: () => request('/onboarding/apply-sample', { method: 'POST' }),
  publishWebsite: () => request('/onboarding/publish', { method: 'POST' }),

  // Public Booking (/s/:slug)
  getPublicSalon: (slug: string) => request(`/public/salon/${slug}`),
  getPublicSlots: (slug: string, date: string, serviceId?: string, staffId?: string) => {
    const params = new URLSearchParams({ date });
    if (serviceId) params.append('serviceId', serviceId);
    if (staffId) params.append('staffId', staffId);
    return request(`/public/salon/${slug}/slots?${params.toString()}`);
  },
  bookPublicAppointment: (slug: string, body: any) => request(`/public/salon/${slug}/book`, { method: 'POST', body: JSON.stringify(body) }),

  // Tenant / Salon Settings
  getCurrentTenant: () => request('/tenant/current'),
  checkSlugAvailability: (slug: string) => request(`/tenant/check-slug?slug=${encodeURIComponent(slug)}`),
  updateSlug: (slug: string) => request('/tenant/slug', { method: 'PUT', body: JSON.stringify({ slug }) }),
  updateProfile: (body: any) => request('/tenant/profile', { method: 'PUT', body: JSON.stringify(body) }),
  updateSettings: (body: any) => request('/tenant/settings', { method: 'PUT', body: JSON.stringify(body) }),
  getWorkingHours: () => request('/tenant/working-hours'),
  updateWorkingHours: (workingHours: any[]) => request('/tenant/working-hours', { method: 'PUT', body: JSON.stringify({ workingHours }) }),
  togglePublish: () => request('/tenant/publish-toggle', { method: 'POST' }),

  // Services
  getServices: () => request('/services'),
  createService: (body: any) => request('/services', { method: 'POST', body: JSON.stringify(body) }),
  updateService: (id: string, body: any) => request(`/services/${id}`, { method: 'PUT', body: JSON.stringify(body) }),
  deleteService: (id: string) => request(`/services/${id}`, { method: 'DELETE' }),

  // Staff
  getStaff: () => request('/staff'),
  createStaff: (body: any) => request('/staff', { method: 'POST', body: JSON.stringify(body) }),
  updateStaff: (id: string, body: any) => request(`/staff/${id}`, { method: 'PUT', body: JSON.stringify(body) }),
  deleteStaff: (id: string) => request(`/staff/${id}`, { method: 'DELETE' }),

  // Appointments
  getAppointments: (params?: Record<string, string>) => {
    const query = new URLSearchParams(params).toString();
    return request(`/appointments${query ? `?${query}` : ''}`);
  },
  createAppointment: (body: any) => request('/appointments', { method: 'POST', body: JSON.stringify(body) }),
  updateAppointmentStatus: (id: string, status: string) => request(`/appointments/${id}/status`, { method: 'PATCH', body: JSON.stringify({ status }) }),
  deleteAppointment: (id: string) => request(`/appointments/${id}`, { method: 'DELETE' }),

  // Customers
  getCustomers: (search?: string) => request(`/customers${search ? `?search=${encodeURIComponent(search)}` : ''}`),

  // Dashboard Stats
  getDashboardStats: () => request('/stats/dashboard'),

  // Upload
  uploadImage: async (file: File) => {
    const token = getToken();
    const activeTenant = getActiveTenant();
    const formData = new FormData();
    formData.append('image', file);

    const headers: Record<string, string> = {};
    if (token) headers['Authorization'] = `Bearer ${token}`;
    if (activeTenant?.id) headers['x-tenant-id'] = activeTenant.id;

    const res = await fetch(`${BASE_URL}/upload`, {
      method: 'POST',
      headers,
      body: formData
    });

    const data = await res.json();
    if (!res.ok) throw new Error(data.error || 'Lỗi tải ảnh');
    return data;
  }
};
