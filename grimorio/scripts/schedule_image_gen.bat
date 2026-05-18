@echo off
REM ============================================================
REM  schedule_image_gen.bat
REM  Cria uma tarefa no Windows Task Scheduler para rodar o
REM  gerador de imagens automaticamente quando a cota resetar.
REM
REM  USO: Execute como Administrador ou aceite o prompt UAC
REM ============================================================

SET TASK_NAME=Tormenta20_SpellImageGen
SET SCRIPT_DIR=%~dp0
SET NODE_SCRIPT=%SCRIPT_DIR%auto_generate_spell_images.js
SET BATCH_SIZE=20

REM Horário de reset da cota (preencha antes de executar)
REM Formato 24h: HH:MM
SET RESET_TIME=20:10

echo.
echo ============================================================
echo  Agendador de Geracao de Imagens - Tormenta 20
echo ============================================================
echo.
echo Tarefa:  %TASK_NAME%
echo Script:  %NODE_SCRIPT%
echo Horario: %RESET_TIME% (horario local)
echo Lote:    %BATCH_SIZE% imagens por execucao
echo.

REM Remove tarefa antiga se existir
schtasks /Delete /TN "%TASK_NAME%" /F >nul 2>&1

REM Cria nova tarefa
schtasks /Create ^
  /TN "%TASK_NAME%" ^
  /TR "node \"%NODE_SCRIPT%\" --batch %BATCH_SIZE%" ^
  /SC ONCE ^
  /ST %RESET_TIME% ^
  /RL HIGHEST ^
  /F

IF %ERRORLEVEL% EQU 0 (
  echo.
  echo [OK] Tarefa agendada com sucesso!
  echo      O script rodara automaticamente as %RESET_TIME%.
  echo.
  echo Para ver a tarefa:  schtasks /Query /TN "%TASK_NAME%"
  echo Para cancelar:      schtasks /Delete /TN "%TASK_NAME%" /F
  echo Para rodar agora:   schtasks /Run /TN "%TASK_NAME%"
) ELSE (
  echo.
  echo [ERRO] Falha ao criar tarefa. Tente executar como Administrador.
)

echo.
pause
