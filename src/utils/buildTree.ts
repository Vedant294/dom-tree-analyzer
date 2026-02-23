import { TreeNode, Language } from '../types/treeTypes';
import { parseHtml } from './parseHtml';
import { parseJsx } from './parseJsx';

export function buildTree(code: string, language: Language): TreeNode {
  const trimmed = code.trim();
  if (!trimmed) {
    throw new Error('Input is empty. Please provide HTML or JSX code.');
  }

  switch (language) {
    case 'html':
      return parseHtml(trimmed);
    case 'jsx':
      return parseJsx(trimmed, false);
    case 'tsx':
      return parseJsx(trimmed, true);
    default:
      throw new Error(`Unsupported language: ${language}`);
  }
}
