# Physical Device Setup

## Steps to fix "make sure you're running metro" error:

1. **Start Metro with IP address:**
   ```
   start-metro.bat
   ```
   OR manually:
   ```
   npx react-native start --host 192.168.0.11
   ```

2. **On your physical device:**
   - Shake the device to open dev menu
   - Tap "Settings"
   - Tap "Debug server host & port for device"
   - Enter: `192.168.0.11:8081`
   - Go back and tap "Reload"

3. **Alternative - ADB port forwarding:**
   ```
   adb reverse tcp:8081 tcp:8081
   ```

## Your network IP: 192.168.0.11