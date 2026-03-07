# LP Implementation Notes

## Source Inputs Used
- Brand assets and palette from `/Users/jankluz/Projects/FirstTouch/Grafika`
- Offer/funnel principles from Hormozi reading set in `/Users/jankluz/Projects/know-how-vault/archive/reading/Reading`
  - `$100M Offers` (value equation, grand slam offer, scarcity/urgency/bonuses/guarantees)
  - `100M Playbook: Lead Nurture` (speed to contact, volume, personalization, show-rate focus)
  - `100M Hooks Playbook` (hook quality as first conversion lever)
- Technical architecture framing from:
  - `Agents, Tool Use, and Orchestration`
  - `RAG & Knowledge Systems`
  - `Training, Customization & Learning Techniques`

## Conversion Strategy Implemented
- Strong promise + clear enemy (workflow fragmentation)
- Explicit use-case mapping to buyer pains
- Integration confidence (no app lock-in)
- Compounding value narrative (context + memory + learning)
- Hormozi value equation translated into pilot offer design
- Offer stack with bonus layers + risk reversal + scarcity
- Lead magnet qualification layer before call booking

## JANA Lead Magnet
JANA = Justified Autonomy, No App-Lock

Pack includes:
- 40-point bottleneck scorecard
- integration/tooling map template
- value equation worksheet
- governance threshold matrix
- strategy call prep checklist
- 8-week fast-start pilot blueprint

## Keyword Intent Clusters
### Primary
- AI agent orchestration
- enterprise workflow automation
- operational AI governance

### Secondary
- no vendor lock in AI architecture
- human-in-the-loop automation
- intake triage automation
- enterprise AI pilot
- regulated AI workflows

### Section Mapping
- Hero: primary commercial intent
- Use Cases + Tool Stack: buyer validation intent
- Context & Knowledge sections: informational + AI retrieval intent
- FAQ: snippet and agent-answer intent

## Schema and Technical SEO
Injected by `app.js`:
- `Organization`
- `Service`
- `FAQPage`
- `WebSite`

Static files:
- `robots.txt`
- `sitemap.xml`
- `llms.txt`

## Deployment Checklist
1. Update `config.js` production values.
2. Publish static files.
3. Confirm:
- `/`
- `/thank-you.html`
- `/robots.txt`
- `/sitemap.xml`
- `/llms.txt`
4. Validate metadata and schema in production.
