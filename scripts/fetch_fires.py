"""
Fetch VIIRS fire alerts and aggregate into geographic hotspots.
Outputs sphere-ready data: unit sphere coords, sigma, appearAt in seconds.
"""

import mapbox_vector_tile
import urllib.request
import json
import math
import hashlib
import os
from collections import defaultdict
from datetime import datetime, timedelta

ZOOM = 2
END_DATE = datetime.now().strftime("%Y-%m-%d")
START_DATE = (datetime.now() - timedelta(days=7)).strftime("%Y-%m-%d")

OUT_PATH = os.path.join(os.path.dirname(__file__), "..", "src", "data", "fires.json")
META_PATH = os.path.join(os.path.dirname(__file__), "..", "src", "data", "fires_meta.json")

CELL_SIZE = 20
TARGET_N = 40

# Sphere animation parameters (must match MorphingSphere.tsx)
INITIAL_PAUSE = 0.5
SPREAD_DURATION = 60
MIN_SIGMA = 0.15
MAX_SIGMA = 0.5


def fetch_fires():
    points = []
    for x in range(4):
        for y in range(4):
            url = (
                f"https://tiles.globalforestwatch.org/nasa_viirs_fire_alerts/latest/dynamic"
                f"/{ZOOM}/{x}/{y}.pbf"
                f"?start_date={START_DATE}&end_date={END_DATE}"
                f"&include_attribute=latitude&include_attribute=longitude"
                f"&include_attribute=frp__MW&include_attribute=alert__date"
            )
            try:
                req = urllib.request.Request(url)
                with urllib.request.urlopen(req) as resp:
                    if resp.status == 200:
                        data = mapbox_vector_tile.decode(resp.read())
                        for layer in data.values():
                            for feat in layer["features"]:
                                p = feat["properties"]
                                points.append(
                                    {
                                        "lat": float(p["latitude"]),
                                        "lng": float(p["longitude"]),
                                        "frp": float(p["frp__MW"]),
                                        "date": p.get("alert__date", START_DATE),
                                    }
                                )
            except Exception as e:
                print(f"Tile {x},{y} error: {e}")

    print(f"Fetched {len(points)} fire points")
    return points


def aggregate_and_prepare(points):
    cells = defaultdict(lambda: {"lats": [], "lngs": [], "frps": [], "dates": []})

    for p in points:
        cx = math.floor(p["lng"] / CELL_SIZE)
        cy = math.floor(p["lat"] / CELL_SIZE)
        key = (cx, cy)
        cells[key]["lats"].append(p["lat"])
        cells[key]["lngs"].append(p["lng"])
        cells[key]["frps"].append(p["frp"])
        cells[key]["dates"].append(p["date"])

    hotspots = []
    for key, cell in cells.items():
        n = len(cell["lats"])
        if n < 5:
            continue

        # FRP-weighted centroid
        total_frp = sum(cell["frps"])
        if total_frp > 0:
            lat = sum(la * f for la, f in zip(cell["lats"], cell["frps"])) / total_frp
            lng = sum(ln * f for ln, f in zip(cell["lngs"], cell["frps"])) / total_frp
        else:
            lat = sum(cell["lats"]) / n
            lng = sum(cell["lngs"]) / n

        # Deterministic random offset within the day
        h = hashlib.md5(f"{key[0]},{key[1]}".encode()).hexdigest()
        day_offset = int(h[:8], 16) / 0xFFFFFFFF

        earliest = min(cell["dates"])

        hotspots.append(
            {
                "lat": lat,
                "lng": lng,
                "count": n,
                "total_frp": total_frp,
                "date_num": datetime.strptime(earliest, "%Y-%m-%d").timestamp()
                + day_offset * 86400,
            }
        )

    # Keep top N by intensity
    hotspots.sort(key=lambda h: -h["total_frp"])
    hotspots = hotspots[: TARGET_N]

    # Sort by time for appearAt calculation
    hotspots.sort(key=lambda h: h["date_num"])
    t_min = hotspots[0]["date_num"]
    t_max = hotspots[-1]["date_num"]
    t_span = t_max - t_min or 1

    # Log-scale normalization for sigma
    log_counts = [math.log(max(1, h["count"])) for h in hotspots]
    log_min = min(log_counts)
    log_span = max(log_counts) - log_min or 1

    # Convert to sphere-ready format
    sources = []
    for i, h in enumerate(hotspots):
        phi = (90 - h["lat"]) * math.pi / 180
        theta = h["lng"] * math.pi / 180

        norm = (math.log(max(1, h["count"])) - log_min) / log_span
        sigma = MIN_SIGMA + (MAX_SIGMA - MIN_SIGMA) * norm

        appear_at = INITIAL_PAUSE + ((h["date_num"] - t_min) / t_span) * SPREAD_DURATION

        # Deterministic envelope seeds
        seed = i * 137.508

        sources.append(
            {
                "x": round(math.sin(phi) * math.cos(theta), 5),
                "y": round(math.cos(phi), 5),
                "z": round(math.sin(phi) * math.sin(theta), 5),
                "sigma": round(sigma, 4),
                "appearAt": round(appear_at, 2),
                "a": round(seed % 6.28, 4),
                "b": round((seed * 1.3) % 6.28, 4),
                "c": round((seed * 0.7) % 6.28, 4),
            }
        )

    print(f"Prepared {len(sources)} sources (top {TARGET_N} by intensity)")
    return sources


def main():
    points = fetch_fires()
    sources = aggregate_and_prepare(points)

    os.makedirs(os.path.dirname(OUT_PATH), exist_ok=True)
    with open(OUT_PATH, "w") as f:
        json.dump(sources, f, indent=2)

    meta = {
        "fireCount": len(points),
        "fetchedAt": datetime.now().strftime("%Y-%m-%d"),
    }
    with open(META_PATH, "w") as f:
        json.dump(meta, f, indent=2)

    print(f"Wrote {len(sources)} sources to {OUT_PATH}")
    print(f"Wrote metadata to {META_PATH}: {meta}")


if __name__ == "__main__":
    main()
