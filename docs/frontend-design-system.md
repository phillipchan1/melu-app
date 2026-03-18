# Melu Frontend Design System

Implementation-facing distillation of the Melu design rules from the Figma AI Prompt Sheet, onboarding design spec, and Notion source-of-truth pages.

## Core Rules

- **V1 prototype is approve-only** — No swap button anywhere.
- **No calendar sync reference** anywhere in the prototype UI.
- **Bottom nav** only appears on HomeDashboard, ComingUp, and WeeklyPlanView.
- **Bottom nav** has exactly two tabs: This Week and Coming Up.
- **All screens** target 375×812 mobile layout.

## Design Tokens

Use these tokens instead of hardcoded values. Defined in `src/styles/theme.css`.

| Token | CSS Variable | Tailwind Class | Value |
|-------|--------------|---------------|-------|
| Background | `--background` | `bg-background` | #FAF8F5 |
| Primary text | `--foreground` | `text-foreground` | #1C1917 |
| Muted text | `--muted-foreground` | `text-muted-foreground` | #78716C |
| Accent / Sage | `--primary` | `bg-primary`, `text-primary` | #7C9E7A |
| Card background | `--card` | `bg-card` | #FFFFFF |
| Border | `--border` | `border-border` | #E8E5E0 |
| Secondary (AI bubble) | `--secondary` | `bg-secondary` | #F0EFED |
| Page padding | `--page-padding` | `p-page`, `px-page` | 20px |
| Card padding | `--card-padding` | `p-card` | 18px |
| Section gap | `--section-gap` | `gap-section-gap` | 24px |
| Radius (card) | `--radius` | `rounded-lg` | 16px |

## Typography

- **Font**: Plus Jakarta Sans (loaded in `src/styles/fonts.css`)

## Primitives

Build and use shared primitives before screen-specific styling. Import from `src/app/components/design-system/`.

| Primitive | Purpose |
|-----------|---------|
| Button | Primary (52px pill, sage fill) and Secondary (outlined sage) variants |
| Card | White bg, 16px radius, subtle shadow, 18px padding |
| ScreenShell | min-h-screen, bg-background, px-page, max-w-[375px] mx-auto |
| TopBar | Logo + profile avatar |
| BottomNav | This Week / Coming Up tabs |
| ChatBubble | AI (#F0EFED, left) / User (#7C9E7A, right) |
| ResponseChip | Multi-select option chips |
| MealCard | Meal display in plan |
| WeekSummaryCard | Weekly plan summary |
| ProfileRowCard | Profile row in settings |

## Usage Rules

1. **Do not hardcode** one-off colors, spacing, or prohibited UI patterns when a shared token/component should exist.
2. Use `bg-background`, `text-foreground`, `text-muted-foreground`, `bg-primary`, etc. — never raw hex.
3. Use `px-page`, `p-card`, `gap-section-gap` for layout spacing.
4. Prefer primitives over custom markup. If a pattern repeats, extract to a primitive.

## Prohibited Patterns

- Swap button (V1 is approve-only)
- Calendar sync references
- Bottom nav on screens other than HomeDashboard, ComingUp, WeeklyPlanView
