import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Brain, ArrowRight, Loader2, ArrowLeft, X } from 'lucide-react';
import { AssessmentQuestion, assessment } from '../lib/api';
import { useAuth } from '../context/AuthContext';
import { Button } from './ui/button';
import { Card } from './ui/card';
import { useToast } from './ui/toast';
import { Input } from './ui/input';

interface Domain {
  id: string;
  name: string;
  icon: string;
  description: string;
}

const DOMAINS: Domain[] = [
  {
    id: 'web',
    name: 'Web Development',
    icon: '🌐',
    description: 'Test your knowledge in HTML, CSS, JavaScript, and modern web frameworks'
  },
  {
    id: 'data',
    name: 'Data Science',
    icon: '📊',
    description: 'Assess your skills in Python, statistics, machine learning, and data analysis'
  },
  {
    id: 'mobile',
    name: 'Mobile Development',
    icon: '📱',
    description: 'Test your expertise in iOS, Android, and cross-platform mobile development'
  },
  {
    id: 'cloud',
    name: 'Cloud Computing',
    icon: '☁️',
    description: 'Evaluate your knowledge of cloud platforms, services, and architecture'
  }
];

export default function AssessmentQuestions() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { showToast } = useToast();
  const [selectedDomain, setSelectedDomain] = useState<Domain | null>(null);
  const [questions, setQuestions] = useState<AssessmentQuestion[]>([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedAnswers, setSelectedAnswers] = useState<Record<string, string>>({});
  const [showResults, setShowResults] = useState(false);
  const [skillLevels, setSkillLevels] = useState<Record<string, number>>({});
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<string[]>([]);
  const [isSearching, setIsSearching] = useState(false);

  const fetchQuestions = async (domainId: string) => {
    try {
      setIsLoading(true);
      setError(null);
      const response = await assessment.getAssessmentQuestions(String(user?.id || ''), domainId);
      if (!response.success || !response.data?.questions || response.data.questions.length === 0) {
        setError('No assessment questions available for this domain.');
        showToast('No questions available for this domain', 'error');
        return;
      }
      setQuestions(response.data.questions);
    } catch (err) {
      console.error('Error fetching questions:', err);
      setError('Failed to fetch assessment questions. Please try again later.');
      showToast('Failed to fetch questions', 'error');
    } finally {
      setIsLoading(false);
    }
  };

  const handleDomainSelect = (domain: Domain) => {
    setSelectedDomain(domain);
    setSelectedAnswers({});
    setCurrentQuestionIndex(0);
    setShowResults(false);
    setSkillLevels({});
    fetchQuestions(domain.id);
  };

  const handleAnswerSelect = (questionId: string, answer: string) => {
    setSelectedAnswers(prev => ({
      ...prev,
      [questionId]: answer
    }));
  };

  const handleNext = () => {
    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex(prev => prev + 1);
    } else {
      calculateResults();
    }
  };

  const handlePrevious = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex(prev => prev - 1);
    }
  };

  const calculateResults = () => {
    const skillScores: Record<string, number> = {};
    
    questions.forEach(question => {
      const isCorrect = selectedAnswers[question.id] === question.correctAnswer;
      if (!skillScores[question.skill]) {
        skillScores[question.skill] = 0;
      }
      if (isCorrect) {
        skillScores[question.skill] += 1;
      }
    });

    Object.keys(skillScores).forEach(skill => {
      const totalQuestionsForSkill = questions.filter(q => q.skill === skill).length;
      skillScores[skill] = Math.round((skillScores[skill] / totalQuestionsForSkill) * 100);
    });

    setSkillLevels(skillScores);
    setShowResults(true);
  };

  const handleBackToDomains = () => {
    setSelectedDomain(null);
    setQuestions([]);
    setSelectedAnswers({});
    setCurrentQuestionIndex(0);
    setShowResults(false);
    setSkillLevels({});
    setError(null);
  };

  useEffect(() => {
    const searchQuestions = async () => {
      if (searchQuery.length < 3) {
        setSearchResults([]);
        return;
      }

      setIsSearching(true);
      try {
        const response = await assessment.searchQuestions(searchQuery);
        if (response.success && response.data) {
          setSearchResults(response.data);
        }
      } catch (err) {
        console.error('Error searching questions:', err);
        showToast('Failed to search questions', 'error');
      } finally {
        setIsSearching(false);
      }
    };

    const debounceTimer = setTimeout(searchQuestions, 300);
    return () => clearTimeout(debounceTimer);
  }, [searchQuery]);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-8">
        <Loader2 className="h-8 w-8 animate-spin text-blue-500" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-red-500 text-center py-4">
        {error}
        <button
          onClick={handleBackToDomains}
          className="mt-4 text-blue-600 hover:text-blue-700"
        >
          Back to Domains
        </button>
      </div>
    );
  }

  if (showResults) {
    return (
      <div className="space-y-4">
        <div className="flex justify-between items-center">
          <h2 className="text-2xl font-bold">Your {selectedDomain?.name} Assessment Results</h2>
          <button
            onClick={handleBackToDomains}
            className="text-gray-500 hover:text-gray-700"
          >
            <X className="w-6 h-6" />
          </button>
        </div>
        <div className="space-y-4">
          {Object.entries(skillLevels).map(([skill, level]) => (
            <div key={skill} className="bg-white p-4 rounded-lg shadow">
              <div className="flex justify-between items-center mb-2">
                <span className="font-medium">{skill}</span>
                <span className="text-blue-600">{level}%</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2.5">
                <div
                  className="bg-blue-600 h-2.5 rounded-full"
                  style={{ width: `${level}%` }}
                ></div>
              </div>
            </div>
          ))}
        </div>
        <button
          onClick={handleBackToDomains}
          className="w-full mt-6 bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700"
        >
          Take Another Test
        </button>
      </div>
    );
  }

  if (questions.length > 0) {
    const currentQuestion = questions[currentQuestionIndex];
    return (
      <div className="space-y-4">
        <div className="flex justify-between items-center">
          <h2 className="text-2xl font-bold">{selectedDomain?.name} Assessment</h2>
          <button
            onClick={handleBackToDomains}
            className="text-gray-500 hover:text-gray-700"
          >
            <X className="w-6 h-6" />
          </button>
        </div>
        <div className="mb-6">
          <div className="flex justify-between items-center mb-2">
            <span className="text-sm text-gray-500">
              Question {currentQuestionIndex + 1} of {questions.length}
            </span>
            <span className="text-sm font-medium text-blue-600">
              {currentQuestion.skill}
            </span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div
              className="bg-blue-600 h-2 rounded-full"
              style={{ width: `${((currentQuestionIndex + 1) / questions.length) * 100}%` }}
            ></div>
          </div>
        </div>

        <h3 className="text-xl font-semibold mb-6">{currentQuestion.question}</h3>

        <div className="space-y-3 mb-6">
          {currentQuestion.options.map((option: string, index: number) => (
            <button
              key={index}
              onClick={() => handleAnswerSelect(currentQuestion.id, option)}
              className={`w-full text-left p-4 rounded-lg border ${
                selectedAnswers[currentQuestion.id] === option
                  ? 'border-blue-500 bg-blue-50'
                  : 'border-gray-200 hover:border-blue-300'
              }`}
            >
              {option}
            </button>
          ))}
        </div>

        <div className="flex justify-between">
          <button
            onClick={handlePrevious}
            disabled={currentQuestionIndex === 0}
            className={`flex items-center px-4 py-2 rounded-lg ${
              currentQuestionIndex === 0
                ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Previous
          </button>
          <button
            onClick={handleNext}
            className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
          >
            {currentQuestionIndex === questions.length - 1 ? 'Finish' : 'Next'}
            <ArrowRight className="w-4 h-4 ml-2" />
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="relative">
        <Input
          type="text"
          placeholder="Search for assessment questions..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full"
        />
        {isSearching && (
          <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
            <Loader2 className="h-4 w-4 animate-spin" />
          </div>
        )}
        {searchResults.length > 0 && (
          <div className="absolute w-full mt-1 bg-white border border-gray-200 rounded-lg shadow-lg max-h-60 overflow-y-auto z-10">
            {searchResults.map((question, index) => (
              <div
                key={index}
                className="p-3 hover:bg-gray-100 cursor-pointer"
                onClick={() => {
                  setSearchQuery(question);
                  setSearchResults([]);
                }}
              >
                {question}
              </div>
            ))}
          </div>
        )}
      </div>
      <h2 className="text-2xl font-bold">Choose a Domain to Test</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {DOMAINS.map((domain) => (
          <button
            key={domain.id}
            onClick={() => handleDomainSelect(domain)}
            className="flex items-start space-x-4 p-4 rounded-lg border border-gray-200 hover:border-blue-300 hover:bg-blue-50 transition-colors"
          >
            <span className="text-3xl">{domain.icon}</span>
            <div className="text-left">
              <h3 className="font-semibold">{domain.name}</h3>
              <p className="text-sm text-gray-600">{domain.description}</p>
            </div>
          </button>
        ))}
      </div>
    </div>
  );
}