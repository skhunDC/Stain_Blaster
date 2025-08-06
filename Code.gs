/**
 * Dublin Cleaners – "Stain Blaster" Mini-Game (v2)
 * Google Apps Script backend
 * ----------------------------------------------
 * Handles reward generation, QR creation and Sheet logging.
 * Rewards are always dollar credits or comped services – never percentages.
 */

const SHEET_ID   = '17k6TfJeAERydKa0L0vAXRp6y0q3zckB35dFv9qfDQ6g';
const SHEET_NAME = 'RewardLog';
const HEADERS = [
  'playerId',
  'rewardId',
  'tier',
  'rewardText',
  'redeemed?',
  'timestamp',
  'requiresManagerApproval'
];

/** Serve main page or redeem page */
function doGet(e){
  if(e && e.parameter && e.parameter.rewardId){
    return redeem(e.parameter.rewardId);
  }
  return HtmlService.createHtmlOutputFromFile('index')
    .setTitle('Stain Blaster – Dublin Cleaners')
    .addMetaTag('viewport', 'width=device-width, initial-scale=1');
}

/** Core game handler called from client */
function playGame(playerId, win, level){
  const props = PropertiesService.getUserProperties();
  let winStreak = Number(props.getProperty('winStreak') || 0);
  if(win){
    // apply win before bumping streak so bonus uses previous streak value
    winStreak += 1;
  }else{
    winStreak = 0;
  }
  props.setProperty('winStreak', winStreak);
  props.setProperty('lastLevel', level);

  // choose tier (base probabilities)
  let tier = pickTier();
  if(win && winStreak > 1){
    tier = Math.min(4, tier + 1); // streak bonus
  }

  // reward text and guardrails
  const rewardText = pickRewardText(tier);
  const ss    = SpreadsheetApp.openById(SHEET_ID);
  const sheet = ss.getSheetByName(SHEET_NAME) || ss.insertSheet(SHEET_NAME);
  ensureHeaders(sheet);
  if(tier >= 2 && hasActiveCredit(sheet, playerId)){
    // downgrade to tier 1 if prior credit exists
    tier = 1;
  }
  const finalText = pickRewardText(tier);

  // generate QR only for tier >=2 credits
  let qrBlob = null;
  const rewardId = Utilities.getUuid();
  let requiresApproval = finalText.indexOf('Comped premium garment') !== -1;
  if(tier >= 2){
    const baseUrl   = ScriptApp.getService().getUrl();
    const redeemUrl = baseUrl + '?rewardId=' + rewardId;
    const qrUrl     = 'https://chart.googleapis.com/chart?chs=200x200&cht=qr&chl=' + encodeURIComponent(redeemUrl);
    const blob      = UrlFetchApp.fetch(qrUrl).getBlob();
    qrBlob          = Utilities.base64Encode(blob.getBytes());
  }

  sheet.appendRow([
    playerId,
    rewardId,
    tier,
    finalText,
    false,
    new Date(),
    requiresApproval
  ]);

  return {tier:tier, rewardText:finalText, qrBlob:qrBlob, winStreak:winStreak};
}

/** Determine reward tier from weighted probabilities */
function pickTier(){
  const r = Math.random();
  if(r < 0.60) return 1;
  if(r < 0.85) return 2;
  if(r < 0.97) return 3;
  return 4;
}

const REWARDS = {
  1: ['Eco tip: line-dry to save energy', 'Share our stain-guide GIF!'],
  2: ['$5 cleaning credit', 'Free button replacement'],
  3: ['$10 cleaning credit', 'Comped shirt press'],
  4: ['Comped premium garment', 'VIP rush credit']
};

function pickRewardText(tier){
  const opts = REWARDS[tier];
  return opts[Math.floor(Math.random()*opts.length)];
}

/** Ensure headers exist on the Sheet */
function ensureHeaders(sheet){
  const existing = sheet.getRange(1,1,1,HEADERS.length).getValues()[0];
  if(existing.join() !== HEADERS.join()){
    sheet.getRange(1,1,1,HEADERS.length).setValues([HEADERS]);
    sheet.setFrozenRows(1);
  }
}

/** Guardrail: one active Tier2+ credit per 7 days */
function hasActiveCredit(sheet, playerId){
  const now   = new Date();
  const limit = new Date(now.getTime() - 7*24*60*60*1000);
  const rows  = sheet.getDataRange().getValues();
  for(let i=1;i<rows.length;i++){
    const row = rows[i];
    if(row[0] === playerId && row[2] >= 2 && row[4] !== true){
      const ts = row[5];
      if(ts && ts >= limit) return true;
    }
  }
  return false;
}

/** Redeem endpoint toggles redeemed? to TRUE and shows confirmation */
function redeem(rewardId){
  const ss    = SpreadsheetApp.openById(SHEET_ID);
  const sheet = ss.getSheetByName(SHEET_NAME) || ss.insertSheet(SHEET_NAME);
  const data  = sheet.getDataRange().getValues();
  for(let i=1;i<data.length;i++){
    if(data[i][1] === rewardId){
      sheet.getRange(i+1,5).setValue(true);
      return HtmlService.createHtmlOutput('<h2>Reward Redeemed</h2><p>' + data[i][3] + '</p>');
    }
  }
  return HtmlService.createHtmlOutput('<h2>Reward not found</h2>');
}
