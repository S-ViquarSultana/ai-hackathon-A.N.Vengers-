import React, { useState, useEffect } from "react";
import Navbar from "../components/Navbar";
import { useToast, ToastProvider } from "../context/ToastContext";
import { useAuth } from "../context/AuthContext";
import { recommendations } from "../lib/api"; 

type Internship = {
  id: number;
  title: string;
  company: string;
  location: string;
  duration: string;
  stipend: string;
  image: string;
  url: string;
  description: string;
};

const internshipSuggestions: Internship[] = [
  {
    id: 1,
    title: "Web Development Intern",
    company: "Tech Solutions Inc.",
    location: "Remote",
    duration: "3 months",
    stipend: "₹10,000/month",
    image: "https://thumbs.dreamstime.com/b/web-development-coding-programming-internet-technology-business-concept-web-development-coding-programming-internet-technology-122084136.jpg",
    url: "https://techsolutions.com/internships/web-dev",
    description: "Description of Web Development Internship",
  },
  {
    id: 2,
    title: "Data Science Intern",
    company: "DataBridge Analytics",
    location: "Hyderabad",
    duration: "6 months",
    stipend: "₹15,000/month",
    image: "https://wallpaperaccess.com/full/4386262.jpg",
    url: "https://databridge.com/internships/data-science",
    description: "Description of Data Science Internship",
  },
  {
    id: 3,
    title: "AI Research Intern",
    company: "OpenAI Research Labs",
    location: "Remote",
    duration: "2 months",
    stipend: "₹12,000/month",
    image: "https://genestack.com/assets/images/blog/how-to-maximise-the-impact-of-ai-on-your-research.png",
    url: "https://openai.com/internships/ai-research",
    description: "Description of AI Research Internship",
  },
  {
    id: 4,
    title: "Frontend Intern",
    company: "Pixel Craft Studios",
    location: "Bangalore",
    duration: "3 months",
    stipend: "₹8,000/month",
    image: "https://wallpaperaccess.com/full/4635743.jpg",
    url: "https://pixelcraft.com/internships/frontend",
    description: "Description of Frontend Internship",
  },
  {
    id: 5,
    title: "Backend Intern",
    company: "StackNode Technologies",
    location: "Remote",
    duration: "4 months",
    stipend: "₹11,000/month",
    image: "https://e1.pxfuel.com/desktop-wallpaper/995/818/desktop-wallpaper-front-end-vs-back-end-backend-thumbnail.jpg",
    url: "https://stacknode.com/internships/backend",
    description: "Description of Backend Internship",
  },
  {
    id: 6,
    title: "Machine Learning Intern",
    company: "AI Minds",
    location: "Chennai",
    duration: "6 months",
    stipend: "₹14,000/month",
    url: "https://www.aiminds.com/ml-intern",
    image: "https://wallpaperaccess.com/full/3079643.jpg",
    description: "Description of Machine Learning Internship",
  },
  {
    id: 7,
    title: "UI/UX Design Intern",
    company: "Designify Studio",
    location: "Remote",
    duration: "2 months",
    stipend: "₹9,000/month",
    url: "https://www.designify.com/uiux-intern",
    image: "https://mir-s3-cdn-cf.behance.net/project_modules/max_1200/2e948896757753.5eb58c727d672.png",
    description: "Description of UI/UX Design Internship",
  },
  {
    id: 8,
    title: "Cloud Engineering Intern",
    company: "CloudZen",
    location: "Pune",
    duration: "5 months",
    stipend: "₹13,000/month",
    url: "https://www.cloudzen.com/cloud-intern",
    image: "https://wallpaperaccess.com/full/5650220.png",
    description: "Description of Cloud Engineering Internship",
  },
  {
    id: 9,
    title: "Cybersecurity Intern",
    company: "SecureStack",
    location: "Delhi",
    duration: "3 months",
    stipend: "₹10,000/month",
    url: "https://www.securestack.com/cyber-intern",
    image: "https://wallpaperaccess.com/full/2407073.jpg",
    description: "Description of Cybersecurity Internship",
  },
  {
    id: 10,
    title: "Mobile App Dev Intern",
    company: "AppVerse",
    location: "Remote",
    duration: "4 months",
    stipend: "₹12,000/month",
    url: "https://www.appverse.com/mobile-intern",
    image: "https://wallpapercave.com/wp/wp9517064.jpg",
    description: "Description of Mobile App Development Internship",
  },
];



const InternshipsPage = () => {
  const [query, setQuery] = useState("");
  const [loading, setLoading] = useState(false);
  const [filteredInternships, setFilteredInternships] = useState<Internship[]>(internshipSuggestions);

  const { user } = useAuth();
  const { showToast } = useToast();

  useEffect(() => {
    const fetchInternships = async () => {
      try {
        const response = await fetch(
          `http://localhost:5000/api/recommendations/search-internships?q=${query}`
        );
        const data = await response.json();
  
        console.log("Received from backend:", data); // debug log
  
        if (data && data.success && Array.isArray(data.internships)) {
          setFilteredInternships(data.internships);
        } else {
          console.error("Unexpected response structure:", data);
        }
      } catch (error) {
        console.error("Error fetching internships:", error);
      }
    };
  
    if (query.trim() !== "") {
      fetchInternships();
    }
  }, [query]);
  

  return (
    <ToastProvider>
      
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <h1 className="text-3xl font-bold text-center text-green-100 mb-6">Internships</h1>
        <input
          type="text"
          value={query}
          onChange={e => setQuery(e.target.value)}
          placeholder="Search internships by title, location or keywords..."
          className="w-full px-4 py-2 mb-8 border rounded-lg text-content bg-zinc-900 border-zinc-800 focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        {loading ? (
          <div className="text-center text-gray-400">Loading internships...</div>
        ) : filteredInternships.length === 0 ? (
          <p className="text-center text-gray-500">No internships found. Try another keyword.</p>
        ) : (
          <div className="grid gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
            {filteredInternships.map((internship, index) => (
              <div
                key={index}
                className="glass-card rounded-xl overflow-hidden hover:shadow-2xl transition-all duration-300"
              >
                <img
                  src={internship.image}
                  alt={internship.title}
                  className="w-full h-48 object-cover"
                />
                <div className="p-6 space-y-3">
                  <h2 className="text-xl font-semibold text-content">{internship.title}</h2>
                  {internship.company && <p className="text-muted">{internship.company}</p>}
                  {internship.location && <p className="text-sm text-gray-400">{internship.location}</p>}
                  {internship.duration && <p className="text-sm">Duration: {internship.duration}</p>}
                  {internship.stipend && <p className="text-sm">Stipend: {internship.stipend}</p>}
                  <p className="text-sm">{internship.description}</p>
                  <button
                    onClick={() => window.open(internship.url, "_blank")}
                    className="w-full mt-4 px-4 py-2 rounded-lg bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 text-white font-medium transition-colors"
                  >
                    View Internship
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>
    </ToastProvider>
  );
};

export default InternshipsPage;



