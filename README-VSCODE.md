# Run Careerly in VS Code

For daily startup and the requested Desktop folder, read **START-HERE.md**. After restarting your laptop, start the local server again with `npm.cmd run dev` before opening its browser address.

This version has student registration, student email/password login, a separate admin login and database-backed career records. Its dashboard and existing visual design are retained. AI integration is included; normal workspace features do not require an AI key.

## Open and run

1. Install Node.js 24 or newer, then reopen VS Code.
2. Extract the whole ZIP. In VS Code, open the folder containing package.json, or open Careerly.code-workspace.
3. Open Terminal > New Terminal and run:

```powershell
npm.cmd run setup
npm.cmd run admin:create
npm.cmd run dev
```

Use the first command once on a new copy. It installs missing dependencies, builds the application and initializes the database without deleting existing records. Stop any running Careerly server before running setup.

The second command creates your separate admin account. Enter the name, email and a password of at least 8 characters when prompted. Password characters are hidden. Use an email that is not already registered as a student. No shared or hardcoded admin password is included. Skip this command if you only need student access or have already created an admin. Student registration still requires at least 12 characters.

The third command starts the website and automatically opens the ready site in your default browser. If the browser does not open, use the Local URL printed in the terminal, normally http://localhost:5173/. Keep that terminal open. Press Ctrl+C to stop it. On later visits, normally only npm.cmd run dev is needed. To suppress automatic browser opening, set CAREERLY_OPEN_BROWSER=false in the terminal environment before starting.

On macOS/Linux, use npm in place of npm.cmd.

## Student accounts

- Register: http://127.0.0.1:5173/register
- Student login: http://127.0.0.1:5173/login

Each student registers with their own name, email and password. Registration creates a private account and profile, then opens the dashboard. College is optional during registration and more profile fields can be completed later. There is no admin role option on the registration form.

## Administrator accounts

- Admin login: http://127.0.0.1:5173/admin/login
- Create a local admin: npm.cmd run admin:create

Admin accounts use their own email and password. A student account cannot sign in through the admin portal or gain privileges by changing form data. An admin who signs in is taken to Admin Overview. Shared opportunities and resources are maintained through the admin area.

The dashboard follows the signed-in account role. There is no admin/student dashboard toggle. To use the other role, sign out and sign in with a separate account through its corresponding login page. An admin email cannot also be registered as a student email.

The admin creation command operates only on the local database. It never promotes or overwrites an existing student account. Hosted provisioning is a separate deployment operation.

## VS Code tasks

Under Terminal > Run Task, you can also use:

- Careerly First time setup
- Careerly Create admin account
- Careerly Start website
- Careerly Check backend
- Careerly Check accounts

Use Terminal > Terminate Task to stop the server task.

## AI connection

Careerly supports Gemini and OpenAI through private server settings. Gemini is selected when AI_PROVIDER=gemini (or a Gemini key is present and no provider is explicitly selected). Set AI_PROVIDER=openai to deliberately use the original OpenAI integration. Careerly never silently falls back from Gemini to paid OpenAI requests.

For Gemini, run this command in the VS Code terminal after setup:

```powershell
npm.cmd run ai:configure
```

Paste your Gemini API key at the hidden prompt. The command saves it only in ignored .dev.vars, preserves existing settings and checks access with Google. It selects gemini-3.1-flash-lite by default; GEMINI_MODEL can be changed to another compatible model available to your project. Stop the server with Ctrl+C, then restart with npm.cmd run dev so the new settings are loaded.

Open AI Coach after signing in. The same interface supports career chat, structured resume drafts, project proposals, interview feedback and matching published opportunities to your career facts. API keys remain on the server; students do not need individual keys. Never put keys in React code, screenshots or source archives.

Google's free tier has project/model usage limits, and free-tier submitted data may be used to improve Google's products. Use sample data for demonstrations. A valid key still needs model access and available quota; rate-limit and connection failures are reported in the interface. The optional OpenAI integration still requires its own available API credits.

## Jobs and internships

Careerly already has a database for these records. Sign in as admin, open Manage Opportunities, add a company, role, requirements, deadline and application URL, then select Published. Published roles with an unexpired deadline appear in the student feed and can be considered for AI matching.

The OpenAI key is not a database key and does not fetch vacancies. No external jobs API is required for admin-entered opportunities. Bulk CSV imports or a third-party jobs feed would require separate import/synchronization code and, if required by that provider, its own credential. The existing database can remain in use.

## Accounts and stored data

Passwords are salted and hashed with scrypt. Sessions use random tokens in HttpOnly cookies; only token hashes are stored. Requests check account identity and role server-side. Sign out revokes the current session.

A new extracted copy starts with an empty local database. Installed dependencies, credentials, local databases and uploaded files are excluded from the ZIP. Existing data in your earlier working checkout remains under its original owner; it is not reassigned automatically to new accounts.

Email verification, self-service password reset and multi-factor authentication are not implemented. Before making the password-login version public, complete the production account-recovery and deployment checks. The original hosted Careerly URL is unchanged.

The default is AUTH_MODE=password. AUTH_MODE=chatgpt retains compatibility with the original Sites-managed identity helpers; that mode is separate from the new Careerly account registration.

## Classroom demo data

Run `npm.cmd run demo:seed` to add two fictional student accounts, their personal career records, four fictional employers and nine labelled opportunities. Six listings are published and open; draft, closed and expired examples demonstrate filtering. Existing real accounts and records are preserved. Re-running refreshes only the demo fixtures and dates.

Read `demo/DEMO-GUIDE.md` for two complete sets of sample values covering every student and admin navigation item, login details and a teacher presentation flow. `demo/SET-A-Frontend.json`, `demo/SET-B-Data-Analytics.json` and `demo/DEMO-JOBS.csv` contain the source values. Run `npm.cmd run demo:export` to regenerate these files, or `npm.cmd run demo:clear` to remove demo accounts and fixtures. Demo-only student credentials are documented in the guide; keep demo accounts out of a public deployment. Your existing admin login is retained.

## Verification commands

```powershell
npm.cmd run test:auth
node scripts/test-careerly.mjs
```

These tests use isolated temporary data and do not call the live AI provider.

## Common problems

- Node/npm not recognized: install Node.js and reopen VS Code.
- Port 5173 occupied: stop the older server, or use the different Local address shown by the new server.
- Missing database table after an upgrade: stop the server, rerun npm.cmd run setup, then start it again.
- Cannot create an admin: finish setup first, use a separate email, and run the command in the integrated terminal so private password entry is available.
- Live Server extension shows an error: this is a backend application. Use npm.cmd run dev instead of Live Server.
