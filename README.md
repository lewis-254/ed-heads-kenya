# Ed-Heads Kenya — Website & Campaign

**Domain:** ed-heads.co.ke  
**Owner:** Social Funnel Kenya (Lewis Ngunyi)  
**Hosting:** Vercel — serves from `/public/` directory  
**Contact:** kenya@ed-heads.co.ke

---

## What This Site Does

Converts Kenyan parents, school administrators, and private tutors into paying Ed-Heads subscribers.

Payment happens on the Ed-Heads UK payment page (external). After payment, Ed-Heads UK provisions the account and the subscriber is redirected to `ed-heads.co.ke/welcome?ref=payment-complete` for onboarding. Everything else — all copy, all conversion, all nurture — happens on ed-heads.co.ke.

---

## File Structure

```
public/
├── index.html              ← Homepage (primary conversion page)
├── how-it-works.html       ← Product explainer
├── pricing.html            ← Full pricing page with comparison table
├── for-schools.html        ← School administrator landing
├── for-tutors.html         ← Tutor partner landing
├── faqs.html               ← Full FAQ page (6 categories, 28 questions)
├── welcome.html            ← Post-payment onboarding (soft-gated)
├── start.html              ← Campaign landing page (no nav — for Meta ads)
├── webinar.html            ← School leader webinar landing (existing page)
├── confirm.html            ← Webinar registration confirmation (existing)
├── assets/
│   ├── logo.png            ← Ed-Heads logo (890×162px, RGBA) — ADD THIS
│   ├── favicon.ico         ← Favicon — ADD THIS
│   └── og-image.jpg        ← 1200×630 OG social sharing image — ADD THIS
├── css/
│   └── styles.css          ← Shared stylesheet (full design system)
└── js/
    └── main.js             ← Shared JavaScript (12 behaviours)

api/
└── register.js             ← Webinar registration serverless function (existing)
```

---

## Placeholder Variables

All placeholders appear as `{{VARIABLE_NAME}}` in the HTML files. Search and replace before going live.

| Placeholder | Description | Where to find |
|---|---|---|
| `{{PAYMENT_URL}}` | Ed-Heads UK payment page URL (M-Pesa/card) | From Chris at Ed-Heads UK |
| `{{WEBINAR_URL}}` | Webinar registration page URL | webinar.html or external registration page |
| `{{WHATSAPP_NUMBER}}` | Kenya WhatsApp number (include country code, no spaces) | e.g. 254742850588 |
| `{{WEBINAR_DATE}}` | Next webinar date | e.g. "Thursday, 3rd July 2026" |
| `{{WEBINAR_TIME}}` | Webinar time EAT | e.g. "1:00 PM – 1:45 PM EAT" |
| `{{TUTOR_SIGNUP_URL}}` | GHL form URL for tutor partner sign-up | GoHighLevel or landing page |
| `{{SCHOOL_CONTACT_URL}}` | GHL form or Calendly URL for school demo booking | GoHighLevel or Calendly |
| `{{CALENDLY_URL}}` | 1:1 call booking link (for general use) | Calendly |
| `{{META_PIXEL_ID}}` | Meta (Facebook) Pixel ID | Meta Business Manager |
| `{{GTM_ID}}` | Google Tag Manager container ID | Google Tag Manager |
| `{{EARLY_ADOPTER_COUNT}}` | Number of early adopter places claimed so far | Update regularly in body data attributes |
| `{{PLACES_REMAINING}}` | 2000 minus EARLY_ADOPTER_COUNT | Update in `body data-places-remaining="..."` |
| `{{ONBOARDING_VIDEO_URL}}` | Embedded video URL for welcome page | Loom, Vimeo, or YouTube |
| `{{TUTOR_COMMISSION_RATE}}` | Commission per referred student per month (KES) | Agreed with Ed-Heads UK |

### How to update PLACES_REMAINING across the site

The `body` tag on each page has `data-places-remaining="{{PLACES_REMAINING}}"`. Set this value and `main.js` will automatically populate all `.places-remaining` spans on the page. Update this regularly as places are claimed.

---

## Analytics Setup

### Meta Pixel
Replace `{{META_PIXEL_ID}}` in the `<head>` of every HTML file. The current webinar page uses pixel ID `1023751030324205` — confirm whether to reuse or create a new pixel for the main site.

Custom events already wired in `js/main.js`:
- `.btn-payment` click → `fbq('track', 'InitiateCheckout', {value: 2000, currency: 'KES'})`
- `.btn-school-contact` click → `fbq('track', 'Lead', {content_name: 'school_inquiry'})`
- `.btn-tutor-signup` click → `fbq('track', 'Lead', {content_name: 'tutor_partner'})`
- FAQ accordion open → `dataLayer.push({event: 'faq_opened', question: ...})`
- `welcome.html` → `fbq('track', 'Purchase', {value: 2000, currency: 'KES'})`

### Google Tag Manager
Uncomment the GTM snippet in each page `<head>` and replace `{{GTM_ID}}`.

---

## Assets to Add

Before going live, add these three files to `public/assets/`:

1. **logo.png** — Ed-Heads logo, RGBA, ideally 890×162px or similar aspect ratio. If unavailable, the site renders a CSS fallback: "ED-HEADS" in Nunito 900, teal (#31D3C6) on navy.
2. **favicon.ico** — Browser tab icon. Can be generated from the logo.
3. **og-image.jpg** — 1200×630px OG image for social sharing. Used by Meta, Twitter/X, and LinkedIn when the site is shared.

---

## Deployment

The site is already configured for Vercel via `vercel.json`:
```json
{ "framework": null, "outputDirectory": "public" }
```

Push to the connected Git repository to trigger an automatic deployment. The webinar registration API (`api/register.js`) is a Vercel serverless function and continues to work alongside the new static pages.

---

## Three Campaigns Running Alongside This Site

| Campaign | Traffic Source | Destination | Objective |
|---|---|---|---|
| Direct Parent Conversion | Meta ads | `start.html` | InitiateCheckout / payment clicks |
| School Webinar | Meta + LinkedIn + WhatsApp | `webinar.html` | Webinar registrations |
| Tutor Partner Recruitment | Facebook tutor groups + WhatsApp | `for-tutors.html` | Tutor sign-ups |

---

## Communications

### Email to Chris (Ed-Heads UK) — send before site launch

---

Subject: Ed-Heads Kenya — moving to ed-heads.co.ke (and what this means for you)

Hi Chris,

Quick update on the Kenya digital infrastructure.

We have been working within the ed-heads.co.uk subdomain structure and have run into a recurring issue: the Kenya landing pages and marketing funnels we are building are more sophisticated than what the Wix platform can support cleanly. The design language doesn't port over correctly, and we keep running into limitations on custom code, pixel installation, and conversion tracking.

Our solution is to purchase ed-heads.co.ke as a dedicated domain and host the entire Kenya marketing presence there, independently.

Here is how the customer journey works under the new structure:

1. Kenyan parents and schools discover Ed-Heads through our campaigns
2. They land on ed-heads.co.ke (our site — fully custom, fast, conversion-optimised)
3. They browse, read, and decide to subscribe
4. When they click "Subscribe", they are directed to your payment page (the URL you provide for M-Pesa/card processing)
5. Payment is completed on your end (your gateway, your records)
6. You provision the account and send login credentials as normal
7. The subscriber is redirected to ed-heads.co.ke/welcome for onboarding

What we need from you for this to work seamlessly:

1. The direct payment URL (the page where Kenyan subscribers pay you)
2. Confirmation that after payment, subscribers receive login credentials within 1 hour
3. Your preferred redirect URL after payment (we suggest ed-heads.co.ke/welcome?ref=payment-complete)
4. The Ed-Heads logo files in PNG and SVG (we will use our own branded version for the Kenya site)
5. Any curriculum alignment documents you can share for CBC, KCSE, and IGCSE

Nothing changes on your end operationally. You still collect the payment, provision the accounts, and run the platform. We handle all Kenya marketing, acquisition, and onboarding — and remit your share weekly as agreed.

The Kenya site goes live as soon as the development is complete. Happy to walk through this on a call if helpful.

Lewis

---

## Quality Checklist

Before launch, verify:

**Functionality:**
- [ ] All 8 pages render on Chrome, Safari, Firefox
- [ ] Mobile layout: 375px, 430px, 768px — no horizontal overflow
- [ ] Desktop layout: 1280px, 1440px
- [ ] Nav becomes solid navy on scroll (80px threshold)
- [ ] Mobile hamburger menu opens and closes correctly
- [ ] All CTA buttons use correct `{{PLACEHOLDERS}}` (not broken links)
- [ ] Payment link appends UTM parameters from URL
- [ ] FAQ accordion opens/closes smoothly, one at a time
- [ ] Counter animations fire on scroll (homepage stats, counter card)
- [ ] Progress bar animations fire on scroll (report mockup)
- [ ] Tab switcher works on homepage (Parents / Schools / Tutors)
- [ ] Exit intent popup fires on `start.html` desktop, session cookie prevents repeat
- [ ] `welcome.html` without `?ref=payment-complete` redirects to `index.html`
- [ ] `welcome.html?ref=payment-complete` loads normally

**Copy:**
- [ ] No `{{PLACEHOLDER}}` strings left unfilled (or they are clearly visible as placeholders)
- [ ] Price consistency: KES 2,000 early adopter, KES 3,500 listed, £40 UK — throughout
- [ ] 17% stat appears in: hero badge, problem section, for-schools page, start.html
- [ ] "First 2,000 families" scarcity on: hero, price card, final CTA, start.html

**Performance:**
- [ ] Lighthouse mobile score > 85
- [ ] No console errors on any page
- [ ] All images have `width` and `height` attributes
- [ ] Logo fallback renders correctly when `assets/logo.png` is absent

**Analytics:**
- [ ] Meta Pixel fires PageView on load (all pages)
- [ ] InitiateCheckout fires on `.btn-payment` click
- [ ] Purchase fires on `welcome.html` load
- [ ] GTM container loads (when `{{GTM_ID}}` is filled)
