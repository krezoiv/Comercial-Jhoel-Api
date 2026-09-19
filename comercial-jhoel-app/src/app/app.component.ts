import {
  ChangeDetectionStrategy,
  Component,
  computed,
  inject,
  signal,
} from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { NavigationEnd, Router, RouterOutlet } from '@angular/router';
import { filter } from 'rxjs';

import { AppUpdateService } from './core/services/app-update.service';
import { FragmentScrollService } from './core/services/fragment-scroll.service';
import { KeyboardShortcutsService } from './core/services/keyboard-shortcuts.service';
import { NavbarComponent } from './layout/navbar/navbar.component';
import { FooterComponent } from './layout/footer/footer.component';
import {
  ConfirmDialogComponent,
  PdfPromptModalComponent,
  ToastContainerComponent,
  UpdateAvailableBannerComponent,
} from './shared/ui';

const CHROME_LESS_PREFIXES = ['/dashboard', '/login'];

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    RouterOutlet,
    NavbarComponent,
    FooterComponent,
    ToastContainerComponent,
    ConfirmDialogComponent,
    PdfPromptModalComponent,
    UpdateAvailableBannerComponent,
  ],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AppComponent {
  private readonly router = inject(Router);

  // The public marketing navbar/footer don't belong around the full-screen
  // login card or the dashboard's own sidebar/topbar shell.
  private readonly currentUrl = signal(this.router.url);
  readonly showChrome = computed(
    () =>
      !CHROME_LESS_PREFIXES.some((prefix) =>
        this.currentUrl().startsWith(prefix),
      ),
  );

  constructor() {
    inject(FragmentScrollService).listen();
    inject(KeyboardShortcutsService).listen();
    // Efecto secundario solo en su constructor (versionUpdates/visibilitychange/
    // interval) — nunca necesita que nadie llame un método suyo.
    inject(AppUpdateService);
    this.router.events
      .pipe(
        filter(
          (event): event is NavigationEnd => event instanceof NavigationEnd,
        ),
        takeUntilDestroyed(),
      )
      .subscribe(() => this.currentUrl.set(this.router.url));
  }
}
