import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import { login } from '../redux/slices/authSlice';
import Logo from '../components/Logo';

const Login = () => {
  const [formData, setFormData] = useState({ email: '', password: '' });
  const [showPassword, setShowPassword] = useState(false);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { loading, error } = useSelector((state) => state.auth);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const result = await dispatch(login(formData));
    if (result.payload?.token) {
      toast.success('Login successful!');
      navigate('/');
    } else if (result.payload) {
      toast.error(result.payload);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-500 via-purple-500 to-pink-500 relative overflow-hidden">
      {/* Animated background elements */}
      <div className="absolute inset-0 opacity-20">
        <div className="absolute top-20 left-10 w-72 h-72 bg-white rounded-full mix-blend-multiply filter blur-3xl animate-blob"></div>
        <div className="absolute top-40 right-10 w-72 h-72 bg-purple-200 rounded-full mix-blend-multiply filter blur-3xl animate-blob animation-delay-2000"></div>
        <div className="absolute -bottom-8 left-20 w-72 h-72 bg-pink-200 rounded-full mix-blend-multiply filter blur-3xl animate-blob animation-delay-4000"></div>
      </div>

      {/* Login Card */}
      <div className="relative z-10 w-full max-w-md">
        {/* Glass Card */}
        <div className="glass-elevated p-10 rounded-2xl">
          {/* Logo */}
          <div className="flex justify-center mb-8">
            <div className="scale-in">
              <Logo size="lg" variant="light" />
            </div>
          </div>

          {/* Header */}
          <div className="text-center mb-8">
            <h1 className="text-4xl font-bold text-white mb-2">Welcome Back</h1>
            <p className="text-white text-opacity-80">Login to manage your expenses</p>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Email Field */}
            <div className="group">
              <label className="block text-white font-semibold mb-3 text-sm">Email Address</label>
              <div className="relative">
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="you@example.com"
                  className="w-full px-4 py-3 bg-white bg-opacity-20 border border-white border-opacity-30 rounded-xl text-black placeholder-white placeholder-opacity-50 focus:outline-none focus:bg-opacity-30 focus:border-opacity-60 transition-all duration-300 input-field"
                  required
                />
                <span className="absolute right-4 top-3.5 text-white text-opacity-50">📧</span>
              </div>
            </div>

            {/* Password Field */}
            <div className="group">
              <label className="block text-white font-semibold mb-3 text-sm">Password</label>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  placeholder="••••••••"
                  className="w-full px-4 py-3 bg-white bg-opacity-20 border border-white border-opacity-30 rounded-xl text-black placeholder-white placeholder-opacity-50 focus:outline-none focus:bg-opacity-30 focus:border-opacity-60 transition-all duration-300 input-field"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-3.5 text-white text-opacity-70 hover:text-opacity-100 transition-all"
                >
                  {showPassword ? '👁️' : '👁️‍🗨️'}
                </button>
              </div>
            </div>

            {/* Error Message */}
            {error && (
              <div className="bg-red-500 bg-opacity-30 border border-red-300 border-opacity-50 rounded-lg p-4 text-white font-semibold animate-shake">
                ⚠️ {error}
              </div>
            )}

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-gradient-to-r from-blue-400 to-blue-600 text-white py-3 rounded-xl font-bold text-lg hover:from-blue-500 hover:to-blue-700 disabled:opacity-60 transition-all duration-300 hover-lift shadow-lg hover:shadow-xl relative overflow-hidden group"
            >
              <span className={loading ? 'opacity-0' : 'opacity-100'}>
                {loading ? '🔄 Logging in...' : 'Login'}
              </span>
              {loading && (
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="loading-spinner border-white" style={{width: '20px', height: '20px', borderWidth: '2px'}}></div>
                </div>
              )}
            </button>
          </form>

          {/* Divider */}
          <div className="relative my-8">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-white border-opacity-20"></div>
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-2 bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 bg-clip-text text-transparent font-semibold">or</span>
            </div>
          </div>

          {/* Register Link */}
          <p className="text-center text-white">
            Don't have an account?{' '}
            <a href="/register" className="font-bold text-white hover:underline transition-all">
              Register here →
            </a>
          </p>
        </div>

        {/* Bottom Text */}
        <p className="text-center text-white text-opacity-60 text-sm mt-6">
          🔒 Your data is secure and encrypted
        </p>
      </div>

      {/* Blob animations CSS */}
      <style jsx>{`
        @keyframes blob {
          0%, 100% { transform: translate(0, 0) scale(1); }
          33% { transform: translate(30px, -50px) scale(1.1); }
          66% { transform: translate(-20px, 20px) scale(0.9); }
        }
        .animate-blob {
          animation: blob 7s infinite;
        }
        .animation-delay-2000 {
          animation-delay: 2s;
        }
        .animation-delay-4000 {
          animation-delay: 4s;
        }
        @keyframes shake {
          0%, 100% { transform: translateX(0); }
          25% { transform: translateX(-5px); }
          75% { transform: translateX(5px); }
        }
        .animate-shake {
          animation: shake 0.3s ease-in-out;
        }
      `}</style>
    </div>
  );
};

export default Login;
