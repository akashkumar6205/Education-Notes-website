import React, { useState } from 'react';
import { Send, CheckCircle2 } from 'lucide-react';

const ContactSection = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    message: '',
  });
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.name || !formData.email || !formData.message) return;
    // Handle message submit logic
    console.log('Form Submitted:', formData);
    setIsSubmitted(true);
    setTimeout(() => {
      setIsSubmitted(false);
      setFormData({ name: '', email: '', message: '' });
    }, 4000);
  };

  return (
    <section id="contact" className="w-full bg-black py-20 px-4 sm:px-6 lg:px-12 relative overflow-hidden select-none scroll-mt-20 sm:scroll-mt-24">
      {/* Background subtle glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[400px] bg-amber-500/5 rounded-full blur-[130px] pointer-events-none" />

      {/* Section Header */}
      <div className="text-center mb-16 relative z-10">
        <h2 className="inline-block text-4xl sm:text-5xl md:text-6xl font-extrabold tracking-wider hollow-outline-text hover:scale-105 transition-all duration-300 cursor-pointer drop-shadow-[0_4px_20px_rgba(0,0,0,0.8)]">
          Contact Us
        </h2>
      </div>

      <div className="max-w-5xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-start relative z-10">
        
        {/* Left Info Column */}
        <div className="lg:col-span-4 flex flex-col justify-start space-y-7 pt-2">
          
          <div>
            <span className="text-[#F59E0B] font-bold text-xs sm:text-sm tracking-widest block uppercase mb-1.5">
              PHONE :
            </span>
            <a 
              href="tel:+918989595022" 
              className="text-white hover:text-amber-400 font-normal text-sm sm:text-base tracking-wide transition-colors cursor-pointer"
            >
              +91-8989595022
            </a>
          </div>

          <div>
            <span className="text-[#F59E0B] font-bold text-xs sm:text-sm tracking-widest block uppercase mb-1.5">
              ADDRESS :
            </span>
            <p className="text-white font-normal text-sm sm:text-base tracking-wide">
              Indore, Madhya Pradesh
            </p>
          </div>

          <div>
            <span className="text-[#F59E0B] font-bold text-xs sm:text-sm tracking-widest block uppercase mb-1.5">
              EMAIL :
            </span>
            <a 
              href="mailto:contact@rgpvnotes.in" 
              className="text-white hover:text-amber-400 font-normal text-sm sm:text-base tracking-wide transition-colors cursor-pointer"
            >
              contact@rgpvnotes.in
            </a>
          </div>

        </div>

        {/* Right Form Column */}
        <div className="lg:col-span-8">
          <form onSubmit={handleSubmit} className="flex flex-col space-y-4">
            
            {/* Top row: Name & Email */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <input
                  type="text"
                  name="name"
                  required
                  placeholder="Name* :"
                  value={formData.name}
                  onChange={handleChange}
                  className="w-full px-5 py-3.5 rounded-full bg-[#1c1c1c] text-white placeholder-gray-400/80 text-sm focus:outline-none focus:ring-1 focus:ring-amber-500 border border-transparent hover:border-white/10 transition-all shadow-inner"
                />
              </div>

              <div>
                <input
                  type="email"
                  name="email"
                  required
                  placeholder="E-mail* :"
                  value={formData.email}
                  onChange={handleChange}
                  className="w-full px-5 py-3.5 rounded-full bg-[#1c1c1c] text-white placeholder-gray-400/80 text-sm focus:outline-none focus:ring-1 focus:ring-amber-500 border border-transparent hover:border-white/10 transition-all shadow-inner"
                />
              </div>
            </div>

            {/* Message Textarea */}
            <div>
              <textarea
                name="message"
                required
                rows={5}
                placeholder="Message* :"
                value={formData.message}
                onChange={handleChange}
                className="w-full px-5 py-4 rounded-2xl bg-[#1c1c1c] text-white placeholder-gray-400/80 text-sm focus:outline-none focus:ring-1 focus:ring-amber-500 border border-transparent hover:border-white/10 transition-all shadow-inner resize-y"
              />
            </div>

            {/* Submit Button & Status Message */}
            <div className="flex items-center justify-end pt-2 gap-4">
              {isSubmitted && (
                <div className="flex items-center gap-2 text-emerald-400 text-xs sm:text-sm font-medium animate-fade-in">
                  <CheckCircle2 className="w-4 h-4" />
                  <span>Message sent successfully!</span>
                </div>
              )}
              
              <button
                type="submit"
                className="px-8 sm:px-10 py-3 rounded-full bg-[#F59E0B] hover:bg-amber-400 active:scale-95 text-black font-bold text-xs sm:text-sm transition-all duration-200 shadow-[0_4px_20px_rgba(245,158,11,0.3)] hover:shadow-[0_6px_25px_rgba(245,158,11,0.5)] cursor-pointer"
              >
                Send Message
              </button>
            </div>

          </form>
        </div>

      </div>
    </section>
  );
};

export default ContactSection;
