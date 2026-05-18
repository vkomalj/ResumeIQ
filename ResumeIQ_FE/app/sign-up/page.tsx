import { AuthLayout } from '@/components/auth/AuthLayout';
import { SignUpForm } from '@/components/auth/SignUpForm';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Sign Up | Interview Chatbot',
  description: 'Create your interview assistant account',
};

export default function SignUpPage() {
  return (
    <AuthLayout
      title="Get Started"
      subtitle="Create your account to begin your interview journey"
    >
      <SignUpForm />
    </AuthLayout>
  );
}
