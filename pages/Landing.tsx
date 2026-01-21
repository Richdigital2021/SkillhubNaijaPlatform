
import React, { useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';

export const Landing: React.FC = () => {
  const { hash } = useLocation();

  useEffect(() => {
    if (hash) {
      const id = hash.replace('#', '');
      const element = document.getElementById(id);
      if (element) {
        // Delay slightly to ensure content is rendered
        setTimeout(() => {
          element.scrollIntoView({ behavior: 'smooth' });
        }, 100);
      }
    } else {
      // If no hash, scroll to the absolute top
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  }, [hash]);

  const faqs = [
    {
      q: "How do I know if a service provider is reliable?",
      a: "Every provider on SkillHubNaija goes through a verification process. You can view their 'Verified' badge, check their total completed jobs, and read real reviews from previous customers before booking."
    },
    {
      q: "Is my payment safe?",
      a: "Yes! We use a secure escrow system. Your payment is held securely and only released to the provider once you confirm the job has been completed successfully."
    },
    {
      q: "What if I'm not satisfied with the service?",
      a: "We have a dedicated support team and a dispute resolution process. If a job isn't completed as described, you can raise a report and we will investigate to ensure a fair outcome."
    },
    {
      q: "How much does it cost to list my skills?",
      a: "It is completely free to create a profile and list your services. We only charge a small platform fee when you successfully complete a booking."
    }
  ];

  return (
    <div className="bg-white">
      {/* Hero Section */}
      <section className="relative bg-[#F9FAF9] pt-20 pb-32 overflow-hidden border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col lg:flex-row items-center gap-16">
          <div className="lg:w-3/5 text-center lg:text-left">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-white border border-green-100 rounded-full text-[#00875A] font-bold text-sm mb-8 shadow-sm">
              <span className="w-2 h-2 bg-[#00875A] rounded-full animate-pulse"></span>
              Live in Nigeria
            </div>
            <h1 className="text-5xl sm:text-7xl font-black text-[#1A1A1A] tracking-tight leading-[1.05] mb-8">
              Find Trusted Local Skills. <span className="text-[#00875A]">Book Instantly. Pay Securely.</span>
            </h1>
            <p className="text-xl text-gray-600 mb-12 max-w-xl leading-relaxed">
              SkillHubNaija connects skilled professionals with people who need reliable services—fast, safe, and hassle-free.
            </p>
            <div className="flex flex-col sm:flex-row gap-5 justify-center lg:justify-start mb-12">
              <Link to="/signup" className="px-10 py-5 bg-[#00875A] text-white font-black rounded-2xl shadow-xl shadow-green-200/50 hover:bg-[#006F4A] transition-all hover:-translate-y-1 active:scale-95 text-lg text-center">
                List Your Skill →
              </Link>
              <Link to="/login" className="px-10 py-5 bg-white text-[#1A1A1A] border-2 border-gray-100 font-bold rounded-2xl hover:border-gray-200 transition-all flex items-center justify-center gap-2 group text-lg">
                Find a Service <svg className="w-5 h-5 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"/></svg>
              </Link>
            </div>
            <div className="flex items-center justify-center lg:justify-start gap-12 text-[#1A1A1A]">
              <div className="flex flex-col">
                <span className="text-2xl font-black">2,847+</span>
                <span className="text-sm text-gray-500 font-medium">Verified Providers</span>
              </div>
              <div className="w-px h-10 bg-gray-200"></div>
              <div className="flex flex-col">
                <span className="text-2xl font-black">12+</span>
                <span className="text-sm text-gray-500 font-medium">Bookings in last hour</span>
              </div>
            </div>
          </div>
          <div className="lg:w-2/5 relative">
             <div className="relative w-80 h-[600px] bg-[#1A1A1A] rounded-[3rem] border-8 border-gray-800 shadow-2xl overflow-hidden mx-auto hidden lg:block">
                <div className="absolute top-0 left-1/2 -translate-x-1/2 w-40 h-7 bg-gray-800 rounded-b-2xl z-20"></div>
                <div className="p-4 pt-10 bg-white h-full overflow-y-auto space-y-4">
                  <div className="h-4 w-1/2 bg-gray-100 rounded-full mb-4"></div>
                  <div className="aspect-[4/3] bg-gray-50 rounded-2xl border flex items-center justify-center text-gray-300">
                     <svg className="w-12 h-12" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"/></svg>
                  </div>
                  <div className="space-y-2">
                    <div className="h-4 w-full bg-gray-100 rounded-full"></div>
                    <div className="h-4 w-3/4 bg-gray-100 rounded-full"></div>
                  </div>
                  <div className="flex justify-between items-center py-4 border-y">
                     <div className="w-10 h-10 rounded-full bg-orange-100"></div>
                     <div className="h-4 w-20 bg-green-600 rounded-full"></div>
                  </div>
                </div>
             </div>
             <div className="absolute -top-10 -right-10 bg-white p-4 rounded-2xl shadow-xl border hidden xl:block animate-bounce duration-[3000ms]">
                <div className="flex items-center gap-3">
                   <div className="w-8 h-8 rounded-full bg-green-100 flex items-center justify-center text-green-600">✓</div>
                   <div className="text-xs">
                      <p className="font-bold">Verified</p>
                      <p className="text-gray-400">Plumber</p>
                   </div>
                </div>
             </div>
             <div className="absolute bottom-10 -left-10 bg-white p-4 rounded-2xl shadow-xl border hidden xl:block animate-pulse">
                <div className="flex items-center gap-3">
                   <div className="w-8 h-8 rounded-full bg-green-600 flex items-center justify-center text-white">$</div>
                   <div className="text-xs">
                      <p className="font-bold">Secure</p>
                      <p className="text-gray-400">Payment</p>
                   </div>
                </div>
             </div>
          </div>
        </div>
      </section>

      {/* Why Section (Benefits) */}
      <section id="benefits" className="py-32 bg-white scroll-mt-20">
        <div className="max-w-7xl mx-auto px-4 text-center">
           <h2 className="text-4xl font-black mb-20">Why finding reliable services is <span className="text-gray-400 italic">hard</span></h2>
           <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {[
                { icon: '⚠️', title: 'Unverified Service Providers', desc: 'No way to know if a provider is legitimate or experienced before hiring them.' },
                { icon: '📅', title: 'No Simple Booking Process', desc: 'Endless back-and-forth calls and messages just to schedule a service.' },
                { icon: '🔒', title: 'Unsafe Payment Methods', desc: 'Unclear pricing and risky cash transactions with no protection.' }
              ].map((item, i) => (
                <div key={i} className="p-10 rounded-3xl border border-gray-100 bg-gray-50/50 hover:bg-white hover:shadow-2xl transition-all text-left">
                   <div className="w-16 h-16 bg-white rounded-2xl flex items-center justify-center text-3xl shadow-sm border border-gray-100 mb-8">{item.icon}</div>
                   <h3 className="text-xl font-bold mb-4">{item.title}</h3>
                   <p className="text-gray-500 leading-relaxed">{item.desc}</p>
                </div>
              ))}
           </div>
        </div>
      </section>

      {/* One Platform Section */}
      <section className="py-32 bg-[#F9FAF9] overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 flex flex-col items-center">
           <h2 className="text-4xl font-black text-center mb-6 leading-tight max-w-2xl">
              One platform. Real skills. <span className="text-[#00875A]">Secure transactions.</span>
           </h2>
           <p className="text-gray-500 text-lg mb-20 text-center max-w-xl">SkillHubNaija solves every pain point with a single, trusted platform.</p>
           <div className="grid grid-cols-1 md:grid-cols-3 gap-8 w-full">
              {[
                { title: 'Verified Skills', desc: 'Every provider showcases real services, verified experience, and customer reviews before you book.', color: 'text-green-600', bg: 'bg-green-50' },
                { title: 'Easy Booking', desc: 'Book any service in just a few steps. No more endless calls—just select, schedule, and confirm instantly.', color: 'text-orange-600', bg: 'bg-orange-50' },
                { title: 'Secure Payments', desc: 'Pay safely within the platform with escrow protection. Money is only released when the job is complete.', color: 'text-blue-600', bg: 'bg-blue-50' }
              ].map((item, i) => (
                <div key={i} className="bg-white p-10 rounded-3xl shadow-lg shadow-gray-200/40 text-left border border-gray-100">
                   <div className={`w-14 h-14 ${item.bg} ${item.color} rounded-2xl flex items-center justify-center mb-8`}>
                      <svg className="w-7 h-7" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd"/></svg>
                   </div>
                   <h3 className="text-xl font-black mb-4">{item.title}</h3>
                   <p className="text-gray-500 leading-relaxed">{item.desc}</p>
                </div>
              ))}
           </div>
        </div>
      </section>

      {/* How it Works Section */}
      <section id="how-it-works" className="py-32 bg-white scroll-mt-20">
         <div className="max-w-7xl mx-auto px-4">
            <h2 className="text-4xl font-black text-center mb-4">How SkillHubNaija Works</h2>
            <p className="text-gray-500 text-lg text-center mb-24">Get started in three simple steps. Whether you're hiring or offering services.</p>
            
            <div className="relative max-w-3xl mx-auto">
               <div className="absolute left-[30px] md:left-1/2 top-0 bottom-0 w-1 bg-gray-100 -translate-x-1/2"></div>
               
               {[
                 { step: 1, title: 'Browse or Create Profile', desc: 'Service seekers can browse verified providers. Service providers create a profile showcasing their skills.', color: 'bg-green-600' },
                 { step: 2, title: 'Book or Accept Request', desc: 'Seekers book a service with one click. Providers receive requests and can accept instantly through the app.', color: 'bg-orange-500' },
                 { step: 3, title: 'Complete & Pay Securely', desc: 'Once the job is done, payment is processed securely through the platform. Both parties rate the experience.', color: 'bg-blue-600' }
               ].map((item, i) => (
                 <div key={i} className="relative flex flex-col md:flex-row items-center gap-8 mb-20 last:mb-0">
                    <div className="md:w-1/2 text-right hidden md:block">
                       {i % 2 === 0 && (
                         <div>
                            <h3 className="text-2xl font-black mb-3">{item.title}</h3>
                            <p className="text-gray-500">{item.desc}</p>
                         </div>
                       )}
                    </div>
                    <div className={`w-[60px] h-[60px] rounded-full ${item.color} text-white font-black text-xl flex items-center justify-center relative z-10 shadow-lg border-4 border-white`}>
                       {item.step}
                    </div>
                    <div className="md:w-1/2 md:text-left pl-[90px] md:pl-0">
                       <div className="md:hidden">
                          <h3 className="text-xl font-black mb-2">{item.title}</h3>
                          <p className="text-gray-500">{item.desc}</p>
                       </div>
                       {i % 2 !== 0 && (
                         <div className="hidden md:block">
                            <h3 className="text-2xl font-black mb-3">{item.title}</h3>
                            <p className="text-gray-500">{item.desc}</p>
                         </div>
                       )}
                    </div>
                 </div>
               ))}
            </div>
         </div>
      </section>

      {/* Path Section */}
      <section className="py-32 bg-[#F9FAF9]">
         <div className="max-w-7xl mx-auto px-4">
            <h2 className="text-4xl font-black text-center mb-4">Choose Your Path</h2>
            <p className="text-gray-500 text-lg text-center mb-24">Whether you're offering skills or seeking services, SkillHubNaija has you covered.</p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
               <div className="bg-white p-12 rounded-[40px] border border-gray-100 shadow-xl group hover:border-[#00875A] transition-all">
                  <div className="w-16 h-16 bg-green-50 rounded-2xl flex items-center justify-center text-3xl mb-10 text-[#00875A]">💼</div>
                  <h3 className="text-3xl font-black mb-8">For Service Providers</h3>
                  <ul className="space-y-4 mb-12">
                     {['List your skills and services with a professional profile', 'Get discovered by nearby customers actively searching', 'Receive secure, timely payments directly to your bank account'].map((li, k) => (
                       <li key={k} className="flex gap-3 items-start text-gray-600 font-medium">
                          <span className="text-green-600 mt-1">✓</span> {li}
                       </li>
                     ))}
                  </ul>
                  <Link to="/signup" className="block w-full py-5 bg-[#00875A] text-white text-center font-black rounded-2xl hover:bg-[#006F4A] transition-all">
                     Start as a Provider →
                  </Link>
               </div>
               <div className="bg-white p-12 rounded-[40px] border border-gray-100 shadow-xl group hover:border-blue-600 transition-all">
                  <div className="w-16 h-16 bg-blue-50 rounded-2xl flex items-center justify-center text-3xl mb-10 text-blue-600">🔍</div>
                  <h3 className="text-3xl font-black mb-8">For Service Seekers</h3>
                  <ul className="space-y-4 mb-12">
                     {['Find trusted professionals verified and rated by real customers', 'Compare services easily with transparent pricing and reviews', 'Book and pay in one place with secure escrow protection'].map((li, k) => (
                       <li key={k} className="flex gap-3 items-start text-gray-600 font-medium">
                          <span className="text-blue-600 mt-1">✓</span> {li}
                       </li>
                     ))}
                  </ul>
                  <Link to="/signup" className="block w-full py-5 bg-blue-600 text-white text-center font-black rounded-2xl hover:bg-blue-700 transition-all">
                     Book a Service →
                  </Link>
               </div>
            </div>
         </div>
      </section>

      {/* Testimonials */}
      <section className="py-32 bg-white">
         <div className="max-w-7xl mx-auto px-4">
            <h2 className="text-4xl font-black text-center mb-24">Real Stories from Real Users</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
               {[
                 { name: 'Amaka O.', role: 'Service Seeker, Lagos', text: 'I booked a plumber through SkillHubNaija in just 5 minutes. He fixed my kitchen sink the same day. The payment was secure and hassle-free. Best decision ever!', stars: 5 },
                 { name: 'Chidi N.', role: 'Electrician, Abuja', text: 'As an electrician, SkillHubNaija has tripled my client base in just 3 months. The platform is easy to use and payments always come on time. Highly recommend!', stars: 5 },
                 { name: 'Tunde A.', role: 'Service Seeker, Port Harcourt', text: 'I needed a cleaner urgently and found one on SkillHubNaija. The reviews helped me choose the right person. She did an amazing job and I paid safely through the app.', stars: 4.5 }
               ].map((t, i) => (
                 <div key={i} className="p-8 bg-white rounded-3xl border border-gray-100 shadow-sm relative pt-16">
                    <div className="absolute top-0 left-8 -translate-y-1/2 flex">
                       {[...Array(5)].map((_, s) => (
                         <span key={s} className={`text-xl ${s < Math.floor(t.stars) ? 'text-orange-400' : 'text-gray-200'}`}>★</span>
                       ))}
                    </div>
                    <p className="text-gray-600 italic mb-8 leading-relaxed">"{t.text}"</p>
                    <div className="flex items-center gap-4">
                       <div className="w-12 h-12 rounded-full bg-gray-200 border-2 border-white shadow-sm"></div>
                       <div>
                          <p className="font-bold">{t.name}</p>
                          <p className="text-xs text-gray-400">{t.role}</p>
                       </div>
                    </div>
                 </div>
               ))}
            </div>
         </div>
      </section>

      {/* FAQ Section */}
      <section id="faq" className="py-32 bg-[#F9FAF9] scroll-mt-20">
        <div className="max-w-4xl mx-auto px-4">
          <h2 className="text-4xl font-black text-center mb-16">Frequently Asked Questions</h2>
          <div className="space-y-6">
            {faqs.map((faq, i) => (
              <div key={i} className="bg-white p-8 rounded-[32px] border border-gray-100 shadow-sm">
                <h3 className="text-xl font-bold mb-4 flex gap-4">
                  <span className="text-[#00875A]">Q.</span>
                  {faq.q}
                </h3>
                <p className="text-gray-500 leading-relaxed flex gap-4">
                  <span className="text-orange-500 font-bold">A.</span>
                  {faq.a}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Bottom CTA / Signup */}
      <section className="py-32 bg-white">
         <div className="max-w-4xl mx-auto px-4">
            <div className="bg-[#F9FAF9] p-12 md:p-20 rounded-[40px] shadow-2xl border border-gray-50">
               <div className="text-center mb-16">
                  <h2 className="text-4xl font-black mb-6">Get Started with SkillHubNaija</h2>
                  <p className="text-gray-500 text-lg">Create your free account in under 2 minutes. Choose your role and start connecting with trusted professionals or customers today.</p>
               </div>
               
               <div className="space-y-8">
                  <div className="flex flex-col md:flex-row gap-4">
                    <button className="flex-1 p-6 border-2 border-gray-100 rounded-3xl text-left hover:border-[#00875A] transition-all group">
                       <div className="w-10 h-10 bg-gray-50 rounded-xl flex items-center justify-center mb-4 group-hover:bg-green-50">💼</div>
                       <p className="font-black text-lg">Offer Services</p>
                       <p className="text-sm text-gray-400">Service Provider</p>
                    </button>
                    <button className="flex-1 p-6 border-2 border-[#00875A] bg-green-50 rounded-3xl text-left transition-all">
                       <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center mb-4 shadow-sm">🔍</div>
                       <p className="font-black text-lg">Find Services</p>
                       <p className="text-sm text-green-600 font-bold">Service Seeker</p>
                    </button>
                  </div>
                  
                  <div className="space-y-4">
                     <input type="text" placeholder="Full Name" className="w-full p-5 bg-white border border-gray-100 rounded-2xl outline-none focus:ring-2 focus:ring-[#00875A]" />
                     <input type="email" placeholder="Email Address" className="w-full p-5 bg-white border border-gray-100 rounded-2xl outline-none focus:ring-2 focus:ring-[#00875A]" />
                     <input type="password" placeholder="Password" className="w-full p-5 bg-white border border-gray-100 rounded-2xl outline-none focus:ring-2 focus:ring-[#00875A]" />
                     <p className="text-xs text-gray-400 text-center">Must be at least 8 characters long</p>
                     <Link to="/signup" className="block w-full py-5 bg-[#00875A] text-white text-center font-black rounded-2xl shadow-xl shadow-green-200/50 hover:bg-[#006F4A] transition-all active:scale-95 text-lg">
                        Create Account →
                     </Link>
                     <p className="text-center text-sm text-gray-500">Already have an account? <Link to="/login" className="text-[#00875A] font-bold">Log in</Link></p>
                  </div>
               </div>
            </div>
            
            <div className="mt-16 flex flex-wrap justify-center gap-12 text-gray-400 font-bold text-sm uppercase tracking-widest opacity-60">
               <span className="flex items-center gap-2">🛡️ Secure Platform</span>
               <span className="flex items-center gap-2">🔐 Protected Payments</span>
               <span className="flex items-center gap-2">⏰ 24/7 Support</span>
            </div>
         </div>
      </section>
    </div>
  );
};
