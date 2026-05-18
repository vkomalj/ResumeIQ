import { create } from "zustand";
import { Resume } from "./chatStore";
import { API_BASE_URL } from "@/lib/utils";

export interface Job {
  id: string;
  title: string;
  department: string;
  location: string;
  type: "Full-time" | "Part-time" | "Contract" | "Remote";
  description: string;
  requirements: string[]; // List of skills required
  salaryRange?: string;
  experienceLevel: "Junior" | "Mid-level" | "Senior" | "Lead";
  createdAt: Date;
}

export interface CandidateMatch {
  resumeId: string;
  score: number; // 0 to 100
  matchedSkills: string[];
  missingSkills: string[];
}

interface JobStore {
  jobs: Job[];
  addJob: (job: Job) => void;
  removeJob: (id: string) => void;
  updateJob: (id: string, job: Partial<Job>) => void;
  fetchJobs: () => Promise<void>;
  getMatches: (jobId: string, resumes: Resume[]) => CandidateMatch[];
}

export const useJobStore = create<JobStore>((set, get) => ({
  jobs: [],

  addJob: (job) => {
    set((state) => ({
      jobs: [job, ...state.jobs],
    }));
  },

  removeJob: async (id) => {
    try {
      const backendId = id.replace("job_", "");

      const res = await fetch(`${API_BASE_URL}/jobs/${backendId}`, {
        method: "DELETE",
      });

      if (!res.ok) {
        throw new Error("Failed to delete job");
      }

      await get().fetchJobs();
    } catch (err) {
      console.error("Delete failed:", err);
    }
  },

  updateJob: (id, jobUpdate) => {
    set((state) => ({
      jobs: state.jobs.map((j) => (j.id === id ? { ...j, ...jobUpdate } : j)),
    }));
  },

  fetchJobs: async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/jobs`, {
        method: "GET",
        headers: {
          Accept: "application/json",
        },
      });

      if (!response.ok) {
        throw new Error(`Failed to fetch jobs: ${response.status}`);
      }

      const result = await response.json();

      // Transform API response to Job interface
      const transformedJobs: Job[] = (result.data || []).map((apiJob: any) => ({
        id: `job_${apiJob.id}`,
        title: apiJob.title,
        department: "General",
        location: "Remote",
        type: "Full-time" as const,
        description: `${apiJob.title} position - ${apiJob.min_experience} years experience required`,
        requirements: apiJob.required_skills || [],
        salaryRange: undefined,
        experienceLevel:
          apiJob.min_experience >= 5
            ? "Senior"
            : apiJob.min_experience >= 3
              ? "Mid-level"
              : "Junior",
        createdAt: new Date(),
      }));

      set({ jobs: transformedJobs });
    } catch (error) {
      const mockJobs: Job[] = [
        {
          id: "job_1",
          title: "Senior React Developer",
          department: "Engineering",
          location: "Remote",
          type: "Full-time",
          description:
            "We're looking for an experienced React developer to join our team.",
          requirements: ["React", "TypeScript", "Node.js", "PostgreSQL"],
          salaryRange: "$120k - $160k",
          experienceLevel: "Senior",
          createdAt: new Date(),
        },
        {
          id: "job_2",
          title: "Full Stack Engineer",
          department: "Engineering",
          location: "Remote",
          type: "Full-time",
          description:
            "Build amazing full-stack applications with modern tech.",
          requirements: ["Next.js", "TypeScript", "API Design", "Database"],
          salaryRange: "$100k - $150k",
          experienceLevel: "Mid-level",
          createdAt: new Date(),
        },
        {
          id: "job_3",
          title: "Angular Developer",
          department: "Frontend",
          location: "Remote",
          type: "Full-time",
          description:
            "Join our frontend team building amazing web applications.",
          requirements: ["Angular", "TypeScript", "RxJS", "Material Design"],
          salaryRange: "$90k - $130k",
          experienceLevel: "Mid-level",
          createdAt: new Date(),
        },
      ];
      set({ jobs: mockJobs });
    }
  },

  getMatches: (jobId, resumes) => {
    const job = get().jobs.find((j) => j.id === jobId);
    if (!job) return [];
    return resumes
      .map((resume) => {
        const resumeSkills = resume.analysis?.skills || [];
        const matchedSkills = job.requirements.filter((req) =>
          resumeSkills.some((s) => s.toLowerCase().includes(req.toLowerCase())),
        );
        const missingSkills = job.requirements.filter(
          (req) => !matchedSkills.includes(req),
        );

        const score = Math.round(
          (matchedSkills.length / job.requirements.length) * 100,
        );

        return {
          resumeId: resume.id,
          score,
          matchedSkills,
          missingSkills,
        };
      })
      .sort((a, b) => b.score - a.score); 
  },
}));
