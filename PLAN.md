# Ledgerly Expense Tracker Plan

## Application Name

**Ledgerly**

Ledgerly is a calm, focused personal expense tracker that helps people understand where their money goes without the overhead of a full accounting system.

## Problem Statement

People often record purchases inconsistently, lose track of recurring spending, and discover budget problems only after the month ends. Ledgerly will make it quick to capture an expense, easy to review spending patterns, and clear when a category is approaching its limit.

## Target Users

- Individuals managing day-to-day personal spending
- Students and early-career professionals building budgeting habits
- Couples or households who want a shared overview in a later release
- Freelancers who need lightweight income and expense visibility

## Main Features

### MVP

- Add, edit, and delete expense entries
- Record amount, date, merchant, category, payment method, and optional note
- Dashboard with total spent, current-month spending, average daily spend, and largest category
- Category breakdown with charts and percentage summaries
- Monthly budget limits by category
- Recent transactions list with search, category filter, and date sorting
- Recurring-expense marker for subscriptions and regular bills
- Responsive layout for desktop and mobile
- Currency and first-day-of-week preferences
- Local persistence so the app works without an account

### Later Releases

- Income entries and net cash-flow reporting
- CSV import and export
- Receipt image attachments
- Authentication and cloud sync
- Shared household workspaces
- Notifications for budgets and recurring payments

## Pages / Screens Required

1. **Dashboard**
   - Monthly spending summary
   - Budget progress
   - Category breakdown
   - Recent transactions
   - Quick-add expense action

2. **Transactions**
   - Full transaction table/list
   - Search, filters, sorting, and pagination or infinite loading
   - Edit and delete actions
   - Empty and no-results states

3. **Add Expense**
   - Expense form with validation
   - Category and payment method selectors
   - Date picker
   - Optional recurring toggle and note
   - Save and cancel actions

4. **Edit Expense**
   - Same form as Add Expense, pre-filled with existing data
   - Delete confirmation action

5. **Budgets**
   - Monthly budget total and category limits
   - Progress indicators
   - Create, edit, and remove category budgets

6. **Reports**
   - Spending by category, time, and payment method
   - Month selector
   - Chart and tabular views
   - Export entry point reserved for later release

7. **Settings**
   - Currency
   - Month start preference
   - Category management
   - Payment method management
   - Data export, reset, and local-data warning

## Technology Stack

- **Frontend:** React with TypeScript
- **Build tool:** Vite
- **Styling:** CSS Modules or a focused global CSS system with CSS variables
- **Icons:** Lucide React
- **Charts:** Recharts
- **Forms and validation:** React Hook Form with Zod
- **State management:** React state and context for MVP; Zustand if cross-screen state becomes complex
- **Persistence:** IndexedDB through Dexie for reliable local storage
- **Testing:** Vitest, React Testing Library, and Playwright
- **Quality:** ESLint, TypeScript strict mode, and Prettier
- **Deployment:** Vercel or Netlify as a static frontend

## Project Folder Structure

```text
ledgerly/
├── public/
│   └── favicon.svg
├── src/
│   ├── app/
│   │   ├── App.tsx
│   │   ├── routes.tsx
│   │   └── providers.tsx
│   ├── assets/
│   ├── components/
│   │   ├── layout/
│   │   ├── navigation/
│   │   ├── charts/
│   │   ├── forms/
│   │   └── ui/
│   ├── features/
│   │   ├── dashboard/
│   │   ├── transactions/
│   │   ├── budgets/
│   │   ├── reports/
│   │   └── settings/
│   ├── db/
│   │   ├── database.ts
│   │   └── seed.ts
│   ├── hooks/
│   ├── lib/
│   │   ├── currency.ts
│   │   ├── dates.ts
│   │   └── formatters.ts
│   ├── styles/
│   │   ├── tokens.css
│   │   └── globals.css
│   ├── types/
│   │   └── finance.ts
│   └── main.tsx
├── tests/
│   ├── unit/
│   ├── component/
│   └── e2e/
├── PLAN.md
├── package.json
├── tsconfig.json
├── vite.config.ts
└── README.md
```

## Data That Needs to Be Stored

### Expense

- `id`: unique identifier
- `amount`: positive integer in minor currency units to avoid floating-point errors
- `currency`: ISO currency code
- `merchant`: optional merchant or payee name
- `categoryId`: selected category
- `paymentMethodId`: cash, card, bank transfer, or custom method
- `date`: ISO date string
- `note`: optional text
- `isRecurring`: boolean
- `createdAt`: timestamp
- `updatedAt`: timestamp

### Category

- `id`
- `name`
- `color`
- `icon`
- `isArchived`
- `sortOrder`

### Payment Method

- `id`
- `name`
- `type`
- `isArchived`

### Budget

- `id`
- `month`: `YYYY-MM`
- `categoryId`: nullable when representing an overall budget
- `limit`: integer in minor currency units
- `currency`

### User Preferences

- `currency`
- `locale`
- `weekStartsOn`
- `theme`
- `lastViewedMonth`

## Development Steps

1. Initialize a Vite React TypeScript project and install the selected dependencies.
2. Add strict TypeScript, linting, formatting, and test configuration.
3. Define the finance types, validation schemas, default categories, and default payment methods.
4. Implement the Dexie database and seed first-run data.
5. Establish design tokens, responsive layout primitives, navigation, buttons, inputs, dialogs, and empty states.
6. Build the Add Expense and Edit Expense flows first, including validation and persistence.
7. Build the Transactions screen with search, filters, sorting, and destructive-action confirmation.
8. Build the Dashboard using real stored data and derived monthly totals.
9. Build Budgets and connect progress calculations to transaction data.
10. Build Reports with responsive charts and accessible tabular summaries.
11. Build Settings, including category management, preferences, export, and reset flows.
12. Add loading, empty, validation-error, no-results, and failure states across the app.
13. Add unit tests for calculations and formatting, component tests for forms and filters, and Playwright coverage for the main expense workflow.
14. Run typecheck, lint, tests, and production build; fix accessibility and mobile layout issues.
15. Add seed/demo data behind a development-only option and document local setup in `README.md`.

## Deployment Approach

- Build with `npm run build` and deploy the generated `dist/` directory to Vercel or Netlify.
- Configure SPA fallback routing so direct links to screens resolve correctly.
- Use preview deployments for pull requests and production deployment from the main branch.
- Keep MVP data local in IndexedDB; no server secrets are required for the first deployment.
- Before adding cloud sync, introduce a backend database and authentication layer, migrate records with a versioned schema, and add privacy, backup, and account-deletion flows.
- Monitor build failures and client-side errors with the hosting provider and an error-tracking service once usage begins.
