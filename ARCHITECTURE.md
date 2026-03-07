# FirstTouch — Technická Architektura

> Verze: 0.1 | Vychází z claude-terminal/PLAN.md | Druhý agent doplňuje detaily

---

## Přehled systému

FirstTouch je AI asistent nasazený na dedikovaném serveru, přístupný přes Telegram
(nebo jiný interface). Kombinuje lokální a cloudové AI modely, pracuje nad vlastními
daty uživatele/firmy.

```
[Telegram / Interface]
        |
   [VPS Server] ← mozek systému, 24/7
        |
   [AI Orchestrátor] (Claude / Ollama / GPT)
        |
   [Tools & Nástroje]
        |
   [Lokální data / Firemní dokumenty]
        |
   [Mac mini - volitelně] ← computer-use, browser automation
```

---

## Nody a jejich role

| Node | Role | Status |
|------|------|--------|
| VPS Server | Mozek, 24/7 bot, orchestrace, data | Fáze 1+ |
| MacBook / Laptop | Editace dat, vývoj, sync | Vždy |
| Mac mini | "Ruce a oči" — browser automation, GUI akce | Fáze 6+ |
| Telefon (Telegram) | Primární UI pro uživatele | Fáze 0+ |

---

## AI Modely — Hybridní přístup

### Lokální modely (Ollama)
- Běží přímo na serveru nebo on-premise hardware
- Data neopustí infrastrukturu
- Vhodné pro: rutinní dotazy, interní dokumenty, citlivá data
- Příklady: Mistral, LLaMA, Gemma

### Cloudové modely (API)
- Claude (Anthropic), GPT-4 (OpenAI), Gemini (Google)
- Používají se pro: složité reasoning, research, kreativní úkoly
- Data anonymizovat / neposlat citlivé informace
- Konfigurovatelné per-user nebo per-task

### Orchestrace modelů
- Admin nastaví pravidla: "pro finance úkoly → lokální model"
- "pro research → Gemini s search grounding"
- Uživatel neví o switchi — asistent rozhoduje automaticky

---

## Nástroje (Tools)

Asistent má přístup k nástrojům, které rozšiřují jeho schopnosti:

| Nástroj | Funkce |
|---------|--------|
| read_file | Čtení dokumentů, know-how, dat |
| write_file | Tvorba a úprava souborů |
| bash | Spouštění příkazů, automatizace |
| list_dir | Navigace ve složkách |
| gemini_research | Web search, aktuální informace |
| send_file | Posílání souborů uživateli |
| create_calendar_event | Správa kalendáře |
| get_todos | Správa úkolů |
| get_calendar_events | Přehled událostí |

Nástroje jsou konfigurovatelné — každý user/role dostane jen relevantní sadu.

---

## Datová vrstva

### Synchronizace
- MacBook ↔ VPS ↔ Mac mini přes Syncthing (realtime, P2P, bez cloudu)
- Git pro kód bota (GitHub)
- Struktura na serveru kopíruje lokální strukturu

### Datová izolace (multi-user)
```
/projects/
  users/
    {user_id}/        ← soukromá data uživatele
  shared/
    company/          ← sdílená firemní data
    compliance/       ← regulační dokumenty
  admin/              ← pouze admin přístup
```

### Typy dat
- Dokumenty (Markdown, PDF, DOCX)
- Databáze (SQLite pro metadata, Postgres pro produkci)
- Konverzační historie (per-user, šifrovaně)
- Nástroje a konfigurace

---

## Fáze vývoje

| Fáze | Název | Status |
|------|-------|--------|
| 0 | Lokální prototyp (MacBook, Telegram bot) | ✅ HOTOVO |
| 1 | Always-on VPS, bezpečnost, sync | 🔴 Priorita |
| 2 | Stabilizace, monitoring, auto-restart | 🟡 Navazuje |
| 3 | Multi-user, role, datová izolace | 🟡 Navazuje |
| 4 | Mobilní produktivita, hlasové zprávy | 🟢 Průběžně |
| 5 | Pokročilá synchronizace, Syncthing | 🟡 Navazuje |
| 6 | Mac mini — computer-use, browser automation | 🔵 Budoucnost |

---

## Process Management

- **pm2** pro produkci — auto-restart, logování, monitoring
- **screen** pro lokální vývoj
- **UptimeRobot** — ping každých 5 min, alert při pádu
- Health check endpoint na HTTP portu serveru

---

## Deployment

```bash
# MacBook → push
git push origin main

# Server → pull a restart
ssh admin@server
cd ~/Projects/claude-terminal
git pull
pm2 restart firsttouch
```

CI/CD (GitHub Actions) plánováno pro pozdější fázi.
