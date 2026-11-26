# Argusvane website

The website for Argusvane, published at <https://argusvane.com> with GitHub Pages.

It is plain HTML, CSS and JavaScript. There is no build step, no package
manager and no dependency to install. What is in `site/` is exactly what gets
published.

## Layout

```
site/                     the published site
  index.html              the home page
  products.html           the products page
  name.html               the story of the name (linked from the footer)
  404.html                shown for any missing address
  assets/css/site.css     all styles
  assets/js/site.js       footer year and the "Copy address" button
  assets/favicon.svg      browser-tab icon
  assets/products/        one folder of images and video per product
  robots.txt
  .nojekyll               tells GitHub Pages to serve the files as they are
scripts/check.sh          link and path check, run before every deploy
.github/workflows/
  deploy.yml              publishes site/ to GitHub Pages
```

## Preview on your computer

Any static file server works. With Python, which macOS and most Linux systems
already have:

```sh
python3 -m http.server 8080 --directory site
```

Then open <http://localhost:8080>.

## Check before publishing

```sh
./scripts/check.sh
```

It confirms that every file a page points at exists, that every in-page link
has a target, and that no path starts with `/`. The deploy workflow runs the
same check and stops if it fails.

## Publishing

Every push to `main` runs the **Deploy site** workflow
(`.github/workflows/deploy.yml`). It runs `scripts/check.sh` and, if the check
passes, publishes `site/` to GitHub Pages at <https://argusvane.com>. The
workflow can also be started by hand from the **Actions** tab.

The custom domain is set in the repository's **Settings > Pages**, so there is
no `CNAME` file in `site/`. All paths in the site are relative, so it works
unchanged in a sub-folder as well as at the domain root.

## Adding a product

Each product is one `<section class="section product">` in `site/products.html`.
Copy the Datum section, give it a new `id`, replace the content, put its media in
`site/assets/products/<name>/`, and add the name to the strip near the top of the
page.

## Editing

- Copy lives in `site/index.html`.
- Colours, fonts and spacing are variables at the top of `site/assets/css/site.css`.
  The site follows the visitor's light or dark setting; the dark values are in
  the `prefers-color-scheme: dark` block directly below.
- The mark is inline SVG. The small version is the `av-mark` symbol near the top
  of each HTML file; the large animated version is in the hero section of
  `index.html`.
