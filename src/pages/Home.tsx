import React from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';

const Home: React.FC = () => {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-4 relative overflow-hidden">
      {/* Background glow effects */}
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-primary/5 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-accent/5 rounded-full blur-3xl pointer-events-none" />

      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="text-center max-w-2xl z-10"
      >
        <motion.div
          initial={{ scale: 0.8 }}
          animate={{ scale: 1 }}
          transition={{ delay: 0.2, type: 'spring' }}
          className="mb-6"
        >
          <span className="text-6xl" role="img" aria-label="tree">🌳</span>
        </motion.div>

        <h1 className="text-4xl md:text-5xl font-extrabold mb-4">
          <span className="gradient-text">DOM Depth</span>{' '}
          <span className="text-foreground">Analyzer</span>
        </h1>

        <p className="text-lg text-muted-foreground mb-8 leading-relaxed">
          Paste HTML, JSX, or TSX code and visualize its tree structure.
          Get depth metrics, binary tree conversion, and optimization suggestions — all client-side.
        </p>

        <Link
          to="/analyzer"
          className="inline-block gradient-cta px-8 py-3.5 rounded-lg font-semibold text-primary-foreground neon-glow hover:opacity-90 transition-all text-lg"
          aria-label="Go to analyzer"
        >
          Start Analyzing →
        </Link>

        <div className="mt-12 grid grid-cols-3 gap-6 text-center">
          {[
            { icon: '⚡', label: 'Client-side Only' },
            { icon: '🔒', label: 'No Code Execution' },
            { icon: '🌲', label: 'Tree Visualization' },
          ].map((f, i) => (
            <motion.div
              key={f.label}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 + i * 0.1 }}
              className="space-y-2"
            >
              <span className="text-2xl">{f.icon}</span>
              <p className="text-sm text-muted-foreground">{f.label}</p>
            </motion.div>
          ))}
        </div>
      </motion.div>
    </div>
  );
};

export default Home;
