'use client';

import { useState } from "react";
import { useJobStore, Job } from "@/lib/stores/jobStore";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Plus, X, Briefcase, PlusCircle, AlertCircle } from "lucide-react";
import { toast } from "sonner";
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { cn, API_BASE_URL } from "@/lib/utils";

interface CreateJobModalProps {
  children?: React.ReactNode;
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
}

const JobSchema = Yup.object().shape({
  title: Yup.string()
    .min(3, 'Title is too short')
    .max(100, 'Title is too long')
    .required('Job title is required'),
  min_experience: Yup.number()
    .min(0, 'Experience must be 0 or more')
    .max(99, 'Experience cannot exceed 99 years')
    .required('Minimum experience is required'),
});

export function CreateJobModal({ children, open, onOpenChange }: CreateJobModalProps) {
  const { addJob } = useJobStore();
  const [internalOpen, setInternalOpen] = useState(false);
  const [newSkill, setNewSkill] = useState("");
  const [requiredSkills, setRequiredSkills] = useState<string[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const isControlled = open !== undefined;
  const isOpen = isControlled ? open : internalOpen;

  const setOpen = (val: boolean) => {
    if (isControlled) {
      onOpenChange?.(val);
    } else {
      setInternalOpen(val);
    }
    if (!val) {
      formik.resetForm();
      setRequiredSkills([]);
    }
  };

  const formik = useFormik({
    initialValues: {
      title: "",
      min_experience: "",
    },
    validationSchema: JobSchema,
    onSubmit: async (values) => {
      if (requiredSkills.length === 0) {
        toast.error("Please add at least one required skill.");
        return;
      }

      setIsSubmitting(true);
      try {
        const payload = {
          title: values.title,
          required_skills: requiredSkills,
          min_experience: parseInt(values.min_experience),
        };

        const response = await fetch(`${API_BASE_URL}/create-job`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "Accept": "application/json",
          },
          body: JSON.stringify(payload),
        });

        if (!response.ok) {
          const errorData = await response.json().catch(() => ({}));
          throw new Error(errorData.detail || `API error: ${response.status}`);
        }

        const result = await response.json();
        
        // Create a Job object with the API response and sensible defaults
        const newJob: Job = {
          id: `job_${result.data.id}`,
          title: result.data.title,
          department: "General",
          location: "Remote",
          type: "Full-time",
          description: `${result.data.title} position - Posted on ${new Date().toLocaleDateString()}`,
          requirements: requiredSkills,
          salaryRange: undefined,
          experienceLevel: "Mid-level",
          createdAt: new Date(),
        };

        addJob(newJob);
        toast.success(result.message);
        setOpen(false);
      } catch (error) {
        console.error("Error creating job:", error);
        toast.error(error instanceof Error ? error.message : "Failed to create job opportunity");
      } finally {
        setIsSubmitting(false);
      }
    },
  });

  const handleAddSkill = (e?: React.FormEvent) => {
    e?.preventDefault();
    if (newSkill.trim() && !requiredSkills.includes(newSkill.trim())) {
      setRequiredSkills([...requiredSkills, newSkill.trim()]);
      setNewSkill("");
    }
  };

  const removeSkill = (skill: string) => {
    setRequiredSkills(requiredSkills.filter((s) => s !== skill));
  };

  return (
    <Dialog open={isOpen} onOpenChange={setOpen}>
      {!isControlled && (
        <DialogTrigger asChild>
          {children || (
            <Button className="rounded-xl h-11 px-5 bg-primary text-white font-bold gap-2 shadow-sm hover:shadow-md transition-all active:scale-95">
              <Plus className="h-4 w-4 text-white" />
              Create Job
            </Button>
          )}
        </DialogTrigger>
      )}
      <DialogContent className="max-w-2xl max-h-[92vh] overflow-hidden flex flex-col rounded-3xl border border-border shadow-2xl p-0 bg-white">
        {/* FIXED HEADER */}
        <DialogHeader className="px-8 pt-8 pb-5 shrink-0 border-b border-border">
          <DialogTitle className="flex items-center gap-3 text-xl font-bold tracking-tight">
            <div className="w-10 h-10 rounded-xl bg-[#e8f0fe] flex items-center justify-center shadow-sm">
              <Briefcase className="h-5 w-5 text-primary" />
            </div>
            Post New Opportunity
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={formik.handleSubmit} className="flex-1 flex flex-col overflow-hidden">
          {/* SCROLLABLE BODY */}
          <div className="flex-1 overflow-y-auto px-8 py-6 scrollbar-thin">
            <div className="space-y-6">
              {/* Title */}
              <div className="space-y-2">
                <Label htmlFor="title" className="text-sm font-bold ml-1">Job Title <span className="text-destructive">*</span></Label>
                <Input
                  id="title"
                  name="title"
                  placeholder="e.g. Senior React developer"
                  value={formik.values.title}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  className={cn(
                    "h-12 rounded-2xl border-border bg-white px-4 focus:ring-4 focus:ring-primary/10 transition-all font-medium",
                    formik.touched.title && formik.errors.title && "border-destructive focus:ring-destructive/10"
                  )}
                />
                {formik.touched.title && formik.errors.title && (
                  <p className="text-[11px] text-destructive font-bold flex items-center gap-1.5 ml-1">
                    <AlertCircle className="h-3 w-3" /> {formik.errors.title}
                  </p>
                )}
              </div>

              {/* Minimum Experience */}
              <div className="space-y-2">
                <Label htmlFor="min_experience" className="text-sm font-bold ml-1">Minimum Experience (Years) <span className="text-destructive">*</span></Label>
                <Input
                  id="min_experience"
                  name="min_experience"
                  type="number"
                  placeholder="e.g. 5"
                  value={formik.values.min_experience}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  className={cn(
                    "h-12 rounded-2xl border-border bg-white px-4 focus:ring-4 focus:ring-primary/10 transition-all font-medium",
                    formik.touched.min_experience && formik.errors.min_experience && "border-destructive focus:ring-destructive/10"
                  )}
                />
                {formik.touched.min_experience && formik.errors.min_experience && (
                  <p className="text-[11px] text-destructive font-bold flex items-center gap-1.5 ml-1">
                    <AlertCircle className="h-3 w-3" /> {formik.errors.min_experience}
                  </p>
                )}
              </div>

              {/* Required Skills */}
              <div className="space-y-3">
                <div>
                  <Label className="text-sm font-bold ml-1 text-foreground">Required Skills <span className="text-destructive">*</span></Label>
                  <p className="text-[11px] text-muted-foreground mt-0.5 ml-1">Add the specific skills/technologies required for this position</p>
                </div>
                <div className="flex gap-2">
                  <Input
                    placeholder="e.g. reactjs, nextjs"
                    value={newSkill}
                    onChange={(e) => setNewSkill(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === "Enter") {
                        e.preventDefault();
                        handleAddSkill();
                      }
                    }}
                    className="h-12 rounded-2xl border-border bg-white px-4 focus:ring-4 focus:ring-primary/10 transition-all font-medium shadow-sm"
                  />
                  <Button
                    type="button"
                    variant="outline"
                    size="icon"
                    onClick={() => handleAddSkill()}
                    className="h-12 w-12 rounded-2xl shrink-0 border-border hover:border-primary/50 hover:bg-primary/5 shadow-sm active:scale-95 transition-all"
                  >
                    <PlusCircle className="h-6 w-6 text-primary" />
                  </Button>
                </div>
                
                <div className="flex flex-wrap gap-2 min-h-[64px] p-4 rounded-2xl border border-dashed border-border bg-[#f8f9fa]">
                  {requiredSkills.length === 0 ? (
                    <p className="text-xs text-muted-foreground italic font-medium m-auto">No skills added yet. Add at least one skill to continue.</p>
                  ) : (
                    requiredSkills.map((skill) => (
                      <Badge key={skill} variant="secondary" className="gap-2 pl-3 py-2 pr-2 rounded-xl text-xs bg-white text-primary border border-primary/10 shadow-sm transition-all hover:border-primary/40 group/tag">
                        <span className="font-bold">{skill}</span>
                        <button
                          type="button"
                          onClick={() => removeSkill(skill)}
                          className="text-muted-foreground hover:text-destructive transition-colors rounded-md p-0.5"
                        >
                          <X className="h-3 w-3" />
                        </button>
                      </Badge>
                    ))
                  )}
                </div>
              </div>
            </div>
          </div>

          <DialogFooter className="px-8 py-5 border-t border-border shrink-0 bg-white mt-0 items-center">
            <Button type="button" variant="ghost" onClick={() => setOpen(false)} className="rounded-xl h-11 px-6 font-bold transition-all text-muted-foreground hover:text-foreground">
              Cancel
            </Button>
            <Button 
              type="submit" 
              className="rounded-xl h-11 px-8 font-bold bg-primary text-white hover:bg-primary/90 transition-all active:scale-95 shadow-sm hover:shadow-md"
              disabled={isSubmitting}
            >
              {isSubmitting ? "Creating..." : "Create Job"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
