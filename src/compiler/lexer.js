/**
 * ExpressionX - Compiler Front-End
 * Module: Lexical Analyzer (Tokenizer)
 * 
 * Case Study 17: Mathematical Expression Compiler Front-End
 * Group 17: Gidhad Arti, Rashinkar Sanket, Raut Vaishnavi, Karle Renuka
 * 
 * Scans the input mathematical expression character-by-character,
 * ignores whitespace, generates tokens with exact 1-based positions,
 * and detects lexical errors (e.g. invalid characters, malformed numbers).
 */

export const TokenType = Object.freeze({
  IDENTIFIER: 'IDENTIFIER',
  NUMBER: 'NUMBER',
  PLUS: 'PLUS',
  MINUS: 'MINUS',
  MULTIPLY: 'MULTIPLY',
  DIVIDE: 'DIVIDE',
  LPAREN: 'LPAREN',
  RPAREN: 'RPAREN',
  EOF: 'EOF',
});

export class LexicalError extends Error {
  constructor(message, position, char = '') {
    super(message);
    this.name = 'LexicalError';
    this.stage = 'LEXICAL_ANALYSIS';
    this.position = position;
    this.char = char;
  }
}

/**
 * Tokenize an input mathematical expression string.
 * @param {string} input - The raw expression string entered by the user.
 * @returns {{ tokens: Array, logs: Array }}
 */
export function tokenize(input) {
  if (typeof input !== 'string') {
    throw new LexicalError('Input must be a string.', 1);
  }

  const tokens = [];
  const logs = [];
  const length = input.length;
  let cursor = 0;
  let tokenId = 1;

  logs.push(`Starting lexical scan of expression length: ${length} characters.`);

  while (cursor < length) {
    const char = input[cursor];
    const currentPosition = cursor + 1; // 1-based position for user-facing display

    // 1. Skip Whitespace (spaces, tabs, newlines)
    if (/\s/.test(char)) {
      cursor++;
      continue;
    }

    // 2. Single-character operators and parentheses
    if (char === '+') {
      tokens.push({
        id: tokenId++,
        lexeme: '+',
        type: TokenType.PLUS,
        start: currentPosition,
        end: currentPosition,
        description: 'Addition Operator'
      });
      logs.push(`Position ${currentPosition}: Recognized '+' as PLUS token.`);
      cursor++;
      continue;
    }

    if (char === '-') {
      tokens.push({
        id: tokenId++,
        lexeme: '-',
        type: TokenType.MINUS,
        start: currentPosition,
        end: currentPosition,
        description: 'Subtraction Operator'
      });
      logs.push(`Position ${currentPosition}: Recognized '-' as MINUS token.`);
      cursor++;
      continue;
    }

    if (char === '*') {
      tokens.push({
        id: tokenId++,
        lexeme: '*',
        type: TokenType.MULTIPLY,
        start: currentPosition,
        end: currentPosition,
        description: 'Multiplication Operator'
      });
      logs.push(`Position ${currentPosition}: Recognized '*' as MULTIPLY token.`);
      cursor++;
      continue;
    }

    if (char === '/') {
      tokens.push({
        id: tokenId++,
        lexeme: '/',
        type: TokenType.DIVIDE,
        start: currentPosition,
        end: currentPosition,
        description: 'Division Operator'
      });
      logs.push(`Position ${currentPosition}: Recognized '/' as DIVIDE token.`);
      cursor++;
      continue;
    }

    if (char === '(') {
      tokens.push({
        id: tokenId++,
        lexeme: '(',
        type: TokenType.LPAREN,
        start: currentPosition,
        end: currentPosition,
        description: 'Left Parenthesis'
      });
      logs.push(`Position ${currentPosition}: Recognized '(' as LPAREN token.`);
      cursor++;
      continue;
    }

    if (char === ')') {
      tokens.push({
        id: tokenId++,
        lexeme: ')',
        type: TokenType.RPAREN,
        start: currentPosition,
        end: currentPosition,
        description: 'Right Parenthesis'
      });
      logs.push(`Position ${currentPosition}: Recognized ')' as RPAREN token.`);
      cursor++;
      continue;
    }

    // 3. Numbers: Integer or Floating Point (e.g., 0, 5, 10, 25.5, 100.75)
    if (/[0-9]/.test(char)) {
      const start = currentPosition;
      let numberStr = '';
      let hasDot = false;

      while (cursor < length) {
        const nextChar = input[cursor];
        if (/[0-9]/.test(nextChar)) {
          numberStr += nextChar;
          cursor++;
        } else if (nextChar === '.') {
          if (hasDot) {
            // Found a second decimal point in the same number literal
            numberStr += nextChar;
            throw new LexicalError(
              `Invalid number format '${numberStr}' at position ${cursor + 1}. Multiple decimal points detected.`,
              cursor + 1,
              '.'
            );
          }
          hasDot = true;
          numberStr += nextChar;
          cursor++;
        } else {
          break;
        }
      }

      // Check if number ends with a hanging decimal point like "10."
      if (numberStr.endsWith('.')) {
        throw new LexicalError(
          `Invalid number format '${numberStr}' at position ${cursor}. Expected decimal digits after '.'`,
          cursor,
          '.'
        );
      }

      tokens.push({
        id: tokenId++,
        lexeme: numberStr,
        type: TokenType.NUMBER,
        value: parseFloat(numberStr),
        start: start,
        end: cursor,
        description: hasDot ? 'Floating-Point Literal' : 'Integer Literal'
      });
      logs.push(`Position ${start}-${cursor}: Recognized '${numberStr}' as NUMBER token.`);
      continue;
    }

    // 4. Identifiers: Variable names (e.g. a, b, x, y, price, total, var_1)
    // Starts with [a-zA-Z_], followed by [a-zA-Z0-9_]*
    if (/[a-zA-Z_]/.test(char)) {
      const start = currentPosition;
      let identStr = '';

      while (cursor < length && /[a-zA-Z0-9_]/.test(input[cursor])) {
        identStr += input[cursor];
        cursor++;
      }

      tokens.push({
        id: tokenId++,
        lexeme: identStr,
        type: TokenType.IDENTIFIER,
        value: identStr,
        start: start,
        end: cursor,
        description: 'Variable Identifier'
      });
      logs.push(`Position ${start}-${cursor}: Recognized '${identStr}' as IDENTIFIER token.`);
      continue;
    }

    // 5. Unrecognized Character -> Lexical Error!
    throw new LexicalError(
      `Invalid character '${char}' at position ${currentPosition}.`,
      currentPosition,
      char
    );
  }

  // 6. Append EOF (End Of File / Expression) Token
  tokens.push({
    id: tokenId++,
    lexeme: 'EOF',
    type: TokenType.EOF,
    start: length + 1,
    end: length + 1,
    description: 'End Of File / Expression'
  });
  logs.push(`Lexical analysis complete. Generated ${tokens.length} tokens (including EOF).`);

  return { tokens, logs };
}
