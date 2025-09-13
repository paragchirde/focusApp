import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { 
  Play, 
  Pause, 
  RotateCcw, 
  CheckCircle2, 
  AlertTriangle,
  Clock
} from "lucide-react";
import { TimelineEvent } from "./FocusTimer";

interface TimelineProps {
  events: TimelineEvent[];
}

export function Timeline({ events }: TimelineProps) {
  if (events.length === 0) return null;

  const getEventIcon = (type: TimelineEvent['type']) => {
    switch (type) {
      case 'start':
        return <Play className="w-4 h-4 text-success" />;
      case 'pause':
        return <Pause className="w-4 h-4 text-warning" />;
      case 'resume':
        return <Play className="w-4 h-4 text-primary" />;
      case 'complete':
        return <CheckCircle2 className="w-4 h-4 text-success" />;
      case 'interruption':
        return <AlertTriangle className="w-4 h-4 text-warning" />;
      default:
        return <Clock className="w-4 h-4 text-muted-foreground" />;
    }
  };

  const getEventLabel = (type: TimelineEvent['type']) => {
    switch (type) {
      case 'start':
        return 'Session Started';
      case 'pause':
        return 'Paused';
      case 'resume':
        return 'Resumed';
      case 'complete':
        return 'Session Complete';
      case 'interruption':
        return 'Interruption';
      default:
        return 'Event';
    }
  };

  const getDotClass = (type: TimelineEvent['type']) => {
    switch (type) {
      case 'start':
        return 'timeline-dot timeline-dot-start';
      case 'pause':
      case 'interruption':
        return 'timeline-dot timeline-dot-pause';
      case 'resume':
        return 'timeline-dot timeline-dot-resume';
      case 'complete':
        return 'timeline-dot timeline-dot-complete';
      default:
        return 'timeline-dot bg-muted-foreground';
    }
  };

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString([], { 
      hour: '2-digit', 
      minute: '2-digit',
      second: '2-digit'
    });
  };

  const formatDuration = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    if (mins > 0) {
      return `${mins}m ${secs}s`;
    }
    return `${secs}s`;
  };

  return (
    <Card className="card-shadow">
      <CardHeader className="pb-4">
        <CardTitle className="flex items-center gap-2 text-xl font-light">
          <Clock className="w-5 h-5 text-primary" />
          Session Timeline
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {events.map((event, index) => {
            const isLast = index === events.length - 1;
            
            return (
              <div key={event.id} className="flex items-start gap-4">
                {/* Timeline Line */}
                <div className="flex flex-col items-center">
                  <div className={getDotClass(event.type)} />
                  {!isLast && (
                    <div className="w-0.5 h-8 bg-border mt-2" />
                  )}
                </div>

                {/* Event Content */}
                <div className="flex-1 min-w-0 pb-4">
                  <div className="flex items-center justify-between mb-1">
                    <div className="flex items-center gap-2">
                      {getEventIcon(event.type)}
                      <span className="font-medium text-foreground">
                        {getEventLabel(event.type)}
                      </span>
                    </div>
                    <span className="text-sm text-muted-foreground tabular-nums">
                      {formatTime(event.timestamp)}
                    </span>
                  </div>

                  {/* Event Details */}
                  {event.details && (
                    <div className="mt-2 space-y-2">
                      {event.details.reason && (
                        <div className="text-sm text-muted-foreground">
                          <span className="font-medium">Reason:</span> {event.details.reason}
                        </div>
                      )}
                      
                      {event.details.pauseDuration !== undefined && (
                        <div className="flex items-center gap-2">
                          <Badge variant="outline" className="text-xs">
                            Duration: {formatDuration(event.details.pauseDuration)}
                          </Badge>
                          {event.details.addedBack && (
                            <Badge className="bg-success text-success-foreground text-xs">
                              Time Added Back
                            </Badge>
                          )}
                        </div>
                      )}
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
}