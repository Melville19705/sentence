interface WordOptionsProps {
  options: string[];
  selectedWords: string[];
  onSelectWord: (word: string) => void;
}

const WordOptions = ({ options, selectedWords, onSelectWord }: WordOptionsProps) => {
  return (
    <div className="flex flex-wrap gap-2">
      {options.map((word, index) => (
        <button
          key={index}
          onClick={() => onSelectWord(word)}
          disabled={selectedWords.includes(word)}
          className={`px-4 py-2 rounded-lg border ${
            selectedWords.includes(word)
              ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
              : 'bg-blue-500 text-white hover:bg-blue-600'
          }`}
        >
          {word}
        </button>
      ))}
    </div>
  );
};

export default WordOptions;
