import React, { useState } from 'react';
import { motion } from 'framer-motion';
import type { Language } from '../types/treeTypes';

interface CodeInputProps {
  onAnalyze: (code: string, language: Language) => void;
  isLoading: boolean;
}

const SAMPLE_HTML = `<div class="app">
  <header>
    <nav>
      <ul>
        <li><a href="/">Home</a></li>
        <li><a href="/about">About</a></li>
      </ul>
    </nav>
  </header>
  <main>
    <div>
      <div>
        <div>
          <section>
            <article>
              <h1>Hello World</h1>
              <p>This is deeply nested content</p>
            </article>
          </section>
        </div>
      </div>
    </div>
  </main>
  <footer>
    <p>Footer content</p>
  </footer>
</div>`;

const SAMPLE_JSX = `<div className="app">
  <header>
    <nav>
      <ul>
        <li><a href="/">Home</a></li>
        <li><a href="/about">About</a></li>
      </ul>
    </nav>
  </header>
  <main>
    <div>
      <div>
        <div>
          <section>
            <article>
              <h1>Hello World</h1>
              <p>Deeply nested JSX</p>
            </article>
          </section>
        </div>
      </div>
    </div>
  </main>
</div>`;

const CodeInput: React.FC<CodeInputProps> = ({ onAnalyze, isLoading }) => {
  const [code, setCode] = useState('');
  const [language, setLanguage] = useState<Language>('html');

  const handleAnalyze = () => {
    if (!code.trim()) return;
    onAnalyze(code, language);
  };

  const loadSample = () => {
    setCode(language === 'html' ? SAMPLE_HTML : SAMPLE_JSX);
  };

  const languages: { value: Language; label: string }[] = [
    { value: 'html', label: 'HTML' },
    { value: 'jsx', label: 'JSX' },
    { value: 'tsx', label: 'TSX' },
  ];

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="glass-card rounded-lg p-6 space-y-4"
    >
      <div className="flex items-center justify-between flex-wrap gap-3">
        <h2 className="text-lg font-semibold text-foreground">Code Input</h2>
        <div className="flex items-center gap-2">
          {languages.map((lang) => (
            <button
              key={lang.value}
              onClick={() => setLanguage(lang.value)}
              className={`px-3 py-1.5 rounded-md text-sm font-medium transition-all ${
                language === lang.value
                  ? 'gradient-cta text-primary-foreground neon-glow'
                  : 'bg-muted text-muted-foreground hover:text-foreground'
              }`}
              aria-pressed={language === lang.value}
            >
              {lang.label}
            </button>
          ))}
        </div>
      </div>

      <div className="relative">
        <textarea
          value={code}
          onChange={(e) => setCode(e.target.value)}
          placeholder={`Paste your ${language.toUpperCase()} code here...`}
          className="w-full h-64 bg-background/50 border border-border rounded-lg p-4 font-mono text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring resize-none scrollbar-thin"
          spellCheck={false}
          aria-label="Code input area"
        />
      </div>

      <div className="flex items-center gap-3 flex-wrap">
        <button
          onClick={handleAnalyze}
          disabled={!code.trim() || isLoading}
          className="gradient-cta px-6 py-2.5 rounded-lg font-semibold text-primary-foreground transition-all hover:opacity-90 disabled:opacity-40 disabled:cursor-not-allowed neon-glow"
          aria-label="Analyze code"
        >
          {isLoading ? (
            <span className="flex items-center gap-2">
              <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24" fill="none">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
              </svg>
              Analyzing...
            </span>
          ) : (
            'Analyze DOM'
          )}
        </button>
        <button
          onClick={loadSample}
          className="px-4 py-2.5 rounded-lg border border-border text-muted-foreground hover:text-foreground hover:border-primary/50 transition-all text-sm"
        >
          Load Sample
        </button>
        {code.trim() && (
          <button
            onClick={() => setCode('')}
            className="px-4 py-2.5 rounded-lg text-muted-foreground hover:text-destructive transition-all text-sm"
          >
            Clear
          </button>
        )}
      </div>
    </motion.div>
  );
};

export default CodeInput;
