/**
 * ExpressionX - Comprehensive Test Suite
 * Case Study 17: Mathematical Expression Compiler Front-End
 * 
 * Verifies:
 * 1. Valid expressions, correct AST, operator precedence, TAC generation
 * 2. Invalid expressions, lexical errors, syntax errors, mismatched parentheses
 */

import { compileExpression } from './compiler.js';

export const TEST_CASES = [
  // --- VALID TEST CASES ---
  {
    id: 'TC-V1',
    category: 'Valid Expressions',
    name: 'Basic Addition',
    expression: 'a + b',
    shouldSucceed: true,
    expectedTacCount: 1,
    description: 'Verifies simple binary addition with two identifiers.'
  },
  {
    id: 'TC-V2',
    category: 'Operator Precedence',
    name: 'Precedence: Multiply over Add',
    expression: 'a + b * c',
    shouldSucceed: true,
    expectedTac: ['t1 = b * c', 't2 = a + t1'],
    description: 'Ensures multiplication binds tighter than addition: a + (b * c).'
  },
  {
    id: 'TC-V3',
    category: 'Parentheses Precedence',
    name: 'Parentheses Overriding Precedence',
    expression: '(a + b) * c',
    shouldSucceed: true,
    expectedTac: ['t1 = a + b', 't2 = t1 * c'],
    description: 'Parentheses force addition before multiplication.'
  },
  {
    id: 'TC-V4',
    category: 'Valid Expressions',
    name: 'Division and Subtraction',
    expression: 'x / y - z',
    shouldSucceed: true,
    expectedTac: ['t1 = x / y', 't2 = t1 - z'],
    description: 'Tests division precedence over subtraction: (x / y) - z.'
  },
  {
    id: 'TC-V5',
    category: 'Numeric Literals',
    name: 'Pure Numeric Expression',
    expression: '10 + 20 * 5',
    shouldSucceed: true,
    expectedTac: ['t1 = 20 * 5', 't2 = 10 + t1'],
    description: 'Validates parsing of integer literal numbers.'
  },
  {
    id: 'TC-V6',
    category: 'Complex Expressions',
    name: 'Nested Parentheses with Identifiers & Constants',
    expression: 'x + y * (z - 5)',
    shouldSucceed: true,
    expectedTac: ['t1 = z - 5', 't2 = y * t1', 't3 = x + t2'],
    description: 'Combines identifiers, constants, parentheses, and mixed precedence.'
  },
  {
    id: 'TC-V7',
    category: 'Complex Expressions',
    name: 'Dual Parenthesized Sub-expressions',
    expression: '(a + b) / (c - d)',
    shouldSucceed: true,
    expectedTac: ['t1 = a + b', 't2 = c - d', 't3 = t1 / t2'],
    description: 'Tests independent subtrees joined by division.'
  },
  {
    id: 'TC-V8',
    category: 'Multi-character Identifiers',
    name: 'Real-world Variable Names',
    expression: 'price * quantity + tax',
    shouldSucceed: true,
    expectedTac: ['t1 = price * quantity', 't2 = t1 + tax'],
    description: 'Ensures multi-character variable names are correctly tokenized.'
  },
  {
    id: 'TC-V9',
    category: 'Floating Point Numbers',
    name: 'Decimals and Floating Points',
    expression: '10.5 * rate + 2.75',
    shouldSucceed: true,
    description: 'Validates floating-point literals with decimal points.'
  },

  // --- INVALID TEST CASES (ERROR DETECTION) ---
  {
    id: 'TC-I1',
    category: 'Syntax Errors',
    name: 'Consecutive Operators',
    expression: 'a + * b',
    shouldSucceed: false,
    expectedErrorStage: 'SYNTAX_ANALYSIS',
    description: 'Detects consecutive binary operators without an intervening operand.'
  },
  {
    id: 'TC-I2',
    category: 'Syntax Errors',
    name: 'Hanging Operator at End',
    expression: 'a +',
    shouldSucceed: false,
    expectedErrorStage: 'SYNTAX_ANALYSIS',
    description: 'Detects premature EOF after binary operator.'
  },
  {
    id: 'TC-I3',
    category: 'Syntax Errors',
    name: 'Unclosed Left Parenthesis',
    expression: '(a + b',
    shouldSucceed: false,
    expectedErrorStage: 'SYNTAX_ANALYSIS',
    description: 'Flags missing closing parenthesis ")".'
  },
  {
    id: 'TC-I4',
    category: 'Syntax Errors',
    name: 'Unmatched Right Parenthesis',
    expression: 'a + b)',
    shouldSucceed: false,
    expectedErrorStage: 'SYNTAX_ANALYSIS',
    description: 'Flags stray closing parenthesis without matching opening "(". '
  },
  {
    id: 'TC-I5',
    category: 'Lexical Errors',
    name: 'Invalid Character (@)',
    expression: 'a @ b',
    shouldSucceed: false,
    expectedErrorStage: 'LEXICAL_ANALYSIS',
    description: 'Flags unrecognized symbol "@" during lexical analysis.'
  },
  {
    id: 'TC-I6',
    category: 'Syntax Errors',
    name: 'Lone Multiplication Operator',
    expression: '*',
    shouldSucceed: false,
    expectedErrorStage: 'SYNTAX_ANALYSIS',
    description: 'Detects unexpected operator with no leading operand.'
  },
  {
    id: 'TC-I7',
    category: 'Syntax Errors',
    name: 'Lone Addition Operator',
    expression: '+',
    shouldSucceed: false,
    expectedErrorStage: 'SYNTAX_ANALYSIS',
    description: 'Detects unexpected addition operator.'
  },
  {
    id: 'TC-I8',
    category: 'Syntax Errors',
    name: 'Empty Parentheses',
    expression: '()',
    shouldSucceed: false,
    expectedErrorStage: 'SYNTAX_ANALYSIS',
    description: 'Detects empty parentheses without any expression inside.'
  },
  {
    id: 'TC-I9',
    category: 'Lexical Errors',
    name: 'Malformed Floating Point',
    expression: '12.34.56 + x',
    shouldSucceed: false,
    expectedErrorStage: 'LEXICAL_ANALYSIS',
    description: 'Flags multiple decimal points in a single number literal.'
  }
];

/**
 * Execute all test cases and return structured results
 */
export function runTestSuite() {
  const results = [];
  let passedCount = 0;

  for (const test of TEST_CASES) {
    const compileResult = compileExpression(test.expression);
    let passed = false;
    let failureReason = '';

    if (test.shouldSucceed) {
      if (compileResult.success) {
        passed = true;
        // Verify expected TAC if specified
        if (test.expectedTac) {
          const generatedTac = compileResult.stages.tac.instructions;
          const match = test.expectedTac.every((expectedInstr, idx) => generatedTac[idx] === expectedInstr);
          if (!match) {
            passed = false;
            failureReason = `TAC mismatch. Expected [${test.expectedTac.join(', ')}], got [${generatedTac.join(', ')}]`;
          }
        }
      } else {
        passed = false;
        failureReason = `Expected success but got error: ${compileResult.error?.message}`;
      }
    } else {
      if (!compileResult.success) {
        passed = true;
        if (test.expectedErrorStage && compileResult.error?.stage !== test.expectedErrorStage) {
          passed = false;
          failureReason = `Error stage mismatch. Expected ${test.expectedErrorStage}, got ${compileResult.error?.stage}`;
        }
      } else {
        passed = false;
        failureReason = 'Expected error but expression unexpectedly compiled successfully!';
      }
    }

    if (passed) passedCount++;

    results.push({
      ...test,
      passed,
      failureReason,
      compileResult
    });
  }

  return {
    total: TEST_CASES.length,
    passed: passedCount,
    failed: TEST_CASES.length - passedCount,
    allPassed: passedCount === TEST_CASES.length,
    results
  };
}
