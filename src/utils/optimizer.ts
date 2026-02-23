import { TreeNode, OptimizationResult, OptimizationSuggestion } from '../types/treeTypes';

const WRAPPER_TAGS = new Set(['div', 'span', 'section', 'article', 'main', 'aside', 'header', 'footer', 'nav']);
const DEPTH_THRESHOLD = 10;

export function analyzeOptimizations(root: TreeNode, maxDepth: number): OptimizationResult {
  const suggestions: OptimizationSuggestion[] = [];

  function walk(node: TreeNode, path: string[]) {
    const currentPath = [...path, node.tag];

    // Detect single-child wrapper with no attributes
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

    // Detect chains: parent and child same tag
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

    // Deep nesting warning
    if ((node.depth ?? 0) >= DEPTH_THRESHOLD && node.children.length > 0) {
      suggestions.push({
        type: 'deep-nesting',
        path: currentPath,
        description: `Nesting depth ${node.depth} exceeds threshold of ${DEPTH_THRESHOLD}. Consider flattening or extracting components.`,
        depthReduction: Math.max(1, (node.depth ?? 0) - DEPTH_THRESHOLD),
      });
    }

    for (const child of node.children) {
      walk(child, currentPath);
    }
  }

  walk(root, []);

  // Deduplicate deep-nesting (keep only first)
  const seen = new Set<string>();
  const deduped = suggestions.filter((s) => {
    if (s.type === 'deep-nesting') {
      const key = s.path.join('/');
      if (seen.has(key)) return false;
      seen.add(key);
    }
    return true;
  });

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
