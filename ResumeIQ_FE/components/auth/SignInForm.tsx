'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { motion } from 'framer-motion';
import { signInSchema, type SignInInput } from '@/lib/schemas';
import { useAuthStore } from '@/lib/stores/authStore';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { toast } from 'sonner';
import Link from 'next/link';
import { staggerContainer, staggerItem } from '@/lib/animations';
import { Eye, EyeOff, Mail, Lock, ArrowRight, Loader2, AlertCircle } from 'lucide-react';

interface SignInFormProps {
  onSuccess?: () => void;
}

export function SignInForm({ onSuccess }: SignInFormProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const router = useRouter();
  const { signIn } = useAuthStore();
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<SignInInput>({
    resolver: zodResolver(signInSchema),
  });

  const onSubmit = async (data: SignInInput) => {
    setIsLoading(true);
    try {
      await signIn(data.email, data.password);
      const user = useAuthStore.getState().user;
      toast.success(`Welcome, ${user?.name || 'User'}!`);
      onSuccess?.();
      router.push('/dashboard');
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'Invalid email or password. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <motion.form
      onSubmit={handleSubmit(onSubmit)}
      variants={staggerContainer}
      initial="initial"
      animate="animate"
      className="space-y-5"
    >
      {/* Email */}
      <motion.div variants={staggerItem} className="space-y-2">
        <Label htmlFor="email" className="text-sm font-semibold text-foreground">
          Email Address
        </Label>
        <div className="relative">
          <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground pointer-events-none" />
          <Input
            id="email"
            type="email"
            placeholder="you@company.com"
            className={`pl-10 h-11 rounded-xl border-border bg-white focus:border-primary focus:ring-2 focus:ring-primary/15 transition-all ${errors.email ? 'border-destructive focus:border-destructive focus:ring-destructive/15' : ''}`}
            {...register('email')}
          />
        </div>
        {errors.email && (
          <p className="text-destructive text-[11px] font-medium flex items-center gap-1.5">
            <AlertCircle className="h-3 w-3 shrink-0" />
            {errors.email.message}
          </p>
        )}
      </motion.div>

      {/* Password */}
      <motion.div variants={staggerItem} className="space-y-2">
        <div className="flex items-center justify-between">
          <Label htmlFor="password" className="text-sm font-semibold text-foreground">
            Password
          </Label>
        </div>
        <div className="relative">
          <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground pointer-events-none" />
          <Input
            id="password"
            type={showPassword ? 'text' : 'password'}
            placeholder="Enter your password"
            className={`pl-10 pr-11 h-11 rounded-xl border-border bg-white focus:border-primary focus:ring-2 focus:ring-primary/15 transition-all ${errors.password ? 'border-destructive focus:border-destructive focus:ring-destructive/15' : ''}`}
            {...register('password')}
          />
          <button
            type="button"
            onClick={() => setShowPassword((v) => !v)}
            className="absolute right-3.5 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-smooth p-0.5 rounded"
            aria-label={showPassword ? 'Hide password' : 'Show password'}
          >
            {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
          </button>
        </div>
        {errors.password && (
          <p className="text-destructive text-[11px] font-medium flex items-center gap-1.5">
            <AlertCircle className="h-3 w-3 shrink-0" />
            {errors.password.message}
          </p>
        )}
      </motion.div>


      {/* Submit */}
      <motion.div variants={staggerItem} className="pt-1">
        <Button
          type="submit"
          disabled={isLoading}
          className="w-full h-11 rounded-xl bg-primary hover:bg-primary/95 font-semibold text-sm transition-all duration-200 active:scale-95 shadow-md border border-transparent"
        >
          {isLoading ? (
            <><Loader2 className="mr-2 h-4 w-4 animate-spin" />Signing in...</>
          ) : (
            <>Sign In <ArrowRight className="ml-2 h-4 w-4" /></>
          )}
        </Button>
      </motion.div>

      {/* Divider */}
      <div className="relative flex items-center gap-3">
        <div className="flex-1 h-px bg-border" />
        <span className="text-xs text-muted-foreground font-medium px-1">or</span>
        <div className="flex-1 h-px bg-border" />
      </div>

      {/* Sign up link */}
      <motion.p variants={staggerItem} className="text-center text-sm text-muted-foreground">
        Don&apos;t have an account?{' '}
        <Link href="/sign-up" className="text-primary hover:underline font-semibold">
          Create one free →
        </Link>
      </motion.p>
    </motion.form>
  );
}
