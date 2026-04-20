# Wordle

Ett fullstack Wordle-spel med highscore-lista och informationssida, byggt med React, Express och MongoDB.

## Tech stack

- **Frontend:** React (Vite)
- **Backend:** Node.js / Express (TypeScript)
- **Databas:** MongoDB (Mongoose)
- **Tester:** Vitest + Supertest

## Setup

### 1. Skapa en `.env` fil i rooten

Kopiera `.env.example` och fyll i connection string (finns separat):

```bash
cp .env.example .env
```

### 2. Installera dependencies

Installerar både server- och client-dependencies automatiskt:

```bash
npm install
```

### 3. Starta servern

Bygger frontend och startar servern:

```bash
npm start
```

Appen körs på `http://localhost:5080`

### 4. Kör tester

```bash
npm test
```

## Sidor

| URL | Beskrivning |
|-----|-------------|
| `/` | Spela Wordle |
| `/highscore` | Highscore-lista (server-side renderad) |
| `/about` | Information om projektet |
