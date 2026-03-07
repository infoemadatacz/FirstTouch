# FirstTouch — Business Brief

## Co to je

FirstTouch je AI asistent nasazený na tvé vlastní infrastruktuře.
Zná kontext tvé firmy, pracuje s tvými daty, jedná za tebe — přes Telegram.
Žádná data ven. Plná kontrola.

Delší verze: AI orchestrační platforma, která kombinuje lokální a cloudové modely,
pracuje nad firemními dokumenty a daty, a je navržena pro multi-user nasazení
s role-level security, auditovatelností a GDPR compliance.
Škáluje od jednoho foundera po celý holding.

---

## Pro koho je to určeno

- Founder / CEO — chce AI asistenta co zná jeho firmu
- Management tým — sdílená knowledge base, každý vidí jen co má
- Enterprise / Holding — více firem, centrální admin, compliance
- CFO / Finance tým — Endgame Finance modul

---

## Core funkce (vždy součástí)

- AI asistent přes Telegram (nebo jiný interface)
- Přístup k dokumentům, projektům, datům firmy
- Hybridní AI — lokální modely (Ollama) + cloudové (Claude, GPT, Gemini)
- Role Level Security — každý user vidí jen co má
- Auditovatelnost — logy všech akcí a AI volání
- GDPR by design — data na vlastní infrastruktuře
- Nástroje: čtení/psaní souborů, web research, kalendář, TODO, spouštění příkazů
- Onboarding uživatelů přes admin
- 24/7 dostupnost (pm2 + monitoring)

---

## Add-on moduly

### A — Endgame Finance modul
- Specializovaná knowledge base pro finance
- Cashflow monitoring, forecasting, reporting
- Compliance pro finanční regulace
- Napojení na účetní systémy
- Určeno pro: CFO, finance tým, holding

### B — Holding / Multi-entity vrstva
- Více firem pod jedním admin
- Sdílená holding knowledge base + privátní entitní data
- Konsolidovaný reporting přes entity
- Tenant izolace na úrovni databáze

### C — Computer-use / Browser automation
- Asistent může ovládat prohlížeč a aplikace
- GUI akce bez API
- Pro pokročilou automatizaci procesů (Mac mini node)

### D — White-label branding
- Firma dostane bota pod vlastním jménem a avatarem
- Pro enterprise a resellery

### E — Web Admin Dashboard
- Správa uživatelů přes web (místo příkazů v chatu)
- Přehled využití, logy, billing

---

## Trust & Compliance

- Data zůstávají na tvé infrastruktuře
- Lokální modely pro citlivé operace
- Cloudové modely jen pro non-sensitive úkoly (konfigurovatelné)
- Každé AI volání je logováno
- GDPR — retention policy, right-to-erasure, DPA ready
- RLS — member nevidí data managera, firma A nevidí firmu B
- Roadmap: ISO 27001, SOC 2

---

## Pricing logika

### Tier 1 — Personal (1 user)
- Osobní asistent, VPS, základní tools
- Entry point, dog-fooding

### Tier 2 — Team (5–20 users)
- Multi-user, RLS, sdílená knowledge base
- Diagnostický sprint: EUR 7,500–20,000

### Tier 3 — Enterprise / Holding
- Multi-entity, compliance, admin dashboard
- Pilot: EUR 25,000–80,000+
- Scale program: EUR 8,000–30,000/měsíc

---

## Key messages pro různé audience

**Pro foundera/manažera:**
"Přestaneš ztrácet čas koordinací. Asistent to řeší za tebe."

**Pro enterprise/holding:**
"Multi-tenant, RLS, GDPR, audit trail, lokální modely.
Compliance není add-on — je to základ."

**Pro CFO/finance:**
"Endgame modul — asistent zná tvůj cashflow, forecasting a reporting.
Finance intelligence bez dat venku."

---

## Vztah k ostatním projektům

- **FirstTouch** — nejobecnější platforma, core produkt
- **Endgame** — Finance specializace postavená na FirstTouch architektuře
- **Holding implementace** — interní zákazník FirstTouch, proof of concept pro enterprise tier
