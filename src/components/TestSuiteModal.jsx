import React, { useState } from 'react';
import { CheckCircle, XCircle, Play, ArrowRight, X, ShieldAlert, Sparkles, RefreshCw } from 'lucide-react';
import { TEST_CASES, runTestSuite } from '../compiler/test_suite.js';
import confetti from 'canvas-confetti';

export default function TestSuiteModal({ isOpen, onClose, onSelectExpression }) {
  const [suiteResults, setSuiteResults] = useState(null);
  const [filter, setFilter] = useState('ALL'); // 'ALL' | 'VALID' | 'INVALID'
  const [isRunning, setIsRunning] = useState(false);

  if (!isOpen) return null;

  const handleRunAll = () => {
    setIsRunning(true);
    setTimeout(() => {
      const results = runTestSuite();
      setSuiteResults(results);
      setIsRunning(false);
      if (results.allPassed) {
        try {
          confetti({
            particleCount: 80,
            spread: 70,
            origin: { y: 0.6 }
          });
        } catch (e) {
          // Ignore confetti if not supported
        }
      }
    }, 250);
  };

  const displayedCases = suiteResults ? suiteResults.results : TEST_CASES;

  const filteredList = displayedCases.filter((tc) => {
    if (filter === 'ALL') return true;
    if (filter === 'VALID') return tc.shouldSucceed;
    if (filter === 'INVALID') return !tc.shouldSucceed;
    return true;
  });

  return (
    <div style={{
      position: 'fixed',
      inset: 0,
      background: 'rgba(5, 8, 16, 0.85)',
      backdropFilter: 'blur(8px)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      zIndex: 9999,
      padding: '20px'
    }}>
      <div className="glass-card" style={{
        maxWidth: '860px',
        width: '100%',
        maxHeight: '90vh',
        display: 'flex',
        flexDirection: 'column',
        background: '#0f172a',
        border: '1px solid rgba(56, 189, 248, 0.3)',
        boxShadow: '0 20px 40px rgba(0, 0, 0, 0.7)'
      }}>
        {/* Header */}
        <div className="card-header" style={{ marginBottom: '16px', flexShrink: 0 }}>
          <div className="card-title-group">
            <div className="card-icon" style={{ background: 'rgba(56, 189, 248, 0.15)', color: 'var(--accent-cyan)' }}>
              <CheckCircle size={20} />
            </div>
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <h3 className="card-title">Automated Compiler Test Suite</h3>
                <span className="badge badge-cyan" style={{ fontSize: '0.7rem' }}>18 Test Cases</span>
              </div>
              <p className="card-subtitle">
                Systematic verification of Valid Expressions, Operator Precedence, Parentheses, and Syntax Error Handling.
              </p>
            </div>
          </div>
          <button 
            onClick={onClose}
            style={{
              background: 'transparent',
              border: 'none',
              color: 'var(--text-muted)',
              cursor: 'pointer',
              fontSize: '1.25rem'
            }}
          >
            ✕
          </button>
        </div>

        {/* Action Controls & Banner */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          flexWrap: 'wrap',
          gap: '12px',
          marginBottom: '16px',
          flexShrink: 0
        }}>
          <div style={{ display: 'flex', gap: '8px' }}>
            <button
              onClick={handleRunAll}
              disabled={isRunning}
              className="btn btn-primary"
              style={{ fontSize: '0.85rem', padding: '8px 16px' }}
            >
              <Play size={14} fill="#ffffff" />
              <span>{isRunning ? 'Running Tests...' : suiteResults ? 'Re-run All 18 Tests' : 'Run All 18 Tests'}</span>
            </button>

            {suiteResults && (
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '0 12px' }}>
                <span className={`badge ${suiteResults.allPassed ? 'badge-emerald' : 'badge-rose'}`} style={{ fontSize: '0.8rem' }}>
                  {suiteResults.passed} / {suiteResults.total} PASSED ({Math.round((suiteResults.passed / suiteResults.total) * 100)}%)
                </span>
              </div>
            )}
          </div>

          <div style={{
            display: 'flex',
            background: 'var(--bg-tertiary)',
            padding: '3px',
            borderRadius: 'var(--radius-sm)',
            border: '1px solid var(--border-subtle)'
          }}>
            <button
              onClick={() => setFilter('ALL')}
              className={`btn btn-pill ${filter === 'ALL' ? 'btn-primary' : 'btn-secondary'}`}
              style={{ fontSize: '0.75rem', padding: '4px 10px' }}
            >
              All (18)
            </button>
            <button
              onClick={() => setFilter('VALID')}
              className={`btn btn-pill ${filter === 'VALID' ? 'btn-primary' : 'btn-secondary'}`}
              style={{ fontSize: '0.75rem', padding: '4px 10px' }}
            >
              Valid (9)
            </button>
            <button
              onClick={() => setFilter('INVALID')}
              className={`btn btn-pill ${filter === 'INVALID' ? 'btn-primary' : 'btn-secondary'}`}
              style={{ fontSize: '0.75rem', padding: '4px 10px' }}
            >
              Invalid / Errors (9)
            </button>
          </div>
        </div>

        {/* Scrollable Test Cases Table */}
        <div style={{ overflowY: 'auto', flexGrow: 1 }} className="table-responsive">
          <table className="custom-table">
            <thead>
              <tr>
                <th style={{ width: '60px' }}>ID</th>
                <th>Test Case Name</th>
                <th>Expression</th>
                <th>Expected Outcome</th>
                <th style={{ width: '110px' }}>Status</th>
                <th style={{ width: '90px' }}>Action</th>
              </tr>
            </thead>
            <tbody>
              {filteredList.map((tc) => {
                const isPassed = tc.passed;
                const hasRun = suiteResults !== null;

                return (
                  <tr key={tc.id}>
                    <td style={{ fontFamily: 'var(--font-mono)', fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                      {tc.id}
                    </td>
                    <td>
                      <div style={{ fontWeight: '600', color: 'var(--text-main)', fontSize: '0.85rem' }}>
                        {tc.name}
                      </div>
                      <div style={{ fontSize: '0.75rem', color: 'var(--text-dim)' }}>
                        {tc.description}
                      </div>
                    </td>
                    <td>
                      <code style={{
                        fontFamily: 'var(--font-mono)',
                        fontSize: '0.85rem',
                        color: tc.shouldSucceed ? 'var(--accent-cyan)' : 'var(--accent-rose)',
                        background: 'rgba(0, 0, 0, 0.4)',
                        padding: '3px 6px',
                        borderRadius: '4px'
                      }}>
                        {tc.expression}
                      </code>
                    </td>
                    <td style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                      {tc.shouldSucceed ? (
                        <span style={{ color: 'var(--accent-emerald)' }}>
                          Valid AST & TAC
                        </span>
                      ) : (
                        <span style={{ color: 'var(--accent-rose)' }}>
                          {tc.expectedErrorStage || 'Halt with Error'}
                        </span>
                      )}
                    </td>
                    <td>
                      {hasRun ? (
                        isPassed ? (
                          <span className="badge badge-emerald" style={{ fontSize: '0.7rem' }}>
                            <CheckCircle size={10} /> PASSED
                          </span>
                        ) : (
                          <span className="badge badge-rose" style={{ fontSize: '0.7rem' }}>
                            <XCircle size={10} /> FAILED
                          </span>
                        )
                      ) : (
                        <span className="badge badge-purple" style={{ fontSize: '0.7rem' }}>
                          READY
                        </span>
                      )}
                    </td>
                    <td>
                      <button
                        onClick={() => {
                          onSelectExpression(tc.expression);
                          onClose();
                        }}
                        className="btn btn-secondary btn-pill"
                        style={{ fontSize: '0.7rem', padding: '4px 8px' }}
                        title="Load expression into compiler"
                      >
                        <span>Load</span>
                        <ArrowRight size={11} />
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        {/* Footer */}
        <div style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginTop: '16px',
          paddingTop: '12px',
          borderTop: '1px solid var(--border-subtle)',
          flexShrink: 0
        }}>
          <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
            All tests evaluate native Lexer, Parser, AST, and TAC engines.
          </span>
          <button onClick={onClose} className="btn btn-secondary" style={{ padding: '6px 16px' }}>
            Close
          </button>
        </div>
      </div>
    </div>
  );
}
