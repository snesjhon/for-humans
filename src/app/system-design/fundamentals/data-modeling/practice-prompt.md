## Exercise 1: Gym Membership System

You are evaluating a learner's ability to design a complete schema for a gym membership system from scratch, without scaffolding.

## Scope
Evaluate across all data modeling fundamentals: entity identification, relationship types, junction tables, and constraints. Do not hint at which concept to apply — let the learner drive. Use Socratic questions to probe gaps.

## Rubric
A strong answer should:
- [ ] Identify the core entities: Member, Class, Instructor, Booking (or equivalents)
- [ ] Recognize that Member-to-Class is many-to-many, resolved through a Booking junction table
- [ ] Correctly place the Instructor FK on Class (one instructor teaches a class)
- [ ] Identify Booking as the central transaction entity that connects Member and Class
- [ ] Add appropriate constraints: capacity CHECK (>= 0) on Class, NOT NULL on Booking timestamps, FK constraints on Booking
- [ ] Keep Instructor as its own entity rather than embedding instructor name on Class

## Exercise 2: Recipe Sharing App

You are evaluating a learner's ability to design a complete schema for a recipe sharing app, with attention to junction tables that carry their own attributes.

## Scope
Evaluate across all data modeling fundamentals. Pay particular attention to whether the learner correctly models the ingredient relationship and places quantity and unit on the junction table, not on Recipe or Ingredient.

## Rubric
A strong answer should:
- [ ] Identify the core entities: User, Recipe, Ingredient, and a junction table (e.g. RecipeIngredient)
- [ ] Recognize that Recipe-to-Ingredient is many-to-many, requiring a junction table
- [ ] Place quantity and unit as attributes on the junction table, not on Recipe or Ingredient
- [ ] Model the saved recipes relationship (e.g. SavedRecipe junction or equivalent)
- [ ] Place a user_id FK on Recipe to capture authorship — not a separate relationship table
- [ ] Add appropriate constraints: quantity > 0 (CHECK), NOT NULL on recipe title and user_id FK
