import { LiteralExpression } from './LiteralExpression';
import { LogicalExpression } from './LogicalExpression';
import { Expression, ExpressionOptions, Operator } from './types';

export class ExpressionParser {
  private options: ExpressionOptions;

  private operatorMap = new Map<string, Operator>([
    ['&&', 'AND'],
    ['&', 'AND'],
    ['AND NOT', 'AND'],
    ['||', 'OR'],
    ['|', 'OR'],
    ['OR NOT', 'OR'],
  ]);

  public constructor(opts?: Partial<ExpressionOptions>) {
    this.options = {
      defaultOperator: 'AND',
      ...opts,
    };
  }

  private splitExpression = (expression: string): string[] => {
    const result = expression
      .split(
        /(\([^()]*\)|[-\w]+:*[\w]*)\s*(AND\s+NOT|OR\s+NOT|AND|OR|&&|\|\||\||&)?\s*/g
      )
      .filter((part) => !!part)
      .filter((part) => part.trim())
      .map((part) => part.replace(/^\(/, '').replace(/\)$/, ''));

    if (
      result.length === 2 &&
      ![...this.operatorMap.keys()].includes(result[1])
    ) {
      result.splice(1, 0, this.options.defaultOperator);
    }

    return result;
  };

  private buildExpressionType = (
    expression: string,
    isNegative?: boolean
  ): Expression => {
    const splitExpression = this.splitExpression(expression);

    const isLogical = splitExpression.length > 2;

    if (isLogical) {
      const [left, operator, ...right] = splitExpression;
      return new LogicalExpression(
        this.buildExpressionType(left),
        (this.operatorMap.get(operator) ?? operator) as Operator,
        this.buildExpressionType(right.join(' '), operator.includes('NOT')),
        isNegative
      );
    }

    return new LiteralExpression(splitExpression.join(''), isNegative);
  };

  public parse(expression: string): Expression {
    return this.buildExpressionType(expression);
  }
}
