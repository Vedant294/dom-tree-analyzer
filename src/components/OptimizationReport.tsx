import React from 'react';
import { motion } from 'framer-motion';
import type { OptimizationResult } from '../types/treeTypes';

interface OptimizationReportProps {
  optimization: OptimizationResult;
}

const typeColors: Record<string, string> = {
  'redundant-wrapper': 'bg-destructive/15 text-destructive',
  'single-child-wrapper': 'bg-accent/15 text-accent',
  'deep-nesting': 'bg-primary/15 text-primary',
};

const typeLabels: Record<string, string> = {
  'redundant-wrapper': 'Redundant',
  'single-child-wrapper': 'Unnecessary Wrapper',
  'deep-nesting': 'Deep Nesting',
};

const OptimizationReport: React.FC<OptimizationReportProps> = ({ optimization }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="glass-card rounded-lg p-5 neon-border space-y-5"
    >
      <h2 className="text-lg font-semibold text-foreground">Optimization Report</h2>

      {/* Summary */}
      <div className="rounded-lg bg-primary/5 border border-primary/20 p-4">
        <p className="text-sm text-foreground">{optimization.summary}</p>
        {optimization.suggestions.length > 0 && (
          <div className="flex items-center gap-6 mt-3 text-sm">
            <div>
              <span className="text-muted-foreground">Before: </span>
              <span className="font-bold text-destructive">{optimization.originalDepth}</span>
            </div>
            <span className="text-muted-foreground">→</span>
            <div>
              <span className="text-muted-foreground">After: </span>
              <span className="font-bold text-secondary">~{optimization.optimizedDepth}</span>
            </div>
            <div className="ml-auto">
              <span className="gradient-text font-bold text-lg">-{optimization.estimatedDepthReduction}%</span>
            </div>
          </div>
        )}
      </div>

      {/* Suggestions */}
      {optimization.suggestions.length > 0 && (
        <div className="space-y-3 max-h-72 overflow-auto scrollbar-thin">
          {optimization.suggestions.map((s, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: i * 0.05 }}
              className="rounded-lg bg-background/50 border border-border p-3 space-y-2"
            >
              <div className="flex items-center gap-2">
                <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${typeColors[s.type]}`}>
                  {typeLabels[s.type]}
                </span>
                <span className="text-xs text-muted-foreground">-{s.depthReduction} depth</span>
              </div>
              <p className="text-sm text-foreground/80">{s.description}</p>
              <p className="text-xs font-mono text-muted-foreground">
                {s.path.join(' → ')}
              </p>
            </motion.div>
          ))}
        </div>
      )}
    </motion.div>
  );
};

export default OptimizationReport;
