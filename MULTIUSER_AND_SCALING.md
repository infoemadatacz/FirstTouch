# FirstTouch — Multi-user & Škálovatelnost

> Verze: 0.1 | Druhý agent doplňuje detaily

---

## Od 1 uživatele k celé firmě

FirstTouch začíná jako osobní asistent (1 user) a škáluje bez přepisování architektury
na celý tým, holding nebo enterprise.

---

## Uživatelský onboarding

### Přidání nového uživatele (admin flow)
1. Admin napíše botovi: "Přidej uživatele Jan Novák, role: member, firma: Firma A"
2. Bot vygeneruje invite link nebo chat_id whitelist entry
3. Jan si otevře Telegram bot, pošle /start
4. Bot ho identifikuje, přiřadí roli, vytvoří workspace
5. Jan může okamžitě pracovat

### Self-service onboarding (budoucnost)
- Firma dostane vlastní Telegram bot instance
- Zaměstnanci si sami začnou konverzaci
- Admin schvaluje nebo auto-approve dle domény emailu

---

## Architektura multi-user

### Možnost A: Jeden bot, více uživatelů (doporučeno pro start)
- Jeden Telegram bot token
- Izolace přes `chat_id` → `user_id` mapping
- Každý user má vlastní historii a workspace
- Jednodušší správa, nižší náklady

### Možnost B: Bot per uživatel / per firma (enterprise)
- Každá firma dostane vlastní bot instanci
- Plná izolace na úrovni procesu
- Vlastní branding (název bota, avatar)
- Vyšší náklady, ale maximální izolace

### Doporučení
Začít s Možností A, přejít na B pro enterprise zákazníky.

---

## Škálovatelnost infrastruktury

### Malé nasazení (1–10 uživatelů)
- VPS: Hetzner CX22 (2 vCPU, 4 GB RAM, ~5 EUR/měsíc)
- SQLite databáze
- pm2 process manager
- Syncthing pro sync dat

### Střední nasazení (10–100 uživatelů)
- VPS: Hetzner CX42 nebo dedikovaný server
- Postgres databáze
- Load balancer (Nginx)
- Oddělený souborový server nebo S3-compatible storage

### Velké nasazení (100+ uživatelů / Enterprise)
- Kubernetes cluster nebo managed hosting
- Postgres s replikací
- CDN pro statické assety
- Dedicated AI model server (GPU pro Ollama)
- Multi-region pro dostupnost

---

## Holding architektura (konkrétní use case)

### Struktura
```
Holding Admin
├── [Shared Knowledge Base] — dostupné všem entitám
├── Entita 1 (např. EMA)
│   ├── Admin EMA
│   ├── Finance team
│   └── Operations team
├── Entita 2 (např. FirstTouch)
│   ├── Admin FT
│   └── Sales team
└── Entita 3 (...)
```

### Sdílená vs. privátní data
- Holding level: compliance dokumenty, brand guidelines, finance přehledy
- Entita level: operativní data, projekty, CRM
- User level: osobní workspace, drafty, TODO

### Konsolidovaný reporting
- Holding Admin může požádat: "Shrň mi cashflow všech entit za Q1"
- Bot agreguje (bez přístupu k citlivým detailům nižších rolí)
- Finance dashboard přes Endgame Plan modul

---

## Endgame Plan — Finance modul

Specializovaná konfigurace asistenta pro finanční řízení:

- Cashflow monitoring a forecasting
- Investiční přehledy
- Compliance pro finanční regulace
- Reporting pro holding
- Napojení na účetní systémy (export/import)

Endgame Plan = FirstTouch s finance-specific knowledge base a nástroji.

---

## Roadmapa multi-user

| Milestone | Popis | Cíl |
|-----------|-------|-----|
| M1 | 1 user, VPS, vše funkční | Q1 2025 |
| M2 | Whitelist, základní RLS | Q1 2025 |
| M3 | Multi-user (5–10 users), izolace | Q2 2025 |
| M4 | Holding pilot (3 entity) | Q2 2025 |
| M5 | Admin dashboard (web) | Q3 2025 |
| M6 | Enterprise onboarding flow | Q4 2025 |
