# Complete System Design Learning Path: Novice → Expert

---

## Philosophy

This curriculum is designed with the same pedagogical progression as dsa-for-humans:

- **Early steps** build foundational intuition with concrete, tangible systems
- **Middle steps** introduce distributed thinking and the trade-offs that come with scale
- **Late steps** combine everything into complex, production-grade system challenges

The insight behind this path: most system design resources teach you to recognize patterns ("oh, this needs a cache") without teaching you *why* the pattern works or what breaks it. This path inverts that — **fundamentals first, scenarios second**.

The failure mode we're solving: knowing what consistent hashing is, but not being able to reason from it when a database partition question comes up in an interview.

### How It Works

Every step is split into two tiers:

- **Scenarios** — Do these when you first hit the step. Foundational systems that exercise the core concept. Goal: understand the mental model, reason through the trade-offs, build confidence. Move on after this.
- **Come Back** — Return to these after completing 1–2 more steps. These deepen the concept, introduce edge cases, and build the fluency you'll need under interview pressure.

Don't try to finish **Come Back** before moving to the next step. Forward momentum matters.

---

## 🌱 Phase 1: Novice

**Goal**: Build foundational design intuition with systems you can visualize and reason about concretely.

### Why Start Here?

- Data modeling and APIs are tangible — you can draw the tables and endpoints
- No distributed systems complexity yet — focus on *what you're building*, not *how it scales*
- Low cognitive overhead — concepts apply to systems you've used or built before
- Builds confidence with early wins before scale enters the picture

---

### Step 1: Data Modeling & Schema Design

**Mental Model**: Every system is just entities and relationships. Before you think about scale, think about what you're storing and why. A well-designed schema makes every other problem easier. A poorly designed one makes every other problem harder.

**What You Learn**:
- Entity identification and relationship mapping
- Normalization vs denormalization trade-offs
- Constraints (uniqueness, foreign keys, not-null) as data integrity guarantees
- Schema design as a forcing function for understanding requirements

**Scenarios** *(do these now — get the basics, understand the shape of data)*:
- Design the database schema for a frozen yogurt ordering system *(sizes, flavors, toppings with weights, max weight constraint, order status)*
- Design a user profile and authentication schema

**Come Back** *(return to after API Design — these add complexity on top of the basics)*:
- Design a permissions and roles schema (RBAC)
- Design a multi-tenant SaaS schema where one database serves multiple customers

**Why First**: You cannot design any system without understanding what it stores. This is the foundation everything else is built on.

---

### Step 2: API Design

**Mental Model**: An API is a contract between you and your consumers. Design for the consumer, not the implementation. The best APIs make the wrong thing hard to do and the right thing obvious.

**What You Learn**:
- REST resource modeling (nouns, not verbs)
- HTTP methods and what they actually mean (GET is safe and idempotent, POST is not)
- Status codes as intent, not just numbers
- Versioning strategies and why they matter
- Request/response shape design

**Scenarios** *(do these now)*:
- Design the REST API for the yogurt ordering system from Step 1 *(how do customers place orders? how do employees update status?)*
- Design a REST API for a simple task management app

**Come Back** *(return to after Relational Databases)*:
- Design a versioned public API with backward compatibility guarantees
- Design an API that supports pagination, filtering, and sorting at scale

**Why Now**: APIs are how systems talk to each other and to clients. Understanding API design early makes database and scaling decisions more concrete.

---

### Step 3: Relational Databases

**Mental Model**: Tables are truth. Indexes are shortcuts. Joins are the price you pay for normalization. Every index speeds up reads and slows down writes — there is no free lunch.

**What You Learn**:
- How indexes actually work (B-tree structure, why order matters)
- Query planning and what makes a query slow
- N+1 problems and how to spot them
- Transactions and what ACID guarantees actually mean
- When to normalize and when to intentionally denormalize

**Scenarios** *(do these now — schema first, then query patterns)*:
- Design the database for an e-commerce order system *(products, inventory, orders, line items, payments)*
- Design a social follows/followers schema and the queries it needs to support

**Come Back** *(return to after Caching Fundamentals)*:
- Design a schema that handles soft deletes and a full audit trail
- Design a reporting schema for a system with high write volume *(read replicas, materialized views, event tables)*

**Why Now**: Relational databases are the default choice for most systems. You need to know them deeply before you can know when to reach for something else.

---

### Step 4: Caching Fundamentals

**Mental Model**: A cache is a bet — you're trading consistency for speed. Every cache introduces the question: what happens when the cache and the database disagree? Know what you're willing to lose before you add a cache.

**What You Learn**:
- Read-through vs write-through vs write-behind cache patterns
- Cache invalidation strategies (TTL, event-driven, cache-aside)
- Cache eviction policies (LRU, LFU, FIFO) and when each makes sense
- What makes something a good cache candidate (read-heavy, slow to compute, tolerates staleness)
- Cache stampede and how to prevent it

**Scenarios** *(do these now)*:
- Design a caching layer for a product catalog *(high read volume, infrequent updates)*
- Design session storage for a web application

**Come Back** *(return to after Scalability Fundamentals)*:
- Design a leaderboard that stays accurate in real-time with millions of score updates
- Design a news feed cache that balances freshness with performance

**Why Now**: Caching is the first tool you reach for when a system is slow. Understanding it deeply now prevents cargo-culting it later.

---

### Step 5: Scalability Fundamentals

**Mental Model**: Stateless services scale horizontally — just add more boxes. State is the hard part. Before you scale anything, ask: what state does this service hold, and where does it live?

**What You Learn**:
- Vertical vs horizontal scaling and when each is appropriate
- Stateless service design (why it enables horizontal scaling)
- Load balancing strategies (round-robin, least connections, consistent hashing)
- The difference between scaling reads and scaling writes
- Capacity estimation as a design skill (back-of-envelope math)

**Scenarios** *(do these now — simple systems with clear scaling requirements)*:
- Design a URL shortener *(high read volume, simple writes, global availability)*
- Design a paste bin *(similar shape to URL shortener, adds content storage)*

**Come Back** *(return to after Database Scaling)*:
- Design a web crawler *(distributed, stateful, politeness constraints)*
- Design a job scheduler *(distributed coordination, exactly-once execution)*

**Why Now**: Scalability thinking underlies every Phase 2 topic. Build the intuition before the complexity arrives.

---

## 🎓 Checkpoint: Novice → Studied

**You should now be able to**:
✅ Design a schema from a set of requirements
✅ Model a REST API for a given system
✅ Reason about indexes and query performance
✅ Explain cache trade-offs for a given read/write pattern
✅ Do basic capacity estimation and identify the scaling bottleneck

---

## 📚 Phase 2: Studied

**Goal**: Think in distributed systems. Reason about trade-offs under scale, failure, and concurrency.

### Why This Phase?

- Phase 1 assumed one database and one server. Phase 2 breaks both assumptions.
- Distributed systems introduce failure modes that don't exist on a single machine
- The trade-offs here (consistency vs availability, latency vs throughput) are what senior interview questions are about

---

### Step 6: Database Scaling

**Mental Model**: You scale reads first (replicas), then writes (sharding). Never shard before you have to — it adds enormous complexity. When you do shard, your shard key is the most important decision you'll make.

**What You Learn**:
- Read replicas: how replication lag works and when it causes problems
- Vertical partitioning (splitting tables) vs horizontal partitioning (sharding rows)
- Shard key selection and the hot partition problem
- Cross-shard queries and why they're painful
- When to reach for a distributed database (Cassandra, DynamoDB) vs sharding Postgres

**Scenarios** *(do these now)*:
- Design the database architecture for a Twitter-scale read-heavy timeline
- Design a multi-region e-commerce database with inventory consistency

**Come Back** *(return to after Consistent Hashing)*:
- Design a globally distributed user preferences system with low read latency everywhere
- Design a system that needs cross-shard transactions without a distributed database

**Why Now**: Every Phase 2 topic assumes you understand what happens when one database isn't enough.

---

### Step 7: Consistent Hashing

**Mental Model**: With a fixed hash space, adding or removing nodes reshuffles every key — catastrophic for a distributed cache. Consistent hashing puts nodes and keys on a ring so that only a neighbor's keys need to move. The ring doesn't care how many nodes you have.

**What You Learn**:
- Why naive modulo hashing fails when nodes change
- The hash ring and virtual nodes
- How virtual nodes improve load distribution
- Where consistent hashing is used in practice (Cassandra, DynamoDB, distributed caches)
- The trade-off between virtual node count and rebalancing cost

**Scenarios** *(do these now)*:
- Design a distributed cache (Memcached-style) that handles node additions and removals gracefully
- Design a distributed key-value store with configurable replication factor

**Come Back** *(return to after Message Queues)*:
- Design a CDN routing system that routes requests to the nearest healthy edge node
- Design a distributed session store that survives node failures without session loss

**Why Now**: Consistent hashing is the foundation of how distributed data stores partition data. You'll see it everywhere in Phase 2 and 3.

---

### Step 8: Message Queues & Async Processing

**Mental Model**: A queue decouples the producer from the consumer. The producer sends a message and forgets — it doesn't wait, doesn't care if the consumer is slow, doesn't retry. The queue handles durability, delivery, and backpressure. This is what makes async systems composable.

**What You Learn**:
- Queue vs stream semantics (Kafka vs SQS)
- At-least-once vs exactly-once delivery and why exactly-once is hard
- Dead letter queues and retry strategies
- Backpressure and what happens when consumers can't keep up
- Fan-out patterns (one message, many consumers)

**Scenarios** *(do these now)*:
- Design a notification system (email + push) that decouples sending from the triggering event
- Design an image processing pipeline *(upload → resize → thumbnail → store)*

**Come Back** *(return to after CAP Theorem)*:
- Design an order processing system with retries, idempotency, and a dead letter queue
- Design a real-time event streaming platform (Kafka-style) for analytics ingestion

**Why Now**: Async processing is how you scale write-heavy systems and decouple services. It appears in almost every Phase 3 scenario.

---

### Step 9: CAP Theorem & Consistency Models

**Mental Model**: When the network partitions (and it will), you must choose: serve potentially stale data (AP) or refuse to answer until you're sure you're consistent (CP). There is no third option. Most systems make this choice implicitly — this step makes it explicit.

**What You Learn**:
- What a network partition actually is (and why it's unavoidable)
- CP systems: sacrifice availability for consistency (banking, inventory)
- AP systems: sacrifice consistency for availability (social counts, shopping carts)
- Eventual consistency: what it means for users and how to design around it
- Conflict resolution strategies (last-write-wins, vector clocks, CRDTs)

**Scenarios** *(do these now — pick a clear side of the trade-off for each)*:
- Design a bank account transfer system *(CP — wrong balance is never acceptable)*
- Design a social media like/view counter *(AP — slightly stale count is fine)*

**Come Back** *(return to after Rate Limiting)*:
- Design a distributed configuration system that all services read at startup
- Design a collaborative document editor where two users can edit simultaneously

**Why Now**: You've been making this trade-off implicitly since Step 3. This step makes it a first-class design decision.

---

### Step 10: Rate Limiting

**Mental Model**: Rate limiting protects resources from being overwhelmed — by bad actors, by bugs, or by popularity. You're not rejecting users permanently; you're enforcing fairness. The algorithm you choose determines how "fair" feels.

**What You Learn**:
- Token bucket vs leaky bucket vs fixed window vs sliding window algorithms
- Where to enforce rate limits (API gateway, service layer, database)
- Distributed rate limiting: how to count across multiple servers
- Rate limit headers and how to communicate limits to clients
- Graceful degradation vs hard rejection

**Scenarios** *(do these now)*:
- Design a rate limiter for a public REST API *(per API key, per endpoint)*
- Design a per-user rate limiter for a SaaS application

**Come Back** *(return to after Storage & CDN)*:
- Design a distributed rate limiter using Redis that works across 50 API servers
- Design a rate limiter that allows short bursts but enforces a sustained limit

**Why Now**: Rate limiting combines consistent hashing, caching, and distributed coordination — a synthesis of Phase 2 so far.

---

### Step 11: Storage & CDN

**Mental Model**: CDNs move data closer to users — the closer the data, the lower the latency. Storage tiers match access frequency: hot data (SSD, in-memory) costs more, cold data (object store, tape) costs less. Match the tier to the access pattern.

**What You Learn**:
- Object storage vs block storage vs file storage and when to use each
- CDN architecture: origin, edge nodes, cache-control headers
- Cache invalidation at the CDN level (purging vs TTL)
- Pre-signed URLs for secure direct uploads
- Storage tiering: hot, warm, cold, archive

**Scenarios** *(do these now)*:
- Design a file upload system *(direct-to-S3 uploads, metadata in a database)*
- Design a photo storage and serving system at Instagram scale

**Come Back** *(return to after Distributed Transactions)*:
- Design a video streaming platform *(chunked storage, adaptive bitrate, CDN delivery)*
- Design a multi-region content delivery system with consistent invalidation

**Why Now**: Storage and CDN complete the Phase 2 picture — you now have all the building blocks for Phase 3 complex systems.

---

## 🎓 Checkpoint: Studied → Expert

**You should now be able to**:
✅ Reason about database scaling decisions (replicas vs sharding vs distributed DB)
✅ Explain consistent hashing and where it applies
✅ Design async systems using message queues
✅ Make explicit CAP trade-off decisions for a given system
✅ Design a rate limiter with the right algorithm for the constraints
✅ Choose the right storage tier and CDN strategy for a given access pattern

---

## 🎯 Phase 3: Expert

**Goal**: Combine Phase 1 and Phase 2 concepts into complex, production-grade systems. Reason about failure modes, operational concerns, and architectural trade-offs at depth.

---

### Step 12: Distributed Transactions

**Mental Model**: ACID is easy on one machine — the database handles it. On multiple machines, you have to orchestrate it yourself. Two-phase commit gives you safety at the cost of availability. Sagas give you availability at the cost of simplicity. Pick based on what failure means for your users.

**What You Learn**:
- Why distributed transactions are hard (network partitions, partial failures)
- Two-phase commit (2PC): what it guarantees and why it's rarely used in practice
- Saga pattern: choreography vs orchestration
- Idempotency keys as the foundation of safe retries
- Compensating transactions (how to "undo" a distributed operation)

**Scenarios** *(do these now)*:
- Design a payment processing system *(charge card + fulfill order + send receipt — all or nothing)*
- Design a hotel booking system that prevents double-booking across a distributed inventory

**Come Back** *(return to after Real-time Systems)*:
- Design an order management system using the saga pattern with compensating transactions
- Design a cross-service inventory reservation system that handles partial failures gracefully

---

### Step 13: Real-time Systems

**Mental Model**: "Real-time" is a spectrum. Polling is lazy pull — simple but wasteful. Long polling is hopeful pull — better but awkward. WebSockets is a persistent bidirectional connection — powerful but stateful. SSE is a one-way server stream — perfect for dashboards. Match the mechanism to the update pattern.

**What You Learn**:
- Polling vs long polling vs WebSockets vs Server-Sent Events trade-offs
- Why WebSocket connections are stateful and what that means for scaling
- Presence systems: how to know if a user is online
- Message fan-out at scale (how Slack delivers a message to 10,000 channel members)
- Pub/sub at the infrastructure level

**Scenarios** *(do these now)*:
- Design a live chat system (Slack-style) *(messages, channels, presence)*
- Design a real-time collaborative whiteboard *(concurrent edits, conflict resolution)*

**Come Back** *(return to after Search Systems)*:
- Design a live sports score system *(millions of readers, infrequent writes, low tolerance for stale data)*
- Design the backend for a real-time multiplayer game *(state sync, lag compensation)*

---

### Step 14: Search Systems

**Mental Model**: Full-text search is an inverted index — you index words to find documents, not documents to find words. Every search optimization is a trade-off between index size, write throughput, and query latency. Relevance ranking is a separate problem from retrieval.

**What You Learn**:
- How inverted indexes work (tokenization, stemming, posting lists)
- Elasticsearch architecture (shards, replicas, mapping)
- Typeahead/autocomplete as a different problem from full-text search
- Relevance scoring (TF-IDF, BM25) and when it matters
- Search index vs database: why you often need both

**Scenarios** *(do these now)*:
- Design a typeahead/autocomplete system for a search bar *(latency-critical, prefix matching)*
- Design a product search for e-commerce *(filters, facets, relevance ranking)*

**Come Back** *(return to after Observability)*:
- Design a full-text search engine for a document corpus (Elasticsearch-style)
- Design a personalized search ranking system that learns from user behavior

---

### Step 15: Observability & Monitoring

**Mental Model**: You can't fix what you can't see. Logs are individual events. Metrics are aggregated trends. Traces are the journey of a single request through multiple services. You need all three — they answer different questions.

**What You Learn**:
- The three pillars: logs, metrics, traces
- Structured logging vs unstructured logging
- Metrics cardinality and why it matters for cost
- Distributed tracing: trace IDs, span propagation, sampling
- Alerting on symptoms vs causes

**Scenarios** *(do these now)*:
- Design a centralized logging system for a microservices application
- Design an alerting system for infrastructure health

**Come Back** *(return to after Microservices)*:
- Design a distributed tracing system (Jaeger/Zipkin-style)
- Design an anomaly detection system that pages on unusual patterns without alert fatigue

---

### Step 16: Microservices vs Monolith

**Mental Model**: Microservices trade operational simplicity for deployment flexibility. Only split when the monolith's coupling is actively hurting you — slow deploys, inability to scale one component, team coordination overhead. The hardest part of microservices isn't the technology, it's the service boundaries.

**What You Learn**:
- When to stay monolith (most of the time, earlier than you think)
- Service decomposition patterns (by domain, by team, by scaling requirement)
- The strangler fig pattern for incremental migration
- Service-to-service communication (sync REST/gRPC vs async messaging)
- The distributed monolith anti-pattern and how to avoid it

**Scenarios** *(do these now)*:
- Design the migration of a monolith e-commerce application to microservices *(what splits first, what stays together)*
- Design the service boundaries for a ride-sharing application *(riders, drivers, matching, payments, notifications)*

**Come Back** *(return to during final review)*:
- Design a service mesh with circuit breakers, retries, and timeouts
- Design a blue-green deployment system for a microservices platform

---

## 🎓 Checkpoint: Expert

**You should now be able to**:
✅ Design distributed transaction systems with appropriate consistency guarantees
✅ Choose the right real-time mechanism for a given update pattern
✅ Design search systems with the right index architecture
✅ Instrument a system for observability from day one
✅ Reason about service decomposition trade-offs

---

## 💡 Key Principles

### 1. **Fundamentals Over Patterns**

Don't memorize "use a cache here." Understand *why* a cache helps, *what* it breaks, and *when* to reach for it. The pattern recognition comes naturally once the fundamentals are solid.

### 2. **Trade-offs Are The Answer**

System design questions don't have one right answer. The right answer is a well-reasoned trade-off. The interviewer wants to see you think through the options, not recite a template.

### 3. **Requirements First, Always**

Every design starts with: what are we storing, how often is it read, how often is it written, what's the failure tolerance, what's the scale? Don't design until you know what you're designing for.

### 4. **The Database Is Usually the Bottleneck**

In most systems, the database is where scale problems show up first. Know your database deeply — schema, indexes, query patterns, replication — before reaching for exotic solutions.

### 5. **Speak Out Loud**

System design is evaluated as much on *how you think* as *what you conclude*. Narrate your reasoning. Name the trade-offs explicitly. Ask clarifying questions before committing to a design.

---

## 📖 How to Use This Path

1. **Don't skip steps**: Phase 1 concepts appear inside Phase 2 and 3 scenarios
2. **Do the Scenarios first**: Finish the main scenarios before returning to Come Back
3. **Use the evaluator**: After reading the fundamentals, speak your understanding back before moving to scenarios. Catch gaps early.
4. **Come Back is not optional**: The reinforcement pass is where depth is built
5. **Reference freely**: Once you've studied a topic, come back to it whenever a new scenario touches it

---

## 🎓 Final Thought

This path is harder than it looks from the outside — not because the individual concepts are complex, but because the *combinations* are. A payment system problem isn't just "distributed transactions." It's schema design + API design + consistent hashing + CAP trade-offs + message queues, all at once, under time pressure.

The fundamentals are what let you decompose complex problems. Learn them deeply. The scenarios are just practice applying them.

**Trust the fundamentals. Everything else follows.**
