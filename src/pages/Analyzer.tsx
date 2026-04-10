// ============================================================
// Analyzer.tsx — Main page that orchestrates the full analysis
// Connects CodeInput → parsing → analysis → visualization
// ============================================================

import React, { useState, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { toast } from 'sonner';
import CodeInput from '../components/CodeInput';
import MetricsPanel from '../components/MetricsPanel';
import TreeView from '../components/TreeView';
import BinaryTreeView from '../components/BinaryTreeView';
import OptimizationReport from '../components/OptimizationReport';
import SkeletonLoader from '../components/SkeletonLoader';
import { buildTree } from '../utils/buildTree';
import { dfsAnalyze } from '../utils/dfsAnalyzer';
import { convertToBinaryTree } from '../utils/binaryTreeConverter';
import { analyzeOptimizations } from '../utils/optimizer';
import type { AnalysisResult, Language } from '../types/treeTypes';

const Analyzer: React.FC = () => {
  // Holds the full analysis result once processing is complete
  const [result, setResult] = useState<AnalysisResult | null>(null);
  // Controls skeleton loader visibility during processing
  const [isLoading, setIsLoading] = useState(false);

  // Called by CodeInput when user clicks "Analyze DOM"
  // Runs the full pipeline: parse → DFS → binary tree → optimize
  const handleAnalyze = useCallback((code: string, language: Language) => {
    setIsLoading(true);
    setResult(null);

    // setTimeout allows React to re-render the skeleton loader
    // before the heavy synchronous computation begins
    setTimeout(() => {
      try {
        // Step 1: Parse code into N-ary TreeNode
        const tree = buildTree(code, language);

        // Step 2: Run DFS to get depth metrics
        const dfs = dfsAnalyze(tree);

        // Step 3: Convert N-ary tree to binary tree representation
        const binaryTree = convertToBinaryTree(tree);

        // Step 4: Detect optimization opportunities
        const optimization = analyzeOptimizations(tree, dfs.maxDepth);

        // Step 5: Store all results in state to trigger UI render
        setResult({ tree, binaryTree, dfs, optimization, code, language });
        toast.success('Analysis complete!');
      } catch (e: unknown) {
        const msg = e instanceof Error ? e.message : 'Analysis failed.';
        toast.error(msg);
      } finally {
        setIsLoading(false);
      }
    }, 100);
  }, []);

  return (
    <div className="min-h-screen flex flex-col">
      {/* Header — sticky nav with link back to Home */}
      <header className="border-b border-border glass-card sticky top-0 z-20">
        <div className="max-w-7xl mx-auto px-4 py-3 flex items-center justify-between">
          <Link to="/" className="flex items-center gap-2 hover:opacity-80 transition-opacity">
            <span className="text-xl">🌳</span>
            <span className="font-bold gradient-text text-lg">DOM Analyzer</span>
          </Link>
          <span className="text-xs text-muted-foreground hidden sm:block">100% Client-Side</span>
        </div>
      </header>

      {/* Main content area */}
      <main className="flex-1 max-w-7xl mx-auto w-full px-4 py-8 space-y-8">
        {/* Code input + language selector */}
        <CodeInput onAnalyze={handleAnalyze} isLoading={isLoading} />

        {/* Show skeleton while analysis is running */}
        {isLoading && <SkeletonLoader />}

        {/* Animate results in once analysis is complete */}
        <AnimatePresence>
          {result && !isLoading && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="space-y-8"
            >
              {/* Metrics: total nodes, max depth, average depth */}
              <MetricsPanel dfs={result.dfs} />

              {/* Side-by-side tree visualizations */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <TreeView tree={result.tree} title="N-ary Tree (DOM Structure)" />
                <BinaryTreeView tree={result.binaryTree} />
              </div>

              {/* Optimization suggestions + auto-fix button */}
              <OptimizationReport optimization={result.optimization} originalCode={result.code} language={result.language} />
            </motion.div>
          )}
        </AnimatePresence>
      </main>
    </div>
  );
};

export default Analyzer;
