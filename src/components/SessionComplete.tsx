import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { CheckCircle2, Coffee, Play, RotateCcw } from "lucide-react";

interface SessionCompleteProps {
  task: string;
  duration: number;
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

export function SessionComplete({ task, duration, onStartBreak, onNewSession }: SessionCompleteProps) {
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
              for {duration} minutes of deep work
            </p>
          </div>

          {/* Achievement Stats */}
          <div className="bg-success/10 rounded-xl p-6 mb-8">
            <div className="grid grid-cols-3 gap-4 text-center">
              <div>
                <div className="text-2xl font-semibold text-success">{duration}</div>
                <div className="text-sm text-muted-foreground">Minutes</div>
              </div>
              <div>
                <div className="text-2xl font-semibold text-success">1</div>
                <div className="text-sm text-muted-foreground">Session</div>
              </div>
              <div>
                <div className="text-2xl font-semibold text-success">100%</div>
                <div className="text-sm text-muted-foreground">Focus</div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

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