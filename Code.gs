/**
 * Dublin Cleaners – “Stain Blaster” Mini-Game
 * Google Apps Script backend (HTML Service)
 * ------------------------------------------
 * Logs game results to a Google Sheet and serves index.html.
 * Supports both kiosk and mobile plays; client reports device type.
 *
 * 1.  Deploy as a Web App → “Execute as Me”, “Anyone”.
 * 2.  Add your Sheet ID below or create one named “StainBlasterLog”.
 */
// Google Sheet used for logging game results
const SHEET_ID = "17k6TfJeAERydKa0L0vAXRp6y0q3zckB35dFv9qfDQ6g";
const SHEET_NAME = "StainBlasterLog";
const HEADERS = [
  "Timestamp",
  "Stains cleared",
  "Stains missed",
  "Seconds taken",
  "Device", // 'kiosk' or 'mobile'
  "Prize Tier",
  "Prize Code",
];

/** Serve the kiosk page */
function doGet() {
  return HtmlService.createHtmlOutputFromFile("index")
    .setTitle("Dublin Cleaners Game")
    .setXFrameOptionsMode(HtmlService.XFrameOptionsMode.ALLOWALL);
}

/** Append one row of JSON-encoded data from client */
function logGame(dataJSON) {
  const ss = SpreadsheetApp.openById(SHEET_ID);
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
  if (!dataJSON) {
    return false;
  }
  let d;
  try {
    d = JSON.parse(dataJSON);
  } catch (e) {
    return false;
  }
  sheet.appendRow([
    new Date(), // Timestamp
    d.score, // Stains cleared
    d.missed || 0, // Stains missed
    d.duration, // Seconds taken
    d.device || "kiosk", // Device label
    d.prizeTier || "", // Prize tier name
    d.prizeCode || "", // Unique prize code if applicable
  ]);
  return true;
}

/** Provide server timestamp so clients can't bypass cooldown by changing device clock */
function getServerTime() {
  return Date.now();
}

// ----- Win Streak Helpers -----
/**
 * Refresh win streak timer at game start. If more than five minutes have
 * elapsed since the last play, the streak (difficulty) resets. Returns the
 * current streak value so the client can adjust difficulty immediately.
 */
function refreshStreakTimer() {
  const props = PropertiesService.getUserProperties();
  const lastWin = Number(props.getProperty("lastPlayTs") || 0);
  if (Date.now() - lastWin > 5 * 60 * 1000) {
    props.deleteProperty("winStreak");
  }
  props.setProperty("lastPlayTs", Date.now());
  return Number(props.getProperty("winStreak") || 0);
}

/**
 * Handle a completed win by advancing the streak. Returns the updated value
 * so the client can adjust difficulty.
 */
function handleWin() {
  const props = PropertiesService.getUserProperties();
  const idx = Number(props.getProperty("winStreak") || 0) + 1;
  props.setProperty("winStreak", idx);
  return { winStreak: idx };
}
