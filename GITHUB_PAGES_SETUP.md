# GitHub Pages Setup — Exact Steps

## 1. Create the repository

Sign in to GitHub as **LabibRafi08** and create a new public repository:

```text
khondaker-labib-portfolio
```

Do not add a README, `.gitignore` or licence during creation; this package already includes the required files.

## 2. Upload the website

Extract the ZIP. Open the extracted website folder and upload **all files and folders inside it** to the repository root.

`index.html` must be visible at the root beside `work.html`, `README.md`, `assets/` and `.github/`.

## 3. Commit

Use a commit message such as:

```text
Initial professional portfolio release
```

## 4. Enable GitHub Pages

Go to:

```text
Repository → Settings → Pages → Build and deployment → Source → GitHub Actions
```

The included workflow will deploy after the next push to `main`.

## 5. Open the live website

```text
https://labibrafi08.github.io/khondaker-labib-portfolio/
```

## Already configured

- GitHub profile and repository URLs
- LinkedIn and ResearchGate
- Email
- YouTube playlist and embedded player
- Current CV PDF
- Canonical metadata, sitemap and robots.txt

## Still optional

- Add a repository URL for the circular-knitting project in `assets/js/config.js`.
- Add a form endpoint in `assets/js/config.js` for direct contact-form delivery.
