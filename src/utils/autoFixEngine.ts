// ============================================================
// autoFixEngine.ts — Applies optimization fixes to source code
// Works on both HTML (DOM manipulation) and JSX (Babel AST)
// ============================================================

import { Language } from '../types/treeTypes';
import * as parser from '@babel/parser';
import traverse from '@babel/traverse';
import * as t from '@babel/types';
// @ts-ignore
import generate from '@babel/generator';

// Tags that are safe to remove if they are redundant wrappers
const WRAPPER_TAGS = new Set(['div', 'span', 'section', 'article', 'main', 'aside', 'header', 'footer', 'nav']);

// Entry point: routes to HTML or JSX optimizer based on language
export function applyOptimizations(code: string, language: Language): string {
  try {
    if (language === 'html') {
      return optimizeHtml(code);
    } else {
      return optimizeJsx(code, language === 'tsx');
    }
  } catch (err) {
    console.error("Auto-fix failed:", err);
    return code; // Fallback: return original code if anything goes wrong
  }
}

// HTML optimizer — uses browser DOM manipulation
// Iteratively removes redundant wrapper elements until no more changes
function optimizeHtml(html: string): string {
  const domParser = new DOMParser();
  const doc = domParser.parseFromString(html, 'text/html');

  let madeChanges = true;
  // Keep looping until no more optimizations can be applied
  while (madeChanges) {
    madeChanges = false;
    const elements = Array.from(doc.body.querySelectorAll('*'));

    for (const el of elements) {
      if (!el.parentElement) continue;
      
      const tag = el.tagName.toLowerCase();
      if (!WRAPPER_TAGS.has(tag)) continue; // Only process wrapper tags

      const elementChildren = Array.from(el.children);
      // Check if element has any meaningful text content
      const hasSignificantText = Array.from(el.childNodes).some(
        node => node.nodeType === Node.TEXT_NODE && node.textContent?.trim() !== ''
      );

      if (elementChildren.length === 1 && !hasSignificantText) {
        const child = elementChildren[0];
        const childTag = child.tagName.toLowerCase();
        const hasNoAttributes = el.attributes.length === 0;
        
        // Remove if: no attributes (single-child-wrapper) OR same tag as child (redundant-wrapper)
        if (hasNoAttributes || tag === childTag) {
          if (tag === childTag) {
            // Merge parent attributes into child before removing parent
            Array.from(el.attributes).forEach(attr => {
              if (!child.hasAttribute(attr.name)) {
                child.setAttribute(attr.name, attr.value);
              }
            });
          }
          el.replaceWith(child); // Replace parent with child in the DOM
          madeChanges = true;
          break; // Restart loop since DOM structure changed
        }
      }
    }
  }

  return doc.body.innerHTML;
}

// JSX optimizer — uses Babel AST traversal
// Iteratively removes redundant JSX wrapper elements
function optimizeJsx(code: string, isTsx: boolean): string {
  // Step 1: Parse JSX/TSX into a Babel AST
  const ast = parser.parse(code, {
    sourceType: 'module',
    plugins: ['jsx', ...(isTsx ? (['typescript'] as const) : [])],
  });

  let madeChanges = true;
  // Keep traversing until no more changes are made
  while (madeChanges) {
    madeChanges = false;
    // @ts-ignore - traverse might have different export signature depending on environment
    const traverseFn = traverse.default || traverse;
    
    // Walk every JSXElement node in the AST
    traverseFn(ast, {
      JSXElement(path: any) {
        const node = path.node;
        const opening = node.openingElement;
        if (t.isJSXIdentifier(opening.name)) {
          const tag = opening.name.name;
          if (!WRAPPER_TAGS.has(tag)) return; // Skip non-wrapper tags

          // Filter out whitespace-only text nodes to find real children
          const elementChildren = node.children.filter((c: any) => 
            t.isJSXElement(c) || t.isJSXExpressionContainer(c) || 
            (t.isJSXText(c) && c.value.trim() !== '')
          );

          if (elementChildren.length === 1 && t.isJSXElement(elementChildren[0])) {
            const childElement = elementChildren[0];
            const childOpening = childElement.openingElement;
            const childTag = t.isJSXIdentifier(childOpening.name) ? childOpening.name.name : '';

            const hasNoAttributes = opening.attributes.length === 0;
            if (hasNoAttributes || tag === childTag) {
              if (tag === childTag) {
                // Merge parent attributes into child (avoid duplicates)
                opening.attributes.forEach((attr: any) => {
                  const existing = childOpening.attributes.find((ca: any) => 
                    ca.name && attr.name && ca.name.name === attr.name.name
                  );
                  if (!existing) {
                    childOpening.attributes.push(attr);
                  }
                });
              }
              // Replace the wrapper JSX element with its child in the AST
              path.replaceWith(childElement);
              madeChanges = true;
              path.stop(); // Stop traversal and restart (AST was mutated)
            }
          }
        }
      }
    });
  }

  // Step 2: Convert the modified AST back to source code string
  // @ts-ignore
  const generateFn = generate.default || generate;
  const output = generateFn(ast, { retainLines: false }, code);
  return output.code;
}
