# Device Monitor UI

Malá React aplikácia (TypeScript, Vite, Tailwind CSS): formulár na odoslanie pingu zariadenia
(`uuid`, `battery_percent`) do [Device Monitor API](https://github.com/mesiarm/device-monitor-api).

## Spustenie

Vyžaduje Node.js 18+ a bežiace API (podľa jeho README, štandardne `http://localhost:8000`).

```bash
npm install
cp .env.example .env   # voliteľné, predvolené hodnoty stačia
npm run dev
```

Aplikácia beží na <http://localhost:5173>. Požiadavky na `/api` Vite vo vývoji
presmeruje na API (`VITE_API_PROXY_TARGET`, predvolene `http://localhost:8000`), takže nie je potrebné riešiť CORS.

Ďalšie príkazy: `npm test`, `npm run typecheck`, `npm run build`.

## Poznámky k API

- Zadanie uvádza `POST /api/ping` s `uuid` v tele. Backend však vystavuje
  `POST /api/devices/{uuid}/ping` s telom `{ "battery_percent": 85 }`, preto UI volá túto cestu
  (API volanie je izolované v `src/api/ping.ts`).
- Zariadenie musí v API existovať (`POST /api/devices`), inak vráti 404 a UI zobrazí chybu.
- API prijíma `battery_percent` len ako celé číslo 0–100, rovnako validuje aj formulár.

## Štruktúra

| Súbor | Účel |
|---|---|
| `src/components/PingForm.tsx` | formulár, stav (`useState`), loading |
| `src/components/Message.tsx` | success/error správa |
| `src/api/ping.ts` | volanie API (`fetch`) a mapovanie chýb |
| `src/validation.ts` | validácia formulára |
| `src/*.test.ts(x)` | testy (Vitest + Testing Library) |
