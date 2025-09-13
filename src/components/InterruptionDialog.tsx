import { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { AlertTriangle, Clock } from "lucide-react";

interface InterruptionDialogProps {
  open: boolean;
  onSubmit: (reason: string, addTimeBack: boolean) => void;
  pauseDuration: number;
}

export function InterruptionDialog({ open, onSubmit, pauseDuration }: InterruptionDialogProps) {
  const [reason, setReason] = useState("");
  const [addTimeBack, setAddTimeBack] = useState(true);
  const [currentPauseDuration, setCurrentPauseDuration] = useState(pauseDuration);

  // Update duration every second while dialog is open
  useEffect(() => {
    if (!open) return;

    const interval = setInterval(() => {
      setCurrentPauseDuration(prev => prev + 1);
    }, 1000);

    return () => clearInterval(interval);
  }, [open]);

  // Reset state when dialog opens
  useEffect(() => {
    if (open) {
      setReason("");
      setAddTimeBack(true);
      setCurrentPauseDuration(pauseDuration);
    }
  }, [open, pauseDuration]);

  const formatDuration = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    if (mins > 0) {
      return `${mins}m ${secs}s`;
    }
    return `${secs}s`;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!reason.trim()) return;
    onSubmit(reason.trim(), addTimeBack);
  };

  const commonReasons = [
    "Phone notification",
    "Someone interrupted me",
    "Bathroom break",
    "Got distracted",
    "Needed water/coffee",
    "Email/message",
  ];

  return (
    <Dialog open={open} onOpenChange={() => {}}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <div className="flex items-center gap-2">
            <AlertTriangle className="w-5 h-5 text-warning" />
            <DialogTitle>Focus Interrupted</DialogTitle>
          </div>
          <DialogDescription>
            Help us understand what broke your focus to improve future sessions.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Pause Duration Display */}
          <div className="flex items-center justify-center p-4 bg-accent rounded-lg">
            <Clock className="w-5 h-5 text-accent-foreground mr-2" />
            <span className="text-lg font-medium text-accent-foreground">
              Paused for: {formatDuration(currentPauseDuration)}
            </span>
          </div>

          {/* Reason Input */}
          <div className="space-y-2">
            <Label htmlFor="reason">What interrupted you?</Label>
            <Input
              id="reason"
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              placeholder="Describe the interruption..."
              autoFocus
            />
          </div>

          {/* Quick Reason Buttons */}
          <div className="space-y-2">
            <Label>Common reasons:</Label>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              {commonReasons.map((commonReason) => (
                <Button
                  key={commonReason}
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => setReason(commonReason)}
                  className="text-left justify-start text-xs sm:text-sm"
                >
                  {commonReason}
                </Button>
              ))}
            </div>
          </div>

          {/* Add Time Back Option */}
          <div className="flex items-center space-x-2 p-4 bg-muted rounded-lg">
            <Checkbox
              id="addTimeBack"
              checked={addTimeBack}
              onCheckedChange={(checked) => setAddTimeBack(checked as boolean)}
            />
            <Label htmlFor="addTimeBack" className="text-sm">
              Add the {formatDuration(currentPauseDuration)} back to my timer
            </Label>
          </div>

          {/* Submit Button */}
          <Button
            type="submit"
            disabled={!reason.trim()}
            className="w-full"
          >
            Continue Focus Session
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
}