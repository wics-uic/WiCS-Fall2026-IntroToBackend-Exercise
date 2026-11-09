/**
 * Google Apps Script for WiCS Contact Form Backend
 *
 * Spreadsheet: https://docs.google.com/spreadsheets/d/1awWmrG0uorAElDOYJhYngkWziymaFej8cQhmMfBYCIo/edit?gid=1549311547#gid=1549311547
 * Target Sheet GID: 1549311547
 *
 * HOW TO INSTALL:
 * 1. Open the Google Sheet above.
 * 2. In the top menu, go to: Extensions > Apps Script.
 * 3. Replace any code in Code.gs with this entire file.
 * 4. Click the "Save" icon (Ctrl+S or Cmd+S).
 * 5. Click "Deploy" > "New deployment".
 * 6. Click the gear icon next to "Select type" and select "Web app".
 * 7. Set the following options:
 *    - Description: WiCS Contact Form API
 *    - Execute as: Me (<your email>)
 *    - Who has access: Anyone  <-- (CRITICAL: Do NOT choose "Only myself" or "Anyone in UIC")
 * 8. Click "Deploy", authorize permissions when prompted.
 * 9. Copy the generated "Web App URL" (ends in /exec).
 * 10. Paste the URL into .env as CONTACT_SCRIPT_URL.
 */

const SECRET = "wicsbackenddevproject";
const TARGET_GID = 1549311547;
const SPREADSHEET_ID = "1awWmrG0uorAElDOYJhYngkWziymaFej8cQhmMfBYCIo";

function doPost(e) {
  try {
    if (!e || !e.postData || !e.postData.contents) {
      return jsonResponse({ ok: false, error: "Empty request body" });
    }

    const data = JSON.parse(e.postData.contents);

    // Verify secret
    if (data.secret !== SECRET) {
      return jsonResponse({ ok: false, error: "Unauthorized: Invalid secret" });
    }

    // Validate fields
    const name = data.name ? String(data.name).trim() : "";
    const email = data.email ? String(data.email).trim() : "";
    const message = data.message ? String(data.message).trim() : "";

    if (!name && !email && !message) {
      return jsonResponse({ ok: false, error: "Missing required fields" });
    }

    // Open spreadsheet (bound to sheet or by ID)
    let ss;
    try {
      ss = SpreadsheetApp.getActiveSpreadsheet();
    } catch (_) {}
    if (!ss) {
      ss = SpreadsheetApp.openById(SPREADSHEET_ID);
    }

    // Find the sheet tab by GID (1549311547)
    let targetSheet = null;
    const sheets = ss.getSheets();
    for (let i = 0; i < sheets.length; i++) {
      if (sheets[i].getSheetId() === TARGET_GID) {
        targetSheet = sheets[i];
        break;
      }
    }

    // If GID sheet not found, fallback to active or first sheet
    if (!targetSheet) {
      targetSheet = ss.getActiveSheet() || sheets[0];
    }

    // If sheet is completely empty, add header row
    if (targetSheet.getLastRow() === 0) {
      targetSheet.appendRow(["Timestamp", "Name", "Email", "Message"]);
    }

    // Format current date and time
    const timestamp = Utilities.formatDate(
      new Date(),
      Session.getScriptTimeZone() || "America/Chicago",
      "yyyy-MM-dd HH:mm:ss"
    );

    // Append submission row
    targetSheet.appendRow([timestamp, name, email, message]);

    return jsonResponse({ ok: true, message: "Row added successfully" });
  } catch (err) {
    return jsonResponse({ ok: false, error: err.toString() });
  }
}

// GET handler to easily test if the Web App is alive in a browser
function doGet(e) {
  return jsonResponse({
    ok: true,
    status: "WiCS Contact Form API is online",
    spreadsheetId: SPREADSHEET_ID,
    targetGid: TARGET_GID
  });
}

function jsonResponse(obj) {
  return ContentService.createTextOutput(JSON.stringify(obj))
    .setMimeType(ContentService.MimeType.JSON);
}
