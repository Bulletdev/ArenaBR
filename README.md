
```
>        █████╗ ██████╗ ███████╗███╗   ██╗ █████╗   ██████╗ ██████╗
>       ██╔══██╗██╔══██╗██╔════╝████╗  ██║██╔══██╗  ██╔══██╗██╔══██╗
>       ███████║██████╔╝█████╗  ██╔██╗ ██║███████║  ██████╔╝██████╔╝
>       ██╔══██║██╔══██╗██╔══╝  ██║╚██╗██║██╔══██║  ██╔══██╗██╔══██╗
>       ██║  ██║██║  ██║███████╗██║ ╚████║██║  ██║  ██████╔╝██║  ██║
>       ╚═╝  ╚═╝╚═╝  ╚═╝╚══════╝╚═╝  ╚═══╝╚═╝  ╚═╝  ╚═════╝ ╚═╝  ╚═╝
>                  Campeonatos de LoL — Cenário Amador TIER 3 BR
```

<div align="center">

[![Next.js](https://img.shields.io/badge/Next.js-15-black?logo=next.js)](https://nextjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5-3178C6?logo=typescript)](https://www.typescriptlang.org/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind-3-38BDF8?logo=tailwindcss)](https://tailwindcss.com/)
[![Zustand](https://img.shields.io/badge/Zustand-5-orange)](https://zustand-demo.pmnd.rs/)
[![TanStack Query](https://img.shields.io/badge/TanStack_Query-5-FF4154?logo=reactquery)](https://tanstack.com/query)
[![License](https://img.shields.io/badge/License-Private-lightgrey.svg)]()

</div>

---

```
╔═════════════════════════════════════════════════════════════════════════════╗
║  ARENABR — Next.js 15 (App Router)                                          ║
╠═════════════════════════════════════════════════════════════════════════════╣
║  Plataforma de campeonatos de League of Legends para o cenário amador BR.   ║
║  Consome a prostaff-api para auth, perfil e elenco · Inscrição via Pix      ║
╚═════════════════════════════════════════════════════════════════════════════╝
```

---

<details>
<summary><kbd>▶ Funcionalidades (clique para expandir)</kbd></summary>

```
┌─────────────────────────────────────────────────────────────────────────────┐
│  [■] Autenticacao JWT       — Login/registro via prostaff-api (proxy)       │
│  [■] Dashboard de campeonatos — Cards, classificacao, protocolo do dia      │
│  [■] Modulo de campeonato   — Partidas, bracket dupla-elim, stats, admin    │
│  [■] Inscricao de times     — Modal 3 passos: tipo → elenco → Pix           │
│  [■] Free Agents            — Pool de jogadores sem time + convites         │
│  [■] Perfil do jogador      — Dados prostaff + elo Riot sincronizado        │
│  [■] Carteira (ProPay)      — Saldo Pix, deposito QR, saque PIX             │
│  [■] Admin panel            — Submissao de resultados, W.O., progressao     │
│  [■] Proxy pattern          — Todos os fetches via Next.js API Routes       │
│  [■] Protecao de rotas      — Middleware le cookie arena_token              │
│  [■] Design system retro    — Scanlines, bracket-corners, paleta crimson    │
└─────────────────────────────────────────────────────────────────────────────┘
```

</details>

---

## Table of Contents

```
┌──────────────────────────────────────────────────────┐
│  01 · Quick Start                                    │
│  02 · Technology Stack                               │
│  03 · Architecture                                   │
│  04 · Rotas da Aplicacao                             │
│  05 · API Proxy Routes                               │
│  06 · Variaveis de Ambiente                          │
│  07 · Modelo de Dados                                │
│  08 · Design System                                  │
└──────────────────────────────────────────────────────┘
```

---

## 01 · Quick Start

**Pre-requisito:** [prostaff-api](https://github.com/Bulletdev/prostaff-api) rodando em `http://localhost:3333`

```bash
# Instalar dependencias
npm install

# Configurar variavel de ambiente
cp .env.example .env.local
# editar NEXT_PUBLIC_API_URL se necessario

# Subir servidor de desenvolvimento (porta 4000)
npm run dev
```

```
  App:  http://localhost:4000
  API:  http://localhost:3333 (prostaff-api)
```

---

## 02 · Technology Stack

```
╔══════════════════════╦════════════════════════════════════════════════════╗
║  CAMADA              ║  TECNOLOGIA                                        ║
╠══════════════════════╬════════════════════════════════════════════════════╣
║  Framework           ║  Next.js 15 (App Router)                           ║
║  Linguagem           ║  TypeScript 5                                      ║
║  Estilo              ║  Tailwind CSS 3 + CSS Variables                    ║
║  Estado global       ║  Zustand 5 (persist)                               ║
║  Data fetching       ║  TanStack Query 5                                  ║
║  Formularios         ║  React Hook Form + Zod                             ║
║  Animacoes           ║  Framer Motion 11                                  ║
║  Toasts              ║  Sonner                                            ║
║  Icones              ║  Lucide React + SVGs customizados                  ║
╚══════════════════════╩════════════════════════════════════════════════════╝
```

---

## 03 · Architecture

```
┌─────────────────────────────────────────────────────────────────────────────┐
│  PROXY PATTERN — CHAIN COMPLETO                                             │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                             │
│  Browser → Next.js API Route → prostaff-api → servico externo               │
│                                                                             │
│  Auth:                                                                      │
│    Browser → /api/auth/login → prostaff-api /auth/login                     │
│                                                                             │
│  Players / Perfil:                                                          │
│    Browser → /api/players   → prostaff-api /api/v1/players                  │
│                                                                             │
│  Carteira (ProPay):                                                         │
│    Browser → /api/wallet    → prostaff-api /api/v1/wallet                   │
│                             → ProPay (rede Docker interna)                  │
│                                                                             │
│  Motivos do proxy:                                                          │
│  · Injetar cookie arena_token como Authorization: Bearer (server-side)      │
│  · Isolar credenciais — ProPay nunca e exposto ao browser                   │
│  · Centralizar CORS — prostaff-api so precisa liberar Next.js               │
└─────────────────────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────────────────────┐
│  AUTH FLOW                                                                  │
├─────────────────────────────────────────────────────────────────────────────┤
│  POST /api/auth/login  →  proxy seta cookie arena_token (HttpOnly em prod)  │
│  middleware.ts         →  protege /dashboard/** — redireciona se sem token  │
│  Zustand (persist)     →  mantem user/player em localStorage                │
└─────────────────────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────────────────────┐
│  REAL-TIME (Phoenix Channels / prostaff-events)                             │
├─────────────────────────────────────────────────────────────────────────────┤
│  Browser → WebSocket → prostaff-events (Elixir/Phoenix)                     │
│  Usado para: notificacoes de partidas, atualizacoes de bracket em tempo     │
│  real. Servico separado do prostaff-api (porta 4000 interna).               │
└─────────────────────────────────────────────────────────────────────────────┘
```

---

## 04 · Rotas da Aplicacao

```
┌──────────────────────────────────────┬───────────┬──────────────────────────┐
│  ROTA                                │  ACESSO   │  DESCRICAO               │
├──────────────────────────────────────┼───────────┼──────────────────────────┤
│  /                                   │  Publico  │  Landing page            │
│  /login                              │  Publico  │  Login prostaff-api      │
│  /register                           │  Publico  │  Cadastro prostaff-api   │
│  /dashboard                          │  Auth     │  Campeonatos + ranking   │
│  /dashboard/times                    │  Auth     │  Elenco da org           │
│  /dashboard/jogadores                │  Auth     │  Free agents             │
│  /dashboard/perfil                   │  Auth     │  Perfil + org            │
│  /dashboard/carteira                 │  Auth     │  Saldo, deposito, saque  │
│  /dashboard/convites                 │  Auth     │  Convites (players)      │
│  /dashboard/campeonatos/[id]         │  Auth     │  Partidas, bracket, stats│
└──────────────────────────────────────┴───────────┴──────────────────────────┘
```

---

## 05 · API Proxy Routes

```
┌──────────────────────────────────┬────────┬───────────────────────────────────┐
│  ROUTE (Next.js)                 │  VERB  │  PROXIA PARA (prostaff-api)       │
├──────────────────────────────────┼────────┼───────────────────────────────────┤
│  /api/auth/login                 │  POST  │  /auth/login                      │
│  /api/auth/register              │  POST  │  /auth/register                   │
│  /api/auth/player-login          │  POST  │  /auth/player-login               │
│  /api/auth/player-register       │  POST  │  /auth/player-register            │
│  /api/auth/logout                │  POST  │  /auth/logout                     │
│  /api/profile                    │  GET   │  /profile                         │
│  /api/players                    │  GET   │  /api/v1/players                  │
│  /api/players/[id]               │  GET   │  /api/v1/players/:id              │
│  /api/players/search             │  GET   │  /api/v1/players/search_..        │
│  /api/free-agents                │  GET   │  /api/v1/rosters/free-agents      │
├──────────────────────────────────┼────────┼───────────────────────────────────┤
│  /api/wallet                     │  GET   │  /api/v1/wallet        (ProPay)   │
│  /api/wallet/transactions        │  GET   │  /api/v1/wallet/transactions      │
│  /api/wallet/deposit             │  POST  │  /api/v1/wallet/deposit           │
│  /api/wallet/charges/[txid]      │  GET   │  /api/v1/wallet/charges/:txid     │
│  /api/wallet/payouts             │  POST  │  /api/v1/wallet/payouts           │
│  /api/wallet/payouts/[id]        │  GET   │  /api/v1/wallet/payouts/:id       │
└──────────────────────────────────┴────────┴───────────────────────────────────┘

  Todas as rotas /api/wallet/* sao forwarded pelo prostaff-api para o ProPay
  via rede Docker interna. O browser nunca chama o ProPay diretamente.
  Mutacoes (deposit, payouts POST) incluem Idempotency-Key automaticamente.
```

---

## 06 · Variaveis de Ambiente

```
┌─────────────────────────────────────────────────────────────────────────────┐
│  .env.local (ArenaBR — Next.js)                                             │
├──────────────────────────────┬──────────────────────────────────────────────┤
│  NEXT_PUBLIC_API_URL         │  URL do prostaff-api                         │
│                              │  Dev:  http://localhost:3333/api/v1          │
│                              │  Prod: https://api.prostaff.gg/api/v1        │
└──────────────────────────────┴──────────────────────────────────────────────┘

  Variaveis do ProPay ficam APENAS no prostaff-api (nao no ArenaBR):
    PROPAY_URL          — ex: http://propay:5555 (rede Docker interna)
    PROPAY_OPENPIX_*    — credenciais do gateway Pix
```

---

## 07 · Modelo de Dados

```
┌─────────────────────────────────────────────────────────────────────────────┐
│  MAPEAMENTO prostaff-api → ArenaBR                                          │
├──────────────────────────┬──────────────────────────────────────────────────┤
│  prostaff-api            │  ArenaBR                                         │
├──────────────────────────┼──────────────────────────────────────────────────┤
│  User (coach/owner)      │  Usuario logado — gerencia o time                │
│  Organization            │  Time inscrito no campeonato                     │
│  Player (da org)         │  Jogador do elenco                               │
│  Player.riot_puuid       │  Validacao Riot (sincronizado pelo prostaff)     │
│  GET /players            │  Elenco (filtrado pela org do token)             │
│  GET /rosters/free-agents│  Pool de free agents                             │
├──────────────────────────┴──────────────────────────────────────────────────┤
│  Entidades proprias ArenaBR (nao existem no prostaff):                      │
│  · Championship   — campeonatos com datas, formato, premiacao, vagas        │
│  · Enrollment     — liga Organization a um Championship                     │
│  · EnrollmentPayment — status de pagamento Pix (R$100/equipe)               │
│  · Invite         — convite para free agent entrar num time                 │
└─────────────────────────────────────────────────────────────────────────────┘
```

---

## 08 · Design System

```
┌────────────────────────────────────────────────────────────────────────────┐
│  PALETA SEMANTICA                                                          │
├──────────────────┬──────────┬──────────────────────────────────────────────┤
│  Token           │  Hex     │  Uso                                         │
├──────────────────┼──────────┼──────────────────────────────────────────────┤
│  Navy            │ #0A0E1A  │  Background principal                        │
│  Card            │ #0F1823  │  Superficie de cards                         │
│  Muted           │ #1A2235  │  Hover / estados ativos                      │
│  Border          │ #252D3D  │  Divisores e bordas                          │
│  Crimson         │ #B91C1C  │  CTA, acoes, panels, bracket-corners         │
│  Gold            │ #C89B3C  │  Premiacao, valores monetarios, rankings     │
│  Success         │ #00D364  │  Vitorias, status positivo                   │
│  Danger          │ #FF4444  │  Derrotas, alertas, erros                    │
│  Text            │ #E8E8E8  │  Texto principal                             │
└──────────────────┴──────────┴──────────────────────────────────────────────┘

  Fontes:  Exo 2 (body) · Rajdhani (display) · Share Tech Mono (mono)
  Padroes: scanlines · bracket-corners · retro-panel (crimson) · badges retro

  Regra semantica:
    Crimson  — interacao, navegacao, acoes do usuario
    Gold     — dinheiro, premios, rankings de tier
```

---

## Scripts

```bash
npm run dev      # dev na porta 4000
npm run build    # build de producao
npm run start    # serve o build
```

---
