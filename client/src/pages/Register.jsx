import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  User, 
  Mail, 
  Lock, 
  KeyRound, 
  ArrowRight, 
  AlertCircle, 
  ShieldAlert
} from 'lucide-react';
import Navbar from '../components/Navbar';
import FooterSection from '../components/FooterSection';
import Logo from '../components/Logo';
import useAuthStore from '../store/authStore';

const Register = ({ initialMode = 'register' }) => {
  const [isRegister, setIsRegister] = useState(initialMode === 'register');
  const [showAdminKey, setShowAdminKey] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    adminKey: '',
  });

  const { login, register, loading, error, clearError } = useAuthStore();
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleToggleMode = (mode) => {
    setIsRegister(mode === 'register');
    clearError();
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (isRegister) {
      if (formData.password !== formData.confirmPassword) {
        alert('Passwords do not match');
        return;
      }
      if (formData.password.length < 6) {
        alert('Password must be at least 6 characters');
        return;
      }

      const res = await register({
        name: formData.name,
        email: formData.email,
        password: formData.password,
        confirmPassword: formData.confirmPassword,
        adminKey: showAdminKey ? formData.adminKey : undefined,
      });

      if (res.success) {
        navigate(res.user?.role === 'admin' ? '/admin' : '/');
      }
    } else {
      const res = await login({
        email: formData.email,
        password: formData.password,
        adminKey: showAdminKey ? formData.adminKey : undefined,
      });

      if (res.success) {
        navigate(res.user?.role === 'admin' ? '/admin' : '/');
      }
    }
  };

  return (
    <div className="min-h-screen bg-black text-white flex flex-col selection:bg-amber-500 selection:text-black">
      <Navbar />

      <main className="flex-1 flex items-center justify-center p-4 sm:p-6 lg:p-8">
        <div className="w-full max-w-md bg-[#131313] border border-white/10 rounded-3xl p-6 sm:p-8 shadow-[0_10px_40px_rgba(0,0,0,0.8)] relative overflow-hidden">
          {/* Subtle Accent Glow */}
          <div className="absolute top-0 right-1/2 translate-x-1/2 w-64 h-64 bg-amber-500/10 rounded-full blur-[90px] pointer-events-none" />

          {/* Header */}
          <div className="text-center mb-6 relative z-10">
            <div className="flex justify-center mb-3">
              <Logo showSubtitle={false} />
            </div>
            <h2 className="text-2xl font-bold text-white tracking-tight">
              {isRegister ? 'Create an Account' : 'Welcome Back'}
            </h2>
            <p className="text-xs sm:text-sm text-gray-400 mt-1">
              {isRegister
                ? 'Join EduVault to access all study resources.'
                : 'Sign in to access your notes and bookmark materials.'}
            </p>
          </div>

          {/* Mode Switch Tabs */}
          <div className="grid grid-cols-2 p-1 rounded-xl bg-white/5 border border-white/10 mb-6 relative z-10">
            <button
              type="button"
              onClick={() => handleToggleMode('login')}
              className={`py-2 text-xs font-bold rounded-lg transition-all cursor-pointer ${
                !isRegister
                  ? 'bg-[#F59E0B] text-black shadow-md'
                  : 'text-gray-400 hover:text-white'
              }`}
            >
              Sign In
            </button>
            <button
              type="button"
              onClick={() => handleToggleMode('register')}
              className={`py-2 text-xs font-bold rounded-lg transition-all cursor-pointer ${
                isRegister
                  ? 'bg-[#F59E0B] text-black shadow-md'
                  : 'text-gray-400 hover:text-white'
              }`}
            >
              Sign Up
            </button>
          </div>

          {/* Error Message */}
          {error && (
            <div className="mb-4 flex items-center gap-2 p-3 rounded-xl bg-red-500/15 border border-red-500/30 text-red-400 text-xs sm:text-sm relative z-10">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          {/* Auth Form */}
          <form onSubmit={handleSubmit} className="space-y-4 relative z-10">
            {/* Name Field (Register mode only) */}
            {isRegister && (
              <div>
                <label className="block text-xs font-semibold text-gray-300 uppercase tracking-wider mb-1.5">
                  Full Name
                </label>
                <div className="relative">
                  <User className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                  <input
                    type="text"
                    name="name"
                    required
                    placeholder="e.g., Alex Johnson"
                    value={formData.name}
                    onChange={handleChange}
                    className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-white/5 border border-white/10 text-white placeholder-gray-500 text-sm focus:outline-none focus:ring-1 focus:ring-amber-500 focus:border-amber-500 transition-all"
                  />
                </div>
              </div>
            )}

            {/* Email Field */}
            <div>
              <label className="block text-xs font-semibold text-gray-300 uppercase tracking-wider mb-1.5">
                Email Address
              </label>
              <div className="relative">
                <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input
                  type="email"
                  name="email"
                  required
                  placeholder="e.g., student@rgpvnotes.in"
                  value={formData.email}
                  onChange={handleChange}
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-white/5 border border-white/10 text-white placeholder-gray-500 text-sm focus:outline-none focus:ring-1 focus:ring-amber-500 focus:border-amber-500 transition-all"
                />
              </div>
            </div>

            {/* Password Field */}
            <div>
              <label className="block text-xs font-semibold text-gray-300 uppercase tracking-wider mb-1.5">
                Password
              </label>
              <div className="relative">
                <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input
                  type="password"
                  name="password"
                  required
                  minLength={6}
                  placeholder="At least 6 characters"
                  value={formData.password}
                  onChange={handleChange}
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-white/5 border border-white/10 text-white placeholder-gray-500 text-sm focus:outline-none focus:ring-1 focus:ring-amber-500 focus:border-amber-500 transition-all"
                />
              </div>
            </div>

            {/* Confirm Password (Register mode only) */}
            {isRegister && (
              <div>
                <label className="block text-xs font-semibold text-gray-300 uppercase tracking-wider mb-1.5">
                  Confirm Password
                </label>
                <div className="relative">
                  <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                  <input
                    type="password"
                    name="confirmPassword"
                    required
                    minLength={6}
                    placeholder="Repeat password"
                    value={formData.confirmPassword}
                    onChange={handleChange}
                    className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-white/5 border border-white/10 text-white placeholder-gray-500 text-sm focus:outline-none focus:ring-1 focus:ring-amber-500 focus:border-amber-500 transition-all"
                  />
                </div>
              </div>
            )}

            {/* Admin Key Toggle (Optional) */}
            <div className="pt-1">
              <button
                type="button"
                onClick={() => setShowAdminKey(!showAdminKey)}
                className="flex items-center gap-1.5 text-xs text-amber-400/90 hover:text-amber-300 transition-colors cursor-pointer"
              >
                <KeyRound className="w-3.5 h-3.5" />
                <span>{showAdminKey ? 'Hide Admin Passkey' : 'Have an Admin Passkey?'}</span>
              </button>

              {showAdminKey && (
                <div className="mt-2 animate-fade-in">
                  <div className="relative">
                    <ShieldAlert className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-amber-500" />
                    <input
                      type="password"
                      name="adminKey"
                      placeholder="Enter Admin Secret Key"
                      value={formData.adminKey}
                      onChange={handleChange}
                      className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-amber-500/10 border border-amber-500/30 text-white placeholder-amber-400/50 text-sm focus:outline-none focus:ring-1 focus:ring-amber-500"
                    />
                  </div>
                  <p className="text-[11px] text-gray-400 mt-1">
                    Grants administrative permissions to publish notes and manage subjects.
                  </p>
                </div>
              )}
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading}
              className="w-full mt-2 py-3 rounded-xl bg-[#F59E0B] hover:bg-amber-400 disabled:opacity-50 text-black font-bold text-sm shadow-[0_4px_20px_rgba(245,158,11,0.35)] hover:shadow-[0_4px_25px_rgba(245,158,11,0.5)] transition-all cursor-pointer flex items-center justify-center gap-2"
            >
              <span>{loading ? 'Processing...' : isRegister ? 'Create Account' : 'Sign In'}</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </form>

          {/* Footer note */}
          <div className="mt-6 text-center text-xs text-gray-400">
            {isRegister ? (
              <span>
                Already have an account?{' '}
                <button
                  onClick={() => handleToggleMode('login')}
                  className="text-amber-400 hover:underline font-semibold cursor-pointer"
                >
                  Sign In
                </button>
              </span>
            ) : (
              <span>
                Don't have an account?{' '}
                <button
                  onClick={() => handleToggleMode('register')}
                  className="text-amber-400 hover:underline font-semibold cursor-pointer"
                >
                  Sign Up
                </button>
              </span>
            )}
          </div>
        </div>
      </main>

      <FooterSection />
    </div>
  );
};

export default Register;
