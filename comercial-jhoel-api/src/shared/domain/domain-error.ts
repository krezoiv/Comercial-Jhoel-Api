export abstract class DomainError extends Error {
  abstract readonly status: number;

  protected constructor(message: string) {
    super(message);
    this.name = new.target.name;
  }
}
