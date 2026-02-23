import * as parser from '@babel/parser';
import type { TreeNode } from '../types/treeTypes';

let nodeCounter = 0;

function generateId(): string {
  return `node-${nodeCounter++}`;
}

interface ASTNode {
  type: string;
  openingElement?: { name: { type: string; name?: string; property?: { name: string }; object?: { name: string } } };
  children?: ASTNode[];
  expression?: ASTNode;
}

function getTagName(node: ASTNode): string {
  if (node.type === 'JSXFragment') return 'Fragment';
  if (!node.openingElement) return 'unknown';
  const nameNode = node.openingElement.name;
  if (nameNode.type === 'JSXIdentifier') return nameNode.name || 'unknown';
  if (nameNode.type === 'JSXMemberExpression') {
    return `${nameNode.object?.name || ''}.${nameNode.property?.name || ''}`;
  }
  return 'unknown';
}

function astToTreeNode(node: ASTNode, depth: number = 0): TreeNode | null {
  if (node.type === 'JSXElement' || node.type === 'JSXFragment') {
    const tag = getTagName(node);
    const children: TreeNode[] = [];

    if (node.children) {
      for (const child of node.children) {
        if (child.type === 'JSXElement' || child.type === 'JSXFragment') {
          const treeChild = astToTreeNode(child, depth + 1);
          if (treeChild) children.push(treeChild);
        } else if (child.type === 'JSXExpressionContainer' && child.expression) {
          const treeChild = astToTreeNode(child.expression, depth + 1);
          if (treeChild) children.push(treeChild);
        }
      }
    }

    return {
      id: generateId(),
      tag,
      children,
      depth,
    };
  }
  return null;
}

export function parseJsx(code: string, isTsx: boolean = false): TreeNode {
  nodeCounter = 0;

  let ast;
  try {
    ast = parser.parse(code, {
      sourceType: 'module',
      plugins: ['jsx', ...(isTsx ? (['typescript'] as const) : [])],
      errorRecovery: true,
    });
  } catch (e: unknown) {
    const msg = e instanceof Error ? e.message : 'Unknown parse error';
    throw new Error(`JSX/TSX parse error: ${msg}`);
  }

  const jsxRoots: TreeNode[] = [];

  function walk(node: Record<string, unknown>) {
    if (!node || typeof node !== 'object') return;
    const n = node as unknown as ASTNode;
    if (n.type === 'JSXElement' || n.type === 'JSXFragment') {
      const treeNode = astToTreeNode(n);
      if (treeNode) jsxRoots.push(treeNode);
      return; // don't walk deeper, already handled
    }
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

  if (jsxRoots.length === 1) return jsxRoots[0];

  return {
    id: generateId(),
    tag: 'root',
    children: jsxRoots,
    depth: 0,
  };
}
