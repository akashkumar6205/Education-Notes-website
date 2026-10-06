import React, { useState } from 'react';
import { BookOpen, GraduationCap, ArrowLeft, Sparkles, CheckCircle2, ChevronRight, FileText } from 'lucide-react';
import libraryBg from '../assets/library-bg.jpg';

const YEARS_DATA = [
  {
    id: 'first-year',
    label: 'First Year',
    shortLabel: '1st Year',
    semesters: [
      { id: 'sem-1', label: 'Semester 1', subjectsCount: 6 },
      { id: 'sem-2', label: 'Semester 2', subjectsCount: 6 },
    ],
  },
  {
    id: 'second-year',
    label: 'Second Year',
    shortLabel: '2nd Year',
    semesters: [
      { id: 'sem-3', label: 'Semester 3', subjectsCount: 5 },
      { id: 'sem-4', label: 'Semester 4', subjectsCount: 5 },
    ],
  },
  {
    id: 'third-year',
    label: 'Third Year',
    shortLabel: '3rd Year',
    semesters: [
      { id: 'sem-5', label: 'Semester 5', subjectsCount: 5 },
      { id: 'sem-6', label: 'Semester 6', subjectsCount: 5 },
    ],
  },
  {
    id: 'fourth-year',
    label: 'Fourth Year',
    shortLabel: '4th Year',
    semesters: [
      { id: 'sem-7', label: 'Semester 7', subjectsCount: 4 },
      { id: 'sem-8', label: 'Semester 8', subjectsCount: 4 },
    ],
  },
];

const Home = ({ onSelectYearAndSemester }) => {
  const [selectedYear, setSelectedYear] = useState(null);
  const [selectedSemester, setSelectedSemester] = useState(null);

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

  return (
    <section className="relative min-h-screen w-full flex flex-col justify-center items-center overflow-hidden font-sans select-none">
      {/* Background Image with Dark Vignette & Atmospheric Overlay */}
      <div 
        className="absolute inset-0 bg-cover bg-center bg-no-repeat transition-transform duration-700 scale-105"
        style={{
          backgroundImage: `url(${libraryBg})`,
        }}
      >
        {/* Multi-layered gradient overlay to match the warm dark library reference */}
        <div className="absolute inset-0 bg-gradient-to-b from-black/75 via-black/60 to-black/85 backdrop-blur-[1px]" />
        <div className="absolute inset-0 bg-radial from-transparent via-black/40 to-black/90" />
      </div>

      {/* Main Content Area */}
      <div className="relative z-10 w-full max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-12 flex flex-col items-center">
        
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
        <div className="w-full max-w-3xl rounded-2xl border border-white/40 bg-black/40 backdrop-blur-md p-6 sm:p-10 shadow-[0_8px_32px_0_rgba(0,0,0,0.5)] transition-all duration-300">
          
          {/* Top Tagline Badge */}
          {/* <div className="flex justify-center mb-6">
            <div className="inline-flex items-center gap-2 px-5 py-1.5 rounded-full bg-black/80 border border-white/20 text-white text-xs sm:text-sm font-semibold tracking-wide shadow-md">
              <BookOpen className="w-3.5 h-3.5 text-[#F59E0B]" />
              <span>Previous Year Question Paper</span>
            </div>
          </div> */}

          {/* Dynamic Question / Instruction Text */}
          <div className="text-center mb-8">
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-normal text-white tracking-wide">
              {!selectedYear ? (
                <span>Please select your Year !</span>
              ) : (
                <span>Please select your Semester !</span>
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

          {/* Step 2: Semester Selection (Remaining years are hidden, only selected year & semesters shown) */}
          {selectedYear && (
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
                  const isSelected = selectedSemester?.id === sem.id;
                  return (
                    <button
                      key={sem.id}
                      onClick={() => handleSemesterSelect(sem)}
                      className={`group relative px-6 py-4 rounded-xl font-medium text-base sm:text-lg border shadow-lg transition-all duration-200 transform hover:-translate-y-0.5 active:translate-y-0 cursor-pointer flex items-center justify-between ${
                        isSelected
                          ? 'bg-[#F59E0B] text-gray-950 border-[#F59E0B] shadow-[0_0_25px_rgba(245,158,11,0.6)]'
                          : 'bg-black/80 hover:bg-black/95 text-white border-white/25 hover:border-[#F59E0B]/70'
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <FileText className={`w-5 h-5 ${isSelected ? 'text-gray-950' : 'text-[#F59E0B]'}`} />
                        <span className="font-semibold">{sem.label}</span>
                      </div>
                      {isSelected ? (
                        <CheckCircle2 className="w-5 h-5 text-gray-950" />
                      ) : (
                        <ChevronRight className="w-5 h-5 text-gray-400 group-hover:text-white group-hover:translate-x-1 transition-transform" />
                      )}
                    </button>
                  );
                })}
              </div>

              {/* Action Banner when semester is picked */}
              {selectedSemester && (
                <div className="w-full max-w-md mt-2 p-4 rounded-xl bg-gradient-to-r from-amber-500/15 via-black/40 to-amber-500/15 border border-[#F59E0B]/40 backdrop-blur-sm flex items-center justify-between">
                  <div>
                    <p className="text-white font-medium text-sm">
                      Selected:
                    </p>
                    <p className="text-[#F59E0B] font-bold text-xs sm:text-sm">
                      {selectedYear.label} &bull; {selectedSemester.label}
                    </p>
                  </div>
                  <button 
                    onClick={() => console.log(`Selected: ${selectedYear.label} - ${selectedSemester.label}`)}
                    className="px-4 py-2 rounded-lg bg-[#F59E0B] hover:bg-amber-400 text-gray-950 font-bold text-xs sm:text-sm transition-colors shadow-md cursor-pointer flex items-center gap-1.5"
                  >
                    <Sparkles className="w-4 h-4" />
                    <span>View Papers</span>
                  </button>
                </div>
              )}

            </div>
          )}

        </div>

      </div>
    </section>
  );
};

export default Home;
