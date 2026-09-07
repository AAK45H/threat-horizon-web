/**
 * ThreatHorizon — Static threat intelligence data
 * Ported from ThreatHorizon.py
 */

// ══════════════════════════════════════════════════════════════
// THEME
// ══════════════════════════════════════════════════════════════

export const THEME = {
  bg_primary: "#080c14",
  bg_secondary: "#0d1117",
  bg_card: "#0f1923",
  bg_input: "#111a27",
  accent_cyan: "#00f0ff",
  accent_green: "#00ff88",
  accent_red: "#ff3355",
  accent_orange: "#ff8800",
  accent_yellow: "#ffdd00",
  accent_purple: "#aa55ff",
  text_primary: "#e0e6ed",
  text_secondary: "#6b7d99",
  text_dim: "#2a3a50",
  border: "#1a2a3a",
  grid_line: "#0a1520",
};

// ══════════════════════════════════════════════════════════════
// THREAT COUNTRIES
// ══════════════════════════════════════════════════════════════

export const THREAT_COUNTRIES = {
  USA:       { lat: 38.0,  lon: -97.0,  code: "US" },
  India:     { lat: 20.6,  lon: 78.9,   code: "IN" },
  China:     { lat: 35.9,  lon: 104.2,  code: "CN" },
  Russia:    { lat: 61.5,  lon: 105.3,  code: "RU" },
  Germany:   { lat: 51.2,  lon: 10.4,   code: "DE" },
  UK:        { lat: 55.4,  lon: -3.4,   code: "GB" },
  Brazil:    { lat: -14.2, lon: -51.9,  code: "BR" },
  Japan:     { lat: 36.2,  lon: 138.3,  code: "JP" },
  Australia: { lat: -25.3, lon: 133.8,  code: "AU" },
  "S. Korea":{ lat: 35.9,  lon: 127.8,  code: "KR" },
  Iran:      { lat: 32.4,  lon: 53.7,   code: "IR" },
  Nigeria:   { lat: 9.1,   lon: 8.7,    code: "NG" },
  France:    { lat: 46.2,  lon: 2.2,    code: "FR" },
  Canada:    { lat: 56.1,  lon: -106.3, code: "CA" },
};

// ══════════════════════════════════════════════════════════════
// ATTACK TYPES
// ══════════════════════════════════════════════════════════════

export const ATTACK_TYPES = [
  "Malware Attack", "Phishing Campaign", "DDoS Attack", "Ransomware",
  "Data Breach", "Botnet Activity", "Trojan Detected", "Spyware Alert",
  "SQL Injection", "Zero-Day Exploit", "Credential Stuffing",
  "Man-in-the-Middle", "APT Activity", "Cryptojacking",
  "Supply Chain Attack", "DNS Hijacking",
];

// ══════════════════════════════════════════════════════════════
// BREACHED DOMAINS
// ══════════════════════════════════════════════════════════════

export const BREACHED_DOMAINS = {
  "yahoo.com":    { company: "Yahoo",    year: 2013, severity: "Critical", records: "3B" },
  "linkedin.com": { company: "LinkedIn", year: 2021, severity: "High",     records: "700M" },
  "adobe.com":    { company: "Adobe",    year: 2013, severity: "High",     records: "153M" },
  "dropbox.com":  { company: "Dropbox",  year: 2012, severity: "Medium",   records: "68M" },
  "canva.com":    { company: "Canva",    year: 2019, severity: "Medium",   records: "137M" },
  "facebook.com": { company: "Facebook", year: 2019, severity: "High",     records: "533M" },
  "twitter.com":  { company: "Twitter",  year: 2022, severity: "Medium",   records: "5.4M" },
  "myspace.com":  { company: "MySpace",  year: 2013, severity: "High",     records: "360M" },
  "equifax.com":  { company: "Equifax",  year: 2017, severity: "Critical", records: "147M" },
  "marriott.com": { company: "Marriott", year: 2018, severity: "High",     records: "500M" },
};

// ══════════════════════════════════════════════════════════════
// DARK WEB CONSTANTS
// ══════════════════════════════════════════════════════════════

export const DARKWEB_LEAK_SOURCES = [
  "BreachForums dump", "Telegram channel",
  "Paste site leak", "Dark marketplace listing",
];

export const DARKWEB_KNOWN_EXPOSED_EMAILS = new Set([
  "admin@yahoo.com",
  "test@linkedin.com",
  "demo@adobe.com",
]);

export const DARKWEB_SEVERITY_ODDS = {
  Critical: 0.65,
  High: 0.45,
  Medium: 0.25,
  Low: 0.10,
};

export const DARKWEB_BASELINE_ODDS = 0.03;

export const SCAN_RISK_SEVERITY_BOOST = {
  Critical: 0.35,
  High: 0.25,
  Medium: 0.15,
  Low: 0.05,
};

// ══════════════════════════════════════════════════════════════
// MITRE ATT&CK FRAMEWORK
// ══════════════════════════════════════════════════════════════

export const MITRE_ATTACK_MAP = {
  "Malware Attack":      { tactic: "Execution",      tid: "T1204" },
  "Phishing Campaign":   { tactic: "Initial Access",  tid: "T1566" },
  "DDoS Attack":         { tactic: "Impact",          tid: "T1498" },
  "Ransomware":          { tactic: "Impact",          tid: "T1486" },
  "Data Breach":         { tactic: "Collection",      tid: "T1213" },
  "Botnet Activity":     { tactic: "Cmd & Control",   tid: "T1102" },
  "Trojan Detected":     { tactic: "Persistence",     tid: "T1543" },
  "Spyware Alert":       { tactic: "Collection",      tid: "T1056" },
  "SQL Injection":       { tactic: "Initial Access",  tid: "T1190" },
  "Zero-Day Exploit":    { tactic: "Execution",       tid: "T1203" },
  "Credential Stuffing": { tactic: "Cred. Access",    tid: "T1110" },
  "Man-in-the-Middle":   { tactic: "Cred. Access",    tid: "T1557" },
  "APT Activity":        { tactic: "Persistence",     tid: "T1098" },
  "Cryptojacking":       { tactic: "Impact",          tid: "T1496" },
  "Supply Chain Attack": { tactic: "Initial Access",  tid: "T1195" },
  "DNS Hijacking":       { tactic: "Def. Evasion",    tid: "T1584" },
};

// ══════════════════════════════════════════════════════════════
// KILL CHAIN
// ══════════════════════════════════════════════════════════════

export const KILL_CHAIN_MAP = {
  "Phishing Campaign":   "Delivery",
  "Malware Attack":      "Installation",
  "DDoS Attack":         "Actions on Obj.",
  "Ransomware":          "Actions on Obj.",
  "Data Breach":         "Actions on Obj.",
  "Botnet Activity":     "Cmd & Control",
  "Trojan Detected":     "Installation",
  "Spyware Alert":       "Installation",
  "SQL Injection":       "Exploitation",
  "Zero-Day Exploit":    "Exploitation",
  "Credential Stuffing": "Reconnaissance",
  "Man-in-the-Middle":   "Delivery",
  "APT Activity":        "Reconnaissance",
  "Cryptojacking":       "Actions on Obj.",
  "Supply Chain Attack": "Delivery",
  "DNS Hijacking":       "Weaponization",
};

// ══════════════════════════════════════════════════════════════
// THREAT ACTORS
// ══════════════════════════════════════════════════════════════

export const THREAT_ACTOR_MAP = {
  China:     ["APT41", "APT10", "Hafnium", "Bronze Atlas"],
  Russia:    ["APT28 (Fancy Bear)", "APT29 (Cozy Bear)", "Sandworm", "Turla"],
  Iran:      ["APT33", "APT34 (OilRig)", "Charming Kitten", "MuddyWater"],
  "S. Korea":["Lazarus Group", "APT37", "SilverFish"],
  Nigeria:   ["SilverTerrier", "Gold Galleon", "Scattered Canary"],
  USA:       ["FIN7", "FIN6", "Carbanak", "Evil Corp"],
  India:     ["Sidewinder", "Patchwork", "Donot"],
  UK:        ["Turla (EU)", "TA505"],
  Germany:   ["TA505 (DE)", "FIN7 (EU)"],
  Brazil:    ["Guildma", "Grandoreiro", "Casbaneiro"],
  Japan:     ["menuPass", "APT10 (JP)"],
  Australia: ["APT40", "APT32"],
  Canada:    ["FIN7 (CA)", "TA413"],
  France:    ["Turla (FR)", "APT28 (FR)"],
};

// ══════════════════════════════════════════════════════════════
// CVE REFERENCES
// ══════════════════════════════════════════════════════════════

export const ATTACK_CVE_MAP = {
  "Zero-Day Exploit":    ["CVE-2024-3094", "CVE-2024-1086", "CVE-2024-4577"],
  "SQL Injection":       ["CVE-2023-23752","CVE-2023-38646","CVE-2024-1403"],
  "Malware Attack":      ["CVE-2023-4863", "CVE-2024-0519", "CVE-2023-36884"],
  "DDoS Attack":         ["CVE-2023-44487","CVE-2024-2389"],
  "Ransomware":          ["CVE-2023-34362","CVE-2024-1709", "CVE-2023-20269"],
  "Supply Chain Attack": ["CVE-2023-3519", "CVE-2024-3400"],
  "Data Breach":         ["CVE-2023-29552","CVE-2024-21762"],
  "Credential Stuffing": ["CVE-2023-40000","CVE-2024-0012"],
  "Man-in-the-Middle":   ["CVE-2023-2650", "CVE-2024-0553"],
  "DNS Hijacking":       ["CVE-2024-33113","CVE-2023-50387"],
  "APT Activity":        ["CVE-2024-3273", "CVE-2023-48788"],
  "Botnet Activity":     ["CVE-2024-3273", "CVE-2023-1389"],
  "Trojan Detected":     ["CVE-2024-0519"],
  "Spyware Alert":       ["CVE-2023-41064","CVE-2023-4762"],
  "Cryptojacking":       ["CVE-2023-32233"],
  "Phishing Campaign":   [],
};

// ══════════════════════════════════════════════════════════════
// BREACH ENRICHMENT
// ══════════════════════════════════════════════════════════════

export const BREACH_ENRICHMENT = {
  "yahoo.com": {
    data_types: ["Emails", "MD5 Passwords", "Security Q&A", "DOB"],
    mitigations: ["Force password reset", "Enable 2FA", "Rotate security Q&A"],
  },
  "linkedin.com": {
    data_types: ["Emails", "Phone Numbers", "SHA-1 Passwords", "Job Titles"],
    mitigations: ["Force password reset", "Enable 2FA", "Audit OAuth apps"],
  },
  "adobe.com": {
    data_types: ["Emails", "Encrypted Passwords", "Password Hints", "Names"],
    mitigations: ["Revoke API tokens", "Reset password", "Check CC records"],
  },
  "dropbox.com": {
    data_types: ["Emails", "bcrypt/SHA-1 Passwords"],
    mitigations: ["Enable 2FA", "Review shared links", "Force password reset"],
  },
  "canva.com": {
    data_types: ["Emails", "Names", "bcrypt Passwords", "City/Country"],
    mitigations: ["Force password reset", "Enable 2FA"],
  },
  "facebook.com": {
    data_types: ["Phone Numbers", "Facebook IDs", "Names", "Locations"],
    mitigations: ["Lock profile", "Enable 2FA", "Audit app permissions"],
  },
  "twitter.com": {
    data_types: ["Emails", "Phone Numbers", "Names", "Registration dates"],
    mitigations: ["Enable 2FA", "Audit connected apps", "Force password reset"],
  },
  "myspace.com": {
    data_types: ["Emails", "Usernames", "SHA-1 Passwords"],
    mitigations: ["Enforce no-reuse policy", "Issue breach advisory"],
  },
  "equifax.com": {
    data_types: ["SSN", "DOB", "Addresses", "Credit Card Numbers", "Driver Licenses"],
    mitigations: ["Credit freeze", "Fraud alert", "IRS Identity PIN"],
  },
  "marriott.com": {
    data_types: ["Passport Numbers", "Email", "Phone", "Payment info"],
    mitigations: ["Monitor passport use", "Fraud alert", "Force credential reset"],
  },
};

// ══════════════════════════════════════════════════════════════
// DARK WEB DATA CATEGORIES
// ══════════════════════════════════════════════════════════════

export const DARKWEB_DATA_CATEGORIES = [
  "Plain-text passwords",
  "Hashed credentials",
  "Session/auth tokens",
  "API keys / secrets",
  "PII (name/DOB/phone)",
  "Financial data",
  "Internal email chains",
  "VPN/RDP credentials",
];

// ══════════════════════════════════════════════════════════════
// REMEDIATION PLAYBOOKS
// ══════════════════════════════════════════════════════════════

export const REMEDIATION_PLAYBOOKS = {
  CRITICAL: [
    "Isolate affected hosts immediately",
    "Capture memory & disk forensics",
    "Revoke and rotate all credentials",
    "Notify CIRT / Incident Response team",
    "File formal incident report (IRP)",
  ],
  HIGH: [
    "Increase logging verbosity on affected systems",
    "Block identified IOCs at perimeter firewall",
    "Patch all open CVEs in affected software",
    "Notify SOC team lead within 1 hour",
  ],
  MEDIUM: [
    "Review and tune IDS/IPS signatures",
    "Apply available patches within SLA",
    "Increase monitoring on affected hosts",
  ],
  LOW: [
    "Log event and continue scheduled monitoring",
    "Update threat intelligence feeds",
  ],
  SAFE: [
    "No action required — environment secure",
    "Continue scheduled scanning cadence",
  ],
};

// ══════════════════════════════════════════════════════════════
// CORRELATION ENGINE SETTINGS
// ══════════════════════════════════════════════════════════════

export const CORRELATION_WINDOW_SEC = 90;
export const CORRELATION_THRESHOLD = 4;

// ══════════════════════════════════════════════════════════════
// THREAT LEVEL CONFIG
// ══════════════════════════════════════════════════════════════

export const THREAT_LEVELS = {
  SAFE:     { color: THEME.accent_green,  risk: 10  },
  LOW:      { color: THEME.accent_green,  risk: 30  },
  MEDIUM:   { color: THEME.accent_yellow, risk: 55  },
  HIGH:     { color: THEME.accent_orange, risk: 75  },
  CRITICAL: { color: THEME.accent_red,    risk: 100 },
};
