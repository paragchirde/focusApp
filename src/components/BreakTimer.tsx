import { useState, useEffect, useRef } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Pause, Play, Square, Coffee } from "lucide-react";

interface BreakTimerProps {
  breakType: 'short' | 'medium' | 'long';
  onComplete: () => void;
  onSkip: () => void;
}

const BREAK_CONFIG = {
  short: { duration: 5, label: 'Short Break', color: 'timer-break' },
  medium: { duration: 15, label: 'Medium Break', color: 'timer-break' },
  long: { duration: 25, label: 'Long Break', color: 'timer-break' },
};

export function BreakTimer({ breakType, onComplete, onSkip }: BreakTimerProps) {
  const config = BREAK_CONFIG[breakType];
  const [timeLeft, setTimeLeft] = useState(config.duration * 60);
  const [isRunning, setIsRunning] = useState(true); // Auto-start break
  
  const intervalRef = useRef<NodeJS.Timeout | null>(null);
  const totalDuration = config.duration * 60;

  useEffect(() => {
    if (isRunning && timeLeft > 0) {
      intervalRef.current = setInterval(() => {
        setTimeLeft((prev) => {
          if (prev <= 1) {
            setIsRunning(false);
            onComplete();
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    } else {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
    }

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [isRunning, timeLeft, onComplete]);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const progress = ((totalDuration - timeLeft) / totalDuration) * 100;

  const breakMessages = {
    short: [
      "Take a deep breath and relax",
      "Stretch your body and mind",
      "Look away from the screen",
    ],
    medium: [
      "Step away from your workspace",
      "Take a short walk outside",
      "Hydrate and nourish yourself",
      "Do some light stretching",
    ],
    long: [
      "Take a proper break from work",
      "Go for a walk in nature",
      "Have a healthy snack",
      "Practice mindfulness",
      "Connect with others",
    ],
  };

  const currentMessage = breakMessages[breakType][
    Math.floor(Math.random() * breakMessages[breakType].length)
  ];

  return (
    <Card className="card-shadow focus-glow bg-gradient-to-br from-timer-break/5 to-background">
      <CardContent className="p-12 text-center">
        <div className="mb-8">
          <Coffee className="w-16 h-16 text-timer-break mx-auto mb-4" />
          <h1 className="text-4xl font-light text-foreground mb-2">
            {config.label}
          </h1>
          <p className="text-xl text-muted-foreground">
            {currentMessage}
          </p>
        </div>

        {/* Timer Display */}
        <div className={`mb-8 ${isRunning ? 'timer-breathing' : ''}`}>
          <div className="text-8xl font-light text-timer-break mb-4 tabular-nums">
            {formatTime(timeLeft)}
          </div>
          <Progress 
            value={progress} 
            className="h-2 mb-6"
          />
        </div>

        {/* Break Suggestions */}
        <div className="bg-timer-break/10 rounded-xl p-6 mb-8">
          <h3 className="font-medium text-foreground mb-3">
            Break Ideas:
          </h3>
          <div className="grid grid-cols-2 gap-2 text-sm text-muted-foreground">
            {breakType === 'short' && (
              <>
                <div>• Deep breathing</div>
                <div>• Eye exercises</div>
                <div>• Neck stretches</div>
                <div>• Drink water</div>
              </>
            )}
            {breakType === 'medium' && (
              <>
                <div>• Short walk</div>
                <div>• Light snack</div>
                <div>• Quick meditation</div>
                <div>• Fresh air</div>
              </>
            )}
            {breakType === 'long' && (
              <>
                <div>• Outdoor walk</div>
                <div>• Proper meal</div>
                <div>• Social time</div>
                <div>• Exercise</div>
              </>
            )}
          </div>
        </div>

        {/* Controls */}
        <div className="flex items-center justify-center gap-4">
          <Button
            onClick={() => setIsRunning(!isRunning)}
            size="lg"
            className={`px-8 py-6 rounded-full text-lg gentle-transition ${
              isRunning 
                ? 'bg-warning hover:bg-warning/90' 
                : 'bg-timer-break hover:bg-timer-break/90'
            }`}
          >
            {isRunning ? (
              <>
                <Pause className="w-6 h-6 mr-2" />
                Pause Break
              </>
            ) : (
              <>
                <Play className="w-6 h-6 mr-2" />
                Resume Break
              </>
            )}
          </Button>

          <Button
            onClick={onSkip}
            variant="outline"
            size="lg"
            className="px-6 py-6 rounded-full border-2 hover:border-primary gentle-transition"
          >
            <Square className="w-5 h-5 mr-2" />
            Skip Break
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}