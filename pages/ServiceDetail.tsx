
import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { db } from '../lib/db';
import { Service, Profile } from '../types';
import { initializePaystack, initializeFlutterwave } from '../services/paymentService';

export const ServiceDetail: React.FC<{ profile: Profile | null }> = ({ profile }) => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [service, setService] = useState<Service | null>(null);
  const [loading, setLoading] = useState(true);
  const [bookingDate, setBookingDate] = useState('');
  const [bookingTime, setBookingTime] = useState('');
  const [paymentGateway, setPaymentGateway] = useState<'paystack' | 'flutterwave'>('paystack');
  const [bookingLoading, setBookingLoading] = useState(false);

  useEffect(() => {
    fetchService();
  }, [id]);

  const fetchService = async () => {
    const data = await db.services.getById(id || '');
    if (data) setService(data);
    setLoading(false);
  };

  const handleBookingAndPayment = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!profile) return;
    if (!bookingDate || !bookingTime) return alert("Please select a date and time");

    setBookingLoading(true);
    const session = db.auth.getSession();

    const bookingData = await db.bookings.create({
      service_id: service?.id,
      provider_id: service?.provider_id,
      seeker_id: session.user.id,
      booking_date: bookingDate,
      booking_time: bookingTime,
      status: 'pending',
    });

    const paymentConfig = {
      email: session.user.email,
      amount: service?.price || 0,
      reference: `BOOK-${bookingData.id}-${Date.now()}`,
      onSuccess: async (reference: string) => {
        await db.bookings.updateStatus(bookingData.id, 'paid');
        await db.payments.create({
          booking_id: bookingData.id,
          user_id: session.user.id,
          amount: service?.price,
          gateway: paymentGateway,
          reference: reference,
          status: 'successful'
        });
        alert("Payment successful! Your booking is confirmed.");
        navigate('/seeker/dashboard');
      },
      onClose: () => {
        setBookingLoading(false);
      },
    };

    if (paymentGateway === 'paystack') {
      initializePaystack(paymentConfig);
    } else {
      initializeFlutterwave(paymentConfig);
    }
  };

  if (loading) return <div className="p-8 text-center animate-pulse">Loading service...</div>;
  if (!service) return <div className="p-8 text-center">Service not found.</div>;

  return (
    <div className="max-w-6xl mx-auto px-4 py-12">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
        <div className="lg:col-span-2">
          <img src={`https://picsum.photos/seed/${service.id}/1200/600`} className="w-full h-96 object-cover rounded-[40px] mb-8 shadow-sm border border-gray-100" />
          <h1 className="text-4xl font-black text-gray-900 mb-6 tracking-tight">{service.title}</h1>
          <div className="flex items-center gap-4 mb-8 p-6 bg-gray-50 rounded-[32px] border border-gray-100">
            <div className="w-14 h-14 rounded-2xl bg-[#E67E22] flex items-center justify-center text-white font-black text-xl">{service.profiles?.full_name.charAt(0)}</div>
            <div>
              <p className="text-xs text-gray-400 font-black uppercase tracking-widest">Service Provider</p>
              <p className="text-xl font-black">{service.profiles?.full_name}</p>
            </div>
          </div>
          <div className="prose max-w-none mb-12">
            <h3 className="text-2xl font-black mb-4">About this service</h3>
            <p className="text-gray-500 text-lg leading-relaxed whitespace-pre-line">{service.description}</p>
          </div>
        </div>
        <div className="lg:sticky lg:top-24 h-fit">
          <div className="bg-white border border-gray-100 rounded-[40px] p-10 shadow-2xl">
            <div className="flex justify-between items-end mb-8">
              <span className="text-gray-400 font-black uppercase tracking-widest text-xs">Price</span>
              <span className="text-4xl font-black text-gray-900">₦{service.price.toLocaleString()}</span>
            </div>
            <form onSubmit={handleBookingAndPayment} className="space-y-6">
              <input type="date" required value={bookingDate} onChange={(e) => setBookingDate(e.target.value)} className="w-full px-5 py-4 bg-gray-50 border border-gray-100 rounded-2xl outline-none focus:ring-2 focus:ring-[#00875A] font-medium" />
              <input type="time" required value={bookingTime} onChange={(e) => setBookingTime(e.target.value)} className="w-full px-5 py-4 bg-gray-50 border border-gray-100 rounded-2xl outline-none focus:ring-2 focus:ring-[#00875A] font-medium" />
              <button type="submit" disabled={bookingLoading || profile?.role === 'provider'} className="w-full py-5 bg-[#E67E22] text-white font-black rounded-2xl shadow-xl shadow-orange-100 hover:bg-[#D35400] transition-all text-lg disabled:opacity-50">
                {profile?.role === 'provider' ? 'Providers cannot book' : 'Book & Pay Now'}
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};
