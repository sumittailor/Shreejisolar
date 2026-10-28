const nodemailer = require('nodemailer');
const fs = require('fs');
const path = require('path');

// Configure transporter
function getTransporter() {
  const host = process.env.SMTP_HOST;
  const port = parseInt(process.env.SMTP_PORT || '587', 10);
  const user = process.env.SMTP_USER;
  const pass = process.env.SMTP_PASS;

  if (host && user && pass) {
    return nodemailer.createTransporter({
      host,
      port,
      secure: port === 465,
      auth: { user, pass }
    });
  }
  return null;
}

/**
 * Send business enquiry notification and optional customer confirmation
 */
async function sendEnquiryNotification({ enquiry, businessEmail }) {
  const recipient = businessEmail || process.env.BUSINESS_EMAIL;
  const transporter = getTransporter();

  const businessSubject = `New Enquiry — Shree Ji Solar Experts — [${enquiry.reference_no}]`;
  const businessHtml = `
    <div style="font-family: Arial, sans-serif; max-width: 650px; margin: 0 auto; border: 1px solid #e2e8f0; border-radius: 8px; overflow: hidden;">
      <div style="background-color: #0A192F; color: #ffffff; padding: 20px; text-align: center;">
        <h2 style="margin: 0; font-size: 24px; color: #F59E0B;">SHREE JI SOLAR EXPERTS</h2>
        <p style="margin: 5px 0 0; color: #cbd5e1; font-size: 14px;">Customer Solar Enquiry Notification</p>
      </div>

      <div style="padding: 24px; background-color: #ffffff;">
        <div style="background-color: #f8fafc; border-left: 4px solid #F59E0B; padding: 12px 16px; margin-bottom: 20px;">
          <p style="margin: 0; font-size: 15px;"><strong>Reference Number:</strong> <span style="font-size: 16px; color: #0A192F;">${enquiry.reference_no}</span></p>
          <p style="margin: 4px 0 0; font-size: 13px; color: #64748b;">Received: ${new Date().toLocaleString('en-IN')}</p>
        </div>

        <h3 style="color: #0A192F; border-bottom: 2px solid #e2e8f0; padding-bottom: 8px; margin-top: 0;">Customer Information</h3>
        <table style="width: 100%; border-collapse: collapse; margin-bottom: 20px; font-size: 14px;">
          <tr>
            <td style="padding: 8px 0; color: #64748b; width: 35%;">Customer Name:</td>
            <td style="padding: 8px 0; font-weight: bold; color: #1e293b;">${enquiry.customer_name}</td>
          </tr>
          <tr>
            <td style="padding: 8px 0; color: #64748b;">Mobile Number:</td>
            <td style="padding: 8px 0; font-weight: bold; color: #1e293b;"><a href="tel:${enquiry.mobile}">${enquiry.mobile}</a></td>
          </tr>
          <tr>
            <td style="padding: 8px 0; color: #64748b;">Email Address:</td>
            <td style="padding: 8px 0; color: #1e293b;">${enquiry.email ? `<a href="mailto:${enquiry.email}">${enquiry.email}</a>` : 'Not provided'}</td>
          </tr>
          <tr>
            <td style="padding: 8px 0; color: #64748b;">City / Service Location:</td>
            <td style="padding: 8px 0; color: #1e293b;">${enquiry.city}</td>
          </tr>
          <tr>
            <td style="padding: 8px 0; color: #64748b;">Property Type:</td>
            <td style="padding: 8px 0; color: #1e293b;">${enquiry.property_type}</td>
          </tr>
        </table>

        <h3 style="color: #0A192F; border-bottom: 2px solid #e2e8f0; padding-bottom: 8px;">Service & System Specifications</h3>
        <table style="width: 100%; border-collapse: collapse; margin-bottom: 20px; font-size: 14px;">
          <tr>
            <td style="padding: 8px 0; color: #64748b; width: 35%;">Service Requested:</td>
            <td style="padding: 8px 0; font-weight: bold; color: #0284C7;">${enquiry.service_required}</td>
          </tr>
          ${enquiry.selected_package ? `
          <tr>
            <td style="padding: 8px 0; color: #64748b;">Selected Package:</td>
            <td style="padding: 8px 0; color: #1e293b;">${enquiry.selected_package}</td>
          </tr>` : ''}
          ${enquiry.desired_capacity ? `
          <tr>
            <td style="padding: 8px 0; color: #64748b;">Desired Solar Capacity:</td>
            <td style="padding: 8px 0; color: #1e293b;">${enquiry.desired_capacity}</td>
          </tr>` : ''}
          ${enquiry.monthly_bill ? `
          <tr>
            <td style="padding: 8px 0; color: #64748b;">Approx Monthly Bill:</td>
            <td style="padding: 8px 0; color: #1e293b;">${enquiry.monthly_bill}</td>
          </tr>` : ''}
          ${enquiry.panel_count ? `
          <tr>
            <td style="padding: 8px 0; color: #64748b;">Solar Panel Count:</td>
            <td style="padding: 8px 0; color: #1e293b;">${enquiry.panel_count}</td>
          </tr>` : ''}
          ${enquiry.preferred_date ? `
          <tr>
            <td style="padding: 8px 0; color: #64748b;">Preferred Date:</td>
            <td style="padding: 8px 0; color: #1e293b;">${enquiry.preferred_date}</td>
          </tr>` : ''}
          ${enquiry.additional_notes ? `
          <tr>
            <td style="padding: 8px 0; color: #64748b; vertical-align: top;">Additional Requirements:</td>
            <td style="padding: 8px 0; color: #1e293b; background: #f8fafc; padding: 10px; border-radius: 4px;">${enquiry.additional_notes}</td>
          </tr>` : ''}
        </table>
      </div>

      <div style="background-color: #f1f5f9; padding: 16px; text-align: center; font-size: 12px; color: #64748b;">
        <p style="margin: 0;">Shree Ji Solar Experts CRM & Web Management</p>
      </div>
    </div>
  `;

  // Log notification to audit file
  const logDir = path.join(__dirname, '../logs');
  if (!fs.existsSync(logDir)) {
    fs.mkdirSync(logDir, { recursive: true });
  }
  const logEntry = {
    timestamp: new Date().toISOString(),
    reference_no: enquiry.reference_no,
    recipient: recipient || 'No business email configured',
    has_smtp_transporter: !!transporter
  };

  fs.appendFileSync(
    path.join(logDir, 'email_notifications.log'),
    JSON.stringify(logEntry) + '\n',
    'utf8'
  );

  if (!transporter) {
    console.log(`[Email Service] SMTP not configured. Notification for ref ${enquiry.reference_no} recorded locally. Set SMTP_HOST, SMTP_USER, SMTP_PASS in .env to enable live delivery.`);
    return {
      success: true,
      status: 'pending_smtp_configuration',
      message: 'Enquiry saved successfully. SMTP credentials required for external relay.'
    };
  }

  if (!recipient) {
    return {
      success: false,
      status: 'missing_business_email',
      message: 'Business email recipient is not configured in settings or .env.'
    };
  }

  try {
    const info = await transporter.sendMail({
      from: `"Shree Ji Solar" <${process.env.SMTP_FROM || process.env.SMTP_USER}>`,
      to: recipient,
      subject: businessSubject,
      html: businessHtml
    });

    // If customer provided an email address, send confirmation
    if (enquiry.email && enquiry.email.includes('@')) {
      try {
        await transporter.sendMail({
          from: `"Shree Ji Solar Experts" <${process.env.SMTP_FROM || process.env.SMTP_USER}>`,
          to: enquiry.email,
          subject: `Enquiry Received — Shree Ji Solar Experts [${enquiry.reference_no}]`,
          html: `
            <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #e2e8f0; border-radius: 8px;">
              <h2 style="color: #0A192F;">Thank you for contacting Shree Ji Solar Experts!</h2>
              <p>Dear ${enquiry.customer_name},</p>
              <p>We have successfully received your request for <strong>${enquiry.service_required}</strong>.</p>
              <p>Your Enquiry Reference Number is: <strong style="color: #F59E0B; font-size: 18px;">${enquiry.reference_no}</strong></p>
              <p>Our solar energy team will review your specifications and reach out to you shortly via phone or WhatsApp.</p>
              <hr style="border: none; border-top: 1px solid #e2e8f0; margin: 20px 0;" />
              <p style="font-size: 13px; color: #64748b;">Shree Ji Solar Experts — Powering a Brighter Future with Solar Energy</p>
            </div>
          `
        });
      } catch (custErr) {
        console.error('[Email Service] Customer confirmation email error:', custErr.message);
      }
    }

    return {
      success: true,
      status: 'delivered',
      messageId: info.messageId
    };
  } catch (error) {
    console.error('[Email Service] Delivery error:', error.message);
    return {
      success: false,
      status: 'failed',
      error: error.message
    };
  }
}

module.exports = {
  sendEnquiryNotification,
  getTransporter
};
