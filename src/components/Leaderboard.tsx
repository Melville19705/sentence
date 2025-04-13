import { useLeaderboard } from '../hooks/useLeader';
import { useAuth } from '../context/AuthContext';

const Leaderboard = () => {
  const { entries, isLoading, timeFilter, setTimeFilter } = useLeaderboard();
  const { user } = useAuth();
  const userRank = user 
    ? entries.findIndex(entry => entry.userId === user.id) + 1 
    : null;

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6 max-w-2xl mx-auto">
      <h2 className="text-2xl font-bold text-center mb-6 text-gray-900 dark:text-white">Leaderboard</h2>
      
      <div className="flex justify-between items-center mb-6">
        <div className="flex space-x-2">
          <button
            onClick={() => setTimeFilter('all')}
            className={`px-3 py-1 rounded-md text-sm font-medium ${
              timeFilter === 'all'
                ? 'bg-blue-600 text-white'
                : 'bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-200'
            }`}
          >
            All Time
          </button>
          <button
            onClick={() => setTimeFilter('monthly')}
            className={`px-3 py-1 rounded-md text-sm font-medium ${
              timeFilter === 'monthly'
                ? 'bg-blue-600 text-white'
                : 'bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-200'
            }`}
          >
            Monthly
          </button>
          <button
            onClick={() => setTimeFilter('weekly')}
            className={`px-3 py-1 rounded-md text-sm font-medium ${
              timeFilter === 'weekly'
                ? 'bg-blue-600 text-white'
                : 'bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-200'
            }`}
          >
            Weekly
          </button>
          <button
            onClick={() => setTimeFilter('daily')}
            className={`px-3 py-1 rounded-md text-sm font-medium ${
              timeFilter === 'daily'
                ? 'bg-blue-600 text-white'
                : 'bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-200'
            }`}
          >
            Daily
          </button>
        </div>
      </div>
      
      {userRank && (
        <div className="mb-4 p-3 bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-200 rounded-md">
          Your Rank: <span className="font-bold">{userRank}</span> of {entries.length}
        </div>
      )}
      
      {isLoading ? (
        <div className="text-center py-8">
          <div className="w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600 dark:text-gray-400">Loading leaderboard...</p>
        </div>
      ) : entries.length === 0 ? (
        <div className="text-center py-8 text-gray-600 dark:text-gray-400">
          No entries found for this time period.
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
            <thead className="bg-gray-50 dark:bg-gray-700">
              <tr>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  Rank
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  User
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  Score
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  Date
                </th>
              </tr>
            </thead>
            <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
              {entries.map((entry, index) => (
                <tr 
                  key={entry.id}
                  className={user && entry.userId === user.id ? 'bg-blue-50 dark:bg-blue-900/20' : ''}
                >
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-white">
                    {index + 1}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-300">
                    {entry.username}
                    {user && entry.userId === user.id && (
                      <span className="ml-2 text-xs bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 px-2 py-0.5 rounded-full">
                        You
                      </span>
                    )}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-300">
                    {entry.score} / {entry.totalQuestions}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-300">
                    {new Date(entry.completedAt).toLocaleDateString()}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default Leaderboard;