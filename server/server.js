import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import multer from 'multer';
import pdfParse from 'pdf-parse';
import { Groq } from 'groq-sdk';
import connectDB from './config/database.js';
import ResumeAnalysis from './models/ResumeAnalysis.js';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import User from './models/User.js';

import { 
  analyzeResumeWithGroq, 
  matchResumeWithJD, 
  generateCoverLetter, 
  chatWithAssistant, 
  rewriteBulletPoints,
  enhanceFullResume,
  roastResume,
  generateLearningPath
} from './utils/groqAnalyzer.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3011;

// Connect to MongoDB
connectDB();

const allowedOrigins = [
  "http://localhost:5173",            
  "http://localhost:3011",             
  "https://resume-analyser-mwlu.onrender.com" 
];

// Middleware
app.use(cors({
  origin: function (origin, callback) {
    // Allow requests with no origin (like Postman, curl, or mobile apps)
    if (!origin) return callback(null, true);
    
    if (allowedOrigins.indexOf(origin) !== -1) {
      // Origin is in the whitelist
      callback(null, true);
    } else {
      // Origin is NOT allowed
      console.log("🚫 Blocked by CORS:", origin);
      callback(new Error('Not allowed by CORS'));
    }
  },
  methods: ['GET', 'POST', 'PUT', 'DELETE'], 
  allowedHeaders: ['Content-Type', 'Authorization'], 
  credentials: true 
}));

app.use(express.json());
// Error handling middleware
app.use((error, req, res, next) => {
  if (error instanceof multer.MulterError) {
    if (error.code === 'LIMIT_FILE_SIZE') {
      return res.status(400).json({ error: 'File too large. Maximum size is 5MB.' });
    }
  }
  console.error('Server error:', error);
  res.status(500).json({ error: 'Internal server error' });
});

 const groq = new Groq({
      apiKey: process.env.GROQ_API_KEY ,
     });
// Multer configuration for file uploads
const storage = multer.memoryStorage();
const upload = multer({ 
  storage: storage,
  fileFilter: (req, file, cb) => {
    if (file.mimetype === 'application/pdf') {
      cb(null, true);
    } else {
      cb(new Error('Only PDF files are allowed'), false);
    }
  },
  limits: { fileSize: 5 * 1024 * 1024 } // 5MB limit
});


const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: '5d' });
};

const protect = async (req, res, next) => {
  let token;

  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith('Bearer')
  ) {
    try {
      // Get token from header (Format: "Bearer <token>")
      token = req.headers.authorization.split(' ')[1];

      // Verify token
      const decoded = jwt.verify(token, process.env.JWT_SECRET);

      // Get user from the token and attach to request
      req.user = await User.findById(decoded.id).select('-password');

      next(); // Move to the next step (the upload)
    } catch (error) {
      console.error(error);
      res.status(401).json({ error: 'Not authorized, token failed' });
    }
  }

  if (!token) {
    res.status(401).json({ error: 'Not authorized, no token' });
  }
};


app.post('/api/resume/upload', upload.single('resume'), async (req, res) => {
  try {
    // 1. File Validation
    if (!req.file) {
      return res.status(400).json({ error: 'No resume file uploaded' });
    }

    const userEmail = req.body.userEmail || (req.user ? req.user.email : null);
    
    // Change 'const' to 'let' so we can update it after DB lookup
    let userId = req.body.userId || (req.user ? req.user._id : null);

    if (!userEmail) {
      console.log("❌ Missing User Email. Body:", req.body);
      return res.status(401).json({ 
        error: 'Unauthorized. User Email is required to save this report.' 
      });
    }

    // 3. Resolve User ID from Database
    // This fixes the "User not found" or "Invalid ID" issues
    const existingUser = await User.findOne({ email: userEmail });
    
    if (existingUser) {
      userId = existingUser._id; // Now works because userId is 'let'
    } else {
      // If user doesn't exist, stop here (or create a guest user if you prefer)
      return res.status(404).json({ error: 'User account not found. Please log in first.' });
    }

    // 4. Extract Text from PDF
    console.log("📄 Parsing PDF...");
    const pdfBuffer = req.file.buffer;
    const pdfData = await pdfParse(pdfBuffer);
    
    // Clean text to avoid issues with JSON parsing later
    const resumeText = pdfData.text.replace(/\n/g, " ").replace(/[^\x20-\x7E]/g, '');

    // 5. Target Domain Setup
    const targetDomain = req.body.targetDomain || 'software-engineer';
    
    console.log(`🧠 Analyzing for domain: ${targetDomain}...`);

    // 6. Call AI Analyzer
    const analysisResults = await analyzeResumeWithGroq(resumeText, targetDomain);

    // 7. Create & Save Database Entry
    console.log("💾 Saving to MongoDB...");

    const newAnalysis = new ResumeAnalysis({
      user: userId,
      userEmail: userEmail,
      targetDomain: targetDomain,
      resumeText: resumeText,
      analysisResults: analysisResults 
    });

    await newAnalysis.save();

    res.json({
      success: true,
      analysisId: newAnalysis._id,
      results: analysisResults,
      extractedText: resumeText
    });

  } catch (error) {
    console.error('Resume Analysis Error:', error);
    res.status(500).json({ 
      error: 'Failed to process resume', 
      details: error.message 
    });
  }
});



app.post('/api/resume/roast', async (req, res) => {
  try {
    const { resumeText } = req.body;
    if (!resumeText) return res.status(400).json({ error: 'No resume text provided' });
 console.log("🔥 Roasting Resume...");
    const roast = await roastResume(resumeText);
    res.json({ success: true, roast:roast });
  } catch (error) {
    res.status(500).json({ error: 'Roast failed' });
  }
});


app.post('/api/resume/learning-path', async (req, res) => {
  try {
    const { missingSkills, targetDomain } = req.body;

    if (!missingSkills || !Array.isArray(missingSkills)) {
      return res.status(400).json({ error: 'Missing skills array is required' });
    }

    console.log(`📚 Generating Learning Path for: ${targetDomain}`);
    const learningPath = await generateLearningPath(missingSkills, targetDomain);

    res.json({ success: true, learningPath });
  } catch (error) {
    console.error('Learning Path Error:', error);
    res.status(500).json({ error: 'Failed to generate learning path' });
  }
});


app.post('/api/auth/register',async (req, res) => {
  try {
    const { name, email, password } = req.body;

    const userExists = await User.findOne({ email });
    if (userExists) {
      return res.status(400).json({ error: 'User already exists' });
    }

    // Hash password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const user = await User.create({
      name,
      email,
      password: hashedPassword,
    });

    if (user) {
      res.status(201).json({
        _id: user._id,
        name: user.name,
        email: user.email,
        token: generateToken(user._id), // <--- Sends REAL token
      });
    }
  } catch (error) {
    res.status(400).json({ error: 'Invalid user data' });
  }
});


app.post('/api/auth/login', protect,async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });

    if (user && (await bcrypt.compare(password, user.password))) {
      res.json({
        _id: user._id,
        name: user.name,
        email: user.email,
        token: generateToken(user._id), // <--- Sends REAL token
      });
    } else {
      res.status(401).json({ error: 'Invalid email or password' });
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});


app.post('/api/resume/analyze', async (req, res) => {
  try {
    const { resumeText, targetDomain } = req.body;
    
    if (!resumeText || !targetDomain) {
      return res.status(400).json({ error: 'Resume text and target domain are required' });
    }

    const analysis = await analyzeResumeWithGroq(resumeText, targetDomain);
    
    res.json({ success: true, analysis }); 

  } catch (error) {
    console.error('Analysis error:', error);
    res.status(500).json({ error: 'Analysis failed: ' + error.message });
  }
});


app.post('/api/resume/jd-match', async (req, res) => {
  try {
    const { resumeText, jobDescription, targetDomain } = req.body;
    
    if (!resumeText || !jobDescription) {
      return res.status(400).json({ error: 'Resume text and job description are required' });
    }

    const matchResult = await matchResumeWithJD(resumeText, jobDescription, targetDomain);
    res.json({ success: true, matchResult });
  } catch (error) {
    console.error('JD Match error:', error);
    res.status(500).json({ error: 'JD matching failed: ' + error.message });
  }
});


app.post('/api/resume/rewrite', async (req, res) => {
  try {
    const { bulletText } = req.body;
    
    if (!bulletText) {
      return res.status(400).json({ error: 'Bullet text is required' });
    }

    const improvement = await rewriteBulletPoints(bulletText);
    res.json({ success: true, improvement });
  } catch (error) {
    console.error('Rewrite error:', error);
    res.status(500).json({ error: 'Rewriting failed: ' + error.message });
  }
});


app.post('/api/resume/cover-letter', async (req, res) => {
  try {
    const { resumeText, jobDescription, jobTitle, companyName, tone } = req.body;
    
    if (!resumeText || !jobTitle) {
      return res.status(400).json({ error: 'Resume text and job title are required' });
    }

    const coverLetter = await generateCoverLetter(resumeText, jobDescription, jobTitle, companyName, tone);
    res.json({ success: true, coverLetter });
  } catch (error) {
    console.error('Cover letter error:', error);
    res.status(500).json({ error: 'Cover letter generation failed: ' + error.message });
  }
});


app.post('/api/chat', async (req, res) => {
  try {
    const { message, resumeContext, targetDomain, conversationHistory } = req.body;
    
    if (!message) {
      return res.status(400).json({ error: 'Message is required' });
    }

    const response = await chatWithAssistant(message, resumeContext, targetDomain, conversationHistory || []);
    res.json({ success: true, response });
  } catch (error) {
    console.error('Chat error:', error);
    res.status(500).json({ error: 'Chat failed: ' + error.message });
  }
});


app.post('/api/graph/upload', upload.single('resume'), async (req, res) => {
  try {
    if (!req.file) return res.status(400).json({ error: 'No file uploaded' });

    // 1. Extract Text from PDF
    const pdfBuffer = req.file.buffer;
    const pdfData = await pdfParse(pdfBuffer);
    const resumeText = pdfData.text;
    const targetRole = req.body.targetRole || "Full Stack Developer";

    console.log(`Analyzing resume for role: ${targetRole}...`);

    // 2. Ask AI to build the Graph JSON
    const prompt = `
      Analyze this resume text: "${resumeText.substring(0, 1500)}..."
      Target Role: "${targetRole}"

      Create a knowledge graph of technical skills.
      1. Identify "current" skills the user HAS.
      2. Identify "missing" skills CRITICAL for the Target Role.
      3. Create logical "links" (prerequisites).

      Return strictly valid JSON matching this structure:
      {
        "nodes": [
          { "id": "Skill Name", "group": "current" (if found) or "missing" (if needed), "val": 1-10 (importance), "desc": "Short reason why" }
        ],
        "links": [
          { "source": "Skill Name", "target": "Skill Name" }
        ]
      }
      Limit to 15-20 nodes.
    `;

    const chatCompletion = await groq.chat.completions.create({
      messages: [{ role: "user", content: prompt }],
      model: "llama-3.3-70b-versatile",
      response_format: { type: "json_object" }
    });

    const graphData = JSON.parse(chatCompletion.choices[0]?.message?.content || "{}");
    
    // 3. Send back the graph data
    res.json({ success: true, graph: graphData });

  } catch (error) {
    console.error('Graph Error:', error);
    res.status(500).json({ error: error.message });
  }
});

// --- ROUTE: Resume Battle (File Upload Version) ---
app.post('/api/resume/compare', upload.fields([{ name: 'resume1' }, { name: 'resume2' }]), async (req, res) => {
  try {
    const files = req.files;

    if (!files || !files.resume1 || !files.resume2) {
      return res.status(400).json({ error: 'Both resume files (resume1, resume2) are required' });
    }

    // 1. Extract text from both PDFs (Parallel for speed)
    const [pdf1Data, pdf2Data] = await Promise.all([
      pdfParse(files.resume1[0].buffer),
      pdfParse(files.resume2[0].buffer)
    ]);

    const text1 = pdf1Data.text;
    const text2 = pdf2Data.text;

    // 2. Analyze both resumes individually to get raw stats (Parallel)
    const [analysis1, analysis2] = await Promise.all([
      analyzeResumeWithGroq(text1, 'software-engineer'),
      analyzeResumeWithGroq(text2, 'software-engineer')
    ]);

    const battlePrompt = `
      Act as a Hiring Manager. I have two candidates.
      
      CANDIDATE A (Score: ${analysis1.score}): "${text1.substring(0, 1500)}..."
      CANDIDATE B (Score: ${analysis2.score}): "${text2.substring(0, 1500)}..."
      
      Compare them decisively.
      Return a JSON object with:
      {
        "winner": "Candidate A" or "Candidate B" or "Tie",
        "winner_id": "resume1" or "resume2",
        "verdict": "A 1-sentence punchy summary of why the winner won.",
        "better_points": ["Point 1 (e.g. Better quantification)", "Point 2 (e.g. Stronger stack)"],
        "worse_points": ["Point 1 (e.g. Vague descriptions)", "Point 2 (e.g. Typos)"]
      }
    `;

    const battleCompletion = await groq.chat.completions.create({
      messages: [{ role: "user", content: battlePrompt }],
      model: "llama-3.3-70b-versatile",
      response_format: { type: "json_object" }
    });

    const battleResult = JSON.parse(battleCompletion.choices[0]?.message?.content || "{}");

    // 4. Calculate Mathematical Differences (Your existing logic)
    const statsDiff = {
      score_diff: analysis2.score - analysis1.score,
      skills_added: analysis2.hard_skills.filter(s => !analysis1.hard_skills.includes(s)),
      skills_removed: analysis1.hard_skills.filter(s => !analysis2.hard_skills.includes(s)),
    };

    // 5. Final Response
    res.json({
      success: true,
      data: {
        resume1: analysis1,
        resume2: analysis2,
        battle: battleResult, // The AI judgment
        stats: statsDiff      // The raw numbers
      }
    });

  } catch (error) {
    console.error('Comparison error:', error);
    res.status(500).json({ error: 'Comparison failed: ' + error.message });
  }
});

app.post('/api/resume/enhance', async (req, res) => {
  try {
    const { resumeText, tone, targetRole } = req.body;
    
    if (!resumeText) {
      return res.status(400).json({ error: 'Resume text is required' });
    }

    const enhancedResume = await enhanceFullResume(resumeText, tone, targetRole);
    res.json({ success: true, enhancedResume });
  } catch (error) {
    console.error('Enhancement error:', error);
    res.status(500).json({ error: 'Enhancement failed: ' + error.message });
  }
});

app.post('/api/resume/cover-letter-enhanced', async (req, res) => {
  try {
    const { userName, jobTitle, companyName, tone, resumeText } = req.body;
    
    if (!userName || !jobTitle) {
      return res.status(400).json({ error: 'User name and job title are required' });
    }
    const coverLetter = await generateCoverLetter(resumeText, jobTitle, userName, companyName, tone);
    console.log("cover letter (line 275) :" , coverLetter);
    res.json({ success: true, coverLetter });
  } catch (error) {
    console.error('Enhanced cover letter error:', error);
    res.status(500).json({ error: 'Enhanced cover letter generation failed: ' + error.message });
  }
});


app.get('/api/health', (req, res) => {
  res.json({ 
    status: 'OK', 
    timestamp: new Date().toISOString(),
    database: 'MongoDB Connected',
    ai_provider: 'Groq (llama-3.3-70b-versatile)'
  });
});

app.get('/' , (req , res)=>{
  res.send("Server is ok ")
})

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
  console.log(`Health check: http://localhost:${PORT}/api/health`);
});