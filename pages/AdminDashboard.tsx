
import React, { useEffect, useState } from 'react';
import { db } from '../lib/db';
import { Profile, Service, Booking, Payment } from '../types';

export const AdminDashboard: React.FC = () => {
  const [profiles, setProfiles] = useState<Profile[]>([]);
  const [services, setServices] = useState<Service[]>([]);
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [payments, setPayments] = useState<Payment[]>([]);
  const [loading, setLoading] = useState(true);
  const [tab, setTab] = useState<'users' | 'bookings' | 'payments'>('users');

  useEffect(() => {
    fetchAdminData();
  }, []);

  const fetchAdminData = async () => {
    const pData = await db.profiles.getAll();
    const sData = await db.services.getAll();
    const bData = await db.bookings.getAll();
    const payData = await db.payments.getAll();
    
    setProfiles(pData);
    setServices(sData);
    setBookings(bData);
    setPayments(payData);
    setLoading(false);
  };

  if (loading) return <div className="p-10 text-center">Loading admin panel...</div>;

  const totalRev = payments.filter(p => p.status === 'successful').reduce((acc, curr) => acc + curr.amount, 0);

  return (
    <div className="max-w-7xl mx-auto px-4 py-10">
      <div className="mb-12">
        <h1 className="text-4xl font-black text-gray-900 mb-2">Admin Control Panel</h1>
        <p className="text-gray-500">Global oversight and platform management</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-12">
        {[
          { label: 'Total Users', val: profiles.length, color: 'bg-white' },
          { label: 'Total Services', val: services.length, color: 'bg-white' },
          { label: 'Total Bookings', val: bookings.length, color: 'bg-white' },
          { label: 'Total Revenue', val: `₦${totalRev.toLocaleString()}`, color: 'bg-[#00875A] text-white' }
        ].map((stat, i) => (
          <div key={i} className={`p-6 rounded-3xl shadow-sm border border-gray-100 ${stat.color}`}>
            <p className="text-[10px] font-black uppercase tracking-widest opacity-60 mb-1">{stat.label}</p>
            <p className="text-3xl font-black">{stat.val}</p>
          </div>
        ))}
      </div>

      <div className="bg-white rounded-[40px] border shadow-sm overflow-hidden">
        <div className="flex border-b">
          {(['users', 'bookings', 'payments'] as const).map(t => (
            <button
              key={t}
              onClick={() => setTab(t)}
              className={`flex-1 py-6 font-black text-sm uppercase tracking-widest transition-all ${
                tab === t ? 'bg-gray-50 border-b-4 border-[#00875A] text-[#00875A]' : 'text-gray-400 hover:text-gray-600'
              }`}
            >
              {t}
            </button>
          ))}
        </div>

        <div className="p-8">
          {tab === 'users' && (
            <table className="w-full text-left">
              <thead>
                <tr className="text-gray-400 text-[10px] font-black uppercase tracking-widest border-b">
                  <th className="pb-4">User</th>
                  <th className="pb-4">Role</th>
                  <th className="pb-4">Joined</th>
                </tr>
              </thead>
              <tbody className="divide-y">
                {profiles.map(p => (
                  <tr key={p.id} className="hover:bg-gray-50 transition-colors">
                    <td className="py-4 font-bold">{p.full_name}</td>
                    <td className="py-4">
                      <span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase ${
                        p.role === 'admin' ? 'bg-purple-50 text-purple-600' :
                        p.role === 'provider' ? 'bg-green-50 text-green-600' : 'bg-blue-50 text-blue-600'
                      }`}>
                        {p.role}
                      </span>
                    </td>
                    <td className="py-4 text-sm text-gray-400">{new Date(p.created_at).toLocaleDateString()}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}

          {tab === 'bookings' && (
            <table className="w-full text-left">
              <thead>
                <tr className="text-gray-400 text-[10px] font-black uppercase tracking-widest border-b">
                  <th className="pb-4">Service</th>
                  <th className="pb-4">Seeker</th>
                  <th className="pb-4">Provider</th>
                  <th className="pb-4">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y">
                {bookings.map(b => (
                  <tr key={b.id} className="hover:bg-gray-50">
                    <td className="py-4 font-bold">{b.services?.title}</td>
                    <td className="py-4 text-sm">{b.seeker_profile?.full_name}</td>
                    <td className="py-4 text-sm">{b.provider_profile?.full_name}</td>
                    <td className="py-4">
                      <span className="bg-gray-100 text-gray-600 px-3 py-1 rounded-full text-[10px] font-black uppercase">{b.status}</span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}

          {tab === 'payments' && (
            <table className="w-full text-left">
              <thead>
                <tr className="text-gray-400 text-[10px] font-black uppercase tracking-widest border-b">
                  <th className="pb-4">Ref</th>
                  <th className="pb-4">Amount</th>
                  <th className="pb-4">Gateway</th>
                  <th className="pb-4">Date</th>
                </tr>
              </thead>
              <tbody className="divide-y">
                {payments.map(pay => (
                  <tr key={pay.id}>
                    <td className="py-4 font-mono text-xs">{pay.reference}</td>
                    <td className="py-4 font-black">₦{pay.amount.toLocaleString()}</td>
                    <td className="py-4 text-sm uppercase font-bold">{pay.gateway}</td>
                    <td className="py-4 text-sm text-gray-400">{new Date(pay.created_at).toLocaleDateString()}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </div>
  );
};
