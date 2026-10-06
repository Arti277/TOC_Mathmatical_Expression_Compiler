import React, { useState } from 'react';
import { Terminal, Copy, Check, Table, Cpu, ListTree, Sparkles } from 'lucide-react';

export default function TACViewer({ tacData }) {
  const [activeTab, setActiveTab] = useState('TAC'); // 'TAC' | 'QUADS' | 'TRIPLES' | 'TRACE'
  const [copied, setCopied] = useState(false);

  if (!tacData || !tacData.instructions || tacData.instructions.length === 0) {
    return (
      <div className="glass-card" style={{ padding: '24px' }}>
        <p style={{ color: 'var(--text-muted)', textAlign: 'center' }}>
          Intermediate code has not been generated yet. Enter a valid expression and click Analyze.
        </p>
      </div>
    );
  }

  const { instructions, quadruples, triples, finalResult, generationTrace, tempCount } = tacData;

  const handleCopy = () => {
    navigator.clipboard.writeText(instructions.join('\n'));
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="glass-card highlight-emerald">
      <div className="card-header">
        <div className="card-title-group">
          <div className="card-icon" style={{ background: 'rgba(52, 211, 153, 0.15)', color: 'var(--accent-emerald)' }}>
            <Cpu size={20} />
          </div>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <h3 className="card-title">Intermediate Representation (Three Address Code)</h3>
              <span className="badge badge-emerald" style={{ fontSize: '0.7rem' }}>
                {instructions.length} Instructions
              </span>
            </div>
            <p className="card-subtitle">
              Linearized intermediate code generated via post-order AST bottom-up reduction.
            </p>
          </div>
        </div>

        {/* Tab switchers and Copy button */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
          <div style={{
            display: 'flex',
            background: 'var(--bg-tertiary)',
            padding: '3px',
            borderRadius: 'var(--radius-sm)',
            border: '1px solid var(--border-subtle)'
          }}>
            <button
              onClick={() => setActiveTab('TAC')}
              className={`btn btn-pill ${activeTab === 'TAC' ? 'btn-primary' : 'btn-secondary'}`}
              style={{ fontSize: '0.75rem', padding: '5px 12px' }}
            >
              Linear TAC
            </button>
            <button
              onClick={() => setActiveTab('QUADS')}
              className={`btn btn-pill ${activeTab === 'QUADS' ? 'btn-primary' : 'btn-secondary'}`}
              style={{ fontSize: '0.75rem', padding: '5px 12px' }}
            >
              Quadruples
            </button>
            <button
              onClick={() => setActiveTab('TRIPLES')}
              className={`btn btn-pill ${activeTab === 'TRIPLES' ? 'btn-primary' : 'btn-secondary'}`}
              style={{ fontSize: '0.75rem', padding: '5px 12px' }}
            >
              Triples
            </button>
            <button
              onClick={() => setActiveTab('TRACE')}
              className={`btn btn-pill ${activeTab === 'TRACE' ? 'btn-primary' : 'btn-secondary'}`}
              style={{ fontSize: '0.75rem', padding: '5px 12px' }}
            >
              IR Trace
            </button>
          </div>

          <button
            onClick={handleCopy}
            className="btn btn-secondary btn-pill"
            style={{ fontSize: '0.75rem', padding: '5px 12px' }}
            title="Copy TAC instructions"
          >
            {copied ? <Check size={13} color="var(--accent-emerald)" /> : <Copy size={13} />}
            <span>{copied ? 'Copied!' : 'Copy Code'}</span>
          </button>
        </div>
      </div>

      {/* Info Stats Banner */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        flexWrap: 'wrap',
        gap: '12px',
        padding: '10px 16px',
        borderRadius: 'var(--radius-sm)',
        background: 'rgba(52, 211, 153, 0.05)',
        border: '1px solid rgba(52, 211, 153, 0.2)',
        marginBottom: '16px',
        fontSize: '0.825rem'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <Sparkles size={15} color="var(--accent-emerald)" />
          <span style={{ color: 'var(--text-muted)' }}>
            Temporary Variables Allocated: <strong style={{ color: 'var(--accent-emerald)', fontFamily: 'var(--font-mono)' }}>{tempCount} (t1..t{tempCount})</strong>
          </span>
        </div>
        <div>
          <span style={{ color: 'var(--text-muted)' }}>
            Final Result in: <strong style={{ color: 'var(--accent-cyan)', fontFamily: 'var(--font-mono)' }}>{finalResult}</strong>
          </span>
        </div>
      </div>

      {/* Content based on Active Tab */}
      {activeTab === 'TAC' && (
        <div className="fade-in">
          <div
            style={{
              background: '#070a12',
              border: '1px solid var(--border-subtle)',
              borderRadius: 'var(--radius-md)',
              padding: '18px 20px',
              fontFamily: 'var(--font-mono)',
              fontSize: '1rem',
              color: '#f8fafc',
              lineHeight: '1.8'
            }}
          >
            {instructions.map((line, idx) => (
              <div key={idx} style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                <span style={{
                  color: 'var(--text-dim)',
                  userSelect: 'none',
                  fontSize: '0.8rem',
                  minWidth: '24px',
                  textAlign: 'right'
                }}>
                  {idx + 1}
                </span>
                <span style={{ color: 'var(--accent-cyan)' }}>
                  {line.split('=')[0]}=
                </span>
                <span style={{ color: '#ffffff' }}>
                  {line.split('=')[1]}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}

      {activeTab === 'QUADS' && (
        <div className="fade-in table-responsive">
          <table className="custom-table">
            <thead>
              <tr>
                <th style={{ width: '60px' }}>#</th>
                <th>Operator (op)</th>
                <th>Argument 1 (arg1)</th>
                <th>Argument 2 (arg2)</th>
                <th>Result</th>
              </tr>
            </thead>
            <tbody>
              {quadruples.map((q) => (
                <tr key={q.id}>
                  <td style={{ fontFamily: 'var(--font-mono)', color: 'var(--text-muted)' }}>
                    ({q.id})
                  </td>
                  <td>
                    <span className="badge badge-cyan" style={{ fontFamily: 'var(--font-mono)', fontSize: '0.85rem' }}>
                      {q.op}
                    </span>
                  </td>
                  <td style={{ fontFamily: 'var(--font-mono)', color: 'var(--accent-emerald)' }}>
                    {q.arg1}
                  </td>
                  <td style={{ fontFamily: 'var(--font-mono)', color: 'var(--accent-purple)' }}>
                    {q.arg2 || '-'}
                  </td>
                  <td style={{ fontFamily: 'var(--font-mono)', fontWeight: '700', color: 'var(--accent-cyan)' }}>
                    {q.result}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {activeTab === 'TRIPLES' && (
        <div className="fade-in table-responsive">
          <table className="custom-table">
            <thead>
              <tr>
                <th style={{ width: '60px' }}>Index</th>
                <th>Operator (op)</th>
                <th>Argument 1 (arg1)</th>
                <th>Argument 2 (arg2)</th>
              </tr>
            </thead>
            <tbody>
              {triples.map((t) => (
                <tr key={t.id}>
                  <td style={{ fontFamily: 'var(--font-mono)', color: 'var(--accent-cyan)', fontWeight: '700' }}>
                    ({t.id})
                  </td>
                  <td>
                    <span className="badge badge-cyan" style={{ fontFamily: 'var(--font-mono)', fontSize: '0.85rem' }}>
                      {t.op}
                    </span>
                  </td>
                  <td style={{ fontFamily: 'var(--font-mono)', color: 'var(--accent-emerald)' }}>
                    {t.arg1}
                  </td>
                  <td style={{ fontFamily: 'var(--font-mono)', color: 'var(--accent-purple)' }}>
                    {t.arg2 || '-'}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {activeTab === 'TRACE' && (
        <div className="fade-in">
          <div
            style={{
              background: '#070a12',
              border: '1px solid var(--border-subtle)',
              borderRadius: 'var(--radius-md)',
              padding: '16px',
              fontFamily: 'var(--font-mono)',
              fontSize: '0.825rem',
              color: '#cbd5e1',
              maxHeight: '260px',
              overflowY: 'auto',
              lineHeight: '1.6'
            }}
          >
            {generationTrace.map((msg, i) => (
              <div key={i} style={{ marginBottom: '4px' }}>
                <span style={{ color: 'var(--accent-emerald)' }}>→</span> {msg}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
