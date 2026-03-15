Use this page every time you open Figma AI. Copy the global system prompt first, paste it into Figma AI to establish the design system. Then copy each screen prompt one at a time and generate screens in order.

---

# How to Use This Page

1. Open Figma. Start a new file called "Melu — V1 Screens".
2. Open Figma AI (Cmd+K → "Generate with AI" or the AI panel).
3. Paste the Global System Prompt below into your first generation to set the design system.
4. Then generate each of the 6 screens using the individual screen prompts.
5. After generating, do your 30–60 min UX review pass before handing to Cursor.

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
- Minimum font size: 15px

COMPONENTS:
- Primary button: full width, border radius 100px (pill), fill #7C9E7A, text white 17px 600, height 52px
- Secondary button: full width, border radius 100px, stroke #7C9E7A 1.5px, text #7C9E7A 17px 400, height 52px, no fill
- Text link (primary): #7C9E7A, 15px, no underline
- Text link (muted): #78716C, 15px, no underline
- Chat bubble (AI): background #F0EFED, corner radius 18px, padding 14px 16px, left-aligned
- Chat bubble (user): background #7C9E7A, text white, corner radius 18px, padding 14px 16px, right-aligned
- Response chip: background #F0EFED, corner radius 100px, padding 12px 20px, text #1C1917 15px 400
- Bottom nav: height 60px, background white, top border #E8E5E0 1px, 2 tabs (Plan + Grocery)
- Nav icon active: #7C9E7A
- Nav icon inactive: #78716C

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
- No icon or logo asset yet — text only

FRAME:
- Mobile: 375 × 812px (iPhone 14 base size)
- Use auto layout throughout
```

---

# Screen Prompts

Generate screens in this order. Each prompt is self-contained — paste it directly into Figma AI after establishing the global system.

---

## Screen 1 — ProfileSetup (Onboarding Chat)

```
Design a mobile screen (375×812px) for Melu, an AI meal planning app.

This is the onboarding screen where the user teaches Melu about their family. It is a chat interface. The user only does this once — the data informs all future meal plans permanently.

LAYOUT:
- Top: "melu" wordmark centered, Plus Jakarta Sans 600, #7C9E7A, 22px. Below it: "Step 2 of 4" in 13px muted text #78716C.
- Middle: chat area showing a conversation in progress (scrollable, approximately 70% of screen height).
- Bottom: fixed input bar — text field with placeholder "Type a message..." and a sage green (#7C9E7A) circular send button with a white arrow icon.

CHAT CONTENT (show this exact conversation, mid-flow):
- AI bubble (left): "Hey, I'm Melu. I'm going to learn your family so every plan I make actually fits your life — not just this week, but every week. This takes about 2 minutes and you'll only do it once."
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
- The three chips are part of the chat thread — not a separate form below it.
- The text input bar is visually de-emphasized since the chips are the primary action.
- Use the global design system: #FAF8F5 background, Plus Jakarta Sans, chat bubble styles as defined.
```

---

## Screen 2 — HomeDashboard (Returning User)

```
Design a mobile screen (375×812px) for Melu, an AI meal planning app.

This is the home dashboard for a returning user who has an active plan this week. It is the default landing screen after the first week. It orients the user: active plan, grocery shortcut, next Sunday nudge.

LAYOUT (top to bottom):

TOP BAR:
- Left: "melu" wordmark, Plus Jakarta Sans 600, #7C9E7A, 22px
- Right: small circular avatar, diameter 32px, background #7C9E7A, white letter "P" centered, 14px 600

GREETING BLOCK (below top bar, 24px margin):
- "Good morning, Phil." — 18px, weight 600, #1C1917
- Below: "This week's plan is set." — 15px, #78716C

THIS WEEK CARD (white card, 16px radius, full width minus 40px margins, 18px internal padding):
- Small caps label above card: "THIS WEEK" — 11px, 600, letter spacing 0.08em, #78716C
- Inside card: 5 rows, each row shows day abbreviation (MON, TUE, WED, THU, FRI) in 12px muted left column and meal name in 15px regular weight right column:
  MON — Sheet Pan Lemon Chicken
  TUE — Beef Tacos
  WED — Pasta Primavera
  THU — Teriyaki Salmon
  FRI — BBQ Chicken Quesadillas
- Divider line between rows, very light (#F0EFED)
- Bottom of card: right-aligned small text link "View full plan →" in #7C9E7A, 14px

NEXT SUNDAY NUDGE (below card, centered, 16px margin top):
- "Next plan generates Sunday." — 13px, #78716C, centered

GROCERY BUTTON (below nudge, 16px margin top):
- Full-width secondary button (outline style): "See this week's groceries"
- Border: #7C9E7A 1.5px, border radius 100px, text #7C9E7A 16px 400, height 52px, background transparent

BOTTOM NAV:
- Plan tab active (calendar icon, #7C9E7A label)
- Grocery tab inactive (cart icon, #78716C label)
```

---

## Screen 3 — WeeklyPlanView (5 Dinner Cards)

```
Design a mobile screen (375×812px) for Melu, an AI meal planning app.

This is the weekly plan view — the "magic moment" where the user sees 5 dinners generated for their week. One primary action. No swap button.

LAYOUT (top to bottom):

HEADER:
- "Your week, sorted." — 24px, weight 600, #1C1917
- Below: "5 dinners, ready to go." — 15px, #78716C

5 MEAL CARDS (stacked vertically, white cards, 16px radius, 18px internal padding, 12px gap between cards):

Each card contains:
- Day label: all caps, 11px, #78716C, letter spacing 0.08em (e.g. "MONDAY")
- Meal name: 20px, weight 600, #1C1917
- One row with two chips side by side:
  - Time chip: clock icon + duration text, background #F0EFED, 13px, #78716C, border radius 100px, padding 4px 10px
  - Cuisine chip: cuisine name, same style
- Ingredient preview: single line, 13px, italic, #78716C

Card data:
1. MONDAY / Sheet Pan Lemon Chicken / 30 min / American / "Chicken, lemon, potatoes, green beans, garlic"
2. TUESDAY / Beef Tacos / 20 min / Mexican / "Ground beef, tortillas, cheddar, lettuce, tomato"
3. WEDNESDAY / Pasta Primavera / 25 min / Italian / "Pasta, bell peppers, broccoli, parmesan, olive oil"
4. THURSDAY / Teriyaki Salmon / 25 min / Asian / "Salmon, teriyaki sauce, rice, broccoli, sesame"
5. FRIDAY / BBQ Chicken Quesadillas / 20 min / American / "Chicken, tortillas, cheddar, BBQ sauce, green onion"

FIXED BOTTOM CTA (sticky, above bottom nav):
- Full-width pill button, background #7C9E7A, white text "Looks good — sync to calendar", 17px 600, height 52px, border radius 100px
- 16px margin from nav bar

BOTTOM NAV:
- Plan tab active (#7C9E7A)
- Grocery tab inactive (#78716C)
```

---

## Screen 4 — ApproveConfirmation

```
Design a mobile screen (375×812px) for Melu, an AI meal planning app.

This is the confirmation screen shown after the user taps "Looks good — sync to calendar." It is a single-focus moment of relief. Nothing to do. Just: done.

LAYOUT:
- No bottom navigation on this screen.
- Content is vertically centered in the middle 60% of the screen.
- Background: #FAF8F5

CENTERED CONTENT (top to bottom, centered horizontally):
- Circle: 52px diameter, fill #E8F0E7 (light sage tint), centered checkmark icon in #7C9E7A, stroke weight 2px
- 20px gap
- Headline: "You're all set." — 26px, weight 600, #1C1917, centered
- 12px gap
- Subtext (two lines, centered): "5 dinners are on your Google Calendar." / "Nobody has to ask what's for dinner this week." — 16px, weight 400, #78716C, line height 1.6, centered
- 32px gap
- Text link: "See your grocery list" — 16px, #7C9E7A, centered, no underline
- 16px gap
- Text link: "View calendar" — 16px, #78716C, centered, no underline

TONE: This screen should feel like a sigh of relief. Spacious. Calm. No list, no card, no summary. Just done.
```

---

## Screen 5 — GroceryList

```
Design a mobile screen (375×812px) for Melu, an AI meal planning app.

This is the grocery list screen. Auto-generated from the approved meal plan. Grouped by category. Simple checkboxes. No editing.

LAYOUT:

HEADER:
- "This week's groceries" — 22px, weight 600, #1C1917
- Below: "From your approved plan • 0/20 items" — 14px, #78716C

GROCERY LIST (scrollable):

Each category:
- Category label: small caps, 11px, weight 600, letter spacing 0.08em, #78716C, 20px margin top
- Items: unchecked circle checkbox (24px, stroke #D6D3CF) + item name (15px, #1C1917) + quantity in parentheses (15px, #78716C). Row height: 48px minimum. Divider between items: #F5F3F0.

Categories and items:

PRODUCE
- Lemons (2)
- Cherry tomatoes (1 pint)
- Bell peppers (2)
- Broccoli (1 head)
- Limes (3)
- Green beans (1 lb)

PROTEINS
- Chicken breasts (2 lbs)
- Ground beef (1 lb)
- Salmon fillets (4)

PANTRY
- Teriyaki sauce (1 bottle)
- Black beans (1 can)
- Pasta (1 box)
- Tortillas (8-pack)
- BBQ sauce (1 bottle)
- Rice (2 cups)

DAIRY
- Shredded cheddar (1 bag)
- Parmesan (small block)

BOTTOM NAV:
- Grocery tab active (#7C9E7A)
- Plan tab inactive (#78716C)
```

---

## Screen 6 — ProfilePreferences

```
Design a mobile screen (375×812px) for Melu, an AI meal planning app.

This is the user's saved taste profile — accessible by tapping the avatar icon on the Home screen. Framed as "what Melu knows about your family," not a settings page.

LAYOUT:

TOP BAR:
- Left: back arrow icon, #1C1917
- Center: "Your Family Profile" — 17px, weight 600, #1C1917
- No bottom nav on this screen

FRAMING TEXT (below header, 20px horizontal margin, 16px top margin):
- "This is what Melu knows about your family. Tap any section to update." — 14px, #78716C, line height 1.5

PREFERENCE CARDS (5 tappable rows, white cards, 16px radius, 18px internal padding, 10px gap between cards):

Each row:
- Left: section label (15px, weight 600, #1C1917)
- Below label: value (15px, weight 400, #78716C)
- Right: chevron icon pointing right, #78716C

Rows:
1. Family — "4 people · Kids ages 7 and 10"
2. Avoid — "No shellfish · Mild only (no spice)"
3. Cook time — "Under 30 min on weeknights"
4. Cuisines you like — "American, Mexican, Italian, Asian"
5. Skill level — "Quick and simple"

FOOTER NOTE (below cards, 24px margin top, centered):
- "Melu updates your profile automatically as you approve and skip meals. You can also edit anything above." — 13px, #78716C, centered, line height 1.5

DESTRUCTIVE ACTION (bottom, centered, above safe area):
- "Reset profile" — 14px, #78716C, centered, no button border
```

---

# Handoff Checklist (Before Sending to Cursor)

Review every frame against this list before importing into Cursor via Figma MCP.

- [ ]  Font is Plus Jakarta Sans throughout — not a substituted system font
- [ ]  Background is #FAF8F5, not pure white (#FFFFFF)
- [ ]  Accent color (#7C9E7A) appears only on: primary buttons, active nav, AI bubbles, checkmarks, links
- [ ]  All cards have 16px border radius and #FFFFFF fill
- [ ]  Bottom nav is 60px tall, present on screens 2, 3, and 5 only
- [ ]  No swap button exists anywhere in the 6 screens
- [ ]  ApproveConfirmation has no bottom nav
- [ ]  ProfilePreferences has no bottom nav
- [ ]  All primary buttons are full-width pill shape, height 52px
- [ ]  Chat bubbles: AI = #F0EFED left, User = #7C9E7A right
- [ ]  Onboarding response chips are inside the chat thread, not below it
- [ ]  Every frame is 375×812px with auto layout enabled
- [ ]  Layer names are clean and match component names (ProfileSetup, HomeDashboard, etc.)

---

*Maintained by Claude COO — updated 2026-03-14*