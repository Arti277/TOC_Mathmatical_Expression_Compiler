/**
 * ExpressionX - Compiler Front-End
 * Module: Recursive Descent Syntax Analyzer (Parser)
 * 
 * Case Study 17: Mathematical Expression Compiler Front-End
 * Group 17: Gidhad Arti, Rashinkar Sanket, Raut Vaishnavi, Karle Renuka
 * 
 * Formal Context-Free Grammar (CFG):
 * -------------------------------------------------------------
 * Expression → Term ((PLUS | MINUS) Term)*
 * Term       → Factor ((MULTIPLY | DIVIDE) Factor)*
 * Factor     → NUMBER
 *            | IDENTIFIER
 *            | LPAREN Expression RPAREN
 * -------------------------------------------------------------
 * 
 * Operator Precedence:
 * 1. Parentheses `( ... )` [Highest Precedence]
 * 2. Multiplication `*` & Division `/` [Intermediate Precedence]
 * 3. Addition `+` & Subtraction `-` [Lowest Precedence]
 * 
 * Associativity: Left-to-Right for all binary operators (+, -, *, /)
 */

import { TokenType } from './lexer.js';
import { BinaryOpNode, NumberNode, IdentifierNode, resetNodeIdCounter } from './ast.js';

export class SyntaxError extends Error {
  constructor(message, position, expected = '', found = '', problematicExpression = '') {
    super(message);
    this.name = 'SyntaxError';
    this.stage = 'SYNTAX_ANALYSIS';
    this.position = position;
    this.expected = expected;
    this.found = found;
    this.problematicExpression = problematicExpression;
  }
}

/**
 * Parser Class implementing Recursive Descent Parsing
 */
export class Parser {
  constructor(tokens, rawInput = '') {
    this.tokens = tokens;
    this.rawInput = rawInput;
    this.current = 0;
    this.parseTrace = [];
    resetNodeIdCounter();
  }

  /**
   * Helper to inspect the current token without consuming it.
   */
  peek() {
    return this.tokens[this.current] || this.tokens[this.tokens.length - 1];
  }

  /**
   * Helper to inspect the previous consumed token.
   */
  previous() {
    return this.tokens[this.current - 1] || this.tokens[0];
  }

  /**
   * Check if parser has reached the end of token stream.
   */
  isAtEnd() {
    return this.peek().type === TokenType.EOF;
  }

  /**
   * Advance to the next token and return the consumed token.
   */
  advance() {
    if (!this.isAtEnd()) {
      this.current++;
    }
    return this.previous();
  }

  /**
   * Check if current token matches any of the given types.
   */
  check(...types) {
    if (this.isAtEnd()) return false;
    return types.includes(this.peek().type);
  }

  /**
   * Match and consume if the current token matches any of the types.
   */
  match(...types) {
    for (const type of types) {
      if (this.check(type)) {
        this.advance();
        return true;
      }
    }
    return false;
  }

  /**
   * Main entry point to parse tokens into an AST.
   */
  parse() {
    this.parseTrace.push({ step: 'START', rule: 'Program', message: 'Beginning Recursive Descent Parsing.' });

    // Handle empty token stream or only EOF
    if (this.tokens.length === 0 || (this.tokens.length === 1 && this.tokens[0].type === TokenType.EOF)) {
      throw new SyntaxError(
        'Empty expression provided. Please enter an arithmetic expression.',
        1,
        'Expression (Number, Identifier, or "(")',
        'Nothing'
      );
    }

    const ast = this.parseExpression();

    // After parsing the top-level expression, there must be no leftover tokens except EOF!
    if (!this.isAtEnd()) {
      const leftover = this.peek();
      if (leftover.type === TokenType.RPAREN) {
        throw new SyntaxError(
          `Unexpected ')' at position ${leftover.start}. Missing matching opening parenthesis '('.`,
          leftover.start,
          'Operator (+, -, *, /) or End of Expression',
          ')',
          this.rawInput
        );
      } else if (leftover.type === TokenType.IDENTIFIER || leftover.type === TokenType.NUMBER) {
        throw new SyntaxError(
          `Unexpected operand '${leftover.lexeme}' at position ${leftover.start}. Missing operator (+, -, *, /) between operands.`,
          leftover.start,
          'Operator (+, -, *, /)',
          leftover.lexeme,
          this.rawInput
        );
      } else {
        throw new SyntaxError(
          `Unexpected token '${leftover.lexeme}' at position ${leftover.start}.`,
          leftover.start,
          'Operator or End of Expression',
          leftover.lexeme,
          this.rawInput
        );
      }
    }

    this.parseTrace.push({ step: 'SUCCESS', rule: 'Program', message: 'Parsing successfully completed. Valid syntax.' });
    return { ast, parseTrace: this.parseTrace };
  }

  /**
   * Expression Grammar Rule:
   * Expression → Term ((PLUS | MINUS) Term)*
   * Handles lowest precedence binary operators (+ and -).
   */
  parseExpression() {
    this.parseTrace.push({ rule: 'Expression → Term ((+ | -) Term)*', action: 'Enter parseExpression' });

    let left = this.parseTerm();

    while (this.match(TokenType.PLUS, TokenType.MINUS)) {
      const operatorToken = this.previous();
      this.parseTrace.push({
        rule: `Expression → Expression ${operatorToken.lexeme} Term`,
        action: `Matched addition/subtraction operator '${operatorToken.lexeme}'`
      });

      // Check if expression terminates right after operator
      if (this.isAtEnd()) {
        throw new SyntaxError(
          `Unexpected end of expression after operator '${operatorToken.lexeme}' at position ${operatorToken.start}.`,
          operatorToken.start + 1,
          'Number, Identifier, or "("',
          'End of Expression',
          this.rawInput
        );
      }

      const right = this.parseTerm();
      left = new BinaryOpNode(operatorToken.lexeme, left, right, operatorToken.start);
    }

    return left;
  }

  /**
   * Term Grammar Rule:
   * Term → Factor ((MULTIPLY | DIVIDE) Factor)*
   * Handles intermediate precedence binary operators (* and /).
   */
  parseTerm() {
    this.parseTrace.push({ rule: 'Term → Factor ((* | /) Factor)*', action: 'Enter parseTerm' });

    let left = this.parseFactor();

    while (this.match(TokenType.MULTIPLY, TokenType.DIVIDE)) {
      const operatorToken = this.previous();
      this.parseTrace.push({
        rule: `Term → Term ${operatorToken.lexeme} Factor`,
        action: `Matched multiplication/division operator '${operatorToken.lexeme}'`
      });

      // Check if expression terminates right after operator
      if (this.isAtEnd()) {
        throw new SyntaxError(
          `Unexpected end of expression after operator '${operatorToken.lexeme}' at position ${operatorToken.start}.`,
          operatorToken.start + 1,
          'Number, Identifier, or "("',
          'End of Expression',
          this.rawInput
        );
      }

      const right = this.parseFactor();

      // Semantic Check: Division by constant zero detection
      if (operatorToken.lexeme === '/' && right.type === 'Number' && right.numericValue === 0) {
        // We attach a semantic warning/flag or raise error
        // Let's create the node, but we can also flag division by zero
        this.parseTrace.push({
          rule: 'Semantic Check',
          action: `Warning: Division by constant zero detected at position ${operatorToken.start}.`
        });
      }

      left = new BinaryOpNode(operatorToken.lexeme, left, right, operatorToken.start);
    }

    return left;
  }

  /**
   * Factor Grammar Rule:
   * Factor → NUMBER
   *        | IDENTIFIER
   *        | LPAREN Expression RPAREN
   * Handles highest precedence operands and grouped sub-expressions.
   */
  parseFactor() {
    this.parseTrace.push({
      rule: 'Factor → NUMBER | IDENTIFIER | (Expression)',
      action: `Enter parseFactor at token '${this.peek().lexeme}'`
    });

    // 1. Match Numeric Literal
    if (this.match(TokenType.NUMBER)) {
      const token = this.previous();
      this.parseTrace.push({ rule: 'Factor → NUMBER', action: `Consumed Number '${token.lexeme}'` });
      return new NumberNode(token.lexeme, token.start);
    }

    // 2. Match Variable Identifier
    if (this.match(TokenType.IDENTIFIER)) {
      const token = this.previous();
      this.parseTrace.push({ rule: 'Factor → IDENTIFIER', action: `Consumed Identifier '${token.lexeme}'` });
      return new IdentifierNode(token.lexeme, token.start);
    }

    // 3. Match Parenthesized Expression: '(' Expression ')'
    if (this.match(TokenType.LPAREN)) {
      const lparenToken = this.previous();
      this.parseTrace.push({ rule: 'Factor → ( Expression )', action: `Consumed '(' at position ${lparenToken.start}` });

      // Check for empty parentheses: ()
      if (this.check(TokenType.RPAREN)) {
        const rparenToken = this.peek();
        throw new SyntaxError(
          `Empty parentheses '()' detected at position ${lparenToken.start}. Expected an expression inside parentheses.`,
          rparenToken.start,
          'Expression (Number, Identifier, or "(")',
          '()',
          this.rawInput
        );
      }

      const expr = this.parseExpression();

      if (!this.match(TokenType.RPAREN)) {
        const currentToken = this.peek();
        throw new SyntaxError(
          `Missing closing parenthesis ')' for '(' opened at position ${lparenToken.start}.`,
          currentToken.type === TokenType.EOF ? this.rawInput.length + 1 : currentToken.start,
          "')'",
          currentToken.lexeme,
          this.rawInput
        );
      }

      this.parseTrace.push({ rule: 'Factor → ( Expression )', action: 'Matched closing ")"' });
      return expr;
    }

    // 4. Consecutive operators error (e.g. "a + * b")
    const unexpected = this.peek();
    if ([TokenType.PLUS, TokenType.MINUS, TokenType.MULTIPLY, TokenType.DIVIDE].includes(unexpected.type)) {
      throw new SyntaxError(
        `Unexpected operator '${unexpected.lexeme}' at position ${unexpected.start}. Expected a number, identifier, or '('.`,
        unexpected.start,
        'Number, Identifier, or "("',
        `Operator '${unexpected.lexeme}'`,
        this.rawInput
      );
    }

    if (unexpected.type === TokenType.RPAREN) {
      throw new SyntaxError(
        `Unexpected ')' at position ${unexpected.start}. Missing matching opening parenthesis '('.`,
        unexpected.start,
        'Number, Identifier, or "("',
        "')'",
        this.rawInput
      );
    }

    if (unexpected.type === TokenType.EOF) {
      throw new SyntaxError(
        `Unexpected end of expression at position ${unexpected.start}. Expected a number, identifier, or '('.`,
        unexpected.start,
        'Number, Identifier, or "("',
        'End of Expression',
        this.rawInput
      );
    }

    // Fallback error
    throw new SyntaxError(
      `Unexpected token '${unexpected.lexeme}' at position ${unexpected.start}. Expected a number, identifier, or '('.`,
      unexpected.start,
      'Number, Identifier, or "("',
      unexpected.lexeme,
      this.rawInput
    );
  }
}

/**
 * Top-level parse function
 * @param {Array} tokens - List of tokens from lexer
 * @param {string} rawInput - Original expression string
 * @returns {{ ast: BinaryOpNode|NumberNode|IdentifierNode, parseTrace: Array }}
 */
export function parseTokens(tokens, rawInput = '') {
  const parser = new Parser(tokens, rawInput);
  return parser.parse();
}
