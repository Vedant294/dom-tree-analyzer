import { TreeNode, BinaryNode } from '../types/treeTypes';

let bnCounter = 0;

export function convertToBinaryTree(root: TreeNode): BinaryNode {
  bnCounter = 0;
  return convert(root);
}

function convert(node: TreeNode): BinaryNode {
  const binaryNode: BinaryNode = {
    id: `bn-${bnCounter++}`,
    tag: node.tag,
  };

  // Left child = first child
  if (node.children.length > 0) {
    binaryNode.left = convert(node.children[0]);

    // Chain siblings as right children
    let current = binaryNode.left;
    for (let i = 1; i < node.children.length; i++) {
      current.right = convert(node.children[i]);
      current = current.right;
    }
  }

  return binaryNode;
}
