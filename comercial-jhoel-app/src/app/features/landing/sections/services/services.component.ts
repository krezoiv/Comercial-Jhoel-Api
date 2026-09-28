import { AsyncPipe } from '@angular/common';
import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { RouterLink } from '@angular/router';

import { OffersService } from '../../../../core/services/offers.service';
import { IconComponent, SectionComponent, SectionHeadingComponent } from '../../../../shared/ui';
import { RevealOnScrollDirective } from '../../../../shared/directives/reveal-on-scroll.directive';
import { ParallaxLayerDirective } from '../../../../shared/directives/parallax-layer.directive';
import { TiltOnMouseDirective } from '../../../../shared/directives/tilt-on-mouse.directive';
import { SectionLandingBackgroundComponent } from '../shared/section-landing-background/section-landing-background.component';

@Component({
  selector: 'app-services',
  standalone: true,
  imports: [
    AsyncPipe,
    RouterLink,
    SectionComponent,
    SectionHeadingComponent,
    IconComponent,
    RevealOnScrollDirective,
    ParallaxLayerDirective,
    TiltOnMouseDirective,
    SectionLandingBackgroundComponent,
  ],
  templateUrl: './services.component.html',
  styleUrl: './services.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ServicesComponent {
  private readonly offersService = inject(OffersService);
  readonly services$ = this.offersService.getServices();
}
