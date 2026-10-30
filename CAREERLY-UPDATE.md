# Careerly current source status

## Classroom demo update - 27 October 2026

Two fictional student sets are available through `npm.cmd run demo:seed`: Aarav (frontend development) and Meera (data analytics). They add 59 labelled records, four fictional companies and nine demonstration opportunities. Six opportunities are published and open; a draft, a closed role and an expired role demonstrate filtering. The same database is read by the AI matching route. No external jobs service or additional API key is required.

Each student has a complete sample profile, three applications, one resume with two versions, two projects, four skill records, three coding logs and three interview notes. Shared profiles, questions, resources and announcements populate the admin navigation. Dashboard metrics, insights and notifications derive from these records. `demo/DEMO-GUIDE.md` covers all navigation items, credentials, manual field values and the teacher walkthrough. Two JSON exports and a jobs CSV are included.

Re-seeding and demo cleanup were verified to preserve real accounts, real records and private settings. Both demo students have separate personal records and see the six open listings. A live Gemini request matched the frontend student to the relevant roles. Gemini may temporarily return HTTP 503 under high demand; this now displays a clear busy message. The backend suite passes 23 isolated checks. Use `npm.cmd run demo:clear` to remove demo fixtures and their accounts.

Updated 26 October 2026.

## Implemented

The existing React/Vinext interface, dashboard, forms and resume preview are retained. Server routes save profiles, applications, resumes, projects, skills, coding logs, interview notes and shared placement content in D1. R2 handles private resume PDF uploads.

The VS Code version now has student registration at /register, student login at /login, separate admin login at /admin/login and session-based sign out. Students register only as students. Local admin accounts are created privately with npm run admin:create, using a separate email and a chosen password. No fixed admin credential is shipped.

Workspace navigation follows the authenticated account role. The former dashboard preview toggle has been removed. Switching between admin and student access requires signing out and signing in with a different account. The admin notification shortcut opens Announcements within the admin workspace.

Passwords use salted scrypt hashes. Random session tokens are sent in HttpOnly cookies, with one-way verifiers stored in the database. Login attempts are limited. Role checks occur on the server, including shared-content writes. Existing records and the original migrations are preserved; the new account tables are appended in migration 0002.

## Running and upgrading

Read README-VSCODE.md first. Stop an existing development server before setup.

```powershell
npm.cmd run setup
npm.cmd run admin:create
npm.cmd run dev
```

Setup initializes new tables without deleting existing data. Admin creation is needed only once per admin account. On later visits, run npm.cmd run dev and open the Local address printed by the server.

Fresh source archives exclude credentials, local databases, uploaded files, installed dependencies and build output. Earlier demonstration records are not automatically assigned to newly registered accounts. AUTH_MODE=chatgpt preserves the original hosted-identity helper behavior if that compatibility mode is deliberately selected.

## AI and vacancy data

Gemini is integrated alongside the optional OpenAI provider for resume drafts, project ideas, career chat, interview feedback and explanations of opportunity matches. The local workspace is configured for Gemini 3.1 Flash-Lite. Live requests successfully generated a resume draft and project ideas and answered opportunity recommendations using a disposable sample profile. A separate live sample matched a React student with a relevant synthetic internship and excluded an unrelated medical role. Synthetic opportunities were not added to the real database. The heavier Gemini model initially timed out, so the verified lighter model is used by default.

Run npm.cmd run ai:configure to enter or replace a Gemini key privately in the terminal. Keys are saved only in ignored .dev.vars; none are shipped in source archives. Stop and restart the development server after changing settings. Google free-tier model limits still apply. The optional OpenAI provider requires separate credits and is never used as an automatic fallback from Gemini.

Vacancies are stored independently of the AI provider. Admins enter and publish opportunities through Manage Opportunities. The student feed and new matches use published, unexpired entries. An external jobs feed or bulk import requires a separate adapter; the OpenAI key does not populate a jobs database.

Generated suggestions remain reviewable. Resume drafts open in the resume editor; saving creates a version. Project suggestions open as proposed work without a completion date. The AI history remains private, keeps up to 20 exchanges and uses a per-user hourly request limit.

## Verification and limits

The TypeScript check and production build passed. The backend suite now passes 22 isolated checks, including Gemini structured requests, grounded matches, quota messages, invalid-key handling and prevention of paid-provider fallback. The existing account suite has 12 checks covering registration, password hashing, role separation, cookies, session revocation and login limits. Automated suites use synthetic data and mocked provider calls; the live Gemini checks described above were run separately. Earlier browser checks confirmed student registration, student sign-in/sign-out and a separate admin sign-in opening Admin Overview. The private admin creation command was verified in a Windows terminal.

Uploaded PDFs are not automatically read by the AI. Email verification, self-service password recovery, email notifications, external coding synchronization and a structured AI learning-roadmap module are not implemented. The original hosted Careerly site has not been changed; deployment and hosted provisioning remain separate work.
