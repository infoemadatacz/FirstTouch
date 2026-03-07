# FirstTouch — Tool Registry

> Živý seznam nástrojů a schopností asistenta.
> Stav vychází z `claude-terminal/SYSTEM_DOCS.md` (reálný bot běžící na Hetzner VPS).
> Poslední update: 2026-03-01

---

## Legenda stavů

| Symbol | Stav |
|--------|------|
| ✅ | Hotovo — v produkci |
| 🟡 | Částečně — funguje, ale omezeno |
| ⏳ | Naplánováno — v roadmapě |
| ❌ | Neimplementováno |

---

## 1) AI Tools (schopnosti agenta)

Toto jsou nástroje které Claude (Sonnet 4.6) volá při zpracování dotazu.

| Nástroj | Co dělá | Stav |
|---------|---------|------|
| `bash` | Spustí libovolný bash příkaz na serveru (git, node, python, curl...) | ✅ |
| `read_file` | Přečte obsah souboru (.md, .json, .ts, .py...) | ✅ |
| `write_file` | Vytvoří nebo přepíše soubor, vytvoří adresáře | ✅ |
| `list_dir` | Vypíše obsah složky | ✅ |
| `gemini_research` | Web search přes Gemini 2.0 Flash s Google Search groundingem | ✅ |
| `send_file` | Pošle soubor ze serveru přímo do Telegram chatu | ✅ |
| `create_calendar_event` | Vytvoří událost v Google Kalendáři (přirozený jazyk → ISO 8601) | ✅ |
| `get_calendar_events` | Čte nadcházející události z Google Kalendáře | ✅ |
| `get_todos` | Čte todo seznam uživatele | ✅ |
| `generate_image` | Generuje obrázek přes Gemini Imagen | ✅ |
| `send_email` | Odešle email přes Gmail API | ⏳ |
| `read_email` | Čte emaily z Gmailu | ⏳ |
| `browser_action` | Ovládá prohlížeč (přes Mac mini / Playwright) | ⏳ |
| `slack_message` | Odešle zprávu do Slacku | ⏳ |
| `notion_read` | Čte stránky z Notion workspace | ⏳ |
| `notion_write` | Zapíše do Notion | ⏳ |

---

## 2) Telegram příkazy (uživatelský interface)

### Běžné příkazy (všichni uživatelé)

| Příkaz | Co dělá | Stav |
|--------|---------|------|
| `/start` nebo `/help` | Zobrazí nápovědu a přehled přístupu | ✅ |
| `/ping` | Ověří že bot běží → `pong` | ✅ |
| `/new` | Smaže historii konverzace (nové téma) | ✅ |
| `/download <cesta>` | Stáhne soubor ze serveru do Telegramu | ✅ |
| `/todo` | Zobrazí seznam úkolů | ✅ |
| `/todo <text>` | Přidá nový úkol | ✅ |
| `/todo done <id>` | Označí úkol jako hotový | ✅ |
| `/todo del <id>` | Smaže úkol | ✅ |
| `/cal` | Dnešní schůzky z Google Kalendáře | ✅ |
| `/cal tomorrow` | Zítřejší schůzky | ✅ |
| `/cal next` | Nejbližší nadcházející schůzka | ✅ |
| `/cal prep` | AI příprava na nejbližší schůzku (agenda, kontext) | ✅ |
| `/cal setup <email>` | Propojí Google Kalendář s uživatelem | ✅ |
| `/image <prompt>` | Vygeneruje obrázek přes Gemini Imagen | ✅ |
| `/brief` | Ranní přehled: todo + kalendář + blocker | ⏳ |
| `/focus` | Nastav focus mode (DND, priorita dne) | ⏳ |
| `/status` | Přehled aktivních projektů a jejich stavu | ⏳ |

### Admin příkazy

| Příkaz | Co dělá | Stav |
|--------|---------|------|
| `/users` | Seznam všech uživatelů a jejich rolí | ✅ |
| `/approve <id> <role> [folders]` | Schválí nového uživatele | ✅ |
| `/deny <id>` | Zamítne žádost o přístup | ✅ |
| `/revoke <id>` | Odvolá přístup existujícímu uživateli | ✅ |
| `/setfolders <id> <folders...>` | Nastaví povolené složky pro general uživatele | ✅ |

---

## 3) Input typy (co asistent zpracuje)

| Typ inputu | Co se stane | Stav |
|-----------|-------------|------|
| Textová zpráva | Spustí agentní smyčku s Claudem (max 40 iterací, volá tools) | ✅ |
| Hlasová zpráva | Přepis přes Gemini → zpracováno jako text | ✅ |
| Audio soubor (.mp3/.m4a/.wav) | Přepis celé schůzky → strukturovaný markdown | ✅ |
| Obrázek / screenshot | Analýza přes Claude Vision | 🟡 |
| PDF / DOCX soubor | Přečtení obsahu a zpracování | 🟡 |
| Video soubor | Přepis audia | ⏳ |

---

## 4) Scheduler — automatické akce

Automatické notifikace bez nutnosti něco psát.

| Čas / Trigger | Akce | Stav |
|--------------|------|------|
| 08:00 každý den | Ranní připomínky todo úkolů s termínem | ✅ |
| 08:00 každý den | Přehled dnešních schůzek z Google Kalendáře | ✅ |
| 30 min před schůzkou | Alert "Za 30 min: [název schůzky]" | ✅ |
| Při startu bota | Catch-up pokud bot startoval po 08:00 | ✅ |
| Custom čas | Reminder konkrétní todo v konkrétní čas | ⏳ |
| Proaktivní news | Bot sám upozorní na relevantní zprávy | ⏳ |
| Weekly report | Automatický přehled každý pátek | ⏳ |

---

## 5) Uživatelský systém a správa

### Role a oprávnění

| Role | Bash | Přístup ke složkám | Zápis | Kdo |
|------|------|-------------------|-------|-----|
| `admin` | ✅ plný | vše | vše | Jan Kluz |
| `ema_team` | ✅ | definované EMA složky | vše v povolených | EMA tým |
| `general` | ❌ | složky přidělené adminem | pouze .md soubory | Ostatní |

### EMA team složky (předdefinováno)
```
ai-certification-authority/
ema-ai-metodicky-chatbot/
ema-platform/
know-how-vault/events/
know-how-vault/archive/
know-how-vault/go-to-market/
know-how-vault/pitch/
know-how-vault/product/
know-how-vault/strategy/
```

### Onboarding flow nového uživatele

```
1. Neznámý user napíše botu
       ↓
2. Bot požádá o jméno
       ↓
3. User napíše jméno → admin dostane notifikaci:

   🔔 Žádost o přístup
   Jméno: Petr Novák | Chat ID: 123456789

   [✅ EMA tým]  [✅ General]  [❌ Zamítnout]
       ↓
4. Admin schválí (tlačítkem nebo /approve <id> <role>)
       ↓
5. User dostane přístup, bot mu potvrdí roli
```

### Admin správa (kdykoli)
- `/approve <chat_id> ema_team` — přidat do EMA týmu
- `/approve <chat_id> general folder1 folder2` — přidat s custom složkami
- `/revoke <chat_id>` — okamžitě odebrat přístup
- `/setfolders <chat_id> know-how-vault/ ema-platform/` — změnit složky
- `/users` — kompletní přehled kdo má přístup a s jakou rolí

### Datová izolace (per user)
```
/root/projects/
  local_data/
    users.json           ← uživatelé, role, povolené složky
    todos.json           ← todo per chat_id
    history/
      {chat_id}.json     ← konverzační historie per user
    transcripts/
      YYYY-MM-DD-*.md    ← přepisy schůzek
    gcal-calendars.json  ← mapování chat_id → Google Calendar
```

---

## 6) Infrastruktura (aktuální stav)

| Komponenta | Řešení | Status |
|-----------|--------|--------|
| Server | Hetzner CX22, Helsinki, 89.167.80.25 | ✅ běží |
| Process mgmt | pm2 (auto-restart, logging) | ✅ |
| LLM | Claude Sonnet 4.6 (Anthropic API) | ✅ |
| Interface | Telegram bot (long polling) | ✅ |
| Web search | Gemini 2.0 Flash + Google Search grounding | ✅ |
| Voice/transcription | Gemini API | ✅ |
| Image generation | Gemini Imagen | ✅ |
| Kalendář | Google Calendar API (service account) | ✅ |
| Data sync | Syncthing (MacBook ↔ VPS, ~2-5s latence) | ✅ |
| Health check | HTTP :3000 + UptimeRobot (ping 5 min) | ✅ |
| Deploy | `./deploy.sh` (rsync + pm2 restart) | ✅ |
| Databáze | JSON soubory (users, todos, history) | ✅ → Postgres ⏳ |
| Lokální modely | Ollama | ⏳ |
| Computer-use | Mac mini M4 execution node | ⏳ |
| Web dashboard | Admin UI v prohlížeči | ⏳ |
| CI/CD | GitHub Actions → auto deploy | ⏳ |

---

## 7) Co je hotovo vs. co není — přehled pro product/sales

### ✅ Hotovo (dá se dodat dnes)
- Always-on AI asistent (24/7, Telegram)
- Meeting transcription + summary (audio → markdown)
- To-do management (add, done, delete, remind)
- Calendar management (čtení, vytváření, prep, alerts)
- Ranní digest (todo + kalendář automaticky v 8:00)
- 30min before-meeting alert
- Web research (Gemini + Google Search)
- Document read/write/search
- File operations & bash automation
- Image generation
- Multi-user s role systémem (admin/ema_team/general)
- Onboarding flow s inline tlačítky

### ⏳ Roadmap (naplánováno, neimplementováno)
- Gmail read/write
- Slack / Teams integrace
- Notion read/write
- Computer-use (browser automation)
- Custom time-based reminders
- Proaktivní notifikace (news, alerts)
- Weekly automated report
- Přímá Postgres databáze (místo JSON)
- Lokální AI modely (Ollama) pro citlivá data
- Web admin dashboard
- Statistiky využití + API cost tracking
- CI/CD pipeline

---

*Zdroj dat: `claude-terminal/SYSTEM_DOCS.md` + `claude-terminal/PLAN.md`*
