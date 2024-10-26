export const ExpressionType = {
  Literal: 'Literal',
  Logical: 'Logical',
} as const;
export type ExpressionType =
  (typeof ExpressionType)[keyof typeof ExpressionType];

export interface BaseExpressionInterface {
  type: ExpressionType;
  isNegative?: boolean;
  isExact?: boolean;
}

export type LiteralValue = string;

export interface LiteralExpressionInterface extends BaseExpressionInterface {
  field?: string;
  value: LiteralValue;
}

export const Operator = {
  AND: 'AND',
  OR: 'OR',
} as const;
export type Operator = (typeof Operator)[keyof typeof Operator];

export interface LogicalExpressionInterface extends BaseExpressionInterface {
  left: Expression;
  operator: Operator;
  right: Expression;
}

export type Expression =
  | LogicalExpressionInterface
  | LiteralExpressionInterface;

export type ExpressionOptions = {
  defaultOperator: Operator;
};
