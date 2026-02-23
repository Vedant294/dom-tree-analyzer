import React from 'react';
import { motion } from 'framer-motion';

const SkeletonLoader: React.FC = () => {
  return (
    <div className="space-y-6 animate-pulse" aria-busy="true" aria-label="Loading analysis results">
      {/* Metrics skeleton */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {[0, 1, 2].map((i) => (
          <div key={i} className="glass-card rounded-lg p-5 h-28">
            <div className="h-4 w-24 bg-muted rounded mb-4" />
            <div className="h-8 w-16 bg-muted rounded" />
          </div>
        ))}
      </div>
      {/* Trees skeleton */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {[0, 1].map((i) => (
          <div key={i} className="glass-card rounded-lg p-5 h-64">
            <div className="h-5 w-32 bg-muted rounded mb-4" />
            <div className="space-y-2">
              {[0, 1, 2, 3, 4].map((j) => (
                <div key={j} className="h-4 bg-muted rounded" style={{ width: `${70 - j * 10}%`, marginLeft: j * 16 }} />
              ))}
            </div>
          </div>
        ))}
      </div>
      {/* Report skeleton */}
      <div className="glass-card rounded-lg p-5 h-40">
        <div className="h-5 w-40 bg-muted rounded mb-4" />
        <div className="h-4 w-full bg-muted rounded mb-2" />
        <div className="h-4 w-3/4 bg-muted rounded" />
      </div>
    </div>
  );
};

export default SkeletonLoader;
