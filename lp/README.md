# First Touch LP

## What Is Included
- Full enterprise conversion LP (`index.html`)
- Thank-you page (`thank-you.html`)
- Shared brand style system (`styles.css`) using First Touch palette:
  - `#9301BB`
  - `#FF6A00`
- Funnel and lead logic (`app.js`)
- Runtime configuration (`config.js`)
- Lead magnet pack (`assets/jana-offer-pack.md`)
- Technical SEO/AEO files:
  - `robots.txt`
  - `sitemap.xml`
  - `llms.txt`

## Quick Setup
1. Edit `config.js`:
- `bookingUrl`
- `leadFormEndpoint` (optional)
- `siteUrl`
- `contactEmail`
- `linkedinUrl`
2. Deploy as static site.
3. Verify root-level serving of `/robots.txt`, `/sitemap.xml`, `/llms.txt`.

## Funnel Design (Conversion-First)
- Hero: clear outcome and strong positioning
- Use Cases: direct buyer mapping
- Tool Stack: integration confidence + no lock-in framing
- Context/Learning: compounding value mechanism
- Offer Section: value equation + bonus stack + risk reversal + scarcity
- Lead Magnet: JANA Offer Pack for qualification before call

## Lead Capture Behavior
- If `leadFormEndpoint` is set, form posts to endpoint.
- If not set, payload is saved to local storage (`first_touch_last_lead`) for testing.
- Thank-you page provides direct download and CTA to strategy call.

## SEO/AEO Notes
- Includes semantic long-form sections and FAQ with schema.
- Includes `Organization`, `Service`, `FAQPage`, and `WebSite` JSON-LD.
- `llms.txt` provides compact retrieval context for AI engines.
