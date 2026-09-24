import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { catchError, of } from 'rxjs';

import { ContactChannel, SocialLink } from '../../../../core/models';
import { ContactService } from '../../../../core/services/contact.service';
import { ButtonComponent, IconComponent, SectionComponent, SectionHeadingComponent } from '../../../../shared/ui';
import { SectionLandingBackgroundComponent } from '../shared/section-landing-background/section-landing-background.component';

@Component({
  selector: 'app-contact',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    SectionComponent,
    SectionHeadingComponent,
    ButtonComponent,
    IconComponent,
    SectionLandingBackgroundComponent,
  ],
  templateUrl: './contact.component.html',
  styleUrl: './contact.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ContactComponent {
  private readonly fb = inject(FormBuilder);
  private readonly contactService = inject(ContactService);

  readonly interests = this.contactService.getInterests();

  /** Datos reales de la empresa (`company_settings`, vía `/company-info` público) — nunca hardcodeados. */
  readonly loadingInfo = signal(true);
  readonly infoLoadError = signal(false);
  readonly businessName = signal<string | null>(null);
  readonly businessHours = signal<string | null>(null);
  readonly channels = signal<ContactChannel[]>([]);
  readonly socialLinks = signal<SocialLink[]>([]);

  readonly isSubmitting = signal(false);
  readonly isSubmitted = signal(false);

  readonly form = this.fb.nonNullable.group({
    name: ['', [Validators.required, Validators.minLength(2)]],
    phone: ['', [Validators.required, Validators.minLength(6)]],
    interest: [this.interests[0], Validators.required],
    message: ['', Validators.required],
  });

  constructor() {
    this.fetchContactInfo();
  }

  fetchContactInfo(): void {
    this.loadingInfo.set(true);
    this.infoLoadError.set(false);
    this.contactService
      .getContactInfo()
      .pipe(catchError(() => of(null)))
      .subscribe((info) => {
        this.loadingInfo.set(false);
        if (!info) {
          this.infoLoadError.set(true);
          return;
        }
        this.businessName.set(info.businessName || null);
        this.businessHours.set(info.businessHours);
        this.channels.set(info.channels);
        this.socialLinks.set(info.socialLinks);
      });
  }

  submit(): void {
    if (this.form.invalid || this.isSubmitting()) {
      this.form.markAllAsTouched();
      return;
    }

    this.isSubmitting.set(true);
    this.contactService.submit(this.form.getRawValue()).subscribe(() => {
      this.isSubmitting.set(false);
      this.isSubmitted.set(true);
      this.form.reset({ name: '', phone: '', interest: this.interests[0], message: '' });
    });
  }
}
