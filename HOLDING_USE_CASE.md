# FirstTouch — Holding Use Case

> Verze: 0.1 | Interní dokument — první reálný zákazník

---

## Kontext

Náš vlastní holding je první zákazník FirstTouch (dog-fooding).
Implementace probíhá paralelně s vývojem produktu.
Poznatky z holdingu jdou zpět do produktu.

---

## Proč holding potřebuje FirstTouch

### Aktuální situace (pain points)
- Dokumenty roztroušené přes různá úložiště
- Každá entita si řeší AI nástroje sama (různé předplatné, různé nástroje)
- Žádná sdílená knowledge base
- Compliance dokumentace není live, je to statický PDF
- Reportování přes holding je manuální

### Co FirstTouch řeší
- Jeden systém, všechny entity, jasné role
- Sdílená knowledge base (brand, compliance, finance pravidla)
- Každý zaměstnanec má asistenta přizpůsobeného své roli
- Holding admin má agregovaný přehled
- Compliance je živý dokument, asistent s ním pracuje

---

## Entity v holdingu (anonymizováno)

| Entita | Primární use case | Počet userů |
|--------|------------------|-------------|
| Holding HQ | Přehled, reporting, compliance | 2–3 |
| EMA | Operations, metodika, vzdělávání | 5–10 |
| FirstTouch | Sales, GTM, produkt | 3–5 |
| Endgame | Finance, investice | 2–3 |
| Ostatní | TBD | TBD |

---

## Implementační plán pro holding

### Fáze 0 — Zakladatel (nyní)
- 1 user (zakladatel), VPS, Telegram
- Plný přístup ke všem projektům
- Testování nástrojů, workflow, promtů

### Fáze 1 — Core team (Q2 2025)
- 3–5 klíčových lidí
- Každý má vlastní workspace
- Sdílená knowledge base (know-how-vault)
- Základní role (admin / member)

### Fáze 2 — Rozšíření na celý holding (Q3 2025)
- Všechny entity
- Plné RLS
- Compliance dokumenty live v systému
- Finance modul (Endgame Plan)

### Fáze 3 — Externisté a partneři (Q4 2025)
- Read-only přístup pro auditory, právníky
- Projektoví externisté s omezeným workspace
- DPA pro každého externistu

---

## Konkrétní use cases

### CEO / Zakladatel
"Jaký je status všech projektů?"
"Shrň mi cashflow za poslední kvartál."
"Co máme za compliance povinnosti do konce měsíce?"

### Vedoucí entity (EMA admin)
"Jaké úkoly má tým na tento týden?"
"Připrav report o pokroku metodiky pro holding."
"Najdi mi v dokumentaci odpověď na dotaz zákazníka."

### Zaměstnanec
"Pomoz mi napsat zprávu zákazníkovi."
"Jaká jsou pravidla pro refundace?"
"Přidej mi do TODO: připravit prezentaci na pátek."

### Finance (Endgame Plan)
"Jaký je cashflow prognóza na Q3?"
"Upozorni mě pokud nějaká entita překročí budget."
"Připrav podklady pro investiční rozhodnutí."

---

## Měření úspěchu

| Metrika | Baseline | Cíl po 3 měsících |
|---------|----------|------------------|
| Čas na nalezení dokumentu | 10–15 min | < 30 sekund |
| Manuální reporting hodin/měsíc | 20+ hodin | < 5 hodin |
| Onboarding nového člena (dny) | 5–10 dní | 1–2 dny |
| Compliance incidenty | Nesledováno | 0 |

---

## Poznatky jdou do produktu

Každý pain point z holdingu = feature request pro FirstTouch produkt.
Každý workflow, který funguje = template pro ostatní zákazníky.
Holding = živé testovací prostředí + referenční zákazník pro prodej.
