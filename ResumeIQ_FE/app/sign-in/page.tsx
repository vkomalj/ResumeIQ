import { AuthLayout } from '@/components/auth/AuthLayout';
import { SignInForm } from '@/components/auth/SignInForm';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Sign In | Interview Chatbot',
  description: 'Sign in to your interview assistant account',
};

export default function SignInPage() {
  return (
    <AuthLayout
      title="Welcome Back"
      subtitle="Sign in to continue your interview preparation"
    >
      <SignInForm />
    </AuthLayout>
  );
}
