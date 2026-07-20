import { useState, useEffect } from "react";
import { Candidate, SkillItem, TimelineEvent } from "../types";
import { generateClientFallbackHumanize } from "../lib/fallback";
import { 
  ShieldAlert, 
  ShieldCheck, 
  Mail, 
  Phone, 
  MapPin, 
  GraduationCap, 
  FileText, 
  Clock, 
  Compass, 
  CheckCircle2, 
  XCircle, 
  AlertTriangle,
  Flame,
  Brain,
  History,
  Tag,
  Sparkles,
  Layers,
  Award,
  Copy,
  Check,
  RefreshCw,
  ArrowRight,
  Wand2
} from "lucide-react";
import { 
  BarChart, 
  Bar, 
  Cell,
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer, 
  AreaChart, 
  Area
} from "recharts";

interface CandidateDetailsProps {
  candidate: Candidate;
}

export default function CandidateDetails({ candidate }: CandidateDetailsProps) {
  const [isHumanizing, setIsHumanizing] = useState(false);
  const [humanizedResult, setHumanizedResult] = useState<{
    humanizedSummary: string;
    overallAdvice: string;
    revisedBulletPoints: Array<{ original: string; revised: string; explanation: string }>;
    fullHumanizedText: string;
  } | null>(null);
  const [humanizeError, setHumanizeError] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);

  // Clear humanized results when switching candidates so we don't display stale data
  useEffect(() => {
    setHumanizedResult(null);
    setHumanizeError(null);
    setCopied(false);
  }, [candidate.id]);

  const handleCopyText = () => {
    if (!humanizedResult) return;
    navigator.clipboard.writeText(humanizedResult.fullHumanizedText);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const runHumanizer = async () => {
    setIsHumanizing(true);
    setHumanizeError(null);
    
    // Construct raw text defensively if not already provided
    let textToHumanize = candidate.rawText || "";
    if (!textToHumanize) {
      const skillsList = candidate.skills.map(s => `${s.name} (${s.claimedExperienceYears} years)`).join(", ");
      const timelineList = candidate.timeline.map(t => `${t.role} at ${t.company} (${t.startYear} - ${t.endYear}): ${t.description}`).join("\n");
      textToHumanize = `${candidate.name}
${candidate.jobTitle} | ${candidate.email || ""} | ${candidate.phone || ""} | ${candidate.location || ""}
Education: ${candidate.education || ""}

SUMMARY:
${candidate.summary}

EXPERIENCE:
${timelineList}

SKILLS:
${skillsList}`;
    }

    try {
      let result;
      try {
        const response = await fetch("/api/humanize", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ resumeText: textToHumanize })
        });

        if (!response.ok) {
          throw new Error("Humanizer endpoint returned an error status.");
        }

        result = await response.json();
      } catch (fetchErr) {
        console.warn("Server humanize failed. Switching to client-side correction simulation:", fetchErr);
        result = generateClientFallbackHumanize(textToHumanize);
      }
      
      setHumanizedResult(result);
    } catch (err: any) {
      console.error(err);
      setHumanizeError(err.message || "Failed to contact humanization engine.");
    } finally {
      setIsHumanizing(false);
    }
  };

  // Score mapping for recharts radial/bar
  const scoresData = [
    { name: "Tech Match", value: candidate.scores.technicalMatch, color: "#d4af37" },
    { name: "Timeline Integrity", value: candidate.scores.timelineIntegrity, color: "#b8860b" },
    { name: "Experience Realism", value: candidate.scores.experienceRealism, color: "#e5c158" },
    { name: "Project Backing", value: candidate.scores.projectBacking, color: "#c5a059" },
    { name: "AI-Free Prob", value: candidate.scores.aiFreeProbability, color: "#f59e0b" },
  ];

  // Helper to color codes
  const getSeverityStyle = (severity: string) => {
    switch (severity) {
      case "high":
        return {
          bg: "bg-rose-500/10 border-rose-500/20",
          text: "text-rose-400",
          icon: <Flame className="w-4 h-4 text-rose-400" />,
          badge: "bg-rose-500/20 text-rose-400 border-rose-500/30"
        };
      case "medium":
        return {
          bg: "bg-amber-500/10 border-amber-500/20",
          text: "text-amber-400",
          icon: <AlertTriangle className="w-4 h-4 text-amber-400" />,
          badge: "bg-amber-500/20 text-amber-400 border-amber-500/30"
        };
      default:
        return {
          bg: "bg-blue-500/10 border-blue-500/20",
          text: "text-blue-400",
          icon: <Compass className="w-4 h-4 text-blue-400" />,
          badge: "bg-blue-500/20 text-blue-400 border-blue-500/30"
        };
    }
  };

  const getVerdictStyle = (verdict: string) => {
    switch (verdict) {
      case "Genuine":
        return {
          bg: "bg-amber-500/10 border-amber-500/30",
          text: "text-amber-400",
          glow: "shadow-amber-500/10",
          label: "Credential Verification Clear",
          icon: <ShieldCheck className="w-8 h-8 text-amber-400" />
        };
      case "Suspicious":
        return {
          bg: "bg-amber-500/10 border-amber-500/30",
          text: "text-amber-400",
          glow: "shadow-amber-500/10",
          label: "Active Verification Suggested",
          icon: <AlertTriangle className="w-8 h-8 text-amber-400" />
        };
      case "Highly Exaggerated":
        return {
          bg: "bg-rose-500/10 border-rose-500/30",
          text: "text-rose-400",
          glow: "shadow-rose-500/10",
          label: "Critical Inconsistencies Found",
          icon: <ShieldAlert className="w-8 h-8 text-rose-400" />
        };
      default: // AI Generated
        return {
          bg: "bg-sky-500/10 border-sky-500/30",
          text: "text-sky-400",
          glow: "shadow-sky-500/10",
          label: "Artificial Document Structure",
          icon: <Brain className="w-8 h-8 text-sky-400" />
        };
    }
  };

  const verdictStyle = getVerdictStyle(candidate.verdict);

  return (
    <div className="space-y-6" id="candidate-details-container">
      {/* 1. Forensic Header / Profile Cover Card */}
      <div className={`p-6 border rounded-2xl shadow-2xl transition duration-300 bg-slate-950/70 backdrop-blur-md gold-glow-hover ${verdictStyle.bg} ${verdictStyle.glow}`} id="forensic-header-card">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          <div className="flex items-start gap-4">
            <div className="p-3 bg-slate-950 rounded-xl border border-slate-800 flex-shrink-0">
              {verdictStyle.icon}
            </div>
            <div>
              <div className="flex flex-wrap items-center gap-3">
                <h1 className="text-2xl font-bold text-slate-100">{candidate.name}</h1>
                <span className={`px-3 py-1 text-xs font-semibold rounded-full border ${verdictStyle.bg} ${verdictStyle.text}`}>
                  {candidate.verdict}
                </span>
              </div>
              <p className="text-slate-300 font-medium mt-1 text-sm">{candidate.jobTitle}</p>
              
              <div className="flex flex-wrap items-center gap-x-4 gap-y-2 mt-4 text-xs text-slate-400">
                {candidate.email && (
                  <span className="flex items-center gap-1.5 bg-slate-950/60 py-1 px-2 border border-slate-800/85 rounded-md">
                    <Mail className="w-3.5 h-3.5 text-slate-500" />
                    {candidate.email}
                  </span>
                )}
                {candidate.phone && (
                  <span className="flex items-center gap-1.5 bg-slate-950/60 py-1 px-2 border border-slate-800/85 rounded-md">
                    <Phone className="w-3.5 h-3.5 text-slate-500" />
                    {candidate.phone}
                  </span>
                )}
                {candidate.location && (
                  <span className="flex items-center gap-1.5 bg-slate-950/60 py-1 px-2 border border-slate-800/85 rounded-md">
                    <MapPin className="w-3.5 h-3.5 text-slate-500" />
                    {candidate.location}
                  </span>
                )}
                {candidate.education && (
                  <span className="flex items-center gap-1.5 bg-slate-950/60 py-1 px-2 border border-slate-800/85 rounded-md">
                    <GraduationCap className="w-3.5 h-3.5 text-slate-500" />
                    {candidate.education}
                  </span>
                )}
              </div>
            </div>
          </div>

          <div className="lg:text-right border-t lg:border-t-0 border-slate-800/80 pt-4 lg:pt-0">
            <p className="text-[10px] text-slate-500 font-mono uppercase tracking-wider">AI Screen Verdict</p>
            <p className={`text-xl font-bold font-mono ${verdictStyle.text} mt-0.5`}>
              {candidate.fakeProbability}% SUSPICIOUS
            </p>
            <p className="text-xs text-slate-400 mt-1 max-w-xs lg:ml-auto leading-relaxed">
              {verdictStyle.label}: {candidate.verdictExplanation}
            </p>
          </div>
        </div>
      </div>

      {/* ✨ AI Resume Humanizer & Polisher Studio */}
      <div className="bg-slate-950/70 backdrop-blur-md border border-amber-500/10 hover:border-amber-500/20 rounded-2xl p-6 shadow-2xl relative overflow-hidden transition duration-300 gold-glow-hover" id="ai-humanizer-panel">
        <div className="absolute top-0 right-0 w-64 h-64 bg-amber-500/5 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-64 h-64 bg-yellow-500/5 rounded-full blur-3xl pointer-events-none" />
        
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-900 pb-4 mb-5">
          <div className="flex items-start gap-3">
            <div className="p-2 bg-amber-500/10 rounded-lg border border-amber-500/20 text-amber-400">
              <Wand2 className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-sm font-bold font-display text-slate-100 flex items-center gap-2">
                AI Resume Humanizer & Professional Polisher
                <span className="px-2 py-0.5 text-[10px] font-mono bg-amber-500/10 border border-amber-500/20 text-amber-400 rounded-md">
                  Active Real-Time calibration
                </span>
              </h3>
              <p className="text-xs text-slate-400 mt-1 leading-relaxed">
                Rewrites artificial phrasing, calibrates temporal gaps or impossibilities, and scales exaggerated highlights into authentic, human-sounding achievements.
              </p>
            </div>
          </div>
          
          {!humanizedResult && !isHumanizing && (
            <button
              onClick={runHumanizer}
              className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-amber-500 via-amber-400 to-yellow-500 hover:from-amber-400 hover:to-yellow-300 text-slate-950 text-xs font-bold rounded-xl shadow-lg hover:shadow-amber-500/15 transition duration-200 shrink-0 cursor-pointer btn-premium-shine"
            >
              <Sparkles className="w-4 h-4 text-slate-950" />
              Humanize Dossier
            </button>
          )}
        </div>

        {isHumanizing && (
          <div className="flex flex-col items-center justify-center py-10 text-center space-y-4" id="humanizer-loading-state">
            <RefreshCw className="w-8 h-8 text-amber-400 animate-spin" />
            <div>
              <p className="text-xs font-bold text-slate-200">Re-engineering Credentials & Linguistic Fingerprints</p>
              <p className="text-[11px] text-slate-500 mt-1 max-w-sm">
                Evaluating claims, adjusting impossible tenures, removing redundant corporate adjectives, and formatting for recruiters.
              </p>
            </div>
          </div>
        )}

        {humanizeError && (
          <div className="p-4 bg-rose-500/10 border border-rose-500/20 rounded-xl text-rose-400 text-xs leading-relaxed flex items-center gap-2" id="humanizer-error-state">
            <XCircle className="w-5 h-5 flex-shrink-0" />
            <div>
              <span className="font-semibold">Humanization Failed:</span> {humanizeError}
              <button 
                onClick={runHumanizer} 
                className="underline block mt-1 font-semibold hover:text-rose-300 cursor-pointer"
              >
                Retry humanization
              </button>
            </div>
          </div>
        )}

        {!humanizedResult && !isHumanizing && !humanizeError && (
          <div className="p-5 bg-slate-950/45 border border-slate-900 rounded-xl text-center" id="humanizer-intro-state">
            <p className="text-xs text-slate-400 leading-relaxed max-w-xl mx-auto">
              Ready to convert this profile. Click the button to neutralize flags such as <span className="text-amber-400 font-medium">Likely AI-Generated</span> and <span className="text-rose-400 font-medium">Highly Exaggerated</span>. Everyone gets access to a pristine, proof-backed copy of their work.
            </p>
          </div>
        )}

        {humanizedResult && (
          <div className="space-y-6" id="humanized-output-panels">
            {/* Advice panel */}
            <div className="p-4 bg-amber-500/10 border border-amber-500/20 rounded-xl flex gap-3">
              <CheckCircle2 className="w-5 h-5 text-amber-400 flex-shrink-0 mt-0.5" />
              <div className="space-y-1">
                <h4 className="text-xs font-bold text-slate-200">Expert Calibration & Formatting Summary</h4>
                <p className="text-xs text-slate-300 leading-relaxed">{humanizedResult.overallAdvice}</p>
              </div>
            </div>

            {/* Humanized summary */}
            <div className="bg-slate-950/50 border border-slate-900 rounded-xl p-4.5">
              <h4 className="text-xs font-semibold text-slate-300 uppercase tracking-wider mb-2 flex items-center gap-1.5">
                <FileText className="w-4 h-4 text-amber-400" />
                Humanized Professional Summary
              </h4>
              <p className="text-xs text-slate-300 leading-relaxed italic">
                "{humanizedResult.humanizedSummary}"
              </p>
            </div>

            {/* Side by side bullet edits */}
            {humanizedResult.revisedBulletPoints && humanizedResult.revisedBulletPoints.length > 0 && (
              <div className="space-y-3">
                <h4 className="text-xs font-semibold text-slate-300 uppercase tracking-wider flex items-center gap-1.5">
                  <Layers className="w-4 h-4 text-amber-400" />
                  Bullet-by-Bullet Forensic Adjustments
                </h4>
                <div className="grid grid-cols-1 gap-4">
                  {humanizedResult.revisedBulletPoints.map((bullet, idx) => (
                    <div key={idx} className="bg-slate-950/60 border border-slate-900 rounded-xl p-4 space-y-3">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-1.5">
                          <span className="inline-block px-1.5 py-0.5 text-[9px] font-mono bg-rose-500/15 border border-rose-500/20 text-rose-400 rounded">
                            Original Flagged
                          </span>
                          <p className="text-xs text-slate-400 leading-relaxed italic line-through decoration-rose-500/50">
                            "{bullet.original}"
                          </p>
                        </div>
                        <div className="space-y-1.5 border-t md:border-t-0 md:border-l border-slate-900/80 pt-3 md:pt-0 md:pl-4">
                          <span className="inline-block px-1.5 py-0.5 text-[9px] font-mono bg-amber-500/15 border border-amber-500/20 text-amber-400 rounded">
                            Humanized Output
                          </span>
                          <p className="text-xs text-amber-300 leading-relaxed font-medium">
                            "{bullet.revised}"
                          </p>
                        </div>
                      </div>
                      <div className="bg-slate-900/60 p-2.5 border border-slate-900 rounded-lg text-[10.5px] text-slate-400 flex items-start gap-1.5">
                        <span className="font-semibold text-slate-300 flex-shrink-0">Adjustment Justification:</span>
                        <span>{bullet.explanation}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Plain text area and copying */}
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <h4 className="text-xs font-semibold text-slate-300 uppercase tracking-wider flex items-center gap-1.5">
                  <Award className="w-4 h-4 text-amber-400" />
                  Complete Authentic Resume Copy
                </h4>
                <div className="flex gap-2">
                  <button
                    onClick={handleCopyText}
                    className="flex items-center gap-1.5 px-3 py-1 bg-slate-800 hover:bg-slate-700 text-slate-200 text-[11px] font-semibold rounded-md border border-slate-700 transition cursor-pointer"
                  >
                    {copied ? (
                      <>
                        <Check className="w-3.5 h-3.5 text-amber-400" />
                        <span>Copied!</span>
                      </>
                    ) : (
                      <>
                        <Copy className="w-3.5 h-3.5 text-slate-400" />
                        <span>Copy Resume</span>
                      </>
                    )}
                  </button>
                  <button
                    onClick={() => setHumanizedResult(null)}
                    className="flex items-center gap-1.5 px-3 py-1 bg-slate-950 hover:bg-slate-900 text-slate-400 hover:text-slate-200 text-[11px] rounded-md border border-slate-900 transition cursor-pointer"
                  >
                    <RefreshCw className="w-3 h-3" />
                    <span>Reset</span>
                  </button>
                </div>
              </div>
              <textarea
                readOnly
                value={humanizedResult.fullHumanizedText}
                className="w-full h-48 bg-slate-950 border border-slate-900 rounded-xl p-3.5 text-xs font-mono text-amber-400/90 leading-relaxed resize-none focus:outline-none focus:border-amber-500/30"
              />
            </div>
          </div>
        )}
      </div>

      {/* 🚀 Dynamic ATS Compatibility Optimizer & Analyzer Panel */}
      {(() => {
        const hasEmail = !!candidate.email;
        const hasPhone = !!candidate.phone;
        const hasLocation = !!candidate.location;
        const contactPoints = (hasEmail ? 10 : 0) + (hasPhone ? 10 : 0) + (hasLocation ? 5 : 0);

        const timelineOverlaps = candidate.timeline.filter(t => t.isOverlapOrGap || t.status !== "valid").length;
        const timelinePoints = Math.max(0, 25 - timelineOverlaps * 10);

        const skillCount = candidate.skills.length;
        const skillPoints = Math.min(25, skillCount * 3.5);

        const activeVerbs = candidate.wordCloud.filter(w => w.type === "action").length;
        const verbPoints = Math.min(25, activeVerbs * 6);

        const rawAtsScore = Math.round(contactPoints + timelinePoints + skillPoints + verbPoints);
        const atsScore = Math.min(100, Math.max(30, rawAtsScore));

        const getScoreColor = (score: number) => {
          if (score >= 80) return "text-amber-400 border-amber-500/20 bg-amber-500/10";
          if (score >= 60) return "text-yellow-400 border-yellow-500/20 bg-yellow-500/10";
          return "text-rose-400 border-rose-500/20 bg-rose-500/10";
        };

        return (
          <div className="bg-slate-950/70 backdrop-blur-md border border-amber-500/10 hover:border-amber-500/20 rounded-2xl p-6 shadow-2xl relative overflow-hidden transition duration-300 gold-glow-hover" id="ats-compatibility-panel">
            <div className="absolute top-0 right-0 w-64 h-64 bg-amber-500/5 rounded-full blur-3xl pointer-events-none" />
            
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-900 pb-4 mb-5">
              <div className="flex items-start gap-3">
                <div className="p-2 bg-amber-500/10 rounded-lg border border-amber-500/20 text-amber-400">
                  <FileText className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-sm font-bold font-display text-slate-100 flex items-center gap-2">
                    Applicant Tracking System (ATS) Parser Compatibility Audit
                    <span className="px-2 py-0.5 text-[10px] font-mono bg-amber-500/10 border border-amber-500/20 text-amber-400 rounded-md">
                      ATS-Friendly Parser Scan
                    </span>
                  </h3>
                  <p className="text-xs text-slate-400 mt-1 leading-relaxed">
                    Evaluates resume formatting, search indexability, keyword matches, contact channels, and standard syntax required by major corporate hiring parsers.
                  </p>
                </div>
              </div>

              <div className={`flex flex-col items-center justify-center border px-4 py-2 rounded-lg text-center shrink-0 min-w-[120px] ${getScoreColor(atsScore)}`}>
                <span className="text-[10px] font-mono font-bold uppercase tracking-wider">ATS Score</span>
                <span className="text-2xl font-black font-mono leading-none mt-1">{atsScore}%</span>
                <span className="text-[9px] font-medium mt-0.5 font-display">Compatibility Index</span>
              </div>
            </div>

            {/* Checklist items */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-3">
                <h4 className="text-xs font-semibold text-slate-300 uppercase tracking-wider flex items-center gap-1.5 mb-2">
                  <Check className="w-4 h-4 text-amber-400" />
                  Technical Indexability Audit
                </h4>

                {/* 1. Contact Info */}
                <div className="p-3 bg-slate-950/40 border border-slate-900 rounded-xl flex gap-3">
                  {hasEmail && hasPhone ? (
                    <CheckCircle2 className="w-4.5 h-4.5 text-amber-400 shrink-0 mt-0.5" />
                  ) : (
                    <AlertTriangle className="w-4.5 h-4.5 text-amber-400 shrink-0 mt-0.5" />
                  )}
                  <div className="space-y-1">
                    <p className="text-xs font-bold text-slate-200">Contact Channels Extracted</p>
                    <p className="text-[11px] text-slate-400 leading-relaxed">
                      {hasEmail && hasPhone 
                        ? `Extractable Contact Channels: Both Email (${candidate.email}) and Phone (${candidate.phone}) are properly listed as plain text.`
                        : "Missing contact channels: Ensure both Email and Phone are listed clearly in raw text to avoid parser indexing failures."}
                    </p>
                  </div>
                </div>

                {/* 2. Chronological flow */}
                <div className="p-3 bg-slate-950/40 border border-slate-900 rounded-xl flex gap-3">
                  {timelineOverlaps === 0 ? (
                    <CheckCircle2 className="w-4.5 h-4.5 text-amber-400 shrink-0 mt-0.5" />
                  ) : (
                    <AlertTriangle className="w-4.5 h-4.5 text-amber-400 shrink-0 mt-0.5" />
                  )}
                  <div className="space-y-1">
                    <p className="text-xs font-bold text-slate-200">Chronology Integrity Rating</p>
                    <p className="text-[11px] text-slate-400 leading-relaxed">
                      {timelineOverlaps === 0 
                        ? "Linear Reverse-Chronology: No overlapping timelines or significant dates anomalies flagged. Parser structure is safe."
                        : `Flagged overlaps/gaps: ${timelineOverlaps} chronological warnings could cause ATS algorithms to misinterpret your work durations.`}
                    </p>
                  </div>
                </div>
              </div>

              <div className="space-y-3">
                <h4 className="text-xs font-semibold text-slate-300 uppercase tracking-wider flex items-center gap-1.5 mb-2">
                  <ArrowRight className="w-4 h-4 text-amber-400" />
                  Semantic Matching Relevance
                </h4>

                {/* 3. Keyword density */}
                <div className="p-3 bg-slate-950/40 border border-slate-900 rounded-xl flex gap-3">
                  {skillPoints >= 15 ? (
                    <CheckCircle2 className="w-4.5 h-4.5 text-amber-400 shrink-0 mt-0.5" />
                  ) : (
                    <AlertTriangle className="w-4.5 h-4.5 text-amber-400 shrink-0 mt-0.5" />
                  )}
                  <div className="space-y-1">
                    <p className="text-xs font-bold text-slate-200">Linguistic Skill & Keyword Alignment</p>
                    <p className="text-[11px] text-slate-400 leading-relaxed">
                      {skillPoints >= 15
                        ? `Heavy Skill Coverage: Loaded with ${skillCount} targeted skills. Highly indexable by automated recruiter search tools.`
                        : `Low Technical Keyword Density: Only ${skillCount} skills detected. ATS keyword spiders prefer standard technical keywords.`}
                    </p>
                  </div>
                </div>

                {/* 4. Action verb usage */}
                <div className="p-3 bg-slate-950/40 border border-slate-900 rounded-xl flex gap-3">
                  {verbPoints >= 12 ? (
                    <CheckCircle2 className="w-4.5 h-4.5 text-amber-400 shrink-0 mt-0.5" />
                  ) : (
                    <AlertTriangle className="w-4.5 h-4.5 text-amber-400 shrink-0 mt-0.5" />
                  )}
                  <div className="space-y-1">
                    <p className="text-xs font-bold text-slate-200">Active Action Language Ratio</p>
                    <p className="text-[11px] text-slate-400 leading-relaxed">
                      {verbPoints >= 12 
                        ? `Dynamic Verbs Verified: Uses strong, actionable engineering verbs (e.g., developed, optimized, spearheaded) to pass recruiter screens.`
                        : "Passive language warnings: Recommending swapping passive phrasing with strong action verbs to score higher on ATS filters."}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Recommendations footer */}
            <div className="mt-4 p-3 bg-amber-500/5 border border-amber-500/10 rounded-xl">
              <p className="text-xs font-semibold text-slate-200 flex items-center gap-1.5">
                <Sparkles className="w-4 h-4 text-amber-400" />
                ATS Compatibility Optimization Advice:
              </p>
              <p className="text-[11px] text-slate-300 mt-1 leading-relaxed">
                {atsScore >= 80 
                  ? "This resume is exceptionally well-suited for ATS filters. It has high extractability, clear milestones, excellent keywords, and a clean professional structure." 
                  : "To improve your score: Ensure contact information is at the absolute top of the page in standard header format, resolve overlapping chronological dates, and replace generic buzzwords with targeted framework keywords."}
              </p>
            </div>
          </div>
        );
      })()}

      {/* 2. Custom HR Scoring Bento Panel */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6" id="bento-metrics-panel">
        {/* Core Circular Rating */}
        <div className="bg-slate-950/70 backdrop-blur-md border border-amber-500/10 hover:border-amber-500/20 rounded-2xl p-5 shadow-2xl flex flex-col items-center justify-center text-center transition duration-300 gold-glow-hover">
          <p className="text-xs text-slate-400 font-bold uppercase font-mono tracking-wider mb-4">Screen Suitability Index</p>
          
          <div className="relative w-36 h-36 flex items-center justify-center">
            {/* SVG Progress Circle */}
            <svg className="w-full h-full transform -rotate-90">
              <circle 
                cx="72" 
                cy="72" 
                r="64" 
                className="stroke-slate-900 fill-none" 
                strokeWidth="10"
              />
              <circle 
                cx="72" 
                cy="72" 
                r="64" 
                className={`fill-none transition-all duration-1000 ease-out ${
                  candidate.scores.overallScore >= 80 
                    ? "stroke-amber-400" 
                    : candidate.scores.overallScore >= 50 
                      ? "stroke-amber-400/70" 
                      : "stroke-rose-400"
                }`}
                strokeWidth="10"
                strokeDasharray={2 * Math.PI * 64}
                strokeDashoffset={2 * Math.PI * 64 * (1 - candidate.scores.overallScore / 100)}
                strokeLinecap="round"
              />
            </svg>
            <div className="absolute text-center">
              <p className="text-3xl font-extrabold font-mono text-slate-100">{candidate.scores.overallScore}</p>
              <p className="text-[10px] text-slate-500 font-mono mt-0.5">out of 100</p>
            </div>
          </div>
          
          <div className="mt-4">
            <p className="text-xs text-slate-400 leading-relaxed max-w-xs">
              Weighted index combining technical qualifications, work verification confidence, and timeline integrity.
            </p>
          </div>
        </div>

        {/* Detailed Metrics Chart */}
        <div className="lg:col-span-2 bg-slate-950/70 backdrop-blur-md border border-amber-500/10 hover:border-amber-500/20 rounded-2xl p-5 shadow-2xl flex flex-col transition duration-300 gold-glow-hover">
          <p className="text-xs text-slate-400 font-medium uppercase font-mono tracking-wider mb-4">Forensic Category Audit Breakdown</p>
          <div className="flex-1 h-44 min-h-[160px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={scoresData}
                layout="vertical"
                margin={{ top: 5, right: 30, left: 10, bottom: 5 }}
              >
                <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" horizontal={true} vertical={false} />
                <XAxis type="number" domain={[0, 100]} stroke="#475569" fontSize={10} tickFormatter={(val) => `${val}%`} />
                <YAxis dataKey="name" type="category" stroke="#475569" fontSize={10} width={100} />
                <Tooltip 
                  contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', borderRadius: '8px' }}
                  labelStyle={{ color: '#94a3b8', fontSize: '11px', fontWeight: 'bold' }}
                  itemStyle={{ color: '#f8fafc', fontSize: '12px' }}
                  formatter={(value: any) => [`${value}%`]}
                />
                <Bar dataKey="value" fill="#d4af37" radius={[0, 4, 4, 0]} barSize={14}>
                  {scoresData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* 3. Forensic Alert Log: Flagged Indicators */}
      <div className="bg-slate-950/70 backdrop-blur-md border border-amber-500/10 hover:border-amber-500/20 rounded-2xl p-6 shadow-2xl transition duration-300 gold-glow-hover" id="forensic-alerts-log">
        <h3 className="text-sm font-semibold text-slate-200 uppercase tracking-wider mb-4 flex items-center gap-2 font-display">
          <ShieldAlert className="w-5 h-5 text-amber-500" />
          Credentials & Anomalies Audit Log
        </h3>
        
        {candidate.indicators.length === 0 ? (
          <div className="flex items-center gap-3 p-4 bg-amber-500/5 border border-amber-500/20 rounded-xl text-amber-400">
            <CheckCircle2 className="w-5 h-5 flex-shrink-0" />
            <div className="text-xs font-medium">
              No anomalies or fraudulent patterns flagged. Profile chronology and skill claims appear pristine.
            </div>
          </div>
        ) : (
          <div className="space-y-4">
            {candidate.indicators.map((indicator, index) => {
              const styles = getSeverityStyle(indicator.severity);
              return (
                <div 
                  key={index} 
                  className={`p-4 border rounded-xl flex gap-3.5 transition hover:bg-slate-850/25 ${styles.bg}`}
                >
                  <div className="p-2 bg-slate-950/50 rounded-lg border border-slate-800 flex-shrink-0 self-start">
                    {styles.icon}
                  </div>
                  <div className="space-y-1.5 flex-1">
                    <div className="flex flex-wrap items-center justify-between gap-2">
                      <h4 className="text-sm font-semibold text-slate-100">{indicator.title}</h4>
                      <span className={`px-2 py-0.5 text-[10px] font-mono font-semibold uppercase rounded-md border ${styles.badge}`}>
                        {indicator.severity} alert
                      </span>
                    </div>
                    <p className="text-xs text-slate-300 leading-relaxed">{indicator.description}</p>
                    
                    {/* Specific raw text evidence */}
                    {indicator.evidence && indicator.evidence.length > 0 && (
                      <div className="mt-3 bg-slate-950/80 border border-slate-850 rounded-lg p-2.5">
                        <p className="text-[10px] font-mono font-semibold text-slate-400 uppercase mb-1">Dossier Evidence Found:</p>
                        <ul className="space-y-1 text-[11px] font-mono text-slate-400 italic">
                          {indicator.evidence.map((quote, qIdx) => (
                            <li key={qIdx} className="flex items-start gap-1.5">
                              <span className="text-slate-600">"</span>
                              <span>{quote}</span>
                              <span className="text-slate-600">"</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* 4. Strengths & Gaps */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6" id="strengths-gaps-section">
        <div className="bg-slate-950/70 backdrop-blur-md border border-amber-500/10 hover:border-amber-500/20 rounded-2xl p-5 shadow-2xl transition duration-300 gold-glow-hover">
          <h3 className="text-xs font-bold text-slate-300 uppercase tracking-wider mb-4 flex items-center gap-2 font-display">
            <CheckCircle2 className="w-4 h-4 text-amber-400" />
            Verified Qualifications & Strengths
          </h3>
          <ul className="space-y-2.5">
            {candidate.keyQualifications.map((strength, idx) => (
              <li key={idx} className="flex items-start gap-2.5 text-xs text-slate-300 leading-relaxed bg-slate-950/40 p-2.5 border border-slate-900 rounded-lg">
                <span className="flex-shrink-0 w-1.5 h-1.5 bg-amber-400 rounded-full mt-1.5" />
                {strength}
              </li>
            ))}
          </ul>
        </div>

        <div className="bg-slate-950/70 backdrop-blur-md border border-amber-500/10 hover:border-amber-500/20 rounded-2xl p-5 shadow-2xl transition duration-300 gold-glow-hover">
          <h3 className="text-xs font-bold text-slate-300 uppercase tracking-wider mb-4 flex items-center gap-2 font-display">
            <XCircle className="w-4 h-4 text-rose-400" />
            Vulnerability, Missing Projects & Gaps
          </h3>
          <ul className="space-y-2.5">
            {candidate.coreGaps.map((gap, idx) => (
              <li key={idx} className="flex items-start gap-2.5 text-xs text-slate-300 leading-relaxed bg-slate-950/40 p-2.5 border border-slate-900 rounded-lg">
                <span className="flex-shrink-0 w-1.5 h-1.5 bg-rose-400 rounded-full mt-1.5" />
                {gap}
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* 5. Chronological Timeline Integrity checks */}
      <div className="bg-slate-950/70 backdrop-blur-md border border-amber-500/10 hover:border-amber-500/20 rounded-2xl p-6 shadow-2xl transition duration-300 gold-glow-hover" id="chronological-integrity-timeline">
        <h3 className="text-sm font-semibold text-slate-200 uppercase tracking-wider mb-6 flex items-center gap-2 font-display">
          <History className="w-5 h-5 text-amber-400" />
          Chronological Integrity Integrator
        </h3>

        <div className="relative pl-6 border-l border-slate-800 space-y-6">
          {candidate.timeline.map((event, index) => {
            const isSuspicious = event.status !== "valid";
            return (
              <div key={index} className="relative group">
                {/* Timeline node icon */}
                <div className={`absolute -left-[31px] top-0.5 w-4.5 h-4.5 rounded-full border-2 bg-slate-950 transition flex items-center justify-center ${
                  isSuspicious 
                    ? "border-amber-400 text-amber-400 shadow-[0_0_8px_rgba(212,175,55,0.2)]" 
                    : "border-amber-500/40 text-amber-400"
                }`}>
                  <div className={`w-1.5 h-1.5 rounded-full ${isSuspicious ? "bg-amber-400 animate-pulse" : "bg-amber-450"}`} />
                </div>

                <div className={`p-4 border rounded-xl transition ${
                  isSuspicious 
                    ? "bg-amber-500/5 border-amber-500/20 hover:border-amber-500/35" 
                    : "bg-slate-950/30 border-slate-900 hover:border-slate-850"
                }`}>
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                    <div>
                      <h4 className="text-sm font-bold text-slate-200">{event.role}</h4>
                      <p className="text-xs text-slate-400 mt-0.5">{event.company}</p>
                    </div>
                    <div className="font-mono text-xs text-slate-400 bg-slate-900 py-1 px-2 border border-slate-800 rounded select-none">
                      {event.startYear} – {event.endYear}
                    </div>
                  </div>

                  <p className="text-xs text-slate-400 mt-2.5 leading-relaxed italic border-l-2 border-slate-800 pl-2.5">
                    {event.description}
                  </p>

                  {/* Forensic chronology analysis explanation */}
                  {event.explanation && (
                    <div className={`mt-3 p-2.5 rounded-lg border text-xs leading-relaxed flex items-start gap-2 ${
                      isSuspicious 
                        ? "bg-amber-500/10 border-amber-500/20 text-amber-300" 
                        : "bg-slate-950 border-slate-850 text-slate-400"
                    }`}>
                      <Clock className="w-4 h-4 text-slate-500 flex-shrink-0 mt-0.5" />
                      <div>
                        <span className="font-semibold">Audit Observation:</span> {event.explanation}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* 6. Skill Exaggeration Index */}
      <div className="bg-slate-950/70 backdrop-blur-md border border-amber-500/10 hover:border-amber-500/20 rounded-2xl p-6 shadow-2xl transition duration-300 gold-glow-hover" id="skill-exaggeration-table">
        <h3 className="text-sm font-semibold text-slate-200 uppercase tracking-wider mb-6 flex items-center gap-2 font-display">
          <Layers className="w-5 h-5 text-amber-400" />
          Technical Skill Exaggeration Index
        </h3>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="border-b border-slate-800 text-[10px] font-mono text-slate-400 uppercase tracking-wider bg-slate-950/40">
                <th className="py-2.5 px-3">Skill Asset</th>
                <th className="py-2.5 px-3">Category</th>
                <th className="py-2.5 px-3 text-center">Claimed Tenure</th>
                <th className="py-2.5 px-3 text-center">Forensic Estimate</th>
                <th className="py-2.5 px-3 text-center">Audit Status</th>
                <th className="py-2.5 px-3">Verification Rationale</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/50">
              {candidate.skills.map((skill, idx) => {
                const isExaggerated = skill.status === "exaggerated" || skill.status === "suspicious";
                return (
                  <tr key={idx} className={`hover:bg-slate-850/15 transition ${
                    isExaggerated ? "bg-rose-950/5" : ""
                  }`}>
                    <td className="py-3 px-3 font-semibold text-slate-200">{skill.name}</td>
                    <td className="py-3 px-3 text-slate-400">{skill.category}</td>
                    <td className="py-3 px-3 text-center font-mono text-slate-300">{skill.claimedExperienceYears} yrs</td>
                    <td className="py-3 px-3 text-center font-mono">
                      <span className={`font-semibold ${isExaggerated ? "text-rose-400" : "text-amber-400"}`}>
                        {skill.estimatedExperienceYears} yrs
                      </span>
                    </td>
                    <td className="py-3 px-3 text-center">
                      <span className={`inline-block px-2 py-0.5 text-[9px] font-mono font-semibold rounded ${
                        skill.status === "verified" 
                          ? "bg-amber-500/10 text-amber-400 border border-amber-500/20" 
                          : skill.status === "suspicious"
                            ? "bg-amber-500/15 text-amber-400 border border-amber-500/30"
                            : "bg-rose-500/10 text-rose-400 border border-rose-500/20"
                      }`}>
                        {skill.status}
                      </span>
                    </td>
                    <td className="py-3 px-3 text-slate-400 leading-relaxed max-w-sm">{skill.evidence}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* 7. Word Cloud / Density */}
      <div className="bg-slate-950/70 backdrop-blur-md border border-amber-500/10 hover:border-amber-500/20 rounded-2xl p-5 shadow-2xl transition duration-300 gold-glow-hover" id="word-density-panel">
        <h3 className="text-xs font-bold text-slate-300 uppercase tracking-wider mb-4 flex items-center gap-2 font-display">
          <Tag className="w-4 h-4 text-amber-400" />
          Dossier Keyword tag Cloud & Lexical Density
        </h3>
        
        <p className="text-xs text-slate-500 mb-4 leading-relaxed">
          Keyword distribution highlighted by relevance weights. Visualizes typical AI resume padding, buzzword density, or legitimate tool mentions.
        </p>

        <div className="flex flex-wrap items-center justify-center gap-x-3.5 gap-y-3 p-5 bg-slate-950/60 border border-slate-900 rounded-xl min-h-[140px]" id="tags-cloud-wrapper">
          {candidate.wordCloud.map((word, index) => {
            // Compute dynamic styles based on token value weight
            const sizeClass = 
              word.value >= 32 
                ? "text-lg font-bold" 
                : word.value >= 24 
                  ? "text-base font-semibold" 
                  : word.value >= 16 
                    ? "text-xs font-medium" 
                    : "text-[10px] font-normal";
            
            const colorClass = 
              word.type === "skill" 
                ? "text-amber-400 hover:bg-amber-950/20 border-amber-900/30" 
                : word.type === "buzzword" 
                  ? "text-blue-400 hover:bg-blue-950/20 border-blue-900/30" 
                  : word.type === "action" 
                    ? "text-rose-400 hover:bg-rose-950/20 border-rose-900/30" 
                    : "text-slate-400 hover:bg-slate-800/20 border-slate-700/30";

            return (
              <span 
                key={index} 
                className={`px-2.5 py-1 rounded-md border bg-slate-900/40 select-none cursor-default transition duration-200 hover:scale-105 ${sizeClass} ${colorClass}`}
                title={`Relevance score: ${word.value} | Classification: ${word.type}`}
              >
                {word.text}
              </span>
            );
          })}
        </div>

        {/* Legend */}
        <div className="flex flex-wrap justify-center gap-4 mt-4 text-[10px] text-slate-400">
          <div className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-amber-400" />
            <span>Technical Skills</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-blue-400" />
            <span>Exaggerated Buzzwords</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-rose-400" />
            <span>Action Verbs</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-slate-400" />
            <span>Other Phrases</span>
          </div>
        </div>
      </div>
    </div>
  );
}
