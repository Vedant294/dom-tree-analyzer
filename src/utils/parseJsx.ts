// ============================================================
// parseJsx.ts — Converts JSX/TSX code into a TreeNode
// Uses Babel parser to generate an AST, then walks it
// ============================================================

import * as parser from '@babel/parser';
import type { TreeNode } from '../types/treeTypes';

// Counter for unique node IDs
let nodeCounter = 0;

function generateId(): string {
  return `node-${nodeCounter++}`;
}

// Internal type representing a Babel AST node (simplified)
interface ASTNode {
  type: string;
  openingElement?: { name: { type: string; name?: string; property?: { name: string }; object?: { name: string } } };
  children?: ASTNode[];
  expression?: ASTNode;
}

// Extracts the tag name from a JSX AST node
// Handles: <div>, <MyComponent>, <Component.Sub>, <>Fragment</>
function getTagName(node: ASTNode): string {
  if (node.type === 'JSXFragment') return 'Fragment';
  if (!node.openingElement) return 'unknown';
  const nameNode = node.openingElement.name;
  if (nameNode.type === 'JSXIdentifier') return nameNode.name || 'unknown';
  // Handle member expressions like <Component.Sub>
  if (nameNode.type === 'JSXMemberExpression') {
    return `${nameNode.object?.name || ''}.${nameNode.property?.name || ''}`;
  }
  return 'unknown';
}

// Recursively converts a Babel JSX AST node into our TreeNode structure
function astToTreeNode(node: ASTNode, depth: number = 0): TreeNode | null {
  if (node.type === 'JSXElement' || node.type === 'JSXFragment') {
    const tag = getTagName(node);
    const children: TreeNode[] = [];

    if (node.children) {
      for (const child of node.children) {
        // Only process JSX elements and fragments (skip text nodes, comments)
        if (child.type === 'JSXElement' || child.type === 'JSXFragment') {
          const treeChild = astToTreeNode(child, depth + 1);
          if (treeChild) children.push(treeChild);
        } else if (child.type === 'JSXExpressionContainer' && child.expression) {
          // Handle {expression} containers that contain JSX
          const treeChild = astToTreeNode(child.expression, depth + 1);
          if (treeChild) children.push(treeChild);
        }
      }
    }

    return { id: generateId(), tag, children, depth };
  }
  return null;
}

// Main export: parses JSX/TSX code string and returns root TreeNode
// isTsx = true enables TypeScript plugin in Babel
export function parseJsx(code: string, isTsx: boolean = false): TreeNode {
  nodeCounter = 0;

  let ast;
  try {
    // Step 1: Parse code into a Babel AST
    ast = parser.parse(code, {
      sourceType: 'module',
      plugins: ['jsx', ...(isTsx ? (['typescript'] as const) : [])],
      errorRecovery: true, // Don't crash on minor syntax errors
    });
  } catch (e: unknown) {
    const msg = e instanceof Error ? e.message : 'Unknown parse error';
    throw new Error(`JSX/TSX parse error: ${msg}`);
  }

  const jsxRoots: TreeNode[] = [];

  // Step 2: Walk the entire AST to find all top-level JSX elements
  function walk(node: Record<string, unknown>) {
    if (!node || typeof node !== 'object') return;
    const n = node as unknown as ASTNode;

    // When we find a JSX element, convert it and stop walking deeper
    if (n.type === 'JSXElement' || n.type === 'JSXFragment') {
      const treeNode = astToTreeNode(n);
      if (treeNode) jsxRoots.push(treeNode);
      return;
    }

    // Otherwise keep walking all child properties
    for (const key of Object.keys(node)) {
      const val = node[key];
      if (Array.isArray(val)) {
        val.forEach((item) => {
          if (item && typeof item === 'object') walk(item as Record<string, unknown>);
        });
      } else if (val && typeof val === 'object') {
        walk(val as Record<string, unknown>);
      }
    }
  }

  walk(ast as unknown as Record<string, unknown>);

  if (jsxRoots.length === 0) {
    throw new Error('No JSX elements found in the code.');
  }

  // Single root → return directly
  if (jsxRoots.length === 1) return jsxRoots[0];

  // Multiple roots → wrap in virtual root node
  return {
    id: generateId(),
    tag: 'root',
    children: jsxRoots,
    depth: 0,
  };
}
