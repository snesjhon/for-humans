# Database Fundamentals: PostgreSQL and ActiveRecord

## Overview

Every player profile, every game record, every chess analysis in the app needs to persist somewhere. That somewhere is PostgreSQL — a database server running as a separate process, storing data in tables, and answering queries. ActiveRecord is the Ruby layer that talks to it: it translates method calls like `Player.find(42)` into SQL, maps rows to objects, and handles the connection. Before you build any model, you need to understand what these two pieces are, how they divide the work, and why the chess app uses PostgreSQL instead of the simpler SQLite default.

---

## Core Concept & Mental Model

Picture two ways to store cash. One way: a shoebox under your bed. It holds money. You can grab whatever you need. Works fine when you're the only one using it. Try to share it with three people who all need access at the same time and the shoebox becomes a problem — someone has to wait, and if two people reach in simultaneously, things get lost.

The other way: a bank vault. The bank assigns you an account number. Tellers (or ATMs) handle your requests one at a time, with guarantees that two transactions never corrupt each other. The vault doesn't care how many people are requesting at once — it serializes, queues, and protects.

SQLite is the shoebox. It's a flat file on disk. One connection at a time. No authentication. Perfect for development and testing, where only one process touches it. Broken in production, where your Rails server spawns multiple threads or processes that all need the database simultaneously.

PostgreSQL is the vault. It's a server process — separate from Rails, always running, networked, with its own user accounts and permissions. Rails connects to it over a socket. The chess app uses PostgreSQL everywhere — development included — so the behavior matches production before you deploy a single line of code.

ActiveRecord is the teller window. You tell it what you want in Ruby (`Player.where(rating: 1500..2000)`), and it translates your request into SQL, submits it to the vault, gets the result, and hands it back as Ruby objects. You rarely write SQL by hand. But understanding what SQL is being generated is the difference between a fast app and one that falls over at a hundred users.

---

## Building Blocks

### Level 1: What PostgreSQL and ActiveRecord Are

**Why this level matters**

Rails beginners often blur the line between the database and the ORM. They're two separate pieces of software with a clear boundary. Understanding that boundary explains every error message that starts with `PG::` (PostgreSQL layer) vs. every error that starts with `ActiveRecord::` (Ruby layer).

**How to think about it**

PostgreSQL is the vault itself — a long-running server process managing files on disk, handling connections, enforcing transactions. You interact with it via the `psql` client or through a connection pool.

ActiveRecord is the teller who speaks both languages: Ruby and SQL. When you call `Player.all`, ActiveRecord constructs `SELECT "players".* FROM "players"` and sends it to PostgreSQL. When PostgreSQL returns rows, ActiveRecord wraps each one in a `Player` object.

The Rails app never talks directly to the disk. It talks to ActiveRecord, which talks to PostgreSQL, which talks to the disk.

**Walking through it**

```
Rails app
   └─► ActiveRecord (Ruby gem, runs inside your app)
            └─► pg gem (C extension, translates to PostgreSQL's wire protocol)
                     └─► PostgreSQL server (separate process, port 5432)
                                └─► data files on disk
```

Start with three commands that confirm this stack is working:

```bash
# Is PostgreSQL running?
pg_isready

# Create the databases Rails will use
rails db:create

# Open a direct SQL connection (bypasses Rails entirely)
psql chess_learning_development
```

Inside `psql`, you're talking to PostgreSQL directly — no ActiveRecord layer. Any SQL you write here is what ActiveRecord generates on your behalf.

**The one thing to get right**

PostgreSQL and your Rails app are separate processes. PostgreSQL must be running before Rails can connect. If `rails server` starts but every request returns a `PG::ConnectionBad` error, it means the vault is closed — PostgreSQL isn't running, not that your code is wrong.

---

### Level 2: Tables, Rows, and How ActiveRecord Maps to Them

**Why this level matters**

ActiveRecord's "magic" — where a `Player` class just knows it has a `chess_username` attribute — only works because of a strict naming convention between your Ruby classes and your database tables. Once you see the convention, the magic disappears and you're left with something mechanical and predictable.

**How to think about it**

The vault doesn't store objects — it stores rows in tables. A table is a spreadsheet: columns at the top (the schema), rows underneath (the data). The bank keeps a separate spreadsheet for checking accounts, one for savings accounts, one for loans. Each spreadsheet has its own column layout.

ActiveRecord assumes: the `Player` model lives in `app/models/player.rb`, maps to a table called `players` (plural, snake_case), and each column in `players` becomes an attribute on the `Player` object. No configuration required — this is the convention.

**Walking through it**

A `players` table in PostgreSQL:

```
 id | chess_username | rating | created_at          | updated_at
----+----------------+--------+---------------------+--------------------
  1 | magnuscarlsen  |   2830 | 2024-01-01 12:00:00 | 2024-01-01 12:00:00
  2 | hikaru         |   2794 | 2024-01-02 09:00:00 | 2024-01-02 09:00:00
```

After running migrations to create this table, ActiveRecord gives you:

```ruby
player = Player.find(1)
player.chess_username  # => "magnuscarlsen"
player.rating          # => 2830
player.created_at      # => 2024-01-01 12:00:00 UTC
```

Rails didn't generate these methods — it read the column names from PostgreSQL at boot time and defined reader/writer methods for each one dynamically. Add a column via migration, restart the server, and the method appears.

The full mapping:

| Ruby | PostgreSQL |
|---|---|
| Class name (`Player`) | Table name (`players`) |
| Attribute (`chess_username`) | Column (`chess_username`) |
| Instance (`player = Player.find(1)`) | Row (`id = 1`) |
| `player.save` | `INSERT` or `UPDATE` |
| `Player.all` | `SELECT * FROM players` |
| `Player.find(42)` | `SELECT * FROM players WHERE id = 42 LIMIT 1` |

**The one thing to get right**

`db/schema.rb` is the authoritative record of your current table structure. It's auto-generated every time you run migrations. Never edit it by hand. When something looks wrong — unexpected column, missing table — read `schema.rb` first. It shows the vault's current layout.

```ruby
# From db/schema.rb after creating the players table:
create_table "players", force: :cascade do |t|
  t.string "chess_username", null: false
  t.integer "rating"
  t.datetime "created_at", null: false
  t.datetime "updated_at", null: false
  t.index ["chess_username"], name: "index_players_on_chess_username", unique: true
end
```

---

### Level 3: Connections, Concurrency, and When Things Break

**Why this level matters**

The shoebox vs. vault distinction matters most under load. Development feels fine with SQLite because only one process ever touches the database. Production Rails runs multiple threads — Puma spawns several workers, each potentially making simultaneous database requests. Without a real server like PostgreSQL and connection pooling, concurrent writes corrupt data or requests queue and time out.

**How to think about it**

The vault has a finite number of teller windows. Your Rails app maintains a pool of pre-opened connections — like a set of permanent teller windows that stay open so you don't pay the cost of opening a new connection on every request. `RAILS_MAX_THREADS` controls the pool size. If 10 requests arrive simultaneously and you only have 5 connections, 5 requests wait. If they wait too long, they time out.

**What SQLite gets wrong at scale:**

| Property | SQLite | PostgreSQL |
|---|---|---|
| Concurrency | One writer at a time | Many concurrent readers and writers |
| Location | File on disk, same server | Separate process, can be remote |
| Authentication | None | User accounts with passwords |
| Data types | Loosely typed | Strictly typed (enforced at insert) |
| Production readiness | No | Yes |

**Connection pooling in the chess app:**

```yaml
# config/database.yml
default: &default
  adapter: postgresql
  pool: <%= ENV.fetch("RAILS_MAX_THREADS") { 5 } %>
```

`RAILS_MAX_THREADS` defaults to 5. Each thread needs one connection. The pool holds that many pre-opened connections and reuses them. On Render or Heroku, you can set `RAILS_MAX_THREADS` as an env var to tune this.

**When things break and what the error means:**

```
PG::ConnectionBad: could not connect to server: Connection refused
```
→ PostgreSQL isn't running. Start it: `brew services start postgresql@16`

```
PG::UndefinedTable: ERROR: relation "players" does not exist
```
→ You haven't run the migration that creates the `players` table. Run: `rails db:migrate`

```
ActiveRecord::NoDatabaseError: We could not find your database
```
→ The database itself doesn't exist. Run: `rails db:create && rails db:migrate`

```
ActiveRecord::ConnectionTimeoutError: could not obtain a database connection within 5 seconds
```
→ All connections in the pool are in use. Either the pool is too small for your load, or a query is holding a connection open for too long.

**Lazy loading — the hidden query trigger:**

ActiveRecord queries don't fire when you call them. They fire when you iterate or inspect the results. This matters for performance:

```ruby
# This does NOT hit the database yet — it builds a query object
players = Player.where(rating: 1500..2000).order(:chess_username)

# This fires SELECT ... when you actually need the data
players.each { |p| puts p.chess_username }

# count fires immediately — SELECT COUNT(*)
players.count
```

**The one thing to get right**

N+1 queries are the most common performance mistake with ActiveRecord. Loading games and then fetching each game's player in a loop fires one query per row:

```ruby
# Bad: 1 query for games + N queries for players
Game.all.each { |g| puts g.player.chess_username }

# Good: 2 queries total — one for games, one for all their players
Game.includes(:player).each { |g| puts g.player.chess_username }
```

---

## Key Patterns

### Pattern 1: Use `rails console` to verify the database layer directly

**When to use it**

Any time you've run a migration and want to confirm the table and columns are what you expect, or when you want to test a query before putting it in a controller.

**How to think about it**

The Rails console is a direct window into the vault — you're talking to the same database your app uses, with the full ActiveRecord layer available. It's faster than writing a controller action to test a query.

```bash
rails console

# Confirm the table exists and columns are right
Player.column_names
# => ["id", "chess_username", "rating", "created_at", "updated_at"]

# Test a query
Player.where("rating > ?", 2000).count
# => SELECT COUNT(*) FROM "players" WHERE (rating > 2000)  => 0

# Insert a record to verify validations
Player.create!(chess_username: "magnuscarlsen", rating: 2830)
Player.last
```

Exit with `exit` or `Ctrl+D`.

### Pattern 2: Trust `schema.rb`, not memory

**When to use it**

Before adding an association, writing a query, or debugging a column mismatch — read `db/schema.rb` first.

**How to think about it**

`schema.rb` is the ground truth. Your memory of what columns exist is always stale. The file is auto-generated, never lies, and shows the exact current state of the vault's layout. The number of bugs caused by "I thought that column existed" is significant.

```ruby
# db/schema.rb after building the full chess app
create_table "games", force: :cascade do |t|
  t.bigint "white_player_id", null: false
  t.bigint "black_player_id", null: false
  t.string "pgn"
  t.string "result"
  t.date "played_on"
  t.datetime "created_at", null: false
  t.datetime "updated_at", null: false
  t.index ["black_player_id"], name: "index_games_on_black_player_id"
  t.index ["white_player_id"], name: "index_games_on_white_player_id"
end
```

Read this before writing `Game.joins(:white_player)` — it shows you the column name is `white_player_id`, not `player_id`.

---

## Common Gotchas

### 1. Assuming `rails db:migrate` runs automatically

**What goes wrong:** You generate a migration and then query the model. ActiveRecord raises `PG::UndefinedTable` because the table was never created — the migration file exists, but migrations only run when you run them.

**Why it's tempting:** Generating a model feels like creating it. The generator output includes the migration filename, so it seems like everything happened.

**How to fix it:** Always follow `rails generate model` with `rails db:migrate`. Then check `schema.rb` to confirm the table appeared.

### 2. Using `Player.all` in production without a limit

**What goes wrong:** Your app has 50,000 player records. `Player.all` loads all of them into memory, allocates 50,000 Ruby objects, and either crashes with out-of-memory errors or just gets very slow.

**Why it's tempting:** `Player.all` reads like "get all players," which is exactly what you want — until there are too many.

**How to fix it:** Always add `.limit(n)` or paginate: `Player.all.limit(100)`. For bulk operations, use `Player.find_each` which loads in batches of 1000.

### 3. Confusing `nil` returns with errors

**What goes wrong:** `Player.find_by(chess_username: "ghost")` returns `nil` when the record doesn't exist. If you call methods on `nil`, you get `NoMethodError: undefined method 'rating' for nil`. The error looks like a bug in your code, but it's actually just a missing record.

**Why it's tempting:** `find_by` is quiet — it doesn't raise an error. `find` does raise an error (`ActiveRecord::RecordNotFound`) when the record is missing, so the two methods have different failure modes.

**How to fix it:** Use `find` when the record must exist (raises on missing). Use `find_by` when absence is expected, and always guard the return: `player = Player.find_by(chess_username: params[:username]) || return render json: { error: 'not found' }, status: :not_found`.

### 4. Running `rails db:drop` in the wrong environment

**What goes wrong:** `rails db:drop` drops the current environment's database. If `RAILS_ENV` is somehow set to `production` in a terminal session, you drop the production database.

**Why it's tempting:** You want to reset development and `db:drop && db:create && db:migrate` is the fastest way. But it's a destructive command with no confirmation prompt.

**How to fix it:** Be explicit: `rails db:drop RAILS_ENV=development`. Check your current `RAILS_ENV` with `echo $RAILS_ENV` before running destructive database commands.

### 5. Editing `schema.rb` by hand

**What goes wrong:** You change `schema.rb` directly to add a column. The file gets overwritten the next time anyone runs `rails db:migrate`, your change disappears, and the actual database was never modified — so the column doesn't exist.

**Why it's tempting:** `schema.rb` looks like a config file. Editing it seems like the obvious way to change the schema.

**How to fix it:** Never touch `schema.rb`. Always add a migration (`rails generate migration AddRatingToPlayers rating:integer`) and let `rails db:migrate` regenerate `schema.rb` automatically.
