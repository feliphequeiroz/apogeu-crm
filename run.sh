#!/bin/bash

GREEN='\033[0;32m'
BLUE='\033[0;34m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m'

clear
echo -e "${BLUE}╔═══════════════════════════════════════╗${NC}"
echo -e "${BLUE}║     🚀 APOGEU CRM - Iniciando        ║${NC}"
echo -e "${BLUE}╚═══════════════════════════════════════╝${NC}"

if ! grep -q "NEXT_PUBLIC_SUPABASE_URL=" .env.local || [ -z "$(grep '^NEXT_PUBLIC_SUPABASE_URL=' .env.local | cut -d= -f2)" ]; then
  echo -e "${RED}❌ .env.local não preenchido${NC}"
  exit 1
fi

if [ ! -d "node_modules" ]; then
  echo -e "${YELLOW}Instalando dependências...${NC}"
  npm install
fi

echo ""
echo -e "${GREEN}╔═══════════════════════════════════════╗${NC}"
echo -e "${GREEN}║  🎉 Apogeu CRM rodando!              ║${NC}"
echo -e "${GREEN}║  📍 http://localhost:3000            ║${NC}"
echo -e "${GREEN}╚═══════════════════════════════════════╝${NC}"
echo ""

npm run dev
