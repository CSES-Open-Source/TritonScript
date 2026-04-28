# Contributing to TritonScript

Thank you for your interest in contributing. This guide covers everything you need to get the project running locally, our branch and commit conventions, and the workflow for submitting changes.

Please also read our [Code of Conduct](CODE_OF_CONDUCT.md) before participating.

---

## Table of Contents

- [Local Setup](#local-setup)
  - [Prerequisites](#prerequisites)
  - [Running the Project](#running-the-project)
- [Branch Naming](#branch-naming)
- [Commit Messages](#commit-messages)
- [Git Workflow](#git-workflow)
- [Submitting a Pull Request](#submitting-a-pull-request)
- [Reporting Bugs](#reporting-bugs)
- [Suggesting Features](#suggesting-features)
- [Documentation](#documentation)

---

## Local Setup

### Prerequisites

- [Node.js](https://nodejs.org/) v18+
- [pnpm](https://pnpm.io/) — `npm install -g pnpm`
- A [Supabase](https://supabase.com/) project (for PostgreSQL database)
- A [Cloudflare R2](https://www.cloudflare.com/developer-platform/r2/) bucket (for file storage)
- A [Google Cloud](https://console.cloud.google.com/) project with OAuth 2.0 credentials

### Environment Variables

Environment variable credentials are managed internally by the TritonScript dev team. Reach out to a maintainer on [Discord](https://discord.gg/pP4B9u25Vs) or via [email](mailto:hok008@ucsd.edu) to get access to the required `.env` files for both `frontend/` and `backend/`.

### Running the Project

1. **Clone the repository**

   ```sh
   git clone https://github.com/CSES-Open-Source/TritonScript.git
   cd TritonScript-legacy
   ```

2. **Set up the backend**

   ```sh
   cd backend
   pnpm install
   pnpm db:migrate      # run Prisma migrations against your Supabase database
   pnpm run dev         # starts on http://localhost:5005
   ```

3. **Set up the frontend**

   ```sh
   cd frontend
   pnpm install
   pnpm run dev         # starts on http://localhost:5173
   ```

---

## Branch Naming

We follow the [Conventional Branch](https://conventional-branch.github.io/) specification.

**Format:** `<type>/<short-description>` or `<type>/issue-<number>-<short-description>`

| Type | When to use |
|---|---|
| `feature/` | New functionality |
| `bugfix/` | Fix a bug on an existing feature |
| `hotfix/` | Urgent fix for a production issue |
| `refactor/` | Code improvements with no behavior change |
| `docs/` | Documentation-only changes |
| `chore/` | Build process, dependencies, or tooling |

**Rules:**
- Lowercase only — no uppercase letters
- Words separated by hyphens — no underscores or spaces
- Keep it concise and descriptive
- Include the issue number when one exists

**Examples:**

```
feature/note-search
bugfix/issue-42-upload-fails
docs/update-contributing-guide
refactor/auth-middleware
chore/upgrade-prisma
```

---

## Commit Messages

We follow the [Conventional Commits](https://www.conventionalcommits.org/en/v1.0.0/) specification.

**Format:**

```
<type>[optional scope]: <description>

[optional body]

[optional footer]
```

| Type | When to use |
|---|---|
| `feat` | Introduces a new feature |
| `fix` | Patches a bug |
| `docs` | Documentation changes only |
| `style` | Formatting, whitespace — no logic change |
| `refactor` | Code change that is neither a fix nor a feature |
| `perf` | Performance improvement |
| `test` | Adding or updating tests |
| `chore` | Build process, dependency updates, tooling |
| `ci` | CI/CD configuration changes |

**Rules:**
- Use lowercase for the type
- Use imperative mood in the description — "add feature" not "added feature"
- Keep the subject line under 72 characters
- Do not end the subject line with a period
- Use the body to explain *what* and *why*, not *how*
- Reference issues in the footer: `Closes #42`

**Examples:**

```
feat(notes): add search by course and instructor

fix: resolve file upload failure on large PDFs

docs: update environment variable table in CONTRIBUTING

refactor(auth): simplify JWT verification middleware

chore: upgrade Prisma to v6
```

---

## Git Workflow

1. **Sync your local develop branch**

   ```sh
   git checkout develop
   git pull origin develop
   ```

2. **Create a feature branch**

   ```sh
   git checkout -b feature/your-feature-name
   ```

3. **Make your changes and commit**

   ```sh
   git add <file1> <file2>
   git commit
   ```

4. **Push your branch**

   ```sh
   git push origin feature/your-feature-name
   ```

5. **Open a Pull Request** to `develop` (not `main`) — see below.

6. **After your PR is merged, delete your branch**

   ```sh
   git branch -d feature/your-feature-name
   ```

---

## Submitting a Pull Request

- Open all PRs against the `develop` branch
- Fill out the PR description with a summary of your changes and the issue it addresses
- Link the related issue: `Closes #<issue-number>`
- Keep PRs focused — one feature or fix per PR
- Make sure the project builds before opening the PR
- A maintainer will review and merge your PR

---

## Reporting Bugs

Open an issue on [GitHub Issues](https://github.com/CSES-Open-Source/TritonScript/issues) and include:

- A clear description of the bug
- Steps to reproduce it
- Expected vs. actual behavior
- Screenshots or logs if applicable
- Your environment (OS, Node.js version, browser)

---

## Suggesting Features

Open an issue with the label `enhancement` and describe:

- The problem you are trying to solve
- Your proposed solution
- Any alternatives you have considered

---

## Documentation

- Keep `README.md` updated as the project evolves
- Comment non-obvious logic — explain *why*, not just *what*
- Keep comments up to date as code changes
