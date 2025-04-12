import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Card, CardHeader, CardTitle, CardContent } from '../components/ui/card';
import { Button } from '../components/ui/button';

type SkillLevels = Record<string, number>;
type BadgeType = 'Bronze' | 'Silver' | 'Gold';

export default function AssessmentResult() {
  const { state } = useLocation();
  const navigate = useNavigate();

  const { skillLevels, domain } = state || {};
  const selectedAnswers = state?.selectedAnswers || {};
  const totalQuestions = Object.keys(selectedAnswers).length;
  let correctCount = 0;

  // Calculate correct answers
  for (const [questionId, selected] of Object.entries(selectedAnswers)) {
    const question = state?.quizQuestions.find((q: any) => q.question === questionId);
    if (question && question.correct_answer === selected) correctCount++;
  }

  // Badge logic
  const percentage = (correctCount / (totalQuestions || 1)) * 100;
  let badge: BadgeType = 'Bronze';
  if (percentage >= 60) badge = 'Gold';
  else if (percentage >= 30) badge = 'Silver';

  // Recommendations
  const recommendations: Record<BadgeType, {
    title: string;
    url: string;
    description: string;
    tags: string[];
    image: string;
  }[]> = {
    Bronze: [
      {
        title: "Intro to Python Programming",
        url: "https://www.coursera.org/learn/python",
        description: "Learn Python basics and build a strong foundation in programming.",
        tags: ["Python", "Beginner", "Programming"],
        image: "https://wallpaperaccess.com/full/1119461.jpg"
      },
      {
        title: "Web Development Fundamentals",
        url: "https://www.codecademy.com/learn/learn-html",
        description: "Beginner course on HTML and web structure basics.",
        tags: ["HTML", "Web", "Beginner"],
        image: "https://thumbs.dreamstime.com/b/web-development-coding-programming-internet-technology-business-concept-web-development-coding-programming-internet-technology-122084136.jpg"
      },
    ],
    Silver: [
      {
        title: "Intermediate JavaScript",
        url: "https://www.udemy.com/course/modern-javascript-from-the-beginning/",
        description: "Deepen your knowledge of JS and DOM manipulation.",
        tags: ["JavaScript", "Intermediate", "Web Dev"],
        image: "https://wallpaperaccess.com/full/1555146.png"
      },
      {
        title: "Responsive Web Design",
        url: "https://www.freecodecamp.org/learn/responsive-web-design/",
        description: "Master layout techniques with Flexbox and Grid.",
        tags: ["CSS", "Responsive", "Intermediate"],
        image: "https://www.greatlike.com/wp-content/uploads/2020/04/1584082601Web-development-designing-Anvar-Freelancer-1-1.png"
      },
    ],
    Gold: [
      {
        title: "Advanced Machine Learning",
        url: "https://www.coursera.org/specializations/advanced-machine-learning",
        description: "Explore neural networks, deep learning, and complex ML models.",
        tags: ["AI", "ML", "Advanced"],
        image: "https://wallpaperaccess.com/full/3079615.png"
      },
      {
        title: "Full Stack Development",
        url: "https://www.udacity.com/course/full-stack-web-developer-nanodegree--nd0044",
        description: "Build scalable apps with React, Node, and databases.",
        tags: ["React", "Node.js", "Full Stack"],
        image: "https://wallpaperbat.com/img/9003687-full-stack-developer.jpg"
      },
    ],
  };

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold">Assessment Report</h1>

      {/* Skill Levels Section */}
      {skillLevels && (
        <Card>
          <CardHeader>
            <CardTitle>📊 Skill Levels — {domain}</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {Object.entries(skillLevels as SkillLevels).map(([skill, level]) => (
              <div key={skill}>
                <div className="flex justify-between mb-1">
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
          </CardContent>
        </Card>
      )}

      {/* Badge Section */}
      <Card>
        <CardHeader>
          <CardTitle>🏅 Badge Earned: {badge}</CardTitle>
        </CardHeader>
        <CardContent>
          {totalQuestions > 0 && (
            <p className="text-lg font-medium">Score: {correctCount} / {totalQuestions}</p>
          )}
        </CardContent>
      </Card>

      {/* Recommendations Section */}
      <Card>
        <CardHeader>
          <CardTitle>🎯 Recommended for You</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {recommendations[badge].map((rec, idx) => (
            <a
              href={rec.url}
              key={idx}
              target="_blank"
              rel="noopener noreferrer"
              className="block border p-4 rounded-lg hover:bg-gray-100 transition"
            >
              <div className="flex items-center gap-4">
                <img src={rec.image} alt={rec.title} className="w-20 h-20 object-cover rounded-md" />
                <div>
                  <h3 className="text-xl font-semibold">{rec.title}</h3>
                  <p className="text-sm text-gray-600">{rec.description}</p>
                  <div className="mt-1 text-xs text-blue-600">
                    {rec.tags.map(tag => `#${tag} `)}
                  </div>
                </div>
              </div>
            </a>
          ))}
        </CardContent>
      </Card>

      <Button onClick={() => navigate('/dashboard')}>Back to Dashboard</Button>
    </div>
  );
}
