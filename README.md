# `@tkfnetwork/expression-parser`

[![code style: prettier](https://img.shields.io/badge/code_style-prettier-ff69b4.svg?style=flat-square)](https://github.com/prettier/prettier)

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
parser.parse('foo AND -bar'); // Becomes 'foo AND NOT bar'
parser.parse('-foo AND bar'); // Becomes 'NOT foo AND bar'
parser.parse('-foo AND -bar'); // Becomes 'NOT foo AND NOT bar'
parser.parse('-field:foo AND -field:bar'); // Becomes 'NOT field:foo AND NOT field:bar'
```

#### Multiple words

Because spaces are used as identifiers to insert an operator, if you have a value that needs to span multiple words, these can be surrounded in quotes, for example:

```ts
parser.parse('"foo bar" AND "boo bar"');
```

This will allow the value to contain spaces. This can work with fields as well, for example:

```ts
parser.parse('field1:"foo bar" AND field2:"boo bar"');
```

#### Fields

Fields can be parsed by joining field name to the value, for example:

```ts
parser.parse('field1:foo AND field2:bar');
```

#### Exact

You can indicate if a parsed values needs an exact match by prefixing with `!`, for example:

```ts
parser.parse('!foo');
parser.parse('foo AND !field1:bar');
```

This will set a flag in the `LiteralExpression` to say `isExact: true`.

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
    type: 'Literal',
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
    type: 'Literal',
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
    type: 'Literal',
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
    type: 'Logical',
    left: {
        type: 'Literal',
        value: 'foo'
    },
    operator: 'AND',
    right: {
        type: 'Literal',
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
    type: 'Logical',
    left: {
        type: 'Literal',
        value: 'foo'
    },
    operator: 'AND',
    right: {
        type: 'Literal',
        value: 'bar',
        isNegative: true
    },
}
```
