import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Loader2, ArrowLeft, ArrowRight } from 'lucide-react';
import { quizQuestions } from '../components/ui/data/question';
import { useAuth } from '../context/AuthContext';

type Domain = {
  id: string;
  name: string;
  icon: string;
  description: string;
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

type SkillLevels = Record<string, { correct: number; total: number }>;

export default function SkillAssessment() {
  const { user } = useAuth();
  const navigate = useNavigate();

  const [questions, setQuestions] = useState<typeof quizQuestions>([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedAnswers, setSelectedAnswers] = useState<Record<string, string>>({});
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [skillLevels, setSkillLevels] = useState<SkillLevels>({});
  const [quizStarted, setQuizStarted] = useState(false);
  const [userLevel, setUserLevel] = useState<'Beginner' | 'Intermediate' | 'Advanced' | null>(null);
  const [correctCount, setCorrectCount] = useState(0);
  const [totalQuestions, setTotalQuestions] = useState(0);
  const [badge, setBadge] = useState("Bronze");

  useEffect(() => {
    // 🔁 Navigate to result page after skillLevels are calculated
    if (Object.keys(skillLevels).length > 0) {
      navigate('/result', {
        state: {
          skillLevels,
          domain,
          badge,
          userLevel,
          selectedAnswers,
          quizQuestions,
          correctCount,
          totalQuestions
        }
      });
    }
  }, [skillLevels]);

  const fetchRandomQuestions = () => {
    if (!userLevel) return;

    const questionPool = quizQuestions.filter((q) => q.difficulty_level === userLevel);
    const numberOfQuestions = Math.min(questionPool.length, Math.floor(Math.random() * (20 - 10 + 1)) + 10);
    const randomQuestions = [];

    for (let i = 0; i < numberOfQuestions && questionPool.length > 0; i++) {
      const randomIndex = Math.floor(Math.random() * questionPool.length);
      randomQuestions.push(questionPool[randomIndex]);
      questionPool.splice(randomIndex, 1);
    }

    setQuestions(randomQuestions);
    setSelectedAnswers({});
    setCurrentQuestionIndex(0);
  };

  const handleAnswerSelect = (question: typeof quizQuestions[0], answer: string) => {
    setSelectedAnswers((prev) => ({ ...prev, [question.question]: answer }));
  };

  const calculateResults = () => {
    let correctCount = 0;
    let totalQuestions = 0;
    const skillLevels: SkillLevels = {};

    questions.forEach((question) => {
      const skill = question.domain;
      const userAnswer = selectedAnswers[question.question]?.trim().toLowerCase();
      const correctAnswer = question.correct_answer?.trim().toLowerCase();
      const isCorrect = userAnswer === correctAnswer;

      if (!skillLevels[skill]) {
        skillLevels[skill] = { correct: 0, total: 0 };
      }

      skillLevels[skill].total += 1;
      totalQuestions++;

      if (isCorrect) {
        skillLevels[skill].correct += 1;
        correctCount++;
      }
    });

    let badge = 'Bronze';
    if (correctCount >= 10) badge = 'Gold';
    else if (correctCount >= 7) badge = 'Silver';

    setBadge(badge);
    setSkillLevels(skillLevels);
    setCorrectCount(correctCount);
    setTotalQuestions(totalQuestions);
  };

  const handleStartTest = () => {
    setQuizStarted(true);
    fetchRandomQuestions();
  };

  const handleNext = () => {
    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex((prev) => prev + 1);
    } else {
      calculateResults(); // ✅ Triggers useEffect to navigate
    }
  };

  const handlePrevious = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex((prev) => prev - 1);
    }
  };

  if (isLoading) {
    return (
      <div className="flex justify-center py-8">
        <Loader2 className="h-8 w-8 animate-spin text-blue-500" />
      </div>
    );
  }

  if (error) {
    return <div className="text-red-500 text-center py-4">{error}</div>;
  }

  if (questions.length === 0) {
    return (
      <div className="font-poppins text-white px-6 py-10">
        {!userLevel ? (
          <div className="text-center mt-6">
            <h3 className="text-lg font-medium text-white mb-4">What best describes your current level?</h3>
            <div className="flex justify-center gap-4 mb-8">
              {['Beginner', 'Intermediate', 'Advanced'].map((level) => (
                <button
                  key={level}
                  className={`px-4 py-2 rounded-full ${
                    userLevel === level
                      ? 'bg-blue-600 text-white'
                      : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                  }`}
                  onClick={() => setUserLevel(level as 'Beginner' | 'Intermediate' | 'Advanced')}
                >
                  {level}
                </button>
              ))}
            </div>
          </div>
        ) : (
          <>
            <h2 className="text-3xl font-bold text-center mb-8">Domains Covered in the Test</h2>
            <div className="grid md:grid-cols-3 gap-8 justify-center">
              {domain.map((d) => (
                <div
                  key={d.id}
                  className="p-6 bg-gradient-to-br from-indigo-600 to-purple-600 rounded-2xl shadow-xl transform hover:scale-105 hover:shadow-2xl transition duration-300 ease-in-out border-4 border-transparent hover:border-white"
                >
                  <div className="text-6xl mb-4 text-center">{d.icon}</div>
                  <h3 className="text-2xl font-semibold text-center">{d.name}</h3>
                  <p className="text-md text-gray-100 text-center mt-2">{d.description}</p>
                </div>
              ))}
            </div>
            <p className="text-gray-300 mt-8 text-center">We will randomly select a set of questions for your test.</p>
            <div className="flex justify-center mt-4">
              <button
                onClick={handleStartTest}
                className="bg-blue-600 hover:bg-blue-700 transition duration-200 text-white font-semibold px-6 py-2 rounded-full shadow-md"
              >
                Proceed to Test
              </button>
            </div>
          </>
        )}
      </div>
    );
  }

  const currentQuestion = questions[currentQuestionIndex];

  return (
    <div className="space-y-4">
      <div className="mb-6">
        <div className="flex justify-between items-center mb-2">
          <span className="text-sm text-gray-500">
            Question {currentQuestionIndex + 1} of {questions.length}
          </span>
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
          {currentQuestionIndex === questions.length - 1 ? 'Finish' : 'Next'} <ArrowRight className="w-4 h-4 ml-2" />
        </button>
      </div>
    </div>
  );
}
