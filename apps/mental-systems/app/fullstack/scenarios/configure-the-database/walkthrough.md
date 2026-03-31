# Walkthrough: Configure the Database

## How to Approach This

### The Core Insight

Most database configuration errors are not code errors — they're topology errors. The developer assumes PostgreSQL is running when it isn't. They assume `DATABASE_URL` is set when it isn't. They assume `rails db:create` succeeded when it printed an error they scrolled past.

The habit this scenario builds: always verify each layer before assuming the next one works. PostgreSQL running → Rails can connect → databases exist → ActiveRecord returns results. These are four separate things, and skipping the verification of any one of them turns a two-minute fix into a twenty-minute debugging session.

### The Mental Model

Picture the bank vault from the [Database Fundamentals guide](/fundamentals/postgresql-and-activerecord). The vault (PostgreSQL) is a separate building from the teller counter (ActiveRecord/Rails). Between them runs a pneumatic tube system (the database connection). Before you can transact business:

1. The vault has to be open (PostgreSQL process is running)
2. The pneumatic tube has to be connected (connection string in `DATABASE_URL` is correct)
3. Your account has to exist (the database was created with `rails db:create`)
4. The teller has to be able to receive and send tubes (ActiveRecord can execute queries)

You can't verify step 4 without first verifying steps 1-3. Each check eliminates a layer of uncertainty.

### How to Decompose This

Before running any commands, ask yourself:

1. **Is the vault open?** — Is PostgreSQL actually running on my machine right now?
2. **Is the address correct?** — Does `DATABASE_URL` in `.env` point to the right host and database name?
3. **Does the account exist?** — Have the development and test databases been created?

---

## Building It

### Step 1: Verify PostgreSQL is running

The teller counter doesn't know whether the vault is open. Rails will only tell you "connection refused" — it can't tell you *why*. Checking PostgreSQL's status before you try to connect saves you from diagnosing a Rails configuration problem that is actually a process management problem.

`pg_isready` is a PostgreSQL utility that checks whether the server is accepting connections. It's faster and clearer than running `rails server` and waiting for a connection error.

> From the [Database Fundamentals guide](/fundamentals/postgresql-and-activerecord): "PostgreSQL and your Rails app are separate processes. PostgreSQL must be running before Rails can connect. If `rails server` starts but every request returns a `PG::ConnectionBad` error, it means the vault is closed — PostgreSQL isn't running, not that your code is wrong."

```bash
pg_isready
```

Expected output:
```
/tmp:5432 - accepting connections
```

If you see `no response` or `connection refused`:

```bash
# Mac
brew services start postgresql@16

# Linux
sudo service postgresql start
```

Run `pg_isready` again before proceeding.

---

### Step 2: Confirm `database.yml` and `.env`

The pneumatic tube system is only as reliable as the address written on the tube. Open both files and verify the configuration is complete before Rails tries to use it.

Think of this like a chef reading a recipe before cooking — not during. You want to catch the error before you're standing at a hot stove wondering why nothing is working.

> From the [Database Fundamentals guide](/fundamentals/postgresql-and-activerecord): "Use `DATABASE_URL` as the single connection string instead of individual `host`, `username`, `password` fields in `database.yml`. A single environment variable is easier to manage in deployment than four separate ones."

`config/database.yml` should look like this:

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

`.env` at the project root:

```
DATABASE_URL=postgres://localhost/chess_learning_development
```

Verify `.env` is ignored by git:

```bash
grep ".env" .gitignore
```

If `.env` doesn't appear in the output, add it. Committing `.env` exposes your database credentials to anyone with repository access.

---

### Step 3: Create the databases

The vault doesn't have an account for "chess_learning_development" until you create one. `rails db:create` sends the `CREATE DATABASE` instruction to PostgreSQL for each environment's configured database name.

This is like the bank's new accounts department — the vault exists, your connection to it works, but your specific account doesn't exist until someone creates it. No account means every subsequent transaction fails, even though nothing else is wrong.

> From the [Database Fundamentals guide](/fundamentals/postgresql-and-activerecord): "`rails db:create` creates the actual databases. These are PostgreSQL databases on your machine, and they need to be provisioned before Rails can write to them."

```bash
rails db:create
```

Expected output:
```
Created database 'chess_learning_development'
Created database 'chess_learning_test'
```

If the databases already exist from a previous run, you'll see:
```
Database 'chess_learning_development' already exists
Database 'chess_learning_test' already exists
```

Both are success states. If you see any `PG::` errors here, go back to Step 1 — something in the connection layer isn't right.

---

### Step 4: Verify ActiveRecord with `rails console`

All three layers check out on paper. Now verify they work together by sending an actual query through the full stack: Rails → ActiveRecord → pg gem → PostgreSQL → result.

The console is the most direct way to test this. You're not going through HTTP, routing, or controllers — just the database layer in isolation. If this works, the foundation is solid.

> From the [Database Fundamentals guide](/fundamentals/postgresql-and-activerecord): "The Rails console is a direct window into the vault — you're talking to the same database your app uses, with the full ActiveRecord layer available. It's faster than writing a controller action to test a query."

```bash
rails console
```

Inside the console, run a raw SQL query through ActiveRecord:

```ruby
ActiveRecord::Base.connection.execute("SELECT 1 AS connected")
# => #<PG::Result:... status=PGRES_TUPLES_OK>
```

Any result object (not an exception) means the full stack is working. Now check `schema.rb` exists:

```ruby
puts File.read(Rails.root.join("db/schema.rb"))
```

You should see the auto-generated schema header — even a freshly created database produces this file:

```ruby
# This file is auto-generated from the current state of the database. Instead
# of editing this file, please use the migrations feature of Active Record to
# incrementally modify your database, and then regenerate this schema definition.
ActiveRecord::Schema[7.1].define(version: 0) do
end
```

Exit the console with `exit`.

> From the [Database Fundamentals guide](/fundamentals/postgresql-and-activerecord): "`db/schema.rb` is the authoritative record of your current table structure. Never edit it by hand. When something looks wrong — unexpected column, missing table — read `schema.rb` first."

---

:::evaluator
Before checking your work: `database.yml` uses `ENV.fetch('DATABASE_URL', 'postgres://localhost/chess_learning_development')` with a fallback for development, but `ENV['DATABASE_URL']` with no fallback for production. Walk through what happens in each environment when `DATABASE_URL` is not set — and explain why production *should* fail hard in that case.
:::

---

## Common Mistakes

### 1. Assuming `pg_isready` success means the Rails connection will work

**What goes wrong:** `pg_isready` checks whether PostgreSQL is accepting connections at all — it doesn't check whether the specific database name or user in `DATABASE_URL` is valid. You can get a green `pg_isready` but still hit `PG::ConnectionBad` if the host or database name in `DATABASE_URL` is wrong.

**Why it's tempting:** "PostgreSQL is running" feels like the same thing as "my database connection works." They're different checks.

**How to fix it:** `pg_isready` is just the first gate. The real verification is `rails console` with `ActiveRecord::Base.connection.execute("SELECT 1")`.

### 2. Setting `DATABASE_URL` in the shell instead of `.env`

**What goes wrong:** You export `DATABASE_URL` in your terminal session (`export DATABASE_URL=...`). It works now. When you close the terminal, it's gone. Teammates who clone the repo have no idea it was ever needed. `rails server` in a new session silently falls back to defaults or crashes.

**Why it's tempting:** Exporting an env var in the terminal is fast and feels equivalent to setting it properly. The app works, so you move on.

**How to fix it:** Put `DATABASE_URL` in `.env`. The `dotenv-rails` gem (already in the Gemfile in development mode) loads `.env` automatically. Shell exports are for one-off overrides, not configuration.

### 3. Not checking `.gitignore` before the first commit

**What goes wrong:** `.env` gets committed with your local database URL. If you later switch to a shared development database or add a password, that credential is now in git history permanently — even if you delete the file in a later commit.

**Why it's tempting:** You ran `rails new` and trust that Rails set up `.gitignore` correctly. It does include `.env`, but it's worth verifying before your first `git push`.

**How to fix it:** Run `grep ".env" .gitignore` before committing. If it's missing, add `.env` to `.gitignore` immediately.

### 4. Skipping `rails db:create` because the schema looks right

**What goes wrong:** You open `db/schema.rb`, it looks correct, and you assume the database exists. `schema.rb` is a Ruby file in your repository — it exists whether or not the corresponding PostgreSQL database does. The first time you run a query, you get `ActiveRecord::NoDatabaseError`.

**Why it's tempting:** `schema.rb` looks like the database. It describes the database. But it's just a description — the database itself is a live PostgreSQL process managing files you can't see directly.

**How to fix it:** Always run `rails db:create && rails db:migrate` in fresh environments. Use `rails console` to confirm the connection before trusting that the database is ready.
