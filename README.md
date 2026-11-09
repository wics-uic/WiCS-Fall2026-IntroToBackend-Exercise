# Astro.js + Tailwind CSS Project

A super simple, modern Astro.js project styled with Tailwind CSS, featuring a modular card component and a contact form.

---

## 🚀 Features

- **Astro.js (Static Site Generator)**: Super fast, lightweight, and modern.
- **Tailwind CSS**: Utility-first CSS configured via `@astrojs/tailwind`.
- **Modular Component (`src/components/Card.astro`)**:
  - Reusable card component in a separate file.
  - Takes `name`, `image`, and `description` props with responsive styling.
- **Contact Me (`src/components/ContactMe.astro`)**:
  - Clean contact form with text fields for **Name**, **Email**, and **Message**.
  - Interactive submission feedback.

---

## 📁 Project Structure

```
├── astro.config.mjs          # Astro configuration with Tailwind integration
├── tailwind.config.mjs       # Tailwind CSS configuration
├── package.json              # Project scripts and dependencies
├── public/
│   └── favicon.svg           # Favicon asset
└── src/
    ├── components/
    │   ├── Card.astro        # Reusable component (Name, Image, Description)
    │   └── ContactMe.astro   # Contact form component (Name, Email, Message)
    ├── layouts/
    │   └── Layout.astro      # Base HTML page layout
    └── pages/
        └── index.astro       # Main page
```

---

## 🛠️ Getting Started

### 1. Start Development Server
```bash
npm run dev
```
Open your browser at `http://localhost:4321`.

### 2. Build for Production
```bash
npm run build
```
Generates the static production build into the `dist/` directory.

### 3. Preview Production Build
```bash
npm run preview
```

### 4. Test Contact Form Backend
```bash
npm run test:post
```

---

## 📝 Setting Up Google Sheets + Google Apps Script

To connect the contact form to your Google Sheet:

1. Open your Google Sheet: [Google Sheet Link](https://docs.google.com/spreadsheets/d/1awWmrG0uorAElDOYJhYngkWziymaFej8cQhmMfBYCIo/edit?gid=1549311547#gid=1549311547).
2. Go to **Extensions** > **Apps Script**.
3. Copy all code from `google-apps-script.js` into `Code.gs` and save (Cmd+S / Ctrl+S).
4. Click **Deploy** > **New deployment**.
5. Click the gear icon next to "Select type" and select **Web app**.
6. Set:
   - **Execute as:** `Me`
   - **Who has access:** `Anyone` *(Crucial: Do not select "Only myself" or domain-restricted)*
7. Click **Deploy**, review and grant permissions.
8. Copy the **Web app URL** (ending in `/exec`).
9. Update `CONTACT_SCRIPT_URL` in `.env` with this new URL.
10. Run `npm run test:post` to verify that a row is successfully appended!
