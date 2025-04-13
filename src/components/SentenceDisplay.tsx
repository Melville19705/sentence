import React from 'react';

interface SentenceDisplayProps {
  sentence: string;
  selectedWords: string[];
  onRemoveWord: (index: number) => void;
}

const SentenceDisplay = ({ sentence, selectedWords, onRemoveWord }: SentenceDisplayProps) => {
  const parts = sentence.split('_');
  
  return (
    <div className="text-xl text-center leading-relaxed">
      {parts.map((part, index) => (
        <React.Fragment key={index}>
          {part}
          {index < parts.length - 1 && (
            <span 
              onClick={() => selectedWords[index] && onRemoveWord(index)}
              className={`inline-block min-w-[80px] mx-1 px-2 py-1 border-b-2 text-center
                ${selectedWords[index] 
                  ? 'border-blue-500 bg-blue-50 cursor-pointer' 
                  : 'border-gray-300'
                }`}
            >
              {selectedWords[index] || ''}
            </span>
          )}
        </React.Fragment>
      ))}
    </div>
  );
};

export default SentenceDisplay;