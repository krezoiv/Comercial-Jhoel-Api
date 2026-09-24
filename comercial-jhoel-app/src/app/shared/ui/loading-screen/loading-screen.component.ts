import {
  ChangeDetectionStrategy,
  Component,
  DestroyRef,
  inject,
  output,
  signal,
} from '@angular/core';

/** Fake progress runs for this long under normal motion preferences. */
const PROGRESS_DURATION_MS = 3000;
/** How long the fade/scale exit transition takes once progress hits 100%. */
const EXIT_DURATION_MS = 450;
/** `prefers-reduced-motion`: skip the animated wait almost entirely — the whole point of this screen is motion, forcing a multi-second hold on someone who asked for less of it would violate "no bloquear la página". */
const REDUCED_MOTION_HOLD_MS = 150;

/**
 * One-time intro screen shown by `LandingPageComponent` only — see that
 * component's constructor doc comment for why mounting it there (rather
 * than in `AppComponent`) already guarantees it fires once per real entry
 * to `/` and never on an internal anchor/scroll/modal interaction (those
 * never re-run this component's lifecycle). Pure Angular + CSS: no new
 * dependency, no interference with the Service Worker/Web Push (this
 * component never touches either).
 *
 * Progress is a `requestAnimationFrame` loop (never `setInterval`), eased
 * near the end so it doesn't feel like it's linearly crawling to 100.
 */
@Component({
  selector: 'app-loading-screen',
  standalone: true,
  templateUrl: './loading-screen.component.html',
  styleUrl: './loading-screen.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class LoadingScreenComponent {
  private readonly destroyRef = inject(DestroyRef);

  readonly progress = signal(0);
  readonly exiting = signal(false);
  readonly finished = output<void>();

  private rafId: number | null = null;

  constructor() {
    const reducedMotion =
      typeof window !== 'undefined' &&
      window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    this.destroyRef.onDestroy(() => {
      if (this.rafId !== null) {
        cancelAnimationFrame(this.rafId);
      }
    });

    if (reducedMotion) {
      this.progress.set(100);
      setTimeout(() => this.beginExit(), REDUCED_MOTION_HOLD_MS);
      return;
    }

    this.runProgress();
  }

  private runProgress(): void {
    const start = performance.now();

    const step = (now: number) => {
      const elapsed = now - start;
      // Clamped at 0 too, not just 1 — a `requestAnimationFrame` callback's
      // own timestamp can, in rare cases, read a hair earlier than the
      // `performance.now()` captured just before scheduling it, which
      // would otherwise show a fleeting negative percentage on the very
      // first frame.
      const linear = Math.max(0, Math.min(elapsed / PROGRESS_DURATION_MS, 1));
      // ease-out-quad — matches the deceleration feel `--ease-out` already
      // gives every other transition in this app, so the bar's motion reads
      // consistently with the rest of the site rather than a flat linear
      // crawl.
      const eased = 1 - (1 - linear) * (1 - linear);
      this.progress.set(Math.round(eased * 100));

      if (linear < 1) {
        this.rafId = requestAnimationFrame(step);
      } else {
        this.beginExit();
      }
    };

    this.rafId = requestAnimationFrame(step);
  }

  private beginExit(): void {
    this.exiting.set(true);
    setTimeout(() => this.finished.emit(), EXIT_DURATION_MS);
  }
}
