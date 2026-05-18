'use client';

import { useState, useEffect } from 'react';
import { useAuthStore } from '@/lib/stores/authStore';
import { useChatStore } from '@/lib/stores/chatStore';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  User as UserIcon, 
  Settings as SettingsIcon, 
  Bell, 
  Shield, 
  Trash2, 
  CheckCircle,
  Loader2,
  Mail,
  UserCheck
} from 'lucide-react';
import { toast } from 'sonner';

interface ProfileSettingsModalProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  defaultTab?: 'profile' | 'settings';
}

export function ProfileSettingsModal({ isOpen, onOpenChange, defaultTab = 'profile' }: ProfileSettingsModalProps) {
  const { user, setUser } = useAuthStore();
  const { clearMessages } = useChatStore();
  
  // Profile form state
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [isSaving, setIsSaving] = useState(false);

  // Settings preferences state
  const [emailNotif, setEmailNotif] = useState(true);
  const [autoMatch, setAutoMatch] = useState(true);

  // Synchronize form inputs with current authenticated user
  useEffect(() => {
    if (user) {
      setName(user.name || '');
      setEmail(user.email || '');
    }
  }, [user, isOpen]);

  if (!user) return null;

  const initials = name
    ? name.split(' ').map((n: string) => n[0]).join('').slice(0, 2).toUpperCase()
    : 'U';

  const handleSaveProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !email.trim()) {
      toast.error('Name and Email cannot be empty');
      return;
    }

    setIsSaving(true);
    
    // Simulate minor network latency for professional feel
    await new Promise((resolve) => setTimeout(resolve, 800));
    
    // Update local store state
    setUser({
      ...user,
      name: name.trim(),
      email: email.trim(),
    });
    
    setIsSaving(false);
    toast.success('Profile details updated successfully');
  };

  const handleClearHistory = () => {
    if (confirm('Are you sure you want to clear your chatbot search history? This action is permanent.')) {
      clearMessages();
      localStorage.removeItem('resumeiq_chat_history');
      toast.success('Chat history cleared successfully');
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-2xl w-full max-h-[85vh] overflow-y-auto rounded-3xl p-6 sm:p-8 bg-white border border-border shadow-2xl animate-in fade-in-0 zoom-in-95">
        
        <DialogHeader className="border-b border-border pb-4">
          <DialogTitle className="text-2xl font-bold text-foreground">Account & Settings</DialogTitle>
          <DialogDescription className="text-xs text-muted-foreground font-semibold mt-1">
            Manage your administrator details and system preferences.
          </DialogDescription>
        </DialogHeader>

        <Tabs defaultValue={defaultTab} className="w-full mt-6">
          <TabsList className="bg-[#f8f9fa] p-1 rounded-2xl h-12 border border-border shadow-sm w-full grid grid-cols-2 mb-6">
            <TabsTrigger 
              value="profile"
              className="rounded-xl gap-2 text-xs sm:text-sm font-bold px-4 data-[state=active]:bg-white data-[state=active]:shadow-sm data-[state=active]:text-primary transition-all duration-300"
            >
              <UserIcon className="h-4 w-4" />
              Profile Details
            </TabsTrigger>
            <TabsTrigger 
              value="settings"
              className="rounded-xl gap-2 text-xs sm:text-sm font-bold px-4 data-[state=active]:bg-white data-[state=active]:shadow-sm data-[state=active]:text-primary transition-all duration-300"
            >
              <SettingsIcon className="h-4 w-4" />
              System Settings
            </TabsTrigger>
          </TabsList>

          {/* Profile Tab */}
          <TabsContent value="profile" className="outline-none">
            <form onSubmit={handleSaveProfile} className="space-y-6">
              
              {/* Profile Card Summary */}
              <div className="flex flex-col sm:flex-row items-center gap-5 p-5 bg-slate-50 border border-border rounded-2xl">
                <Avatar className="h-16 w-16 shadow-inner border-2 border-white ring-1 ring-border">
                  <AvatarFallback className="bg-primary text-white text-xl font-bold">
                    {initials}
                  </AvatarFallback>
                </Avatar>
                <div className="text-center sm:text-left space-y-1">
                  <h4 className="text-base font-bold text-foreground">{name || 'Your Name'}</h4>
                  <div className="flex flex-wrap justify-center sm:justify-start items-center gap-2 text-xs text-muted-foreground font-semibold">
                    <span className="flex items-center gap-1"><Mail className="h-3.5 w-3.5" /> {email}</span>
                    <span className="hidden sm:inline text-border">•</span>
                    <span className="flex items-center gap-1 text-primary"><Shield className="h-3.5 w-3.5" /> Platform Administrator</span>
                  </div>
                </div>
              </div>

              {/* Form Input fields */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-xs font-bold text-muted-foreground uppercase tracking-wide">Full Name</label>
                  <div className="relative">
                    <span className="absolute inset-y-0 left-0 flex items-center pl-3.5 pointer-events-none text-muted-foreground/60">
                      <UserCheck className="h-4 w-4" />
                    </span>
                    <input
                      type="text"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      placeholder="Enter your name"
                      className="w-full pl-10 pr-3.5 py-3 text-sm rounded-xl border border-border bg-white focus:outline-none focus:ring-2 focus:ring-primary/20 font-medium transition-all"
                      required
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-bold text-muted-foreground uppercase tracking-wide">Email Address</label>
                  <div className="relative">
                    <span className="absolute inset-y-0 left-0 flex items-center pl-3.5 pointer-events-none text-muted-foreground/60">
                      <Mail className="h-4 w-4" />
                    </span>
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="Enter your email"
                      className="w-full pl-10 pr-3.5 py-3 text-sm rounded-xl border border-border bg-white focus:outline-none focus:ring-2 focus:ring-primary/20 font-medium transition-all"
                      required
                    />
                  </div>
                </div>
              </div>

              <div className="pt-4 border-t border-border flex justify-end gap-3">
                <Button 
                  type="button" 
                  variant="outline" 
                  onClick={() => onOpenChange(false)} 
                  className="rounded-xl h-11 px-5 font-bold text-xs"
                >
                  Cancel
                </Button>
                <Button 
                  type="submit" 
                  disabled={isSaving}
                  className="rounded-xl h-11 px-6 font-bold text-xs bg-primary text-white hover:bg-primary/95 transition-all shadow-md active:scale-95"
                >
                  {isSaving ? (
                    <>
                      <Loader2 className="h-4 w-4 animate-spin mr-2" />
                      Saving...
                    </>
                  ) : (
                    'Save Changes'
                  )}
                </Button>
              </div>
            </form>
          </TabsContent>

          {/* Settings Tab */}
          <TabsContent value="settings" className="space-y-6 outline-none">
            
            {/* System Preferences Switches */}
            <div className="space-y-4">
              <div className="flex items-center justify-between p-4 bg-slate-50 rounded-2xl border border-border">
                <div className="flex gap-3">
                  <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center text-primary flex-shrink-0">
                    <Bell className="h-5 w-5" />
                  </div>
                  <div>
                    <h5 className="text-sm font-bold text-foreground">Email Notifications</h5>
                    <p className="text-[11px] text-muted-foreground mt-0.5 font-medium">Get notified automatically when high-score candidate matches are found.</p>
                  </div>
                </div>
                {/* Premium Custom iOS-Style Toggle Switch */}
                <button
                  type="button"
                  onClick={() => setEmailNotif(!emailNotif)}
                  className={`w-11 h-6 flex items-center rounded-full p-1 transition-colors duration-300 focus:outline-none flex-shrink-0 ${
                    emailNotif ? 'bg-primary' : 'bg-slate-300'
                  }`}
                >
                  <div
                    className={`bg-white w-4 h-4 rounded-full shadow-md transform transition-transform duration-300 ${
                      emailNotif ? 'translate-x-5' : 'translate-x-0'
                    }`}
                  />
                </button>
              </div>

              <div className="flex items-center justify-between p-4 bg-slate-50 rounded-2xl border border-border">
                <div className="flex gap-3">
                  <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center text-primary flex-shrink-0">
                    <CheckCircle className="h-5 w-5" />
                  </div>
                  <div>
                    <h5 className="text-sm font-bold text-foreground">Smart Auto-Matching</h5>
                    <p className="text-[11px] text-muted-foreground mt-0.5 font-medium">Automatically recalculate and update scores whenever candidate resumes are uploaded.</p>
                  </div>
                </div>
                {/* Premium Custom iOS-Style Toggle Switch */}
                <button
                  type="button"
                  onClick={() => setAutoMatch(!autoMatch)}
                  className={`w-11 h-6 flex items-center rounded-full p-1 transition-colors duration-300 focus:outline-none flex-shrink-0 ${
                    autoMatch ? 'bg-primary' : 'bg-slate-300'
                  }`}
                >
                  <div
                    className={`bg-white w-4 h-4 rounded-full shadow-md transform transition-transform duration-300 ${
                      autoMatch ? 'translate-x-5' : 'translate-x-0'
                    }`}
                  />
                </button>
              </div>
            </div>

            {/* Data Management (Renamed from Danger Zone for a clean, presentable feel) */}
            <div className="p-5 border border-border bg-slate-50/50 rounded-2xl space-y-4">
              <h5 className="text-xs font-black uppercase tracking-wider text-muted-foreground">Data Management</h5>
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 bg-white p-4 rounded-xl border border-border shadow-sm">
                <div>
                  <h6 className="text-sm font-bold text-foreground">Clear Chatbot History</h6>
                  <p className="text-[11px] text-muted-foreground mt-0.5 font-medium">Delete cached local chatbot queries and candidate search lists to start fresh.</p>
                </div>
                <Button 
                  type="button"
                  onClick={handleClearHistory}
                  variant="outline"
                  className="rounded-xl h-10 text-xs px-4 gap-2 border-red-200 text-red-600 hover:bg-red-50 font-bold shrink-0 shadow-sm"
                >
                  <Trash2 className="h-4 w-4" /> Clear History
                </Button>
              </div>
            </div>

            <div className="pt-4 border-t border-border flex justify-end">
              <Button 
                onClick={() => onOpenChange(false)} 
                className="rounded-xl h-11 px-6 font-bold text-xs bg-primary text-white hover:bg-primary/95 transition-all shadow-md active:scale-95"
              >
                Close Settings
              </Button>
            </div>
          </TabsContent>
        </Tabs>

      </DialogContent>
    </Dialog>
  );
}
