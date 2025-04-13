import { useEffect, useState } from 'react';

interface TimerProps {
  duration: number;
  onTimeUp: () => void;
  isActive: boolean;
}

const Timer = ({ duration, onTimeUp, isActive }: TimerProps) => {
  const [timeLeft, setTimeLeft] = useState(duration);
  
  useEffect(() => {
    setTimeLeft(duration);
  }, [duration]);

  useEffect(() => {
    if (!isActive) return;
    
    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          onTimeUp();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [duration, onTimeUp, isActive]);

  const percentage = (timeLeft / duration) * 100;

  return (
    <div className="w-full">
      <div className="flex justify-between mb-1 text-sm">
        <span>Time Left</span>
        <span>{timeLeft} seconds</span>
      </div>
      <div className="w-full bg-gray-200 rounded-full h-2.5">
        <div 
          className="bg-blue-600 h-2.5 rounded-full transition-all duration-1000 ease-linear"
          style={{ width: `${percentage}%` }}
        ></div>
      </div>
    </div>
  );
};

export default Timer;