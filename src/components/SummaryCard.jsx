import React from 'react';
import { CheckCircle2, AlertOctagon, Info, Cpu, Layers, GitBranch, ArrowRight } from 'lucide-react';

export default function SummaryCard({ expression, summary, success }) {
  if (!summary || summary.status === 'PENDING') return null;

  return (
    <div
      className={`glass-card ${success ? 'highlight-emerald' : 'highlight-rose'} fade-in`}
      style={{
        boxShadow: success ? 'var(--shadow-glow-success)' : 'var(--shadow-glow-error)',
        background: success ? 'rgba(10, 25, 20, 0.8)' : 'rgba(30, 10, 20, 0.8)'
      }}
    >
      <div className="card-header" style={{ marginBottom: '16px' }}>
        <div className="card-title-group">
          <div
            className="card-icon"
            style={{
              background: success ? 'rgba(52, 211, 153, 0.15)' : 'rgba(244, 63, 94, 0.15)',
              color: success ? 'var(--accent-emerald)' : 'var(--accent-rose)',
            }}
          >
            {success ? <CheckCircle2 size={22} /> : <AlertOctagon size={22} />}
          </div>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <h3 className="card-title">Compilation Summary</h3>
              <span className={`badge ${success ? 'badge-emerald' : 'badge-rose'}`}>
                {summary.status}
              </span>
            </div>
            <p className="card-subtitle">
              Expression Front-End Processing Result
            </p>
          </div>
        </div>

        <div style={{
          padding: '6px 14px',
          borderRadius: 'var(--radius-full)',
          background: 'rgba(255, 255, 255, 0.05)',
          border: '1px solid var(--border-subtle)',
          fontSize: '0.8rem',
          color: 'var(--text-main)',
          fontFamily: 'var(--font-mono)'
        }}>
          Stage: <strong style={{ color: success ? 'var(--accent-emerald)' : 'var(--accent-rose)' }}>{summary.compilationStage}</strong>
        </div>
      </div>

      {/* Grid of stats */}
      <div className="grid-3" style={{ marginBottom: '16px', gap: '14px' }}>
        <div style={{
          background: 'rgba(15, 23, 42, 0.6)',
          padding: '12px 16px',
          borderRadius: 'var(--radius-sm)',
          border: '1px solid var(--border-subtle)'
        }}>
          <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Target Expression</div>
          <div style={{ fontSize: '1rem', fontWeight: '700', color: '#ffffff', fontFamily: 'var(--font-mono)', marginTop: '4px' }}>
            {expression || '—'}
          </div>
        </div>

        <div style={{
          background: 'rgba(15, 23, 42, 0.6)',
          padding: '12px 16px',
          borderRadius: 'var(--radius-sm)',
          border: '1px solid var(--border-subtle)'
        }}>
          <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Tokens & Lexemes</div>
          <div style={{ fontSize: '1rem', fontWeight: '700', color: 'var(--accent-cyan)', fontFamily: 'var(--font-mono)', marginTop: '4px' }}>
            {summary.tokenCount > 0 ? `${summary.tokenCount} Tokens` : 'Failed'}
          </div>
        </div>

        <div style={{
          background: 'rgba(15, 23, 42, 0.6)',
          padding: '12px 16px',
          borderRadius: 'var(--radius-sm)',
          border: '1px solid var(--border-subtle)'
        }}>
          <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>AST & Three Address Code</div>
          <div style={{ fontSize: '1rem', fontWeight: '700', color: 'var(--accent-emerald)', fontFamily: 'var(--font-mono)', marginTop: '4px' }}>
            {success ? `${summary.astNodeCount} Nodes • ${summary.tacInstructionCount} TAC Ops` : 'Not Constructed'}
          </div>
        </div>
      </div>

      {/* College Requirement Mandatory Scope Disclaimer Note */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        gap: '10px',
        padding: '12px 16px',
        borderRadius: 'var(--radius-sm)',
        background: 'rgba(56, 189, 248, 0.06)',
        border: '1px solid rgba(56, 189, 248, 0.25)',
        fontSize: '0.85rem'
      }}>
        <Info size={18} color="var(--accent-cyan)" style={{ flexShrink: 0 }} />
        <span style={{ color: '#cbd5e1' }}>
          <strong style={{ color: 'var(--accent-cyan)' }}>Scope Note: </strong>
          Machine code generation is outside the scope of this compiler front-end. The front-end responsibility terminates after generating verified Intermediate Representation (Three Address Code).
        </span>
      </div>
    </div>
  );
}
