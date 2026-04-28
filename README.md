# TritonScript

> A collaborative class notes platform built for UCSD students, by [CSES @ UC San Diego](https://cses.ucsd.edu).

[![License](https://img.shields.io/github/license/CSES-Open-Source/TritonScript-legacy)](LICENSE)
[![Discord](https://img.shields.io/badge/Discord-Join%20Server-5865F2?logo=discord&logoColor=white)](https://discord.gg/pP4B9u25Vs)
[![Contributors](https://img.shields.io/github/contributors/CSES-Open-Source/TritonScript-legacy)](https://github.com/CSES-Open-Source/TritonScript-legacy/graphs/contributors)
[![Issues](https://img.shields.io/github/issues/CSES-Open-Source/TritonScript-legacy)](https://github.com/CSES-Open-Source/TritonScript-legacy/issues)

<!-- TODO: Replace with a screenshot or demo GIF -->
<!-- ![TritonScript Screenshot](./docs/screenshot.png) -->

---

## Table of Contents

- [About](#about)
- [Features](#features)
- [Tech Stack](#tech-stack)
- [Getting Started](#getting-started)
- [Project Structure](#project-structure)
- [Contributing](#contributing)
- [Community & Contact](#community--contact)
- [License](#license)

---

## About

TritonScript is an open-source web application where UC San Diego students can upload, browse, and share class notes across courses. It is developed and maintained by the Computer Science and Engineering Society (CSES) at UCSD.

The project is open to all contributors — whether you are a UCSD student, a CSES member, or a developer from the broader open-source community.

## Features

- Browse and search class notes organized by course
- Upload notes with cloud file storage
- User authentication with Google OAuth and JWT sessions
- User profiles and personal note management

## Tech Stack

| Layer | Technologies |
|---|---|
| **Frontend** | React 18, TypeScript, Vite, Redux Toolkit, React Router |
| **Backend** | Node.js, Express, TypeScript |
| **Database** | [Supabase](https://supabase.com/) (PostgreSQL) via [Prisma ORM](https://www.prisma.io/) |
| **Auth** | Google OAuth 2.0, JWT, bcrypt |
| **Storage** | [Cloudflare R2](https://www.cloudflare.com/developer-platform/r2/) (file uploads) |
| **Package Manager** | [pnpm](https://pnpm.io/) |

---

## Getting Started

### Prerequisites

- [Node.js](https://nodejs.org/) v18+
- [pnpm](https://pnpm.io/) — `npm install -g pnpm`

### Quick Start

1. **Clone the repository**

   ```sh
   git clone https://github.com/CSES-Open-Source/TritonScript-legacy.git
   cd TritonScript-legacy
   ```

2. **Run the frontend**

   ```sh
   cd frontend
   pnpm install
   pnpm run dev
   ```

3. **Run the backend**

   ```sh
   cd backend
   pnpm install
   pnpm run dev
   ```

For full setup instructions including environment variables and database configuration, see [CONTRIBUTING.md](CONTRIBUTING.md).

---

## Project Structure

```
TritonScript/
├── frontend/               # React + TypeScript + Vite
│   └── src/
│       ├── components/     # Reusable UI components
│       ├── pages/          # Route-level page components
│       └── utils/          # Shared utilities
│
├── backend/                # Node.js + Express + TypeScript
│   ├── controllers/        # Route handler logic
│   ├── routes/             # Express route definitions
│   ├── models/             # Data models
│   ├── prisma/             # Prisma schema and migrations
│   ├── scraper/            # Course data scraper
│   └── utils/              # Shared utilities
│
├── CONTRIBUTING.md
├── CODE_OF_CONDUCT.md
└── README.md
```

---

## Contributing

Contributions are welcome from everyone. Browse [open issues](https://github.com/CSES-Open-Source/TritonScript-legacy/issues) to find something to work on, then read [CONTRIBUTING.md](CONTRIBUTING.md) for the full setup guide, branch conventions, and workflow.

---

## Community & Contact

**Discord** — The primary place for discussion, questions, and announcements:
[Join the CSES Discord](https://discord.gg/pP4B9u25Vs)

**Maintainers**

| Name | Role |
|---|---|
| Hogun Kim | Engineering Manager |
| Victoria Tran | Engineering Manager |
| Aayan Lakhani | Software Developer |
| Kyle Koh | Software Developer |

**Contact**
- Hogun Kim — [hok008@ucsd.edu](mailto:hok008@ucsd.edu)
- Victoria Tran

**CSES @ UC San Diego**
- Website: [csesucsd.com](https://csesucsd.com/)
- Email: [cses@ucsd.edu](mailto:cses@ucsd.edu)
- LinkedIn: [linkedin.com/company/cses-uc-sandiego](https://www.linkedin.com/company/cses-uc-sandiego/)
- Instagram: [@cses.ucsd](https://www.instagram.com/cses.ucsd/)

---

## License

This project is licensed under the [MIT License](LICENSE).
