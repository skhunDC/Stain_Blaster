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
const SHEET_ID   = '17k6TfJeAERydKa0L0vAXRp6y0q3zckB35dFv9qfDQ6g';
const SHEET_NAME = 'StainBlasterLog';
const HEADERS = [
  'Timestamp',
  'Voucher code',
  'Prize $',
  'Stains cleared',
  'Stains missed',
  'Seconds taken',
  'Device',            // 'kiosk' or 'mobile'
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

/** Provide server timestamp so clients can't bypass cooldown by changing device clock */
function getServerTime(){
  return Date.now();
}

// ----- Win Streak Helpers -----
// Prize ladder: attempt to climb for bigger credits on consecutive wins.
const prizeTable = [
  {chance: 0.50, credit:  5},
  {chance: 0.25, credit: 10},
  {chance: 0.25, credit: 25},
  {chance: 0.10, credit: 50},
];

/**
 * Refresh win streak timer at game start. If more than five minutes have
 * elapsed since the last play, the streak (difficulty) resets. Returns the
 * current streak value so the client can adjust difficulty immediately.
 */
function refreshStreakTimer(){
  const props   = PropertiesService.getUserProperties();
  const lastWin = Number(props.getProperty('lastPlayTs') || 0);
  if(Date.now() - lastWin > 5 * 60 * 1000){
    props.deleteProperty('winStreak');
  }
  props.setProperty('lastPlayTs', Date.now());
  return Number(props.getProperty('winStreak') || 0);
}

/**
 * Handle a completed win. Depending on the current streak, the player has a
 * chance to earn a larger credit and advance up the ladder. Failure still
 * counts as a normal win; the streak resets to zero.
 *
 * Returns an object {success:Boolean, prize:Number, winStreak:Number} where
 * `success` indicates a ladder hit and `prize` is the credit to award.
 */
function handleWin(){
  const props = PropertiesService.getUserProperties();
  const idx   = Number(props.getProperty('winStreak') || 0);
  const tier  = prizeTable[Math.min(idx, prizeTable.length - 1)];

  if(Math.random() < tier.chance){
    // SUCCESS ➜ prize path
    if(idx >= prizeTable.length - 1){
      props.deleteProperty('winStreak');
      return {success:true, prize:tier.credit, winStreak:0};
    }
    props.setProperty('winStreak', idx + 1);
    return {success:true, prize:tier.credit, winStreak:idx + 1};
  }else{
    // FAIL ➜ normal win
    props.deleteProperty('winStreak');
    return {success:false, prize:0, winStreak:0};
  }
}
