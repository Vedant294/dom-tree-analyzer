// ============================================================
// treeTypes.ts — Central type definitions for the entire app
// All data structures used across parsing, analysis, and UI
// ============================================================

// Represents a single node in the N-ary DOM tree
// Each HTML/JSX element becomes one TreeNode
export interface TreeNode {
  id: string;                          // Unique identifier (e.g. "node-0")
  tag: string;                         // HTML tag or component name (e.g. "div", "Button")
  children: TreeNode[];                // All child elements (N-ary: can have many children)
  depth?: number;                      // How deep this node is from the root
  attributes?: Record<string, string>; // HTML attributes like class, id, href
}

// Represents a node in the Binary Tree (converted from N-ary)
// Uses Left-Child / Right-Sibling representation
export interface BinaryNode {
  id: string;
  tag: string;
  left?: BinaryNode;   // Left = first child of this node
  right?: BinaryNode;  // Right = next sibling of this node
}

// Result of running DFS (Depth First Search) on the tree
export interface DFSResult {
  maxDepth: number;        // Deepest level in the tree
  totalNodes: number;      // Total number of elements
  averageDepth: number;    // Mean depth across all nodes
  depthSum: number;        // Sum of all node depths (used to calculate average)
  deepestPath: string[];   // Array of tags from root to deepest node
}

// A single optimization issue found in the DOM tree
export interface OptimizationSuggestion {
  type: 'redundant-wrapper' | 'deep-nesting' | 'single-child-wrapper'; // Issue category
  path: string[];          // Path of tags leading to the problematic node
  description: string;     // Human-readable explanation of the issue
  depthReduction: number;  // How many depth levels could be saved by fixing this
}

// Full result of the optimization analysis
export interface OptimizationResult {
  suggestions: OptimizationSuggestion[]; // List of all detected issues
  estimatedDepthReduction: number;       // % depth reduction if all fixes applied
  originalDepth: number;                 // Current max depth
  optimizedDepth: number;                // Estimated depth after fixes
  summary: string;                       // Human-readable summary message
}

// The complete analysis result passed to the UI after all processing
export interface AnalysisResult {
  tree: TreeNode;                  // The N-ary DOM tree
  binaryTree: BinaryNode;          // Binary tree conversion of the DOM tree
  dfs: DFSResult;                  // Metrics from DFS traversal
  optimization: OptimizationResult; // Optimization suggestions
  code: string;                    // Original input code (for diff modal)
  language: Language;              // Which language was parsed
}

// Supported input languages
export type Language = 'html' | 'jsx' | 'tsx';

// Message sent TO the Web Worker
export interface WorkerMessage {
  code: string;
  language: Language;
}

// Response received FROM the Web Worker
export interface WorkerResponse {
  success: boolean;
  result?: AnalysisResult; // Present if success = true
  error?: string;          // Present if success = false
}
