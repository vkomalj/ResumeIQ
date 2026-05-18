'use client';

import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Send, Loader2, Mail, Phone, Briefcase, MessageCircle } from 'lucide-react';
import axios from 'axios';
import { Badge } from '@/components/ui/badge';
import { cn, API_BASE_URL } from '@/lib/utils';

interface ChatMessage {
  id: string;
  type: 'user' | 'assistant' | 'results';
  content: string;
  results?: SearchResult[];
  timestamp: Date;
}

interface SearchResult {
  name: string;
  email: string;
  phone: string;
  experience: number;
  job_role: string;
  predicted_salary:number
  skills: string[];
}

export function RecruitmentChatbot() {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Load chat history from localStorage on client-side mount
  useEffect(() => {
    const saved = localStorage.getItem('resumeiq_chat_history');
    if (saved) {
      try {
        const parsed = JSON.parse(saved) as ChatMessage[];
        
        // Rolling 24-hour retention: filter out messages older than 24 hours
        const now = Date.now();
        const oneDayAgo = now - 24 * 60 * 60 * 1000;
        const rollingHistory = parsed.filter((msg) => {
          if (msg.id === '1') return true; // Always keep standard greeting
          const msgTime = new Date(msg.timestamp).getTime();
          return msgTime > oneDayAgo;
        });

        if (rollingHistory.length === 0 || rollingHistory[0]?.id !== '1') {
          setMessages([
            {
              id: '1',
              type: 'assistant',
              content: 'Hello! 👋 I can help you search for candidates. Just ask for the role or skills you\'re looking for!',
              timestamp: new Date(),
            }
          ]);
        } else {
          setMessages(rollingHistory);
        }
      } catch (err) {
        console.error('Failed to parse chat history', err);
      }
    } else {
      setMessages([
        {
          id: '1',
          type: 'assistant',
          content: 'Hello! 👋 I can help you search for candidates. Just ask for the role or skills you\'re looking for!',
          timestamp: new Date(),
        },
      ]);
    }
  }, []);

  // Save chat history to localStorage whenever messages are updated
  useEffect(() => {
    if (messages.length > 0) {
      localStorage.setItem('resumeiq_chat_history', JSON.stringify(messages));
    }
  }, [messages]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

const handleSearch = async () => {
  if (!input.trim()) return;

  const query = input; // preserve before clearing

  // 1. Add user message
  const userMessage: ChatMessage = {
    id: crypto.randomUUID(),
    type: 'user',
    content: query,
    timestamp: new Date(),
  };

  setMessages((prev) => [...prev, userMessage]);
  setInput('');
  setIsLoading(true);

  try {
    const response = await axios.get(`${API_BASE_URL}/search`, {
      params: { query },
      headers: { accept: 'application/json' },
    });

    const results = response.data.results || [];

    // 2. Dedupe
    const uniqueResults = Array.from(
      new Map(results.map((item: SearchResult) => [item.email, item])).values()
    ) as SearchResult[];

    // 3. SINGLE state update (important)
    setMessages((prev) => {
      if (uniqueResults.length > 0) {
        const resultMessage: ChatMessage = {
          id: crypto.randomUUID(),
          type: 'results',
          content: `Found ${uniqueResults.length} candidate(s) matching "${query}"`,
          results: uniqueResults,
          timestamp: new Date(),
        };

        return [...prev, resultMessage];
      } else {
        const noResultMessage: ChatMessage = {
          id: crypto.randomUUID(),
          type: 'assistant',
          content:
            'No candidates found matching your search. Try a different search term or skill.',
          timestamp: new Date(),
        };

        return [...prev, noResultMessage];
      }
    });
  } catch (error) {
    console.error('Search failed:', error);

    setMessages((prev) => [
      ...prev,
      {
        id: crypto.randomUUID(),
        type: 'assistant',
        content: 'Unable to search candidates. Please try again.',
        timestamp: new Date(),
      },
    ]);
  } finally {
    setIsLoading(false);
  }
};

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && !e.shiftKey && !isLoading) {
      e.preventDefault();
      handleSearch();
    }
  };

  return (
    <div className="h-full flex flex-col bg-white border border-border shadow-sm rounded-2xl overflow-hidden transition-all duration-500">
      {/* Header */}
      <div className="bg-gradient-to-r from-primary/10 to-primary/5 border-b border-border px-5 py-4 flex items-center gap-2.5 flex-shrink-0">
        <div className="w-7 h-7 rounded-lg bg-primary/20 flex items-center justify-center">
          <MessageCircle className="h-4 w-4 text-primary" />
        </div>
        <div>
          <p className="text-sm font-bold text-foreground">Candidate Search</p>
          <p className="text-[10px] text-muted-foreground font-medium">AI-powered recruitment</p>
        </div>
      </div>

      {/* Messages Container */}
      <div className="flex-1 overflow-y-auto scrollbar-gutter-stable space-y-4 p-4 bg-[#fafbfc]">
        <AnimatePresence mode="popLayout">
          {messages.map((message) => (
            <motion.div
              key={message.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className={cn(
                'flex gap-3 w-full',
                message.type === 'user' ? 'justify-end' : 'justify-start'
              )}
            >
              {message.type !== 'user' && (
                <div className="w-6 h-6 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0 mt-1">
                  <MessageCircle className="h-3.5 w-3.5 text-primary" />
                </div>
              )}

              {message.type === 'user' ? (
                <div className="max-w-[85%] rounded-xl px-3.5 py-2.5 text-sm leading-relaxed bg-primary text-white font-medium">
                  {message.content}
                </div>
              ) : (
                <div className="flex-1 flex flex-col gap-2 max-w-[85%]">
                  <div className="rounded-xl px-3.5 py-2.5 text-sm leading-relaxed bg-white border border-border text-foreground font-medium text-muted-foreground w-fit">
                    {message.content}
                  </div>

                  {/* Inline results list if this is a results message */}
                  {message.type === 'results' && message.results && (
                    <div className="space-y-2.5 w-full">
                      {message.results.map((candidate, idx) => (
                        <motion.div
                          key={`${candidate.email}-${idx}`}
                          initial={{ opacity: 0, x: -10 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: idx * 0.05 }}
                          className="bg-white border border-primary/20 rounded-xl p-3 space-y-2 hover:shadow-md transition-all w-full"
                        >
                          {/* Name and Experience */}
                          <div className="flex items-start justify-between gap-2">
                            <div className="min-w-0 flex-1">
                              <h4 className="text-xs font-bold text-foreground truncate">
                                {candidate.name}
                              </h4>
                              <div className="flex items-center gap-1.5 mt-1">
                                <Briefcase className="h-3 w-3 text-primary flex-shrink-0" />
                                <p className="text-[10px] text-muted-foreground font-medium truncate">
                                  {candidate.job_role}
                                </p>
                              </div>
                            </div>
                            <Badge className="bg-primary/20 text-primary text-[10px] px-1.5 py-0 font-bold flex-shrink-0">
                              {candidate.experience}y exp
                            </Badge>
                          </div>

                          {/* Contact Info */}
                          <div className="space-y-1.5 pt-2 border-t border-border/40">
                            <a
                              href={`mailto:${candidate.email}`}
                              className="flex items-center gap-2 text-[10px] text-primary hover:underline font-semibold group"
                            >
                              <Mail className="h-3 w-3 text-primary group-hover:scale-110 transition-transform" />
                              <span className="truncate">{candidate.email}</span>
                            </a>
                            <a
                              href={`tel:${candidate.phone}`}
                              className="flex items-center gap-2 text-[10px] text-primary hover:underline font-semibold group"
                            >
                              <Phone className="h-3 w-3 text-primary group-hover:scale-110 transition-transform" />
                              <span className="truncate">{candidate.phone}</span>
                            </a>
                          </div>

                          {/* Skills Preview */}
                          {candidate.skills && candidate.skills.length > 0 && (
                            <div className="flex flex-wrap gap-1 pt-2">
                              {candidate.skills.slice(0, 3).map((skill) => (
                                <Badge
                                  key={skill}
                                  variant="secondary"
                                  className="bg-primary/10 text-primary text-[8px] px-1.5 py-0 font-bold"
                                >
                                  {skill}
                                </Badge>
                              ))}
                              {candidate.skills.length > 3 && (
                                <Badge
                                  variant="secondary"
                                  className="bg-muted text-muted-foreground text-[8px] px-1.5 py-0 font-bold"
                                >
                                  +{candidate.skills.length - 3}
                                </Badge>
                              )}
                            </div>
                          )}
                        </motion.div>
                      ))}
                    </div>
                  )}
                </div>
              )}
            </motion.div>
          ))}
        </AnimatePresence>

        {isLoading && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="flex gap-2 justify-start"
          >
            <div className="w-6 h-6 rounded-full bg-primary/10 flex items-center justify-center">
              <Loader2 className="h-3.5 w-3.5 text-primary animate-spin" />
            </div>
            <div className="bg-white border border-border rounded-xl px-3.5 py-2.5 flex items-center gap-2">
              <span className="text-xs font-medium text-muted-foreground">Searching candidates...</span>
            </div>
          </motion.div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Input */}
      <div className="border-t border-border px-4 py-3 flex-shrink-0 bg-white">
        <div className="flex gap-2 items-end">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Search: Senior Angular developer..."
            className="flex-1 px-3 py-2.5 rounded-lg border border-border bg-white focus:outline-none focus:ring-2 focus:ring-primary/50 text-xs font-medium placeholder:text-muted-foreground"
          />
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={handleSearch}
            disabled={isLoading || !input.trim()}
            className="w-9 h-9 rounded-lg bg-primary text-white flex items-center justify-center disabled:opacity-50 disabled:cursor-not-allowed hover:bg-primary/90 transition-all shadow-sm hover:shadow-md"
          >
            {isLoading ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <Send className="h-4 w-4" />
            )}
          </motion.button>
        </div>
      </div>
    </div>
  );
}
