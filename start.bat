@echo off
echo.
echo ========================================
echo    Sevgili Testi - Site Baslatiliyor
echo ========================================
echo.
echo Tarayici otomatik olarak acilacak...
echo.
echo Siteyi kapatmak icin bu pencereyi kapatin.
echo.

REM Python kontrolü
python --version >nul 2>&1
if %errorlevel% == 0 (
    echo Python bulundu, server baslatiliyor...
    echo.
    start http://localhost:8000
    python -m http.server 8000
) else (
    REM Python yoksa Node.js kontrolü
    node --version >nul 2>&1
    if %errorlevel% == 0 (
        echo Node.js bulundu, server baslatiliyor...
        echo.
        start http://localhost:8000
        npx http-server -p 8000 -o
    ) else (
        REM Hiçbiri yoksa basit HTML aç
        echo Python veya Node.js bulunamadi.
        echo HTML dosyasi dogrudan aciliyor...
        echo.
        start index.html
    )
)

pause

