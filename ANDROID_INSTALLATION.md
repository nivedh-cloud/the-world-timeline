# World Timeline Android App - Installation Guide

## APK Information
- **File**: `WorldTimeline-v1.0.apk`
- **Size**: ~5.3 MB
- **Build Type**: Debug (For Testing)
- **Target Android**: 7.0+ (API Level 24+)

## Installation Steps

### Prerequisites
1. **Android Device** (Phone or Tablet)
   - Android version 7.0 (API 24) or higher
   - At least 100 MB free storage

2. **Enable Unknown Sources**
   - Go to **Settings → Security**
   - Enable **"Unknown Sources"** or **"Install unknown apps"**
   - (This allows installation from sources other than Google Play Store)

### Installation Method 1: Via File Transfer
1. Connect your Android device to your Windows computer via USB cable
2. Copy `WorldTimeline-v1.0.apk` to your device's storage
3. On your Android device, open **File Manager** or **Files** app
4. Navigate to where you copied the APK
5. Tap the APK file to install
6. Tap **Install** when prompted
7. Once installed, tap **Open** to launch the app

### Installation Method 2: Via Android Studio
1. Open Android Studio
2. Go to **Device Manager** → Select your device
3. Drag and drop `WorldTimeline-v1.0.apk` onto the connected device
4. Wait for installation to complete

### Installation Method 3: Via Wireless ADB (Advanced)
1. Enable Developer Mode on Android device (tap Build Number 7 times in Settings → About Phone)
2. Enable USB Debugging in Developer Options
3. Run: `adb devices` to verify connection
4. Run: `adb install WorldTimeline-v1.0.apk`
5. Wait for the "Success" message

## First Launch
- When you first open the app, you may see permission requests:
  - **Location**: Allow for map functionality
  - **Storage**: Allow for local data access
- Tap **Allow** to grant permissions
- Download/sync will start automatically if internet is available

## Features Available
✅ Interactive Timeline Map  
✅ 132+ Historical & Biblical Events  
✅ Year Selection (-3000 BCE to 2000 AD)  
✅ 14 Ancient Journeys Visualization  
✅ Event Filtering (Bible/World)  
✅ English/Telugu Language Support  
✅ Responsive Mobile Interface  
✅ Bottom Navigation Tabs  

## Troubleshooting

### App Won't Install
- **Error: "App not installed"**
  - Check if you have enough storage (free up ~200 MB)
  - Try uninstalling any previous version first
  - Re-enable Unknown Sources in Settings

- **Error: "Parse error"**
  - The APK file might be corrupted
  - Download it again and retry

### App Crashes or Won't Load
- Clear app cache: Settings → Apps → World Timeline → Clear Cache
- Clear app data: Settings → Apps → World Timeline → Clear Storage
- Uninstall and reinstall the app
- Restart your device

### Maps Don't Load
- Check internet connection
- Ensure you allow Location permission
- Check if device date/time is correct

### Performance Issues
- Close other apps running in background
- Clear app cache periodically
- Restart device if lagging persists

## Uninstallation
1. Go to **Settings → Apps → World Timeline**
2. Tap **Uninstall**
3. Confirm removal

## Notes
- This is a **Debug APK** (development version)
- For production use, a Release APK with proper signing is recommended
- The app requires internet connection for maps functionality
- Data is primarily stored offline (JSON files included in app)

## Support & Feedback
If you encounter any issues:
1. Check the Troubleshooting section above
2. Verify your Android version is 7.0 or higher
3. Contact the development team with:
   - Your Android device model and version
   - Screenshot of error (if any)
   - Steps to reproduce the issue

---

**Version**: 1.0 (Debug)  
**Release Date**: March 2, 2026  
**Capacitor Framework**: Latest  

