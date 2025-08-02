# Stain Blaster Kiosk Game

An ✨ 12-second touch game for Dublin Cleaners’ 55″ Elo ET5502L portrait kiosk. Guests wipe stains off a crisp white dress shirt while a cartoony cannon lobs extra splatters; clear them all to win instant, QR‑encoded gift certificates. The same build now scales down for phones, keeping the cannon visible and shrinking stains for added challenge.

## Stack
* **Google Apps Script (HTML Service)** – one `Code.gs` backend.
* **Tailwind CSS via CDN** – rapid, utility-first styling.
* **Vanilla JS** – fast, dependency-light touch handling.
* **qrcodejs** & **canvas-confetti** CDNs – QR & celebration effects.
* **Google Sheets** – prize logging for marketing analytics.

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
* Streak resets after 5 minutes of inactivity on the same device.

## Replay Policy
* Players can start a new round immediately after each game.
* Consecutive wins continue to ramp difficulty to keep the challenge lively.

## Mobile Optimizations
* Phones render smaller stains, spread them across a wider vertical range, and clear with a quick tap.

## QR Rewards
* Victories produce a QR‑encoded voucher worth $5‑$50.
* Even losses present a QR with a short cleaning tip to reinforce eco expertise.
* Tips rotate from the `LOSS_TIPS` array; edit it to add or tweak loser messages like “Misleading Label” or “Mysterious Lint Monster.”

## Prize Odds
Default odds live in `index.html`. To adjust without a push, expose them via `logGame` response or a `getConfig()` GAS endpoint, then fetch at runtime.

| Prize | Odds |
|-------|------|
| $5   | 60 % |
| $10  | 25 % |
| $20  | 10 % |
| $25  | 4 %  |
| $50  | 1 %  |

## Sheet Schema
Each play logs a row to the Google Sheet with the following columns:

| Column | Header         | Purpose                                 |
| ------ | -------------- | --------------------------------------- |
| A      | Timestamp      | When the result was recorded            |
| B      | Voucher code   | Unique voucher string (blank on loss)   |
| C      | Prize $        | Dollar value awarded to the player      |
| D      | Stains cleared | Number of stains the player removed     |
| E      | Stains missed  | Stains left when time expired           |
| F      | Seconds taken  | Duration of the game in seconds         |
| G      | Device         | Source device label (kiosk or mobile)   |

Monitor play counts, difficulty, and cost; pivot by day for prize budgeting.

## Local Assets
* **Shirt background** – 1080 × 1920 PNG of a pressed white dress shirt.
* **Stain sprites** – semi-transparent PNG splatters (~90 px) with drop shadow; phones render them ~25 % smaller.
* **Cannon sprite** – small, cartoony launcher anchored bottom-right; shrinks on phones so it never covers the Play button.
All images can be swapped by editing `index.html`; the service worker caches them for offline play.

## License
Internal use only – Dublin Cleaners. Fork freely inside org.
