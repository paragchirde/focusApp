import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Play, Music } from "lucide-react";

interface TaskInputProps {
  onStartSession: (task: string, duration: number, enableMusic: boolean) => void;
}

const PRESET_DURATIONS = [
  { value: 25, label: "25 minutes" },
  { value: 45, label: "45 minutes" },
  { value: 60, label: "1 hour" },
  { value: 90, label: "1.5 hours" },
  { value: 120, label: "2 hours" },
];

export function TaskInput({ onStartSession }: TaskInputProps) {
  const [task, setTask] = useState("");
  const [duration, setDuration] = useState<number>(25);
  const [customDuration, setCustomDuration] = useState("");
  const [useCustom, setUseCustom] = useState(false);
  const [enableMusic, setEnableMusic] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!task.trim()) return;
    
    const finalDuration = useCustom ? parseInt(customDuration) : duration;
    if (finalDuration >= 1 && finalDuration <= 180) {
      onStartSession(task.trim(), finalDuration, enableMusic);
    }
  };

  const isValidCustomDuration = customDuration && 
    parseInt(customDuration) >= 1 && 
    parseInt(customDuration) <= 180;

  return (
    <Card className="card-shadow gentle-transition hover:shadow-lg">
      <CardContent className="p-4 sm:p-8">
        <form onSubmit={handleSubmit} className="space-y-4 sm:space-y-6">
          <div className="text-center mb-6 sm:mb-8">
            <h1 className="text-2xl sm:text-3xl font-light text-foreground mb-2">
              What would you like to focus on?
            </h1>
            <p className="text-muted-foreground text-base sm:text-lg">
              Create a distraction-free environment for deep work
            </p>
          </div>

          <div className="space-y-2">
            <Label htmlFor="task" className="text-base font-medium">
              Focus Task
            </Label>
            <Input
              id="task"
              value={task}
              onChange={(e) => setTask(e.target.value)}
              placeholder="e.g., Write project proposal, Study chapter 5..."
              className="text-base sm:text-lg py-4 sm:py-6 border-2 focus:border-primary gentle-transition"
              autoFocus
            />
          </div>

          <div className="space-y-4">
            <Label className="text-base font-medium">Duration</Label>
            
            <div className="space-y-3">
              <div className="flex items-center space-x-2">
                <input
                  type="radio"
                  id="preset"
                  name="durationType"
                  checked={!useCustom}
                  onChange={() => setUseCustom(false)}
                  className="text-primary"
                />
                <Label htmlFor="preset">Choose preset</Label>
              </div>
              
              {!useCustom && (
                <Select value={duration.toString()} onValueChange={(value) => setDuration(Number(value))}>
                  <SelectTrigger className="border-2 focus:border-primary">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {PRESET_DURATIONS.map((preset) => (
                      <SelectItem key={preset.value} value={preset.value.toString()}>
                        {preset.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              )}

              <div className="flex items-center space-x-2">
                <input
                  type="radio"
                  id="custom"
                  name="durationType"
                  checked={useCustom}
                  onChange={() => setUseCustom(true)}
                  className="text-primary"
                />
                <Label htmlFor="custom">Custom duration</Label>
              </div>
              
              {useCustom && (
                <div className="flex items-center space-x-2">
                  <Input
                    type="number"
                    value={customDuration}
                    onChange={(e) => setCustomDuration(e.target.value)}
                    placeholder="30"
                    min="1"
                    max="180"
                    className="w-24 border-2 focus:border-primary"
                  />
                  <span className="text-muted-foreground">minutes (1-180)</span>
                </div>
              )}
            </div>
            </div>

            {/* Music Option */}
            <div className="space-y-3">
              <div className="flex items-center space-x-2">
                <Checkbox 
                  id="enable-music" 
                  checked={enableMusic}
                  onCheckedChange={(checked) => setEnableMusic(checked as boolean)}
                />
                <Label 
                  htmlFor="enable-music" 
                  className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 flex items-center gap-2"
                >
                  <Music className="w-4 h-4 text-primary" />
                  Play calming background music during focus session
                </Label>
              </div>
              {enableMusic && (
                <p className="text-xs text-muted-foreground ml-6">
                  Relaxing jazz and piano music will play softly in the background to help you focus.
                </p>
              )}
            </div>

            <Button
            type="submit"
            disabled={!task.trim() || (useCustom && !isValidCustomDuration)}
            className="w-full py-4 sm:py-6 text-base sm:text-lg bg-primary hover:bg-primary-glow gentle-transition group"
          >
            <Play className="w-5 h-5 mr-2 group-hover:scale-110 gentle-transition" />
            Start Focus Session
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}