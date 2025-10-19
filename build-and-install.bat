@echo off
echo ========================================
echo Building and Installing Nifty50Tracker
echo ========================================

echo.
echo [1/4] Building Release APK...
cd android
call gradlew assembleRelease
if %errorlevel% neq 0 (
    echo ERROR: Build failed!
    pause
    exit /b 1
)

echo.
echo [2/4] Checking for APK...
set APK_PATH=app\build\outputs\apk\release\app-release.apk
if not exist "%APK_PATH%" (
    echo ERROR: APK not found at %APK_PATH%
    pause
    exit /b 1
)

echo.
echo [3/4] Detecting connected devices...
cd ..
adb devices

echo.
echo [4/4] Installing APK to all connected devices...
for /f "skip=1 tokens=1" %%i in ('adb devices ^| findstr "device"') do (
    echo Installing to device: %%i
    adb -s %%i install -r "android\%APK_PATH%"
    if %errorlevel% equ 0 (
        echo ✓ Successfully installed to %%i
    ) else (
        echo ✗ Failed to install to %%i
    )
    echo.
)

echo.
echo ========================================
echo Installation Complete!
echo APK Location: android\%APK_PATH%
echo ========================================
pause