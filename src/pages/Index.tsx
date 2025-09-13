import { useState } from "react";
import { TaskInput } from "@/components/TaskInput";
import { FocusTimer } from "@/components/FocusTimer";
import { SessionComplete } from "@/components/SessionComplete";
import { BreakTimer } from "@/components/BreakTimer";
import { useToast } from "@/hooks/use-toast";

type AppState = 
  | { type: 'input' }
  | { type: 'focus'; task: string; duration: number }
  | { type: 'complete'; task: string; duration: number }
  | { type: 'break'; breakType: 'short' | 'medium' | 'long' };

const Index = () => {
  const [state, setState] = useState<AppState>({ type: 'input' });
  const { toast } = useToast();

  const handleStartSession = (task: string, duration: number) => {
    setState({ type: 'focus', task, duration });
    toast({
      title: "Focus session started",
      description: `Focusing on: ${task} for ${duration} minutes`,
    });
  };

  const handleSessionComplete = () => {
    if (state.type === 'focus') {
      setState({ type: 'complete', task: state.task, duration: state.duration });
      toast({
        title: "🎉 Session completed!",
        description: "Congratulations on completing your focus session!",
      });
    }
  };

  const handleReset = () => {
    setState({ type: 'input' });
  };

  const handleStartBreak = (breakType: 'short' | 'medium' | 'long') => {
    setState({ type: 'break', breakType });
    const duration = breakType === 'short' ? 5 : breakType === 'medium' ? 15 : 25;
    toast({
      title: "Break started",
      description: `Enjoy your ${duration}-minute ${breakType} break!`,
    });
  };

  const handleBreakComplete = () => {
    setState({ type: 'input' });
    toast({
      title: "Break complete!",
      description: "Ready for another focus session?",
    });
  };

  const handleNewSession = () => {
    setState({ type: 'input' });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-muted/20">
      <div className="container mx-auto px-4 py-8 max-w-4xl">
        {state.type === 'input' && (
          <div className="flex items-center justify-center min-h-[80vh]">
            <div className="w-full max-w-2xl">
              <TaskInput onStartSession={handleStartSession} />
            </div>
          </div>
        )}

        {state.type === 'focus' && (
          <div className="py-8">
            <FocusTimer
              task={state.task}
              initialDuration={state.duration}
              onComplete={handleSessionComplete}
              onReset={handleReset}
            />
          </div>
        )}

        {state.type === 'complete' && (
          <div className="py-8">
            <SessionComplete
              task={state.task}
              duration={state.duration}
              onStartBreak={handleStartBreak}
              onNewSession={handleNewSession}
            />
          </div>
        )}

        {state.type === 'break' && (
          <div className="flex items-center justify-center min-h-[80vh]">
            <div className="w-full max-w-2xl">
              <BreakTimer
                breakType={state.breakType}
                onComplete={handleBreakComplete}
                onSkip={handleBreakComplete}
              />
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Index;
