export class StrategyException extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'StrategyException';
  }

  static withMessage(message: string): StrategyException {
    return new StrategyException(message);
  }
}
