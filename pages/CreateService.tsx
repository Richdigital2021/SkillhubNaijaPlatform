
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { db } from '../lib/db';
import { Profile } from '../types';
import { generateServiceDescription } from '../services/geminiService';

export const CreateService: React.FC<{ profile: Profile | null }> = ({ profile }) => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [aiGenerating, setAiGenerating] = useState(false);
  
  const [formData, setFormData] = useState({
    title: '',
    category: 'Cleaning',
    description: '',
    price: '',
    location: '',
  });

  const handleAiDescription = async () => {
    if (!formData.title) return alert("Please enter a title first.");
    setAiGenerating(true);
    const desc = await generateServiceDescription(formData.title, formData.category);
    setFormData(prev => ({ ...prev, description: desc }));
    setAiGenerating(false);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    
    const session = db.auth.getSession();
    if (!session) return;

    await db.services.create({
      provider_id: session.user.id,
      title: formData.title,
      category: formData.category,
      description: formData.description,
      price: parseFloat(formData.price),
      location: formData.location,
    });

    navigate('/provider/dashboard');
    setLoading(false);
  };

  return (
    <div className="max-w-3xl mx-auto px-4 py-16">
      <div className="bg-white rounded-[40px] shadow-2xl border border-gray-100 p-10 md:p-16">
        <h2 className="text-4xl font-black mb-12 tracking-tight">List Your Service</h2>
        <form onSubmit={handleSubmit} className="space-y-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-[11px] font-black text-gray-400 uppercase tracking-widest mb-2 px-1">Service Title</label>
              <input type="text" required value={formData.title} onChange={(e) => setFormData(p => ({ ...p, title: e.target.value }))} className="w-full px-5 py-4 bg-gray-50 border border-gray-100 rounded-2xl outline-none focus:ring-2 focus:ring-[#00875A] font-medium" placeholder="e.g. Professional House Painting" />
            </div>
            <div>
              <label className="block text-[11px] font-black text-gray-400 uppercase tracking-widest mb-2 px-1">Category</label>
              <select value={formData.category} onChange={(e) => setFormData(p => ({ ...p, category: e.target.value }))} className="w-full px-5 py-4 bg-gray-50 border border-gray-100 rounded-2xl outline-none focus:ring-2 focus:ring-[#00875A] font-medium appearance-none">
                {['Cleaning', 'Repairs', 'Tech', 'Events', 'Delivery', 'Plumbing', 'Electrical'].map(c => <option key={c} value={c}>{c}</option>)}
              </select>
            </div>
          </div>
          <div>
            <div className="flex justify-between items-center mb-2 px-1">
              <label className="block text-[11px] font-black text-gray-400 uppercase tracking-widest">Service Description</label>
              <button type="button" onClick={handleAiDescription} disabled={aiGenerating} className="text-[10px] font-black text-[#00875A] bg-green-50 px-4 py-1.5 rounded-full flex items-center gap-1.5 hover:bg-green-100 transition-all uppercase tracking-wider">
                {aiGenerating ? 'Generating...' : '✨ AI Enhance'}
              </button>
            </div>
            <textarea required rows={6} value={formData.description} onChange={(e) => setFormData(p => ({ ...p, description: e.target.value }))} className="w-full px-5 py-4 bg-gray-50 border border-gray-100 rounded-2xl outline-none focus:ring-2 focus:ring-[#00875A] font-medium resize-none" placeholder="Describe what you offer in detail..." />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-[11px] font-black text-gray-400 uppercase tracking-widest mb-2 px-1">Price (₦)</label>
              <input type="number" required value={formData.price} onChange={(e) => setFormData(p => ({ ...p, price: e.target.value }))} className="w-full px-5 py-4 bg-gray-50 border border-gray-100 rounded-2xl outline-none focus:ring-2 focus:ring-[#00875A] font-medium" placeholder="15000" />
            </div>
            <div>
              <label className="block text-[11px] font-black text-gray-400 uppercase tracking-widest mb-2 px-1">Location</label>
              <input type="text" required value={formData.location} onChange={(e) => setFormData(p => ({ ...p, location: e.target.value }))} className="w-full px-5 py-4 bg-gray-50 border border-gray-100 rounded-2xl outline-none focus:ring-2 focus:ring-[#00875A] font-medium" placeholder="e.g. Lagos, Abuja" />
            </div>
          </div>
          <button type="submit" disabled={loading} className="w-full py-5 bg-[#00875A] text-white font-black rounded-2xl shadow-xl shadow-green-100 hover:bg-[#006F4A] transition-all text-xl">
            {loading ? 'Publishing...' : 'Publish Service'}
          </button>
        </form>
      </div>
    </div>
  );
};
