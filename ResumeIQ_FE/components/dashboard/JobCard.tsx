'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { Job, useJobStore } from '@/lib/stores/jobStore';
import { useChatStore } from '@/lib/stores/chatStore';
import { 
  MapPin, 
  Building2, 
  Users, 
  MoreVertical, 
  Trash2, 
  ChevronRight,
  TrendingUp,
  Target,
  CalendarDays,
  DollarSign
} from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { format } from 'date-fns';
import { toast } from 'sonner';
import { Progress } from '@/components/ui/progress';

interface JobCardProps {
  job: Job;
  onViewMatches?: (jobId: string) => void;
}

export function JobCard({ job, onViewMatches }: JobCardProps) {
  const { removeJob } = useJobStore();
  const { resumes } = useChatStore();
  const { getMatches } = useJobStore();
  const [showDeleteAlert, setShowDeleteAlert] = useState(false);

  const matches = getMatches(job.id, resumes);
  const bestMatch = matches.length > 0 ? matches[0] : null;
  const bestCandidate = bestMatch ? resumes.find((r) => r.id === bestMatch.resumeId) : null;

  const handleDelete = () => {
    removeJob(job.id);
    toast.success('Job opportunity removed');
    setShowDeleteAlert(false);
  };

  return (
    <>
      <motion.div
        layout
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95 }}
        whileHover={{ y: -4 }}
        className="bg-white border border-border shadow-[0_1px_2px_0_rgba(60,64,67,0.3),0_1px_3px_1px_rgba(60,64,67,0.15)] overflow-hidden flex flex-col h-full hover:shadow-[0_4px_8px_3px_rgba(60,64,67,0.15),0_1px_3px_rgba(60,64,67,0.3)] transition-all duration-300 rounded-2xl group"
      >
        <div className="p-6 flex-1 space-y-5">
          {/* Header */}
          <div className="flex items-start justify-between gap-4">
            <div className="space-y-1.5 flex-1">
              <div className="flex flex-wrap items-center gap-2 mb-2">
                <Badge variant="outline" className="text-[10px] font-bold uppercase tracking-wider bg-primary/5 text-primary border-primary/20 rounded-lg py-0.5 px-2">
                  {job.department}
                </Badge>
                <Badge variant="secondary" className="text-[10px] bg-muted/70 rounded-lg py-0.5 px-2 text-muted-foreground font-bold">
                  {job.type}
                </Badge>
              </div>
              <h3 className="text-xl font-bold leading-tight group-hover:text-primary transition-all duration-300">
                {job.title}
              </h3>
              <div className="flex flex-wrap items-center gap-y-2 gap-x-4 mt-3 text-xs text-muted-foreground font-medium">
                <span className="flex items-center gap-1.5 leading-none">
                  <MapPin className="h-3.5 w-3.5 text-primary/60" />
                  {job.location}
                </span>
                <span className="flex items-center gap-1.5 leading-none">
                  <Building2 className="h-3.5 w-3.5 text-primary/60" />
                  {job.experienceLevel}
                </span>
                {job.salaryRange && (
                  <span className="flex items-center gap-1.5 leading-none">
                    <DollarSign className="h-3.5 w-3.5 text-secondary/70" />
                    {job.salaryRange}
                  </span>
                )}
              </div>
            </div>

            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon" className="h-9 w-9 rounded-xl text-muted-foreground hover:bg-muted/80 shrink-0">
                  <MoreVertical className="h-4.5 w-4.5" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="z-50 bg-white rounded-2xl p-1.5 shadow-2xl border border-border min-w-[160px] animate-in fade-in-0 zoom-in-95">
                <DropdownMenuItem 
                  onClick={() => setShowDeleteAlert(true)} 
                  className="text-destructive focus:text-destructive focus:bg-destructive/10 rounded-xl gap-2.5 cursor-pointer font-semibold text-sm px-3 py-2"
                >
                  <Trash2 className="h-4 w-4" /> Delete Job
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>

          {/* Requirements - Show all as tags */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <p className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground/80 flex items-center gap-2">
                  <Target className="h-3 w-3 text-primary/70" /> Core Requirements
              </p>
              <p className="text-[10px] text-muted-foreground font-medium flex items-center gap-1">
                <CalendarDays className="h-3 w-3" />
                Posted {format(job.createdAt, 'MMM d')}
              </p>
            </div>
            <div className="flex flex-wrap gap-2">
              {job.requirements.map((req, i) => (
                <Badge key={i} variant="outline" className="text-[11px] font-bold px-2.5 py-1 rounded-lg border-border bg-[#f8f9fa] hover:bg-white hover:border-primary/30 transition-all cursor-default text-muted-foreground">
                  {req}
                </Badge>
              ))}
            </div>
          </div>

          {/* AI Match Overview */}
          <div className="pt-1">
            <div className="rounded-2xl bg-[#f8f9fa] border border-border p-4 space-y-4">
              <div className="flex items-center justify-between">
                <p className="text-[11px] font-bold text-primary flex items-center gap-1.5">
                  <TrendingUp className="h-3.5 w-3.5" />
                  Smart Candidate Match
                </p>
                <span className="text-[10px] font-bold text-muted-foreground/80 uppercase tracking-tight">
                  {resumes.length} {resumes.length === 1 ? 'Candidate' : 'Candidates'}
                </span>
              </div>

              {bestMatch ? (
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <p className="text-[12px] font-bold text-foreground truncate max-w-[150px]">
                      {bestCandidate?.analysis?.candidate?.name || 'Candidate'}
                    </p>
                    <span className="px-2 py-0.5 rounded-full bg-primary/10 text-primary text-[10px] font-bold">
                      {bestMatch.score}% Fit
                    </span>
                  </div>
                  <div className="relative pt-0.5">
                    <Progress value={bestMatch.score} className="h-2 bg-primary/10" />
                  </div>
                </div>
              ) : (
                <div className="py-2.5 text-center border-2 border-dashed rounded-xl border-border/40 bg-white/20">
                  <p className="text-[11px] text-muted-foreground italic font-medium">No candidates uploaded yet</p>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Footer Actions */}
        <div className="px-6 py-4 border-t border-border bg-white mt-auto">
          <Button 
            variant="default" 
            onClick={() => {
              console.log('👉 Evaluate Candidates button clicked in JobCard for job:', job.id);
              onViewMatches?.(job.id);
            }}
            className="w-full bg-primary text-white text-xs font-bold h-11 rounded-xl gap-2 transition-all active:scale-95 group/btn shadow-sm hover:shadow-md"
          >
            <Users className="h-4 w-4 text-white" />
            Evaluate Candidates
            <ChevronRight className="h-4 w-4 ml-auto text-white/70 group-hover/btn:translate-x-1 transition-all" />
          </Button>
        </div>
      </motion.div>

      {/* Delete Confirmation Alert */}
      <AlertDialog open={showDeleteAlert} onOpenChange={setShowDeleteAlert}>
        <AlertDialogContent className="rounded-3xl max-w-sm">
          <AlertDialogHeader>
            <AlertDialogTitle className="text-xl font-bold">Remove Job Role?</AlertDialogTitle>
            <AlertDialogDescription className="text-sm text-muted-foreground leading-relaxed">
              This will permanently delete the <strong>{job.title}</strong> opportunity. All associated candidate matches will be reset.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter className="gap-3 sm:gap-2 pt-2">
            <AlertDialogCancel className="rounded-2xl h-11 font-bold border-border/60">Cancel</AlertDialogCancel>
            <AlertDialogAction 
              onClick={handleDelete}
              className="rounded-2xl h-11 font-bold bg-destructive hover:bg-destructive/90 transition-all shadow-lg shadow-destructive/20"
            >
              Delete Opportunity
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
