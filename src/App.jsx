import React, { useState, useEffect } from 'react';
import Header from './components/Header.jsx';
import ExpressionInput from './components/ExpressionInput.jsx';
import StepProgress from './components/StepProgress.jsx';
import TokenTable from './components/TokenTable.jsx';
import ASTVisualizer from './components/ASTVisualizer.jsx';
import TACViewer from './components/TACViewer.jsx';
import ErrorPanel from './components/ErrorPanel.jsx';
import GrammarPanel from './components/GrammarPanel.jsx';
import SummaryCard from './components/SummaryCard.jsx';
import TestSuiteModal from './components/TestSuiteModal.jsx';
import DocsModal from './components/DocsModal.jsx';
import Footer from './components/Footer.jsx';
import { compileExpression } from './compiler/compiler.js';
import confetti from 'canvas-confetti';
import { ChevronLeft, ChevronRight, Play, RotateCcw, Sparkles } from 'lucide-react';

export default function App() {
  const [expression, setExpression] = useState('a + b * (c - 2)');
  const [compileResult, setCompileResult] = useState(null);
  const [isStepMode, setIsStepMode] = useState(false);
  const [currentStep, setCurrentStep] = useState(1);
  const [isTestModalOpen, setIsTestModalOpen] = useState(false);
  const [isDocsModalOpen, setIsDocsModalOpen] = useState(false);
  const [docsTab, setDocsTab] = useState('REPORT');

  // Initial compilation on mount
  useEffect(() => {
    handleAnalyze('a + b * (c - 2)', false);
  }, []);

  const handleAnalyze = (exprToAnalyze = expression, triggerConfetti = true) => {
    const res = compileExpression(exprToAnalyze);
    setCompileResult(res);

    if (res.success && triggerConfetti) {
      try {
        confetti({
          particleCount: 50,
          spread: 60,
          origin: { y: 0.7 }
        });
      } catch (e) {
        // ignore if confetti fails
      }
    }
  };

  const handleClear = () => {
    setExpression('');
    setCompileResult(null);
    setCurrentStep(1);
  };

  const handleSelectExample = (newExpr) => {
    setExpression(newExpr);
    handleAnalyze(newExpr, true);
  };

  return (
    <div className="app-container">
      {/* 1. Header with Case Study 17 & Group 17 */}
      <Header
        onOpenTests={() => setIsTestModalOpen(true)}
        onOpenDocs={() => {
          setDocsTab('REPORT');
          setIsDocsModalOpen(true);
        }}
      />

      {/* 2. Expression Input Card with Predefined Examples & Error Demos */}
      <ExpressionInput
        input={expression}
        onInputChange={setExpression}
        onAnalyze={() => handleAnalyze(expression, true)}
        onClear={handleClear}
      />

      {/* 3. Pipeline Stepper / Progress Bar */}
      {compileResult && (
        <StepProgress
          stages={compileResult.stages}
          error={compileResult.error}
          currentStep={currentStep}
          isStepMode={isStepMode}
          onStepChange={setCurrentStep}
          onToggleStepMode={() => {
            setIsStepMode(!isStepMode);
            setCurrentStep(1);
          }}
        />
      )}

      {/* Step-by-Step Walkthrough Controls (when Step Mode is active) */}
      {isStepMode && compileResult && (
        <div className="glass-card fade-in" style={{ padding: '16px 24px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '12px', borderLeft: '4px solid var(--accent-cyan)' }}>
          <div>
            <div style={{ fontSize: '0.75rem', fontWeight: '700', color: 'var(--accent-cyan)', textTransform: 'uppercase' }}>
              Educational Walkthrough Active:
            </div>
            <div style={{ fontSize: '1rem', fontWeight: '700', color: '#ffffff' }}>
              STEP {currentStep} of 7: {
                currentStep === 1 ? 'Input Mathematical Expression' :
                currentStep === 2 ? 'Lexical Analysis Scanning' :
                currentStep === 3 ? 'Tokens Stream Generated' :
                currentStep === 4 ? 'Recursive Descent Syntax Parsing' :
                currentStep === 5 ? 'Abstract Syntax Tree (AST)' :
                currentStep === 6 ? 'Intermediate Representation (IR Reduction)' :
                'Three Address Code (TAC)'
              }
            </div>
          </div>

          <div style={{ display: 'flex', gap: '8px' }}>
            <button
              onClick={() => setCurrentStep(Math.max(1, currentStep - 1))}
              disabled={currentStep === 1}
              className="btn btn-secondary btn-pill"
              style={{ opacity: currentStep === 1 ? 0.5 : 1 }}
            >
              <ChevronLeft size={16} />
              <span>Previous Step</span>
            </button>
            <button
              onClick={() => setCurrentStep(Math.min(7, currentStep + 1))}
              disabled={currentStep === 7}
              className="btn btn-primary btn-pill"
              style={{ opacity: currentStep === 7 ? 0.5 : 1 }}
            >
              <span>Next Step</span>
              <ChevronRight size={16} />
            </button>
          </div>
        </div>
      )}

      {/* Error Panel (Shown whenever Lexical or Syntax error is detected) */}
      {compileResult && compileResult.error && (
        <ErrorPanel error={compileResult.error} />
      )}

      {/* Compiler Stages Output Views */}
      {compileResult && (
        <>
          {/* STEP MODE RENDERING */}
          {isStepMode ? (
            <div className="fade-in" style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
              {currentStep === 1 && (
                <div className="glass-card" style={{ padding: '24px' }}>
                  <h3 style={{ color: 'var(--accent-cyan)', marginBottom: '8px' }}>Step 1: Input Expression</h3>
                  <p style={{ color: 'var(--text-muted)', marginBottom: '16px' }}>
                    The compiler front-end receives a raw mathematical string entered by the user.
                  </p>
                  <pre className="code-block" style={{ fontSize: '1.2rem', color: 'var(--accent-cyan)' }}>
                    {expression || '(Empty Expression)'}
                  </pre>
                </div>
              )}

              {(currentStep === 2 || currentStep === 3) && (
                <TokenTable
                  tokens={compileResult.stages.lexer.tokens}
                  logs={compileResult.stages.lexer.logs}
                />
              )}

              {currentStep === 4 && (
                <div className="glass-card" style={{ padding: '24px' }}>
                  <h3 style={{ color: 'var(--accent-indigo)', marginBottom: '8px' }}>Step 4: Recursive Descent Syntax Parsing</h3>
                  <p style={{ color: 'var(--text-muted)', marginBottom: '16px' }}>
                    The parser checks syntax against the grammar rules: <code>Expression → Term ((+ | -) Term)*</code>, <code>Term → Factor ((* | /) Factor)*</code>, <code>Factor → Number | Identifier | (Expression)</code>.
                  </p>
                  <div style={{
                    background: '#070a12',
                    borderRadius: 'var(--radius-md)',
                    padding: '16px',
                    fontFamily: 'var(--font-mono)',
                    fontSize: '0.85rem',
                    maxHeight: '300px',
                    overflowY: 'auto'
                  }}>
                    {compileResult.stages.parser.parseTrace.map((item, idx) => (
                      <div key={idx} style={{ padding: '4px 0', borderBottom: '1px solid rgba(255,255,255,0.03)' }}>
                        <span style={{ color: 'var(--accent-cyan)' }}>[{item.rule || item.step}]</span> &nbsp;
                        <span style={{ color: '#ffffff' }}>{item.action || item.message}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {currentStep === 5 && (
                <ASTVisualizer
                  ast={compileResult.stages.ast.root}
                  layout={compileResult.stages.ast.layout}
                  metrics={compileResult.stages.ast.metrics}
                />
              )}

              {(currentStep === 6 || currentStep === 7) && (
                <TACViewer tacData={compileResult.stages.tac} />
              )}
            </div>
          ) : (
            /* FULL DASHBOARD VIEW (When Step Mode is off) */
            <div style={{ display: 'flex', flexDirection: 'column', gap: '28px' }}>
              
              {/* If successful, render all stages */}
              {compileResult.success && (
                <>
                  {/* Grid: Tokens Table & AST Visualizer */}
                  <div className="grid-2">
                    <TokenTable
                      tokens={compileResult.stages.lexer.tokens}
                      logs={compileResult.stages.lexer.logs}
                    />

                    <ASTVisualizer
                      ast={compileResult.stages.ast.root}
                      layout={compileResult.stages.ast.layout}
                      metrics={compileResult.stages.ast.metrics}
                    />
                  </div>

                  {/* Intermediate Representation (TAC, Quads, Triples) */}
                  <TACViewer tacData={compileResult.stages.tac} />
                </>
              )}

              {/* Grammar & Theory Panel */}
              <GrammarPanel />

              {/* Final Summary Card */}
              <SummaryCard
                expression={expression}
                summary={compileResult.summary}
                success={compileResult.success}
              />
            </div>
          )}
        </>
      )}

      {/* 4. Footer */}
      <Footer
        onOpenDocs={() => {
          setDocsTab('REPORT');
          setIsDocsModalOpen(true);
        }}
        onOpenViva={() => {
          setDocsTab('VIVA');
          setIsDocsModalOpen(true);
        }}
      />

      {/* 5. Modals */}
      <TestSuiteModal
        isOpen={isTestModalOpen}
        onClose={() => setIsTestModalOpen(false)}
        onSelectExpression={handleSelectExample}
      />

      <DocsModal
        isOpen={isDocsModalOpen}
        onClose={() => setIsDocsModalOpen(false)}
        initialTab={docsTab}
      />
    </div>
  );
}
