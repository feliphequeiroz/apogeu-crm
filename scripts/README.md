# Scripts

This directory contains custom scripts for the project.

## `run.sh`

This script is a convenience wrapper for starting the development server.

### Usage

```bash
./scripts/run.sh
```

### What it does

1.  **Checks for `.env.local`**: Verifies if the `.env.local` file exists and if the `NEXT_PUBLIC_SUPABASE_URL` variable is set.
2.  **Installs dependencies**: If the `node_modules` directory doesn't exist, it runs `npm install`.
3.  **Starts the server**: Runs `npm run dev` to start the Next.js development server.
