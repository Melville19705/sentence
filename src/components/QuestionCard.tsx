import { useState, useEffect } from 'react';
import { Question } from '../types';
import Timer from './Timer';
import WordOptions from './WordOptions';
import SentenceDisplay from './SentenceDisplay';

interface QuestionCardProps {
  question: Question;
  onNext: (userAnswers: string[]) => void;
  questionNumber: number;
  totalQuestions: number;
}

const QuestionCard = ({ question, onNext, questionNumber, totalQuestions }: QuestionCardProps) => {
  const [selectedWords, setSelectedWords] = useState<string[]>([]);
  const [blanksCount, setBlanksCount] = useState(0);
  
  useEffect(() => {
    setSelectedWords([]);
    
    const count = (question.sentence.match(/_/g) || []).length;
    setBlanksCount(count);
  }, [question]);

  const handleSelectWord = (word: string) => {
    if (selectedWords.length < blanksCount) {
      setSelectedWords([...selectedWords, word]);
    }
  };

  const handleRemoveWord = (index: number) => {
    const newSelectedWords = [...selectedWords];
    newSelectedWords.splice(index, 1);
    setSelectedWords(newSelectedWords);
  };

  const handleNext = () => {
    onNext(selectedWords);
  };

  const allBlanksFilled = selectedWords.length === blanksCount;

  return (
    <div className="bg-white rounded-lg shadow-lg p-6 max-w-2xl mx-auto">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-lg font-semibold">
          Question {questionNumber} of {totalQuestions}
        </h2>
        <Timer 
          duration={30} 
          onTimeUp={handleNext} 
          isActive={true}
        />
      </div>
      
      <div className="mb-8">
        <SentenceDisplay 
          sentence={question.sentence} 
          selectedWords={selectedWords} 
          onRemoveWord={handleRemoveWord}
        />
      </div>
      
      <WordOptions 
        options={question.options} 
        onSelectWord={handleSelectWord}
        selectedWords={selectedWords}
      />
      
      <div className="mt-8 flex justify-end">
        <button
          onClick={handleNext}
          disabled={!allBlanksFilled}
          className={`px-6 py-2 rounded-lg font-medium transition-all
            ${allBlanksFilled 
              ? 'bg-blue-600 text-white hover:bg-blue-700' 
              : 'bg-gray-200 text-gray-400 cursor-not-allowed'
            }`}
        >
          Next
        </button>
      </div>
    </div>
  );
};

export default QuestionCard;