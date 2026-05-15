import React, { useState, useEffect, useRef } from 'react';
import { Send, User, Bot, Sparkles, History, MessageSquare } from 'lucide-react';

interface Message {
  role: 'user' | 'model';
  content: string;
  timestamp: string;
}

interface ForensicDiscourseProps {
  ruleId: string;
  discourse: Message[];
  onSendMessage: (message: string) => void;
  isProcessing?: boolean;
}

export function ForensicDiscourse({ ruleId, discourse, onSendMessage, isProcessing }: ForensicDiscourseProps) {
  const [input, setInput] = useState('');
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [discourse]);

  const handleSend = () => {
    if (input.trim()) {
      onSendMessage(input);
      setInput('');
    }
  };

  return (
    <div className="flex flex-col h-full bg-[#121212] border-l border-[#222] overflow-hidden">
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-3 border-b border-[#222] bg-[#1a1a1a]">
        <div className="flex items-center gap-2">
          <MessageSquare size={16} className="text-blue-400" />
          <span className="text-[11px] font-bold text-gray-400 uppercase tracking-widest">Forensic Discourse</span>
        </div>
        <div className="flex items-center gap-2 px-2 py-1 bg-blue-900/20 border border-blue-800/30 rounded-full">
          <Sparkles size={10} className="text-blue-400" />
          <span className="text-[9px] font-bold text-blue-300 uppercase">Focus: {ruleId}</span>
        </div>
      </div>

      {/* Message List */}
      <div ref={scrollRef} className="flex-1 overflow-y-auto p-4 space-y-6">
        {discourse.length === 0 ? (
          <div className="h-full flex flex-col items-center justify-center text-center p-8 opacity-40">
            <Bot size={48} strokeWidth={1} className="mb-4" />
            <p className="text-sm font-medium">No discourse history for this rule.</p>
            <p className="text-xs mt-1">Run a validation or ask a question to start the AI audit trail.</p>
          </div>
        ) : (
          discourse.map((msg, i) => (
            <div key={i} className={`flex gap-3 ${msg.role === 'user' ? 'flex-row-reverse' : ''}`}>
              <div className={`w-8 h-8 rounded-lg flex items-center justify-center flex-none ${
                msg.role === 'model' ? 'bg-gradient-to-br from-blue-600 to-purple-600' : 'bg-[#2a2a2a] border border-[#333]'
              }`}>
                {msg.role === 'model' ? <Bot size={16} className="text-white" /> : <User size={16} className="text-gray-400" />}
              </div>
              <div className={`flex flex-col max-w-[85%] ${msg.role === 'user' ? 'items-end' : ''}`}>
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-[10px] font-bold text-gray-500 uppercase">
                    {msg.role === 'model' ? 'Regulatory Auditor (AI)' : 'Consultant'}
                  </span>
                  <span className="text-[9px] text-gray-600 font-mono">{new Date(msg.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                </div>
                <div className={`p-3 rounded-xl text-sm leading-relaxed ${
                  msg.role === 'model' 
                    ? 'bg-[#1a1a1a] border border-[#222] text-gray-300 shadow-xl' 
                    : 'bg-blue-600/10 border border-blue-500/20 text-blue-100 shadow-lg'
                }`}>
                  <div className="whitespace-pre-wrap">{msg.content}</div>
                </div>
              </div>
            </div>
          ))
        )}
        {isProcessing && (
          <div className="flex gap-3 animate-pulse">
            <div className="w-8 h-8 rounded-lg bg-blue-600/20 flex items-center justify-center">
              <Bot size={16} className="text-blue-400" />
            </div>
            <div className="flex flex-col gap-1">
               <div className="h-3 w-24 bg-[#222] rounded"></div>
               <div className="h-12 w-64 bg-[#1a1a1a] border border-[#222] rounded-xl"></div>
            </div>
          </div>
        )}
      </div>

      {/* Input Area */}
      <div className="p-4 border-t border-[#222] bg-[#1a1a1a]">
        <div className="relative group">
          <textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault();
                handleSend();
              }
            }}
            placeholder="Ask the auditor about this rule..."
            className="w-full bg-[#121212] border border-[#333] group-focus-within:border-blue-500/50 rounded-xl py-3 pl-4 pr-12 text-sm text-gray-200 placeholder-gray-600 outline-none resize-none transition-all"
            rows={2}
          />
          <button
            onClick={handleSend}
            disabled={!input.trim() || isProcessing}
            className="absolute right-2 bottom-2 p-2 bg-blue-600 hover:bg-blue-500 text-white rounded-lg transition-colors disabled:opacity-30 disabled:bg-[#333]"
          >
            <Send size={18} />
          </button>
        </div>
        <div className="mt-2 flex items-center justify-between">
          <div className="flex items-center gap-1 text-[9px] text-gray-600 font-bold uppercase tracking-wider">
            <History size={10} />
            Auto-persisting to workpapers
          </div>
          <span className="text-[9px] text-gray-700">Enter to send, Shift+Enter for new line</span>
        </div>
      </div>
    </div>
  );
}
