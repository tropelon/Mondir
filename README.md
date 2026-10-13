# tropelon website

Static multi-page site (HTML/CSS/JS). Works on GitHub Pages.

## Deploy
1. Upload all files in this folder to the root of your GitHub repository (keep the folder structure; `index.html` must be at the root).
2. Repository → Settings → Pages → Source: `main` branch, `/ (root)`.
3. Custom domain: `tropelon.duckdns.org` (the `CNAME` file is already included). DuckDNS IP: `185.199.108.153`.

> Opening files directly (file://) will not load the JSON data. Use GitHub Pages or `python3 -m http.server`.

## Add content
- Cards (rishi / books / temples / festivals): edit `data/*.json`.
- Images: put files in `assets/img/` using the names in the JSON `image` field. If an image is missing, a gradient with an icon shows instead. Use images you own or that are licensed for reuse.
- History: edit `data/history.json`. Add a `source` for every entry.
- PDFs: edit `data/pdfs.json`, e.g.
  `{"title":"...","author":"...","category":"...","description":"...","file":"https://.../book.pdf","source":"https://..."}`
  Add only public-domain or permitted files.
