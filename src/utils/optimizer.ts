// ============================================================
// optimizer.ts — Analyzes the tree for DOM structure issues
// Detects 3 types of problems and estimates depth savings
// ============================================================

import { TreeNode, OptimizationResult, OptimizationSuggestion } from '../types/treeTypes';

// Tags considered "wrapper" elements (structural, not semantic content)
const WRAPPER_TAGS = new Set(['div', 'span', 'section', 'article', 'main', 'aside', 'header', 'footer', 'nav']);

// Nesting deeper than this is flagged as a performance concern
const DEPTH_THRESHOLD = 10;

// Main export: walks the tree and collects all optimization suggestions
export function analyzeOptimizations(root: TreeNode, maxDepth: number): OptimizationResult {
  const suggestions: OptimizationSuggestion[] = [];

  // Recursive walker — visits every node in the tree
  function walk(node: TreeNode, path: string[]) {
    const currentPath = [...path, node.tag];

    // Issue 1: Single-child wrapper with no attributes
    // e.g. <div><p>text</p></div> — the div adds no value
    if (
      node.children.length === 1 &&
      WRAPPER_TAGS.has(node.tag) &&
      (!node.attributes || Object.keys(node.attributes).length === 0)
    ) {
      suggestions.push({
        type: 'single-child-wrapper',
        path: currentPath,
        description: `<${node.tag}> wraps only <${node.children[0].tag}> and has no attributes. It can be removed.`,
        depthReduction: 1,
      });
    }

    // Issue 2: Redundant wrapper — same tag nested inside itself
    // e.g. <div><div>...</div></div>
    if (
      node.children.length === 1 &&
      node.tag === node.children[0].tag &&
      WRAPPER_TAGS.has(node.tag)
    ) {
      suggestions.push({
        type: 'redundant-wrapper',
        path: currentPath,
        description: `Redundant nested <${node.tag}> → <${node.tag}>. Consider merging into a single element.`,
        depthReduction: 1,
      });
    }

    // Issue 3: Deep nesting — node is beyond the depth threshold
    if ((node.depth ?? 0) >= DEPTH_THRESHOLD && node.children.length > 0) {
      suggestions.push({
        type: 'deep-nesting',
        path: currentPath,
        description: `Nesting depth ${node.depth} exceeds threshold of ${DEPTH_THRESHOLD}. Consider flattening or extracting components.`,
        depthReduction: Math.max(1, (node.depth ?? 0) - DEPTH_THRESHOLD),
      });
    }

    // Continue walking into children
    for (const child of node.children) {
      walk(child, currentPath);
    }
  }

  walk(root, []);

  // Remove duplicate deep-nesting entries for the same path
  const seen = new Set<string>();
  const deduped = suggestions.filter((s) => {
    if (s.type === 'deep-nesting') {
      const key = s.path.join('/');
      if (seen.has(key)) return false;
      seen.add(key);
    }
    return true;
  });

  // Calculate estimated depth reduction as a percentage
  const totalReduction = deduped.reduce((sum, s) => sum + s.depthReduction, 0);
  const estimatedReduction = maxDepth > 0 ? Math.min(Math.round((totalReduction / maxDepth) * 100), 100) : 0;
  const optimizedDepth = Math.max(1, maxDepth - totalReduction);

  return {
    suggestions: deduped,
    estimatedDepthReduction: estimatedReduction,
    originalDepth: maxDepth,
    optimizedDepth,
    summary:
      deduped.length === 0
        ? 'Your DOM structure looks clean! No obvious optimizations detected.'
        : `Found ${deduped.length} optimization${deduped.length > 1 ? 's' : ''} that could reduce depth from ${maxDepth} to ~${optimizedDepth} (${estimatedReduction}% reduction).`,
  };
}
