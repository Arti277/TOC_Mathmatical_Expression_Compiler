import React from 'react';
import {
  Play,
  RotateCcw,
  Sparkles,
  AlertTriangle,
} from 'lucide-react';

export default function ExpressionInput({
  input,
  onInputChange,
  onAnalyze,
  onClear,
}) {
  const examples = [
    {
      label: 'Standard Precedence',
      expr: 'a + b * c',
      type: 'valid',
    },
    {
      label: 'Parentheses Override',
      expr: '(a + b) * c',
      type: 'valid',
    },
    {
      label: 'Nested Complex',
      expr: 'x + y * (z - 5)',
      type: 'valid',
    },
    {
      label: 'Pure Numeric',
      expr: '10 + 20 * 5',
      type: 'valid',
    },
    {
      label: 'Dual Subtrees',
      expr: '(a + b) / (c - d)',
      type: 'valid',
    },
    {
      label: 'Identifiers',
      expr: 'price * quantity + tax',
      type: 'valid',
    },
    {
      label: 'Demo: Consecutive Op',
      expr: 'a + * b',
      type: 'invalid',
    },
    {
      label: 'Demo: Unclosed Paren',
      expr: '(a + b',
      type: 'invalid',
    },
    {
      label: 'Demo: Invalid Char @',
      expr: 'a + @ + b',
      type: 'invalid',
    },
  ];

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      onAnalyze();
    }
  };

  return (
    <section className="glass-card expression-card">

      {/* Heading */}
      <div className="card-header">

        <div className="card-title-group">

          <div className="card-icon">
            <Sparkles size={19} />
          </div>

          <div>
            <h2 className="card-title">
              Expression Input
            </h2>

            <p className="card-subtitle">
              Enter an arithmetic expression and analyze its compiler stages.
            </p>
          </div>

        </div>

      </div>

      <div className="expression-form">

        {/* Input label */}
        <label
          className="input-label"
          htmlFor="expression-input"
        >
          Mathematical expression
        </label>

        {/* Expression input */}
        <input
          id="expression-input"
          type="text"
          value={input}
          onChange={(e) => onInputChange(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="e.g. a + b * (c - 2)"
          autoFocus
          className="expression-field"
        />

        {/* Buttons */}
        <div className="input-actions">

          <div className="main-actions">

            <button
              onClick={onAnalyze}
              className="btn btn-primary"
            >
              <Play
                size={17}
                fill="currentColor"
              />

              <span>
                Analyze Expression
              </span>
            </button>

            <button
              onClick={onClear}
              className="btn btn-secondary"
            >
              <RotateCcw size={16} />

              <span>
                Clear
              </span>
            </button>

          </div>

          <div className="keyboard-hint">
            Press <kbd>Enter</kbd> to analyze
          </div>

        </div>

        {/* Examples */}
        <div className="examples-section">

          <div className="examples-heading">

            <span>
              Try an example
            </span>

            <span className="examples-note">
              Click an expression to load it
            </span>

          </div>

          <div className="example-list">

            {examples.map((item, idx) => (
              <button
                key={idx}
                onClick={() => onInputChange(item.expr)}
                className={`example-button ${
                  item.type === 'invalid'
                    ? 'example-invalid'
                    : ''
                }`}
                title={item.label}
              >

                {item.type === 'invalid' && (
                  <AlertTriangle size={12} />
                )}

                <span>
                  {item.expr}
                </span>

              </button>
            ))}

          </div>

        </div>

      </div>
    </section>
  );
}