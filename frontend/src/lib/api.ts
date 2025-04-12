import axios, { AxiosInstance, AxiosError } from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000/api';

// Define interfaces
export interface User {
  id: number;
  username: string;
  email: string;
  interests: string[];
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

// Create API client instance
const api: AxiosInstance = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor for adding auth token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor for handling errors
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

import { supabase } from '../lib/supabaseClient'; // path based on your project

api.interceptors.request.use(
  async (config) => {
    const {
      data: { session },
    } = await supabase.auth.getSession();

    if (session?.access_token) {
      config.headers.Authorization = `Bearer ${session.access_token}`;
    }

    return config;
  },
  (error) => Promise.reject(error)
);


// Recommendations API
export const recommendations = {
  getRecommendations: async (userId: number): Promise<Recommendations> => {
    const response = await api.get<ApiResponse<Recommendations>>(`/recommendations/${userId}`);
    return response.data.data!;
  },

  updateInterests: async (userId: number, interests: string[]): Promise<void> => {
    await api.put(`/recommendations/${userId}/interests`, { interests });
  },
  searchCourses: async (query: string): Promise<{ courses: Course[]; success: boolean }> => {
    const response = await fetch(`http://localhost:5000/api/recommendations/search?q=${encodeURIComponent(query)}`);
    if (!response.ok) {
      throw new Error('Failed to search courses');
    }
    const data = await response.json();
    return {
      courses: data.courses,
      success: true
    };
  },
  searchExperiences: async (query: string): Promise<{ experiences: Recommendation[]; success: boolean }> => {
    const response = await fetch(`http://localhost:5000/api/recommendations/search-experiences?q=${encodeURIComponent(query)}`);
    if (!response.ok) {
      throw new Error('Failed to search experiences');
    }
    const data = await response.json();
    return {
      experiences: data.experiences,
      success: true
    };
  },
  searchInternships: async (query: string) => {
    try {
      console.log("Searching internships for:", query);
      const res = await fetch(`/api/recommendations/search-internships?q=${encodeURIComponent(query)}`);
      const data = await res.json();
      console.log("Internship results:", data);
      return data;
    } catch (error) {
      console.error("Fetch failed", error);
      return { success: false, message: "Error fetching internships" };
    }
  }
};

export const searchCourses = async (query: string) => {
  try {
    const response = await fetch(`http://localhost:5000/api/recommendations/search?q=${encodeURIComponent(query)}`);
    if (!response.ok) throw new Error("API Error");
    const data = await response.json();
    return data;
  } catch (err) {
    console.error("Error fetching courses:", err);
    throw err;
  }
};


// Search API
export const search = {
  searchQuestions: async (query: string): Promise<Recommendation[]> => {
    const response = await api.get<ApiResponse<Recommendation[]>>('/search/questions', {
      params: { q: query },
    });
    return response.data.data!;
  },
};

// Assessment API
export const assessment = {
  getAssessmentQuestions: async (userId: string, domainId: string): Promise<ApiResponse<{ questions: AssessmentQuestion[] }>> => {
    const response = await api.get<ApiResponse<{ questions: AssessmentQuestion[] }>>(`/assessment/questions`, {
      params: { userId, domainId }
    });
    return response.data;
  },
  searchQuestions: async (query: string): Promise<ApiResponse<string[]>> => {
    const response = await api.get<ApiResponse<string[]>>('/assessment/search', {
      params: { q: query }
    });
    return response.data;
  }
};

export default api;


