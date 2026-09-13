import validator from 'validator';

// High-risk TLDs frequently abused in bulletproof hosting and phishing campaigns
const HIGH_RISK_TLDS = new Set([
  'tk', 'ml', 'ga', 'cf', 'gq', 'top', 'xyz', 'buzz', 'cam',
  'work', 'click', 'link', 'rest', 'country', 'bid', 'surf',
  'loan', 'fit', 'racing', 'download', 'win', 'vip', 'monster'
]);

// Medium-risk TLDs
const SUSPICIOUS_TLDS = new Set([
  'live', 'info', 'site', 'online', 'space', 'club', 'icu',
  'cyou', 'fun', 'agency', 'today', 'support', 'bar'
]);

// Highly targeted sensitive brand/auth keywords
const SENSITIVE_KEYWORDS = [
  'login', 'signin', 'sign-in', 'log-in', 'logon',
  'verify', 'verification', 'authenticate', 'authentication', 'auth',
  'secure', 'security', 'account', 'update', 'confirm', 'confirmation',
  'bank', 'banking', 'wallet', 'crypto', 'blockchain', 'recover',
  'credential', 'password', 'passcode', 'billing', 'invoice',
  'paypal', 'apple', 'microsoft', 'google', 'netflix', 'amazon',
  'chase', 'wellsfargo', 'citi', 'bankofamerica', 'hsbc', 'barclays',
  'support-desk', 'customer-service', 'portal', 'webscr'
];

/**
 * Normalizes and parses incoming URL string
 */
export const parseAndNormalizeUrl = (rawUrl) => {
  let trimmed = (rawUrl || '').trim();
  if (!trimmed.startsWith('http://') && !trimmed.startsWith('https://')) {
    trimmed = `https://${trimmed}`;
  }

  try {
    const parsed = new URL(trimmed);
    return {
      valid: true,
      url: parsed.href,
      protocol: parsed.protocol.replace(':', ''),
      hostname: parsed.hostname.toLowerCase(),
      port: parsed.port || (parsed.protocol === 'https:' ? '443' : '80'),
      pathname: parsed.pathname,
      search: parsed.search,
      hash: parsed.hash,
      origin: parsed.origin
    };
  } catch (error) {
    return {
      valid: false,
      error: error.message
    };
  }
};

/**
 * Analyzes lexical and structural heuristics of the URL
 */
export const analyzeHeuristics = (parsedUrl) => {
  const { url, hostname, pathname, search, protocol, port } = parsedUrl;
  const indicators = [];
  let score = 0;

  // 1. IP Address Hostname Detection
  const isIpv4 = validator.isIP(hostname, 4);
  const isIpv6 = validator.isIP(hostname, 6);
  if (isIpv4 || isIpv6) {
    score += 35;
    indicators.push({
      indicator: 'IP_HOSTNAME',
      title: 'Direct IP Address Hostname',
      description: `Hostname is a direct IP address (${hostname}) bypassing standard domain reputation services`,
      severity: 'CRITICAL',
      scorePenalty: 35
    });
  }

  // 2. URL Length Heuristic
  if (url.length > 100) {
    score += 15;
    indicators.push({
      indicator: 'EXCESSIVE_URL_LENGTH',
      title: 'Excessive URL Length',
      description: `URL length is ${url.length} characters (typical legitimate URLs are < 75 chars)`,
      severity: 'MEDIUM',
      scorePenalty: 15
    });
  } else if (url.length > 75) {
    score += 8;
    indicators.push({
      indicator: 'LONG_URL_LENGTH',
      title: 'Elevated URL Length',
      description: `URL length is ${url.length} characters`,
      severity: 'LOW',
      scorePenalty: 8
    });
  }

  // 3. Userinfo / @ Symbol Detection (Credential Obfuscation)
  if (url.includes('@')) {
    score += 35;
    indicators.push({
      indicator: 'AT_SYMBOL_SPOOF',
      title: 'Credential Obfuscation (@ Symbol)',
      description: 'URL contains "@" symbol, often used to conceal the real destination host behind fake user credentials',
      severity: 'CRITICAL',
      scorePenalty: 35
    });
  }

  // 4. Double Slash in Path (Open Redirect Heuristic)
  if (pathname.includes('//') || search.includes('//')) {
    score += 20;
    indicators.push({
      indicator: 'DOUBLE_SLASH_REDIRECT',
      title: 'Suspicious Path Delimiters (//)',
      description: 'Multiple consecutive slashes found in URL path/query indicative of an open-redirect exploit',
      severity: 'HIGH',
      scorePenalty: 20
    });
  }

  // 5. Hyphen and Subdomain Analysis
  const hostParts = hostname.split('.');
  const hyphenCount = (hostname.match(/-/g) || []).length;
  
  if (hyphenCount >= 3) {
    score += 20;
    indicators.push({
      indicator: 'EXCESSIVE_HYPHENS',
      title: 'High Hyphen Count in Domain',
      description: `Domain contains ${hyphenCount} hyphens, commonly observed in brand-squatting domains`,
      severity: 'HIGH',
      scorePenalty: 20
    });
  } else if (hyphenCount >= 2) {
    score += 10;
    indicators.push({
      indicator: 'SUSPECT_HYPHENS',
      title: 'Multiple Hyphens in Domain',
      description: `Domain contains ${hyphenCount} hyphens`,
      severity: 'MEDIUM',
      scorePenalty: 10
    });
  }

  // Subdomain Depth Check (e.g., login.verify.bank.evil.com)
  const subdomainCount = hostParts.length > 2 ? hostParts.length - 2 : 0;
  if (subdomainCount >= 3) {
    score += 20;
    indicators.push({
      indicator: 'DEEP_SUBDOMAINS',
      title: 'Excessive Subdomain Depth',
      description: `Hostname contains ${subdomainCount} subdomain levels, often used to disguise malicious destinations`,
      severity: 'HIGH',
      scorePenalty: 20
    });
  } else if (subdomainCount === 2) {
    score += 8;
    indicators.push({
      indicator: 'MULTI_SUBDOMAIN',
      title: 'Multiple Subdomains',
      description: `Hostname contains ${subdomainCount} subdomain levels`,
      severity: 'LOW',
      scorePenalty: 8
    });
  }

  // 6. Top-Level Domain (TLD) Risk Evaluation
  const tld = hostParts[hostParts.length - 1];
  if (HIGH_RISK_TLDS.has(tld)) {
    score += 25;
    indicators.push({
      indicator: 'HIGH_RISK_TLD',
      title: 'High-Risk Top-Level Domain (TLD)',
      description: `The .${tld} TLD has a statistically disproportionate rate of abuse and malicious infrastructure`,
      severity: 'HIGH',
      scorePenalty: 25
    });
  } else if (SUSPICIOUS_TLDS.has(tld)) {
    score += 12;
    indicators.push({
      indicator: 'SUSPICIOUS_TLD',
      title: 'Suspicious Top-Level Domain (TLD)',
      description: `The .${tld} TLD is frequently observed in spam and automated redirects`,
      severity: 'MEDIUM',
      scorePenalty: 12
    });
  }

  // 7. Sensitive Keywords Detection
  const lowerUrl = url.toLowerCase();
  const matchedKeywords = SENSITIVE_KEYWORDS.filter(kw => {
    // Check if keyword is in hostname, path or query
    return lowerUrl.includes(kw);
  });

  if (matchedKeywords.length >= 3) {
    score += 30;
    indicators.push({
      indicator: 'MULTIPLE_SENSITIVE_KEYWORDS',
      title: 'High Density of Sensitive Keywords',
      description: `URL features multiple high-value targets: [${matchedKeywords.slice(0, 5).join(', ')}]`,
      severity: 'CRITICAL',
      scorePenalty: 30
    });
  } else if (matchedKeywords.length > 0) {
    const penalty = matchedKeywords.length * 10;
    score += penalty;
    indicators.push({
      indicator: 'SENSITIVE_AUTH_KEYWORDS',
      title: 'Sensitive Security / Auth Keywords',
      description: `URL contains targeted terms: [${matchedKeywords.join(', ')}]`,
      severity: 'HIGH',
      scorePenalty: penalty
    });
  }

  // 8. Homograph / Punycode Detection (IDN spoofing)
  if (hostname.includes('xn--')) {
    score += 30;
    indicators.push({
      indicator: 'PUNYCODE_HOMOGRAPH',
      title: 'Punycode / Homograph Domain',
      description: `Punycode representation detected (${hostname}), typical of Unicode lookalike character attacks`,
      severity: 'CRITICAL',
      scorePenalty: 30
    });
  }

  // 9. Non-Standard Web Ports
  if (port && port !== '80' && port !== '443') {
    score += 15;
    indicators.push({
      indicator: 'NON_STANDARD_PORT',
      title: 'Non-Standard Web Port',
      description: `Target is hosted on non-standard port ${port}`,
      severity: 'MEDIUM',
      scorePenalty: 15
    });
  }

  // 10. Insecure Plaintext HTTP Protocol
  if (protocol === 'http') {
    score += 20;
    indicators.push({
      indicator: 'INSECURE_HTTP',
      title: 'Missing HTTPS Encryption',
      description: 'Domain operates without transport layer security (plaintext HTTP protocol)',
      severity: 'HIGH',
      scorePenalty: 20
    });
  }

  // Cap lexical score at 100
  const lexicalScore = Math.min(100, score);

  return {
    lexicalScore,
    indicators,
    features: {
      urlLength: url.length,
      hostnameLength: hostname.length,
      hyphenCount,
      subdomainCount,
      tld,
      matchedKeywords,
      isIp: isIpv4 || isIpv6,
      protocol,
      port
    }
  };
};
