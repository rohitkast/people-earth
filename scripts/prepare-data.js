/**
 * Build public/data/atlas.json and countries.json from the OWID CSV
 * and Natural Earth 110m polygons. Run from the repo root: npm run prepare-data
 *
 * Dots are sampled inside country borders (uniform). One dot ≈ peoplePerDot people.
 */
import { readFile, writeFile, mkdir } from "node:fs/promises";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { geoArea, geoContains } from "d3-geo";

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = join(__dirname, "..");
const OUT_DIR = join(ROOT, "public", "data");
const CSV_PATH = join(ROOT, "analysis", "population-density.csv");
const NE_URL =
  "https://raw.githubusercontent.com/nvkelso/natural-earth-vector/master/geojson/ne_110m_admin_0_countries.geojson";

const EARTH_RADIUS_KM = 6371;
const TARGET_DOTS = 28000;
const ISO3 = /^[A-Z]{3}$/;

function mulberry32(seed) {
  let a = seed >>> 0;
  return () => {
    a = (a + 0x6d2b79f5) >>> 0;
    let t = a;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

function hashCode(str) {
  let h = 2166136261;
  for (let i = 0; i < str.length; i++) {
    h ^= str.charCodeAt(i);
    h = Math.imul(h, 16777619);
  }
  return h >>> 0;
}

function parseCsv(text) {
  const lines = text.trim().split(/\r?\n/);
  const rows = [];
  for (let i = 1; i < lines.length; i++) {
    const line = lines[i];
    if (!line) continue;
    const parts = line.split(",");
    if (parts.length < 4) continue;
    const entity = parts[0];
    const code = parts[1];
    const year = Number(parts[2]);
    const density = Number(parts[3]);
    if (!ISO3.test(code) || !Number.isFinite(year) || !Number.isFinite(density)) {
      continue;
    }
    rows.push({ entity, code, year, density });
  }
  return rows;
}

function yearLadder(years) {
  const sorted = [...new Set(years)].sort((a, b) => a - b);
  const max = sorted[sorted.length - 1];
  return sorted.filter((y) => y < 1950 || y % 10 === 0 || y === max);
}

function isoOf(props) {
  const candidates = [props.ISO_A3, props.ADM0_A3, props.ISO_A3_EH, props.ADM0_A3_US];
  for (const c of candidates) {
    if (typeof c === "string" && ISO3.test(c) && c !== "-99") return c;
  }
  return null;
}

function ringBounds(ring) {
  let minLon = Infinity;
  let minLat = Infinity;
  let maxLon = -Infinity;
  let maxLat = -Infinity;
  for (const [lon, lat] of ring) {
    if (lon < minLon) minLon = lon;
    if (lat < minLat) minLat = lat;
    if (lon > maxLon) maxLon = lon;
    if (lat > maxLat) maxLat = lat;
  }
  return [minLon, minLat, maxLon, maxLat];
}

function polygonParts(geometry) {
  if (!geometry) return [];
  if (geometry.type === "Polygon") return [geometry.coordinates];
  if (geometry.type === "MultiPolygon") return geometry.coordinates;
  return [];
}

/** Sample inside each polygon part so antimeridian countries still get dots. */
function samplePoints(feature, count, rng) {
  if (count <= 0) return [];
  const parts = polygonParts(feature.geometry);
  if (!parts.length) return [];
  const boxes = parts.map((coords) => ringBounds(coords[0]));
  const weights = boxes.map(([minLon, minLat, maxLon, maxLat]) => {
    const w = Math.max(maxLon - minLon, 0.01);
    const h = Math.max(maxLat - minLat, 0.01);
    return w * h;
  });
  const weightSum = weights.reduce((a, b) => a + b, 0);
  const points = [];
  const maxTries = Math.max(count * 120, 8000);
  let tries = 0;
  while (points.length < count && tries < maxTries) {
    tries += 1;
    let pick = rng() * weightSum;
    let idx = 0;
    for (; idx < weights.length; idx += 1) {
      pick -= weights[idx];
      if (pick <= 0) break;
    }
    idx = Math.min(idx, parts.length - 1);
    const [minLon, minLat, maxLon, maxLat] = boxes[idx];
    const lon = minLon + rng() * (maxLon - minLon);
    const lat = minLat + rng() * (maxLat - minLat);
    if (geoContains(feature, [lon, lat])) {
      points.push([
        Math.round(lon * 1000) / 1000,
        Math.round(lat * 1000) / 1000,
      ]);
    }
  }
  return points;
}

/** Hold the last known density for years on the playback ladder. */
function densityOnLadder(byYear, years) {
  const keys = [...byYear.keys()].sort((a, b) => a - b);
  let i = 0;
  let last = 0;
  return years.map((y) => {
    while (i < keys.length && keys[i] <= y) {
      last = byYear.get(keys[i]);
      i += 1;
    }
    return last;
  });
}

async function main() {
  console.log("Reading CSV…");
  const csvText = await readFile(CSV_PATH, "utf8");
  const rows = parseCsv(csvText);
  console.log(`ISO-3 rows: ${rows.length}`);

  const years = yearLadder(rows.map((r) => r.year));
  console.log(`Year frames: ${years.length} (${years[0]} → ${years[years.length - 1]})`);

  const byCode = new Map();
  for (const row of rows) {
    if (!byCode.has(row.code)) {
      byCode.set(row.code, { name: row.entity, byYear: new Map() });
    }
    const rec = byCode.get(row.code);
    rec.byYear.set(row.year, row.density);
    rec.name = row.entity;
  }

  console.log("Downloading Natural Earth 110m…");
  const ne = await fetch(NE_URL).then((r) => {
    if (!r.ok) throw new Error(`Natural Earth fetch failed: ${r.status}`);
    return r.json();
  });

  const geomByIso = new Map();
  for (const f of ne.features) {
    const iso = isoOf(f.properties || {});
    if (!iso) continue;
    if (!geomByIso.has(iso)) geomByIso.set(iso, f);
  }

  const countriesPrep = [];

  for (const [code, rec] of byCode) {
    const feature = geomByIso.get(code);
    if (!feature) continue;
    const areaKm2 = geoArea(feature) * EARTH_RADIUS_KM * EARTH_RADIUS_KM;
    const densities = densityOnLadder(rec.byYear, years);
    const pops = densities.map((d) => Math.max(0, d) * areaKm2);
    countriesPrep.push({
      code,
      name: rec.name,
      feature,
      areaKm2,
      pops,
    });
  }

  const latestPop = countriesPrep.reduce(
    (s, c) => s + c.pops[c.pops.length - 1],
    0,
  );
  let peoplePerDot = Math.round(latestPop / TARGET_DOTS / 50000) * 50000;
  if (peoplePerDot < 100000) peoplePerDot = 100000;
  console.log(
    `Estimated people in last frame: ${Math.round(latestPop).toLocaleString()} → 1 dot ≈ ${peoplePerDot.toLocaleString()} people`,
  );

  const atlasCountries = [];
  const landFeatures = ne.features.map((f) => ({
    type: "Feature",
    properties: {
      code: isoOf(f.properties || {}) || "",
      name: f.properties?.NAME || f.properties?.ADMIN || "",
    },
    geometry: f.geometry,
  }));

  for (const c of countriesPrep) {
    const counts = c.pops.map((p) => Math.round(p / peoplePerDot));
    const maxK = Math.max(...counts, 0);
    const rng = mulberry32(hashCode(c.code));
    const points = samplePoints(c.feature, maxK, rng);
    if (points.length === 0 && maxK > 0) {
      console.warn(`No points sampled for ${c.code} (wanted ${maxK})`);
    }
    const k = Math.min(maxK, points.length);
    atlasCountries.push({
      code: c.code,
      name: c.name,
      counts: counts.map((n) => Math.min(n, k)),
      lon: points.map((p) => p[0]),
      lat: points.map((p) => p[1]),
    });
  }

  const unmatched = [...byCode.keys()].filter((code) => !geomByIso.has(code));
  if (unmatched.length) {
    console.log(`No 110m polygon for: ${unmatched.join(", ")}`);
  }

  const lastCounts = atlasCountries.reduce(
    (s, c) => s + c.counts[c.counts.length - 1],
    0,
  );
  console.log(
    `Countries: ${atlasCountries.length}  ·  dots in last frame: ${lastCounts}`,
  );

  await mkdir(OUT_DIR, { recursive: true });
  await writeFile(
    join(OUT_DIR, "countries.json"),
    JSON.stringify({ type: "FeatureCollection", features: landFeatures }),
  );
  await writeFile(
    join(OUT_DIR, "atlas.json"),
    JSON.stringify({
      peoplePerDot,
      years,
      source:
        "HYDE (2023); Gapminder (2022); UN WPP (2024); UN FAO (2024) — Our World in Data",
      countries: atlasCountries,
    }),
  );
  console.log(`Wrote ${OUT_DIR}/atlas.json and countries.json`);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
