import React, { useState } from 'react';
import { motion } from 'framer-motion';
import type { BinaryNode } from '../types/treeTypes';

interface BinaryTreeViewProps {
  tree: BinaryNode;
}

const BinaryNodeView: React.FC<{ node: BinaryNode; level: number; relation?: string }> = ({
  node,
  level,
  relation,
}) => {
  const [expanded, setExpanded] = useState(level < 5);
  const hasChildren = !!(node.left || node.right);

  return (
    <div className="ml-4" role="treeitem" aria-expanded={expanded}>
      <button
        onClick={() => hasChildren && setExpanded(!expanded)}
        className={`flex items-center gap-2 py-1 text-sm font-mono hover:text-primary transition-colors ${
          hasChildren ? 'cursor-pointer' : 'cursor-default'
        }`}
      >
        {hasChildren && (
          <span className={`text-muted-foreground transition-transform text-xs ${expanded ? 'rotate-90' : ''}`}>
            ▶
          </span>
        )}
        {!hasChildren && <span className="text-xs text-muted-foreground/30 w-3">•</span>}
        {relation && (
          <span className={`text-xs px-1.5 py-0.5 rounded ${
            relation === 'L' ? 'bg-primary/15 text-primary' : 'bg-accent/15 text-accent'
          }`}>
            {relation === 'L' ? 'child' : 'sibling'}
          </span>
        )}
        <span className="text-secondary">{node.tag}</span>
      </button>
      {expanded && hasChildren && (
        <div role="group">
          {node.left && <BinaryNodeView node={node.left} level={level + 1} relation="L" />}
          {node.right && <BinaryNodeView node={node.right} level={level + 1} relation="R" />}
        </div>
      )}
    </div>
  );
};

const BinaryTreeView: React.FC<BinaryTreeViewProps> = ({ tree }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="glass-card rounded-lg p-5 neon-border"
    >
      <h2 className="text-lg font-semibold text-foreground mb-2">Binary Tree View</h2>
      <p className="text-xs text-muted-foreground mb-4">
        Left = First Child &nbsp;|&nbsp; Right = Next Sibling
      </p>
      <div className="max-h-96 overflow-auto scrollbar-thin" role="tree" aria-label="Binary tree">
        <BinaryNodeView node={tree} level={0} />
      </div>
    </motion.div>
  );
};

export default BinaryTreeView;
