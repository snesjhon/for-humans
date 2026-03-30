# Set Up the Rails API

## Overview

This is the foundation of the chess app — the moment before any models, controllers, or business logic exists. You'll generate a Rails API application configured for PostgreSQL, wire up the database connection, and confirm the server starts. Everything else in this course gets built on top of what you create here.

## What you should build

- [ ] Run `rails new` with the correct flags to generate an API-only Rails app named `chess-learning` using PostgreSQL
- [ ] Configure `config/database.yml` to use a `DATABASE_URL` environment variable for all environments
- [ ] Create a `.env` file at the project root with a local `DATABASE_URL` pointing to a PostgreSQL database
- [ ] Add `.env` to `.gitignore` so credentials are never committed
- [ ] Run `rails db:create` to create the development and test databases
- [ ] Start the server with `rails server` and confirm it responds on port 3000

## Constraints

- The app must be generated in **API mode** — do not use a full-stack generator
- The database adapter must be **PostgreSQL** — do not use SQLite
- `database.yml` must use `DATABASE_URL` as the connection string for all three environments (development, test, production) — do not hardcode hostnames, usernames, or passwords in the file
- Do not add any models, controllers, or routes — this scenario ends with a bare, running server
- The app directory must be named `chess-learning`
