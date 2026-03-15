# Melu Frontend Prototype

A frontend-only prototype of the Melu meal planning app, built with React + TypeScript + Vite.

## Status

✅ **Frontend Prototype Complete**
- Onboarding chat flow (Step 2 of 4)
- Dashboard with weekly meal plan
- Full week view with meal details
- Grocery list with checkboxes
- Bottom navigation between Plan/Grocery tabs
- Styling matches Figma mockups

## What's Included

### Pages
1. **Onboarding** (`src/pages/Onboarding.tsx`)
   - Chat-based conversational flow
   - Multiple choice options
   - Simulated Melu responses

2. **Dashboard** (`src/pages/Dashboard.tsx`)
   - Greeting with user name
   - Weekly meal summary
   - Quick links to full plan and grocery list
   - Navigation tabs

3. **WeekView** (`src/pages/WeekView.tsx`)
   - Full weekly meal plan
   - Meal details (time, cuisine, ingredients)
   - "Sync to calendar" button (simulated)

4. **GroceryList** (`src/pages/GroceryList.tsx`)
   - Organized by category (Produce, Proteins, Dairy, Pantry)
   - Checkbox tracking
   - Responsive layout

### State Management
- **Zustand store** (`src/store.ts`)
  - Onboarding state + messages
  - Family profile
  - Current week meals
  - Meal ratings

## Tech Stack

- **React 18** - UI framework
- **TypeScript** - Type safety
- **Vite** - Build tool (blazingly fast)
- **Zustand** - State management
- **React Router** - Navigation
- **Lucide React** - Icons

## Getting Started

### Install Dependencies
```bash
npm install
```

### Development Server
```bash
npm run dev
```

Then open http://localhost:5173 in your browser.

### Build for Production
```bash
npm run build
```

### Preview Production Build
```bash
npm run preview
```

## Next Steps (Backend Integration)

This prototype is frontend-only. To connect to the backend:

1. **Add API client** (fetch or axios)
2. **Replace mock data** with API calls:
   - Onboarding: `POST /auth/onboard`
   - Plan generation: `POST /plan/generate`
   - Calendar sync: `POST /plan/approve`
   - Grocery list: `GET /plan/grocery-list`
   - Feedback: `POST /feedback`

3. **Update store** to handle async API calls
4. **Add authentication** (JWT tokens)
5. **Deploy to Vercel** (one-click deployment from git)

## File Structure

```
melu-frontend/
├── src/
│   ├── pages/
│   │   ├── Onboarding.tsx      # Chat onboarding flow
│   │   ├── Onboarding.css
│   │   ├── Dashboard.tsx       # Main dashboard
│   │   ├── Dashboard.css
│   │   ├── WeekView.tsx        # Full meal plan
│   │   ├── WeekView.css
│   │   ├── GroceryList.tsx     # Shopping list
│   │   └── GroceryList.css
│   ├── store.ts                # Zustand state
│   ├── App.tsx                 # Main app + routing
│   ├── App.css
│   ├── main.tsx
│   └── index.css
├── index.html
├── vite.config.ts
├── tsconfig.json
└── package.json
```

## Notes

- Colors: Green theme (#6b9b7f) with light backgrounds
- Typography: System fonts for speed
- Responsive: Mobile-first design
- Accessibility: Semantic HTML, proper ARIA labels (to be added)

Ready to integrate with backend! 🚀

Reference: [Melu Workspace](https://www.notion.so/Melu-Workspace-824e2f0e776082f8995001b778954a6c)
