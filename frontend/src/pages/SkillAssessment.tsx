import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '../components/ui/button';
import { Card } from '../components/ui/card';
import { quizQuestions } from '../components/ui/data/question'; // Import questions from question.ts
import { useAuth } from '../context/AuthContext';
import { Loader2, ArrowLeft, ArrowRight, X } from 'lucide-react';

type Domain = {
  id: string;
  name: string;
  icon: string;
  description: string;
};

type SkillScores = {
  [key: string]: number;
};

const domain: Domain[] = [
  {
    id: 'web',
    name: 'Web Development',
    icon: '🌐',
    description: 'Test your knowledge in HTML, CSS, JavaScript, and modern web frameworks',
  },
  {
    id: 'data',
    name: 'Data Science',
    icon: '📊',
    description: 'Assess your skills in Python, statistics, machine learning, and data analysis',
  },
  {
    id: 'Machine',
    name: 'Machine Learning',
    icon: '🧠',
    description: 'Evaluate your ML knowledge in algorithms, models, and real-world applications',
  },
];

export default function SkillAssessment() {
  const { user } = useAuth();
  const [questions, setQuestions] = useState<typeof quizQuestions>([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedAnswers, setSelectedAnswers] = useState<Record<string, string>>({});
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  const fetchRandomQuestions = () => {
    const randomQuestions = [];
    const questionPool = [...quizQuestions];
    const numberOfQuestions = Math.floor(Math.random() * (20 - 10 + 1)) + 10;

    for (let i = 0; i < numberOfQuestions; i++) {
      const randomIndex = Math.floor(Math.random() * questionPool.length);
      randomQuestions.push(questionPool[randomIndex]);
      questionPool.splice(randomIndex, 1);
    }
    
    setQuestions(randomQuestions);
  };

  const handleAnswerSelect = (question: typeof quizQuestions[0], answer: string) => {
    setSelectedAnswers((prev) => ({ ...prev, [question.question]: answer }));
  };

  const handleNext = () => {
    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex((prev) => prev + 1);
    } else {
      calculateResults();
    }
  };

  const handlePrevious = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex((prev) => prev - 1);
    }
  };

  const calculateResults = () => {
    const skillScores: SkillScores = {};
    questions.forEach((question) => {
      const isCorrect = selectedAnswers[question.question] === question.correct_answer;
      if (!skillScores[question.domain]) skillScores[question.domain] = 0;
      if (isCorrect) skillScores[question.domain] += 1;
    });

    navigate('/result', {
      state: {
        skillLevels: skillScores,
      },
    });
  };

  const handleStartTest = () => {
    fetchRandomQuestions();
    setSelectedAnswers({});
    setCurrentQuestionIndex(0);
  };

  if (isLoading) {
    return <div className="flex justify-center py-8"><Loader2 className="h-8 w-8 animate-spin text-blue-500" /></div>;
  }

  if (error) {
    return <div className="text-red-500 text-center py-4">{error}</div>;
  }

  if (questions.length === 0) {
    return (
<div className="font-poppins text-white px-6 py-10">
  <h2 className="text-3xl font-bold text-center mb-8">Domains Covered in the Test</h2>
  <div className="grid md:grid-cols-3 gap-8 justify-center">
      {domain.map((domain) => (
      <div
        key={domain.id}
        className="p-6 bg-gradient-to-br from-indigo-600 to-purple-600 rounded-2xl shadow-xl transform hover:scale-105 hover:shadow-2xl transition duration-300 ease-in-out border-4 border-transparent hover:border-white"
      >
        <div className="text-6xl mb-4 text-center">{domain.icon}</div>
        {/* If you have image: <img src={domain.image} alt={domain.name} className="h-20 mx-auto mb-4" /> */}
        <h3 className="text-2xl font-semibold text-center">{domain.name}</h3>
        <p className="text-md text-gray-100 text-center mt-2">{domain.description}</p>
      </div>
    ))}
  </div>
  <p className="text-gray-300 mt-8 text-center">
    We will randomly select a set of questions for your test.
  </p>
  <div className="flex justify-center mt-4">
    <button
      onClick={handleStartTest}
      className="bg-blue-600 hover:bg-blue-700 transition duration-200 text-white font-semibold px-6 py-2 rounded-full shadow-md"
    >
      Proceed to Test
    </button>
  </div>
</div>
    );
  }

  const currentQuestion = questions[currentQuestionIndex];
  return (
    <div className="space-y-4">
      <div className="mb-6">
        <div className="flex justify-between items-center mb-2">
          <span className="text-sm text-gray-500">Question {currentQuestionIndex + 1} of {questions.length}</span>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-2">
          <div className="bg-blue-600 h-2 rounded-full" style={{ width: `${((currentQuestionIndex + 1) / questions.length) * 100}%` }}></div>
        </div>
      </div>

      <h3 className="text-xl font-semibold mb-6">{currentQuestion.question}</h3>

      <div className="space-y-3 mb-6">
        {(Object.keys(currentQuestion.options) as Array<keyof typeof currentQuestion.options>).map((key) => (
          <button
            key={key}
            onClick={() => handleAnswerSelect(currentQuestion, currentQuestion.options[key])}
            className={`w-full text-left p-4 rounded-lg border ${
              selectedAnswers[currentQuestion.question] === currentQuestion.options[key]
                ? 'border-blue-500 bg-blue-50'
                : 'border-gray-200 hover:border-blue-300'
            }`}
          >
            {currentQuestion.options[key]}
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
          <ArrowLeft className="w-4 h-4 mr-2" /> Previous
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
