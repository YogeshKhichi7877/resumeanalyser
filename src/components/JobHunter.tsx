import React from 'react';
import { Briefcase, Linkedin, Globe, Search } from 'lucide-react';

interface JobHunterProps {
  targetDomain: string;
  keywords: string[]; // Pass hard_skills here
}

const JobHunter: React.FC<JobHunterProps> = ({ targetDomain, keywords }) => {
  // Create a search query string: "Software Engineer React Node.js"
  const topSkills = keywords.slice(0, 3).join(' ');
  const query = encodeURIComponent(`${targetDomain} ${topSkills}`);

  const links = [
    {
      name: 'LinkedIn Jobs',
      url: `https://www.linkedin.com/jobs/search/?keywords=${query}`,
      icon: <Linkedin className="w-5 h-5" />,
      color: 'bg-blue-200 hover:bg-blue-300',
    },
    {
      name: 'Google Jobs',
      url: `https://www.google.com/search?q=${query}+jobs&ibp=htl;jobs`,
      icon: <Search className="w-5 h-5" />,
      color: 'bg-green-200 hover:bg-green-300',
    },
    {
      name: 'Indeed',
      url: `https://www.indeed.com/jobs?q=${query}`,
      icon: <Globe className="w-5 h-5" />,
      color: 'bg-yellow-200 hover:bg-yellow-300',
    }
  ];

  return (
    <div className="bg-white p-6 border-4 border-black shadow-[8px_8px_0px_0px_rgba(0,0,0,1)]">
      <div className="flex items-center mb-4">
        <Briefcase className="w-6 h-6 mr-2" />
        <h3 className="text-xl font-black uppercase">Start Applying Now</h3>
      </div>
      <p className="mb-4 text-sm font-bold text-gray-600">
        Based on your skills, we generated these search links:
      </p>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {links.map((link, i) => (
          <a
            key={i}
            href={link.url}
            target="_blank"
            rel="noopener noreferrer"
            className={`${link.color} p-4 border-4 border-black font-black flex items-center justify-center gap-2 transition-transform hover:-translate-y-1 active:translate-y-0`}
          >
            {link.icon}
            {link.name}
          </a>
        ))}
      </div>
    </div>
  );
};

export default JobHunter;