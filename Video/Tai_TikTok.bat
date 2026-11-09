@echo off
chcp 65001 >nul
set PYTHONUTF8=1
title Tai video mau + nhac tu TikTok
cd /d "%~dp0"
echo ===============================================
echo   TAI VIDEO MAU + NHAC TU MOT KENH TIKTOK
echo   Video -> thu muc template, nhac -> thu muc mp3
echo ===============================================
echo.
set "PY="
where py >nul 2>nul && set "PY=py -3"
if not defined PY ( where python >nul 2>nul && set "PY=python" )
if defined PY (
  %PY% -c "import sys" >nul 2>nul || set "PY="
)
if not defined PY (
  echo [!] May chua co Python.
  echo     Trang tai Python se mo ra. Khi cai, NHO tick o "Add python.exe to PATH",
  echo     cai xong thi nhan dup lai file nay.
  start "" "https://www.python.org/downloads/"
  echo.
  pause
  exit /b 1
)
%PY% tai_tiktok.py
echo.
if errorlevel 1 (
  echo [!] Co loi. Chup man hinh cua so nay gui cho nguoi ho tro.
)
echo.
pause
