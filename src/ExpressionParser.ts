import { LiteralExpression } from './LiteralExpression';
import { LogicalExpression } from './LogicalExpression';
import { Expression, ExpressionOptions, Operator } from './types';

export class ExpressionParser {
  static EXPRESSION_SPLIT_REGEX =
    /([-!]?\((?:[^()]+|\([^()]*\))*\)|[^\s:]+:"[^"]*"|[^\s:]+:[^\s]+|"[^"]*"|[-!]?[^\s()]+)\s*(AND\s+NOT|OR\s+NOT|AND|OR|&&|\|\||\||&)?\s*/g;
  static FLAGS_REGEX = /^(-|!)+/g;
  static GROUPED_FLAGS_REGEX = /^[-!]*\(([^)]+(:[^)]+)?)\)/i;
  static GROUPED_REGEX = /^([!\\-]*)\([^¬]*\s*(AND|OR|\s)+\s*[^¬]+\)$/i;

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
    isExact?: boolean,
    innerGroup?: boolean
  ): Expression => {
    const splitExpression = this.splitExpression(expression);
    const grouped = splitExpression.map((exp) =>
      ExpressionParser.GROUPED_REGEX.test(exp)
    );
    const flags = splitExpression.map((exp) =>
      exp
        .match(ExpressionParser.FLAGS_REGEX)
        ?.flatMap((match) => match.split(''))
    );

    const isLogical = splitExpression.length > 2;
    const isNeg = isNegative || flags.at(0)?.includes('-') || undefined;
    const isExt = isExact || flags.at(0)?.includes('!') || undefined;

    if (isLogical) {
      const [left, operator, ...right] = splitExpression;
      const replacedLeft = left.replace(
        ExpressionParser.GROUPED_FLAGS_REGEX,
        '$1'
      );

      return new LogicalExpression(
        this.buildExpressionType(replacedLeft),
        (this.operatorMap.get(operator) ?? operator) as Operator,
        this.buildExpressionType(
          right.join(' '),
          operator.includes('NOT') || undefined
        ),
        grouped.at(0) || innerGroup ? isNeg : undefined,
        grouped.at(0) || innerGroup ? isExt : undefined
      );
    }

    const literalValue = splitExpression
      .join('')
      .replace(ExpressionParser.FLAGS_REGEX, '');

    if (ExpressionParser.GROUPED_FLAGS_REGEX.test(literalValue)) {
      return this.buildExpressionType(
        literalValue.replace(ExpressionParser.GROUPED_FLAGS_REGEX, '$1'),
        isNeg,
        isExt,
        true
      );
    }

    return new LiteralExpression(
      splitExpression.join('').replace(ExpressionParser.FLAGS_REGEX, ''),
      isNeg || undefined,
      isExt || undefined
    );
  };

  public parse = (expression: string): Expression =>
    this.buildExpressionType(expression);
}
