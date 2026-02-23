import React from 'react';
import { motion } from 'framer-motion';
import type { DFSResult } from '../types/treeTypes';

interface MetricsPanelProps {
  dfs: DFSResult;
}

const MetricCard: React.FC<{ label: string; value: string | number; icon: string; delay: number }> = ({
  label,
  value,
  icon,
  delay,
}) => (
  <motion.div
    initial={{ opacity: 0, scale: 0.9 }}
    animate={{ opacity: 1, scale: 1 }}
    transition={{ delay, duration: 0.3 }}
    className="glass-card rounded-lg p-5 neon-border hover:neon-glow transition-shadow"
  >
    <div className="flex items-center gap-3 mb-2">
      <span className="text-2xl" role="img" aria-label={label}>{icon}</span>
      <span className="text-sm text-muted-foreground font-medium">{label}</span>
    </div>
    <p className="text-3xl font-bold gradient-text">{value}</p>
  </motion.div>
);

const MetricsPanel: React.FC<MetricsPanelProps> = ({ dfs }) => {
  return (
    <div className="space-y-4">
      <h2 className="text-lg font-semibold text-foreground">Analysis Metrics</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        <MetricCard label="Total Nodes" value={dfs.totalNodes} icon="🔢" delay={0} />
        <MetricCard label="Max Depth" value={dfs.maxDepth} icon="📏" delay={0.1} />
        <MetricCard label="Average Depth" value={dfs.averageDepth} icon="📊" delay={0.2} />
      </div>

      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="glass-card rounded-lg p-5 neon-border"
      >
        <h3 className="text-sm font-medium text-muted-foreground mb-3">🛤️ Deepest Path</h3>
        <div className="flex flex-wrap items-center gap-1">
          {dfs.deepestPath.map((tag, i) => (
            <React.Fragment key={i}>
              <span className="px-2 py-1 rounded-md bg-primary/10 text-primary text-sm font-mono">
                &lt;{tag}&gt;
              </span>
              {i < dfs.deepestPath.length - 1 && (
                <span className="text-muted-foreground text-xs">→</span>
              )}
            </React.Fragment>
          ))}
        </div>
      </motion.div>
    </div>
  );
};

export default MetricsPanel;
