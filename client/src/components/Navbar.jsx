import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { 
  LogOut, 
  ShieldCheck, 
  PlusCircle, 
  Menu, 
  X
} from 'lucide-react';
import Logo from './Logo';
import useAuthStore from '../store/authStore';

const Navbar = ({ onOpenCreateModal }) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { user, isAuthenticated, isAdmin, logout } = useAuthStore();
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = () => {
    logout();
    navigate('/');
    setMobileMenuOpen(false);
  };

  const handleHomeClick = (e) => {
    setMobileMenuOpen(false);
    if (location.pathname === '/') {
      e.preventDefault();
      window.scrollTo({ top: 0, behavior: 'smooth' });
      window.history.pushState(null, '', '/');
    }
  };

  const handleScrollTo = (e, sectionId) => {
    e.preventDefault();
    setMobileMenuOpen(false);

    if (location.pathname === '/') {
      const element = document.getElementById(sectionId);
      if (element) {
        element.scrollIntoView({ behavior: 'smooth' });
        window.history.pushState(null, '', `/#${sectionId}`);
      }
    } else {
      navigate(`/#${sectionId}`);
    }
  };

  const isActive = (path) => location.pathname === path;

  return (
    <nav className="sticky top-0 z-50 w-full bg-black/85 backdrop-blur-xl border-b border-white/10 select-none transition-all duration-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 sm:h-20">
          {/* Left: Brand Logo */}
          <Link to="/" onClick={handleHomeClick} className="flex items-center">
            <Logo showSubtitle={false} />
          </Link>

          {/* Center: Desktop Navigation Links */}
          <div className="hidden md:flex items-center space-x-1 lg:space-x-2">
            {!isAdmin ? (
              <>
                <Link
                  to="/"
                  onClick={handleHomeClick}
                  className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                    isActive('/') && !location.hash
                      ? 'text-[#F59E0B] bg-white/5' 
                      : 'text-gray-300 hover:text-white hover:bg-white/5'
                  }`}
                >
                  Home
                </Link>

                <a
                  href="/#services"
                  onClick={(e) => handleScrollTo(e, 'services')}
                  className="px-3 py-2 rounded-lg text-sm font-medium text-gray-300 hover:text-white hover:bg-white/5 transition-colors cursor-pointer"
                >
                  Services
                </a>

                <a
                  href="/#contact"
                  onClick={(e) => handleScrollTo(e, 'contact')}
                  className="px-3 py-2 rounded-lg text-sm font-medium text-gray-300 hover:text-white hover:bg-white/5 transition-colors cursor-pointer"
                >
                  Contact
                </a>
              </>
            ) : (
              <>
                <Link
                  to="/notes"
                  className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                    isActive('/notes') 
                      ? 'text-[#F59E0B] bg-white/5' 
                      : 'text-gray-300 hover:text-white hover:bg-white/5'
                  }`}
                >
                  All Notes
                </Link>

                <Link
                  to="/admin"
                  className={`flex items-center gap-1.5 px-3 py-2 rounded-lg text-sm font-semibold transition-colors ${
                    isActive('/admin')
                      ? 'text-amber-400 bg-amber-500/10 border border-amber-500/30'
                      : 'text-amber-300/90 hover:text-amber-300 hover:bg-amber-500/10'
                  }`}
                >
                  <ShieldCheck className="w-4 h-4 text-[#F59E0B]" />
                  <span>Admin Panel</span>
                </Link>
              </>
            )}
          </div>

          {/* Right: Actions & User Menu */}
          <div className="hidden md:flex items-center gap-3">
            {/* Quick Create Note Button (Admins only) */}
            {isAdmin && onOpenCreateModal && (
              <button
                onClick={onOpenCreateModal}
                className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg bg-amber-500 hover:bg-amber-400 text-black font-semibold text-xs sm:text-sm transition-all shadow-[0_0_15px_rgba(245,158,11,0.3)] hover:scale-105 active:scale-95 cursor-pointer"
              >
                <PlusCircle className="w-4 h-4" />
                <span>New Note</span>
              </button>
            )}

            {isAuthenticated ? (
              <div className="flex items-center gap-2">
                {/* User Info Badge */}
                <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/5 border border-white/10 text-white text-xs">
                  <div className="w-6 h-6 rounded-full bg-gradient-to-tr from-amber-500 to-teal-400 flex items-center justify-center text-slate-950 font-bold text-[11px]">
                    {user?.name ? user.name.charAt(0).toUpperCase() : 'U'}
                  </div>
                  <span className="font-medium max-w-[100px] truncate">{user?.name}</span>
                  {isAdmin && (
                    <span className="px-1.5 py-0.5 rounded bg-amber-500/20 text-[#F59E0B] text-[10px] font-bold uppercase tracking-wider">
                      Admin
                    </span>
                  )}
                </div>

                {/* Logout Button */}
                <button
                  onClick={handleLogout}
                  title="Sign Out"
                  className="p-2 rounded-full text-gray-400 hover:text-red-400 hover:bg-red-500/10 border border-transparent hover:border-red-500/20 transition-all cursor-pointer"
                >
                  <LogOut className="w-4 h-4" />
                </button>
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <Link
                  to="/login"
                  className="px-4 py-1.5 rounded-full text-sm font-semibold text-gray-200 hover:text-white hover:bg-white/10 transition-colors"
                >
                  Sign In
                </Link>
                <Link
                  to="/register"
                  className="px-4 py-1.5 rounded-full bg-[#F59E0B] hover:bg-amber-400 text-black text-sm font-bold shadow-[0_0_15px_rgba(245,158,11,0.35)] transition-all hover:scale-105 active:scale-95"
                >
                  Sign Up
                </Link>
              </div>
            )}
          </div>

          {/* Mobile Menu Hamburger Button */}
          <div className="flex md:hidden items-center gap-2">
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 rounded-lg text-gray-300 hover:text-white hover:bg-white/10 transition-colors"
              aria-label="Toggle Navigation Menu"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu Dropdown */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-neutral-950/95 border-b border-white/10 px-4 pt-2 pb-6 space-y-3">
          {!isAdmin ? (
            <>
              <Link
                to="/"
                onClick={handleHomeClick}
                className="block px-3 py-2 rounded-lg text-base font-medium text-gray-200 hover:bg-white/5 hover:text-[#F59E0B]"
              >
                Home
              </Link>
              <a
                href="/#services"
                onClick={(e) => handleScrollTo(e, 'services')}
                className="block px-3 py-2 rounded-lg text-base font-medium text-gray-200 hover:bg-white/5 hover:text-[#F59E0B] cursor-pointer"
              >
                Services
              </a>
              <a
                href="/#contact"
                onClick={(e) => handleScrollTo(e, 'contact')}
                className="block px-3 py-2 rounded-lg text-base font-medium text-gray-200 hover:bg-white/5 hover:text-[#F59E0B] cursor-pointer"
              >
                Contact
              </a>
            </>
          ) : (
            <>
              <Link
                to="/notes"
                onClick={() => setMobileMenuOpen(false)}
                className="block px-3 py-2 rounded-lg text-base font-medium text-gray-200 hover:bg-white/5 hover:text-[#F59E0B]"
              >
                All Notes
              </Link>
              <Link
                to="/admin"
                onClick={() => setMobileMenuOpen(false)}
                className="flex items-center gap-2 px-3 py-2 rounded-lg text-base font-semibold text-amber-400 bg-amber-500/10 border border-amber-500/20"
              >
                <ShieldCheck className="w-5 h-5 text-[#F59E0B]" />
                <span>Admin Panel</span>
              </Link>
            </>
          )}

          <div className="pt-4 border-t border-white/10 flex flex-col gap-2">
            {isAuthenticated ? (
              <div className="space-y-3">
                <div className="flex items-center justify-between px-3 py-2 rounded-lg bg-white/5">
                  <span className="text-sm font-medium text-white">{user?.name}</span>
                  <span className="text-xs text-gray-400 uppercase">{user?.role}</span>
                </div>
                <button
                  onClick={handleLogout}
                  className="w-full flex items-center justify-center gap-2 px-4 py-2 rounded-lg bg-red-500/15 text-red-400 text-sm font-semibold hover:bg-red-500/25 transition-colors"
                >
                  <LogOut className="w-4 h-4" />
                  <span>Logout</span>
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-2 gap-2 pt-2">
                <Link
                  to="/login"
                  onClick={() => setMobileMenuOpen(false)}
                  className="text-center px-4 py-2 rounded-lg border border-white/20 text-white text-sm font-semibold hover:bg-white/5"
                >
                  Sign In
                </Link>
                <Link
                  to="/register"
                  onClick={() => setMobileMenuOpen(false)}
                  className="text-center px-4 py-2 rounded-lg bg-[#F59E0B] text-black text-sm font-bold hover:bg-amber-400"
                >
                  Sign Up
                </Link>
              </div>
            )}
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
