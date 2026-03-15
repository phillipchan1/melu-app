> **Status: SPEC UPDATED — v4. MVP scope reset. 7 dinners Mon–Sun. Grocery list cut. Two-tab nav locked (This Week + Coming Up). History deferred to V1.1. Figma redo required.**
> 

---

# Figma File (Design Source of Truth)

[Melu — Complete App Development](https://www.figma.com/make/DAyFqcBKSqyEt2nGX20voL/Complete-app-development?t=CkF2Y3VMZovfMsat-1)

All screens live here. Generated via Figma AI using the spec below. Reviewed by founder. Handed to Cursor via Figma MCP. Do not build from spec prose alone — build from the Figma frames.

---

# Role

You are the design agent for Melu. Translate this spec into React components using [v0.dev](http://v0.dev). Output must be Cursor-importable. Use the exact sample data provided. No lorem ipsum. No generic UI dumps. Every screen is designed for a stressed parent on their phone Sunday evening.

# Required Reading Before Starting

- Executive Summary: [Executive Summary](https://www.notion.so/Executive-Summary-323e2f0e7760815aa6cecfa589553e6b?pvs=21)
- Product Strategy & Value Analysis: [Product Strategy & Value Analysis](https://www.notion.so/Product-Strategy-Value-Analysis-323e2f0e77608173858dc9433e8ba478?pvs=21)
- User Personas: [User Personas](https://www.notion.so/User-Personas-323e2f0e776081fe9fe0e8945b9e0bfe?pvs=21)
- User Discovery: [User Discovery & Interview Guide](https://www.notion.so/User-Discovery-Interview-Guide-323e2f0e776081aa8a4aea31989bf19a?pvs=21)

# Design Principles

1. Calm, not clever. Design for relief, not delight.
2. Mobile-first. iPhone, portrait, one-handed, Sunday evening.
3. 60-second bar. Every screen removes friction. If it adds a tap with no payoff, cut it.
4. Approachable warmth. Headspace meets a home kitchen. Not a fitness app.
5. No recipe browsing. This is not a discovery product.
6. Prototype scope: no swap flow. Approve-only.

# Visual System

- Background: #FAF8F5 (warm off-white)
- Text: #1C1917 (deep warm charcoal)
- Primary accent: #7C9E7A (muted sage green) — used for primary buttons, active states, AI chat bubbles, checkmarks only
- Secondary text / muted labels: #78716C
- Card background: #FFFFFF, border-radius 16px, box-shadow: 0 1px 4px rgba(0,0,0,0.06)
- Font: Plus Jakarta Sans (import from Google Fonts). Headers: 600. Body: 400. Min size: 15px.
- Primary buttons: full-width, pill shape (border-radius 100px), sage green fill, white text, 17px, 600 weight
- Chat bubbles: AI = #F0EFED background, left-aligned. User = #7C9E7A background, white text, right-aligned. Both: border-radius 18px, 15px padding.
- Bottom nav: 2 tabs — This Week (calendar icon) and Coming Up (forward arrow or clock icon). Active tab: sage green icon + label. Inactive: #78716C. Height: 60px, white background, subtle top border. No grocery tab. No history tab.
- Spacing: generous. Minimum 20px horizontal page padding. Cards have 18px internal padding.
- Wordmark: "melu" — Plus Jakarta Sans, 600, #7C9E7A, lowercase, 22px. No icon, no logo asset yet.

# Screen Inventory

6 screens total. Generate each as a separate self-contained React component with hardcoded sample data. Default export. Named as specified below. Mobile width: 375px assumed, not brittle at 390–430px.

---

## Screen 1: OnboardingChat (First-Time Only)

**Purpose:** Build the user's permanent Family Profile. This is a one-time flow. Every question is a structured data event — the output is a JSON profile object, not just conversation history. The framing must communicate permanence and personalization, not task completion.

**Architectural note:** Output of this chat maps to a structured Family Profile object. Questions are designed to produce discrete, storable values (headcount, ages, restrictions, cook time, cuisine preferences, skill level). Free-form text is parsed and structured server-side. This is data collection disguised as conversation.

**Layout:** Full-screen chat interface.

- Top bar: "melu" wordmark centered. No progress indicator on first screen — orientation comes from the intro message.
- Chat area: scrollable, takes up ~75% of screen height.
- Bottom: fixed input bar — text field placeholder "Type a message..." with send button (sage green circle, white arrow). De-emphasized when option chips are the primary input.

**Orientation message (first AI message — shown before any questions):**

"Hey, I'm Melu. Before I make your first plan, I want to learn your family — who you're feeding, what's off the table, how much time you actually have. This takes about 2 minutes. You'll never need to do it again."

This message is the warm orientation. It sets the frame: this is a one-time setup that makes everything work better. It is not a welcome screen. It is not a tutorial. It is the beginning of the relationship.

**Chat sequence to show (mid-flow state — first two answered, third in progress):**

AI: "How many people are you cooking for, and how old are the kids?"

User: "4 of us — 2 kids, ages 7 and 10."

AI: "Got it. Any foods that are completely off the table? Allergies, strong dislikes, anything the kids refuse?"

User: "No shellfish. My 7-year-old won't touch anything spicy."

AI: "Noted — I'll keep everything mild and shellfish-free. On a typical weeknight, how much time do you actually have to cook?"

**Three tappable option chips (inside the chat flow, styled as response chips):**

- "Under 30 min — keep it quick"
- "30–45 min — I can manage"
- "45 min+ — I like to cook"

**Key detail:** The option chips sit inside the chat thread as the AI's follow-up — they are not a separate form element. They look like tappable chat response options. The text input bar is visible but visually secondary to the chips.

---

## Screen 1b: WeeklyCheckIn (Recurring — Every Sunday)

**Purpose:** Lightweight context collection before generating the weekly plan. This is not re-onboarding. Melu already knows the family. This chat only asks what is different this week — schedule changes, budget, anyone sick, anything special. Ends with plan generation.

**Architectural note:** This chat outputs a weekly context delta — a small JSON patch on top of the standing Family Profile. It should never re-ask standing profile questions. The system prompt for this chat receives the existing profile as context.

**Layout:** Same full-screen chat interface as OnboardingChat. Visually identical — same component, different system prompt and opening message.

**Opening AI message:**

"Hey Phil — ready to plan this week. Anything I should know before I build your dinners?"

This message is intentionally brief. Melu knows the family. The question is open-ended to surface one-off context: travel, tight nights, a birthday, a budget week. If the user says "nope" or "all good," the plan generates immediately.

**Example chat sequence to show (user has a busy Thursday):**

AI: "Hey Phil — ready to plan this week. Anything I should know before I build your dinners?"

User: "We have soccer Thursday so something really fast that night."

AI: "Got it — I'll put a 20-minute meal on Thursday. Generating your plan now."

**Transition:** After context is collected (or skipped), the chat transitions directly to the WeeklyPlanView. No intermediate screen.

**Key distinction from OnboardingChat:** No progress indicator. No orientation copy. No chips for standing preferences — those are already in the profile. Chips may appear only for genuinely binary week-specific options (e.g., "Budget week?" with Yes / No chips).

---

## Screen 2: HomeDashboard

**Purpose:** The default landing screen for returning users. Orients the user: do I have a plan, what is it, when is next Sunday. This is the product's home — it must feel like a control center, not a blank page.

**State shown: Active plan exists (most common returning state).**

**Layout:** Vertical scroll. Top bar has "melu" wordmark left-aligned and a small circular avatar icon right-aligned (sage green background, white "P" initial — this is the entry point to Profile/Preferences).

**Sections top to bottom:**

1. Greeting block: "Good morning, Phil." (18px, 600) — below it in muted text: "This week's plan is set."
2. This Week card (white card, full width):
    - Label: "THIS WEEK" in small caps, muted, above
    - 5 mini meal rows — each row: day abbreviation (MON, TUE...) in muted small text, meal name in 15px regular weight
    - MON — Sheet Pan Lemon Chicken
    - TUE — Beef Tacos
    - WED — Pasta Primavera
    - THU — Teriyaki Salmon
    - FRI — BBQ Chicken Quesadillas
    - Bottom of card: a small muted text link — "View full plan →"
3. Next Sunday block: "Next plan generates Sunday." — muted subtext, small, centered below the card.
4. Grocery nudge: a secondary (outline style, not filled) button — "See this week's groceries" — sage green text, sage green border, full width, pill shape.

**Bottom nav:** This Week tab active (calendar icon, sage green).

---

## Screen 2b: ComingUp

**Purpose:** Shows the next week's plan status. If the plan is not yet generated, shows a preview nudge and an option to generate early. If generated, shows a summary card. This tab signals that Melu is always working ahead — the user is just peeking.

**State shown: Plan not yet generated (most common state mid-week).**

**Layout:** Centered content. Minimal. No cards yet.

- Heading: "Next week" (20px, 600)
- Subtext: "Your next plan generates Sunday morning. Want it early?" (15px, #78716C, centered)
- Primary button: "Generate this week's plan now" — sage green, full-width pill
- Below button, small muted text: "Melu will use your profile and this week's approvals."

**State shown (alternate — plan already generated):** Same layout as This Week dashboard card, but labeled "NEXT WEEK" and without the approve CTA. Instead: "Approve when ready →" link.

**Bottom nav:** Coming Up tab active.

---

## Screen 3: WeeklyPlanView

**Purpose:** The full plan display. 5 dinner cards. One primary action. This is the "magic moment" — the user sees the week handled.

**Top:** "Your week, sorted." (24px, 600). Subtext: "5 dinners, ready to go." (muted, 15px).

**5 cards stacked vertically.** Each card:

- Day label (MONDAY, TUESDAY...) — 11px, all caps, #78716C, above meal name
- Meal name — 20px, 600, #1C1917
- Two chips on one row: clock icon + "30 min" and a cuisine tag ("American", "Mexican", etc.) — both in #F0EFED background, 13px, rounded pill, #78716C text
- Single-line ingredient preview — 14px, #78716C, italic
- Reason tag — one line below ingredient preview. Small text, 12px, #7C9E7A (sage green), no background. Prefixed with a subtle spark or checkmark glyph. This is the personalization signal made visible. It tells the user exactly why Melu picked this meal.

Reason tag copy rules: short, plain language, one clause. Examples: "Your kids approved this twice." / "Under 30 min — fits your weeknights." / "Budget-friendly this week." / "No shellfish, mild heat." / "Phil, you gave this a thumbs up."

Sample data:

- MONDAY / Sheet Pan Lemon Chicken / 30 min / American / "Chicken, lemon, potatoes, green beans, garlic" / Reason: "Under 30 min — fits your weeknights."
- TUESDAY / Beef Tacos / 20 min / Mexican / "Ground beef, tortillas, cheddar, lettuce, tomato" / Reason: "Your kids approved this twice."
- WEDNESDAY / Pasta Primavera / 25 min / Italian / "Pasta, bell peppers, broccoli, parmesan, olive oil" / Reason: "Mild and family-friendly."
- THURSDAY / Teriyaki Salmon / 25 min / Asian / "Salmon, teriyaki sauce, rice, broccoli, sesame" / Reason: "Phil, you gave this a thumbs up."
- FRIDAY / BBQ Chicken Quesadillas / 20 min / American / "Chicken, tortillas, cheddar, BBQ sauce, green onion" / Reason: "Fast — under 20 min."
- SATURDAY / Slow Cooker Pulled Pork / 15 min active / American / "Pork shoulder, BBQ sauce, slider buns, coleslaw" / Reason: "Weekend — more time, crowd-pleaser."
- SUNDAY / One-Pan Roast Chicken / 20 min active / American / "Whole chicken, potatoes, rosemary, garlic, lemon" / Reason: "Sunday dinner — simple, satisfying."

**Fixed bottom CTA:** Full-width pill button, sage green, "Looks good — sync to calendar". Positioned above the bottom nav, sticky.

**Bottom nav:** This Week tab active.

---

## Screen 4: ApproveConfirmation

**Purpose:** The close. Single focus. Relief, not summary.

**Layout:** Centered vertically on screen. No bottom nav on this screen — this is a transitional moment.

**Content top to bottom:**

- Checkmark in a sage green circle (~52px diameter) — centered
- "You're all set." — 26px, 600, centered, 16px margin below checkmark
- "5 dinners are on your Google Calendar.nNobody has to ask what's for dinner this week." — 16px, #78716C, centered, line height 1.6
- 32px gap
- Text link (sage green, no button border): "See your grocery list"
- 16px gap
- Text link (muted #78716C): "View calendar"

**Tone:** This screen is a sigh of relief. No card. No list. No dashboard. Just: done.

---

## Screen 5: GroceryList

**Purpose:** Utility. Checkable grocery items from the approved plan. Grouped by category.

**Top:** "This week's groceries" (22px, 600). Below: "From your approved plan • 0/20 items" (muted, 14px).

**Structure:** Category label in small caps, muted, 11px, with 16px top margin. Items below: checkbox (unchecked circle) + item name (15px) + quantity in muted parentheses. Generous row height (48px minimum) for thumb tapping.

**Sample content:**

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

**Note:** Grocery list screen is cut from MVP. Deferred to V1.1. The ApproveConfirmation screen retains the "See your grocery list" text link as a placeholder — it leads to a "Coming soon" state for the prototype.

---

## Screen 5b: GroceryComingSoon (Placeholder only)

**Purpose:** Holds the grocery list entry point without building the full feature. Shown when user taps "See your grocery list" from ApproveConfirmation.

**Layout:** Centered, minimal.

- Heading: "Grocery list" (20px, 600)
- Subtext: "This is coming very soon. Your approved plan is saved." (15px, #78716C, centered)
- Text link: "Back to this week" (sage green)

---

## Screen 6: ProfilePreferences

**Purpose:** Shows the user's saved taste profile. Accessible via the avatar icon on the Home dashboard. Feels like "Melu's memory of your family" — not a settings page.

**Top bar:** Back arrow (left) + "Your Family Profile" (centered, 17px, 600). No bottom nav on this screen.

**Framing text below header:** "This is what Melu knows about your family. Tap any section to update." — 14px, muted.

**Sections as tappable rows (each a card, white bg, 16px radius, with a right-facing chevron):**

1. Family — "4 people · Kids ages 7 and 10"
2. Avoid — "No shellfish · Mild only (no spice)"
3. Cook time — "Under 30 min on weeknights"
4. Cuisines you like — "American, Mexican, Italian, Asian"
5. Skill level — "Quick and simple"

**Below the cards, a muted text note:**

"Melu updates your profile automatically as you approve and skip meals. You can also edit anything above."

**Destructive action at bottom:** Small text link, centered, #78716C — "Reset profile"

---

# Deliverable Instructions

Generate all 6 components as self-contained React + Tailwind. Each must:

1. Use hardcoded sample data from this spec exactly
2. Default export with the component name as specified
3. Import Plus Jakarta Sans via a style tag or @import in the component
4. Be 375px mobile width, not brittle at 390–430px
5. Use inline Tailwind classes only — no custom CSS files

Deliver as 6 sequential [v0.dev](http://v0.dev) prompts or a single combined prompt. After generating, paste the component code into the Agent: Dev page in Notion for Cursor import.

Component names: OnboardingChat, WeeklyCheckIn, HomeDashboard, ComingUp, WeeklyPlanView, ApproveConfirmation, GroceryComingSoon, ProfilePreferences

MVP scope summary:

- Dinners only. 7 meals Mon–Sun.
- No grocery list (V1.1). Placeholder screen only.
- No history tab. History is surfaced via ProfilePreferences.
- Nav: two tabs — This Week (HomeDashboard) and Coming Up (ComingUp).
- Profile: top-right avatar on HomeDashboard. No nav tab.

Note: OnboardingChat and WeeklyCheckIn are visually the same component. They differ only in system prompt, opening message, and question logic. Build as one component with a prop to switch mode (e.g., mode="onboarding" | mode="weekly"). This reduces Figma frame count but both states must be mocked separately in Figma for founder review.