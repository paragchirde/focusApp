import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { CheckCircle2, Coffee, Play, RotateCcw, Clock, Zap, Target } from "lucide-react";
import { Timeline } from "./Timeline";
import { TimelineEvent } from "./FocusTimer";

interface SessionCompleteProps {
  task: string;
  duration: number;
  focusedTime: number;
  totalTime: number;
  interruptionCount: number;
  timelineEvents: TimelineEvent[];
  onStartBreak: (breakType: 'short' | 'medium' | 'long') => void;
  onNewSession: () => void;
}

const BREAK_TYPES = [
  {
    type: 'short' as const,
    duration: 5,
    label: 'Short Break',
    description: 'Quick refresh',
    icon: Coffee,
  },
  {
    type: 'medium' as const,
    duration: 15,
    label: 'Medium Break',
    description: 'Stretch and recharge',
    icon: Coffee,
  },
  {
    type: 'long' as const,
    duration: 25,
    label: 'Long Break',
    description: 'Full reset',
    icon: Coffee,
  },
];

const MOTIVATIONAL_QUOTES = [
  "The secret of getting ahead is getting started. Great work on completing this session!",
  "Focus is a matter of deciding what things you're not going to do. You chose wisely today.",
  "Deep work is a skill that has great value today. You're building that muscle beautifully.",
  "Excellence is never an accident. Your focused effort today moves you closer to mastery.",
  "The best way to get started is to quit talking and begin doing. You did just that!",
  "Success isn't just about what you accomplish, but what you inspire others to do through your example.",
];

export function SessionComplete({ 
  task, 
  duration, 
  focusedTime, 
  totalTime, 
  interruptionCount, 
  timelineEvents, 
  onStartBreak, 
  onNewSession 
}: SessionCompleteProps) {
  const focusEfficiency = Math.round((focusedTime / totalTime) * 100);
  const extraTime = totalTime - duration;
  const randomQuote = MOTIVATIONAL_QUOTES[Math.floor(Math.random() * MOTIVATIONAL_QUOTES.length)];
  return (
    <div className="space-y-8">
      {/* Completion Card */}
      <Card className="card-shadow focus-glow bg-gradient-to-br from-success/5 to-background">
        <CardContent className="p-12 text-center">
          <div className="mb-8">
            <CheckCircle2 className="w-20 h-20 text-success mx-auto mb-6" />
            <h1 className="text-4xl font-light text-foreground mb-4">
              Session Complete! 🎉
            </h1>
            <p className="text-xl text-muted-foreground mb-2">
              You successfully focused on
            </p>
            <h2 className="text-3xl font-medium text-success mb-4">
              {task}
            </h2>
            <p className="text-lg text-muted-foreground">
              Planned: {duration} minutes • Actual: {focusedTime} minutes focused
            </p>
          </div>

          {/* Motivational Quote */}
          <div className="bg-primary/5 rounded-xl p-6 mb-8 border border-primary/10">
            <p className="text-lg italic text-foreground leading-relaxed">
              "{randomQuote}"
            </p>
          </div>

          {/* Detailed Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
            <div className="bg-success/10 rounded-lg p-4 border border-success/20">
              <div className="flex items-center justify-center mb-2">
                <Target className="w-5 h-5 text-success" />
              </div>
              <div className="text-2xl font-semibold text-success">{focusedTime} min</div>
              <div className="text-sm text-muted-foreground">Pure Focus</div>
            </div>
            <div className="bg-primary/10 rounded-lg p-4 border border-primary/20">
              <div className="flex items-center justify-center mb-2">
                <Clock className="w-5 h-5 text-primary" />
              </div>
              <div className="text-2xl font-semibold text-primary">{totalTime} min</div>
              <div className="text-sm text-muted-foreground">Total Time</div>
            </div>
            <div className="bg-warning/10 rounded-lg p-4 border border-warning/20">
              <div className="flex items-center justify-center mb-2">
                <Zap className="w-5 h-5 text-warning" />
              </div>
              <div className="text-2xl font-semibold text-warning">{interruptionCount}</div>
              <div className="text-sm text-muted-foreground">Interruptions</div>
            </div>
            <div className="bg-success/10 rounded-lg p-4 border border-success/20">
              <div className="flex items-center justify-center mb-2">
                <CheckCircle2 className="w-5 h-5 text-success" />
              </div>
              <div className="text-2xl font-semibold text-success">{focusEfficiency}%</div>
              <div className="text-sm text-muted-foreground">Efficiency</div>
            </div>
          </div>

          {extraTime > 0 && (
            <div className="bg-accent/10 rounded-lg p-4 mb-8 border border-accent/20">
              <p className="text-accent text-sm">
                <strong>+{extraTime} minutes</strong> were added back to maintain your focus quality during interruptions
              </p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Session Timeline */}
      <Timeline events={timelineEvents} />

      {/* Break Options */}
      <Card className="card-shadow">
        <CardContent className="p-8">
          <h3 className="text-2xl font-light text-foreground mb-6 text-center">
            What's next?
          </h3>
          
          <div className="space-y-4 mb-8">
            <h4 className="text-lg font-medium text-foreground mb-4">
              Take a break:
            </h4>
            <div className="grid gap-4">
              {BREAK_TYPES.map((breakType) => (
                <Button
                  key={breakType.type}
                  onClick={() => onStartBreak(breakType.type)}
                  variant="outline"
                  className="h-auto p-6 text-left flex items-center justify-between hover:border-timer-break hover:bg-timer-break/5 gentle-transition"
                >
                  <div className="flex items-center gap-4">
                    <breakType.icon className="w-6 h-6 text-timer-break" />
                    <div>
                      <div className="font-medium">{breakType.label}</div>
                      <div className="text-sm text-muted-foreground">
                        {breakType.duration} minutes • {breakType.description}
                      </div>
                    </div>
                  </div>
                  <Play className="w-5 h-5 text-timer-break" />
                </Button>
              ))}
            </div>
          </div>

          <div className="pt-6 border-t">
            <Button
              onClick={onNewSession}
              className="w-full py-6 text-lg bg-primary hover:bg-primary-glow gentle-transition"
            >
              <RotateCcw className="w-5 h-5 mr-2" />
              Start New Focus Session
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}