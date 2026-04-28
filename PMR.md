# Product Master Requirements (PMR)

## Project Vision

Build a powerful AI-first content creation SaaS that starts from a user prompt and generates high-quality, production-ready outputs.  
The product must go beyond standard AI presentation tools by offering stronger generation quality, deeper design control, simpler UX, and broader document types.

---

## Product Goal

The SaaS must allow users to create professional presentations (PowerPoint / Google Slides style) from a single prompt using AI.

This is not only a presentation generator.  
It must evolve into a complete AI content creation platform.

---

## Core Concept

Example prompt:

> "Create a startup pitch about an AI real estate platform"

AI output must generate:

- Structured presentation flow
- Visual layout
- Titles and sections
- Slide structure
- Images (generated, online, or user-uploaded)
- Design style
- Typography
- Final content ready to use

The result must look professional and be immediately usable.

---

## Core User Features

### 1) AI Presentation Generator

AI must generate:

- Slide titles
- Slide content
- Visual structure
- Layout suggestions
- Storytelling logic

User controls:

- Short content
- Medium content
- Very detailed content

Requirement:

- AI must strictly follow the user’s context and intent.

### 2) Image Management System

Users can choose image source:

- AI-generated images
- Online / stock-style images
- User-uploaded images (file, gallery, drag & drop)

System capabilities:

- Automatic image suggestions
- Image replacement
- Image resizing
- Background removal (future feature)

### 3) Multiple Document Types

The platform must support:

- Presentation (slides)
- Whiteboard
- Documents (Notion-like)
- Notes
- Visual pages
- Marketing presentations

### 4) Template System

Large and varied template library:

- Business
- Startup pitch
- Real estate
- Education
- Marketing
- Minimalist
- Modern

User capabilities:

- Select template before generation
- Change template after generation
- Customize colors
- Customize fonts
- Customize style

### 5) Design Control System

Users control:

- Typography
- Font family
- Font style (modern / minimal / business / creative)
- Layout style
- Color palette
- Spacing
- Slide density (simple vs detailed)

Design direction:

- Modern, minimal, clear, Canva-level simplicity.

### 6) Editor Experience

Editor must include:

- Drag-and-drop slides
- Drag-and-drop elements
- Inline text editing
- Easy image replacement
- Block-based editing
- Smooth animations
- Extremely simple UI

Target UX:

- Faster and simpler than Gamma.

### 7) Improvements Over Gamma

Must outperform on:

- AI content quality
- Detail control
- Design control
- Template quantity and quality
- Image workflow
- Document type variety
- Personalization depth
- UX simplicity

### 8) Future Vision

Evolve into an AI engine that transforms an idea into:

- Presentation
- Document
- Visual page
- Marketing content
- Structured content

---

## Developer Mandate

For each implementation cycle:

1. Analyze current codebase state
2. Identify gaps vs PMR
3. Propose architecture updates
4. Build missing modules
5. Improve UI/UX quality
6. Deliver features step-by-step

---

## Tech Stack

- Next.js
- React
- Tailwind CSS
- Modern component architecture
- Scalable SaaS structure

---

## Product Goal (Execution)

Transform this project into the most complete AI presentation and visual content SaaS possible.

---

## PMR Change Log

Use this section to track every newly shipped feature and architecture update.

- 2026-03-15: PMR file created and initialized.
- 2026-03-15: Backend foundation v1 added for PMR:
  - New scalable Prisma domain for AI content platform:
    - `AiDocument` (multi document types)
    - `DocumentBlock` (block-based editor data model)
    - `GenerationJob` (AI generation lifecycle)
    - `MediaAsset` (image source abstraction: AI / stock / upload)
    - Enums for `DocumentType`, `DocumentStatus`, `BlockType`, `ImageSource`, `GenerationStatus`
  - New authenticated API layer for PMR editor and generation:
    - `GET/POST /api/documents`
    - `GET/PATCH/DELETE /api/documents/[id]`
    - `POST /api/documents/[id]/blocks`
    - `PATCH/DELETE /api/documents/[id]/blocks/[blockId]`
    - `POST /api/documents/[id]/blocks/reorder`
    - `GET/POST /api/generation/jobs`
  - Added shared auth guard helper: `src/lib/api-auth.ts`
  - Generation pipeline stub now creates a first structured document with starter blocks and job tracking.
  - Registration backend aligned with current Prisma user model (removed outdated agency/subscription writes).
- 2026-03-15: Prisma runtime/tooling stabilization:
  - Added explicit Prisma dependencies to project (`prisma@6`, `@prisma/client@6`) to avoid accidental Prisma 7 CLI behavior.
  - Added package scripts:
    - `prisma:generate`
    - `prisma:validate`
    - `prisma:migrate`
  - Fixed schema relation consistency:
    - Added `User.presentations` reverse relation.
    - Added `Property.alerts` reverse relation.
  - Schema successfully validates with Prisma 6 when `DATABASE_URL` is set.
- 2026-03-15: Backend v2 shipped (PMR-aligned):
  - Plan/capability system introduced (`src/lib/plans.ts`):
    - normalized subscription -> plan mapping
    - per-plan document-type access
    - per-plan daily generation quotas
    - per-plan export format availability
  - Generation API hardened (`/api/generation/jobs`):
    - enforces plan-based document type permissions
    - enforces daily generation limits
  - New capabilities API:
    - `GET /api/me/capabilities`
  - Image management backend (upload + library):
    - `POST /api/media/upload` (image file upload, persisted as `MediaAsset`)
    - `GET /api/media` (user media library)
  - Document export backend added (important):
    - `GET /api/documents/[id]/export?format=pdf|pptx|json`
    - real PDF export using `pdf-lib`
    - real PowerPoint `.pptx` export using `pptxgenjs`
    - export rights enforced by subscription plan
  - Template visibility endpoint refactored to use centralized plan logic.
- 2026-03-15: Frontend Studio v1 shipped (PMR-aligned):
  - New `Studio` home UX (`/studio`):
    - elegant creation panel with AI topic, document type, detail level
    - plan-aware restrictions surfaced in UI
    - document library list and quick-open flow
  - New block editor page (`/studio/[id]`):
    - drag-and-drop block reordering
    - inline block editing (title, text, bullets, image)
    - add/remove blocks with simple palette
    - direct media upload integration (`/api/media/upload`)
    - native export actions (PDF / PPTX) wired to backend exports
  - Navigation updated to expose the new Studio workflow.
- 2026-03-15: Frontend Studio v2 shipped (premium UX iteration):
  - Added advanced in-editor design control panel:
    - typography selection
    - color palette selection
    - density tuning
    - layout style mode
    - persistence through `PATCH /api/documents/[id]` (`designOptions`)
  - Added live preview panel in the editor:
    - instant visual rendering from current blocks + style controls
    - low-friction, glanceable "final slide feel"
  - Added clearer in-editor paywall / upgrade cues:
    - locked PPTX export messaging for non-eligible plans
    - Starter plan upgrade card (in-context CTA)
  - UX remains intentionally sober, minimal, and youth-friendly while preserving fast block editing.
- 2026-03-15: Frontend Studio v3 shipped (PMR editor depth):
  - Added per-block style controls in editor:
    - alignment
    - emphasis
    - spacing
    - persisted via block `styleJson`
  - Added slide-grouping preview card:
    - automatic grouping heuristic from ordered blocks
    - helps users visualize conversion from blocks to slides
  - Added more micro-interaction polish on draggable block cards (smoother transitions / hover motion).
  - Technical verification pass executed:
    - updated features lint-clean
    - note: at the time, project-wide `type-check` was still noisy due to legacy modules outside Studio; this was later cleaned up (see 2026-04-17 entry).
- 2026-04-17: Studio editor v4 + engineering hygiene:
  - Studio editor now includes a **media gallery** (browse uploads via `GET /api/media`, fast insert into image blocks).
  - Studio editor now includes a **slide thumbnail rail** (same grouping heuristic as the preview; quick jump + scroll + selection sync).
  - Project-wide `npm run type-check` is green again by removing duplicate legacy routes, aligning Prisma-backed types, fixing cron/email mismatches, and restoring Radix/shadcn-style `Select` + missing UI primitives.
