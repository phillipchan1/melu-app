# Figma File

[Open Melu — Complete App Development in Figma](https://www.figma.com/make/DAyFqcBKSqyEt2nGX20voL/Complete-app-development?t=CkF2Y3VMZovfMsat-1)

This is the design source of truth. All screens are generated here via Figma AI, reviewed, and handed to Cursor via Figma MCP.

---

Use this page every time you open Figma AI. Copy the global system prompt first, paste it into Figma AI to establish the design system. Then copy each screen prompt one at a time and generate screens in order.

---

# How to Use This Page

1. Open Figma. Start a new file called "Melu — V1 Screens".
2. Open Figma AI (Cmd+K → "Generate with AI" or the AI panel).
3. Paste the Global System Prompt into your first generation to set the design system.
4. Generate each of the 9 screens using the individual prompts below, in order.
5. Complete the UX review pass before handing to Cursor.

---

# Global System Prompt

Paste this at the start of every Figma AI session before generating any screens.

```
Design system for Melu, an AI meal planning app for busy families.

VISUAL SYSTEM:
- Background: #FAF8F5 (warm off-white)
- Primary text: #1C1917 (deep warm charcoal)
- Secondary / muted text: #78716C
- Accent (primary actions only): #7C9E7A (muted sage green)
- Card background: #FFFFFF, corner radius 16px, shadow: 0 1px 4px rgba(0,0,0,0.06)
- Page background: #FAF8F5

TYPOGRAPHY:
- Font: Plus Jakarta Sans
- H1: 24px, weight 600
- H2: 20px, weight 600
- Body: 15–16px, weight 400
- Label / muted: 13–14px, weight 400, color #78716C
- Small caps label: 11px, weight 600, letter spacing 0.08em, color #78716C
- Minimum font size: 13px

COMPONENTS:
- Primary button: full width, border radius 100px (pill), fill #7C9E7A, text white 17px 600, height 52px
- Secondary button: full width, border radius 100px, stroke #7C9E7A 1.5px, text #7C9E7A 17px 400, height 52px, no fill
- Text link (primary): #7C9E7A, 15px, no underline
- Text link (muted): #78716C, 15px, no underline
- Chat bubble (AI): background #F0EFED, corner radius 18px, padding 14px 16px, left-aligned
- Chat bubble (user): background #7C9E7A, text white, corner radius 18px, padding 14px 16px, right-aligned
- Response chip: background #F0EFED, corner radius 100px, padding 12px 20px, text #1C1917 15px 400
- Bottom nav: height 60px, background white, top border #E8E5E0 1px, 2 tabs only — "This Week" (calendar icon) and "Coming Up" (forward arrow icon)
- Nav icon active: #7C9E7A with label
- Nav icon inactive: #78716C with label

SPACING:
- Horizontal page padding: 20px
- Card internal padding: 18px
- Section gap: 24px
- Element gap within cards: 8–12px

TONE:
- Warm, calm, approachable. Like Headspace meets a home kitchen.
- Not a fitness app. Not a recipe blog. Not clinical.
- Designed for a stressed parent on Sunday evening, one hand holding a phone.

WORDMARK:
- Text: "melu" — Plus Jakarta Sans, weight 600, color #7C9E7A, lowercase, 22px
- No icon or logo asset — text only

FRAME:
- Mobile: 375 × 812px (iPhone 14 base size)
- Use auto layout throughout
```

---

# Screen Prompts

Generate screens in this order. Each prompt is self-contained.

---

## Screen 1 — SplashScreen

```
Design a mobile screen (375×812px) for Melu, an AI meal planning app.

This is the very first screen a new user sees — shown once, never again after onboarding completes. It is a warm, calm orientation that sets the frame before any questions are asked. It is not a feature tour. It is the beginning of a relationship.

LAYOUT:
- Background: #FAF8F5
- No bottom nav. No back arrow. No progress indicator.
- Content is vertically centered, slightly above true center (upper 55% of screen).

CONTENT (top to bottom, all centered horizontally):
- Wordmark: "melu" — Plus Jakarta Sans, 600, #7C9E7A, 26px. Top anchor of content block.
- 32px gap
- Headline (24px, weight 600, #1C1917, centered, line height 1.3, max-width 280px):
  "Dinner, planned.
  Every week. In 60 seconds."
- 20px gap
- Body text (16px, weight 400, #78716C, centered, line height 1.6, max-width 300px):
  "To plan for you, Melu needs to know your family — who you're feeding, what you love, and what's off the table. It takes about 2 minutes. You'll never need to do it again."
- 40px gap
- Primary CTA button: full-width pill, fill #7C9E7A, white text "Let's get started", 17px 600, height 52px, border radius 100px. Horizontal margin 20px each side.
- 16px gap below button
- Muted subtext (13px, #78716C, centered): "No account needed to try it."

TONE: Spacious. Warm. Confident. The user should feel relief before they even answer a question.
```

---

## Screen 2 — OnboardingChat

```
Design a mobile screen (375×812px) for Melu, an AI meal planning app.

This is the onboarding chat — where the user teaches Melu about their family. One-time only. Every question maps to a structured profile field. The framing must feel permanent and relational, not like a form.

LAYOUT:
- Top bar: "melu" wordmark centered, Plus Jakarta Sans 600, #7C9E7A, 22px. No progress indicator.
- Chat area: scrollable, approximately 70% of screen height.
- Bottom: fixed input bar — text field with placeholder "Type a message..." and a sage green (#7C9E7A) circular send button with white arrow. Input bar is visually secondary since chips are the primary action.

CHAT CONTENT (show this conversation, mid-flow):
- AI bubble (left): "Hey — before I build your first plan, I want to learn your family. Who you're feeding, what's off the table, how much time you actually have. This takes about 2 minutes. You'll never need to do it again."
- AI bubble (left): "How many people are you cooking for, and how old are the kids?"
- User bubble (right): "4 of us — 2 kids, ages 7 and 10."
- AI bubble (left): "Got it. Any foods that are completely off the table? Allergies, strong dislikes, anything the kids refuse?"
- User bubble (right): "No shellfish. My 7-year-old won't touch anything spicy."
- AI bubble (left): "Noted — I'll keep everything mild and shellfish-free. On a typical weeknight, how much time do you actually have to cook?"
- Below the last AI bubble: three stacked response chips (rounded pill, background #F0EFED, text #1C1917 15px):
  Chip 1: "Under 30 min — keep it quick"
  Chip 2: "30–45 min — I can manage"
  Chip 3: "45 min+ — I like to cook"

NOTES:
- The three chips are part of the chat thread — not a separate section below it.
- Use the global design system chat bubble styles.
- No bottom nav on this screen.
```

---

## Screen 3 — WeeklyCheckIn

```
Design a mobile screen (375×812px) for Melu, an AI meal planning app.

This is the weekly check-in chat — shown every Sunday before generating the week's plan. Melu already knows this family. This chat only captures what is different this week. It must feel fast, familiar, and lightweight — like a 10-second conversation with someone who already knows you.

LAYOUT:
- Top bar: "melu" wordmark centered, Plus Jakarta Sans 600, #7C9E7A, 22px. No progress indicator. No back arrow.
- Chat area: scrollable, approximately 70% of screen height.
- Bottom: fixed input bar — same as OnboardingChat.

CHAT CONTENT (show this exact conversation):
- AI bubble (left): "Hey Phil — ready to plan this week. Anything I should know before I build your dinners?"
- User bubble (right): "We have soccer Thursday so something really fast that night."
- AI bubble (left): "Got it — I'll put a 20-minute meal on Thursday. Anything else, or should I start building?"
- Below last AI bubble: two response chips side by side:
  Chip 1: "Build my plan"
  Chip 2: "One more thing..."

NOTES:
- No orientation copy. No profile questions. Melu already knows this user.
- The visual is nearly identical to OnboardingChat — same component, different content and energy.
- No bottom nav on this screen.
```

---

## Screen 4 — HomeDashboard

```
Design a mobile screen (375×812px) for Melu, an AI meal planning app.

This is the home screen for a returning user with an active plan. It is the default landing screen every time the app opens after onboarding. It must feel like a control center — calm, oriented, everything handled.

LAYOUT (top to bottom):

TOP BAR:
- Left: "melu" wordmark, Plus Jakarta Sans 600, #7C9E7A, 22px
- Right: circular avatar, 32px diameter, fill #7C9E7A, white letter "P" centered, 14px 600

GREETING BLOCK (24px below top bar):
- "Good morning, Phil." — 18px, weight 600, #1C1917
- Below: "This week's plan is set." — 15px, #78716C

THIS WEEK CARD (white card, 16px radius, full width minus 40px margins, 18px internal padding):
- Small caps label above: "THIS WEEK" — 11px, 600, letter spacing 0.08em, #78716C
- 7 rows inside card (Mon through Sun), each row:
  - Day abbreviation left column: MON, TUE, WED, THU, FRI, SAT, SUN — 12px, #78716C
  - Meal name right column: 15px, #1C1917, weight 400
  - Light divider line between rows: #F5F3F0
- Meal data:
  MON — Sheet Pan Lemon Chicken
  TUE — Beef Tacos
  WED — Pasta Primavera
  THU — Teriyaki Salmon
  FRI — BBQ Chicken Quesadillas
  SAT — Slow Cooker Pulled Pork
  SUN — One-Pan Roast Chicken
- Bottom of card: right-aligned text link "View full plan →" — #7C9E7A, 14px

NEXT SUNDAY NUDGE (below card, 16px margin):
- "Next plan generates Sunday." — 13px, #78716C, centered

BOTTOM NAV:
- "This Week" tab active (calendar icon, #7C9E7A)
- "Coming Up" tab inactive (forward arrow icon, #78716C)
```

---

## Screen 5 — ComingUp

```
Design a mobile screen (375×812px) for Melu, an AI meal planning app.

This is the "Coming Up" tab — the second nav tab. Shows the status of next week's plan. In the most common mid-week state, the plan hasn't been generated yet. Melu will generate it on Sunday. The user can trigger it early if they want.

LAYOUT:
- Top bar: "melu" wordmark left, avatar right (same as HomeDashboard)
- Background: #FAF8F5

MAIN CONTENT (vertically centered in middle of screen, all centered horizontally):
- Label: "NEXT WEEK" — 11px, weight 600, letter spacing 0.08em, #78716C, centered
- 12px gap
- Heading: "Your next plan isn't ready yet." — 20px, weight 600, #1C1917, centered
- 12px gap
- Subtext: "Melu will build it Sunday morning. Want it now?" — 15px, #78716C, centered, line height 1.5, max-width 280px
- 32px gap
- Primary button: "Generate this week's plan now" — full-width pill, fill #7C9E7A, white text 17px 600, height 52px. Horizontal margin 20px.
- 16px gap
- Muted subtext below button: "Melu will use your profile and this week's approvals." — 13px, #78716C, centered

BOTTOM NAV:
- "Coming Up" tab active (forward arrow icon, #7C9E7A)
- "This Week" tab inactive (calendar icon, #78716C)
```

---

## Screen 6 — WeeklyPlanView

```
Design a mobile screen (375×812px) for Melu, an AI meal planning app.

This is the weekly plan view — the magic moment where the user sees 7 dinners generated for their week. One primary action: approve. No swap button.

LAYOUT (top to bottom):

HEADER:
- "Your week, sorted." — 24px, weight 600, #1C1917
- Below: "7 dinners, ready to go." — 15px, #78716C

7 MEAL CARDS (stacked vertically, white cards, 16px radius, 18px internal padding, 12px gap between cards):

Each card contains:
- Day label: all caps, 11px, #78716C, letter spacing 0.08em (e.g. "MONDAY")
- Meal name: 20px, weight 600, #1C1917
- One row with two chips side by side:
  - Time chip: clock icon + duration, background #F0EFED, 13px, #78716C, border radius 100px, padding 4px 10px
  - Cuisine chip: cuisine name, same style
- Ingredient preview: single line, 13px, italic, #78716C
- Reason tag: one line below ingredients, 12px, #7C9E7A (sage green), no background, prefixed with a small checkmark glyph. This is why Melu picked this meal.

Card data:
1. MONDAY / Sheet Pan Lemon Chicken / 30 min / American / "Chicken, lemon, potatoes, green beans, garlic" / Reason: "Under 30 min — fits your weeknights."
2. TUESDAY / Beef Tacos / 20 min / Mexican / "Ground beef, tortillas, cheddar, lettuce, tomato" / Reason: "Your kids approved this twice."
3. WEDNESDAY / Pasta Primavera / 25 min / Italian / "Pasta, bell peppers, broccoli, parmesan, olive oil" / Reason: "Mild and family-friendly."
4. THURSDAY / Teriyaki Salmon / 25 min / Asian / "Salmon, teriyaki sauce, rice, broccoli, sesame" / Reason: "Phil, you gave this a thumbs up."
5. FRIDAY / BBQ Chicken Quesadillas / 20 min / American / "Chicken, tortillas, cheddar, BBQ sauce, green onion" / Reason: "Fast — under 20 min."
6. SATURDAY / Slow Cooker Pulled Pork / 15 min active / American / "Pork shoulder, BBQ sauce, slider buns, coleslaw" / Reason: "Weekend — more time, crowd-pleaser."
7. SUNDAY / One-Pan Roast Chicken / 20 min active / American / "Whole chicken, potatoes, rosemary, garlic, lemon" / Reason: "Sunday dinner — simple, satisfying."

FIXED BOTTOM CTA (sticky, above bottom nav):
- Full-width pill button, fill #7C9E7A, white text "Looks good — approve this week", 17px 600, height 52px, border radius 100px, horizontal margin 20px

BOTTOM NAV:
- "This Week" tab active (#7C9E7A)
- "Coming Up" tab inactive (#78716C)
```

---

## Screen 7 — ApproveConfirmation

```
Design a mobile screen (375×812px) for Melu, an AI meal planning app.

This is the confirmation screen shown after the user taps "Looks good — approve this week." It is a single moment of relief. No calendar. No summary. Just: done.

LAYOUT:
- No bottom navigation.
- Content vertically centered in the middle 60% of the screen.
- Background: #FAF8F5

CENTERED CONTENT (top to bottom, all centered horizontally):
- Circle: 52px diameter, fill #E8F0E7 (light sage tint), centered checkmark icon in #7C9E7A, stroke weight 2px
- 20px gap
- Headline: "You're all set." — 26px, weight 600, #1C1917, centered
- 12px gap
- Subtext (two lines, centered): "Your 7 dinners are set." / "Nobody has to ask what's for dinner this week." — 16px, weight 400, #78716C, line height 1.6
- 32px gap
- Text link: "See your grocery list" — 16px, #7C9E7A, centered (leads to GroceryComingSoon)
- 16px gap
- Text link: "Back to this week" — 16px, #78716C, centered

TONE: Spacious. Still. The work is done.
```

---

## Screen 8 — GroceryComingSoon

```
Design a mobile screen (375×812px) for Melu, an AI meal planning app.

This is a placeholder screen shown when the user taps "See your grocery list." The grocery list feature is not built yet. The screen should feel honest and warm — not like an error. It should reassure the user that their plan is saved and this feature is coming.

LAYOUT:
- No bottom nav.
- Content vertically centered.

CENTERED CONTENT:
- Heading: "Grocery list" — 20px, weight 600, #1C1917, centered
- 16px gap
- Body: "This is coming very soon. Your approved plan is saved and ready." — 15px, #78716C, centered, line height 1.6, max-width 280px
- 32px gap
- Text link: "Back to this week" — 16px, #7C9E7A, centered
```

---

## Screen 9 — ProfilePreferences

```
Design a mobile screen (375×812px) for Melu, an AI meal planning app.

This is the user's family profile — accessible by tapping the avatar in the top right of the Home screen. Framed as "what Melu knows about your family." Not a settings page.

LAYOUT:

TOP BAR:
- Left: back arrow icon, #1C1917
- Center: "Your Family Profile" — 17px, weight 600, #1C1917
- No bottom nav on this screen

FRAMING TEXT (below header, 20px horizontal margin, 16px top margin):
- "This is what Melu knows about your family. Tap any section to update." — 14px, #78716C, line height 1.5

PREFERENCE CARDS (5 tappable rows, white cards, 16px radius, 18px internal padding, 10px gap):

Each row:
- Left: section label (15px, weight 600, #1C1917) with value below (15px, weight 400, #78716C)
- Right: chevron icon, #78716C

Rows:
1. Family — "4 people · Kids ages 7 and 10"
2. Avoid — "No shellfish · Mild only (no spice)"
3. Cook time — "Under 30 min on weeknights"
4. Cuisines you like — "American, Mexican, Italian, Asian"
5. Skill level — "Quick and simple"

FOOTER NOTE (below cards, 24px margin top, centered):
- "Melu learns from every plan you approve. You can also edit anything above." — 13px, #78716C, centered, line height 1.5

DESTRUCTIVE ACTION (bottom, centered):
- "Reset profile" — 14px, #78716C, centered, no button border
```

---

# Handoff Checklist (Before Sending to Cursor)

Review every frame against this list before importing into Cursor via Figma MCP.

- [ ]  Font is Plus Jakarta Sans throughout — not a substituted system font
- [ ]  Background is #FAF8F5, not pure white
- [ ]  Accent color (#7C9E7A) appears only on: primary buttons, active nav, AI chat bubbles, checkmarks, reason tags, primary links
- [ ]  All cards have 16px border radius and #FFFFFF fill
- [ ]  Bottom nav is 60px tall, labeled "This Week" and "Coming Up" — present on HomeDashboard, ComingUp, and WeeklyPlanView only
- [ ]  No swap button exists anywhere
- [ ]  No calendar sync reference exists anywhere
- [ ]  ApproveConfirmation has no bottom nav
- [ ]  OnboardingChat has no bottom nav
- [ ]  WeeklyCheckIn has no bottom nav
- [ ]  GroceryComingSoon has no bottom nav
- [ ]  ProfilePreferences has no bottom nav
- [ ]  SplashScreen has no bottom nav
- [ ]  WeeklyPlanView shows 7 meal cards (Mon–Sun), each with a reason tag in #7C9E7A
- [ ]  HomeDashboard shows 7 meal rows (Mon–Sun) in the This Week card
- [ ]  All primary buttons are full-width pill shape, height 52px
- [ ]  Chat bubbles: AI = #F0EFED left-aligned, User = #7C9E7A right-aligned
- [ ]  Onboarding response chips are inside the chat thread, not below it
- [ ]  Every frame is 375×812px with auto layout enabled
- [ ]  Layer names match component names exactly: SplashScreen, OnboardingChat, WeeklyCheckIn, HomeDashboard, ComingUp, WeeklyPlanView, ApproveConfirmation, GroceryComingSoon, ProfilePreferences

---

*Maintained by Claude COO — updated 2026-03-15*