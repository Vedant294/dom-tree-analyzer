import { TreeNode, DFSResult } from '../types/treeTypes';

export function dfsAnalyze(root: TreeNode): DFSResult {
  let maxDepth = 0;
  let totalNodes = 0;
  let depthSum = 0;
  let deepestPath: string[] = [];

  function dfs(node: TreeNode, depth: number, path: string[]) {
    totalNodes++;
    depthSum += depth;
    const currentPath = [...path, node.tag];

    if (depth > maxDepth) {
      maxDepth = depth;
      deepestPath = currentPath;
    }

    for (const child of node.children) {
      dfs(child, depth + 1, currentPath);
    }
  }

  dfs(root, 0, []);

  return {
    maxDepth,
    totalNodes,
    depthSum,
    averageDepth: totalNodes > 0 ? Math.round((depthSum / totalNodes) * 100) / 100 : 0,
    deepestPath,
  };
}
