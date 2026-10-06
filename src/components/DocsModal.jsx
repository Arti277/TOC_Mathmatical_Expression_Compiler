import React, { useState } from 'react';
import { BookOpen, FileText, HelpCircle, Presentation, X, Check, Copy } from 'lucide-react';

export default function DocsModal({ isOpen, onClose, initialTab = 'REPORT' }) {
  const [activeTab, setActiveTab] = useState(initialTab); // 'REPORT' | 'VIVA' | 'PRESENTATION'
  const [copied, setCopied] = useState(false);

  if (!isOpen) return null;

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
        maxWidth: '920px',
        width: '100%',
        maxHeight: '90vh',
        display: 'flex',
        flexDirection: 'column',
        background: '#0f172a',
        border: '1px solid rgba(56, 189, 248, 0.3)',
        boxShadow: '0 20px 40px rgba(0, 0, 0, 0.8)'
      }}>
        {/* Header */}
        <div className="card-header" style={{ marginBottom: '16px', flexShrink: 0 }}>
          <div className="card-title-group">
            <div className="card-icon" style={{ background: 'rgba(129, 140, 248, 0.15)', color: 'var(--accent-indigo)' }}>
              <BookOpen size={20} />
            </div>
            <div>
              <h3 className="card-title">Project Documentation & Viva Prep</h3>
              <p className="card-subtitle">Case Study 17: Mathematical Expression Compiler Front-End • Group 17</p>
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

        {/* Tab switchers */}
        <div style={{
          display: 'flex',
          gap: '8px',
          marginBottom: '16px',
          borderBottom: '1px solid var(--border-subtle)',
          paddingBottom: '12px',
          flexShrink: 0
        }}>
          <button
            onClick={() => setActiveTab('REPORT')}
            className={`btn btn-pill ${activeTab === 'REPORT' ? 'btn-primary' : 'btn-secondary'}`}
            style={{ fontSize: '0.8rem' }}
          >
            <FileText size={14} />
            <span>Project Report Overview</span>
          </button>

          <button
            onClick={() => setActiveTab('VIVA')}
            className={`btn btn-pill ${activeTab === 'VIVA' ? 'btn-primary' : 'btn-secondary'}`}
            style={{ fontSize: '0.8rem' }}
          >
            <HelpCircle size={14} />
            <span>Viva Preparation (30+ Q&A)</span>
          </button>

          <button
            onClick={() => setActiveTab('PRESENTATION')}
            className={`btn btn-pill ${activeTab === 'PRESENTATION' ? 'btn-primary' : 'btn-secondary'}`}
            style={{ fontSize: '0.8rem' }}
          >
            <Presentation size={14} />
            <span>Presentation Slides (12 Slides)</span>
          </button>
        </div>

        {/* Content Body */}
        <div style={{ overflowY: 'auto', flexGrow: 1, paddingRight: '8px', lineHeight: '1.7', fontSize: '0.9rem', color: '#cbd5e1' }}>
          
          {activeTab === 'REPORT' && (
            <div className="fade-in">
              <h2 style={{ color: 'var(--accent-cyan)', fontSize: '1.3rem', marginBottom: '8px' }}>
                Case Study 17: Mathematical Expression Compiler Front-End
              </h2>
              <p style={{ color: 'var(--text-muted)', marginBottom: '16px' }}>
                <strong>Group 17:</strong> Gidhad Arti, Rashinkar Sanket, Raut Vaishnavi, Karle Renuka
              </p>

              <div style={{ background: 'rgba(30, 41, 59, 0.5)', padding: '14px', borderRadius: 'var(--radius-md)', marginBottom: '16px', border: '1px solid var(--border-subtle)' }}>
                <strong style={{ color: '#ffffff' }}>Problem Statement:</strong><br />
                Before generating machine code, a compiler parses arithmetic expressions, checks syntax, and constructs an intermediate representation. Build the front-end of a simple expression compiler.
              </div>

              <h3 style={{ color: 'var(--accent-indigo)', fontSize: '1.1rem', marginTop: '16px', marginBottom: '8px' }}>
                Compiler Front-End Architecture
              </h3>
              <p>
                A compiler translates high-level source code into target machine code. The compilation process is broadly divided into two major phases:
              </p>
              <ul style={{ marginLeft: '20px', marginTop: '8px', marginBottom: '14px' }}>
                <li><strong>Front-End (Analysis Phase):</strong> Lexical Analysis → Syntax Analysis → Semantic / AST Construction → Intermediate Code Generation (Three Address Code). Machine-independent.</li>
                <li><strong>Back-End (Synthesis Phase):</strong> Machine-dependent optimization, register allocation, and target assembly/machine code generation.</li>
              </ul>

              <h3 style={{ color: 'var(--accent-indigo)', fontSize: '1.1rem', marginTop: '16px', marginBottom: '8px' }}>
                Formal Grammar Implemented
              </h3>
              <pre className="code-block" style={{ marginBottom: '14px' }}>
Expression → Term ((PLUS | MINUS) Term)*{'\n'}
Term       → Factor ((MULTIPLY | DIVIDE) Factor)*{'\n'}
Factor     → NUMBER | IDENTIFIER | LPAREN Expression RPAREN
              </pre>

              <h3 style={{ color: 'var(--accent-indigo)', fontSize: '1.1rem', marginTop: '16px', marginBottom: '8px' }}>
                Key Technical Highlights
              </h3>
              <ul style={{ marginLeft: '20px', marginBottom: '14px' }}>
                <li><strong>Recursive Descent Parser:</strong> Implemented purely in JavaScript without parser generators (such as Lex/Yacc/Bison), making it educational and transparent.</li>
                <li><strong>True AST Generation:</strong> Dynamically builds node hierarchy (`BinaryOpNode`, `NumberNode`, `IdentifierNode`).</li>
                <li><strong>Dynamic Tree Layout:</strong> Pure SVG dynamic layout algorithm calculates precise (x, y) coordinates for nodes and links without overlap.</li>
                <li><strong>Three Address Code (TAC):</strong> Generates linear TAC, Quadruples, and Triples using bottom-up post-order reduction with temporary variables (`t1, t2, ...`).</li>
                <li><strong>Pinpoint Error Diagnosis:</strong> Pinpoints exact column position with ASCII carets (`^`) for invalid characters, missing operands, unclosed parentheses, and consecutive operators.</li>
              </ul>
              
              <div style={{ marginTop: '20px', padding: '12px', background: 'rgba(56, 189, 248, 0.08)', borderRadius: '8px', border: '1px solid rgba(56, 189, 248, 0.3)' }}>
                <strong>Full Report File:</strong> Complete academic report is saved in <code style={{ color: 'var(--accent-cyan)' }}>documentation/PROJECT_REPORT.md</code>.
              </div>
            </div>
          )}

          {activeTab === 'VIVA' && (
            <div className="fade-in">
              <h2 style={{ color: 'var(--accent-cyan)', fontSize: '1.3rem', marginBottom: '8px' }}>
                Viva Preparation & Key Examiner Questions (Sample)
              </h2>
              <p style={{ color: 'var(--text-muted)', marginBottom: '16px' }}>
                Complete list of 30+ Viva Questions is available in <code style={{ color: 'var(--accent-cyan)' }}>documentation/VIVA_QUESTIONS.md</code>.
              </p>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
                <div style={{ background: 'rgba(30, 41, 59, 0.4)', padding: '12px 16px', borderRadius: '8px', border: '1px solid var(--border-subtle)' }}>
                  <div style={{ color: 'var(--accent-cyan)', fontWeight: '700', marginBottom: '4px' }}>
                    Q1: What is a compiler front-end and how does it differ from the back-end?
                  </div>
                  <div style={{ color: '#cbd5e1' }}>
                    <strong>Answer:</strong> The compiler front-end is machine-independent. It analyzes the source program (Lexical Analysis, Syntax Analysis, Semantic Analysis) and generates an Intermediate Representation (IR) such as Three Address Code. The back-end is machine-dependent; it optimizes the IR and produces target assembly/machine code for a specific CPU architecture.
                  </div>
                </div>

                <div style={{ background: 'rgba(30, 41, 59, 0.4)', padding: '12px 16px', borderRadius: '8px', border: '1px solid var(--border-subtle)' }}>
                  <div style={{ color: 'var(--accent-cyan)', fontWeight: '700', marginBottom: '4px' }}>
                    Q2: Why did you choose Recursive Descent Parsing for this project?
                  </div>
                  <div style={{ color: '#cbd5e1' }}>
                    <strong>Answer:</strong> Recursive Descent Parsing is a top-down parsing technique where each non-terminal in the grammar corresponds to a dedicated JavaScript function (`parseExpression`, `parseTerm`, `parseFactor`). It is intuitive, directly mirrors the formal grammar, and facilitates highly informative syntax error diagnosis with exact position pointers.
                  </div>
                </div>

                <div style={{ background: 'rgba(30, 41, 59, 0.4)', padding: '12px 16px', borderRadius: '8px', border: '1px solid var(--border-subtle)' }}>
                  <div style={{ color: 'var(--accent-cyan)', fontWeight: '700', marginBottom: '4px' }}>
                    Q3: How does the grammar enforce operator precedence?
                  </div>
                  <div style={{ color: '#cbd5e1' }}>
                    <strong>Answer:</strong> By nesting grammar rules. `Expression` handles `+` and `-`. `Term` handles `*` and `/`. `Factor` handles atomic operands and `(Expression)`. When parsing `a + b * c`, the parser evaluates `parseTerm()` for `b * c` before combining it into the addition binary tree, guaranteeing `*` has higher binding power than `+`.
                  </div>
                </div>

                <div style={{ background: 'rgba(30, 41, 59, 0.4)', padding: '12px 16px', borderRadius: '8px', border: '1px solid var(--border-subtle)' }}>
                  <div style={{ color: 'var(--accent-cyan)', fontWeight: '700', marginBottom: '4px' }}>
                    Q4: What is Three Address Code (TAC) and why are temporary variables needed?
                  </div>
                  <div style={{ color: '#cbd5e1' }}>
                    <strong>Answer:</strong> TAC is a linearized intermediate representation where each statement contains at most three addresses (two operands and one result): `x = y op z`. Complex hierarchical expressions like `(a + b) * (c - d)` cannot be executed in a single machine instruction; temporary variables (`t1, t2, t3`) store intermediate results, bridging high-level trees to low-level assembly registers.
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'PRESENTATION' && (
            <div className="fade-in">
              <h2 style={{ color: 'var(--accent-cyan)', fontSize: '1.3rem', marginBottom: '8px' }}>
                12-Slide Presentation Outline
              </h2>
              <p style={{ color: 'var(--text-muted)', marginBottom: '16px' }}>
                Ready-to-present slide notes. Full PPT script is saved in <code style={{ color: 'var(--accent-cyan)' }}>documentation/PRESENTATION.md</code> and PPTX file in <code style={{ color: 'var(--accent-cyan)' }}>documentation/ExpressionX_Presentation.pptx</code>.
              </p>

              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '12px' }}>
                {[
                  { num: 1, title: 'Title & Team', desc: 'Case Study 17: ExpressionX • Group 17' },
                  { num: 2, title: 'Problem Statement', desc: 'Need for compiler front-end parsing & IR' },
                  { num: 3, title: 'Objectives', desc: 'Dynamic lexer, parser, AST, and TAC generator' },
                  { num: 4, title: 'Compiler Architecture', desc: 'Front-End vs Back-End separation' },
                  { num: 5, title: 'Lexical Analysis', desc: 'Scanning tokens, lexemes, and position tracking' },
                  { num: 6, title: 'Syntax Analysis & CFG', desc: 'Recursive descent, operator precedence, associativity' },
                  { num: 7, title: 'Abstract Syntax Tree', desc: 'Dynamic post-order tree construction & visual SVG' },
                  { num: 8, title: 'Three Address Code (IR)', desc: 't1..tn temporary allocation, Quadruples & Triples' },
                  { num: 9, title: 'Error Detection Engine', desc: 'Visual pointer carets for syntax & lexical errors' },
                  { num: 10, title: 'Interactive Web UI', desc: 'Step-by-step mode, 18-test runner, dark theme' },
                  { num: 11, title: 'Test Cases & Results', desc: '100% pass rate across valid & invalid test suites' },
                  { num: 12, title: 'Conclusion & Future Scope', desc: 'Educational value & extension to code optimization' },
                ].map((s) => (
                  <div key={s.num} style={{ background: 'rgba(30, 41, 59, 0.4)', padding: '12px', borderRadius: '8px', border: '1px solid var(--border-subtle)' }}>
                    <div style={{ fontSize: '0.75rem', fontWeight: '700', color: 'var(--accent-cyan)' }}>SLIDE {s.num}</div>
                    <div style={{ fontWeight: '600', color: '#ffffff', fontSize: '0.9rem', margin: '3px 0' }}>{s.title}</div>
                    <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{s.desc}</div>
                  </div>
                ))}
              </div>
            </div>
          )}

        </div>

        {/* Footer */}
        <div style={{
          display: 'flex',
          justifyContent: 'flex-end',
          alignItems: 'center',
          marginTop: '16px',
          paddingTop: '12px',
          borderTop: '1px solid var(--border-subtle)',
          flexShrink: 0
        }}>
          <button onClick={onClose} className="btn btn-secondary" style={{ padding: '6px 18px' }}>
            Close Documentation
          </button>
        </div>
      </div>
    </div>
  );
}
