import { useState } from "react";
import { Candidate } from "../types";
import { Sparkles, ArrowRight, ShieldCheck, AlertTriangle, HelpCircle, Trophy, RefreshCw, Loader2, Info } from "lucide-react";

interface ComparisonResult {
  comparisonSummary: string;
  integrityWinner: string;
  integrityRationale: string;
  skillsComparison: string;
  finalRecommendation: string;
}

interface CandidateComparisonProps {
  candidates: Candidate[];
}

export default function CandidateComparison({ candidates }: CandidateComparisonProps) {
  const [candidateId1, setCandidateId1] = useState<string>("");
  const [candidateId2, setCandidateId2] = useState<string>("");
  const [isComparing, setIsComparing] = useState(false);
  const [comparisonResult, setComparisonResult] = useState<ComparisonResult | null>(null);
  const [error, setError] = useState<string | null>(null);

  const selectedCandidate1 = candidates.find(c => c.id === candidateId1);
  const selectedCandidate2 = candidates.find(c => c.id === candidateId2);

  const handleCompare = async () => {
    if (!selectedCandidate1 || !selectedCandidate2) return;

    setIsComparing(true);
    setComparisonResult(null);
    setError(null);

    try {
      const response = await fetch("/api/compare", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          candidate1: selectedCandidate1,
          candidate2: selectedCandidate2
        })
      });

      if (!response.ok) {
        throw new Error("Failed to compile candidate comparison report.");
      }

      const result = await response.json();
      setComparisonResult(result);
    } catch (err: any) {
      console.error(err);
      setError(err.message || "Failed to contact comparison engine.");
    } finally {
      setIsComparing(false);
    }
  };

  const getVerdictBadge = (verdict: Candidate["verdict"]) => {
    switch (verdict) {
      case "Genuine":
        return "bg-emerald-500/10 text-emerald-400 border-emerald-500/20";
      case "Suspicious":
        return "bg-amber-500/10 text-amber-400 border-amber-500/20";
      case "Highly Exaggerated":
        return "bg-rose-500/10 text-rose-400 border-rose-500/20";
      default:
        return "bg-sky-500/10 text-sky-400 border-sky-500/20";
    }
  };

  return (
    <div className="space-y-6" id="candidate-comparison-desk">
      {/* Selection Panel */}
      <div className="bg-slate-950/70 backdrop-blur-md border border-amber-500/10 hover:border-amber-500/20 rounded-2xl p-6 shadow-2xl transition duration-300 gold-glow-hover" id="comparison-selector-panel">
        <div className="flex items-center gap-3 border-b border-slate-900 pb-4 mb-5">
          <div className="p-2 bg-amber-500/10 rounded-lg border border-amber-500/20 text-amber-400">
            <Trophy className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-lg font-bold font-display text-slate-100">Forensic Comparative Battle Desk</h2>
            <p className="text-xs text-slate-400 mt-0.5">
              Weigh two evaluated dossiers side-by-side to compare relative skills fit, chronological integrity, and credential risk scores.
            </p>
          </div>
        </div>

        {candidates.length < 2 ? (
          <div className="p-5 bg-amber-500/5 border border-amber-500/10 rounded-xl text-center" id="comparison-not-enough-candidates">
            <Info className="w-8 h-8 text-amber-400 mx-auto mb-2" />
            <p className="text-xs text-slate-300 font-semibold">Insufficient candidates evaluated</p>
            <p className="text-[11px] text-slate-500 mt-1 max-w-sm mx-auto">
              You must upload or load at least 2 candidate resumes in the Screening Desk before utilizing the Side-by-Side comparison module.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-7 gap-4 items-center">
            {/* Candidate 1 Select */}
            <div className="md:col-span-3 space-y-2">
              <label className="block text-[11px] font-mono font-semibold text-slate-400 uppercase tracking-wider">Candidate A</label>
              <select
                value={candidateId1}
                onChange={(e) => {
                  setCandidateId1(e.target.value);
                  setComparisonResult(null);
                }}
                className="w-full bg-slate-950 border border-slate-850 rounded-xl p-3 text-xs text-slate-200 focus:outline-none focus:border-amber-500 cursor-pointer"
                id="select-candidate-1"
              >
                <option value="" className="bg-slate-950">Select First Candidate...</option>
                {candidates
                  .filter(c => c.id !== candidateId2)
                  .map(c => (
                    <option key={c.id} value={c.id} className="bg-slate-950">
                      {c.name} ({c.jobTitle} - {c.scores.overallScore} pts)
                    </option>
                  ))}
              </select>
            </div>

            {/* VS text */}
            <div className="md:col-span-1 flex justify-center pt-3 md:pt-6">
              <span className="text-xs font-mono font-black text-amber-500/40">VS</span>
            </div>

            {/* Candidate 2 Select */}
            <div className="md:col-span-3 space-y-2">
              <label className="block text-[11px] font-mono font-semibold text-slate-400 uppercase tracking-wider">Candidate B</label>
              <select
                value={candidateId2}
                onChange={(e) => {
                  setCandidateId2(e.target.value);
                  setComparisonResult(null);
                }}
                className="w-full bg-slate-950 border border-slate-850 rounded-xl p-3 text-xs text-slate-200 focus:outline-none focus:border-amber-500 cursor-pointer"
                id="select-candidate-2"
              >
                <option value="" className="bg-slate-950">Select Second Candidate...</option>
                {candidates
                  .filter(c => c.id !== candidateId1)
                  .map(c => (
                    <option key={c.id} value={c.id} className="bg-slate-950">
                      {c.name} ({c.jobTitle} - {c.scores.overallScore} pts)
                    </option>
                  ))}
              </select>
            </div>
          </div>
        )}

        {selectedCandidate1 && selectedCandidate2 && !isComparing && !comparisonResult && (
          <button
            onClick={handleCompare}
            className="w-full mt-5 flex items-center justify-center gap-2 bg-gradient-to-r from-amber-500 via-amber-400 to-yellow-500 hover:from-amber-400 hover:to-yellow-300 text-slate-950 text-xs font-bold py-3 px-4 rounded-xl shadow-lg hover:shadow-amber-500/10 active:scale-[0.98] transition duration-200 btn-premium-shine cursor-pointer"
            id="start-comparison-btn"
          >
            <Sparkles className="w-4 h-4 text-slate-950" />
            Perform Forensic Comparison & Generate Report
          </button>
        )}
      </div>

      {isComparing && (
        <div className="bg-slate-950/70 border border-slate-900 rounded-2xl p-10 flex flex-col items-center justify-center text-center space-y-4" id="comparison-loading">
          <Loader2 className="w-8 h-8 text-amber-400 animate-spin" />
          <div>
            <p className="text-xs font-bold text-slate-200">Processing Comparative Forensic Audits...</p>
            <p className="text-[11px] text-slate-500 mt-1 max-w-sm mx-auto">
              Re-evaluating chronological alignment, credential inflation risks, and tech match indexes side-by-side using Gemini.
            </p>
          </div>
        </div>
      )}

      {error && (
        <div className="p-4 bg-rose-500/10 border border-rose-500/20 rounded-2xl text-rose-400 text-xs leading-relaxed flex items-center gap-2" id="comparison-error">
          <AlertTriangle className="w-5 h-5 flex-shrink-0" />
          <div>
            <span className="font-semibold">Comparison Failed:</span> {error}
            <button 
              onClick={handleCompare} 
              className="underline block mt-1 font-semibold hover:text-rose-300 cursor-pointer"
            >
              Retry comparative audit
            </button>
          </div>
        </div>
      )}

      {/* Side-by-Side Stat Comparison Blocks */}
      {selectedCandidate1 && selectedCandidate2 && !isComparing && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6" id="comparison-side-by-side-grids">
          {/* Candidate A Card */}
          <div className="bg-slate-950/70 backdrop-blur-md border border-slate-900 rounded-2xl p-5 shadow-xl space-y-5" id="comp-candidate-a">
            <div className="flex items-start justify-between border-b border-slate-900 pb-3">
              <div>
                <span className="text-[9px] font-mono font-bold bg-amber-500/10 border border-amber-500/20 text-amber-400 px-2 py-0.5 rounded-md">Candidate A</span>
                <h3 className="text-base font-bold text-slate-100 mt-1">{selectedCandidate1.name}</h3>
                <p className="text-xs text-slate-400 mt-0.5">{selectedCandidate1.jobTitle}</p>
              </div>
              <span className={`px-2.5 py-0.5 text-xs font-semibold rounded-full border ${getVerdictBadge(selectedCandidate1.verdict)}`}>
                {selectedCandidate1.verdict}
              </span>
            </div>

            {/* Core Metrics */}
            <div className="grid grid-cols-3 gap-2.5">
              <div className="bg-slate-950/60 p-2.5 border border-slate-900/80 rounded-lg text-center">
                <p className="text-[9px] font-mono text-slate-500 uppercase">Screen Score</p>
                <p className="text-lg font-black font-mono text-amber-400 mt-0.5">{selectedCandidate1.scores.overallScore}</p>
              </div>
              <div className="bg-slate-950/60 p-2.5 border border-slate-900/80 rounded-lg text-center">
                <p className="text-[9px] font-mono text-slate-500 uppercase">Fake Probability</p>
                <p className="text-lg font-black font-mono text-rose-400 mt-0.5">{selectedCandidate1.fakeProbability}%</p>
              </div>
              <div className="bg-slate-950/60 p-2.5 border border-slate-900/80 rounded-lg text-center">
                <p className="text-[9px] font-mono text-slate-500 uppercase">Tech Match</p>
                <p className="text-lg font-black font-mono text-emerald-400 mt-0.5">{selectedCandidate1.scores.technicalMatch}%</p>
              </div>
            </div>

            {/* Verified Strengths */}
            <div className="space-y-2">
              <p className="text-[10px] font-mono font-bold text-slate-400 uppercase tracking-wider">Verified Strengths</p>
              <ul className="space-y-1.5 text-xs text-slate-300">
                {selectedCandidate1.keyQualifications.slice(0, 3).map((strength, idx) => (
                  <li key={idx} className="flex items-start gap-1.5 leading-relaxed bg-slate-950 border border-slate-900/85 p-2 rounded">
                    <span className="w-1.5 h-1.5 bg-emerald-400 rounded-full mt-1.5 flex-shrink-0" />
                    <span>{strength}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Flagged Risks */}
            <div className="space-y-2">
              <p className="text-[10px] font-mono font-bold text-slate-400 uppercase tracking-wider">Flagged Forensic Warnings</p>
              {selectedCandidate1.indicators.length === 0 ? (
                <p className="text-xs text-slate-500 italic bg-slate-950 border border-slate-900/85 p-2.5 rounded">No alerts or anomalies detected.</p>
              ) : (
                <ul className="space-y-1.5 text-xs text-slate-300">
                  {selectedCandidate1.indicators.slice(0, 3).map((ind, idx) => (
                    <li key={idx} className="flex items-start gap-1.5 leading-relaxed bg-rose-500/5 border border-rose-500/15 p-2 rounded text-slate-300">
                      <span className="w-1.5 h-1.5 bg-rose-400 rounded-full mt-1.5 flex-shrink-0" />
                      <div>
                        <span className="font-semibold text-slate-200">{ind.title}:</span> {ind.description}
                      </div>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          </div>

          {/* Candidate B Card */}
          <div className="bg-slate-950/70 backdrop-blur-md border border-slate-900 rounded-2xl p-5 shadow-xl space-y-5" id="comp-candidate-b">
            <div className="flex items-start justify-between border-b border-slate-900 pb-3">
              <div>
                <span className="text-[9px] font-mono font-bold bg-amber-500/10 border border-amber-500/20 text-amber-400 px-2 py-0.5 rounded-md">Candidate B</span>
                <h3 className="text-base font-bold text-slate-100 mt-1">{selectedCandidate2.name}</h3>
                <p className="text-xs text-slate-400 mt-0.5">{selectedCandidate2.jobTitle}</p>
              </div>
              <span className={`px-2.5 py-0.5 text-xs font-semibold rounded-full border ${getVerdictBadge(selectedCandidate2.verdict)}`}>
                {selectedCandidate2.verdict}
              </span>
            </div>

            {/* Core Metrics */}
            <div className="grid grid-cols-3 gap-2.5">
              <div className="bg-slate-950/60 p-2.5 border border-slate-900/80 rounded-lg text-center">
                <p className="text-[9px] font-mono text-slate-500 uppercase">Screen Score</p>
                <p className="text-lg font-black font-mono text-amber-400 mt-0.5">{selectedCandidate2.scores.overallScore}</p>
              </div>
              <div className="bg-slate-950/60 p-2.5 border border-slate-900/80 rounded-lg text-center">
                <p className="text-[9px] font-mono text-slate-500 uppercase">Fake Probability</p>
                <p className="text-lg font-black font-mono text-rose-400 mt-0.5">{selectedCandidate2.fakeProbability}%</p>
              </div>
              <div className="bg-slate-950/60 p-2.5 border border-slate-900/80 rounded-lg text-center">
                <p className="text-[9px] font-mono text-slate-500 uppercase">Tech Match</p>
                <p className="text-lg font-black font-mono text-emerald-400 mt-0.5">{selectedCandidate2.scores.technicalMatch}%</p>
              </div>
            </div>

            {/* Verified Strengths */}
            <div className="space-y-2">
              <p className="text-[10px] font-mono font-bold text-slate-400 uppercase tracking-wider">Verified Strengths</p>
              <ul className="space-y-1.5 text-xs text-slate-300">
                {selectedCandidate2.keyQualifications.slice(0, 3).map((strength, idx) => (
                  <li key={idx} className="flex items-start gap-1.5 leading-relaxed bg-slate-950 border border-slate-900/85 p-2 rounded">
                    <span className="w-1.5 h-1.5 bg-emerald-400 rounded-full mt-1.5 flex-shrink-0" />
                    <span>{strength}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Flagged Risks */}
            <div className="space-y-2">
              <p className="text-[10px] font-mono font-bold text-slate-400 uppercase tracking-wider">Flagged Forensic Warnings</p>
              {selectedCandidate2.indicators.length === 0 ? (
                <p className="text-xs text-slate-500 italic bg-slate-950 border border-slate-900/85 p-2.5 rounded">No alerts or anomalies detected.</p>
              ) : (
                <ul className="space-y-1.5 text-xs text-slate-300">
                  {selectedCandidate2.indicators.slice(0, 3).map((ind, idx) => (
                    <li key={idx} className="flex items-start gap-1.5 leading-relaxed bg-rose-500/5 border border-rose-500/15 p-2 rounded text-slate-300">
                      <span className="w-1.5 h-1.5 bg-rose-400 rounded-full mt-1.5 flex-shrink-0" />
                      <div>
                        <span className="font-semibold text-slate-200">{ind.title}:</span> {ind.description}
                      </div>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          </div>
        </div>
      )}

      {/* AI Comparison Fit Report */}
      {comparisonResult && selectedCandidate1 && selectedCandidate2 && !isComparing && (
        <div className="bg-slate-950/70 backdrop-blur-md border border-amber-500/20 rounded-2xl p-6 shadow-2xl space-y-6 relative overflow-hidden" id="ai-comparison-report">
          <div className="absolute top-0 right-0 w-64 h-64 bg-amber-500/5 rounded-full blur-3xl pointer-events-none" />

          {/* Report Header */}
          <div className="flex items-center gap-3 border-b border-slate-900 pb-4">
            <div className="p-2 bg-amber-500/10 rounded-lg border border-amber-500/20 text-amber-400">
              <Sparkles className="w-5 h-5 text-amber-400" />
            </div>
            <div>
              <h3 className="text-sm font-bold font-display text-slate-100">AI Side-by-Side Evaluation & Match Report</h3>
              <p className="text-[10px] font-mono text-slate-500 uppercase mt-0.5">Dual-grounded Gemini screening compilation</p>
            </div>
          </div>

          {/* Side-by-side comparative summary */}
          <div className="space-y-2.5">
            <p className="text-[11px] font-mono font-semibold text-slate-400 uppercase tracking-wider">Comparative Integrity Synthesis</p>
            <p className="text-xs text-slate-300 leading-relaxed bg-slate-950/60 p-4 border border-slate-900 rounded-xl leading-relaxed italic">
              "{comparisonResult.comparisonSummary}"
            </p>
          </div>

          {/* Winner Block */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 border-y border-slate-900 py-5">
            <div className="bg-amber-500/10 border border-amber-500/20 p-4.5 rounded-xl text-center flex flex-col justify-center items-center">
              <span className="text-[10px] font-mono font-bold text-amber-400 uppercase tracking-wider">Audit Integrity Pick</span>
              <span className="text-base font-black font-display text-slate-100 mt-1.5 flex items-center gap-1.5">
                <ShieldCheck className="w-4.5 h-4.5 text-amber-400" />
                {comparisonResult.integrityWinner}
              </span>
              <span className="text-[10px] text-slate-400 mt-0.5">Higher verifiable credentials</span>
            </div>
            
            <div className="md:col-span-2 space-y-1.5">
              <span className="text-[10px] font-mono font-bold text-slate-400 uppercase tracking-wider">Integrity Rationale</span>
              <p className="text-xs text-slate-300 leading-relaxed">
                {comparisonResult.integrityRationale}
              </p>
            </div>
          </div>

          {/* Skills Comparison */}
          <div className="space-y-2.5">
            <span className="text-[10px] font-mono font-bold text-slate-400 uppercase tracking-wider">Skills & Role Suitability Contrast</span>
            <p className="text-xs text-slate-300 leading-relaxed bg-slate-950 border border-slate-900 p-3.5 rounded-xl leading-relaxed">
              {comparisonResult.skillsComparison}
            </p>
          </div>

          {/* Final Recruiter Recommendation */}
          <div className="p-4 bg-emerald-500/5 border border-emerald-500/10 rounded-xl space-y-1.5">
            <span className="text-[10px] font-mono font-bold text-emerald-400 uppercase tracking-wider flex items-center gap-1.5">
              <ShieldCheck className="w-4.5 h-4.5 text-emerald-400" />
              Strategic Recruiting Recommendation
            </span>
            <p className="text-xs text-slate-200 leading-relaxed">
              {comparisonResult.finalRecommendation}
            </p>
          </div>

          {/* Regenerate footer */}
          <div className="flex items-center justify-between border-t border-slate-900 pt-4">
            <p className="text-[10px] text-slate-500 font-mono italic">
              Comparative fit report compiled using real-time parameter validation.
            </p>
            <button
              onClick={handleCompare}
              className="flex items-center gap-1.5 px-3 py-1 bg-slate-900 hover:bg-slate-850 border border-slate-850 text-slate-300 text-xs rounded-lg transition duration-200 cursor-pointer"
            >
              <RefreshCw className="w-3 h-3" />
              <span>Regenerate Report</span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
