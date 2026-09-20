import { geoPath, geoEquirectangular } from "d3-geo";

/**
 * Equirectangular (plate carrée): rectangular world, not the oval Equal Earth
 * that pinched the left and right. Fit to inhabited land so Antarctica
 * does not squash the map into a thin strip.
 */
export function makeProjection(width, height, land) {
  const padX = width * 0.025;
  const padY = height * 0.11;
  const inhabited = {
    type: "FeatureCollection",
    features: land.features.filter((f) => f.properties?.code !== "ATA"),
  };
  return geoEquirectangular()
    .precision(0.15)
    .fitExtent(
      [
        [padX, padY + 12],
        [width - padX, height - padY + 24],
      ],
      inhabited.features.length ? inhabited : land,
    )
    .clipExtent([
      [0, 0],
      [width, height],
    ]);
}

export function landPath(projection, land) {
  const drawn = {
    type: "FeatureCollection",
    features: land.features.filter((f) => f.properties?.code !== "ATA"),
  };
  return geoPath(projection)(drawn.features.length ? drawn : land);
}
