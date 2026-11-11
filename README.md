# Summit – Mountain Video Website

A static website with a looping mountain video background, a Home page, About Us, Map, Login/Sign up and Profile. No build tools needed.

## Files

```
index.html     – all pages, footer and links
style.css      – styling and layout
script.js      – page routing, map, login and profile logic
assets/
  mountain.mp4          – your background video (you add this)
  mountain-poster.jpg   – optional still image shown while the video loads
```

## Add the mountain video

1. Download a free mountain scenery video, for example from [Pexels Videos](https://www.pexels.com/search/videos/mountain/) or [Pixabay Videos](https://pixabay.com/videos/search/mountain/).
2. Rename it to `mountain.mp4` and put it in an `assets/` folder next to `index.html`.
3. Keep it under about 10 MB (GitHub warns above 50 MB and blocks above 100 MB). A 720p, 10 to 20 second loop works well.

Without the video, the page shows a green and blue gradient background.

## Run locally

Open `index.html` in a browser, or run `python -m http.server` in this folder and visit `http://localhost:8000`.

## Publish on GitHub Pages

1. Create a new repository and upload all files (including `assets/`).
2. Go to **Settings → Pages**.
3. Under **Source**, choose **Deploy from a branch**, pick `main` and `/ (root)`, then Save.
4. Your site appears at `https://<your-username>.github.io/<repo-name>/`.

## Customise

- **Add a card/template:** copy an `<article class="card">` block in `index.html`.
- **Edit footer links:** change the `<a>` tags inside `<footer class="footer">`.
- **Add map markers:** edit the `places` list in `script.js`.
- **Add a new page:** add a `<section id="newpage" class="page">`, a nav link `<a href="#newpage" data-link>`, and add `"newpage"` to the `pages` array in `script.js`.
- **Change colours:** edit the variables at the top of `style.css`.

## Important note on login

The login and profile use the browser's `localStorage`, so accounts exist only on the visitor's own device and are not secure. For real users, connect a backend or an auth service such as Firebase Auth or Supabase.
