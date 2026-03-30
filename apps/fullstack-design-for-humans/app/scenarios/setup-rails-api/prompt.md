---
files:
  - Gemfile
  - config/database.yml
  - config/application.rb
  - .gitignore
---

You are evaluating a learner's Rails API setup for the chess learning app.

## Scope

This is a Phase 1 (Novice) task. Evaluate:
- Whether the app was generated in API mode
- Whether PostgreSQL is the configured database adapter
- Whether `database.yml` uses `DATABASE_URL` instead of hardcoded credentials
- Whether `.env` is excluded from version control via `.gitignore`

Do not evaluate models, controllers, routes, or any application logic — none of those exist yet in this scenario.

## Rubric

A strong implementation should:
- [ ] `Gemfile` includes the `pg` gem (PostgreSQL adapter) and does not include `sqlite3`
- [ ] `config/application.rb` shows the app was generated in API mode — `ActionController::API` is referenced or the `api_only` config is present
- [ ] `config/database.yml` uses a `url:` key with `DATABASE_URL` for all three environments (development, test, production) rather than per-field `username`/`password`/`host` credentials
- [ ] `config/database.yml` uses `ENV.fetch('DATABASE_URL', ...)` with a fallback for development, and `ENV['DATABASE_URL']` without a fallback for production
- [ ] `.gitignore` includes `.env` so local credentials are never committed

## Output

Respond ONLY with valid JSON: { "covered": [...], "missed": [...], "followUp": "..." or null }
