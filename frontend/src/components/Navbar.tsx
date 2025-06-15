import React from 'react';
import { Link } from 'react-router-dom';
import { useAuthStore } from '../store/useAuthStore';
import { Menu, X, Moon, Sun, Briefcase, FolderKanbanIcon, UserRound, LayoutDashboard, ClipboardList, GraduationCap, BarChart2, FolderKanban } from 'lucide-react';
import { useTheme } from '../context/ThemeContext';

export default function Navbar() {
  const { user, signOut } = useAuthStore();
  const { isDarkMode, toggleDarkMode } = useTheme();
  const [isMenuOpen, setIsMenuOpen] = React.useState(false);

  return (
    <nav className="bg-white dark:bg-gray-800 shadow-md">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center h-16">
          <Link to="/" className="text-xl font-bold text-gray-900 dark:text-white">
            AI Edu Guide
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-4">
          <Link to="/" title="Dashboard" className="text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white">
              <LayoutDashboard className="w-5 h-5" />
          </Link>
            <Link to="/skill-assessment" title="Skill Assessment" className="text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white">
              <ClipboardList className="w-5 h-5" />
            </Link>
            <Link to="/courses" title="Courses" className="text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white">
              <GraduationCap className="w-5 h-5" />
            </Link>
            <Link to="/performance" title="Performance" className="text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white">
              <BarChart2 className="w-5 h-5" />
            </Link>
            <Link to="/projects" className="text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white">
              <FolderKanbanIcon className="w-5 h-5" />
            </Link>
            <Link to="/internships" className="text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white">
              <Briefcase className="w-5 h-5" />
            </Link>
            <Link to="/profile" className="text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white">
              <UserRound className="w-5 h-5" />
            </Link>

            <button
              onClick={toggleDarkMode}
              className="p-2 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors duration-200"
              aria-label="Toggle dark mode"
            >
              {isDarkMode ? (
                <Sun className="w-5 h-5 text-yellow-500" />
              ) : (
                <Moon className="w-5 h-5 text-gray-600" />
              )}
            </button>
          </div>

          {/* Mobile Menu Button */}
          <div className="md:hidden flex items-center space-x-4">
            <button
              onClick={toggleDarkMode}
              className="p-2 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors duration-200"
              aria-label="Toggle dark mode"
            >
              {isDarkMode ? (
                <Sun className="w-5 h-5 text-yellow-500" />
              ) : (
                <Moon className="w-5 h-5 text-gray-600" />
              )}
            </button>
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="p-2 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700"
            >
              {isMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <div className="md:hidden py-4 space-y-2">
            <Link
              to="/"
              className="block text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white"
              onClick={() => setIsMenuOpen(false)}
            >
              Dashboard
            </Link>
            <Link
              to="/skill-assessment"
              className="block text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white"
              onClick={() => setIsMenuOpen(false)}
            >
              Skill Assessment
            </Link>
            <Link
              to="/courses"
              className="block text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white"
              onClick={() => setIsMenuOpen(false)}
            >
              Courses
            </Link>
            <Link
              to="/learning-path"
              className="block text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white"
              onClick={() => setIsMenuOpen(false)}
            >
              Learning Path
            </Link>
            <Link
              to="/performance"
              className="block text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white"
              onClick={() => setIsMenuOpen(false)}
            >
              Performance
            </Link>
            <Link
              to="/profile"
              className="block text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white"
              onClick={() => setIsMenuOpen(false)}
            >
              Profile
            </Link>
            {user ? (
              <button
                onClick={() => {
                  signOut();
                  setIsMenuOpen(false);
                }}
                className="w-full text-left text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white"
              >
                Sign Out
              </button>
            ) : (
              <Link
                to="/auth"
                className="block text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white"
                onClick={() => setIsMenuOpen(false)}
              >
                Sign In
              </Link>
            )}
          </div>
        )}
      </div>
    </nav>
  );
}