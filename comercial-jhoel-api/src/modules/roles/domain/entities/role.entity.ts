/**
 * The three roles seeded by migration (`1756500000000-CreateRolesAndUserRoles`)
 * — every `@Roles('ADMIN', 'SUPER_ADMIN')` check across the entire app is a
 * literal string comparison against these exact names (see `RolesGuard`),
 * not a database lookup per request. Custom roles beyond these three can
 * still be created (`CreateRoleUseCase` doesn't restrict `name` to this
 * list), they just never satisfy an `@Roles(...)` guard that names one of
 * these three specifically — see `UpdateRoleUseCase`'s immutability rule
 * for why these three, once seeded, can never be renamed.
 */
export const ROLE_NAMES = ['SUPER_ADMIN', 'ADMIN', 'USER'] as const;
export type RoleName = (typeof ROLE_NAMES)[number];

export interface RoleProps {
  id: string;
  name: RoleName;
  description: string | null;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export class Role {
  private constructor(private readonly props: RoleProps) {}

  static create(props: RoleProps): Role {
    return new Role(props);
  }

  get id(): string {
    return this.props.id;
  }

  get name(): RoleName {
    return this.props.name;
  }

  get description(): string | null {
    return this.props.description;
  }

  get isActive(): boolean {
    return this.props.isActive;
  }

  get createdAt(): Date {
    return this.props.createdAt;
  }

  get updatedAt(): Date {
    return this.props.updatedAt;
  }
}
