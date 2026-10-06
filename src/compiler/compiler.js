/**
 * ExpressionX - Compiler Front-End Orchestrator
 * Module: Compiler Engine
 * 
 * Case Study 17: Mathematical Expression Compiler Front-End
 * Group 17: Gidhad Arti, Rashinkar Sanket, Raut Vaishnavi, Karle Renuka
 * 
 * Integrates:
 * Input → Lexer → Parser → AST → Intermediate Representation (TAC)
 */

import { tokenize, LexicalError } from './lexer.js';
import { parseTokens, SyntaxError } from './parser.js';
import { getTreeMetrics, computeTreeLayout } from './ast.js';
import { generateTAC } from './tac.js';

/**
 * Generate a visual pointer string pointing to the exact error column.
 * Example:
 *   a + * b
 *       ^
 */
function createErrorPointer(expression, position) {
  if (!expression) return '';
  const pos = Math.max(1, Math.min(position, expression.length + 1));
  const spaces = ' '.repeat(Math.max(0, pos - 1));
  return `${expression}\n${spaces}^`;
}

/**
 * Perform complete compilation front-end analysis on an expression.
 * 
 * @param {string} input - Mathematical expression string
 * @returns {object} Full compilation results including all stages and metadata
 */
export function compileExpression(input) {
  const trimmed = typeof input === 'string' ? input.trim() : '';

  const result = {
    input: input,
    success: false,
    timestamp: new Date().toISOString(),
    stages: {
      input: {
        completed: true,
        value: input,
        length: input ? input.length : 0
      },
      lexer: {
        completed: false,
        tokens: [],
        logs: [],
        error: null
      },
      parser: {
        completed: false,
        parseTrace: [],
        error: null
      },
      ast: {
        completed: false,
        root: null,
        metrics: null,
        layout: null,
        error: null
      },
      tac: {
        completed: false,
        instructions: [],
        quadruples: [],
        triples: [],
        finalResult: '',
        generationTrace: [],
        tempCount: 0,
        error: null
      }
    },
    error: null,
    summary: {
      status: 'PENDING',
      tokenCount: 0,
      astDepth: 0,
      astNodeCount: 0,
      tacInstructionCount: 0,
      tempVarCount: 0,
      compilationStage: 'Not Started',
      note: 'Machine code generation is outside the scope of this compiler front-end.'
    }
  };

  // 0. Check Empty Expression
  if (!trimmed) {
    result.error = {
      stage: 'INPUT_VALIDATION',
      stageName: 'Input Validation',
      type: 'EmptyInputError',
      message: 'Expression cannot be empty. Please enter a valid arithmetic expression.',
      position: 1,
      pointerLine: '^\n(No expression provided)',
      expected: 'Mathematical expression (e.g., a + b * c)',
      found: 'Empty string',
      suggestion: 'Try loading one of the predefined examples above!'
    };
    result.summary.status = 'COMPILATION FAILED';
    result.summary.compilationStage = 'Failed at Input Validation';
    return result;
  }

  // 1. Lexical Analysis (Scanning & Token Generation)
  try {
    const lexResult = tokenize(input);
    result.stages.lexer.completed = true;
    result.stages.lexer.tokens = lexResult.tokens;
    result.stages.lexer.logs = lexResult.logs;
    result.summary.tokenCount = lexResult.tokens.length;
  } catch (err) {
    const position = err.position || 1;
    result.stages.lexer.error = err.message;
    result.error = {
      stage: 'LEXICAL_ANALYSIS',
      stageName: 'Lexical Analysis (Tokenizer)',
      type: 'Lexical Error',
      message: err.message,
      position: position,
      pointerLine: createErrorPointer(input, position),
      expected: 'Valid character: alphanumeric [a-z, A-Z, 0-9], or operator [+, -, *, /, (, )]',
      found: err.char || 'Invalid token',
      suggestion: 'Check for unsupported symbols like @, $, #, &, or malformed numbers like 1.2.3'
    };
    result.summary.status = 'COMPILATION FAILED';
    result.summary.compilationStage = 'Failed at Lexical Analysis';
    return result;
  }

  // 2. Syntax Analysis (Recursive Descent Parsing & AST Construction)
  let parseResult;
  try {
    parseResult = parseTokens(result.stages.lexer.tokens, input);
    result.stages.parser.completed = true;
    result.stages.parser.parseTrace = parseResult.parseTrace;
  } catch (err) {
    const position = err.position || 1;
    result.stages.parser.error = err.message;
    result.error = {
      stage: 'SYNTAX_ANALYSIS',
      stageName: 'Syntax Analysis (Parser)',
      type: 'Syntax Error',
      message: err.message,
      position: position,
      pointerLine: createErrorPointer(input, position),
      expected: err.expected || 'Valid mathematical syntax',
      found: err.found || 'Unexpected token',
      suggestion: 'Ensure balanced parentheses and that every operator has left and right operands.'
    };
    result.summary.status = 'COMPILATION FAILED';
    result.summary.compilationStage = 'Failed at Syntax Analysis';
    return result;
  }

  // 3. Abstract Syntax Tree (AST) Layout & Metrics
  try {
    const astRoot = parseResult.ast;
    const metrics = getTreeMetrics(astRoot);
    const layout = computeTreeLayout(astRoot);

    result.stages.ast.completed = true;
    result.stages.ast.root = astRoot;
    result.stages.ast.metrics = metrics;
    result.stages.ast.layout = layout;

    result.summary.astDepth = metrics.maxDepth;
    result.summary.astNodeCount = metrics.totalNodes;
  } catch (err) {
    result.stages.ast.error = err.message;
    result.error = {
      stage: 'AST_GENERATION',
      stageName: 'AST Construction',
      type: 'AST Generation Error',
      message: err.message,
      position: 1,
      pointerLine: input,
      expected: 'Valid AST structure',
      found: 'Error during AST layout',
      suggestion: 'Please verify the parsed tree hierarchy.'
    };
    result.summary.status = 'COMPILATION FAILED';
    result.summary.compilationStage = 'Failed at AST Construction';
    return result;
  }

  // 4. Intermediate Representation (Three Address Code)
  try {
    const tacResult = generateTAC(result.stages.ast.root);
    result.stages.tac.completed = true;
    result.stages.tac.instructions = tacResult.instructions;
    result.stages.tac.quadruples = tacResult.quadruples;
    result.stages.tac.triples = tacResult.triples;
    result.stages.tac.finalResult = tacResult.finalResult;
    result.stages.tac.generationTrace = tacResult.generationTrace;
    result.stages.tac.tempCount = tacResult.tempCount;

    result.summary.tacInstructionCount = tacResult.instructions.length;
    result.summary.tempVarCount = tacResult.tempCount;
  } catch (err) {
    result.stages.tac.error = err.message;
    result.error = {
      stage: 'TAC_GENERATION',
      stageName: 'Intermediate Code Generation',
      type: 'Three Address Code Error',
      message: err.message,
      position: 1,
      pointerLine: input,
      expected: 'Linear TAC translation',
      found: 'Error in post-order reduction',
      suggestion: 'Check AST leaf and operator nodes.'
    };
    result.summary.status = 'COMPILATION FAILED';
    result.summary.compilationStage = 'Failed at Intermediate Representation';
    return result;
  }

  // All Front-End Stages Succeeded!
  result.success = true;
  result.summary.status = 'VALID EXPRESSION';
  result.summary.compilationStage = 'Front-End Completed';
  return result;
}
