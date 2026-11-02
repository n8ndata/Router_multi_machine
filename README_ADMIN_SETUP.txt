ROUTER MULTI-MACHINE CENTRAL DASHBOARD — ADMIN UPDATE

FILES
- index.html: web app with Login-style welcome screen and Admin Control Center.
- google_apps_script_complete_code.js: Google Apps Script backend.

ADMIN FEATURES
- Set Google Apps Script Web App URL.
- Enable/disable automatic sync.
- Store Gemini API key and optional model name in this browser's Local Storage.
- Test Apps Script connection (action=health).
- Fetch data from Google Sheets.
- Sync app data to Google Sheets with JSON success/error confirmation.

INSTALL / UPDATE GOOGLE APPS SCRIPT
1. Open the target Google Spreadsheet.
2. Extensions > Apps Script.
3. Replace the existing script with google_apps_script_complete_code.js.
4. Save, then Deploy > Manage deployments > Edit (pencil) > select New version > Deploy.
5. Keep Execute as: Me. Set access according to your organization's policy. Anyone allows anyone with the URL to access the web app; use only if intended.
6. Copy the deployed /exec URL and paste it in the app's Admin page.
7. Save settings, click Test Connection, then Fetch or Sync.

IMPORTANT
- The Admin page is a configuration screen, not an authentication boundary. Anyone who can open this static web app can access Admin. Do not store private API keys on shared/public devices.
- Gemini API key is stored in browser Local Storage. It is not sent to Google Sheets by the sync functions.
- This package has been syntax-checked, but cannot be live-tested against the user's Google account. The Apps Script deployment must be updated and authorized in the user's account.
