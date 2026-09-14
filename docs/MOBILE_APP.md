# Arcane Codex — Mobile App (Capacitor) Guide

This project is configured with **Capacitor 8** to run Arcane Codex (Life RPG) as a native mobile application on Android and iOS.

---

## 📱 Mobile Architecture & Features

- **App ID**: `com.arcanecodex.liferpg`
- **App Name**: `Arcane Codex`
- **Plugins Installed**:
  - `@capacitor/app`: Native lifecycle and Android hardware back button handler
  - `@capacitor/status-bar`: Dark themed status bar matching Arcane palette (`#0A0910`)
  - `@capacitor/splash-screen`: Dark fantasy splash screen with gold spinner
  - `@capacitor/haptics`: Mobile vibration & haptic feedback for game events
  - `@capacitor/keyboard`: Smooth keyboard display & viewport resizing
- **Edge-to-Edge Display**: Configured with `viewport-fit=cover` and CSS safe-area variables in `src/app/globals.css`.

---

## 🚀 Quick Start / Development Workflow

### 1. Live Reload on Android (Recommended during Development)

In development mode, you can point Capacitor directly to your Next.js local server so changes to your UI/gameplay appear instantly on your device or emulator without rebuilding native code:

1. Start your Next.js dev server on your local machine:
   ```bash
   npm run dev
   ```

2. Find your local Wi-Fi IP address (e.g. `192.168.1.50`) or use `http://10.0.2.2:3000` for Android Studio Emulator.

3. In PowerShell, set `CAPACITOR_SERVER_URL` and sync:
   ```powershell
   $env:CAPACITOR_SERVER_URL="http://192.168.1.50:3000"
   npx cap sync android
   npx cap open android
   ```

4. Run the app in Android Studio. It will connect to your running Next.js instance with live reload!

---

### 2. Standalone Mobile Build

To sync the latest web assets into the native Android package:

```bash
# 1. Sync assets and plugins with native platforms
npm run cap:sync

# 2. Open Android Studio to build APK / AAB
npm run cap:open:android
```

---

## 🛠 Useful NPM Scripts

| Script | Description |
|---|---|
| `npm run cap:sync` | Syncs web assets and native plugins to the `android/` directory |
| `npm run cap:open:android` | Opens the native Android project in Android Studio |
| `npm run cap:run:android` | Runs the app directly on a connected Android device or emulator |
| `npm run cap:build` | Builds Next.js and synchronizes with Capacitor |
| `npm run cap:apk:debug` | Builds and outputs debug APK via Gradle CLI |
| `npm run cap:apk:release` | Builds release APK via Gradle CLI |

---

## 📦 Generating an APK

### Method 1: Using NPM / Gradle CLI (Fastest)

Run the following command in your terminal:

```bash
npm run cap:apk:debug
```

*(Or manually: `cd android && .\gradlew.bat assembleDebug && cd ..` on Windows)*

The built APK will be located at:
```text
android/app/build/outputs/apk/debug/app-debug.apk
```

---

### Method 2: Using Android Studio (GUI)

1. Open Android Studio:
   ```bash
   npm run cap:open:android
   ```
2. In Android Studio's top menu bar, click **Build** > **Build Bundle(s) / APK(s)** > **Build APK(s)**.
3. Once the build completes, click the **"locate"** link in the bottom-right popup to open the folder containing `app-debug.apk`.