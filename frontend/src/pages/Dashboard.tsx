import React, { useEffect, useState } from 'react';
import { Compass, Book, Brain, Star, Play, Plus } from 'lucide-react';
import { useAuth,  } from '../context/AuthContext';
import { useToast } from '../components/ui/toast';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const courseImages = {
  programming: "https://images.unsplash.com/photo-1555066931-4365d14bab8c?auto=format&fit=crop&q=80&w=600",
  design: "https://images.unsplash.com/photo-1561070791-2526d30994b5?auto=format&fit=crop&q=80&w=600",
  business: "https://images.unsplash.com/photo-1554224155-8d04cb21cd6c?auto=format&fit=crop&q=80&w=600",
};

export default function Dashboard() {
  const { user, isAuthenticated } = useAuth();
  const { showToast } = useToast();
  const navigate = useNavigate();
  const [progress, setProgress] = useState(30); // % dummy
  const [achievements, setAchievements] = useState([
    { title: 'HTML Hero', icon: '📄', unlocked: true },
    { title: 'CSS Champ', icon: '🎨', unlocked: true },
    { title: 'JS Ninja', icon: '⚡', unlocked: false },
    { title: 'React Rookie', icon: '⚛️', unlocked: true },
    { title: '100 XP Earned', icon: '🔥', unlocked: false },
    { title: 'First Project', icon: '🚀', unlocked: true },
  ]);

  useEffect(() => {
    const fetchProgress = async () => {
      try {
        const res = await axios.get(`http://localhost:5000/api/user/${user?._id}/progress`);
        setProgress(res.data.progress); // Expecting a number
      } catch (err) {
        console.warn('Using fallback progress data.');
      }
    };

    const fetchAchievements = async () => {
      try {
        const res = await axios.get(`http://localhost:5000/api/user/${user?._id}/achievements`);
        setAchievements(res.data); // Array of { title, icon, unlocked }
      } catch (err) {
        console.warn('Using dummy achievements.');
      }
    };

    fetchProgress();
    fetchAchievements();
  }, [user]);

  

  return (
    <div className="min-h-screen p-6 md:p-8 bg-gray-950 text-white">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-4xl font-bold text-gradient bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
          Welcome, {user?.email?.split('@')[0] || 'Learner'}
        </h1>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Progress Card */}
        <div className="glass-card bg-gray-800 rounded-xl p-6 space-y-4">
          <div className="flex items-center space-x-3">
            <Book className="w-6 h-6 text-blue-400" />
            <h2 className="text-xl font-semibold text-blue-100">Current Progress</h2>
          </div>
          <div className="space-y-4">
            <p className="text-sm text-blue-200">Web Development</p>
            <div className="w-full bg-gray-700 h-3 rounded overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-blue-400 to-purple-500 transition-all duration-700"
                style={{ width: `${progress}%` }}
              ></div>
            </div>
            <div className="text-right text-xs text-blue-300">{progress}% completed</div>
            <div className="flex space-x-2">
              <button onClick={() => navigate('/courses')} className="btn btn-sm bg-blue-600 hover:bg-blue-700 text-white px-3 py-1 rounded flex items-center space-x-2">
                <Play className="w-4 h-4" />
                <span>Continue Learning</span>
              </button>
              <button onClick={() => navigate('/courses')} className="btn btn-sm bg-purple-600 hover:bg-purple-700 text-white px-3 py-1 rounded flex items-center space-x-2">
                <Plus className="w-4 h-4" />
                <span>Start New Course</span>
              </button>
            </div>
          </div>
        </div>

        {/* Recommended Paths */}
        <div className="glass-card bg-gray-800 rounded-xl p-6 space-y-4">
          <div className="flex items-center space-x-3">
            <Brain className="w-6 h-6 text-purple-400" />
            <h2 className="text-xl font-semibold text-blue-100">Recommended Paths</h2>
          </div>
          <div className="space-y-4">
            {Object.entries(courseImages).map(([category, image]) => (
              <div key={category} className="relative group rounded-lg overflow-hidden">
                <img
                  src={image}
                  alt={category}
                  className="w-full h-24 object-cover opacity-80 group-hover:opacity-100 transition-opacity duration-300"
                />
                <div className="absolute inset-0 bg-gradient-to-r from-black/40 to-transparent flex items-center justify-center">
                  <span className="text-white font-medium capitalize">{category}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Achievements */}
        <div className="glass-card bg-gray-800 rounded-xl p-6 space-y-4">
          <div className="flex items-center space-x-3">
            <Star className="w-6 h-6 text-yellow-400" />
            <h2 className="text-xl font-semibold text-blue-100">Achievements</h2>
          </div>
          <div className="grid grid-cols-3 gap-3">
            {achievements.map((a, i) => (
              <div
                key={i}
                className={`aspect-square rounded-xl flex flex-col items-center justify-center p-2 text-center ${
                  a.unlocked
                    ? 'bg-gradient-to-br from-green-600 to-blue-700'
                    : 'bg-gray-700 opacity-50'
                } transition duration-300`}
              >
                <div className="text-2xl">{a.unlocked ? a.icon : '🔒'}</div>
                <div className="text-xs mt-1 text-white">{a.title}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

