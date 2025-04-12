import React from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import {
  BookOpen,
  Briefcase,
  Rocket,
  Mountain,
  BarChart2,
  User,
  Wand2
} from 'lucide-react';

const sections = [
  { icon: <BookOpen size={36} />, label: 'Courses', path: '/courses' },
  { icon: <Briefcase size={36} />, label: 'Internships', path: '/internships' },
  { icon: <Rocket size={36} />, label: 'Projects', path: '/projects' },
  { icon: <Mountain size={36} />, label: 'Learning Path', path: '/dashboard' },
  { icon: <BarChart2 size={36} />, label: 'Performance', path: '/performance' },
  { icon: <User size={36} />, label: 'Profile', path: '/profile' },
  { icon: <Wand2 size={36} />, label: 'Magic Mode', path: '/magic' }
];

const LandingPage = () => {
  return (
    <div>
      {/* Hero Section */}
      <section
        className="bg-cover bg-center text-white py-32"
        style={{ backgroundImage: `url('/hero-bg.jpg')` }}
      >
        <motion.div
          className="container mx-auto px-4 text-center"
          initial={{ opacity: 0, y: -50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          <h1 className="text-5xl font-bold mb-4 drop-shadow-lg">Welcome to Your Learning Companion</h1>
          <p className="text-xl mb-6 drop-shadow-sm">
            AI-powered courses, personalized recommendations, and more, all in one place.
          </p>
          <a
            href="/signin"
            aria-label="Get Started"
            className="inline-block bg-white text-blue-600 px-8 py-3 rounded-full text-lg font-medium hover:bg-gray-200 transition"
          >
            Get Started
          </a>
        </motion.div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-white dark:bg-gray-900">
        <div className="container mx-auto px-4">
          <motion.h2
            className="text-4xl font-bold text-center text-gray-900 dark:text-white mb-6"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
          >
            Supercharge Your Learning
          </motion.h2>

          <motion.p
            className="text-center text-gray-600 dark:text-gray-300 max-w-2xl mx-auto mb-12"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            viewport={{ once: true }}
          >
            Our platform combines AI-powered course recommendations, real-time project insights, and a personalized dashboard to keep your learning on track.
          </motion.p>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                title: 'AI Recommendations',
                text: 'Get smart course suggestions tailored to your goals, skill level, and interests.',
              },
              {
                title: 'Track Projects & Internships',
                text: 'Discover trending internships and projects updated regularly using AI web scraping.',
              },
              {
                title: 'Personalized Dashboard',
                text: 'Keep everything in one place—track progress, save favorites, and manage your learning journey.',
              },
            ].map((feature, index) => (
              <motion.div
                key={feature.title}
                className="bg-gray-100 dark:bg-gray-800 p-6 rounded-2xl shadow-lg text-center"
                whileHover={{ scale: 1.03 }}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.2 }}
                viewport={{ once: true }}
              >
                <h3 className="text-2xl font-semibold text-gray-900 dark:text-white mb-4">{feature.title}</h3>
                <p className="text-gray-700 dark:text-gray-300">{feature.text}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section
        className="py-20 bg-fixed bg-center bg-cover bg-gray-100 dark:bg-gray-800"
        style={{ backgroundImage: "url('/testimonials-bg.jpg')" }}
      >
        <div className="container mx-auto px-4 text-center backdrop-blur-sm bg-white/60 dark:bg-gray-900/60 rounded-xl py-10">
          <motion.h2
            className="text-4xl font-bold text-gray-900 dark:text-white mb-6"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
          >
            What Our Users Say
          </motion.h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                name: 'Jane Doe',
                role: 'Software Developer',
                quote: 'This platform transformed how I approach learning. The AI recommendations are spot on!',
              },
              {
                name: 'John Smith',
                role: 'Data Scientist',
                quote: 'I love how it tracks my projects and suggests internships. It\'s like a personal guide!',
              },
              {
                name: 'Sara Lee',
                role: 'UX Designer',
                quote: 'The dashboard helps me stay focused and organized. Best decision I made!',
              },
            ].map((user, index) => (
              <motion.div
                key={user.name}
                className="bg-white dark:bg-gray-900 p-6 rounded-lg shadow-md"
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.2 }}
                viewport={{ once: true }}
              >
                <p className="text-gray-700 dark:text-gray-300 mb-4 italic">"{user.quote}"</p>
                <p className="font-semibold text-gray-900 dark:text-white">{user.name}</p>
                <p className="text-gray-600 dark:text-gray-400">{user.role}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Footer Section */}
      <footer className="bg-blue-600 text-white py-10">
        <div className="container mx-auto px-4 text-center">
          <p className="mb-4">&copy; 2025 Your Learning Companion. All rights reserved.</p>
          <div className="flex justify-center space-x-4">
            <a href="#" className="hover:text-gray-300" aria-label="Privacy Policy">Privacy Policy</a>
            <a href="#" className="hover:text-gray-300" aria-label="Terms of Service">Terms of Service</a>
            <a href="#" className="hover:text-gray-300" aria-label="Contact">Contact</a>
{/* Floating Chatbot Button */}
<a
  href="https://caring-reflective-reindeer.glitch.me/" // <-- replace with your deployed chatbot URL
  target="_blank"
  rel="noopener noreferrer"
  className="fixed bottom-6 right-6 z-50 group"
  aria-label="Chat with us"
>
  <div className="relative">
    {/* Pulse animation */}
    <span className="absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75 animate-ping"></span>

    {/* Chatbot Icon */}
    <div className="bg-blue-600 text-white p-4 rounded-full shadow-lg transition hover:scale-110">
      💬
    </div>

    {/* Tooltip */}
    <div className="absolute bottom-14 right-1/2 translate-x-1/2 bg-gray-900 text-white text-xs rounded py-1 px-2 opacity-0 group-hover:opacity-100 transition">
      Chat with us
    </div>
  </div>
</a>


          </div>
        </div>
{/* Floating Magic Button */}
<a
  href="/magic"
  className="fixed bottom-6 left-6 z-50 group bg-white dark:bg-gray-800 shadow-xl p-3 rounded-full border border-purple-300 hover:border-purple-500 transition-all duration-300"
  aria-label="Magical Preview"
>
  <div className="relative flex items-center justify-center">
    <Wand2 className="w-6 h-6 text-purple-600 group-hover:animate-wiggle" />
    <span className="absolute -top-1 -right-1 animate-sparkle text-yellow-400 text-xs">✨</span>
    {/* Tooltip on hover */}
    <div className="absolute left-12 top-1/2 -translate-y-1/2 bg-black text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition">
      Magic Mode
    </div>
  </div>
</a>

      </footer>
    </div>
  );
};




export default LandingPage;
