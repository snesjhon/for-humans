# Walkthrough: Set Up the Rails API

## How to Approach This

### The Core Insight

`rails new` is not a blank-slate command — it's an opinionated generator. The flags you pass shape the entire project structure. The mistake most beginners make is running `rails new chess-learning` and only noticing later that they got a full-stack app with view templates, session middleware, and an asset pipeline they'll never use. By then, the cleanup is messier than starting over.

The second common mistake is in `database.yml`: filling in actual credentials where Rails expects environment variable references. It looks like "just simplifying the config," but it means your next `git push` ships passwords to GitHub.

Get both of these right on the first run and you'll never need to touch them again.

### The Mental Model

Imagine you're ordering a prefab kitchen for a restaurant. You don't design it from scratch — you pick from a catalog: full commercial kitchen (for a restaurant that cooks everything in-house) or a prep-only kitchen (for a restaurant that plates delivered food). You also pick the refrigerator model.

If you pick the wrong kitchen type, you don't renovate — you order a new one. The contractor doesn't patch a commercial kitchen into a prep kitchen after installation. Same with `rails new`: the `--api` flag changes which Rack middleware layers get installed, which base class your controllers inherit from, and which generators are available. You can add things back afterward, but it's never clean. Pick the right kitchen type on day one.

This maps directly to the [Project Anatomy fundamentals guide](/fundamentals/rails-new): the `--api` flag is the single decision that determines which "kitchen stations" exist when the contractor hands you the keys.

### How to Decompose This

Before running any commands, ask yourself:

1. **What kind of app am I building?** — A JSON API with no HTML views. That means `--api` mode.
2. **What database will I use?** — PostgreSQL. That means `-d postgresql`.
3. **How will my database credentials be managed?** — Via a `DATABASE_URL` environment variable, not hardcoded in any file.

---

## Building It

### Step 1: Generate the Rails app

When a contractor builds a kitchen, they need two things before breaking ground: the building type and the equipment list. For Rails, those are the `--api` flag (API mode, no browser-facing layers) and `-d postgresql` (the database adapter).

One flag left out changes the whole build. Without `--api`, your `ApplicationController` inherits from `ActionController::Base` instead of `ActionController::API` — and you get session middleware, cookie support, and view layer configuration in a project that will never render HTML. Without `-d postgresql`, you get SQLite wired in by default, and changing the adapter after the fact means editing `Gemfile`, `database.yml`, and running migrations to verify nothing broke.

> From the [Project Anatomy guide](/fundamentals/rails-new): "Pass the flags before the first `bundle install` fires. Rails generates different files depending on `--api`. If you forget it, you'll find view-related middleware and generators in a project that doesn't need them — and removing them manually is fiddly."

Run this exactly:

```bash
rails new chess-learning --api -d postgresql
cd chess-learning
```

You should see Rails generate a directory tree and then run `bundle install` automatically. The result: an `app/` folder with only `controllers/`, `models/`, `jobs/`, `mailers/`, and `channels/` — no `views/`, no `assets/`, no `helpers/`.

---

### Step 2: Configure `database.yml` for `DATABASE_URL`

Open `config/database.yml`. Rails generates it with `username`, `password`, and `database` fields for the development environment. Your job is to replace that structure with a single `url:` key that reads from `DATABASE_URL` for every environment.

Think of `database.yml` as the restaurant's vendor contact list — it tells the kitchen how to reach the supplier. You don't write the supplier's phone number directly on the contact card; you write "call the number posted on the bulletin board" (`ENV['DATABASE_URL']`). The bulletin board (your `.env` file or deployment config) holds the actual value. That way, swapping suppliers (databases) means updating the bulletin board, not the contact card — and the contact card is safe to share.

> From the [Project Anatomy guide](/fundamentals/rails-new): "`config/database.yml` is committed to git. It should never contain passwords. Rails generates it with `ENV` variable references for a reason — lean on that."

Replace the contents of `config/database.yml` with:

```yaml
default: &default
  adapter: postgresql
  encoding: unicode
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

The `ENV.fetch` with a fallback in development means the app works locally without a `.env` file if PostgreSQL is running with default settings. Production reads `DATABASE_URL` directly — no fallback, because an unconfigured production database should fail loudly.

---

### Step 3: Set up `.env` and `.gitignore`

Your local `DATABASE_URL` needs to live somewhere. That somewhere is `.env` — a file that never gets committed.

This is the bulletin board from the last step. It holds the real supplier phone number. If it ends up in git, anyone who can read the repo can connect to your database.

> From the [Project Anatomy guide](/fundamentals/rails-new): "Use `DATABASE_URL` as a single env var. Set it in `.env` locally (and add `.env` to `.gitignore`). Never write passwords into any file that gets committed."

Create `.env` at the project root:

```bash
DATABASE_URL=postgres://localhost/chess_learning_development
```

Then confirm `.gitignore` already includes `.env`. Rails generates a `.gitignore` with it listed — verify it's there:

```bash
grep ".env" .gitignore
```

You should see `.env` in the output. If not, add it manually.

---

### Step 4: Create the databases and start the server

The `rails new` command generates configuration — it doesn't create the actual databases. Those are PostgreSQL databases on your machine, and they need to be provisioned before Rails can write to them.

Running `rails db:create` is like turning the key after the contractor finishes. The kitchen is built. The kitchen is configured. Now you unlock it and make sure the power is on before the chef arrives.

```bash
rails db:create
```

Expected output:
```
Created database 'chess_learning_development'
Created database 'chess_learning_test'
```

If you see `PG::ConnectionBad: could not connect to server`, PostgreSQL isn't running. On Mac: `brew services start postgresql@16`. On Linux: `sudo service postgresql start`. Then retry.

Now start the server:

```bash
rails server
```

Open a browser or run `curl http://localhost:3000`. You should see the Rails default welcome JSON or a 404 — either confirms the server is running and responding. An empty 404 from a running Rails server is success: it means routing is working, there are just no routes defined yet.

> From the [Project Anatomy guide](/fundamentals/rails-new): "A model that isn't in `app/models/` won't autoload. A migration that isn't in `db/migrate/` won't run. Knowing the layout means you spend zero time guessing where things go."

---

:::evaluator
Before checking your work: your `database.yml` uses `ENV.fetch('DATABASE_URL', ...)` with a fallback for development, but `ENV['DATABASE_URL']` without a fallback for production. Why does production need a hard failure when the env var is missing, while development is allowed to fall back to a default?
:::

---

## Common Mistakes

### 1. Forgetting `--api` and getting a full-stack app

**What goes wrong:** `ApplicationController` inherits from `ActionController::Base`. View generators run. You have a `config/initializers/assets.rb` file in a project that will never serve HTML.

**Why it's tempting:** You're focused on the `-d postgresql` flag. The API flag doesn't feel like it matters until something breaks later.

**How to fix it:** Delete the directory and regenerate. Don't try to excise the view layer from a full-stack app — it's faster to start over.

### 2. Writing PostgreSQL credentials directly into `database.yml`

**What goes wrong:** The password ships to GitHub on the next `git push`. If anyone has read access to the repo, they have database access.

**Why it's tempting:** Rails generates `database.yml` with individual fields (`username`, `password`, `host`). Filling them in feels like completing the form.

**How to fix it:** Replace all per-field credentials with a single `url:` key pointing to `DATABASE_URL`. Store the actual URL in `.env` (which is `.gitignore`d).

### 3. Running `rails db:create` before PostgreSQL is running

**What goes wrong:** `PG::ConnectionBad: could not connect to server: Connection refused`. The databases don't get created.

**Why it's tempting:** The next step after `rails new` obviously involves the database. The PostgreSQL service being a separate process isn't visible in the setup instructions.

**How to fix it:** Start PostgreSQL first. On Mac: `brew services start postgresql@16`. Then re-run `rails db:create`.

### 4. Naming the app with spaces or uppercase

**What goes wrong:** `rails new Chess Learning` treats `Learning` as a second argument and either errors or generates a broken directory structure.

**Why it's tempting:** The app is "Chess Learning" — that's its name. Feels natural to pass it as-is.

**How to fix it:** Use lowercase kebab-case: `chess-learning`. Rails converts the hyphen to an underscore for the Ruby module name (`ChessLearning`).
