'use client';

import { useState, useEffect } from 'react';
import { useJobStore } from '@/lib/stores/jobStore';
import { JobCard } from './JobCard';
import { CreateJobModal } from './CreateJobModal';
import { CandidateMatchList } from './CandidateMatchList';
import { motion, AnimatePresence } from 'framer-motion';
import { Briefcase, Plus, Search, Filter } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { staggerContainer, staggerItem } from '@/lib/animations';

export function JobsView() {
  const { jobs, fetchJobs } = useJobStore();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedJobId, setSelectedJobId] = useState<string | null>(null);

  useEffect(() => {
    const loadJobs = async () => {
      console.log('🚀 JobsView mounted, calling fetchJobs...');
      try {
        await fetchJobs();
        console.log('✅ fetchJobs completed');
      } catch (error) {
        console.error('❌ Error in loadJobs:', error);
      }
    };
    loadJobs();
  }, [fetchJobs]);

  useEffect(() => {
    console.log('📋 Jobs state updated:', jobs);
  }, [jobs]);

  const filteredJobs = jobs.filter((job) =>
    job.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    job.department.toLowerCase().includes(searchQuery.toLowerCase())
  );
  if (selectedJobId) {
    return (
      <CandidateMatchList 
        jobId={selectedJobId} 
        onBack={() => setSelectedJobId(null)} 
      />
    );
  }

  return (
    <div className="space-y-4 sm:space-y-6">
      {/* Header with Search and Create */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 sm:gap-4">
        <div>
          <h2 className="text-lg sm:text-xl font-bold tracking-tight flex items-center gap-2">
            <Briefcase className="h-4 w-4 sm:h-5 sm:w-5 text-primary flex-shrink-0" />
            <span>Job Opportunities</span>
          </h2>
          <p className="text-xs sm:text-sm text-muted-foreground mt-0.5 sm:mt-1">
            Create jobs and match with top candidate profiles
          </p>
        </div>
        
        <div className="flex items-center gap-2 sm:gap-3 w-full sm:w-auto">
          <div className="relative flex-1 sm:w-64">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 sm:h-4 sm:w-4 text-muted-foreground" />
            <Input
              placeholder="Search jobs..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-8 sm:pl-9 h-9 sm:h-10 rounded-lg sm:rounded-xl bg-white border-border focus-visible:ring-primary/20 shadow-sm transition-all text-xs sm:text-sm"
            />
          </div>
          <CreateJobModal />
        </div>
      </div>

      {/* Stats Bar */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 sm:gap-4">
        {[
          { label: 'Active Roles', value: jobs.length, icon: Briefcase },
          { label: 'Remote', value: jobs.filter(j => j.type === 'Remote' || j.location.includes('Remote')).length, icon: Filter },
        ].map((stat, i) => (
          <div key={i} className="bg-white border border-border shadow-sm p-2 sm:p-4 flex items-center gap-2 sm:gap-3 rounded-lg sm:rounded-xl transition-all hover:shadow-md">
             <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0">
                 <stat.icon className="h-3.5 w-3.5 sm:h-4 sm:w-4 text-primary" />
             </div>
             <div className="min-w-0">
                 <p className="text-base sm:text-lg font-bold leading-none truncate">{stat.value}</p>
                 <p className="text-[9px] sm:text-[10px] uppercase font-bold tracking-wider text-muted-foreground mt-0.5 sm:mt-1 truncate">{stat.label}</p>
             </div>
          </div>
        ))}
      </div>

      {/* Grid of Job Cards */}
      <motion.div
        variants={staggerContainer}
        initial="initial"
        animate="animate"
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 pt-2"
      >
        <AnimatePresence mode="popLayout">
          {filteredJobs.map((job) => (
            <motion.div
              key={job.id}
              variants={staggerItem}
              layout
              className="h-full"
            >
              <JobCard 
                job={job} 
                onViewMatches={(id) => setSelectedJobId(id)} 
              />
            </motion.div>
          ))}
        </AnimatePresence>

        {/* Empty Search State */}
        {filteredJobs.length === 0 && searchQuery && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="md:col-span-2 xl:col-span-3 py-20 text-center bg-white border-2 border-dashed border-border rounded-2xl"
          >
            <div className="w-12 h-12 rounded-full bg-muted/40 flex items-center justify-center mx-auto mb-4">
              <Search className="h-6 w-6 text-muted-foreground" />
            </div>
            <h3 className="text-lg font-bold">No job opportunities found</h3>
            <p className="text-sm text-muted-foreground mt-1">
              Try a different search term or create a new job role.
            </p>
          </motion.div>
        )}
      </motion.div>

      {/* <>{ console.log(jobs.length,"jobs.length")}</> */}
      {/* Global Empty State */}
      {jobs.length === 0 && !searchQuery && (
        <div className="py-24 text-center bg-white border-2 border-dashed border-border rounded-3xl shadow-sm">
          <div className="w-16 h-16 rounded-3xl bg-primary/5 flex items-center justify-center mx-auto mb-6 border border-primary/10">
            <Plus className="h-8 w-8 text-primary opacity-60" />
          </div>
          <h3 className="text-xl font-bold">No jobs listed yet</h3>
          <p className="text-sm text-muted-foreground max-w-sm mx-auto mt-2 font-medium">
            Start by creating your first job opportunity to begin identifying compatible candidates.
          </p>
       
          <div className="mt-8">
            <CreateJobModal />
          </div>
        </div>
      )}
    </div>
  );
}
