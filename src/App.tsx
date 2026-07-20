// ForensiCV - Forensic Resume & ATS Verifier (Clean Production Build)
import { useState, useEffect } from "react";
import { Candidate } from "./types";
import ResumeUploader from "./components/ResumeUploader";
import CandidateLeaderboard from "./components/CandidateLeaderboard";
import CandidateDetails from "./components/CandidateDetails";
import ForensicChatCompanion from "./components/ForensicChatCompanion";
import InterviewGenerator from "./components/InterviewGenerator";
import CandidateComparison from "./components/CandidateComparison";
import InstallModal from "./components/InstallModal";
import { 
  Users, 
  UserCheck, 
  ShieldAlert, 
  Sparkles, 
  Briefcase, 
  LogOut,
  ChevronRight,
  TrendingUp,
  AlertCircle,
  LayoutDashboard,
  UploadCloud,
  Trophy,
  Menu,
  X,
  Wand2,
  FileText,
  Layers,
  Tag,
  History,
  Activity,
  MessageSquare,
  HelpCircle,
  FolderSync,
  Download
} from "lucide-react";

// Pre-seeded candidates for immediate recruiter workspace evaluation
const PRESEEDED_CANDIDATES: Candidate[] = [
  {
    id: "seed-1",
    name: "Sanjay Rockstar Ganesh",
    jobTitle: "Principal Full Stack Architect",
    email: "sanjay.ganesh.rockstar@devmail.com",
    phone: "+1 (555) 293-8472",
    location: "Austin, TX",
    education: "Bootcamp Certificate (12 Weeks)",
    summary: "A passionate, synergy-driven software ninja with 15+ years of React experience. Redesigned entire company cloud architectures as a solo intern and cut AWS database bills by 99.8% while pioneering groundbreaking blockchain-enabled microservices.",
    fileName: "sanjay_resume_rockstar.pdf",
    fileSize: "142 KB",
    uploadedAt: "10:14 AM",
    rawTextLength: 3450,
    fakeProbability: 88,
    verdict: "Highly Exaggerated",
    verdictExplanation: "The candidate's claims are mathematically and chronologically impossible. Listing 15 years of React experience is an immediate red flag since React was released in 2013 (13 years ago). Furthermore, there are multiple overlapping full-time senior positions and highly unrealistic intern accomplishments.",
    keyQualifications: [
      "Familiar with standard web technologies (HTML, CSS, JavaScript, Node.js)",
      "High familiarity with developer buzzwords and terminology"
    ],
    coreGaps: [
      "Claims 15 years of React experience (React was released in 2013)",
      "Conflicting full-time roles (worked simultaneously as a lead at TechGlobal and Chief Architect at WebLabs)",
      "Junior/Bootcamp experience duration does not justify the 'Principal Architect' level claims",
      "No listed GitHub or project code evidence backing claimed complex blockchain modules"
    ],
    scores: {
      technicalMatch: 55,
      timelineIntegrity: 15,
      experienceRealism: 18,
      projectBacking: 30,
      aiFreeProbability: 85,
      overallScore: 41
    },
    indicators: [
      {
        type: "skill_exaggeration",
        title: "Mathematical Timeline Impossibility",
        severity: "high",
        description: "Candidate claims a tenure with a framework that exceeds the tool's actual existence.",
        evidence: [
          "15+ years of production experience scaling high-load React.js single-page systems"
        ]
      },
      {
        type: "timeline_inconsistency",
        title: "Overlapping Full-Time Employment",
        severity: "high",
        description: "Candidate claims simultaneous full-time Principal and Lead positions at separate, competitive enterprises.",
        evidence: [
          "Principal Architect at GlobalTech Systems (Jan 2022 – Present)",
          "Chief Tech Lead & Core Engineer at WebScale Labs (Aug 2021 – Present)"
        ]
      },
      {
        type: "unrealistic_experience",
        title: "Highly Inflated Intern Accomplishments",
        severity: "medium",
        description: "Claims from early-career internships are completely disproportionate to standard authority limits.",
        evidence: [
          "As an engineering intern, single-handedly re-architected the global data streaming mesh, cutting AWS billing by 99.8% and saving $24 Million"
        ]
      },
      {
        type: "missing_projects",
        title: "Empty Advanced Skill Claims",
        severity: "medium",
        description: "Claims deep professional mastery of Kubernetes and Blockchain, but no listed projects or job bullet points describe using them.",
        evidence: [
          "Skills: React, Node.js, Kubernetes, Rust, Solana Smart Contracts"
        ]
      }
    ],
    skills: [
      { name: "React", category: "Framework", claimedExperienceYears: 15, estimatedExperienceYears: 8, confidenceScore: 30, status: "exaggerated", evidence: "React was created in 2013. Stated 15-year tenure is chronologically impossible." },
      { name: "Kubernetes", category: "Tools", claimedExperienceYears: 6, estimatedExperienceYears: 0, confidenceScore: 10, status: "suspicious", evidence: "No projects describe deploying, configuring, or operating k8s clusters." },
      { name: "Node.js", category: "Backend", claimedExperienceYears: 10, estimatedExperienceYears: 7, confidenceScore: 85, status: "verified", evidence: "Backend roles correctly detail Express.js API design and SQL interactions." },
      { name: "CSS/HTML", category: "Frontend", claimedExperienceYears: 10, estimatedExperienceYears: 10, confidenceScore: 95, status: "verified", evidence: "Confirmed by early developer roles." }
    ],
    timeline: [
      { id: "s-t1", role: "Principal Architect", company: "GlobalTech Systems", startYear: "2022", endYear: "2026", description: "Pioneered large scale cloud networks", isOverlapOrGap: true, status: "conflict", explanation: "Overlaps with another claimed full-time position." },
      { id: "s-t2", role: "Chief Tech Lead", company: "WebScale Labs", startYear: "2021", endYear: "2025", description: "Directed front-end scaling structures", isOverlapOrGap: true, status: "conflict", explanation: "Direct chronological overlap with GlobalTech role." },
      { id: "s-t3", role: "Software Intern", company: "SmallStart", startYear: "2021", endYear: "2021", description: "Cut database cost by 99.8% and redesigned all systems", isOverlapOrGap: false, status: "suspicious", explanation: "Highly unrealistic achievements claimed for a 3-month internship." }
    ],
    wordCloud: [
      { text: "React", value: 38, type: "skill" },
      { text: "Blockchain", value: 35, type: "buzzword" },
      { text: "Pioneered", value: 28, type: "action" },
      { text: "Ninja", value: 25, type: "buzzword" },
      { text: "Kubernetes", value: 22, type: "skill" },
      { text: "Synergy", value: 20, type: "buzzword" },
      { text: "Optimized", value: 15, type: "action" }
    ]
  },
  {
    id: "seed-2",
    name: "Sarah Connor",
    jobTitle: "Senior Systems Engineer",
    email: "s.connor@cyberdyne.org",
    phone: "+1 (555) 382-0192",
    location: "Los Angeles, CA",
    education: "B.S. Computer Science, UCLA",
    summary: "Disciplined systems engineer with 8 years of production experience designing resilient cloud backends, microservice APIs, and automated CI/CD deployment infrastructure. Focused on high-availability clusters and clean chronological engineering standards.",
    fileName: "sarah_connor_systems.pdf",
    fileSize: "115 KB",
    uploadedAt: "09:30 AM",
    rawTextLength: 2900,
    fakeProbability: 8,
    verdict: "Genuine",
    verdictExplanation: "The dossier exhibits impeccable chronological integrity, modest but solid technical claims fully justified by detailed project descriptions, and organic language patterns that reflect authentic human writing.",
    keyQualifications: [
      "8+ verified years of Unix systems and container orchestration experience",
      "Detailed project bullet points outlining database sharding and real-time Kafka messaging layers",
      "Clear, non-overlapping timeline with progressive career growth from Junior to Senior roles"
    ],
    coreGaps: [
      "No recent front-end framework experience (pure backend/systems focus)"
    ],
    scores: {
      technicalMatch: 95,
      timelineIntegrity: 100,
      experienceRealism: 96,
      projectBacking: 92,
      aiFreeProbability: 95,
      overallScore: 94
    },
    indicators: [],
    skills: [
      { name: "Docker/K8s", category: "Tools", claimedExperienceYears: 6, estimatedExperienceYears: 6, confidenceScore: 98, status: "verified", evidence: "Backed by rigorous, detailed cluster setup projects and configs." },
      { name: "Go/Golang", category: "Language", claimedExperienceYears: 5, estimatedExperienceYears: 5, confidenceScore: 94, status: "verified", evidence: "Direct experience writing microservices and distributed workers." },
      { name: "PostgreSQL", category: "Database", claimedExperienceYears: 7, estimatedExperienceYears: 7, confidenceScore: 90, status: "verified", evidence: "Detailed tuning, index optimization, and sharding bullets." }
    ],
    timeline: [
      { id: "c-t1", role: "Senior Systems Architect", company: "Cyberdyne Corp", startYear: "2023", endYear: "2026", description: "Directed high-availability Kubernetes infrastructure clusters and sharded storage systems", isOverlapOrGap: false, status: "valid", explanation: "Logical career progression, fully detailed technologies." },
      { id: "c-t2", role: "Infrastructure Specialist", company: "SkyNet Systems", startYear: "2020", endYear: "2023", description: "Engineered automated continuous delivery and deployment pipelines on GCP cloud frameworks", isOverlapOrGap: false, status: "valid", explanation: "Solid dates, fits technical credentials perfectly." },
      { id: "c-t3", role: "Junior Software Engineer", company: "Resistance Software", startYear: "2018", endYear: "2020", description: "Wrote backend REST APIs and maintained automated unit-testing suits", isOverlapOrGap: false, status: "valid", explanation: "Realistic starter role with grounded expectations." }
    ],
    wordCloud: [
      { text: "Kubernetes", value: 35, type: "skill" },
      { text: "Golang", value: 32, type: "skill" },
      { text: "Docker", value: 28, type: "skill" },
      { text: "High-Availability", value: 25, type: "buzzword" },
      { text: "Optimized", value: 20, type: "action" },
      { text: "Engineered", value: 18, type: "action" },
      { text: "CI/CD", value: 15, type: "skill" }
    ]
  },
  {
    id: "seed-3",
    name: "Jonathan Vance",
    jobTitle: "Software Developer",
    email: "jon.vance.dev@gmail.com",
    phone: "+1 (555) 739-1102",
    location: "Chicago, IL",
    education: "B.A. English (Self-Taught Dev)",
    summary: "A cutting-edge, result-oriented, and passionately dynamic professional utilizing synergistic paradigms to revolutionize technology interfaces, spearheading next-generation architectures, and delivering state-of-the-art scalable solutions.",
    fileName: "vance_compiled_cv.docx",
    fileSize: "98 KB",
    uploadedAt: "Yesterday",
    rawTextLength: 2100,
    fakeProbability: 74,
    verdict: "Likely AI-Generated",
    verdictExplanation: "The resume suffers from extreme stylistic redundancy, buzzword stuffing, and highly generic descriptions typical of 100% LLM-generated templates. While there are no timeline conflicts, the lack of concrete projects and the reliance on generic prose trigger high suspicion.",
    keyQualifications: [
      "Familiar with Python scripting and basic Django/Flask concepts"
    ],
    coreGaps: [
      "Document is highly likely 100% AI-generated using default ChatGPT templates",
      "Over-use of empty jargon ('leveraged next-generation paradigms', 'orchestrated synergistic scalability')",
      "No custom projects, real repositories, or detailed architectural metrics mentioned"
    ],
    scores: {
      technicalMatch: 65,
      timelineIntegrity: 85,
      experienceRealism: 40,
      projectBacking: 35,
      aiFreeProbability: 18,
      overallScore: 49
    },
    indicators: [
      {
        type: "ai_generated",
        title: "Artificial Stylistic Fingerprint",
        severity: "high",
        description: "The document exhibits language patterns, bullet-point syntax, and vocabulary distributions that match LLM template generation with 92% probability.",
        evidence: [
          "Passionate and results-driven professional utilizing synergistic paradigms to deliver cutting-edge scalable solutions..."
        ]
      },
      {
        type: "missing_projects",
        title: "Buzzwords Lack Engineering Proof",
        severity: "medium",
        description: "Lists numerous high-level concepts in the skills section but fails to provide a single detailed engineering project outlining implementation.",
        evidence: [
          "Expertise in Cloud Architecture, Continuous Delivery, Distributed Databases, and Artificial Intelligence Systems"
        ]
      }
    ],
    skills: [
      { name: "Python", category: "Language", claimedExperienceYears: 4, estimatedExperienceYears: 3, confidenceScore: 70, status: "verified", evidence: "Django roles mention standard CRUD setups." },
      { name: "Cloud Architecture", category: "Tools", claimedExperienceYears: 3, estimatedExperienceYears: 0, confidenceScore: 15, status: "exaggerated", evidence: "No cloud project listings exist to justify this high-level credential." }
    ],
    timeline: [
      { id: "v-t1", role: "Software Developer", company: "Synergy Corp", startYear: "2023", endYear: "2026", description: "Leveraged cutting-edge microservices to optimize operational parameters and drive next-generation capabilities", isOverlapOrGap: false, status: "suspicious", explanation: "Highly abstract AI prose. No concrete details on technologies or numbers." },
      { id: "v-t2", role: "Junior Developer", company: "Pinnacle Solutions", startYear: "2021", endYear: "2023", description: "Orchestrated state-of-the-art database paradigms to deliver robust solutions", isOverlapOrGap: false, status: "suspicious", explanation: "Vague descriptions matching standard LLM templates." }
    ],
    wordCloud: [
      { text: "Synergy", value: 38, type: "buzzword" },
      { text: "Cutting-edge", value: 34, type: "buzzword" },
      { text: "Leveraged", value: 30, type: "action" },
      { text: "Utilized", value: 26, type: "action" },
      { text: "Dynamic", value: 22, type: "buzzword" },
      { text: "Orchestrated", value: 20, type: "action" },
      { text: "Python", value: 18, type: "skill" }
    ]
  }
];

export function SafeAppIcon({ className = "w-9 h-9 rounded-lg", textClassName = "text-sm" }: { className?: string; textClassName?: string }) {
  const [imgError, setImgError] = useState(false);
  
  return (
    <div className={`${className} overflow-hidden border border-amber-500/30 shadow-md shrink-0 bg-slate-900 flex items-center justify-center relative select-none`}>
      <div className={`absolute inset-0 flex items-center justify-center bg-gradient-to-br from-amber-500 to-amber-600 text-slate-950 font-black tracking-tight ${textClassName}`}>
        F
      </div>
      {!imgError && (
        <img 
          src="/icon.png" 
          alt="ForensiCV Logo" 
          className="w-full h-full object-cover z-10" 
          referrerPolicy="no-referrer"
          onError={() => setImgError(true)}
        />
      )}
    </div>
  );
}

export default function App() {
  const [candidates, setCandidates] = useState<Candidate[]>([]);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  // PWA Installation state
  const [deferredPrompt, setDeferredPrompt] = useState<any>(null);
  const [isInstallModalOpen, setIsInstallModalOpen] = useState(false);
  const [isInstallBannerDismissed, setIsInstallBannerDismissed] = useState(false);

  useEffect(() => {
    const handleBeforeInstallPrompt = (e: any) => {
      e.preventDefault();
      setDeferredPrompt(e);
    };
    window.addEventListener("beforeinstallprompt", handleBeforeInstallPrompt);
    return () => {
      window.removeEventListener("beforeinstallprompt", handleBeforeInstallPrompt);
    };
  }, []);

  const triggerNativeInstall = () => {
    if (deferredPrompt) {
      deferredPrompt.prompt();
      deferredPrompt.userChoice.then((choiceResult: any) => {
        if (choiceResult.outcome === "accepted") {
          console.log("User accepted the install prompt");
          setDeferredPrompt(null);
        }
      });
    }
  };

  // Load and save to localStorage
  useEffect(() => {
    const cached = localStorage.getItem("forensic_candidates");
    if (cached) {
      try {
        const parsed = JSON.parse(cached);
        if (Array.isArray(parsed) && parsed.length > 0) {
          setCandidates(parsed);
          setSelectedId(parsed[0].id);
          return;
        }
      } catch (e) {
        console.error("Failed to parse cached candidates", e);
      }
    }
    // Default fallback to pre-seeded candidates
    setCandidates(PRESEEDED_CANDIDATES);
    setSelectedId(PRESEEDED_CANDIDATES[0].id);
    localStorage.setItem("forensic_candidates", JSON.stringify(PRESEEDED_CANDIDATES));
  }, []);

  const handleAnalysisComplete = (newCandidate: Candidate) => {
    const updated = [newCandidate, ...candidates];
    setCandidates(updated);
    setSelectedId(newCandidate.id);
    localStorage.setItem("forensic_candidates", JSON.stringify(updated));
    setErrorMsg(null);
  };

  const handleDeleteCandidate = (id: string) => {
    const updated = candidates.filter(c => c.id !== id);
    setCandidates(updated);
    localStorage.setItem("forensic_candidates", JSON.stringify(updated));
    
    if (selectedId === id) {
      setSelectedId(updated.length > 0 ? updated[0].id : null);
    }
  };

  const selectedCandidate = candidates.find(c => c.id === selectedId) || null;

  // Compute workspace metrics
  const totalScreened = candidates.length;
  const highRiskCount = candidates.filter(c => c.fakeProbability >= 65).length;
  const genuineCount = candidates.filter(c => c.verdict === "Genuine").length;
  const genuineRatio = totalScreened > 0 ? Math.round((genuineCount / totalScreened) * 100) : 100;

  const [activeTab, setActiveTab] = useState<"overview" | "screening" | "leaderboard" | "audit" | "questions" | "compare" | "chat">("overview");
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const handleScrollToSection = (elementId: string) => {
    setActiveTab("audit");
    setTimeout(() => {
      const el = document.getElementById(elementId);
      if (el) {
        el.scrollIntoView({ behavior: "smooth", block: "start" });
        el.classList.add("ring-2", "ring-amber-500/30", "rounded-2xl");
        setTimeout(() => el.classList.remove("ring-2", "ring-amber-500/30", "rounded-2xl"), 2000);
      }
    }, 150);
  };

  const handleSelectCandidateFromSidebar = (candidate: Candidate) => {
    setSelectedId(candidate.id);
    if (activeTab === "screening") {
      setActiveTab("overview");
    }
  };

  return (
    <div className="min-h-screen text-slate-100 bg-[#030408] font-sans flex antialiased selection:bg-emerald-500/30 selection:text-emerald-200 overflow-x-hidden">
      
      {/* Mobile Sidebar Backdrop Overlay */}
      {sidebarOpen && (
        <div 
          className="fixed inset-0 bg-slate-950/60 backdrop-blur-sm z-40 lg:hidden transition-opacity duration-300"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* 1. Side Dashboard (Sidebar) */}
      <aside className={`fixed inset-y-0 left-0 z-50 w-72 bg-slate-950 border-r border-slate-900/80 flex flex-col transition-transform duration-300 transform lg:translate-x-0 lg:static lg:h-screen lg:shrink-0 ${
        sidebarOpen ? "translate-x-0" : "-translate-x-full"
      }`}>
        {/* Sidebar Header */}
        <div className="p-5 border-b border-slate-900 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <SafeAppIcon className="w-9 h-9 rounded-lg" textClassName="text-sm" />
            <div>
              <h1 className="text-sm font-black text-slate-50 font-display tracking-tight leading-none flex items-center gap-1.5">
                ForensiCV
                <span className="text-[8px] font-mono font-bold bg-amber-500/10 border border-amber-500/20 text-amber-400 px-1 py-0.2 rounded">v2.0</span>
              </h1>
              <span className="text-[9px] font-semibold font-mono text-amber-500/80 tracking-wider">
                VERIFICATION HUB
              </span>
            </div>
          </div>
          <button 
            onClick={() => setSidebarOpen(false)}
            className="lg:hidden p-1.5 text-slate-400 hover:text-slate-100 bg-slate-900/50 rounded-lg border border-slate-800"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Workspace Quick Stats Blocks inside Sidebar */}
        <div className="p-4 grid grid-cols-3 gap-2 bg-slate-950 border-b border-slate-900/50">
          <div className="p-2 bg-slate-900/50 rounded-xl border border-slate-900/80 text-center">
            <span className="block text-[8px] font-mono text-slate-500 uppercase">Parsed</span>
            <span className="text-xs font-extrabold font-mono text-slate-200 mt-0.5 block">{totalScreened}</span>
          </div>
          <div className="p-2 bg-slate-900/50 rounded-xl border border-slate-900/80 text-center">
            <span className="block text-[8px] font-mono text-rose-500 uppercase">Risks</span>
            <span className="text-xs font-extrabold font-mono text-rose-400 mt-0.5 block">{highRiskCount}</span>
          </div>
          <div className="p-2 bg-slate-900/50 rounded-xl border border-slate-900/80 text-center">
            <span className="block text-[8px] font-mono text-amber-500 uppercase">Genuine</span>
            <span className="text-xs font-extrabold font-mono text-amber-400 mt-0.5 block">{genuineRatio}%</span>
          </div>
        </div>

        {/* Sidebar Navigation Links */}
        <div className="flex-1 overflow-y-auto px-3 py-4 space-y-6 scrollbar-thin">
          <div className="space-y-1">
            <p className="px-3 text-[10px] font-semibold font-mono text-slate-500 uppercase tracking-widest mb-2">Main Navigation</p>
            
            <button
              onClick={() => { setActiveTab("overview"); setSidebarOpen(false); }}
              className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs font-medium transition ${
                activeTab === "overview" 
                  ? "bg-amber-500/10 text-amber-400 border border-amber-500/20" 
                  : "text-slate-400 hover:text-slate-200 hover:bg-slate-900/40 border border-transparent"
              }`}
            >
              <LayoutDashboard className="w-4.5 h-4.5 text-amber-500" />
              <span>Workspace Overview</span>
              <span className="ml-auto bg-slate-900 text-slate-400 px-1.5 py-0.5 rounded text-[9px] font-mono">ALL</span>
            </button>

            <button
              onClick={() => { setActiveTab("screening"); setSidebarOpen(false); }}
              className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs font-medium transition ${
                activeTab === "screening" 
                  ? "bg-amber-500/10 text-amber-400 border border-amber-500/20" 
                  : "text-slate-400 hover:text-slate-200 hover:bg-slate-900/40 border border-transparent"
              }`}
            >
              <UploadCloud className="w-4.5 h-4.5 text-amber-500" />
              <span>Screening Desk</span>
            </button>

            <button
              onClick={() => { setActiveTab("leaderboard"); setSidebarOpen(false); }}
              className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs font-medium transition ${
                activeTab === "leaderboard" 
                  ? "bg-amber-500/10 text-amber-400 border border-amber-500/20" 
                  : "text-slate-400 hover:text-slate-200 hover:bg-slate-900/40 border border-transparent"
              }`}
            >
              <Trophy className="w-4.5 h-4.5 text-amber-500" />
              <span>Leaderboard Directory</span>
              {candidates.length > 0 && (
                <span className="ml-auto bg-amber-500/15 text-amber-400 px-1.5 py-0.5 rounded text-[9px] font-mono font-bold">
                  {candidates.length}
                </span>
              )}
            </button>

            <button
              onClick={() => { setActiveTab("audit"); setSidebarOpen(false); }}
              className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs font-medium transition ${
                activeTab === "audit" 
                  ? "bg-amber-500/10 text-amber-400 border border-amber-500/20" 
                  : "text-slate-400 hover:text-slate-200 hover:bg-slate-900/40 border border-transparent"
              }`}
            >
              <FileText className="w-4.5 h-4.5 text-amber-500" />
              <span>Verification Audit</span>
            </button>

            <button
              onClick={() => { setActiveTab("chat"); setSidebarOpen(false); }}
              className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs font-medium transition ${
                activeTab === "chat" 
                  ? "bg-amber-500/10 text-amber-400 border border-amber-500/20" 
                  : "text-slate-400 hover:text-slate-200 hover:bg-slate-900/40 border border-transparent"
              }`}
            >
              <MessageSquare className="w-4.5 h-4.5 text-amber-500" />
              <span>Forensic Chat</span>
              <span className="ml-auto bg-amber-500/15 text-amber-400 px-1.5 py-0.5 rounded text-[8px] font-mono font-bold uppercase">
                AI
              </span>
            </button>

            <button
              onClick={() => { setActiveTab("questions"); setSidebarOpen(false); }}
              className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs font-medium transition ${
                activeTab === "questions" 
                  ? "bg-amber-500/10 text-amber-400 border border-amber-500/20" 
                  : "text-slate-400 hover:text-slate-200 hover:bg-slate-900/40 border border-transparent"
              }`}
            >
              <HelpCircle className="w-4.5 h-4.5 text-amber-500" />
              <span>Bulletproof Vetting</span>
              <span className="ml-auto bg-amber-500/15 text-amber-400 px-1.5 py-0.5 rounded text-[8px] font-mono font-bold uppercase">
                NEW
              </span>
            </button>

            <button
              onClick={() => { setActiveTab("compare"); setSidebarOpen(false); }}
              className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs font-medium transition ${
                activeTab === "compare" 
                  ? "bg-amber-500/10 text-amber-400 border border-amber-500/20" 
                  : "text-slate-400 hover:text-slate-200 hover:bg-slate-900/40 border border-transparent"
              }`}
            >
              <FolderSync className="w-4.5 h-4.5 text-amber-500" />
              <span>Comparison Desk</span>
              <span className="ml-auto bg-amber-500/15 text-amber-400 px-1.5 py-0.5 rounded text-[8px] font-mono font-bold uppercase">
                VS
              </span>
            </button>
          </div>

          {/* Active Candidate Quick Audit Jump Links */}
          {selectedCandidate && (
            <div className="space-y-2 pt-2 border-t border-slate-900/50">
              <p className="px-3 text-[10px] font-semibold font-mono text-slate-500 uppercase tracking-widest mb-1.5 flex items-center justify-between">
                <span>Active Candidate</span>
                <span className={`inline-block w-2 h-2 rounded-full ${
                  selectedCandidate.fakeProbability >= 65 
                    ? "bg-rose-500 animate-pulse" 
                    : selectedCandidate.fakeProbability >= 30 
                      ? "bg-amber-500" 
                      : "bg-emerald-500"
                }`} />
              </p>
              
              <div className="mx-3 p-3 bg-slate-900/40 rounded-xl border border-slate-900 mb-3">
                <p className="text-xs font-bold text-slate-200 truncate">{selectedCandidate.name}</p>
                <p className="text-[10px] text-slate-400 truncate mt-0.5">{selectedCandidate.jobTitle}</p>
                <div className="mt-2 flex items-center justify-between border-t border-slate-900/80 pt-1.5">
                  <span className="text-[9px] font-mono text-slate-500">Score Rating:</span>
                  <span className={`text-[10px] font-mono font-black ${
                    selectedCandidate.scores.overallScore >= 80 
                      ? "text-emerald-400" 
                      : selectedCandidate.scores.overallScore >= 50 
                        ? "text-amber-400" 
                        : "text-rose-400"
                  }`}>
                    {selectedCandidate.scores.overallScore}%
                  </span>
                </div>
              </div>

              <div className="space-y-0.5">
                <button
                  onClick={() => handleScrollToSection("ai-humanizer-panel")}
                  className="w-full flex items-center gap-2.5 px-3 py-1.5 rounded-lg text-[11px] text-slate-400 hover:text-amber-400 hover:bg-slate-900/30 transition text-left group"
                >
                  <Wand2 className="w-3.5 h-3.5 text-slate-500 group-hover:text-amber-400" />
                  <span>AI Humanizer Studio</span>
                </button>

                <button
                  onClick={() => handleScrollToSection("ats-compatibility-panel")}
                  className="w-full flex items-center gap-2.5 px-3 py-1.5 rounded-lg text-[11px] text-slate-400 hover:text-amber-400 hover:bg-slate-900/30 transition text-left group"
                >
                  <FileText className="w-3.5 h-3.5 text-slate-500 group-hover:text-amber-400" />
                  <span>ATS Parser Audit</span>
                </button>

                <button
                  onClick={() => handleScrollToSection("bento-metrics-panel")}
                  className="w-full flex items-center gap-2.5 px-3 py-1.5 rounded-lg text-[11px] text-slate-400 hover:text-amber-400 hover:bg-slate-900/30 transition text-left group"
                >
                  <Activity className="w-3.5 h-3.5 text-slate-500 group-hover:text-amber-400" />
                  <span>Category Breakdown</span>
                </button>

                <button
                  onClick={() => handleScrollToSection("forensic-alerts-log")}
                  className="w-full flex items-center gap-2.5 px-3 py-1.5 rounded-lg text-[11px] text-slate-400 hover:text-amber-400 hover:bg-slate-900/30 transition text-left group"
                >
                  <ShieldAlert className="w-3.5 h-3.5 text-slate-500 group-hover:text-amber-400" />
                  <span>Anomalies Audit Log</span>
                </button>

                <button
                  onClick={() => handleScrollToSection("chronological-integrity-timeline")}
                  className="w-full flex items-center gap-2.5 px-3 py-1.5 rounded-lg text-[11px] text-slate-400 hover:text-amber-400 hover:bg-slate-900/30 transition text-left group"
                >
                  <History className="w-3.5 h-3.5 text-slate-500 group-hover:text-amber-400" />
                  <span>Timeline Integrity</span>
                </button>

                <button
                  onClick={() => handleScrollToSection("skill-exaggeration-table")}
                  className="w-full flex items-center gap-2.5 px-3 py-1.5 rounded-lg text-[11px] text-slate-400 hover:text-amber-400 hover:bg-slate-900/30 transition text-left group"
                >
                  <Layers className="w-3.5 h-3.5 text-slate-500 group-hover:text-amber-400" />
                  <span>Technical Skill Index</span>
                </button>

                <button
                  onClick={() => handleScrollToSection("word-density-panel")}
                  className="w-full flex items-center gap-2.5 px-3 py-1.5 rounded-lg text-[11px] text-slate-400 hover:text-amber-400 hover:bg-slate-900/30 transition text-left group"
                >
                  <Tag className="w-3.5 h-3.5 text-slate-500 group-hover:text-amber-400" />
                  <span>Keyword Tag Cloud</span>
                </button>
              </div>
            </div>
          )}

          {/* Dossier Quick Switcher list inside Sidebar */}
          {candidates.length > 0 && (
            <div className="space-y-1 pt-2 border-t border-slate-900/50">
              <p className="px-3 text-[10px] font-semibold font-mono text-slate-500 uppercase tracking-widest mb-2">Dossier Switcher</p>
              <div className="space-y-1.5 max-h-48 overflow-y-auto pr-1 scrollbar-thin">
                {candidates.map((c) => (
                  <button
                    key={c.id}
                    onClick={() => handleSelectCandidateFromSidebar(c)}
                    className={`w-full text-left p-2 rounded-xl border text-xs transition flex items-center gap-2.5 ${
                      selectedId === c.id 
                        ? "bg-slate-900 border-amber-500/20 text-slate-100" 
                        : "bg-slate-950/40 border-transparent hover:border-slate-900 text-slate-400 hover:text-slate-200"
                    }`}
                  >
                    <span className={`w-2 h-2 rounded-full shrink-0 ${
                      c.fakeProbability >= 65 
                        ? "bg-rose-500" 
                        : c.fakeProbability >= 30 
                          ? "bg-amber-500" 
                          : "bg-emerald-500"
                    }`} />
                    <div className="truncate flex-1">
                      <p className="font-bold truncate leading-tight">{c.name}</p>
                      <p className="text-[10px] text-slate-500 truncate mt-0.5">{c.jobTitle}</p>
                    </div>
                    <span className="font-mono text-[9px] bg-slate-950 px-1 py-0.5 rounded text-slate-400 font-semibold border border-slate-900 shrink-0">
                      {c.scores.overallScore}%
                    </span>
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Sidebar Footer */}
        <div className="p-4 border-t border-slate-900 bg-slate-950/80 text-[10px] text-slate-600 font-mono flex flex-col gap-2">
          <button
            onClick={() => {
              setIsInstallModalOpen(true);
              setSidebarOpen(false);
            }}
            className="w-full mb-2 py-2 px-3 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-slate-950 font-extrabold rounded-xl text-[11px] transition flex items-center justify-center gap-1.5 shadow-md shadow-amber-500/5 hover:shadow-amber-500/15 transform active:scale-[0.98]"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Install ForensiCV PWA</span>
          </button>
          
          <p className="flex items-center gap-1.5">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
            <span>Node Secure API active</span>
          </p>
          <p>© 2026 ForensiCV AI</p>
        </div>
      </aside>

      {/* 2. Main Workspace Panel */}
      <div className="flex-1 flex flex-col min-w-0 h-screen overflow-y-auto">
        
        {/* Premium Command Bar Header */}
        <header className="border-b border-slate-900/60 bg-slate-950/65 backdrop-blur-xl sticky top-0 z-30 px-4 md:px-6 py-4 flex items-center justify-between gap-4 shadow-sm">
          <div className="flex items-center gap-3">
            <button
              onClick={() => setSidebarOpen(true)}
              className="lg:hidden p-2 text-slate-400 hover:text-slate-100 bg-slate-900/80 border border-slate-800 rounded-xl"
            >
              <Menu className="w-5 h-5" />
            </button>
            
            {/* Custom App Icon in Header Dashboard */}
            <SafeAppIcon className="w-9 h-9 rounded-lg" textClassName="text-sm" />

            <div>
              <div className="flex items-center gap-2 flex-wrap">
                <span className="text-[9px] font-bold font-mono text-amber-400 bg-amber-950/50 px-2 py-0.5 rounded-md border border-amber-500/25 tracking-widest uppercase">
                  ForensiCV Engine v2.0
                </span>
                <span className="w-1.5 h-1.5 rounded-full bg-amber-400 animate-pulse" />
                <span className="text-[9px] font-mono text-slate-500 hidden sm:inline">REALTIME_GUARD_SECURE</span>
              </div>
              <h1 className="text-lg font-black text-slate-50 font-display tracking-tight mt-0.5 flex items-center gap-2">
                Recruiter Command Terminal
                <span className="text-[10px] font-normal text-slate-400 font-sans tracking-normal bg-slate-900 border border-slate-800 px-2 py-0.5 rounded hidden sm:inline-block">
                  {activeTab === "overview" && "Dashboard Overview"}
                  {activeTab === "screening" && "Screening Desk"}
                  {activeTab === "leaderboard" && "Leaderboard Directory"}
                  {activeTab === "audit" && "Forensic Verification Report"}
                  {activeTab === "chat" && "Forensic Chat Companion"}
                  {activeTab === "questions" && "Bulletproof Vetting Guide"}
                  {activeTab === "compare" && "Comparative Battle Desk"}
                </span>
              </h1>
            </div>
          </div>

          <div className="flex items-center gap-2 md:gap-3 text-xs">
            <button
              onClick={() => setIsInstallModalOpen(true)}
              className="px-3 py-2 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-slate-950 font-extrabold rounded-xl text-[11px] transition flex items-center gap-1.5 shadow-md shadow-amber-500/5 hover:shadow-amber-500/15 transform hover:scale-[1.02] active:scale-[0.98]"
              title="Install ForensiCV PWA"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Install App</span>
            </button>

            <div className="hidden sm:flex bg-slate-900/80 border border-slate-850 rounded-xl px-3 py-2 items-center gap-2.5 select-none shadow-inner">
              <div className="w-2 h-2 rounded-full bg-amber-500 animate-ping" />
              <div>
                <p className="text-[8px] font-mono text-slate-500 uppercase tracking-wider leading-none">Security Active</p>
                <p className="font-bold text-slate-300 text-[11px] mt-0.5">Recruiter Mode</p>
              </div>
            </div>
          </div>
        </header>

        {/* Command Terminal Main Body Area */}
        <main className="flex-1 w-full max-w-7xl mx-auto px-4 md:px-6 py-6 space-y-6">
          
          {/* PWA Install Promo Banner */}
          {!isInstallBannerDismissed && (
            <div className="bg-gradient-to-r from-amber-500/10 via-amber-500/5 to-slate-900 border border-amber-500/20 rounded-2xl p-4 md:p-5 flex flex-col md:flex-row items-center justify-between gap-4 shadow-xl shadow-amber-500/5 relative overflow-hidden animate-fadeIn" id="pwa-install-banner">
              {/* Subtle background glow */}
              <div className="absolute top-0 right-0 w-48 h-48 bg-amber-500/10 rounded-full blur-3xl pointer-events-none -mr-16 -mt-16" />
              
              <div className="flex flex-col sm:flex-row items-center sm:items-start gap-4 text-center sm:text-left z-10">
                <SafeAppIcon className="w-14 h-14 rounded-xl border-2" textClassName="text-xl" />
                <div className="space-y-1 max-w-xl">
                  <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2">
                    <h3 className="text-sm font-extrabold text-slate-100 font-display uppercase tracking-wider">Install ForensiCV PWA App</h3>
                    <span className="bg-amber-500/10 text-amber-400 text-[9px] font-mono font-bold px-2 py-0.5 rounded-full border border-amber-500/20">
                      ⚡ HIGH PERFORMANCE
                    </span>
                  </div>
                  <p className="text-xs text-slate-300 leading-relaxed">
                    Unshackle your recruiter command deck with instant home screen access, high-speed cached loading, full-width viewport immersion, and offline fallback compatibility.
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-2.5 z-10 w-full md:w-auto shrink-0 justify-center md:justify-end">
                <button
                  onClick={() => setIsInstallModalOpen(true)}
                  className="flex-1 md:flex-initial py-2.5 px-4 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-slate-950 font-black rounded-xl text-xs transition flex items-center justify-center gap-1.5 shadow-lg shadow-amber-500/15 transform hover:scale-[1.02] active:scale-[0.98]"
                >
                  <Download className="w-4 h-4" />
                  <span>INSTALL NOW</span>
                </button>
                <button
                  onClick={() => setIsInstallBannerDismissed(true)}
                  className="p-2.5 text-slate-400 hover:text-slate-100 bg-slate-900 border border-slate-800 rounded-xl text-xs transition hover:bg-slate-800/50 font-bold"
                  title="Dismiss banner"
                >
                  ✕
                </button>
              </div>
            </div>
          )}

          {/* Error notification bar */}
          {errorMsg && (
            <div className="bg-rose-950/30 border border-rose-900/40 text-rose-400 p-4 rounded-xl flex items-start gap-3 text-xs animate-fadeIn shadow-lg shadow-rose-950/5">
              <AlertCircle className="w-5 h-5 text-rose-400 flex-shrink-0 mt-0.5" />
              <div className="space-y-1">
                <p className="font-semibold">Screening Assessment Blocked</p>
                <p className="text-slate-300 leading-relaxed">{errorMsg}</p>
              </div>
              <button 
                onClick={() => setErrorMsg(null)}
                className="ml-auto text-slate-400 hover:text-slate-200 font-bold px-1"
              >
                ✕
              </button>
            </div>
          )}

          {/* TAB CONTENTS */}
          
          {/* A. OVERVIEW VIEW */}
          {activeTab === "overview" && (
            <div className="space-y-6 animate-fadeIn">
              {/* Executive Summary Statistics Widgets */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4" id="stats-summary-widgets">
                <div className="bg-slate-900 border border-slate-850 rounded-xl p-4.5 flex items-center justify-between shadow-inner">
                  <div className="space-y-1">
                    <p className="text-[10px] font-mono text-slate-500 uppercase tracking-wider font-semibold">Evaluated Dossiers</p>
                    <p className="text-2xl font-extrabold font-mono text-slate-200">{totalScreened}</p>
                    <p className="text-xs text-slate-400 flex items-center gap-1.5 mt-1 font-medium">
                      <Users className="w-3.5 h-3.5 text-slate-500" />
                      Total candidates parsed
                    </p>
                  </div>
                  <div className="p-3 bg-slate-950 border border-slate-800 rounded-xl text-slate-400">
                    <Users className="w-5 h-5" />
                  </div>
                </div>

                <div className="bg-slate-900 border border-slate-850 rounded-xl p-4.5 flex items-center justify-between shadow-inner">
                  <div className="space-y-1">
                    <p className="text-[10px] font-mono text-slate-500 uppercase tracking-wider font-semibold">Vigilance Risk Flags</p>
                    <p className="text-2xl font-extrabold font-mono text-rose-400">{highRiskCount}</p>
                    <p className="text-xs text-slate-400 flex items-center gap-1.5 mt-1 font-medium">
                      <ShieldAlert className="w-3.5 h-3.5 text-rose-500" />
                      Exaggeration or AI patterns
                    </p>
                  </div>
                  <div className="p-3 bg-rose-950/15 border border-rose-900/30 rounded-xl text-rose-400">
                    <ShieldAlert className="w-5 h-5" />
                  </div>
                </div>

                <div className="bg-slate-900 border border-slate-850 rounded-xl p-4.5 flex items-center justify-between shadow-inner">
                  <div className="space-y-1">
                    <p className="text-[10px] font-mono text-slate-500 uppercase tracking-wider font-semibold">Genuine Ratio Index</p>
                    <p className="text-2xl font-extrabold font-mono text-emerald-400">{genuineRatio}%</p>
                    <p className="text-xs text-slate-400 flex items-center gap-1.5 mt-1 font-medium">
                      <UserCheck className="w-3.5 h-3.5 text-emerald-500" />
                      Credential integrity rating
                    </p>
                  </div>
                  <div className="p-3 bg-emerald-950/15 border border-emerald-900/30 rounded-xl text-emerald-400">
                    <UserCheck className="w-5 h-5" />
                  </div>
                </div>
              </div>

              {/* Interactive Workspaces Split Panel */}
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start" id="split-workspace-panel">
                
                {/* Left Column: Dossier Uploader + Screening Control Panel */}
                <div className="lg:col-span-5 space-y-6">
                  <ResumeUploader 
                    onAnalysisComplete={handleAnalysisComplete}
                    onError={(msg) => setErrorMsg(msg)}
                  />

                  {/* Quick recruiter tips card */}
                  <div className="bg-slate-900 border border-slate-800 rounded-xl p-4.5">
                    <h3 className="text-xs font-semibold text-slate-300 uppercase tracking-wider mb-2 flex items-center gap-1.5">
                      <Sparkles className="w-3.5 h-3.5 text-amber-400" />
                      Forensic Screening Tips
                    </h3>
                    <ul className="space-y-2 text-xs text-slate-400 leading-relaxed list-none pl-0">
                      <li className="flex items-start gap-2">
                        <ChevronRight className="w-3.5 h-3.5 text-emerald-400 mt-0.5 flex-shrink-0" />
                        <span><strong>Overlaps</strong>: Always check overlapping full-time employment. It usually indicates dual-employment or fabricated contract roles.</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <ChevronRight className="w-3.5 h-3.5 text-emerald-400 mt-0.5 flex-shrink-0" />
                        <span><strong>AI Fingerprints</strong>: Highly abstract verbs (synergy, revolutionize, paradigm) without specific numerical outcomes are high AI indicators.</span>
                      </li>
                    </ul>
                  </div>
                </div>

                {/* Right Column: Leaderboard + In-Depth Forensic Report */}
                <div className="lg:col-span-7 space-y-6">
                  <CandidateLeaderboard 
                    candidates={candidates}
                    selectedId={selectedId}
                    onSelectCandidate={(c) => setSelectedId(c.id)}
                    onDeleteCandidate={handleDeleteCandidate}
                  />

                  {selectedCandidate ? (
                    <div className="animate-fadeIn" key={selectedCandidate.id}>
                      <div className="flex items-center gap-2 mb-3 select-none">
                        <TrendingUp className="w-4 h-4 text-emerald-400" />
                        <span className="text-[11px] font-mono uppercase text-slate-400 tracking-wider font-semibold">
                          In-depth forensic audit report
                        </span>
                      </div>
                      <CandidateDetails candidate={selectedCandidate} />
                    </div>
                  ) : (
                    <div className="bg-slate-900 border border-slate-800 rounded-xl p-10 text-center shadow-lg" id="details-placeholder">
                      <ShieldAlert className="w-12 h-12 text-slate-700 mx-auto mb-4" />
                      <h3 className="text-sm font-semibold text-slate-300">No Candidate Selected</h3>
                      <p className="text-xs text-slate-500 mt-1 max-w-sm mx-auto leading-relaxed">
                        Select a candidate from the Screening Leaderboard table above to view their detailed qualifications, gaps, and fake-detection analysis.
                      </p>
                    </div>
                  )}
                </div>

              </div>
            </div>
          )}

          {/* B. SCREENING DESK */}
          {activeTab === "screening" && (
            <div className="space-y-6 max-w-4xl mx-auto animate-fadeIn">
              <div className="p-4.5 bg-slate-900 border border-slate-850 rounded-2xl flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
                <div>
                  <h2 className="text-base font-bold font-display text-slate-100">Dossier Parsing & Assessment Desk</h2>
                  <p className="text-xs text-slate-400 mt-1">Upload candidate resume documents here to run structural chronology and claim realism audits.</p>
                </div>
                <button 
                  onClick={() => setActiveTab("overview")} 
                  className="px-3.5 py-1.5 bg-slate-850 hover:bg-slate-800 text-xs font-semibold rounded-xl border border-slate-800 text-slate-200 transition"
                >
                  View Full Workspace
                </button>
              </div>

              <ResumeUploader 
                onAnalysisComplete={handleAnalysisComplete}
                onError={(msg) => setErrorMsg(msg)}
              />

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5">
                  <h3 className="text-xs font-bold text-slate-200 flex items-center gap-2 mb-3 font-display uppercase tracking-wider">
                    <Sparkles className="w-4 h-4 text-amber-400" />
                    How to evaluate credentials
                  </h3>
                  <p className="text-xs text-slate-400 leading-relaxed">
                    Simply drop any PDF or text resume inside the sandbox uploader. Our multi-agent parser evaluates claimed technologies against historical releases, maps chronologies to identify impossible overlapping tenures, and scores stylistic structures to surface potential generative AI resume fraud.
                  </p>
                </div>
                
                <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5">
                  <h3 className="text-xs font-bold text-slate-200 flex items-center gap-2 mb-3 font-display uppercase tracking-wider">
                    <ShieldAlert className="w-4 h-4 text-rose-400" />
                    Vigilance Indicators
                  </h3>
                  <p className="text-xs text-slate-400 leading-relaxed">
                    Look for the "Mathematical Timeline Impossibility" flag (e.g. claiming React experience before 2013) or "AI-Generated Fingerprint" flag. High-scoring candidates represent real human achievements, backed by verifiable chronological progression.
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* C. LEADERBOARD DIRECTORY */}
          {activeTab === "leaderboard" && (
            <div className="space-y-6 animate-fadeIn">
              <CandidateLeaderboard 
                candidates={candidates}
                selectedId={selectedId}
                onSelectCandidate={(c) => setSelectedId(c.id)}
                onDeleteCandidate={handleDeleteCandidate}
              />
              
              {selectedCandidate && (
                <div className="p-4 bg-slate-900/40 border border-slate-850 rounded-2xl flex items-center justify-between gap-4 text-xs">
                  <div className="flex items-center gap-3">
                    <div className="w-2 h-2 rounded-full bg-amber-400 animate-pulse" />
                    <p className="text-slate-300">
                      Currently viewing <strong>{selectedCandidate.name}</strong> ({selectedCandidate.jobTitle}).
                    </p>
                  </div>
                  <button 
                    onClick={() => setActiveTab("audit")} 
                    className="px-3.5 py-1.5 bg-amber-500 hover:bg-amber-600 text-slate-950 font-bold rounded-xl transition"
                  >
                    Examine Audit Details
                  </button>
                </div>
              )}
            </div>
          )}

          {/* D. FORENSIC AUDIT */}
          {activeTab === "audit" && (
            <div className="space-y-6 animate-fadeIn">
              {selectedCandidate ? (
                <div key={selectedCandidate.id}>
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-4">
                    <div className="flex items-center gap-2 select-none">
                      <TrendingUp className="w-4.5 h-4.5 text-amber-400" />
                      <span className="text-xs font-mono uppercase text-slate-400 tracking-wider font-bold">
                        Detailed Verification Deep-Dive: {selectedCandidate.name}
                      </span>
                    </div>
                    <button 
                      onClick={() => setActiveTab("overview")} 
                      className="px-3 py-1.5 bg-slate-900 hover:bg-slate-800 text-xs text-slate-300 rounded-xl border border-slate-800 transition"
                    >
                      Back to Overview
                    </button>
                  </div>
                  <CandidateDetails candidate={selectedCandidate} />
                </div>
              ) : (
                <div className="bg-slate-900 border border-slate-800 rounded-2xl p-16 text-center max-w-xl mx-auto shadow-2xl" id="details-placeholder">
                  <ShieldAlert className="w-16 h-16 text-amber-500/80 mx-auto mb-4 animate-bounce" />
                  <h3 className="text-base font-bold text-slate-100 font-display uppercase tracking-wide">No Candidate Dossier Selected</h3>
                  <p className="text-xs text-slate-400 mt-2 leading-relaxed">
                    Please select a candidate first from the quick switcher or the Talent Leaderboard to view their automated forensic audit reports and AI Resume Humanizer.
                  </p>
                  <div className="mt-8 flex justify-center gap-3">
                    <button 
                      onClick={() => setActiveTab("leaderboard")} 
                      className="px-4 py-2 bg-amber-500 hover:bg-amber-600 text-slate-950 font-bold rounded-xl text-xs transition"
                    >
                      Open Leaderboard
                    </button>
                    <button 
                      onClick={() => setActiveTab("screening")} 
                      className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-xl text-xs transition border border-slate-700"
                    >
                      Upload New Resume
                    </button>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* E. FORENSIC CHAT COMPANION */}
          {activeTab === "chat" && (
            <div className="space-y-6 animate-fadeIn">
              {selectedCandidate ? (
                <div key={selectedCandidate.id} className="max-w-4xl mx-auto space-y-4">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div className="flex items-center gap-2 select-none">
                      <MessageSquare className="w-4.5 h-4.5 text-amber-400" />
                      <span className="text-xs font-mono uppercase text-slate-400 tracking-wider font-bold">
                        Interactive Dossier Grounding Chat: {selectedCandidate.name}
                      </span>
                    </div>
                  </div>
                  <ForensicChatCompanion candidate={selectedCandidate} />
                </div>
              ) : (
                <div className="bg-slate-900 border border-slate-800 rounded-2xl p-16 text-center max-w-xl mx-auto shadow-2xl" id="chat-placeholder">
                  <ShieldAlert className="w-16 h-16 text-amber-500/80 mx-auto mb-4 animate-bounce" />
                  <h3 className="text-base font-bold text-slate-100 font-display uppercase tracking-wide">No Candidate Dossier Selected</h3>
                  <p className="text-xs text-slate-400 mt-2 leading-relaxed">
                    Please select a candidate first from the quick switcher or the Talent Leaderboard to start the interactive Forensic Chat grounding.
                  </p>
                  <div className="mt-8 flex justify-center gap-3">
                    <button 
                      onClick={() => setActiveTab("leaderboard")} 
                      className="px-4 py-2 bg-amber-500 hover:bg-amber-600 text-slate-950 font-bold rounded-xl text-xs transition"
                    >
                      Open Leaderboard
                    </button>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* F. BULLETPROOF VETTING */}
          {activeTab === "questions" && (
            <div className="space-y-6 animate-fadeIn">
              {selectedCandidate ? (
                <div key={selectedCandidate.id} className="max-w-4xl mx-auto space-y-4">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div className="flex items-center gap-2 select-none">
                      <HelpCircle className="w-4.5 h-4.5 text-amber-400" />
                      <span className="text-xs font-mono uppercase text-slate-400 tracking-wider font-bold">
                        Vetting Guide & Scenario Questions: {selectedCandidate.name}
                      </span>
                    </div>
                  </div>
                  <InterviewGenerator candidate={selectedCandidate} />
                </div>
              ) : (
                <div className="bg-slate-900 border border-slate-800 rounded-2xl p-16 text-center max-w-xl mx-auto shadow-2xl" id="questions-placeholder">
                  <ShieldAlert className="w-16 h-16 text-amber-500/80 mx-auto mb-4 animate-bounce" />
                  <h3 className="text-base font-bold text-slate-100 font-display uppercase tracking-wide">No Candidate Dossier Selected</h3>
                  <p className="text-xs text-slate-400 mt-2 leading-relaxed">
                    Please select a candidate first from the quick switcher or the Talent Leaderboard to formulate specialized vetting questions.
                  </p>
                  <div className="mt-8 flex justify-center gap-3">
                    <button 
                      onClick={() => setActiveTab("leaderboard")} 
                      className="px-4 py-2 bg-amber-500 hover:bg-amber-600 text-slate-950 font-bold rounded-xl text-xs transition"
                    >
                      Open Leaderboard
                    </button>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* G. COMPARATIVE BATTLE DESK */}
          {activeTab === "compare" && (
            <div className="space-y-6 animate-fadeIn">
              <CandidateComparison candidates={candidates} />
            </div>
          )}

        </main>

        {/* Command Terminal Footer */}
        <footer className="border-t border-slate-900/60 bg-slate-950/40 py-6 mt-12 text-center text-xs text-slate-600 font-mono">
          <div className="max-w-7xl mx-auto px-4">
            <p>© 2026 ForensiCV AI. Built for recruitments with absolute credential integrity.</p>
            <p className="mt-1 text-[10px] text-slate-500">Confidential Recruiter Workspace • Secure Verification Ledger</p>
          </div>
        </footer>

      </div>

      {/* PWA Install Modal Overlay */}
      <InstallModal
        isOpen={isInstallModalOpen}
        onClose={() => setIsInstallModalOpen(false)}
        onInstall={triggerNativeInstall}
        isNativePromptAvailable={!!deferredPrompt}
      />

    </div>
  );
}
