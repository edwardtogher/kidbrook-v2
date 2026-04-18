"use client";

import { useEffect, useState, useRef, useCallback } from "react";
import Link from "next/link";

/* ------------------------------------------------------------------ */
/*  Geographic projection                                              */
/* ------------------------------------------------------------------ */

const BOUNDS = { minLng: -1.22, maxLng: 0.12, minLat: 51.08, maxLat: 51.56 };
const VB_W = 1200;
const VB_H = 700;
const MOBILE_VB = { x: 130, y: 70, w: 800, h: 560 };

function toSVG(lat: number, lng: number): [number, number] {
  const x = ((lng - BOUNDS.minLng) / (BOUNDS.maxLng - BOUNDS.minLng)) * VB_W;
  const y = ((BOUNDS.maxLat - lat) / (BOUNDS.maxLat - BOUNDS.minLat)) * VB_H;
  return [x, y];
}

/* ------------------------------------------------------------------ */
/*  Development data                                                   */
/* ------------------------------------------------------------------ */

interface Dev {
  name: string;
  slug: string;
  location: string;
  lat: number;
  lng: number;
  current: boolean;
  image: string | null;
  labelDx: number;
  labelDy: number;
  labelAnchor: "start" | "middle" | "end";
}

const developments: Dev[] = [
  { name: "Ardmore Place", slug: "ardmore-place", location: "Wimbledon, London", lat: 51.421, lng: -0.206, current: true, image: "/images/watercolors/ardmore-v2.png", labelDx: 12, labelDy: 4, labelAnchor: "start" },
  { name: "Shalford Lodge", slug: "shalford-lodge", location: "Kingston Hill", lat: 51.415, lng: -0.27, current: true, image: "/images/watercolors/shalford-photorealistic.png", labelDx: -12, labelDy: 4, labelAnchor: "end" },
  { name: "Ockford Road", slug: "ockford-road", location: "Godalming, Surrey", lat: 51.186, lng: -0.614, current: true, image: null, labelDx: 0, labelDy: 18, labelAnchor: "middle" },
  { name: "Whitestone Woods", slug: "whitestone-woods", location: "Woking, Surrey", lat: 51.303, lng: -0.557, current: true, image: null, labelDx: 12, labelDy: -8, labelAnchor: "start" },
  { name: "Trinity Place", slug: "trinity-place", location: "Basingstoke", lat: 51.267, lng: -1.088, current: true, image: null, labelDx: 0, labelDy: 18, labelAnchor: "middle" },
  { name: "Broadoak Park", slug: "broadoak-park", location: "Tongham, Surrey", lat: 51.228, lng: -0.747, current: false, image: "/images/broadoak-park/photo-1.jpg", labelDx: -12, labelDy: 4, labelAnchor: "end" },
  { name: "Tamara", slug: "tamara", location: "Weybridge, Surrey", lat: 51.371, lng: -0.457, current: false, image: "/images/tamara/photo-1.jpg", labelDx: 0, labelDy: -12, labelAnchor: "middle" },
  { name: "School Lane", slug: "school-lane-puttenham", location: "Puttenham, Surrey", lat: 51.217, lng: -0.683, current: false, image: "/images/school-lane-puttenham/photo-1.jpg", labelDx: 12, labelDy: 4, labelAnchor: "start" },
  { name: "Highridge", slug: "highridge", location: "Reigate, Surrey", lat: 51.238, lng: -0.205, current: false, image: null, labelDx: 0, labelDy: 18, labelAnchor: "middle" },
  { name: "Brooklands Lodge", slug: "brooklands-lodge", location: "New Malden, London", lat: 51.403, lng: -0.26, current: false, image: null, labelDx: -12, labelDy: 14, labelAnchor: "end" },
  { name: "Milbank", slug: "milbank", location: "Farnham, Surrey", lat: 51.215, lng: -0.8, current: false, image: null, labelDx: 0, labelDy: -12, labelAnchor: "middle" },
  { name: "Langtree Place", slug: "langtree-place", location: "Woking, Surrey", lat: 51.317, lng: -0.561, current: false, image: null, labelDx: -12, labelDy: 4, labelAnchor: "end" },
  { name: "Richmond House", slug: "richmond-house", location: "Surrey", lat: 51.33, lng: -0.41, current: false, image: null, labelDx: 12, labelDy: 4, labelAnchor: "start" },
  { name: "Silverlands", slug: "silverlands", location: "Surrey", lat: 51.39, lng: -0.51, current: false, image: null, labelDx: 0, labelDy: -12, labelAnchor: "middle" },
];

/* ------------------------------------------------------------------ */
/*  Map features                                                       */
/* ------------------------------------------------------------------ */

const thamesPoints: [number, number][] = [
  [51.455, -0.85], [51.445, -0.72], [51.435, -0.6], [51.428, -0.52],
  [51.415, -0.47], [51.408, -0.38], [51.415, -0.32], [51.425, -0.27],
  [51.435, -0.22], [51.44, -0.15], [51.465, -0.1], [51.478, -0.05],
  [51.495, 0.0], [51.505, 0.05], [51.51, 0.1],
];

const m25Points: [number, number][] = [
  [51.48, -0.45], [51.44, -0.52], [51.38, -0.55], [51.33, -0.52],
  [51.28, -0.42], [51.26, -0.3], [51.28, -0.18], [51.33, -0.08],
  [51.38, -0.02], [51.44, -0.02], [51.48, -0.08], [51.5, -0.15],
];

function buildSmoothPath(points: [number, number][]): string {
  const pts = points.map(([lat, lng]) => toSVG(lat, lng));
  if (pts.length < 2) return "";
  let d = `M ${pts[0][0]} ${pts[0][1]}`;
  for (let i = 1; i < pts.length; i++) {
    const prev = pts[i - 1];
    const curr = pts[i];
    const cpx1 = prev[0] + (curr[0] - prev[0]) * 0.5;
    const cpx2 = prev[0] + (curr[0] - prev[0]) * 0.5;
    d += ` C ${cpx1} ${prev[1]}, ${cpx2} ${curr[1]}, ${curr[0]} ${curr[1]}`;
  }
  return d;
}

const countyLabels = [
  { name: "SURREY", lat: 51.26, lng: -0.45 },
  { name: "HAMPSHIRE", lat: 51.2, lng: -1.0 },
  { name: "LONDON", lat: 51.48, lng: -0.15 },
];

const refTowns = [
  { name: "London", lat: 51.507, lng: -0.1 },
  { name: "Guildford", lat: 51.235, lng: -0.57 },
  { name: "Woking", lat: 51.317, lng: -0.56 },
  { name: "Reigate", lat: 51.238, lng: -0.205 },
];

/* ------------------------------------------------------------------ */
/*  Component                                                          */
/* ------------------------------------------------------------------ */

export default function HeroMap() {
  const [visible, setVisible] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [hoveredDev, setHoveredDev] = useState<Dev | null>(null);
  const [tooltipPos, setTooltipPos] = useState({ x: 0, y: 0 });
  const svgRef = useRef<SVGSVGElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setIsMobile(window.innerWidth < 768);
    const onResize = () => setIsMobile(window.innerWidth < 768);
    window.addEventListener("resize", onResize);
    const t = setTimeout(() => setVisible(true), 200);
    return () => {
      clearTimeout(t);
      window.removeEventListener("resize", onResize);
    };
  }, []);

  // Convert SVG coordinates to screen position for tooltip
  const updateTooltipPos = useCallback((dev: Dev) => {
    if (!svgRef.current || !containerRef.current) return;
    const svg = svgRef.current;
    const container = containerRef.current;
    const pt = svg.createSVGPoint();
    const [sx, sy] = toSVG(dev.lat, dev.lng);
    pt.x = sx;
    pt.y = sy;
    const screenPt = pt.matrixTransform(svg.getScreenCTM()!);
    const containerRect = container.getBoundingClientRect();
    setTooltipPos({
      x: screenPt.x - containerRect.left,
      y: screenPt.y - containerRect.top,
    });
  }, []);

  const handleMouseEnter = useCallback((dev: Dev) => {
    setHoveredDev(dev);
    updateTooltipPos(dev);
  }, [updateTooltipPos]);

  const thamesD = buildSmoothPath(thamesPoints);
  const m25D = buildSmoothPath(m25Points);

  const viewBox = isMobile
    ? `${MOBILE_VB.x} ${MOBILE_VB.y} ${MOBILE_VB.w} ${MOBILE_VB.h}`
    : `0 0 ${VB_W} ${VB_H}`;

  return (
    <section
      ref={containerRef}
      style={{
        background: "#231F20",
        position: "relative",
        overflow: "hidden",
        width: "100%",
        height: "100dvh",
        minHeight: 600,
        maxHeight: 1000,
        display: "flex",
        flexDirection: "column",
      }}
    >
      {/* ── HEADER ── */}
      <header style={{ flexShrink: 0, textAlign: "center", paddingTop: isMobile ? 20 : 32 }}>
        <div
          style={{
            opacity: visible ? 1 : 0,
            transform: visible ? "translateY(0)" : "translateY(-8px)",
            transition: "opacity 0.8s ease, transform 0.8s ease",
            paddingTop: isMobile ? 12 : 20,
          }}
        >
          <Link
            href="/"
            className="font-[family-name:var(--font-cinzel)]"
            style={{
              fontSize: isMobile ? 18 : 28,
              letterSpacing: "0.22em",
              color: "#C5A96A",
              fontWeight: 400,
              textDecoration: "none",
              textTransform: "uppercase",
            }}
          >
            Kidbrook Homes
          </Link>
        </div>

        {/* Nav */}
        <nav
          style={{
            marginTop: isMobile ? 10 : 14,
            opacity: visible ? 1 : 0,
            transition: "opacity 1s ease 0.2s",
          }}
        >
          <div style={{ display: "inline-flex", gap: isMobile ? 20 : 36, justifyContent: "center" }}>
            {[
              { label: "Developments", href: "/developments" },
              { label: "About", href: "/about" },
              { label: "Land", href: "/land" },
              { label: "Contact", href: "/contact" },
            ].map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="font-[family-name:var(--font-cinzel)]"
                style={{
                  fontSize: isMobile ? 10 : 11,
                  letterSpacing: "0.18em",
                  color: "rgba(255,255,255,0.5)",
                  textDecoration: "none",
                  textTransform: "uppercase",
                  transition: "color 0.2s",
                  padding: "4px 0",
                }}
                onMouseEnter={(e) => { e.currentTarget.style.color = "#C5A96A"; }}
                onMouseLeave={(e) => { e.currentTarget.style.color = "rgba(255,255,255,0.5)"; }}
              >
                {item.label}
              </Link>
            ))}
          </div>
        </nav>
      </header>

      {/* ── MAP ── */}
      <div style={{ flex: 1, minHeight: 0, position: "relative", padding: isMobile ? "4px 0" : "8px 0" }}>
        <svg
          ref={svgRef}
          viewBox={viewBox}
          style={{ width: "100%", height: "100%", display: "block" }}
          preserveAspectRatio="xMidYMid meet"
          onMouseLeave={() => setHoveredDev(null)}
        >
          <defs>
            <filter id="glow" x="-50%" y="-50%" width="200%" height="200%">
              <feGaussianBlur in="SourceGraphic" stdDeviation="4" />
            </filter>
            <filter id="glowBig" x="-100%" y="-100%" width="300%" height="300%">
              <feGaussianBlur in="SourceGraphic" stdDeviation="8" />
            </filter>
            <radialGradient id="atmos" cx="55%" cy="50%" r="45%">
              <stop offset="0%" stopColor="rgba(197,169,106,0.04)" />
              <stop offset="100%" stopColor="rgba(0,0,0,0)" />
            </radialGradient>
          </defs>

          <rect x="0" y="0" width={VB_W} height={VB_H} fill="url(#atmos)" />

          {/* County labels */}
          {countyLabels.map((c) => {
            const [x, y] = toSVG(c.lat, c.lng);
            if (isMobile && c.name !== "SURREY") return null;
            return (
              <text key={c.name} x={x} y={y} textAnchor="middle"
                style={{ fontSize: 32, letterSpacing: "0.5em", fill: "rgba(197,169,106,0.06)", fontFamily: "var(--font-cinzel), serif", opacity: visible ? 1 : 0, transition: "opacity 2s ease 0.5s" }}>
                {c.name}
              </text>
            );
          })}

          {/* M25 */}
          <path d={m25D} fill="none" stroke="rgba(255,255,255,0.035)" strokeWidth={2} strokeDasharray="8,6"
            style={{ opacity: visible ? 1 : 0, transition: "opacity 1.5s ease 0.3s" }} />

          {/* Thames */}
          <path d={thamesD} fill="none" stroke="rgba(120,140,160,0.12)" strokeWidth={3} strokeLinecap="round"
            style={{ opacity: visible ? 1 : 0, transition: "opacity 1.5s ease 0.5s" }} />
          {!isMobile && (() => {
            const [x, y] = toSVG(51.47, -0.06);
            return <text x={x} y={y + 14} textAnchor="start" style={{ fontSize: 10, fontStyle: "italic", fill: "rgba(120,140,160,0.18)", letterSpacing: "0.1em" }}>Thames</text>;
          })()}

          {/* Reference towns */}
          {refTowns.map((t) => {
            const [x, y] = toSVG(t.lat, t.lng);
            if (isMobile && t.name === "London") return null;
            return (
              <g key={t.name} style={{ opacity: visible ? 1 : 0, transition: "opacity 1.5s ease 0.8s" }}>
                <circle cx={x} cy={y} r={1.5} fill="rgba(255,255,255,0.1)" />
                <text x={x} y={y - 8} textAnchor="middle" style={{ fontSize: 9, fill: "rgba(255,255,255,0.12)", letterSpacing: "0.1em" }}>{t.name}</text>
              </g>
            );
          })}

          {/* Development dots */}
          {developments.map((dev, i) => {
            const [x, y] = toSVG(dev.lat, dev.lng);
            const delay = 0.8 + i * 0.1;
            const isHovered = hoveredDev?.slug === dev.slug;
            const dotR = isMobile ? (dev.current ? 7 : 5) : (dev.current ? 5 : 3.5);
            const scale = isHovered ? 1.3 : 1;
            const showLabel = !isMobile || dev.current;

            return (
              <a
                key={dev.slug}
                href={`/developments/${dev.slug}`}
                onMouseEnter={() => handleMouseEnter(dev)}
                onFocus={() => handleMouseEnter(dev)}
              >
                <g style={{
                  opacity: visible ? 1 : 0,
                  transform: visible ? "scale(1)" : "scale(0)",
                  transformOrigin: `${x}px ${y}px`,
                  transition: `opacity 0.6s ease ${delay}s, transform 0.5s cubic-bezier(0.34,1.56,0.64,1) ${delay}s`,
                }}>
                  {/* Pulse — current only */}
                  {dev.current && (
                    <circle cx={x} cy={y} r={14} fill="none" stroke="rgba(197,169,106,0.2)" strokeWidth={1}>
                      <animate attributeName="r" values="8;20;8" dur="3s" repeatCount="indefinite" />
                      <animate attributeName="opacity" values="0.4;0;0.4" dur="3s" repeatCount="indefinite" />
                    </circle>
                  )}

                  {/* Glow */}
                  <circle cx={x} cy={y} r={(dotR + 2) * scale}
                    fill={dev.current ? "#C5A96A" : "rgba(197,169,106,0.4)"}
                    filter={isHovered ? "url(#glowBig)" : "url(#glow)"}
                    opacity={isHovered ? 0.6 : 0.3}
                    style={{ transition: "all 0.2s ease" }} />

                  {/* Dot */}
                  <circle cx={x} cy={y} r={dotR * scale}
                    fill={isHovered ? "#C5A96A" : (dev.current ? "#C5A96A" : "rgba(197,169,106,0.55)")}
                    style={{ transition: "all 0.2s ease" }} />

                  {/* Center */}
                  <circle cx={x} cy={y} r={dotR * 0.4 * scale}
                    fill={dev.current ? "#E8D5A0" : "#C5A96A"}
                    style={{ transition: "all 0.2s ease" }} />

                  {/* Hit area */}
                  <circle cx={x} cy={y} r={isMobile ? 20 : 16} fill="transparent" style={{ cursor: "pointer" }} />

                  {/* Label */}
                  {showLabel && (
                    <text x={x + dev.labelDx} y={y + dev.labelDy} textAnchor={dev.labelAnchor}
                      style={{
                        fontSize: dev.current ? 11 : 8,
                        letterSpacing: "0.06em",
                        fill: isHovered ? "#C5A96A" : (dev.current ? "rgba(197,169,106,0.8)" : "rgba(197,169,106,0.35)"),
                        fontFamily: "var(--font-cinzel), serif",
                        transition: "fill 0.2s ease",
                      }}>
                      {dev.name}
                    </text>
                  )}
                </g>
              </a>
            );
          })}
        </svg>

        {/* ── HOVER TOOLTIP ── */}
        {hoveredDev && !isMobile && (
          <Link
            href={`/developments/${hoveredDev.slug}`}
            style={{
              position: "absolute",
              left: tooltipPos.x,
              top: tooltipPos.y,
              transform: "translate(-50%, -110%)",
              pointerEvents: "auto",
              textDecoration: "none",
              zIndex: 20,
            }}
          >
            <div
              style={{
                background: "rgba(30,28,26,0.95)",
                backdropFilter: "blur(8px)",
                border: "1px solid rgba(197,169,106,0.2)",
                borderRadius: 6,
                overflow: "hidden",
                width: 220,
                boxShadow: "0 8px 32px rgba(0,0,0,0.5)",
              }}
            >
              {/* Image */}
              {hoveredDev.image && (
                <div style={{ width: 220, height: 130, overflow: "hidden" }}>
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={hoveredDev.image}
                    alt={hoveredDev.name}
                    style={{ width: "100%", height: "100%", objectFit: "cover" }}
                  />
                </div>
              )}

              {/* Info */}
              <div style={{ padding: "12px 14px" }}>
                <p
                  className="font-[family-name:var(--font-cinzel)]"
                  style={{
                    fontSize: 12,
                    letterSpacing: "0.08em",
                    color: "#C5A96A",
                    margin: 0,
                    textTransform: "uppercase",
                  }}
                >
                  {hoveredDev.name}
                </p>
                <p style={{ fontSize: 11, color: "rgba(255,255,255,0.5)", margin: "4px 0 0", letterSpacing: "0.03em" }}>
                  {hoveredDev.location}
                </p>
                <div style={{ marginTop: 8, display: "flex", alignItems: "center", gap: 6 }}>
                  <span
                    style={{
                      fontSize: 9,
                      letterSpacing: "0.15em",
                      color: hoveredDev.current ? "#C5A96A" : "rgba(255,255,255,0.4)",
                      textTransform: "uppercase",
                      fontWeight: 500,
                    }}
                  >
                    {hoveredDev.current ? "Now Selling" : "Completed"}
                  </span>
                  <span style={{ marginLeft: "auto", fontSize: 9, color: "rgba(197,169,106,0.5)", letterSpacing: "0.1em" }}>
                    View &rarr;
                  </span>
                </div>
              </div>
            </div>

            {/* Arrow pointing down to dot */}
            <div style={{
              width: 0, height: 0,
              borderLeft: "6px solid transparent",
              borderRight: "6px solid transparent",
              borderTop: "6px solid rgba(30,28,26,0.95)",
              margin: "0 auto",
            }} />
          </Link>
        )}
      </div>

      {/* ── FOOTER ── */}
      <footer style={{
        flexShrink: 0, textAlign: "center",
        paddingBottom: isMobile ? 20 : 28,
        paddingTop: isMobile ? 8 : 12,
        opacity: visible ? 1 : 0,
        transform: visible ? "translateY(0)" : "translateY(10px)",
        transition: "opacity 0.8s ease 1.2s, transform 0.8s ease 1.2s",
      }}>
        <p className="font-[family-name:var(--font-cinzel)]"
          style={{ fontSize: isMobile ? 9 : 11, letterSpacing: "0.25em", color: "rgba(197,169,106,0.35)", textTransform: "uppercase", margin: 0 }}>
          14 Developments &nbsp;&middot;&nbsp; Surrey &amp; Hampshire &nbsp;&middot;&nbsp; Est. 2005
        </p>
        <div style={{ marginTop: isMobile ? 14 : 18 }}>
          <Link href="/developments"
            className="font-[family-name:var(--font-cinzel)] uppercase inline-block transition-all duration-200"
            style={{ fontSize: isMobile ? 10 : 11, letterSpacing: "0.2em", color: "#C5A96A", border: "1px solid rgba(197,169,106,0.3)", padding: isMobile ? "11px 28px" : "14px 36px", textDecoration: "none" }}
            onMouseEnter={(e) => { e.currentTarget.style.background = "rgba(197,169,106,0.1)"; e.currentTarget.style.borderColor = "rgba(197,169,106,0.6)"; }}
            onMouseLeave={(e) => { e.currentTarget.style.background = "transparent"; e.currentTarget.style.borderColor = "rgba(197,169,106,0.3)"; }}>
            View All Developments
          </Link>
        </div>
      </footer>
    </section>
  );
}
