Build this as a single multi-tenant Next.js application in TypeScript, with Gemini 3.1 Pro used server-side for grounded reasoning and explanation, and a PostgreSQL backend for product, dealer, lead, and session data.

Antigravity should be used as the development environment and AI coding workflow, not as the app framework itself.

1. Final stack
Frontend

Next.js (App Router)

TypeScript

React

Tailwind CSS

shadcn/ui

react-hook-form + zod

Backend

Next.js route handlers / server actions

PostgreSQL

Prisma ORM

Redis for rate limiting, cache, and queue support if needed

AI

Gemini 3.1 Pro for:

grounded Q&A

answer generation

recommendation explanation

comparison summaries

lead/dealer handoff summaries

Use deterministic product logic first, then AI to explain results.

Infra / hosting

Vercel for frontend/app hosting if compatible with client requirements

Managed Postgres such as Neon, Supabase Postgres, or RDS

Object storage for manuals, brochures, imports, and derived assets

Sentry for monitoring

PostHog or GA4 for analytics

2. Why this is the right architecture

This app needs all of the following at once:

strong branding control across 4 websites

fast UX

SEO-friendly entry points

secure server-side AI calls

structured product/dealer/lead storage

admin/config tools

future flexibility for embedding or standalone hosting

Next.js is the cleanest fit because it supports:

server-rendered and client-interactive flows

branded route handling

API endpoints in the same codebase

easy deploys

strong TypeScript patterns

good performance defaults

A pure frontend SPA would make security and maintainability worse.
Four separate apps would create unnecessary complexity.
A chatbot-only build would be less trustworthy than a guided recommendation engine.

3. Architecture decision
Use one codebase, not four

Build one shared application with a brand configuration layer.

Each brand gets:

theme tokens

logo and assets

product catalog

glossary and approved language

lead routing rules

dealer logic

site-specific copy

The codebase stays shared.

Brand resolution

Resolve active brand by one of these methods:

hostname

embed parameter

deployment environment variable

Example:

assistant.marquisspas.com

assistant.artesianspas.com

assistant.nordichottubs.com

assistant.tropicseasspas.com

or one shared app:

buyingassistant.company.com?brand=marquis

My preference: one shared app with brand-aware routing, then expose it on brand-specific subdomains or embed it into each site.

4. Rendering model
Server Components by default

Use Server Components for:

catalog/result pages

data fetching

branded shell rendering

preloaded recommendation results

SEO-friendly landing routes

Client Components only where needed

Use Client Components for:

multi-step questionnaire

compare toggles

chat input

dealer search interaction

lead form input state

This reduces client-side JS and keeps performance stronger.

5. AI architecture
Core rule

AI should never be the source of truth for product recommendations.

Use this sequence:

Recommendation flow

user answers wizard questions

answers are normalized into a structured preference object

scoring engine ranks products

top products are retrieved

Gemini generates:

why this matches

tradeoffs

suggested next step

Q&A flow

user asks question

system classifies intent

retrieve relevant product/features/dealer context

Gemini answers using only approved grounded context

UI renders controlled answer + next action

What AI should do

explain

summarize

rephrase

compare

answer grounded questions

generate dealer handoff summaries

What AI should not do

invent product specs

select products without the rules layer

promise price or inventory

make unsupported health claims

compare against competitors unless the data exists

6. Recommended app structure

A practical folder structure:

/src
  /app
    /(public)
      /[brand]
        /page.tsx
        /recommend/page.tsx
        /compare/page.tsx
        /dealer/page.tsx
        /lead/page.tsx
    /api
      /chat/route.ts
      /recommend/route.ts
      /compare/route.ts
      /lead/route.ts
      /dealer/route.ts
      /admin/import/route.ts
  /components
    /brand
    /wizard
    /chat
    /compare
    /dealer
    /forms
    /layout
  /lib
    /ai
      gemini.ts
      prompts.ts
      schemas.ts
      guardrails.ts
    /brands
      config.ts
      themes.ts
    /recommendation
      scoring.ts
      filters.ts
      ranking.ts
      explanation.ts
    /data
      products.ts
      dealers.ts
      glossary.ts
    /validation
      lead.ts
      chat.ts
      recommend.ts
  /server
    /db
      prisma.ts
    /services
      product-service.ts
      dealer-service.ts
      lead-service.ts
      conversation-service.ts
  /styles
  /types
/prisma
  schema.prisma
7. Database design
Required tables

You should plan for at least these:

brands

Stores:

brand id

name

domain

theme config

active status

series

Stores:

brand id

series name

category

tier/positioning

products

Stores:

model name

series

dimensions

seats

lounge flag/count

jets

voltage

amps

capacity

weights

standard features

optional features

status

source URL

last verified timestamp

dealers

Stores:

brand

address

territory

postal code

geo coordinates

contact info

active flag

leads

Stores:

brand

dealer

session id

user data

recommendation data

transcript summary

consent flags

submission timestamp

sessions / conversation_events

Stores:

session id

question/answer history

model used

prompt version

grounded source references

moderation flags

prompt_versions

Stores:

prompt name

version

active status

change notes

imports / sync_logs

Stores:

import source

import time

changed records

validation failures

8. API design
Public endpoints
POST /api/recommend

Input:

brand

questionnaire answers

Output:

top recommended products

reasons

next steps

comparison candidates

POST /api/chat

Input:

brand

session id

message

selected product context if any

Output:

structured response

optional suggested questions

optional recommended products

optional CTA

POST /api/compare

Input:

product ids

brand

Output:

normalized side-by-side comparison

explanation summaries

POST /api/dealer

Input:

brand

postal/zip code

Output:

best dealer candidates

fallback routing

POST /api/lead

Input:

user data

session summary

recommendation summary

consent flags

Output:

success

lead reference

dealer route result

Admin endpoints

product import

product review

glossary management

brand config management

analytics export

lead export

9. Security model
Must-do security controls

Keep all sensitive logic server-side:

Gemini API calls

recommendation engine

lead routing

admin tools

dealer rules

data imports

Add:

strict schema validation with zod

rate limiting on chat and form endpoints

bot protection on lead forms

server-side sanitization of user input

auth + RBAC for admin

encrypted secrets

audit logs

PII minimization where possible

Data protection

Store only what is needed:

name

email

phone if required

location/postal code

shopping intent summary

Do not store unnecessary raw transcript data forever.
Set retention rules early.

10. Safe AI implementation pattern
Use structured outputs

Every important Gemini call should return typed JSON, not loose text.

Examples:

intent classification

extracted preferences

comparison summary blocks

lead summary object

follow-up question suggestions

Add guardrails

Before sending any AI response to the UI:

validate shape

validate referenced product ids exist

validate claims against allowed fields

fallback if unsupported

Fallback behavior

If AI fails:

recommendation results still work

compare still works

lead capture still works

chat can return a safe fallback like:
“I can help compare models from the available product information, but I don’t have enough confirmed data to answer that confidently.”

This is important for resilience.

11. Styling and design system
Recommended approach

Use:

Tailwind for design speed and consistency

shadcn/ui for accessible components

per-brand theme tokens for colors, typography, spacing accents

Theme model

Each brand config should define:

primary color

accent color

background styles

typography choices

CTA labels

card styling

icon treatment

logo assets

The app should feel branded per site, but the UX patterns should stay consistent.

12. Authentication model
Public side

No login required for shoppers.

Admin side

Use authenticated admin routes for:

data imports

config editing

prompt editing

analytics

lead review

Recommended:

NextAuth/Auth.js or your preferred SSO-compatible auth layer

role-based access:

admin

editor

analyst

read-only reviewer

13. Hosting recommendation
Best practical setup

Use:

Vercel for the web app

managed Postgres for data

object storage for supporting docs

Redis for rate limits and short-lived session caching

Why

This is the easiest stack to ship and maintain for a modern Next.js app.

If enterprise requirements later demand AWS-only or another host, the architecture still ports cleanly.

14. Performance strategy
Performance rules

keep branded shells server-rendered

keep initial JS light

lazy-load chat where possible

cache product and brand config data

precompute recommendation-ready product fields

do not scrape live product pages during user sessions

use streaming/suspense only where it improves perceived speed

Target

The user should get a recommendation quickly after the final answer submission, even if the explanation layer takes slightly longer.

15. Embedding strategy

You have two viable options.

Option A: standalone app on brand subdomains

Best for:

cleaner ownership

easier analytics

fewer iframe issues

Option B: embedded widget/iframe in existing sites

Best for:

faster initial rollout

less CMS work on the main sites

My recommendation:

build the app so it can do both

launch quickest path first

keep routing and theming independent of embedding method

16. Dev workflow in Antigravity

Antigravity should be used for:

scaffolding and code generation

component building

refactors

test creation

AI-assisted debugging

prompt iteration

implementation speed

But keep the generated output aligned to:

strict TS types

linting

tests

reviewable server/client boundaries

explicit schemas

Do not let Antigravity generate uncontrolled app sprawl.
Use it inside a clearly defined architecture.

17. Testing strategy
Minimum required

unit tests for recommendation scoring

unit tests for normalization logic

integration tests for API endpoints

end-to-end tests for:

wizard flow

compare flow

lead submission

dealer routing

prompt regression tests for core AI outputs

Critical tests

Especially test:

bad/missing product data

unsupported user questions

invalid lead inputs

brand switching

rate limiting

AI timeout/failure fallback

18. Build phases
Phase 1

Foundation:

Next.js app shell

multi-brand theming

database schema

product import

product browsing/retrieval APIs

Phase 2

Recommendation MVP:

questionnaire

scoring engine

result page

compare page

Phase 3

AI layer:

Gemini integration

grounded Q&A

explanation generation

session tracking

Phase 4

Lead/dealer layer:

dealer lookup

lead capture

routing

summaries

analytics

Phase 5

Admin/ops:

imports

prompt/version management

reporting

content updates

19. Direct decision summary
Use

Next.js App Router

TypeScript

Tailwind

shadcn/ui

PostgreSQL

Prisma

Gemini 3.1 Pro server-side

single multi-tenant codebase

brand config architecture

deterministic recommendation engine + AI explanation layer

Avoid

four separate apps

frontend-only AI calls

pure chatbot logic

untyped outputs

live scraping during user sessions

putting recommendation logic in prompts alone