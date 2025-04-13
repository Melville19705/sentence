import { useState, useEffect } from 'react';
import { useQuestions } from './hooks/useQuestions';
import { useAuth } from './context/AuthContext';
import { useUserProgress } from './hooks/useUserProgress';
import { useLeaderboard } from './hooks/useLeader';
import { AuthProvider } from './context/AuthContext';
import Navigation from './components/Navigation';
import QuestionCard from './components/QuestionCard';
import FeedbackScreen from './components/FeedbackScreen';
import LoginForm from './components/LoginForm';
import RegisterForm from './components/RegisterForm';
import Leaderboard from './components/Leaderboard';
import Profile from './components/Profile';
import { UserAnswer } from './types';

function AppContent() {
  const { questions, loading, error } = useQuestions();
  const { user } = useAuth();
  const { progress, saveProgress } = useUserProgress();
  const { addEntry } = useLeaderboard();
  
  const [currentPage, setCurrentPage] = useState('home');
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [userAnswers, setUserAnswers] = useState<UserAnswer[]>([]);
  const [isComplete, setIsComplete] = useState(false);
  const [showLoginForm, setShowLoginForm] = useState(true);

  useEffect(() => {
    if (progress && currentPage === 'home' && !isComplete) {
      setCurrentQuestionIndex(progress.lastQuestionIndex);
      setUserAnswers(progress.userAnswers);
    }
  }, [progress, currentPage, isComplete]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600 dark:text-gray-400">Loading questions...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900">
        <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-lg max-w-md w-full">
          <h2 className="text-xl font-bold text-red-600 dark:text-red-400 mb-2">Error</h2>
          <p className="text-gray-700 dark:text-gray-300 mb-4">{error}</p>
          <p className="text-sm text-gray-500 dark:text-gray-400">
            Make sure you have started the JSON server with:
            <code className="block bg-gray-100 dark:bg-gray-700 p-2 rounded mt-2">
              npx json-server --watch db.json
            </code>
          </p>
        </div>
      </div>
    );
  }

  if (questions.length === 0) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900">
        <div className="text-center">
          <p className="text-gray-600 dark:text-gray-400">No questions available.</p>
        </div>
      </div>
    );
  }

  const handleNextQuestion = (selectedAnswers: string[]) => {
    const currentQuestion = questions[currentQuestionIndex];
    
    const isCorrect = selectedAnswers.every(
      (answer, index) => answer === currentQuestion.correctAnswers[index]
    ) && selectedAnswers.length === currentQuestion.correctAnswers.length;
    
    const userAnswer: UserAnswer = {
      questionId: currentQuestion.id,
      userAnswers: selectedAnswers,
      isCorrect
    };
    
    const newUserAnswers = [...userAnswers, userAnswer];
    setUserAnswers(newUserAnswers);
    
    if (user) {
      saveProgress(currentQuestionIndex + 1, newUserAnswers);
    }
    
    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
    } else {
      setIsComplete(true);
      
      if (user) {
        const score = newUserAnswers.filter(answer => answer.isCorrect).length;
        addEntry(user.id, score, questions.length);
      }
    }
  };

  const handleRestart = () => {
    setCurrentQuestionIndex(0);
    setUserAnswers([]);
    setIsComplete(false);
  };

  const handleNavigate = (page: string) => {
    setCurrentPage(page);
    
    if (page === 'home') {
    } else if (page === 'login' && !user) {
      setShowLoginForm(true);
    }
  };

  const renderContent = () => {
    switch (currentPage) {
      case 'home':
        if (isComplete) {
          return (
            <FeedbackScreen 
              userAnswers={userAnswers} 
              questions={questions}
              onRestart={handleRestart}
            />
          );
        } else {
          return (
            <QuestionCard 
              question={questions[currentQuestionIndex]}
              onNext={handleNextQuestion}
              questionNumber={currentQuestionIndex + 1}
              totalQuestions={questions.length}
            />
          );
        }
      
      case 'leaderboard':
        return <Leaderboard />;
      
      case 'profile':
        return <Profile />;
      
      case 'login':
        if (user) {
          setCurrentPage('home');
          return null;
        }
        
        return showLoginForm ? (
          <LoginForm 
            onSuccess={() => setCurrentPage('home')}
            onRegisterClick={() => setShowLoginForm(false)}
          />
        ) : (
          <RegisterForm 
            onSuccess={() => setCurrentPage('home')}
            onLoginClick={() => setShowLoginForm(true)}
          />
        );
      
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <Navigation onNavigate={handleNavigate} currentPage={currentPage} />
      
      <main className="py-8 px-4">
        <div className="max-w-4xl mx-auto">
          {currentPage === 'home' && !isComplete && (
            <h1 className="text-3xl font-bold text-center mb-8 text-gray-900 dark:text-white">
              Sentence Construction Tool
            </h1>
          )}
          
          {renderContent()}
        </div>
      </main>
    </div>
  );
}

function App() {
  return (
      <AuthProvider>
        <AppContent />
      </AuthProvider>
  );
}

export default App;