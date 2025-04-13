import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { UserAnswer } from '../types';

interface UserProgress {
  userId: number;
  lastQuestionIndex: number;
  userAnswers: UserAnswer[];
  timestamp: string;
}

export const useUserProgress = () => {
  const { user } = useAuth();
  const [isLoading, setIsLoading] = useState(true);
  const [progress, setProgress] = useState<UserProgress | null>(null);

  useEffect(() => {
    const fetchProgress = async () => {
      if (!user) {
        setIsLoading(false);
        return;
      }

      try {
        const response = await fetch(`http://localhost:3000/progress?userId=${user.id}&_sort=timestamp&_order=desc&_limit=1`);
        const data = await response.json();
        
        if (data.length > 0) {
          setProgress(data[0]);
        }
      } catch (error) {
        console.error('Failed to fetch progress:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchProgress();
  }, [user]);

  const saveProgress = async (lastQuestionIndex: number, userAnswers: UserAnswer[]) => {
    if (!user) return;

    try {
      const newProgress: UserProgress = {
        userId: user.id,
        lastQuestionIndex,
        userAnswers,
        timestamp: new Date().toISOString(),
      };

      await fetch('http://localhost:3000/progress', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(newProgress),
      });

      setProgress(newProgress);
    } catch (error) {
      console.error('Failed to save progress:', error);
    }
  };

  return { progress, isLoading, saveProgress };
};