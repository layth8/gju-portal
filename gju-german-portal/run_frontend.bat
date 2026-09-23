@echo off
cd /d "%~dp0\frontend"
set PATH=C:\Users\user\AppData\Local\nodejs-win;C:\Program Files\nodejs;%PATH%
call npm.cmd run dev -- --host 0.0.0.0 --port 5173
