/**
 * ExpressionX - Compiler Front-End
 * Module: Abstract Syntax Tree (AST) Structures & Utilities
 * 
 * Case Study 17: Mathematical Expression Compiler Front-End
 * Group 17: Gidhad Arti, Rashinkar Sanket, Raut Vaishnavi, Karle Renuka
 */

let nextNodeId = 1;

export function resetNodeIdCounter() {
  nextNodeId = 1;
}

/**
 * Binary Operator Node in the AST
 * Represents: left [op] right (e.g., +, -, *, /)
 */
export class BinaryOpNode {
  constructor(operator, left, right, position = null) {
    this.id = `node_${nextNodeId++}`;
    this.type = 'BinaryOp';
    this.operator = operator;
    this.left = left;
    this.right = right;
    this.position = position;
  }

  toString() {
    return `(${this.left.toString()} ${this.operator} ${this.right.toString()})`;
  }
}

/**
 * Numeric Literal Node in the AST
 * Represents numbers like 5, 25.5, 100
 */
export class NumberNode {
  constructor(value, position = null) {
    this.id = `node_${nextNodeId++}`;
    this.type = 'Number';
    this.value = String(value);
    this.numericValue = Number(value);
    this.position = position;
  }

  toString() {
    return this.value;
  }
}

/**
 * Identifier Node in the AST
 * Represents variable names like a, b, price, total
 */
export class IdentifierNode {
  constructor(name, position = null) {
    this.id = `node_${nextNodeId++}`;
    this.type = 'Identifier';
    this.name = name;
    this.value = name;
    this.position = position;
  }

  toString() {
    return this.name;
  }
}

/**
 * Traverse the AST in Post-Order (Left, Right, Root)
 * Critical for intermediate representation (TAC) generation!
 */
export function postOrderTraversal(node, callback) {
  if (!node) return;
  if (node.type === 'BinaryOp') {
    postOrderTraversal(node.left, callback);
    postOrderTraversal(node.right, callback);
  }
  callback(node);
}

/**
 * Traverse the AST in Pre-Order (Root, Left, Right)
 */
export function preOrderTraversal(node, callback) {
  if (!node) return;
  callback(node);
  if (node.type === 'BinaryOp') {
    preOrderTraversal(node.left, callback);
    preOrderTraversal(node.right, callback);
  }
}

/**
 * Traverse the AST in In-Order (Left, Root, Right)
 */
export function inOrderTraversal(node, callback) {
  if (!node) return;
  if (node.type === 'BinaryOp') {
    inOrderTraversal(node.left, callback);
  }
  callback(node);
  if (node.type === 'BinaryOp') {
    inOrderTraversal(node.right, callback);
  }
}

/**
 * Calculate AST metrics (Total Nodes, Depth, Operator Count, Leaf Count)
 */
export function getTreeMetrics(node) {
  if (!node) {
    return { totalNodes: 0, maxDepth: 0, operators: 0, leaves: 0 };
  }

  let totalNodes = 0;
  let operators = 0;
  let leaves = 0;

  function count(n, depth = 1) {
    if (!n) return 0;
    totalNodes++;
    if (n.type === 'BinaryOp') {
      operators++;
      const leftDepth = count(n.left, depth + 1);
      const rightDepth = count(n.right, depth + 1);
      return 1 + Math.max(leftDepth, rightDepth);
    } else {
      leaves++;
      return 1;
    }
  }

  const maxDepth = count(node);
  return { totalNodes, maxDepth, operators, leaves };
}

/**
 * Dynamic Tree Layout Algorithm for SVG rendering
 * Computes exact (x, y) coordinates for nodes and links without overlap.
 * Uses a modified Reingold-Tilford / subtree width spacing algorithm.
 * 
 * @param {ASTNode} root - The root node of the AST
 * @param {number} nodeRadius - Radius of each node in pixels
 * @param {number} levelHeight - Vertical spacing between levels
 * @returns {{ nodes: Array, links: Array, width: number, height: number }}
 */
export function computeTreeLayout(root, nodeRadius = 26, levelHeight = 75) {
  if (!root) {
    return { nodes: [], links: [], width: 400, height: 200 };
  }

  const nodes = [];
  const links = [];
  let nextX = 40;
  const horizontalGap = 35;

  // Step 1: Assign preliminary x to leaves and post-order center parents
  function assignCoordinates(node, depth = 0) {
    if (!node) return { x: 0, y: 0 };

    const y = 45 + depth * levelHeight;

    if (node.type !== 'BinaryOp' || (!node.left && !node.right)) {
      // Leaf node: allocate a new horizontal slot
      const x = nextX;
      nextX += nodeRadius * 2 + horizontalGap;
      const layoutNode = {
        id: node.id,
        type: node.type,
        label: node.value || node.name || '',
        operator: node.operator || null,
        x,
        y,
        depth,
        raw: node
      };
      nodes.push(layoutNode);
      return layoutNode;
    }

    // Binary Operator parent node
    const leftLayout = assignCoordinates(node.left, depth + 1);
    const rightLayout = assignCoordinates(node.right, depth + 1);

    // Center parent horizontally between left and right children
    const x = (leftLayout.x + rightLayout.x) / 2;

    const layoutNode = {
      id: node.id,
      type: node.type,
      label: node.operator,
      operator: node.operator,
      x,
      y,
      depth,
      raw: node
    };

    nodes.push(layoutNode);

    // Create directed connection links
    links.push({
      id: `link_${node.id}_to_${leftLayout.id}`,
      source: { x, y },
      target: { x: leftLayout.x, y: leftLayout.y },
      childId: leftLayout.id,
      parentId: node.id,
      side: 'left'
    });

    links.push({
      id: `link_${node.id}_to_${rightLayout.id}`,
      source: { x, y },
      target: { x: rightLayout.x, y: rightLayout.y },
      childId: rightLayout.id,
      parentId: node.id,
      side: 'right'
    });

    return layoutNode;
  }

  assignCoordinates(root, 0);

  // Normalize bounding box coordinates
  const minX = Math.min(...nodes.map(n => n.x)) - nodeRadius - 30;
  const maxX = Math.max(...nodes.map(n => n.x)) + nodeRadius + 30;
  const maxY = Math.max(...nodes.map(n => n.y)) + nodeRadius + 40;

  // Shift nodes so minX starts at margin
  const shiftX = minX < 20 ? 20 - minX : 0;
  if (shiftX !== 0) {
    nodes.forEach(n => { n.x += shiftX; });
    links.forEach(l => {
      l.source.x += shiftX;
      l.target.x += shiftX;
    });
  }

  const calculatedWidth = Math.max(500, maxX + shiftX + 20);
  const calculatedHeight = Math.max(220, maxY + 20);

  return {
    nodes,
    links,
    width: calculatedWidth,
    height: calculatedHeight
  };
}
