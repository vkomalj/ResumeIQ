'use client';

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '@/components/ui/dialog';
import { User, Mail, Phone, Zap, FileText } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { API_BASE_URL } from '@/lib/utils';

interface CandidatePreviewDialogProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  candidate: any | null;
}

export function CandidatePreviewDialog({ isOpen, onOpenChange, candidate }: CandidatePreviewDialogProps) {
  if (!candidate) return null;

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-4xl w-full max-h-[90vh] overflow-y-auto rounded-3xl p-6 sm:p-8 bg-white border border-border shadow-2xl animate-in fade-in-0 zoom-in-95">
        <div className="space-y-6">
          
          {/* Header section displaying name, contact coordinates, and original CV download link */}
          <DialogHeader className="border-b border-border pb-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div className="flex items-center gap-4">
                <div className="w-14 h-14 rounded-2xl bg-primary/10 border border-primary/20 flex items-center justify-center text-primary">
                  <User className="h-7 w-7" />
                </div>
                <div className="text-left">
                  <DialogTitle className="text-2xl font-bold text-foreground">
                    {candidate.analysis?.candidate?.name || 'Candidate Details'}
                  </DialogTitle>
                  <DialogDescription className="text-sm text-muted-foreground font-semibold mt-1 flex flex-wrap gap-x-4 gap-y-1">
                    <span className="flex items-center gap-1.5"><Mail className="h-3.5 w-3.5" /> {candidate.analysis?.candidate?.email || 'N/A'}</span>
                    {candidate.analysis?.candidate?.phone && (
                      <span className="flex items-center gap-1.5"><Phone className="h-3.5 w-3.5" /> {candidate.analysis?.candidate?.phone}</span>
                    )}
                  </DialogDescription>
                </div>
              </div>
              
              {/* Primary action button to download/open original PDF file */}
              {candidate.resume_file && (
                <Button 
                  asChild 
                  className="bg-primary text-white hover:bg-primary/95 text-xs font-bold rounded-xl h-10 px-4 gap-2 transition-all shadow-sm hover:shadow-md"
                >
                  <a href={`${API_BASE_URL.replace('/api', '')}/uploads/${candidate.resume_file}`} target="_blank" rel="noopener noreferrer">
                    <FileText className="h-4 w-4" /> Open Original CV
                  </a>
                </Button>
              )}
            </div>
          </DialogHeader>

          {/* Grid Layout splits page between analytical statistics/skills (2 cols) and PDF preview (3 cols) */}
          <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
            
            {/* Left Side: Analytical stats (experience years, predicted salary) and technical skills cloud */}
            <div className="lg:col-span-2 space-y-6">
              
              {/* Stat Cards Grid */}
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-[#e8f0fe] rounded-2xl p-4 border border-[#1a73e8]/10 flex flex-col justify-center">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-[#1a73e8] opacity-80">Experience</span>
                  <p className="text-xl font-extrabold text-foreground mt-1">{candidate.analysis?.experience ?? 0} Years</p>
                </div>
                
                <div className="bg-[#e6f4ea] rounded-2xl p-4 border border-[#1e8e3e]/10 flex flex-col justify-center">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-[#1e8e3e] opacity-80">Salary (Est)</span>
                  <p className="text-xl font-extrabold text-[#1e8e3e] mt-1">
                    {candidate.analysis?.predicted_salary ? `${(candidate.analysis.predicted_salary / 1000).toFixed(0)}k` : 'N/A'}
                  </p>
                </div>
              </div>

              {/* Complete technical skills badge list */}
              <div className="bg-slate-50/50 rounded-2xl p-6 border border-border/60 space-y-4">
                <h4 className="text-xs font-black uppercase tracking-wider text-muted-foreground flex items-center gap-2">
                  <Zap className="h-4 w-4 text-primary" /> Technical Skills ({candidate.analysis?.skills?.length ?? 0})
                </h4>
                <div className="flex flex-wrap gap-2 max-h-48 overflow-y-auto pr-1">
                  {candidate.analysis?.skills?.map((skill: string) => (
                    <Badge 
                      key={skill} 
                      variant="secondary"
                      className="bg-[#e6f4ea] text-[#1e8e3e] border border-[#1e8e3e]/25 text-[10px] font-bold px-3 py-1 rounded-xl"
                    >
                      {skill}
                    </Badge>
                  ))}
                </div>
              </div>

            </div>

            <div className="lg:col-span-3 space-y-4">
              <h4 className="text-xs font-black uppercase tracking-wider text-muted-foreground flex items-center gap-2">
                <FileText className="h-4 w-4 text-primary" /> PDF CV Document Preview
              </h4>
              
              {/* Dynamic preview loading based on CV filename existence */}
              {candidate.resume_file ? (
                <div className="border border-border/80 rounded-2xl overflow-hidden shadow-inner bg-slate-100/50 h-[400px] relative">
                  <iframe 
                    src={`${API_BASE_URL.replace('/api', '')}/uploads/${candidate.resume_file}`} 
                    className="w-full h-full border-none"
                    title="CV Document Preview"
                  />
                </div>
              ) : (
                <div className="h-[400px] border border-dashed rounded-2xl flex flex-col items-center justify-center gap-3 text-center bg-slate-50 p-6">
                  <FileText className="h-10 w-10 text-muted-foreground opacity-50" />
                  <p className="text-sm font-semibold text-muted-foreground">Preview is not available for this format.</p>
                  <p className="text-xs text-muted-foreground max-w-[200px]">Only PDF formats support direct browser iframe previewing.</p>
                </div>
              )}
            </div>

          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
