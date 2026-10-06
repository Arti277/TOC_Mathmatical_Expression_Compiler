import React, { useState } from 'react';
import { Layers, Search, Filter, Info, FileCode } from 'lucide-react';

export default function TokenTable({ tokens, logs }) {
  const [filterType, setFilterType] = useState('ALL');
  const [showLogs, setShowLogs] = useState(false);

  if (!tokens || tokens.length === 0) {
    return (
      <div className="glass-card" style={{ padding: '24px' }}>
        <p style={{ color: 'var(--text-muted)', textAlign: 'center' }}>
          No tokens generated yet. Enter an expression and click "Analyze Expression".
        </p>
      </div>
    );
  }

  // Token Badge color mapping
  const getBadgeClass = (type) => {
    switch (type) {
      case 'IDENTIFIER':
        return 'badge-purple';
      case 'NUMBER':
        return 'badge-emerald';
      case 'PLUS':
      case 'MINUS':
      case 'MULTIPLY':
      case 'DIVIDE':
        return 'badge-cyan';
      case 'LPAREN':
      case 'RPAREN':
        return 'badge-amber';
      case 'EOF':
        return 'badge-rose';
      default:
        return 'badge-cyan';
    }
  };

  const filteredTokens = tokens.filter((t) => {
    if (filterType === 'ALL') return true;
    if (filterType === 'IDENTIFIER') return t.type === 'IDENTIFIER';
    if (filterType === 'NUMBER') return t.type === 'NUMBER';
    if (filterType === 'OPERATORS') return ['PLUS', 'MINUS', 'MULTIPLY', 'DIVIDE'].includes(t.type);
    if (filterType === 'PARENS') return ['LPAREN', 'RPAREN'].includes(t.type);
    return true;
  });

  return (
    <div className="glass-card highlight-indigo">
      <div className="card-header">
        <div className="card-title-group">
          <div className="card-icon" style={{ background: 'rgba(129, 140, 248, 0.15)', color: 'var(--accent-indigo)' }}>
            <Layers size={20} />
          </div>
          <div>
            <h3 className="card-title">Lexical Analysis & Tokens</h3>
            <p className="card-subtitle">
              Generated {tokens.length} tokens via character-by-character lexical scanning.
            </p>
          </div>
        </div>

        {/* Filter and Log controls */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
          <select
            value={filterType}
            onChange={(e) => setFilterType(e.target.value)}
            style={{
              background: 'var(--bg-tertiary)',
              color: 'var(--text-main)',
              border: '1px solid var(--border-subtle)',
              borderRadius: 'var(--radius-sm)',
              padding: '6px 10px',
              fontSize: '0.8rem',
              outline: 'none',
              cursor: 'pointer'
            }}
          >
            <option value="ALL">All Tokens ({tokens.length})</option>
            <option value="IDENTIFIER">Identifiers</option>
            <option value="NUMBER">Numbers</option>
            <option value="OPERATORS">Operators (+, -, *, /)</option>
            <option value="PARENS">Parentheses</option>
          </select>

          <button
            onClick={() => setShowLogs(!showLogs)}
            className="btn btn-secondary btn-pill"
            style={{ fontSize: '0.75rem', padding: '5px 12px' }}
          >
            <FileCode size={13} />
            <span>{showLogs ? 'Hide Lexer Trace' : 'View Lexer Trace'}</span>
          </button>
        </div>
      </div>

      {/* Lexer Trace Accordion */}
      {showLogs && logs && logs.length > 0 && (
        <div style={{ marginBottom: '16px' }} className="fade-in">
          <div style={{ fontSize: '0.75rem', fontWeight: '600', color: 'var(--accent-cyan)', marginBottom: '6px' }}>
            SCANNER EXECUTION LOG:
          </div>
          <pre
            style={{
              background: '#070a12',
              border: '1px solid var(--border-subtle)',
              borderRadius: 'var(--radius-sm)',
              padding: '12px 14px',
              fontSize: '0.8rem',
              fontFamily: 'var(--font-mono)',
              color: '#cbd5e1',
              maxHeight: '160px',
              overflowY: 'auto',
              lineHeight: '1.4'
            }}
          >
            {logs.map((log, i) => (
              <div key={i}>[{i + 1}] {log}</div>
            ))}
          </pre>
        </div>
      )}

      {/* Token Table */}
      <div className="table-responsive">
        <table className="custom-table">
          <thead>
            <tr>
              <th style={{ width: '80px' }}>Token #</th>
              <th>Lexeme</th>
              <th>Type</th>
              <th>Position</th>
              <th>Description</th>
            </tr>
          </thead>
          <tbody>
            {filteredTokens.map((t) => (
              <tr key={t.id}>
                <td style={{ fontFamily: 'var(--font-mono)', color: 'var(--text-muted)' }}>
                  #{t.id}
                </td>
                <td>
                  <span
                    style={{
                      fontFamily: 'var(--font-mono)',
                      fontSize: '0.95rem',
                      fontWeight: '700',
                      color: '#ffffff',
                      background: 'rgba(255, 255, 255, 0.06)',
                      padding: '3px 8px',
                      borderRadius: '4px',
                      border: '1px solid rgba(255, 255, 255, 0.08)'
                    }}
                  >
                    {t.lexeme}
                  </span>
                </td>
                <td>
                  <span className={`badge ${getBadgeClass(t.type)}`}>
                    {t.type}
                  </span>
                </td>
                <td style={{ fontFamily: 'var(--font-mono)', fontSize: '0.85rem' }}>
                  {t.start === t.end ? `Col ${t.start}` : `Cols ${t.start}-${t.end}`}
                </td>
                <td style={{ color: 'var(--text-muted)', fontSize: '0.825rem' }}>
                  {t.description || t.type}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
