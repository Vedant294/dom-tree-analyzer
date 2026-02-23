import React, { useState } from 'react';
import { motion } from 'framer-motion';
import type { TreeNode } from '../types/treeTypes';

interface TreeViewProps {
  tree: TreeNode;
  title: string;
}

const TreeNodeView: React.FC<{ node: TreeNode; level: number }> = ({ node, level }) => {
  const [expanded, setExpanded] = useState(level < 4);
  const hasChildren = node.children.length > 0;

  return (
    <div className="ml-4" role="treeitem" aria-expanded={expanded}>
      <button
        onClick={() => hasChildren && setExpanded(!expanded)}
        className={`flex items-center gap-2 py-1 text-sm font-mono hover:text-primary transition-colors ${
          hasChildren ? 'cursor-pointer' : 'cursor-default'
        }`}
        aria-label={`${node.tag} node${hasChildren ? `, ${expanded ? 'collapse' : 'expand'}` : ''}`}
      >
        {hasChildren && (
          <span className={`text-muted-foreground transition-transform text-xs ${expanded ? 'rotate-90' : ''}`}>
            ▶
          </span>
        )}
        {!hasChildren && <span className="text-xs text-muted-foreground/30 w-3">•</span>}
        <span className="text-accent">&lt;</span>
        <span className="text-secondary">{node.tag}</span>
        <span className="text-accent">&gt;</span>
        {hasChildren && (
          <span className="text-muted-foreground text-xs">({node.children.length})</span>
        )}
      </button>
      {expanded && hasChildren && (
        <div role="group">
          {node.children.map((child) => (
            <TreeNodeView key={child.id} node={child} level={level + 1} />
          ))}
        </div>
      )}
    </div>
  );
};

const TreeView: React.FC<TreeViewProps> = ({ tree, title }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="glass-card rounded-lg p-5 neon-border"
    >
      <h2 className="text-lg font-semibold text-foreground mb-4">{title}</h2>
      <div className="max-h-96 overflow-auto scrollbar-thin" role="tree" aria-label={title}>
        <TreeNodeView node={tree} level={0} />
      </div>
    </motion.div>
  );
};

export default TreeView;
