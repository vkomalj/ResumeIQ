'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { motion } from 'framer-motion';
import { signUpSchema, type SignUpInput } from '@/lib/schemas';
import { useAuthStore } from '@/lib/stores/authStore';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { toast } from 'sonner';
import Link from 'next/link';
import { staggerContainer, staggerItem } from '@/lib/animations';
import {
  Eye,
  EyeOff,
  Mail,
  Lock,
  User,
  ArrowRight,
  Loader2,
  AlertCircle,
  CheckCircle2,
} from 'lucide-react';

interface SignUpFormProps {
  onSuccess?: () => void;
}

export function SignUpForm({ onSuccess }: SignUpFormProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  const router = useRouter();
  const { signUp } = useAuthStore();

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<SignUpInput>({
    resolver: zodResolver(signUpSchema),
    defaultValues: {
      role: 'employee',
    },
  });

  const passwordVal = watch('password', '');
  const hasMinLength = passwordVal.length >= 8;
  const hasUpperCase = /[A-Z]/.test(passwordVal);
  const hasNumber = /[0-9]/.test(passwordVal);

  const onSubmit = async (data: SignUpInput) => {
    setIsLoading(true);
    try {
      await signUp(data.name, data.email, data.password);

      toast.success('Account created! Welcome aboard 🎉');

      onSuccess?.();
      router.push('/dashboard');
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : 'Signup failed'
      );
    } finally {
      setIsLoading(false);
    }
  };

  const FieldError = ({ message }: { message?: string }) =>
    message ? (
      <p className="text-destructive text-[11px] font-medium flex items-center gap-1.5 mt-1">
        <AlertCircle className="h-3 w-3 shrink-0" />
        {message}
      </p>
    ) : null;

  return (
    <motion.form
      onSubmit={handleSubmit(onSubmit)}
      variants={staggerContainer}
      initial="initial"
      animate="animate"
      className="space-y-5"
    >
     

      {/* Full Name */}
      <motion.div variants={staggerItem} className="space-y-2">
        <Label htmlFor="name">Full Name</Label>
        <div className="relative">
          <User className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            id="name"
            placeholder="Jane Smith"
            className={`pl-10 ${errors.name ? 'border-destructive' : ''}`}
            {...register('name')}
          />
        </div>
        <FieldError message={errors.name?.message} />
      </motion.div>

      {/* Email */}
      <motion.div variants={staggerItem} className="space-y-2">
        <Label htmlFor="email">Work Email</Label>
        <div className="relative">
          <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            id="email"
            type="email"
            placeholder="jane@company.com"
            className={`pl-10 ${errors.email ? 'border-destructive' : ''}`}
            {...register('email')}
          />
        </div>
        <FieldError message={errors.email?.message} />
      </motion.div>

      {/* Password */}
      <motion.div variants={staggerItem} className="space-y-2">
        <Label htmlFor="password">Password</Label>
        <div className="relative">
          <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            id="password"
            type={showPassword ? 'text' : 'password'}
            placeholder="Create a strong password"
            className={`pl-10 pr-11 ${errors.password ? 'border-destructive' : ''}`}
            {...register('password')}
          />
          <button
            type="button"
            onClick={() => setShowPassword((v) => !v)}
            className="absolute right-3.5 top-1/2 -translate-y-1/2"
          >
            {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
          </button>
        </div>
        <FieldError message={errors.password?.message} />

        {passwordVal && (
          <div className="flex gap-4 flex-wrap text-xs">
            <span>{hasMinLength ? '✔' : '✖'} 8+ chars</span>
            <span>{hasUpperCase ? '✔' : '✖'} Uppercase</span>
            <span>{hasNumber ? '✔' : '✖'} Number</span>
          </div>
        )}
      </motion.div>

      {/* Confirm Password */}
      <motion.div variants={staggerItem} className="space-y-2">
        <Label htmlFor="confirmPassword">Confirm Password</Label>
        <Input
          id="confirmPassword"
          type={showConfirm ? 'text' : 'password'}
          placeholder="Repeat your password"
          className={errors.confirmPassword ? 'border-destructive' : ''}
          {...register('confirmPassword')}
        />
        <FieldError message={errors.confirmPassword?.message} />
      </motion.div>

    

      {/* Submit */}
      <Button 
        type="submit" 
        disabled={isLoading} 
        className="w-full h-11 rounded-xl bg-primary hover:bg-primary/95 font-semibold text-sm transition-all duration-200 active:scale-95 shadow-md border border-transparent"
      >
        {isLoading ? (
          <>
            <Loader2 className="animate-spin mr-2 h-4 w-4" /> Creating account...
          </>
        ) : (
          <>
            Create Account <ArrowRight className="ml-2 h-4 w-4" />
          </>
        )}
      </Button>

      {/* Sign in */}
      <p className="text-center text-sm">
        Already have an account?{' '}
        <Link href="/sign-in" className="text-primary">
          Sign in
        </Link>
      </p>
    </motion.form>
  );
}