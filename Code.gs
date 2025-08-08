function doGet() {
  return HtmlService.createHtmlOutputFromFile('index')
    .setXFrameOptionsMode(HtmlService.XFrameOptionsMode.ALLOWALL)
    .setSandboxMode(HtmlService.SandboxMode.IFRAME);
}

function getRewardToken(data) {
  var secret = PropertiesService.getScriptProperties().getProperty('HMAC_SECRET') || '';
  var signature = Utilities.computeHmacSha256Signature(data, secret);
  return Utilities.base64Encode(signature);
}
