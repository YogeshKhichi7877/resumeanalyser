import { Groq } from 'groq-sdk';
import dotenv from 'dotenv';

dotenv.config();

const groq = new Groq({
  apiKey: process.env.GROQ_API_KEY ,
});

    export async function chatWithAssistant(message, resumeContext, targetDomain, conversationHistory) {
  const contextPrompt = resumeContext 
    ? `RESUME CONTEXT: "${resumeContext.substring(0, 1000)}..."`
    : "No resume context available.";
    
  const domainPrompt = targetDomain 
    ? `TARGET ROLE: ${targetDomain.replace('-', ' ')}`
    : "No specific role targeted.";

  const historyPrompt = conversationHistory.length > 0
    ? `CONVERSATION HISTORY:\n${conversationHistory.map(msg => `${msg.role}: ${msg.content}`).join('\n')}`
    : "";

  const prompt = `
    You are an expert resume and career advisor. Help the user with their resume and career questions.
    
    ${contextPrompt}
    ${domainPrompt}
    ${historyPrompt}
    
    USER QUESTION: "${message}"
    
    Provide helpful, specific advice based on the resume context and target role. Be concise but thorough.
    Keep responses under 200 words and focus on actionable advice.
  `;

  try {
    const chatCompletion = await groq.chat.completions.create({
      messages: [
        { role: "system", content: "You are a helpful resume and career advisor. Provide specific, actionable advice." },
        { role: "user", content: prompt }
      ],
      model: "llama-3.3-70b-versatile",
      temperature: 0.6,
      max_completion_tokens: 1024,
    });

    return chatCompletion.choices[0]?.message?.content || "I'm sorry, I couldn't process your question. Please try again.";
  } catch (error) {
    console.error('Chat Assistant Error:', error);
    return "I'm experiencing some technical difficulties. Please try asking your question again.";
  }};


export async function generateCoverLetter(resumeText, jobTitle, userName, companyName, tone) {
  const prompt = `
    Generate a personalized cover letter based on the resume and job description.
    
    RESUME TEXT: "${resumeText}"
    Name of the person: "${userName || 'General position'}"
    JOB TITLE: "${jobTitle}"
    COMPANY: "${companyName || 'the company'}"
    TONE: ${tone}
    
    Create a compelling cover letter that:
    1. Matches the specified tone (${tone})
    2. Highlights relevant experience from the resume
    3. Addresses job requirements
    4. Shows enthusiasm for the role
    5. Is 3-4 paragraphs long
    
    STRICT JSON REQUIREMENT:
    Return ONLY a JSON object. Use "\\n" for line breaks inside the "content" string.
    {
      "content": "Full cover letter text...",
      "tone": "${tone}",
      "personalization": ["point 1", "point 2", "point 3"]
    }
  `;

  try {
    const chatCompletion = await groq.chat.completions.create({
      messages: [
        { 
          role: "system", 
          content: "You are a professional assistant. You must respond ONLY with a valid JSON object. Do not use markdown formatting. Ensure all internal newlines are escaped as '\\n'." 
        },
        { role: "user", content: prompt }
      ],
      model: "llama-3.3-70b-versatile",
      temperature: 0.7,
      max_completion_tokens: 2048,
      response_format: { type: "json_object" } // Forces Groq to output valid JSON
    });

    let responseContent = chatCompletion.choices[0]?.message?.content;

    // 1. Remove any accidental markdown backticks
    let cleanResponse = responseContent.replace(/```json\n?|```/g, '').trim();

    try {
      // 2. Try parsing directly first (Groq's JSON mode is usually perfect)
      return JSON.parse(cleanResponse);
    } catch (e) {
      console.warn("Direct parse failed, attempting surgical repair...");
      
      // 3. SURGICAL FIX: This regex ONLY escapes newlines that are INSIDE double quotes.
      // It leaves the structural newlines (between { } and keys) untouched.
      const repairedJson = cleanResponse.replace(/"([^"\\]*(?:\\.[^"\\]*)*)"/gs, (match) => {
        return match.replace(/\n/g, "\\n").replace(/\r/g, "\\r");
      });

      return JSON.parse(repairedJson);
    }

  } catch (error) {
    console.error('Cover Letter Generation Error:', error);
    // Fallback if the AI fails completely
    return {
      content: `Dear Hiring Manager,\n\nI am writing to express my strong interest in the ${jobTitle} position at ${companyName}. Based on my background, I believe I am a great fit for the team.\n\nSincerely,\n${userName || 'Applicant'}`,
      tone: tone,
      personalization: ["Relevant experience", "Company alignment"]
    };
  }
}

// Enhanced domain-specific analysis prompts
const domainPrompts = {
  'software-engineer': `
    Focus on technical skills, programming languages, software development practices, system design, and project experience.
    Look for: coding languages, frameworks, databases, cloud platforms, DevOps tools, software architecture, algorithms, data structures.
    Evaluate: technical depth, project complexity, problem-solving abilities, code quality practices, team collaboration.
  `,
  'data-scientist': `
    Evaluate data analysis skills, machine learning expertise, statistical knowledge, programming proficiency, and research experience.
    Look for: Python/R, SQL, machine learning libraries, statistical methods, data visualization, big data tools, research publications.
    Evaluate: analytical thinking, model building, data storytelling, business impact, technical communication.
  `,
  'marketing': `
    Assess marketing strategy knowledge, campaign management, digital marketing skills, analytics understanding, and creative abilities.
    Look for: digital marketing channels, analytics tools, campaign metrics, content creation, brand management, market research.
    Evaluate: strategic thinking, creativity, data-driven decision making, ROI optimization, customer understanding.
  `,
  'product-manager': `
    Review product strategy, stakeholder management, technical understanding, market analysis, and leadership experience.
    Look for: product lifecycle, user research, roadmap planning, cross-functional collaboration, metrics tracking, market analysis.
    Evaluate: strategic vision, leadership skills, technical acumen, user empathy, business impact.
  `,
  'design': `
    Focus on design thinking, user experience, visual design skills, portfolio quality, and creative problem-solving.
    Look for: design tools, UX/UI principles, user research, prototyping, design systems, accessibility, portfolio projects.
    Evaluate: creative thinking, user-centered design, visual aesthetics, problem-solving, design process.
  `,
  'sales': `
    Evaluate sales performance, relationship building, negotiation skills, CRM proficiency, and revenue generation.
    Look for: sales metrics, CRM tools, lead generation, client relationships, negotiation experience, revenue targets.
    Evaluate: communication skills, relationship building, results orientation, persistence, customer focus.
  `,
};

export async function analyzeResumeWithGroq(resumeText, targetDomain) {
  const domainContext = domainPrompts[targetDomain] || 'Provide general professional analysis focusing on relevant skills and experience.';
  
  const prompt = `
    You are a cynical, strict Senior Recruiter and Hiring Manager at a top-tier tech firm (FAANG level). 
    Your job is to critically audit this resume for a ${targetDomain.replace('-', ' ')} position. 
    DO NOT be polite. DO NOT give participation points.
    
    Your Goal: Distinguish between a "candidate who did the job" and a "candidate who drove results."
    
    DOMAIN STANDARDS:
    ${domainContext}

    RESUME CONTENT:
    "${resumeText}"

    STRICT ANALYSIS RULES:
    1.  **Scoring:** Be harsh. A score of 80+ should only be for resumes that include clear metrics ($, %, time saved) and zero errors. 
    2.  **Fluff Detection:** Heavily penalize phrases like "Responsible for," "Worked on," or "Assisted with" if they are not followed by a specific outcome.
    3.  **Technical Validity:** If a user lists a skill (e.g., "React") but shows no project/experience using it, mark it as a weak point.
    4.  **Consistency:** Cross-reference the "Skills" section with the "Experience" section. Mismatches are a red flag.

    REQUIRED JSON OUTPUT STRUCTURE (Must be exact):
    1. Overall Score (0-100): Weighted average. Deduct points for generic descriptions.
    2. ATS Compatibility (0-100): Deduct for tables, columns, icons, or lack of standard headers.
    3. Grammar Score (0-100): Deduct for typos, tense inconsistencies, and passive voice.
    4. Readability (0-100): Deduct for dense blocks of text or lack of bullet points.
    5. Experience Match (0-100): How well do the SPECIFIC projects/roles map to the ${targetDomain} domain?
    6. Strengths: 6-7 genuine competitive advantages (e.g., "Quantified impact in 3 roles").
    7. Weaknesses: 6-7 critical flaws (e.g., "Vague descriptions," "Tech stack listed but not demonstrated").
    8. Improvements: 6-10 specific fixes. "Add metrics" is too vague; say "Quantify the API optimization in the 2nd job."
    9. Hard Skills: Extracted from text.
    10. Soft Skills: Extracted from text.
    11. Keywords: Existing keywords found.
    12. Missing Keywords: Critical industry terms missing (be specific to ${targetDomain}).
    13. Sections Detected: List sections found.
    14. Missing Sections: List standard sections missing (Projects, Education, etc.).
    15. Formatting Issues: List specific layout problems.
    16. Grammar Issues: List specific examples of bad grammar.
    17. Bullet Point Improvements: Rewrite weak bullets into high-impact "XYZ format" (Accomplished [X] as measured by [Y], by doing [Z]).Generate at least 4 improvements.
    18. Scam/Overclaim Detection: Find out some scam or overclaim which dont applied on real life , such as scam dates and certificates that dont add any sense .
    19. Summary: Brutally honest executive summary.
    20. Top Projects: Analyze projects based on complexity and technologies used. Score them strictly (0-10). A '10' requires complex architecture + business impact. Give top 4 projects with name, score, and reason.
    21. Interview Questions: Hard technical and behavioral questions based on specific claims in the resume. Generate minimum of 9 questions (3 hard , 3 medium , 3 easy) , maximum you can generate upto 20 questions.

    RESPOND ONLY WITH VALID JSON IN THIS EXACT FORMAT:
    {
      "score": 75,
      "ats_compatibility": 70,
      "grammar_score": 85,
      "readability_score": 80,
      "experience_match": 70,
      "strengths": ["string", "string"],
      "weaknesses": ["string", "string"],
      "improvements": ["string", "string"],
      "hard_skills": ["string", "string"],
      "soft_skills": ["string", "string"],
      "keywords": ["string", "string"],
      "missing_keywords": ["string", "string"],
      "sections_detected": ["string", "string"],
      "missing_sections": ["string", "string"],
      "top_projects": [
        {
          "name": "Project Name",
          "score": 8,
          "reason": "Used microservices architecture and reduced latency by 40%."
        }
      ],
      "formatting_issues": ["string", "string"],
      "grammar_issues": ["string", "string"],
      "bullet_improvements": [
        {
          "original": "Wrote code for the app.",
          "improved": "Architected the core backend services using Node.js, supporting 10k+ concurrent users.",
          "reason": "Replaced passive language with strong action verbs and metrics."
        }
      ],
      "scam_flags": ["string"],
      "interview_questions": [
        {
          "question": "You mentioned optimizing SQL queries. Can you walk me through a specific slow query you fixed and how?",
          "importance": "High",
          "reason": "Validates the database optimization claim."
        }
      ],
      "summary": "string"
    }
  `;

  try {
    console.log(`Starting Groq analysis for ${targetDomain} position...`);
    
    const chatCompletion = await groq.chat.completions.create({
      messages: [
        {
          role: "system",
          content: "You are an expert resume analyzer. Always respond with valid JSON only, no additional text or formatting."
        },
        {
          role: "user",
          content: prompt
        }
      ],
      model: "llama-3.3-70b-versatile",
      temperature: 0.5,
      max_completion_tokens: 4096,
      top_p: 0.95,
      stream: false,
      stop: null
    });

    const responseContent = chatCompletion.choices[0]?.message?.content;
    
    if (!responseContent) {
      throw new Error('No response content from Groq API');
    }

    // Clean and extract JSON from response
    let cleanedResponse = responseContent.trim();
    // Remove any markdown code blocks
    cleanedResponse = cleanedResponse.replace(/```json\n?/g, '').replace(/```\n?/g, '');
    
    // Extract JSON object
    const jsonMatch = cleanedResponse.match(/\{[\s\S]*\}/);
    const jsonString = jsonMatch ? jsonMatch[0] : cleanedResponse;
    
    let analysis;
    try {
        analysis = JSON.parse(jsonString);
    } catch (parseError) {
        console.error("JSON Parse failed. Raw string:", jsonString);
        throw new Error("Failed to parse AI response into JSON");
    }
    
    // Validate required fields
    const requiredFields = ['score', 'ats_compatibility', 'strengths', 'weaknesses', 'improvements', 'summary'];
    for (const field of requiredFields) {
      if (!(field in analysis)) {
        console.warn(`Missing field: ${field}, adding default.`);
        analysis[field] = Array.isArray(analysis[field]) ? [] : "Not provided";
      }
    }

    // Ensure numeric fields are within valid ranges
    analysis.score = Math.max(0, Math.min(100, parseInt(analysis.score) || 0));
    analysis.ats_compatibility = Math.max(0, Math.min(100, parseInt(analysis.ats_compatibility) || 0));
    analysis.grammar_score = Math.max(0, Math.min(100, parseInt(analysis.grammar_score) || 0));
    analysis.readability_score = Math.max(0, Math.min(100, parseInt(analysis.readability_score) || 0));
    analysis.experience_match = Math.max(0, Math.min(100, parseInt(analysis.experience_match) || 0));

    // Ensure arrays exist
    analysis.top_projects = Array.isArray(analysis.top_projects) ? analysis.top_projects : [];
    analysis.interview_questions = Array.isArray(analysis.interview_questions) ? analysis.interview_questions : [];
    analysis.bullet_improvements = Array.isArray(analysis.bullet_improvements) ? analysis.bullet_improvements : [];

    console.log('Successfully parsed Groq analysis');
    return analysis;

  } catch (error) {
    console.error('Groq Analysis Error:', error);
    
    // Fallback response to prevent crash
    return {
      score: 50,
      ats_compatibility: 50,
      grammar_score: 50,
      readability_score: 50,
      experience_match: 50,
      strengths: ["Unable to analyze due to AI service error"],
      weaknesses: ["Please try again later"],
      improvements: ["Check internet connection and retry"],
      hard_skills: [],
      soft_skills: [],
      keywords: [],
      missing_keywords: [],
      sections_detected: [],
      missing_sections: [],
      formatting_issues: [],
      grammar_issues: [],
      top_projects: [],
      interview_questions: [],
      bullet_improvements: [
        {
          original: "System Error",
          improved: "Please try again",
          reason: "AI Service Timeout"
        }
      ],
      scam_flags: [],
      summary: "An error occurred while communicating with the AI analysis service. Please try again."
    };
  }
}

export async function matchResumeWithJD(resumeText, jobDescription, targetDomain) {
 const prompt = `
    Act as a strict, algorithmic Applicant Tracking System (ATS) and a skepticism-heavy Hiring Manager. 
    Your task is to calculate the precise fit between a candidate and a specific Job Description (JD).

    RESUME TEXT:
    "${resumeText.substring(0, 8000)}"
    
    JOB DESCRIPTION:
    "${jobDescription.substring(0, 8000)}"
    
    TARGET DOMAIN: ${targetDomain}

    ANALYSIS INSTRUCTIONS:
    1.  **Deconstruct the JD:** Identify "Must-Have" skills vs. "Nice-to-Have" skills.
    2.  **Verify Claims:** If the JD requires "5 years of Python" and the resume lists "Python" but only shows 1 year of experience, that is a GAP, not a match.
    3.  **Semantic Matching:** Recognize equivalents (e.g., "PostgreSQL" matches "SQL", but "Java" does NOT match "JavaScript").
    4.  **Seniority Check:** If JD asks for "Lead/Senior" and resume reads like a "Junior/Mid", the "role_fit_score" must be under 60.

    SCORING LOGIC:
    - **Match Percentage:** Pure technical/hard skill overlap.
    - **Role Fit Score:** Cultural fit, seniority alignment, and soft skills.
    - **Strictness:** Do not give 90%+ unless the candidate is a perfect unicorn match. A good candidate usually scores 70-80%.

    OUTPUT REQUIREMENTS (JSON ONLY):
    Return a valid JSON object with these exact keys. 
    - "matched_keywords": Only list skills actually found in BOTH texts.
    - "missing_keywords": List CRITICAL skills found in JD but missing/weak in Resume.
    - "skill_gaps": Explain the gap (e.g., "JD requires React, Resume only mentions Angular").
    - "recommendations": Actionable advice to bridge the gap (e.g., "Highlight your leadership experience to match the Senior title").

    JSON STRUCTURE:
    {
      "match_percentage": 75,
      "role_fit_score": 80,
      "matched_keywords": ["keyword1", "keyword2"],
      "missing_keywords": ["missing1", "missing2"],
      "skill_gaps": ["gap1", "gap2"],
      "recommendations": ["rec1", "rec2"]
    }
  `;

  try {
    const chatCompletion = await groq.chat.completions.create({
      messages: [
        { role: "system", content: "You are an expert resume-job matching analyst. Respond with valid JSON only." },
        { role: "user", content: prompt }
      ],
      model: "llama-3.3-70b-versatile",
      temperature: 0.5,
      max_completion_tokens: 2048,
    });

    const responseContent = chatCompletion.choices[0]?.message?.content;
    const cleanedResponse = responseContent.replace(/```json\n?/g, '').replace(/```\n?/g, '');
    const jsonMatch = cleanedResponse.match(/\{[\s\S]*\}/);
    const jsonString = jsonMatch ? jsonMatch[0] : cleanedResponse;
    
    return JSON.parse(jsonString);
  } catch (error) {
    console.error('JD Match Error:', error);
    return {
      match_percentage: 65,
      role_fit_score: 70,
      matched_keywords: ["experience", "skills", "education"],
      missing_keywords: ["specific technology", "industry certification", "leadership"],
      skill_gaps: ["Need more specific technical skills", "Could improve industry knowledge"],
      recommendations: ["Add missing keywords to resume", "Quantify achievements with metrics", "Highlight relevant experience"]
    };
  }
}

export async function rewriteBulletPoints(bulletText) {
  const prompt = `
    You are an expert Resume Editor for Senior Engineering and Management roles.
    Your job is to rewrite the following resume bullet point using the "Google XYZ Formula":
    "Accomplished [X] as measured by [Y], by doing [Z]."

    ORIGINAL TEXT:
    "${bulletText}"

    INSTRUCTIONS:
    1.  **Action First:** Start with a high-impact power verb (e.g., Engineered, Spearheaded, Optimized, not "Helped" or "Worked on").
    2.  **Add Metric Placeholders:** If the input lacks numbers, you MUST add realistic placeholders like "[X]%" or "$[Y]k" to show the user where data belongs.
    3.  **Focus on Impact:** Shift the focus from "what I did" (tasks) to "what I achieved" (business value).
    4.  **Remove Fluff:** Eliminate passive words like "Responsible for," "Tasked with," or "Assisted."

    EXAMPLES:
    - Input: "Fixed bugs in the login system."
    - Output: "Reduced user login errors by [20]% by debugging and refactoring the legacy authentication microservice."
    
    - Input: "Managed a team of sales people."
    - Output: "Led a team of [12] sales representatives to achieve $[1.5]M in annual revenue, exceeding targets by [15]%."

    RESPOND WITH VALID JSON ONLY:
    {
      "improved": "Your highly optimized version here...",
      "reason": "Brief explanation of the specific strategy used (e.g., 'Added metric placeholder and switched to active voice')."
    }
  `;

  try {
    const chatCompletion = await groq.chat.completions.create({
      messages: [
        { role: "system", content: "You are an expert resume writer. Improve bullet points to be more impactful." },
        { role: "user", content: prompt }
      ],
      model: "llama-3.3-70b-versatile",
      temperature: 0.6,
      max_completion_tokens: 1024,
    });

    const responseContent = chatCompletion.choices[0]?.message?.content;
    const cleanedResponse = responseContent.replace(/```json\n?/g, '').replace(/```\n?/g, '');
    const jsonMatch = cleanedResponse.match(/\{[\s\S]*\}/);
    const jsonString = jsonMatch ? jsonMatch[0] : cleanedResponse;
    
    return JSON.parse(jsonString);
  } catch (error) {
    console.error('Bullet Rewrite Error:', error);
    return {
      improved: "Led cross-functional initiatives resulting in measurable business impact and improved operational efficiency",
      reason: "Added leadership action verb, mentioned cross-functional collaboration, and highlighted measurable outcomes"
    };
  }
}

export async function enhanceFullResume(resumeText, tone , targetRole) {
  
  const prompt = `
    You are a Top-Tier Executive Resume Writer and Career Coach. 
    Your task is to completely rewrite and elevate the following resume text for a ${targetRole} position, using a ${tone} tone.

    RESUME TEXT:
    "${resumeText.substring(0, 15000)}"

    CRITICAL INSTRUCTIONS:
    1.  **Transform Logic:** Convert passive tasks ("Responsible for...") into active achievements ("Orchestrated... resulting in...").
    2.  **The XYZ Formula:** Rewrite bullet points to follow: "Accomplished [X] as measured by [Y], by doing [Z]."
    3.  **Metrics Injection:** If exact numbers are missing, insert realistic placeholders like "[X]%" or "$[Y]k" so the user knows where to add data.
    4.  **Keyword Optimization:** Seamlessly integrate high-value keywords relevant to ${targetRole} (e.g., CI/CD, ROI analysis, Stakeholder Management) without keyword stuffing.
    5.  **Executive Summary:** If a summary exists (or if one is missing), write a powerful 3-sentence "Elevator Pitch" at the top.
    6.  **Structure:** Ensure the output uses clean, standard markdown formatting (Headers, Bullet points).

    OUTPUT REQUIREMENTS:
    Return a valid JSON object. 
    - "content": The FULL rewritten resume text (formatted with Markdown).
    - "improvements": A specific list of 3-5 major changes you made and why (e.g., "Changed passive voice to active voice in Experience section").

    RESPOND WITH VALID JSON ONLY:
    {
      "content": "# Name\\n## Summary\\n...",
      "improvements": ["Changed X to Y because...", "Added metric placeholders..."]
    }
  `;
  
  try {
    console.log(`Starting Groq resume enhancement for ${targetRole} position...`);

    const chatCompletion = await groq.chat.completions.create({
      messages: [
        {
          role: "system",
          content: "You are an expert resume enhancer. Always respond with valid JSON only, no additional text or formatting."
        },
        {
          role: "user",
          content: prompt
        }
      ],
      model: "llama-3.3-70b-versatile",
      temperature: 0.6,
      max_completion_tokens: 4096,
      top_p: 0.95,
      stream: false,
      stop: null
    });

    const responseContent = chatCompletion.choices[0]?.message?.content;
    
    if (!responseContent) {
      throw new Error('No response content from Groq API');
    }

    console.log('Raw Groq enhancement response:', responseContent);

    // Clean and extract JSON from response
    let cleanedResponse = responseContent.trim();
    
    // Remove any markdown code blocks
    cleanedResponse = cleanedResponse.replace(/```json\n?/g, '').replace(/```\n?/g, '');
    
    // Extract JSON object
    const jsonMatch = cleanedResponse.match(/\{[\s\S]*\}/);
    const jsonString = jsonMatch ? jsonMatch[0] : cleanedResponse;

    return JSON.parse(jsonString);
  } catch (error) {
    console.error('Resume Enhancement Error:', error);
    return {
      enhanced_resume: "Full enhanced resume text...",
      key_improvements: ["Improvement 1", "Improvement 2", "Improvement 3"]
    };
  }
}

export async function generateInterviewQuestions(resumeText, targetDomain) {

  const prompt = `
    You are a Technical Hiring Manager at a top tech company. 
    Your goal is to generate a challenging, domain-specific interview script based on the candidate's resume and the target role: ${targetDomain}.

    RESUME CONTENT:
    "${resumeText.substring(0, 10000)}"

    INSTRUCTIONS:
    1.  **Deep Dive:** Do not ask generic questions like "What is your strength?". Ask specific questions about their listed projects and skills.
    2.  **Challenge Claims:** If they list "High-Traffic Systems," ask about load balancing or caching strategies.
    3.  **Mix Categories:** Generate a mix of:
        - **Technical Deep Dives:** Validating hard skills.
        - **System Design/Architecture:** Testing high-level thinking.
        - **Behavioral/STAR:** "Tell me about a time you failed..." related to their specific history.
    4.  **Difficulty Levels:** Include Easy (Warm-up), Medium (Standard), and Hard (Bar-raiser) questions.

    RESPOND WITH VALID JSON ONLY:
    {
      "questions": [
        {
          "question": "You mentioned reducing API latency by 30%. What specific profiling tools did you use to identify the bottlenecks?",
          "type": "Technical",
          "difficulty": "Hard",
          "context": "Validates the optimization claim in the 'E-commerce Project'."
        },
        {
          "question": "Can you explain the difference between TCP and UDP?",
          "type": "Conceptual",
          "difficulty": "Easy",
          "context": "Basic networking knowledge check."
        }
      ]
    }
  `;

  try {
    console.log(`Starting Groq interview question generation for ${targetDomain}...`);

    const chatCompletion = await groq.chat.completions.create({
      messages: [
        {
          role: "system",
          content: "You are an expert interview question generator. Always respond with valid JSON only, no additional text or formatting."
        },
        {
          role: "user",
          content: prompt
        }
      ],
      model: "llama-3.3-70b-versatile",
      temperature: 0.6,
      max_completion_tokens: 4096,
      top_p: 0.95,
      stream: false,
      stop: null
    });

    const responseContent = chatCompletion.choices[0]?.message?.content;

    if (!responseContent) {
      throw new Error('No response content from Groq API');
    }

    console.log('Raw Groq interview question response:', responseContent);

    // Clean and extract JSON from response
    let cleanedResponse = responseContent.trim();

    // Remove any markdown code blocks
    cleanedResponse = cleanedResponse.replace(/```json\n?/g, '').replace(/```\n?/g, '');

    // Extract JSON object
    const jsonMatch = cleanedResponse.match(/\{[\s\S]*\}/);
    const jsonString = jsonMatch ? jsonMatch[0] : cleanedResponse;

    return JSON.parse(jsonString);
  } catch (error) {
    console.error('Interview Question Generation Error:', error);
    return {
      questions: ["What is your greatest strength?", "What is your greatest weakness?", "Why do you want to work here?"]
    };
  }
}




export async function roastResume(resumeText) {
  const prompt = `
    You are a Brutal, Savage Career Coach (think Gordon Ramsay meets a Tech Recruiter). 
    Your task is to ROAST this resume. 
    
    RESUME TEXT: "${resumeText.substring(0, 5000)}"

    RULES:
    1. Be mean but funny. Use sarcasm.
    2. Call out specific clichés (e.g., "Passionate," "Hard worker").
    3. Mock the formatting or lack of metrics.
    4. Keep it under 200 words.
    5. End with one tiny piece of actual good advice, but deliver it condescendingly.

    Output format: Plain text, just the roast.
  `;

  try {
    const chatCompletion = await groq.chat.completions.create({
      messages: [{ role: "user", content: prompt }],
      model: "llama-3.3-70b-versatile",
      temperature: 0.8, // High temperature for creativity/humor
    });

    return chatCompletion.choices[0]?.message?.content || "Your resume is so bad I'm speechless.";
  } catch (error) {
    console.error("Roast Error:", error);
    return "I tried to roast you, but my servers crashed from the mediocrity.";
  }
}





export async function generateLearningPath(missingSkills, targetDomain) {
  if (!missingSkills || missingSkills.length === 0) {
    return [];
  }

  // We limit to top 5 skills to save tokens and keep the plan focused
  const topSkills = missingSkills.slice(0, 5).join(', ');

  const prompt = `
    You are a Senior Technical Mentor. The user is aiming for a ${targetDomain} role but lacks these specific skills: ${topSkills}.
    
    Create a concrete learning path for these specific missing skills.
    
    For each skill, provide:
    1. "priority": High/Medium/Low based on the ${targetDomain} market.
    2. "why_needed": One sentence on why this is crucial for the role.
    3. "resources": 2-3 SPECIFIC recommendations (e.g., "Official React Documentation", "FreeCodeCamp: Docker for Beginners", "Coursera: Andrew Ng ML"). DO NOT invent fake URLs. Just give the resource name and type (Video, Article, Course).
    4. "study_topics": 3 specific sub-concepts to master (e.g., for React: "Hooks", "Context API", "Virtual DOM").
    5. "time_to_learn": Estimated time to get basics (e.g., "2 weeks").

    RESPOND ONLY WITH VALID JSON ARRAY:
    [
      {
        "skill": "Skill Name",
        "priority": "High",
        "why_needed": "Reason...",
        "resources": [
          { "title": "Resource Name", "type": "Video" }
        ],
        "study_topics": ["Topic 1", "Topic 2"],
        "time_to_learn": "1 week"
      }
    ]
  `;

  try {
    const chatCompletion = await groq.chat.completions.create({
      messages: [
        { role: "system", content: "You are a helpful technical mentor. Output JSON only." },
        { role: "user", content: prompt }
      ],
      model: "llama-3.3-70b-versatile",
      temperature: 0.3, // Lower temperature for more grounded facts
      max_completion_tokens: 2048,
    });

    const response = chatCompletion.choices[0]?.message?.content || "[]";
    const cleanJson = response.replace(/```json\n?/g, '').replace(/```\n?/g, '').trim();
    
    return JSON.parse(cleanJson);
  } catch (error) {
    console.error("Error generating learning path:", error);
    throw new Error("Failed to generate learning path");
  }
}