const fs = require('fs');
const path = require('path');
const {
    Document,
    Packer,
    Paragraph,
    TextRun,
    HeadingLevel,
    Table,
    TableRow,
    TableCell,
    WidthType,
    BorderStyle,
    AlignmentType,
    ShadingType
} = require('docx');

// Read source files directly to ensure exact code replication
const projectRoot = path.resolve(__dirname);

function getFileContent(relPath) {
    try {
        return fs.readFileSync(path.join(projectRoot, relPath), 'utf8');
    } catch (e) {
        return `// Error reading ${relPath}: ${e.message}`;
    }
}

// Styling Constants
const FONT_PRIMARY = "Calibri";
const FONT_CODE = "Consolas";
const COLOR_PRIMARY = "1E3A8A"; // Deep Navy Blue
const COLOR_SECONDARY = "2563EB"; // Royal Blue
const COLOR_DARK = "0F172A"; // Slate 900
const COLOR_MUTED = "475569"; // Slate 600
const COLOR_BG_CODE = "F8FAFC"; // Slate 50
const COLOR_BORDER = "CBD5E1"; // Slate 300
const COLOR_HIGHLIGHT = "0284C7"; // Sky 600
const COLOR_SUCCESS = "059669"; // Emerald 600
const COLOR_WARNING = "D97706"; // Amber 600

// Helper Functions
function title(text, subtitle) {
    const runs = [
        new Paragraph({
            text: text,
            heading: HeadingLevel.TITLE,
            alignment: AlignmentType.CENTER,
            spacing: { before: 240, after: 120 },
            style: "Title"
        }),
        new Paragraph({
            children: [
                new TextRun({
                    text: subtitle,
                    italics: true,
                    size: 24,
                    color: COLOR_MUTED
                })
            ],
            alignment: AlignmentType.CENTER,
            spacing: { after: 360 }
        })
    ];
    return runs;
}

function h1(text) {
    return new Paragraph({
        children: [
            new TextRun({
                text: text,
                bold: true,
                size: 32,
                color: COLOR_PRIMARY,
                font: FONT_PRIMARY
            })
        ],
        heading: HeadingLevel.HEADING_1,
        spacing: { before: 400, after: 160 },
        border: {
            bottom: {
                color: COLOR_PRIMARY,
                space: 6,
                value: "single",
                size: 12
            }
        }
    });
}

function h2(text) {
    return new Paragraph({
        children: [
            new TextRun({
                text: text,
                bold: true,
                size: 26,
                color: COLOR_SECONDARY,
                font: FONT_PRIMARY
            })
        ],
        heading: HeadingLevel.HEADING_2,
        spacing: { before: 280, after: 120 }
    });
}

function h3(text) {
    return new Paragraph({
        children: [
            new TextRun({
                text: text,
                bold: true,
                size: 22,
                color: COLOR_DARK,
                font: FONT_PRIMARY
            })
        ],
        heading: HeadingLevel.HEADING_3,
        spacing: { before: 200, after: 80 }
    });
}

function p(text, options = {}) {
    const runs = [];
    if (typeof text === 'string') {
        runs.push(new TextRun({
            text: text,
            size: 22,
            font: FONT_PRIMARY,
            color: options.color || COLOR_DARK,
            bold: options.bold || false,
            italics: options.italics || false
        }));
    } else if (Array.isArray(text)) {
        text.forEach(item => {
            if (typeof item === 'string') {
                runs.push(new TextRun({ text: item, size: 22, font: FONT_PRIMARY, color: COLOR_DARK }));
            } else {
                runs.push(new TextRun({
                    text: item.text,
                    size: 22,
                    font: item.code ? FONT_CODE : FONT_PRIMARY,
                    bold: item.bold || false,
                    italics: item.italics || false,
                    color: item.code ? COLOR_PRIMARY : (item.color || COLOR_DARK),
                    highlight: item.code ? "lightGray" : undefined
                }));
            }
        });
    }

    return new Paragraph({
        children: runs,
        spacing: { before: 60, after: 80 },
        bullet: options.bullet ? { level: options.bulletLevel || 0 } : undefined
    });
}

function bullet(boldPrefix, text) {
    return new Paragraph({
        children: [
            new TextRun({
                text: boldPrefix ? `${boldPrefix}: ` : "",
                bold: true,
                size: 22,
                font: FONT_PRIMARY,
                color: COLOR_DARK
            }),
            new TextRun({
                text: text,
                size: 22,
                font: FONT_PRIMARY,
                color: COLOR_DARK
            })
        ],
        bullet: { level: 0 },
        spacing: { before: 40, after: 40 }
    });
}

function callout(titleText, bodyText, type = "info") {
    const color = type === "warning" ? COLOR_WARNING : (type === "success" ? COLOR_SUCCESS : COLOR_HIGHLIGHT);
    return new Table({
        width: { size: 100, type: WidthType.PERCENTAGE },
        rows: [
            new TableRow({
                children: [
                    new TableCell({
                        children: [
                            new Paragraph({
                                children: [
                                    new TextRun({
                                        text: `📌 ${titleText}`,
                                        bold: true,
                                        size: 22,
                                        font: FONT_PRIMARY,
                                        color: color
                                    })
                                ],
                                spacing: { after: 60 }
                            }),
                            new Paragraph({
                                children: [
                                    new TextRun({
                                        text: bodyText,
                                        size: 20,
                                        font: FONT_PRIMARY,
                                        color: COLOR_DARK
                                    })
                                ]
                            })
                        ],
                        shading: {
                            fill: "F0F9FF",
                            type: ShadingType.SOLID,
                            color: "auto"
                        },
                        borders: {
                            left: { style: BorderStyle.SINGLE, size: 24, color: color },
                            top: { style: BorderStyle.NONE },
                            right: { style: BorderStyle.NONE },
                            bottom: { style: BorderStyle.NONE }
                        },
                        margins: { top: 120, bottom: 120, left: 180, right: 180 }
                    })
                ]
            })
        ],
        spacing: { before: 120, after: 160 }
    });
}

function codeBlock(titleText, filePath, codeContent) {
    const lines = codeContent.split('\n');
    const codeParagraphs = [];

    // Header of code block
    codeParagraphs.push(
        new Paragraph({
            children: [
                new TextRun({
                    text: `FILE: ${filePath}`,
                    bold: true,
                    size: 18,
                    font: FONT_CODE,
                    color: COLOR_PRIMARY
                }),
                new TextRun({
                    text: ` (${titleText})`,
                    italics: true,
                    size: 18,
                    font: FONT_PRIMARY,
                    color: COLOR_MUTED
                })
            ],
            spacing: { before: 60, after: 80 }
        })
    );

    // Code lines formatted
    lines.forEach((line) => {
        codeParagraphs.push(
            new Paragraph({
                children: [
                    new TextRun({
                        text: line.length > 0 ? line : " ",
                        size: 17,
                        font: FONT_CODE,
                        color: COLOR_DARK
                    })
                ],
                spacing: { before: 0, after: 0 }
            })
        );
    });

    return new Table({
        width: { size: 100, type: WidthType.PERCENTAGE },
        rows: [
            new TableRow({
                children: [
                    new TableCell({
                        children: codeParagraphs,
                        shading: {
                            fill: COLOR_BG_CODE,
                            type: ShadingType.SOLID,
                            color: "auto"
                        },
                        borders: {
                            left: { style: BorderStyle.SINGLE, size: 12, color: COLOR_SECONDARY },
                            top: { style: BorderStyle.SINGLE, size: 4, color: COLOR_BORDER },
                            right: { style: BorderStyle.SINGLE, size: 4, color: COLOR_BORDER },
                            bottom: { style: BorderStyle.SINGLE, size: 4, color: COLOR_BORDER }
                        },
                        margins: { top: 100, bottom: 100, left: 140, right: 140 }
                    })
                ]
            })
        ],
        spacing: { before: 100, after: 180 }
    });
}

function createTable(headers, rows) {
    const tableRows = [
        new TableRow({
            children: headers.map(header => new TableCell({
                children: [
                    new Paragraph({
                        children: [
                            new TextRun({
                                text: header,
                                bold: true,
                                size: 20,
                                font: FONT_PRIMARY,
                                color: "FFFFFF"
                            })
                        ],
                        alignment: AlignmentType.CENTER
                    })
                ],
                shading: {
                    fill: COLOR_PRIMARY,
                    type: ShadingType.SOLID,
                    color: "auto"
                },
                borders: {
                    top: { style: BorderStyle.SINGLE, size: 4, color: COLOR_BORDER },
                    bottom: { style: BorderStyle.SINGLE, size: 8, color: COLOR_PRIMARY },
                    left: { style: BorderStyle.SINGLE, size: 4, color: COLOR_BORDER },
                    right: { style: BorderStyle.SINGLE, size: 4, color: COLOR_BORDER }
                },
                margins: { top: 80, bottom: 80, left: 100, right: 100 }
            }))
        })
    ];

    rows.forEach((row, rowIndex) => {
        tableRows.push(
            new TableRow({
                children: row.map(cell => new TableCell({
                    children: [
                        new Paragraph({
                            children: [
                                new TextRun({
                                    text: cell,
                                    size: 20,
                                    font: FONT_PRIMARY,
                                    color: COLOR_DARK
                                })
                            ]
                        })
                    ],
                    shading: {
                        fill: rowIndex % 2 === 0 ? "FFFFFF" : "F8FAFC",
                        type: ShadingType.SOLID,
                        color: "auto"
                    },
                    borders: {
                        top: { style: BorderStyle.SINGLE, size: 2, color: COLOR_BORDER },
                        bottom: { style: BorderStyle.SINGLE, size: 2, color: COLOR_BORDER },
                        left: { style: BorderStyle.SINGLE, size: 2, color: COLOR_BORDER },
                        right: { style: BorderStyle.SINGLE, size: 2, color: COLOR_BORDER }
                    },
                    margins: { top: 60, bottom: 60, left: 100, right: 100 }
                }))
            })
        );
    });

    return new Table({
        width: { size: 100, type: WidthType.PERCENTAGE },
        rows: tableRows,
        spacing: { before: 100, after: 160 }
    });
}

// Build the Full Document
function buildDocument() {
    const docChildren = [];

    // Title Section
    docChildren.push(
        ...title(
            "EduSystem: Complete Frontend Project Specification & Knowledge Handoff",
            "Comprehensive Architecture, State Management, Authentication, Forms, and Full Code Base Reference for AI Continuation"
        )
    );

    docChildren.push(
        callout(
            "AI Agent & Developer Notice",
            "This document represents the complete, ground-truth state of the EduSystem frontend application. It contains full architecture blueprints, workflow explanations, data models, API contracts, completed features, pending tasks, and unedited source code from the project. Feed this file into any AI context to immediately resume development without losing context.",
            "info"
        )
    );

    // Section 1: Executive Overview
    docChildren.push(h1("1. Executive Summary & Project Purpose"));
    docChildren.push(p("EduSystem is a full-featured educational web platform built to connect teachers and students in a structured, interactive learning environment. The frontend is built as a single-page application (SPA) using React 19 and Vite, interacting with a RESTful backend API located at http://127.0.0.1:8000/api."));
    docChildren.push(p("The application implements strict role-based access control (RBAC), multi-step session hydration, token-based authentication via Axios interceptors, complex multipart form uploads with dynamic client-side validations, and Redux Toolkit state slices."));

    docChildren.push(h2("1.1 Core Objectives Completed"));
    docChildren.push(bullet("Stateless Token Authentication", "Clean token storage in localStorage managed via a dedicated storage service, attached dynamically to every outgoing HTTP request through Axios interceptors."));
    docChildren.push(bullet("Session Hydration & Auth State Machine", "Automatic user identity restoration on page reload (/api/auth/me) with an authInitialized gate flag that prevents premature route redirection or authentication flicker."));
    docChildren.push(bullet("Declarative Route Protection", "Nested route guards: ProtectedRoute ensuring logged-in status and RoleRoute enforcing role boundaries (e.g., student, teacher)."));
    docChildren.push(bullet("Teacher Lesson Catalog", "Listing all published lessons with nested media (Videos, docx Sheets, Exams with questions and multiple-choice options)."));
    docChildren.push(bullet("Multipart Lesson Upload Architecture", "Creating new lessons with attached binary files (video up to 500MB and Word docx homework sheets) with dynamic conditional validation logic."));
    docChildren.push(bullet("Modular State Architecture", "Feature-based Redux Toolkit slices (authSlice, teacherSlice) with asynchronous thunk actions, error rejection handling, and loading states."));

    // Section 2: Technology Stack & Dependencies
    docChildren.push(h1("2. Technology Stack & Dependencies"));
    docChildren.push(p("The project is configured using modern, current-generation JavaScript and React ecosystems:"));

    docChildren.push(createTable(
        ["Package / Dependency", "Version", "Role & Architectural Justification"],
        [
            ["React", "^19.2.8", "Core UI rendering library utilizing modern hooks and concurrent features."],
            ["Vite", "^8.3.0", "Next-gen lightning fast dev server and bundler with Hot Module Replacement."],
            ["@reduxjs/toolkit", "^2.12.0", "Standard state management for global auth and teacher data slices."],
            ["react-redux", "^9.3.0", "React bindings for Redux store dispatching and state subscription."],
            ["react-router-dom", "^7.18.4", "Declarative client-side routing, nested routes, layouts, and navigation."],
            ["react-hook-form", "^7.88.0", "Performant, uncontrolled form state management with dynamic rule watchers."],
            ["axios", "^1.20.0", "Promise-based HTTP client configured with base URL and auth request interceptors."],
            ["ESLint", "^10.10.0", "Code quality, React hooks rules enforcement, and syntax verification."]
        ]
    ));

    // Section 3: Directory Structure & File Map
    docChildren.push(h1("3. Directory Structure & File Architecture"));
    docChildren.push(p("The codebase strictly follows a modular, feature-oriented structure where features encapsulate their state logic, and shared logic is housed in dedicated utility and service layers:"));

    const dirTree = `d:/ReactProject/edu-system-frontend/
├── package.json               # Project manifest, scripts, and dependencies
├── vite.config.js             # Vite configuration with React plugin
├── index.html                 # HTML entry shell mounting #root
├── src/
│   ├── main.jsx               # Application bootstrap: Redux Provider & RouterProvider
│   ├── App.jsx                # Legacy/standalone root component
│   ├── index.css              # Global design tokens, typography, root layout styles
│   ├── App.css                # Component-specific styles
│   ├── api/
│   │   └── api.js             # Central Axios instance with Base URL & Token Interceptor
│   ├── app/
│   │   └── store.js           # Central Redux store uniting authSlice and teacherSlice
│   ├── services/
│   │   └── storageService.js  # Abstraction layer for localStorage token operations
│   ├── routes/
│   │   ├── router.jsx         # createBrowserRouter definitions with layouts & guards
│   │   ├── ProtectedRoute.jsx # Guard enforcing authentication and hydration wait
│   │   └── RoleRoute.jsx      # Guard enforcing user roles (e.g., student vs teacher)
│   ├── components/
│   │   ├── layout/
│   │   │   └── AppLayout.jsx  # Root layout dispatching getMe() session hydration
│   │   └── forms/
│   │       └── Input.jsx      # Reusable form field wrapping label, register, & error
│   ├── features/
│   │   ├── auth/
│   │   │   └── authSlice.js   # Login, getMe, logout thunks & auth status state
│   │   └── teacher/
│   │       └── teacherSlice.js# getLessons & createLesson thunks & lessons cache
│   ├── pages/
│   │   ├── Unauthorized.jsx   # 403 Access Denied fallback view
│   │   ├── auth/
│   │   │   ├── Login.jsx      # Login page integrated with React Hook Form
│   │   │   └── Me.jsx         # User profile page with logout action
│   │   └── teacher/
│   │       ├── TeacherLessons.jsx      # Nested lesson, video, sheet, exam view
│   │       └── TeacherCreateLesson.jsx # Comprehensive multipart lesson creation
│   └── validation/
│       ├── registerValidation.js # Email regex and password rules
│       └── LessonValidation.js   # File types, sizes, title, duration rules`;

    docChildren.push(codeBlock("Workspace Tree", "Directory Overview", dirTree));

    // Section 4: Architecture Deep Dives
    docChildren.push(h1("4. Architectural Deep-Dives"));

    docChildren.push(h2("4.1 Authentication Lifecycle & Session Hydration"));
    docChildren.push(p("A common pitfall in single-page apps is the 'flash of login screen' on page refresh before the user's stored token can be verified. EduSystem completely eliminates this through a multi-stage session hydration pattern:"));
    docChildren.push(bullet("1. Storage Abstraction", "storageService provides isolated setToken, getToken, and removeToken methods. This abstracts localStorage so switching to cookies or secure storage requires changing only one file."));
    docChildren.push(bullet("2. Axios Request Interceptor", "api.js intercepts every outgoing request. If storageService.getToken() returns a valid token string, it automatically attaches config.headers.Authorization = 'Bearer ' + token."));
    docChildren.push(bullet("3. Layout-Level Hydration", "AppLayout runs on application load. It reads storageService.getToken(). If present, it dispatches getMe(). If no token exists, it immediately dispatches markAuthInitialized()."));
    docChildren.push(bullet("4. Redux Auth State Machine", "The authSlice maintains user, token, isAuthenticated, authLoading, authInitialized, and error."));
    docChildren.push(bullet("5. ProtectedRoute Gatekeeper", "When navigating to a protected route, if authInitialized is false, the app renders a 'Loading...' indicator. It only evaluates isAuthenticated after hydration completes, preventing premature redirect to /login."));
    docChildren.push(bullet("6. RoleRoute Guard", "Once authenticated, RoleRoute inspects state.auth.user.role against allowedRoles (e.g., ['student']). If unauthorized, redirects to /unauthorized."));

    docChildren.push(h2("4.2 Form Handling & Dynamic Conditional Validation"));
    docChildren.push(p("The lesson creation system (TeacherCreateLesson.jsx) handles optional nested sub-resources (Video and Sheet). If a teacher does not want to attach a video, those fields remain optional. However, if the teacher enters ANY video field (title, duration, or selects a file), all other video fields immediately become strictly required. The same behavior applies to homework sheets:"));
    docChildren.push(bullet("useForm Watchers", "watch('video.title'), watch('video.file'), and watch('video.duration') track user input in real-time."));
    docChildren.push(bullet("Dynamic Rule Injection", "If hasVideoData is true, videoTitleRules.required, videoFileRules.required, and videoDurationRules.required are dynamically injected before passing to register()."));
    docChildren.push(bullet("MIME & File Size Validation", "Custom validation functions verify video MIME types ('video/mp4', 'video/webm', etc.) and cap sizes at 500MB. Sheet files are validated to ensure only docx (application/vnd.openxmlformats-officedocument.wordprocessingml.document) files are uploaded."));
    docChildren.push(bullet("Date Normalization", "HTML5 datetime-local outputs format 'YYYY-MM-DDTHH:MM'. The form handler automatically converts this to backend SQL format 'YYYY-MM-DD HH:MM:00'."));

    docChildren.push(h2("4.3 Teacher Lesson Domain Model"));
    docChildren.push(p("The application models a comprehensive educational structure:"));
    docChildren.push(bullet("Lesson", "Root entity with title, published_at, video, sheet, and exam."));
    docChildren.push(bullet("Video Sub-entity", "Contains title, file_path, and duration in seconds."));
    docChildren.push(bullet("Sheet Sub-entity (Homework/Worksheet)", "Contains title, deadline_hours, and questions array. Each question contains question_text, an array of options, and correct_option."));
    docChildren.push(bullet("Exam Sub-entity", "Contains title, deadline_hours, max_attempts, and questions array with question_text, options, and correct_option."));

    // Section 5: Full Code Base Reference
    docChildren.push(h1("5. Full Code Base Reference (Source Code & Annotations)"));
    docChildren.push(p("Below is the complete, unedited source code for all architectural components with detailed commentary."));

    // 5.1 Storage Service
    docChildren.push(h2("5.1 Storage Service (src/services/storageService.js)"));
    docChildren.push(p("Encapsulates browser storage operations for auth tokens."));
    docChildren.push(codeBlock("Token Storage Management", "src/services/storageService.js", getFileContent("src/services/storageService.js")));

    // 5.2 API Client
    docChildren.push(h2("5.2 Central API Client (src/api/api.js)"));
    docChildren.push(p("Configures base URL to http://127.0.0.1:8000/api and injects Authorization Bearer tokens."));
    docChildren.push(codeBlock("Axios Client with Interceptor", "src/api/api.js", getFileContent("src/api/api.js")));

    // 5.3 Redux Store
    docChildren.push(h2("5.3 Redux Store Configuration (src/app/store.js)"));
    docChildren.push(p("Configures the central Redux store uniting auth and teacher feature reducers."));
    docChildren.push(codeBlock("Redux Store", "src/app/store.js", getFileContent("src/app/store.js")));

    // 5.4 Auth Slice
    docChildren.push(h2("5.4 Auth Feature Slice (src/features/auth/authSlice.js)"));
    docChildren.push(p("Handles login, getMe, logout thunks, session hydration state, and credential storage."));
    docChildren.push(codeBlock("Authentication Slice", "src/features/auth/authSlice.js", getFileContent("src/features/auth/authSlice.js")));

    // 5.5 Teacher Slice
    docChildren.push(h2("5.5 Teacher Feature Slice (src/features/teacher/teacherSlice.js)"));
    docChildren.push(p("Handles fetching lessons list and multipart lesson creation with FormData."));
    docChildren.push(codeBlock("Teacher Slice", "src/features/teacher/teacherSlice.js", getFileContent("src/features/teacher/teacherSlice.js")));

    // 5.6 Routing System
    docChildren.push(h2("5.6 Routing Configuration (src/routes/router.jsx)"));
    docChildren.push(p("Declares all public and protected routes, hierarchical layouts, and RBAC guards."));
    docChildren.push(codeBlock("Application Router", "src/routes/router.jsx", getFileContent("src/routes/router.jsx")));

    // 5.7 Route Guards
    docChildren.push(h2("5.7 Route Guards: ProtectedRoute & RoleRoute"));
    docChildren.push(p("ProtectedRoute awaits hydration before testing authentication. RoleRoute ensures the user holds the required role."));
    docChildren.push(codeBlock("Protected Route Guard", "src/routes/ProtectedRoute.jsx", getFileContent("src/routes/ProtectedRoute.jsx")));
    docChildren.push(codeBlock("Role-Based Access Guard", "src/routes/RoleRoute.jsx", getFileContent("src/routes/RoleRoute.jsx")));

    // 5.8 App Layout
    docChildren.push(h2("5.8 Application Layout (src/components/layout/AppLayout.jsx)"));
    docChildren.push(p("Top-level layout mounted in router, responsible for dispatching getMe() or markAuthInitialized()."));
    docChildren.push(codeBlock("Root Application Layout", "src/components/layout/AppLayout.jsx", getFileContent("src/components/layout/AppLayout.jsx")));

    // 5.9 Form Components
    docChildren.push(h2("5.9 Form Components: Input (src/components/forms/Input.jsx)"));
    docChildren.push(p("Reusable input element integrating React Hook Form register, labels, and error messages."));
    docChildren.push(codeBlock("Reusable Form Input", "src/components/forms/Input.jsx", getFileContent("src/components/forms/Input.jsx")));

    // 5.10 Validation Schemas
    docChildren.push(h2("5.10 Validation Schemas (src/validation/LessonValidation.js & registerValidation.js)"));
    docChildren.push(p("Validation rules specifying field constraints, regex patterns, MIME types, and size limits."));
    docChildren.push(codeBlock("Lesson Validation Rules", "src/validation/LessonValidation.js", getFileContent("src/validation/LessonValidation.js")));
    docChildren.push(codeBlock("Auth/Register Validation Rules", "src/validation/registerValidation.js", getFileContent("src/validation/registerValidation.js")));

    // 5.11 Pages: Login & Me
    docChildren.push(h2("5.11 Auth Pages (Login.jsx & Me.jsx)"));
    docChildren.push(p("Login form submitting credentials to authSlice, and Me page displaying profile details and logout button."));
    docChildren.push(codeBlock("Login Page", "src/pages/auth/Login.jsx", getFileContent("src/pages/auth/Login.jsx")));
    docChildren.push(codeBlock("User Profile Page", "src/pages/auth/Me.jsx", getFileContent("src/pages/auth/Me.jsx")));
    docChildren.push(codeBlock("Unauthorized 403 Page", "src/pages/Unauthorized.jsx", getFileContent("src/pages/Unauthorized.jsx")));

    // 5.12 Pages: Teacher Lessons & Create Lesson
    docChildren.push(h2("5.12 Teacher Pages: Lesson Catalog & Creator"));
    docChildren.push(p("TeacherLessons displays complete lesson trees (video, docx sheets, exams, questions, options). TeacherCreateLesson provides multipart uploading and dynamic validation."));
    docChildren.push(codeBlock("Teacher Lessons Catalog", "src/pages/teacher/TeacherLessons.jsx", getFileContent("src/pages/teacher/TeacherLessons.jsx")));
    docChildren.push(codeBlock("Teacher Create Lesson Page", "src/pages/teacher/TeacherCreateLesson.jsx", getFileContent("src/pages/teacher/TeacherCreateLesson.jsx")));

    // 5.13 Main Entry Point
    docChildren.push(h2("5.13 Application Entry Point (src/main.jsx)"));
    docChildren.push(p("Mounts React StrictMode with Redux Provider and React Router RouterProvider."));
    docChildren.push(codeBlock("Application Bootstrap", "src/main.jsx", getFileContent("src/main.jsx")));

    // Section 6: Backend REST API Contract
    docChildren.push(h1("6. Backend REST API Contract & Specifications"));
    docChildren.push(p("The backend is expected to be a Laravel/PHP or Node REST API hosted at http://127.0.0.1:8000/api. Below are the verified endpoints, expected payload structures, and responses:"));

    docChildren.push(h2("6.1 Authentication Endpoints"));
    docChildren.push(bullet("POST /api/auth/login", "Payload: { email: string, password: string }. Response (200 OK): { user: { id: number, name: string, email: string, role: string }, token: string }. Error (401/422): { message: string }."));
    docChildren.push(bullet("GET /api/auth/me", "Headers: { Authorization: 'Bearer <token>' }. Response (200 OK): { user: { id: number, name: string, email: string, role: string } }. Error (401): { message: string }."));

    docChildren.push(h2("6.2 Teacher Endpoints"));
    docChildren.push(bullet("GET /api/teacher/lessons", "Headers: { Authorization: 'Bearer <token>' }. Response (200 OK): { lessons: [ { id, title, published_at, video: { id, title, file_path, duration }, sheet: { id, title, deadline_hours, questions: [{ id, question_text, options: [string], correct_option: string }] }, exam: { id, title, deadline_hours, max_attempts, questions: [{ id, question_text, options: [string], correct_option: string }] } } ] }."));
    docChildren.push(bullet("POST /api/teacher/lessons", "Headers: { Authorization: 'Bearer <token>', 'Content-Type': 'multipart/form-data' }. Payload: FormData containing title (string), published_at (YYYY-MM-DD HH:MM:00), video[title], video[file] (binary), video[duration] (number), sheet[title], sheet[deadline_hours] (number), sheet[file] (binary docx). Response (201 Created): { lesson: { id, title, published_at, ... } }."));

    // Section 7: Current Status & Next Steps Roadmap
    docChildren.push(h1("7. Current Status vs. Pending Tasks Roadmap"));
    docChildren.push(p("This matrix provides an immediate checklist of what is complete and what must be built next:"));

    docChildren.push(createTable(
        ["Component / Feature", "Current Status", "Implementation Details & Required Next Steps"],
        [
            ["Authentication Flow", "COMPLETED", "Login, token storage, request interceptor, session restoration, and logout are functional."],
            ["Role-Based Route Guarding", "COMPLETED", "ProtectedRoute and RoleRoute enforce authentication and role isolation."],
            ["Teacher Lesson Catalog", "COMPLETED", "Displays full lesson hierarchy with videos, sheets, exams, questions, and options."],
            ["Teacher Lesson Creation", "COMPLETED", "Multipart FormData upload with dynamic conditional validation, video (500MB), and docx sheets."],
            ["Student Dashboard (/dashboard)", "PENDING", "Route is defined with RoleRoute (student), currently renders placeholder <h1>. Needs student course/lesson overview."],
            ["Student Lesson Viewer & Player", "PENDING", "Need video streaming/player component, docx worksheet downloader, and lesson progress tracker."],
            ["Student Sheet/Homework Submission", "PENDING", "Interface for students to submit worksheet answers or upload completed assignments."],
            ["Student Exam Taking Interface", "PENDING", "Timed exam interface rendering question cards, radio selection for options, attempt counters, and submission."],
            ["Teacher Exam Builder", "PENDING", "UI for teachers to create custom exams directly or auto-generate questions from docx sheets."],
            ["UI/UX Design System Upgrade", "PENDING", "Currently using basic HTML inputs and buttons. Needs modern UI (Tailwind or custom CSS), navigation bar, sidebar, and modals."],
            ["Toast Notification System", "PENDING", "Replace inline text error messages with toast alerts (e.g. react-toastify or custom toast context)."],
            ["Axios 401 Response Interceptor", "PENDING", "Add response interceptor to automatically catch expired tokens and redirect to /login with session expiry alert."]
        ]
    ));

    // Section 8: Prompting Guide for AI Continuation
    docChildren.push(h1("8. Prompting Guide for Continuing Development with AI"));
    docChildren.push(p("To continue working on this project seamlessly, copy and paste this document directly into your AI assistant, then choose one of the targeted prompts below:"));

    docChildren.push(h2("Prompt 1: Implementing the Student Dashboard & Lesson Viewer"));
    docChildren.push(callout(
        "Prompt Template",
        `"I am sharing my complete EduSystem project documentation. Authentication, Redux Toolkit, and Teacher Lesson management are already built. Please help me implement the Student Dashboard and Student Lesson View:
1. Create a studentSlice in Redux to fetch enrolled lessons (GET /student/lessons).
2. Replace the placeholder in /dashboard with a modern dashboard displaying enrolled lessons and progress.
3. Build a StudentLessonView component featuring a video player for lesson.video, a download link for lesson.sheet, and a start button for lesson.exam.
4. Adhere to the existing coding style (Redux Toolkit async thunks, api.js Axios instance, and clean folder structure)."`,
        "info"
    ));

    docChildren.push(h2("Prompt 2: Building a Modern Navigation & Layout System"));
    docChildren.push(callout(
        "Prompt Template",
        `"Here is my complete EduSystem project documentation. I need to replace the minimal AppLayout with a full responsive navigation system:
1. Create a Navbar component displaying the user's name, role badge, and a Logout button that triggers dispatch(logout()).
2. Display navigation links dynamically based on user.role:
   - For Teachers: 'My Lessons' (/lessons), 'Create Lesson' (/create-lesson).
   - For Students: 'Dashboard' (/dashboard).
3. If unauthenticated, show 'Login' (/login).
4. Include a clean, modern layout with a sidebar for dashboards and a header bar."`,
        "info"
    ));

    docChildren.push(h2("Prompt 3: Adding Exam Taking & Grading System"));
    docChildren.push(callout(
        "Prompt Template",
        `"Based on the attached EduSystem architecture documentation where exams have deadline_hours, max_attempts, questions with multiple-choice options, and correct_option:
1. Build an ExamTakingPage component that displays questions sequentially or in a paginated list.
2. Track selected answers per question in local state.
3. Handle countdown timer based on deadline/exam duration.
4. Dispatch an exam submission action (POST /student/exams/:id/submit) and display the resulting score and attempt count."`,
        "info"
    ));

    // Final Document Construction
    return new Document({
        styles: {
            default: {
                document: {
                    run: {
                        font: FONT_PRIMARY,
                        size: 22,
                        color: COLOR_DARK
                    }
                }
            }
        },
        sections: [
            {
                properties: {
                    page: {
                        margin: {
                            top: 1440, // 1 inch
                            right: 1440,
                            bottom: 1440,
                            left: 1440
                        }
                    }
                },
                children: docChildren
            }
        ]
    });
}

// Generate the docx file
async function run() {
    console.log("Generating EduSystem Comprehensive Documentation Word Document...");
    const doc = buildDocument();
    const buffer = await Packer.toBuffer(doc);
    const outputPath = path.join(projectRoot, "EduSystem_Project_Documentation.docx");
    fs.writeFileSync(outputPath, buffer);
    console.log(`Document successfully written to ${outputPath} (${buffer.length} bytes).`);
}

run().catch(err => {
    console.error("Error generating docx:", err);
    process.exit(1);
});
