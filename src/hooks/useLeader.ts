import { useState, useEffect } from 'react';

export interface LeaderboardEntry {
  id: number;
  userId: number;
  username: string;
  score: number;
  totalQuestions: number;
  completedAt: string;
}

type TimeFilter = 'all' | 'daily' | 'weekly' | 'monthly';

export const useLeaderboard = () => {
  const [entries, setEntries] = useState<LeaderboardEntry[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [timeFilter, setTimeFilter] = useState<TimeFilter>('all');

  useEffect(() => {
    const fetchLeaderboard = async () => {
      setIsLoading(true);
      
      try {
        let url = 'http://localhost:3000/leaderboard?_sort=score&_order=desc';
        if (timeFilter !== 'all') {
          const now = new Date();
          let startDate: Date;
          
          switch (timeFilter) {
            case 'daily':
              startDate = new Date(now.setDate(now.getDate() - 1));
              break;
            case 'weekly':
              startDate = new Date(now.setDate(now.getDate() - 7));
              break;
            case 'monthly':
              startDate = new Date(now.setMonth(now.getMonth() - 1));
              break;
            default:
              startDate = new Date(0); 
          }
          
          url += `&completedAt_gte=${startDate.toISOString()}`;
        }
        
        const response = await fetch(url);
        const data = await response.json();
        const entriesWithUsernames = await Promise.all(
          data.map(async (entry: any) => {
            const userResponse = await fetch(`http://localhost:3000/users/${entry.userId}`);
            const userData = await userResponse.json();
            return {
              ...entry,
              username: userData.username,
            };
          })
        );
        
        setEntries(entriesWithUsernames);
      } catch (error) {
        console.error('Failed to fetch leaderboard:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchLeaderboard();
  }, [timeFilter]);

  const addEntry = async (userId: number, score: number, totalQuestions: number) => {
    try {
      const newEntry = {
        userId,
        score,
        totalQuestions,
        completedAt: new Date().toISOString(),
      };

      await fetch('http://localhost:3000/leaderboard', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(newEntry),
      });
      setTimeFilter(prev => prev);
    } catch (error) {
      console.error('Failed to add leaderboard entry:', error);
    }
  };

  return { entries, isLoading, timeFilter, setTimeFilter, addEntry };
};