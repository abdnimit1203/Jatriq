# Jatriq — Implementation Plan

## Project Context

Jatriq is an existing React-based tour operator website built with Google AI Studio. The project has already been run on Vercel.

**Important constraints:**

- Keep the existing React architecture and current Vercel deployment approach.
- Do not introduce a separate backend or migrate to a new hosting architecture unless a specific existing feature demonstrably requires it.
- Preserve the existing design, routes, bilingual content, and working features.
- Review environment variables and production configuration where necessary.
- Make focused changes only. Avoid unnecessary refactoring or rebuilding existing features.

## Phase 1 — Configuration and Deployment Verification

- Review existing Vercel configuration, environment variables, Firebase configuration, and AI provider settings.
- Identify any difference between local and production behavior.
- Fix only confirmed configuration or deployment issues.
- Do not expose AI provider secrets in client-side code.

## Phase 2 — Firebase Authentication and Security

- Implement Google Sign-In and Email/Password registration and login using the existing Firebase project.
- Separate ordinary user authentication from admin authorization.
- Review Firestore Security Rules and ensure only authorized users can modify protected data.
- Preserve the existing admin workflow where possible.

## Phase 3 — Firestore Data Reliability

- Fix the empty-collection snapshot and initial data seeding issue.
- Ensure package and category changes persist correctly.
- Display clear errors when saving fails instead of silently reverting user changes.
- Prevent accidental package ID changes during editing.
- Verify that saved data remains available after refresh and subsequent login.

## Phase 4 — Chatbot Fixes

- Fix the Gemini conversation history issue where the first submitted turn may have the wrong role.
- Remove contradictory Saint Martin destination instructions.
- Provide relevant active tour package information to the chatbot.
- Handle API errors and missing environment configuration gracefully.
- Preserve the current chatbot UI and existing provider options.

## Phase 5 — Admin Dashboard Improvements

- Replace the current horizontal admin navigation with a clean desktop sidebar and mobile-friendly navigation.
- Add the missing Bookings view.
- Add a Categories management interface using the existing data context functions.
- Preserve existing package management, agency settings, and AI settings.
- Keep the admin experience simple and consistent with the current design.

## Phase 6 — Final Verification

- Run the existing build and TypeScript checks.
- Verify the main public pages, package details, booking flow, language switching, and chatbot.
- Test authentication, admin permissions, and Firestore create/update/delete operations.
- Verify the relevant environment variables and critical workflows on Vercel.
- Report completed changes, test results, and any remaining issues.

## Execution Rules

1. Planning and inspection must not modify source code.
2. Implement one phase at a time, in the order above.
3. Before each phase, inspect only the relevant existing files.
4. Reuse existing components, functions, and dependencies whenever practical.
5. Do not change unrelated files or redesign working public pages.
6. After each phase, report modified files, changes, and verification results before proceeding.
7. If a requirement is unclear or a significant architectural change appears necessary, explain the reason and ask before implementing it.

**Current task:** Review this plan against the existing codebase and return a concise, prioritized implementation checklist. Do not modify code, install packages, change configuration, or begin implementation yet.
