import React from 'react';

export default function Footer({
  onOpenDocs,
  onOpenViva,
}) {
  return (
    <footer className="site-footer">

      <div className="footer-main">

        <div>

          <div className="footer-title">
            ExpressionX
          </div>

          <p className="footer-description">
            Mathematical Expression Compiler Front-End —
            lexical analysis, recursive descent parsing,
            AST construction and three-address code generation.
          </p>

        </div>

        <div className="footer-links">

          <button onClick={onOpenDocs}>
            Project Report
          </button>

          <span aria-hidden="true">
            •
          </span>

          <button onClick={onOpenViva}>
            Viva Questions
          </button>

        </div>

      </div>

      <div className="footer-bottom">

        <span>
          Compiler Design / Theory of Computation
        </span>

        <span>
          Built with React + Vite
        </span>

      </div>

    </footer>
  );
}