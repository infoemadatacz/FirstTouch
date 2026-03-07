# First Touch
## Funnel Blueprint (LP -> Call -> Diagnostic)

Last update: 2026-02-24

## 1. Funnel Goals

Primary:
- book qualified strategy calls from warm social and direct outreach

Secondary:
- capture qualified leads via workflow template opt-in

## 2. Funnel Stages

### Stage A: Attention Source
Sources:
- LinkedIn posts
- LinkedIn comments
- direct connection outreach
- referrals

CTA:
- visit LP and book call

### Stage B: Landing Page
Page: `lp/index.html`

Primary CTA:
- Book strategy call

Secondary CTA:
- Get workflow bottleneck map template

### Stage C: Lead Capture
Form fields:
- email
- full name
- company
- role

Next step:
- redirect to `lp/thank-you.html`

### Stage D: Thank-You and Next Action
Actions:
- direct template download
- secondary CTA to book call

### Stage E: Qualification Layer
For booked calls, require:
- one workflow to discuss
- owner role
- current bottleneck note

### Stage F: Discovery Call
Output:
- go/no-go on diagnostic sprint

### Stage G: Paid Diagnostic
Output:
- pilot scope and execution plan

## 3. LP Conversion Requirements

- clear EMA-first credibility framing
- explicit outcome language
- narrow pilot logic
- governance confidence signals
- no generic hype copy

## 4. Funnel Benchmarks

- LP visitor -> call booked: 2-8% (warm traffic)
- LP visitor -> lead capture: 8-20%
- lead capture -> call booked: 10-25%
- call held -> diagnostic close: 20-40%

## 5. Tracking Parameters

Use UTM tags for every shared link:
- `utm_source=linkedin`
- `utm_medium=organic` or `utm_medium=dm`
- `utm_campaign=firsttouch_launch`
- `utm_content={post_or_message_id}`

## 6. Follow-Up Logic

After lead capture (no call yet):
- Day 0: template delivery + short value note
- Day 2: diagnostic question
- Day 5: call invitation
- Day 10: close-the-loop message

After call booked:
- immediate confirmation + prep note
- 24h reminder
- 1h reminder

## 7. Funnel Assets Included

- LP page and thank-you page in `/FirstTouch/lp/`
- workflow template in `/FirstTouch/lp/assets/`
- outreach and DM script docs in this folder

## 8. Funnel Failure Modes

- too broad message, no concrete pain
- asking for call too early in DM
- first CTA not clear
- no clear governance reassurance
- LP copy reads as side project

