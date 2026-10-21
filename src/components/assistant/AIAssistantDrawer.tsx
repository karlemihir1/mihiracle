import React, { useState, useRef, useEffect } from 'react';
import { 
  Sparkles, 
  X, 
  Send, 
  Lightbulb, 
  Compass, 
  FileText, 
  RotateCcw,
  CheckCircle,
  ExternalLink
} from 'lucide-react';
import { useStore } from '../../lib/store';
import { askAIAssistant } from '../../services/api';

interface Message {
  id: string;
  sender: 'user' | 'assistant';
  text: string;
  timestamp: string;
  sourceUrl?: string;
  isDemo?: boolean;
}

export const AIAssistantDrawer: React.FC = () => {
  const { 
    isAIAssistantOpen, 
    setAIAssistantOpen, 
    activeContextItem, 
    setActiveContextItem 
  } = useStore();

  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    {
      id: 'msg-welcome',
      sender: 'assistant',
      text: "Hello! I am your Mihiracle Learning Companion. Ask me to simplify any concept, give real-world examples, or help you connect ideas across your library.",
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    }
  ]);

  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (isAIAssistantOpen) {
      messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages, isAIAssistantOpen]);

  if (!isAIAssistantOpen) return null;

  const quickPrompts = [
    "Explain this idea in simple language",
    "Give me a practical real-world example",
    "How can I apply this concept tomorrow?",
    "What are the main counterarguments?",
    "Summarize the key takeaway in 10 words",
  ];

  const handleSend = async (textToSend?: string) => {
    const query = (textToSend || input).trim();
    if (!query || isLoading) return;

    const userMsg: Message = {
      id: `usr-${Date.now()}`,
      sender: 'user',
      text: query,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    setMessages(prev => [...prev, userMsg]);
    setInput('');
    setIsLoading(true);

    try {
      const res = await askAIAssistant(query, {
        type: activeContextItem?.type,
        itemTitle: activeContextItem?.title,
        itemContent: activeContextItem?.content,
      });

      const assistantMsg: Message = {
        id: `ai-${Date.now()}`,
        sender: 'assistant',
        text: res.answer,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        isDemo: res.isDemo
      };

      setMessages(prev => [...prev, assistantMsg]);
    } catch {
      setMessages(prev => [
        ...prev,
        {
          id: `ai-err-${Date.now()}`,
          sender: 'assistant',
          text: "I ran into a temporary issue connecting to the AI service. Let's try breaking the question down or asking another query.",
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        }
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-end p-0 sm:p-4">
      {/* Backdrop */}
      <div 
        className="fixed inset-0 bg-black/40 backdrop-blur-xs transition-opacity duration-200"
        onClick={() => setAIAssistantOpen(false)}
        aria-hidden="true"
      />

      {/* Drawer Surface */}
      <aside 
        aria-label="AI Learning Assistant"
        className="relative w-full sm:w-[440px] h-[92vh] sm:h-[680px] bg-white dark:bg-dark-surface rounded-t-3xl sm:rounded-2xl shadow-2xl border-t sm:border border-brand-border dark:border-dark-border z-10 flex flex-col overflow-hidden animate-in slide-in-from-bottom sm:slide-in-from-right duration-300"
      >
        {/* Mobile handle */}
        <div className="sm:hidden w-12 h-1.5 bg-gray-300 dark:bg-gray-700 rounded-full mx-auto mt-3 mb-1 shrink-0" />

        {/* Header */}
        <div className="flex items-center justify-between px-5 py-3.5 border-b border-brand-border/60 dark:border-dark-border/60 shrink-0">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-brand-mint/40 dark:bg-brand-mint/20 flex items-center justify-center">
              <Sparkles className="w-4 h-4 text-emerald-700 dark:text-brand-mint" />
            </div>
            <div>
              <h3 className="font-bold text-sm text-brand-navy dark:text-white leading-tight">
                AI Learning Companion
              </h3>
              <p className="text-[11px] text-brand-muted dark:text-dark-muted">
                Context-aware microlearning tutor
              </p>
            </div>
          </div>

          <button
            onClick={() => setAIAssistantOpen(false)}
            className="p-2 text-brand-muted hover:text-brand-text dark:text-dark-muted rounded-full hover:bg-black/5 dark:hover:bg-white/5 transition-colors min-h-[44px] min-w-[44px] flex items-center justify-center cursor-pointer"
            aria-label="Close Assistant"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Active Context Banner */}
        {activeContextItem && (
          <div className="px-4 py-2 bg-brand-mint/15 dark:bg-brand-mint/10 border-b border-brand-mint/30 flex items-center justify-between text-xs text-brand-navy dark:text-brand-mint shrink-0">
            <div className="flex items-center gap-1.5 truncate pr-2">
              <FileText className="w-3.5 h-3.5 shrink-0" />
              <span className="font-semibold uppercase tracking-wider text-[10px]">Context:</span>
              <span className="truncate font-medium">{activeContextItem.title}</span>
            </div>
            <button
              onClick={() => setActiveContextItem(null)}
              className="text-[11px] underline hover:opacity-75 shrink-0 cursor-pointer min-h-[32px] flex items-center px-1"
            >
              Clear
            </button>
          </div>
        )}

        {/* Messages List */}
        <div className="flex-1 p-4 overflow-y-auto space-y-3.5 overscroll-contain">
          {messages.map((m) => (
            <div
              key={m.id}
              className={`flex flex-col ${m.sender === 'user' ? 'items-end' : 'items-start'}`}
            >
              <div
                className={`max-w-[88%] rounded-2xl px-4 py-3 text-sm leading-relaxed ${
                  m.sender === 'user'
                    ? 'bg-brand-navy text-white rounded-tr-none'
                    : 'bg-brand-bg dark:bg-dark-card text-brand-text dark:text-dark-text border border-brand-border/60 dark:border-dark-border/60 rounded-tl-none shadow-2xs'
                }`}
              >
                <p className="whitespace-pre-wrap">{m.text}</p>
              </div>
              <span className="text-[10px] text-brand-muted dark:text-dark-muted mt-1 px-1">
                {m.timestamp}
              </span>
            </div>
          ))}

          {isLoading && (
            <div className="flex items-center gap-2 text-xs text-brand-muted dark:text-dark-muted p-2">
              <Sparkles className="w-4 h-4 animate-spin text-brand-mint-dark" />
              <span>Thinking and grounding response...</span>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>

        {/* Quick Prompts Chips */}
        <div className="px-4 py-2 border-t border-brand-border/60 dark:border-dark-border/60 flex items-center gap-1.5 overflow-x-auto no-scrollbar shrink-0">
          {quickPrompts.map((prompt, idx) => (
            <button
              key={idx}
              onClick={() => handleSend(prompt)}
              className="px-2.5 py-1 rounded-full text-xs font-medium whitespace-nowrap bg-stone-100 hover:bg-stone-200 dark:bg-dark-card dark:hover:bg-dark-border text-brand-text dark:text-dark-text border border-brand-border/60 dark:border-dark-border/60 transition-all active:scale-95 cursor-pointer min-h-[32px]"
            >
              {prompt}
            </button>
          ))}
        </div>

        {/* Chat Input Bar */}
        <div className="p-3 border-t border-brand-border/60 dark:border-dark-border/60 bg-white dark:bg-dark-surface shrink-0">
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleSend();
            }}
            className="flex items-center gap-2"
          >
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Ask anything or request a breakdown..."
              className="flex-1 bg-brand-bg dark:bg-dark-card border border-brand-border/80 dark:border-dark-border/80 rounded-xl px-3.5 py-2.5 text-sm text-brand-text dark:text-dark-text placeholder:text-brand-muted/70 outline-none focus:border-brand-navy dark:focus:border-brand-mint min-h-[44px]"
            />
            <button
              type="submit"
              disabled={!input.trim() || isLoading}
              className="p-2.5 rounded-xl bg-brand-navy hover:bg-brand-navy-light dark:bg-brand-mint dark:text-brand-navy text-white disabled:opacity-40 transition-all min-h-[44px] min-w-[44px] flex items-center justify-center cursor-pointer shadow-xs"
              aria-label="Send query"
            >
              <Send className="w-4 h-4" />
            </button>
          </form>
        </div>
      </aside>
    </div>
  );
};
