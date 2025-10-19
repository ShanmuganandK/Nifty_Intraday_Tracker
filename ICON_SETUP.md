# App Icon Setup Instructions

## Icon Sizes Required

Your beautiful gradient icon needs to be resized for different Android densities:

### Required Sizes:
- **mipmap-mdpi**: 48x48 px
- **mipmap-hdpi**: 72x72 px  
- **mipmap-xhdpi**: 96x96 px
- **mipmap-xxhdpi**: 144x144 px
- **mipmap-xxxhdpi**: 192x192 px

### Steps to Update Icon:

1. **Resize the icon** to these sizes using any image editor
2. **Save as PNG** with transparent background
3. **Replace existing files** in these folders:
   ```
   android/app/src/main/res/mipmap-mdpi/ic_launcher.png
   android/app/src/main/res/mipmap-hdpi/ic_launcher.png
   android/app/src/main/res/mipmap-xhdpi/ic_launcher.png
   android/app/src/main/res/mipmap-xxhdpi/ic_launcher.png
   android/app/src/main/res/mipmap-xxxhdpi/ic_launcher.png
   ```

4. **Also replace round icons** (same sizes):
   ```
   android/app/src/main/res/mipmap-mdpi/ic_launcher_round.png
   android/app/src/main/res/mipmap-hdpi/ic_launcher_round.png
   android/app/src/main/res/mipmap-xhdpi/ic_launcher_round.png
   android/app/src/main/res/mipmap-xxhdpi/ic_launcher_round.png
   android/app/src/main/res/mipmap-xxxhdpi/ic_launcher_round.png
   ```

### Online Tools (Recommended):
- **Android Asset Studio**: https://romannurik.github.io/AndroidAssetStudio/
- **App Icon Generator**: https://appicon.co/
- **Icon Kitchen**: https://icon.kitchen/

### Quick Method:
1. Upload your icon to Android Asset Studio
2. Download the generated zip file
3. Extract and copy all mipmap folders to `android/app/src/main/res/`
4. Rebuild APK

### Icon Features:
✅ Perfect gradient (blue to green)
✅ Clear upward arrow (growth symbol)
✅ Magnifying glass (analysis symbol)
✅ "NIFTY TRACKER" text
✅ Professional finance app look

**After replacing icons, run:** `build-and-install.bat`