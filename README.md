# Kiosk-Only Stain Blaster

A 12-second tap game built for a 55" portrait kiosk (1080×1920). Players clear eight stains before the timer ends to reveal a QR reward. The cannon image remains visible throughout the round. The project targets kiosk deployments only and intentionally omits mobile layouts and sensor APIs.

## Deploying

1. In Google Apps Script, add `Code.gs` and `index.html`.
2. Deploy as a **Web App** with *Execute as me* and *Anyone* access.
3. The stage is fixed at 1080×1920; point your signage player or kiosk browser to the deployment URL.

### Embed in an iframe

```html
<iframe
  src="YOUR_DEPLOYED_URL"
  width="1080"
  height="1920"
  style="border:0;"
></iframe>
```

## Notes

- No mobile or responsive logic; kiosk-only.
- No geolocation, camera, microphone, audio/video, or fullscreen requests.
- QR drawer renders a local placeholder—swap with a real QR library for production rewards.
