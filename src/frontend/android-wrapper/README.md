# Calorieshivam Android Wrapper

This directory contains an Android WebView wrapper that packages the Calorieshivam web app as an installable Android application.

## Overview

The wrapper loads the Calorieshivam web application in a full-screen WebView with:
- Internet Identity authentication support (popup/redirect handling)
- Camera permission handling for food scanning
- Secure HTTPS-only communication
- Proper back button navigation
- Offline error handling

## Prerequisites

- Android Studio (latest stable version recommended)
- JDK 8 or higher
- Android SDK with API level 24+ (Android 7.0+)

---

## Sideload Distribution (Outside Play Store)

This section explains how to build and distribute the app as an APK for installation outside the Google Play Store.

### 1. Configure Production URL

Before building, you **must** configure the production web app URL.

**Edit `frontend/android-wrapper/gradle.properties`:**

