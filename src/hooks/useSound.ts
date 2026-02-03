import { useCallback, useRef } from 'react';

type SoundType = 
  | 'click' 
  | 'hover' 
  | 'success' 
  | 'error' 
  | 'pop'
  | 'levelUp'
  | 'collect'
  | 'place'
  | 'break'
  | 'xp'
  | 'chest'
  | 'anvil'
  | 'enchant';

// Web Audio API Minecraft-style sound generator
export function useSound() {
  const audioContextRef = useRef<AudioContext | null>(null);

  const getAudioContext = useCallback(() => {
    if (!audioContextRef.current) {
      audioContextRef.current = new (window.AudioContext || (window as any).webkitAudioContext)();
    }
    return audioContextRef.current;
  }, []);

  // Create noise for texture
  const createNoise = (ctx: AudioContext, duration: number) => {
    const bufferSize = ctx.sampleRate * duration;
    const noiseBuffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
    const output = noiseBuffer.getChannelData(0);
    for (let i = 0; i < bufferSize; i++) {
      output[i] = Math.random() * 2 - 1;
    }
    const noise = ctx.createBufferSource();
    noise.buffer = noiseBuffer;
    return noise;
  };

  const playSound = useCallback((type: SoundType) => {
    try {
      const ctx = getAudioContext();
      const now = ctx.currentTime;

      switch (type) {
        case 'click': {
          // Minecraft button click - blocky, digital
          const osc = ctx.createOscillator();
          const gain = ctx.createGain();
          osc.type = 'square';
          osc.frequency.setValueAtTime(1000, now);
          osc.frequency.exponentialRampToValueAtTime(600, now + 0.03);
          gain.gain.setValueAtTime(0.12, now);
          gain.gain.exponentialRampToValueAtTime(0.001, now + 0.05);
          osc.connect(gain);
          gain.connect(ctx.destination);
          osc.start(now);
          osc.stop(now + 0.05);
          break;
        }

        case 'hover': {
          // Soft hover tick
          const osc = ctx.createOscillator();
          const gain = ctx.createGain();
          osc.type = 'sine';
          osc.frequency.setValueAtTime(1200, now);
          gain.gain.setValueAtTime(0.03, now);
          gain.gain.exponentialRampToValueAtTime(0.001, now + 0.02);
          osc.connect(gain);
          gain.connect(ctx.destination);
          osc.start(now);
          osc.stop(now + 0.02);
          break;
        }

        case 'success':
        case 'levelUp': {
          // Minecraft level up - ascending arpeggio
          const notes = [523.25, 659.25, 783.99, 1046.50]; // C5, E5, G5, C6
          notes.forEach((freq, i) => {
            const osc = ctx.createOscillator();
            const gain = ctx.createGain();
            osc.type = 'square';
            osc.frequency.setValueAtTime(freq, now + i * 0.08);
            gain.gain.setValueAtTime(0, now + i * 0.08);
            gain.gain.linearRampToValueAtTime(0.1, now + i * 0.08 + 0.02);
            gain.gain.exponentialRampToValueAtTime(0.001, now + i * 0.08 + 0.15);
            osc.connect(gain);
            gain.connect(ctx.destination);
            osc.start(now + i * 0.08);
            osc.stop(now + i * 0.08 + 0.15);
          });
          break;
        }

        case 'error': {
          // Minecraft damage/error sound
          const osc = ctx.createOscillator();
          const gain = ctx.createGain();
          osc.type = 'sawtooth';
          osc.frequency.setValueAtTime(200, now);
          osc.frequency.exponentialRampToValueAtTime(80, now + 0.1);
          gain.gain.setValueAtTime(0.1, now);
          gain.gain.exponentialRampToValueAtTime(0.001, now + 0.12);
          osc.connect(gain);
          gain.connect(ctx.destination);
          osc.start(now);
          osc.stop(now + 0.12);
          break;
        }

        case 'pop':
        case 'collect': {
          // Minecraft item pickup pop
          const osc = ctx.createOscillator();
          const gain = ctx.createGain();
          osc.type = 'sine';
          osc.frequency.setValueAtTime(400, now);
          osc.frequency.exponentialRampToValueAtTime(1200, now + 0.05);
          osc.frequency.exponentialRampToValueAtTime(800, now + 0.08);
          gain.gain.setValueAtTime(0.15, now);
          gain.gain.exponentialRampToValueAtTime(0.001, now + 0.1);
          osc.connect(gain);
          gain.connect(ctx.destination);
          osc.start(now);
          osc.stop(now + 0.1);
          break;
        }

        case 'place': {
          // Block place sound
          const osc = ctx.createOscillator();
          const noise = createNoise(ctx, 0.08);
          const oscGain = ctx.createGain();
          const noiseGain = ctx.createGain();
          const filter = ctx.createBiquadFilter();
          
          osc.type = 'square';
          osc.frequency.setValueAtTime(150, now);
          osc.frequency.exponentialRampToValueAtTime(80, now + 0.05);
          oscGain.gain.setValueAtTime(0.08, now);
          oscGain.gain.exponentialRampToValueAtTime(0.001, now + 0.06);
          
          filter.type = 'lowpass';
          filter.frequency.setValueAtTime(2000, now);
          noiseGain.gain.setValueAtTime(0.05, now);
          noiseGain.gain.exponentialRampToValueAtTime(0.001, now + 0.05);
          
          osc.connect(oscGain);
          oscGain.connect(ctx.destination);
          noise.connect(filter);
          filter.connect(noiseGain);
          noiseGain.connect(ctx.destination);
          
          osc.start(now);
          noise.start(now);
          osc.stop(now + 0.06);
          noise.stop(now + 0.05);
          break;
        }

        case 'break': {
          // Block break sound - crumbling
          for (let i = 0; i < 3; i++) {
            const noise = createNoise(ctx, 0.05);
            const gain = ctx.createGain();
            const filter = ctx.createBiquadFilter();
            filter.type = 'bandpass';
            filter.frequency.setValueAtTime(800 + i * 400, now + i * 0.02);
            gain.gain.setValueAtTime(0.06, now + i * 0.02);
            gain.gain.exponentialRampToValueAtTime(0.001, now + i * 0.02 + 0.04);
            noise.connect(filter);
            filter.connect(gain);
            gain.connect(ctx.destination);
            noise.start(now + i * 0.02);
            noise.stop(now + i * 0.02 + 0.04);
          }
          break;
        }

        case 'xp': {
          // XP orb collect - magical ascending tone
          const osc = ctx.createOscillator();
          const gain = ctx.createGain();
          osc.type = 'sine';
          const baseFreq = 600 + Math.random() * 400;
          osc.frequency.setValueAtTime(baseFreq, now);
          osc.frequency.exponentialRampToValueAtTime(baseFreq * 1.5, now + 0.1);
          gain.gain.setValueAtTime(0.08, now);
          gain.gain.exponentialRampToValueAtTime(0.001, now + 0.12);
          osc.connect(gain);
          gain.connect(ctx.destination);
          osc.start(now);
          osc.stop(now + 0.12);
          break;
        }

        case 'chest': {
          // Chest opening - creaky hinge
          const osc1 = ctx.createOscillator();
          const osc2 = ctx.createOscillator();
          const gain = ctx.createGain();
          osc1.type = 'sawtooth';
          osc2.type = 'square';
          osc1.frequency.setValueAtTime(80, now);
          osc1.frequency.exponentialRampToValueAtTime(150, now + 0.15);
          osc2.frequency.setValueAtTime(100, now);
          osc2.frequency.exponentialRampToValueAtTime(180, now + 0.15);
          gain.gain.setValueAtTime(0.06, now);
          gain.gain.exponentialRampToValueAtTime(0.001, now + 0.2);
          osc1.connect(gain);
          osc2.connect(gain);
          gain.connect(ctx.destination);
          osc1.start(now);
          osc2.start(now);
          osc1.stop(now + 0.2);
          osc2.stop(now + 0.2);
          break;
        }

        case 'anvil': {
          // Anvil hit - metallic clang
          const osc = ctx.createOscillator();
          const osc2 = ctx.createOscillator();
          const gain = ctx.createGain();
          osc.type = 'triangle';
          osc2.type = 'square';
          osc.frequency.setValueAtTime(800, now);
          osc.frequency.exponentialRampToValueAtTime(400, now + 0.1);
          osc2.frequency.setValueAtTime(1200, now);
          osc2.frequency.exponentialRampToValueAtTime(600, now + 0.08);
          gain.gain.setValueAtTime(0.1, now);
          gain.gain.exponentialRampToValueAtTime(0.001, now + 0.15);
          osc.connect(gain);
          osc2.connect(gain);
          gain.connect(ctx.destination);
          osc.start(now);
          osc2.start(now);
          osc.stop(now + 0.15);
          osc2.stop(now + 0.15);
          break;
        }

        case 'enchant': {
          // Enchanting table - magical shimmer
          for (let i = 0; i < 5; i++) {
            const osc = ctx.createOscillator();
            const gain = ctx.createGain();
            osc.type = 'sine';
            const freq = 800 + Math.random() * 800;
            osc.frequency.setValueAtTime(freq, now + i * 0.05);
            osc.frequency.exponentialRampToValueAtTime(freq * 0.8, now + i * 0.05 + 0.1);
            gain.gain.setValueAtTime(0.04, now + i * 0.05);
            gain.gain.exponentialRampToValueAtTime(0.001, now + i * 0.05 + 0.12);
            osc.connect(gain);
            gain.connect(ctx.destination);
            osc.start(now + i * 0.05);
            osc.stop(now + i * 0.05 + 0.12);
          }
          break;
        }
      }
    } catch (e) {
      // Audio not supported or blocked
      console.log('Audio playback not available');
    }
  }, [getAudioContext]);

  return { playSound };
}
