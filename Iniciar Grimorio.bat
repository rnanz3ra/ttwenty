@echo off
title Grimorio de Arton - Iniciando...
color 0A

echo.
echo  =====================================================
echo    GRIMORIO DE ARTON - Tormenta 20 APP
echo  =====================================================
echo.
echo  [1/3] Verificando dependencias...
cd /d "%~dp0grimorio"

if not exist "node_modules" (
    echo  Instalando dependencias, aguarde...
    call npm install
)

echo  [2/3] Gerando Prisma Client...
call npx prisma generate >nul 2>&1

echo  [3/3] Iniciando servidor de desenvolvimento...
echo.
echo  Acesse: http://localhost:3000
echo  Para encerrar, feche esta janela ou pressione Ctrl+C
echo.

start "" "http://localhost:3000"
call npm run dev
