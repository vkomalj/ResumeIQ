import { create } from "zustand";
import { mapCandidateToResume } from "../mappers/candidateMapper";
import { API_BASE_URL } from "@/lib/utils";

export interface ChatMessage {
  id: string;
  content: string;
  role: "user" | "assistant";
  timestamp: Date;
  avatar?: string;
}

export interface skilObject {
  years_of_experience: number;
  technical_skills: string[];
}

export interface CandidateInfo {
  name: string;
  email: string;
  phone: string;
}

export interface JobMatch {
  job_id: number;
  title: string;
  match_percentage: number;
  matched_skills: string[];
  missing_skills: string[];
  experience_match: boolean;
}

export interface ResumeAnalysis {
  candidate: CandidateInfo;
  skills: string[];
  experience: number;
  predicted_salary: number;
  job_matches: JobMatch[];
}

export interface Resume {
  id: string;
  file: File | { name: string; size: number };
  data: {
    skills: skilObject;
    predictedSalary: number;
    yearsOfExperience: number;
  } | null;
  analysis?: ResumeAnalysis;
  uploadedAt?: Date;
  resume_file?: string;
}

interface ChatStore {
  messages: ChatMessage[];
  isLoading: boolean;
  resumes: Resume[];
  addMessage: (message: ChatMessage) => void;
  clearMessages: () => void;
  addResume: (resume: Resume) => void;
  removeResume: (id: string) => void;
  sendMessage: (content: string) => Promise<void>;
  getAllCandidates: () => Promise<void>;
}

export const useChatStore = create<ChatStore>((set, get) => ({
  messages: [
    {
      id: "1",
      content:
        "Hello! I'm your AI interview assistant. Upload your resume to get started, or ask me anything about interviews, career development, or job search strategies.",
      role: "assistant",
      timestamp: new Date(),
    },
  ],
  isLoading: false,
  resumes: [],

  addMessage: (message: ChatMessage) => {
    set((state) => ({
      messages: [...state.messages, message],
    }));
  },

  clearMessages: () => {
    set({ messages: [] });
  },

  addResume: (resume: Resume) => {
    set((state) => ({
      resumes: [resume, ...state.resumes],
    }));
  },

  removeResume: (id: string) => {
    set((state) => ({
      resumes: state.resumes.filter((r) => r.id !== id),
    }));
  },

  sendMessage: async (content: string) => {
    const { resumes } = get();

    // Add user message
    const userMessage: ChatMessage = {
      id: Date.now().toString(),
      content,
      role: "user",
      timestamp: new Date(),
    };

    set((state) => ({
      messages: [...state.messages, userMessage],
      isLoading: true,
    }));

    try {
      // Mock API call - replace with real API
      await new Promise((resolve) => setTimeout(resolve, 1500));

      let assistantContent = "That's a great question! Based on your context, ";

      if (resumes.length > 0) {
        assistantContent += `I can see you\'ve uploaded ${resumes.length} resume(s). Let me provide you with tailored advice based on them: `;
      }

      if (content.toLowerCase().includes("interview")) {
        assistantContent +=
          "For interviews, I recommend practicing your storytelling skills and preparing specific examples using the STAR method (Situation, Task, Action, Result).";
      } else if (content.toLowerCase().includes("resume")) {
        assistantContent +=
          "Your resume is a crucial document. Make sure it's tailored to each job, uses action verbs, and quantifies achievements where possible.";
      } else if (content.toLowerCase().includes("skill")) {
        assistantContent +=
          "Building relevant skills is key. Focus on both technical and soft skills that align with your target roles.";
      } else {
        assistantContent +=
          "I'm here to help you succeed in your career journey. Feel free to ask about interviews, resume tips, or job search strategies.";
      }

      const assistantMessage: ChatMessage = {
        id: (Date.now() + 1).toString(),
        content: assistantContent,
        role: "assistant",
        timestamp: new Date(),
      };

      set((state) => ({
        messages: [...state.messages, assistantMessage],
        isLoading: false,
      }));
    } catch (error) {
      set({ isLoading: false });
      throw error;
    }
  },

  getAllCandidates: async () => {
    set({ isLoading: true });

    try {
      const res = await fetch(`${API_BASE_URL}/candidates`);
      const data = await res.json();
      const mapped = data.candidates.map(mapCandidateToResume);
      set({ resumes: mapped });
    } catch (err) {
      console.error(err);
    } finally {
      set({ isLoading: false });
    }
  },
}));
