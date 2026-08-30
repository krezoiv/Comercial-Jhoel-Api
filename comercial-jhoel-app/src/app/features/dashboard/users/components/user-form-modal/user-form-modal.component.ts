import {
  ChangeDetectionStrategy,
  Component,
  EventEmitter,
  Input,
  OnChanges,
  Output,
  SimpleChanges,
  inject,
  signal,
} from '@angular/core';
import { HttpErrorResponse } from '@angular/common/http';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';

import { Role, User } from '../../../../../core/models';
import { UserService } from '../../../../../core/services/user.service';
import { extractErrorMessage } from '../../../../../core/utils/extract-error-message';
import { ButtonComponent, IconComponent } from '../../../../../shared/ui';

@Component({
  selector: 'app-user-form-modal',
  standalone: true,
  imports: [ReactiveFormsModule, ButtonComponent, IconComponent],
  templateUrl: './user-form-modal.component.html',
  styleUrl: './user-form-modal.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class UserFormModalComponent implements OnChanges {
  @Input() open = false;
  /** null = create mode, a User = edit mode (form is pre-filled from it). */
  @Input() user: User | null = null;
  /** Active roles offered by the dropdown. */
  @Input() roles: Role[] = [];

  @Output() closed = new EventEmitter<void>();
  @Output() saved = new EventEmitter<User>();

  private readonly fb = inject(FormBuilder);
  private readonly userService = inject(UserService);

  readonly isSubmitting = signal(false);
  readonly errorMessage = signal<string | null>(null);

  readonly form = this.fb.nonNullable.group({
    username: ['', [Validators.required, Validators.minLength(3), Validators.maxLength(30), Validators.pattern(/^[a-zA-Z0-9_.-]+$/)]],
    phone: ['', [Validators.required, Validators.pattern(/^\+?[0-9]{7,15}$/)]],
    password: ['', [Validators.minLength(8), Validators.maxLength(72)]],
    roleId: ['', [Validators.required]],
    isActive: [true],
  });

  get isEditMode(): boolean {
    return this.user !== null;
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (!changes['open'] || !this.open) {
      return;
    }

    this.errorMessage.set(null);
    this.isSubmitting.set(false);

    const passwordControl = this.form.controls.password;
    if (this.user) {
      passwordControl.clearValidators();
      passwordControl.setValidators([Validators.minLength(8), Validators.maxLength(72)]);
      this.form.reset({
        username: this.user.username,
        phone: this.user.phone,
        password: '',
        roleId: this.user.roleId,
        isActive: this.user.isActive,
      });
    } else {
      passwordControl.setValidators([Validators.required, Validators.minLength(8), Validators.maxLength(72)]);
      this.form.reset({ username: '', phone: '', password: '', roleId: '', isActive: true });
    }
    passwordControl.updateValueAndValidity();
  }

  submit(): void {
    this.errorMessage.set(null);

    if (this.form.invalid || this.isSubmitting()) {
      this.form.markAllAsTouched();
      return;
    }

    const { username, phone, password, roleId, isActive } = this.form.getRawValue();
    this.isSubmitting.set(true);

    const request$ = this.isEditMode
      ? this.userService.updateUser(this.user!.id, {
          username,
          phone,
          roleId,
          isActive,
          ...(password ? { password } : {}),
        })
      : this.userService.createUser({ username, phone, password, roleId });

    request$.subscribe({
      next: (user) => {
        this.isSubmitting.set(false);
        this.saved.emit(user);
      },
      error: (error: HttpErrorResponse) => {
        this.isSubmitting.set(false);
        this.errorMessage.set(extractErrorMessage(error, 'No se pudo guardar el usuario. Inténtalo de nuevo.'));
      },
    });
  }

  close(): void {
    if (this.isSubmitting()) {
      return;
    }
    this.closed.emit();
  }
}
