import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { LanguageProvider } from './context/LanguageContext';
import { DataProvider } from './context/DataContext';
import { AdminAuthProvider, useAdminAuth } from './context/AdminAuthContext';
import { AIAssistantProvider } from './context/AIAssistantContext';
import { RootLayout } from './layouts/RootLayout';
import { HomePage } from './pages/HomePage';
import { PackagesPage } from './pages/PackagesPage';
import { PackageDetailPage } from './pages/PackageDetailPage';
import { DestinationsPage } from './pages/DestinationsPage';
import { BookingPage } from './pages/BookingPage';
import { AboutPage } from './pages/AboutPage';
import { ContactPage } from './pages/ContactPage';
import { NotFoundPage } from './pages/NotFoundPage';
import { AdminLoginPage } from './pages/admin/AdminLoginPage';
import { AdminDashboardPage } from './pages/admin/AdminDashboardPage';

/**
 * Route guard that redirects unauthenticated users to /admin/login
 */
const ProtectedAdminRoute: React.FC = () => {
  const { isAuthenticated } = useAdminAuth();
  if (!isAuthenticated) {
    return <Navigate to="/admin/login" replace />;
  }
  return <AdminDashboardPage />;
};

/**
 * Login route that redirects already authenticated users to /admin
 */
const AdminLoginRoute: React.FC = () => {
  const { isAuthenticated } = useAdminAuth();
  if (isAuthenticated) {
    return <Navigate to="/admin" replace />;
  }
  return <AdminLoginPage />;
};

export default function App() {
  return (
    <DataProvider>
      <LanguageProvider>
        <AdminAuthProvider>
          <AIAssistantProvider>
            <BrowserRouter>
              <Routes>
                {/* Public Website Routes */}
                <Route path="/" element={<RootLayout />}>
                  <Route index element={<HomePage />} />
                  <Route path="packages" element={<PackagesPage />} />
                  <Route path="packages/:slug" element={<PackageDetailPage />} />
                  <Route path="destinations" element={<DestinationsPage />} />
                  <Route path="booking" element={<BookingPage />} />
                  <Route path="about" element={<AboutPage />} />
                  <Route path="contact" element={<ContactPage />} />
                  <Route path="*" element={<NotFoundPage />} />
                </Route>

                {/* Admin Panel Routes (Isolated from public layout) */}
                <Route path="/admin/login" element={<AdminLoginRoute />} />
                <Route path="/admin" element={<ProtectedAdminRoute />} />
                <Route path="/admin/dashboard" element={<Navigate to="/admin" replace />} />
              </Routes>
            </BrowserRouter>
          </AIAssistantProvider>
        </AdminAuthProvider>
      </LanguageProvider>
    </DataProvider>
  );
}
