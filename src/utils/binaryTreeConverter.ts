// ============================================================
// binaryTreeConverter.ts — Converts N-ary tree → Binary tree
// Uses the Left-Child / Right-Sibling algorithm
// ============================================================

import { TreeNode, BinaryNode } from '../types/treeTypes';

// Counter for unique binary node IDs
let bnCounter = 0;

// Entry point: resets counter and starts conversion from root
export function convertToBinaryTree(root: TreeNode): BinaryNode {
  bnCounter = 0;
  return convert(root);
}

// Recursively converts a TreeNode (N-ary) into a BinaryNode
// Algorithm:
//   - Left child  = first child of this node
//   - Right child = next sibling (chained via right pointers)
function convert(node: TreeNode): BinaryNode {
  const binaryNode: BinaryNode = {
    id: `bn-${bnCounter++}`,
    tag: node.tag,
  };

  if (node.children.length > 0) {
    // Left = first child
    binaryNode.left = convert(node.children[0]);

    // Chain remaining siblings as right children of the first child
    // e.g. children [A, B, C] → left=A, A.right=B, B.right=C
    let current = binaryNode.left;
    for (let i = 1; i < node.children.length; i++) {
      current.right = convert(node.children[i]);
      current = current.right;
    }
  }

  return binaryNode;
}
