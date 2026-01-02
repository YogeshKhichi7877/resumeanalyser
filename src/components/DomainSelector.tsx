
import React, { useState, useEffect } from 'react';
import { Code, Database, Megaphone, Package, Palette, TrendingUp, Plus, LayoutGrid } from 'lucide-react';

interface DomainSelectorProps {
  selectedDomain: string;
  onDomainChange: (domain: string) => void;
}

const DEFAULT_DOMAINS = [
  { id: 'software-engineer', label: 'Software Engineer', icon: Code, color: 'bg-blue-500' },
  { id: 'data-scientist', label: 'Data Scientist', icon: Database, color: 'bg-purple-500' },
  { id: 'cyber-security', label: 'Cybersecurity Specialist', icon: Code, color: 'bg-teal-500' },
  { id: 'marketing', label: 'Marketing', icon: Megaphone, color: 'bg-pink-500' },
  { id: 'product-manager', label: 'Product Manager', icon: Package, color: 'bg-green-500' },
  { id: 'design', label: 'UI/UX Designer', icon: Palette, color: 'bg-orange-500' },
  { id: 'sales', label: 'Sales', icon: TrendingUp, color: 'bg-red-500' },
];

const DomainSelector: React.FC<DomainSelectorProps> = ({ selectedDomain, onDomainChange }) => {
  // State to store custom domains added by the user
  const [customDomains, setCustomDomains] = useState<{ id: string; label: string; icon: any; color: string }[]>([]);

  // Function to handle adding a new domain
  const handleAddCustomDomain = () => {
    const customName = window.prompt("Enter your custom domain (e.g., Cloud Architect):");
    
    if (customName && customName.trim() !== "") {
      const newId = customName.toLowerCase().replace(/\s+/g, '-');
      
      // Check if it already exists in defaults or custom
      const exists = [...DEFAULT_DOMAINS, ...customDomains].some(d => d.id === newId);
      
      if (!exists) {
        const newDomain = {
          id: newId,
          label: customName,
          icon: LayoutGrid, // Default icon for custom domains
          color: 'bg-indigo-500'
        };
        setCustomDomains(prev => [...prev, newDomain]);
      }
      
      onDomainChange(newId);
    }
  };

  // Combine default and custom domains for rendering
  const allDomains = [...DEFAULT_DOMAINS, ...customDomains];

  return (
    <div className="w-full">
      <h3 className="text-2xl font-black mb-6 text-black uppercase tracking-wider">
        CHOOSE YOUR Domain
      </h3>
      
      <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-6">
        {allDomains.map((domain) => {
          const Icon = domain.icon;
          const isSelected = selectedDomain === domain.id;
          
          return (
            <button
              key={domain.id}
              onClick={() => onDomainChange(domain.id)}
              className={`
                p-6 border-4 border-black font-black text-lg
                transition-all duration-200 uppercase tracking-wide
                shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]
                hover:shadow-[8px_8px_0px_0px_rgba(0,0,0,1)]
                hover:translate-x-[-4px] hover:translate-y-[-4px]
                ${isSelected 
                  ? `${domain.color} text-white transform translate-x-[-4px] translate-y-[-4px] shadow-[8px_8px_0px_0px_rgba(0,0,0,1)]` 
                  : 'bg-white text-black hover:bg-gray-100'
                }
              `}
            >
              <Icon className="w-8 h-8 mx-auto mb-2" />
              <div className="text-sm">{domain.label}</div>
            </button>
          );
        })}
      </div>

      {/* Add Custom Domain Button */}
      <button
        onClick={handleAddCustomDomain}
        className="flex items-center gap-2 px-6 py-3 bg-blue-600 text-white font-black border-4 border-black uppercase tracking-wider transition-all shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] hover:translate-x-[-4px] hover:translate-y-[-4px]"
      >
        <Plus className="w-5 h-5" />
        Add Custom Domain
      </button>
    </div>
  );
};

export default DomainSelector;