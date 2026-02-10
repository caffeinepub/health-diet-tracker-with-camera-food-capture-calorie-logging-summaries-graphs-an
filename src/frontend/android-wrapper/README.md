# Calorieshivam Android Wrapper

This directory contains an Android WebView wrapper that packages the Calorieshivam web app for distribution on the Google Play Store.

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

## Quick Start

### 1. Open in Android Studio

1. Launch Android Studio
2. Select "Open an Existing Project"
3. Navigate to `frontend/android-wrapper` and click "OK"
4. Wait for Gradle sync to complete

### 2. Configure Your Production URL

Before building, you **must** configure the Calorieshivam base URL:

**Option A: Edit `gradle.properties`**

Edit `gradle.properties` and set:

