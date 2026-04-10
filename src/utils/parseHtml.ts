// ============================================================
// parseHtml.ts — Converts raw HTML string into a TreeNode
// Uses the browser's built-in DOMParser API
// ============================================================

import { TreeNode } from '../types/treeTypes';

// Counter to generate unique IDs for each node (e.g. "node-0", "node-1")
let nodeCounter = 0;

function generateId(): string {
  return `node-${nodeCounter++}`;
}

// Recursively converts a DOM Element into our TreeNode structure
// depth tracks how deep we are from the root
function domToTreeNode(element: Element, depth: number = 0): TreeNode {
  // Extract all HTML attributes (class, id, href, etc.) into a plain object
  const attributes: Record<string, string> = {};
  for (const attr of Array.from(element.attributes)) {
    attributes[attr.name] = attr.value;
  }

  // Recursively process all child elements (not text nodes)
  const children: TreeNode[] = [];
  for (const child of Array.from(element.children)) {
    children.push(domToTreeNode(child, depth + 1));
  }

  return {
    id: generateId(),
    tag: element.tagName.toLowerCase(), // e.g. "DIV" → "div"
    children,
    depth,
    attributes: Object.keys(attributes).length > 0 ? attributes : undefined,
  };
}

// Main export: parses an HTML string and returns the root TreeNode
export function parseHtml(html: string): TreeNode {
  nodeCounter = 0; // Reset counter for each new parse

  // Use browser's DOMParser to convert HTML string into a real DOM document
  const parser = new DOMParser();
  const doc = parser.parseFromString(html, 'text/html');

  const body = doc.body;
  if (!body || body.children.length === 0) {
    throw new Error('No valid HTML elements found. Please provide valid HTML markup.');
  }

  // If there's only one root element, return it directly
  if (body.children.length === 1) {
    return domToTreeNode(body.children[0]);
  }

  // If there are multiple root elements, wrap them in a virtual "root" node
  const root: TreeNode = {
    id: generateId(),
    tag: 'root',
    children: Array.from(body.children).map((child) => domToTreeNode(child, 1)),
    depth: 0,
  };

  return root;
}
