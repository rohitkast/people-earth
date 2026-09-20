function formatYear(year) {
  if (year == null || Number.isNaN(year)) return "";
  const y = Math.round(year);
  if (y < 0) return `${Math.abs(y).toLocaleString("en-US")} BCE`;
  return `${y} CE`;
}

const SPEEDS = [
  { id: "slow", label: "Slow" },
  { id: "medium", label: "Medium" },
  { id: "fast", label: "Fast" },
];

export default function Hud({
  year,
  yearIndex,
  years,
  playing,
  speed,
  peoplePerDot,
  onPlay,
  onScrub,
  onSpeed,
}) {
  const peopleLabel = peoplePerDot ? peoplePerDot.toLocaleString("en-US") : "";

  return (
    <div className="hud">
      <nav className="hud-links" aria-label="Links">
        <a
          aria-label="Rohit Kasturi"
          className="hud-link"
          href="https://rohitkasturi.vercel.app"
          target="_blank"
          rel="noreferrer"
        >
          <svg className="hud-icon" viewBox="0 0 24 24" aria-hidden="true">
            <circle cx="12" cy="8" r="3.25" fill="none" stroke="currentColor" strokeWidth="1.5" />
            <path
              d="M5.2 19.2c.9-3.1 3.3-4.7 6.8-4.7s5.9 1.6 6.8 4.7"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.5"
              strokeLinecap="round"
            />
          </svg>
          <span>Me</span>
        </a>
        <a
          className="hud-link"
          href="https://github.com/rohitkast/people-earth"
          target="_blank"
          rel="noreferrer"
        >
          <svg className="hud-icon" viewBox="0 0 16 16" aria-hidden="true">
            <path
              fill="currentColor"
              d="M8 0C3.58 0 0 3.58 0 8c0 3.54 2.29 6.53 5.47 7.59.4.07.55-.17.55-.38 0-.19-.01-.82-.01-1.49-2.01.37-2.53-.49-2.69-.94-.09-.23-.48-.94-.82-1.13-.28-.15-.68-.52-.01-.53.63-.01 1.08.58 1.23.82.72 1.21 1.87.87 2.33.66.07-.52.28-.87.51-1.07-1.78-.2-3.64-.89-3.64-3.95 0-.87.31-1.59.82-2.15-.08-.2-.36-1.02.08-2.12 0 0 .67-.21 2.2.82.64-.18 1.32-.27 2-.27s1.36.09 2 .27c1.53-1.04 2.2-.82 2.2-.82.44 1.1.16 1.92.08 2.12.51.56.82 1.27.82 2.15 0 3.07-1.87 3.75-3.65 3.95.29.25.54.73.54 1.48 0 1.07-.01 1.93-.01 2.2 0 .21.15.46.55.38A8.01 8.01 0 0 0 16 8c0-4.42-3.58-8-8-8z"
            />
          </svg>
          <span>GitHub</span>
        </a>
        <a
          className="hud-link"
          href={`${import.meta.env.BASE_URL}people-earth.mp4`}
          download="people-earth.mp4"
          aria-label="Download video"
        >
          <svg className="hud-icon" viewBox="0 0 24 24" aria-hidden="true">
            <path
              d="M12 4v10.5M8.2 11.2 12 15l3.8-3.8"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            <path
              d="M5 18.5h14"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.5"
              strokeLinecap="round"
            />
          </svg>
          <span>Video</span>
        </a>
      </nav>

      <header className="hud-top">
        <div className="kicker">Population density</div>
        <h1>The peopling of Earth</h1>
        <p>
          One dot ≈ {peopleLabel} people, inside today’s country borders.
          Data is from{" "}
          <a
            href="https://ourworldindata.org/grapher/population-density"
            target="_blank"
            rel="noreferrer"
          >
            Our World in Data
          </a>{" "}
        </p>
      </header>

      <footer className="hud-bottom">
        <div className="hud-year">{formatYear(year)}</div>
        <div className="controls">
          <button type="button" className="play" onClick={onPlay}>
            {playing ? "Pause" : "Play"}
          </button>
          <input
            type="range"
            min={0}
            max={years.length - 1}
            value={yearIndex}
            onChange={(e) => onScrub(Number(e.target.value))}
            aria-label="Year"
          />
          <div className="speeds" role="group" aria-label="Playback speed">
            {SPEEDS.map((s) => (
              <button
                key={s.id}
                type="button"
                className={speed === s.id ? "speed is-on" : "speed"}
                onClick={() => onSpeed(s.id)}
              >
                {s.label}
              </button>
            ))}
          </div>
        </div>
        <p className="source">
          Data source: HYDE (2023); Gapminder (2022); UN WPP (2024); UN FAO
          (2024) ·{" "}
          <a
            href="https://ourworldindata.org/grapher/population-density"
            target="_blank"
            rel="noreferrer"
          >
            Our World in Data
          </a>
          {" "}
        </p>
      </footer>
    </div>
  );
}
