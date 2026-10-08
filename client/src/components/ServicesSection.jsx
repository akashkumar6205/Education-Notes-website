import React from 'react';
import { 
  IndianRupee, 
  UserPlus, 
  Layers, 
  Gauge, 
  Code2, 
  MessagesSquare
} from 'lucide-react';

const ServicesSection = () => {
  return (
    <section id="services" className="w-full bg-black py-20 px-4 sm:px-6 lg:px-12 relative overflow-hidden select-none scroll-mt-20 sm:scroll-mt-24">
      {/* Background subtle glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[500px] bg-amber-500/5 rounded-full blur-[140px] pointer-events-none" />

      {/* Section Header */}
      <div className="text-center mb-16 relative z-10">
        <h2 className="inline-block text-4xl sm:text-5xl md:text-6xl font-extrabold tracking-wider hollow-outline-text hover:scale-105 transition-all duration-300 cursor-pointer drop-shadow-[0_4px_20px_rgba(0,0,0,0.8)]">
          Services
        </h2>
      </div>

      {/* Grid Container */}
      <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 relative z-10 items-stretch">
        
        {/* Card 1: Completely Free */}
        <div className="group rounded-2xl bg-[#141414] hover:bg-[#1a1a1a] border border-white/5 hover:border-amber-500/30 p-8 flex flex-col items-center text-center transition-all duration-300 hover:-translate-y-1 shadow-lg hover:shadow-[0_8px_30px_rgba(245,158,11,0.12)]">
          <div className="w-16 h-16 rounded-2xl bg-[#202020] flex items-center justify-center mb-6 text-amber-500 shadow-inner group-hover:scale-110 group-hover:bg-amber-500/20 group-hover:text-amber-400 transition-all duration-300">
            <span className="text-3xl font-black">₹</span>
          </div>
          <h3 className="text-white font-bold text-sm sm:text-base tracking-wider uppercase mb-3 group-hover:text-amber-400 transition-colors">
            COMPLETELY FREE !!!
          </h3>
          <p className="text-gray-400 text-xs sm:text-sm leading-relaxed max-w-xs font-normal">
            Yup, everything is free....
          </p>
        </div>

        {/* Card 2: No Registration Required */}
        <div className="group rounded-2xl bg-[#141414] hover:bg-[#1a1a1a] border border-white/5 hover:border-amber-500/30 p-8 flex flex-col items-center text-center transition-all duration-300 hover:-translate-y-1 shadow-lg hover:shadow-[0_8px_30px_rgba(245,158,11,0.12)]">
          <div className="w-16 h-16 rounded-2xl bg-[#202020] flex items-center justify-center mb-6 text-amber-500 shadow-inner group-hover:scale-110 group-hover:bg-amber-500/20 group-hover:text-amber-400 transition-all duration-300">
            <UserPlus className="w-7 h-7" />
          </div>
          <h3 className="text-white font-bold text-sm sm:text-base tracking-wider uppercase mb-3 group-hover:text-amber-400 transition-colors">
            NO REGISTRATION REQUIRED
          </h3>
          <p className="text-gray-400 text-xs sm:text-sm leading-relaxed max-w-xs font-normal">
            User doesn't have to register for accessing the files, all the files are free & universally accessible without any condition or restriction.
          </p>
        </div>

        {/* Card 3: Responsive Design & User-Friendly */}
        <div className="group rounded-2xl bg-[#141414] hover:bg-[#1a1a1a] border border-white/5 hover:border-amber-500/30 p-8 flex flex-col items-center text-center transition-all duration-300 hover:-translate-y-1 shadow-lg hover:shadow-[0_8px_30px_rgba(245,158,11,0.12)]">
          <div className="w-16 h-16 rounded-2xl bg-[#202020] flex items-center justify-center mb-6 text-amber-500 shadow-inner group-hover:scale-110 group-hover:bg-amber-500/20 group-hover:text-amber-400 transition-all duration-300">
            <Layers className="w-7 h-7" />
          </div>
          <h3 className="text-white font-bold text-sm sm:text-base tracking-wider uppercase mb-3 group-hover:text-amber-400 transition-colors">
            RESPONSIVE DESIGN & USER-FRIENDLY
          </h3>
          <p className="text-gray-400 text-xs sm:text-sm leading-relaxed max-w-xs font-normal">
            Our webpages are responsive & user-friendly, which means it will automatically adjust according to your device screen size and you will find stuff without ant hustle.
          </p>
        </div>

        {/* Card 4: Direct Download Links With High Speed */}
        <div className="group rounded-2xl bg-[#141414] hover:bg-[#1a1a1a] border border-white/5 hover:border-amber-500/30 p-8 flex flex-col items-center text-center transition-all duration-300 hover:-translate-y-1 shadow-lg hover:shadow-[0_8px_30px_rgba(245,158,11,0.12)]">
          <div className="w-16 h-16 rounded-2xl bg-[#202020] flex items-center justify-center mb-6 text-amber-500 shadow-inner group-hover:scale-110 group-hover:bg-amber-500/20 group-hover:text-amber-400 transition-all duration-300">
            <Gauge className="w-7 h-7" />
          </div>
          <h3 className="text-white font-bold text-sm sm:text-base tracking-wider uppercase mb-3 group-hover:text-amber-400 transition-colors">
            DIRECT DOWNLOAD LINKS WITH HIGN SPEED
          </h3>
          <p className="text-gray-400 text-xs sm:text-sm leading-relaxed max-w-xs font-normal">
            All the files are uploaded on our super-fast servers so that they can be easily downloaded with high speed.
          </p>
        </div>

        {/* Card 5: New Projects */}
        <div className="group rounded-2xl bg-[#141414] hover:bg-[#1a1a1a] border border-white/5 hover:border-amber-500/30 p-8 flex flex-col items-center text-center transition-all duration-300 hover:-translate-y-1 shadow-lg hover:shadow-[0_8px_30px_rgba(245,158,11,0.12)]">
          <div className="w-16 h-16 rounded-2xl bg-[#202020] flex items-center justify-center mb-6 text-amber-500 shadow-inner group-hover:scale-110 group-hover:bg-amber-500/20 group-hover:text-amber-400 transition-all duration-300">
            <Code2 className="w-7 h-7" />
          </div>
          <h3 className="text-white font-bold text-sm sm:text-base tracking-wider uppercase mb-3 group-hover:text-amber-400 transition-colors">
            NEW PROJECTS
          </h3>
          <p className="text-gray-400 text-xs sm:text-sm leading-relaxed max-w-xs font-normal">
            For providing a better experience to our users we are developing our Android application, the application will have a lot of awesome features so stay tuned :).
          </p>
        </div>

        {/* Card 6: Awesome Support Team */}
        <div className="group rounded-2xl bg-[#141414] hover:bg-[#1a1a1a] border border-white/5 hover:border-amber-500/30 p-8 flex flex-col items-center text-center transition-all duration-300 hover:-translate-y-1 shadow-lg hover:shadow-[0_8px_30px_rgba(245,158,11,0.12)]">
          <div className="w-16 h-16 rounded-2xl bg-[#202020] flex items-center justify-center mb-6 text-amber-500 shadow-inner group-hover:scale-110 group-hover:bg-amber-500/20 group-hover:text-amber-400 transition-all duration-300">
            <MessagesSquare className="w-7 h-7" />
          </div>
          <h3 className="text-white font-bold text-sm sm:text-base tracking-wider uppercase mb-3 group-hover:text-amber-400 transition-colors">
            AWESOME SUPPORT TEAM
          </h3>
          <p className="text-gray-400 text-xs sm:text-sm leading-relaxed max-w-xs font-normal">
            Our AI-powered Chatbots are always here to help you so, feel free to ask any question or report if you face any problem. Our team also monitors all chatbots traffic & they will contact you if chatbot fails to help.
          </p>
        </div>

      </div>
    </section>
  );
};

export default ServicesSection;
