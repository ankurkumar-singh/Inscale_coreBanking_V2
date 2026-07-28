# Inscale Core Banking Automation

Playwright and TypeScript-based end-to-end automation framework for testing the GlobalSQA Banking application.

## Technology Stack

- Playwright
- TypeScript
- Node.js
- Excel-based test data
- GitHub Actions
- Playwright HTML Reporter

## Automated Scenarios

### Q1 — Customer Management

- Read customer data from Excel
- Add all customers through Bank Manager login
- Verify first name, last name, and postcode
- Delete the specified customers
- Verify deleted customers are no longer displayed

### Q2 — Transaction Processing

- Read transaction data from Excel
- Log in using the required customer
- Process credit and debit transactions
- Calculate the expected balance
- Validate the displayed balance after each transaction

## Framework Structure

```text
├── .github/workflows/       # GitHub Actions CI workflow
├── models/                  # TypeScript data models
├── pages/                   # Page Object Model classes
├── test-data/               # Excel test data
├── tests/e2e/               # End-to-end test specifications
├── utils/                   # Excel reader and balance calculator
├── playwright.config.ts     # Playwright configuration
├── tsconfig.json            # TypeScript configuration
└── package.json             # Dependencies and execution scripts
```

## Prerequisites

- Node.js LTS
- npm

## Installation

```bash
npm ci
npx playwright install
```

## Test Execution

Run TypeScript validation:

```bash
npm run typecheck
```

Run tests on Chromium:

```bash
npm run test:chromium
```

Run tests on all configured browsers:

```bash
npm test
```

The framework is configured for:

- Chromium
- Firefox
- WebKit

## Test Report

Open the latest Playwright HTML report:

```bash
npm run report
```

Screenshots and videos are retained for failed tests. Trace collection is enabled on the first retry.

## Continuous Integration

GitHub Actions automatically performs the following on pushes and pull requests to `main` or `master`:

1. Installs project dependencies
2. Validates TypeScript
3. Installs Playwright browsers
4. Executes the complete cross-browser test suite
5. Uploads the Playwright HTML report