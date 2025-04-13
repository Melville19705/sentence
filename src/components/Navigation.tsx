import { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { Menu, X, User, LogOut, Award, Home } from 'lucide-react';

interface NavigationProps {
  onNavigate: (page: string) => void;
  currentPage: string;
}

const Navigation = ({ onNavigate, currentPage }: NavigationProps) => {
  const { user, logout } = useAuth();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const handleNavigate = (page: string) => {
    onNavigate(page);
    setIsMenuOpen(false);
  };

  return (
    <nav className="bg-white dark:bg-gray-800 shadow-md">
      <div className="max-w-6xl mx-auto px-4">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <h1 
              onClick={() => handleNavigate('home')}
              className="text-xl font-bold text-gray-900 dark:text-white cursor-pointer"
            >
              Sentence Builder
            </h1>
          </div>
          
          <div className="hidden md:flex items-center space-x-4">
            <button
              onClick={() => handleNavigate('home')}
              className={`px-3 py-2 rounded-md text-sm font-medium ${
                currentPage === 'home'
                  ? 'bg-blue-100 dark:bg-blue-900 text-blue-700 dark:text-blue-200'
                  : 'text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700'
              }`}
            >
              <Home size={18} className="inline mr-1" />
              Home
            </button>
            
            <button
              onClick={() => handleNavigate('leaderboard')}
              className={`px-3 py-2 rounded-md text-sm font-medium ${
                currentPage === 'leaderboard'
                  ? 'bg-blue-100 dark:bg-blue-900 text-blue-700 dark:text-blue-200'
                  : 'text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700'
              }`}
            >
              <Award size={18} className="inline mr-1" />
              Leaderboard
            </button>
            
            {user ? (
              <>
                <button
                  onClick={() => handleNavigate('profile')}
                  className={`px-3 py-2 rounded-md text-sm font-medium ${
                    currentPage === 'profile'
                      ? 'bg-blue-100 dark:bg-blue-900 text-blue-700 dark:text-blue-200'
                      : 'text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700'
                  }`}
                >
                  <User size={18} className="inline mr-1" />
                  Profile
                </button>
                
                <button
                  onClick={logout}
                  className="px-3 py-2 rounded-md text-sm font-medium text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700"
                >
                  <LogOut size={18} className="inline mr-1" />
                  Logout
                </button>
              </>
            ) : (
              <button
                onClick={() => handleNavigate('login')}
                className="px-3 py-2 rounded-md text-sm font-medium bg-blue-600 text-white hover:bg-blue-700"
              >
                Login
              </button>
            )}
            
            <button
              onClick={toggleMenu}
              className="ml-2 inline-flex items-center justify-center p-2 rounded-md text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700 focus:outline-none"
            >
              {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>
      </div>
      
      {isMenuOpen && (
        <div className="md:hidden">
          <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
            <button
              onClick={() => handleNavigate('home')}
              className={`block px-3 py-2 rounded-md text-base font-medium w-full text-left ${
                currentPage === 'home'
                  ? 'bg-blue-100 dark:bg-blue-900 text-blue-700 dark:text-blue-200'
                  : 'text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700'
              }`}
            >
              <Home size={18} className="inline mr-2" />
              Home
            </button>
            
            <button
              onClick={() => handleNavigate('leaderboard')}
              className={`block px-3 py-2 rounded-md text-base font-medium w-full text-left ${
                currentPage === 'leaderboard'
                  ? 'bg-blue-100 dark:bg-blue-900 text-blue-700 dark:text-blue-200'
                  : 'text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700'
              }`}
            >
              <Award size={18} className="inline mr-2" />
              Leaderboard
            </button>
            
            {user ? (
              <>
                <button
                  onClick={() => handleNavigate('profile')}
                  className={`block px-3 py-2 rounded-md text-base font-medium w-full text-left ${
                    currentPage === 'profile'
                      ? 'bg-blue-100 dark:bg-blue-900 text-blue-700 dark:text-blue-200'
                      : 'text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700'
                  }`}
                >
                  <User size={18} className="inline mr-2" />
                  Profile
                </button>
                
                <button
                  onClick={logout}
                  className="block px-3 py-2 rounded-md text-base font-medium w-full text-left text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700"
                >
                  <LogOut size={18} className="inline mr-2" />
                  Logout
                </button>
              </>
            ) : (
              <button
                onClick={() => handleNavigate('login')}
                className="block px-3 py-2 rounded-md text-base font-medium w-full text-left bg-blue-600 text-white hover:bg-blue-700"
              >
                Login
              </button>
            )}
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navigation;