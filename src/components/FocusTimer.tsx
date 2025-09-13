import { useState, useEffect, useRef } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Pause, Play, Square, RotateCcw } from "lucide-react";
import { InterruptionDialog } from "./InterruptionDialog";
import { Timeline } from "./Timeline";

export interface TimelineEvent {
  id: string;
  type: 'start' | 'pause' | 'resume' | 'complete' | 'interruption';
  timestamp: Date;
  details?: {
    reason?: string;
    pauseDuration?: number;
    addedBack?: boolean;
  };
}

interface FocusTimerProps {
  task: string;
  initialDuration: number;
  onComplete: () => void;
  onReset: () => void;
}

export function FocusTimer({ task, initialDuration, onComplete, onReset }: FocusTimerProps) {
  const [timeLeft, setTimeLeft] = useState(initialDuration * 60); // Convert to seconds
  const [isRunning, setIsRunning] = useState(false);
  const [showInterruptionDialog, setShowInterruptionDialog] = useState(false);
  const [pauseStartTime, setPauseStartTime] = useState<Date | null>(null);
  const [timeline, setTimeline] = useState<TimelineEvent[]>([]);
  
  const intervalRef = useRef<NodeJS.Timeout | null>(null);
  const totalDuration = initialDuration * 60;

  // Add initial start event
  useEffect(() => {
    const startEvent: TimelineEvent = {
      id: crypto.randomUUID(),
      type: 'start',
      timestamp: new Date(),
    };
    setTimeline([startEvent]);
  }, []);

  // Timer logic
  useEffect(() => {
    if (isRunning && timeLeft > 0) {
      intervalRef.current = setInterval(() => {
        setTimeLeft((prev) => {
          if (prev <= 1) {
            setIsRunning(false);
            handleComplete();
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
  }, [isRunning, timeLeft]);

  const handleComplete = () => {
    const completeEvent: TimelineEvent = {
      id: crypto.randomUUID(),
      type: 'complete',
      timestamp: new Date(),
    };
    setTimeline(prev => [...prev, completeEvent]);
    onComplete();
  };

  const handlePlayPause = () => {
    if (isRunning) {
      // Pausing - record pause time and show interruption dialog
      setPauseStartTime(new Date());
      setIsRunning(false);
      setShowInterruptionDialog(true);
    } else {
      // Resuming
      setIsRunning(true);
      if (pauseStartTime) {
        const resumeEvent: TimelineEvent = {
          id: crypto.randomUUID(),
          type: 'resume',
          timestamp: new Date(),
        };
        setTimeline(prev => [...prev, resumeEvent]);
      }
    }
  };

  const handleInterruptionSubmit = (reason: string, addTimeBack: boolean) => {
    if (!pauseStartTime) return;

    const now = new Date();
    const pauseDuration = Math.floor((now.getTime() - pauseStartTime.getTime()) / 1000);

    // Add interruption event to timeline
    const interruptionEvent: TimelineEvent = {
      id: crypto.randomUUID(),
      type: 'interruption',
      timestamp: pauseStartTime,
      details: {
        reason,
        pauseDuration,
        addedBack: addTimeBack,
      },
    };

    setTimeline(prev => [...prev, interruptionEvent]);

    // Add time back if requested
    if (addTimeBack) {
      setTimeLeft(prev => prev + pauseDuration);
    }

    setPauseStartTime(null);
    setShowInterruptionDialog(false);
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const progress = ((totalDuration - timeLeft) / totalDuration) * 100;

  return (
    <div className="space-y-8">
      {/* Timer Card */}
      <Card className="card-shadow focus-glow">
        <CardContent className="p-12 text-center">
          <div className="mb-8">
            <h2 className="text-2xl font-light text-muted-foreground mb-2">
              Focusing on
            </h2>
            <h1 className="text-4xl font-medium text-foreground">
              {task}
            </h1>
          </div>

          {/* Timer Display */}
          <div className={`mb-8 ${isRunning ? 'timer-breathing' : ''}`}>
            <div className="text-8xl font-light text-timer-active mb-4 tabular-nums">
              {formatTime(timeLeft)}
            </div>
            <Progress 
              value={progress} 
              className="h-2 mb-6"
            />
          </div>

          {/* Controls */}
          <div className="flex items-center justify-center gap-4">
            <Button
              onClick={handlePlayPause}
              size="lg"
              className={`px-8 py-6 rounded-full text-lg gentle-transition ${
                isRunning 
                  ? 'bg-warning hover:bg-warning/90' 
                  : 'bg-primary hover:bg-primary-glow'
              }`}
            >
              {isRunning ? (
                <>
                  <Pause className="w-6 h-6 mr-2" />
                  Pause
                </>
              ) : (
                <>
                  <Play className="w-6 h-6 mr-2" />
                  {timeLeft === totalDuration ? 'Start' : 'Resume'}
                </>
              )}
            </Button>

            <Button
              onClick={onReset}
              variant="outline"
              size="lg"
              className="px-6 py-6 rounded-full border-2 hover:border-primary gentle-transition"
            >
              <RotateCcw className="w-5 h-5 mr-2" />
              Reset
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Timeline */}
      <Timeline events={timeline} />

      {/* Interruption Dialog */}
      <InterruptionDialog
        open={showInterruptionDialog}
        onSubmit={handleInterruptionSubmit}
        pauseDuration={pauseStartTime ? Math.floor((new Date().getTime() - pauseStartTime.getTime()) / 1000) : 0}
      />
    </div>
  );
}