# Next-Generation ALM Experience Redesign

A full reinvention of the existing RequireQA MVP into a 2030-grade engineering platform. No new features, no new data — only existing modules, fields, entities, and workflows reorganized into a premium, cinematic, workspace-driven experience.

## Guiding Principles

- **One workspace, zero page-jumps.** Replace navigation hops with layered panels, peek views, and command-driven flows.
- **Context over chrome.** The current selection (project, requirement, test case, defect) drives what surfaces; nav fades when work begins.
- **Progressive disclosure.** Summary → detail → deep-edit as expanding layers, never new pages.
- **Motion as meaning.** Shared-element transitions, spring-based panel choreography, focus dimming.
- **Speed as a feature.** Global command palette (⌘K) becomes the primary navigation; keyboard-first.

## New Information Architecture

Collapse the current 9 top-level routes into **4 surfaces**:

```
┌─ Sidebar (collapsed icon rail, expandable) ──────────────────────────┐
│  ⌘  Command          ← global palette / search / navigation         │
│  ◎  Home             ← personal mission control                     │
│  ▣  Workspace        ← active project: requirements · tests · defects│
│       └ contextual sub-rail switches by entity type                 │
│  ⤳  Traceability     ← graph + matrix unified                       │
│  ⚙  Admin            ← settings · integrations · users · roles      │
└──────────────────────────────────────────────────────────────────────┘
```

- Top dark nav → removed. Replaced by collapsible left rail + breadcrumb-less context header.
- Settings sub-pages, Integrations, Reports, Defects, Activities → folded into Workspace + Admin via tabs/panels.
- Reports → contextual overlay on Home and Workspace, not a separate route.

## Workspace Model (the heart of the redesign)

A single split-pane canvas reused across Requirements, Test Cases, and Defects:

```
┌─ Context header (project · entity type · filters · view switcher) ─┐
├─ Tree / List ──┬─ Canvas (cards · table · kanban · graph) ─┬─ Peek ┤
│  resizable     │   morphs by view mode                     │ panel │
│  hierarchical  │   selecting a row slides Peek in          │  →    │
└────────────────┴────────────────────────────────────────────┴───────┘
```

- **View modes**: List · Board · Graph · Timeline. Smooth morph transitions between them (shared-layout animation on IDs).
- **Peek panel**: replaces today's Single Requirement page. Slides in from right with full detail, tabs (Overview · Relationships · Tests · Defects · History · Compliance). Click "Expand" → it grows to a full focus mode (current page dims, peek becomes centered modal-sheet).
- **Inline edit everywhere**: no separate "edit" screen. Fields become editable on hover.

## Command Palette (⌘K) — Primary Navigation

- Fuzzy search across projects, requirements, tests, defects, users, settings.
- Action verbs: "Assign…", "Map requirement…", "Compare versions…", "Open test case…".
- Replaces: top nav search, breadcrumb tab bar, the multi-step "User Selection" wizard (now a single palette flow with chips).

## Per-Module Transformations

### Home → Mission Control
- Hero "Today" panel: assigned items, review queue, recent activity in one scrollable feed.
- Project cards reflow as a bento grid (health · velocity · risk) with hover-reveal sparklines.
- Reports widgets move here as draggable tiles.

### Projects → Workspace launcher
- Replace list page with a spotlight gallery (project cards, cmd-K to switch).
- "New project" 4-step wizard → single scrolling sheet with auto-advance sections.

### Requirements → Tree + Canvas + Peek
- Hierarchical tree on left (current sidebar style) + canvas on right.
- Version compare moves into Peek panel "History" tab — diff renders inline, no separate page.
- "Map Requirement" → drag from one card onto another, or via ⌘K verb.

### Test Cases → Unified composer
- Test Case Page 1 + Page 2 merged into one progressively expanding composer.
- Meta row collapses to chips after fill; steps grid expands on demand.
- Save is auto-save with subtle status pill (no green Save button).

### Defects → Same workspace shell
- Reuses canvas. Severity/status as color-coded chips with the existing palette.

### Traceability → Single graph-first surface
- Default to interactive force-directed graph (Recharts/SVG) of upstream/downstream/test/defect/compliance links.
- Toggle to matrix view with the same shared-element transition.

### Integrations & Settings → Admin hub
- Single page with left rail (Users · Roles · Permissions · Admin · Jira · Polarion · Azure).
- Each section a panel, not a route — smooth crossfade.

## Motion Language

- **Spring presets**: `stiffness: 300, damping: 30` for panels; `200/20` for hover.
- **Shared layout** (framer-motion `layoutId`) for entity cards moving between list/board/graph and into Peek.
- **Focus mode**: rest of UI dims to 30% opacity, scales 0.98.
- **Page transitions**: 200ms crossfade with 8px y-translate.
- **Loading**: skeleton shimmer using existing `pulse-soft` keyframe.

## Visual System (extends current tokens)

- Keep Tri9t green primary, dark surface tokens.
- Add: `--surface-elevated`, `--surface-overlay`, `--ring-focus`, glass blur tokens.
- Typography: tighten to 3 sizes for body, display weight 600 for entity titles.
- Density toggle (Comfortable / Compact) in user prefs.

## Implementation Phases

1. **Foundation** — new `WorkspaceShell` (left rail + context header + canvas + peek), motion primitives, command palette (`cmdk`), token additions.
2. **Home + Projects** — mission control bento, spotlight launcher.
3. **Requirements workspace** — tree + canvas (list/board/graph morph) + peek with tabs (including version compare + mapping).
4. **Test Cases composer** — unified progressive form replacing Page 1/2.
5. **Defects + Traceability** — reuse workspace shell; build graph view.
6. **Admin hub** — fold Settings + Integrations into one panelized page.
7. **Polish** — shared-layout transitions, focus mode, density toggle, keyboard shortcuts overlay.

## Technical Details

- Add `cmdk` for command palette, `framer-motion` already installed for shared-layout/spring animations.
- New components: `WorkspaceShell`, `LeftRail`, `ContextHeader`, `PeekPanel`, `CanvasView` (with `ListView`/`BoardView`/`GraphView`/`TimelineView` children), `CommandPalette`, `EntityCard`, `InlineField`.
- Reuse existing `mock-data.ts`; no data shape changes.
- Routes collapse: keep `/`, `/workspace/$projectId`, `/traceability`, `/admin/*`. Old routes redirect.
- Tokens added to `src/styles.css` under existing `@theme inline` block.
- No new dependencies beyond `cmdk`.

## Out of Scope (per your rules)

No new modules, fields, AI features, entities, permissions, or data. Compliance frameworks, defect fields, requirement fields, role types — all preserved verbatim.

---

Approve and I'll start with **Phase 1 (Foundation)** — the `WorkspaceShell`, command palette, motion primitives, and token additions — then proceed phase by phase.
