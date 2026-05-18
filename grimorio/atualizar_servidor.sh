#!/bin/bash
# ============================================================
# SCRIPT DE ATUALIZAÇÃO RÁPIDA - GRIMÓRIO DE ARTON
# Rode este script dentro do seu servidor Ubuntu para atualizar
# ============================================================

echo "📥 1. Baixando as últimas alterações do seu GitHub..."
git pull origin main

echo "📦 2. Instalando possíveis pacotes novos..."
npm install

echo "🗄️ 3. Garantindo que o banco de dados está atualizado (Prisma)..."
npx prisma generate

echo "🏗️ 4. Compilando o site para a versão de produção (Build)..."
npm run build

echo "🔄 5. Reiniciando o servidor em background (PM2)..."
pm2 restart grimorio

echo ""
echo "✅ ATUALIZAÇÃO CONCLUÍDA! O Grimório já está rodando a nova versão!"
