// Free, high-fidelity Native Standard Albanian audio engine

class SoundManager {
  private audioCtx: AudioContext | null = null;
  private audioCache = new Map<string, HTMLAudioElement>();
  private speechRate = 0.95;

  private getAudioContext(): AudioContext | null {
    if (typeof window === 'undefined') return null;
    if (!this.audioCtx) {
      const AudioCtxClass =
        window.AudioContext ||
        (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      if (AudioCtxClass) {
        this.audioCtx = new AudioCtxClass();
      }
    }
    if (this.audioCtx && this.audioCtx.state === 'suspended') {
      this.audioCtx.resume();
    }
    return this.audioCtx;
  }

  setSpeechRate(rate: number) {
    this.speechRate = Math.max(0.6, Math.min(1.2, rate));
  }

  getSpeechRate(): number {
    return this.speechRate;
  }

  // Play pleasant success chime (C5 -> E5 -> G5)
  playCorrectSound() {
    try {
      const ctx = this.getAudioContext();
      if (!ctx) return;
      const now = ctx.currentTime;
      const osc1 = ctx.createOscillator();
      const osc2 = ctx.createOscillator();
      const gain = ctx.createGain();

      osc1.type = 'sine';
      osc1.frequency.setValueAtTime(523.25, now);
      osc1.frequency.setValueAtTime(659.25, now + 0.1);

      osc2.type = 'triangle';
      osc2.frequency.setValueAtTime(783.99, now + 0.1);

      gain.gain.setValueAtTime(0.15, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.45);

      osc1.connect(gain);
      osc2.connect(gain);
      gain.connect(ctx.destination);

      osc1.start(now);
      osc2.start(now + 0.1);
      osc1.stop(now + 0.45);
      osc2.stop(now + 0.45);
    } catch {}
  }

  // Play low mistake tone
  playMistakeSound() {
    try {
      const ctx = this.getAudioContext();
      if (!ctx) return;
      const now = ctx.currentTime;
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.type = 'sawtooth';
      osc.frequency.setValueAtTime(220, now);
      osc.frequency.linearRampToValueAtTime(160, now + 0.25);

      gain.gain.setValueAtTime(0.12, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.3);

      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.start(now);
      osc.stop(now + 0.3);
    } catch {}
  }

  // Speaks Standard Albanian using free native neural audio stream with speech synthesis fallback
  speakAlbanian(text: string) {
    if (typeof window === 'undefined' || !text.trim()) return;

    const cleanText = text.trim();

    // 1. Primary: Native Albanian human audio stream (100% Free & Native pronunciation)
    const streamUrl = `https://translate.google.com/translate_tts?ie=UTF-8&client=tw-ob&tl=sq&q=${encodeURIComponent(cleanText)}`;

    try {
      let audio = this.audioCache.get(cleanText);
      if (!audio) {
        audio = new Audio(streamUrl);
        audio.playbackRate = this.speechRate;
        this.audioCache.set(cleanText, audio);
      } else {
        audio.currentTime = 0;
        audio.playbackRate = this.speechRate;
      }

      const playPromise = audio.play();
      if (playPromise) {
        playPromise.catch(() => {
          // If browser policy or network restricts direct stream, fallback to speech synthesis
          this.fallbackSpeechSynthesis(cleanText);
        });
      }
    } catch {
      this.fallbackSpeechSynthesis(cleanText);
    }
  }

  // 2. Intelligent browser SpeechSynthesis fallback
  private fallbackSpeechSynthesis(text: string) {
    if (typeof window === 'undefined' || !('speechSynthesis' in window)) return;
    try {
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.rate = this.speechRate;
      utterance.pitch = 1.0;

      const voices = window.speechSynthesis.getVoices();
      const sqVoice = voices.find((v) => v.lang.startsWith('sq') || v.lang.includes('Albanian'));

      if (sqVoice) {
        utterance.voice = sqVoice;
        utterance.lang = 'sq-AL';
      } else {
        // Italian vowel phonetics are closest to Albanian vowels (open A, E, I, O, U)
        const itVoice = voices.find((v) => v.lang.startsWith('it'));
        if (itVoice) {
          utterance.voice = itVoice;
          utterance.lang = 'it-IT';
        } else {
          utterance.lang = 'de-DE';
        }
      }

      window.speechSynthesis.speak(utterance);
    } catch {}
  }
}

export const soundManager = new SoundManager();
