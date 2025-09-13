import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Clock, Zap, RotateCcw } from "lucide-react";

interface SessionStoppedProps {
  task: string;
  duration: number;
  focusedTime: number;
  interruptionCount: number;
  onStartBreak: (breakType: 'short' | 'medium' | 'long') => void;
  onNewSession: () => void;
}

export function SessionStopped({ 
  task, 
  duration, 
  focusedTime, 
  interruptionCount, 
  onStartBreak, 
  onNewSession 
}: SessionStoppedProps) {
  const focusPercentage = Math.round((focusedTime / duration) * 100);

  return (
    <div className="space-y-8">
      <Card className="card-shadow">
        <CardContent className="p-12 text-center">
          <div className="mb-8">
            <div className="w-16 h-16 bg-muted rounded-full flex items-center justify-center mx-auto mb-4">
              <Clock className="w-8 h-8 text-muted-foreground" />
            </div>
            <h1 className="text-3xl font-medium text-foreground mb-2">
              Session Stopped
            </h1>
            <p className="text-lg text-muted-foreground">
              Task: <span className="font-medium text-foreground">{task}</span>
            </p>
          </div>

          {/* Statistics */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <div className="p-6 bg-muted/50 rounded-lg">
              <div className="text-2xl font-semibold text-foreground">{focusedTime} min</div>
              <div className="text-sm text-muted-foreground">Focused Time</div>
            </div>
            <div className="p-6 bg-muted/50 rounded-lg">
              <div className="text-2xl font-semibold text-foreground">{interruptionCount}</div>
              <div className="text-sm text-muted-foreground">Interruptions</div>
            </div>
            <div className="p-6 bg-muted/50 rounded-lg">
              <div className="text-2xl font-semibold text-foreground">{focusPercentage}%</div>
              <div className="text-sm text-muted-foreground">Focus Efficiency</div>
            </div>
          </div>

          {/* Actions */}
          <div className="space-y-4">
            <div>
              <h3 className="text-lg font-medium text-foreground mb-4">Take a break?</h3>
              <div className="flex flex-wrap justify-center gap-3 mb-6">
                <Button
                  onClick={() => onStartBreak('short')}
                  variant="outline"
                  className="px-6 py-3 hover:bg-muted gentle-transition"
                >
                  <Zap className="w-4 h-4 mr-2" />
                  5 min break
                </Button>
                <Button
                  onClick={() => onStartBreak('medium')}
                  variant="outline"
                  className="px-6 py-3 hover:bg-muted gentle-transition"
                >
                  <Clock className="w-4 h-4 mr-2" />
                  15 min break
                </Button>
                <Button
                  onClick={() => onStartBreak('long')}
                  variant="outline"
                  className="px-6 py-3 hover:bg-muted gentle-transition"
                >
                  <Clock className="w-4 h-4 mr-2" />
                  25 min break
                </Button>
              </div>
            </div>
            
            <Button
              onClick={onNewSession}
              className="px-8 py-3 bg-primary hover:bg-primary/90 gentle-transition"
            >
              <RotateCcw className="w-4 h-4 mr-2" />
              Start New Session
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}