# `@tkfnetwork/expression-parser`

A small AST expression parser that parses natural AND/OR expressions, handling nested expressions, negative expressions and field expressions.

## Installation

```
npm i @tkfnetwork/expression-parser
```

## Usage

```ts
const parser = new ExpressionParser({
  defaultOperator: 'OR',
});
```

### Syntax

#### Logical Operators

Logical operators are used to combine left and right expressions to create an order. The following logical expressions are accepted:

| Operator  | Alias                      | Description                                                |
| --------- | -------------------------- | ---------------------------------------------------------- |
| `AND`     | `&&`<br />`&`<br /> ` `    | If using a space, see default operator configuration below |
| `OR`      | `\|\|`<br />`\|`<br /> ` ` | If using a space, see default operator configuration below |
| `AND NOT` |                            | Will result in the right operation being negative          |
| `OR NOT`  |                            | Will result in the right operation being negative          |

#### Negation

To negate an expression you can use either of the `AND NOT` or `OR NOT` operators, or you can negate either side of the by prefixing the expression with a `-`. For example:

```ts
parser.parse('foo AND NOT bar');
parser.parse('foo OR NOT bar');
parser.parse('foo AND -bar'); // Becomes 'foo OR NOT bar'
parser.parse('-foo AND bar'); // Becomes 'NOT foo OR bar'
parser.parse('-foo AND -bar'); // Becomes 'NOT foo OR NOT bar'
```

#### Fields

Fields can be parsed by joining field name to the value, for example:

```ts
parser.parse('field1:foo AND field2:bar');
```

### Configuration options

#### `defaultOperator: 'AND' | 'OR'`

When passing an expression that has implicit operator, e.g. a space, then this operator is used to determine the logical expression.

For example:

```ts
const parser = new ExpressionParser({
  defaultOperator: 'OR',
});

parser.parse('foo bar'); // Becomes 'foo OR bar'
```

```ts
const parser = new ExpressionParser({
  defaultOperator: 'AND', // default
});

parser.parse('foo bar'); // Becomes 'foo AND bar'
```

### AST

Parsed expressions are returned as an AST which can be used to traverse the tree and see how the expression was parsed. The returned object is an `Expression` class which can be one of the following with nested properties:

#### `LiteralExpression`

A literal expression holds the literal value and whether it has been negated or not.

For example:

```ts
parser.parse('foo');
```

Would become:

```ts
{
    type: 'LiteralExpression',
    value: 'foo'
}
```

Using negation, for example:

```ts
parser.parse('-foo');
```

Would become:

```ts
{
    type: 'LiteralExpression',
    value: 'foo',
    isNegative: true
}
```

Using fields, for example:

```ts
parser.parse('foo:bar');
```

Would become:

```ts
{
    type: 'LiteralExpression',
    value: 'bar',
    field: 'foo'
}
```

#### `LogicalExpression`

The logical expression object holds the left and right values that were parsed as well as the base operator.

For example:

```ts
parser.parse('foo AND bar');
```

Would become:

```ts
{
    type: 'LogicalExpression',
    left: {
        type: 'LiteralExpression',
        value: 'foo'
    },
    operator: 'AND',
    right: {
        type: 'LiteralExpression',
        value: 'bar'
    },
}
```

Using negation operator, for example:

```ts
parser.parse('foo AND NOT bar');
```

Would become:

```ts
{
    type: 'LogicalExpression',
    left: {
        type: 'LiteralExpression',
        value: 'foo'
    },
    operator: 'AND',
    right: {
        type: 'LiteralExpression',
        value: 'bar',
        isNegative: true
    },
}
```
