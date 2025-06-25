import React from 'react';

interface SuggestedKeywordsProps {
  keywords: string[];
  onSelect: (keyword: string) => void;
}

const SuggestedKeywords: React.FC<SuggestedKeywordsProps> = ({ keywords, onSelect }) => (
  <div className="flex gap-2 mb-3 justify-start">
    {keywords.map((kw) => (
      <button
        key={kw}
        type="button"
        className="px-3 py-1 rounded-full border border-green-400 text-green-700 bg-green-50 hover:bg-green-100 text-sm transition"
        onClick={() => onSelect(kw)}
      >
        {kw}
      </button>
    ))}
  </div>
);

export default SuggestedKeywords; 