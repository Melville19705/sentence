import { Question, UserAnswer } from '../types';

interface FeedbackScreenProps {
  userAnswers: UserAnswer[];
  questions: Question[];
  onRestart: () => void;
}

const FeedbackScreen = ({ userAnswers, questions, onRestart }: FeedbackScreenProps) => {
  const score = userAnswers.filter(answer => answer.isCorrect).length;
  const totalQuestions = questions.length;
  
  return (
    <div className="bg-white rounded-lg shadow-lg p-6 max-w-2xl mx-auto">
      <h2 className="text-2xl font-bold text-center mb-6">Your Results</h2>
      
      <div className="text-center mb-8">
        <div className="text-5xl font-bold mb-2">
          {score} / {totalQuestions}
        </div>
        <p className="text-gray-600">
          {score === totalQuestions 
            ? 'Perfect! You got all questions correct!' 
            : `You got ${score} out of ${totalQuestions} questions correct.`}
        </p>
      </div>
      
      <div className="space-y-6 mb-8">
        <h3 className="text-xl font-semibold">Question Review</h3>
        
        {questions.map((question, index) => {
          const userAnswer = userAnswers.find(a => a.questionId === question.id);
          const isCorrect = userAnswer?.isCorrect || false;
          
          return (
            <div 
              key={question.id} 
              className={`p-4 rounded-lg border ${isCorrect ? 'border-green-200 bg-green-50' : 'border-red-200 bg-red-50'}`}
            >
              <div className="flex items-center gap-2 mb-2">
                <span className={`text-sm font-medium px-2 py-1 rounded-full ${isCorrect ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                  {isCorrect ? 'Correct' : 'Incorrect'}
                </span>
                <h4 className="font-medium">Question {index + 1}</h4>
              </div>
              
              <div className="mb-3">
                {question.sentence.split('_').map((part, i, arr) => (
                  <span key={i}>
                    {part}
                    {i < arr.length - 1 && (
                      <span className="font-medium mx-1 px-1 border-b-2 border-dashed">
                        {question.correctAnswers[i]}
                      </span>
                    )}
                  </span>
                ))}
              </div>
              
              {!isCorrect && (
                <div className="text-sm">
                  <p className="font-medium text-gray-700">Your answer:</p>
                  <p className="text-red-600">
                    {userAnswer?.userAnswers.join(', ') || 'No answer provided'}
                  </p>
                  <p className="font-medium text-gray-700 mt-1">Correct answer:</p>
                  <p className="text-green-600">{question.correctAnswers.join(', ')}</p>
                </div>
              )}
            </div>
          );
        })}
      </div>
      
      <div className="flex justify-center">
        <button
          onClick={onRestart}
          className="px-6 py-2 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition-colors"
        >
          Try Again
        </button>
      </div>
    </div>
  );
};

export default FeedbackScreen;