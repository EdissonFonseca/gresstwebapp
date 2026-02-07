# CI/CD pipeline

The project uses **GitHub Actions** for build, static artifact generation, and deploy to **Windows IIS**. Rollback is supported by restoring the previous deployment.

---

## 1. Pipeline overview

| Workflow | Trigger | Purpose |
|----------|---------|---------|
| **Build** | Push / PR to `main` | Install, lint, test, build; upload `dist/` as artifact |
| **Deploy to IIS** | Manual or after successful Build on `main` | Backup current site, copy new artifact to IIS path |
| **Rollback IIS** | Manual only | Restore previous deployment (swap site with `site_previous`) |

---

## 2. Build workflow

- **Runs on:** `ubuntu-latest`
- **Steps:** Checkout → Node 20 → `npm ci` → `npm run lint` → `npm run test:run` → `npm run build` → upload artifact
- **Artifact:** Contents of `dist/` (static files) with name `dist-<run_number>-<sha>`, retained 30 days
- **Environment variables (build time):** Injected from GitHub so the built app has the right API URL:
  - `VITE_API_BASE_URL` → from **Secrets** (recommended) or empty
  - `VITE_API_USE_CREDENTIALS` → from **Variables** or `false`

Set these in **Settings → Secrets and variables → Actions** so the build step can use them.

---

## 3. Deploy workflow (IIS)

- **Runs on:** `ubuntu-latest` (runner connects to Windows server via SSH)
- **Requires:** Windows server with IIS and **OpenSSH server**, and a deploy user that can write to the IIS physical path
- **Steps:**
  1. Resolve which build artifact to use (manual input, triggering Build run, or latest successful Build).
  2. Download that artifact.
  3. On the server (PowerShell over SSH): backup current site (rename folder to `_previous`), create empty site folder.
  4. SCP: copy artifact contents into the IIS site path.

**IIS path:** The site’s physical path on the server (e.g. `C:/inetpub/wwwroot/GresstWebApp`). Use forward slashes in the secret; the workflow converts to backslashes for PowerShell where needed.

**Optional:** To deploy only manually, remove the `workflow_run` trigger from `.github/workflows/deploy.yml` and run **Deploy to IIS** from the Actions tab when needed.

---

## 4. Required secrets and variables

Configure in **Settings → Secrets and variables → Actions**.

### Secrets (required for deploy)

| Secret | Description |
|--------|-------------|
| `DEPLOY_HOST` | Windows server hostname or IP |
| `DEPLOY_USER` | SSH user (e.g. local admin or a dedicated deploy account) |
| `DEPLOY_SSH_KEY` | Private key (e.g. OpenSSH format) for SSH/SCP; public key in server’s `authorized_keys` |
| `DEPLOY_IIS_PATH` | IIS site physical path (e.g. `C:/inetpub/wwwroot/GresstWebApp`) |
| `VITE_API_BASE_URL` | (Optional) API base URL baked into the build (e.g. `https://api.example.com`) |

### Optional

| Secret | Description |
|--------|-------------|
| `DEPLOY_SSH_PORT` | SSH port if not 22 |

### Variables (optional)

| Variable | Description |
|----------|-------------|
| `VITE_API_USE_CREDENTIALS` | Set to `true` if the app should send credentials (e.g. cookies) to the API |

---

## 5. Windows server setup (IIS + OpenSSH)

1. **IIS:** Create a site or virtual directory and set its physical path (e.g. `C:\inetpub\wwwroot\GresstWebApp`). Ensure the app pool identity has read access to that folder.
2. **OpenSSH server:** Install (e.g. **Settings → Apps → Optional features → OpenSSH Server**). Start the service and allow firewall for port 22 (or your `DEPLOY_SSH_PORT`).
3. **Deploy user:** Create a user (or use an admin account) and add its public key to `C:\Users\<user>\.ssh\authorized_keys`.
4. **Permissions:** The deploy user must be able to create/rename/delete folders and write files under the IIS physical path (e.g. `C:\inetpub\wwwroot\GresstWebApp`).

Default SSH shell should be **PowerShell** so the backup/restore scripts run correctly. (Configure in `C:\ProgramData\ssh\sshd_config` or the user’s shell if needed.)

---

## 6. Rollback strategy

- **Automatic backup:** Each deploy renames the current site folder to `<IIS_PATH>_previous` and deploys the new artifact into the site path. Only the last deployment is kept as backup.
- **Manual rollback:** Run the **Rollback IIS** workflow from the Actions tab. It swaps the current site with `_previous` (and renames the failed one to `_failed` for inspection).
- **Scripts on server:** You can also run the PowerShell scripts under `scripts/` on the server:
  - `scripts/iis-backup.ps1` – backup current site (rename to `_previous`)
  - `scripts/iis-rollback.ps1` – restore from `_previous`

For more than one backup (e.g. keep last N), extend the backup step or scripts (e.g. timestamped folders and a cleanup policy).

---

## 7. Summary

- **Build:** Every push/PR to `main` runs lint, test, and build; output is a static artifact.
- **Deploy:** Manual or after Build; uses SSH/SCP to Windows IIS and keeps one previous deployment.
- **Variables:** Use GitHub Secrets/Variables for `VITE_*` and deploy credentials; no secrets in the repo.
- **Rollback:** Manual workflow or server-side script restores the previous deployment.
