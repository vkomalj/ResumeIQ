'use client';

import { ResumeUpload } from '@/components/chatbot/ResumeUpload';
import { CandidateResumes } from '@/components/dashboard/CandidateResumes';
import { motion } from 'framer-motion';
import { FileText, Briefcase } from 'lucide-react';
import { useJobStore } from '@/lib/stores/jobStore';
import { useEffect } from 'react';
import { CreateJobModal } from '@/components/dashboard/CreateJobModal';

export function ResumeList() {
  const { jobs, fetchJobs } = useJobStore();
  
  useEffect(() => {
    const loadJobs = async () => {
        try {
          await fetchJobs();
        } catch (error) {
          console.error('Error in loadJobs:', error);
        }
      };
      loadJobs();
    }, [fetchJobs]);

  if (jobs.length === 0) {
    return (
      <div className="space-y-4 sm:space-y-6">
        <div>
          <h2 className="text-lg sm:text-xl font-bold tracking-tight flex items-center gap-2">
            <FileText className="h-4 w-4 sm:h-5 sm:w-5 text-primary flex-shrink-0" />
            <span>Candidate Resumes</span>
          </h2>
          <p className="text-xs sm:text-sm text-muted-foreground mt-1">
            Upload and analyze resumes with AI-powered job matching
          </p>
        </div>

        <div className="py-24 text-center bg-white border-2 border-dashed border-border rounded-3xl shadow-sm space-y-5 max-w-2xl">
          <div className="w-16 h-16 rounded-3xl bg-[#f8f9fa] flex items-center justify-center mx-auto mb-4 border border-border">
            <Briefcase className="h-8 w-8 text-primary opacity-60" />
          </div>
          <div className="space-y-2">
            <h3 className="text-xl font-bold text-foreground">Create a Job Opportunity First</h3>
            <p className="text-sm text-muted-foreground max-w-md mx-auto font-medium leading-relaxed">
              Before you can upload and analyze candidate resumes, you need to list at least one active job opportunity for AI-powered matching.
            </p>
          </div>
          <div className="pt-2">
            <CreateJobModal />
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4 sm:space-y-6">
   <div className="space-y-3 sm:space-y-4">
        <div>
          <h2 className="text-lg sm:text-xl font-bold tracking-tight flex items-center gap-2">
            <FileText className="h-4 w-4 sm:h-5 sm:w-5 text-primary flex-shrink-0" />
            <span>Candidate Resumes</span>
          </h2>
          <p className="text-xs sm:text-sm text-muted-foreground mt-1">
            Upload and analyze resumes with AI-powered job matching
          </p>
        </div>

        {/* Upload Card - Prominent placement */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="max-w-full sm:max-w-xl h-auto"
        >
          <ResumeUpload variant="card" />
        </motion.div>
      </div>
   

      {/* Resumes with Job Matches */}
      <CandidateResumes />
    </div>
  );
}
