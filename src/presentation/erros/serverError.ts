export class ServerError extends Error {
  constructor() {
    super('Unfortanately something doesnt work well');
    this.name = 'ServerError';
  }
}
