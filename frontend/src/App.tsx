import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';

import { LandingPage } from './pages/LandingPage';
import { LoginPage } from './pages/Auth/LoginPage';
import { RegisterPage } from './pages/Auth/RegisterPage';
import { OnboardingWizard } from './pages/Onboarding/OnboardingWizard';
import { PublicBookingPage } from './pages/PublicBooking/PublicBookingPage';

import { DashboardLayout } from './layouts/DashboardLayout';
import { Overview } from './pages/Dashboard/Overview';
import { AppointmentsPage } from './pages/Dashboard/AppointmentsPage';
import { ServicesPage } from './pages/Dashboard/ServicesPage';
import { StaffPage } from './pages/Dashboard/StaffPage';
import { CustomersPage } from './pages/Dashboard/CustomersPage';
import { SettingsPage } from './pages/Dashboard/SettingsPage';

// Protected Route Wrapper for Onboarding
const ProtectedOnboarding: React.FC = () => {
  const { user, loading } = useAuth();
  if (loading) return null;
  if (!user) return <Navigate to="/login" replace />;
  return <OnboardingWizard />;
};

export const App: React.FC = () => {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          {/* Public Landing & Marketing */}
          <Route path="/" element={<LandingPage />} />

          {/* Authentication */}
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />

          {/* Onboarding Wizard */}
          <Route path="/onboarding" element={<ProtectedOnboarding />} />

          {/* Public Booking Website for each salon */}
          <Route path="/s/:slug" element={<PublicBookingPage />} />

          {/* Protected Salon Owner Dashboard */}
          <Route path="/dashboard" element={<DashboardLayout />}>
            <Route index element={<Overview />} />
            <Route path="appointments" element={<AppointmentsPage />} />
            <Route path="services" element={<ServicesPage />} />
            <Route path="staff" element={<StaffPage />} />
            <Route path="customers" element={<CustomersPage />} />
            <Route path="settings" element={<SettingsPage />} />
          </Route>

          {/* Fallback */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
};

export default App;
