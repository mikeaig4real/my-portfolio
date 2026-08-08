export const ZOD_SCHEMA_JSON_STRUCTURE = `{
  "profile": {
    "name": "Full Name",
    "title": "Professional Title / Headline",
    "bio": "Compelling bio (2-3 sentences)",
    "avatar": "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=600&q=80",
    "location": "City, Country or Remote",
    "availability": "Available for Senior Roles & Contracts",
    "email": "email@example.com",
    "resumeUrl": "",
    "githubUrl": "https://github.com/username",
    "statusEmoji": "⚡"
  },
  "workplaces": [
    {
      "id": "work_1",
      "company": "Company Name",
      "role": "Role Title",
      "period": "Oct 2025 - Present",
      "location": "Remote | Country",
      "description": "Comprehensive responsibilities and metrics",
      "skills": ["React", "TypeScript", "Node.js", "Python", "FastAPI"],
      "isCurrent": true,
      "logoBg": "bg-yellow-300"
    }
  ],
  "projects": [
    {
      "id": "proj_1",
      "title": "Project Name",
      "tagline": "Short Catchy Tagline",
      "description": "Detailed project description",
      "category": "Web App / AI App",
      "coverImage": "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=600&q=80",
      "galleryImages": [],
      "viewType": "featured",
      "tags": ["React", "Node.js", "TypeScript"],
      "accentColor": "#ff9f1c",
      "metric": { "label": "Accuracy", "value": "99.4%" },
      "demoUrl": "https://example.com",
      "githubUrl": "https://github.com",
      "featured": true,
      "order": 1
    }
  ],
  "skills": [
    {
      "id": "sg_1",
      "category": "Frontend & Frameworks",
      "badgeColor": "bg-yellow-300",
      "skills": ["HTML5", "CSS3", "JavaScript", "TypeScript", "React", "Next.js", "Vue", "Redux", "Tailwind"]
    },
    {
      "id": "sg_2",
      "category": "Backend & Services",
      "badgeColor": "bg-blue-300",
      "skills": ["Node.js", "Express", "Nest.js", "Python", "FastAPI", "GraphQL", "Socket.io"]
    },
    {
      "id": "sg_3",
      "category": "AI, Agentic & MCP Tools",
      "badgeColor": "bg-purple-300",
      "skills": ["OpenAI Agents SDK", "LangChain", "LiteLLM", "FastMCP", "HuggingFace", "ChromaDB", "pgvector"]
    },
    {
      "id": "sg_4",
      "category": "Databases, Cloud & DevOps",
      "badgeColor": "bg-green-300",
      "skills": ["PostgreSQL", "MongoDB", "MySQL", "SQLite", "Redis", "Docker", "GCP", "AWS", "GitHub Actions"]
    }
  ],
  "socials": [
    { "id": "soc_1", "platform": "GitHub", "url": "https://github.com", "username": "@username" },
    { "id": "soc_2", "platform": "LinkedIn", "url": "https://linkedin.com", "username": "Profile" }
  ],
  "cards": [
    { "id": "c1", "type": "hero_profile", "title": "Hero Profile", "colSpan": 2, "rowSpan": 2, "order": 1, "visible": true, "accentColor": "#facc15" },
    { "id": "c2", "type": "workplace", "title": "Work Experience", "colSpan": 2, "rowSpan": 2, "order": 2, "visible": true, "accentColor": "#70d6ff" },
    { "id": "c3", "type": "tech_stack", "title": "Tech Stack Matrix", "colSpan": 2, "rowSpan": 2, "order": 3, "visible": true, "accentColor": "#a7f3d0" },
    { "id": "c4", "type": "featured_project", "title": "Featured Showcase", "colSpan": 2, "rowSpan": 2, "order": 4, "visible": true, "accentColor": "#ff9f1c", "targetId": "proj_1" },
    { "id": "c5", "type": "project_view", "title": "Project View", "colSpan": 1, "rowSpan": 1, "order": 5, "visible": true, "accentColor": "#d8b4fe", "targetId": "proj_2" },
    {
      "id": "c6",
      "type": "certification",
      "title": "Certification",
      "colSpan": 1,
      "rowSpan": 1,
      "order": 6,
      "visible": true,
      "accentColor": "#ff70a6",
      "customContent": {
        "title": "AI Engineer Agentic Track",
        "issuer": "Andela Sponsored",
        "issueDate": "2025",
        "credentialUrl": "https://example.com"
      }
    },
    { "id": "c7", "type": "socials", "title": "Connect & Links", "colSpan": 2, "rowSpan": 1, "order": 7, "visible": true, "accentColor": "#d8b4fe" }
  ],
  "colorScheme": "cyber_yellow"
}`;

export function generateRISENPrompt(resumeText: string): string {
  return `### ROLE:
You are an elite AI Resume-to-Bento Portfolio Architect.

### INSTRUCTIONS:
Parse the provided CV/Resume text into a comprehensive Neobrutalist Bento Portfolio JSON structure. You MUST extract 100% of all data without leaving out any projects, skills, or certifications.

### MANDATORY STEPS:
1. PROFILE: Extract personal profile details (Name, Title, Bio, Location, Email, GitHub/LinkedIn URLs).
2. WORKPLACES: Extract all professional roles into the 'workplaces' array with full descriptions and technologies used.
3. PROJECTS: Extract EVERY SINGLE project into the 'projects' array (assign appropriate viewTypes: 'featured', 'gallery', 'code', 'metric', 'compact').
4. CERTIFICATIONS: Extract EVERY single certification listed in the CV.
5. EXHAUSTIVE SKILLS: Categorize ALL technologies, frameworks, libraries, AI tools (e.g. OpenAI Agents SDK, LangChain, LiteLLM, FastMCP), databases, and ops tools into rich skill categories ('Frontend & Frameworks', 'Backend & Services', 'AI, Agentic & MCP Tools', 'Databases, Cloud & DevOps').
6. BENTO CARDS: Generate matching Bento cards ('cards' array) for:
   - 'hero_profile' (colSpan: 2, rowSpan: 2)
   - 'workplace' (colSpan: 2, rowSpan: 2)
   - 'tech_stack' (colSpan: 2, rowSpan: 2)
   - A 'featured_project' or 'project_view' card for EVERY project in the projects array.
   - A 'certification' card for EVERY certification listed in the resume, populating 'customContent': { "title": certTitle, "issuer": issuer, "issueDate": date, "credentialUrl": url }.
   - 'socials' (colSpan: 2, rowSpan: 1)

### EXPECTATIONS:
- Return ONLY valid raw JSON conforming strictly to the schema structure below.
- Do NOT truncate or skip any certifications or projects.

### REQUIRED JSON SCHEMA STRUCTURE:
${ZOD_SCHEMA_JSON_STRUCTURE}

### USER CV/RESUME CONTENT TO PARSE:
${resumeText}
`;
}
