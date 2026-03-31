# Configure the Database

## Overview

The Rails app exists. Now prove the database layer actually works — end to end, from PostgreSQL running on your machine down to ActiveRecord returning a query result. This scenario is about verification and understanding, not just running commands. Before you add any models or migrations, you need to trust that the vault is open and the teller window is working.

## What you should build

- [ ] Verify PostgreSQL is running and accessible using `pg_isready`
- [ ] Confirm `config/database.yml` uses `DATABASE_URL` for all three environments — development, test, and production
- [ ] Confirm `.env` exists at the project root with a `DATABASE_URL` pointing to a local PostgreSQL instance
- [ ] Confirm `.env` is listed in `.gitignore`
- [ ] Run `rails db:create` to create the development and test databases (or confirm they already exist)
- [ ] Open `rails console` and run `ActiveRecord::Base.connection.execute("SELECT 1")` to verify Rails can reach the database
- [ ] Read `db/schema.rb` and confirm it exists — even a freshly created database produces a schema file

## Constraints

- The `DATABASE_URL` in `.env` must point to a PostgreSQL database, not SQLite
- Do not hardcode hostnames, usernames, or passwords in `database.yml` — all connection config must go through `DATABASE_URL`
- Do not add any models or migrations yet — this scenario ends with an empty but connected database
- Do not use `rails db:setup` — use `rails db:create` so each step is explicit
