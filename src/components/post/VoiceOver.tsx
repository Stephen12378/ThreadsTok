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
      autoplay: false,
      preload: true,
      rate: 1.35,
      onend: () => onEnded(),
      onplayerror: function () {
        newSound.once('unlock', function () {
          newSound.play();
        });
      },
    });

    newSound.play();

    return () => {
      if (newSound) newSound.unload();
    };
  }, [onEnded, src, isMuted]);

  return null;
}
