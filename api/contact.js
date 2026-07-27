const { Resend } = require('resend');

const FROM_ADDRESS  = 'Ed-Heads Kenya <ed.heads@socialfunnel.agency>';
const NOTIFY_EMAIL  = process.env.NOTIFY_EMAIL || 'ed.heads@socialfunnel.agency';

const CONFIGS = {
  parent: {
    label: 'Parent subscription enquiry',
    requiredFields: ['name', 'email', 'phone'],
    confirmSubject: 'We received your interest — Ed-Heads Kenya',
    confirmIntro: (name) => `Hi ${name},`,
    confirmBody: `Thank you for your interest in Ed-Heads Kenya. We will be in touch within 24 hours with your subscription details and next steps to get your child started.`,
    notifySubject: (data) => `New parent enquiry: ${data.name}`,
  },
  school: {
    label: 'School demonstration request',
    requiredFields: ['name', 'school_name', 'role', 'email'],
    confirmSubject: 'Demonstration request received — Ed-Heads Kenya',
    confirmIntro: (name) => `Hi ${name},`,
    confirmBody: `Thank you for your interest in Ed-Heads for your school. Our team will contact you within 24 hours to arrange a demonstration for your leadership team.`,
    notifySubject: (data) => `School demo request: ${data.name} — ${data.school_name}`,
  },
  tutor: {
    label: 'Tutor partner sign-up',
    requiredFields: ['name', 'email', 'phone'],
    confirmSubject: 'Welcome to the Ed-Heads Kenya partner programme',
    confirmIntro: (name) => `Hi ${name},`,
    confirmBody: `Welcome to the Ed-Heads Kenya tutor partner programme. We will send you your personal referral link and full commission details within 24 hours.`,
    notifySubject: (data) => `Tutor partner sign-up: ${data.name}`,
  },
};

module.exports = async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { form_type, name, email, phone, school_name, role, grade, student_count } = req.body || {};

  const config = CONFIGS[form_type];
  if (!config) {
    return res.status(400).json({ error: 'Invalid form_type' });
  }

  // Validate required fields
  const missing = config.requiredFields.filter((f) => !req.body[f]);
  if (missing.length) {
    return res.status(400).json({ error: `Missing required fields: ${missing.join(', ')}` });
  }

  const data = { name, email, phone, school_name, role, grade, student_count, form_type };
  const ts   = new Date().toLocaleString('en-GB', { timeZone: 'Africa/Nairobi', dateStyle: 'full', timeStyle: 'short' });

  const resend = new Resend(process.env.RESEND_API_KEY);

  const result = await resend.batch.send([
    {
      from: FROM_ADDRESS,
      to: email,
      subject: config.confirmSubject,
      html: confirmationEmail({ config, name, ts }),
    },
    {
      from: FROM_ADDRESS,
      to: NOTIFY_EMAIL,
      subject: config.notifySubject(data),
      html: notificationEmail({ data, config, ts }),
    },
  ]);

  if (result.error) {
    console.error('Resend error:', result.error);
    return res.status(500).json({ error: 'Failed to send emails' });
  }

  return res.status(200).json({ success: true });
};

/* ── Email templates ── */

function confirmationEmail({ config, name, ts }) {
  return `<!DOCTYPE html>
<html lang="en">
<head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1.0"></head>
<body style="margin:0;padding:0;background:#F0F4FF;font-family:'Helvetica Neue',Helvetica,Arial,sans-serif;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background:#F0F4FF;padding:40px 16px;">
    <tr><td align="center">
      <table width="100%" cellpadding="0" cellspacing="0" style="max-width:560px;">

        <tr>
          <td style="background:#0F1259;border-radius:12px 12px 0 0;padding:28px 40px;text-align:center;">
            <span style="font-weight:800;font-size:20px;letter-spacing:0.06em;color:#31D3C6;">ED-HEADS</span>
            <span style="font-weight:700;font-size:13px;color:#31D3C6;opacity:0.75;margin-left:4px;">(Kenya)</span>
          </td>
        </tr>

        <tr>
          <td style="background:#ffffff;padding:40px 40px 36px;">
            <p style="font-size:16px;font-weight:700;color:#0F1259;margin:0 0 8px;">${config.confirmIntro(name)}</p>
            <p style="font-size:16px;color:#5A6A8A;line-height:1.7;margin:0 0 32px;">${config.confirmBody}</p>

            <table width="100%" cellpadding="0" cellspacing="0" style="background:#F0F4FF;border-radius:10px;margin-bottom:32px;">
              <tr><td style="padding:20px 24px;">
                <p style="font-size:13px;font-weight:600;text-transform:uppercase;letter-spacing:0.08em;color:#0F1259;margin:0 0 8px;">What happens next</p>
                <p style="font-size:14px;color:#5A6A8A;line-height:1.65;margin:0;">
                  Our Kenya team will reach out within 24 hours.
                  If you don't hear from us, WhatsApp us directly on
                  <a href="https://wa.me/254742850588" style="color:#31D3C6;text-decoration:none;">+254 742 850 588</a>.
                </p>
              </td></tr>
            </table>

            <p style="font-size:13px;color:#8A9ABF;margin:0;">
              Questions?
              <a href="https://wa.me/254742850588" style="color:#31D3C6;text-decoration:none;">WhatsApp +254 742 850 588</a>
              &nbsp;·&nbsp;
              <a href="mailto:kenya@ed-heads.co.ke" style="color:#31D3C6;text-decoration:none;">kenya@ed-heads.co.ke</a>
            </p>
          </td>
        </tr>

        <tr>
          <td style="background:#0F1259;border-radius:0 0 12px 12px;padding:20px 40px;text-align:center;">
            <p style="font-size:11px;color:rgba(255,255,255,0.35);margin:0;line-height:1.8;">
              © 2026 Ed-Heads Ltd · Distributed in Kenya by Social Funnel ·
              <a href="https://ed-heads.co.ke" style="color:#31D3C6;text-decoration:none;">ed-heads.co.ke</a>
            </p>
          </td>
        </tr>

      </table>
    </td></tr>
  </table>
</body>
</html>`;
}

function notificationEmail({ data, config, ts }) {
  const rows = [
    ['Name',          data.name],
    ['Email',         data.email],
    ['Phone',         data.phone        || '—'],
    ['School',        data.school_name  || '—'],
    ['Role',          data.role         || '—'],
    ['Child grade',   data.grade        || '—'],
    ['Students',      data.student_count || '—'],
    ['Submitted',     `${ts} EAT`],
  ].filter(([, v]) => v !== '—' || ['Submitted'].includes(undefined));

  const tableRows = rows.map(([label, value]) => `
    <tr>
      <td style="padding:10px 0;border-bottom:1px solid #F0F4FF;font-size:13px;color:#6B7A99;width:110px;white-space:nowrap;">${label}</td>
      <td style="padding:10px 0;border-bottom:1px solid #F0F4FF;font-size:13px;color:#0F1259;">${value}</td>
    </tr>`).join('');

  return `<!DOCTYPE html>
<html lang="en">
<head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1.0"></head>
<body style="margin:0;padding:0;background:#F0F4FF;font-family:'Helvetica Neue',Helvetica,Arial,sans-serif;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background:#F0F4FF;padding:40px 16px;">
    <tr><td align="center">
      <table width="100%" cellpadding="0" cellspacing="0" style="max-width:520px;">

        <tr>
          <td style="background:#0F1259;border-radius:12px 12px 0 0;padding:20px 32px;">
            <span style="font-weight:800;font-size:13px;letter-spacing:0.06em;color:#31D3C6;text-transform:uppercase;">Ed-Heads Kenya</span>
            <span style="font-size:13px;color:rgba(255,255,255,0.45);margin-left:8px;">${config.label}</span>
          </td>
        </tr>

        <tr>
          <td style="background:#ffffff;padding:32px 32px 28px;">
            <h2 style="font-weight:800;font-size:20px;color:#0F1259;margin:0 0 24px;">${data.name}</h2>
            <table width="100%" cellpadding="0" cellspacing="0" style="border-top:1px solid #F0F4FF;">
              ${tableRows}
            </table>
          </td>
        </tr>

        <tr>
          <td style="background:#0F1259;border-radius:0 0 12px 12px;padding:16px 32px;text-align:center;">
            <p style="font-size:11px;color:rgba(255,255,255,0.35);margin:0;">Ed-Heads Kenya · ed-heads.co.ke</p>
          </td>
        </tr>

      </table>
    </td></tr>
  </table>
</body>
</html>`;
}
