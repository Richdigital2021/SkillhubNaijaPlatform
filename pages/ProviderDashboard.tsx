
import React, { useEffect, useState, useRef } from 'react';
import { db } from '../lib/db';
import { Service, Booking, Profile, Payment } from '../types';
import { Link } from 'react-router-dom';

export const ProviderDashboard: React.FC<{ profile: Profile | null }> = ({ profile }) => {
  const [myServices, setMyServices] = useState<Service[]>([]);
  const [incomingBookings, setIncomingBookings] = useState<Booking[]>([]);
  const [myPayments, setMyPayments] = useState<Payment[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'overview' | 'services' | 'bookings' | 'payments'>('overview');
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    fetchProviderData();
  }, []);

  const fetchProviderData = async () => {
    setLoading(true);
    const session = db.auth.getSession();
    if (!session) return;
    const allServices = await db.services.getAll();
    const myServicesData = allServices.filter(s => s.provider_id === session.user.id);
    const bookingsData = await db.bookings.getByUser(session.user.id, 'provider');
    const payData = await db.payments.getByUser(session.user.id);
    setMyServices(myServicesData);
    setIncomingBookings(bookingsData);
    setMyPayments(payData);
    setLoading(false);
  };

  const handleUpdateStatus = async (bookingId: string, status: string) => {
    await db.bookings.updateStatus(bookingId, status);
    fetchProviderData();
  };

  const handleAvatarUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file && profile) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const base64String = reader.result as string;
        db.profiles.update(profile.id, { avatar_url: base64String });
      };
      reader.readAsDataURL(file);
    }
  };

  const totalEarnings = incomingBookings
    .filter(b => b.status === 'paid' || b.status === 'completed' || b.status === 'accepted')
    .reduce((sum, b) => sum + (b.services?.price || 0), 0);

  if (loading) return <div className="p-20 text-center animate-pulse text-[#00875A] font-bold">Synchronizing Provider Data...</div>;

  return (
    <div className="flex flex-col lg:flex-row min-h-[calc(100vh-80px)]">
      {/* Sidebar Navigation */}
      <aside className="w-full lg:w-72 bg-white border-r lg:sticky lg:top-20 h-auto lg:h-[calc(100vh-80px)] z-40 overflow-y-auto">
        <div className="p-8">
          <div className="flex items-center gap-4 mb-10">
            <div className="relative group">
              <div className="w-14 h-14 rounded-2xl bg-orange-100 flex items-center justify-center text-[#E67E22] font-black text-xl overflow-hidden border-2 border-white shadow-sm">
                {profile?.avatar_url ? <img src={profile.avatar_url} className="w-full h-full object-cover" /> : profile?.full_name?.charAt(0)}
              </div>
              <button onClick={() => fileInputRef.current?.click()} className="absolute -bottom-1 -right-1 bg-white p-1 rounded-lg border shadow-sm text-xs opacity-0 group-hover:opacity-100 transition-opacity">📷</button>
              <input type="file" ref={fileInputRef} onChange={handleAvatarUpload} className="hidden" accept="image/*" />
            </div>
            <div>
              <p className="font-black text-sm truncate w-32">{profile?.full_name}</p>
              <p className="text-[10px] text-gray-400 font-black uppercase tracking-widest">Verified Pro</p>
            </div>
          </div>

          <nav className="space-y-2">
            {[
              { id: 'overview', label: 'Overview', icon: '🏠' },
              { id: 'services', label: 'My Services', icon: '💼' },
              { id: 'bookings', label: 'Booking Requests', icon: '📅' },
              { id: 'payments', label: 'Payments', icon: '💰' }
            ].map(item => (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id as any)}
                className={`w-full flex items-center gap-4 px-6 py-4 rounded-2xl text-sm font-black transition-all ${
                  activeTab === item.id ? 'bg-[#00875A] text-white shadow-lg shadow-green-100' : 'text-gray-400 hover:bg-gray-50'
                }`}
              >
                <span>{item.icon}</span>
                {item.label}
              </button>
            ))}
            <Link to="/settings" className="w-full flex items-center gap-4 px-6 py-4 rounded-2xl text-sm font-black text-gray-400 hover:bg-gray-50">
              <span>⚙️</span> Settings
            </Link>
          </nav>
        </div>
      </aside>

      {/* Content Area */}
      <main className="flex-1 p-6 lg:p-12 bg-[#F9FAF9]">
        {activeTab === 'overview' && (
          <div className="animate-in fade-in duration-500">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-12">
              <div>
                <h2 className="text-3xl font-black text-gray-900 tracking-tight">Performance Overview</h2>
                <p className="text-gray-500">Real-time stats for your skill profile</p>
              </div>
              <Link to="/provider/create-service" className="px-8 py-4 bg-[#00875A] text-white rounded-2xl font-black shadow-xl hover:bg-[#006F4A] active:scale-95 transition-all text-sm">
                + Add New Service
              </Link>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
              <div className="bg-white p-8 rounded-[32px] shadow-sm border border-gray-100">
                <p className="text-gray-400 text-[10px] font-black uppercase tracking-widest mb-1">Total Earnings</p>
                <p className="text-4xl font-black text-[#00875A]">₦{totalEarnings.toLocaleString()}</p>
              </div>
              <div className="bg-white p-8 rounded-[32px] shadow-sm border border-gray-100">
                <p className="text-gray-400 text-[10px] font-black uppercase tracking-widest mb-1">Active Bookings</p>
                <p className="text-4xl font-black">{incomingBookings.filter(b => b.status === 'accepted' || b.status === 'paid').length}</p>
              </div>
              <div className="bg-white p-8 rounded-[32px] shadow-sm border border-gray-100">
                <p className="text-gray-400 text-[10px] font-black uppercase tracking-widest mb-1">Avg Rating</p>
                <p className="text-4xl font-black">5.0 ★</p>
              </div>
            </div>

            <div className="bg-white rounded-[40px] border shadow-sm p-10">
              <h3 className="text-xl font-black mb-8">Recent Activity</h3>
              <div className="space-y-6">
                {incomingBookings.slice(0, 3).map(b => (
                  <div key={b.id} className="flex items-center justify-between pb-6 border-b last:border-0">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 bg-gray-50 rounded-xl flex items-center justify-center text-xl">📦</div>
                      <div>
                        <p className="font-black text-gray-900">{b.services?.title}</p>
                        <p className="text-xs text-gray-400">Request from {b.seeker_profile?.full_name}</p>
                      </div>
                    </div>
                    <span className="text-xs font-black uppercase tracking-widest text-[#00875A] bg-green-50 px-3 py-1 rounded-full">{b.status}</span>
                  </div>
                ))}
                {incomingBookings.length === 0 && <p className="text-center text-gray-400 py-10 font-medium italic">No recent activity detected.</p>}
              </div>
            </div>
          </div>
        )}

        {activeTab === 'services' && (
          <div className="animate-in slide-in-from-bottom-4 duration-500">
            <h2 className="text-3xl font-black mb-8">Manage My Services</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {myServices.map(s => (
                <div key={s.id} className="bg-white p-6 rounded-[32px] border shadow-sm group">
                  <div className="flex gap-6 items-start mb-6">
                    <img src={`https://picsum.photos/seed/${s.id}/150/150`} className="w-24 h-24 rounded-2xl object-cover" />
                    <div className="flex-1">
                      <div className="flex justify-between items-start">
                        <span className="text-[10px] font-black uppercase tracking-widest text-[#E67E22] bg-orange-50 px-2 py-1 rounded-md mb-2 inline-block">{s.category}</span>
                        <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                          <button onClick={async () => { if(confirm('Delete?')) { await db.services.delete(s.id); fetchProviderData(); } }} className="text-red-500 p-2 bg-red-50 rounded-lg">🗑️</button>
                        </div>
                      </div>
                      <h3 className="text-xl font-black leading-tight mb-2">{s.title}</h3>
                      <p className="text-lg font-black text-[#00875A]">₦{s.price.toLocaleString()}</p>
                    </div>
                  </div>
                </div>
              ))}
              {myServices.length === 0 && <div className="md:col-span-2 text-center py-20 bg-white rounded-[40px] border-2 border-dashed border-gray-200">
                <p className="text-gray-400 font-bold mb-4">You haven't listed any services yet.</p>
                <Link to="/provider/create-service" className="text-[#00875A] font-black hover:underline">Get started now →</Link>
              </div>}
            </div>
          </div>
        )}

        {activeTab === 'bookings' && (
          <div className="animate-in slide-in-from-right-4 duration-500">
            <h2 className="text-3xl font-black mb-8">Booking Requests</h2>
            <div className="space-y-4">
              {incomingBookings.map(b => (
                <div key={b.id} className="bg-white p-8 rounded-[40px] border shadow-sm flex flex-col md:flex-row items-center gap-8">
                  <div className="flex-1 w-full text-center md:text-left">
                    <div className="flex items-center justify-center md:justify-start gap-4 mb-4">
                      <span className={`px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest ${
                        b.status === 'paid' ? 'bg-blue-50 text-blue-700' :
                        b.status === 'completed' ? 'bg-green-50 text-green-700' : 'bg-orange-50 text-orange-700'
                      }`}>
                        {b.status}
                      </span>
                      <p className="text-sm text-gray-400 font-bold">{new Date(b.booking_date).toLocaleDateString()} @ {b.booking_time}</p>
                    </div>
                    <h3 className="text-2xl font-black mb-2">{b.services?.title}</h3>
                    <p className="text-gray-500 font-medium">Customer: <span className="text-gray-900 font-bold">{b.seeker_profile?.full_name}</span></p>
                  </div>
                  <div className="flex gap-3 w-full md:w-auto">
                    {b.status === 'paid' && <button onClick={() => handleUpdateStatus(b.id, 'accepted')} className="flex-1 md:flex-none px-10 py-4 bg-[#00875A] text-white font-black rounded-2xl shadow-lg hover:shadow-green-100 transition-all">Accept Job</button>}
                    {b.status === 'accepted' && <button onClick={() => handleUpdateStatus(b.id, 'completed')} className="flex-1 md:flex-none px-10 py-4 bg-blue-600 text-white font-black rounded-2xl shadow-lg hover:shadow-blue-100 transition-all">Mark Complete</button>}
                    {b.status === 'completed' && <span className="text-[#00875A] font-black text-sm border-2 border-[#00875A] px-8 py-3 rounded-2xl">✓ Job Completed</span>}
                  </div>
                </div>
              ))}
              {incomingBookings.length === 0 && <p className="text-center py-20 bg-gray-50 rounded-[40px] border-2 border-dashed text-gray-400 font-bold">No booking requests found.</p>}
            </div>
          </div>
        )}

        {activeTab === 'payments' && (
          <div className="animate-in fade-in duration-500">
            <h2 className="text-3xl font-black mb-8">Payment History</h2>
            <div className="bg-white rounded-[40px] border shadow-sm overflow-hidden">
               <table className="w-full text-left">
                 <thead>
                   <tr className="bg-gray-50 text-gray-400 text-[10px] font-black uppercase tracking-widest">
                     <th className="px-8 py-6">Reference</th>
                     <th className="px-8 py-6">Amount</th>
                     <th className="px-8 py-6">Service</th>
                     <th className="px-8 py-6">Date</th>
                   </tr>
                 </thead>
                 <tbody className="divide-y divide-gray-100">
                    {myPayments.map(p => (
                      <tr key={p.id} className="hover:bg-gray-50 transition-colors">
                        <td className="px-8 py-6 font-mono text-xs text-gray-500">{p.reference}</td>
                        <td className="px-8 py-6 font-black text-gray-900">₦{p.amount.toLocaleString()}</td>
                        <td className="px-8 py-6 text-sm font-bold text-gray-600">{p.booking?.services?.title}</td>
                        <td className="px-8 py-6 text-xs text-gray-400">{new Date(p.created_at).toLocaleDateString()}</td>
                      </tr>
                    ))}
                 </tbody>
               </table>
               {myPayments.length === 0 && <div className="p-20 text-center text-gray-400 font-bold">No payments found yet.</div>}
            </div>
          </div>
        )}
      </main>
    </div>
  );
};
