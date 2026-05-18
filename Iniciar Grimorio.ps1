# Grimorio de Arton — Launcher
# Inicia o servidor Next.js e abre o browser automaticamente

$host.UI.RawUI.WindowTitle = "Grimorio de Arton"
$host.UI.RawUI.BackgroundColor = "Black"
$host.UI.RawUI.ForegroundColor = "Green"
Clear-Host

Write-Host ""
Write-Host "  ╔═══════════════════════════════════════════════╗" -ForegroundColor Red
Write-Host "  ║       GRIMÓRIO DE ARTON — TORMENTA 20         ║" -ForegroundColor Red
Write-Host "  ╚═══════════════════════════════════════════════╝" -ForegroundColor Red
Write-Host ""
Write-Host "  ⚔  Preparando o Grimório..." -ForegroundColor Yellow
Write-Host ""

$projectPath = Join-Path $PSScriptRoot "grimorio"
Set-Location $projectPath

# Gerar Prisma Client se necessário
Write-Host "  📚 Verificando banco de dados..." -ForegroundColor Cyan
npx prisma generate 2>&1 | Out-Null

Write-Host "  🌐 Iniciando servidor em http://localhost:3000" -ForegroundColor Cyan
Write-Host ""
Write-Host "  Pressione Ctrl+C para encerrar." -ForegroundColor DarkGray
Write-Host ""

# Abrir o browser após 3 segundos
$null = Start-Job -ScriptBlock {
    Start-Sleep 3
    Start-Process "http://localhost:3000"
}

# Iniciar o servidor
npm run dev
