
import React, { useEffect, useState, useRef } from 'react';
import { db } from '../lib/db';
import { Service, Booking, Profile, Payment } from '../types';
import { Link } from 'react-router-dom';

export const SeekerDashboard: React.FC = () => {
  const [services, setServices] = useState<Service[]>([]);
  const [myBookings, setMyBookings] = useState<Booking[]>([]);
  const [myPayments, setMyPayments] = useState<Payment[]>([]);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(true);
  const [activeView, setActiveView] = useState<'discover' | 'bookings' | 'payments'>('discover');
  const [activeCategory, setActiveCategory] = useState('All Services');
  const [searchQuery, setSearchQuery] = useState('');
  const fileInputRef = useRef<HTMLInputElement>(null);

  const categories = ['All Services', 'Plumbing', 'Electrical', 'Carpentry', 'Cleaning', 'Repairs', 'Tech', 'Events'];

  useEffect(() => {
    fetchData();
    window.addEventListener('auth-change', fetchData);
    return () => window.removeEventListener('auth-change', fetchData);
  }, []);

  const fetchData = async () => {
    const session = db.auth.getSession();
    if (!session) return;
    setProfile(session.profile);
    const servicesData = await db.services.getAll();
    const bookingsData = await db.bookings.getByUser(session.user.id, 'seeker');
    const payData = await db.payments.getByUser(session.user.id);
    setServices(servicesData);
    setMyBookings(bookingsData);
    setMyPayments(payData);
    setLoading(false);
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

  const filteredServices = services.filter(s => {
    const matchesCategory = activeCategory === 'All Services' || s.category === activeCategory;
    const matchesSearch = s.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          s.location.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const totalSpent = myPayments.reduce((acc, curr) => acc + curr.amount, 0);

  if (loading) return <div className="flex flex-col items-center justify-center h-[60vh] text-[#00875A] font-bold">Synchronizing Marketplace Data...</div>;

  return (
    <div className="flex flex-col lg:flex-row min-h-[calc(100vh-80px)]">
      {/* Sidebar Navigation */}
      <aside className="w-full lg:w-72 bg-white border-r lg:sticky lg:top-20 h-auto lg:h-[calc(100vh-80px)] z-40 overflow-y-auto">
        <div className="p-8">
          <div className="flex items-center gap-4 mb-10">
            <div className="relative group">
              <div className="w-14 h-14 rounded-2xl bg-[#00875A] flex items-center justify-center text-white font-black text-xl overflow-hidden border-2 border-white shadow-sm">
                {profile?.avatar_url ? <img src={profile.avatar_url} className="w-full h-full object-cover" /> : profile?.full_name?.charAt(0)}
              </div>
              <button onClick={() => fileInputRef.current?.click()} className="absolute -bottom-1 -right-1 bg-white p-1 rounded-lg border shadow-sm text-xs opacity-0 group-hover:opacity-100 transition-opacity">📷</button>
              <input type="file" ref={fileInputRef} onChange={handleAvatarUpload} className="hidden" accept="image/*" />
            </div>
            <div>
              <p className="font-black text-sm truncate w-32">{profile?.full_name}</p>
              <p className="text-[10px] text-gray-400 font-black uppercase tracking-widest">Service Seeker</p>
            </div>
          </div>

          <nav className="space-y-2">
            {[
              { id: 'discover', label: 'Discover Services', icon: '🔍' },
              { id: 'bookings', label: 'My Bookings', icon: '📅' },
              { id: 'payments', label: 'Payment History', icon: '💰' }
            ].map(item => (
              <button
                key={item.id}
                onClick={() => setActiveView(item.id as any)}
                className={`w-full flex items-center gap-4 px-6 py-4 rounded-2xl text-sm font-black transition-all ${
                  activeView === item.id ? 'bg-[#00875A] text-white shadow-lg shadow-green-100' : 'text-gray-400 hover:bg-gray-50'
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

          <div className="mt-12 p-6 bg-green-50 rounded-3xl border border-green-100">
             <p className="text-[10px] font-black uppercase tracking-widest text-[#00875A] mb-1">Total Spending</p>
             <p className="text-xl font-black text-gray-900">₦{totalSpent.toLocaleString()}</p>
          </div>
        </div>
      </aside>

      {/* Content Area */}
      <main className="flex-1 p-6 lg:p-12 bg-[#F9FAF9]">
        {activeView === 'discover' && (
          <div className="animate-in fade-in duration-500">
            <div className="bg-white p-6 rounded-[32px] shadow-sm border border-gray-100 mb-8">
              <div className="flex flex-col md:flex-row gap-4 mb-8">
                <div className="flex-grow relative">
                   <input 
                      type="text" 
                      placeholder="Search for services, providers, or locations..." 
                      className="w-full pl-12 pr-4 py-4 bg-gray-50 border border-gray-100 rounded-2xl outline-none focus:ring-2 focus:ring-[#00875A] font-medium"
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                   />
                   <svg className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"/></svg>
                </div>
                <button className="bg-[#E67E22] text-white px-10 py-4 rounded-2xl font-black shadow-lg hover:bg-[#D35400] transition-all">Search</button>
              </div>
              <div className="flex flex-wrap items-center gap-3">
                 {categories.map(cat => (
                    <button key={cat} onClick={() => setActiveCategory(cat)} className={`px-5 py-2.5 rounded-full text-xs font-black uppercase tracking-wider transition-all ${activeCategory === cat ? 'bg-[#1A1A1A] text-white shadow-lg' : 'bg-gray-50 text-gray-400 border hover:bg-gray-100'}`}>{cat}</button>
                 ))}
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {filteredServices.map((service) => (
                <div key={service.id} className="bg-white rounded-[32px] overflow-hidden border shadow-sm hover:shadow-2xl transition-all group flex flex-col">
                  <div className="relative h-64 overflow-hidden">
                    <img src={`https://picsum.photos/seed/${service.id}/800/600`} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-1000" alt={service.title} />
                    <div className="absolute top-4 right-4 bg-[#00875A] text-white px-3 py-1 rounded-full text-[10px] font-black uppercase">Verified</div>
                  </div>
                  <div className="p-8 flex-grow flex flex-col">
                    <div className="mb-6">
                      <p className="text-[#00875A] font-black text-[10px] uppercase tracking-widest mb-1">{service.category}</p>
                      <h3 className="text-2xl font-black text-[#1A1A1A] leading-tight line-clamp-2">{service.title}</h3>
                    </div>
                    <div className="flex items-center justify-between mt-auto pt-6 border-t border-gray-50">
                       <div>
                          <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">Price</p>
                          <p className="text-xl font-black text-gray-900">₦{service.price.toLocaleString()}</p>
                       </div>
                       <Link to={`/service/${service.id}`} className="px-6 py-3 bg-[#E67E22] text-white font-black rounded-xl text-xs hover:bg-[#D35400] transition-all">Book Now</Link>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {activeView === 'bookings' && (
          <div className="animate-in slide-in-from-bottom-4 duration-500">
            <h2 className="text-3xl font-black mb-8">My Bookings</h2>
            <div className="space-y-4">
              {myBookings.map(b => (
                <div key={b.id} className="bg-white p-8 rounded-[40px] border shadow-sm flex flex-col md:flex-row items-center gap-8">
                  <div className="flex-1">
                    <div className="flex items-center gap-4 mb-3">
                      <span className={`px-4 py-1 rounded-full text-[10px] font-black uppercase tracking-widest ${
                        b.status === 'completed' ? 'bg-green-50 text-green-700' : 'bg-orange-50 text-orange-700'
                      }`}>{b.status}</span>
                      <p className="text-xs text-gray-400 font-bold">{new Date(b.booking_date).toLocaleDateString()}</p>
                    </div>
                    <h3 className="text-xl font-black mb-1">{b.services?.title}</h3>
                    <p className="text-sm text-gray-500 font-medium">Provider: {b.provider_profile?.full_name}</p>
                  </div>
                  <div className="flex gap-2">
                    <Link to={`/service/${b.service_id}`} className="px-8 py-3 border-2 rounded-xl text-xs font-black">View</Link>
                    {b.status === 'pending' && <Link to={`/service/${b.service_id}`} className="px-8 py-3 bg-[#00875A] text-white rounded-xl text-xs font-black">Pay Now</Link>}
                  </div>
                </div>
              ))}
              {myBookings.length === 0 && <div className="text-center py-20 bg-white rounded-[40px] border-2 border-dashed text-gray-400 font-bold">You haven't booked any services yet.</div>}
            </div>
          </div>
        )}

        {activeView === 'payments' && (
          <div className="animate-in fade-in duration-500">
            <h2 className="text-3xl font-black mb-8">My Payment History</h2>
            <div className="bg-white rounded-[40px] border shadow-sm overflow-hidden">
               <table className="w-full text-left">
                 <thead>
                   <tr className="bg-gray-50 text-gray-400 text-[10px] font-black uppercase tracking-widest">
                     <th className="px-8 py-6">Reference</th>
                     <th className="px-8 py-6">Amount</th>
                     <th className="px-8 py-6">Gateway</th>
                     <th className="px-8 py-6">Status</th>
                   </tr>
                 </thead>
                 <tbody className="divide-y divide-gray-100">
                    {myPayments.map(p => (
                      <tr key={p.id}>
                        <td className="px-8 py-6 font-mono text-xs text-gray-400">{p.reference}</td>
                        <td className="px-8 py-6 font-black">₦{p.amount.toLocaleString()}</td>
                        <td className="px-8 py-6 text-xs uppercase font-bold">{p.gateway}</td>
                        <td className="px-8 py-6">
                           <span className="text-[10px] font-black uppercase bg-green-50 text-green-600 px-3 py-1 rounded-full">Successful</span>
                        </td>
                      </tr>
                    ))}
                 </tbody>
               </table>
            </div>
          </div>
        )}
      </main>
    </div>
  );
};
