import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import Logo from './Logo';

const Sidebar = () => {
  const location = useLocation();

  const isActive = (path) => {
    return location.pathname === path;
  };

  const navItems = [
    { path: '/', label: 'Dashboard', icon: '📊' },
    { path: '/transactions', label: 'Transactions', icon: '💳' },
    { path: '/categories', label: 'Categories', icon: '📂' },
    { path: '/analytics', label: 'Analytics', icon: '📈' },
  ];

  return (
    <div className="w-64 bg-gradient-to-b from-blue-600 to-blue-700 text-white shadow-lg flex flex-col">
      {/* Logo Section */}
      <div className="p-8 border-b border-blue-500 border-opacity-50 flex items-center gap-3 hover-lift">
        <Logo size="md" variant="light" />
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Expense</h1>
          <p className="text-xs text-blue-100 font-semibold">Tracker</p>
        </div>
      </div>

      {/* Navigation */}
      <nav className="mt-8 flex-1 overflow-y-auto">
        {navItems.map((item, index) => (
          <Link
            key={item.path}
            to={item.path}
            className={`block px-6 py-4 font-semibold transition-all duration-300 relative group ${
              isActive(item.path)
                ? 'bg-blue-500 border-r-4 border-white text-white shadow-md'
                : 'hover:bg-blue-600 text-blue-50 hover:text-white'
            }`}
            style={{
              animation: `slideInLeft 0.5s ease-out ${index * 0.1}s both`
            }}
          >
            <span className="mr-3 text-lg">{item.icon}</span>
            {item.label}
            {!isActive(item.path) && (
              <div className="absolute right-0 top-0 bottom-0 w-1 bg-gradient-to-b from-transparent via-white to-transparent opacity-0 group-hover:opacity-20 transition-opacity"></div>
            )}
          </Link>
        ))}
      </nav>

      {/* Footer */}
      <div className="p-6 border-t border-blue-500 border-opacity-50 text-center">
        <p className="text-xs text-blue-100 font-medium">v1.0.0</p>
      </div>
    </div>
  );
};

export default Sidebar;
