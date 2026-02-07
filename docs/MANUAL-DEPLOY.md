# Manual deploy to IIS

Generate the deployable files locally and copy them to your Windows server by hand. No automation or CI/CD.

---

## 1. Generate the files to copy

In the project root:

```bash
npm run build
```

If your app will call an API in production, set the base URL before building:

```bash
# Windows (PowerShell)
$env:VITE_API_BASE_URL="https://api.yourserver.com"; npm run build

# Windows (CMD)
set VITE_API_BASE_URL=https://api.yourserver.com && npm run build

# macOS / Linux
VITE_API_BASE_URL=https://api.yourserver.com npm run build
```

**Result:** A folder `dist/` is created with everything the site needs.

---

## 2. What to copy

Copy **the entire contents** of the `dist/` folder (not the folder itself, unless you want that to be the site root).

You should see at least:

- `index.html`
- `assets/` (JS, CSS)
- `web.config` (for SPA routing on IIS)
- `vite.svg` (if you kept the default public asset)

So: copy **everything inside** `dist/` into the IIS physical path on the server.

---

## 3. Where to copy on the server

Copy into the **IIS site physical path**, for example:

- `C:\inetpub\wwwroot\GresstWebApp`

Ways to get the files there:

- **Remote Desktop:** Copy the `dist` folder from your PC, then on the server paste its contents into the site folder.
- **Shared folder:** If the server has a share, copy to the share then on the server move the files into the site folder.
- **Zip:** Zip the contents of `dist/` (not the parent `dist` folder), copy the zip to the server, then unzip into the site folder.

Before overwriting, you can backup the current site (e.g. rename `GresstWebApp` to `GresstWebApp_old`).

---

## 4. IIS setup (one-time)

- **Site:** In IIS Manager, create a site or application whose physical path is the folder where you copied the files (e.g. `C:\inetpub\wwwroot\GresstWebApp`).
- **URL Rewrite:** Install the **IIS URL Rewrite** module so that the included `web.config` works. Then routes like `/profile` will serve `index.html` and the SPA will work.
- **Permissions:** The application pool identity must have **read** access to that folder.

---

## 5. Summary

| Step | Action |
|------|--------|
| 1 | Run `npm run build` (optionally with `VITE_API_BASE_URL`) |
| 2 | Copy **all contents** of `dist/` to the IIS site folder on the server |
| 3 | (One-time) Configure IIS site and URL Rewrite |

When you are ready to automate, use the CI/CD setup described in [CI-CD.md](./CI-CD.md) and [DEPLOY-IIS-QUICKSTART.md](./DEPLOY-IIS-QUICKSTART.md).
