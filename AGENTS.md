# Dublin Cleaners “Stain Blaster” Game – Agent Notes

## Overview
The **Stain Blaster** mini-game reinforces Dublin Cleaners’ Three Uniques by inviting passers-by to *literally* wipe stains from a shirt in under 12 seconds. Winners instantly receive a QR-encoded gift-certificate, driving in-store redemptions and measurable engagement. The kiosk build targets a 55" portrait Elo display, while the same code adapts to sub‑414 px mobile browsers.

| Core Loop | Tech / Files |
|-----------|--------------|
| 1. Attract screen invites touch.<br>2. Twenty-three stains appear over a white shirt background.<br>3. Guests tap/slide each stain → it vanishes.<br>4. Clear all within 12 s (including cannon-fired extras) → confetti, prize, QR.<br>5. Lose → friendly “Try again.” | `Code.gs` – GAS backend (log to Sheet).<br>`index.html` – Tailwind front end with responsive tweaks.<br>Sheet tab **StainBlasterLog** stores timestamp, voucher, prize, score, missed, duration, device, geo. |

## Prize Logic
Weighted probabilities (60 % → $5, 25 % → $10, 10 % → $20, 4 % → $25, 1 % → $50) run **client-side** for snappy UX; results post to GAS where marketing can monitor redemption frequency and tweak weights.

## QR Content
QR codes embed a plain-text voucher string (`DCGC-<epochMs>-<value>`), avoiding URL requirements yet uniquely identifying each win.

## Fair Play & Bonus Rounds
* Players can start a new round immediately; no cooldown or `nextPlay` tracking.
* Winners get a 50 % coin‑flip for an instant bonus round.
* Losses display "Thanks for playing! Tap Play Again to try again."

## Mobile Touch Tweaks
* Phones render smaller stains, scatter them across a wider vertical range, and disappear with a quick tap.

## QR Rewards
* Wins show a QR‑encoded voucher worth $5‑$50.
* Losses still present a QR with a quick cleaning tip to reinforce eco expertise.

## Offline Resilience
A 10-line service-worker caches Tailwind CDN, images, and QR/confetti libraries so the kiosk keeps running during Wi-Fi hiccups.

## Future Enhancements
* **Dynamic difficulty** – shrink stain size or raise count after consecutive wins.
* **Remote weights** – read prize probabilities from the Sheet for on-the-fly tuning.
* **Attract-loop video** – swap static start screen with looping MP4 call-outs.
* **Analytics dashboard** – Data Studio viz of plays, win rates, and prize cost.

## Phase 2 Notes
* Background swaps to a high-res white dress shirt.
* Stains use semi-transparent PNG splatters (~90 px) with drop shadows.
* A bottom-right cannon fires additional stains along arced paths every 3 s and scales down on phones so the start button stays clear.
* Timer reduced to 12 s; clearing **all** active stains (initial + fired) yields a win.
* Stains shrink ~25 % and spawn across a broader vertical range on phones for extra challenge.
* `logGame` now records `missed` count alongside `score` and device.

## Phase 3 Notes
* Attract mode spawns speech bubbles every ~4 s (±1 s) with playful lines.
* Bubbles appear only on the start screen, fade after 5 s, and cap at three.
* Copy lives in `BUBBLE_LINES` and timing in `BUBBLE_INTERVAL/JITTER` for easy tweaks.
