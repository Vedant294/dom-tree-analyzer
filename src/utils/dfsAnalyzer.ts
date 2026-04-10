// ============================================================
// dfsAnalyzer.ts — Runs Depth First Search on the TreeNode
// Calculates all metrics shown in the MetricsPanel
// ============================================================

import { TreeNode, DFSResult } from '../types/treeTypes';

// Traverses the entire tree using DFS and collects metrics
export function dfsAnalyze(root: TreeNode): DFSResult {
  let maxDepth = 0;
  let totalNodes = 0;
  let depthSum = 0;
  let deepestPath: string[] = []; // Tags from root → deepest node

  // Recursive DFS function
  // node = current node, depth = current level, path = tags visited so far
  function dfs(node: TreeNode, depth: number, path: string[]) {
    totalNodes++;           // Count every node we visit
    depthSum += depth;      // Accumulate depth for average calculation
    const currentPath = [...path, node.tag]; // Build path as we go deeper

    // Track the deepest point found so far
    if (depth > maxDepth) {
      maxDepth = depth;
      deepestPath = currentPath;
    }

    // Recurse into all children (N-ary: could be many)
    for (const child of node.children) {
      dfs(child, depth + 1, currentPath);
    }
  }

  // Start DFS from root at depth 0
  dfs(root, 0, []);

  return {
    maxDepth,
    totalNodes,
    depthSum,
    // Round average to 2 decimal places
    averageDepth: totalNodes > 0 ? Math.round((depthSum / totalNodes) * 100) / 100 : 0,
    deepestPath,
  };
}
