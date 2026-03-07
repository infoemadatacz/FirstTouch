# FirstTouch — Product Brief

> Verze: 0.1 | Autor: předvoj agent | Druhý agent doplňuje detaily

---

## Co to je

FirstTouch je platforma pro nasazení osobního AI asistenta — pro jednotlivce i celé firmy.
Asistent má přístup k lokálním dokumentům, firemním datům a externím nástrojům.
Komunikuje přes Telegram (nebo jiný interface), rozumí kontextu uživatele a jedná za něj.

Jádro produktu vychází z osobního projektu zakladatele — funkčního AI asistenta na VPS,
který dnes reálně používá pro práci, správu projektů, výzkum a rozhodování.

---

## Proč to děláme

Firmy i jednotlivci mají data, dokumenty, know-how — ale nemají způsob, jak s tím
efektivně pracovat pomocí AI bez toho, aby poslali vše na cizí servery.

FirstTouch řeší:
- Data zůstávají lokálně nebo na dedikovaném serveru zákazníka
- AI asistent zná kontext firmy, ne jen obecný svět
- Každý uživatel má svou roli, přístup, bezpečnostní úroveň
- Funguje pro jednoho člověka i pro 200 lidí ve firmě

---

## Komu to prodáváme

### Primární zákazník: Holding / Enterprise
- Firmy s více entitami, týmy, odděleními
- Potřebují AI asistenci škálovatelně a compliantně
- Náš vlastní holding je první zákazník (dog-fooding)

### Sekundární zákazník: Jednotlivec / Manažer
- Osobní AI asistent pro každodenní práci
- Správa projektů, dokumentů, komunikace, rozhodování

### Vertikála: Finance (Endgame Plan)
- Specializovaná verze asistenta zaměřená na finanční řízení
- Cashflow, investice, reporting, compliance

---

## Klíčové hodnoty produktu

1. **Data Safety** — data nezpracovává třetí strana, vše na vlastní infrastruktuře
2. **Lokální + cloudové modely** — kombinace (Ollama lokálně, Claude/GPT pro složité úkoly)
3. **Role Level Security** — každý user vidí jen to, co má vidět
4. **Orchestrace uživatelů** — admin přidává lidi, nastavuje přístupy, sleduje využití
5. **Compliance ready** — GDPR, auditovatelnost, logování
6. **Škálovatelnost** — od 1 usera po celou korporaci

---

## Aktuální stav

- Osobní asistent zakladatele: funkční (VPS, Telegram, nástroje, dokumenty)
- Architektura multi-user: navržena, čeká na implementaci
- Endgame Plan (finance verze): ve fázi konceptu a dokumentace
- Holding implementace: v přípravě jako první reálný deploy

---

## Další kroky produktu

1. Zdokumentovat aktuální architekturu (viz ARCHITECTURE.md)
2. Navrhnout multi-user vrstvu (role, přístupy, onboarding)
3. Compliance dokumentace
4. Holding pilot deploy
5. FirstTouch jako produkt pro externí zákazníky
