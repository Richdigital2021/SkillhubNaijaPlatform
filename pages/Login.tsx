
import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { db } from '../lib/db';

export const Login: React.FC = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const { data } = await db.auth.signIn({ email, password });
      if (data.session.profile.role === 'provider') {
        navigate('/provider/dashboard');
      } else {
        navigate('/seeker/dashboard');
      }
    } catch (err: any) {
      setError(err.message || 'Invalid email or password');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[calc(100vh-64px)] flex items-center justify-center px-4 bg-gray-50">
      <div className="max-w-md w-full bg-white rounded-[40px] shadow-2xl p-8 md:p-12 border border-gray-100">
        <div className="text-center mb-10">
          <div className="w-16 h-16 bg-orange-50 rounded-2xl flex items-center justify-center text-3xl mx-auto mb-6 text-[#E67E22]">👋</div>
          <h2 className="text-3xl font-black text-gray-900 tracking-tight">Welcome Back</h2>
          <p className="text-gray-500 mt-2 font-medium">Log in to your account</p>
        </div>

        {error && (
          <div className="mb-8 p-4 bg-red-50 text-red-600 rounded-2xl text-sm font-bold border border-red-100">
            {error}
          </div>
        )}

        <form onSubmit={handleLogin} className="space-y-6">
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
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-5 py-4 bg-gray-50 border border-gray-100 rounded-2xl outline-none focus:ring-2 focus:ring-[#00875A] transition-all font-medium"
              placeholder="••••••••"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-5 bg-[#00875A] text-white font-black rounded-2xl shadow-xl shadow-green-100 hover:bg-[#006F4A] transition-all active:scale-95 disabled:opacity-50 text-lg"
          >
            {loading ? 'Logging in...' : 'Log In'}
          </button>
        </form>

        <p className="mt-10 text-center text-gray-500 font-medium">
          Don't have an account? <Link to="/signup" className="text-[#00875A] font-black hover:underline">Sign up</Link>
        </p>
      </div>
    </div>
  );
};
