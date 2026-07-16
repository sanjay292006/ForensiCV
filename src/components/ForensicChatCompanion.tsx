import { useState, useRef, useEffect } from "react";
import { Candidate } from "../types";
import { Send, Bot, User, Loader2, Sparkles, AlertTriangle, ShieldCheck, CornerDownLeft } from "lucide-react";

interface Message {
  role: "user" | "model";
  content: string;
}

interface ForensicChatCompanionProps {
  candidate: Candidate;
}

export default function ForensicChatCompanion({ candidate }: ForensicChatCompanionProps) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  const chatEndRef = useRef<HTMLDivElement>(null);

  // Clear and initialize chat when candidate changes
  useEffect(() => {
    setMessages([
      {
        role: "model",
        content: `Greetings. I am your ForensiCV AI Forensic Auditor. I have loaded and grounded my knowledge base in the dossier for **${candidate.name}** (${candidate.jobTitle}).

Ask me any specific investigation question about their technical skills, timeline integrity, project validations, or potential AI generation patterns.`
      }
    ]);
    setError(null);
    setInput("");
  }, [candidate.id]);

  // Scroll to bottom when messages change
  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleSendMessage = async (textToSend: string) => {
    if (!textToSend.trim() || isLoading) return;

    const userMsg: Message = { role: "user", content: textToSend };
    const updatedMessages = [...messages, userMsg];
    
    setMessages(updatedMessages);
    setInput("");
    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch("/api/chat-companion", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          candidateName: candidate.name,
          resumeText: candidate.rawText || "",
          messages: updatedMessages
        })
      });

      if (!response.ok) {
        throw new Error("Chat server returned an error response.");
      }

      const data = await response.json();
      setMessages((prev) => [...prev, { role: "model", content: data.reply }]);
    } catch (err: any) {
      console.error(err);
      setError(err.message || "Failed to reach the forensic chat server.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleSuggestQuestion = (question: string) => {
    handleSendMessage(question);
  };

  const suggestionPrompts = [
    { label: "React Tenure Audit", text: "Are their React experience claims chronologically realistic?" },
    { label: "Overlap Investigation", text: "What are the exact dates and gaps of overlapping roles on their timeline?" },
    { label: "AI Writing Verification", text: "What specific indicators suggest this resume was written by an LLM?" },
    { label: "Key Skills Verification", text: "Do their listed projects actually backup their claimed advanced technical skills?" }
  ];

  return (
    <div className="bg-slate-950/70 backdrop-blur-md border border-amber-500/10 rounded-2xl p-6 shadow-2xl relative overflow-hidden flex flex-col h-[520px] transition duration-300 hover:border-amber-500/20 gold-glow-hover" id="chat-companion-component">
      <div className="absolute top-0 right-0 w-64 h-64 bg-amber-500/5 rounded-full blur-3xl pointer-events-none" />
      
      {/* Header */}
      <div className="flex items-center justify-between border-b border-slate-900 pb-4 mb-4">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-amber-500/10 rounded-lg border border-amber-500/20 text-amber-400">
            <Bot className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-sm font-bold font-display text-slate-100 flex items-center gap-1.5">
              Forensic Chat Companion
              <span className="animate-pulse flex h-2 w-2 relative">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-amber-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-amber-500"></span>
              </span>
            </h3>
            <p className="text-[11px] text-slate-400 mt-0.5">
              Grounded strictly in the resume facts and timeline of <span className="text-amber-400 font-semibold">{candidate.name}</span>
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <span className={`inline-flex items-center gap-1 px-2.5 py-0.5 text-[10px] font-mono font-medium rounded-full border ${
            candidate.verdict === "Genuine" 
              ? "bg-emerald-500/10 text-emerald-400 border-emerald-500/20" 
              : "bg-rose-500/10 text-rose-400 border-rose-500/20"
          }`}>
            {candidate.verdict === "Genuine" ? <ShieldCheck className="w-3 h-3" /> : <AlertTriangle className="w-3 h-3" />}
            {candidate.verdict}
          </span>
        </div>
      </div>

      {/* Suggestion Prompts */}
      {messages.length === 1 && (
        <div className="mb-4 bg-slate-950/60 border border-slate-900 rounded-xl p-3" id="quick-prompts-wrapper">
          <p className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider mb-2 flex items-center gap-1.5">
            <Sparkles className="w-3.5 h-3.5 text-amber-400" />
            Quick Investigative Prompts
          </p>
          <div className="grid grid-cols-2 gap-2">
            {suggestionPrompts.map((prompt, idx) => (
              <button
                key={idx}
                onClick={() => handleSuggestQuestion(prompt.text)}
                className="text-left text-[11px] bg-slate-900 hover:bg-slate-850 border border-slate-850 hover:border-amber-500/25 p-2 rounded-lg text-slate-300 transition duration-150 cursor-pointer text-ellipsis overflow-hidden whitespace-nowrap"
              >
                {prompt.label}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Messages area */}
      <div className="flex-1 overflow-y-auto mb-4 space-y-4 pr-1 scrollbar-thin scrollbar-thumb-slate-800 scrollbar-track-transparent">
        {messages.map((msg, idx) => (
          <div
            key={idx}
            className={`flex gap-3 max-w-[85%] ${
              msg.role === "user" ? "ml-auto flex-row-reverse" : "mr-auto"
            }`}
          >
            <div className={`p-2 rounded-lg border self-start shrink-0 ${
              msg.role === "user" 
                ? "bg-slate-900 border-slate-800 text-slate-400" 
                : "bg-amber-500/10 border-amber-500/20 text-amber-400"
            }`}>
              {msg.role === "user" ? <User className="w-4 h-4" /> : <Bot className="w-4 h-4" />}
            </div>

            <div className={`p-3.5 rounded-xl text-xs leading-relaxed ${
              msg.role === "user"
                ? "bg-gradient-to-br from-amber-500/10 to-yellow-500/5 border border-amber-500/15 text-amber-300 rounded-tr-none"
                : "bg-slate-950/60 border border-slate-900 text-slate-200 rounded-tl-none whitespace-pre-line"
            }`}>
              {msg.content}
            </div>
          </div>
        ))}
        {isLoading && (
          <div className="flex gap-3 max-w-[85%] mr-auto items-center">
            <div className="p-2 bg-amber-500/10 border border-amber-500/20 text-amber-400 rounded-lg">
              <Bot className="w-4 h-4" />
            </div>
            <div className="p-3.5 bg-slate-950/60 border border-slate-900 rounded-xl rounded-tl-none text-xs text-slate-400 flex items-center gap-2">
              <Loader2 className="w-3.5 h-3.5 animate-spin text-amber-400" />
              <span>Analyzing resume dossier credentials...</span>
            </div>
          </div>
        )}
        {error && (
          <div className="p-3 bg-rose-500/10 border border-rose-500/20 rounded-xl text-xs text-rose-400 flex items-center gap-2">
            <AlertTriangle className="w-4.5 h-4.5 flex-shrink-0" />
            <div>
              <span className="font-semibold">Audit connection error:</span> {error}
            </div>
          </div>
        )}
        <div ref={chatEndRef} />
      </div>

      {/* Input section */}
      <form
        onSubmit={(e) => {
          e.preventDefault();
          handleSendMessage(input);
        }}
        className="flex items-center gap-2 border-t border-slate-900 pt-3"
      >
        <div className="relative flex-1">
          <input
            type="text"
            placeholder="Type your forensic audit query here..."
            value={input}
            onChange={(e) => setInput(e.target.value)}
            disabled={isLoading}
            className="w-full bg-slate-950 border border-slate-900 focus:border-amber-500 focus:ring-1 focus:ring-amber-500/20 rounded-xl py-3 pl-4 pr-12 text-xs text-slate-200 focus:outline-none placeholder-slate-600 transition"
            id="chat-input-field"
          />
          <span className="absolute right-3.5 top-3 text-[10px] text-slate-600 font-mono font-bold uppercase hidden md:flex items-center gap-1">
            Enter <CornerDownLeft className="w-2.5 h-2.5" />
          </span>
        </div>
        <button
          type="submit"
          disabled={!input.trim() || isLoading}
          className="p-3 bg-gradient-to-r from-amber-500 to-yellow-500 hover:from-amber-400 hover:to-yellow-300 text-slate-950 rounded-xl shadow-lg hover:shadow-amber-500/15 active:scale-[0.97] transition duration-200 disabled:opacity-50 disabled:scale-100 cursor-pointer shrink-0"
          id="chat-submit-btn"
        >
          <Send className="w-4 h-4 text-slate-950" />
        </button>
      </form>
    </div>
  );
}
