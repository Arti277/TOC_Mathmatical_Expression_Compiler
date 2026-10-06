import React, { useState } from 'react';
import { Users, CheckCircle, Terminal, FileText, X } from 'lucide-react';

export default function Header({ onOpenTests, onOpenDocs }) {
  const [showGroupModal, setShowGroupModal] = useState(false);

  const groupMembers = [
    {
      name: 'Gidhad Arti Annasaheb',
      roll: '01',
      role: 'Lexical Analysis & Tokenizer',
    },
    {
      name: 'Rashinkar Sanket Laxman',
      roll: '02',
      role: 'Recursive Descent Parser',
    },
    {
      name: 'Raut Vaishnavi Khanderao',
      roll: '03',
      role: 'AST Construction & Visualization',
    },
    {
      name: 'Karle Renuka Tukaram',
      roll: '04',
      role: 'Intermediate Code & Three Address Code',
    },
  ];

  return (
    <>
      <header className="site-header">

        {/* Brand */}
        <div className="header-brand">
          <div className="brand-mark" aria-hidden="true">
            <Terminal size={21} strokeWidth={2} />
          </div>

          <div>
            <h1 className="brand-title">ExpressionX</h1>
            <p className="brand-subtitle">
              Mathematical Expression Compiler Front-End
            </p>
          </div>
        </div>

        {/* Navigation */}
        <nav className="header-actions" aria-label="Project actions">

          <button
            onClick={onOpenTests}
            className="btn btn-outline-cyan"
            title="Run automated test suite"
          >
            <CheckCircle size={15} />
            <span>Test Suite</span>
          </button>

          <button
            onClick={() => setShowGroupModal(true)}
            className="btn btn-secondary"
            title="View project team"
          >
            <Users size={15} />
            <span>Team</span>
          </button>

          <button
            onClick={onOpenDocs}
            className="btn btn-secondary"
            title="View project documentation"
          >
            <FileText size={15} />
            <span>Project Docs</span>
          </button>

        </nav>
      </header>

      {/* Team Modal */}
      {showGroupModal && (
        <div
          className="modal-backdrop"
          onClick={() => setShowGroupModal(false)}
        >
          <div
            className="team-modal"
            role="dialog"
            aria-modal="true"
            aria-labelledby="team-modal-title"
            onClick={(e) => e.stopPropagation()}
          >

            <div className="modal-header">

              <div className="modal-heading">

                <div className="modal-icon">
                  <Users size={19} />
                </div>

                <div>
                  <h2 id="team-modal-title">
                    Project Team
                  </h2>

                  <p>
                    Compiler Design / Theory of Computation
                  </p>
                </div>

              </div>

              <button
                onClick={() => setShowGroupModal(false)}
                className="icon-button"
                aria-label="Close team window"
              >
                <X size={19} />
              </button>

            </div>

            <div className="project-note">

              <strong>Project:</strong>{' '}
              Mathematical Expression Compiler Front-End

              <br />

              A compiler front-end that performs lexical analysis,
              syntax parsing, AST construction and intermediate code generation.

            </div>

            <div className="team-list">

              {groupMembers.map((member) => (
                <div
                  className="team-member"
                  key={member.roll}
                >

                  <div className="member-number">
                    {member.roll}
                  </div>

                  <div className="member-details">

                    <div className="member-name">
                      {member.name}
                    </div>

                    <div className="member-role">
                      {member.role}
                    </div>

                  </div>

                </div>
              ))}

            </div>

            <button
              onClick={() => setShowGroupModal(false)}
              className="btn btn-primary modal-close"
            >
              Close
            </button>

          </div>
        </div>
      )}
    </>
  );
}