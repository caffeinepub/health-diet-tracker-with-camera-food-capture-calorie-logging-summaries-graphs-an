# Specification

## Summary
**Goal:** Let signed-in users record and review personal lab/vitals measurements (CBC + blood pressure) and see a baseline snapshot derived from their latest records.

**Planned changes:**
- Add backend data model and APIs for per-user health track records (hemoglobin, platelets, blood pressure systolic/high, blood pressure diastolic/low) with per-principal isolation and input validation.
- Add backend query API to return a “baseline snapshot” (latest value per supported metric), returning missing metrics as empty rather than trapping.
- Add an authenticated “Health Records” UI area to add and view records (type, value + unit, date) with English validation messages and newest-first sorting.
- Add navigation entry point(s) to reach Health Records from the logged-in experience using the existing router pattern.
- Show a compact, read-only “Baseline Health” summary card in a consistently visible logged-in location (e.g., dashboard), with graceful fallback on load errors.

**User-visible outcome:** Users can add and view their hemoglobin, platelets, and blood pressure readings over time, and see a baseline summary showing their latest values as a starting point.
