export interface FakeIndicator {
  type: 'skill_exaggeration' | 'timeline_inconsistency' | 'unrealistic_experience' | 'ai_generated' | 'missing_projects';
  title: string;
  severity: 'low' | 'medium' | 'high';
  description: string;
  evidence: string[];
}

export interface SkillItem {
  name: string;
  category: string;
  claimedExperienceYears: number;
  estimatedExperienceYears: number;
  confidenceScore: number; // 0 to 100
  status: 'verified' | 'suspicious' | 'exaggerated';
  evidence: string;
}

export interface TimelineEvent {
  id: string;
  role: string;
  company: string;
  startYear: string;
  endYear: string;
  description: string;
  isOverlapOrGap: boolean;
  status: 'valid' | 'suspicious' | 'conflict';
  explanation: string;
}

export interface CustomScoring {
  technicalMatch: number; // 0-100
  timelineIntegrity: number; // 0-100
  experienceRealism: number; // 0-100
  projectBacking: number; // 0-100
  aiFreeProbability: number; // 0-100
  overallScore: number; // Weighted average of the above
}

export interface WordFrequency {
  text: string;
  value: number;
  type: 'skill' | 'buzzword' | 'action' | 'other';
}

export interface Candidate {
  id: string;
  name: string;
  jobTitle: string;
  email: string;
  phone: string;
  location: string;
  education: string;
  summary: string;
  fileName: string;
  fileSize: string;
  uploadedAt: string;
  rawTextLength: number;
  rawText?: string;
  
  // Real vs Fake Verdict
  fakeProbability: number; // 0-100
  verdict: 'Genuine' | 'Suspicious' | 'Highly Exaggerated' | 'Likely AI-Generated';
  verdictExplanation: string;
  
  // Key Highlights & Gaps
  keyQualifications: string[];
  coreGaps: string[];
  
  // Custom Scoring Leaderboard Metrics
  scores: CustomScoring;
  
  // Detailed indicators
  indicators: FakeIndicator[];
  
  // Visuals source data
  skills: SkillItem[];
  timeline: TimelineEvent[];
  wordCloud: WordFrequency[];
}
