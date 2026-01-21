
import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { db } from '../lib/db';
import { UserRole } from '../types';

// In a real production app, this would be an environment variable
const ADMIN_SECRET_KEY = "HUB-ADMIN-2025";

export const Signup: React.FC = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [fullName, setFullName] = useState('');
  const [role, setRole] = useState<UserRole>('seeker');
  const [adminKey, setAdminKey] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    if (loading) return;

    setLoading(true);
    setError(null);

    // Restriction Logic for Admin Account
    if (role === 'admin' && adminKey !== ADMIN_SECRET_KEY) {
      setError('Invalid Admin Authorization Key. You are not authorized to create an administrative account.');
      setLoading(false);
      return;
    }

    try {
      const { data } = await db.auth.signUp({
        email,
        password,
        options: {
          data: { full_name: fullName, role },
        }
      });
      
      // Navigate to dashboard based on role
      if (role === 'admin') {
        navigate('/admin/dashboard');
      } else if (role === 'provider') {
        navigate('/provider/dashboard');
      } else {
        navigate('/seeker/dashboard');
      }
    } catch (err: any) {
      setError(err.message || 'A network error occurred. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[calc(100vh-64px)] flex items-center justify-center px-4 bg-gray-50 py-12">
      <div className="max-w-xl w-full bg-white rounded-[40px] shadow-2xl p-8 md:p-12 border border-gray-100">
        <div className="text-center mb-10">
          <div className="w-16 h-16 bg-green-50 rounded-2xl flex items-center justify-center text-3xl mx-auto mb-6 text-[#00875A]">✨</div>
          <h2 className="text-3xl font-black text-gray-900 tracking-tight">Join SkillHubNaija</h2>
          <p className="text-gray-500 mt-2 font-medium">Start your journey today</p>
        </div>

        {error && (
          <div className="mb-8 p-4 rounded-2xl text-sm font-bold border bg-red-50 text-red-600 border-red-100 flex items-start gap-3 animate-in fade-in slide-in-from-top-2">
            <span className="mt-0.5">⚠️</span>
            <p>{error}</p>
          </div>
        )}

        <form onSubmit={handleSignup} className="space-y-6">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
            <button
              type="button"
              onClick={() => { setRole('seeker'); setError(null); }}
              className={`py-4 px-4 rounded-2xl font-black text-sm border-2 transition-all flex flex-col items-center gap-2 ${
                role === 'seeker' ? 'border-[#00875A] bg-green-50 text-[#00875A]' : 'border-gray-100 text-gray-400 grayscale'
              }`}
            >
              <span className="text-xl">🔍</span>
              Seeker
            </button>
            <button
              type="button"
              onClick={() => { setRole('provider'); setError(null); }}
              className={`py-4 px-4 rounded-2xl font-black text-sm border-2 transition-all flex flex-col items-center gap-2 ${
                role === 'provider' ? 'border-[#00875A] bg-green-50 text-[#00875A]' : 'border-gray-100 text-gray-400 grayscale'
              }`}
            >
              <span className="text-xl">💼</span>
              Provider
            </button>
            <button
              type="button"
              onClick={() => { setRole('admin'); setError(null); }}
              className={`py-4 px-4 rounded-2xl font-black text-sm border-2 transition-all flex flex-col items-center gap-2 ${
                role === 'admin' ? 'border-purple-600 bg-purple-50 text-purple-600' : 'border-gray-100 text-gray-400 grayscale'
              }`}
            >
              <span className="text-xl">🛡️</span>
              Admin
            </button>
          </div>

          <div className="space-y-4">
            {role === 'admin' && (
              <div className="p-6 bg-purple-50 rounded-3xl border border-purple-100 mb-6 animate-in zoom-in-95 duration-300">
                <label className="block text-[11px] font-black text-purple-400 uppercase tracking-widest mb-2 px-1">Admin Access Key</label>
                <div className="relative">
                  <input
                    type="password"
                    required
                    value={adminKey}
                    onChange={(e) => setAdminKey(e.target.value)}
                    className="w-full px-5 py-4 bg-white border border-purple-200 rounded-2xl outline-none focus:ring-2 focus:ring-purple-600 transition-all font-mono text-center tracking-widest"
                    placeholder="ENTER SECRET KEY"
                  />
                  <div className="absolute right-4 top-1/2 -translate-y-1/2 text-purple-200">🛡️</div>
                </div>
                <p className="mt-2 text-[10px] text-purple-400 font-bold text-center italic">Authorization required for administrative oversight.</p>
              </div>
            )}

            <div>
              <label className="block text-[13px] font-black text-gray-400 uppercase tracking-widest mb-2 px-1">Full Name</label>
              <input
                type="text"
                required
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                className="w-full px-5 py-4 bg-gray-50 border border-gray-100 rounded-2xl outline-none focus:ring-2 focus:ring-[#00875A] transition-all font-medium"
                placeholder="John Doe"
              />
            </div>

            <div>
              <label className="block text-[13px] font-black text-gray-400 uppercase tracking-widest mb-2 px-1">Email Address</label>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-5 py-4 bg-gray-50 border border-gray-100 rounded-2xl outline-none focus:ring-2 focus:ring-[#00875A] transition-all font-medium"
                placeholder="john@example.com"
              />
            </div>

            <div>
              <label className="block text-[13px] font-black text-gray-400 uppercase tracking-widest mb-2 px-1">Password</label>
              <input
                type="password"
                required
                minLength={6}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-5 py-4 bg-gray-50 border border-gray-100 rounded-2xl outline-none focus:ring-2 focus:ring-[#00875A] transition-all font-medium"
                placeholder="••••••••"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className={`w-full py-5 text-white font-black rounded-2xl shadow-xl transition-all active:scale-95 disabled:opacity-50 flex items-center justify-center gap-3 text-lg ${
              role === 'admin' ? 'bg-purple-600 shadow-purple-100 hover:bg-purple-700' : 'bg-[#00875A] shadow-green-100 hover:bg-[#006F4A]'
            }`}
          >
            {loading ? 'Creating Account...' : role === 'admin' ? 'Verify & Create Admin' : 'Create Account'}
          </button>
        </form>

        <p className="mt-10 text-center text-gray-500 font-medium">
          Already have an account? <Link to="/login" className="text-[#00875A] font-black hover:underline">Log in</Link>
        </p>
      </div>
    </div>
  );
};
