
import React, { useState } from 'react';
import { db } from '../lib/db';
import { Profile } from '../types';

export const ProfileSettings: React.FC<{ profile: Profile | null }> = ({ profile }) => {
  const [name, setName] = useState(profile?.full_name || '');
  const [saving, setSaving] = useState(false);
  const [msg, setMsg] = useState('');

  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!profile) return;
    setSaving(true);
    await db.profiles.update(profile.id, { full_name: name });
    setSaving(false);
    setMsg('Profile updated successfully!');
    setTimeout(() => setMsg(''), 3000);
  };

  return (
    <div className="max-w-3xl mx-auto px-4 py-16">
      <div className="bg-white rounded-[40px] border shadow-2xl p-10 md:p-16">
        <h2 className="text-3xl font-black mb-10 tracking-tight">Account Settings</h2>
        
        {msg && (
          <div className="mb-8 p-4 bg-green-50 text-green-700 rounded-2xl font-bold border border-green-100 flex items-center gap-2">
            <span>✅</span> {msg}
          </div>
        )}

        <form onSubmit={handleUpdate} className="space-y-8">
          <div>
            <label className="block text-[11px] font-black text-gray-400 uppercase tracking-widest mb-2 px-1">Email Address (Read Only)</label>
            <input type="text" disabled value={profile?.email || 'N/A'} className="w-full px-5 py-4 bg-gray-100 border border-gray-200 rounded-2xl font-medium text-gray-400 cursor-not-allowed" />
          </div>

          <div>
            <label className="block text-[11px] font-black text-gray-400 uppercase tracking-widest mb-2 px-1">Full Name</label>
            <input 
              type="text" 
              required 
              value={name} 
              onChange={(e) => setName(e.target.value)} 
              className="w-full px-5 py-4 bg-gray-50 border border-gray-200 rounded-2xl outline-none focus:ring-2 focus:ring-[#00875A] font-medium"
            />
          </div>

          <div>
            <label className="block text-[11px] font-black text-gray-400 uppercase tracking-widest mb-2 px-1">Account Role</label>
            <div className="px-5 py-4 bg-gray-50 border border-gray-200 rounded-2xl font-bold text-[#00875A] capitalize">
              {profile?.role}
            </div>
          </div>

          <button 
            type="submit" 
            disabled={saving}
            className="w-full py-5 bg-[#00875A] text-white font-black rounded-2xl shadow-xl shadow-green-100 hover:bg-[#006F4A] transition-all text-xl"
          >
            {saving ? 'Saving Changes...' : 'Save Settings'}
          </button>
        </form>
      </div>
    </div>
  );
};
