import React from 'react';
import { AlertCircle, AlertTriangle, ArrowRight, CornerDownRight, HelpCircle } from 'lucide-react';

export default function ErrorPanel({ error }) {
  if (!error) return null;

  const isLexical = error.stage === 'LEXICAL_ANALYSIS';
  const title = isLexical ? 'LEXICAL ERROR' : 'SYNTAX ERROR';

  return (
    <div
      className="glass-card highlight-rose fade-in"
      style={{
        padding: '24px',
        background: 'rgba(30, 10, 20, 0.75)',
        border: '1px solid rgba(244, 63, 94, 0.4)',
        boxShadow: 'var(--shadow-glow-error)'
      }}
    >
      <div className="card-header" style={{ marginBottom: '16px', borderColor: 'rgba(244, 63, 94, 0.2)' }}>
        <div className="card-title-group">
          <div
            className="card-icon"
            style={{
              background: 'rgba(244, 63, 94, 0.15)',
              color: 'var(--accent-rose)',
            }}
          >
            <AlertCircle size={22} />
          </div>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <h3 className="card-title" style={{ color: 'var(--accent-rose)' }}>
                {title}
              </h3>
              <span className="badge badge-rose" style={{ fontSize: '0.7rem' }}>
                {error.stageName || error.stage}
              </span>
            </div>
            <p className="card-subtitle" style={{ color: '#fda4af' }}>
              Compiler front-end halted. The expression could not be processed into an AST or TAC.
            </p>
          </div>
        </div>

        {error.position && (
          <div className="badge badge-rose" style={{ padding: '6px 12px', fontSize: '0.8rem' }}>
            Position: {error.position}
          </div>
        )}
      </div>

      {/* Main Error Message */}
      <div style={{
        padding: '14px 18px',
        borderRadius: 'var(--radius-md)',
        background: 'rgba(0, 0, 0, 0.5)',
        borderLeft: '4px solid var(--accent-rose)',
        marginBottom: '16px',
        fontSize: '1rem',
        fontWeight: '600',
        color: '#ffe4e6',
        display: 'flex',
        alignItems: 'center',
        gap: '10px'
      }}>
        <AlertTriangle size={18} color="var(--accent-rose)" />
        <span>{error.message}</span>
      </div>

      {/* Visual Expression Pointer */}
      {error.pointerLine && (
        <div style={{ marginBottom: '18px' }}>
          <div style={{
            fontSize: '0.75rem',
            color: 'var(--text-muted)',
            fontWeight: '600',
            textTransform: 'uppercase',
            letterSpacing: '0.05em',
            marginBottom: '6px'
          }}>
            Problematic Expression Location:
          </div>
          <pre
            style={{
              background: '#070a12',
              border: '1px solid rgba(244, 63, 94, 0.3)',
              borderRadius: 'var(--radius-md)',
              padding: '16px 20px',
              fontFamily: 'var(--font-mono)',
              fontSize: '1.05rem',
              color: '#ffffff',
              lineHeight: '1.5',
              overflowX: 'auto',
              whiteSpace: 'pre'
            }}
          >
            {error.pointerLine}
          </pre>
        </div>
      )}

      {/* Expected vs Found Grid */}
      <div className="grid-2" style={{ marginBottom: '16px', gap: '12px' }}>
        <div style={{
          background: 'rgba(15, 23, 42, 0.6)',
          border: '1px solid var(--border-subtle)',
          borderRadius: 'var(--radius-sm)',
          padding: '12px 14px'
        }}>
          <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', fontWeight: '600', textTransform: 'uppercase' }}>
            Expected:
          </div>
          <div style={{ fontSize: '0.9rem', color: 'var(--accent-emerald)', fontFamily: 'var(--font-mono)', marginTop: '4px' }}>
            {error.expected || 'Valid mathematical construct'}
          </div>
        </div>

        <div style={{
          background: 'rgba(15, 23, 42, 0.6)',
          border: '1px solid var(--border-subtle)',
          borderRadius: 'var(--radius-sm)',
          padding: '12px 14px'
        }}>
          <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', fontWeight: '600', textTransform: 'uppercase' }}>
            Found:
          </div>
          <div style={{ fontSize: '0.9rem', color: 'var(--accent-rose)', fontFamily: 'var(--font-mono)', marginTop: '4px' }}>
            {error.found || 'Unknown token'}
          </div>
        </div>
      </div>

      {/* Suggestion / Academic note */}
      {error.suggestion && (
        <div style={{
          display: 'flex',
          alignItems: 'flex-start',
          gap: '10px',
          fontSize: '0.85rem',
          color: 'var(--text-muted)',
          background: 'rgba(56, 189, 248, 0.05)',
          border: '1px solid rgba(56, 189, 248, 0.2)',
          borderRadius: 'var(--radius-sm)',
          padding: '12px 14px'
        }}>
          <HelpCircle size={16} color="var(--accent-cyan)" style={{ flexShrink: 0, marginTop: '2px' }} />
          <div>
            <strong style={{ color: 'var(--accent-cyan)' }}>Compiler Suggestion: </strong>
            {error.suggestion}
          </div>
        </div>
      )}
    </div>
  );
}
