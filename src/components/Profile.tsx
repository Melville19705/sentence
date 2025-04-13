import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';

interface UserAttempt {
  id: number;
  userId: number;
  score: number;
  totalQuestions: number;
  completedAt: string;
}

const Profile = () => {
  const { user } = useAuth();
  const [attempts, setAttempts] = useState<UserAttempt[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [stats, setStats] = useState({
    totalAttempts: 0,
    averageScore: 0,
    bestScore: 0,
    totalQuestionsAnswered: 0,
  });

  useEffect(() => {
    const fetchUserAttempts = async () => {
      if (!user) return;
      
      setIsLoading(true);
      
      try {
        const response = await fetch(`http://localhost:3000/leaderboard?userId=${user.id}&_sort=completedAt&_order=desc`);
        const data = await response.json();
        
        setAttempts(data);
        if (data.length > 0) {
          const totalAttempts = data.length;
          const totalScore = data.reduce((sum: number, attempt: UserAttempt) => sum + attempt.score, 0);
          const totalQuestions = data.reduce((sum: number, attempt: UserAttempt) => sum + attempt.totalQuestions, 0);
          const bestScore = Math.max(...data.map((attempt: UserAttempt) => attempt.score));
          
          setStats({
            totalAttempts,
            averageScore: totalScore / totalAttempts,
            bestScore,
            totalQuestionsAnswered: totalQuestions,
          });
        }
      } catch (error) {
        console.error('Failed to fetch user attempts:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchUserAttempts();
  }, [user]);

  if (!user) {
    return (
      <div className="text-center py-8">
        <p className="text-gray-600 dark:text-gray-400">Please log in to view your profile.</p>
      </div>
    );
  }

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6 max-w-2xl mx-auto">
      <h2 className="text-2xl font-bold text-center mb-6 text-gray-900 dark:text-white">Your Profile</h2>
      
      <div className="mb-8">
        <div className="flex items-center justify-center mb-4">
          <div className="w-20 h-20 bg-blue-100 dark:bg-blue-900 rounded-full flex items-center justify-center text-blue-600 dark:text-blue-300 text-2xl font-bold">
            {user.username.substring(0, 2).toUpperCase()}
          </div>
        </div>
        
        <h3 className="text-xl font-semibold text-center text-gray-900 dark:text-white">{user.username}</h3>
        <p className="text-center text-gray-600 dark:text-gray-400">{user.email}</p>
      </div>
      
      {isLoading ? (
        <div className="text-center py-4">
          <div className="w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600 dark:text-gray-400">Loading your data...</p>
        </div>
      ) : (
        <>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
            <div className="bg-gray-50 dark:bg-gray-700 p-4 rounded-lg text-center">
              <p className="text-sm text-gray-500 dark:text-gray-400">Total Attempts</p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">{stats.totalAttempts}</p>
            </div>
            
            <div className="bg-gray-50 dark:bg-gray-700 p-4 rounded-lg text-center">
              <p className="text-sm text-gray-500 dark:text-gray-400">Average Score</p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">
                {stats.averageScore.toFixed(1)}
              </p>
            </div>
            
            <div className="bg-gray-50 dark:bg-gray-700 p-4 rounded-lg text-center">
              <p className="text-sm text-gray-500 dark:text-gray-400">Best Score</p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">{stats.bestScore}</p>
            </div>
            
            <div className="bg-gray-50 dark:bg-gray-700 p-4 rounded-lg text-center">
              <p className="text-sm text-gray-500 dark:text-gray-400">Questions Answered</p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">{stats.totalQuestionsAnswered}</p>
            </div>
          </div>
          
          <h3 className="text-xl font-semibold mb-4 text-gray-900 dark:text-white">Recent Attempts</h3>
          
          {attempts.length === 0 ? (
            <p className="text-center text-gray-600 dark:text-gray-400 py-4">
              You haven't completed any quizzes yet.
            </p>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                <thead className="bg-gray-50 dark:bg-gray-700">
                  <tr>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                      Date
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                      Score
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                  {attempts.map((attempt) => (
                    <tr key={attempt.id}>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-300">
                        {new Date(attempt.completedAt).toLocaleString()}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-300">
                        {attempt.score} / {attempt.totalQuestions}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default Profile;