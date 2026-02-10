# Specification

## Summary
**Goal:** Add optional voice dictation for meal descriptions during scan confirmation, and show an automatic weekly (last 7 days) nutrition summary with a visual 1–10 rating and deterministic, goal-aligned feedback.

**Planned changes:**
- Add a microphone start/stop control on the scan confirmation (“Confirm Food Details”) step to dictate a meal description into an editable text field, with graceful fallback to manual typing when unsupported or permission is denied.
- Persist the edited dictated description into the saved food entry so it appears anywhere entry label/details are shown (without breaking manual entry).
- Add a Dashboard “Weekly Summary (Last 7 Days)” section that automatically displays last-7-days totals/averages (at minimum calories and macros), a 1–10 score, and an English feedback message, including an English congratulatory message when on track.
- Render the 1–10 weekly score as a clear visual rating element consistent with existing Tailwind/Shadcn styling.
- Implement fully local, deterministic weekly feedback rules (no external calls), referencing the user’s stored body goal when available and showing an English insufficient-data state when the last 7 days have too few/no entries.

**User-visible outcome:** Users can speak a meal description during scan confirmation, edit it, and save it as the entry description; the Dashboard automatically shows a weekly summary card with macros/calories, a visual 1–10 rating, and simple goal-aware feedback or an insufficient-data message.
