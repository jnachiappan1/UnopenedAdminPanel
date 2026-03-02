# Unopened Admin Panel

A React-based admin dashboard for managing the Unopened platform.

## Table of Contents

- [Overview](#overview)
- [Features](#features)
- [Tech Stack](#tech-stack)
- [Prerequisites](#prerequisites)
- [Getting Started](#getting-started)
- [AWS Configuration](#aws-configuration)
- [Deployment](#deployment)
- [Available Scripts](#available-scripts)
- [Project Structure](#project-structure)
- [Configuration Notes](#configuration-notes)
- [Environment Management](#environment-management)
- [Security Notes](#security-notes)
- [Contributing](#contributing)
- [License](#license)

## Overview

The Unopened Admin Panel is a centralized administrative dashboard used to manage and operate the Unopened platform.

It enables admins to manage:

- Platform analytics and dashboard metrics
- Users and roles
- Products and pricing
- Categories and coupons
- Cashout fees and requests
- Transactions
- Support and contact tickets
- Notifications and alerts
- Role-based access control (RBAC)
- Website legal content (Terms, Privacy, Help, Seller Agreement)

## Features

### Core Features

- ✅ Modular component architecture
- ✅ Role-based access control (Admin / Sub-admin)
- ✅ Centralized API handling
- ✅ Responsive Material UI design
- ✅ Secure authentication flow
- ✅ Cloud deployment support (S3 + CloudFront)

### Notifications Module

- 🔔 Unread notification count badge in header
- 📋 Dropdown preview showing latest 5 unread notifications
- 📄 Full notifications page with custom scrollbar
- 🔴 Visual indicators (red dot) for unread notifications
- ✔️ Mark individual or all notifications as read
- 🔄 Shared notification state using React Context
- 📡 Fetches notifications on component mount and after user actions

> **Note:** For real-time updates, consider implementing WebSocket or polling.

## Tech Stack

| Category                 | Technology                        |
| ------------------------ | --------------------------------- |
| **Frontend**             | React 19                          |
| **UI**                   | Material UI (MUI 6 + X Data Grid) |
| **State Management**     | Redux Toolkit + React Redux       |
| **Routing**              | React Router                      |
| **Networking**           | Axios                             |
| **Forms**                | react-hook-form + yup             |
| **Internationalization** | i18next                           |

## Prerequisites

Make sure the following are installed:

- **Node.js** 18+ (LTS recommended)
- **Yarn** (preferred) or npm
- **AWS CLI** (for deployment only)
- **AWS credentials** (for deployment access)

## Getting Started

### 1. Clone the repository

```bash
git clone <repository-url>
cd Unopened-Admin
```

### 2. Install dependencies

```bash
yarn
```

### 3. Start development server

```bash
yarn dev
```

### 4. Open in browser

```
http://localhost:3000
```

## AWS Configuration

Deployment requires AWS credentials to be configured locally.

```bash
aws configure
```

You will be prompted for:

- AWS Access Key ID
- AWS Secret Access Key
- Default region name (e.g. `us-east-1`)
- Default output format (e.g. `json`)

## Deployment

### Test Environment Deployment

Run the full deployment pipeline:

```bash
npm run deploy:test
```

This command performs:

1. Build cleanup
2. Test environment build
3. Upload build to S3
4. CloudFront cache invalidation

### Manual Deployment Steps (Optional)

```bash
yarn build:test
yarn uploadToS3:test
yarn invalidateIndex:test
```

## Available Scripts

| Command                     | Description                 |
| --------------------------- | --------------------------- |
| `yarn dev`                  | Start development server    |
| `yarn start`                | Alias for dev               |
| `yarn build`                | Production build            |
| `yarn test`                 | Run tests                   |
| `yarn clean`                | Remove build directory      |
| `yarn build:test`           | Test environment build      |
| `yarn uploadToS3:test`      | Upload build to S3          |
| `yarn invalidateIndex:test` | Invalidate CloudFront cache |
| `yarn deploy:test`          | Full test deployment        |

## Project Structure

```
src/
├── @core/              # Core layout, theme, and UI components
├── configs/            # App configuration (auth, theme, i18n)
├── context/            # React contexts (Auth, Notifications)
├── hooks/              # Custom hooks
├── layouts/            # App layout wrappers
├── navigation/         # Sidebar and navigation configs
├── network/            # API endpoints and Axios setup
├── pages/              # Route-based pages
└── views/              # Shared UI components and dialogs
```

## Configuration Notes

### API Base URL

```
https://api.unopenedapp.com/
```

### Media Storage URL

```
https://unopened-storage.s3.us-east-1.amazonaws.com
```

### Auth Tokens

Stored in `localStorage` via `src/configs/auth.js`

### i18n Config

`src/configs/i18n.js` (debug: true enabled)

## Environment Management

Currently, API and media URLs are hardcoded.

## Security Notes

- ⚠️ Do not commit AWS credentials
- 🔒 Use IAM users with limited permissions
- 🔐 Use environment variables for secrets
- 🛡️ Restrict S3 and CloudFront permissions
- ⏱️ Enable CloudFront invalidation limits
- 🔗 Use HTTPS-only endpoints

## Contributing

1. Create a feature branch
2. Follow existing code conventions
3. Add proper commit messages
4. Submit a pull request
