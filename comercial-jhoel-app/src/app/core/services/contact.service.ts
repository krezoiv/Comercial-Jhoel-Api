import { Injectable, inject } from '@angular/core';
import { Observable, delay, map, of } from 'rxjs';

import { ContactChannel, ContactFormPayload, PublicCompanyInfo, SocialLink } from '../models';
import { CONTACT_INTERESTS } from '../data';
import { CompanySettingsService } from './company-settings.service';

export interface ContactSubmissionResult {
  success: boolean;
}

export interface ContactInfo {
  businessName: string;
  address: string | null;
  businessHours: string | null;
  channels: ContactChannel[];
  socialLinks: SocialLink[];
}

/** Digits only — `tel:`/`wa.me` links need a clean numeric string, whatever formatting the admin typed (spaces, dashes, +) is stripped. */
function digitsOnly(value: string): string {
  return value.replace(/\D/g, '');
}

/** The admin may paste a URL with or without a scheme — `href` needs one to not resolve as a relative in-app path. */
function withScheme(url: string): string {
  return /^https?:\/\//i.test(url) ? url : `https://${url}`;
}

/**
 * Only ever includes a channel/social link whose real value exists —
 * never a placeholder `href="#"` or an "undefined" row. Built once, here,
 * from the single real source of truth (`company_settings` via the public
 * `/company-info` endpoint) — never a second, parallel definition of what
 * "contact info" means.
 */
function buildContactInfo(info: PublicCompanyInfo): ContactInfo {
  const channels: ContactChannel[] = [];

  if (info.phone) {
    channels.push({ id: 'telefono', icon: 'phone-call', label: 'Teléfono', value: info.phone, href: `tel:+${digitsOnly(info.phone)}` });
  }
  if (info.whatsapp) {
    channels.push({ id: 'whatsapp', icon: 'whatsapp', label: 'WhatsApp', value: info.whatsapp, href: `https://wa.me/${digitsOnly(info.whatsapp)}` });
  }
  if (info.email) {
    channels.push({ id: 'correo', icon: 'mail', label: 'Correo', value: info.email, href: `mailto:${info.email}` });
  }
  if (info.address) {
    const mapsUrl = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(info.address)}`;
    channels.push({ id: 'direccion', icon: 'map-pin', label: 'Ubicación', value: info.address, href: mapsUrl });
  }
  if (info.website) {
    channels.push({ id: 'website', icon: 'globe', label: 'Sitio web', value: info.website.replace(/^https?:\/\//i, ''), href: withScheme(info.website) });
  }

  const socialLinks: SocialLink[] = [];
  if (info.facebookUrl) {
    socialLinks.push({ id: 'facebook', icon: 'facebook', label: 'Facebook', href: withScheme(info.facebookUrl) });
  }
  if (info.instagramUrl) {
    socialLinks.push({ id: 'instagram', icon: 'instagram', label: 'Instagram', href: withScheme(info.instagramUrl) });
  }
  if (info.tiktokUrl) {
    socialLinks.push({ id: 'tiktok', icon: 'tiktok', label: 'TikTok', href: withScheme(info.tiktokUrl) });
  }

  return {
    businessName: info.businessName,
    address: info.address,
    businessHours: info.businessHours,
    channels,
    socialLinks,
  };
}

@Injectable({ providedIn: 'root' })
export class ContactService {
  private readonly companySettingsService = inject(CompanySettingsService);

  getInterests(): string[] {
    return CONTACT_INTERESTS;
  }

  /** Real data — `GET /company-info` (público, sin auth), nunca un placeholder hardcodeado. */
  getContactInfo(): Observable<ContactInfo> {
    return this.companySettingsService.getPublicInfo().pipe(map(buildContactInfo));
  }

  /**
   * Phase 2: swap for
   * `this.http.post<ContactSubmissionResult>(\`${environment.apiUrl}/contact\`, payload)`.
   * Fuera del alcance de la tarea de "Contacto con datos reales de la empresa".
   */
  submit(payload: ContactFormPayload): Observable<ContactSubmissionResult> {
    return of({ success: true }).pipe(delay(600));
  }
}
