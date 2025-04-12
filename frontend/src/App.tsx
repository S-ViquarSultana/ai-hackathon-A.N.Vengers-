import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { ToastProvider } from './components/ui/toast';
import { ThemeProvider } from './context/ThemeContext';
import { AuthProvider } from './context/AuthContext';
import SignIn from './pages/SignIn';
import SignUp from './pages/SignUp';
import LandingPage from './pages/LandingPage';
import LandingPageMagic from './pages/LandingPageMagic';
import Dashboard from './pages/Dashboard';
import Profile from './pages/Profile';
import SkillAssessment from './pages/SkillAssessment';
import Performance from './pages/Performance';
import AssessmentQuestions from './components/AssessmentQuestions';
import Auth from './components/Auth';
import Chatbot from './components/Chatbot';
import Navbar from './components/Navbar'; 
import { SearchBar } from './components/ui/SearchBar';
import { ThemeManager } from './components/ThemeManager';
import CoursesPage from './pages/CoursesPage';
import InternshipsPage from './pages/InternshipsPage';
import ProjectsPage from './pages/ProjectsPage';
import AssessmentResult from './pages/ResultPage';

function App() {
  const handleSearch = (query: string) => {
    // Handle search logic here
    console.log('Search query:', query);
  };

  return (
      <ThemeProvider>
        <AuthProvider>
        <ToastProvider>
          <Router>
          <Navbar />
            <Routes>
              <Route path="/" element={<LandingPage/>} />
              <Route path="/magic" element={<LandingPageMagic />} />
              <Route path="/signin" element={<SignIn />} />
              <Route path="/signup" element={<SignUp />} />
              <Route path="/dashboard" element={<Dashboard />} />
              <Route path="/profile" element={<Profile />} />
              <Route path="/skill-assessment" element={<SkillAssessment />} />
              <Route path="/courses" element={<CoursesPage />} />
              <Route path="/performance" element={<Performance />} />
              <Route path="/auth" element={<Auth />} />
              <Route path="/internships" element={<InternshipsPage />} />
              <Route path="/projects" element={<ProjectsPage />} />
              <Route path="/assessments" element={<AssessmentQuestions />} />
              <Route path="/result" element={<AssessmentResult />} />
              <Route path="/chatbot" element={<Chatbot />} />
              <Route path="/theme" element={<ThemeManager><div>Theme Settings</div></ThemeManager>} />
              <Route path="/search" element={<SearchBar onSearch={handleSearch} />} />
            </Routes>
          </Router>
          </ToastProvider>
        </AuthProvider>
      </ThemeProvider>
  );
}

export default App; 