export interface UserProps {
  id: string;
  name: string | null;
  email: string | null;
  username: string | null;
  phone: string | null;
  passwordHash: string;
  createdAt: Date;
  updatedAt: Date;
}

export class User {
  private constructor(private readonly props: UserProps) {}

  static create(props: UserProps): User {
    return new User(props);
  }

  get id(): string {
    return this.props.id;
  }

  get name(): string | null {
    return this.props.name;
  }

  get email(): string | null {
    return this.props.email;
  }

  get username(): string | null {
    return this.props.username;
  }

  get phone(): string | null {
    return this.props.phone;
  }

  get passwordHash(): string {
    return this.props.passwordHash;
  }

  get createdAt(): Date {
    return this.props.createdAt;
  }

  get updatedAt(): Date {
    return this.props.updatedAt;
  }
}
