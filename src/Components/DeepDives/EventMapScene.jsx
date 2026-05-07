import { MapPin } from "lucide-react";
import countriesTopology from "world-atlas/countries-110m.json";

const EASTERN_EUROPE_BOUNDS = {
  minLng: 5,
  maxLng: 45,
  minLat: 44,
  maxLat: 60,
};

const BARBAROSSA_BOUNDS = {
  minLng: 3,
  maxLng: 58,
  minLat: 41,
  maxLat: 63,
};

const D_DAY_BOUNDS = {
  minLng: -2.1,
  maxLng: 0.65,
  minLat: 48.75,
  maxLat: 49.95,
};

const FALL_OF_BERLIN_BOUNDS = {
  minLng: -10,
  maxLng: 45,
  minLat: 42,
  maxLat: 61,
};

const EASTERN_EUROPE_COUNTRY_STYLES = {
  Germany: "germany",
  Poland: "poland",
  Belarus: "ussr",
  Ukraine: "ussr",
  Lithuania: "ussr",
  Latvia: "ussr",
  Estonia: "ussr",
};

const BARBAROSSA_COUNTRY_STYLES = {
  Germany: "axis-zone",
  Poland: "axis-zone",
  Czechia: "axis-zone",
  Slovakia: "axis-zone",
  Hungary: "axis-zone",
  Romania: "axis-zone",
  Moldova: "axis-zone",
  Russia: "soviet-front",
  Belarus: "soviet-front",
  Ukraine: "soviet-front",
  Lithuania: "soviet-front",
  Latvia: "soviet-front",
  Estonia: "soviet-front",
};

const D_DAY_COUNTRY_STYLES = {
  "United Kingdom": "allied-base",
  Ireland: "neighbor",
  France: "occupied-france",
  Belgium: "occupied-france",
  Netherlands: "occupied-france",
  Germany: "germany",
};

const FALL_OF_BERLIN_COUNTRY_STYLES = {
  "United Kingdom": "allied-front",
  Ireland: "neighbor",
  France: "allied-front",
  Belgium: "allied-front",
  Netherlands: "allied-front",
  Luxembourg: "allied-front",
  Italy: "allied-front",
  Germany: "germany",
  Austria: "germany",
  Czechia: "germany",
  Poland: "soviet-front",
  Russia: "soviet-front",
  Belarus: "soviet-front",
  Ukraine: "soviet-front",
  Lithuania: "soviet-front",
  Latvia: "soviet-front",
  Estonia: "soviet-front",
  Moldova: "soviet-front",
};

const EASTERN_EUROPE_LABELS = [
  { text: "Germany", lng: 10.5, lat: 51.2 },
  { text: "USSR", lng: 32.4, lat: 52.3 },
  { text: "Warsaw", lng: 21.0122, lat: 52.2297, type: "city" },
  { text: "Berlin", lng: 13.405, lat: 52.52, type: "city" },
  { text: "Danzig", lng: 18.6466, lat: 54.352, type: "city" },
  { text: "Krakow", lng: 19.945, lat: 50.0647, type: "city" },
  { text: "Lviv", lng: 24.0311, lat: 49.8429, type: "city" },
];

function decodeArc(topology, arcIndex) {
  const arc = topology.arcs[arcIndex < 0 ? ~arcIndex : arcIndex];
  const points = [];
  const { scale, translate } = topology.transform;
  let x = 0;
  let y = 0;

  for (const point of arc) {
    x += point[0];
    y += point[1];
    points.push([
      x * scale[0] + translate[0],
      y * scale[1] + translate[1],
    ]);
  }

  return arcIndex < 0 ? points.reverse() : points;
}

function decodeRing(topology, ring) {
  return ring.flatMap((arcIndex, index) => {
    const points = decodeArc(topology, arcIndex);
    return index === 0 ? points : points.slice(1);
  });
}

function getGeometryRings(topology, geometry) {
  if (geometry.type === "Polygon") {
    return geometry.arcs.map((ring) => decodeRing(topology, ring));
  }

  if (geometry.type === "MultiPolygon") {
    return geometry.arcs.flatMap((polygon) => polygon.map((ring) => decodeRing(topology, ring)));
  }

  return [];
}

function projectEasternEuropePoint(point, bounds = EASTERN_EUROPE_BOUNDS) {
  const [lng, lat] = Array.isArray(point) ? point : [point.lng, point.lat];
  const x = ((lng - bounds.minLng) /
    (bounds.maxLng - bounds.minLng)) * 100;
  const y = ((bounds.maxLat - lat) /
    (bounds.maxLat - bounds.minLat)) * 100;

  return { x, y };
}

function ringToPath(ring, bounds = EASTERN_EUROPE_BOUNDS) {
  return ring
    .map((point, index) => {
      const { x, y } = projectEasternEuropePoint(point, bounds);
      return `${index === 0 ? "M" : "L"} ${x.toFixed(2)} ${y.toFixed(2)}`;
    })
    .join(" ")
    .concat(" Z");
}

function getEasternEuropeMapFeatures(countryStyles = EASTERN_EUROPE_COUNTRY_STYLES, bounds = EASTERN_EUROPE_BOUNDS) {
  return countriesTopology.objects.countries.geometries
    .map((geometry) => {
      const name = geometry.properties?.name;
      const mapClass = countryStyles[name] || "neighbor";
      const rings = getGeometryRings(countriesTopology, geometry);
      const visibleRings = rings.filter((ring) =>
        ring.some(([lng, lat]) =>
          lng >= bounds.minLng &&
          lng <= bounds.maxLng &&
          lat >= bounds.minLat &&
          lat <= bounds.maxLat
        )
      );

      if (!visibleRings.length) return null;

      return {
        name,
        mapClass,
        paths: visibleRings.map((ring) => ringToPath(ring, bounds)),
      };
    })
    .filter(Boolean);
}

const EASTERN_EUROPE_MAP_FEATURES = getEasternEuropeMapFeatures();
const BARBAROSSA_MAP_FEATURES = getEasternEuropeMapFeatures(BARBAROSSA_COUNTRY_STYLES, BARBAROSSA_BOUNDS);
const FALL_OF_BERLIN_MAP_FEATURES = getEasternEuropeMapFeatures(FALL_OF_BERLIN_COUNTRY_STYLES, FALL_OF_BERLIN_BOUNDS);

const SCENE_VARIANTS = {
  barbarossa: {
    bounds: BARBAROSSA_BOUNDS,
    mapFeatures: BARBAROSSA_MAP_FEATURES,
  },
  dDay: {
    bounds: D_DAY_BOUNDS,
    mapFeatures: getEasternEuropeMapFeatures(D_DAY_COUNTRY_STYLES, D_DAY_BOUNDS),
  },
  fallOfBerlin: {
    bounds: FALL_OF_BERLIN_BOUNDS,
    mapFeatures: FALL_OF_BERLIN_MAP_FEATURES,
  },
};

export default function EventMapScene({ event, color }) {
  const scene = event.mapScene;

  if (!scene) {
    return (
      <div className="deep-dive-reader__event-map" style={{ "--arc-color": color }}>
        <span className="deep-dive-reader__route" />
        <span className="deep-dive-reader__map-point">
          <MapPin size={24} />
        </span>
        <span className="deep-dive-reader__place">{event.place}</span>
      </div>
    );
  }

  const variant = SCENE_VARIANTS[scene.variant];
  const sceneBounds = variant?.bounds || EASTERN_EUROPE_BOUNDS;
  const projectedArrows = scene.arrows.map((arrow) => ({
    ...arrow,
    from: projectEasternEuropePoint(arrow.from, sceneBounds),
    to: projectEasternEuropePoint(arrow.to, sceneBounds),
    control: arrow.control ? projectEasternEuropePoint(arrow.control, sceneBounds) : null,
  }));
  const mapFeatures = variant?.mapFeatures || EASTERN_EUROPE_MAP_FEATURES;
  const labels = scene.labels || EASTERN_EUROPE_LABELS;
  const legend = scene.legend || [
    { className: "war-map__legend-germany", text: "German advance" },
    { className: "war-map__legend-soviet", text: "Soviet entry" },
    { className: "war-map__legend-objective", text: "Objective" },
  ];

  return (
    <div className={`deep-dive-reader__event-map deep-dive-reader__event-map--animated${scene.variant ? ` deep-dive-reader__event-map--${scene.variant}` : ""}`}>
      <div className="war-map__header">
        <span>{scene.dateLabel}</span>
        <strong>{scene.regionLabel}</strong>
      </div>

      <div className={`war-map__surface${scene.variant ? ` war-map__surface--${scene.variant}` : ""}`} aria-label={`${event.title} animated map`}>
        <svg className="war-map__svg" viewBox="0 0 100 100" preserveAspectRatio="none" aria-hidden="true">
          {mapFeatures.map((feature) =>
            feature.paths.map((path, index) => (
              <path
                key={`${feature.name}-${index}`}
                className={`war-map__country war-map__country--${feature.mapClass}`}
                d={path}
              />
            ))
          )}
        </svg>
        <svg className="war-map__arrows" viewBox="0 0 100 100" preserveAspectRatio="none" aria-hidden="true">
          <defs>
            {projectedArrows.map((arrow) => (
              <marker
                key={arrow.id}
                id={`arrowhead-${arrow.id}`}
                markerWidth="5.5"
                markerHeight="5.5"
                refX="5.2"
                refY="2.75"
                orient="auto"
                markerUnits="userSpaceOnUse"
              >
                <path d="M 0 0 L 5.5 2.75 L 0 5.5 Z" fill={arrow.color} />
              </marker>
            ))}
          </defs>
          {projectedArrows.map((arrow) => {
            const arrowStyle = {
              "--arrow-color": arrow.color,
              "--arrow-delay": arrow.delay,
            };

            if (arrow.control) {
              return (
                <path
                  key={arrow.id}
                  className="war-map__svg-arrow"
                  d={`M ${arrow.from.x.toFixed(2)} ${arrow.from.y.toFixed(2)} Q ${arrow.control.x.toFixed(2)} ${arrow.control.y.toFixed(2)} ${arrow.to.x.toFixed(2)} ${arrow.to.y.toFixed(2)}`}
                  style={arrowStyle}
                  markerEnd={`url(#arrowhead-${arrow.id})`}
                />
              );
            }

            return (
              <line
                key={arrow.id}
                className="war-map__svg-arrow"
                x1={arrow.from.x}
                y1={arrow.from.y}
                x2={arrow.to.x}
                y2={arrow.to.y}
                style={arrowStyle}
                markerEnd={`url(#arrowhead-${arrow.id})`}
              />
            );
          })}
        </svg>
        <div className="war-map__legend">
          {legend.map((item) => (
            <span key={item.text}><i className={item.className} /> {item.text}</span>
          ))}
        </div>

        {labels.map((label, index) => {
          const { x, y } = projectEasternEuropePoint(label, sceneBounds);
          const labelKey = `${scene.variant || "default"}-${label.type || "label"}-${label.text}-${index}`;

          if ((label.type === "capital" || label.type === "objective") && !label.wide) {
            return (
              <span
                key={labelKey}
                className={`war-map__point war-map__point--${label.type}`}
                style={{ left: `${x}%`, top: `${y}%` }}
              >
                <span className="war-map__objective-ring" />
                <MapPin size={22} />
                <span>{label.text}</span>
              </span>
            );
          }

          if (label.type === "city") {
            return (
              <span
                key={labelKey}
                className="war-map__city"
                style={{ left: `${x}%`, top: `${y}%` }}
              >
                <i />
                {label.text}
              </span>
            );
          }

          if (label.type === "division") {
            return (
              <span
                key={labelKey}
                className="war-map__division"
                style={{ left: `${x}%`, top: `${y}%` }}
              >
                <strong>{label.text}</strong>
                <i className={`war-map__flag war-map__flag--${label.flag}`} />
              </span>
            );
          }

          if (label.type === "beach") {
            return (
              <span
                key={labelKey}
                className="war-map__beach"
                style={{ left: `${x}%`, top: `${y}%` }}
              >
                {label.text}
              </span>
            );
          }

          return (
            <span
              key={labelKey}
              className={`war-map__label${label.wide ? " war-map__label--wide" : ""}`}
              style={{ left: `${x}%`, top: `${y}%` }}
            >
              {label.text}
            </span>
          );
        })}
      </div>

      <ol className="war-map__phases">
        {scene.phases.map((phase, index) => (
          <li key={phase} style={{ animationDelay: `${0.35 + index * 0.42}s` }}>
            {phase}
          </li>
        ))}
      </ol>
    </div>
  );
}
