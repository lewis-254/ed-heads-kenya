const { Resend } = require('resend');

const GFORMS_VIEWFORM =
  'https://docs.google.com/forms/d/e/1FAIpQLSdp5zMb4yUgDr71eBP1O3Mbnwyzk0OGfnUF7D-rX6OeYR3Y0w/viewform';
const GFORMS_POST =
  'https://docs.google.com/forms/d/e/1FAIpQLSdp5zMb4yUgDr71eBP1O3Mbnwyzk0OGfnUF7D-rX6OeYR3Y0w/formResponse';

const FROM_ADDRESS  = 'Ed-Heads Kenya <ed.heads@socialfunnel.agency>';
const NOTIFY_EMAIL  = process.env.NOTIFY_EMAIL || 'ed.heads@socialfunnel.agency';

module.exports = async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { first_name, last_name, school_name, role, email, phone } = req.body || {};

  if (!first_name || !last_name || !school_name || !role || !email) {
    return res.status(400).json({ error: 'Missing required fields' });
  }

  /* ── 1. Forward to Google Forms ── */
  const params = new URLSearchParams({
    'entry.204396305':  first_name,
    'entry.1974378742': last_name,
    'entry.429627754':  school_name,
    'entry.1544801237': role,
    'entry.1016405824': email,
    'entry.1905985612': phone || '',
  });

  const formsPromise = fetch(GFORMS_POST, {
    method: 'POST',
    redirect: 'follow',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
      'Referer': GFORMS_VIEWFORM,
      'Origin': 'https://docs.google.com',
    },
    body: params.toString(),
  }).catch((err) => console.error('Google Forms error:', err));

  /* ── 2. Send both emails via Resend ── */
  const resend = new Resend(process.env.RESEND_API_KEY);

  const emailsPromise = resend.batch.send([
    {
      from: FROM_ADDRESS,
      to: email,
      subject: "You're registered — Ed-Heads Kenya Webinar, 4th June 2026",
      html: confirmationEmail({ first_name }),
    },
    {
      from: FROM_ADDRESS,
      to: NOTIFY_EMAIL,
      subject: `New registration: ${first_name} ${last_name} — ${school_name}`,
      html: notificationEmail({ first_name, last_name, school_name, role, email, phone }),
    },
  ]);

  const [, emailResult] = await Promise.all([formsPromise, emailsPromise]);

  if (emailResult.error) {
    console.error('Resend batch error:', emailResult.error);
    return res.status(500).json({ error: 'Failed to send emails' });
  }

  return res.status(200).json({ success: true });
};

/* ── Email templates ── */

function confirmationEmail({ first_name }) {
  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width,initial-scale=1.0">
</head>
<body style="margin:0;padding:0;background:#F0F4FF;font-family:'Helvetica Neue',Helvetica,Arial,sans-serif;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background:#F0F4FF;padding:40px 16px;">
    <tr><td align="center">
      <table width="100%" cellpadding="0" cellspacing="0" style="max-width:580px;">

        <tr>
          <td style="background:#0F1259;border-radius:12px 12px 0 0;padding:28px 40px;text-align:center;">
            <span style="font-weight:800;font-size:20px;letter-spacing:0.06em;color:#31D3C6;">ED-HEADS</span>
            <span style="font-weight:700;font-size:13px;color:#31D3C6;opacity:0.75;margin-left:4px;">(Kenya)</span>
          </td>
        </tr>

        <tr>
          <td style="background:#ffffff;padding:40px 40px 32px;">
            <h1 style="font-weight:800;font-size:26px;color:#0F1259;margin:0 0 12px;line-height:1.25;">You're registered. ✅</h1>
            <p style="font-size:16px;color:#6B7A99;line-height:1.7;margin:0 0 28px;">Hi ${first_name}, thanks for reserving your seat at the Ed-Heads Kenya Early Adopters Webinar. We're looking forward to seeing you there.</p>

            <table width="100%" cellpadding="0" cellspacing="0" style="background:#F0F4FF;border-radius:10px;margin-bottom:28px;">
              <tr><td style="padding:24px 28px;">
                <table cellpadding="0" cellspacing="0">
                  <tr>
                    <td style="font-size:18px;padding-right:12px;vertical-align:top;padding-bottom:10px;">📅</td>
                    <td style="font-size:15px;color:#0F1259;font-weight:600;padding-bottom:10px;">Thursday, 4th June 2026</td>
                  </tr>
                  <tr>
                    <td style="font-size:18px;padding-right:12px;vertical-align:top;padding-bottom:10px;">⏰</td>
                    <td style="font-size:15px;color:#0F1259;padding-bottom:10px;">1:00 PM – 1:45 PM EAT</td>
                  </tr>
                  <tr>
                    <td style="font-size:18px;padding-right:12px;vertical-align:top;">📍</td>
                    <td style="font-size:15px;color:#0F1259;">Online via Zoom — <em>link to follow</em></td>
                  </tr>
                </table>
              </td></tr>
            </table>

            <p style="font-size:15px;color:#6B7A99;line-height:1.7;margin:0 0 24px;">
              We'll send you the Zoom link and a reminder a few days before the webinar.
              If you don't receive it, check your spam folder or get in touch directly.
            </p>
            <p style="font-size:15px;color:#6B7A99;line-height:1.7;margin:0;">
              Questions in the meantime?<br>
              WhatsApp: <a href="https://wa.me/[number]" style="color:#31D3C6;text-decoration:none;">[number]</a>&nbsp;·&nbsp;
              Email: <a href="mailto:kenya@ed-heads.co.uk" style="color:#31D3C6;text-decoration:none;">kenya@ed-heads.co.uk</a>
            </p>
          </td>
        </tr>

        <tr>
          <td style="background:#ffffff;padding:0 40px;">
            <hr style="border:none;border-top:1px solid #F0F4FF;margin:0;">
          </td>
        </tr>

        <tr>
          <td style="background:#ffffff;padding:28px 40px 36px;">
            <p style="font-weight:700;font-size:13px;letter-spacing:0.06em;text-transform:uppercase;color:#0F1259;margin:0 0 16px;">What we'll cover</p>
            <table cellpadding="0" cellspacing="0">
              <tr><td style="padding-right:10px;padding-bottom:10px;color:#31D3C6;font-weight:700;white-space:nowrap;">01</td><td style="font-size:14px;color:#6B7A99;padding-bottom:10px;line-height:1.55;">The learning loss problem — the data behind the 17% gap</td></tr>
              <tr><td style="padding-right:10px;padding-bottom:10px;color:#31D3C6;font-weight:700;white-space:nowrap;">02</td><td style="font-size:14px;color:#6B7A99;padding-bottom:10px;line-height:1.55;">Live walkthrough of Ed-Heads, Coach Ed, and the parent progress report</td></tr>
              <tr><td style="padding-right:10px;padding-bottom:10px;color:#31D3C6;font-weight:700;white-space:nowrap;">03</td><td style="font-size:14px;color:#6B7A99;padding-bottom:10px;line-height:1.55;">CBC, KCSE &amp; IGCSE curriculum alignment documents</td></tr>
              <tr><td style="padding-right:10px;color:#31D3C6;font-weight:700;white-space:nowrap;">04</td><td style="font-size:14px;color:#6B7A99;line-height:1.55;">The Kenya Early Adopter offer and 15-minute Q&amp;A</td></tr>
            </table>
          </td>
        </tr>

        <tr>
          <td style="background:#0F1259;border-radius:0 0 12px 12px;padding:24px 40px;text-align:center;">
            <p style="font-size:12px;color:rgba(255,255,255,0.4);margin:0;line-height:1.8;">
              © 2026 Ed-Heads Ltd · Distributed in Kenya by Social Funnel<br>
              <a href="https://ed-heads.co.uk" style="color:#31D3C6;text-decoration:none;">ed-heads.co.uk</a>
            </p>
          </td>
        </tr>

      </table>
    </td></tr>
  </table>
</body>
</html>`;
}

function notificationEmail({ first_name, last_name, school_name, role, email, phone }) {
  const ts = new Date().toLocaleString('en-GB', { timeZone: 'Africa/Nairobi', dateStyle: 'full', timeStyle: 'short' });
  return `<!DOCTYPE html>
<html lang="en">
<head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1.0"></head>
<body style="margin:0;padding:0;background:#F0F4FF;font-family:'Helvetica Neue',Helvetica,Arial,sans-serif;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background:#F0F4FF;padding:40px 16px;">
    <tr><td align="center">
      <table width="100%" cellpadding="0" cellspacing="0" style="max-width:520px;">

        <tr>
          <td style="background:#0F1259;border-radius:12px 12px 0 0;padding:20px 32px;">
            <span style="font-weight:800;font-size:14px;letter-spacing:0.06em;color:#31D3C6;text-transform:uppercase;">Ed-Heads Kenya</span>
            <span style="font-size:13px;color:rgba(255,255,255,0.45);margin-left:8px;">New registration</span>
          </td>
        </tr>

        <tr>
          <td style="background:#ffffff;padding:32px 32px 28px;">
            <h2 style="font-weight:800;font-size:20px;color:#0F1259;margin:0 0 6px;">
              ${first_name} ${last_name}
            </h2>
            <p style="font-size:14px;color:#6B7A99;margin:0 0 24px;">${role} · ${school_name}</p>

            <table width="100%" cellpadding="0" cellspacing="0" style="border-top:1px solid #F0F4FF;">
              <tr>
                <td style="padding:12px 0;border-bottom:1px solid #F0F4FF;font-size:13px;color:#6B7A99;width:100px;">Email</td>
                <td style="padding:12px 0;border-bottom:1px solid #F0F4FF;font-size:13px;color:#0F1259;">
                  <a href="mailto:${email}" style="color:#31D3C6;text-decoration:none;">${email}</a>
                </td>
              </tr>
              <tr>
                <td style="padding:12px 0;border-bottom:1px solid #F0F4FF;font-size:13px;color:#6B7A99;">Phone</td>
                <td style="padding:12px 0;border-bottom:1px solid #F0F4FF;font-size:13px;color:#0F1259;">${phone || '—'}</td>
              </tr>
              <tr>
                <td style="padding:12px 0;font-size:13px;color:#6B7A99;">Registered</td>
                <td style="padding:12px 0;font-size:13px;color:#0F1259;">${ts} EAT</td>
              </tr>
            </table>
          </td>
        </tr>

        <tr>
          <td style="background:#0F1259;border-radius:0 0 12px 12px;padding:16px 32px;text-align:center;">
            <p style="font-size:11px;color:rgba(255,255,255,0.35);margin:0;">Ed-Heads Kenya · Early Adopters Webinar · 4th June 2026</p>
          </td>
        </tr>

      </table>
    </td></tr>
  </table>
</body>
</html>`;
}
