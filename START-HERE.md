# Start Careerly from VS Code

Careerly runs on your laptop. Its local address is available only while its server is running. Shutting down or restarting Windows stops the server. A saved browser tab does not start it again.

## Every time you want to use Careerly

1. Open VS Code, choose **File > Open Folder**, and select the extracted **Careerly project** folder containing `package.json`.
2. Choose **Terminal > New Terminal**.
3. Run:

```powershell
npm.cmd run dev
```

4. Wait for the terminal to show **Local: http://127.0.0.1:5173/**. The first page can take longer while the application warms up. The browser opens automatically; if needed, open the Local URL printed by the terminal.
5. Keep the terminal open while using Careerly. Press **Ctrl+C** when finished.

After the next laptop restart, repeat these steps. You do not need to install dependencies, recreate accounts or enter the Gemini key again for the same configured folder.

For the requested Desktop location, the terminal can also be opened anywhere and directed to the project with:

```powershell
cd "C:\Users\prish\OneDrive\Desktop\NMIMS PROJECTS\SE\Careerly-Ready-2026-10-27"
npm.cmd run dev
```

## Only for a fresh ZIP extraction

Install Node.js 24 or newer and reopen VS Code. Before starting a new copy for the first time, run:

```powershell
npm.cmd run setup
npm.cmd run admin:create
npm.cmd run ai:configure
npm.cmd run dev
```

The admin and Gemini commands are needed only if that extracted folder does not already have your local accounts and private settings. The Gemini prompt hides the key while you enter it. Students register at `/register`.

ZIP files contain source code, not private API keys, accounts, saved records, uploaded resumes or installed dependencies. Keep the configured folder for daily use. Re-extracting a ZIP creates a separate copy and does not bring its private settings with it.

## If the site cannot be reached

- Check that the Careerly terminal is running and has printed its Local URL. Use that exact URL, since another occupied port may cause a different port to be selected.
- If the terminal returned to a command prompt or shows an error, the server is not running. Read the error before retrying.
- If it says another Careerly server is already running, use that server's printed URL rather than starting a second copy.
- If a running page shows an internal-error overlay, press Ctrl+C in its terminal, run `npm.cmd run dev` again, wait for the Local URL, then refresh the browser with Ctrl+Shift+R.
- Use `npm.cmd run dev`, not the VS Code Live Server extension and not a direct click on an HTML file.

The website itself does not need public hosting for this local workflow. Gemini AI features additionally need an internet connection and available provider quota.
