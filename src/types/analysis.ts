export interface ResumeAnalysis {
  id: string;
  score: number;
  ats_compatibility: number;
  grammar_score: number;
  readability_score: number;
  strengths: string[];
  weaknesses: string[];
  improvements: string[];
  keywords: string[];
  missing_keywords: string[];
  hard_skills: string[];
  targetDomain: string;
  soft_skills: string[];
  sections_detected: string[];
  missing_sections: string[];
  formatting_issues: string[];
  grammar_issues: string[];
  experience_match: number;
  summary: string;
  bullet_improvements: BulletImprovement[];
  top_projects: { name: string; score: number; reason: string }[];
  scam_flags: string[];
  interview_questions: { question: string; reason: string ; importance: string }[];
}

export interface BulletImprovement {
  original: string;
  improved: string;
  reason: string;
}

export interface JDMatchResult {
  match_percentage: number;
  matched_keywords: string[];
  missing_keywords: string[];
  skill_gaps: string[];
  recommendations: string[];
  role_fit_score: number;
}

export interface CoverLetter {
  content: string;
  tone: string;
  key_points: string[];
}

export interface AnalysisReport {
  id: string;
  user_email: string;
  target_domain: string;
  job_description?: string;
  version_name?: string;
  resume_text?: string;
  analysis_results: ResumeAnalysis;
  jd_match_results?: JDMatchResult;
  cover_letter?: CoverLetter;
  created_at: string;
  updated_at: string;
}

export interface ChatMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
}

export interface UploadResponse {
  success: boolean;
  analysisId: string;
  analysis: ResumeAnalysis;
  extractedText: string;
}

export interface LearningResource {
  title: string;
  type: 'Video' | 'Article' | 'Course' | 'Documentation';
}

export interface SkillPlan {
  skill: string;
  priority: 'High' | 'Medium' | 'Low';
  why_needed: string;
  resources: LearningResource[];
  study_topics: string[];
  time_to_learn: string;
}