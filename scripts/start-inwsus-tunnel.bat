@echo off
chcp 65001 >nul
title inwsus Secure Tunnel
if exist "%~dp0start-inwsus-tunnel.ps1" (
  powershell -NoProfile -NonInteractive -ExecutionPolicy Bypass -File "%~dp0start-inwsus-tunnel.ps1" -OpenDashboard
) else (
  powershell -NoProfile -NonInteractive -ExecutionPolicy Bypass -File "%USERPROFILE%\Downloads\tunnel\start-inwsus-tunnel.ps1" -OpenDashboard
)
if errorlevel 1 pause
