import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { logout } from '../redux/slices/authSlice';

const Navbar = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { user } = useSelector((state) => state.auth);

  const handleLogout = () => {
    dispatch(logout());
    navigate('/login');
  };

  const currentHour = new Date().getHours();
  const greeting = currentHour < 12 ? 'Good Morning' : currentHour < 18 ? 'Good Afternoon' : 'Good Evening';

  return (
    <nav className="bg-gradient-to-r from-white via-blue-50 to-white shadow-lg px-8 py-4 flex justify-between items-center border-b-2 border-blue-100">
      <div className="flex items-center gap-4">
        <div>
          <h2 className="text-2xl font-bold text-gradient">{greeting}, {user?.name?.split(' ')[0]}! 👋</h2>
          <p className="text-sm text-gray-500 mt-1">
            {new Date().toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
          </p>
        </div>
      </div>

      <button
        onClick={handleLogout}
        className="bg-gradient-to-r from-red-500 to-red-600 text-white px-6 py-2 rounded-lg hover:from-red-600 hover:to-red-700 font-semibold transition-all duration-300 hover-lift shadow-lg hover:shadow-xl flex items-center gap-2"
      >
        <span>🚪</span>
        Logout
      </button>
    </nav>
  );
};

export default Navbar;
