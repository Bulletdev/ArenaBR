
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
╔══════════════════════════════════════════════════════════════════════════════╗
║  ARENABR — Next.js 15 (App Router)                                           ║
╠══════════════════════════════════════════════════════════════════════════════╣
║  Plataforma de campeonatos de League of Legends para o cenário amador BR.    ║
║  Consome a prostaff-api para auth, perfil e elenco · Inscrição via Pix       ║
╚══════════════════════════════════════════════════════════════════════════════╝
```

---

<details>
<summary><kbd>▶ Funcionalidades (clique para expandir)</kbd></summary>

```
┌─────────────────────────────────────────────────────────────────────────────┐
│  [■] Autenticação JWT       — Login/registro via prostaff-api (proxy)       │
│  [■] Dashboard de campeonatos — Cards, classificação, protocolo do dia      │
│  [■] Módulo de campeonato   — Partidas, bracket dupla-elim, stats, admin    │
│  [■] Inscrição de times     — Modal 3 passos: tipo → elenco → Pix           │
│  [■] Free Agents            — Pool de jogadores sem time + convites         │
│  [■] Perfil do jogador      — Dados prostaff + elo Riot sincronizado        │
│  [■] Admin panel            — Submissão de resultados, W.O., progressão     │
│  [■] Proxy pattern          — Todos os fetches via Next.js API Routes       │
│  [■] Proteção de rotas      — Middleware lê cookie arena_token              │
│  [■] Design system retro    — Scanlines, hud-corners, paleta gold/teal      │
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
│  04 · Rotas da Aplicação                             │
│  05 · API Proxy Routes                               │
│  06 · Modelo de Dados                                │
│  07 · Design System                                  │
└──────────────────────────────────────────────────────┘
```

---

## 01 · Quick Start

**Pré-requisito:** [prostaff-api](https://github.com/Bulletdev/prostaff-api) rodando em `http://localhost:3333`

```bash
# Instalar dependências
npm install

# Configurar variável de ambiente
cp .env.example .env.local
# editar NEXT_PUBLIC_API_URL se necessário

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
║  Formulários         ║  React Hook Form + Zod                             ║
║  Animações           ║  Framer Motion 11                                  ║
║  Toasts              ║  Sonner                                            ║
║  Ícones              ║  Lucide React + SVGs customizados                  ║
╚══════════════════════╩════════════════════════════════════════════════════╝
```

---

## 03 · Architecture

```
┌─────────────────────────────────────────────────────────────────────────────┐
│  PROXY PATTERN                                                              │
├─────────────────────────────────────────────────────────────────────────────┤
│  Browser  →  /api/auth/login     →  prostaff-api /auth/login                │
│  Browser  →  /api/players        →  prostaff-api /api/v1/players            │
│  Browser  →  /api/free-agents    →  prostaff-api /api/v1/rosters/free-..    │
│                                                                             │
│  Todo fetch para a prostaff-api passa por Next.js API Routes para:          │
│  · Evitar CORS (prostaff-api não tem localhost:4000 em allowed origins)     │
│  · Injetar cookie arena_token como Authorization: Bearer (server-side)      │
└─────────────────────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────────────────────┐
│  AUTH FLOW                                                                  │
├─────────────────────────────────────────────────────────────────────────────┤
│  POST /api/auth/login  →  proxy seta cookie arena_token (HttpOnly em prod)  │
│  middleware.ts         →  protege /dashboard/** — redireciona se sem token  │
│  Zustand (persist)     →  mantém user/player em localStorage                │
└─────────────────────────────────────────────────────────────────────────────┘
```

---

## 04 · Rotas da Aplicação

```
┌──────────────────────────────────────┬───────────┬──────────────────────────┐
│  ROTA                                │  ACESSO   │  DESCRIÇÃO               │
├──────────────────────────────────────┼───────────┼──────────────────────────┤
│  /                                   │  Público  │  Landing page            │
│  /login                              │  Público  │  Login prostaff-api      │
│  /register                           │  Público  │  Cadastro prostaff-api   │
│  /dashboard                          │  Auth     │  Campeonatos + ranking   │
│  /dashboard/times                    │  Auth     │  Elenco da org           │
│  /dashboard/jogadores                │  Auth     │  Free agents             │
│  /dashboard/perfil                   │  Auth     │  Perfil + org            │
│  /dashboard/convites                 │  Auth     │  Convites (players)      │
│  /dashboard/campeonatos/[id]         │  Auth     │  Partidas, bracket, stats│
└──────────────────────────────────────┴───────────┴──────────────────────────┘
```

---

## 05 · API Proxy Routes

```
┌──────────────────────────────┬────────┬─────────────────────────────────────┐
│  ROUTE                       │  VERB  │  PROXIA PARA                        │
├──────────────────────────────┼────────┼─────────────────────────────────────┤
│  /api/auth/login             │  POST  │  prostaff /auth/login               │
│  /api/auth/register          │  POST  │  prostaff /auth/register            │
│  /api/auth/player-login      │  POST  │  prostaff /auth/player-login        │
│  /api/auth/player-register   │  POST  │  prostaff /auth/player-register     │
│  /api/auth/logout            │  POST  │  prostaff /auth/logout              │
│  /api/profile                │  GET   │  prostaff /profile                  │
│  /api/players                │  GET   │  prostaff /api/v1/players           │
│  /api/players/[id]           │  GET   │  prostaff /api/v1/players/:id       │
│  /api/players/search         │  GET   │  prostaff /api/v1/players/search_.. │
│  /api/free-agents            │  GET   │  prostaff /api/v1/rosters/free-..   │
└──────────────────────────────┴────────┴─────────────────────────────────────┘
```

---

## 06 · Modelo de Dados

```
┌─────────────────────────────────────────────────────────────────────────────┐
│  MAPEAMENTO prostaff-api → ArenaBR                                          │
├──────────────────────────┬──────────────────────────────────────────────────┤
│  prostaff-api            │  ArenaBR                                         │
├──────────────────────────┼──────────────────────────────────────────────────┤
│  User (coach/owner)      │  Usuário logado — gerencia o time                │
│  Organization            │  Time inscrito no campeonato                     │
│  Player (da org)         │  Jogador do elenco                               │
│  Player.riot_puuid       │  Validação Riot (sincronizado pelo prostaff)     │
│  GET /players            │  Elenco (filtrado pela org do token)             │
│  GET /rosters/free-agents│  Pool de free agents                             │
├──────────────────────────┴──────────────────────────────────────────────────┤
│  Entidades próprias ArenaBR (não existem no prostaff):                      │
│  · Championship   — campeonatos com datas, formato, premiação, vagas        │
│  · Enrollment     — liga Organization a um Championship                     │
│  · EnrollmentPayment — status de pagamento Pix (R$100/equipe)               │
│  · Invite         — convite para free agent entrar num time                 │
└─────────────────────────────────────────────────────────────────────────────┘
```

---

## 07 · Design System

```
┌─────────────────────────────────────────────────────────────────────────────┐
│  PALETA                                                                     │
├──────────────────┬──────────┬─────────────────────--────────────────────────┤
│  Token           │  Hex     │  Uso                                          │
├──────────────────┼──────────┼────────────────────────--─────────────────────┤
│  Navy            │ #0A0E1A  │  Background principal                         │
│  Card            │ #0F1823  │  Superfície de cards                          │
│  Muted           │ #1A2235  │  Hover / estados ativos                       │
│  Border          │ #252D3D  │  Divisores e bordas                           │
│  Gold (primary)  │ #C89B3C  │  CTA, destaques, tier 1                       │
│  Teal (accent)   │ #0596AA  │  Accent, badges, links                        │
│  Success         │ #00D364  │  Vitórias, status positivo                    │
│  Danger          │ #FF4444  │  Derrotas, alertas                            │
│  Text            │ #E8E8E8  │  Texto principal                              │
└──────────────────┴──────────┴───────────────────────────────────────────────┘

  Fontes:  Exo 2 (body) · Rajdhani (display) · Share Tech Mono (mono)
  Padrões: scanlines · hud-corners · retro-panel gold glow · badges retro
```

---

## Scripts

```bash
npm run dev      # dev na porta 4000
npm run build    # build de produção
npm run start    # serve o build
```

---

