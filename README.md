# Inscale Core Banking Automation

Playwright and TypeScript-based end-to-end automation framework for testing customer management and transaction processing workflows in the GlobalSQA Banking application.

## Version

**Current Version:** 1.1

## Technology Stack

- Playwright
- TypeScript
- Node.js
- Excel-based test data
- Page Object Model
- GitHub Actions
- Playwright HTML Reporter

## Automated Scenarios

### Q1 — Customer Management

- Read seven customer records from Excel
- Log in as Bank Manager
- Add all customers through the application
- Verify each customer's first name, last name, and postcode
- Delete Jackson Frank and Christopher Connely
- Verify that the deleted customers are no longer displayed
- Attach the final customer-table screenshot to the HTML report

### Q2 — Transaction Processing

- Read seven transaction records from Excel
- Log in as Hermoine Granger
- Select account number 1003
- Capture the starting account balance
- Process credit and debit transactions
- Calculate the expected balance after each transaction
- Validate the displayed balance after every transaction
- Verify the final account balance
- Attach the final-balance screenshot and transaction-summary JSON to the HTML report

## Framework Structure

```text
├── .github/
│   └── workflows/               # GitHub Actions CI workflow
├── docs/                        # Exploratory testing and quality report
├── models/                      # TypeScript data models
├── pages/                       # Page Object Model classes
├── test-data/                   # Excel test data
├── tests/
│   └── e2e/                     # End-to-end test specifications
├── utils/                       # Excel reader and balance calculator
├── playwright.config.ts         # Playwright configuration
├── tsconfig.json                # TypeScript configuration
├── package.json                 # Dependencies and execution scripts
└── README.md                    # Project documentation
```

## Prerequisites

- Node.js LTS
- npm

## Installation

Clone or extract the project and navigate to its root directory.

Install the locked project dependencies:

```bash
npm ci
```

Install the Playwright browsers:

```bash
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

Run the complete cross-browser test suite:

```bash
npm test
```

The framework is configured to execute on:

- Chromium
- Firefox
- WebKit

Tests run sequentially using one worker to avoid instability caused by parallel load on the public demo application.

## Base URL Configuration

The default application URL is configured in `playwright.config.ts`.

A different environment URL can be provided through the `BASE_URL` environment variable.

PowerShell:

```powershell
$env:BASE_URL="https://example.com/"
npm test
```

Command Prompt:

```cmd
set BASE_URL=https://example.com/
npm test
```

Bash:

```bash
BASE_URL="https://example.com/" npm test
```

## Test Data

The framework reads its test data from the Excel workbook inside the `test-data` directory.

The workbook contains:

- Customer records for Q1
- Credit and debit transactions for Q2

The Excel reader validates the required columns, transaction types, and transaction amounts before the application workflow begins.

### Test Evidence and Reporting

Open the latest Playwright HTML report:

```bash
npm run report
```

The Playwright HTML report includes:

- Cross-browser execution results for Chromium, Firefox, and WebKit
- Business-readable `test.step()` execution details
- Screenshots and videos for failed tests
- Traces retained for failed tests
- Filtered customer-table evidence for Q1:
    - Before deletion: all 7 newly added customers
    - After deletion: the remaining 5 customers
- Final account-balance screenshot for Q2
- Transaction-summary JSON attachment for Q2

## Continuous Integration

GitHub Actions executes the automation suite for:

- Pushes to `main`
- Pull requests targeting `main`
- Manually triggered workflow runs

The workflow performs the following steps:

1. Checks out the repository
2. Sets up Node.js
3. Installs dependencies using `npm ci`
4. Validates the TypeScript code
5. Installs Playwright browsers and system dependencies
6. Executes the complete cross-browser test suite
7. Uploads the Playwright HTML report
8. Adds an execution summary to the workflow run

## Downloading the CI Test Report

After a GitHub Actions workflow completes:

1. Open the repository on GitHub
2. Select the **Actions** tab
3. Open the required **Playwright Tests** workflow run
4. Scroll to the **Artifacts** section
5. Download the `playwright-report` artifact
6. Extract the downloaded ZIP
7. Open `index.html` in a browser

The report artifact is retained for 90 days.

## Failure Diagnostics

The framework is configured with:

- Retries only in the CI environment
- Trace retention for failed tests
- Screenshots captured on failure
- Videos retained on failure
- Playwright HTML and line reporters

## Exploratory Testing & Quality Assessment Report

In addition to the automated scenarios, exploratory testing was performed on the GlobalSQA Banking application to identify confirmed defects, business-rule observations requiring validation, and UI/UX improvement opportunities.

The report includes documented findings, business impact, steps to reproduce, expected and actual results, severity classifications, and supporting evidence.

[View the Exploratory Testing & Quality Assessment Report](docs/Exploratory%20Testing%20%26%20Quality%20Assessment%20Report.docx)