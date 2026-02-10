# Specification

## Summary
**Goal:** Build a simple health & diet tracking app where signed-in users can log food (manually or via camera capture), see daily/range summaries and interactive graphs, and use an in-app helper chat based on curated guidance.

**Planned changes:**
- Add Internet Identity sign-in/out and scope all diet data to the signed-in principal.
- Implement a persistent food entry data model with timestamp/day, label, calories, macros (protein/carbs/fat), a small micronutrient set, plus portion multiplier and confidence value.
- Create a Daily Dashboard showing today’s total calories, today’s entry list, and totals for a selectable date range; update UI via refetch/invalidation without full reload.
- Add interactive visualizations: calories over time, macro distribution for a selected day, and a computed “nutrition balance” rating with a clear explanation.
- Implement a camera capture flow that prefers the back camera, supports preview, and then routes into an estimation/confirmation step (not auto-log).
- Add a deterministic in-app chat helper (no external LLM calls) backed by curated FAQ/rules, with suggested prompts, citations to app guidance, and a fallback response.
- Apply a consistent, simple visual theme (avoiding blue/purple default palette) and ensure key flows are reachable from main navigation.
- Add and render generated static assets (logo + illustrations) from `frontend/public/assets/generated` in the header and at least one empty state.

**User-visible outcome:** Users can sign in with Internet Identity, capture or manually log foods with calories/nutrients (including portion/confidence), view daily and date-range totals with interactive charts and a nutrition balance rating, and chat with an in-app helper that answers from built-in guidance.
