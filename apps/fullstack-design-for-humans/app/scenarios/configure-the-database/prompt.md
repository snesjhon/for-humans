---
files:
  - config/database.yml
  - db/schema.rb
  - .gitignore
---

You are evaluating a learner's database configuration for the chess learning app.

## Scope

This is a Phase 1 (Novice) task. Evaluate:
- Whether `database.yml` is correctly configured to use `DATABASE_URL` for all environments
- Whether the schema file exists, confirming the databases were created
- Whether `.env` is excluded from version control

Do not evaluate models, migrations, controllers, or application logic — none of those exist in this scenario. Do not evaluate whether PostgreSQL is running (you cannot observe that from static files).

## Rubric

A strong implementation should:
- [ ] `config/database.yml` uses a `url:` key with `DATABASE_URL` for all three environments (development, test, production) — no per-field `username`/`password`/`host` credentials
- [ ] `config/database.yml` uses `ENV.fetch('DATABASE_URL', ...)` with a fallback for development and `ENV['DATABASE_URL']` without a fallback for production, demonstrating understanding that a missing production database URL should fail loudly
- [ ] `db/schema.rb` exists and contains the auto-generated header, confirming `rails db:create` was run and ActiveRecord can connect
- [ ] `.gitignore` includes `.env` so local credentials are never committed to the repository
- [ ] `config/database.yml` specifies `adapter: postgresql` — not sqlite3 or any other adapter

## Output

Respond ONLY with valid JSON: { "covered": [...], "missed": [...], "followUp": "..." or null }
