@echo off
echo ========================================
echo Copy APK to Desktop
echo ========================================

set APK_PATH=android\app\build\outputs\apk\release\app-release.apk
set DESKTOP=%USERPROFILE%\Desktop

echo.
echo Checking for APK...
if not exist "%APK_PATH%" (
    echo ERROR: APK not found! Build first.
    pause
    exit /b 1
)

echo.
echo Copying APK to Desktop...
copy "%APK_PATH%" "%DESKTOP%\Nifty50Tracker-v2.0.apk"

if %errorlevel% equ 0 (
    echo ✓ APK copied to Desktop as Nifty50Tracker-v2.0.apk
    echo.
    echo You can now:
    echo - Share via email/cloud
    echo - Copy to phone via USB
    echo - Upload to app stores
) else (
    echo ✗ Copy failed
)

echo.
pause