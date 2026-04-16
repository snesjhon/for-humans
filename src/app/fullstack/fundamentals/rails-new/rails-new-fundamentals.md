# Project Anatomy: What `rails new` Actually Does

## Overview

`rails new` is the single command that creates your entire application skeleton — every file, folder, and configuration that Rails needs to start working. Understanding what it generates (and why) means you'll know where things live when something breaks, and you'll stop guessing which file to open. For the chess app, this is the moment before anything exists: the one command that creates the container everything else gets poured into.

---

## Core Concept & Mental Model

Picture a restaurant kitchen before opening day. Before the chef cooks anything, someone laid out the entire kitchen: ovens in the cooking station, prep tables in the right spots, refrigeration in the back, the dishwasher near the door. Every station has a label. Every tool has a designated drawer.

`rails new` is the contractor who builds and fits out that kitchen. You don't choose where to put the refrigerator — the contractor does, because every kitchen follows the same layout. When a new cook starts at any restaurant built this way, they already know where to find the knives.

That's Rails conventions. The folder structure isn't arbitrary — it encodes the framework's assumptions about how web apps work: where models live, where controllers go, where configuration happens. Once you internalize the layout, you navigate any Rails app without a map.

---

## Building Blocks

### Level 1: The Command and What It Does

**Why this level matters**

You can't build anything until you've run `rails new`. But the flags you pass determine what kind of app you get. Using the wrong flags means backtracking through generated files. Get them right once.

**How to think about it**

`rails new` is like ordering a prefab kitchen. You pick the model (API-only vs full-stack), the refrigerator brand (database adapter), and any add-ons. The factory ships it fully assembled. You don't rewire it after delivery.

**Walking through it**

For the chess app, you want API mode with PostgreSQL:

```bash
rails new chess-learning --api -d postgresql
```

- `chess-learning` — the app name. Becomes the directory name and the module namespace.
- `--api` — API-only mode. Removes the view layer, session middleware, cookie support, and anything only needed for browser-based apps.
- `-d postgresql` — sets PostgreSQL as the database adapter in `Gemfile` and `config/database.yml` instead of the default SQLite.

**The one thing to get right**

Pass the flags before the first `bundle install` fires. Rails generates different files depending on `--api`. If you forget it, you'll find view-related middleware and generators in a project that doesn't need them — and removing them manually is fiddly.

**What it generates**

```
chess-learning/
  app/           ← your application code lives here
  config/        ← routing, database, environments, initializers
  db/            ← migrations and schema
  Gemfile        ← Ruby dependencies
  Rakefile       ← task runner entry point
  config.ru      ← Rack entry point (how the server boots)
```

---

### Level 2: What's Inside Each Directory

**Why this level matters**

Rails is convention over configuration. The magic only works if you put things in the right place. A model that isn't in `app/models/` won't autoload. A migration that isn't in `db/migrate/` won't run. Knowing the layout means you spend zero time guessing where things go.

**How to think about it**

Each directory in `app/` is a station in the kitchen. The `models/` station handles data. The `controllers/` station handles requests. The `jobs/` station handles background work. A new chef walks in and immediately knows which station handles which task — because every kitchen uses the same layout.

**Walking through it**

```
app/
  controllers/        ← handles HTTP requests, returns responses
    application_controller.rb
  models/             ← database-backed classes, validations, associations
  jobs/               ← background job classes (when you add ActiveJob)
  mailers/            ← email sending (rarely used in API mode)
  channels/           ← ActionCable WebSocket channels

config/
  routes.rb           ← URL → controller mapping
  database.yml        ← database connection settings per environment
  application.rb      ← app-level configuration
  environments/
    development.rb    ← dev-specific settings (verbose logging, etc.)
    production.rb     ← prod-specific settings (asset compression, etc.)
    test.rb           ← test-specific settings

db/
  migrate/            ← migration files (one per schema change)
  schema.rb           ← auto-generated snapshot of current schema

Gemfile               ← where you add new Ruby libraries
config.ru             ← Rack startup file (you rarely touch this)
```

**The one thing to get right**

`config/database.yml` is committed to git. It should never contain passwords. Rails generates it with `ENV` variable references for a reason — lean on that. The chess app will use `DATABASE_URL` for all environments.

**Annotated `database.yml` for the chess app:**

```yaml
default: &default
  adapter: postgresql
  encoding: unicode
  # DATABASE_URL overrides everything below when set
  url: <%= ENV['DATABASE_URL'] %>
  pool: <%= ENV.fetch("RAILS_MAX_THREADS") { 5 } %>

development:
  <<: *default
  url: <%= ENV.fetch('DATABASE_URL', 'postgres://localhost/chess_learning_development') %>

test:
  <<: *default
  url: <%= ENV.fetch('DATABASE_URL', 'postgres://localhost/chess_learning_test') %>

production:
  <<: *default
  url: <%= ENV['DATABASE_URL'] %>
```

---

### Level 3: Flags, What Gets Removed, and When Things Break

**Why this level matters**

API mode isn't just "Rails without HTML." It strips out specific Rack middleware and disables generators for views, assets, and sessions. Understanding what's gone explains why certain things won't work and why your app starts faster and uses less memory.

**How to think about it**

Standard Rails ships with a middleware stack — a chain of processing layers every HTTP request passes through. Session management, flash messages, cookie signing, CSRF protection, static file serving. For a browser app, you need all of that. For a JSON API, most of it is noise. `--api` removes the layers that assume a browser is on the other end.

**What `--api` removes:**

| Removed | Why it doesn't matter for the chess app |
|---|---|
| `ActionView` (templates, HTML rendering) | The app only renders JSON |
| `Sprockets` / asset pipeline | No CSS or JS to bundle |
| Session middleware | Stateless API — no sessions |
| Cookie store | Same as above |
| Flash messages | No views to display them in |
| Browser-security middleware (CSRF token) | No form submissions |

**What it keeps:**

- `ActionController::API` (the base class your controllers inherit from)
- Routing, parameter parsing, JSON rendering
- ActiveRecord, migrations, model layer — completely unchanged
- Background jobs, mailers (available but not wired by default)

**Common flag errors:**

```bash
# Wrong: generates SQLite by default
rails new chess-learning --api

# Wrong: generates full-stack app with views
rails new chess-learning -d postgresql

# Wrong: name with spaces breaks the module name
rails new chess learning --api -d postgresql

# Right
rails new chess-learning --api -d postgresql
```

**When `rails new` breaks:**

1. **`rails` command not found** — RubyGems doesn't have the `rails` gem. Run `gem install rails` first.
2. **PostgreSQL adapter error during bundle** — `libpq` headers aren't installed. On Mac: `brew install libpq`. On Linux: `apt install libpq-dev`.
3. **Permission errors on `bundle install`** — you're writing to a system Ruby. Use `rbenv` or `rvm` to manage a user-level Ruby version.
4. **`rails db:create` fails with "role does not exist"** — PostgreSQL doesn't have a user matching your system username. Create it: `createuser -s $(whoami)`.

---

## Key Patterns

### Pattern 1: API mode + PostgreSQL as the default starting point

**When to use it**

Every Rails backend for a separate frontend (React, mobile, another Rails app) should start in API mode. If you might add HTML views later, you can add the missing middleware back — but you can't remove it cleanly once it's woven in.

**How to think about it**

Start with the smallest kitchen that cooks what you need. You can add equipment later. You can't easily remove a station that got load-bearing.

```bash
rails new my-app --api -d postgresql
cd my-app
bundle install
rails db:create
rails server
```

### Pattern 2: `DATABASE_URL` over per-field credentials

**When to use it**

Always. Use `DATABASE_URL` as the single connection string instead of individual `host`, `username`, `password` fields in `database.yml`.

**How to think about it**

A single environment variable is easier to manage in deployment (Render, Heroku, Docker) than four separate ones. It's also harder to accidentally commit — a URL with credentials is obviously sensitive; individual fields look innocuous.

```yaml
# Single env var controls everything
url: <%= ENV['DATABASE_URL'] %>

# Versus the fragmented approach (avoid)
host: <%= ENV['DB_HOST'] %>
username: <%= ENV['DB_USER'] %>
password: <%= ENV['DB_PASSWORD'] %>
database: <%= ENV['DB_NAME'] %>
```

---

## Common Gotchas

### 1. Forgetting `--api` and generating a full-stack app

**What goes wrong:** You end up with view templates, asset pipeline configuration, and session middleware in a project that will never serve HTML. The generated `ApplicationController` inherits from `ActionController::Base` instead of `ActionController::API`.

**Why it's tempting:** `rails new chess-learning -d postgresql` looks right. The `-d` flag is the one you care about remembering.

**How to fix it:** Delete the directory and regenerate. It's faster than unpicking the generated files.

### 2. Hardcoding the database password in `database.yml`

**What goes wrong:** `git push` ships the password to GitHub. If it's a shared database, you've now exposed credentials publicly.

**Why it's tempting:** Rails generates a `database.yml` that has `username: <%= ENV['...'] %>` by default, which looks verbose. Filling in the actual value feels like simplifying.

**How to fix it:** Use `DATABASE_URL` as a single env var. Set it in `.env` locally (and add `.env` to `.gitignore`). Never write passwords into any file that gets committed.

### 3. Running `rails db:create` before PostgreSQL is running

**What goes wrong:** `PG::ConnectionBad: could not connect to server: Connection refused`.

**Why it's tempting:** You just ran `rails new` and the next obvious step is `rails db:create`. PostgreSQL being a separate process isn't obvious until it fails.

**How to fix it:** On Mac: `brew services start postgresql@16`. Then re-run `rails db:create`.

### 4. App name with spaces or uppercase

**What goes wrong:** `rails new Chess Learning` generates a module named `Chess` and treats `Learning` as a second argument. Rails either errors or generates in the wrong directory.

**Why it's tempting:** The app is called "Chess Learning App." Feels natural to name it that.

**How to fix it:** Use lowercase kebab-case: `rails new chess-learning`. Rails converts hyphens to underscores for the Ruby module name (`ChessLearning`).

### 5. Assuming `rails new` is idempotent

**What goes wrong:** Running `rails new chess-learning` a second time in the same directory prompts you to overwrite files. If you confirm, it can overwrite configuration you've already changed (like `database.yml`).

**Why it's tempting:** You want to change a flag after the fact. It seems like re-running the command would just update what's needed.

**How to fix it:** Delete the directory and start fresh. Rails generation isn't a patch operation.
