@echo off
cd /d "%~dp0"

echo.
echo  === Kagora Setup ===
echo.

where node >nul 2>&1
if %errorlevel% neq 0 (
    echo [!!] Node.js not found.
    echo     Please install from https://nodejs.org
    pause
    exit /b 1
)
for /f "tokens=*" %%v in ('node --version') do echo [OK] Node.js %%v

if not exist node_modules (
    echo.
    echo [..] Installing dependencies...
    call npm install
    if %errorlevel% neq 0 (
        echo [!!] npm install failed.
        pause
        exit /b 1
    )
    echo [OK] Dependencies installed.
)

echo.
echo  Starting Kagora...
echo.
call npm run dev
pause
