'use client';

import { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useChatStore, Resume } from '@/lib/stores/chatStore';
import { Upload,  Plus, Loader2, Sparkles } from 'lucide-react';
import { toast } from 'sonner';
import axios from 'axios';
import { cn, API_BASE_URL } from '@/lib/utils';

interface ResumeUploadProps {
  variant?: 'default' | 'card';
  className?: string;
}

export function ResumeUpload({ variant = 'default', className }: ResumeUploadProps) {
  const [isDragging, setIsDragging] = useState(false);
  const [isUploading] = useState(false);
  const [isMatching, setIsMatching] = useState(false);
  const [resumeUploaded, setResumeUploaded] = useState(false);
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);
  const [jobDescription, setJobDescription] = useState('');
  const { addResume } = useChatStore();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => setIsDragging(false);

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    handleFiles(Array.from(e.dataTransfer.files));
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    handleFiles(e.currentTarget.files ? Array.from(e.currentTarget.files) : []);
  };

  const handleFiles = async (files: File[]) => {
    if (files.length === 0) return;
    const file = files[0];
    
    // Validations
    const validTypes = [
      'application/pdf',
      'application/msword',
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    ];
    if (!validTypes.includes(file.type)) {
      toast.error('Please upload a PDF or Word document');
      return;
    }
    if (file.size > 5 * 1024 * 1024) {
      toast.error('File size must be less than 5MB');
      return;
    }

    // Store file and show the job description input
    setUploadedFile(file);
    setResumeUploaded(true);
    setJobDescription('');
    toast.success('Resume uploaded! Now enter the job description to match.');
  };

  const handleMatch = async () => {
    if (!uploadedFile || !jobDescription.trim()) {
      toast.error('Please upload a resume and enter a job description');
      return;
    }

    setIsMatching(true);
    const matchFormData = new FormData();
    matchFormData.append("file", uploadedFile);
    matchFormData.append("job_description", jobDescription);

    try {
      const matchResponse = await axios.post(
        `${API_BASE_URL}/match-resume-job`,
        matchFormData,
        {
          headers: { accept: "application/json" },
        }
      );

      const analysis = matchResponse.data.data.resume_analysis;
      console.log('Resume matching successful:', analysis);

      const resumeData = {
        skills: {
          years_of_experience: 3,
          technical_skills: ['React', 'TypeScript', 'Tailwind CSS', 'Node.js']
        },
        yearsOfExperience: 3,
        predictedSalary: 85000
      };

      const newResume: Resume = {
        id: analysis.candidate_id?.toString() || Math.random().toString(36).substring(7),
        file: uploadedFile,
        data: resumeData,
        analysis: analysis,
        uploadedAt: new Date(),
      };

      addResume(newResume);
      toast.success('Resume matched with job successfully!');
      
      // Reset form
      setResumeUploaded(false);
      setUploadedFile(null);
      setJobDescription('');
      if (fileInputRef.current) fileInputRef.current.value = '';
    } catch (matchError: any) {
  console.error('Resume matching failed:', matchError);

  const message =
    matchError?.response?.data?.detail || // 👈 FastAPI HTTPException
    matchError?.response?.data?.message || // fallback
    'Failed to match resume. Please try again.';

  toast.error(message);
} finally {
      setIsMatching(false);
    }
  };

  if (variant === 'card') {
    return (
      <div className={cn("space-y-4", className)}>
        {!resumeUploaded ? (
          <motion.div
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
            onClick={() => !isUploading && fileInputRef.current?.click()}
            className={cn(
              "h-full min-h-60 relative border-2 border-dashed rounded-3xl flex flex-col items-center justify-center gap-5 cursor-pointer transition-all duration-500 group overflow-hidden shadow-sm",
              isDragging 
                ? "border-primary bg-primary/10 shadow-lg shadow-primary/10 scale-[0.99]" 
                : "border-border/60 bg-white/40 backdrop-blur-sm hover:border-primary/40 hover:bg-white/80 hover:shadow-md",
              isUploading && "cursor-not-allowed opacity-80"
            )}
          >
            <input
              type="file"
              ref={fileInputRef}
              onChange={handleChange}
              accept=".pdf,.doc,.docx"
              className="hidden"
            />

            {isUploading ? (
              <div className="flex flex-col items-center gap-4 py-8">
                <div className="relative">
                  <Loader2 className="h-10 w-10 text-primary animate-spin" />
                  <div className="absolute inset-0 blur-sm bg-primary/20 rounded-full animate-pulse" />
                </div>
                <div className="text-center space-y-1">
                  <p className="text-sm font-bold">Analyzing Profile</p>
                  <p className="text-[10px] text-muted-foreground animate-pulse">Extracting skills & experience...</p>
                </div>
              </div>
            ) : (
              <>
                <motion.div 
                  whileHover={{ rotate: 90, scale: 1.1 }}
                  transition={{ duration: 0.3 }}
                  className="w-14 h-14 rounded-2xl bg-linear-to-br from-primary to-secondary flex items-center justify-center shadow-lg shadow-primary/25 border border-white/20 group-hover:shadow-primary/40"
                >
                  <Plus className="h-7 w-7 text-white" />
                </motion.div>
                <div className="text-center px-6">
                  <p className="text-sm font-bold group-hover:text-primary transition-colors duration-300">New Candidate Profile</p>
                  <p className="text-[11px] text-muted-foreground mt-1.5 leading-relaxed font-medium">
                    Drag & drop resume or <span className="text-primary hover:underline font-bold">browse files</span>
                  </p>
                </div>
                <div className="absolute bottom-4 flex items-center gap-1.5 px-3 py-1 bg-muted/40 rounded-full border border-border/40">
                  <Sparkles className="h-3 w-3 text-secondary" />
                  <span className="text-[9px] font-bold uppercase tracking-wider text-muted-foreground">AI Powered Matching</span>
                </div>
                
                <AnimatePresence>
                  {isDragging && (
                    <motion.div 
                      initial={{ opacity: 0 }} 
                      animate={{ opacity: 1 }} 
                      exit={{ opacity: 0 }}
                      className="absolute inset-0 bg-primary/10 backdrop-blur-xs flex flex-col items-center justify-center z-10 border-4 border-primary/20 rounded-[inherit]"
                    >
                      <motion.div
                        animate={{ y: [0, -10, 0] }}
                        transition={{ repeat: Infinity, duration: 1.5 }}
                      >
                        <Upload className="h-10 w-10 text-primary mb-2" />
                      </motion.div>
                      <p className="font-bold text-primary text-lg">Drop to Upload</p>
                    </motion.div>
                  )}
                </AnimatePresence>
              </>
            )}
          </motion.div>
        ) : (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-4 border-2 border-border/40 rounded-2xl p-6 bg-white/40 backdrop-blur-sm min-h-60 flex flex-col"
          >
            <div className="bg-primary/10 border border-primary/20 rounded-lg p-3 flex items-center gap-2">
              <Upload className="h-4 w-4 text-primary flex-shrink-0" />
              <p className="text-sm font-medium text-primary truncate">{uploadedFile?.name}</p>
            </div>

            <div className="space-y-2 flex-1">
              <label className="text-sm font-semibold">Job Description</label>
              <textarea
                value={jobDescription}
                onChange={(e) => setJobDescription(e.target.value)}
                placeholder="Paste the job description here..."
                className="w-full flex-1 p-3 border border-border/60 rounded-lg bg-white/50 focus:outline-none focus:ring-2 focus:ring-primary/50 resize-none"
              />
            </div>

            <div className="flex gap-3 pt-2">
              <button
                onClick={() => {
                  setResumeUploaded(false);
                  setUploadedFile(null);
                  setJobDescription('');
                  if (fileInputRef.current) fileInputRef.current.value = '';
                }}
                className="flex-1 px-4 py-2 border border-border/60 rounded-lg hover:bg-muted/40 transition-colors font-medium text-sm"
              >
                Change Resume
              </button>
              <button
                onClick={handleMatch}
                disabled={isMatching || !jobDescription.trim()}
                className={cn(
                  "flex-1 px-4 py-2 rounded-lg font-medium text-sm text-white transition-all flex items-center justify-center gap-2",
                  isMatching || !jobDescription.trim()
                    ? "bg-primary/50 cursor-not-allowed"
                    : "bg-primary hover:bg-primary/90"
                )}
              >
                {isMatching ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin" />
                    Matching...
                  </>
                ) : (
                  <>
                    <Sparkles className="h-4 w-4" />
                    Match Resume
                  </>
                )}
              </button>
            </div>
          </motion.div>
        )}
      </div>
    );
  }

  return (
    <div className={cn("relative space-y-4", className)}>
      <input
        type="file"
        ref={fileInputRef}
        onChange={handleChange}
        accept=".pdf,.doc,.docx"
        className="hidden"
        id="resume-upload-default"
      />
      
      {!resumeUploaded ? (
        <motion.div
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
          onClick={() => !isUploading && fileInputRef.current?.click()}
          className={cn(
            "border-2 border-dashed rounded-2xl p-8 text-center cursor-pointer transition-all duration-300",
            isDragging
              ? "border-primary bg-primary/10 scale-[1.02] shadow-lg shadow-primary/5"
              : "border-border/60 bg-muted/20 hover:border-primary/40 hover:bg-white hover:shadow-md",
            isUploading && "cursor-wait opacity-80"
          )}
        >
          <div className="flex flex-col items-center gap-4">
            <motion.div
              animate={isDragging ? { scale: 1.2, rotate: 10 } : isUploading ? { rotate: 360 } : { scale: 1, rotate: 0 }}
              transition={isUploading ? { repeat: Infinity, duration: 2, ease: "linear" } : { type: "spring", stiffness: 300 }}
              className="w-12 h-12 rounded-2xl bg-gradient-to-br from-primary/20 to-secondary/20 border border-primary/15 flex items-center justify-center shadow-inner"
            >
              {isUploading ? (
                <Loader2 className="h-6 w-6 text-primary animate-spin" />
              ) : (
                <Upload className="h-6 w-6 text-primary" />
              )}
            </motion.div>
            <div>
              <p className="text-sm font-bold">
                {isUploading ? 'Analyzing Resume...' : isDragging ? 'Drop to start' : 'Upload Candidate Resume'}
              </p>
              <p className="text-[11px] text-muted-foreground mt-1 font-medium">Supports PDF, DOC, DOCX (Max 5MB)</p>
            </div>
          </div>
        </motion.div>
      ) : (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="space-y-4 border-2 border-border/40 rounded-2xl p-6 bg-muted/20"
        >
          <div className="bg-primary/10 border border-primary/20 rounded-lg p-3 flex items-center gap-2">
            <Upload className="h-4 w-4 text-primary" />
            <p className="text-sm font-medium text-primary">{uploadedFile?.name}</p>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-semibold">Job Description</label>
            <textarea
              value={jobDescription}
              onChange={(e) => setJobDescription(e.target.value)}
              placeholder="Paste the job description here..."
              className="w-full min-h-[120px] p-3 border border-border/60 rounded-lg bg-white/50 focus:outline-none focus:ring-2 focus:ring-primary/50 resize-none"
            />
          </div>

          <div className="flex gap-3">
            <button
              onClick={() => {
                setResumeUploaded(false);
                setUploadedFile(null);
                setJobDescription('');
                if (fileInputRef.current) fileInputRef.current.value = '';
              }}
              className="flex-1 px-4 py-2 border border-border/60 rounded-lg hover:bg-muted/40 transition-colors font-medium text-sm"
            >
              Change Resume
            </button>
            <button
              onClick={handleMatch}
              disabled={isMatching || !jobDescription.trim()}
              className={cn(
                "flex-1 px-4 py-2 rounded-lg font-medium text-sm text-white transition-all flex items-center justify-center gap-2",
                isMatching || !jobDescription.trim()
                  ? "bg-primary/50 cursor-not-allowed"
                  : "bg-primary hover:bg-primary/90"
              )}
            >
              {isMatching ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  Matching...
                </>
              ) : (
                <>
                  <Sparkles className="h-4 w-4" />
                  Match Resume
                </>
              )}
            </button>
          </div>
        </motion.div>
      )}
    </div>
  );
}
