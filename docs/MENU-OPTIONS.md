# Menu options (Opciones Gresst)

The sidebar menu can be driven by options from **Opciones Gresst.xlsx**. Options are grouped by **IdOpcionSuperior** (subdivisions); only the **descripcion** items are clickable links; the group is visual only.

## Data shape

Each row in the Excel (or each object in the JSON) must have:

| Field              | Type   | Description |
|--------------------|--------|-------------|
| `idOpcionSuperior` | number | Group id. Menu is ordered by this; items with the same id are in the same subdivision. |
| `descripcion`      | string | Label of the menu option (the only clickable text). |
| `url`              | string | Internal path (e.g. `/`, `/profile`) or full URL (e.g. `https://...`). External URLs open in a new tab. |

## How to configure

1. **Export from Excel**  
   From *Opciones Gresst.xlsx*, export or copy columns: **IdOpcionSuperior**, **Descripcion**, **Url** (or **URL**). Ensure headers match the JSON keys: `idOpcionSuperior`, `descripcion`, `url`.

2. **Build JSON**  
   Build a JSON array, one object per row, for example:

   ```json
   [
     { "idOpcionSuperior": 1, "descripcion": "Inicio", "url": "/" },
     { "idOpcionSuperior": 1, "descripcion": "Perfil", "url": "/profile" },
     { "idOpcionSuperior": 2, "descripcion": "Solicitudes", "url": "https://qa.gestor.gresst.com/Solicitudes.aspx" }
   ]
   ```

3. **Set env**  
   Put that JSON in the env variable **`VITE_MENU_OPTIONS`** (single line, no line breaks), for example in `.env`:

   ```env
   VITE_MENU_OPTIONS=[{"idOpcionSuperior":1,"descripcion":"Inicio","url":"/"},{"idOpcionSuperior":1,"descripcion":"Perfil","url":"/profile"},{"idOpcionSuperior":2,"descripcion":"Solicitudes","url":"https://qa.gestor.gresst.com/Solicitudes.aspx"}]
   ```

4. **Build / run**  
   Run `npm run dev` or `npm run build`. The sidebar will show groups (subdivisions by `idOpcionSuperior`) and only the **descripcion** entries as menu links.

## Behavior when not set

If **`VITE_MENU_OPTIONS`** is empty or not set, the sidebar falls back to the default items: Home (`/`), Profile (`/profile`), plus any **`VITE_MENU_EXTERNAL_LINKS`** entries.

## Sidebar behavior

- **Deploys from the left** on **click** (toggle) or **hover** (expand; collapses after a short delay when the pointer leaves).
- Starts **collapsed** (narrow strip with menu icon). Click or hover to open and see groups and options.
