/**
 * Cryptographic utilities — deterministic risk / exposure rolls.
 *
 * NOTE: crypto.subtle is restricted to secure contexts (HTTPS / localhost).
 * Accessing the app via a plain-HTTP IP address (e.g. 192.168.x.x:3000)
 * makes crypto.subtle undefined, silently breaking every scan.
 * We use a pure-JS FNV-1a hash instead — identical behaviour everywhere.
 */

import {
  BREACHED_DOMAINS,
  SCAN_RISK_SEVERITY_BOOST,
  DARKWEB_KNOWN_EXPOSED_EMAILS,
  DARKWEB_SEVERITY_ODDS,
  DARKWEB_BASELINE_ODDS,
} from "../data/threatData";

// ─── Pure-JS FNV-1a 32-bit ───────────────────────────────────────────────────

/**
 * Return a 32-char hex string derived from the input string using FNV-1a.
 * Four independent seeded passes are combined so the last-12-char slice
 * used by hexToRoll has good distribution.
 */
export function sha256Hex(str) {
  const seeds = [0x811c9dc5, 0x84222325, 0xcbf29ce4, 0xd1b54a37];
  let parts = '';
  for (const seed of seeds) {
    let hash = seed >>> 0;
    for (let i = 0; i < str.length; i++) {
      hash ^= str.charCodeAt(i);
      hash = Math.imul(hash, 0x01000193) >>> 0;
    }
    parts += hash.toString(16).padStart(8, '0');
  }
  return parts; // 32 hex chars
}

// ─── Roll helpers ────────────────────────────────────────────────────────────

/**
 * Convert a hex string to a [0, 1) float using the last 12 hex chars.
 */
function hexToRoll(hex) {
  const chunk = hex.slice(-12);
  const val = parseInt(chunk, 16);
  return (val % 10000) / 10000;
}

// ─── Public API (async signatures preserved for backwards-compatibility) ─────

/**
 * Deterministically derive a Scan Threats risk level for an email.
 * Mirrors Python's _assess_scan_risk.
 */
export async function assessScanRisk(email) {
  const normalized = email.trim().toLowerCase();
  const domain = normalized.includes("@")
    ? normalized.split("@").pop()
    : normalized;
  const breach = BREACHED_DOMAINS[domain];
  const boost = breach
    ? SCAN_RISK_SEVERITY_BOOST[breach.severity] || 0
    : 0;

  const hex = sha256Hex(normalized);
  const roll = Math.min(1.0, hexToRoll(hex) + boost);

  if (roll < 0.35) return "SAFE";
  if (roll < 0.55) return "LOW";
  if (roll < 0.75) return "MEDIUM";
  if (roll < 0.9)  return "HIGH";
  return "CRITICAL";
}

/**
 * Determine whether an email should be reported as dark-web exposed.
 * Mirrors Python's _assess_dark_web_exposure.
 */
export async function assessDarkWebExposure(email) {
  const normalized = email.trim().toLowerCase();

  if (DARKWEB_KNOWN_EXPOSED_EMAILS.has(normalized)) {
    return true;
  }

  const domain = normalized.includes("@")
    ? normalized.split("@").pop()
    : normalized;
  const breach = BREACHED_DOMAINS[domain];
  const odds = breach
    ? DARKWEB_SEVERITY_ODDS[breach.severity] || DARKWEB_BASELINE_ODDS
    : DARKWEB_BASELINE_ODDS;

  const hex = sha256Hex(normalized);
  const roll = hexToRoll(hex);
  return roll < odds;
}
