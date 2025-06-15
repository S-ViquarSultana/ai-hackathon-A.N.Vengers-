import React, { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { recommendations } from '../lib/api';
import { useToast } from '../context/ToastContext';
import { Input } from '../components/ui/input';
import { Button } from '../components/ui/button';
import { User, Book, Trophy, Clock, Settings } from 'lucide-react';
import { Card } from '../components/ui/card';


export default function Profile() {
  const { user: currentUser } = useAuth();
  const { showToast } = useToast();

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [interests, setInterests] = useState<string[]>([]);
  const [skills, setSkills] = useState<string[]>([]);
  const [newInterest, setNewInterest] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (currentUser) {
      setName(currentUser.username || currentUser.name || '');
      setEmail(currentUser.email || '');
      setInterests(currentUser.interests || []);
      setSkills(currentUser.skills || []);
    }
  }, [currentUser]);
  

  const handleAddInterest = () => {
    const interest = newInterest.trim();
    if (interest && !interests.includes(interest)) {
      setInterests([...interests, interest]);
      setNewInterest('');
    }
  };

  const handleRemoveInterest = (interest: string) => {
    setInterests(interests.filter((i) => i !== interest));
  };

  const handleSaveInterests = async () => {
    if (!currentUser) return;
    setIsLoading(true);
    try {
      await recommendations.updateInterests(currentUser._id, interests);
      showToast('Interests updated successfully', 'success');
    } catch (error) {
      showToast(error instanceof Error ? error.message : 'Failed to update interests', 'error');
    } finally {
      setIsLoading(false);
    }
  };


  return (
    <div className="space-y-12 p-8 max-w-screen-xl mx-auto">
      <div className="flex items-center space-x-4">
        <User className="w-10 h-10 text-blue-400" />
        <h1 className="text-5xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-purple-400 text-shadow">
          Welcome, {name || 'User'}
        </h1>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
        {/* Profile Card */}
        <Card className="rounded-3xl p-8 space-y-6 shadow-2xl glass-card h-full lg:col-span-1">
          <div className="flex flex-col items-center space-y-4">
          

            <div className="text-center space-y-1">
              <h2 className="text-2xl font-semibold text-content text-shadow">{name}</h2>
              <p className="text-black font-medium">{email}</p>
            </div>
          </div>

          <div className="space-y-5 mt-6">
            <div className="flex items-center space-x-4">
              <Book className="w-6 h-6 text-blue-400" />
              <span className="font-medium text-lg text-content">Learning Style: Visual</span>
            </div>
            <div className="flex items-center space-x-4">
              <Trophy className="w-6 h-6 text-yellow-400" />
              <span className="font-medium text-lg text-content">Experience: Intermediate</span>
            </div>
            <div className="flex items-center space-x-4">
              <Clock className="w-6 h-6 text-purple-400" />
              <span className="font-medium text-lg text-content">Member since 2024</span>
            </div>
          </div>
        </Card>

        {/* Skills + Interests Card */}
        <div className="lg:col-span-2 space-y-10">
          <Card className="rounded-3xl p-10 shadow-2xl">
            <div className="flex items-center gap-3 mb-6">
              <Settings className="text-green-500 w-6 h-6" />
              <h2 className="text-2xl font-bold text-shadow">Skills</h2>
            </div>
            <div className="flex flex-wrap gap-3">
              {skills.map((skill: string) => (
                <span key={skill} className="px-4 py-2 bg-green-100 text-green-800 rounded-full text-base font-medium">
                  {skill}
                </span>
              ))}
            </div>
          </Card>

          <Card className="rounded-3xl p-10 shadow-2xl">
            <div className="flex items-center gap-3 mb-6">
              <Book className="text-purple-500 w-6 h-6" />
              <h2 className="text-2xl font-bold text-shadow">Interests</h2>
            </div>

            <div className="flex gap-4 mb-6">
              <Input
                type="text"
                placeholder="Add new interest"
                value={newInterest}
                onChange={(e) => setNewInterest(e.target.value)}
                className="flex-1 text-lg px-4 py-3 rounded-xl"
              />
              <Button onClick={handleAddInterest} className="px-6 py-3 rounded-xl text-lg">Add</Button>
            </div>

            <div className="flex flex-wrap gap-3 mb-6">
              {interests.map((interest) => (
                <span
                  key={interest}
                  className="px-4 py-2 bg-gray-100 rounded-full flex items-center gap-2 text-base"
                >
                  {interest}
                  <button
                    onClick={() => handleRemoveInterest(interest)}
                    className="text-gray-500 hover:text-gray-700 font-bold"
                  >
                    ×
                  </button>
                </span>
              ))}
            </div>

            <Button
              onClick={handleSaveInterests}
              disabled={isLoading}
              className="w-full py-3 text-lg rounded-xl"
            >
              {isLoading ? 'Saving...' : 'Save Interests'}
            </Button>
          </Card>
        </div>
      </div>
    </div>
  );
}
