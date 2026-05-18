'use client';

import { useChatStore } from '@/lib/stores/chatStore';
import { motion, AnimatePresence } from 'framer-motion';
import {
  User,
  Mail,
  Briefcase,
  Star,
  DollarSign,
  FileText,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { staggerContainer, staggerItem } from '@/lib/animations';
import { useEffect, useState } from 'react';
import axios from 'axios';
import { API_BASE_URL } from '@/lib/utils';
import { CandidatePreviewDialog } from './CandidatePreviewDialog';

export function CandidateResumes() {
  const { resumes, getAllCandidates } = useChatStore();
  const [addedToPool, setAddedToPool] = useState<Record<string, boolean>>({});
  const [selectedResume, setSelectedResume] = useState<any | null>(null);
  const [showPoolOnly, setShowPoolOnly] = useState(false);
  const [poolIds, setPoolIds] = useState<any[]>([]);

  const fetchPool = async () => {
    try {
      const res = await axios.get(`${API_BASE_URL}/pool`);
      const ids = res.data.candidate_ids || [];
      setPoolIds(ids);
      
      const addedRecord: Record<string, boolean> = {};
      ids.forEach((id: any) => {
        addedRecord[id.toString()] = true;
      });
      setAddedToPool(addedRecord);
    } catch (err) {
      console.error("Failed to fetch pool", err);
    }
  };

  const [expandedSkills, setExpandedSkills] = useState<Record<string, boolean>>({});
  
  useEffect(() => {
    getAllCandidates(); // 👈 call here once on load
    fetchPool();
  }, [getAllCandidates]);

  const displayedResumes = showPoolOnly
    ? resumes.filter((r) => poolIds.includes(Number(r.id)) || poolIds.includes(r.id.toString()))
    : resumes;

  if (resumes.length === 0) {
    return (
      <div className="py-24 text-center bg-white border-2 border-dashed border-border rounded-3xl shadow-sm space-y-4">
        <div className="w-16 h-16 rounded-3xl bg-[#f8f9fa] flex items-center justify-center mx-auto mb-4 border border-border">
          <FileText className="h-8 w-8 text-muted-foreground opacity-60" />
        </div>
     <div className="space-y-1">
  <h3 className="text-xl font-bold">Start by adding a job</h3>
  <p className="text-sm text-muted-foreground max-w-sm mx-auto font-medium">
    Upload the job you want to match candidates for. After that, you can upload resumes and see AI-powered matches instantly.
  </p>
</div>
      </div>
    );
  }


  const handleTogglePool = async (id: string) => {
    const isAdded = addedToPool[id];
    try {
      if (isAdded) {
        await axios.delete(`${API_BASE_URL}/pool/${id}`);
        setAddedToPool((prev) => ({
          ...prev,
          [id]: false,
        }));
        setPoolIds((prev) => prev.filter((pId) => pId.toString() !== id && pId !== Number(id)));
      } else {
        await axios.post(`${API_BASE_URL}/pool/${id}`);
        setAddedToPool((prev) => ({
          ...prev,
          [id]: true,
        }));
        setPoolIds((prev) => [...prev, id, Number(id)]);
      }
    } catch (err) {
      console.error("Failed to toggle pool", err);
    }
  };
  
  return (
    <div className="space-y-8 pb-10">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <span className="text-[10px] font-bold uppercase tracking-widest text-[#1a73e8] mb-2 block">
            Resume Management
          </span>
          <h2 className="text-3xl font-bold tracking-tight text-foreground">Candidate Resumes</h2>
          <p className="text-sm text-muted-foreground mt-1 max-w-xl font-medium">
            Manage and review uploaded candidate resumes with AI-powered job matching.
          </p>
        </div>

        {/* Curated Pool Toggle Filter */}
        <Button
          variant={showPoolOnly ? "default" : "outline"}
          onClick={() => setShowPoolOnly(!showPoolOnly)}
          className={`rounded-xl h-11 px-5 font-bold gap-2 text-xs transition-all active:scale-95 shadow-sm
            ${showPoolOnly 
              ? "bg-[#e65100] text-white hover:bg-[#e65100]/90" 
              : "bg-white text-muted-foreground hover:text-foreground border-border hover:bg-slate-50"
            }`}
        >
          <Star className={`h-4 w-4 ${showPoolOnly ? "fill-white text-white" : "text-amber-500 fill-amber-500"}`} />
          {showPoolOnly ? "Showing Curated Pool Only" : "Show Curated Pool Only"}
        </Button>
      </div>

      {/* Resume Cards Grid */}
      {displayedResumes.length === 0 ? (
        <div className="py-20 text-center bg-white border border-dashed border-border rounded-3xl shadow-sm space-y-4">
          <div className="w-12 h-12 rounded-2xl bg-amber-50 flex items-center justify-center mx-auto mb-2 border border-amber-100 text-amber-500">
            <Star className="h-6 w-6 fill-amber-500" />
          </div>
          <div className="space-y-1">
            <h4 className="text-lg font-bold">Your curated pool is empty</h4>
            <p className="text-xs text-muted-foreground max-w-xs mx-auto font-semibold">
              Browse candidate profiles and click "Add to Pool" to curate your top selected talents here.
            </p>
          </div>
        </div>
      ) : (
        <motion.div
          variants={staggerContainer}
          initial="initial"
          animate="animate"
          className="grid grid-cols-1 lg:grid-cols-2 gap-6"
        >
          <AnimatePresence mode="popLayout">
            {displayedResumes.map((resume) => (
              <motion.div
              key={resume.id}
              variants={staggerItem}
              layout
              className="bg-white border border-border shadow-[0_1px_2px_0_rgba(60,64,67,0.3),0_1px_3px_1px_rgba(60,64,67,0.15)] overflow-hidden flex flex-col space-y-6 p-6 rounded-2xl hover:shadow-[0_4px_8px_3px_rgba(60,64,67,0.15),0_1px_3px_rgba(60,64,67,0.3)] transition-all duration-300 group"
            >
              {/* Candidate Header */}
              {resume.analysis?.candidate ? (
                <>
                  <div className="flex items-start justify-between">
                    <div className="flex items-center gap-4">
                      <div className="w-14 h-14 rounded-2xl bg-linear-to-br from-blue-100 to-blue-200 border border-border/60 flex items-center justify-center text-blue-600">
                        <User className="h-7 w-7" />
                      </div>
                      <div>
                        <h3 className="text-lg font-bold">{resume.analysis.candidate.name}</h3>
                        <div className="flex items-center gap-3 mt-1 text-[11px] text-muted-foreground">
                          <span className="flex items-center gap-1 hover:text-primary transition-colors">
                            <Mail className="h-3 w-3" /> {resume.analysis.candidate.email}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Candidate Stats */}
                  <div className="grid grid-cols-3 gap-3">
                    <div className="bg-[#e8f0fe] rounded-xl p-3 border border-[#1a73e8]/20">
                      <p className="text-[10px] font-bold uppercase tracking-widest text-[#1a73e8] mb-1">
                        Experience
                      </p>
                      <p className="text-lg font-bold text-foreground">{resume.analysis.experience} yrs</p>
                    </div>
                    <div className="bg-[#e6f4ea] rounded-xl p-3 border border-[#1e8e3e]/20">
                      <p className="text-[10px] font-bold uppercase tracking-widest text-[#1e8e3e] mb-1">
                        Expected
                      </p>
                      <div className="flex items-center gap-1">
                        <DollarSign className="h-3.5 w-3.5 text-[#1e8e3e]" />
                        <p className="text-sm font-bold text-foreground">
                          {resume.analysis.predicted_salary >= 1000 ? `${(resume.analysis.predicted_salary / 1000).toFixed(0)}k` : resume.analysis.predicted_salary}
                        </p>
                      </div>
                    </div>
                    <div className="bg-[#fef7e0] rounded-xl p-3 border border-[#f57c00]/20">
                      <p className="text-[10px] font-bold uppercase tracking-widest text-[#f57c00] mb-1">
                        Skills
                      </p>
                      <p className="text-lg font-bold text-foreground">{resume.analysis.skills.length}</p>
                    </div>
                  </div>

                  {/* Skills */}
             <div className="flex flex-wrap gap-1.5">
  {(expandedSkills[resume.id]
    ? resume.analysis.skills
    : resume.analysis.skills.slice(0, 6)
  ).map((skill) => (
    <Badge
      key={skill}
      variant="secondary"
      className="bg-[#e6f4ea] text-[#1e8e3e] border-[#1e8e3e]/20 text-[10px] px-2.5 py-0.5 rounded-lg font-bold"
    >
      {skill}
    </Badge>
  ))}

  {resume.analysis.skills.length > 6 && (
    <button
      onClick={() =>
        setExpandedSkills((prev) => ({
          ...prev,
          [resume.id]: !prev[resume.id],
        }))
      }
      className="text-[10px] px-2 rounded-lg border hover:bg-muted"
    >
      {expandedSkills[resume.id]
        ? "View less"
        : `+${resume.analysis.skills.length - 6} more`}
    </button>
  )}
</div>

                  {/* Job Matches */}
                  {resume.analysis.job_matches && resume.analysis.job_matches.length > 0 && (
                    <div className="space-y-3 pt-2 border-t border-border">
                      <p className="text-[10px] font-black uppercase tracking-widest text-foreground flex items-center gap-2">
                        <Briefcase className="h-3.5 w-3.5" /> Job Matches ({resume.analysis.job_matches.length})
                      </p>
                      <div className="space-y-3">
                        {resume.analysis.job_matches.map((jobMatch) => {
                          const isGoodMatch = jobMatch.match_percentage >= 50;
                          return (
                          <div key={jobMatch.job_id} className={`rounded-lg p-3 border-2 space-y-2 transition-all ${
                            isGoodMatch 
                              ? 'bg-[#e6f4ea] border-[#1e8e3e]/30 shadow-sm shadow-[#1e8e3e]/10' 
                              : 'bg-[#ffebee] border-[#d32f2f]/30 shadow-sm shadow-[#d32f2f]/10'
                          }`}>
                            <div className="flex items-start justify-between gap-3">
                              <div className="flex-1 min-w-0">
                                <h4 className="text-sm font-bold text-foreground truncate">{jobMatch.title}</h4>
                              </div>
                              <div className="flex items-center gap-2 flex-shrink-0">
                                <Badge className={`text-xs font-bold px-2.5 py-1 rounded-full whitespace-nowrap ${
                                  isGoodMatch
                                    ? 'bg-[#1e8e3e] text-white'
                                    : 'bg-[#d32f2f] text-white'
                                }`}>
                                  {isGoodMatch ? '✓ Match' : '✗ No Match'}
                                </Badge>
                                <div className={`text-2xl font-black tabular-nums ${
                                  isGoodMatch ? 'text-[#1e8e3e]' : 'text-[#d32f2f]'
                                }`}>
                                  {jobMatch.match_percentage}%
                                </div>
                              </div>
                            </div>
                            <Progress
                              value={jobMatch.match_percentage}
                              className={`h-2 rounded-full ${
                                isGoodMatch
                                  ? 'bg-[#1e8e3e]/20 [&>div]:bg-[#1e8e3e]'
                                  : 'bg-[#d32f2f]/20 [&>div]:bg-[#d32f2f]'
                              }`}
                            />

                            {/* Matched Skills */}
                            {jobMatch.matched_skills.length > 0 && (
                              <div className="pt-1">
                                <p className="text-[9px] font-bold uppercase tracking-widest text-[#1e8e3e] mb-1.5">
                                  Matched: {jobMatch.matched_skills.length}
                                </p>
                                <div className="flex flex-wrap gap-1">
                                  {jobMatch.matched_skills.map((skill) => (
                                    <Badge
                                      key={skill}
                                      className="bg-[#e6f4ea] text-[#1e8e3e] border-[#1e8e3e]/20 text-[9px] px-2 py-0 rounded"
                                    >
                                      ✓ {skill}
                                    </Badge>
                                  ))}
                                </div>
                              </div>
                            )}

                            {/* Missing Skills */}
                            {jobMatch.missing_skills.length > 0 && (
                              <div className="pt-1">
                                <p className="text-[9px] font-bold uppercase tracking-widest text-destructive mb-1.5">
                                  Missing: {jobMatch.missing_skills.length}
                                </p>
                                <div className="flex flex-wrap gap-1">
                                  {jobMatch.missing_skills.map((skill) => (
                                    <Badge
                                      key={skill}
                                      variant="outline"
                                      className="border-destructive/20 text-destructive/80 bg-destructive/2 text-[9px] px-2 py-0 rounded"
                                    >
                                      ✗ {skill}
                                    </Badge>
                                  ))}
                                </div>
                              </div>
                            )}
                          </div>
                        );
                        })}
                      </div>
                    </div>
                  )}

                  {/* Actions */}
                  <div className="pt-4 flex gap-3 border-t border-border">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setSelectedResume(resume)}
                      className="flex-1 h-10 rounded-xl text-[11px] font-bold gap-2 border-border hover:border-primary/30 hover:bg-primary/5 transition-all"
                    >
                      <Eye className="h-4 w-4" /> View Full
                    </Button>
                <Button
                  onClick={() => handleTogglePool(resume.id)}
                  className={`flex-1 h-10 rounded-xl text-[11px] font-bold gap-2 shadow-sm hover:shadow-md transition-all active:scale-95 group
                    ${
                      addedToPool[resume.id]
                        ? "bg-[#e8f0fe] text-primary hover:bg-red-50 hover:text-red-600 border border-[#e8f0fe] hover:border-red-200"
                        : "bg-primary text-white hover:bg-primary/90"
                    }`}
                >
                  <Star className={`h-4 w-4 transition-colors ${
                    addedToPool[resume.id] 
                      ? "fill-primary text-primary group-hover:fill-transparent group-hover:text-red-600" 
                      : "text-white"
                  }`} />
                  {addedToPool[resume.id] ? (
                    <>
                      <span className="inline group-hover:hidden">Added ✓</span>
                      <span className="hidden group-hover:inline">Remove</span>
                    </>
                  ) : (
                    "Add to Pool"
                  )}
                </Button>
                  </div>
                </>
              ) : (
                <>
                  {/* File info when analysis is not available */}
                  <div className="flex items-center gap-4">
                    <div className="w-14 h-14 rounded-2xl bg-linear-to-br from-slate-100 to-slate-200 border border-border/60 flex items-center justify-center">
                      <FileText className="h-7 w-7 text-slate-500" />
                    </div>
                    <div>
                      <h3 className="text-lg font-bold truncate">{resume.file.name}</h3>
                      <p className="text-[11px] text-muted-foreground mt-1">
                        {(resume.file.size / 1024 / 1024).toFixed(2)} MB
                      </p>
                    </div>
                  </div>
                  <p className="text-sm text-muted-foreground italic">
                    Resume analysis in progress or matching service unavailable...
                  </p>
                </>
              )}
            </motion.div>
            ))}
          </AnimatePresence>
        </motion.div>
      )}

      {/* 
        Shared Candidate Preview Dialog Component 
        Displays complete analytical data, matching metrics, skills badges, 
        and renders an inline high-fidelity interactive PDF document preview.
      */}
      <CandidatePreviewDialog
        isOpen={selectedResume !== null}
        onOpenChange={(open) => !open && setSelectedResume(null)}
        candidate={selectedResume}
      />
    </div>
  );
}

// Icon import
function Eye({ className }: { className: string }) {
  return (
    <svg
      className={className}
      fill="none"
      stroke="currentColor"
      viewBox="0 0 24 24"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}
        d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
      />
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}
        d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
      />
    </svg>
  );
}
