import { useState, useEffect } from "react";
import { Candidate } from "../types";
import { Sparkles, HelpCircle, AlertTriangle, ArrowRight, CheckCircle2, Loader2, RefreshCw, Clipboard, Check } from "lucide-react";

interface QuestionItem {
  question: string;
  targeting: string;
  expectedAnswer: string;
  warningSigns: string;
}

interface InterviewGeneratorProps {
  candidate: Candidate;
}

export default function InterviewGenerator({ candidate }: InterviewGeneratorProps) {
  const [questions, setQuestions] = useState<QuestionItem[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [copiedIndex, setCopiedIndex] = useState<number | null>(null);

  // Load questions if we have them cached per candidate, or reset
  useEffect(() => {
    setQuestions([]);
    setError(null);
  }, [candidate.id]);

  const generateQuestions = async () => {
    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch("/api/interview-questions", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          candidateName: candidate.name,
          resumeText: candidate.rawText || "",
          indicators: candidate.indicators,
          skills: candidate.skills
        })
      });

      if (!response.ok) {
        throw new Error("Failed to contact interview questions API.");
      }

      const data = await response.json();
      setQuestions(data.questions || []);
    } catch (err: any) {
      console.error(err);
      setError(err.message || "Failed to generate interview questions.");
    } finally {
      setIsLoading(false);
    }
  };

  const copyToClipboard = (text: string, idx: number) => {
    navigator.clipboard.writeText(text);
    setCopiedIndex(idx);
    setTimeout(() => setCopiedIndex(null), 2000);
  };

  return (
    <div className="bg-slate-950/70 backdrop-blur-md border border-amber-500/10 hover:border-amber-500/20 rounded-2xl p-6 shadow-2xl relative overflow-hidden transition duration-300 gold-glow-hover" id="interview-generator-panel">
      <div className="absolute top-0 right-0 w-64 h-64 bg-amber-500/5 rounded-full blur-3xl pointer-events-none" />

      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-900 pb-4 mb-5">
        <div className="flex items-start gap-3">
          <div className="p-2 bg-amber-500/10 rounded-lg border border-amber-500/20 text-amber-400">
            <HelpCircle className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-sm font-bold font-display text-slate-100 flex items-center gap-2">
              Bulletproof Technical Interview Question Generator
              <span className="px-2 py-0.5 text-[10px] font-mono bg-amber-500/10 border border-amber-500/20 text-amber-400 rounded-md">
                Forensic Screening Vetting
              </span>
            </h3>
            <p className="text-xs text-slate-400 mt-1 leading-relaxed">
              Based on the specific anomalies, experience claims, and skills profile of <span className="text-amber-400 font-semibold">{candidate.name}</span>, Gemini generates targeted technical trivia and scenario questions to expose the depth of their actual contributions.
            </p>
          </div>
        </div>

        {questions.length === 0 && !isLoading && (
          <button
            onClick={generateQuestions}
            className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-amber-500 via-amber-400 to-yellow-500 hover:from-amber-400 hover:to-yellow-300 text-slate-950 text-xs font-bold rounded-xl shadow-lg hover:shadow-amber-500/15 transition duration-200 shrink-0 cursor-pointer btn-premium-shine"
          >
            <Sparkles className="w-4 h-4 text-slate-950" />
            Generate Vetting Guide
          </button>
        )}
      </div>

      {isLoading && (
        <div className="flex flex-col items-center justify-center py-12 text-center space-y-4" id="questions-loading">
          <Loader2 className="w-8 h-8 text-amber-400 animate-spin" />
          <div>
            <p className="text-xs font-bold text-slate-200">Formulating Specialized Technical Vetting Guide...</p>
            <p className="text-[11px] text-slate-500 mt-1 max-w-sm">
              Cross-referencing timeline anomalies and exaggerations with real-world technical interview standards.
            </p>
          </div>
        </div>
      )}

      {error && (
        <div className="p-4 bg-rose-500/10 border border-rose-500/20 rounded-xl text-rose-400 text-xs leading-relaxed flex items-center gap-2" id="questions-error">
          <AlertTriangle className="w-5 h-5 flex-shrink-0" />
          <div>
            <span className="font-semibold">Generation Failed:</span> {error}
            <button 
              onClick={generateQuestions} 
              className="underline block mt-1 font-semibold hover:text-rose-300 cursor-pointer"
            >
              Retry generation
            </button>
          </div>
        </div>
      )}

      {questions.length === 0 && !isLoading && !error && (
        <div className="p-5 bg-slate-950/45 border border-slate-900 rounded-xl text-center" id="questions-intro">
          <p className="text-xs text-slate-400 leading-relaxed max-w-xl mx-auto">
            Ready to generate a tailored technical vetting guide for this candidate. Gemini will devise tough, specific scenario-based questions that verify their exact accomplishments.
          </p>
        </div>
      )}

      {questions.length > 0 && (
        <div className="space-y-6" id="questions-list">
          {questions.map((item, idx) => (
            <div key={idx} className="bg-slate-950/50 border border-slate-900 hover:border-amber-500/10 rounded-xl p-4.5 space-y-4.5 transition duration-200">
              {/* Question Header */}
              <div className="flex items-start justify-between gap-3">
                <div className="space-y-1">
                  <span className="inline-block px-2 py-0.5 text-[9px] font-mono bg-amber-500/10 border border-amber-500/20 text-amber-400 rounded-md">
                    Question #{idx + 1} • {item.targeting}
                  </span>
                  <h4 className="text-xs md:text-sm font-bold text-slate-100 leading-relaxed mt-1">
                    "{item.question}"
                  </h4>
                </div>
                <button
                  onClick={() => copyToClipboard(item.question, idx)}
                  className="p-1.5 bg-slate-900 hover:bg-slate-850 border border-slate-800 rounded-lg text-slate-400 hover:text-slate-200 transition cursor-pointer"
                  title="Copy question to clipboard"
                >
                  {copiedIndex === idx ? (
                    <Check className="w-3.5 h-3.5 text-emerald-400" />
                  ) : (
                    <Clipboard className="w-3.5 h-3.5" />
                  )}
                </button>
              </div>

              {/* Targets, Answers & Warnings Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 border-t border-slate-900/80 pt-3.5">
                {/* Expected answers */}
                <div className="space-y-1.5 p-3 bg-emerald-500/5 border border-emerald-500/10 rounded-xl">
                  <span className="text-[10px] font-mono font-bold text-emerald-400 uppercase tracking-wider flex items-center gap-1">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                    Expected Answers / Answer Guide
                  </span>
                  <p className="text-[11px] text-slate-300 leading-relaxed">
                    {item.expectedAnswer}
                  </p>
                </div>

                {/* Warning signs */}
                <div className="space-y-1.5 p-3 bg-rose-500/5 border border-rose-500/10 rounded-xl">
                  <span className="text-[10px] font-mono font-bold text-rose-400 uppercase tracking-wider flex items-center gap-1">
                    <AlertTriangle className="w-3.5 h-3.5 text-rose-400" />
                    Warning Signs / Red Flags to Probe
                  </span>
                  <p className="text-[11px] text-slate-300 leading-relaxed">
                    {item.warningSigns}
                  </p>
                </div>
              </div>
            </div>
          ))}

          {/* Regenerate footer */}
          <div className="flex items-center justify-between border-t border-slate-900 pt-4">
            <p className="text-[10px] text-slate-500 font-mono italic">
              Vetting guide successfully compiled using Gemini models. Grounded in listed forensic indicators.
            </p>
            <button
              onClick={generateQuestions}
              className="flex items-center gap-1.5 px-3 py-1 bg-slate-900 hover:bg-slate-850 border border-slate-850 text-slate-300 text-xs rounded-lg transition duration-200 cursor-pointer"
            >
              <RefreshCw className="w-3 h-3" />
              <span>Regenerate Guide</span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
