# Dublin Cleaners “Stain Blaster” Game – Agent Notes

## Overview
The **Stain Blaster** mini-game reinforces Dublin Cleaners’ Three Uniques by inviting passers-by to *literally* wipe stains from a shirt in under 15 seconds. Winners instantly receive a QR-encoded gift-certificate, driving in-store redemptions and measurable engagement.

| Core Loop | Tech / Files |
|-----------|--------------|
| 1. Attract screen invites touch.<br>2. Twelve stains appear over a fabric background.<br>3. Guests tap/slide each stain → it vanishes.<br>4. Clear all within 15 s → confetti, prize, QR.<br>5. Lose → friendly “Try again.” | `Code.gs` – GAS backend (log to Sheet).<br>`index.html` – Tailwind kiosk front end.<br>Sheet tab **StainBlasterLog** stores timestamp, voucher, prize, score, duration. |

## Prize Logic
Weighted probabilities (60 % → $5, 25 % → $10, 10 % → $20, 4 % → $25, 1 % → $50) run **client-side** for snappy UX; results post to GAS where marketing can monitor redemption frequency and tweak weights.

## QR Content
QR codes embed a plain-text voucher string (`DCGC-<epochMs>-<value>`), avoiding URL requirements yet uniquely identifying each win.

## Offline Resilience
A 10-line service-worker caches Tailwind CDN, images, and QR/confetti libraries so the kiosk keeps running during Wi-Fi hiccups.

## Future Enhancements
* **Dynamic difficulty** – shrink stain size or raise count after consecutive wins.  
* **Remote weights** – read prize probabilities from the Sheet for on-the-fly tuning.  
* **Attract-loop video** – swap static start screen with looping MP4 call-outs.  
* **Analytics dashboard** – Data Studio viz of plays, win rates, and prize cost.
