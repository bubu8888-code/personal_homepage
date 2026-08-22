# Bernie Personal Homepage

Static personal portfolio built for GitHub Pages. No build step is required.

## Local preview

```bash
python3 -m http.server 8080
```

Open `http://localhost:8080`.

## Publish on GitHub Pages

1. Create a new GitHub repository.
2. Copy this folder's contents to the repository root.
3. Commit and push to the `main` branch.
4. In GitHub, open **Settings → Pages**.
5. Under **Build and deployment**, choose **GitHub Actions**.
6. The included workflow publishes the site automatically.

Large MP4 files are included as normal Git objects and are individually below GitHub's 100 MB file limit. For faster loading later, consider converting them to shorter WebM/MP4 clips or hosting them on a CDN.

## Content editing

- Hover the top-left corner to reveal the editor.
- Press `E` to toggle editing.
- Press `Cmd/Ctrl + S` to save edits locally.
- Use **導出 HTML** to download an edited standalone HTML file.

## Key files

- `index.html`: page structure and copy
- `styles.css`: visual system and responsive layout
- `script.js`: video switching, reveal motion, and inline editing
- `assets/videos`: brand videos
- `assets/resume`: downloadable resumes
