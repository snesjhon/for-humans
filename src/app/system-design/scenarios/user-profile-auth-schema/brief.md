# Design a User Profile and Authentication Schema

## Overview

Design the backend data model for a user accounts system that supports both email/password registration and OAuth-based sign-in (e.g., "Sign in with Google"). The system must support a single user account that can be accessed via multiple authentication methods.

## Functional Requirements

- Users can register and sign in with an email address and password
  - Passwords must never be stored in plaintext
- Users can sign in via OAuth providers (e.g., Google, GitHub)
  - A single user account can link multiple auth methods
  - The same OAuth identity cannot be linked to more than one user account
- Each user has a profile: display name, bio, and optional avatar URL
- The system tracks active login sessions
  - Sessions expire after a fixed duration
  - A user can invalidate all active sessions at once (log out everywhere)

## What you should design

- The database schema for user identity and profile data
- The schema for authentication credentials (email/password and OAuth)
- The schema for session management
- Key constraints and any security-relevant schema decisions worth calling out
