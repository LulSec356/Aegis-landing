type Listener = (v: number) => void;

class ScrollStore {
  progress = 0;
  private listeners = new Set<Listener>();

  set(v: number) {
    this.progress = v;
    this.listeners.forEach((l) => l(v));
  }

  subscribe(l: Listener) {
    this.listeners.add(l);
    return () => {
      this.listeners.delete(l);
    };
  }
}

export const scrollStore = new ScrollStore();
