
import React, { useEffect, useState } from 'react';
import { HashRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { db } from './lib/db';
import { Profile } from './types';
import { Layout } from './components/Layout';
import { Landing } from './pages/Landing';
import { Login } from './pages/Login';
import { Signup } from './pages/Signup';
import { SeekerDashboard } from './pages/SeekerDashboard';
import { ProviderDashboard } from './pages/ProviderDashboard';
import { AdminDashboard } from './pages/AdminDashboard';
import { ServiceDetail } from './pages/ServiceDetail';
import { CreateService } from './pages/CreateService';
import { ProfileSettings } from './pages/ProfileSettings';

const App: React.FC = () => {
  const [session, setSession] = useState<any>(null);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkAuth = () => {
      const currentSession = db.auth.getSession();
      if (currentSession) {
        setSession(currentSession.user);
        setProfile(currentSession.profile);
      } else {
        setSession(null);
        setProfile(null);
      }
      setLoading(false);
    };

    checkAuth();
    window.addEventListener('auth-change', checkAuth);
    window.addEventListener('storage', checkAuth);
    return () => {
      window.removeEventListener('auth-change', checkAuth);
      window.removeEventListener('storage', checkAuth);
    };
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="animate-spin rounded-full h-12 w-12 border-4 border-[#00875A] border-t-transparent"></div>
      </div>
    );
  }

  const getDashboardPath = () => {
    if (profile?.role === 'admin') return '/admin/dashboard';
    if (profile?.role === 'provider') return '/provider/dashboard';
    return '/seeker/dashboard';
  };

  return (
    <Router>
      <Layout isAuthenticated={!!session} userRole={profile?.role} profile={profile}>
        <Routes>
          <Route path="/" element={<Landing />} />
          <Route path="/login" element={!session ? <Login /> : <Navigate to={getDashboardPath()} replace />} />
          <Route path="/signup" element={!session ? <Signup /> : <Navigate to={getDashboardPath()} replace />} />
          
          {/* Dashboard Routes */}
          <Route path="/seeker/dashboard" element={session && profile?.role === 'seeker' ? <SeekerDashboard /> : <Navigate to="/login" replace />} />
          <Route path="/provider/dashboard" element={session && profile?.role === 'provider' ? <ProviderDashboard profile={profile} /> : <Navigate to="/login" replace />} />
          <Route path="/admin/dashboard" element={session && profile?.role === 'admin' ? <AdminDashboard /> : <Navigate to="/login" replace />} />
          
          {/* Action Routes */}
          <Route path="/service/:id" element={session ? <ServiceDetail profile={profile} /> : <Navigate to="/login" replace />} />
          <Route path="/provider/create-service" element={session && profile?.role === 'provider' ? <CreateService profile={profile} /> : <Navigate to="/login" replace />} />
          <Route path="/settings" element={session ? <ProfileSettings profile={profile} /> : <Navigate to="/login" replace />} />

          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </Layout>
    </Router>
  );
};

export default App;
