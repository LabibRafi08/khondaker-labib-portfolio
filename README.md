# Khondaker Labib — Professional Portfolio

GitHub Pages-ready portfolio for **Khondaker Labib Al Jonayed**, focused on engineering project coordination, technical programme delivery, research operations and GIS for environment and infrastructure.

## Connected profiles

- GitHub: https://github.com/LabibRafi08
- LinkedIn: https://www.linkedin.com/in/khondaker-labib/
- ResearchGate: https://www.researchgate.net/profile/Khondaker-Labib-Al-Jonayed?ev=hdr_xprf
- Email: labibrafi2000@gmail.com
- YouTube playlist: https://youtube.com/playlist?list=PLK7wpsByrk8k&si=za4aDcfCvUMxgdJn

## Repository selected

Create the repository with this exact name:

```text
khondaker-labib-portfolio
```

Expected live site:

```text
https://labibrafi08.github.io/khondaker-labib-portfolio/
```

## Included integrations

- GitHub profile link
- Portfolio source-repository link
- LinkedIn and ResearchGate links
- Latest CV PDF at `assets/docs/Khondaker_Labib_Al_Jonayed_CV.pdf`
- Personal YouTube playlist inside Soundspace and as an external link
- GitHub Pages deployment workflow
- Canonical links, sitemap, robots.txt and Person structured data using the final GitHub Pages URL

## Publish

1. Create a **public** GitHub repository named `khondaker-labib-portfolio` under `LabibRafi08`.
2. Upload the **contents of this folder** to the repository root. Do not upload the parent folder as one nested folder.
3. Commit to the `main` branch.
4. Go to **Settings → Pages** and set **Source** to **GitHub Actions**.
5. Open the **Actions** tab and wait for `Deploy portfolio to GitHub Pages` to finish.
6. Visit `https://labibrafi08.github.io/khondaker-labib-portfolio/`.

## Local preview

```bash
python -m http.server 8000
```

Then open `http://localhost:8000`.

## Optional later configuration

`assets/js/config.js` still has two intentionally blank fields:

- `knittingProjectRepository`: add when that project receives its own GitHub repository.
- `formEndpoint`: add a Formspree/Web3Forms endpoint for direct form submission; until then the form opens an email draft.

Music remains off by default and requires visitor interaction before playback.
