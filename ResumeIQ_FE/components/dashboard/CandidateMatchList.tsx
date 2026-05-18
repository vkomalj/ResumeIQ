'use client';

import { useJobStore } from '@/lib/stores/jobStore';
import { useChatStore } from '@/lib/stores/chatStore';
import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { CandidatePreviewDialog } from './CandidatePreviewDialog';
import { 
  ArrowLeft, 
  CheckCircle2, 
  XCircle, 
  FileText, 
  Mail, 
  Phone,
  User,
  Zap,
  Target
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { staggerContainer, staggerItem } from '@/lib/animations';
import { API_BASE_URL } from '@/lib/utils';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

interface CandidateMatchListProps {
  jobId: string;
  onBack: () => void;
}

export function CandidateMatchList({ jobId, onBack }: CandidateMatchListProps) {
  const { jobs, getMatches } = useJobStore();
  const { resumes, getAllCandidates } = useChatStore();
  const [selectedResume, setSelectedResume] = useState<any | null>(null);
  
  useEffect(() => {
    getAllCandidates();
  }, [getAllCandidates]);

  const job = jobs.find((j) => j.id === jobId);
  const matches = getMatches(jobId, resumes);

  console.log('🔍 CandidateMatchList Debug:', { jobId, jobsCount: jobs.length, jobFound: !!job, matchesCount: matches.length });

  if (!job) {
    console.warn('⚠️ CandidateMatchList: Job not found for ID:', jobId);
    return null;
  }

  return (
    <div className="space-y-8 pb-10">
      {/* Header */}
      <div className="flex flex-col gap-4">
        <button 
          onClick={onBack}
          className="flex items-center gap-2 text-sm text-muted-foreground hover:text-primary transition-smooth w-fit group"
        >
          <div className="w-8 h-8 rounded-full border border-border flex items-center justify-center group-hover:border-primary/40 group-hover:bg-primary/5">
            <ArrowLeft className="h-4 w-4" />
          </div>
          Back to Jobs
        </button>

        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
          <div>
            <span className="text-[10px] font-bold uppercase tracking-widest text-[#1a73e8] mb-2 block">
                Top Candidates Evaluated
            </span>
            <h2 className="text-3xl font-bold tracking-tight text-foreground">Best Fits for {job.title}</h2>
            <p className="text-sm text-muted-foreground mt-1 max-w-xl font-medium">
              Ranked by {job.requirements.length} core technical requirements and estimated compatibility.
            </p>
          </div>
          
          <div className="bg-white border border-border shadow-sm rounded-2xl p-4 flex items-center gap-4 transition-all hover:shadow-md">
            <div className="w-12 h-12 rounded-xl bg-[#e8f0fe] flex items-center justify-center">
              <Zap className="h-6 w-6 text-primary" />
            </div>
            <div>
              <p className="text-2xl font-bold text-foreground leading-none">{matches.length}</p>
              <p className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground/80 mt-1">Candidates Found</p>
            </div>
          </div>
        </div>
      </div>

      {/* Candidate Grid */}
      <motion.div
        variants={staggerContainer}
        initial="initial"
        animate="animate"
        className="grid grid-cols-1 lg:grid-cols-2 gap-6"
      >
        <AnimatePresence mode="popLayout">
          {matches.map((match, index) => {
            const candidate = resumes.find((r) => r.id === match.resumeId);
            return (
              <motion.div
                key={match.resumeId}
                variants={staggerItem}
                layout
                className={`border-2 shadow-[0_1px_2px_0_rgba(60,64,67,0.3),0_1px_3px_1px_rgba(60,64,67,0.15)] overflow-hidden flex flex-col p-6 space-y-6 rounded-2xl transition-all duration-300 group ${
                  match.score >= 50
                    ? 'bg-[#f1f8f5] border-[#1e8e3e]/30 hover:shadow-[0_4px_8px_3px_rgba(30,142,62,0.15),0_1px_3px_rgba(30,142,62,0.3)]'
                    : 'bg-[#fef5f5] border-[#d32f2f]/30 hover:shadow-[0_4px_8px_3px_rgba(211,47,47,0.15),0_1px_3px_rgba(211,47,47,0.3)]'
                }`}
              >
                {/* Profile / Score */}
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-4">
                    <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-slate-100 to-slate-200 border border-border/60 flex items-center justify-center text-slate-500">
                      <User className="h-7 w-7" />
                    </div>
                    <div>
                      <h3 className="text-lg font-bold truncate max-w-[200px]">
                        {candidate?.analysis?.candidate?.name || 'Candidate'}
                      </h3>
                      <div className="flex flex-col gap-1 mt-1 text-[11px] text-muted-foreground font-semibold">
                        <span className="flex items-center gap-1"><Mail className="h-3 w-3" /> {candidate?.analysis?.candidate?.email || 'N/A'}</span>
                        {candidate?.analysis?.candidate?.phone && (
                          <span className="flex items-center gap-1"><Phone className="h-3 w-3" /> {candidate?.analysis?.candidate?.phone}</span>
                        )}
                      </div>
                    </div>
                  </div>
                
                <div className="text-right flex flex-col items-end gap-2">
                  <Badge className={`text-xs font-bold px-2.5 py-1 rounded-full ${
                    match.score >= 50
                      ? 'bg-[#1e8e3e] text-white'
                      : 'bg-[#d32f2f] text-white'
                  }`}>
                    {match.score >= 50 ? '✓ Match' : '✗ No Match'}
                  </Badge>
                  <div className={`text-3xl font-black tabular-nums ${match.score >= 50 ? 'text-[#1e8e3e]' : 'text-[#d32f2f]'}`}>
                    {match.score}%
                  </div>
                  <p className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">Match Score</p>
                </div>
              </div>

              <Progress 
                value={match.score} 
                className={`h-2.5 rounded-full ${
                  match.score >= 50 
                    ? 'bg-[#1e8e3e]/20 [&>div]:bg-[#1e8e3e]' 
                    : 'bg-[#d32f2f]/20 [&>div]:bg-[#d32f2f]'
                }`} 
              />

              {/* Skills Analysis */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 pt-2">
                <div className="space-y-3">
                  <p className="text-[10px] font-black uppercase tracking-widest text-green-700 flex items-center gap-2">
                    <CheckCircle2 className="h-3.5 w-3.5" /> Matched Skills
                  </p>
                  <div className="flex flex-wrap gap-1.5">
                    {match.matchedSkills.length > 0 ? (
                      match.matchedSkills.map((skill) => (
                        <Badge key={skill} variant="secondary" className="bg-[#e6f4ea] text-[#1e8e3e] border-[#1e8e3e]/20 text-[10px] px-2.5 py-0.5 rounded-lg font-bold">
                          {skill}
                        </Badge>
                      ))
                    ) : (
                      <p className="text-[10px] italic text-muted-foreground font-medium">No direct matches found</p>
                    )}
                  </div>
                </div>

                <div className="space-y-3">
                  <p className="text-[10px] font-black uppercase tracking-widest text-destructive flex items-center gap-2">
                    <XCircle className="h-3.5 w-3.5 opacity-80" /> Missing Requirements
                  </p>
                  <div className="flex flex-wrap gap-1.5">
                    {match.missingSkills.length > 0 ? (
                      match.missingSkills.map((skill) => (
                        <Badge key={skill} variant="outline" className="border-destructive/20 text-destructive/80 bg-destructive/[0.02] text-[10px] px-2 rounded-lg">
                          {skill}
                        </Badge>
                      ))
                    ) : (
                      <p className="text-[10px] italic text-green-600 font-medium">All requirements met!</p>
                    )}
                  </div>
                </div>
              </div>

              {/* Actions */}
              <div className="pt-4 flex gap-3">
                {candidate?.resume_file ? (
                  <Button 
                    variant="outline" 
                    size="sm" 
                    onClick={() => setSelectedResume(candidate)}
                    className="flex-1 h-10 rounded-xl text-[11px] font-bold gap-2 border-border hover:border-primary/30 hover:bg-primary/5 transition-all"
                  >
                    <FileText className="h-4 w-4" /> View Resume
                  </Button>
                ) : (
                  <Button 
                    variant="outline" 
                    size="sm" 
                    disabled
                    className="flex-1 h-10 rounded-xl text-[11px] font-bold gap-2 border-border opacity-50 cursor-not-allowed"
                  >
                    <FileText className="h-4 w-4" /> No Resume
                  </Button>
                )}

                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button className="flex-1 h-10 rounded-xl text-[11px] font-bold gap-2 bg-primary text-white hover:bg-primary/90 shadow-sm hover:shadow-md transition-all active:scale-95">
                      <Mail className="h-4 w-4 text-white" /> Reach Out
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="z-50 bg-white rounded-2xl p-1.5 shadow-2xl border border-border min-w-[160px] animate-in fade-in-0 zoom-in-95">
                    {candidate?.analysis?.candidate?.email && (
                      <DropdownMenuItem asChild className="rounded-xl gap-2.5 cursor-pointer font-semibold text-sm px-3 py-2">
                        <a href={`mailto:${candidate.analysis.candidate.email}`}>
                          <Mail className="h-4 w-4 text-slate-500" /> Email Candidate
                        </a>
                      </DropdownMenuItem>
                    )}
                    {candidate?.analysis?.candidate?.phone && (
                      <DropdownMenuItem asChild className="rounded-xl gap-2.5 cursor-pointer font-semibold text-sm px-3 py-2">
                        <a href={`tel:${candidate.analysis.candidate.phone}`}>
                          <Phone className="h-4 w-4 text-slate-500" /> Call Candidate
                        </a>
                      </DropdownMenuItem>
                    )}
                    {!candidate?.analysis?.candidate?.email && !candidate?.analysis?.candidate?.phone && (
                      <div className="text-[11px] text-muted-foreground p-3 text-center font-semibold">
                        No contact details available
                      </div>
                    )}
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            </motion.div>
            );
          })}
        </AnimatePresence>
      </motion.div>

      {/* Empty State */}
      {matches.length === 0 && (
        <div className="py-24 text-center bg-white border-2 border-dashed border-border rounded-3xl shadow-sm space-y-4">
          <div className="w-16 h-16 rounded-3xl bg-[#f8f9fa] flex items-center justify-center mx-auto mb-4 border border-border">
            <Target className="h-8 w-8 text-muted-foreground opacity-60" />
          </div>
          <div className="space-y-1">
            <h3 className="text-xl font-bold">No candidate matches yet</h3>
            <p className="text-sm text-muted-foreground max-w-sm mx-auto font-medium">
              Ready to evaluate candidates? Upload some resumes to the Candidates tab to start the smart matching process.
            </p>
          </div>
          <Button variant="outline" className="rounded-xl mt-4 font-bold h-11 px-8" onClick={onBack}>
            Back to Jobs
          </Button>
        </div>
      )}

      {/* 
        Shared Candidate Preview Dialog Component 
        Dynamically imports the common dialog to show the matched candidate's profile preview 
        and high-fidelity PDF iframe preview directly within the Jobs matching perspective.
      */}
      <CandidatePreviewDialog
        isOpen={selectedResume !== null}
        onOpenChange={(open) => !open && setSelectedResume(null)}
        candidate={selectedResume}
      />
    </div>
  );
}
