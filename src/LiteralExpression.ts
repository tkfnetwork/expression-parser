import {
  ExpressionType,
  LiteralExpressionInterface,
  LiteralValue,
} from './types';

export class LiteralExpression implements LiteralExpressionInterface {
  public type = ExpressionType.Literal;
  public value: LiteralValue;
  public isNegative?: boolean | undefined;
  public field?: string;

  public constructor(rawValue: LiteralValue, rawNegative = false) {
    const isString = typeof rawValue === 'string';
    const hasNegative = isString && rawValue.startsWith('-');
    const strippedString = hasNegative ? rawValue.substring(1) : rawValue;
    const isStringValue = typeof strippedString === 'string';

    const [value, field] = (
      isStringValue
        ? strippedString.split(':').reverse()
        : [rawValue, undefined]
    ) as [LiteralValue, string | undefined];

    if (field) {
      this.field = field;
    }

    this.isNegative = rawNegative || hasNegative;
    this.value = value;
  }
}
