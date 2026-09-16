# Swati Studio — Full A–Z Build

This package is the complete application scaffold for the next integration phase.
It includes public pages, authentication pages, user dashboard, admin dashboard,
role modules, CMS modules, services, projects, wallet, payments, notifications,
support, audit logs, trash/restore, and Supabase setup SQL.

## Setup
1. Configure Supabase values in `config/env.example.js`.
2. Run `SUPABASE-SETUP.sql` in Supabase SQL Editor.
3. Add the Supabase browser client library or connect your preferred bundler.
4. Configure AI and payment providers in `api/`.
5. Test Auth, RLS, CRUD, uploads, payments, and role permissions before production.
