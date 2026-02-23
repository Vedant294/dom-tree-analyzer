export interface TreeNode {
  id: string;
  tag: string;
  children: TreeNode[];
  depth?: number;
  attributes?: Record<string, string>;
}

export interface BinaryNode {
  id: string;
  tag: string;
  left?: BinaryNode;
  right?: BinaryNode;
}

export interface DFSResult {
  maxDepth: number;
  totalNodes: number;
  averageDepth: number;
  depthSum: number;
  deepestPath: string[];
}

export interface OptimizationSuggestion {
  type: 'redundant-wrapper' | 'deep-nesting' | 'single-child-wrapper';
  path: string[];
  description: string;
  depthReduction: number;
}

export interface OptimizationResult {
  suggestions: OptimizationSuggestion[];
  estimatedDepthReduction: number;
  originalDepth: number;
  optimizedDepth: number;
  summary: string;
}

export interface AnalysisResult {
  tree: TreeNode;
  binaryTree: BinaryNode;
  dfs: DFSResult;
  optimization: OptimizationResult;
}

export type Language = 'html' | 'jsx' | 'tsx';

export interface WorkerMessage {
  code: string;
  language: Language;
}

export interface WorkerResponse {
  success: boolean;
  result?: AnalysisResult;
  error?: string;
}
