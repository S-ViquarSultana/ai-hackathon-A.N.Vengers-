import React, { useState } from 'react';
import {
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer
} from 'recharts';
import {
  TrendingUp, Clock, Target, Award, BookOpen, Brain
} from 'lucide-react';

const initialData = [
  { month: 'Jan', score: 65, hours: 20 },
  { month: 'Feb', score: 75, hours: 25 },
  { month: 'Mar', score: 85, hours: 30 },
  { month: 'Apr', score: 80, hours: 28 },
  { month: 'May', score: 90, hours: 35 },
  { month: 'Jun', score: 95, hours: 40 },
];

const stats = [
  { title: 'Total Learning Hours', value: '148', icon: Clock, color: 'text-blue-500' },
  { title: 'Average Score', value: '82%', icon: Target, color: 'text-green-500' },
  { title: 'Courses Completed', value: '12', icon: BookOpen, color: 'text-purple-500' },
  { title: 'Skills Mastered', value: '8', icon: Brain, color: 'text-yellow-500' },
];

export default function Performance() {
  const [performanceData, setPerformanceData] = useState(initialData);
  const [newEntry, setNewEntry] = useState({ month: '', score: '', hours: '' });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setNewEntry({ ...newEntry, [e.target.name]: e.target.value });
  };

  const addNewEntry = () => {
    if (newEntry.month && newEntry.score && newEntry.hours) {
      setPerformanceData([
        ...performanceData,
        {
          month: newEntry.month,
          score: Number(newEntry.score),
          hours: Number(newEntry.hours)
        }
      ]);
      setNewEntry({ month: '', score: '', hours: '' });
    }
  };

  return (
    <div className="max-w-7xl mx-auto p-6">
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-500 to-purple-500 text-transparent bg-clip-text">
          Performance Analytics
        </h1>
        <div className="flex items-center space-x-2">
          <TrendingUp className="w-6 h-6 text-green-500" />
          <span className="text-lg font-semibold">Overall Progress: 85%</span>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        {stats.map((stat, index) => (
          <div key={index} className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm">
            <div className="flex items-center space-x-4">
              <div className={`p-3 rounded-lg bg-opacity-10 ${stat.color.replace('text-', 'bg-')}`}>
                <stat.icon className={`w-6 h-6 ${stat.color}`} />
              </div>
              <div>
                <p className="text-sm text-gray-500 dark:text-gray-400">{stat.title}</p>
                <p className="text-2xl font-bold">{stat.value}</p>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Add Test Result Form */}
      <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm mb-8">
        <h2 className="text-xl font-semibold mb-4">Add New Test Result</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
          <input
            type="text"
            name="month"
            value={newEntry.month}
            onChange={handleChange}
            placeholder="Month (e.g. Jul)"
            className="p-2 border rounded"
          />
          <input
            type="number"
            name="score"
            value={newEntry.score}
            onChange={handleChange}
            placeholder="Score"
            className="p-2 border rounded"
          />
          <input
            type="number"
            name="hours"
            value={newEntry.hours}
            onChange={handleChange}
            placeholder="Hours"
            className="p-2 border rounded"
          />
        </div>
        <button
          onClick={addNewEntry}
          className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
        >
          Add Result
        </button>
      </div>

      {/* Performance Graph */}
      <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm">
        <h2 className="text-xl font-semibold mb-6">Learning Progress</h2>
        <div className="h-80">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={performanceData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="month" />
              <YAxis yAxisId="left" />
              <YAxis yAxisId="right" orientation="right" />
              <Tooltip />
              <Line yAxisId="left" type="monotone" dataKey="score" stroke="#3B82F6" strokeWidth={2} />
              <Line yAxisId="right" type="monotone" dataKey="hours" stroke="#10B981" strokeWidth={2} />
            </LineChart>
          </ResponsiveContainer>
        </div>
        <div className="flex justify-center space-x-8 mt-4">
          <div className="flex items-center space-x-2">
            <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
            <span className="text-sm">Assessment Score</span>
          </div>
          <div className="flex items-center space-x-2">
            <div className="w-3 h-3 bg-green-500 rounded-full"></div>
            <span className="text-sm">Learning Hours</span>
          </div>
        </div>
      </div>

      {/* Recent Achievements */}
      <div className="mt-8">
        <h2 className="text-xl font-semibold mb-6">Recent Achievements</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {[
            {
              title: 'JavaScript Master',
              description: 'Completed Advanced JavaScript course with 95% score',
              icon: '🎯',
              date: '2024-03-15'
            },
            {
              title: 'Fast Learner',
              description: 'Completed 5 courses in one month',
              icon: '⚡',
              date: '2024-03-10'
            },
            {
              title: 'Perfect Score',
              description: 'Achieved 100% in Web Development Fundamentals',
              icon: '💯',
              date: '2024-03-05'
            }
          ].map((achievement, index) => (
            <div key={index} className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm">
              <div className="flex items-start space-x-4">
                <div className="text-4xl">{achievement.icon}</div>
                <div>
                  <h3 className="font-semibold">{achievement.title}</h3>
                  <p className="text-sm text-gray-500 mt-1">{achievement.description}</p>
                  <p className="text-xs text-gray-400 mt-2">
                    {new Date(achievement.date).toLocaleDateString()}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
