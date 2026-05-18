export const mapCandidateToResume = (c: any) => ({
  id: c.id,
  file: {
    name: c.resume_file || 'Resume.pdf',
    size: 0,
  },
  resume_file: c.resume_file,
  analysis: {
    candidate: {
      name: c.name,
      email: c.email,
      phone: c.phone,
    },
    experience: c.experience ?? 0,
    skills: c.skills ?? [],
    predicted_salary: c.predicted_salary ?? 0,
    job_matches: [],
  },
});
