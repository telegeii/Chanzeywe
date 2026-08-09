# Production Deployment Checklist

## 1. Server layout

The production document root needs the built frontend and the `api/` folder
side by side:

```
/var/www/chanzeywe/          <- Apache DocumentRoot
├── index.html                <- from `npm run build` (dist/)
├── assets/
├── .htaccess                  <- SPA routing, copied automatically from public/
├── robots.txt, sitemap.xml
└── api/                       <- copy of this repo's api/ folder, unchanged
```

Steps:
1. `npm run build` locally (or in CI) — produces `dist/`.
2. Upload the **contents** of `dist/` to the document root.
3. Upload the `api/` folder as-is into the same document root (so it sits at
   `api/` alongside `index.html`).
4. Upload `database/schema.sql` and run it once against a fresh production
   database (see §3).

Apache needs `mod_rewrite` enabled and `AllowOverride All` (or at least
`FileInfo + Indexes`) on that vhost/directory so the `.htaccess` files take
effect — without it, direct links to client-side routes (e.g.
`/admission-letter`) will 404 on refresh, and the `.env`/`vendor`/`lib`
protections won't apply.

## 2. Environment config (`api/config/.env`)

Copy `api/config/.env.example` to `api/config/.env` on the server and fill in:

| Variable | Production value |
|---|---|
| `APP_ENV` | leave unset (defaults to hiding PHP errors from clients) |
| `DB_HOST`, `DB_NAME`, `DB_USER`, `DB_PASS` | real production DB credentials |
| `SITE_URL` | the real domain, e.g. `https://www.chanzeywetvc.ac.ke` |
| `SMTP_HOST`/`SMTP_PORT`/`SMTP_ENCRYPTION`/`SMTP_USERNAME`/`SMTP_PASSWORD`/`SMTP_FROM_EMAIL`/`SMTP_FROM_NAME` | real mailbox credentials (see the setup steps already documented in `.env.example`) |

`.env` is git-ignored — it must be created directly on the server, never
committed.

## 3. Database

1. Create the production database and run `database/schema.sql` against it
   (creates all tables, indexes, and the seeded super-admin account).
2. **Immediately log in as `admin` / `Chanzeywe@2026` and change the
   password** from the Account panel — this default is in the committed
   schema and must not survive into production.
3. Take a backup before any future schema change; the `database/migrate_*.sql`
   files are safe to re-run (all use `IF NOT EXISTS` guards) if you're
   upgrading an existing install instead of starting fresh.

## 4. File permissions

`api/uploads/*` subdirectories must be writable by the PHP process (the web
server user, e.g. `www-data`). Everything else can be read-only.

## 5. HTTPS

Serve the site over HTTPS. The admin session cookie already sets `Secure`
automatically once the request arrives over HTTPS (see `start_session()` in
`api/config/session.php`), so no code change is needed — just terminate TLS
at the server/load balancer.

## 6. Already handled — no action needed

These were verified/hardened during the production-readiness pass and don't
need any deployment-time action:
- Every mutating admin endpoint is gated by `require_permission`/`require_admin`;
  the public endpoints (application submission, admission-letter lookup) are
  intentionally open and rate-limit-worthy but not a code gap.
- `.htaccess` files deny direct access to `api/config/` (protects `.env`),
  `api/lib/`, `api/vendor/`, and the personal-data upload folders
  (`api/uploads/applications/`, `api/uploads/offer_letters/`).
- Uploaded files are validated by both extension whitelist and real
  content-sniffing (`getimagesize()` for images, magic-byte MIME check for
  PDFs) — a renamed/disguised file is rejected, not just filtered by name.
- PHP errors are hidden from API responses by default (logged server-side
  instead) unless `APP_ENV=development` is explicitly set.
- No CORS headers are set — frontend and API are same-origin by design, so
  none are needed as long as both are deployed under the same domain per §1.

## 7. Post-deploy smoke test

- Load the homepage, a course/department page, and `/admission-letter`
  directly by URL (confirms the SPA rewrite works).
- Log in to `/admin`, confirm the dashboard loads and permissions look right.
- Submit a real test application, confirm the reference number and thank-you
  screen appear, then accept it as admin and confirm the offer-letter email
  arrives (proves SMTP credentials are correct).
