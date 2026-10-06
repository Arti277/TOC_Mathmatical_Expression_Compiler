# TOC_Mathmatical_Expression_Compiler
Mathematical Expression Compiler Front-End

📌 Project Overview

The Mathematical Expression Compiler Front-End is a Theory of Computation case study that demonstrates how a compiler front-end processes arithmetic expressions before code generation.

The project takes a mathematical expression such as:

x + y * (z - 5)

and processes it through multiple stages:

Input Expression
       ↓
Lexical Analysis
       ↓
Tokens
       ↓
Syntax Analysis / Parsing
       ↓
Abstract Syntax Tree (AST)
       ↓
Three Address Code (TAC)

The system also detects and reports syntax errors in invalid expressions.

🎯 Objectives

The main objectives of this project are:

Understand the role of a compiler front-end.

Perform lexical analysis of mathematical expressions.

Identify identifiers, numbers, operators, and parentheses.

Define and apply grammar for arithmetic expressions.

Perform syntax analysis.

Handle operator precedence and associativity.

Construct an Abstract Syntax Tree (AST).

Generate Three Address Code (TAC).

Detect and report syntax errors.

Demonstrate the complete expression-processing workflow.

🧠 Core Concepts Used

1. Compiler Front-End

The compiler front-end analyzes the source expression before machine-code generation.

It mainly performs:

Lexical analysis

Syntax analysis

Structural representation

Intermediate representation generation

Error detection

2. Lexical Analysis

Lexical analysis converts the raw input characters into meaningful tokens.

For example:

x + y * (z - 5)

is divided into:

x
+
y
*
(
z
-
5
)

The corresponding token types are:

Lexeme

Token

x

IDENTIFIER

+

PLUS

y

IDENTIFIER

*

MULTIPLY

(

LEFT_PAREN

z

IDENTIFIER

-

MINUS

5

NUMBER

)

RIGHT_PAREN

3. Grammar

The project uses the following grammar for arithmetic expressions:

Expression → Term ((+ | -) Term)*

Term → Factor ((* | /) Factor)*

Factor → NUMBER | IDENTIFIER | ( Expression )

The grammar separates operators into different levels.

Expression handles + and -.

Term handles * and /.

Factor handles numbers, identifiers, and parenthesized expressions.

This structure helps the parser correctly handle operator precedence.

⚡ Operator Precedence

The project follows this precedence:

Highest
   ↓
( )
   ↓
* /
   ↓
+ -
   ↓
Lowest

For:

x + y * (z - 5)

the expression is interpreted as:

x + (y * (z - 5))

The parentheses are handled first, followed by multiplication, and then addition.

🌳 Abstract Syntax Tree (AST)

An Abstract Syntax Tree represents the hierarchical structure of an expression.

For:

a + b * (c - 2)

the AST is conceptually:

          +
        /   \
       a     *
            / \
           b   -
              / \
             c   2

In the AST:

Operators are internal nodes.

Operands are leaf nodes.

The tree structure represents operator precedence and evaluation order.

💻 Three Address Code (TAC)

Three Address Code (TAC) is an intermediate representation used to express an operation using simple instructions and temporary variables.

For:

a + b * (c - 2)

the generated TAC is:

t1 = c - 2
t2 = b * t1
t3 = a + t2

Why temporary variables?

Temporary variables store intermediate results so that a complex expression can be represented as a sequence of simple operations.

🔄 Complete Processing Workflow

The project follows this workflow:

                START
                  ↓
          Read Expression
                  ↓
          Lexical Analysis
                  ↓
               Tokens
                  ↓
          Syntax Analysis
                  ↓
           Syntax Valid?
             /       \
           NO         YES
           ↓           ↓
     Error Message    AST
                       ↓
                  Generate TAC
                       ↓
                  Final Output
                       ↓
                      END

Each phase passes its output to the next phase.

Characters → Tokens → Syntax Structure → AST → TAC

🧪 Working Example

Input

x + y * (z - 5)

Step 1: Tokenization

x → ID
+ → OPERATOR
y → ID
* → OPERATOR
( → LPAREN
z → ID
- → OPERATOR
5 → NUMBER
) → RPAREN

Step 2: Syntax Checking

The parser checks:

Parentheses are matched.

Operands and operators appear in the correct order.

The expression follows the grammar.

Result:

VALID EXPRESSION

Step 3: AST

          +
        /   \
       x     *
            / \
           y   -
              / \
             z   5

Step 4: Three Address Code

t1 = z - 5
t2 = y * t1
t3 = x + t2

🚨 Syntax Error Handling

The project also detects invalid expressions and provides meaningful error messages.

Example 1

Input:

a + * b

Output:

Syntax Error
Unexpected '*'
Expected operand

Example 2

Input:

(a + b

Output:

Syntax Error
Missing closing parenthesis ')'

Example 3

Input:

a / b)

Output:

Syntax Error
Unexpected ')'

Meaningful error messages make it easier to identify and correct invalid expressions.

🧩 Project Components

The front-end is divided into the following logical components:

Component

Responsibility

Lexer / Tokenizer

Converts input characters into tokens

Parser

Checks syntax and operator precedence

AST Builder

Constructs the expression tree

IR Generator

Generates Three Address Code

Error Handler

Detects and reports syntax errors

📁 Suggested Project Structure

Mathematical-Expression-Compiler-Frontend/
│
├── README.md
├── src/
│   ├── lexer
│   ├── parser
│   ├── ast
│   ├── tac
│   └── error_handler
│
├── examples/
│   ├── valid_expression
│   └── invalid_expression
│
├── docs/
│   └── project_presentation.pptx
│
└── .gitignore

Update the folder names above according to the actual source-code files in your project repository.

📚 Example Expressions

Valid Expressions

a + b
x - y
a * b + c
x + y * z
(a + b) * c
x + y * (z - 5)

Invalid Expressions

a + * b
(a + b
a / b)

🛠️ Technologies / Concepts

This project is primarily based on Theory of Computation and Compiler Design concepts, including:

Formal Grammar

Lexical Analysis

Tokens

Syntax Analysis

Parsing

Operator Precedence

Abstract Syntax Tree

Intermediate Representation

Three Address Code

Syntax Error Handling

🎓 Academic Information

Course: PCCO301 – Theory of Computation
Case Study: Case Study 17 – Mathematical Expression Compiler Front-End
Class: T.Y Computer Engineering
Division: A
Group: 17

Group Members

Aarti Gidhad

Vaishnavi Raut

Renuka Karle

Department of Computer Engineering
Sanjivani College of Engineering, Kopargaon

✅ Final Result

For a valid expression such as:

x + y * (z - 5)

the system performs:

Lexical Analysis ✓
        ↓
Syntax Analysis ✓
        ↓
AST Generated ✓
        ↓
Intermediate Representation Generated ✓

Generated TAC:

t1 = z - 5
t2 = y * t1
t3 = x + t2

Final status:

VALID EXPRESSION

🏁 Conclusion

The Mathematical Expression Compiler Front-End demonstrates how compiler theory can be applied to arithmetic expression processing.

The project shows the complete journey from a raw mathematical expression to tokens, syntax validation, an Abstract Syntax Tree, and Three Address Code. It also demonstrates how syntax errors can be detected and reported with meaningful messages.

This case study provides a practical understanding of the major stages involved in a compiler front-end.
