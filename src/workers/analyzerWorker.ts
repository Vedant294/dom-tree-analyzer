// ============================================================
// analyzerWorker.ts — Web Worker for background processing
// Runs all heavy analysis off the main thread to keep UI smooth
// ============================================================

import { buildTree } from '../utils/buildTree';
import { dfsAnalyze } from '../utils/dfsAnalyzer';
import { convertToBinaryTree } from '../utils/binaryTreeConverter';
import { analyzeOptimizations } from '../utils/optimizer';
import type { WorkerMessage, WorkerResponse } from '../types/treeTypes';

// Listen for messages from the main thread (sent by Analyzer.tsx)
self.onmessage = (event: MessageEvent<WorkerMessage>) => {
  try {
    const { code, language } = event.data;

    // Step 1: Parse code into N-ary TreeNode structure
    const tree = buildTree(code, language);

    // Step 2: Run DFS to calculate depth metrics
    const dfs = dfsAnalyze(tree);

    // Step 3: Convert N-ary tree to binary tree (left-child/right-sibling)
    const binaryTree = convertToBinaryTree(tree);

    // Step 4: Analyze tree for optimization opportunities
    const optimization = analyzeOptimizations(tree, dfs.maxDepth);

    // Send successful result back to main thread
    const response: WorkerResponse = {
      success: true,
      result: { tree, binaryTree, dfs, optimization },
    };

    self.postMessage(response);
  } catch (e: unknown) {
    // Send error back to main thread if anything fails
    const msg = e instanceof Error ? e.message : 'An unknown error occurred.';
    const response: WorkerResponse = { success: false, error: msg };
    self.postMessage(response);
  }
};
