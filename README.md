# Ed-Heads Kenya — Teachers Webinar Campaign

**Live preview:** https://ed-heads-kenya.vercel.app
**Target URL:** `kenya.ed-heads.co.uk/teachers-webinar`
**Webinar:** Thursday 4 June 2026 · 1:00–1:45 PM EAT

---

## What's in this repo

| File | Description |
|---|---|
| `index.html` | Landing page — fully self-contained, no build step |
| `email-sequence.md` | 5-email nurture sequence with full copy and send timing |
| `vercel.json` | Static site config (if deploying via Vercel) |
| `assets/` | Drop `logo.png` here when available (see note in index.html) |

---

## Step 1 — Deploy the page

The landing page is a single HTML file with no dependencies or build process.

### Option A — Copy file into your existing project
Place `index.html` at whichever path in your project serves `/teachers-webinar`.
Most setups: create a `teachers-webinar/` folder and put `index.html` inside it.

### Option B — Vercel (standalone)
The repo is already connected to Vercel. To deploy to your custom domain:
1. Import this repo into Vercel
2. Go to **Project Settings → Domains**
3. Add `kenya.ed-heads.co.uk` and set the path to `/teachers-webinar`

---

## Step 2 — Fill in the remaining placeholders

Open `index.html` and search for these strings. They are the only things left to update:

| Placeholder | Where | What to put |
|---|---|---|
| `[ZOOM LINK]` | Hero card, footer, form success message | Full Zoom join URL |
| `[ZOOM ID]` | Email sequence only | Zoom meeting ID |
| `[ZOOM PASSCODE]` | Email sequence only | Zoom passcode |
| `[number]` | Footer + form success message | Kenya WhatsApp number e.g. `+254 7XX XXX XXX` |
| `[CALENDLY LINK]` | Email 5 only | 20-min booking link for 1:1 calls |

**Quick find:** In your editor, search for `[ZOOM` and `[number]` — that catches everything.

Date and time are already set: **Thursday, 4th June 2026 · 1:00–1:45 PM EAT**

---

## Step 3 — Connect the registration form

The form currently has `action="#"` — it needs to point to your email platform to capture registrations and trigger the confirmation email.

### If you use GoHighLevel (GHL)
1. In GHL, create a new **Form** or use an existing **Webhook**
2. Go to **Settings → Integrations → Webhooks** → copy the inbound webhook URL
3. In `index.html`, find the line:
   ```html
   <!-- Form action: connect to GHL webhook, Mailchimp, or email provider of choice -->
   <form id="registration-form-el" action="#" method="POST" novalidate>
   ```
4. Replace `action="#"` with your GHL webhook URL:
   ```html
   <form id="registration-form-el" action="https://YOUR-GHL-WEBHOOK-URL" method="POST" novalidate>
   ```
5. In GHL, set up an automation triggered by that webhook to send **Email 1** (confirmation) from `kenya@ed-heads.co.uk`

### If you use Mailchimp
1. Create an audience and go to **Signup forms → Embedded forms**
2. Copy the form `action` URL from the generated embed code (starts with `https://list-manage.com/subscribe/post`)
3. Replace `action="#"` with that URL
4. Set up a **Welcome Email** automation in Mailchimp to send Email 1 on new subscriber

### If you use ActiveCampaign / ConvertKit / other
Same pattern — get the form submission endpoint URL from the platform and set it as the `action`.

---

## Step 4 — Set up the email sequence

All 5 emails are in `email-sequence.md` with full copy, subject lines, and send timing.

| Email | Trigger |
|---|---|
| 1 — Confirmation | Immediately on form submit |
| 2 — 7 Days Before | 7 days before 4 June 2026 |
| 3 — 48 Hours Before | 2 June 2026 |
| 4 — Day Of (2 hrs before) | 4 June 2026 at 11:00 AM EAT |
| 5 — Post-Webinar | Within 2 hours of webinar ending |

Before loading emails into your platform, replace these in `email-sequence.md`:

| Placeholder | Replace with |
|---|---|
| `[ZOOM LINK]` | Zoom join URL |
| `[ZOOM ID]` / `[ZOOM PASSCODE]` | Meeting credentials |
| `[number]` | Kenya WhatsApp number |
| `[CALENDLY LINK]` | 1:1 booking link (Email 5) |
| `[RECORDING LINK]` | Recording URL — add after the webinar |
| `[CBC LINK]` / `[KCSE LINK]` / `[IGCSE LINK]` | Curriculum doc download links (Email 5) |
| `[X weeks]` | Trial duration — confirm with Lewis before sending Email 5 |

**Email 5 note:** Tag attendees as `webinar_attended` and no-shows as `webinar_registered_no_show` using your Zoom attendance export. Email 5 has two conditional blocks — show the correct one based on that tag.

---

## Step 5 — Add the logo (optional)

The logo is currently rendered as styled text. To swap in the real image:
1. Drop `logo.png` (or `.avif`) into the `assets/` folder
2. In `index.html`, find both logo comment blocks (search for `<!-- Logo: replace`):
   ```html
   <!-- Logo: replace with <img src="assets/logo.png" alt="Ed-Heads" width="180" height="44"> when available -->
   ```
3. Replace the `<span class="logo-text">ED-HEADS</span>` line above each comment with:
   ```html
   <img src="assets/logo.png" alt="Ed-Heads" width="180" height="44">
   ```

---

## Questions

Contact Lewis Ngunyi — kenya@ed-heads.co.uk / WhatsApp [number]
