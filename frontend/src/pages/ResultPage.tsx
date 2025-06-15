import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Card, CardHeader, CardTitle, CardContent } from '../components/ui/card';
import { Button } from '../components/ui/button';

type SkillLevels = Record<string, number>;
type BadgeType = 'Bronze' | 'Silver' | 'Gold';
type UserLevel = 'Beginner' | 'Intermediate' | 'Advanced';


export default function AssessmentResult() {
  const { state } = useLocation();
  const navigate = useNavigate();

  const { skillLevels, domain, badge, userLevel } = state || {};
  const selectedAnswers: Record<string, string> = state?.selectedAnswers || {};
  const level = userLevel as UserLevel;
  const correctCount = state?.correctCount || 0;
  const totalQuestions = state?.totalQuestions || 0;

  

  // Recommendations
  const recommendations: Record<BadgeType, Record<UserLevel, {
    title: string;
    url: string;
    description: string;
    tags: string[];
    image: string;
  }[]>> = {
    Bronze: {
      Beginner: [
        {
          title: "Intro to Python Programming",
          url: "https://www.coursera.org/learn/python",
          description: "Learn Python basics and build a strong foundation in programming.",
          tags: ["Python", "Beginner", "Programming"],
          image: "https://wallpaperaccess.com/full/1119461.jpg"
        },
        {
          title: "Computer Science 101",
          url: "https://online.stanford.edu/courses/sohs-ymcs101-sp-computer-science-101",
          description: "Get introduced to the basics of computer science.",
          tags: ["CS", "Beginner", "Logic"],
          image: "https://cdn.wallpapersafari.com/50/50/z12kZ0.jpg"
        }
      ],
      Intermediate: [
        {
          title: "Python Data Structures",
          url: "https://www.coursera.org/learn/python-data",
          description: "Intermediate Python course focusing on data handling.",
          tags: ["Python", "Data", "Intermediate"],
          image: "https://wallpaperaccess.com/full/9088967.png"
        },
        {
          title: "Intermediate Python Programming",
          url: "https://realpython.com/courses/intermediate-python/",
          description: "Expand your Python skills with real-world concepts.",
          tags: ["Python", "Functions", "OOP"],
          image: "https://wallpapercave.com/wp/wp7133249.png"
        }
      ],
      Advanced: [
        {
          title: "Algorithmic Problem Solving in Python",
          url: "https://www.udemy.com/course/python-algorithms/",
          description: "Tackle harder problems with Python algorithms.",
          tags: ["Python", "Algorithms", "Advanced"],
          image: "https://wallpaperaccess.com/full/10528787.jpg"
        },
        {
          title: "Object-Oriented Programming with Python",
          url: "https://www.udacity.com/course/programming-foundations-with-python--ud036",
          description: "Master OOP concepts and build complex apps in Python.",
          tags: ["Python", "OOP", "Advanced"],
          image: "https://wallpapercave.com/wp/wp7133293.jpg"
        }
      ]
    },
    Silver: {
      Beginner: [
        {
          title: "HTML & CSS for Beginners",
          url: "https://www.codecademy.com/learn/learn-html",
          description: "Learn how to build and style simple web pages.",
          tags: ["HTML", "CSS", "Beginner"],
          image: "https://wallpaperaccess.com/full/8174684.jpg"
        },
        {
          title: "JavaScript Basics",
          url: "https://developer.mozilla.org/en-US/docs/Learn/JavaScript/First_steps",
          description: "Get started with the fundamentals of JavaScript.",
          tags: ["JavaScript", "Beginner", "Programming"],
          image: "https://wallpaperbat.com/img/296069-introduction-to-javascript-basics.png"
        }
      ],
      Intermediate: [
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
          image: "https://wallpaperaccess.com/full/4219274.jpg"
        }
      ],
      Advanced: [
        {
          title: "Frontend Masters: Advanced JavaScript",
          url: "https://frontendmasters.com/courses/advanced-javascript/",
          description: "Understand the inner mechanics of the JS engine.",
          tags: ["JavaScript", "Advanced", "Internals"],
          image: "https://wallpaperaccess.com/full/1555172.jpg"
        },
        {
          title: "Advanced CSS and Sass",
          url: "https://www.udemy.com/course/advanced-css-and-sass/",
          description: "Take your CSS skills to the next level with animations and architecture.",
          tags: ["CSS", "Sass", "Advanced"],
          image: "https://wallpaperbat.com/img/307773-advantages-of-using-a-preprocessor-sass-in-css-development.jpg"
        }
      ]
    },
    Gold: {
      Beginner: [
        {
          title: "Intro to Data Science",
          url: "https://www.coursera.org/learn/what-is-datascience",
          description: "Understand what data science is and the skills needed to do it.",
          tags: ["Data Science", "Beginner", "Analytics"],
          image: "https://wallpapers.com/images/featured/data-science-xe1pmo7wm4jcokpd.jpg"
        },
        {
          title: "Crash Course on Python",
          url: "https://www.coursera.org/learn/python-crash-course",
          description: "A fast-paced, practical intro to Python by Google.",
          tags: ["Python", "Beginner", "Practical"],
          image: "https://wallpapercave.com/wp/wp3105546.png"
        }
      ],
      Intermediate: [
        {
          title: "Deep Learning Specialization",
          url: "https://www.coursera.org/specializations/deep-learning",
          description: "Master deep learning concepts and frameworks like TensorFlow.",
          tags: ["Deep Learning", "Intermediate", "AI"],
          image: "https://wallpaperaccess.com/full/1846947.jpg"
        },
        {
          title: "Machine Learning with Python",
          url: "https://www.coursera.org/learn/machine-learning-with-python",
          description: "Apply machine learning techniques using Python and scikit-learn.",
          tags: ["ML", "Intermediate", "Python"],
          image: "https://wallpaperaccess.com/full/3079572.png"
        }
      ],
      Advanced: [
        {
          title: "Advanced Machine Learning Specialization",
          url: "https://www.coursera.org/specializations/advanced-machine-learning",
          description: "Explore neural networks, deep learning, and complex ML models.",
          tags: ["AI", "ML", "Advanced"],
          image: "https://wallpaperaccess.com/full/3079615.png"
        },
        {
          title: "Full Stack Development Nanodegree",
          url: "https://www.udacity.com/course/full-stack-web-developer-nanodegree--nd0044",
          description: "Build scalable apps with React, Node, and databases.",
          tags: ["React", "Node.js", "Full Stack"],
          image: "https://wallpaperbat.com/img/9003687-full-stack-developer.jpg"
        }
      ]
    }    
  };

  const userRecs = badge && level ? recommendations[badge as BadgeType]?.[level] : [];

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold">Assessment Report</h1>

      {/* Skill Levels Section */}
      {skillLevels && (
        <Card>
          <CardHeader>
          <CardTitle>
  📊 Skill Levels — {Array.isArray(domain)
    ? domain.map((d: any) => d.name).join(', ')
    : domain?.name || 'N/A'}
</CardTitle>

          </CardHeader>
          <CardContent className="space-y-4">
          {Object.entries(skillLevels as Record<string, { correct: number, total: number }>).map(([skill, { correct, total }]) => {
  const percent = total ? (correct / total) * 100 : 0;

  return (
    <div key={skill}>
      <div className="flex justify-between mb-1">
        <span className="font-medium">{skill}</span>
        <span className="text-blue-600">{correct}/{total}</span>
      </div>
      <div className="w-full bg-gray-200 rounded-full h-2.5">
        <div
          className="bg-blue-600 h-2.5 rounded-full"
          style={{ width: `${percent}%` }}
        ></div>
      </div>
    </div>
  );
})}

          </CardContent>
        </Card>
      )}

      {/* Badge Section */}
      <Card>
        <CardHeader>
          <CardTitle>🏅 Badge Earned: {badge}</CardTitle>
        </CardHeader>
        <CardContent>
          {typeof correctCount === 'number' && typeof totalQuestions === 'number' && (
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
  {userRecs.map((rec, idx) => (
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
              {rec.tags.map((tag: string) => `#${tag} `)}
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
