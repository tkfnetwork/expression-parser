import {
  ExpressionType,
  LiteralExpressionInterface,
  LiteralValue,
} from './types';

export class LiteralExpression implements LiteralExpressionInterface {
  public type = ExpressionType.Literal;
  public field?: string;
  public value: LiteralValue;

  public constructor(
    value: LiteralValue,
    public isNegative?: boolean,
    public isExact?: boolean
  ) {
    const [extractedValue, field] = value
      .replaceAll('"', '')
      .split(':')
      .reverse();

    if (field) {
      this.field = field;
    }

    this.value = extractedValue;
  }
}
