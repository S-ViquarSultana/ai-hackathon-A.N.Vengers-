import axios, { AxiosInstance, AxiosError } from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000/api';

// Define interfaces
export interface User {
  id: number;
  username: string;
  email: string;
  interests: string[];
  skills: string[];
}

export interface Recommendation {
  title: string;
  url: string;
  description: string;
  tags: string[];
  image: string;
}

export interface Recommendations {
  courses: Recommendation[];
  internships: Recommendation[];
  projects: Recommendation[];
}

export interface ApiResponse<T> {
  success: boolean;
  message?: string;
  data?: T;
}

export interface SignInResponse extends ApiResponse<{ token: string; user: User }> {}

export interface ErrorResponse extends ApiResponse<null> {}

export interface AssessmentQuestion {
  id: string;
  question: string;
  options: string[];
  correctAnswer: string;
  skill: string;
}

export interface Course {
  title: string;
  url: string;
  description: string;
  tags: string[];
  image: string;
}

// Create Axios client
const api: AxiosInstance = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add token from localStorage if available
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Handle 401 unauthorized globally
api.interceptors.response.use(
  (response) => response,
  (error: AxiosError<ErrorResponse>) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      window.location.href = '/signin';
    }
    return Promise.reject(error);
  }
);

// ✅ Recommendations API
export const recommendations = {
  updateInterests: async (userId: string, interests: string[]) => {
    const res = await api.post('/update-interests', { userId, interests });
    return res.data;
  },

  searchCourses: async (query: string): Promise<{ courses: Course[]; success: boolean }> => {
    const res = await api.get(`/recommendations/search?q=${encodeURIComponent(query)}`);
    return {
      courses: res.data.courses,
      success: true,
    };
  },

  searchExperiences: async (query: string): Promise<{ experiences: Recommendation[]; success: boolean }> => {
    const res = await api.get(`/recommendations/search-experiences?q=${encodeURIComponent(query)}`);
    return {
      experiences: res.data.experiences,
      success: true,
    };
  },

  searchInternships: async (query: string) => {
    try {
      console.log("Searching internships for:", query);
      const res = await api.get(`/recommendations/search-internships?q=${encodeURIComponent(query)}`);
      console.log("Internship results:", res.data);
      return res.data;
    } catch (error) {
      console.error("Fetch failed", error);
      return { success: false, message: "Error fetching internships" };
    }
  }
};

// 🔍 Search Courses Utility
export const searchCourses = async (query: string) => {
  try {
    const res = await api.get(`/recommendations/search?q=${encodeURIComponent(query)}`);
    return res.data;
  } catch (err) {
    console.error("Error fetching courses:", err);
    throw err;
  }
};

// 🔍 General Search API
export const search = {
  searchQuestions: async (query: string): Promise<Recommendation[]> => {
    const res = await api.get<ApiResponse<Recommendation[]>>('/search/questions', {
      params: { q: query },
    });
    return res.data.data!;
  },
};

// 📋 Assessment API
export const assessment = {
  getAssessmentQuestions: async (
    userId: string,
    domainId: string
  ): Promise<ApiResponse<{ questions: AssessmentQuestion[] }>> => {
    const res = await api.get<ApiResponse<{ questions: AssessmentQuestion[] }>>('/assessment/questions', {
      params: { userId, domainId },
    });
    return res.data;
  },

  searchQuestions: async (query: string): Promise<ApiResponse<string[]>> => {
    const res = await api.get<ApiResponse<string[]>>('/assessment/search', {
      params: { q: query },
    });
    return res.data;
  }
};

export default api;
