# Ledgerly Expense Tracker

## Project Name

**Ledgerly Expense Tracker**

## Project Description

Ledgerly is a simple personal expense tracker built with React, TypeScript, and Vite. It provides a quick dashboard for reviewing expenses, checking a monthly budget, and adding new transactions.

## Features

- Dashboard with total spent, monthly expenditure, and total budget
- Indian rupee formatting using the `en-IN` locale
- Current-month date range and expense calculations
- Category spending breakdown with a visual chart
- Recent transactions list
- Transaction search
- Add expense form with merchant, amount, date, and category fields
- Browser local storage persistence, so data remains after a page refresh
- Responsive layout for desktop and mobile screens

## Requirements

Install these tools before starting:

- Node.js 18 or newer
- npm

## How to Install

Download the project, open a terminal in the project folder, and install its dependencies:

```bash
npm install
```

This reads `package.json` and installs React, Vite, TypeScript, Lucide icons, and the development tools needed by the project.

## Run Locally

1. Clone the repository and open its folder:

   ```bash
   git clone https://github.com/priyastud/breakout1expensetracker.git
   cd breakout1expensetracker
   ```

2. Install dependencies:

   ```bash
   npm install
   ```

3. Start the development server:

   ```bash
   npm run dev
   ```

4. Open the local URL shown by Vite, usually `http://localhost:5173`.

## GitHub Repository

The source code is available at:

https://github.com/priyastud/breakout1expensetracker

## Live Application URL

The application currently runs locally during development at:

http://127.0.0.1:5173/

There is no public production deployment yet. To view the application, follow the [Run Locally](#run-locally) instructions above.

## Available Commands

| Command | Purpose |
| --- | --- |
| `npm run dev` | Start the development server with hot reload |
| `npm run build` | Type-check and create a production build |
| `npm run lint` | Run Oxlint |
| `npm run preview` | Preview the production build locally |

## How The Dashboard Works

The dashboard automatically uses the current calendar month. It filters transactions by the current year and month before calculating the total spent and category breakdown.

- **Total spent:** Sum of current-month transactions
- **Monthly expenditure:** Same live current-month transaction total
- **Total budget:** Current monthly budget limit of ₹1,00,000
- **Budget progress:** Monthly expenditure compared with the total budget

When there are no current-month transactions in an existing browser profile, Ledgerly adds a small set of sample transactions dated within the current month. Older transactions remain available in the Transactions view.

## Saving Data

Expenses are stored in the browser under the `ledgerly-transactions` local storage key. This means:

- No account or backend server is required
- Data is saved automatically after an expense is added
- Data is tied to the browser and device being used
- Clearing browser site data removes the saved expenses

This local storage approach is suitable for the MVP. A future version could use a database and user authentication for syncing across devices.

## Project Structure

```text
src/
├── App.tsx       # Main dashboard and expense workflow
├── index.css     # Application styles and responsive layout
├── main.tsx      # React application entry point
└── assets/       # Images and static assets
```

## Production Build

Create a production build with:

```bash
npm run build
```

The generated files are placed in the `dist/` folder. They can be deployed to any static hosting service such as Vercel, Netlify, or GitHub Pages with SPA fallback support.

## Git Workflow

To save and publish future changes:

```bash
git add .
git commit -m "Describe your change"
git push
```

## Technology Used

- React 19
- TypeScript
- Vite
- Lucide React icons
- Oxlint
