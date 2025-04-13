import { useState, useEffect } from 'react';
import { Question } from '../types';

export const useQuestions = () => {
  const [questions, setQuestions] = useState<Question[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchQuestions = async () => {
      try {
        const response = await fetch('https://raw.githubusercontent.com/Melville19705/demo/master/db.json');
        if (!response.ok) {
          throw new Error('Failed to fetch questions');
        }
        const data = await response.json();
        console.log('Fetched data:', data); 
        setQuestions(data.questions); 
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to load questions. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    fetchQuestions();
  }, []);

  return { questions, loading, error };
};
