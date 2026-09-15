# Swati Studio

GitHub Pages frontend connected to Supabase Auth and the `projects` table.

## Upload
Upload the contents of this folder to the root of your GitHub repository. Do not upload the outer folder itself if GitHub Pages cannot find `index.html`.

## Supabase
Run `SUPABASE-SETUP.sql` once in Supabase SQL Editor. The frontend uses the Supabase project URL and publishable key in `assets/app.js`.

## Important
This build includes real email/password login, registration, session display, admin-role gate, and project metadata saving. It does **not** render a real AI face/voice video; that requires a separately approved rendering backend/API.
