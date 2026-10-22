$ErrorActionPreference = "Stop"

Write-Host "Building Digivice Release (V1)" -ForegroundColor Cyan

# 1. Obter os caminhos absolutos
$RootPath = "c:\Projetos\digivice"
$FrontendPath = Join-Path $RootPath "Frontend"
$TauriPath = Join-Path $RootPath "Tauri"

# 2. Build Tauri App
Write-Host "`n[1/1] Building Tauri App (Frontend + Rust)..." -ForegroundColor Yellow
Set-Location $FrontendPath
# Instalamos o cli se precisar
npm install
$env:TAURI_APP_PATH = $TauriPath
$env:TAURI_FRONTEND_PATH = $FrontendPath
npx tauri build

Write-Host "`nBuild Completed! Check Tauri/target/release/" -ForegroundColor Green
Set-Location $RootPath
