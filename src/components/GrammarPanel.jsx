import React, { useState } from 'react';
import { BookOpen, Layers, ShieldCheck, ChevronDown, ChevronUp } from 'lucide-react';

export default function GrammarPanel() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="glass-card highlight-purple">
      <div
        className="card-header"
        onClick={() => setIsOpen(!isOpen)}
        style={{ cursor: 'pointer', marginBottom: isOpen ? '20px' : '0', borderBottom: isOpen ? '1px solid var(--border-subtle)' : 'none' }}
      >
        <div className="card-title-group">
          <div className="card-icon" style={{ background: 'rgba(192, 132, 252, 0.15)', color: 'var(--accent-purple)' }}>
            <BookOpen size={20} />
          </div>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <h3 className="card-title">Grammar & Operator Precedence Theory</h3>
              <span className="badge badge-purple" style={{ fontSize: '0.7rem' }}>CFG Reference</span>
            </div>
            <p className="card-subtitle">
              Formal Context-Free Grammar (CFG) rules used by the Recursive Descent Parser.
            </p>
          </div>
        </div>

        <button
          className="btn btn-secondary btn-pill"
          style={{ padding: '6px 12px', fontSize: '0.75rem' }}
        >
          {isOpen ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
          <span>{isOpen ? 'Collapse' : 'Expand Theory'}</span>
        </button>
      </div>

      {isOpen && (
        <div className="fade-in" style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          
          {/* Grammar & Non-Terminals */}
          <div className="grid-2">
            <div>
              <h4 style={{ fontSize: '0.9rem', color: 'var(--accent-cyan)', marginBottom: '10px', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
                Context-Free Grammar (BNF / EBNF):
              </h4>
              <div
                style={{
                  background: '#070a12',
                  border: '1px solid var(--border-subtle)',
                  borderRadius: 'var(--radius-md)',
                  padding: '16px',
                  fontFamily: 'var(--font-mono)',
                  fontSize: '0.875rem',
                  lineHeight: '1.8',
                  color: '#e2e8f0'
                }}
              >
                <div>
                  <span style={{ color: 'var(--accent-cyan)', fontWeight: '700' }}>Expression</span>
                  <span style={{ color: 'var(--text-dim)' }}> → </span>
                  <span>Term ((PLUS | MINUS) Term)*</span>
                </div>
                <div>
                  <span style={{ color: 'var(--accent-indigo)', fontWeight: '700' }}>Term</span>
                  <span style={{ color: 'var(--text-dim)' }}> → </span>
                  <span>Factor ((MULTIPLY | DIVIDE) Factor)*</span>
                </div>
                <div>
                  <span style={{ color: 'var(--accent-emerald)', fontWeight: '700' }}>Factor</span>
                  <span style={{ color: 'var(--text-dim)' }}> → </span>
                  <span>NUMBER | IDENTIFIER | '(' Expression ')'</span>
                </div>
              </div>
            </div>

            <div>
              <h4 style={{ fontSize: '0.9rem', color: 'var(--accent-purple)', marginBottom: '10px', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
                Non-Terminal Explanations:
              </h4>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', fontSize: '0.85rem' }}>
                <div style={{ padding: '10px 14px', borderRadius: 'var(--radius-sm)', background: 'rgba(56, 189, 248, 0.06)', border: '1px solid rgba(56, 189, 248, 0.2)' }}>
                  <strong style={{ color: 'var(--accent-cyan)' }}>Expression: </strong>
                  Handles lowest precedence operators (<code style={{ color: '#fff' }}>+</code> and <code style={{ color: '#fff' }}>-</code>). Evaluated left-to-right.
                </div>
                <div style={{ padding: '10px 14px', borderRadius: 'var(--radius-sm)', background: 'rgba(129, 140, 248, 0.06)', border: '1px solid rgba(129, 140, 248, 0.2)' }}>
                  <strong style={{ color: 'var(--accent-indigo)' }}>Term: </strong>
                  Handles intermediate precedence operators (<code style={{ color: '#fff' }}>*</code> and <code style={{ color: '#fff' }}>/</code>). Evaluated left-to-right.
                </div>
                <div style={{ padding: '10px 14px', borderRadius: 'var(--radius-sm)', background: 'rgba(52, 211, 153, 0.06)', border: '1px solid rgba(52, 211, 153, 0.2)' }}>
                  <strong style={{ color: 'var(--accent-emerald)' }}>Factor: </strong>
                  Handles highest precedence operands: atomic numbers, variable identifiers, and nested parenthesized expressions <code style={{ color: '#fff' }}>(Expression)</code>.
                </div>
              </div>
            </div>
          </div>

          {/* Precedence Table */}
          <div>
            <h4 style={{ fontSize: '0.9rem', color: 'var(--accent-amber)', marginBottom: '10px', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
              Operator Precedence & Associativity:
            </h4>
            <div className="table-responsive">
              <table className="custom-table">
                <thead>
                  <tr>
                    <th>Precedence Rank</th>
                    <th>Operators</th>
                    <th>Associativity</th>
                    <th>Binding Power</th>
                    <th>Concrete Example</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td><span className="badge badge-purple">1 (Highest)</span></td>
                    <td style={{ fontFamily: 'var(--font-mono)', fontWeight: '700' }}>( ... )</td>
                    <td>Inside-Out</td>
                    <td>Encloses complete sub-expressions</td>
                    <td style={{ fontFamily: 'var(--font-mono)' }}>(a + b) * c</td>
                  </tr>
                  <tr>
                    <td><span className="badge badge-cyan">2 (Intermediate)</span></td>
                    <td style={{ fontFamily: 'var(--font-mono)', fontWeight: '700' }}>* , /</td>
                    <td>Left-to-Right</td>
                    <td>Binds tighter than addition/subtraction</td>
                    <td style={{ fontFamily: 'var(--font-mono)' }}>a + b * c → a + (b * c)</td>
                  </tr>
                  <tr>
                    <td><span className="badge badge-emerald">3 (Lowest)</span></td>
                    <td style={{ fontFamily: 'var(--font-mono)', fontWeight: '700' }}>+ , -</td>
                    <td>Left-to-Right</td>
                    <td>Evaluated after multiplication/division</td>
                    <td style={{ fontFamily: 'var(--font-mono)' }}>x - y - z → (x - y) - z</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>

        </div>
      )}
    </div>
  );
}
