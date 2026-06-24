# Controle de Disparos - Dashboard

Dashboard web em React + Vite para espelhar o painel de Controle de Disparos do Google Sheets por meio da API publicada no Google Apps Script.

## Tecnologias

- React
- Vite
- Recharts
- CSS puro moderno

## Configuração

Copie o arquivo de exemplo de variáveis de ambiente:

```bash
cp .env.example .env
```

A variável esperada é:

```env
VITE_DASHBOARD_API_URL=https://script.google.com/macros/s/AKfycbw6u6Zq1STtxmq8YYqKR9buSqCju095HCiOSx3uV6xVWQ_GXDjcMRNJ-Omb7YXqnzqf/exec
```

## Instalação

```bash
npm install
```

## Desenvolvimento

```bash
npm run dev
```

## Build de produção

```bash
npm run build
```

## Estrutura esperada da API

```json
{
  "resumo": [],
  "ranking": [],
  "arquivos": [],
  "consultores": [],
  "matriculasPorMes": [],
  "matriculasOrigem": [],
  "atualizadoEm": ""
}
```

O dashboard não possui backend próprio. Todos os dados são carregados diretamente da URL definida em `VITE_DASHBOARD_API_URL`.
