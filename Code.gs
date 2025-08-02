/**
 * Dublin Cleaners – “Stain Blaster” Mini-Game
 * Google Apps Script backend (HTML Service)
 * ------------------------------------------
 * Logs game results to a Google Sheet and serves index.html.
 *
 * 1.  Deploy as a Web App → “Execute as Me”, “Anyone”.
 * 2.  Add your Sheet ID below or create one named “StainBlasterLog”.
 */
// Google Sheet used for logging game results
const SHEET_ID   = '17k6TfJeAERydKa0L0vAXRp6y0q3zckB35dFv9qfDQ6g';
const SHEET_NAME = 'StainBlasterLog';
const HEADERS = [
  'Timestamp',
  'Voucher code',
  'Prize $',
  'Stains cleared',
  'Stains missed',
  'Seconds taken',
  'Device',
  'Geo location'
];

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
  const existingHeaders = sheet
    .getRange(1, 1, 1, Math.max(sheet.getLastColumn(), HEADERS.length))
    .getValues()[0];
  const headersMismatch = existingHeaders
    .slice(0, HEADERS.length)
    .some((h, i) => h !== HEADERS[i]);
  if (existingHeaders.length < HEADERS.length || headersMismatch) {
    sheet.getRange(1, 1, 1, HEADERS.length).setValues([HEADERS]);
    sheet.setFrozenRows(1); // keep headers visible
  }
  const d     = JSON.parse(dataJSON);
  sheet.appendRow([
    new Date(),            // Timestamp
    d.code || '',          // Voucher code (empty on loss)
    d.prize || 0,          // Dollar value won
    d.score,               // Stains cleared
    d.missed || 0,         // Stains missed
    d.duration,            // Seconds taken
    d.device || 'kiosk',   // Device label
    d.geo || ''            // Geo location
  ]);
  return true;
}
