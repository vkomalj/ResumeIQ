'use client';

import { motion } from 'framer-motion';
import { useAuthStore } from '@/lib/stores/authStore';
import { useRouter } from 'next/navigation';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { LogOut, Settings, User, ChevronDown, LayoutDashboard, Home } from 'lucide-react';
import Link from 'next/link';

import { useState } from 'react';
import { ProfileSettingsModal } from './ProfileSettingsModal';

export function Header() {
  const { user, logout } = useAuthStore();
  const router = useRouter();
  const [isProfileModalOpen, setIsProfileModalOpen] = useState(false);
  const [profileModalTab, setProfileModalTab] = useState<'profile' | 'settings'>('profile');

  const handleLogout = () => {
    logout();
    router.push('/sign-in');
  };

  const initials = user?.name
    ? user.name.split(' ').map((n: string) => n[0]).join('').slice(0, 2).toUpperCase()
    : 'U';

  return (
    <motion.header
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="sticky top-0 z-50 bg-white border-b border-border shadow-[0_1px_2px_0_rgba(60,64,67,0.1)]"
    >
      <div className="max-w-[102rem] mx-auto px-4 sm:px-6 lg:px-10 h-16 flex items-center justify-between gap-4">
        <Link href="/" className="flex items-center gap-2.5 shrink-0 group">
          <motion.div
            whileHover={{ scale: 1.06 }}
            transition={{ duration: 0.2 }}
            className="w-9 h-9 rounded-xl bg-primary flex items-center justify-center shadow-sm shadow-primary/20"
          >
            <span className="text-white font-black text-xs tracking-tighter">AI</span>
          </motion.div>
          <div className="hidden sm:block">
            <p className="text-sm font-bold text-foreground leading-none tracking-tight">InterviewAI</p>
            <p className="text-[10px] text-muted-foreground font-bold leading-none mt-1 uppercase tracking-wider">HR Platform</p>
          </div>
        </Link>

        {user ? (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="ghost"
                className="group flex items-center gap-2.5 h-auto py-1.5 px-3 hover:bg-primary/5 rounded-xl border border-transparent hover:border-primary/10 transition-smooth"
              >
                <Avatar className="h-8 w-8 shrink-0 ring-2 ring-white">
                  <AvatarFallback className="bg-primary text-white text-xs font-bold shadow-inner">
                    {initials}
                  </AvatarFallback>
                </Avatar>
                <div className="hidden sm:block text-left">
                  <p className="text-sm font-semibold leading-none">{user.name}</p>
                  <p className="text-[11px] text-muted-foreground leading-none mt-0.5 truncate max-w-[120px]">{user.email}</p>
                </div>
                <ChevronDown className="h-3.5 w-3.5 text-muted-foreground shrink-0" />
              </Button>
            </DropdownMenuTrigger>

            <DropdownMenuContent align="end" className="w-56 rounded-2xl shadow-[0_10px_40px_rgba(0,0,0,0.1)] border border-border bg-white p-1.5 z-[100] animate-in fade-in-0 mt-2">
              <DropdownMenuLabel className="px-3 py-2">
                <p className="text-sm font-semibold">{user.name}</p>
                <p className="text-xs text-muted-foreground">{user.email}</p>
              </DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem 
                onClick={() => router.push('/dashboard')}
                className="cursor-pointer gap-2.5 text-sm rounded-xl px-3 py-2.5 hover:bg-muted/60 font-bold text-primary"
              >
                <LayoutDashboard className="h-4 w-4" /> Dashboard
              </DropdownMenuItem>
              <DropdownMenuItem 
                onClick={() => router.push('/')}
                className="cursor-pointer gap-2.5 text-sm rounded-xl px-3 py-2.5 hover:bg-muted/60 font-medium"
              >
                <Home className="h-4 w-4 text-muted-foreground" /> Main Page
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem 
                onClick={() => {
                  setProfileModalTab('profile');
                  setIsProfileModalOpen(true);
                }}
                className="cursor-pointer gap-2.5 text-sm rounded-xl px-3 py-2.5 hover:bg-muted/60"
              >
                <User className="h-4 w-4 text-muted-foreground" /> Profile
              </DropdownMenuItem>
              <DropdownMenuItem 
                onClick={() => {
                  setProfileModalTab('settings');
                  setIsProfileModalOpen(true);
                }}
                className="cursor-pointer gap-2.5 text-sm rounded-xl px-3 py-2.5 hover:bg-muted/60"
              >
                <Settings className="h-4 w-4 text-muted-foreground" /> Settings
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem
                onClick={handleLogout}
                className="cursor-pointer gap-2.5 text-sm text-destructive focus:text-destructive rounded-xl px-3 py-2.5 hover:bg-destructive/10"
              >
                <LogOut className="h-4 w-4" /> Sign Out
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        ) : (
          <div className="flex items-center gap-2">
            <Link href="/sign-in">
              <Button variant="ghost" size="sm" className="rounded-xl text-sm font-semibold">
                Sign In
              </Button>
            </Link>
          </div>
        )}
      </div>
      <ProfileSettingsModal 
        isOpen={isProfileModalOpen} 
        onOpenChange={setIsProfileModalOpen} 
        defaultTab={profileModalTab} 
      />
    </motion.header>
  );
}
