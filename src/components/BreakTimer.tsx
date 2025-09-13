import { useState, useEffect, useRef } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Pause, Play, Square, Coffee, Heart, Leaf, Sun, Sparkles, Wind, Droplets, TreePine, Smile, Eye, Clock, Apple, Users, Mountain, Book, Music2, Move } from "lucide-react";

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
      "Take a deep breath and let your mind settle 🌸",
      "Your eyes deserve a gentle rest from the screen",
      "Stretch your body and feel the tension melt away",
      "A moment of mindfulness can refresh your spirit",
      "Look out the window and let nature calm you",
      "Roll your shoulders and release the stress",
      "Close your eyes and listen to your breathing"
    ],
    medium: [
      "Step away and give yourself some loving space",
      "Take a mindful walk and reconnect with yourself",
      "Nourish your body with something wholesome",
      "Do some gentle stretches to awaken your muscles",
      "Spend a moment in gratitude for your progress",
      "Let fresh air fill your lungs and clear your mind",
      "Practice a few minutes of peaceful meditation"
    ],
    long: [
      "This is your time to truly rest and recharge",
      "Take a meaningful walk in nature's embrace",
      "Enjoy a nourishing meal mindfully and slowly",
      "Connect with someone you care about",
      "Practice mindfulness and be present in this moment",
      "Move your body in ways that feel good",
      "Read something inspiring or listen to calming music",
      "Rest deeply - you've earned this peaceful time"
    ],
  };

  // Cycling through messages with smooth transitions
  const [currentMessageIndex, setCurrentMessageIndex] = useState(0);
  const [isMessageVisible, setIsMessageVisible] = useState(true);

  // Cycle through messages every 8 seconds with fade transition
  useEffect(() => {
    const messageInterval = setInterval(() => {
      setIsMessageVisible(false);
      
      setTimeout(() => {
        setCurrentMessageIndex((prev) => 
          (prev + 1) % breakMessages[breakType].length
        );
        setIsMessageVisible(true);
      }, 300); // Half-second fade out before changing
    }, 8000);

    return () => clearInterval(messageInterval);
  }, [breakType]);

  const currentMessage = breakMessages[breakType][currentMessageIndex];

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-timer-break/5 flex items-center justify-center p-4">
      <Card className="card-shadow focus-glow bg-gradient-to-br from-background/95 via-background to-timer-break/10 backdrop-blur-sm border border-timer-break/20 max-w-2xl w-full">
      <CardContent className="p-8 sm:p-12 text-center relative overflow-hidden">
        <div className="mb-8">
          <div className="relative">
            <Coffee className="w-16 h-16 text-timer-break mx-auto mb-4 animate-pulse" />
            <Heart className="w-6 h-6 text-red-400 absolute top-0 right-1/2 translate-x-8 animate-bounce" />
          </div>
          <h1 className="text-4xl font-light text-foreground mb-4 animate-fade-in">
            {config.label}
          </h1>
          <div className={`transition-opacity duration-300 ${isMessageVisible ? 'opacity-100' : 'opacity-0'}`}>
            <p className="text-xl text-muted-foreground leading-relaxed px-4">
              {currentMessage}
            </p>
          </div>
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
        <div className="bg-gradient-to-r from-timer-break/10 to-primary/5 rounded-xl p-6 mb-8 border border-timer-break/20">
          <div className="flex items-center justify-center gap-2 mb-4">
            <Sparkles className="w-5 h-5 text-timer-break" />
            <h3 className="font-medium text-foreground">
              Gentle Break Ideas
            </h3>
            <Sparkles className="w-5 h-5 text-timer-break" />
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-sm">
            {breakType === 'short' && (
              <>
                <div className="flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors p-2 rounded-lg hover:bg-background/50">
                  <Wind className="w-4 h-4 text-blue-400" />
                  <span>Deep breathing exercises</span>
                </div>
                <div className="flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors p-2 rounded-lg hover:bg-background/50">
                  <Eye className="w-4 h-4 text-green-400" />
                  <span>Gentle eye movements</span>
                </div>
                <div className="flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors p-2 rounded-lg hover:bg-background/50">
                  <Move className="w-4 h-4 text-purple-400" />
                  <span>Neck and shoulder stretches</span>
                </div>
                <div className="flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors p-2 rounded-lg hover:bg-background/50">
                  <Droplets className="w-4 h-4 text-cyan-400" />
                  <span>Sip some refreshing water</span>
                </div>
                <div className="flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors p-2 rounded-lg hover:bg-background/50">
                  <Sun className="w-4 h-4 text-yellow-400" />
                  <span>Look at something distant</span>
                </div>
              </>
            )}
            {breakType === 'medium' && (
              <>
                <div className="flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors p-2 rounded-lg hover:bg-background/50">
                  <TreePine className="w-4 h-4 text-green-500" />
                  <span>Short mindful walk</span>
                </div>
                <div className="flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors p-2 rounded-lg hover:bg-background/50">
                  <Apple className="w-4 h-4 text-red-400" />
                  <span>Healthy light snack</span>
                </div>
                <div className="flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors p-2 rounded-lg hover:bg-background/50">
                  <Heart className="w-4 h-4 text-pink-400" />
                  <span>Brief meditation</span>
                </div>
                <div className="flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors p-2 rounded-lg hover:bg-background/50">
                  <Wind className="w-4 h-4 text-blue-400" />
                  <span>Step outside for fresh air</span>
                </div>
                <div className="flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors p-2 rounded-lg hover:bg-background/50">
                  <Smile className="w-4 h-4 text-yellow-400" />
                  <span>Practice gratitude</span>
                </div>
              </>
            )}
            {breakType === 'long' && (
              <>
                <div className="flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors p-2 rounded-lg hover:bg-background/50">
                  <Mountain className="w-4 h-4 text-green-600" />
                  <span>Nature walk or outdoor time</span>
                </div>
                <div className="flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors p-2 rounded-lg hover:bg-background/50">
                  <Apple className="w-4 h-4 text-red-500" />
                  <span>Nourishing meal</span>
                </div>
                <div className="flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors p-2 rounded-lg hover:bg-background/50">
                  <Users className="w-4 h-4 text-purple-400" />
                  <span>Connect with loved ones</span>
                </div>
                <div className="flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors p-2 rounded-lg hover:bg-background/50">
                  <Move className="w-4 h-4 text-orange-400" />
                  <span>Full body stretching</span>
                </div>
                <div className="flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors p-2 rounded-lg hover:bg-background/50">
                  <Book className="w-4 h-4 text-indigo-400" />
                  <span>Read something inspiring</span>
                </div>
                <div className="flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors p-2 rounded-lg hover:bg-background/50">
                  <Music2 className="w-4 h-4 text-pink-500" />
                  <span>Listen to calming music</span>
                </div>
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
    </div>
  );
}