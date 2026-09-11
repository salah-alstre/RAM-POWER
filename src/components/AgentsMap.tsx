"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import type {
  Map as LeafletMap,
  Marker,
  MarkerClusterGroup,
} from "leaflet";
import type { AgentPoint } from "@/lib/agentPoints";
import { mapConfig } from "@/lib/mapConfig";
import { regionLabel } from "@/data/regions";
import { copy } from "@/data/copy";
import "leaflet/dist/leaflet.css";
import "leaflet.markercluster/dist/MarkerCluster.css";
import "leaflet.markercluster/dist/MarkerCluster.Default.css";

type Leaflet = typeof import("leaflet");
type MapStatus = "idle" | "loading" | "ready" | "error";

interface MarkerRecord {
  agentId: string;
  marker: Marker;
}

export interface AgentsMapProps {
  points: AgentPoint[];
  selectedAgentId: string | null;
  onSelectAgent: (agentId: string) => void;
}

/**
 * Client-only Leaflet map for the agent directory.
 *
 * Leaflet and MarkerCluster are loaded only as the map approaches the viewport.
 * Camera fitting is keyed to the actual point set, so parent renders and agent
 * selection changes never reset a visitor's chosen zoom or position.
 */
export default function AgentsMap({
  points,
  selectedAgentId,
  onSelectAgent,
}: AgentsMapProps) {
  const shellRef = useRef<HTMLDivElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const mapRef = useRef<LeafletMap | null>(null);
  const leafletRef = useRef<Leaflet | null>(null);
  const clusterRef = useRef<MarkerClusterGroup | null>(null);
  const markersRef = useRef<Map<string, MarkerRecord>>(new Map());
  const markerAgentIdsRef = useRef<WeakMap<Marker, string>>(new WeakMap());
  const pointsRef = useRef(points);
  const selectedAgentIdRef = useRef(selectedAgentId);
  const onSelectAgentRef = useRef(onSelectAgent);
  const fittedPointSetRef = useRef<string | null>(null);

  const [shouldLoad, setShouldLoad] = useState(false);
  const [status, setStatus] = useState<MapStatus>("idle");
  const [loadAttempt, setLoadAttempt] = useState(0);

  const pointSetKey = useMemo(
    () =>
      points
        .map((point) => `${point.pointId}:${point.lat}:${point.lng}`)
        .sort()
        .join("|"),
    [points],
  );

  const pointDataKey = useMemo(
    () =>
      JSON.stringify(
        points.map((point) => ({
          pointId: point.pointId,
          regionId: point.regionId,
          lat: point.lat,
          lng: point.lng,
          anchorTown: point.anchorTown,
          agent: point.agent,
        })),
      ),
    [points],
  );

  useEffect(() => {
    pointsRef.current = points;
  }, [points, pointDataKey]);

  useEffect(() => {
    selectedAgentIdRef.current = selectedAgentId;
  }, [selectedAgentId]);

  useEffect(() => {
    onSelectAgentRef.current = onSelectAgent;
  }, [onSelectAgent]);

  // Loading just before the map becomes visible keeps Leaflet out of the initial
  // client bundle and avoids doing map work for visitors who never reach it.
  useEffect(() => {
    const shell = shellRef.current;
    if (!shell || shouldLoad) return;

    if (!("IntersectionObserver" in window)) {
      setShouldLoad(true);
      return;
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry?.isIntersecting) return;
        setShouldLoad(true);
        observer.disconnect();
      },
      { rootMargin: "320px 0px" },
    );

    observer.observe(shell);
    return () => observer.disconnect();
  }, [shouldLoad]);

  useEffect(() => {
    if (!shouldLoad) return;

    const container = containerRef.current;
    if (!container) return;
    const mapContainer: HTMLDivElement = container;

    let cancelled = false;
    let createdMap: LeafletMap | null = null;
    let resizeObserver: ResizeObserver | null = null;

    async function initialiseMap() {
      setStatus("loading");

      try {
        const leafletModule = await import("leaflet");
        await import("leaflet.markercluster");

        if (cancelled) return;

        const L = leafletModule.default;
        const reducedMotion = window.matchMedia(
          "(prefers-reduced-motion: reduce)",
        ).matches;

        createdMap = L.map(mapContainer, {
          center: [mapConfig.defaultCenter.lat, mapConfig.defaultCenter.lng],
          zoom: mapConfig.defaultZoom,
          minZoom: mapConfig.minZoom,
          maxZoom: mapConfig.maxZoom,
          scrollWheelZoom: false,
          zoomControl: false,
          attributionControl: true,
          zoomAnimation: !reducedMotion,
          fadeAnimation: !reducedMotion,
          markerZoomAnimation: !reducedMotion,
        });

        L.tileLayer(mapConfig.tileUrl, {
          attribution: mapConfig.attribution,
          subdomains: [...mapConfig.subdomains],
          minZoom: mapConfig.minZoom,
          maxZoom: mapConfig.maxZoom,
        }).addTo(createdMap);

        L.control
          .zoom({
            position: "topright",
            zoomInTitle: copy.agents.mapZoomIn,
            zoomOutTitle: copy.agents.mapZoomOut,
          })
          .addTo(createdMap);

        const cluster = L.markerClusterGroup({
          animate: !reducedMotion,
          animateAddingMarkers: false,
          chunkedLoading: true,
          maxClusterRadius: 46,
          removeOutsideVisibleBounds: true,
          showCoverageOnHover: false,
          spiderfyDistanceMultiplier: 1.25,
          spiderfyOnMaxZoom: true,
          zoomToBoundsOnClick: true,
          iconCreateFunction: (markerCluster) => {
            const count = markerCluster.getChildCount();
            const selectedId = selectedAgentIdRef.current;
            const containsSelected =
              selectedId !== null &&
              markerCluster
                .getAllChildMarkers()
                .some(
                  (marker) =>
                    markerAgentIdsRef.current.get(marker) === selectedId,
                );

            return L.divIcon({
              className: `ram-map-cluster${
                containsSelected ? " ram-map-cluster--selected" : ""
              }`,
              html: `<span aria-label="${escapeHtml(
                copy.agents.clusterOpen(count),
              )}">${count}</span>`,
              iconAnchor: [23, 23],
              iconSize: [46, 46],
            });
          },
        });

        createdMap.addLayer(cluster);
        mapRef.current = createdMap;
        leafletRef.current = L;
        clusterRef.current = cluster;
        fittedPointSetRef.current = null;

        if ("ResizeObserver" in window) {
          resizeObserver = new ResizeObserver(() => {
            createdMap?.invalidateSize({ pan: false });
          });
          resizeObserver.observe(mapContainer);
        }

        setStatus("ready");
      } catch {
        if (cancelled) return;
        resizeObserver?.disconnect();
        createdMap?.remove();
        createdMap = null;
        mapRef.current = null;
        leafletRef.current = null;
        clusterRef.current = null;
        markersRef.current.clear();
        markerAgentIdsRef.current = new WeakMap();
        setStatus("error");
      }
    }

    void initialiseMap();

    return () => {
      cancelled = true;
      resizeObserver?.disconnect();
      createdMap?.remove();
      mapRef.current = null;
      leafletRef.current = null;
      clusterRef.current = null;
      markersRef.current.clear();
      markerAgentIdsRef.current = new WeakMap();
      fittedPointSetRef.current = null;
    };
  }, [loadAttempt, shouldLoad]);

  // Rebuild markers only when their serialised data changes. A separate point-set
  // key decides whether the camera needs fitting.
  useEffect(() => {
    if (status !== "ready") return;

    const L = leafletRef.current;
    const map = mapRef.current;
    const cluster = clusterRef.current;
    if (!L || !map || !cluster) return;

    cluster.clearLayers();
    markersRef.current.clear();
    markerAgentIdsRef.current = new WeakMap();

    const currentPoints = pointsRef.current;
    const markers = currentPoints.map((point) => {
      const selected = point.agent.id === selectedAgentIdRef.current;
      const displayName = point.agent.company ?? point.agent.name;
      const accessibleLabel = `${displayName}، ${regionLabel(
        point.regionId,
      )}، ${point.anchorTown}`;
      const marker = L.marker([point.lat, point.lng], {
        alt: accessibleLabel,
        icon: createAgentIcon(L, selected),
        keyboard: true,
        riseOnHover: true,
        riseOffset: 500,
        title: accessibleLabel,
        zIndexOffset: selected ? 1000 : 0,
      });

      marker.bindTooltip(createTooltip(point), {
        className: "ram-map-tooltip",
        direction: "top",
        offset: [0, -16],
        opacity: 1,
      });
      marker.on("click", () => onSelectAgentRef.current(point.agent.id));

      markersRef.current.set(point.pointId, {
        agentId: point.agent.id,
        marker,
      });
      markerAgentIdsRef.current.set(marker, point.agent.id);
      return marker;
    });

    cluster.addLayers(markers);
    cluster.refreshClusters();
    map.invalidateSize({ pan: false });

    if (fittedPointSetRef.current !== pointSetKey) {
      fittedPointSetRef.current = pointSetKey;
      fitPointSet(map, L, currentPoints);
    }
  }, [pointDataKey, pointSetKey, status]);

  // Selection updates marker and cluster styling without changing the viewport.
  useEffect(() => {
    if (status !== "ready") return;

    const L = leafletRef.current;
    const cluster = clusterRef.current;
    if (!L || !cluster) return;

    for (const { agentId, marker } of markersRef.current.values()) {
      const selected = agentId === selectedAgentId;
      marker.setIcon(createAgentIcon(L, selected));
      marker.setZIndexOffset(selected ? 1000 : 0);
    }
    cluster.refreshClusters();
  }, [selectedAgentId, status]);

  function showAllPoints() {
    const map = mapRef.current;
    const L = leafletRef.current;
    if (!map || !L) return;

    map.invalidateSize({ pan: false });
    fitPointSet(map, L, pointsRef.current);
  }

  function retry() {
    setLoadAttempt((attempt) => attempt + 1);
  }

  const showLoading = status === "idle" || status === "loading";

  return (
    <figure className="ram-agents-map m-0">
      <div
        ref={shellRef}
        className="relative isolate overflow-hidden rounded-2xl border border-charcoal/10 bg-pearl-dim shadow-[0_18px_50px_-28px_rgba(16,16,16,0.42)]"
      >
        <div
          ref={containerRef}
          className="h-[420px] w-full sm:h-[520px]"
          aria-label={copy.agents.viewMap}
          role="region"
        />

        {status === "ready" && (
          <button
            type="button"
            onClick={showAllPoints}
            disabled={points.length === 0}
            className="absolute left-3 top-3 z-[1000] inline-flex min-h-10 items-center justify-center gap-2 rounded-lg border border-charcoal/10 bg-white/95 px-3.5 py-2 text-xs font-extrabold text-charcoal shadow-[0_5px_18px_rgba(16,16,16,0.18)] backdrop-blur-sm transition-colors hover:bg-orange focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-orange-dark disabled:cursor-not-allowed disabled:opacity-50 sm:left-4 sm:top-4 sm:text-sm"
          >
            <svg
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="none"
              aria-hidden="true"
            >
              <path
                d="M8 3H3v5M16 3h5v5M8 21H3v-5m13 5h5v-5"
                stroke="currentColor"
                strokeWidth="1.8"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
            {copy.agents.showAllRegions}
          </button>
        )}

        {status === "ready" && points.length === 0 && (
          <div className="pointer-events-none absolute inset-x-4 top-1/2 z-[800] -translate-y-1/2 rounded-xl bg-white/95 px-5 py-4 text-center text-sm font-bold leading-relaxed text-charcoal shadow-lg sm:inset-x-auto sm:left-1/2 sm:w-[min(90%,30rem)] sm:-translate-x-1/2">
            {copy.agents.mapNoPointNote}
          </div>
        )}

        {showLoading && (
          <div
            className="absolute inset-0 z-[1100] grid place-items-center bg-pearl-dim"
            role="status"
          >
            <div className="flex flex-col items-center gap-3 text-charcoal/70">
              <span className="ram-map-loader" aria-hidden="true" />
              <span className="text-sm font-bold">{copy.agents.mapLoading}</span>
            </div>
          </div>
        )}

        {status === "error" && (
          <div
            className="absolute inset-0 z-[1100] grid place-items-center bg-pearl-dim px-6 text-center"
            role="alert"
          >
            <div className="max-w-md">
              <svg
                width="32"
                height="32"
                viewBox="0 0 24 24"
                fill="none"
                aria-hidden="true"
                className="mx-auto text-orange-dark"
              >
                <path
                  d="M12 8v5m0 3.5v.01M10.3 3.7 2.6 17a2 2 0 0 0 1.73 3h15.34a2 2 0 0 0 1.73-3L13.7 3.7a2 2 0 0 0-3.4 0Z"
                  stroke="currentColor"
                  strokeWidth="1.8"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
              <p className="mt-3 text-sm font-bold leading-relaxed text-charcoal/75">
                {copy.agents.mapUnavailable}
              </p>
              <button
                type="button"
                onClick={retry}
                className="mt-4 rounded-full bg-orange px-5 py-2.5 text-sm font-extrabold text-charcoal transition-colors hover:bg-orange-light focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-orange-dark"
              >
                إعادة المحاولة
              </button>
            </div>
          </div>
        )}
      </div>

      <figcaption className="mt-2.5 px-1 text-xs leading-relaxed text-charcoal/55">
        {copy.agents.mapPointDisclaimer}
      </figcaption>

      <style jsx global>{`
        .ram-agents-map .leaflet-container {
          background: #eae8e2;
          color: #101010;
          font-family: inherit;
          z-index: 0;
        }

        .ram-agents-map .leaflet-bar {
          border: 0;
          border-radius: 0.65rem;
          box-shadow: 0 5px 18px rgba(16, 16, 16, 0.18);
          overflow: hidden;
        }

        .ram-agents-map .leaflet-bar a,
        .ram-agents-map .leaflet-bar a:hover {
          border-bottom-color: rgba(16, 16, 16, 0.1);
          color: #101010;
          height: 2.5rem;
          line-height: 2.5rem;
          width: 2.5rem;
        }

        .ram-agents-map .leaflet-bar a:hover,
        .ram-agents-map .leaflet-bar a:focus-visible {
          background: #dc2626;
        }

        .ram-agents-map .leaflet-control-attribution {
          background: rgba(255, 255, 255, 0.9);
          color: rgba(16, 16, 16, 0.72);
          direction: ltr;
          font-size: 10px;
          padding: 2px 6px;
        }

        .ram-agents-map .leaflet-control-attribution a {
          color: #b7470b;
          text-decoration: underline;
        }

        .ram-agent-marker {
          align-items: center;
          background: transparent;
          border: 0;
          display: flex;
          justify-content: center;
        }

        .ram-agent-marker__pin {
          align-items: center;
          background: #f36b21;
          border: 3px solid #fff;
          border-radius: 9999px 9999px 9999px 0;
          box-shadow: 0 5px 14px rgba(16, 16, 16, 0.32);
          display: flex;
          height: 28px;
          justify-content: center;
          transform: rotate(-45deg);
          transition:
            background-color 160ms ease,
            box-shadow 160ms ease,
            transform 160ms ease;
          width: 28px;
        }

        .ram-agent-marker__dot {
          background: #101010;
          border-radius: 9999px;
          height: 7px;
          transform: rotate(45deg);
          width: 7px;
        }

        .ram-agent-marker:hover .ram-agent-marker__pin,
        .ram-agent-marker:focus-visible .ram-agent-marker__pin {
          background: #ef4444;
          box-shadow:
            0 0 0 4px rgba(220, 38, 38, 0.24),
            0 6px 16px rgba(16, 16, 16, 0.36);
          transform: rotate(-45deg) scale(1.08);
        }

        .ram-agent-marker--selected .ram-agent-marker__pin {
          background: #101010;
          border-color: #dc2626;
          box-shadow:
            0 0 0 5px rgba(220, 38, 38, 0.3),
            0 7px 18px rgba(16, 16, 16, 0.42);
          height: 34px;
          width: 34px;
        }

        .ram-agent-marker--selected .ram-agent-marker__dot {
          background: #f5f4f0;
          height: 8px;
          width: 8px;
        }

        .ram-map-cluster {
          align-items: center;
          background: rgba(16, 16, 16, 0.9);
          border: 4px solid rgba(220, 38, 38, 0.9);
          border-radius: 9999px;
          box-shadow:
            0 0 0 4px rgba(255, 255, 255, 0.82),
            0 7px 18px rgba(16, 16, 16, 0.3);
          color: #fff;
          display: grid;
          font-family: inherit;
          font-size: 13px;
          font-weight: 800;
          place-items: center;
        }

        .ram-map-cluster--selected {
          background: #dc2626;
          border-color: #101010;
          box-shadow:
            0 0 0 5px rgba(220, 38, 38, 0.3),
            0 8px 20px rgba(16, 16, 16, 0.4);
          color: #101010;
        }

        .ram-map-tooltip {
          border: 0;
          border-radius: 0.75rem;
          box-shadow: 0 8px 24px rgba(16, 16, 16, 0.22);
          font-family: inherit;
          padding: 0;
        }

        .ram-map-tooltip::before {
          border-top-color: #fff;
        }

        .ram-map-tooltip__content {
          direction: rtl;
          min-width: 10.5rem;
          padding: 0.7rem 0.85rem;
          text-align: right;
        }

        .ram-map-tooltip__name {
          color: #101010;
          display: block;
          font-size: 0.8rem;
          font-weight: 800;
          line-height: 1.5;
        }

        .ram-map-tooltip__place {
          color: rgba(16, 16, 16, 0.62);
          display: block;
          font-size: 0.7rem;
          font-weight: 600;
          line-height: 1.5;
          margin-top: 0.15rem;
        }

        .ram-map-loader {
          animation: ram-map-spin 0.8s linear infinite;
          border: 3px solid rgba(16, 16, 16, 0.14);
          border-radius: 9999px;
          border-top-color: #f36b21;
          height: 2rem;
          width: 2rem;
        }

        @keyframes ram-map-spin {
          to {
            transform: rotate(360deg);
          }
        }

        @media (prefers-reduced-motion: reduce) {
          .ram-map-loader {
            animation: none;
            border-color: rgba(16, 16, 16, 0.14);
            border-top-color: #f36b21;
          }
        }
      `}</style>
    </figure>
  );
}

function createAgentIcon(L: Leaflet, selected: boolean) {
  const size = selected ? 40 : 34;

  return L.divIcon({
    className: `ram-agent-marker${
      selected ? " ram-agent-marker--selected" : ""
    }`,
    html: '<span class="ram-agent-marker__pin"><span class="ram-agent-marker__dot"></span></span>',
    iconAnchor: [size / 2, size - 3],
    iconSize: [size, size],
    tooltipAnchor: [0, -size + 8],
  });
}

function createTooltip(point: AgentPoint): HTMLElement {
  const content = document.createElement("span");
  content.className = "ram-map-tooltip__content";

  const name = document.createElement("strong");
  name.className = "ram-map-tooltip__name";
  name.textContent = point.agent.company ?? point.agent.name;

  const place = document.createElement("span");
  place.className = "ram-map-tooltip__place";
  place.textContent = `${regionLabel(point.regionId)} · ${point.anchorTown}`;

  content.append(name, place);
  return content;
}

function fitPointSet(
  map: LeafletMap,
  L: Leaflet,
  points: readonly AgentPoint[],
) {
  if (points.length === 0) {
    map.setView(
      [mapConfig.defaultCenter.lat, mapConfig.defaultCenter.lng],
      mapConfig.defaultZoom,
      { animate: false },
    );
    return;
  }

  if (points.length === 1) {
    map.setView([points[0].lat, points[0].lng], 12, { animate: false });
    return;
  }

  const bounds = L.latLngBounds(
    points.map((point) => [point.lat, point.lng] as [number, number]),
  );
  map.fitBounds(bounds, {
    animate: false,
    maxZoom: 11,
    padding: [42, 42],
  });
}

function escapeHtml(value: string): string {
  return value.replace(
    /[&<>'"]/g,
    (character) =>
      ({
        "&": "&amp;",
        "<": "&lt;",
        ">": "&gt;",
        "'": "&#39;",
        '"': "&quot;",
      })[character] ?? character,
  );
}
