// ============================================================
// buildTree.ts — Entry point for all parsing
// Acts as a router: picks the right parser based on language
// ============================================================

import { TreeNode, Language } from '../types/treeTypes';
import { parseHtml } from './parseHtml';
import { parseJsx } from './parseJsx';

// Main function called by Analyzer.tsx to start the parsing pipeline
// Takes raw code string + language, returns a TreeNode (root of the tree)
export function buildTree(code: string, language: Language): TreeNode {
  const trimmed = code.trim();

  // Guard: reject empty input early
  if (!trimmed) {
    throw new Error('Input is empty. Please provide HTML or JSX code.');
  }

  // Route to the correct parser based on selected language
  switch (language) {
    case 'html':
      return parseHtml(trimmed);       // Uses browser's DOMParser
    case 'jsx':
      return parseJsx(trimmed, false); // Uses Babel parser, no TypeScript
    case 'tsx':
      return parseJsx(trimmed, true);  // Uses Babel parser, with TypeScript plugin
    default:
      throw new Error(`Unsupported language: ${language}`);
  }
}
