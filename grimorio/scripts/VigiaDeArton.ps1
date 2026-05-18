# Vigia de Arton - Auto-save script

$status = git status --porcelain
if ($status) {
    Write-Host "  Vigia de Arton: Salvando alteracoes..." -ForegroundColor Yellow
    git add .
    $timestamp = Get-Date -Format "dd/MM/yyyy HH:mm:ss"
    git commit -m "Auto-save: $timestamp"

    Write-Host "  Enviando para o GitHub..." -ForegroundColor Cyan
    git push origin main 2>$null

    Write-Host "  Cronicas salvas com sucesso!" -ForegroundColor Green
} else {
    Write-Host "  Vigia de Arton: Nenhuma alteracao pendente." -ForegroundColor Gray
}
