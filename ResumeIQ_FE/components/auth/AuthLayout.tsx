'use client';

import { motion } from 'framer-motion';
import { slideInUp } from '@/lib/animations';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { ArrowLeft } from 'lucide-react';
import Link from 'next/link';
import React from 'react';

interface AuthLayoutProps {
  children: React.ReactNode;
  title: string;
  subtitle?: string;
}

export function AuthLayout({ children, title, subtitle }: AuthLayoutProps) {
  return (
    <div className="min-h-screen flex flex-col hero-bg relative overflow-hidden">
      {/* Background orbs */}
      <div className="pointer-events-none absolute inset-0 -z-10 overflow-hidden">
        <div className="absolute -top-32 -left-32 w-[500px] h-[500px] rounded-full bg-primary/8 blur-[120px]" />
        <div className="absolute bottom-0 right-0 w-[400px] h-[400px] rounded-full bg-secondary/6 blur-[100px]" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[300px] h-[300px] rounded-full bg-accent/4 blur-[90px]" />
      </div>

      {/* Top navigation bar */}
      <header className="sticky top-0 z-50 glass border-b border-black/[0.06]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-14 flex items-center justify-between">
          {/* Back to Home */}
          <Link
            href="/"
            className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-smooth group"
          >
            <div className="w-7 h-7 rounded-lg border border-border flex items-center justify-center group-hover:border-primary/40 group-hover:bg-primary/5 transition-smooth">
              <ArrowLeft className="h-3.5 w-3.5" />
            </div>
            <span className="hidden sm:inline">Back to Home</span>
          </Link>

          {/* Logo (center on mobile, left on desktop) */}
          <Link href="/" className="flex items-center gap-2 group">
            <motion.div
              whileHover={{ scale: 1.06 }}
              className="w-8 h-8 rounded-xl bg-gradient-to-br from-primary to-secondary flex items-center justify-center shadow-md shadow-primary/20"
            >
              <span className="text-white font-bold text-xs">AI</span>
            </motion.div>
            <span className="text-sm font-bold text-gradient-subtle">InterviewAI</span>
          </Link>

          {/* Right spacer */}
          <div className="w-24" />
        </div>
      </header>

      {/* Form Card */}
      <motion.div
        variants={slideInUp}
        initial="initial"
        animate="animate"
        className="flex-1 flex items-center justify-center px-4 py-10"
      >
        <div className="w-full max-w-md space-y-6">
          <Card className="glass-card border-0 overflow-hidden shadow-2xl shadow-primary/5">
            <CardHeader className="pb-0 pt-8 px-8">
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: 0.1 }}
                className="text-center space-y-2"
              >
                <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-primary/10 to-secondary/10 border border-primary/10 flex items-center justify-center mx-auto mb-4">
                  <span className="text-primary font-black text-xl">AI</span>
                </div>
                <h1 className="text-2xl font-bold">{title}</h1>
                {subtitle && (
                  <p className="text-muted-foreground text-sm">{subtitle}</p>
                )}
              </motion.div>
            </CardHeader>

            <Separator className="mt-6 bg-border/60" />

            <CardContent className="px-8 py-8">
              {children}
            </CardContent>
          </Card>

          {/* Footer trust signals */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="text-center space-y-1 pb-6"
          >
            <p className="text-xs text-muted-foreground">
              🔒 Secure · Industry-standard encryption
            </p>
            <p className="text-xs text-muted-foreground/60">
              Trusted by 10,000+ professionals worldwide
            </p>
          </motion.div>
        </div>
      </motion.div>
    </div>
  );
}
