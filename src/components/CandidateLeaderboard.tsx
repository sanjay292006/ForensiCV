import { useState } from "react";
import { Candidate } from "../types";
import { Search, Filter, Trophy, ArrowUpDown, Trash2, AlertTriangle, ShieldCheck, HelpCircle } from "lucide-react";

interface CandidateLeaderboardProps {
  candidates: Candidate[];
  selectedId: string | null;
  onSelectCandidate: (candidate: Candidate) => void;
  onDeleteCandidate: (id: string) => void;
}

export default function CandidateLeaderboard({
  candidates,
  selectedId,
  onSelectCandidate,
  onDeleteCandidate
}: CandidateLeaderboardProps) {
  const [searchTerm, setSearchTerm] = useState("");
  const [verdictFilter, setVerdictFilter] = useState<string>("all");
  const [sortField, setSortField] = useState<"overallScore" | "fakeProbability" | "uploadedAt">("overallScore");
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("desc");

  // Filter and sort candidates
  const filteredCandidates = candidates.filter(c => {
    const matchesSearch = 
      c.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      c.jobTitle.toLowerCase().includes(searchTerm.toLowerCase());
    
    if (verdictFilter === "all") return matchesSearch;
    return matchesSearch && c.verdict.toLowerCase().replace(" ", "_") === verdictFilter;
  });

  const sortedCandidates = [...filteredCandidates].sort((a, b) => {
    let valA: any = a.scores.overallScore;
    let valB: any = b.scores.overallScore;

    if (sortField === "fakeProbability") {
      valA = a.fakeProbability;
      valB = b.fakeProbability;
    } else if (sortField === "uploadedAt") {
      valA = a.uploadedAt;
      valB = b.uploadedAt;
    }

    if (valA < valB) return sortOrder === "asc" ? -1 : 1;
    if (valA > valB) return sortOrder === "asc" ? 1 : -1;
    return 0;
  });

  const toggleSort = (field: "overallScore" | "fakeProbability" | "uploadedAt") => {
    if (sortField === field) {
      setSortOrder(sortOrder === "asc" ? "desc" : "asc");
    } else {
      setSortField(field);
      setSortOrder("desc");
    }
  };

  const getVerdictBadge = (verdict: Candidate["verdict"]) => {
    switch (verdict) {
      case "Genuine":
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-1 text-xs font-medium rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
            <ShieldCheck className="w-3.5 h-3.5" />
            Genuine
          </span>
        );
      case "Suspicious":
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-1 text-xs font-medium rounded-full bg-amber-500/10 text-amber-400 border border-amber-500/20">
            <AlertTriangle className="w-3.5 h-3.5" />
            Suspicious
          </span>
        );
      case "Highly Exaggerated":
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-1 text-xs font-medium rounded-full bg-rose-500/10 text-rose-400 border border-rose-500/20">
            <AlertTriangle className="w-3.5 h-3.5" />
            Exaggerated
          </span>
        );
      case "Likely AI-Generated":
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-1 text-xs font-medium rounded-full bg-sky-500/10 text-sky-400 border border-sky-500/20">
            <HelpCircle className="w-3.5 h-3.5" />
            AI-Generated
          </span>
        );
    }
  };

  return (
    <div className="bg-slate-950/70 backdrop-blur-md border border-amber-500/10 hover:border-amber-500/20 rounded-2xl p-6 shadow-2xl transition duration-300 gold-glow-hover" id="candidate-leaderboard-container">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
        <div>
          <h2 className="text-lg font-bold font-display text-slate-100 flex items-center gap-2">
            <Trophy className="w-5 h-5 text-amber-400" />
            Screening Leaderboard
          </h2>
          <p className="text-xs text-slate-400 mt-1">
            Top vetted candidates automatically prioritized by HR screening score and chronological alignment.
          </p>
        </div>

        {/* Dashboard search + filter controls */}
        <div className="flex flex-wrap items-center gap-3">
          <div className="relative">
            <Search className="absolute left-3 top-2.5 h-4 w-4 text-slate-500" />
            <input
              type="text"
              placeholder="Search candidate or job..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-48 bg-slate-950 border border-slate-800/85 focus:border-amber-500 focus:ring-1 focus:ring-amber-500/20 rounded-lg py-2 pl-9 pr-4 text-xs text-slate-200 focus:outline-none placeholder-slate-600 transition"
              id="leaderboard-search"
            />
          </div>

          <div className="relative flex items-center bg-slate-950 border border-slate-850 rounded-lg px-2.5 py-2">
            <Filter className="h-3.5 w-3.5 text-slate-500 mr-2" />
            <select
              value={verdictFilter}
              onChange={(e) => setVerdictFilter(e.target.value)}
              className="bg-transparent text-xs text-slate-300 focus:outline-none cursor-pointer pr-4"
              id="leaderboard-verdict-filter"
            >
              <option value="all" className="bg-slate-950">All Verdicts</option>
              <option value="genuine" className="bg-slate-950 text-emerald-400">Genuine</option>
              <option value="suspicious" className="bg-slate-950 text-amber-400">Suspicious</option>
              <option value="highly_exaggerated" className="bg-slate-950 text-rose-400">Exaggerated</option>
              <option value="likely_ai-generated" className="bg-slate-950 text-sky-400">AI-Generated</option>
            </select>
          </div>
        </div>
      </div>

      {candidates.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-12 text-center border border-dashed border-slate-800/80 rounded-xl bg-slate-950/20" id="leaderboard-empty-state">
          <HelpCircle className="w-12 h-12 text-slate-600 mb-3" />
          <p className="text-sm font-medium text-slate-300">No dossiers evaluated yet</p>
          <p className="text-xs text-slate-500 mt-1 max-w-sm">
            Drag and drop a candidate's resume above to perform an automated fraud detection audit.
          </p>
        </div>
      ) : sortedCandidates.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-12 text-center" id="leaderboard-no-results">
          <p className="text-sm font-medium text-slate-400">No candidates match your search filters.</p>
        </div>
      ) : (
        <div className="overflow-x-auto" id="leaderboard-table-wrapper">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-slate-900 text-[11px] font-mono font-medium text-slate-400 uppercase tracking-wider bg-slate-950/40">
                <th className="py-3.5 px-4 font-normal">Rank</th>
                <th className="py-3.5 px-4 font-normal">Candidate Dossier</th>
                <th 
                  className="py-3.5 px-4 font-normal cursor-pointer hover:text-slate-200 transition select-none"
                  onClick={() => toggleSort("overallScore")}
                >
                  <div className="flex items-center gap-1">
                    Screen Score
                    <ArrowUpDown className="w-3 h-3 text-slate-500" />
                  </div>
                </th>
                <th className="py-3.5 px-4 font-normal">Verdict</th>
                <th 
                  className="py-3.5 px-4 font-normal cursor-pointer hover:text-slate-200 transition select-none"
                  onClick={() => toggleSort("fakeProbability")}
                >
                  <div className="flex items-center gap-1">
                    Fake Probability
                    <ArrowUpDown className="w-3 h-3 text-slate-500" />
                  </div>
                </th>
                <th className="py-3.5 px-4 text-right font-normal">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-900/60">
              {sortedCandidates.map((candidate, index) => {
                const isSelected = selectedId === candidate.id;
                // Gold/Silver/Bronze crown decorations for top 3
                const isTopRank = index < 3 && verdictFilter === "all" && searchTerm === "";
                const rankColor = index === 0 ? "text-amber-400 bg-amber-950/40 border-amber-500/30" : index === 1 ? "text-slate-300 bg-slate-900 border-slate-700/50" : "text-amber-700 bg-amber-950/10 border-amber-900/20";
                const rowGlow = index === 0 ? "shadow-[inset_0_1px_1px_rgba(251,191,36,0.02)]" : "";

                return (
                  <tr
                    key={candidate.id}
                    onClick={() => onSelectCandidate(candidate)}
                    className={`cursor-pointer transition duration-150 group ${rowGlow} ${
                      isSelected 
                        ? "bg-amber-500/5 border-l-2 border-l-amber-500" 
                        : "hover:bg-slate-900/40"
                    }`}
                  >
                    {/* Rank cell */}
                    <td className="py-4 px-4 font-mono text-xs">
                      <div className="flex items-center gap-2">
                        {isTopRank ? (
                          <div className={`flex items-center justify-center w-5 h-5 rounded font-bold text-[10px] border ${rankColor}`}>
                            #{index + 1}
                          </div>
                        ) : (
                          <span className="text-slate-500 text-[11px] pl-1">#{index + 1}</span>
                        )}
                      </div>
                    </td>

                    {/* Dossier cell */}
                    <td className="py-4 px-4">
                      <div className="min-w-[160px]">
                        <p className="text-sm font-bold text-slate-200 group-hover:text-amber-400 transition">
                          {candidate.name}
                        </p>
                        <p className="text-xs text-slate-500 font-medium mt-0.5 truncate max-w-[200px]">
                          {candidate.jobTitle}
                        </p>
                      </div>
                    </td>

                    {/* Screen Score cell */}
                    <td className="py-4 px-4 font-mono text-sm">
                      <div className="flex items-center gap-2">
                        <span className={`font-bold ${
                          candidate.scores.overallScore >= 80 
                            ? "text-emerald-400" 
                            : candidate.scores.overallScore >= 50 
                              ? "text-amber-400" 
                              : "text-rose-400"
                        }`}>
                          {candidate.scores.overallScore}/100
                        </span>
                      </div>
                    </td>

                    {/* Verdict Badge */}
                    <td className="py-4 px-4 whitespace-nowrap">
                      {getVerdictBadge(candidate.verdict)}
                    </td>

                    {/* Fake Probability */}
                    <td className="py-4 px-4 font-mono text-sm">
                      <div className="flex items-center gap-2">
                        <div className="w-16 bg-slate-950 border border-slate-900 rounded-full h-2 overflow-hidden">
                          <div 
                            className={`h-full rounded-full ${
                              candidate.fakeProbability >= 70 
                                ? "bg-rose-500" 
                                : candidate.fakeProbability >= 35 
                                  ? "bg-amber-500" 
                                  : "bg-emerald-500"
                            }`}
                            style={{ width: `${candidate.fakeProbability}%` }}
                          />
                        </div>
                        <span className={`text-xs ${
                          candidate.fakeProbability >= 70 
                            ? "text-rose-400 font-semibold" 
                            : candidate.fakeProbability >= 35 
                              ? "text-amber-400" 
                              : "text-emerald-400"
                        }`}>
                          {candidate.fakeProbability}%
                        </span>
                      </div>
                    </td>

                    {/* Delete action */}
                    <td className="py-4 px-4 text-right" onClick={(e) => e.stopPropagation()}>
                      <button
                        onClick={() => onDeleteCandidate(candidate.id)}
                        className="text-slate-500 hover:text-rose-400 p-2 rounded hover:bg-rose-500/10 transition"
                        title="Delete candidate report"
                        id={`delete-candidate-${candidate.id}`}
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
