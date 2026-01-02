import React, { useState } from 'react';
import { Flame, AlertTriangle } from 'lucide-react';

let ApiUrl = 'http://localhost:3011'

interface RoastSectionProps {
  resumeText: string;
}

const RoastSection: React.FC<RoastSectionProps> = ({ resumeText }) => {
  const [roast, setRoast] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleRoast = async () => {
    setLoading(true);
    try {
      const response = await fetch(`${ApiUrl}/api/resume/roast`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ resumeText }),
      });
      const data = await response.json();
      setRoast(data.roast);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-red-50 border-4 border-black p-6 shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] relative overflow-hidden">
      {/* Background decoration */}
      <div className="absolute top-0 right-0 opacity-10 pointer-events-none">
        <Flame className="w-64 h-64 text-red-600" />
      </div>

      <div className="relative z-10">
        <h3 className="text-2xl font-black uppercase text-red-600 flex items-center mb-2">
          <Flame className="w-8 h-8 mr-2 animate-pulse" />
          Roast My Resume
        </h3>
        
        <p className="font-bold text-gray-700 mb-6 max-w-xl">
          Warning: This mode turns off the "Nice Career Coach" filter. 
          The AI will be brutal, sarcastic, and honest. Are you brave enough?
        </p>

        {!roast && !loading && (
          <button
            onClick={handleRoast}
            className="bg-red-600 text-white px-8 py-4 border-4 border-black font-black text-xl uppercase hover:bg-red-700 hover:shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] transition-all active:translate-y-1"
          >
            🔥 Roast Me!
          </button>
        )}

        {loading && (
          <div className="text-xl font-black animate-bounce text-red-600">
            Cooking up some insults... 🔥
          </div>
        )}

        {roast && (
          <div className="mt-6 bg-white border-4 border-red-600 p-6 relative">
            <AlertTriangle className="absolute -top-4 -left-4 w-10 h-10 text-red-600 bg-white border-2 border-red-600 rounded-full p-1" />
            <p className="text-lg font-medium leading-relaxed font-mono text-red-900">
              "{roast}"
            </p>
            <button 
              onClick={() => setRoast(null)}
              className="mt-4 text-xs font-bold uppercase text-gray-500 hover:text-black underline"
            >
              Okay, okay, I get it. Clear this.
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default RoastSection;