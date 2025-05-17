import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Volume2, Loader2 } from "lucide-react";
import { useAudio } from "@/hooks/use-audio";
import { useTranslation } from "@/hooks/use-translation";

interface AudioButtonProps {
  text: string;
  className?: string;
  size?: "sm" | "md" | "lg";
  withLabel?: boolean;
}

export function AudioButton({ 
  text, 
  className = "", 
  size = "md", 
  withLabel = false 
}: AudioButtonProps) {
  const { t, language } = useTranslation();
  const { play, stop, isPlaying, isLoading } = useAudio();
  
  const handleClick = () => {
    if (isPlaying) {
      stop();
    } else {
      // Map UI language to appropriate speech language code
      const speechLang = language === "fr" ? "fr-FR" : "en-US"; // Fallback to English if Wolof not available
      play(text, speechLang);
    }
  };
  
  const sizeStyles = {
    sm: "w-8 h-8 text-sm",
    md: "w-10 h-10 text-base",
    lg: "w-12 h-12 text-lg",
  };
  
  return (
    <div className={`flex items-center gap-3 ${className}`}>
      <Button
        onClick={handleClick}
        type="button"
        className={`${sizeStyles[size]} bg-primary text-white rounded-full flex items-center justify-center hover:bg-primary-dark transition p-0`}
        disabled={isLoading}
      >
        {isLoading ? (
          <Loader2 className="h-5 w-5 animate-spin" />
        ) : (
          <Volume2 className="h-5 w-5" />
        )}
      </Button>
      
      {withLabel && (
        <div>
          <p className="text-sm text-muted-foreground">
            {isPlaying 
              ? t("audio.listening") 
              : t("audio.tapToListen")}
          </p>
          {isPlaying && (
            <div className="audio-wave">
              <span></span>
              <span></span>
              <span></span>
              <span></span>
              <span></span>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
