import React, { useState, useRef } from "react";
import { Upload, FileText, CheckCircle, AlertCircle, Loader2, Sparkles, Terminal, Beaker, UserCheck, ShieldAlert, Brain } from "lucide-react";
import { parseResumeFile } from "../lib/fileParser";

interface ResumeUploaderProps {
  onAnalysisComplete: (candidateData: any) => void;
  onError: (errorMsg: string) => void;
}

const SANDBOX_DATASETS = [
  {
    key: "impossible",
    name: "Sanjay G. (Exaggerated Ninja)",
    fileName: "sanjay_impossible_timeline.txt",
    role: "Full Stack Architect",
    badge: "Timeline Overlaps & 15 yr React Claim",
    badgeColor: "bg-rose-500/15 text-rose-400 border-rose-500/25",
    text: `Sanjay Rockstar Ganesh
Principal Software Architect | sanjay.ganesh.rockstar@devmail.com | +1 (555) 293-8472 | Austin, TX

SUMMARY:
A highly motivated and synergy-driven developer with over 15+ years of production React experience. Redesigned entire company cloud architectures as a solo intern, cutting AWS costs by 99.8% while pioneering groundbreaking blockchain-enabled distributed microservices.

EXPERIENCE:
Principal Architect | GlobalTech Systems (Jan 2022 – Present)
- Single-handedly designed and operated all high-load React.js single-page systems for Fortune 500 companies.
- Managed over 300 developers while coding 14 hours a day in Rust, Solana, and Kubernetes.

Chief Tech Lead | WebScale Labs (Aug 2021 – Present)
- Directed front-end scaling structures and managed complex cloud integration networks.
- Reduced database querying latency by 500% using advanced SQL indexes and microservice paradigms.

Software Intern | SmallStart Inc (May 2021 – Aug 2021)
- Redesigned all legacy architectures and migrated core databases to distributed Solana smart contracts.
- Prevented critical security breach saving the firm $24M in potential regulatory fines.

EDUCATION:
Bootcamp Certificate (12 Weeks) - DevAcademy, 2021

SKILLS:
React, Node.js, Kubernetes, Rust, Solana Smart Contracts, CSS, HTML.`
  },
  {
    key: "ai_generated",
    name: "Jonathan V. (AI Buzzword-Stuffed)",
    fileName: "jonathan_ai_redundant.txt",
    role: "Software Developer",
    badge: "100% ChatGPT Template Style",
    badgeColor: "bg-sky-500/15 text-sky-400 border-sky-500/25",
    text: `Jonathan Vance
Software Engineer | jon.vance.dev@gmail.com | Chicago, IL

SUMMARY:
A cutting-edge, result-oriented, and passionately dynamic software development professional utilizing synergistic paradigms to revolutionize technology interfaces, spearheading next-generation architectures, and delivering state-of-the-art scalable solutions.

EXPERIENCE:
Software Developer | Synergy Corp (2023 – Present)
- Leveraged cutting-edge microservices to optimize operational parameters and drive next-generation capabilities.
- Orchestrated synergistic scalability methodologies across cross-functional engineering units.
- Developed robust, state-of-the-art application logic utilizing modern programming design patterns.

Junior Developer | Pinnacle Solutions (2021 – 2023)
- Utilized state-of-the-art relational and non-relational database paradigms to deliver robust solutions.
- Spearheaded modern, high-quality front-end systems in alignment with user experience specifications.
- Collaborated closely with product owners to brainstorm, design, and conceptualize next-generation services.

SKILLS:
Cloud Architecture, Continuous Delivery, Distributed Databases, Artificial Intelligence Systems, Python, Django, HTML, CSS.`
  },
  {
    key: "genuine",
    name: "Sarah C. (Authentic Systems Veteran)",
    fileName: "sarah_connor_genuine.txt",
    role: "Senior Systems Engineer",
    badge: "Clean Chronology & Proof Backed",
    badgeColor: "bg-emerald-500/15 text-emerald-400 border-emerald-500/25",
    text: `Sarah Connor
Senior Systems Engineer | s.connor@cyberdyne.org | +1 (555) 382-0192 | Los Angeles, CA

SUMMARY:
Disciplined systems engineer with 8 years of production experience designing resilient cloud backends, microservice APIs, and automated CI/CD deployment infrastructure. Focused on high-availability clusters and clean chronological engineering standards.

EXPERIENCE:
Senior Systems Architect | Cyberdyne Corp (Jan 2023 – Present)
- Directed high-availability Kubernetes infrastructure clusters on Google Cloud Platform, achieving 99.99% uptime.
- Architected a distributed PostgreSQL database cluster with transaction pool sharding, reducing query times for 10M+ daily active records.
- Led containerization migration of 14 monolithic backend services into microservices using Docker and gRPC.

Infrastructure Specialist | SkyNet Systems (Mar 2020 – Dec 2022)
- Engineered automated continuous deployment pipelines using GitLab CI, reducing average build-to-deploy cycles from 45 minutes to under 8 minutes.
- Configured Terraform IAC (Infrastructure as Code) scripts to securely manage cloud resources, access controls, and network firewalls.
- Implemented Prometheus and Grafana telemetry dashboards to proactively detect memory leaks and network latency spikes.

Junior Software Engineer | Resistance Software (Jan 2018 – Feb 2020)
- Maintained backend Python/Express REST APIs and implemented automated unittest suites with 92% coverage.
- Optimized slow SQL relational queries and refactored redundant API endpoint calls.

EDUCATION:
B.S. Computer Science | UCLA (2014 – 2018)

SKILLS:
Docker, Kubernetes, Go/Golang, Python, PostgreSQL, Terraform, Prometheus, GitLab CI/CD, Linux.`
  }
];

export default function ResumeUploader({ onAnalysisComplete, onError }: ResumeUploaderProps) {
  const [dragActive, setDragActive] = useState(false);
  const [file, setFile] = useState<File | null>(null);
  const [parsedText, setParsedText] = useState<string>("");
  const [isParsing, setIsParsing] = useState(false);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [customPrompt, setCustomPrompt] = useState("");
  const [showTextPreview, setShowTextPreview] = useState(false);
  const [isSandbox, setIsSandbox] = useState(false);
  const [sandboxName, setSandboxName] = useState("");
  
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const processFile = async (selectedFile: File) => {
    const extension = selectedFile.name.split(".").pop()?.toLowerCase();
    if (!["pdf", "docx", "txt"].includes(extension || "")) {
      onError("Invalid file format. Please upload a PDF, DOCX, or TXT file.");
      return;
    }

    setFile(selectedFile);
    setIsSandbox(false);
    setSandboxName("");
    setIsParsing(true);
    setParsedText("");
    
    try {
      const text = await parseResumeFile(selectedFile);
      setParsedText(text);
    } catch (err: any) {
      console.error(err);
      onError(err.message || "Failed to parse the uploaded resume file.");
      setFile(null);
    } finally {
      setIsParsing(false);
    }
  };

  const handleDrop = async (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      await processFile(e.dataTransfer.files[0]);
    }
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      await processFile(e.target.files[0]);
    }
  };

  const onButtonClick = () => {
    fileInputRef.current?.click();
  };

  const loadSandboxDataset = (dataset: typeof SANDBOX_DATASETS[0]) => {
    setFile(null);
    setIsSandbox(true);
    setSandboxName(dataset.fileName);
    setParsedText(dataset.text);
  };

  const triggerAnalysis = async () => {
    if (!parsedText) return;
    
    setIsAnalyzing(true);
    try {
      const response = await fetch("/api/analyze", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          resumeText: parsedText,
          customPrompt: customPrompt.trim()
        })
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Server failed to analyze the resume.");
      }

      const result = await response.json();
      
      // Inject some client-side metadata that the server wouldn't know
      const enhancedResult = {
        ...result,
        id: Math.random().toString(36).substring(2, 11),
        fileName: isSandbox ? sandboxName : (file?.name || "uploaded_resume.pdf"),
        fileSize: isSandbox ? "4.2 KB" : (file ? `${(file.size / 1024).toFixed(1)} KB` : "Unknown size"),
        uploadedAt: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        rawTextLength: parsedText.length,
        rawText: parsedText
      };

      onAnalysisComplete(enhancedResult);
      // Reset state for next upload
      setFile(null);
      setParsedText("");
      setCustomPrompt("");
      setIsSandbox(false);
      setSandboxName("");
    } catch (err: any) {
      console.error(err);
      onError(err.message || "An unexpected error occurred during resume analysis.");
    } finally {
      setIsAnalyzing(false);
    }
  };

  return (
    <div className="bg-slate-950/70 backdrop-blur-md border border-amber-500/10 hover:border-amber-500/20 rounded-2xl p-6 shadow-2xl transition duration-300 gold-glow-hover" id="resume-uploader-container">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h2 className="text-lg font-bold font-display text-slate-100 flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-amber-400" />
            Resume Forensic Screening
          </h2>
          <p className="text-xs text-slate-400 mt-1">
            Upload candidate dossiers or select a sandbox profile to verify credentials, experience, and timeline patterns.
          </p>
        </div>
        <div className="flex gap-2">
          <span className="px-2.5 py-1 text-[10px] bg-slate-950/80 border border-slate-850 text-amber-400/90 rounded-md font-mono font-semibold">
            PDF
          </span>
          <span className="px-2.5 py-1 text-[10px] bg-slate-950/80 border border-slate-850 text-amber-400/90 rounded-md font-mono font-semibold">
            DOCX
          </span>
          <span className="px-2.5 py-1 text-[10px] bg-slate-950/80 border border-slate-850 text-amber-400/90 rounded-md font-mono font-semibold">
            TXT
          </span>
        </div>
      </div>

      <form 
        onDragEnter={handleDrag} 
        onSubmit={(e) => e.preventDefault()}
        className="relative mb-4"
      >
        <input
          ref={fileInputRef}
          type="file"
          className="hidden"
          accept=".pdf,.docx,.txt"
          onChange={handleFileChange}
          disabled={isParsing || isAnalyzing}
          id="file-upload-input"
        />

        <div
          onDragOver={handleDrag}
          onDragLeave={handleDrag}
          onDrop={handleDrop}
          onClick={(file || isSandbox) ? undefined : onButtonClick}
          className={`flex flex-col items-center justify-center border-2 border-dashed rounded-xl p-8 transition-all duration-300 cursor-pointer ${
            dragActive 
              ? "border-amber-400 bg-amber-500/5 shadow-[0_0_15px_rgba(212,175,55,0.1)]" 
              : (file || isSandbox)
                ? "border-slate-800 bg-slate-950/40 cursor-default" 
                : "border-slate-800 hover:border-amber-500/30 bg-slate-950/20 hover:bg-slate-950/40"
          }`}
          id="drag-drop-zone"
        >
          {isParsing ? (
            <div className="flex flex-col items-center py-4">
              <Loader2 className="w-10 h-10 text-amber-400 animate-spin mb-3" />
              <p className="text-sm font-medium text-slate-200">Parsing dossier text...</p>
              <p className="text-xs text-slate-500 mt-1">Extracting characters and tables</p>
            </div>
          ) : (file || isSandbox) ? (
            <div className="w-full">
              <div className="flex items-start gap-4">
                <div className="p-3 bg-slate-900 border border-slate-800 rounded-lg text-amber-400 animate-pulse">
                  {isSandbox ? <Beaker className="w-8 h-8 text-amber-400" /> : <FileText className="w-8 h-8" />}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-bold text-slate-200 truncate">
                    {isSandbox ? sandboxName : file?.name}
                  </p>
                  <p className="text-xs text-slate-500 mt-0.5 font-mono">
                    {isSandbox ? "Sandbox File Loaded" : `${(file!.size / 1024).toFixed(1)} KB`} • Extracted {parsedText.length} characters
                  </p>
                  <div className="flex items-center gap-1.5 text-amber-400 text-xs mt-2 font-medium">
                    <CheckCircle className="w-3.5 h-3.5" />
                    {isSandbox ? "Loaded sandbox dataset successfully" : "Text content extracted successfully"}
                  </div>
                </div>
                <button
                  onClick={() => {
                    setFile(null);
                    setParsedText("");
                    setIsSandbox(false);
                    setSandboxName("");
                  }}
                  className="text-xs text-slate-300 hover:text-rose-400 px-3 py-1.5 bg-slate-900 border border-slate-800 hover:bg-slate-850 rounded-lg transition cursor-pointer"
                  disabled={isAnalyzing}
                  id="cancel-upload-btn"
                >
                  Clear
                </button>
              </div>

              {/* Text Preview Collapse */}
              <div className="mt-4 border-t border-slate-900 pt-3">
                <button
                  type="button"
                  onClick={() => setShowTextPreview(!showTextPreview)}
                  className="flex items-center gap-1 text-xs text-slate-400 hover:text-slate-300 transition"
                  id="toggle-preview-btn"
                >
                  <Terminal className="w-3.5 h-3.5 text-slate-500" />
                  {showTextPreview ? "Hide parsed document content" : "View parsed document content"}
                </button>
                {showTextPreview && (
                  <div className="mt-2 p-3 bg-slate-950 rounded-lg border border-slate-900 max-h-40 overflow-y-auto font-mono text-[11px] text-slate-400 leading-relaxed whitespace-pre-wrap">
                    {parsedText}
                  </div>
                )}
              </div>
            </div>
          ) : (
            <div className="flex flex-col items-center text-center py-4">
              <div className="p-4 bg-slate-950 border border-slate-900 rounded-2xl text-slate-400 hover:text-amber-400 hover:border-amber-500/30 transition duration-300 mb-4 shadow-inner">
                <Upload className="w-8 h-8" />
              </div>
              <p className="text-sm font-semibold text-slate-200">
                Drag and drop resume here, or <span className="text-amber-400 hover:underline">browse</span>
              </p>
              <p className="text-xs text-slate-500 mt-1.5 leading-relaxed">
                Supports PDF, DOCX, and TXT files.<br />
                Files are parsed client-side securely prior to AI forensic audit.
              </p>
            </div>
          )}
        </div>
      </form>

      {/* Interactive Sandbox Dataset Picker when no file has been parsed yet */}
      {!(file || parsedText) && (
        <div className="mb-6 p-4 bg-slate-950/60 border border-slate-900 rounded-xl" id="sandbox-quicktest-box">
          <div className="flex items-center gap-2 mb-3 text-xs font-semibold text-slate-300">
            <Beaker className="w-4 h-4 text-amber-400" />
            <span>Curated Resume Datasets Sandbox</span>
          </div>
          <p className="text-[11px] text-slate-500 mb-3.5 leading-relaxed">
            Test Gemini's real-time resume audit engine on various profile scenarios immediately:
          </p>
          <div className="space-y-2">
            {SANDBOX_DATASETS.map((dataset) => (
              <button
                key={dataset.key}
                onClick={() => loadSandboxDataset(dataset)}
                className="w-full text-left bg-slate-900/60 hover:bg-slate-850 border border-slate-850 hover:border-amber-500/20 p-2.5 rounded-lg flex items-center justify-between gap-3 transition cursor-pointer"
              >
                <div>
                  <p className="text-xs font-bold text-slate-200">{dataset.name}</p>
                  <p className="text-[10px] text-slate-500 mt-0.5">{dataset.role}</p>
                </div>
                <span className={`px-2 py-0.5 text-[9px] font-mono border rounded-md ${dataset.badgeColor}`}>
                  {dataset.badge}
                </span>
              </button>
            ))}
          </div>
        </div>
      )}

      {parsedText && (
        <div className="mt-5 space-y-4 animate-fadeIn">
          <div>
            <label className="block text-xs font-medium text-slate-300 mb-2 flex items-center gap-1.5 justify-between">
              <span>Recruiter screening instructions (Optional)</span>
              <span className="text-[10px] text-slate-500 font-mono">Guides Gemini focus</span>
            </label>
            <textarea
              placeholder="e.g. 'We need at least 3 years of actual production React. Flag any candidates who claim React but don't show real commercial projects. Check dates carefully.'"
              value={customPrompt}
              onChange={(e) => setCustomPrompt(e.target.value)}
              className="w-full h-20 text-xs bg-slate-950 border border-slate-850 focus:border-amber-500 focus:ring-1 focus:ring-amber-500/20 rounded-lg p-3 text-slate-200 placeholder-slate-600 focus:outline-none transition leading-relaxed resize-none"
              disabled={isAnalyzing}
              id="custom-prompt-input"
            />
          </div>

          <button
            onClick={triggerAnalysis}
            disabled={isAnalyzing}
            className="w-full flex items-center justify-center gap-2 bg-gradient-to-r from-amber-500 via-amber-400 to-yellow-500 hover:from-amber-400 hover:to-yellow-300 text-slate-950 text-xs font-bold py-3 px-4 rounded-xl shadow-lg hover:shadow-amber-500/10 active:scale-[0.98] transition duration-200 disabled:opacity-50 disabled:scale-100 btn-premium-shine cursor-pointer"
            id="start-analysis-btn"
          >
            {isAnalyzing ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin text-slate-950" />
                Performing Forensic Audit... (Analyzing Integrity)
              </>
            ) : (
              <>
                <Sparkles className="w-4 h-4 text-slate-950" />
                Run AI Credentials & Fake Detection Audit
              </>
            )}
          </button>
        </div>
      )}
    </div>
  );
}
