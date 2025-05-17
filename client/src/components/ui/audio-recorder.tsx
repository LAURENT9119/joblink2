import { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { useTranslation } from "@/hooks/use-translation";
import { Mic, MicOff, Loader2, Trash, Save, Play, Square } from "lucide-react";

interface AudioRecorderProps {
  onAudioReady?: (blob: Blob, url: string) => void;
  defaultAudioUrl?: string;
  maxDuration?: number; // in seconds
  className?: string;
}

export function AudioRecorder({
  onAudioReady,
  defaultAudioUrl,
  maxDuration = 60,
  className = "",
}: AudioRecorderProps) {
  const { t } = useTranslation();
  const [isRecording, setIsRecording] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [recordingTime, setRecordingTime] = useState(0);
  const [audioBlob, setAudioBlob] = useState<Blob | null>(null);
  const [audioUrl, setAudioUrl] = useState<string | null>(defaultAudioUrl || null);
  
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const chunksRef = useRef<BlobPart[]>([]);
  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  
  // Set up the audio element
  useEffect(() => {
    audioRef.current = new Audio();
    
    if (defaultAudioUrl) {
      setAudioUrl(defaultAudioUrl);
      audioRef.current.src = defaultAudioUrl;
    }
    
    const handleAudioEnded = () => setIsPlaying(false);
    
    if (audioRef.current) {
      audioRef.current.addEventListener('ended', handleAudioEnded);
    }
    
    return () => {
      if (audioRef.current) {
        audioRef.current.removeEventListener('ended', handleAudioEnded);
      }
      
      if (audioUrl && audioUrl !== defaultAudioUrl) {
        URL.revokeObjectURL(audioUrl);
      }
    };
  }, [defaultAudioUrl]);
  
  // Handle recording timer
  useEffect(() => {
    if (isRecording) {
      timerRef.current = setInterval(() => {
        setRecordingTime(prev => {
          if (prev >= maxDuration) {
            stopRecording();
            return prev;
          }
          return prev + 1;
        });
      }, 1000);
    } else {
      if (timerRef.current) {
        clearInterval(timerRef.current);
        timerRef.current = null;
      }
    }
    
    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
    };
  }, [isRecording, maxDuration]);
  
  const startRecording = async () => {
    try {
      setRecordingTime(0);
      chunksRef.current = [];
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      
      mediaRecorderRef.current = new MediaRecorder(stream);
      
      mediaRecorderRef.current.ondataavailable = (e) => {
        if (e.data.size > 0) {
          chunksRef.current.push(e.data);
        }
      };
      
      mediaRecorderRef.current.onstop = () => {
        const blob = new Blob(chunksRef.current, { type: "audio/webm" });
        const url = URL.createObjectURL(blob);
        
        if (audioRef.current) {
          audioRef.current.src = url;
        }
        
        setAudioBlob(blob);
        setAudioUrl(url);
        
        if (onAudioReady) {
          onAudioReady(blob, url);
        }
      };
      
      mediaRecorderRef.current.start();
      setIsRecording(true);
    } catch (err) {
      console.error("Error starting recording:", err);
    }
  };
  
  const stopRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
      
      // Stop all audio tracks
      if (mediaRecorderRef.current.stream) {
        mediaRecorderRef.current.stream.getAudioTracks().forEach(track => track.stop());
      }
    }
  };
  
  const playAudio = () => {
    if (audioRef.current && audioUrl) {
      audioRef.current.play();
      setIsPlaying(true);
    }
  };
  
  const stopAudio = () => {
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current.currentTime = 0;
      setIsPlaying(false);
    }
  };
  
  const resetRecording = () => {
    if (audioRef.current) {
      audioRef.current.pause();
    }
    
    setIsPlaying(false);
    setAudioBlob(null);
    
    if (audioUrl && audioUrl !== defaultAudioUrl) {
      URL.revokeObjectURL(audioUrl);
    }
    
    setAudioUrl(defaultAudioUrl || null);
    
    if (defaultAudioUrl && audioRef.current) {
      audioRef.current.src = defaultAudioUrl;
    }
  };
  
  const formatTime = (time: number) => {
    const minutes = Math.floor(time / 60);
    const seconds = time % 60;
    return `${minutes.toString().padStart(2, "0")}:${seconds.toString().padStart(2, "0")}`;
  };
  
  return (
    <div className={`flex flex-col items-center space-y-4 ${className}`}>
      {/* Recording visualization */}
      {isRecording && (
        <div className="audio-wave">
          <span></span>
          <span></span>
          <span></span>
          <span></span>
          <span></span>
        </div>
      )}
      
      {/* Timer */}
      {(isRecording || audioUrl) && (
        <div className="text-sm font-mono">
          {isRecording ? (
            <span className="text-red-500">{formatTime(recordingTime)}</span>
          ) : (
            <span>{t("audio.recorded")}</span>
          )}
        </div>
      )}
      
      {/* Controls */}
      <div className="flex items-center gap-2">
        {!isRecording && !audioUrl && (
          <Button
            onClick={startRecording}
            variant="outline"
            size="icon"
            className="rounded-full h-12 w-12"
          >
            <Mic className="h-5 w-5" />
          </Button>
        )}
        
        {isRecording && (
          <Button
            onClick={stopRecording}
            variant="destructive"
            size="icon"
            className="rounded-full h-12 w-12"
          >
            <MicOff className="h-5 w-5" />
          </Button>
        )}
        
        {audioUrl && !isPlaying && (
          <Button
            onClick={playAudio}
            variant="outline"
            size="icon"
            className="rounded-full h-12 w-12"
          >
            <Play className="h-5 w-5" />
          </Button>
        )}
        
        {audioUrl && isPlaying && (
          <Button
            onClick={stopAudio}
            variant="outline"
            size="icon"
            className="rounded-full h-12 w-12"
          >
            <Square className="h-5 w-5" />
          </Button>
        )}
        
        {audioUrl && (
          <Button
            onClick={resetRecording}
            variant="outline"
            size="icon"
            className="rounded-full h-10 w-10"
          >
            <Trash className="h-4 w-4" />
          </Button>
        )}
      </div>
      
      <div className="text-xs text-muted-foreground text-center">
        {!audioUrl ? (
          isRecording ? (
            t("audio.recordingTip")
          ) : (
            t("audio.tapToStartRecording")
          )
        ) : (
          t("audio.recordingReady")
        )}
      </div>
    </div>
  );
}
