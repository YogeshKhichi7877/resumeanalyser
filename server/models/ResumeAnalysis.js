import mongoose from 'mongoose';

const resumeAnalysisSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  userEmail: {
    type: String,
    required: true
  },
  targetDomain: {
    type: String,
    required: true
  },
  resumeText: {
    type: String,
    // increased limit just in case
    maxlength: 50000 
  },
  analysisResults: {
    score: { type: Number, required: true },
    ats_compatibility: { type: Number, required: true },
    grammar_score: { type: Number, default: 0 },
    readability_score: { type: Number, default: 0 },
    experience_match: { type: Number, default: 0 },
    
    // Arrays of strings
    strengths: [String],
    weaknesses: [String],
    improvements: [String],
    hard_skills: [String],
    soft_skills: [String],
    keywords: [String],
    missing_keywords: [String],
    sections_detected: [String],
    missing_sections: [String],
    formatting_issues: [String],
    grammar_issues: [String],
    scam_flags: [String],
    
    // Complex Objects
    bullet_improvements: [{
      original: String,
      improved: String,
      reason: String
    }],
    
    // --- NEW FIELDS ADDED FOR YOUR PROMPT ---
    top_projects: [{
      name: String,
      score: Number,
      reason: String
    }],
    interview_questions: [{
      question: String,
      importance: String,
      reason: String
    }],
    // ----------------------------------------

    summary: String
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
}, {
  timestamps: true 
});

const ResumeAnalysis = mongoose.model('ResumeAnalysis', resumeAnalysisSchema);
export default ResumeAnalysis;