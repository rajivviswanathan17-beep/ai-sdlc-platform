import React, { ReactNode } from 'react';
import { useAuth } from '../../contexts/AuthContext';

interface LayoutProps {
  children: ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  const { user, logout } = useAuth();

  return (
    <div className=\"min-h-screen bg-gray-50\">
      {/* Navigation */}
      <nav className=\"bg-white shadow-sm border-b border-gray-200\">
        <div className=\"max-w-7xl mx-auto px-4 sm:px-6 lg:px-8\">
          <div className=\"flex justify-between h-16\">
            <div className=\"flex items-center\">
              <h1 className=\"text-xl font-semibold text-gray-900\">
                AI-SDLC Platform
              </h1>
            </div>
            <div className=\"flex items-center space-x-4\">
              <span className=\"text-sm text-gray-700\">
                Welcome, {user?.firstName}
              </span>
              <button
                onClick={logout}
                className=\"btn btn-secondary\"
              >
                Logout
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main className=\"max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8\">
        {children}
      </main>
    </div>
  );
};

export default Layout;