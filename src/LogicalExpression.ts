import {
  Expression,
  ExpressionType,
  LogicalExpressionInterface,
  Operator,
} from './types';

export class LogicalExpression implements LogicalExpressionInterface {
  public type = ExpressionType.Logical;

  public constructor(
    public left: Expression,
    public operator: Operator,
    public right: Expression,
    public isNegative?: boolean,
    public isExact?: boolean
  ) {}
}
