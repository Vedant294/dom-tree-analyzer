import { buildTree } from '../utils/buildTree';
import { dfsAnalyze } from '../utils/dfsAnalyzer';
import { convertToBinaryTree } from '../utils/binaryTreeConverter';
import { analyzeOptimizations } from '../utils/optimizer';
import type { WorkerMessage, WorkerResponse } from '../types/treeTypes';

self.onmessage = (event: MessageEvent<WorkerMessage>) => {
  try {
    const { code, language } = event.data;
    const tree = buildTree(code, language);
    const dfs = dfsAnalyze(tree);
    const binaryTree = convertToBinaryTree(tree);
    const optimization = analyzeOptimizations(tree, dfs.maxDepth);

    const response: WorkerResponse = {
      success: true,
      result: { tree, binaryTree, dfs, optimization },
    };

    self.postMessage(response);
  } catch (e: unknown) {
    const msg = e instanceof Error ? e.message : 'An unknown error occurred.';
    const response: WorkerResponse = { success: false, error: msg };
    self.postMessage(response);
  }
};
