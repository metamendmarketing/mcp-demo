# Developer Handover Guide: Marquis Buying Assistant v1.0

This document outlines the "Gold Standard" architecture implemented for the Marquis Buying Assistant (v1.0).

## 🏛 Architecture Overview
The application is built on **Next.js 15 (App Router)** with a **Supabase (Postgres)** backend and **UploadThing v7** for cloud media.

### Core Components
1. **Wizard (`src/components/wizard/Wizard.tsx`)**: 
   - Interactive 14-step discovery flow.
   - Leverages a **Strict AI Registry** for zero-latency exploration of recommendations.
   - Optimized with `React.memo` to handle complex background pre-fetching.
2. **Hotspot Editor (`src/components/admin/HotspotEditor.tsx`)**:
   - High-fidelity property management tool.
   - Uses a **Ref-based Upload Pipeline** for reliable cloud-native synchronization.
3. **Product Detail View (`src/components/products/ProductDetailView.tsx`)**:
   - Implements **Defensive Parsing** (`safeParse`) for all DB-driven JSONB fields (Hotspots, Tags, Colors).

## 🛠 Hardening Standards
- **Strict Typing**: All core domain objects are defined in `src/lib/types.ts`. Avoid using `any` to maintain build integrity.
- **Data Resilience**: Always use the `safeParse` utility when accessing Prisma JSONB fields to handle environment-specific serialization issues.
- **Performance**: High-interaction components are memoized. Wrap heavy event handlers in `useCallback` when extending functionality.
- **Documentation**: Professional JSDoc is required for all exported functions and complex state logic.

## 🚀 Deployment & Build
- **Build Command**: `npm run build` (Ensures Prisma generation and zero-error TS bundling).
- **Environment**: 
  - `UPLOADTHING_TOKEN`: Essential for the media pipeline.
  - `GEMINI_API_KEY`: Required for the recommendation engine's AI refinement.
  - `NEXT_PUBLIC_BASE_PATH`: Configured for `/mcp/demo/` sub-path hosting.

## 🤝 Handover Milestone
Current stable state is tagged in Git as: **`marquis-admin-stable-v1.0`**.
