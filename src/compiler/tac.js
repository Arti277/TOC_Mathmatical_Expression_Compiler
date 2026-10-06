/**
 * ExpressionX - Compiler Front-End
 * Module: Intermediate Representation (Three Address Code - TAC) Generator
 * 
 * Case Study 17: Mathematical Expression Compiler Front-End
 * Group 17: Gidhad Arti, Rashinkar Sanket, Raut Vaishnavi, Karle Renuka
 * 
 * In Three Address Code (TAC):
 * - Each instruction has at most three addresses (two operands and one result).
 * - General form: x = y op z
 * - Complex expressions are linearized using compiler-generated temporary variables (t1, t2, ...).
 * - Code is generated dynamically via post-order traversal (bottom-up reduction) of the AST.
 */

let tempCounter = 1;

export function resetTempCounter() {
  tempCounter = 1;
}

/**
 * Generate a new unique temporary variable name.
 * e.g., t1, t2, t3, ...
 */
export function newTemp() {
  return `t${tempCounter++}`;
}

/**
 * Generate Three Address Code, Quadruples, Triples, and Step-by-Step IR logs from an AST.
 * 
 * @param {object} astRoot - The root node of the Abstract Syntax Tree
 * @returns {{
 *   instructions: Array<string>,
 *   quadruples: Array<{id: number, op: string, arg1: string, arg2: string, result: string}>,
 *   triples: Array<{id: number, op: string, arg1: string, arg2: string}>,
 *   finalResult: string,
 *   generationTrace: Array<string>,
 *   tempCount: number
 * }}
 */
export function generateTAC(astRoot) {
  resetTempCounter();

  const instructions = [];
  const quadruples = [];
  const triples = [];
  const generationTrace = [];

  if (!astRoot) {
    return {
      instructions: [],
      quadruples: [],
      triples: [],
      finalResult: '',
      generationTrace: ['Empty AST. No Three Address Code generated.'],
      tempCount: 0
    };
  }

  // Handle single leaf expressions (e.g. single number "42" or single identifier "a")
  if (astRoot.type !== 'BinaryOp') {
    const val = astRoot.type === 'Number' ? astRoot.value : astRoot.name;
    const temp = newTemp();
    const instr = `${temp} = ${val}`;
    instructions.push(instr);
    quadruples.push({
      id: 1,
      op: '=',
      arg1: val,
      arg2: '',
      result: temp
    });
    triples.push({
      id: 0,
      op: '=',
      arg1: val,
      arg2: ''
    });
    generationTrace.push(`Single leaf node '${val}' assigned to temporary variable ${temp}.`);
    return {
      instructions,
      quadruples,
      triples,
      finalResult: temp,
      generationTrace,
      tempCount: 1
    };
  }

  /**
   * Recursive bottom-up post-order helper
   * @param {object} node - Current AST node
   * @returns {string} - The variable/literal representing the value of this subtree
   */
  function traverse(node) {
    if (!node) return '';

    // Leaf: Numeric Literal
    if (node.type === 'Number') {
      return String(node.value);
    }

    // Leaf: Identifier
    if (node.type === 'Identifier') {
      return node.name;
    }

    // Binary Operator Node: Evaluate left and right subtrees first (Post-Order)
    if (node.type === 'BinaryOp') {
      generationTrace.push(`Visiting operator '${node.operator}': evaluating left and right subtrees.`);

      const leftAddress = traverse(node.left);
      const rightAddress = traverse(node.right);

      const tempVar = newTemp();
      const instructionStr = `${tempVar} = ${leftAddress} ${node.operator} ${rightAddress}`;
      instructions.push(instructionStr);

      const quadIndex = quadruples.length + 1;
      quadruples.push({
        id: quadIndex,
        op: node.operator,
        arg1: leftAddress,
        arg2: rightAddress,
        result: tempVar
      });

      // Triples format references previous instruction indices in parentheses
      // Find if arg1 / arg2 are previous temporaries
      const tripleArg1 = leftAddress.startsWith('t') ? `(${parseInt(leftAddress.slice(1)) - 1})` : leftAddress;
      const tripleArg2 = rightAddress.startsWith('t') ? `(${parseInt(rightAddress.slice(1)) - 1})` : rightAddress;

      triples.push({
        id: triples.length,
        op: node.operator,
        arg1: tripleArg1,
        arg2: tripleArg2
      });

      generationTrace.push(
        `Subtree reduced: allocated temporary variable '${tempVar}' for '${leftAddress} ${node.operator} ${rightAddress}'.`
      );

      return tempVar;
    }

    return '';
  }

  const finalResult = traverse(astRoot);
  const totalTemps = tempCounter - 1;

  generationTrace.push(
    `TAC Generation Complete. Total ${instructions.length} instructions, ${totalTemps} temporary variables allocated. Final result in '${finalResult}'.`
  );

  return {
    instructions,
    quadruples,
    triples,
    finalResult,
    generationTrace,
    tempCount: totalTemps
  };
}
