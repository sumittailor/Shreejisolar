# SHREE JI SOLAR EXPERTS — Production Solar Business Website

Production-ready, responsive, full-stack website and management portal built for **SHREE JI SOLAR EXPERTS**.

> **Tagline:** *Powering a Brighter Future with Solar Energy*  
> **Brand Identity:** Deep Navy Blue, Solar Golden-Orange, Clean Slate, Eco Green, and Water Droplet Cyan with the supplied high-resolution company logo.

---

## ☀️ System Highlights & Architecture

- **Frontend:** React 19 + Vite 6 + Tailwind CSS v4 + Lucide Icons + React Router DOM
- **Backend:** Node.js + Express 5 REST API + SQLite database (`node:sqlite`)
- **Branding:** Official Shree Ji Solar Experts logo preserved and integrated seamlessly across all device viewports
- **Data Persistence:** All customer enquiries, solar packages, pricing, subsidy parameters, and business settings are stored persistently in SQLite
- **WhatsApp Integration:** Official click-to-chat links (`wa.me`) with prefilled URL-encoded messages including generated Enquiry Reference Numbers (`SJS-YYYYMMDD-XXXX`)
- **Email Notifications:** Server-side Nodemailer service with audit logging; supports live SMTP (Gmail, Zoho, Hostinger, AWS SES) and fallback simulation
- **Secure Admin Panel:** Protected administrative console with JWT session authentication, password hashing (`bcryptjs`), real-time enquiry status tracking, private internal staff notes, package editor, business settings manager, and one-click CSV export

---

## ⚡ Solar Installation Packages

The 4 standard capacity packages are seeded and dynamic:

| Solar Plan | Capacity | Listed Price | Subsidy Guidance |
| :--- | :--- | :--- | :--- |
| **Plan 1** | **3 kW** | **₹1,80,000** | PM Surya Ghar assistance up to ₹78,000 (Subject to eligibility) |
| **Plan 2** | **5 kW** | **₹2,70,000** | Central assistance up to ₹78,000 (Subject to eligibility) |
| **Plan 3** | **6 kW** | **₹3,50,000** | Verified based on scheme & property eligibility |
| **Plan 4** | **8 kW** | **₹4,00,000** | Commercial & large residence feasibility |

> **Note:** As specified, the 3 kW price is editable from the Admin Panel before publishing changes to the public site.

---

## 🛡️ Government Solar Subsidy Transparency

- Displays the proposed central subsidy amount (₹78,000 benchmark for 3 kW+ under the PM Surya Ghar: Muft Bijli Yojana).
- Clearly states that subsidy eligibility, amount, and disbursement depend on customer tariff category, sanctioned load, and DISCOM verification.
- Clearly distinguishes package prices from government assistance (does not deduct subsidies arbitrarily without on-site meter verification).
- Links directly to the official National Solar Portal: [`https://pmsuryaghar.gov.in`](https://pmsuryaghar.gov.in).
- Displays the regulatory review date (`2026-10-24`).

---

## 🚀 Getting Started Locally

### 1. Prerequisites
- Node.js v20+ or v24+
- npm v10+

### 2. Environment Configuration
Inspect or create `.env` in the root directory:

```env
PORT=5000
NODE_ENV=development
JWT_SECRET=shree-ji-solar-secret-key-prod-2026

# Business Contact Settings (also editable from Admin Console)
BUSINESS_EMAIL=info@shreejisolarexperts.com
WHATSAPP_NUMBER=919785002188
CONTACT_PHONE=+91 97850 02188

# Transactional Email SMTP Settings (Leave blank for internal logging mode)
SMTP_HOST=
SMTP_PORT=587
SMTP_USER=
SMTP_PASS=
SMTP_FROM=

# Default Admin Password
ADMIN_DEFAULT_PASSWORD=ShreeJiSolar@2026
```

### 3. Run the Unified Production Server
```bash
npm start
```
The server will boot on `http://localhost:5000` and serve both the REST API and the frontend application.

### 4. Run in Development Mode (Live HMR)
In terminal 1 (Backend API):
```bash
npm run server
```

In terminal 2 (Frontend with Hot Module Replacement):
```bash
npm run client
```
Frontend runs at `http://localhost:5173` with proxy to backend port 5000.

---

## 🔐 Admin Console Access

- **URL:** `http://localhost:5000/admin/login`
- **Default Username:** `admin`
- **Default Password:** `ShreeJiSolar@2026`

*(You can update password directly from the console or via `.env`)*

### Administrative Features:
1. **Overview Dashboard:** Total enquiries, new leads, quotations sent, converted customers, closed leads.
2. **Customer Enquiries:** Full search (by name, mobile, reference number, city), status filters, private internal notes, and direct **Export to CSV**.
3. **Solar Package Catalogue:** Change prices, edit capacities, update component specs and warranties, toggle packages active/disabled.
4. **Business & Subsidy Settings:** Update business phone, email, WhatsApp number, office address, and official subsidy guidelines.

---

## 📧 Email Provider Setup (Optional Live Relay)

To dispatch real outbound emails to your company inbox whenever a customer submits an enquiry:

1. Obtain SMTP credentials from your email host (e.g. Hostinger, Zoho, Gmail App Password, Google Workspace, or AWS SES).
2. Set them in your `.env` file:
   ```env
   SMTP_HOST=smtp.gmail.com
   SMTP_PORT=587
   SMTP_USER=yourbusiness@gmail.com
   SMTP_PASS=your-16-character-app-password
   SMTP_FROM=yourbusiness@gmail.com
   ```
3. Restart the server. If SMTP is omitted, enquiries are safely recorded in SQLite and notifications are logged to `server/logs/email_notifications.log`.

---

## 📱 WhatsApp Configuration

Update your official business WhatsApp number either in:
1. `.env` via `WHATSAPP_NUMBER=91XXXXXXXXXX` (with country code, digits only)
2. Or directly in **Admin Console → Business & Subsidy Settings → WhatsApp Business Number**.

All click-to-chat links and post-quotation handoffs immediately use your configured number.

---

## 🌐 Production Build & Deployment

To build the client assets:
```bash
npm run build
```

This compiles optimized, minified assets into `client/dist/`. The Express backend automatically detects and serves this directory in production mode.
