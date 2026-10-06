import React from 'react';
import { Check, X, ArrowRight, Play, Terminal, Layers, GitBranch, Cpu, ListOrdered } from 'lucide-react';

export default function StepProgress({ stages, error, currentStep, isStepMode, onStepChange, onToggleStepMode }) {
  const steps = [
    { id: 1, key: 'input', label: 'Input Expression', icon: Terminal, desc: 'Raw mathematical string' },
    { id: 2, key: 'lexer', label: 'Lexical Analysis', icon: ListOrdered, desc: 'Character scanner' },
    { id: 3, key: 'tokens', label: 'Tokens Generated', icon: Layers, desc: 'Lexemes & Token stream' },
    { id: 4, key: 'parser', label: 'Syntax Parsing', icon: Layers, desc: 'Recursive descent CFG' },
    { id: 5, key: 'ast', label: 'AST Construction', icon: GitBranch, desc: 'Abstract Syntax Tree' },
    { id: 6, key: 'ir', label: 'Intermediate Representation', icon: Cpu, desc: 'Post-order reduction' },
    { id: 7, key: 'tac', label: 'Three Address Code', icon: Terminal, desc: 'Linearized t1, t2, ...' }
  ];

  // Helper to determine status of each pipeline stage
  function getStageStatus(stepKey, stepId) {
    if (error) {
      if (error.stage === 'INPUT_VALIDATION' && stepId >= 1) return 'failed';
      if (error.stage === 'LEXICAL_ANALYSIS' && stepId >= 2) return stepId === 2 ? 'failed' : 'blocked';
      if (error.stage === 'SYNTAX_ANALYSIS' && stepId >= 4) return stepId === 4 ? 'failed' : 'blocked';
      if (error.stage === 'AST_GENERATION' && stepId >= 5) return stepId === 5 ? 'failed' : 'blocked';
      if (error.stage === 'TAC_GENERATION' && stepId >= 6) return stepId === 6 ? 'failed' : 'blocked';
    }

    if (stepKey === 'input') return stages.input.completed ? 'completed' : 'pending';
    if (stepKey === 'lexer') return stages.lexer.completed ? 'completed' : 'pending';
    if (stepKey === 'tokens') return stages.lexer.completed ? 'completed' : 'pending';
    if (stepKey === 'parser') return stages.parser.completed ? 'completed' : 'pending';
    if (stepKey === 'ast') return stages.ast.completed ? 'completed' : 'pending';
    if (stepKey === 'ir') return stages.tac.completed ? 'completed' : 'pending';
    if (stepKey === 'tac') return stages.tac.completed ? 'completed' : 'pending';

    return 'pending';
  }

  return (
    <div className="glass-card" style={{ padding: '20px' }}>
      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        flexWrap: 'wrap',
        gap: '12px',
        marginBottom: '16px'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <span style={{ fontSize: '0.9rem', fontWeight: '700', textTransform: 'uppercase', letterSpacing: '0.05em', color: 'var(--accent-cyan)' }}>
            Compiler Front-End Pipeline
          </span>
          <span className="badge badge-purple" style={{ fontSize: '0.7rem' }}>Live State</span>
        </div>

        <button
          onClick={onToggleStepMode}
          className={`btn btn-pill ${isStepMode ? 'btn-primary' : 'btn-secondary'}`}
          style={{ fontSize: '0.775rem', padding: '6px 14px' }}
        >
          <Play size={14} />
          <span>{isStepMode ? 'Exit Step-by-Step Mode' : 'Enable Step-by-Step Mode'}</span>
        </button>
      </div>

      {/* Stepper Grid / Horizontal Trail */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(130px, 1fr))',
        gap: '10px',
        position: 'relative'
      }}>
        {steps.map((s, index) => {
          const status = getStageStatus(s.key, s.id);
          const isSelected = isStepMode && currentStep === s.id;
          const Icon = s.icon;

          let bg = 'rgba(30, 41, 59, 0.4)';
          let borderColor = 'var(--border-subtle)';
          let iconColor = 'var(--text-dim)';
          let statusBadge = null;

          if (status === 'completed') {
            bg = 'rgba(52, 211, 153, 0.08)';
            borderColor = 'rgba(52, 211, 153, 0.35)';
            iconColor = 'var(--accent-emerald)';
            statusBadge = <Check size={12} color="var(--accent-emerald)" strokeWidth={3} />;
          } else if (status === 'failed') {
            bg = 'rgba(244, 63, 94, 0.12)';
            borderColor = 'rgba(244, 63, 94, 0.5)';
            iconColor = 'var(--accent-rose)';
            statusBadge = <X size={12} color="var(--accent-rose)" strokeWidth={3} />;
          } else if (status === 'blocked') {
            bg = 'rgba(15, 23, 42, 0.4)';
            borderColor = 'rgba(255, 255, 255, 0.03)';
            iconColor = '#475569';
          }

          if (isSelected) {
            borderColor = 'var(--accent-cyan)';
            bg = 'rgba(56, 189, 248, 0.16)';
          }

          return (
            <div
              key={s.id}
              onClick={() => isStepMode && onStepChange(s.id)}
              style={{
                background: bg,
                border: `1px solid ${borderColor}`,
                borderRadius: 'var(--radius-md)',
                padding: '12px 10px',
                display: 'flex',
                flexDirection: 'column',
                gap: '8px',
                cursor: isStepMode ? 'pointer' : 'default',
                transition: 'all 0.2s ease',
                position: 'relative',
                boxShadow: isSelected ? '0 0 16px rgba(56, 189, 248, 0.25)' : 'none'
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <span style={{
                  fontSize: '0.7rem',
                  fontWeight: '700',
                  color: isSelected ? 'var(--accent-cyan)' : 'var(--text-muted)'
                }}>
                  STEP {s.id}
                </span>
                {statusBadge}
              </div>

              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <Icon size={16} color={iconColor} />
                <span style={{
                  fontSize: '0.8rem',
                  fontWeight: '600',
                  color: status === 'failed' ? 'var(--accent-rose)' : 'var(--text-main)',
                  lineHeight: '1.2'
                }}>
                  {s.label}
                </span>
              </div>

              <span style={{ fontSize: '0.7rem', color: 'var(--text-dim)', lineHeight: '1.3' }}>
                {s.desc}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
}
