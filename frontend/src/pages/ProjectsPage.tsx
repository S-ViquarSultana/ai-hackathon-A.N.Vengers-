import React, { useEffect, useState } from "react";
import { Clock, Star, Code } from "lucide-react";
import { useAuth } from "../context/AuthContext";
import { recommendations } from "../lib/api";
import { useToast, ToastProvider } from "../context/ToastContext";

interface Project {
  title: string;
  url: string;
  description: string;
  tags: string[];
  image: string;
  duration?: string;
  difficulty?: string;
}

const projectSuggestions: Project[] = [
  {
    title: "Open Source Contribution Tracker",
    description: "Track and visualize your GitHub open-source contributions.",
    difficulty: "Intermediate",
    duration: "3-5 weeks",
    tags: ["React", "Node.js", "GraphQL", "GitHub API"],
    image: "https://images.unsplash.com/photo-1529107386315-e1a2ed48a620?auto=format&fit=crop&q=80&w=600",
    url: "https://github.com/Real-Dev-Squad/website-my"
  },
  {
    title: "AI-Powered Resume Builder",
    description: "Generate optimized resumes using GPT and user inputs.",
    difficulty: "Advanced",
    duration: "4-6 weeks",
    tags: ["React", "Tailwind", "OpenAI API"],
    image: "https://wallpapercave.com/wp/wp6397615.png",
    url: "https://github.com/sunnybedi990/resume-builder"
  },
  {
    title: "Real-Time Chat App",
    description: "Full-stack chat app with rooms, socket support, and auth.",
    difficulty: "Intermediate",
    duration: "2-4 weeks",
    tags: ["React", "Socket.io", "Express", "MongoDB"],
    image: "https://wallpaper.dog/large/20459380.jpg",
    url: "https://github.com/soris2000/Realtime-Chat-App"
  },
  {
    title: "Personal Finance Tracker",
    description: "Track expenses, set budgets, and visualize savings.",
    difficulty: "Beginner",
    duration: "3-4 weeks",
    tags: ["React", "Firebase", "Chart.js"],
    image: "https://wallpapercave.com/wp/wp2042100.jpg",
    url: "https://github.com/neeraj542/Personal-Finance-Trackers"
  },
  {
    title: "E-Commerce Platform",
    description: "Basic e-commerce app with cart, payment, and admin dashboard.",
    difficulty: "Advanced",
    duration: "6-8 weeks",
    tags: ["React", "Node.js", "Redux", "Stripe"],
    image: "https://wallpapercave.com/wp/wp2042033.jpg",
    url: "https://github.com/Govind783/react-e-commerce-"
  },
  {
    title: "Portfolio Website Template",
    description: "A developer portfolio template built with React and Framer Motion.",
    difficulty: "Beginner",
    duration: "1-2 weeks",
    tags: ["React", "Tailwind CSS", "Framer Motion"],
    image: "https://images.unsplash.com/photo-1506765515384-028b60a970df?auto=format&fit=crop&q=80&w=600",
    url: "https://github.com/saadpasta/developerFolio"
  },
  {
    title: "Code Snippet Manager",
    description: "Save, manage, and organize your code snippets with tags.",
    difficulty: "Intermediate",
    duration: "3-4 weeks",
    tags: ["Next.js", "MongoDB", "Tailwind"],
    image: "https://images.unsplash.com/photo-1517433456452-f9633a875f6f?auto=format&fit=crop&q=80&w=600",
    url: "https://github.com/codinginbarn/snipit-code-manager"
  }
];

const ProjectsPage: React.FC = () => {
  const [query, setQuery] = useState("");
  const [loading, setLoading] = useState(false);
  const [filteredProjects, setFilteredProjects] = useState<Project[]>(projectSuggestions);
  const { user } = useAuth();
  const { showToast } = useToast();

  useEffect(() => {
    const fetchProjects = async () => {
      setLoading(true);
      try {
        const results = await recommendations.searchExperiences(query);
        if (results.success) {
          setFilteredProjects(results.experiences);
        }
      } catch (err) {
        showToast("Error fetching projects", "error");
      } finally {
        setLoading(false);
      }
    };
  
    if (query.length >= 2) {
      fetchProjects();
    } else {
      setFilteredProjects(projectSuggestions); // fallback to local list
    }
  }, [query]);
  
  return (
    <ToastProvider>
      {loading ? (
        <div className="text-center p-6">Loading projects...</div>
      ) : !filteredProjects.length ? (
        <div className="p-6 space-y-6">
          <h1 className="text-3xl font-bold text-green-100">Projects</h1>
          <input
            type="text"
            value={query}
            onChange={e => setQuery(e.target.value)}
            placeholder="Search by title, skills or keywords..."
            className="w-full px-4 py-2 mb-4 border rounded-lg text-content bg-zinc-900 border-zinc-800 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <div className="text-center">No projects found. Try a different keyword.</div>
        </div>
      ) : (
        <div className="p-6 space-y-6">
          <h1 className="text-3xl font-bold text-green-100">Projects</h1>
          <input
            type="text"
            value={query}
            onChange={e => setQuery(e.target.value)}
            placeholder="Search by title, skills or keywords..."
            className="w-full px-4 py-2 mb-4 border rounded-lg text-content bg-zinc-900 border-zinc-800 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredProjects.map((project, index) => (
              <div
                key={index}
                className="glass-card rounded-xl overflow-hidden hover:shadow-2xl transition-all duration-300"
              >
                <img
                  src={project.image}
                  alt={project.title}
                  className="w-full h-48 object-cover"
                />
                <div className="p-6 space-y-4">
                  <h3 className="text-xl font-semibold text-content">{project.title}</h3>
                  <p className="text-muted">{project.description}</p>

                  {project.duration && (
                    <div className="flex items-center space-x-3">
                      <Clock className="w-4 h-4 text-blue-400" />
                      <span className="text-sm text-content">{project.duration}</span>
                    </div>
                  )}

                  {project.difficulty && (
                    <div className="flex items-center space-x-3">
                      <Star className="w-4 h-4 text-yellow-400" />
                      <span className="text-sm text-content">{project.difficulty}</span>
                    </div>
                  )}

                  <div className="space-y-2">
                    <div className="flex items-center space-x-2">
                      <Code className="w-4 h-4 text-purple-400" />
                      <span className="text-sm font-medium text-content">Required Skills:</span>
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {project.tags.map((tag, i) => (
                        <span
                          key={i}
                          className="px-2 py-1 text-xs rounded-full bg-blue-900/50 text-blue-200"
                        >
                          {tag}
                        </span>
                      ))}
                    </div>
                  </div>

                  <button
                    onClick={() => window.open(project.url, "_blank")}
                    className="w-full mt-4 px-4 py-2 rounded-lg bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 text-white font-medium transition-colors"
                  >
                    View Project
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </ToastProvider>
  );
};

export default ProjectsPage;
