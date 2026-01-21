
import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { db } from '../lib/db';
import { UserRole, Profile } from '../types';

interface LayoutProps {
  children: React.ReactNode;
  userRole?: UserRole;
  profile?: Profile | null;
  isAuthenticated: boolean;
}

export const Layout: React.FC<LayoutProps> = ({ children, userRole, profile, isAuthenticated }) => {
  const navigate = useNavigate();
  const [isProfileOpen, setIsProfileOpen] = useState(false);

  const handleLogout = async () => {
    setIsProfileOpen(false);
    await db.auth.signOut();
    navigate('/');
  };

  const handleLogoClick = () => {
    // Navigate home and ensure we scroll to top
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const getDashboardLink = () => {
    if (userRole === 'admin') return '/admin/dashboard';
    if (userRole === 'provider') return '/provider/dashboard';
    return '/seeker/dashboard';
  };

  return (
    <div className="min-h-screen flex flex-col font-sans">
      <header className="bg-white border-b sticky top-0 z-50">
        <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
          <Link to="/" onClick={handleLogoClick} className="flex items-center gap-2 group">
            <div className="w-10 h-10 bg-[#00875A] rounded-lg flex items-center justify-center text-white font-bold text-xl transition-transform group-hover:scale-110">
              S
            </div>
            <span className="text-2xl font-black text-[#1A1A1A] tracking-tight">SkillHubNaija</span>
          </Link>

          <div className="hidden md:flex items-center gap-8 text-[15px] font-semibold text-gray-600">
            <Link to="/#how-it-works" className="hover:text-[#00875A] transition-colors">How it Works</Link>
            <Link to="/#benefits" className="hover:text-[#00875A] transition-colors">Benefits</Link>
            <Link to="/#faq" className="hover:text-[#00875A] transition-colors">FAQ</Link>
          </div>

          <div className="flex items-center gap-4">
            {isAuthenticated ? (
              <div className="relative">
                <button 
                  onClick={() => setIsProfileOpen(!isProfileOpen)}
                  className="flex items-center gap-3 bg-gray-50 border rounded-full pl-1 pr-4 py-1 hover:border-[#00875A] transition-all"
                >
                  <div className="w-9 h-9 rounded-full bg-[#E67E22] flex items-center justify-center text-white font-bold uppercase overflow-hidden">
                    {profile?.avatar_url ? (
                      <img src={profile.avatar_url} alt={profile.full_name} className="w-full h-full object-cover" />
                    ) : (
                      profile?.full_name?.charAt(0) || 'U'
                    )}
                  </div>
                  <div className="text-left hidden sm:block">
                    <p className="text-[13px] font-bold text-gray-900 leading-none mb-0.5">{profile?.full_name || 'John Doe'}</p>
                    <span className="text-[11px] font-bold uppercase text-[#00875A] bg-green-50 px-1.5 py-0.5 rounded border border-green-100">
                      {userRole === 'admin' ? 'Admin' : userRole === 'provider' ? 'Provider' : 'Seeker'}
                    </span>
                  </div>
                  <svg className={`w-4 h-4 text-gray-400 transition-transform ${isProfileOpen ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" /></svg>
                </button>
                {isProfileOpen && (
                  <div className="absolute right-0 mt-2 w-48 bg-white border rounded-2xl shadow-xl overflow-hidden py-1 z-50 animate-in fade-in zoom-in duration-200">
                    <Link to={getDashboardLink()} className="block px-4 py-3 text-[14px] text-gray-700 hover:bg-gray-50 font-medium" onClick={() => setIsProfileOpen(false)}>Dashboard</Link>
                    <Link to="/settings" className="block px-4 py-3 text-[14px] text-gray-700 hover:bg-gray-50 font-medium" onClick={() => setIsProfileOpen(false)}>Settings</Link>
                    <button onClick={handleLogout} className="w-full text-left px-4 py-3 text-[14px] text-red-600 hover:bg-red-50 font-medium border-t">Logout</button>
                  </div>
                )}
              </div>
            ) : (
              <div className="flex items-center gap-3">
                <Link to="/login" className="text-gray-700 font-bold hover:text-[#00875A] px-4">Log in</Link>
                <Link to="/signup" className="bg-[#00875A] text-white px-6 py-3 rounded-full hover:bg-[#006F4A] font-bold shadow-lg shadow-green-200/50 transition-all active:scale-95">
                  Get Started →
                </Link>
              </div>
            )}
          </div>
        </nav>
      </header>

      <main className="flex-grow">
        {children}
      </main>

      <footer className="bg-[#0A0A0A] text-white pt-20 pb-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-16">
            <div className="col-span-1 md:col-span-2">
              <div className="flex items-center gap-2 mb-6">
                <div className="w-8 h-8 bg-[#00875A] rounded-md flex items-center justify-center text-white font-bold text-lg">S</div>
                <span className="text-xl font-bold">SkillHubNaija</span>
              </div>
              <p className="text-gray-400 text-lg max-w-sm mb-8">
                Connecting skilled professionals with people who need reliable services—fast, safe, and hassle-free.
              </p>
            </div>
            <div>
              <h4 className="text-white font-bold mb-6">Quick Links</h4>
              <ul className="space-y-4 text-gray-400 font-medium">
                <li><Link to="/#how-it-works" className="hover:text-[#00875A] transition-colors">How it Works</Link></li>
                <li><Link to="/#benefits" className="hover:text-[#00875A] transition-colors">Benefits</Link></li>
                <li><Link to="/#faq" className="hover:text-[#00875A] transition-colors">FAQ</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="text-white font-bold mb-6">Contact</h4>
              <ul className="space-y-4 text-gray-400 font-medium">
                <li>hello@skillhubnaija.com</li>
              </ul>
            </div>
          </div>
          <div className="pt-10 border-t border-gray-800 flex flex-col md:flex-row justify-between items-center text-gray-500 text-sm">
            <p>© 2024 SkillHubNaija. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
};
