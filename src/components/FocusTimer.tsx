import { useState, useEffect, useRef } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Pause, Play, Square, RotateCcw, Plus } from "lucide-react";
import { InterruptionDialog } from "./InterruptionDialog";
import { Timeline } from "./Timeline";

export interface TimelineEvent {
  id: string;
  type: 'start' | 'pause' | 'resume' | 'complete' | 'interruption' | 'extension';
  timestamp: Date;
  details?: {
    reason?: string;
    pauseDuration?: number;
    addedBack?: boolean;
    extensionTime?: number;
  };
}

interface FocusTimerProps {
  task: string;
  initialDuration: number;
  onComplete: () => void;
  onReset: () => void;
  onStop: (summary: { focusedTime: number; interruptionCount: number; totalTime: number; timeline: TimelineEvent[] }) => void;
}

export function FocusTimer({ task, initialDuration, onComplete, onReset, onStop }: FocusTimerProps) {
  const [timeLeft, setTimeLeft] = useState(initialDuration * 60); // Convert to seconds
  const [isRunning, setIsRunning] = useState(false);
  const [showInterruptionDialog, setShowInterruptionDialog] = useState(false);
  const [pauseStartTime, setPauseStartTime] = useState<Date | null>(null);
  const [timeline, setTimeline] = useState<TimelineEvent[]>([]);
  const [showSessionEndDialog, setShowSessionEndDialog] = useState(false);
  const [extensionTime, setExtensionTime] = useState(5);
  const [totalTimeSpent, setTotalTimeSpent] = useState(initialDuration * 60);
  
  const intervalRef = useRef<NodeJS.Timeout | null>(null);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const originalTitle = useRef<string>('');
  const totalDuration = initialDuration * 60;

  // Initialize and manage tab title
  useEffect(() => {
    originalTitle.current = document.title;
    
    // Create audio element
    audioRef.current = new Audio('data:audio/wav;base64,UklGRnoGAABXQVZFZm10IBAAAAABAAEAQB8AAEAfAAABAAgAZGF0YQoGAACBhYqFbF1fdJivrJBhNjVgodDbq2EcBj+a2/LDciUFLIHO8tiJNwgZaLvt559NEAxQp+PwtmMcBjiR1/LMeSwFJHfH8N2QQAoUXrTp66hVFApGn+DyvmIdBjiR1/LNeSsFJHfH8N2QQAoUXrTp66hVFApGn+DyvmIdBjiR1/LNeSsFJHfH8N2QQAoUXrTp66hVFApGn+DyvmIdBjiR1/LNeSsFJHfH8N2QQAoUXrTp66hVFApGn+DyvmIdBjiR1/LNeSsFJHfH8N2QQAoUXrTp66hVFApGn+DyvmId');
    audioRef.current.volume = 0.5;

    const startEvent: TimelineEvent = {
      id: crypto.randomUUID(),
      type: 'start',
      timestamp: new Date(),
    };
    setTimeline([startEvent]);

    return () => {
      document.title = originalTitle.current;
    };
  }, []);

  // Update tab title based on timer state
  useEffect(() => {
    if (isRunning) {
      document.title = `${formatTime(timeLeft)} - ${task}`;
    } else if (timeLeft > 0) {
      document.title = "Focus ON - Paused";
    } else {
      document.title = originalTitle.current;
    }
  }, [isRunning, timeLeft, task]);

  // Timer logic
  useEffect(() => {
    if (isRunning && timeLeft > 0) {
      intervalRef.current = setInterval(() => {
        setTimeLeft((prev) => {
          if (prev <= 1) {
            setIsRunning(false);
            handleTimerEnd();
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

  const handleTimerEnd = () => {
    // Play sound notification
    if (audioRef.current) {
      audioRef.current.play().catch(console.error);
    }
    
    // Show session end dialog
    setShowSessionEndDialog(true);
  };

  const handleComplete = () => {
    const completeEvent: TimelineEvent = {
      id: crypto.randomUUID(),
      type: 'complete',
      timestamp: new Date(),
    };
    setTimeline(prev => [...prev, completeEvent]);
    onComplete();
  };

  const handleSessionEnd = () => {
    const completeEvent: TimelineEvent = {
      id: crypto.randomUUID(),
      type: 'complete',
      timestamp: new Date(),
    };
    setTimeline(prev => [...prev, completeEvent]);
    setShowSessionEndDialog(false);
    onComplete();
  };

  const handleExtendSession = () => {
    const extensionSeconds = extensionTime * 60;
    setTimeLeft(prev => prev + extensionSeconds);
    setTotalTimeSpent(prev => prev + extensionSeconds);
    
    const extensionEvent: TimelineEvent = {
      id: crypto.randomUUID(),
      type: 'extension',
      timestamp: new Date(),
      details: {
        extensionTime: extensionTime,
      },
    };
    setTimeline(prev => [...prev, extensionEvent]);
    setShowSessionEndDialog(false);
    setIsRunning(true);
  };

  const handleStop = () => {
    setIsRunning(false);
    const focusedTime = Math.floor((totalTimeSpent - timeLeft) / 60); // in minutes
    const interruptionCount = timeline.filter(event => event.type === 'interruption').length;
    const totalTime = Math.floor(totalTimeSpent / 60); // in minutes
    
    const stopEvent: TimelineEvent = {
      id: crypto.randomUUID(),
      type: 'complete',
      timestamp: new Date(),
    };
    const finalTimeline = [...timeline, stopEvent];
    
    onStop({ focusedTime, interruptionCount, totalTime, timeline: finalTimeline });
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
      setTotalTimeSpent(prev => prev + pauseDuration);
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
                  ? 'bg-muted hover:bg-muted/80 text-muted-foreground' 
                  : 'bg-primary hover:bg-primary/90'
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
              onClick={handleStop}
              variant="outline"
              size="lg"
              className="px-6 py-6 rounded-full border hover:bg-muted gentle-transition"
            >
              <Square className="w-5 h-5 mr-2" />
              Stop
            </Button>

            <Button
              onClick={onReset}
              variant="outline"
              size="lg"
              className="px-6 py-6 rounded-full border hover:bg-muted gentle-transition"
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

      {/* Session End Dialog */}
      <AlertDialog open={showSessionEndDialog} onOpenChange={setShowSessionEndDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>🎉 Timer Completed!</AlertDialogTitle>
            <AlertDialogDescription>
              Your focus session for "{task}" has ended. Would you like to mark this session as complete or extend it?
            </AlertDialogDescription>
          </AlertDialogHeader>
          <div className="py-4 space-y-4">
            <div className="space-y-2">
              <Label htmlFor="extension-time">Extend session by (minutes):</Label>
              <Input
                id="extension-time"
                type="number"
                min="1"
                max="60"
                value={extensionTime}
                onChange={(e) => setExtensionTime(parseInt(e.target.value) || 5)}
                className="w-full"
              />
            </div>
          </div>
          <AlertDialogFooter className="flex-col sm:flex-row gap-2">
            <AlertDialogAction
              onClick={handleExtendSession}
              className="bg-primary hover:bg-primary/90"
            >
              <Plus className="w-4 h-4 mr-2" />
              Extend by {extensionTime} min
            </AlertDialogAction>
            <AlertDialogCancel onClick={handleSessionEnd}>
              Complete Session
            </AlertDialogCancel>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}