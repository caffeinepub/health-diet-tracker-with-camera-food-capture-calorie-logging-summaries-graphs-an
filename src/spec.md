# Specification

## Summary
**Goal:** Provide a true installable Android app experience via sideloading, and make the app’s user-facing name/branding easy to configure and consistent across web and Android.

**Planned changes:**
- Update `frontend/android-wrapper/README.md` with a sideload (non–Play Store) distribution section, including how to set `nutriscan.baseUrl`, how to produce a release APK/AAB (Android Studio and/or Gradle CLI), and how end users install the APK on-device.
- Fix Android wrapper branding consistency so the installed app’s launcher label uses `@string/app_name` and any leftover internal theme/style naming is updated consistently, with the wrapper still building for debug and release.
- Add an in-web “Install App” entry point (visible to users) that explains in English what the Android app is (packaged web app) and how to install it via sideload, including where the APK comes from.
- Centralize and document the user-facing display name configuration for the web app (header/login/tab title/alt text) and for the Android wrapper (`app_name`), so it can be changed from a single place for each surface without hunting through multiple files.

**User-visible outcome:** Users can find an “Install App” option in the web UI with clear Android sideload instructions, and the installed Android app shows the correct unique app name; developers have clear documentation to build and distribute a release APK/AAB and to set the production URL.
