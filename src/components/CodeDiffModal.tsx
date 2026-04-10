// ============================================================
// CodeDiffModal.tsx — Side-by-side diff of original vs optimized
// Opens after user clicks "Generate Optimized Code"
// ============================================================

import React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';

interface CodeDiffModalProps {
  isOpen: boolean;
  onClose: () => void;
  originalCode: string;   // The code user originally pasted
  optimizedCode: string;  // The auto-fixed code from autoFixEngine
}

const CodeDiffModal: React.FC<CodeDiffModalProps> = ({ isOpen, onClose, originalCode, optimizedCode }) => {
  // Copies the optimized code to clipboard and closes the modal
  const handleCopy = () => {
    navigator.clipboard.writeText(optimizedCode);
    toast.success('Optimized code copied to clipboard!');
    onClose();
  };

  return (
    // Dialog closes when clicking outside (onOpenChange)
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="max-w-6xl w-[90vw] max-h-[90vh] flex flex-col bg-background/95 backdrop-blur-xl border border-primary/20 shadow-2xl overflow-hidden">
        <DialogHeader className="flex-shrink-0">
          <DialogTitle className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-primary to-secondary">
            ✨ AI Optimized Code
          </DialogTitle>
          <DialogDescription className="text-muted-foreground text-sm">
            Review the automated AST transformations. Redundant wrappers have been surgically removed.
          </DialogDescription>
        </DialogHeader>
        
        {/* Two-column layout: Original (left) vs Optimized (right) */}
        <div className="flex-1 grid grid-cols-1 lg:grid-cols-2 gap-4 min-h-[400px] overflow-hidden mt-4">
          {/* Left pane — original code (read-only) */}
          <div className="flex flex-col overflow-hidden rounded-lg border border-destructive/30 bg-background/50 shadow-inner">
            <div className="bg-destructive/10 px-4 py-2 text-xs font-semibold text-destructive uppercase tracking-widest border-b border-destructive/20">
              Original Code
            </div>
            <pre className="flex-1 overflow-auto p-4 text-xs sm:text-sm font-mono text-muted-foreground">
              <code>{originalCode}</code>
            </pre>
          </div>

          {/* Right pane — optimized code (read-only) */}
          <div className="flex flex-col overflow-hidden rounded-lg border border-secondary/30 bg-background/50 shadow-inner">
            <div className="bg-secondary/10 px-4 py-2 text-xs font-semibold text-secondary uppercase tracking-widest border-b border-secondary/20">
              Optimized Code
            </div>
            <pre className="flex-1 overflow-auto p-4 text-xs sm:text-sm font-mono text-foreground">
              <code>{optimizedCode}</code>
            </pre>
          </div>
        </div>

        {/* Footer actions: Cancel or Copy optimized code */}
        <div className="flex justify-end gap-3 mt-6 flex-shrink-0">
          <Button variant="outline" onClick={onClose} className="border-border hover:bg-muted text-muted-foreground transition-all">
            Cancel
          </Button>
          <Button onClick={handleCopy} className="bg-primary text-primary-foreground hover:bg-primary/80 hover:shadow-[0_0_20px_rgba(255,255,255,0.2)] transition-all flex items-center gap-2 font-medium">
            <span>📋</span> Copy Optimized Code
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default CodeDiffModal;
