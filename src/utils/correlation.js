/**
 * Alert correlation engine — burst detection.
 * Mirrors Python's _correlate_alerts.
 */

import {
  CORRELATION_WINDOW_SEC,
  CORRELATION_THRESHOLD,
  THREAT_ACTOR_MAP,
} from "../data/threatData";

/**
 * Check if events from `country` in the `alertHistory` array
 * exceed the burst threshold within the correlation window.
 *
 * @param {Array} alertHistory - Array of {ts, country, attack, severity}
 * @param {string} country
 * @param {number} now - current timestamp in seconds
 * @returns {object|null} - burst info if detected, null otherwise
 */
export function correlateAlerts(alertHistory, country, now) {
  const cutoff = now - CORRELATION_WINDOW_SEC;
  const recent = alertHistory.filter(
    (e) => e.ts >= cutoff && e.country === country
  );

  if (recent.length >= CORRELATION_THRESHOLD) {
    const actors = THREAT_ACTOR_MAP[country] || ["Unknown Actor"];
    const actor = actors[Math.floor(Math.random() * actors.length)];
    const attacks = [...new Set(recent.map((e) => e.attack))].slice(0, 3);
    return {
      count: recent.length,
      country,
      actor,
      attacks: attacks.join(" / "),
    };
  }
  return null;
}
