import { useEffect } from 'react';
import { Howl } from 'howler';

interface VoiceOverProps {
  src: string;
  isMuted: boolean;
  onEnded: () => void;
}

export function VoiceOver({ src, isMuted, onEnded }: VoiceOverProps) {
  useEffect(() => {
    if (!src) return;

    // Initialize sound
    const newSound = new Howl({
      src: [src],
      html5: true,
      autoplay: true,
      rate: 1.35,
      onend: () => onEnded(),
    });

    return () => {
      if (newSound) newSound.unload();
    };
  }, [onEnded, src, isMuted]);

  return null;
}
