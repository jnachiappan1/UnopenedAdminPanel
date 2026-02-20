# Unopened Admin Panel

React-based admin dashboard for managing the Unopened platform.

## Overview

This project is a Create React App application used by admins to manage:

- Dashboard metrics
- Users
- Products and product pricing
- Categories
- Coupons
- Cashout fees and cashout requests
- Transactions
- Contact/support tickets
- Role, permission, and sub-admin access control
- Website legal content (Terms, Privacy Policy, Help & Support, Seller Agreement)

## Tech Stack

- React 19
- Material UI (MUI 6 + X Data Grid)
- Redux Toolkit + React Redux
- React Router
- Axios
- i18next
- react-hook-form + yup

## Prerequisites

- Node.js 18+ (recommended)
- npm or yarn
- AWS CLI configured (only required for S3/CloudFront deploy scripts)

## Getting Started

1. Install dependencies:

```bash
yarn install
```

2. Start development server:

```bash
yarn dev
```

3. Open:

```text
http://localhost:3000
```

## Available Scripts

- `yarn dev`: Starts the development server.
- `yarn start`: Starts the development server (same as `dev`).
- `yarn build`: Creates a production build in `build/`.
- `yarn test`: Runs tests.
- `yarn clean`: Removes the `build/` directory.
- `yarn deploy:test`: Cleans, builds, uploads to S3, and invalidates CloudFront.

## Deployment (Test Environment)

The repository includes a test deployment pipeline via npm scripts:

1. `yarn build:test`
2. `yarn uploadToS3:test`
3. `yarn invalidateIndex:test`

Or run all at once:

```bash
yarn deploy:test
```

Current target values in `package.json`:

- S3 bucket: `s3://unopenedapp-admin`
- CloudFront distribution: `E3G9A5IVFXV4L8`

## Project Structure

```text
src/
  @core/                Core layout/theme/components
  configs/              App configuration (theme, auth, i18n)
  context/              React contexts
  hooks/                Custom hooks
  layouts/              Layout wrappers and UI shell
  navigation/           Sidebar/top nav definitions
  network/              API endpoints and Axios setup
  pages/                Route pages
  views/                Shared dialogs/tables/components
```

## Important Configuration Notes

- API base URL is currently hardcoded in `src/network/endpoints.js`:
  - `https://api.unopenedapp.com/`
- Media URL is currently hardcoded in `src/network/endpoints.js`:
  - `https://unopened-storage.s3.us-east-1.amazonaws.com`
- Auth token is stored in localStorage using keys from `src/configs/auth.js`.
- i18n is initialized in `src/configs/i18n.js` with `debug: true`.

## Notes

- This repository currently does not include a committed `.env` workflow for API host configuration.
- If you need environment-based API switching (local/staging/prod), move `API_BASE_URL` to environment variables.
