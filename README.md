# The peopling of Earth

A full-screen map of **country-level population density** as dots. Hit Play and the world fills from 10,000 BCE to 2100.

One dot is a slice of people (about 350,000). Denser countries get more dots. There is no zoom — the whole planet stays on screen.

**[Live idea](https://github.com/rohitkast/people-earth)** · **[Me](https://rohitkasturi.vercel.app)**

## Data

We use the [Our World in Data population-density chart](https://ourworldindata.org/grapher/population-density) CSV in `analysis/`. We did not download HYDE, Gapminder, or the UN ourselves. OWID already combined those into one file. Years after 2023 in that file are UN medium projections that OWID included — we did not forecast 2100.

## Run

```bash
npm install
npm run prepare-data
npm run dev
```

Open the URL Vite prints (usually `http://127.0.0.1:5173`).

`prepare-data` turns `analysis/population-density.csv` plus [Natural Earth](https://www.naturalearthdata.com/) country outlines into `public/data/` JSON. Run it again if you change the CSV.

## Notebook

The OWID CSV, metadata, and notebook are in `analysis/`.

```bash
cd analysis
python3 -m venv .venv
source .venv/bin/activate
pip install -r req.txt
jupyter notebook population_density.ipynb
```

## How it works (for a normal dev)

1. **Prepare:** a Node script reads the CSV, keeps real countries, and drops random dots *inside* each country polygon. More people (density × land area) → more dots.
2. **Page:** Vite + React (JavaScript). React only draws the title, Play, slider, and speed. The map is a `<canvas>`.
3. **Map:** [d3-geo](https://github.com/d3/d3-geo) projects lon/lat onto a **rectangular** world (equirectangular). Each year we show the first *k* dots for that country and fade new ones in.

That is the same idea as “dot density” maps: the count is from the data; the exact spot of a dot inside a country is random, not a city.

## GitHub Pages

After you push this repo, set **Settings → Pages → Source: GitHub Actions**. The workflow builds the Vite app and publishes `dist/`. The live URL is `https://<user>.github.io/<repo>/`.

## Stack

- React + Vite (JavaScript, not TypeScript)
- `d3-geo` for the map projection
- Canvas for tens of thousands of dots (React does not render each dot)

## License / credit

Population density: HYDE (2023); Gapminder (2022); UN WPP (2024); UN FAO (2024) — [Our World in Data](https://ourworldindata.org/grapher/population-density) (CC BY). Country shapes: Natural Earth.
