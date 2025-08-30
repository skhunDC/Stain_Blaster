# Stain Blaster Kiosk Game

An ✨ 12-second touch game for Dublin Cleaners’ 55″ Elo ET5502L portrait kiosk. Guests wipe stains off a crisp white dress shirt while a cartoony cannon lobs extra splatters; clear them all to reveal a quick cleaning tip. The same build now scales down for phones, keeping the cannon visible and shrinking stains for added challenge.

## Kiosk/Iframe Build

This kiosk-focused build removes all audio and restricted browser APIs. Apps Script is configured with `XFrameOptionsMode.ALLOWALL` so the game can be embedded inside iframes without permission errors.

```html
<iframe
  src="https://script.google.com/macros/s/AKfycbwACMboC3x2m_9Sg1f_-HXYzpG3bnA81rYp3ra-q4vOttXJNKVag3uCLnmt9IsaEfI1/exec" 
  width="1080"
  height="1920"
  style="border:0; aspect-ratio: 9/16;"
  sandbox="allow-scripts allow-same-origin"
></iframe>
```

> The iframe intentionally omits `allow` tokens for geolocation, camera, microphone, fullscreen, clipboard, payments, and other restricted features. Permissions are fully controlled by the outer page.

## Stack
* **Google Apps Script (HTML Service)** – one `Code.gs` backend.
* **Tailwind CSS via CDN** – rapid, utility-first styling.
* **Vanilla JS** – fast, dependency-light touch handling.
* **canvas-confetti** CDN – celebration effects.
* **Google Sheets** – game logging for analytics.

## Quick Start
1. The provided `Code.gs` logs to [this Google Sheet](https://docs.google.com/spreadsheets/d/17k6TfJeAERydKa0L0vAXRp6y0q3zckB35dFv9qfDQ6g/edit) by default.
2. If using a different spreadsheet, update the `SHEET_ID` constant in `Code.gs`.
3. Add an **HTML** file named `index` and paste `index.html`.
4. **Deploy → New Web App** “Execute as Me”, “Anyone”, copy URL.
5. Point EloView/Yodeck to this URL (ensure portrait 1080×1920).

## Attract Bubbles
* Start screen spawns playful speech bubbles every ~4 s (±1 s jitter).
* Lines rotate from the `BUBBLE_LINES` array; edit or fetch at runtime to change copy.
* Animations use `bubble-in` (scale/bounce fade-in) and `bubble-out` (fade-out after 5 s).
* Tweak cadence via `BUBBLE_INTERVAL`/`BUBBLE_JITTER` without redeploying by loading config from GAS.

## Dynamic Difficulty
* Consecutive wins ramp up the challenge.
* Each streak shrinks stains ~20 %, adds ~15 % more splatters, and speeds the cannon by ~15 %.
* Losing resets the streak and returns to base difficulty.
* Streak resets after 5 minutes of inactivity but never blocks play.

## Replay Policy
* Players can start a new round immediately after each game.
* Consecutive wins continue to ramp difficulty to keep the challenge lively.

## Mobile Optimizations
* Phones render smaller stains, spread them across a wider vertical range, and clear with a quick tap.

## Cleaning Tips
* Every round ends with a rotating eco-friendly cleaning tip to reinforce garment care.

## Sheet Schema
Each play logs a row to the Google Sheet with the following columns:

| Column | Header         | Purpose                                 |
| ------ | -------------- | --------------------------------------- |
| A      | Timestamp      | When the result was recorded            |
| B      | Stains cleared | Number of stains the player removed     |
| C      | Stains missed  | Stains left when time expired           |
| D      | Seconds taken  | Duration of the game in seconds         |
| E      | Device         | Source device label (kiosk or mobile)   |

Monitor play counts and difficulty; pivot by day for analytics.

## Local Assets
* **Shirt background** – 1080 × 1920 PNG of a pressed white dress shirt.
* **Stain sprites** – semi-transparent PNG splatters (~90 px) with drop shadow; phones render them ~25 % smaller.
* **Cannon sprite** – small, cartoony launcher anchored bottom-right; shrinks on phones so it never covers the Play button.
All images can be swapped by editing `index.html`.

## License
Internal use only – Dublin Cleaners. Fork freely inside org.

## v2 Addendum
* Rounds locked to 12 seconds.
* Difficulty scales exponentially each level via stain count/size/spawn interval curve.
