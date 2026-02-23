import { TreeNode } from '../types/treeTypes';

let nodeCounter = 0;

function generateId(): string {
  return `node-${nodeCounter++}`;
}

function domToTreeNode(element: Element, depth: number = 0): TreeNode {
  const attributes: Record<string, string> = {};
  for (const attr of Array.from(element.attributes)) {
    attributes[attr.name] = attr.value;
  }

  const children: TreeNode[] = [];
  for (const child of Array.from(element.children)) {
    children.push(domToTreeNode(child, depth + 1));
  }

  return {
    id: generateId(),
    tag: element.tagName.toLowerCase(),
    children,
    depth,
    attributes: Object.keys(attributes).length > 0 ? attributes : undefined,
  };
}

export function parseHtml(html: string): TreeNode {
  nodeCounter = 0;
  const parser = new DOMParser();
  const doc = parser.parseFromString(html, 'text/html');

  const body = doc.body;
  if (!body || body.children.length === 0) {
    throw new Error('No valid HTML elements found. Please provide valid HTML markup.');
  }

  if (body.children.length === 1) {
    return domToTreeNode(body.children[0]);
  }

  // Wrap multiple root elements
  const root: TreeNode = {
    id: generateId(),
    tag: 'root',
    children: Array.from(body.children).map((child) => domToTreeNode(child, 1)),
    depth: 0,
  };

  return root;
}
