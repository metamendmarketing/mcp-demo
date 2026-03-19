1. Product thesis

The app should be positioned as a multi-brand AI buying assistant that helps shoppers understand differences between models, translate their needs into product recommendations, and hand off a better-qualified lead to the nearest dealer. Across the four sites, there is already a strong pattern of dealer-led conversion: Marquis has a Hot Tub Finder, brochure request, pricing request, and dealer locator; Artesian has brochure, pricing, design, and dealer flows; Nordic has request-a-quote, brochure, and dealer flows; Tropic Seas has pricing, brochure, design, and dealer flows. That means the new app should not replace the dealer journey — it should improve the quality of the lead entering it.

2. Website and product-catalog analysis
Marquis Spas

Marquis has the clearest premium-therapy positioning and already exposes a meaningful amount of structured product data. The site has hot tub collections including Crown, Vector21, Elite, and Celebrity, plus swim spas. The Crown collection page alone lists model name, seat count, jet count, standard features, optional features, pricing CTA, dealer CTA, and a “Hot Tub Finder” flow. A model page like Summit also exposes dimensions, seating, jets, pumps, electrical, filtration, water capacity, and dry/full weight.

Implication: Marquis is the best initial pilot because the product data is already rich enough to support grounded recommendations without a heavy manual data-entry burden.

Artesian Spas

Artesian is broader and more portfolio-driven. The main site presents multiple lines: TidalFit swim spas, Artesian Elite, Island Spas, South Seas Spas, and Garden Spas, and states it offers more than 100 hot tub models. The Artesian Elite section shows model names, seat counts, standard features, optional features, quote CTA, brochure CTA, design CTA, and dealer CTA. However, the parsed pages expose less consistently structured model-level technical data than Marquis.

Implication: Artesian will support the app well, but it likely needs a stronger normalization layer and possibly a manual enrichment pass for product specs if the AI is expected to answer detailed comparison questions consistently.

Nordic Hot Tubs

Nordic’s catalog is organized by series rather than luxury-marketing storytelling: Luxury, Sport, Modern, Classic, and All-In-110V. The site exposes a strong filter structure by persons, shape, and series, and individual model pages provide rich technical specs including dimensions, total jets, capacity, weight, volts, amps, control pad, insulation, heater, pump configuration, and narrative seating descriptions.

Implication: Nordic is well suited for a spec-led recommendation experience. It likely needs less “AI explanation” and more “AI translation of specs into plain language,” because the raw data is available but not easily digestible for mainstream shoppers.

Tropic Seas Spas

Tropic Seas presents hot tubs, plug-and-play 110V models, and swim spas. The site lists model names and seat counts directly on the catalog page, and an individual model page like Waikiki exposes size, seats, jets, capacity, dry weight, pump configurations, standard features, optional features, and quote/download-brochure CTAs. It also supports dealer finding and “Design Your Spa.”

Implication: Tropic Seas also has enough product-level structure for a strong deployment, especially if the app highlights differences between standard, Elite, and foot-jet configurations.

3. Recommended product strategy

Do not build four separate apps with four separate codebases.

Build one multi-tenant application with:

one shared core product/recommendation engine

one shared conversation engine

one shared data schema

four brand configurations

optional per-brand deployments or embeds depending on hosting constraints

That gives you:

faster iteration

shared QA

shared analytics

lower maintenance

brand-specific UI, copy, product catalog, and dealer routing

Use a “single core, branded shells” model.

4. Recommended user journeys
Primary journey: guided recommendation

User answers 6–12 questions:

how many people

therapy vs entertaining vs family time

lounge preference

indoor/outdoor

climate

electrical constraints

budget comfort zone

desired premium features

dealer urgency / shopping timeframe

Output:

best-fit models

reasons each model matches

key tradeoffs

next recommended action

nearest dealer CTA

Secondary journey: AI education

User asks natural-language questions:

“Do I need 110V or 220V?”

“What matters more, jets or pump power?”

“Is a lounger better for daily recovery?”

“What’s the difference between these two models?”

Output:

grounded answer only from approved product and feature data

citations or “source facts used” internally for auditability

suggestion chips to continue the journey

escalation to quote/dealer flow

Tertiary journey: comparison mode

User selects 2–3 models.
Output:

side-by-side spec comparison

plain-English explanation of who each is best for

“best for therapy / family / compact space / lower complexity / premium features”

Dealer handoff

When user completes journey:

save lead

save recommendation summary

save questions asked / concerns

save nearest dealer result

push into CRM/email workflow

5. Functional requirements
5.1 Brand-aware experience

The app must detect host brand by domain or embed config and load:

brand colors

logo

copy tone

product catalog

feature dictionary

approved claims

CTA labels

dealer lookup rules

5.2 Product recommendation engine

The engine must:

map user answers into weighted preferences

filter out incompatible products

rank remaining products

generate explanation text from ranked factors

always show why a model matched

This should be deterministic first, AI second:

rules + weighted scoring

Gemini generates explanation layer

Gemini never invents products or specs

5.3 Comparison engine

Must support:

2–3 selected products

normalized fields even when websites use different terminology

“unknown / unavailable” state when a spec is missing

user-friendly summaries, not just raw tables

5.4 AI Q&A

Must be grounded only in:

approved product catalog

approved feature glossary

approved brand marketing claims

approved FAQ / manuals / buyer guides if client allows ingestion

Must reject or soften unsupported asks:

medical claims beyond approved language

competitor claims without provided evidence

pricing beyond dealer-confirmed price rules

local availability unless tied to dealer inventory feed

5.5 Dealer finder and routing

At minimum:

collect zip/postal code

identify nearest dealer

pass recommendation summary into lead form

If direct dealer API is not available, phase 1 can simply:

capture postal code

call existing dealer-locator endpoint/page

embed or deep-link dealer results

pass summary to brand lead form

5.6 Lead capture

Capture:

name

email

phone optional/required by brand

postal/zip

product recommendations

top priorities

budget band

selected brand/site

transcript summary

consent status

5.7 Admin/content tools

Need a lightweight internal admin for:

product import/review

feature glossary editing

recommendation question editing

brand copy overrides

analytics viewing

prompt/version management

lead export or webhook setup

6. Data availability and what to ingest
What is clearly available now

Across the sites, the current pages expose enough public content to seed a first-pass product graph:

product families / series

model names

seat counts

jet counts on many pages

standard features

optional features

dimensions/specs on many model pages

brochure/pricing/dealer CTAs

some feature education pages and buyer guides

Gaps to expect

The public sites do not appear to provide one clearly standardized machine-readable catalog API. Some brands expose richer model specs than others, and some parsed pages are more marketing-oriented than data-oriented. That means you should assume a hybrid ingestion model:

initial crawler/scraper

normalization pipeline

manual QA/enrichment interface

scheduled refresh jobs

optional direct source file import from client later

7. Canonical data model

Use a shared schema across all brands.

Core entities

Brand

id

name

domain

logo_url

theme tokens

locale(s)

active status

Series

id

brand_id

name

category (hot_tub, swim_spa, plug_and_play)

description

positioning tier (luxury, value, compact, etc.)

Product

id

brand_id

series_id

model_name

slug

status

hero_image_url

seats_min

seats_max

lounge_count

jet_count

capacity_gallons

dry_weight_lbs

length_in

width_in

depth_in

voltage_options

amperage

heater_kw

pump_config_json

filtration_json

insulation_type

warranty_json

standard_features_json

optional_features_json

shell_colors_json

cabinet_colors_json

marketing_summary

therapy_summary

usage_tags (family, therapy, compact, entertaining, entry_level, etc.)

source_url

source_last_seen_at

completeness_score

FeatureGlossary

id

brand_id nullable

term

consumer_explanation

approved_claims

prohibited_claims

related_features

Dealer

id

brand_id

dealer_name

address

city

state_province

postal_code

country

lat

lng

phone

email

website

source

active

Lead

id

brand_id

dealer_id nullable

session_id

answers_json

ranked_products_json

selected_product_ids

transcript_summary

user_contact_json

consent_json

created_at

ConversationEvent

id

session_id

role

message

grounded_sources_json

prompt_version

model_version

created_at

8. Recommendation logic design

Do not rely on a purely open-ended LLM recommendation.

Deterministic scoring layer

Each answer contributes weighted signals.

Example:

people_count >= 6 boosts larger seating models

plug_and_play_required = true hard-filters to 110V category

primary_goal = therapy boosts therapy-heavy models/features

space_constraint = compact penalizes large footprints

premium_features = high boosts WiFi, lighting, advanced sanitation, premium jets

budget_band = entry penalizes top-tier luxury models

Explainability layer

After scoring:

top 3 products returned

Gemini generates:

“why this fits”

“what to watch for”

“who should choose the runner-up instead”

Safety rules

never fabricate unavailable spec values

never compare to competitor products unless the client provides competitor dataset

never estimate local price unless a ruleset exists

never imply inventory certainty without inventory data

use “based on the product information available on this site” language

9. AI architecture for Antigravity + Gemini

Because you’ll be building in Antigravity with Gemini, design the system so Gemini is used for reasoning and explanation, not as the source of truth.

Recommended runtime roles

Gemini role

transform user intent into structured filters

generate explanations

answer grounded product questions

summarize dealer handoff

suggest next questions

App/backend role

enforce schema

fetch product data

score products

retrieve grounded context

store sessions/leads

control prompts

handle fallbacks

Core AI pipelines
Pipeline A: recommendation

collect questionnaire answers

convert answers to normalized preference object

run deterministic scoring

retrieve top products + feature/context blocks

call Gemini with strict grounded context

render response

Pipeline B: open chat

detect intent (faq, compare, recommend, dealer, pricing, support)

retrieve relevant product/feature/dealer context

call Gemini with brand guardrails

return structured answer + CTA

Pipeline C: lead summary

collect transcript + answers + results

summarize into dealer-readable brief

store and send

Prompt design principles

System prompt should include:

active brand

allowed content sources

disallowed topics

response style

no hallucinated specs

no unsupported medical or pricing claims

ask clarifying question if insufficient data

Use JSON-mode / structured output whenever possible for:

detected intent

extracted preferences

recommended product IDs

follow-up questions

lead summary object

10. UX specification
Entry points

Each site should support:

homepage CTA

product listing page CTA

comparison page CTA

sticky “Need help choosing?” button

dealer page CTA

Main screens

Welcome / brand intro

Guided wizard

Recommendation results

Compare products

Ask AI follow-up

Find dealer

Lead capture / save results

Branded customization per site

Shared layout, but per-brand:

logo

colors

hero copy

feature terminology

example prompts

default recommendation tone

UX guardrails

mobile-first

under 60 seconds to first recommendation

every answer should reduce choice overload

always expose “show me fewer / simpler / cheaper / larger options”

always expose “talk to a dealer”

11. Deployment model
Recommended architecture

One app, four configurations.

Options:

single hosted app + embedded iframe/widget on all four sites

single codebase + four subdomain deployments

headless frontend package embedded natively in each site

My recommendation:

Phase 1: hosted app + embed

Phase 2: native integration if needed

Why:

fastest to deploy

avoids CMS-specific friction

easiest to QA across 4 brands

easiest rollback

Brand resolution

Use config by:

host domain

explicit brand_id embed param

environment variables

12. Integration plan
Must-have integrations

analytics

lead storage

email/webhook handoff

dealer locator link/handoff

Nice-to-have integrations

CRM

marketing automation

inventory feed

dealer-specific assignment rules

brochure automation

session replay

If no APIs are available

Use:

internal lead table

webhook/email notification

brand-specific CSV export

dealer deep-link with prefilled context where possible

13. Analytics and KPIs

Track:

wizard starts

wizard completion rate

time to recommendation

recommendation acceptance

compare usage

dealer-finder clicks

lead conversion rate

top user questions

top recommendation paths

product recommendation frequency

no-answer / fallback rate

hallucination/error review events

Business KPIs:

qualified lead rate

dealer close-rate lift

reduction in generic inquiry volume

increase in brochure/quote requests from engaged users

better distribution of leads by model fit

14. Security, privacy, and governance

Need:

consent checkbox for lead routing

transcript retention policy

PII encryption at rest

role-based admin access

moderation for free-text fields

prompt/version logging

source-grounding logs for answer audits

AI governance:

no unsupported health claims

no legal/financing promises

no pricing commitments without rules

answer provenance stored internally

15. Implementation plan
Phase 0: discovery and data audit

Duration: 1–2 weeks

Deliverables:

product inventory by brand

field completeness report

dealer-routing requirements

CTA mapping by site

design system token map for 4 brands

approved claims / prohibited claims list

prompt safety rules

Output:

signed data schema

MVP question set

lead-routing decision

Phase 1: data foundation

Duration: 2 weeks

Build:

crawler/import scripts

normalization pipeline

admin QA interface

product/series/feature database

brand config layer

Exit criteria:

90%+ product coverage for pilot brand

no critical missing fields for recommendation logic

repeatable refresh workflow

Phase 2: recommendation MVP

Duration: 2–3 weeks

Build:

wizard UI

deterministic recommendation engine

results page

compare view

basic dealer CTA handoff

analytics instrumentation

Pilot on:

Marquis first, or Nordic first if the client wants a simpler/faster proof using spec-rich pages

Phase 3: grounded AI assistant

Duration: 2 weeks

Build:

RAG/retrieval layer

Gemini prompt orchestration

intent detection

grounded Q&A

conversation logging

safety filters

Exit criteria:

high answer relevance

low hallucination rate

stable structured outputs

Phase 4: lead routing + branded rollout

Duration: 2 weeks

Build:

lead capture flow

summary generation

webhook/email routing

brand themes for all 4 sites

embed package / deployment configs

Exit criteria:

all 4 brands functioning from same core app

QA pass on mobile and desktop

analytics live

Phase 5: optimization

Duration: ongoing

Enhance:

inventory-aware dealer routing

brochure personalization

multilingual support where needed

comparison PDFs

dealer portal

A/B testing of question flow

16. Suggested delivery order

Recommended order:

Marquis

Nordic

Tropic Seas

Artesian

Why:

Marquis and Nordic expose strong public product structures for grounded matching and comparison. Marquis is great for premium therapy storytelling; Nordic is great for spec normalization and plain-language explanation. Tropic is also strong, but slightly more option/configuration-heavy. Artesian’s broader multi-line portfolio makes it a better fourth rollout once the normalization/admin tooling is proven.

17. Engineering spec summary
Frontend

React app or Antigravity-native frontend

brand theme loader

wizard engine

comparison UI

chat UI

dealer CTA / lead forms

analytics hooks

Backend

API for products, recommendations, conversations, leads, dealers

product scoring engine

Gemini orchestration service

retrieval service

admin/content service

event logging

Database

relational DB for products, dealers, leads, brand configs

optional vector index for feature docs / FAQs / manuals

object storage for imported files/images if needed

Jobs

nightly crawl/import

diff detection

content QA alerts

prompt/version validation

lead export/webhook retries

18. Non-functional requirements

first recommendation in under 3 seconds after final answer submission

graceful fallback when AI unavailable

deterministic recommendation available without LLM

mobile responsive across all brand sites

WCAG-conscious accessibility

audit logs for admin changes and AI outputs

versioned prompts and schemas

no brand cross-contamination of catalogs

19. Risks and mitigations
Risk: inconsistent product data across brands

Mitigation: normalized schema + admin enrichment layer + completeness scoring.

Risk: hallucinated AI comparisons

Mitigation: deterministic product selection first, grounded context only, structured outputs, unsupported-answer fallback.

Risk: dealer integration is weak or manual

Mitigation: phase 1 dealer deep-link + lead summary email/webhook.

Risk: four branded experiences create complexity

Mitigation: one core app with theme/config separation, not four independent builds.

Risk: public website data changes

Mitigation: scheduled import jobs + content diff alerts + source URL tracking.

20. Recommendation in one sentence

Build a single multi-tenant, grounded AI buying assistant with four branded configurations, using deterministic product matching plus Gemini-powered explanation, and launch on the richest catalogs first.

Next, I can turn this into a cleaner client-facing technical proposal or a developer-ready PRD with user stories and API endpoints.