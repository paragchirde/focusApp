import { useState, useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Slider } from "@/components/ui/slider";
import { Music, Pause, Play, SkipForward, Volume2, VolumeX } from "lucide-react";

const MUSIC_TRACKS = [
  {
    title: "Soft Piano Music",
    src: "https://res.cloudinary.com/phineas31/video/upload/v1757791085/soft-piano-music-312509_d2ezt2.mp3"
  },
  {
    title: "Jazz Club New Orleans",
    src: "https://res.cloudinary.com/phineas31/video/upload/v1757791085/the-best-jazz-club-in-new-orleans-164472_yv4q8l.mp3"
  },
  {
    title: "Golden Whisper Jazz",
    src: "https://res.cloudinary.com/phineas31/video/upload/v1757791084/background-jazz-golden-whisper-358520_cjpadt.mp3"
  },
  {
    title: "Jazz Background",
    src: "https://res.cloudinary.com/phineas31/video/upload/v1757791083/jazz-background-music-338663_gs0ssz.mp3"
  }
];

interface MusicPlayerProps {
  isTimerRunning: boolean;
  onMusicToggle: (isPlaying: boolean) => void;
}

export function MusicPlayer({ isTimerRunning, onMusicToggle }: MusicPlayerProps) {
  const [currentTrackIndex, setCurrentTrackIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [volume, setVolume] = useState([0.3]);
  const [isMuted, setIsMuted] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const previousVolume = useRef(0.3);

  // Initialize audio with CDN sources
  useEffect(() => {
    setIsLoading(true);
    const audio = new Audio();
    
    // Configure audio for CDN streaming
    audio.crossOrigin = "anonymous";
    audio.preload = "auto";
    audio.volume = volume[0];
    audio.loop = false;
    
    // Set source
    audio.src = MUSIC_TRACKS[currentTrackIndex].src;
    
    const handleTimeUpdate = () => setCurrentTime(audio.currentTime);
    
    const handleLoadedMetadata = () => {
      setDuration(audio.duration);
      setIsLoading(false);
    };
    
    const handleCanPlayThrough = () => {
      setIsLoading(false);
    };
    
    const handleWaiting = () => setIsLoading(true);
    
    const handleError = (e: Event) => {
      console.warn('Audio loading error:', e);
      setIsLoading(false);
      // Try next track on error
      setCurrentTrackIndex((prev) => (prev + 1) % MUSIC_TRACKS.length);
    };
    
    const handleEnded = () => {
      setCurrentTrackIndex((prev) => (prev + 1) % MUSIC_TRACKS.length);
    };

    // Add event listeners
    audio.addEventListener('timeupdate', handleTimeUpdate);
    audio.addEventListener('loadedmetadata', handleLoadedMetadata);
    audio.addEventListener('canplaythrough', handleCanPlayThrough);
    audio.addEventListener('waiting', handleWaiting);
    audio.addEventListener('error', handleError);
    audio.addEventListener('ended', handleEnded);
    
    audioRef.current = audio;

    return () => {
      audio.removeEventListener('timeupdate', handleTimeUpdate);
      audio.removeEventListener('loadedmetadata', handleLoadedMetadata);
      audio.removeEventListener('canplaythrough', handleCanPlayThrough);
      audio.removeEventListener('waiting', handleWaiting);
      audio.removeEventListener('error', handleError);
      audio.removeEventListener('ended', handleEnded);
      audio.pause();
    };
  }, [currentTrackIndex, volume]);

  // Auto-start music when timer starts (separate effect to avoid loops)
  useEffect(() => {
    if (!audioRef.current || isLoading) return;
    
    if (isTimerRunning && !isPlaying) {
      setIsPlaying(true);
      onMusicToggle(true);
    }
  }, [isTimerRunning, isLoading]);

  // Sync with timer state
  useEffect(() => {
    if (!audioRef.current) return;

    if (isTimerRunning && isPlaying) {
      audioRef.current.play().catch(console.error);
    } else {
      audioRef.current.pause();
    }
  }, [isTimerRunning, isPlaying]);

  const togglePlayPause = () => {
    const newIsPlaying = !isPlaying;
    setIsPlaying(newIsPlaying);
    onMusicToggle(newIsPlaying);
  };

  const handleVolumeChange = (newVolume: number[]) => {
    setVolume(newVolume);
    if (audioRef.current) {
      audioRef.current.volume = newVolume[0];
    }
    if (newVolume[0] > 0 && isMuted) {
      setIsMuted(false);
    }
  };

  const toggleMute = () => {
    if (!audioRef.current) return;
    
    if (isMuted) {
      setIsMuted(false);
      setVolume([previousVolume.current]);
      audioRef.current.volume = previousVolume.current;
    } else {
      previousVolume.current = volume[0];
      setIsMuted(true);
      setVolume([0]);
      audioRef.current.volume = 0;
    }
  };

  const nextTrack = () => {
    setCurrentTrackIndex((prev) => (prev + 1) % MUSIC_TRACKS.length);
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const currentTrack = MUSIC_TRACKS[currentTrackIndex];

  return (
    <Card className="card-shadow focus-glow bg-card/50 backdrop-blur-sm border-border/50">
      <CardContent className="p-4">
        {isLoading && (
          <div className="flex items-center justify-center gap-3 py-2">
            <div className="animate-spin rounded-full h-4 w-4 border-2 border-primary border-t-transparent"></div>
            <span className="text-sm text-muted-foreground">Loading music...</span>
          </div>
        )}
        
        {!isLoading && (
          <>
            <div className="flex items-center gap-3">
              {/* Music Icon & Track Info */}
              <div className="flex items-center gap-3 flex-1 min-w-0">
                <div className="p-2 rounded-full bg-primary/10">
                  <Music className="w-4 h-4 text-primary" />
                </div>
                <div className="flex-1 min-w-0">
                  <h4 className="text-sm font-medium text-foreground truncate">
                    {currentTrack.title}
                  </h4>
                  <div className="flex items-center gap-2 text-xs text-muted-foreground">
                    <span>{formatTime(currentTime)}</span>
                    <span>•</span>
                    <span>{formatTime(duration)}</span>
                  </div>
                </div>
              </div>

              {/* Controls */}
              <div className="flex items-center gap-2">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={togglePlayPause}
                  disabled={isLoading}
                  className="h-8 w-8 p-0 hover:bg-primary/10"
                >
                  {isLoading ? (
                    <div className="animate-spin rounded-full h-4 w-4 border-2 border-primary border-t-transparent"></div>
                  ) : isPlaying ? (
                    <Pause className="w-4 h-4" />
                  ) : (
                    <Play className="w-4 h-4" />
                  )}
                </Button>
              
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={nextTrack}
                  className="h-8 w-8 p-0 hover:bg-primary/10"
                >
                  <SkipForward className="w-4 h-4" />
                </Button>

                {/* Volume Control */}
                <div className="flex items-center gap-2 ml-2">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={toggleMute}
                    className="h-8 w-8 p-0 hover:bg-primary/10"
                  >
                    {isMuted || volume[0] === 0 ? (
                      <VolumeX className="w-4 h-4" />
                    ) : (
                      <Volume2 className="w-4 h-4" />
                    )}
                  </Button>
                  
                  <div className="w-16">
                    <Slider
                      value={volume}
                      onValueChange={handleVolumeChange}
                      max={1}
                      step={0.01}
                      className="w-full"
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Progress Bar */}
            <div className="mt-3">
              <div className="w-full bg-muted/30 rounded-full h-1">
                <div 
                  className="bg-primary h-1 rounded-full transition-all duration-300"
                  style={{ width: `${duration > 0 ? (currentTime / duration) * 100 : 0}%` }}
                />
              </div>
            </div>
          </>
        )}
      </CardContent>
    </Card>
  );
}