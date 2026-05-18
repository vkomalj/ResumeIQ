'use client';

import { useEffect } from 'react';
import { useAuthStore } from '@/lib/stores/authStore';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { useChatStore } from '@/lib/stores/chatStore';
import { useJobStore } from '@/lib/stores/jobStore';
import { Header } from '@/components/dashboard/Header';
import { ResumeList } from '@/components/dashboard/ResumeList';
import { JobsView } from '@/components/dashboard/JobsView';
import { RecruitmentChatbot } from '@/components/dashboard/RecruitmentChatbot';
import { slideInUp } from '@/lib/animations';
import { 
  Users, 
  Briefcase,
  LayoutDashboard
} from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

export default function DashboardPage() {
  const { isAuthenticated, isHydrated } = useAuthStore();
  const router = useRouter();

  const { getAllCandidates } = useChatStore();
  const { fetchJobs } = useJobStore();

  useEffect(() => {
    // Wait for store to be hydrated from localStorage
    if (!isHydrated) return;
    
    // Then check authentication
    if (!isAuthenticated) {
      router.push('/sign-in');
    } else {
      // central load
      fetchJobs();
      getAllCandidates();
    }
  }, [isHydrated, isAuthenticated, router, fetchJobs, getAllCandidates]);

  // Show nothing while hydrating
  if (!isHydrated) {
    return null;
  }

  if (!isAuthenticated) {
    return null;
  }

  return (
    <div className="h-screen flex flex-col overflow-hidden hero-bg selection:bg-primary/10">
      <div className="shrink-0 z-50">
        <Header />
      </div>

      <motion.main
        variants={slideInUp}
        initial="initial"
        animate="animate"
        className="flex-1 flex flex-col min-h-0 px-3 sm:px-5 md:px-6 lg:px-8 max-w-[102rem] w-full mx-auto"
      >
        <div className="flex flex-col lg:flex-row gap-6 lg:gap-8 flex-1 min-h-0 pt-4 sm:pt-6">
          {/* Main Content Area */}
          <div className="flex-1 min-w-0 flex flex-col min-h-0 overflow-hidden">
            <Tabs defaultValue="candidates" className="w-full flex flex-col flex-1 min-h-0">
              {/* FIXED Title and Tabs */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 sm:gap-4 border-b border-border pb-3 sm:pb-4 shrink-0 transition-all duration-300">
                <div className="space-y-1">
                  <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-foreground">HR Dashboard</h1>
                  <p className="text-xs sm:text-sm text-muted-foreground flex items-center gap-1.5 font-bold">
                    <LayoutDashboard className="h-3.5 w-3.5 text-primary flex-shrink-0" />
                    <span className="truncate">Centralized candidate evaluation and job management</span>
                  </p>
                </div>
                <TabsList className="bg-[#f8f9fa] p-1 rounded-2xl h-10 sm:h-12 border border-border shadow-sm w-fit">
                  <TabsTrigger 
                    value="candidates" 
                    className="rounded-xl gap-1.5 sm:gap-2.5 text-[12px] sm:text-[13px] font-bold px-3 sm:px-5 data-[state=active]:bg-white data-[state=active]:shadow-sm data-[state=active]:text-primary transition-all duration-300"
                  >
                    <Users className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
                    <span className="hidden sm:inline">Candidates</span>
                    <span className="sm:hidden">Cand.</span>
                  </TabsTrigger>
                  <TabsTrigger 
                    value="jobs" 
                    className="rounded-xl gap-1.5 sm:gap-2.5 text-[12px] sm:text-[13px] font-bold px-3 sm:px-5 data-[state=active]:bg-white data-[state=active]:shadow-md data-[state=active]:text-primary transition-all duration-300"
                  >
                    <Briefcase className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
                    <span className="hidden sm:inline">Job Openings</span>
                    <span className="sm:hidden">Jobs</span>
                  </TabsTrigger>
                </TabsList>
              </div>

              {/* SCROLLABLE Tab Contents */}
              <div className="flex-1 min-h-0 pt-4 sm:pt-6">
                <TabsContent 
                  value="candidates" 
                  className="h-full mt-0 border-none p-0 outline-none overflow-y-auto overflow-x-hidden scrollbar-gutter-stable pr-3 sm:pr-4 pb-16 sm:pb-20"
                >
                  <ResumeList />
                </TabsContent>
                
                <TabsContent 
                  value="jobs" 
                  className="h-full mt-0 border-none p-0 outline-none overflow-y-auto overflow-x-hidden scrollbar-gutter-stable pr-3 sm:pr-4 pb-16 sm:pb-20"
                >
                  <JobsView />
                </TabsContent>
              </div>
            </Tabs>
          </div>

          {/* Fixed/Isolated Sidebar - Recruitment Chatbot */}
          <aside className="hidden lg:block w-72 xl:w-80 shrink-0 self-start h-[calc(100vh-7rem)]">
            <div className="sticky top-16 h-full">
              <RecruitmentChatbot />
            </div>
          </aside>
        </div>
      </motion.main>
    </div>
  );
}
