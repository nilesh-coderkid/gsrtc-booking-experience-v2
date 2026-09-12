export class SpeechEngine {
  private static enabled = false;

  public static isSupported(): boolean {
    return typeof window !== 'undefined' && 'speechSynthesis' in window;
  }

  public static setEnabled(state: boolean): void {
    this.enabled = state;
    if (state) {
      this.speak('Voice guidance enabled. અવાજ માર્ગદર્શન સક્રિય કરેલ છે.');
    }
  }

  public static isEnabled(): boolean {
    return this.enabled;
  }

  public static speak(text: string, lang = 'en-IN'): void {
    if (!this.enabled || !this.isSupported()) return;

    try {
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = lang;
      utterance.rate = 0.9;
      utterance.pitch = 1.0;
      window.speechSynthesis.speak(utterance);
    } catch (e) {
      console.warn('Speech synthesis failed', e);
    }
  }
}
