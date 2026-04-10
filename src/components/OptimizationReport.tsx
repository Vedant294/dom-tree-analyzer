// ============================================================
// OptimizationReport.tsx — Shows detected issues + auto-fix
// Reads from OptimizationResult and triggers autoFixEngine
// ============================================================

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Loader2 } from 'lucide-react';
import type { OptimizationResult, Language } from '../types/treeTypes';
import CodeDiffModal from './CodeDiffModal';
import { applyOptimizations } from '../utils/autoFixEngine';

interface OptimizationReportProps {
  optimization: OptimizationResult;
  originalCode: string;
  language: Language;
}

// Maps issue type → badge color class
const typeColors: Record<string, string> = {
  'redundant-wrapper': 'bg-destructive/15 text-destructive',
  'single-child-wrapper': 'bg-accent/15 text-accent',
  'deep-nesting': 'bg-primary/15 text-primary',
};

// Maps issue type → human-readable label
const typeLabels: Record<string, string> = {
  'redundant-wrapper': 'Redundant',
  'single-child-wrapper': 'Unnecessary Wrapper',
  'deep-nesting': 'Deep Nesting',
};

const OptimizationReport: React.FC<OptimizationReportProps> = ({ optimization, originalCode, language }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);       // Controls diff modal visibility
  const [optimizedCode, setOptimizedCode] = useState('');      // Stores auto-fixed code
  const [isOptimizing, setIsOptimizing] = useState(false);     // Loading state for auto-fix

  // Triggered when user clicks "Generate Optimized Code"
  // Calls autoFixEngine and opens the diff modal
  const handleOptimize = () => {
    if (optimization.suggestions.length === 0) return;
    setIsOptimizing(true);
    
    // setTimeout allows React to paint the loading state before heavy AST work
    setTimeout(() => {
      try {
        const result = applyOptimizations(originalCode, language); // Run auto-fix
        setOptimizedCode(result);
        setIsModalOpen(true); // Open diff modal with before/after
      } catch (err) {
        console.error("Failed to apply optimizations", err);
      } finally {
        setIsOptimizing(false);
      }
    }, 100);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="glass-card rounded-lg p-5 neon-border space-y-5"
    >
      <h2 className="text-lg font-semibold text-foreground">Optimization Report</h2>

      {/* Summary box — shows overall result and depth before/after */}
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

      {/* List of individual suggestions — each with type badge, description, path */}
      {optimization.suggestions.length > 0 && (
        <div className="space-y-3 max-h-72 overflow-auto scrollbar-thin">
          {optimization.suggestions.map((s, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: i * 0.05 }} // Staggered animation
              className="rounded-lg bg-background/50 border border-border p-3 space-y-2"
            >
              <div className="flex items-center gap-2">
                {/* Issue type badge */}
                <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${typeColors[s.type]}`}>
                  {typeLabels[s.type]}
                </span>
                <span className="text-xs text-muted-foreground">-{s.depthReduction} depth</span>
              </div>
              <p className="text-sm text-foreground/80">{s.description}</p>
              {/* Tag path showing where in the tree the issue is */}
              <p className="text-xs font-mono text-muted-foreground">
                {s.path.join(' → ')}
              </p>
            </motion.div>
          ))}
        </div>
      )}

      {/* Auto-fix button — only shown when there are suggestions */}
      {optimization.suggestions.length > 0 && (
        <div className="pt-4 flex justify-end">
          <Button 
            onClick={handleOptimize} 
            disabled={isOptimizing}
            className="bg-primary/20 text-primary border border-primary/50 hover:bg-primary/30 hover:shadow-[0_0_15px_rgba(255,255,255,0.2)] transition-all font-medium"
          >
            {isOptimizing ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : "✨ "}
            {isOptimizing ? "Optimizing AST..." : "Generate Optimized Code"}
          </Button>
        </div>
      )}

      {/* Diff modal — shows original vs optimized code side by side */}
      <CodeDiffModal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
        originalCode={originalCode} 
        optimizedCode={optimizedCode} 
      />
    </motion.div>
  );
};

export default OptimizationReport;
