# Stain Blaster Kiosk Game

An ✨ 15-second touch game for Dublin Cleaners’ 55″ Elo ET5502L portrait kiosk. Guests wipe stains off a shirt to win instant, QR-encoded gift certificates.

## Stack
* **Google Apps Script (HTML Service)** – one `Code.gs` backend.
* **Tailwind CSS via CDN** – rapid, utility-first styling.
* **Vanilla JS** – fast, dependency-light touch handling.
* **qrcodejs** & **canvas-confetti** CDNs – QR & celebration effects.
* **Google Sheets** – prize logging for marketing analytics.

## Quick Start
1. Create (or reuse) a Google Sheet; note its ID.  
2. In Apps Script, paste `Code.gs`, set `SHEET_ID`.  
3. Add an **HTML** file named `index` and paste `index.html`.  
4. **Deploy → New Web App** “Execute as Me”, “Anyone”, copy URL.  
5. Point EloView/Yodeck to this URL (ensure portrait 1080×1920).  

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
| A              | B        | C     | D     | E        | F     |
| -------------- | -------- | ----- | ----- | -------- | ----- |
| Timestamp      | Code     | Prize | Score | Duration | Device|

Monitor play counts & cost; pivot by day for prize budgeting.

## Local Assets
Replace placeholder stain/shirt images by editing `.stain` CSS or inserting PNGs; brand art lives in your CMS cache, auto-offline via service worker.

## License
Internal use only – Dublin Cleaners. Fork freely inside org.
