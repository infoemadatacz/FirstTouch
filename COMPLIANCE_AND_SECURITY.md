# FirstTouch — Compliance & Security

> Verze: 0.1 | Druhý agent doplňuje detaily

---

## Přehled bezpečnostního modelu

FirstTouch je navržen jako compliance-first systém.
Data zákazníka zůstávají pod jeho kontrolou, přístupy jsou auditovatelné,
role jsou jasně definované.

---

## Data Safety

### Princip lokality dat
- Primárně: data na vlastní infrastruktuře zákazníka (VPS, on-premise)
- Cloudové modely: používají se jen pro úkoly bez citlivých dat
- Admin nastaví pravidla: které typy dat smí opustit infrastrukturu
- Logování všech AI volání (co bylo odesláno, kdy, kým)

### Šifrování
- Data at rest: šifrovaný disk na serveru
- Data in transit: HTTPS/TLS pro všechnu komunikaci
- Konverzační historie: šifrovaně uložená per-user

### GDPR
- Každý user může požádat o smazání svých dat
- Export dat uživatele na vyžádání
- Retention policy: admin nastavuje jak dlouho se historie uchovává
- DPA (Data Processing Agreement) při nasazení pro zákazníka

---

## Role Level Security (RLS)

### Role v systému

| Role | Přístup | Typický uživatel |
|------|---------|-----------------|
| Super Admin | Vše — infrastruktura, všichni uživatelé, logy | IT / zakladatel |
| Company Admin | Správa uživatelů firmy, sdílená data, konfigurace | CEO, CFO |
| Manager | Vlastní data + team data, nemůže měnit konfiguraci | Vedoucí oddělení |
| Member | Vlastní data + sdílená firemní data (read) | Zaměstnanec |
| Read-only | Jen čtení sdílených dat | Externista, auditor |

### Implementace RLS
- Každý `chat_id` (Telegram) = jeden uživatel
- Uživatel je namapován na roli v databázi
- Při každém toolcallu bot kontroluje oprávnění
- Sandbox: uživatel nemůže vystoupit ze svého workspace

---

## Auditovatelnost

### Co se loguje
- Každá zpráva uživatele (timestamp, user_id, obsah)
- Každý toolcall (nástroj, parametry, výsledek)
- Každé volání externího AI modelu (model, prompt délka, ne obsah)
- Přihlášení a změny konfigurace

### Audit log přístup
- Super Admin vidí vše
- Company Admin vidí svoji firmu
- Uživatel vidí svoji vlastní historii

### Retention
- Default: 90 dní
- Konfigurovatelné per-firma
- GDPR right-to-erasure: smazání na vyžádání do 72h

---

## Multi-tenant architektura (Holding use case)

### Scénář: Holding s více entitami

```
[Holding Admin]
      |
  ┌───┴────────────────────────────┐
  │                                │
[Firma A]                      [Firma B]
  |                                |
[Admin A]  [Member A1] [A2]   [Admin B] [Member B1]
```

- Každá firma = tenant s vlastní izolací
- Holding Admin vidí agregovaná data (bez citlivých detailů)
- Firma A nemůže číst data Firmy B
- Sdílená knowledge base pro celý holding (volitelně)

### Implementace
- Tenant ID v každém záznamu databáze
- Row-level security v Postgres
- Oddělené workspace složky per-tenant

---

## Konfigurace nástrojů per-role

Admin nastavuje, které nástroje jsou dostupné pro které role:

```json
{
  "member": ["read_file", "write_file", "get_todos", "get_calendar_events"],
  "manager": ["read_file", "write_file", "bash_readonly", "get_todos", "gemini_research"],
  "admin": ["all_tools"]
}
```

Uživatel nemůže použít nástroj, který není v jeho sadě.

---

## Compliance certifikace (plán)

| Certifikace | Status | Cíl |
|-------------|--------|-----|
| GDPR | V návrhu | Q2 2025 |
| ISO 27001 | Plánováno | Q4 2025 |
| SOC 2 Type I | Plánováno | Q1 2026 |

---

## Bezpečnostní checklist před deployem

- [ ] Whitelist chat_id (jen autorizovaní uživatelé)
- [ ] HTTPS na všech endpointech
- [ ] Šifrovaný disk na serveru
- [ ] pm2 s auto-restart
- [ ] Logování aktivní
- [ ] Zálohy databáze (denně)
- [ ] UptimeRobot monitoring
- [ ] DPA připravena pro zákazníka
- [ ] Retenční politika nastavena
