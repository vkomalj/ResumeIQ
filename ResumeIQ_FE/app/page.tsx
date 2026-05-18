'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';
import { AnimatedButton } from '@/components/AnimatedButton';
import { useAuthStore } from '@/lib/stores/authStore';
import { slideInUp, staggerContainer, staggerItem } from '@/lib/animations';
import { ArrowRight, Zap, Brain, FileText, Star, CheckCircle2, TrendingUp, Users } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Header } from '@/components/dashboard/Header';

const features = [
  {
    icon: Brain,
    title: 'AI Candidate Screening',
    description: 'Automatically screen candidates and identify top talent instantly with our intelligent AI matching.',
    color: 'from-violet-500 to-purple-600',
    badge: 'Smart',
  },
  {
    icon: FileText,
    title: 'Smart Resume Parsing',
    description: 'Upload candidate resumes to instantly extract skills, experience, and match them directly to your job requirements.',
    color: 'from-cyan-500 to-teal-600',
    badge: 'Instant',
  },
  {
    icon: Zap,
    title: 'Centralized Job Management',
    description: 'Manage all your job postings, candidate pools, and recruitment workflows from one intuitive HR dashboard.',
    color: 'from-amber-500 to-orange-600',
    badge: 'Live',
  },
];

const stats = [
  { value: '10k+', label: 'Candidates Screened', icon: Users },
  { value: '98%', label: 'Placement Rate', icon: TrendingUp },
  { value: '500+', label: 'Active Postings', icon: Star },
  { value: '4.9★', label: 'HR Satisfaction', icon: CheckCircle2 },
];


export default function HomePage() {
  const { isAuthenticated } = useAuthStore();

  return (
    <div className="min-h-screen flex flex-col hero-bg relative overflow-hidden">
      {/* Floating orbs */}
      <div className="pointer-events-none absolute inset-0 -z-10 overflow-hidden">
        <div className="absolute -top-40 -left-40 w-[600px] h-[600px] rounded-full bg-primary/10 blur-[120px]" />
        <div className="absolute top-1/2 -right-40 w-[500px] h-[500px] rounded-full bg-accent/8 blur-[100px]" />
        <div className="absolute -bottom-40 left-1/3 w-[400px] h-[400px] rounded-full bg-secondary/10 blur-[100px]" />
      </div>

      {/* Navbar */}
      <Header />


      {/* Hero */}
      <motion.main
        variants={slideInUp}
        initial="initial"
        animate="animate"
        className="flex-1 flex flex-col items-center justify-center px-4 sm:px-6 py-20 sm:py-28 text-center"
      >
        <motion.div
          variants={staggerContainer}
          initial="initial"
          animate="animate"
          className="max-w-4xl mx-auto space-y-8"
        >
       

          {/* Headline */}
          <motion.div variants={staggerItem} className="space-y-4">
            <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold tracking-tight leading-[1.1]">
              <span className="text-gradient">Streamline Your</span>
              <br />
              <span className="text-foreground">Hiring with AI</span>
            </h1>
          </motion.div>

          {/* CTA Buttons */}
          <motion.div variants={staggerItem} className="flex flex-col sm:flex-row gap-3 justify-center">
            <AnimatedButton
              size="lg"
              className="bg-primary hover:bg-primary/95 text-white text-base font-semibold px-8 rounded-xl shadow-md border border-transparent transition-all duration-200 active:scale-95"
              onClick={() => (window.location.href = isAuthenticated ? '/dashboard' : '/sign-up')}
            >
              {isAuthenticated ? 'Go to Dashboard' : 'Start Free — No Card Needed'}
              <ArrowRight className="ml-2 h-4 w-4" />
            </AnimatedButton>
            <AnimatedButton
              size="lg"
              variant="outline"
              className="text-base border-border hover:border-primary/30 hover:bg-primary/5 rounded-xl font-semibold px-8 transition-all duration-200 active:scale-95"
              onClick={() => document.getElementById('features')?.scrollIntoView({ behavior: 'smooth' })}
            >
              Explore Features
            </AnimatedButton>
          </motion.div>
        </motion.div>

        {/* Stats bar */}
        <motion.div
          variants={staggerContainer}
          initial="initial"
          whileInView="animate"
          viewport={{ once: true }}
          className="w-full max-w-4xl mx-auto mt-20 grid grid-cols-2 md:grid-cols-4 gap-4"
        >
          {stats.map(({ value, label, icon: Icon }) => (
            <motion.div
              key={label}
              variants={staggerItem}
              className="glass-card p-5 flex flex-col items-center gap-1 card-hover"
            >
              <Icon className="h-5 w-5 text-primary mb-1 opacity-80" />
              <p className="text-2xl font-bold text-gradient-subtle">{value}</p>
              <p className="text-xs text-muted-foreground text-center">{label}</p>
            </motion.div>
          ))}
        </motion.div>
      </motion.main>

      {/* Features Section */}
      <motion.section
        id="features"
        variants={staggerContainer}
        initial="initial"
        whileInView="animate"
        viewport={{ once: true, margin: '-80px' }}
        className="px-4 sm:px-6 lg:px-8 py-20 max-w-6xl mx-auto w-full"
      >
        <motion.div variants={staggerItem} className="text-center mb-14 space-y-3">
          <span className="badge-chip">Powerful Features</span>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold">
            Everything you need to{' '}
            <span className="text-gradient">hire better</span>
          </h2>
          <p className="text-muted-foreground max-w-xl mx-auto text-base">
            A complete HR toolkit built to help you discover and recruit top talent faster.
          </p>
        </motion.div>

        <motion.div variants={staggerContainer} className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {features.map((feature, index) => (
            <motion.div key={index} variants={staggerItem}>
              <Card className="h-full glass-card border-0 card-hover group">
                <CardContent className="p-7 space-y-4">
                  <div className={`w-12 h-12 rounded-2xl bg-gradient-to-br ${feature.color} flex items-center justify-center shadow-lg group-hover:scale-110 transition-smooth`}>
                    <feature.icon className="h-6 w-6 text-white" />
                  </div>
                  <div className="space-y-2">
                    <div className="flex items-center gap-2">
                      <h3 className="text-lg font-semibold">{feature.title}</h3>
                      <Badge variant="secondary" className="text-[10px] px-2 py-0.5 bg-primary/10 text-primary border-primary/20">
                        {feature.badge}
                      </Badge>
                    </div>
                    <p className="text-muted-foreground text-sm leading-relaxed">{feature.description}</p>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </motion.div>
      </motion.section>

      {/* Footer CTA */}
      <motion.section
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6 }}
        className="px-4 sm:px-6 py-20 max-w-3xl mx-auto w-full text-center"
      >
        <div className="gradient-border rounded-3xl p-10 space-y-6 glass-darker">
          <div className="space-y-3">
            <h2 className="text-3xl sm:text-4xl font-bold">Ready to transform your hiring?</h2>
            <p className="text-muted-foreground">
              Join forward-thinking HR teams scaling their recruitment with InterviewAI.
            </p>
          </div>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <AnimatedButton
              size="lg"
              className="bg-primary hover:bg-primary/95 text-white font-semibold rounded-xl px-8 shadow-md border border-transparent transition-all duration-200 active:scale-95"
              onClick={() => (window.location.href = isAuthenticated ? '/dashboard' : '/sign-up')}
            >
              Start Hiring — It&apos;s Free
              <ArrowRight className="ml-2 h-4 w-4" />
            </AnimatedButton>
          </div>
          <p className="text-xs text-muted-foreground">No credit card required · Cancel anytime</p>
        </div>
      </motion.section>

      {/* Footer */}
      <motion.footer
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.5 }}
        className="border-t border-white/[0.06] px-4 sm:px-6 py-8"
      >
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-primary to-accent flex items-center justify-center">
              <span className="text-white font-bold text-xs">AI</span>
            </div>
            <span className="font-semibold text-sm">InterviewAI</span>
          </div>
          <p className="text-xs text-muted-foreground">© 2025 InterviewAI. All rights reserved.</p>
        </div>
      </motion.footer>
    </div>
  );
}
