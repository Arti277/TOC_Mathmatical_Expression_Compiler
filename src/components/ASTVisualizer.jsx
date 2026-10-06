import React, { useState } from 'react';
import { GitBranch, ZoomIn, ZoomOut, Maximize2, Code, Activity, Layers } from 'lucide-react';

export default function ASTVisualizer({ ast, layout, metrics }) {
  const [zoom, setZoom] = useState(1);
  const [showJson, setShowJson] = useState(false);

  if (!ast || !layout || layout.nodes.length === 0) {
    return (
      <div className="glass-card" style={{ padding: '24px' }}>
        <p style={{ color: 'var(--text-muted)', textAlign: 'center' }}>
          AST has not been generated yet. Enter a valid expression and click Analyze.
        </p>
      </div>
    );
  }

  // Node styles based on AST Node Type
  const getNodeFill = (node) => {
    if (node.type === 'BinaryOp') {
      return {
        bg: '#0284c7',
        border: '#38bdf8',
        text: '#ffffff',
        glow: 'rgba(56, 189, 248, 0.4)'
      };
    }
    if (node.type === 'Number') {
      return {
        bg: '#059669',
        border: '#34d399',
        text: '#ffffff',
        glow: 'rgba(52, 211, 153, 0.4)'
      };
    }
    // Identifier
    return {
      bg: '#7c3aed',
      border: '#c084fc',
      text: '#ffffff',
      glow: 'rgba(192, 132, 252, 0.4)'
    };
  };

  return (
    <div className="glass-card highlight-cyan">
      <div className="card-header">
        <div className="card-title-group">
          <div className="card-icon">
            <GitBranch size={20} />
          </div>
          <div>
            <h3 className="card-title">Abstract Syntax Tree (AST)</h3>
            <p className="card-subtitle">
              Hierarchical tree representation constructed from Recursive Descent Parser.
            </p>
          </div>
        </div>

        {/* Controls: Zoom & View toggle */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
          <div style={{ display: 'flex', alignItems: 'center', background: 'var(--bg-tertiary)', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border-subtle)' }}>
            <button
              onClick={() => setZoom(Math.max(0.6, zoom - 0.1))}
              className="btn btn-secondary"
              style={{ padding: '6px 10px', border: 'none', background: 'transparent' }}
              title="Zoom Out"
            >
              <ZoomOut size={14} />
            </button>
            <span style={{ fontSize: '0.75rem', fontFamily: 'var(--font-mono)', padding: '0 6px', color: 'var(--text-muted)' }}>
              {Math.round(zoom * 100)}%
            </span>
            <button
              onClick={() => setZoom(Math.min(1.6, zoom + 0.1))}
              className="btn btn-secondary"
              style={{ padding: '6px 10px', border: 'none', background: 'transparent' }}
              title="Zoom In"
            >
              <ZoomIn size={14} />
            </button>
            <button
              onClick={() => setZoom(1)}
              className="btn btn-secondary"
              style={{ padding: '6px 10px', border: 'none', background: 'transparent', borderLeft: '1px solid var(--border-subtle)' }}
              title="Reset Zoom"
            >
              <Maximize2 size={14} />
            </button>
          </div>

          <button
            onClick={() => setShowJson(!showJson)}
            className="btn btn-secondary btn-pill"
            style={{ fontSize: '0.75rem', padding: '5px 12px' }}
          >
            <Code size={13} />
            <span>{showJson ? 'View SVG Tree' : 'View AST JSON'}</span>
          </button>
        </div>
      </div>

      {/* Metrics Row */}
      {metrics && (
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(130px, 1fr))',
          gap: '12px',
          marginBottom: '20px'
        }}>
          <div style={{
            background: 'rgba(15, 23, 42, 0.6)',
            padding: '10px 14px',
            borderRadius: 'var(--radius-sm)',
            border: '1px solid var(--border-subtle)'
          }}>
            <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)', textTransform: 'uppercase' }}>Tree Depth</div>
            <div style={{ fontSize: '1.2rem', fontWeight: '700', color: 'var(--accent-cyan)', fontFamily: 'var(--font-mono)' }}>
              {metrics.maxDepth}
            </div>
          </div>

          <div style={{
            background: 'rgba(15, 23, 42, 0.6)',
            padding: '10px 14px',
            borderRadius: 'var(--radius-sm)',
            border: '1px solid var(--border-subtle)'
          }}>
            <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)', textTransform: 'uppercase' }}>Total Nodes</div>
            <div style={{ fontSize: '1.2rem', fontWeight: '700', color: 'var(--accent-indigo)', fontFamily: 'var(--font-mono)' }}>
              {metrics.totalNodes}
            </div>
          </div>

          <div style={{
            background: 'rgba(15, 23, 42, 0.6)',
            padding: '10px 14px',
            borderRadius: 'var(--radius-sm)',
            border: '1px solid var(--border-subtle)'
          }}>
            <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)', textTransform: 'uppercase' }}>Operators</div>
            <div style={{ fontSize: '1.2rem', fontWeight: '700', color: 'var(--accent-rose)', fontFamily: 'var(--font-mono)' }}>
              {metrics.operators}
            </div>
          </div>

          <div style={{
            background: 'rgba(15, 23, 42, 0.6)',
            padding: '10px 14px',
            borderRadius: 'var(--radius-sm)',
            border: '1px solid var(--border-subtle)'
          }}>
            <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)', textTransform: 'uppercase' }}>Leaves (Operands)</div>
            <div style={{ fontSize: '1.2rem', fontWeight: '700', color: 'var(--accent-emerald)', fontFamily: 'var(--font-mono)' }}>
              {metrics.leaves}
            </div>
          </div>
        </div>
      )}

      {/* View Toggle: Visual SVG vs Raw JSON */}
      {showJson ? (
        <div className="fade-in">
          <pre
            style={{
              background: '#070a12',
              border: '1px solid var(--border-subtle)',
              borderRadius: 'var(--radius-md)',
              padding: '16px',
              color: '#38bdf8',
              fontFamily: 'var(--font-mono)',
              fontSize: '0.85rem',
              maxHeight: '420px',
              overflowY: 'auto'
            }}
          >
            {JSON.stringify(ast, null, 2)}
          </pre>
        </div>
      ) : (
        <div
          style={{
            width: '100%',
            overflowX: 'auto',
            background: '#070a12',
            border: '1px solid var(--border-subtle)',
            borderRadius: 'var(--radius-md)',
            padding: '24px',
            display: 'flex',
            justifyContent: 'center',
            minHeight: '340px'
          }}
        >
          <div
            style={{
              transform: `scale(${zoom})`,
              transformOrigin: 'top center',
              transition: 'transform 0.15s ease',
              width: layout.width,
              height: layout.height,
              position: 'relative'
            }}
          >
            <svg
              width={layout.width}
              height={layout.height}
              style={{ overflow: 'visible' }}
            >
              <defs>
                <linearGradient id="linkGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="#38bdf8" stopOpacity="0.8" />
                  <stop offset="100%" stopColor="#818cf8" stopOpacity="0.8" />
                </linearGradient>
              </defs>

              {/* Connecting Lines between Parent and Children */}
              {layout.links.map((link) => (
                <path
                  key={link.id}
                  d={`M ${link.source.x} ${link.source.y} L ${link.target.x} ${link.target.y}`}
                  stroke="url(#linkGrad)"
                  strokeWidth="2.5"
                  strokeLinecap="round"
                />
              ))}

              {/* Render AST Nodes */}
              {layout.nodes.map((node) => {
                const style = getNodeFill(node);
                const isOp = node.type === 'BinaryOp';
                const radius = 24;

                return (
                  <g key={node.id} transform={`translate(${node.x}, ${node.y})`}>
                    {/* Outer Glow */}
                    <circle
                      r={radius + 4}
                      fill="none"
                      stroke={style.border}
                      strokeWidth="1.5"
                      strokeOpacity="0.4"
                    />

                    {/* Node Body */}
                    <circle
                      r={radius}
                      fill={style.bg}
                      stroke={style.border}
                      strokeWidth="2"
                    />

                    {/* Node Text Label */}
                    <text
                      textAnchor="middle"
                      dy="0.35em"
                      fill={style.text}
                      fontFamily="var(--font-mono)"
                      fontWeight="700"
                      fontSize={isOp ? '1.25rem' : '0.95rem'}
                    >
                      {node.label}
                    </text>

                    {/* Node Type Pill Below */}
                    <rect
                      x="-32"
                      y={radius + 5}
                      width="64"
                      height="15"
                      rx="4"
                      fill="rgba(15, 23, 42, 0.9)"
                      stroke="rgba(255, 255, 255, 0.15)"
                      strokeWidth="0.8"
                    />
                    <text
                      x="0"
                      y={radius + 16}
                      textAnchor="middle"
                      fill="var(--text-muted)"
                      fontSize="9px"
                      fontFamily="var(--font-sans)"
                      fontWeight="600"
                    >
                      {node.type === 'BinaryOp' ? 'OPERATOR' : node.type.toUpperCase()}
                    </text>
                  </g>
                );
              })}
            </svg>
          </div>
        </div>
      )}

      {/* Legend */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        gap: '24px',
        marginTop: '16px',
        flexWrap: 'wrap',
        fontSize: '0.75rem',
        color: 'var(--text-muted)'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
          <span style={{ width: '12px', height: '12px', borderRadius: '50%', background: '#0284c7', border: '1px solid #38bdf8' }} />
          <span>Binary Operators (+, -, *, /)</span>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
          <span style={{ width: '12px', height: '12px', borderRadius: '50%', background: '#7c3aed', border: '1px solid #c084fc' }} />
          <span>Identifiers (Variables)</span>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
          <span style={{ width: '12px', height: '12px', borderRadius: '50%', background: '#059669', border: '1px solid #34d399' }} />
          <span>Numeric Literals</span>
        </div>
      </div>
    </div>
  );
}
