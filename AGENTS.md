# Stain Blaster – Kiosk Ops Notes

## Scope
- Single 55" portrait kiosk (1080×1920).
- UI locked to 1080×1920; no responsive CSS or viewport meta.
- Pointer events only; set `touch-action: none`.
- Cannon image must remain visible at all times.

## Non-goals
- No mobile support or small-screen layouts.
- No geolocation, motion sensors, camera/mic, audio/video, or fullscreen APIs.
- No external reward services; QR generated locally.

## Deployment
- Deploy as a GAS Web App and allow iframe embedding via `setXFrameOptionsMode(ALLOWALL)`.
- Embeddable via a plain `<iframe>` without requesting additional permissions.
