import { ExpressionParser } from './ExpressionParser';
import { LiteralExpression } from './LiteralExpression';
import { LogicalExpression } from './LogicalExpression';
import { ExpressionOptions } from './types';

test.each`
  expression                      | expected                                                                                                                                                                 | options
  ${'foo bar'}                    | ${new LogicalExpression(new LiteralExpression('foo'), 'AND', new LiteralExpression('bar'))}                                                                              | ${{}}
  ${'foo bar'}                    | ${new LogicalExpression(new LiteralExpression('foo'), 'AND', new LiteralExpression('bar'))}                                                                              | ${{}}
  ${'"foo bar" AND boo'}          | ${new LogicalExpression(new LiteralExpression('foo bar'), 'AND', new LiteralExpression('boo'))}                                                                          | ${{ defaultOperator: 'AND' } as ExpressionOptions}
  ${'foo AND bar'}                | ${new LogicalExpression(new LiteralExpression('foo'), 'AND', new LiteralExpression('bar'))}                                                                              | ${{}}
  ${'foo AND NOT bar'}            | ${new LogicalExpression(new LiteralExpression('foo'), 'AND', new LiteralExpression('bar', true))}                                                                        | ${{}}
  ${'foo && bar'}                 | ${new LogicalExpression(new LiteralExpression('foo'), 'AND', new LiteralExpression('bar'))}                                                                              | ${{}}
  ${'foo & bar'}                  | ${new LogicalExpression(new LiteralExpression('foo'), 'AND', new LiteralExpression('bar'))}                                                                              | ${{}}
  ${'foo bar'}                    | ${new LogicalExpression(new LiteralExpression('foo'), 'OR', new LiteralExpression('bar'))}                                                                               | ${{ defaultOperator: 'OR' } as ExpressionOptions}
  ${'foo OR bar'}                 | ${new LogicalExpression(new LiteralExpression('foo'), 'OR', new LiteralExpression('bar'))}                                                                               | ${{}}
  ${'foo OR NOT bar'}             | ${new LogicalExpression(new LiteralExpression('foo'), 'OR', new LiteralExpression('bar', true))}                                                                         | ${{}}
  ${'foo bar'}                    | ${new LogicalExpression(new LiteralExpression('foo'), 'OR', new LiteralExpression('bar'))}                                                                               | ${{ defaultOperator: 'OR' } as ExpressionOptions}
  ${'foo OR -bar'}                | ${new LogicalExpression(new LiteralExpression('foo'), 'OR', new LiteralExpression('bar', true))}                                                                         | ${{}}
  ${'-foo OR bar'}                | ${new LogicalExpression(new LiteralExpression('foo', true), 'OR', new LiteralExpression('bar'))}                                                                         | ${{}}
  ${'foo || bar'}                 | ${new LogicalExpression(new LiteralExpression('foo'), 'OR', new LiteralExpression('bar'))}                                                                               | ${{}}
  ${'foo | bar'}                  | ${new LogicalExpression(new LiteralExpression('foo'), 'OR', new LiteralExpression('bar'))}                                                                               | ${{}}
  ${'field1:foo'}                 | ${new LiteralExpression('field1:foo')}                                                                                                                                   | ${{}}
  ${'-field1:foo'}                | ${new LiteralExpression('field1:foo', true)}                                                                                                                             | ${{}}
  ${'foo AND (bar OR doo)'}       | ${new LogicalExpression(new LiteralExpression('foo'), 'AND', new LogicalExpression(new LiteralExpression('bar'), 'OR', new LiteralExpression('doo')))}                   | ${{}}
  ${'(bar OR doo) AND foo'}       | ${new LogicalExpression(new LogicalExpression(new LiteralExpression('bar'), 'OR', new LiteralExpression('doo')), 'AND', new LiteralExpression('foo'))}                   | ${{}}
  ${'foo AND ("bar baa" OR doo)'} | ${new LogicalExpression(new LiteralExpression('foo'), 'AND', new LogicalExpression(new LiteralExpression('bar baa'), 'OR', new LiteralExpression('doo')))}               | ${{}}
  ${'foo:"bar doo" AND bar'}      | ${new LogicalExpression(new LiteralExpression('foo:"bar doo"'), 'AND', new LiteralExpression('bar'))}                                                                    | ${{}}
  ${'foo AND @bar'}               | ${new LogicalExpression(new LiteralExpression('foo'), 'AND', new LiteralExpression('@bar'))}                                                                             | ${{}}
  ${'!field1:foo'}                | ${new LiteralExpression('field1:foo', undefined, true)}                                                                                                                  | ${{}}
  ${'-!field1:foo'}               | ${new LiteralExpression('field1:foo', true, true)}                                                                                                                       | ${{}}
  ${'foo AND !-bar'}              | ${new LogicalExpression(new LiteralExpression('foo'), 'AND', new LiteralExpression('bar', true, true))}                                                                  | ${{}}
  ${'foo AND !(bar AND baa)'}     | ${new LogicalExpression(new LiteralExpression('foo'), 'AND', new LogicalExpression(new LiteralExpression('bar'), 'AND', new LiteralExpression('baa'), undefined, true))} | ${{}}
`(
  'given expression $expression result should be $expected',
  ({ expression, expected, options }) => {
    const parser = new ExpressionParser(options);
    const result = parser.parse(expression);

    expect(result).toEqual(expected);
  }
);
