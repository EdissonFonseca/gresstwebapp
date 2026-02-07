# Deploy to Windows IIS — Quick start

Steps to get the app running on your Windows server with IIS.

---

## 1. One-time: Prepare the Windows server

### 1.1 IIS site

1. Open **IIS Manager** (inetmgr).
2. Create a **new site** or **application** under Default Web Site.
3. Set the **physical path** to a folder, e.g. `C:\inetpub\wwwroot\GresstWebApp`.
4. Ensure the **application pool** identity has **read** access to that folder.
5. For a SPA (React Router): either use **URL Rewrite** so all non-file requests go to `index.html`, or configure the site to use the same `index.html` for 404. (See section 4 below.)

### 1.2 OpenSSH server (for GitHub Actions deploy)

1. **Settings → Apps → Optional features** → Add **OpenSSH Server**.
2. Start the **OpenSSH SSH Server** service.
3. Open **port 22** (or your chosen port) in the firewall.
4. (Optional) Set default shell to PowerShell: in `C:\ProgramData\ssh\sshd_config` set `Subsystem powershell` or configure the deploy user’s shell to PowerShell so the backup/restore scripts run correctly.

### 1.3 Deploy user and SSH key

1. Create a Windows user (e.g. `deploy`) or use an existing admin account.
2. Ensure that user can **create, rename, delete folders and write files** under the IIS physical path (e.g. `C:\inetpub\wwwroot\GresstWebApp`).
3. In that user’s profile: `C:\Users\<user>\.ssh\` create `authorized_keys` and paste the **public key** that you will use as `DEPLOY_SSH_KEY` in GitHub (one line per key).

---

## 2. One-time: GitHub secrets and variables

In the repo: **Settings → Secrets and variables → Actions**.

### Required for deploy

| Name              | Type    | Value |
|-------------------|---------|--------|
| `DEPLOY_HOST`     | Secret  | Windows server hostname or IP |
| `DEPLOY_USER`     | Secret  | SSH user (e.g. `deploy`) |
| `DEPLOY_SSH_KEY`  | Secret  | **Private** key (OpenSSH format) for SSH/SCP |
| `DEPLOY_IIS_PATH` | Secret  | IIS physical path, e.g. `C:/inetpub/wwwroot/GresstWebApp` (forward slashes OK) |

### Optional (build and deploy)

| Name                     | Type    | Value |
|--------------------------|---------|--------|
| `VITE_API_BASE_URL`      | Secret  | API base URL for the built app (e.g. `https://api.yourserver.com`) |
| `VITE_API_USE_CREDENTIALS` | Variable | `true` if the app sends cookies to the API |
| `DEPLOY_SSH_PORT`        | Secret  | SSH port if not 22 |

---

## 3. Deploy (after push to main)

- **Automatic:** Push to `main` → **Build** runs (lint, test, build) → **Deploy to IIS** runs and copies the new `dist/` to the server.
- **Manual:** **Actions** tab → **Deploy to IIS** → **Run workflow**. You can optionally pass a **Run ID** of a specific Build artifact; if empty, the latest successful Build is used.

After deploy, the site is served from the IIS path. The workflow backs up the previous deployment to `<IIS_PATH>_previous` so you can rollback (Actions → **Rollback IIS** or run the rollback script on the server).

---

## 4. SPA routing on IIS (important)

The app is a single-page app: all routes (e.g. `/profile`) must serve `index.html` so the client can handle routing. Otherwise IIS returns 404 for those paths.

**Option A — URL Rewrite (recommended)**

1. Install **IIS URL Rewrite** on the server if not already installed.
2. In the site’s folder (e.g. `C:\inetpub\wwwroot\GresstWebApp`) create or edit `web.config`:

```xml
<?xml version="1.0" encoding="UTF-8"?>
<configuration>
  <system.webServer>
    <rewrite>
      <rules>
        <rule name="SPA" stopProcessing="true">
          <match url=".*" />
          <conditions logicalGrouping="MatchAll">
            <add input="{REQUEST_FILENAME}" matchType="IsFile" negate="true" />
            <add input="{REQUEST_FILENAME}" matchType="IsDirectory" negate="true" />
          </conditions>
          <action type="Rewrite" url="/index.html" />
        </rule>
      </rules>
    </rewrite>
  </system.webServer>
</configuration>
```

3. Deploy includes the built files; add this `web.config` either by including it in the build output (see below) or by creating it once on the server and not overwriting it. Easiest: put `web.config` in the project’s `public/` folder so Vite copies it to `dist/` on every build.

**Option B — Add web.config to the build**

Put the same `web.config` in `public/web.config`. Then `npm run build` will copy it to `dist/`, and every deploy will overwrite the server’s `web.config` with this one.

---

## 5. Manual deploy from your machine (no GitHub Actions)

If you want to deploy once from your PC without using Actions:

1. Build with the API URL for production:
   ```bash
   VITE_API_BASE_URL=https://api.yourserver.com npm run build
   ```
2. Copy the contents of `dist/` to the server:
   - **SCP (from WSL or Git Bash):**
     ```bash
     scp -r dist/* user@server:C:/inetpub/wwwroot/GresstWebApp/
     ```
   - Or use **Remote Desktop** and copy the folder, or a shared drive.
3. On the server, ensure `web.config` is present for SPA routing (see section 4). If you use `public/web.config`, it will already be inside `dist/` when you built.

---

## 6. Rollback

- **From GitHub:** Actions → **Rollback IIS** → Run workflow. This swaps the current site folder with `_previous`.
- **On the server:** Run the PowerShell script (adjust path as needed):
  ```powershell
  .\iis-rollback.ps1 -SitePath "C:\inetpub\wwwroot\GresstWebApp"
  ```

For more detail, see [CI-CD.md](./CI-CD.md).
