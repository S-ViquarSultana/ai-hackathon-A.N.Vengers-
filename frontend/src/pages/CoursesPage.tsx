import React, { useEffect, useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { useAuth } from '../context/AuthContext';
import { recommendations } from '../lib/api';
import { useToast , ToastProvider} from '../components/ui/toast';
import { SearchBar } from '../components/ui/SearchBar';
import { Loader2 } from 'lucide-react';

interface Course {
  title: string;
  url: string;
  description: string;
  tags: string[];
  image: string;
}

const staticCourses: Course[] = [
  {
    title: 'Introduction to Python Programming',
    url: 'https://www.udemy.com/course/pythonforbeginners/',
    description: 'Learn Python from scratch. Great for beginners aiming to build a solid foundation.',
    tags: ['Python', 'Beginner', 'Programming'],
    image: 'https://wallpaperaccess.com/full/1119461.jpg'
  },
  {
    title: 'The Complete Web Development Bootcamp',
    url: 'https://www.udemy.com/course/the-complete-web-development-bootcamp/',
    description: 'Master HTML, CSS, JS, Node, React, and more to build real-world web apps.',
    tags: ['Web Dev', 'HTML', 'CSS', 'JavaScript'],
    image: 'https://www.technogiq.com/blogs/wp-content/uploads/2021/05/Custom-web-development.jpg'
  },
  {
    title: 'Machine Learning by Andrew Ng',
    url: 'https://www.coursera.org/learn/machine-learning',
    description: "Stanford's ML course covering supervised learning, neural networks, and more.",
    tags: ['Machine Learning', 'AI', 'Stanford'],
    image: 'https://wallpaperaccess.com/full/3079615.png'
  },
  {
    title: 'Java Programming Masterclass',
    url: 'https://www.udemy.com/course/java-the-complete-java-developer-course/',
    description: 'Comprehensive Java course covering core concepts, OOP, and development skills.',
    tags: ['Java', 'OOP', 'Backend'],
    image: 'https://wallpapers.com/images/hd/programming-hd-hx3yu0z07f4s96ca.jpg'
  },
  {
    title: 'Deep Learning Specialization',
    url: 'https://www.coursera.org/specializations/deep-learning',
    description: 'A 5-course specialization teaching deep learning, CNNs, and NLP with TensorFlow.',
    tags: ['Deep Learning', 'CNN', 'AI'],
    image: 'https://cdn.analyticsvidhya.com/wp-content/uploads/2021/04/58282featured1.jpeg'
  }
];

const CoursesPage: React.FC = () => {
  const { user } = useAuth();
  const { showToast } = useToast();
  const [courses, setCourses] = useState<Course[]>(staticCourses);
  const [loading, setLoading] = useState(false);

  const handleSearch = async (query: string) => {
    setLoading(true);
    try {
      const response = await recommendations.searchCourses(query);
      if (response.success) {
        setCourses(response.courses);
      } else {
        showToast('Failed to fetch search results', 'error');
      }
    } catch (error) {
      showToast('Search error', 'error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <ToastProvider>
    <div className="space-y-6 px-6 py-4">
      <SearchBar onSearch={handleSearch} />
      {loading ? (
        <div className="flex items-center justify-center py-8">
          <Loader2 className="h-8 w-8 animate-spin text-blue-500" />
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {courses.map((course, index) => (
            <Card key={index} className="hover:shadow-lg transition-shadow overflow-hidden">
              <img
                src={course.image}
                alt={course.title}
                className="w-full h-40 object-cover"
              />
              <CardHeader>
                <CardTitle>{course.title}</CardTitle>
                <CardDescription className="flex flex-wrap gap-2 mt-2">
                  {course.tags.map((tag, i) => (
                    <span
                      key={i}
                      className="inline-block bg-gray-200 rounded-full px-3 py-1 text-sm font-semibold text-gray-700"
                    >
                      {tag}
                    </span>
                  ))}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600 mb-4">{course.description}</p>
                <Button
                  variant="default"
                  onClick={() => window.open(course.url, '_blank')}
                  className="w-full"
                >
                  View Course
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
    </ToastProvider>
  );
};

export default CoursesPage;
