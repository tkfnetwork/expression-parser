import { LiteralExpression } from './LiteralExpression';
import { LogicalExpression } from './LogicalExpression';
import { Expression, ExpressionOptions, Operator } from './types';

export class ExpressionParser {
  static EXPRESSION_SPLIT_REGEX =
    /([^\s:]+:"[^"]*"|[^\s:]+:[^\s]+|"[^"]*"|\([^()]*\)|[^\s]+)\s*(AND\s+NOT|OR\s+NOT|AND|OR|&&|\|\||\||&)?\s*/g;
  static FLAGS_REGEX = /^[-!]+/g;
  static GROUPED_REGEX = /^([!\\-]*)\(([^¬]*)\)$/;

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
      .split(ExpressionParser.EXPRESSION_SPLIT_REGEX)
      .filter((part) => !!part)
      .filter((part) => part.trim());

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
    isNegative?: boolean,
    isExact?: boolean
  ): Expression => {
    const isGroupedExpression = ExpressionParser.GROUPED_REGEX.test(expression);

    const flags: string[] =
      expression.match(ExpressionParser.FLAGS_REGEX)?.at(0)?.split('') ?? [];

    const splitExpression = this.splitExpression(
      isGroupedExpression
        ? expression
            .replace(ExpressionParser.GROUPED_REGEX, '$2')
            .replace(ExpressionParser.FLAGS_REGEX, '')
        : expression
    );

    const isLogical = splitExpression.length > 2;

    const isNeg = isNegative || flags.includes('-') || undefined;
    const isExt = isExact || flags.includes('!') || undefined;

    if (isLogical) {
      const [left, operator, ...right] = splitExpression;
      return new LogicalExpression(
        this.buildExpressionType(left),
        (this.operatorMap.get(operator) ?? operator) as Operator,
        this.buildExpressionType(
          right.join(' '),
          operator.includes('NOT') || undefined
        ),
        isGroupedExpression ? isNeg : undefined,
        isGroupedExpression ? isExt : undefined
      );
    }

    return new LiteralExpression(
      splitExpression.join('').replace(ExpressionParser.FLAGS_REGEX, ''),
      isNeg,
      isExt
    );
  };

  public parse = (expression: string): Expression =>
    this.buildExpressionType(expression);
}
