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
  const [result, setResult] = useState<AnalysisResult | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleAnalyze = useCallback((code: string, language: Language) => {
    setIsLoading(true);
    setResult(null);

    // Use setTimeout to let the UI update with skeleton before heavy computation
    setTimeout(() => {
      try {
        const tree = buildTree(code, language);
        const dfs = dfsAnalyze(tree);
        const binaryTree = convertToBinaryTree(tree);
        const optimization = analyzeOptimizations(tree, dfs.maxDepth);

        setResult({ tree, binaryTree, dfs, optimization });
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
      {/* Header */}
      <header className="border-b border-border glass-card sticky top-0 z-20">
        <div className="max-w-7xl mx-auto px-4 py-3 flex items-center justify-between">
          <Link to="/" className="flex items-center gap-2 hover:opacity-80 transition-opacity">
            <span className="text-xl">🌳</span>
            <span className="font-bold gradient-text text-lg">DOM Analyzer</span>
          </Link>
          <span className="text-xs text-muted-foreground hidden sm:block">100% Client-Side</span>
        </div>
      </header>

      {/* Main */}
      <main className="flex-1 max-w-7xl mx-auto w-full px-4 py-8 space-y-8">
        <CodeInput onAnalyze={handleAnalyze} isLoading={isLoading} />

        {isLoading && <SkeletonLoader />}

        <AnimatePresence>
          {result && !isLoading && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="space-y-8"
            >
              <MetricsPanel dfs={result.dfs} />

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <TreeView tree={result.tree} title="N-ary Tree (DOM Structure)" />
                <BinaryTreeView tree={result.binaryTree} />
              </div>

              <OptimizationReport optimization={result.optimization} />
            </motion.div>
          )}
        </AnimatePresence>
      </main>
    </div>
  );
};

export default Analyzer;
