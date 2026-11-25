// Free, natural-sounding Standard Albanian audio engine
// Primary: MyMemory TTS (more natural Albanian, free, no key)
// Secondary: Google TTS stream fallback
// Tertiary: SpeechSynthesis fallback

class SoundManager {
  private audioCtx: AudioContext | null = null;
  private audioCache = new Map<string, string>(); // text -> object URL
  private speechRate = 0.95;
  private currentAudio: HTMLAudioElement | null = null;

  private getAudioContext(): AudioContext | null {
    if (typeof window === 'undefined') return null;
    if (!this.audioCtx) {
      const AudioCtxClass =
        window.AudioContext ||
        (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      if (AudioCtxClass) this.audioCtx = new AudioCtxClass();
    }
    if (this.audioCtx?.state === 'suspended') this.audioCtx.resume();
    return this.audioCtx;
  }

  setSpeechRate(rate: number) {
    this.speechRate = Math.max(0.6, Math.min(1.2, rate));
  }

  getSpeechRate(): number {
    return this.speechRate;
  }

  // Pleasant success chime C5 → E5 → G5
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
      osc1.connect(gain); osc2.connect(gain); gain.connect(ctx.destination);
      osc1.start(now); osc2.start(now + 0.1);
      osc1.stop(now + 0.45); osc2.stop(now + 0.45);
    } catch {}
  }

  // Low mistake tone
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
      osc.connect(gain); gain.connect(ctx.destination);
      osc.start(now); osc.stop(now + 0.3);
    } catch {}
  }

  // Split long text into natural chunks at sentence boundaries
  private splitChunks(text: string): string[] {
    const chunks = text.split(/(?<=[.!?,;])\s+/).filter(Boolean);
    return chunks.length ? chunks : [text];
  }

  // Play an array of audio URLs sequentially with natural pauses
  private async playSequential(urls: string[], pause = 180): Promise<void> {
    for (const url of urls) {
      await new Promise<void>((resolve) => {
        const audio = new Audio(url);
        audio.playbackRate = this.speechRate;
        this.currentAudio = audio;
        audio.onended = () => setTimeout(resolve, pause);
        audio.onerror = () => resolve();
        audio.play().catch(() => resolve());
      });
    }
  }

  // Fetch MyMemory TTS audio and return blob URL (or null on failure)
  private async fetchMyMemory(text: string): Promise<string | null> {
    const cached = this.audioCache.get('mm:' + text);
    if (cached) return cached;
    try {
      const url = `https://api.mymemory.translated.net/api/tts?q=${encodeURIComponent(text)}&lang=sq-AL`;
      const res = await fetch(url);
      if (!res.ok) return null;
      const blob = await res.blob();
      if (!blob.size) return null;
      const objUrl = URL.createObjectURL(blob);
      this.audioCache.set('mm:' + text, objUrl);
      return objUrl;
    } catch {
      return null;
    }
  }

  // Speaks Standard Albanian — tries MyMemory first, then Google TTS, then SpeechSynthesis
  async speakAlbanian(text: string) {
    if (typeof window === 'undefined' || !text.trim()) return;
    // Stop any currently playing audio
    if (this.currentAudio) {
      this.currentAudio.pause();
      this.currentAudio = null;
    }
    const cleanText = text.trim();
    const chunks = this.splitChunks(cleanText);

    // 1. Try MyMemory TTS (most natural for Albanian)
    try {
      const urls: string[] = [];
      for (const chunk of chunks) {
        const url = await this.fetchMyMemory(chunk);
        if (!url) throw new Error('MyMemory failed');
        urls.push(url);
      }
      await this.playSequential(urls, 180);
      return;
    } catch {}

    // 2. Fallback: Google TTS stream (also free, no key)
    try {
      const googleUrl = `https://translate.google.com/translate_tts?ie=UTF-8&client=tw-ob&tl=sq&q=${encodeURIComponent(cleanText)}&speed=${this.speechRate}`;
      const audio = new Audio(googleUrl);
      audio.playbackRate = this.speechRate;
      this.currentAudio = audio;
      const p = audio.play();
      if (p) await p.catch(() => { throw new Error('Google TTS blocked'); });
      return;
    } catch {}

    // 3. Final fallback: browser SpeechSynthesis
    this.fallbackSpeechSynthesis(cleanText);
  }

  private fallbackSpeechSynthesis(text: string) {
    if (typeof window === 'undefined' || !('speechSynthesis' in window)) return;
    try {
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.rate = this.speechRate;
      utterance.pitch = 1.05;
      const voices = window.speechSynthesis.getVoices();
      const sqVoice = voices.find((v) => v.lang.startsWith('sq') || v.lang.includes('Albanian'));
      if (sqVoice) {
        utterance.voice = sqVoice;
        utterance.lang = 'sq-AL';
      } else {
        const itVoice = voices.find((v) => v.lang.startsWith('it'));
        if (itVoice) { utterance.voice = itVoice; utterance.lang = 'it-IT'; }
        else utterance.lang = 'de-DE';
      }
      window.speechSynthesis.speak(utterance);
    } catch {}
  }
}

export const soundManager = new SoundManager();
