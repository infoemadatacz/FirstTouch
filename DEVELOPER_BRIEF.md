# FirstTouch — Developer Brief (Landing Page)

## Účel dokumentu

Tento brief je pro vývojáře landing page firsttouch.ai.
Popisuje co přidat, jak to strukturovat a jaké texty použít.

---

## Stávající stránka — co zůstává

Tyto sekce jsou OK a neměníme je:
- Hero — "Chief of Staff AI"
- Stats strip
- Capabilities bento grid
- Manager day in the life
- Pricing tabulka
- FAQ

---

## Co přidat — 4 nové sekce na LP

### Sekce 1: "How it works"

Umístění: hned po hero / stats strip
Design: 3 kroky vedle sebe (ikony + krátký text)

Krok 1 — Deploy
"Nasadíme asistenta na tvou infrastrukturu. VPS, lokální modely, tvá data."

Krok 2 — Connect
"Propojíme s tvými dokumenty, projekty a nástroji. Asistent pozná kontext tvé firmy."

Krok 3 — Use
"Komunikuješ přes Telegram. Asistent jedná, deleguje, reportuje."

---

### Sekce 2: "Architecture & Trust"

Umístění: po "How it works"
Design: 2 sloupce — vlevo diagram/vizuál, vpravo bullet points

Nadpis: "Tvá data zůstávají u tebe. Vždy."

Bullet points:
- Hybridní AI — lokální modely (Ollama) pro citlivé operace, cloudové (Claude, GPT) pro ostatní
- Každé volání AI je logováno a auditovatelné
- GDPR by design — retention policy, right-to-erasure, DPA ready
- Role Level Security — každý user vidí jen co má
- Vlastní infrastruktura — žádný vendor lock-in

Diagram (schéma):
Telegram → VPS (Orchestrátor) → [Lokální modely | Cloud modely]
                              → [Dokumenty & Data]
                              → [Nástroje: web, kalendář, TODO, soubory]

---

### Sekce 3: "For Teams & Enterprise"

Umístění: po Architecture sekci
Design: 3 karty nebo 2 sloupce (Team / Holding)

Nadpis: "Od jednoho foundera po celý holding"

Karta 1 — Team
- Multi-user onboarding
- Sdílená knowledge base
- Admin spravuje přístupy
- 5–20 uživatelů

Karta 2 — Enterprise / Holding
- Více firem pod jedním admin
- Každá entita má privátní data
- Konsolidovaný reporting
- Tenant izolace na úrovni DB

CTA: "Chci demo pro tým →"

---

### Sekce 4: "Add-ons & Moduly"

Umístění: před pricing
Design: grid karet (2x2 nebo 3+1)

Nadpis: "Rozšiř asistenta podle potřeb firmy"

Karta 1 — Endgame Finance
"AI pro finance. Cashflow, forecasting, reporting. Data nikdy neodejdou z infrastruktury."

Karta 2 — Computer-use automation
"Asistent ovládá prohlížeč a aplikace. Automatizace bez API."

Karta 3 — White-label
"Tvůj asistent, tvůj branding. Enterprise nasazení pod vlastním jménem."

Karta 4 — Web Admin Dashboard
"Správa uživatelů, logy, billing přes web. Žádné příkazy v chatu."

---

## Nová stránka: /architecture nebo /docs

Tato stránka je pro vývojáře a IT týmy zákazníků.
Obsah (sekce):

1. Technická architektura
   - Stack: Node.js, Postgres, Ollama, pm2, Syncthing
   - VPS deployment (Ubuntu, Hetzner/own server)
   - Mac mini node pro computer-use
   - Telegram bot jako interface

2. AI model routing
   - Lokální modely: Ollama (llama3, mistral, phi)
   - Cloudové modely: Claude API, OpenAI, Gemini
   - Konfigurace per user nebo per operace

3. Security model
   - RLS na úrovni Postgres
   - Audit log tabulka pro každé AI volání
   - Syncthing pro file sync (E2E encrypted)
   - .env management, žádné secrets v kódu

4. Onboarding flow
   - Admin přidá usera přes bot příkaz
   - User dostane přístup přes Telegram
   - Role: admin / manager / member

5. Tools & integrace
   - read_file, write_file, bash
   - web_search (Gemini grounding)
   - Google Calendar, TODO
   - Rozšiřitelné vlastními nástroji

6. Fáze vývoje / roadmapa
   - Fáze 0: Osobní asistent (hotovo)
   - Fáze 1: Multi-user, RLS (v přípravě)
   - Fáze 2: Admin dashboard (roadmap)
   - Fáze 3: Billing, white-label (roadmap)
   - Fáze 4: ISO 27001, SOC 2 (roadmap)

---

## Tech stack LP (pro vývojáře LP)

Stávající LP je HTML/CSS/JS (statická).
Nové sekce přidat jako:
- Čisté HTML sekce s existujícím CSS stylem
- Diagram Architecture: SVG nebo jednoduchý CSS grid
- /docs stránka: separátní HTML nebo markdown renderer

---

## Priorita implementace

1. Sekce "How it works" — nejjednodušší, nejvyšší dopad
2. Sekce "Architecture & Trust" — klíčové pro enterprise důvěru
3. Sekce "Add-ons" — ukazuje rozšiřitelnost
4. Sekce "For Teams & Enterprise" — pro enterprise sales
5. /docs stránka — pro vývojáře zákazníků
