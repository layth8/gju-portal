@echo off
start "GJU Portal Backend (FastAPI)" cmd /c "%~dp0run_backend.bat"
start "GJU Portal Frontend (Vite)" cmd /c "%~dp0run_frontend.bat"
echo Servers started in independent terminal windows!
