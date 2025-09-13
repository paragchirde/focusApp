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
    <div className="max-w-2xl mx-auto space-y-6">
      <Card>
        <CardContent className="p-8 text-center">
          <div className="mb-8">
            <div className="w-16 h-16 bg-secondary rounded-full flex items-center justify-center mx-auto mb-4">
              <Clock className="w-8 h-8 text-muted-foreground" />
            </div>
            <h1 className="notion-heading-xl mb-2">
              Session Stopped
            </h1>
            <p className="notion-text-muted">
              Task: <span className="notion-text font-medium">{task}</span>
            </p>
          </div>

          {/* Statistics */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
            <div className="p-6 bg-secondary rounded-lg border border-border">
              <div className="text-2xl font-semibold text-foreground mb-1">{focusedTime} min</div>
              <div className="notion-text-muted">Focused Time</div>
            </div>
            <div className="p-6 bg-secondary rounded-lg border border-border">
              <div className="text-2xl font-semibold text-foreground mb-1">{interruptionCount}</div>
              <div className="notion-text-muted">Interruptions</div>
            </div>
            <div className="p-6 bg-secondary rounded-lg border border-border">
              <div className="text-2xl font-semibold text-foreground mb-1">{focusPercentage}%</div>
              <div className="notion-text-muted">Focus Efficiency</div>
            </div>
          </div>

          {/* Actions */}
          <div className="space-y-6">
            <div>
              <h3 className="notion-heading-md mb-4">Take a break?</h3>
              <div className="flex flex-wrap justify-center gap-3 mb-6">
                <Button
                  onClick={() => onStartBreak('short')}
                  variant="outline"
                  size="default"
                >
                  <Zap className="w-4 h-4 mr-2" />
                  5 min break
                </Button>
                <Button
                  onClick={() => onStartBreak('medium')}
                  variant="outline"
                  size="default"
                >
                  <Clock className="w-4 h-4 mr-2" />
                  15 min break
                </Button>
                <Button
                  onClick={() => onStartBreak('long')}
                  variant="outline"
                  size="default"
                >
                  <Clock className="w-4 h-4 mr-2" />
                  25 min break
                </Button>
              </div>
            </div>
            
            <Button
              onClick={onNewSession}
              size="lg"
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