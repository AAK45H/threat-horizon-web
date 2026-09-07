/**
 * DashboardStore — central React Context for all ThreatHorizon state.
 * Nodes read from this context directly, avoiding the setNodes-in-useEffect anti-pattern.
 */
import {
  createContext, useContext, useReducer, useCallback, useEffect, useRef,
} from 'react';
import {
  THREAT_COUNTRIES, ATTACK_TYPES, BREACHED_DOMAINS, BREACH_ENRICHMENT,
  DARKWEB_LEAK_SOURCES, DARKWEB_DATA_CATEGORIES,
  MITRE_ATTACK_MAP, KILL_CHAIN_MAP, THREAT_ACTOR_MAP, ATTACK_CVE_MAP,
  REMEDIATION_PLAYBOOKS, THREAT_LEVELS, DARKWEB_KNOWN_EXPOSED_EMAILS,
  DARKWEB_SEVERITY_ODDS, DARKWEB_BASELINE_ODDS,
  SCAN_RISK_SEVERITY_BOOST, CORRELATION_WINDOW_SEC, CORRELATION_THRESHOLD,
} from '../data/threatData';

// ─── helpers ────────────────────────────────────────────────────────────────

function ts() { return new Date().toLocaleTimeString('en-GB'); }

function randomChoice(arr) { return arr[Math.floor(Math.random() * arr.length)]; }
function randomInt(min, max) { return Math.floor(Math.random() * (max - min + 1)) + min; }
function randomSample(arr, k) { return [...arr].sort(() => Math.random() - 0.5).slice(0, k); }

// Pure-JS FNV-1a 32-bit hash — works over plain HTTP (no secure-context required).
// crypto.subtle is only available on localhost / HTTPS, so we avoid it here.
function deterministicRoll(str) {
  let hash = 0x811c9dc5 >>> 0;
  for (let i = 0; i < str.length; i++) {
    hash ^= str.charCodeAt(i);
    hash = Math.imul(hash, 0x01000193) >>> 0;
  }
  return (hash % 10000) / 10000;
}

async function assessScanRisk(email) {
  const n = email.trim().toLowerCase();
  const domain = n.split('@').pop();
  const breach = BREACHED_DOMAINS[domain];
  const boost = breach ? (SCAN_RISK_SEVERITY_BOOST[breach.severity] || 0) : 0;
  const roll = Math.min(1.0, deterministicRoll(n) + boost);
  if (roll < 0.35) return 'SAFE';
  if (roll < 0.55) return 'LOW';
  if (roll < 0.75) return 'MEDIUM';
  if (roll < 0.90) return 'HIGH';
  return 'CRITICAL';
}

async function assessDarkWebExposure(email) {
  const n = email.trim().toLowerCase();
  if (DARKWEB_KNOWN_EXPOSED_EMAILS.has(n)) return true;
  const domain = n.split('@').pop();
  const breach = BREACHED_DOMAINS[domain];
  const odds = breach ? (DARKWEB_SEVERITY_ODDS[breach.severity] || DARKWEB_BASELINE_ODDS) : DARKWEB_BASELINE_ODDS;
  return deterministicRoll(n) < odds;
}

// ─── initial state ───────────────────────────────────────────────────────────

const INITIAL = {
  email: '',
  clock: '',
  threatLevel: 'SAFE',
  // scan
  scanning: false,
  scanPhase: '',
  scanProgress: 0,
  scanResult: null,
  // breach
  checking: false,
  breachResult: null,
  // dark web
  darkWebLog: [
    { text: 'System initialized.', tag: 'info' },
    { text: 'Awaiting target email...', tag: 'dim' },
  ],
  // stats
  totalScans: 0,
  breachesFound: 0,
  darkwebAlerts: 0,
  safeEmails: 0,
  uptime: '0h 0m',
  // threat map
  threatDots: [],
  activeThreats: [],
  // network
  networkData: new Array(60).fill(0),
  networkBaseline: 50,
  networkAnomalies: 0,
  // logs
  logs: [
    { time: ts(), level: 'info',    message: 'ThreatHorizon initialized.' },
    { time: ts(), level: 'success', message: 'All monitoring systems online.' },
  ],
  // feed
  feedEntries: [],
  // soc counters
  highSevEvents: 0,
  correlatedBursts: 0,
  iocHits: 0,
  // report
  showReport: false,
  reportContent: '',
  // alert history kept in ref (mutable, not triggering renders)
};

// ─── reducer ─────────────────────────────────────────────────────────────────

function reducer(state, action) {
  switch (action.type) {
    case 'SET_EMAIL':          return { ...state, email: action.v };
    case 'SET_CLOCK':          return { ...state, clock: action.v };
    case 'SET_THREAT_LEVEL':   return { ...state, threatLevel: action.v };
    case 'SET_UPTIME':         return { ...state, uptime: action.v };

    case 'SCAN_START':         return { ...state, scanning: true,  scanResult: null, scanPhase: '', scanProgress: 0 };
    case 'SCAN_PHASE':         return { ...state, scanPhase: action.phase, scanProgress: action.pct };
    case 'SCAN_DONE':          return { ...state, scanning: false, scanResult: action.level, scanPhase: '', scanProgress: 0, totalScans: state.totalScans + 1 };

    case 'BREACH_START':       return { ...state, checking: true,  breachResult: null };
    case 'BREACH_DONE':        return {
      ...state, checking: false, breachResult: action.result,
      breachesFound: action.result?.found ? state.breachesFound + 1 : state.breachesFound,
      safeEmails:    action.result?.found ? state.safeEmails : state.safeEmails + 1,
      iocHits:       action.result?.found ? state.iocHits + 1 : state.iocHits,
    };

    case 'DW_LOG_RESET':       return { ...state, darkWebLog: action.entries };
    case 'DW_LOG_APPEND':      return { ...state, darkWebLog: [...state.darkWebLog, action.entry] };
    case 'DW_LOG_APPEND_MANY': return { ...state, darkWebLog: [...state.darkWebLog, ...action.entries] };
    case 'DW_FOUND':           return { ...state, darkwebAlerts: state.darkwebAlerts + 1, iocHits: state.iocHits + 1 };

    case 'ADD_LOG':            return { ...state, logs: [...state.logs.slice(-199), { time: ts(), level: action.level, message: action.msg }] };
    case 'CLEAR_LOG':          return { ...state, logs: [{ time: ts(), level: 'info', message: 'Log cleared.' }] };

    case 'ADD_THREAT_DOT':     return {
      ...state,
      threatDots:    [...state.threatDots.slice(-24),  action.dot],
      activeThreats: [...state.activeThreats.slice(-49), action.threat],
      highSevEvents: action.isHigh ? state.highSevEvents + 1 : state.highSevEvents,
    };
    case 'ADD_FEED_ENTRY':     return { ...state, feedEntries: [...state.feedEntries.slice(-49), action.entry] };

    case 'NETWORK_TICK':       return {
      ...state,
      networkData:     [...state.networkData.slice(-59), action.val],
      networkBaseline: action.baseline,
      networkAnomalies: action.anomaly ? state.networkAnomalies + 1 : state.networkAnomalies,
    };

    case 'CORR_BURST':         return { ...state, correlatedBursts: state.correlatedBursts + 1 };
    // SET_THREAT_LEVEL_CRITICAL is an alias kept for clarity
    case 'SET_THREAT_LEVEL_CRITICAL': return { ...state, threatLevel: 'CRITICAL' };

    case 'SHOW_REPORT':        return { ...state, showReport: true,  reportContent: action.content };
    case 'CLOSE_REPORT':       return { ...state, showReport: false };

    default: return state;
  }
}

// ─── context ─────────────────────────────────────────────────────────────────

const DashboardContext = createContext(null);
export const useDashboard = () => useContext(DashboardContext);

// ─── provider ────────────────────────────────────────────────────────────────

export function DashboardProvider({ children }) {
  const [state, dispatch] = useReducer(reducer, INITIAL);
  const alertHistoryRef = useRef([]);
  const startTimeRef    = useRef(Date.now());

  // ── add log helper ────────────────────────────────────────────────────
  const addLog = useCallback((msg, level = 'default') => {
    dispatch({ type: 'ADD_LOG', msg, level });
  }, []);

  // ── correlation ───────────────────────────────────────────────────────
  const correlate = useCallback((country, attack, now) => {
    const cutoff = now - CORRELATION_WINDOW_SEC;
    const recent = alertHistoryRef.current.filter(e => e.ts >= cutoff && e.country === country);
    if (recent.length >= CORRELATION_THRESHOLD) {
      const actors  = THREAT_ACTOR_MAP[country] || ['Unknown'];
      const actor   = randomChoice(actors);
      const attacks = [...new Set(recent.map(e => e.attack))].slice(0, 3).join(' / ');
      dispatch({ type: 'CORR_BURST' });
      addLog(`[CORR] Burst: ${recent.length} events from ${country} in ${CORRELATION_WINDOW_SEC}s — ${actor} / ${attacks}`, 'warn');
    }
  }, [addLog]);

  // ══════════════════════════════════════════════════════════════
  // ACTIONS
  // ══════════════════════════════════════════════════════════════

  const setEmail = useCallback(v => dispatch({ type: 'SET_EMAIL', v }), []);

  const handleScan = useCallback(async (email) => {
    if (!email || !email.includes('@')) { addLog('Enter a valid email.', 'error'); return; }

    dispatch({ type: 'SCAN_START' });
    addLog(`Initiating threat scan for: ${email}`, 'info');

    const phases = [
      'Scanning network interfaces...',
      'Analyzing packet signatures...',
      'Checking firewall rules...',
      'Inspecting open ports...',
      'Verifying SSL certificates...',
      'Cross-referencing threat databases...',
    ];

    for (let i = 0; i < phases.length; i++) {
      dispatch({ type: 'SCAN_PHASE', phase: phases[i], pct: ((i + 1) / phases.length) * 100 });
      addLog(phases[i], 'info');
      await new Promise(r => setTimeout(r, 600));
    }

    const level = await assessScanRisk(email);
    dispatch({ type: 'SCAN_DONE', level });
    dispatch({ type: 'SET_THREAT_LEVEL', v: level });

    if (level === 'HIGH' || level === 'CRITICAL') {
      addLog(`Threat scan complete: ${level} risk detected!`, 'error');
    } else {
      addLog(`Threat scan complete: ${level} — environment secure.`, 'success');
    }
  }, [addLog]);

  const handleBreach = useCallback(async (email) => {
    if (!email || !email.includes('@')) { addLog('Enter a valid email.', 'error'); return; }

    dispatch({ type: 'BREACH_START' });
    addLog(`Checking breaches for: ${email}`, 'info');
    await new Promise(r => setTimeout(r, 1500));

    const domain = email.split('@')[1].toLowerCase();
    if (BREACHED_DOMAINS[domain]) {
      const info    = BREACHED_DOMAINS[domain];
      const enrich  = BREACH_ENRICHMENT[domain] || {};
      const result  = {
        found: true,
        company:     info.company,
        year:        info.year,
        severity:    info.severity,
        records:     info.records,
        dataTypes:   enrich.data_types   || ['N/A'],
        mitigations: enrich.mitigations  || ['Change password immediately'],
      };
      dispatch({ type: 'BREACH_DONE', result });
      dispatch({ type: 'SET_THREAT_LEVEL', v: 'CRITICAL' });
      addLog(`BREACH DETECTED — ${info.company} (${info.year})`, 'error');
      addLog(`  Severity: ${info.severity} | Records: ${info.records}`, 'error');
    } else {
      dispatch({ type: 'BREACH_DONE', result: { found: false } });
      addLog(`No breach records found for ${email}.`, 'success');
    }
  }, [addLog]);

  const handleDarkWeb = useCallback(async (email) => {
    if (!email || !email.includes('@')) { addLog('Enter a valid email.', 'error'); return; }

    addLog(`Initiating dark web scan for: ${email}`, 'info');
    dispatch({ type: 'DW_LOG_RESET', entries: [
      { text: '━'.repeat(36), tag: 'dim' },
      { text: `Target: ${email}`, tag: 'info' },
    ]});

    const steps = [
      { text: 'Connecting to .onion relays...', delay: 900 },
      { text: 'Scanning paste sites...', delay: 700 },
      { text: 'Querying credential dumps...', delay: 700 },
      { text: 'Checking dark marketplaces...', delay: 500 },
      { text: 'Cross-referencing threat actor forums...', delay: 500 },
    ];

    for (const step of steps) {
      await new Promise(r => setTimeout(r, step.delay));
      dispatch({ type: 'DW_LOG_APPEND', entry: { text: step.text, tag: 'dim' } });
    }

    const found = await assessDarkWebExposure(email);
    if (found) {
      const source = randomChoice(DARKWEB_LEAK_SOURCES);
      const cats   = randomSample(DARKWEB_DATA_CATEGORIES, randomInt(2, 4));
      dispatch({ type: 'DW_FOUND' });
      dispatch({ type: 'SET_THREAT_LEVEL', v: 'CRITICAL' });
      dispatch({ type: 'DW_LOG_APPEND_MANY', entries: [
        { text: '', tag: 'dim' },
        { text: '!! CREDENTIALS FOUND!', tag: 'alert' },
        { text: `  Source    : ${source}`, tag: 'alert' },
        { text: `  Email     : ${email}`, tag: 'alert' },
        { text: `  Status    : EXPOSED`, tag: 'alert' },
        { text: `  Data found: ${cats.join(', ')}`, tag: 'warn' },
        { text: '  ── Recommended Actions ──────────────', tag: 'dim' },
        { text: '  1. Reset password for this account', tag: 'warn' },
        { text: '  2. Enable MFA immediately', tag: 'warn' },
        { text: '  3. Scan all accounts sharing this password', tag: 'warn' },
        { text: '  4. Alert affected users / helpdesk', tag: 'warn' },
        { text: '  5. Review session tokens & API keys', tag: 'warn' },
      ]});
      addLog(`Dark web exposure found: ${email}`, 'error');
    } else {
      dispatch({ type: 'DW_LOG_APPEND_MANY', entries: [
        { text: '', tag: 'dim' },
        { text: '[OK] No credentials found on dark web.', tag: 'safe' },
        { text: `  ${email} appears clean.`, tag: 'safe' },
        { text: '  Continue monitoring — exposure can change.', tag: 'dim' },
      ]});
      addLog(`Dark web scan clean for: ${email}`, 'success');
    }
  }, [addLog]);

  const handleReport = useCallback((email, state) => {
    if (!email || !email.includes('@')) { addLog('Enter a valid email.', 'error'); return; }
    const {
      threatLevel, totalScans, breachesFound, darkwebAlerts, safeEmails,
      iocHits, activeThreats, highSevEvents, correlatedBursts, networkAnomalies,
    } = state;
    const level   = threatLevel;
    const risk    = THREAT_LEVELS[level]?.risk || 0;
    const playbook = REMEDIATION_PLAYBOOKS[level] || REMEDIATION_PLAYBOOKS.SAFE;
    const sep     = '='.repeat(46);
    const sep2    = '-'.repeat(46);

    const countryCount = {};
    alertHistoryRef.current.forEach(e => { countryCount[e.country] = (countryCount[e.country] || 0) + 1; });
    const topCountries = Object.entries(countryCount).sort((a,b)=>b[1]-a[1]).slice(0,3)
      .map(([c,n])=>`${c}(${n})`).join(', ') || 'N/A';

    const attackCount = {};
    alertHistoryRef.current.forEach(e => { attackCount[e.attack] = (attackCount[e.attack] || 0) + 1; });
    const topAttacks = Object.entries(attackCount).sort((a,b)=>b[1]-a[1]).slice(0,3)
      .map(([a,n])=>`${a.slice(0,20)}(${n})`).join(', ') || 'N/A';

    const content = [
      sep,
      '  THREATHORIZON SOC INTELLIGENCE REPORT',
      `  ${new Date().toISOString().slice(0,19)} UTC`,
      `  Target Email         : ${email}`,
      sep, '',
      '  THREAT POSTURE', sep2,
      `  Current Threat Level : ${level}`,
      `  Risk Score           : ${risk}%`, '',
      '  SCAN STATISTICS', sep2,
      `  Total Scans Run      : ${totalScans}`,
      `  Breaches Detected    : ${breachesFound}`,
      `  Dark Web Alerts      : ${darkwebAlerts}`,
      `  Safe Emails          : ${safeEmails}`,
      `  IOC Hits             : ${iocHits}`, '',
      '  THREAT INTELLIGENCE', sep2,
      `  Active Threats       : ${activeThreats.length}`,
      `  High-Sev Events      : ${highSevEvents}`,
      `  Correlated Bursts    : ${correlatedBursts}`,
      `  Network Anomalies    : ${networkAnomalies}`,
      `  Top Source Countries : ${topCountries}`,
      `  Top Attack Types     : ${topAttacks}`, '',
      `  IR PLAYBOOK — ${level}`, sep2,
      ...playbook.map((s,i)=>`   ${i+1}. ${s}`), '',
      sep,
    ].join('\n');

    dispatch({ type: 'SHOW_REPORT', content });
    addLog('SOC intelligence report generated.', 'info');
  }, [addLog]);

  const closeReport  = useCallback(() => dispatch({ type: 'CLOSE_REPORT' }), []);
  const clearLog     = useCallback(() => dispatch({ type: 'CLEAR_LOG' }), []);

  // ══════════════════════════════════════════════════════════════
  // BACKGROUND TASKS
  // ══════════════════════════════════════════════════════════════

  // Clock
  useEffect(() => {
    const tick = () => dispatch({ type: 'SET_CLOCK', v: new Date().toUTCString().slice(17,25) + ' UTC' });
    tick();
    const id = setInterval(tick, 1000);
    return () => clearInterval(id);
  }, []);

  // Uptime
  useEffect(() => {
    const id = setInterval(() => {
      const s = Math.floor((Date.now() - startTimeRef.current) / 1000);
      dispatch({ type: 'SET_UPTIME', v: `${Math.floor(s/3600)}h ${Math.floor((s%3600)/60)}m` });
    }, 10000);
    return () => clearInterval(id);
  }, []);

  // Network baseline kept in a ref so we can read it without stale closure
  const networkBaselineRef = useRef(50);

  // Network activity
  useEffect(() => {
    const id = setInterval(() => {
      const val      = randomInt(5, 100);
      const alpha    = 0.05;
      const baseline = alpha * val + (1 - alpha) * networkBaselineRef.current;
      networkBaselineRef.current = baseline;
      const anomaly  = val >= baseline * 2.5 && val > 70;
      if (anomaly) addLog(`[NET] Traffic anomaly — spike: ${val} (EMA: ${baseline.toFixed(1)})`, 'warn');
      dispatch({ type: 'NETWORK_TICK', val, baseline, anomaly });
    }, 1000);
    return () => clearInterval(id);
  }, [addLog]);

  // Global threats
  useEffect(() => {
    let timer;
    const tick = () => {
      const countryName = randomChoice(Object.keys(THREAT_COUNTRIES));
      const attack      = randomChoice(ATTACK_TYPES);
      const info        = THREAT_COUNTRIES[countryName];
      const severity    = randomChoice(['LOW', 'MED', 'HIGH']);
      const colorMap    = { LOW: '#ffdd00', MED: '#ff8800', HIGH: '#ff3355' };

      const dot    = {
        lat:    info.lat + (Math.random() * 6 - 3),
        lon:    info.lon + (Math.random() * 6 - 3),
        label:  info.code,
        color:  colorMap[severity],
        radius: randomInt(5, 12),
      };
      const threat = { country: countryName, attack };

      dispatch({ type: 'ADD_THREAT_DOT', dot, threat, isHigh: severity === 'HIGH' });

      const mitre   = MITRE_ATTACK_MAP[attack] || {};
      const tid     = mitre.tid     || 'N/A';
      const kc      = KILL_CHAIN_MAP[attack]   || 'Unknown';
      const actors  = THREAT_ACTOR_MAP[countryName] || ['Unknown'];
      const actor   = randomChoice(actors);
      const cves    = ATTACK_CVE_MAP[attack]   || [];
      const cve     = cves.length ? randomChoice(cves) : 'No CVE ref.';

      const nowSec  = Date.now() / 1000;
      alertHistoryRef.current.push({ ts: nowSec, country: countryName, attack, severity });
      if (alertHistoryRef.current.length > 500) alertHistoryRef.current = alertHistoryRef.current.slice(-500);
      correlate(countryName, attack, nowSec);

      dispatch({ type: 'ADD_FEED_ENTRY', entry: {
        time: ts(), severity, country: countryName, attack, tid, killChain: kc, actor, cve,
      }});

      timer = setTimeout(tick, randomInt(3000, 7000));
    };
    timer = setTimeout(tick, 2000);
    return () => clearTimeout(timer);
  }, [correlate, addLog]);

  // ─── provide ──────────────────────────────────────────────────
  const value = {
    state,
    setEmail,
    handleScan,
    handleBreach,
    handleDarkWeb,
    handleReport,
    closeReport,
    clearLog,
    addLog,
  };

  return (
    <DashboardContext.Provider value={value}>
      {children}
    </DashboardContext.Provider>
  );
}
