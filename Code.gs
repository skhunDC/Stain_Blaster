/**
 * Dublin Cleaners – “Stain Blaster” Mini-Game
 * Google Apps Script backend (HTML Service)
 * ------------------------------------------
 * Logs game results to a Google Sheet and serves index.html.
 *
 * 1.  Deploy as a Web App → “Execute as Me”, “Anyone”.
 * 2.  Add your Sheet ID below or create one named “StainBlasterLog”.
 */
const SHEET_ID   = 'YOUR_SHEET_ID_HERE';   // ← update
const SHEET_NAME = 'StainBlasterLog';

/** Serve the kiosk page */
function doGet() {
  return HtmlService.createHtmlOutputFromFile('index')
    .setTitle('Stain Blaster – Dublin Cleaners')
    .addMetaTag('viewport', 'width=device-width, initial-scale=1');
}

/** Append one row of JSON-encoded data from client */
function logGame(dataJSON) {
  const ss    = SpreadsheetApp.openById(SHEET_ID);
  const sheet = ss.getSheetByName(SHEET_NAME) || ss.insertSheet(SHEET_NAME);
  const d     = JSON.parse(dataJSON);
  sheet.appendRow([
    new Date(),          // Timestamp
    d.code,              // Voucher code shown in QR
    d.prize,             // Dollar value won
    d.score,             // Stains cleared
    d.duration,          // Seconds taken
    d.device || 'kiosk'  // Device label
  ]);
  return true;
}
