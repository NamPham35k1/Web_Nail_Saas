import React, { createContext, useContext, useState, useEffect } from 'react';
import { api, getToken, setToken, removeToken, getActiveTenant, setActiveTenant } from '../api/client';

interface User {
  id: string;
  email: string;
  fullName: string;
  phone?: string;
}

interface Tenant {
  id: string;
  name: string;
  slug: string;
  role?: string;
  isPublished?: boolean;
  plan?: string;
  onboarding?: any;
}

interface AuthContextType {
  user: User | null;
  activeTenant: Tenant | null;
  tenants: Tenant[];
  loading: boolean;
  login: (credentials: any) => Promise<void>;
  register: (data: any) => Promise<void>;
  logout: () => void;
  switchTenant: (tenant: Tenant) => void;
  updateActiveTenant: (tenant: Partial<Tenant>) => void;
  refreshUser: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [activeTenant, setActiveTenantState] = useState<Tenant | null>(getActiveTenant());
  const [tenants, setTenants] = useState<Tenant[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  const refreshUser = async () => {
    try {
      const token = getToken();
      if (!token) {
        setUser(null);
        setActiveTenantState(null);
        setTenants([]);
        setLoading(false);
        return;
      }

      const res = await api.getMe();
      if (res.user) {
        setUser({
          id: res.user.id,
          email: res.user.email,
          fullName: res.user.fullName,
          phone: res.user.phone
        });

        const userTenants = res.user.memberships?.map((m: any) => ({
          id: m.tenant.id,
          name: m.tenant.name,
          slug: m.tenant.slug,
          role: m.role,
          isPublished: m.tenant.isPublished,
          plan: m.tenant.plan,
          onboarding: m.tenant.onboardingDraft
        })) || [];

        setTenants(userTenants);

        // Retain or select active tenant
        const cached = getActiveTenant();
        const matched = userTenants.find((t: any) => t.id === cached?.id) || userTenants[0];
        if (matched) {
          setActiveTenantState(matched);
          setActiveTenant(matched);
        }
      }
    } catch (err) {
      console.error('Failed to restore session:', err);
      removeToken();
      setUser(null);
      setActiveTenantState(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    refreshUser();
  }, []);

  const login = async (credentials: any) => {
    const res = await api.login(credentials);
    setToken(res.token);
    setUser(res.user);
    setTenants(res.tenants || []);
    if (res.activeTenant) {
      setActiveTenantState(res.activeTenant);
      setActiveTenant(res.activeTenant);
    }
  };

  const register = async (data: any) => {
    const res = await api.register(data);
    setToken(res.token);
    setUser(res.user);
    if (res.tenant) {
      const initialTenant = {
        ...res.tenant,
        role: 'OWNER',
        onboarding: res.onboarding
      };
      setActiveTenantState(initialTenant);
      setActiveTenant(initialTenant);
      setTenants([initialTenant]);
    }
  };

  const logout = () => {
    removeToken();
    setUser(null);
    setActiveTenantState(null);
    setTenants([]);
  };

  const switchTenant = (tenant: Tenant) => {
    setActiveTenantState(tenant);
    setActiveTenant(tenant);
    window.location.reload();
  };

  const updateActiveTenant = (updates: Partial<Tenant>) => {
    if (!activeTenant) return;
    const updated = { ...activeTenant, ...updates };
    setActiveTenantState(updated);
    setActiveTenant(updated);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        activeTenant,
        tenants,
        loading,
        login,
        register,
        logout,
        switchTenant,
        updateActiveTenant,
        refreshUser
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
