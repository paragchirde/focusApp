import { useState, useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Slider } from "@/components/ui/slider";
import { Music, Pause, Play, SkipForward, Volume2, VolumeX } from "lucide-react";

const MUSIC_TRACKS = [
  {
    title: "Focus Jazz Cafe",
    src: "https://cdn.pixabay.com/audio/2023/01/04/audio_e6ecb06e79.mp3"
  },
  {
    title: "Lofi Study Beats",
    src: "https://cdn.pixabay.com/audio/2022/10/25/audio_78ca2ba3fe.mp3"
  },
  {
    title: "Calm Piano",
    src: "https://cdn.pixabay.com/audio/2022/11/27/audio_1e4a091dd9.mp3"
  },
  {
    title: "Peaceful Background",
    src: "https://cdn.pixabay.com/audio/2023/02/28/audio_eb80b67cea.mp3"
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

  // Initialize audio with CDN optimization
  useEffect(() => {
    setIsLoading(true);
    const audio = new Audio();
    
    // Optimize for CDN streaming
    audio.crossOrigin = "anonymous";
    audio.preload = "auto";
    audio.volume = volume[0];
    audio.loop = false;
    
    // Set source after configuring
    audio.src = MUSIC_TRACKS[currentTrackIndex].src;
    
    const handleTimeUpdate = () => setCurrentTime(audio.currentTime);
    const handleLoadedMetadata = () => {
      setDuration(audio.duration);
      setIsLoading(false);
      // Auto-start music if timer is running
      if (isTimerRunning && !isPlaying) {
        setIsPlaying(true);
        onMusicToggle(true);
        audio.play().catch(console.error);
      }
    };
    const handleCanPlayThrough = () => {
      setIsLoading(false);
      // Auto-start music if timer is running
      if (isTimerRunning && !isPlaying) {
        setIsPlaying(true);
        onMusicToggle(true);
        audio.play().catch(console.error);
      }
    };
    const handleWaiting = () => setIsLoading(true);
    const handleError = (e: Event) => {
      console.warn('Audio loading error, trying next track:', e);
      setCurrentTrackIndex((prev) => (prev + 1) % MUSIC_TRACKS.length);
    };
    const handleEnded = () => {
      setCurrentTrackIndex((prev) => (prev + 1) % MUSIC_TRACKS.length);
    };

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

  // Sync with timer state and auto-start music
  useEffect(() => {
    if (!audioRef.current) return;

    if (isTimerRunning) {
      // Auto-start music when timer is running
      if (!isPlaying) {
        setIsPlaying(true);
        onMusicToggle(true);
      }
      audioRef.current.play().catch(console.error);
    } else {
      audioRef.current.pause();
    }
  }, [isTimerRunning, isPlaying, onMusicToggle]);

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