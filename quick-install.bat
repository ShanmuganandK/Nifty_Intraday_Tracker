@echo off
echo ========================================
echo Quick Install (No Build)
echo ========================================

set APK_PATH=android\app\build\outputs\apk\release\app-release.apk

echo.
echo Checking for existing APK...
if not exist "%APK_PATH%" (
    echo ERROR: No APK found! Run build-and-install.bat first
    pause
    exit /b 1
)

echo.
echo Detecting devices...
adb devices

echo.
echo Installing existing APK to all devices...
for /f "skip=1 tokens=1" %%i in ('adb devices ^| findstr "device"') do (
    echo Installing to: %%i
    adb -s %%i install -r "%APK_PATH%"
    if %errorlevel% equ 0 (
        echo ✓ Success: %%i
    ) else (
        echo ✗ Failed: %%i
    )
)

echo.
echo Done!
pause