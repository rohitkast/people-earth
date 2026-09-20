import { useCallback, useEffect, useRef, useState } from "react";
import MapStage from "./stage/MapStage.jsx";
import Hud from "./ui/Hud.jsx";
import "./App.css";

const SPEED_SCALE = {
  slow: 1,
  medium: 0.4,
  fast: 0.16,
};

/** Rest time per data year on Slow. Medium/Fast multiply this. */
function stepDuration(year, speed) {
  let base = 750;
  if (year < 0) base = 1600;
  else if (year < 1500) base = 1100;
  else if (year < 1800) base = 950;
  else if (year < 1950) base = 850;
  return Math.max(50, Math.round(base * SPEED_SCALE[speed]));
}

export default function App() {
  const [atlas, setAtlas] = useState(null);
  const [countries, setCountries] = useState(null);
  const [error, setError] = useState(null);
  const [yearIndex, setYearIndex] = useState(0);
  const [playing, setPlaying] = useState(false);
  const [speed, setSpeed] = useState("medium");
  const yearIndexRef = useRef(0);
  const speedRef = useRef("medium");
  yearIndexRef.current = yearIndex;
  speedRef.current = speed;

  useEffect(() => {
    let cancelled = false;
    Promise.all([
      fetch(`${import.meta.env.BASE_URL}data/atlas.json`).then((r) => {
        if (!r.ok) throw new Error("Missing atlas.json — run npm run prepare-data");
        return r.json();
      }),
      fetch(`${import.meta.env.BASE_URL}data/countries.json`).then((r) => {
        if (!r.ok) throw new Error("Missing countries.json — run npm run prepare-data");
        return r.json();
      }),
    ])
      .then(([a, c]) => {
        if (cancelled) return;
        setAtlas(a);
        setCountries(c);
      })
      .catch((err) => {
        if (!cancelled) setError(err.message);
      });
    return () => {
      cancelled = true;
    };
  }, []);

  useEffect(() => {
    if (!playing || !atlas) return undefined;
    let timer = 0;
    const tick = () => {
      const i = yearIndexRef.current;
      if (i >= atlas.years.length - 1) {
        setPlaying(false);
        return;
      }
      const next = i + 1;
      setYearIndex(next);
      timer = window.setTimeout(
        tick,
        stepDuration(atlas.years[next], speedRef.current),
      );
    };
    timer = window.setTimeout(
      tick,
      stepDuration(atlas.years[yearIndexRef.current], speedRef.current),
    );
    return () => window.clearTimeout(timer);
  }, [playing, atlas, speed]);

  const onScrub = useCallback((index) => {
    setPlaying(false);
    setYearIndex(index);
  }, []);

  const year = atlas ? atlas.years[yearIndex] : null;

  return (
    <div className="app">
      {countries && atlas ? (
        <MapStage
          countries={countries}
          atlas={atlas}
          yearIndex={yearIndex}
          yearFrac={0}
        />
      ) : (
        <div className="boot">{error || "Loading the peopling of Earth…"}</div>
      )}
      {atlas && (
        <Hud
          year={year}
          yearIndex={yearIndex}
          years={atlas.years}
          playing={playing}
          speed={speed}
          peoplePerDot={atlas.peoplePerDot}
          onPlay={() => {
            if (yearIndex >= atlas.years.length - 1) setYearIndex(0);
            setPlaying((p) => !p);
          }}
          onScrub={onScrub}
          onSpeed={setSpeed}
        />
      )}
    </div>
  );
}
