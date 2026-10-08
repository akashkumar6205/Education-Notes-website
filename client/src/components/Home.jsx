import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import { 
  BookOpen, 
  GraduationCap, 
  ArrowLeft, 
  Sparkles, 
  CheckCircle2, 
  ChevronRight, 
  FileText, 
  User,
  LogOut,
  History,
  FileSpreadsheet,
  Award,
  Layers,
  ArrowRight
} from 'lucide-react';
import libraryBg from '../assets/library-bg.jpg';
import Logo from './Logo';
import BulbToggle from './BulbToggle';
import Navbar from './Navbar';
import ServicesSection from './ServicesSection';
import ContactSection from './ContactSection';
import FooterSection from './FooterSection';
import useAuthStore from '../store/authStore';

const YEARS_DATA = [
  {
    id: 'first-year',
    label: 'First Year',
    shortLabel: '1st Year',
    semesters: [
      { id: 'sem-1', label: 'Semester 1', number: 1, subjectsCount: 6 },
      { id: 'sem-2', label: 'Semester 2', number: 2, subjectsCount: 6 },
    ],
  },
  {
    id: 'second-year',
    label: 'Second Year',
    shortLabel: '2nd Year',
    semesters: [
      { id: 'sem-3', label: 'Semester 3', number: 3, subjectsCount: 5 },
      { id: 'sem-4', label: 'Semester 4', number: 4, subjectsCount: 5 },
    ],
  },
  {
    id: 'third-year',
    label: 'Third Year',
    shortLabel: '3rd Year',
    semesters: [
      { id: 'sem-5', label: 'Semester 5', number: 5, subjectsCount: 5 },
      { id: 'sem-6', label: 'Semester 6', number: 6, subjectsCount: 5 },
    ],
  },
  {
    id: 'fourth-year',
    label: 'Fourth Year',
    shortLabel: '4th Year',
    semesters: [
      { id: 'sem-7', label: 'Semester 7', number: 7, subjectsCount: 4 },
      { id: 'sem-8', label: 'Semester 8', number: 8, subjectsCount: 4 },
    ],
  },
];

const RESOURCE_CARDS = [
  {
    id: 'notes',
    title: 'Notes',
    subtitle: 'Class & Topic Notes',
    description: 'Unit-wise handwritten & digital notes, lecture summaries, key formulas, and chapter definitions.',
    badge: 'Study Material',
    icon: BookOpen,
    btnText: 'Explore Notes',
  },
  {
    id: 'syllabus',
    title: 'Syllabus',
    subtitle: 'Official RGPV Scheme',
    description: 'Detailed university curriculum, subject credit breakdown, unit topics, and recommended textbooks.',
    badge: 'RGPV Scheme',
    icon: GraduationCap,
    btnText: 'View Syllabus',
  },
  {
    id: 'pyq',
    title: 'Previous Year Paper',
    subtitle: 'PYQs & Exam Papers',
    description: 'Past semester examination question papers, question banks, model solutions, and exam trends.',
    badge: 'Past Papers',
    icon: History,
    btnText: 'Open PYQs',
  },
];

const Home = ({ onSelectYearAndSemester }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const { user, isAuthenticated, isAdmin, logout } = useAuthStore();
  const [selectedYear, setSelectedYear] = useState(null);
  const [selectedSemester, setSelectedSemester] = useState(null);
  const [isLightOn, setIsLightOn] = useState(true);
  const [showNavbar, setShowNavbar] = useState(false);

  // Show Navbar dynamically when scrolling past hero
  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 80) {
        setShowNavbar(true);
      } else {
        setShowNavbar(false);
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();

    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Automatically scroll to target section if hash exists in URL
  useEffect(() => {
    if (location.hash) {
      const id = location.hash.replace('#', '');
      const element = document.getElementById(id);
      if (element) {
        setTimeout(() => {
          element.scrollIntoView({ behavior: 'smooth' });
        }, 150);
      }
    }
  }, [location.hash, location.pathname]);

  const handleYearSelect = (year) => {
    setSelectedYear(year);
    setSelectedSemester(null);
  };

  const handleBackToYears = () => {
    setSelectedYear(null);
    setSelectedSemester(null);
  };

  const handleSemesterSelect = (semester) => {
    setSelectedSemester(semester);
    if (onSelectYearAndSemester) {
      onSelectYearAndSemester({ year: selectedYear, semester });
    }
  };

  const handleResourceSelect = (resourceType) => {
    if (selectedSemester) {
      navigate(`/notes?semester=${selectedSemester.number}&type=${resourceType}`);
    } else {
      navigate(`/notes?type=${resourceType}`);
    }
  };

  const handleAccountClick = () => {
    if (isAuthenticated) {
      if (isAdmin) {
        navigate('/admin');
      }
    } else {
      navigate('/login');
    }
  };

  return (
    <div className="w-full bg-black min-h-screen text-white flex flex-col selection:bg-amber-500 selection:text-black">
      {/* Floating Navbar that shows smoothly while scrolling on Home */}
      <div 
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ease-in-out transform ${
          showNavbar 
            ? 'translate-y-0 opacity-100 shadow-[0_4px_30px_rgba(0,0,0,0.85)]' 
            : '-translate-y-full opacity-0 pointer-events-none'
        }`}
      >
        <Navbar />
      </div>

      {/* Hero / Semester Selector Section */}
      <section className="relative min-h-screen w-full flex flex-col justify-center items-center overflow-hidden font-sans select-none">
        {/* Top Header Bar: Brand Logo on Left, Interactive Controls on Right */}
        <header className="absolute top-3 sm:top-8 inset-x-0 z-30 px-3 sm:px-6 lg:px-10 flex items-center justify-between gap-2 w-full max-w-7xl mx-auto">
          {/* Top Left Corner Brand Logo */}
          <Link to="/" className="flex-shrink-0">
            <Logo />
          </Link>

          {/* Top Right Controls: Bulb Light Toggle, Browse Notes link & Account Icon & Logout */}
          <div className="flex items-center gap-1.5 sm:gap-3 flex-shrink-0">
            {/* Quick link to all notes (Admin only) */}
            {isAdmin && (
              <Link
                to="/notes"
                className="hidden md:inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-black/60 hover:bg-black/85 border border-white/20 hover:border-[#F59E0B] text-white text-xs font-semibold backdrop-blur-md transition-all cursor-pointer"
              >
                <BookOpen className="w-3.5 h-3.5 text-[#F59E0B]" />
                <span>All Notes</span>
              </Link>
            )}

            {/* Bulb Toggle Slider */}
            <BulbToggle 
              isLightOn={isLightOn} 
              onToggle={() => setIsLightOn((prev) => !prev)} 
            />

            {/* Round Account Icon */}
            <button
              type="button"
              onClick={handleAccountClick}
              aria-label="Account Profile"
              className="group relative flex items-center justify-center w-8 h-8 sm:w-11 sm:h-11 rounded-full bg-black/60 hover:bg-black/85 border border-white/30 hover:border-[#F59E0B] text-white shadow-[0_4px_20px_rgba(0,0,0,0.5)] backdrop-blur-md transition-all duration-300 hover:scale-105 active:scale-95 cursor-pointer"
            >
              <User className="w-4 h-4 sm:w-5 sm:h-5 text-gray-200 group-hover:text-[#F59E0B] transition-colors" />
              <span className="absolute -bottom-8 right-0 opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none text-xs font-semibold px-2 py-0.5 rounded bg-black/90 text-white border border-white/20 whitespace-nowrap shadow-md">
                {isAuthenticated ? (isAdmin ? 'Admin Console' : user?.name || 'Account') : 'Sign In'}
              </span>
            </button>

            {/* Logout Button on Home (visible whenever user or admin is logged in) */}
            {isAuthenticated && (
              <button
                type="button"
                onClick={logout}
                title="Sign Out"
                aria-label="Logout"
                className="group relative flex items-center justify-center w-8 h-8 sm:w-11 sm:h-11 rounded-full bg-black/60 hover:bg-red-950/40 border border-white/30 hover:border-red-500/60 text-gray-200 hover:text-red-400 shadow-[0_4px_20px_rgba(0,0,0,0.5)] backdrop-blur-md transition-all duration-300 hover:scale-105 active:scale-95 cursor-pointer"
              >
                <LogOut className="w-3.5 h-3.5 sm:w-4.5 sm:h-4.5 text-gray-300 group-hover:text-red-400 transition-colors" />
                <span className="absolute -bottom-8 right-0 opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none text-xs font-semibold px-2 py-0.5 rounded bg-black/90 text-red-300 border border-red-500/30 whitespace-nowrap shadow-md">
                  Logout
                </span>
              </button>
            )}
          </div>
        </header>

        {/* Background Image with Dynamic Lighting Effects */}
        <div 
          className={`absolute inset-0 bg-cover bg-center bg-no-repeat transition-all duration-700 ease-in-out scale-105 ${
            isLightOn ? 'filter brightness-105 saturate-110' : 'filter brightness-75 saturate-75'
          }`}
          style={{
            backgroundImage: `url(${libraryBg})`,
          }}
        >
          {/* Dynamic Multi-layered lighting overlay based on bulb state */}
          <div 
            className={`absolute inset-0 transition-opacity duration-700 ${
              isLightOn 
                ? 'bg-gradient-to-b from-black/55 via-amber-950/20 to-black/75 backdrop-blur-[0.5px]' 
                : 'bg-gradient-to-b from-black/85 via-black/75 to-black/90 backdrop-blur-[1.5px]'
            }`} 
          />
          
          {/* Warm Ambient Lamp Glow when Bulb is ON */}
          <div 
            className={`absolute inset-0 transition-opacity duration-700 pointer-events-none ${
              isLightOn ? 'opacity-100' : 'opacity-0'
            }`}
            style={{
              background: 'radial-gradient(ellipse at 50% 25%, rgba(251, 191, 36, 0.25) 0%, rgba(245, 158, 11, 0.1) 40%, transparent 70%)'
            }}
          />

          {/* Ambient Vignette */}
          <div className="absolute inset-0 bg-radial from-transparent via-black/30 to-black/90 pointer-events-none" />
        </div>

        {/* Main Content Area */}
        <div className="relative z-10 w-full max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12 flex flex-col items-center">
          
          {/* Main Heading - "Welcome to B.Tech CSE" & Subtitle */}
          <div className="text-center mb-8 sm:mb-10">
            <h1 className="text-4xl sm:text-6xl md:text-7xl font-extrabold tracking-tight text-white drop-shadow-lg">
              Welcome to <span className="text-[#F59E0B] drop-shadow-[0_2px_12px_rgba(245,158,11,0.4)]">B.Tech</span>{' '}
              <span className="text-white">CSE</span>
            </h1>
            <p className="mt-3 sm:mt-4 text-base sm:text-xl md:text-2xl font-medium text-gray-200/90 tracking-wide drop-shadow-md">
             <span className="text-[#F59E0B] font-bold mr-[7px]">RGPV</span>students only
            </p>
          </div>

          {/* Hero Interactive Card with Border & Glassmorphism */}
          <div className={`w-full ${selectedYear && selectedSemester ? 'max-w-5xl' : 'max-w-3xl'} rounded-2xl border border-white/40 bg-black/40 backdrop-blur-md p-6 sm:p-10 shadow-[0_8px_32px_0_rgba(0,0,0,0.5)] transition-all duration-300`}>
            
            {/* Dynamic Question / Instruction Text */}
            <div className="text-center mb-8">
              <h2 className="text-2xl sm:text-3xl md:text-4xl font-normal text-white tracking-wide">
                {!selectedYear ? (
                  <span>Please select your Year !</span>
                ) : !selectedSemester ? (
                  <span>Please select your Semester !</span>
                ) : (
                  <span>Select what you need for <span className="text-[#F59E0B] font-semibold">{selectedSemester.label}</span></span>
                )}
              </h2>
            </div>

            {/* Step 1: Year Selection (All 4 years visible initially) */}
            {!selectedYear && (
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4 transition-all duration-300">
                {YEARS_DATA.map((year) => (
                  <button
                    key={year.id}
                    onClick={() => handleYearSelect(year)}
                    className="group relative px-4 py-3 sm:py-3.5 rounded-xl bg-black/75 hover:bg-[#F59E0B] text-white hover:text-gray-950 font-medium text-sm sm:text-base border border-white/20 hover:border-[#F59E0B] shadow-md hover:shadow-[0_0_20px_rgba(245,158,11,0.5)] transition-all duration-200 transform hover:-translate-y-1 active:translate-y-0 text-center cursor-pointer flex items-center justify-center"
                  >
                    <span>{year.label}</span>
                  </button>
                ))}
              </div>
            )}

            {/* Step 2: Semester Selection (When year is selected, but semester is not yet chosen) */}
            {selectedYear && !selectedSemester && (
              <div className="flex flex-col items-center space-y-6">
                
                {/* Selected Year Pill with option to go back/change */}
                <div className="flex items-center gap-3">
                  <div className="flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#F59E0B]/20 border border-[#F59E0B]/50 text-[#F59E0B] text-sm font-semibold">
                    <GraduationCap className="w-4 h-4" />
                    <span>Selected: {selectedYear.label}</span>
                  </div>
                  <button
                    onClick={handleBackToYears}
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white/10 hover:bg-white/20 text-gray-200 hover:text-white text-xs sm:text-sm font-medium border border-white/20 transition-all cursor-pointer"
                    title="Change Year"
                  >
                    <ArrowLeft className="w-3.5 h-3.5" />
                    <span>Change Year</span>
                  </button>
                </div>

                {/* Semester Buttons for the selected year */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 w-full max-w-md">
                  {selectedYear.semesters.map((sem) => {
                    return (
                      <button
                        key={sem.id}
                        onClick={() => handleSemesterSelect(sem)}
                        className="group relative px-6 py-4 rounded-xl font-medium text-base sm:text-lg border shadow-lg transition-all duration-200 transform hover:-translate-y-0.5 active:translate-y-0 cursor-pointer flex items-center justify-between bg-black/80 hover:bg-[#F59E0B] text-white hover:text-gray-950 border-white/25 hover:border-[#F59E0B] hover:shadow-[0_0_25px_rgba(245,158,11,0.5)]"
                      >
                        <div className="flex items-center gap-3">
                          <FileText className="w-5 h-5 text-[#F59E0B] group-hover:text-gray-950 transition-colors" />
                          <span className="font-semibold">{sem.label}</span>
                        </div>
                        <ChevronRight className="w-5 h-5 text-gray-400 group-hover:text-gray-950 group-hover:translate-x-1 transition-transform" />
                      </button>
                    );
                  })}
                </div>

              </div>
            )}

            {/* Step 3: 3 Resource Cards (Notes, Syllabus, Previous Year Paper) */}
            {selectedYear && selectedSemester && (
              <div className="flex flex-col items-center space-y-6 w-full">
                
                {/* Breadcrumbs & Navigation Controls */}
                <div className="flex flex-wrap items-center justify-center gap-2.5 sm:gap-3">
                  <div className="flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#F59E0B]/20 border border-[#F59E0B]/50 text-[#F59E0B] text-xs sm:text-sm font-semibold">
                    <GraduationCap className="w-4 h-4" />
                    <span>{selectedYear.label} &bull; {selectedSemester.label}</span>
                  </div>

                  <button
                    onClick={() => setSelectedSemester(null)}
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white/10 hover:bg-white/20 text-gray-200 hover:text-white text-xs sm:text-sm font-medium border border-white/20 transition-all cursor-pointer"
                    title="Change Semester"
                  >
                    <ArrowLeft className="w-3.5 h-3.5" />
                    <span>Change Semester</span>
                  </button>

                  <button
                    onClick={handleBackToYears}
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white/10 hover:bg-white/20 text-gray-200 hover:text-white text-xs sm:text-sm font-medium border border-white/20 transition-all cursor-pointer"
                    title="Change Year"
                  >
                    <ArrowLeft className="w-3.5 h-3.5" />
                    <span>Change Year</span>
                  </button>
                </div>

                {/* The 3 Cards: Notes, Syllabus, Previous Year Paper */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-6 w-full pt-2">
                  {RESOURCE_CARDS.map((card) => {
                    const IconComponent = card.icon;
                    return (
                      <div
                        key={card.id}
                        onClick={() => handleResourceSelect(card.id)}
                        className="group relative rounded-2xl bg-gradient-to-b from-[#181818]/90 via-[#121212]/95 to-[#0a0a0a]/95 hover:from-[#221e14] hover:via-[#1a1710] hover:to-[#12100a] border border-white/15 hover:border-[#F59E0B]/80 p-6 flex flex-col justify-between transition-all duration-300 hover:-translate-y-1.5 shadow-[0_8px_30px_rgba(0,0,0,0.6)] hover:shadow-[0_12px_35px_rgba(245,158,11,0.25)] cursor-pointer text-left backdrop-blur-sm"
                      >
                        {/* Top glowing accent on hover */}
                        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-3/4 h-[2px] bg-gradient-to-r from-transparent via-[#F59E0B]/0 group-hover:via-[#F59E0B] transition-all duration-300" />

                        <div>
                          {/* Top Row: Icon & Badge */}
                          <div className="flex items-center justify-between gap-2 mb-4">
                            <div className="w-12 h-12 rounded-xl bg-[#F59E0B]/15 border border-[#F59E0B]/30 flex items-center justify-center text-[#F59E0B] group-hover:bg-[#F59E0B] group-hover:text-black group-hover:scale-105 transition-all duration-300 shadow-inner">
                              <IconComponent className="w-6 h-6" />
                            </div>
                            <span className="text-[10px] sm:text-[11px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-full bg-white/5 border border-white/10 text-gray-300 group-hover:border-[#F59E0B]/40 group-hover:text-[#F59E0B] transition-colors">
                              {card.badge}
                            </span>
                          </div>

                          {/* Title & Subtitle */}
                          <h3 className="text-xl font-bold text-white group-hover:text-[#F59E0B] transition-colors">
                            {card.title}
                          </h3>
                          <p className="text-xs text-[#F59E0B]/80 font-medium mt-0.5 mb-2.5">
                            {card.subtitle}
                          </p>

                          {/* Description */}
                          <p className="text-xs sm:text-sm text-gray-300/80 leading-relaxed">
                            {card.description}
                          </p>
                        </div>

                        {/* Card Action Button */}
                        <div className="mt-6 pt-4 border-t border-white/10 flex items-center justify-between text-xs sm:text-sm font-bold text-[#F59E0B] group-hover:text-amber-300">
                          <span>{card.btnText}</span>
                          <div className="w-7 h-7 rounded-full bg-[#F59E0B]/20 group-hover:bg-[#F59E0B] group-hover:text-black flex items-center justify-center transition-all duration-300 group-hover:translate-x-1">
                            <ArrowRight className="w-4 h-4 text-white group-hover:text-black" />
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>

              </div>
            )}

          </div>

        </div>
      </section>

      {/* 1. Services Section */}
      <ServicesSection />

      {/* 2. Contact Section */}
      <ContactSection />

      {/* 3. Footer / Last Section */}
      <FooterSection />
    </div>
  );
};

export default Home;
