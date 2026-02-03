import { useCallback, useRef } from 'react';

type SoundType = 'click' | 'hover' | 'success' | 'error' | 'pop';

// Web Audio API sound generator
export function useSound() {
  const audioContextRef = useRef<AudioContext | null>(null);

  const getAudioContext = useCallback(() => {
    if (!audioContextRef.current) {
      audioContextRef.current = new (window.AudioContext || (window as any).webkitAudioContext)();
    }
    return audioContextRef.current;
  }, []);

  const playSound = useCallback((type: SoundType) => {
    try {
      const ctx = getAudioContext();
      const oscillator = ctx.createOscillator();
      const gainNode = ctx.createGain();

      oscillator.connect(gainNode);
      gainNode.connect(ctx.destination);

      const now = ctx.currentTime;

      switch (type) {
        case 'click':
          // Short, crisp click sound
          oscillator.frequency.setValueAtTime(800, now);
          oscillator.frequency.exponentialRampToValueAtTime(400, now + 0.05);
          gainNode.gain.setValueAtTime(0.15, now);
          gainNode.gain.exponentialRampToValueAtTime(0.01, now + 0.08);
          oscillator.start(now);
          oscillator.stop(now + 0.08);
          break;

        case 'hover':
          // Soft, subtle hover sound
          oscillator.frequency.setValueAtTime(600, now);
          oscillator.frequency.exponentialRampToValueAtTime(700, now + 0.05);
          gainNode.gain.setValueAtTime(0.05, now);
          gainNode.gain.exponentialRampToValueAtTime(0.01, now + 0.05);
          oscillator.start(now);
          oscillator.stop(now + 0.05);
          break;

        case 'success':
          // Pleasant success chime (ascending notes)
          oscillator.type = 'sine';
          oscillator.frequency.setValueAtTime(523.25, now); // C5
          oscillator.frequency.setValueAtTime(659.25, now + 0.1); // E5
          oscillator.frequency.setValueAtTime(783.99, now + 0.2); // G5
          gainNode.gain.setValueAtTime(0.2, now);
          gainNode.gain.exponentialRampToValueAtTime(0.01, now + 0.4);
          oscillator.start(now);
          oscillator.stop(now + 0.4);
          break;

        case 'error':
          // Low buzz for errors
          oscillator.type = 'sawtooth';
          oscillator.frequency.setValueAtTime(150, now);
          oscillator.frequency.exponentialRampToValueAtTime(100, now + 0.15);
          gainNode.gain.setValueAtTime(0.1, now);
          gainNode.gain.exponentialRampToValueAtTime(0.01, now + 0.15);
          oscillator.start(now);
          oscillator.stop(now + 0.15);
          break;

        case 'pop':
          // Quick pop sound
          oscillator.type = 'sine';
          oscillator.frequency.setValueAtTime(1200, now);
          oscillator.frequency.exponentialRampToValueAtTime(200, now + 0.06);
          gainNode.gain.setValueAtTime(0.12, now);
          gainNode.gain.exponentialRampToValueAtTime(0.01, now + 0.06);
          oscillator.start(now);
          oscillator.stop(now + 0.06);
          break;
      }
    } catch (e) {
      // Audio not supported or blocked
      console.log('Audio playback not available');
    }
  }, [getAudioContext]);

  return { playSound };
}
