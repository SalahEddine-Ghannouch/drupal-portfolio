# Supabase backoffice setup

The portfolio remains a static site. Supabase stores the EN/FR text and public
links; the backoffice uses Supabase Auth and can be deployed alongside the site
at `/admin/`.

## 1. Create the database tables and policies

In the SQL Editor, run the schema migrations in filename order:

1. [`20261128000000_portfolio_content.sql`](../supabase/migrations/20261128000000_portfolio_content.sql)
2. [`20261129000000_portfolio_items.sql`](../supabase/migrations/20261129000000_portfolio_items.sql)

They allow visitors to read public portfolio text and published entries, and
limit all content writes to explicitly allowlisted Auth users.

## 2. Enable MFA and create an administrator

1. In **Authentication → Multi-Factor Authentication**, enable the TOTP
   authenticator factor and its enrollment/verification APIs.
2. In **Authentication → Users**, create an administrator user with a strong
   password. Do not enable public sign-ups.
3. Copy that user's UUID and run this query in the SQL Editor:

   ```sql
   insert into public.portfolio_admins (user_id)
   values ('AUTH_USER_UUID');
   ```

Only allowlisted accounts can edit portfolio content. The third migration
requires an `aal2` MFA session for administrator access to content and entries;
the public visitor policies remain available. Never put a Supabase
`service_role` key in this static project.

## 3. Configure the public project key

Edit [`js/supabase-config.js`](../js/supabase-config.js) with the Project URL
and the project's **publishable/anon key**:

```js
window.SUPABASE_CONFIG = {
  url: 'https://your-project.supabase.co',
  anonKey: 'your-public-anon-key',
};
```

The public key is intended for browser use; row-level security is what protects
write access. If the project URL/key are not configured, the portfolio uses
its local EN/FR translations.

## 4. Publish the initial content

Serve the site over HTTP (for example `python -m http.server 8000`), open
`/admin/`, sign in, and press **Save all changes**. This publishes the existing
local EN/FR translations as the initial database content. Later edits become
public as soon as they are saved.

On the first authorized sign-in, `/admin/` asks you to enroll an authenticator
app and verify a six-digit code. Later sign-ins require a fresh code. Keep access
to the authenticator; without it, the account cannot pass the database MFA
policies. Enroll a separate backup administrator account before relying on MFA
for your only account.

The editor covers portfolio text, contact details, and SEO text. Its entries
manager can add, edit, publish/unpublish, reorder, and delete projects,
expertise items, experience, open-source modules, certifications, and
testimonials.

**Reset text to defaults** restores the built-in English and French portfolio
copy in the editor; it does not change portfolio entries and does not save until
you press **Save all changes**.

The local EN/FR content remains as a fallback if Supabase is unavailable.
Cloudflare Pages reads the root [`_headers`](../_headers) file to apply the
backoffice's Content Security Policy, anti-framing, no-referrer, and HTTPS
security headers. Keep that file in the deployed output directory. Its
connection policy assumes the standard `*.supabase.co` project URL.

## 5. Enforce MFA in the database

After deploying the updated backoffice and successfully enrolling the
administrator's TOTP factor, run
[`20261130000000_portfolio_admin_mfa.sql`](../supabase/migrations/20261130000000_portfolio_admin_mfa.sql).
This adds restrictive RLS policies requiring an `aal2` session for
administrator content and entry access. The public visitor policies and
non-administrator access to published items remain unchanged.

## Session and visitor security

The backoffice signs out after **30 minutes without activity** (including
scrolling and keyboard/mouse interaction). This is a client-side idle timer;
Supabase's usual one-hour access token is refreshed automatically and does not
by itself sign out an active user. For server-enforced inactivity limits, also
configure the Auth session limits in the project dashboard.

The visitor page uses a public browser key to read content. That key is
expected to be visible on a static site; the database policies, not secrecy of
the key, prevent unauthorized writes. Supabase policies return only published
entries.
The `/admin/` URL and login form are public by design; `noindex` is not an
access control. Supabase Auth, the admin allowlist, MFA, and restrictive RLS
policies enforce access. The backoffice shows generic sign-in errors and keeps
detailed provider errors in the browser console.

The local static portfolio content is intentionally retained as a fallback.
Because static files are public, their entry data may still appear if Supabase
is unavailable, even when a corresponding database entry is unpublished. Do
not put confidential content in the static fallback.
