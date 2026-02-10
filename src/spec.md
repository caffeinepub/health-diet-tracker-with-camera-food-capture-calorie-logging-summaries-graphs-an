# Specification

## Summary
**Goal:** Add per-user BMI and maintenance calories (TDEE) calculations based on stored profile details, and rename the app’s user-facing name to “Calorieshivam”.

**Planned changes:**
- Extend the per-user profile model to include additional optional fields needed for BMI/TDEE (height, age, sex, activity level) while preserving existing fields and per-principal isolation.
- Add a backend query that computes and returns BMI (with category label), BMR, and TDEE for the authenticated caller, and reports which required inputs are missing when incomplete.
- Update the post-login profile setup flow to collect and validate the new profile inputs and save them alongside existing profile fields; ensure all UI text is in English and does not reference old app names.
- Add a persistent Dashboard section showing maintenance calories (TDEE), today’s consumed calories, above/below/at maintenance with the kcal difference, and BMI with category; show an English prompt when profile inputs are missing.
- Rename all user-facing branding strings across the web app and Android wrapper to “Calorieshivam” (titles, header, footer, alt text, and Android app_name/README headings), without changing technical identifiers unless required to build.

**User-visible outcome:** Logged-in users can complete an expanded profile (height/age/sex/activity level) and see their BMI and maintenance calories on the Dashboard, including how today’s intake compares to maintenance; the app is displayed everywhere as “Calorieshivam”.
